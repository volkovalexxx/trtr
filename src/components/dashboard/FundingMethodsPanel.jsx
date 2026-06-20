const methods = [
  { title: "USDT TRC20", detail: "Recommended", value: "$105 min" },
  { title: "EVM Wallets", detail: "ETH / BSC", value: "Multi-chain" },
  { title: "Solana", detail: "SOL / USDC", value: "Coming soon" },
];

export function FundingMethodsPanel({ t }) {
  return (
    <section className="fundingMethods block">
      <div className="blockHead"><h4>Funding methods</h4><button>{t("seeAll")}</button></div>
      {methods.map((method) => (
        <article key={method.title}>
          <span>{method.title} <small>{method.detail}</small></span>
          <b>{method.value}</b>
        </article>
      ))}
    </section>
  );
}
