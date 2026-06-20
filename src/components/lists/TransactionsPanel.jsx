function amountClass(value) {
  return value >= 0 ? "pos" : "neg";
}

export function TransactionsPanel({ transactions }) {
  return (
    <section className="panel">
      <div className="panelHead"><h2>Recent Activity</h2><button className="linkBtn">History</button></div>
      <div className="txList">
        {transactions.map((tx) => (
          <article className="tx" key={tx.id}>
            <div><strong>{tx.title}</strong><span>{new Date(tx.created_at).toLocaleString()}</span></div>
            <p className={amountClass(tx.amount)}>{tx.amount >= 0 ? "+" : ""}${Math.abs(tx.amount).toFixed(2)}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
