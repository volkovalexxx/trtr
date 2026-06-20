export function formatWalletAddress(address) {
  const value = String(address || "");
  if (value.length <= 14) return value;
  return `${value.slice(0, 6)}...${value.slice(-4)}`;
}
