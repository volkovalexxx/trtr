export function ConnectedWallets({ className = "", onAddWallet, t }) {
  return (
    <section className={`block connectedWallets ${className}`.trim()}>
      <div className="blockHead"><h4>{t("connectedWallets")}</h4><button onClick={onAddWallet}>{t("add")}</button></div>
      <div className="walletsEmpty">
        <strong>{t("walletsEmptyTitle")}</strong>
        <p>{t("walletsEmptyText")}</p>
      </div>
    </section>
  );
}
