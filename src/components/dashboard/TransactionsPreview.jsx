export function TransactionsPreview({ transactions, t }) {
  const transactionTitleKey = {
    "Deposit confirmed": "txDepositConfirmed",
    "Card purchase": "txCardPurchase",
  };

  return (
    <section className="transactions block">
      <div className="blockHead"><h4>{t("transactions")}</h4><button>{t("showAll")}</button></div>
      <div className="transactionsEmpty">
        <div>
          <strong>{t("transactionsEmptyTitle")}</strong>
        </div>
      </div>
      <div className="transactionsGhost" aria-hidden="true">
        {transactions.slice(0, 2).map((tx) => (
          <article key={tx.id}>
            <span>{t(transactionTitleKey[tx.title]) || tx.title}</span>
            <small>{new Date(tx.created_at).toLocaleDateString()}</small>
            <b className={tx.amount >= 0 ? "pos" : "neg"}>{tx.amount >= 0 ? "+" : "-"}${Math.abs(tx.amount).toFixed(2)}</b>
          </article>
        ))}
      </div>
    </section>
  );
}
