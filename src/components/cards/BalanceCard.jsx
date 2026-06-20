export function BalanceCard({ balance }) {
  return (
    <section className="balanceCard">
      <p className="label">Total Balance</p>
      <p className="amount">${balance.totalUsd.toFixed(2)}</p>
      <p className="sub">≈ {balance.totalTrx.toFixed(2)} TRX</p>
      <div className="stats">
        <div><span>24h</span><strong>+{balance.dailyChangePct}%</strong></div>
        <div><span>PNL</span><strong>${balance.pnlUsd >= 0 ? "+" : ""}{balance.pnlUsd.toFixed(2)}</strong></div>
      </div>
    </section>
  );
}
