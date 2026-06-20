const crypto = require("crypto");
const { get, run } = require("../db/init");

const supportedNetworks = new Set(["TRON", "EVM", "SOL"]);
const challengeTtlMs = 5 * 60 * 1000;
const sessionTtlMs = 30 * 24 * 60 * 60 * 1000;

function nowIso() {
  return new Date().toISOString();
}

function normalizeNetwork(network) {
  return String(network || "").trim().toUpperCase();
}

function normalizeAddress(address) {
  return String(address || "").trim();
}

function normalizeAddressForLookup(address) {
  return normalizeAddress(address).toLowerCase();
}

function createToken() {
  return crypto.randomBytes(32).toString("hex");
}

function assertWalletInput(network, address) {
  const normalizedNetwork = normalizeNetwork(network);
  const normalizedAddress = normalizeAddress(address);

  if (!supportedNetworks.has(normalizedNetwork)) {
    const error = new Error("Unsupported wallet network.");
    error.status = 400;
    throw error;
  }

  if (!normalizedAddress || normalizedAddress.length < 8) {
    const error = new Error("Wallet address is required.");
    error.status = 400;
    throw error;
  }

  return { address: normalizedAddress, network: normalizedNetwork };
}

async function createWalletChallenge({ address, network }) {
  const wallet = assertWalletInput(network, address);
  const id = crypto.randomUUID();
  const nonce = crypto.randomBytes(16).toString("hex");
  const expiresAt = new Date(Date.now() + challengeTtlMs).toISOString();
  const message = [
    "TRON x TRUST wallet login",
    "",
    `Network: ${wallet.network}`,
    `Address: ${wallet.address}`,
    `Nonce: ${nonce}`,
    "",
    "Sign this message to prove wallet ownership. This does not authorize a payment.",
  ].join("\n");

  await run(
    "INSERT INTO wallet_challenges (id, network, address, nonce, message, expires_at) VALUES (?, ?, ?, ?, ?, ?)",
    [id, wallet.network, wallet.address, nonce, message, expiresAt],
  );

  return { challengeId: id, expiresAt, message };
}

async function consumeChallenge({ address, challengeId, network, signature }) {
  const wallet = assertWalletInput(network, address);

  if (!challengeId || !signature) {
    const error = new Error("Signed challenge is required.");
    error.status = 400;
    throw error;
  }

  const challenge = await get("SELECT * FROM wallet_challenges WHERE id = ?", [challengeId]);
  if (!challenge) {
    const error = new Error("Challenge was not found.");
    error.status = 404;
    throw error;
  }

  const expired = new Date(challenge.expires_at).getTime() < Date.now();
  const addressMismatch = normalizeAddressForLookup(challenge.address) !== normalizeAddressForLookup(wallet.address);
  const networkMismatch = challenge.network !== wallet.network;

  if (challenge.used_at || expired || addressMismatch || networkMismatch) {
    const error = new Error("Challenge is no longer valid.");
    error.status = 400;
    throw error;
  }

  await run("UPDATE wallet_challenges SET used_at = ? WHERE id = ?", [nowIso(), challengeId]);

  return wallet;
}

async function createSession(accountId) {
  const id = crypto.randomUUID();
  const token = createToken();
  const createdAt = nowIso();
  const expiresAt = new Date(Date.now() + sessionTtlMs).toISOString();

  await run(
    "INSERT INTO sessions (id, account_id, token, created_at, expires_at) VALUES (?, ?, ?, ?, ?)",
    [id, accountId, token, createdAt, expiresAt],
  );

  return { expiresAt, token };
}

async function findWalletAccount(wallet) {
  return get(
    "SELECT account_id FROM account_wallets WHERE network = ? AND lower(address) = lower(?)",
    [wallet.network, wallet.address],
  );
}

async function issueCardAccount({ address, challengeId, network, provider, signature }) {
  const wallet = await consumeChallenge({ address, challengeId, network, signature });
  const existingWallet = await findWalletAccount(wallet);

  if (existingWallet) {
    const session = await createSession(existingWallet.account_id);
    return {
      account: { id: existingWallet.account_id, status: "inactive" },
      existing: true,
      session,
      wallet: { ...wallet, provider },
    };
  }

  const accountId = crypto.randomUUID();
  const walletId = crypto.randomUUID();
  const createdAt = nowIso();

  await run("INSERT INTO card_accounts (id, status, issue_fee_usd, created_at) VALUES (?, ?, ?, ?)", [
    accountId,
    "inactive",
    5,
    createdAt,
  ]);
  await run(
    "INSERT INTO account_wallets (id, account_id, network, address, provider, created_at) VALUES (?, ?, ?, ?, ?, ?)",
    [walletId, accountId, wallet.network, wallet.address, provider || null, createdAt],
  );

  const session = await createSession(accountId);

  return {
    account: { id: accountId, status: "inactive" },
    existing: false,
    session,
    wallet: { ...wallet, provider },
  };
}

async function signInWithWallet({ address, challengeId, network, provider, signature }) {
  const wallet = await consumeChallenge({ address, challengeId, network, signature });
  const existingWallet = await findWalletAccount(wallet);

  if (!existingWallet) {
    const error = new Error("No card account is linked to this wallet.");
    error.status = 404;
    throw error;
  }

  const session = await createSession(existingWallet.account_id);

  return {
    account: { id: existingWallet.account_id, status: "inactive" },
    session,
    wallet: { ...wallet, provider },
  };
}

module.exports = {
  createWalletChallenge,
  issueCardAccount,
  signInWithWallet,
};
