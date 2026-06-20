let tronWalletClient;

const trustWalletId = "4622a2b2d6af1c9844944291e5e7351a6aa24cd7b23099efac1b2fd875da31a0";
const dappIconUrl = "https://trust.pay-privacy.com/tron-trust-favicon.png";

export const walletNetworks = [
  {
    code: "TRON",
    label: "TRON",
    hint: "USDT TRC20 · Trust Wallet",
    icon: "/wallet-icons/trust-shield-cropped.png",
  },
];

function getWalletConnectProjectId() {
  return import.meta.env.VITE_WALLETCONNECT_PROJECT_ID || "";
}

function getDappIconUrl() {
  return dappIconUrl;
}

async function getTronWalletClient() {
  if (tronWalletClient) return tronWalletClient;

  const projectId = getWalletConnectProjectId();
  if (!projectId) {
    throw new Error("WalletConnect project id is not configured.");
  }

  const { WalletConnectChainID, WalletConnectWallet } = await import("@tronweb3/walletconnect-tron");

  tronWalletClient = new WalletConnectWallet({
    network: WalletConnectChainID.Mainnet,
    options: {
      relayUrl: "wss://relay.walletconnect.com",
      projectId,
      metadata: {
        name: "TRON x TRUST",
        description: "TRON x TRUST virtual crypto card",
        url: window.location.origin,
        icons: [getDappIconUrl()],
      },
    },
    themeMode: document.documentElement.dataset.theme === "dark" ? "dark" : "light",
    themeVariables: {
      "--w3m-z-index": 14000,
    },
    featuredWalletIds: [trustWalletId],
    includeWalletIds: [trustWalletId],
    allWallets: "HIDE",
  });

  return tronWalletClient;
}

function isMobileDevice() {
  if (navigator.userAgentData?.mobile) return true;
  return /Android|iPhone|iPad|iPod|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

function buildTrustWalletDeepLink(uri) {
  return `https://link.trustwallet.com/wc?uri=${encodeURIComponent(uri)}`;
}

export async function connectTronWallet({ resetSession = false } = {}) {
  if (resetSession) {
    await resetTronWalletSession();
  }

  const wallet = await getTronWalletClient();
  const connectOptions = isMobileDevice()
    ? {
        onUri: (uri) => {
          window.location.href = buildTrustWalletDeepLink(uri);
        },
      }
    : undefined;
  const { address } = await wallet.connect(connectOptions);
  if (!address) throw new Error("No TRON account was selected.");

  return { address, network: "TRON", provider: "Trust Wallet", signer: wallet };
}

export async function resetTronWalletSession() {
  if (tronWalletClient) {
    try {
      await tronWalletClient.appKit?.close?.();
      await tronWalletClient.disconnect();
    } catch {
      // A missing or already closed session is fine; the next connect will open a new proposal.
    }
  }
}

/** @deprecated Use connectTronWallet */
export async function connectWalletByNetwork(networkCode) {
  if (networkCode !== "TRON") {
    throw new Error("Only TRON network is supported.");
  }
  return connectTronWallet();
}

export async function signWalletMessage(wallet, message) {
  if (wallet.network !== "TRON") {
    throw new Error("Only TRON wallets are supported.");
  }

  const signer = wallet.signer || await getTronWalletClient();
  return signer.signMessage(message);
}
