export function IssueCardPanel({ className = "", t }) {
  return (
    <section className={`issuePanel block ${className}`.trim()}>
      <div className="issuePanelCopy">
        <p>{t("issueNewCard")}</p>
        <strong>{t("freezeFirst")}</strong>
        <span>{t("freezeRule")}</span>
      </div>
      <button className="primary" disabled>{t("unavailable")}</button>
    </section>
  );
}
