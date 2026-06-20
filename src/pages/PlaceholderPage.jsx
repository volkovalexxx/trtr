export function PlaceholderPage({ page, t }) {
  return (
    <section className="block formBlock">
      <h4>{t(page)}</h4>
      <p>{t("comingSoon")}</p>
    </section>
  );
}
