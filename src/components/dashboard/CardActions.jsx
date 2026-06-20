export function CardActions({ openInactiveActionModal, openPayModal, openTopUpModal, t }) {
  return (
    <div className="cardActions">
      <button className="primary" onClick={openTopUpModal}>{t("topUp")}</button>
      <button onClick={() => openInactiveActionModal("freeze")}>{t("freeze")}</button>
      <button onClick={() => openInactiveActionModal("details")}>{t("details")}</button>
      <button className="disabledPayAction" onClick={openPayModal}>{t("applePay")}</button>
      <button className="disabledPayAction" onClick={openPayModal}>{t("googlePay")}</button>
    </div>
  );
}
