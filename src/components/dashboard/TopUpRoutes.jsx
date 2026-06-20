const routeCards = [
  { title: "topUpRouteWalletTitle", text: "topUpRouteWalletText" },
  { title: "topUpRouteNetworkTitle", text: "topUpRouteNetworkText" },
  { title: "topUpRouteQuoteTitle", text: "topUpRouteQuoteText" },
];

export function TopUpRoutes({ t }) {
  return (
    <section className="marketPanel block" id="top-up-routes">
      <div className="blockHead"><h4>{t("topUpRoutes")}</h4><button>{t("auto")}</button></div>
      <p className="topUpRoutesText">{t("topUpRoutesText")}</p>
      <div className="topUpRouteCards">
        {routeCards.map(({ title, text }) => (
          <article key={title}>
            <strong>{t(title)}</strong>
            <p>{t(text)}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
