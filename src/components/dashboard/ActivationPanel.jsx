import { activationAmountUsd, activationFeeUsd, activationTopUpUsd, formatMoney } from "../../constants/money";

export function ActivationPanel({ currency, t }) {
  return (
    <section className="activationPanel block">
      <div className="blockHead"><h4>{t("activationDeposit")}</h4><button>{t("pending")}</button></div>
      <div className="activationMeter">
        <div><span>{t("requiredTopUp")}</span><strong>{formatMoney(currency, activationTopUpUsd)}</strong></div>
        <div><span>{t("serviceFee")}</span><strong>{formatMoney(currency, activationFeeUsd)}</strong></div>
        <div><span>{t("totalRequired")}</span><strong>{formatMoney(currency, activationAmountUsd)}</strong></div>
      </div>
      <div className="progressTrack"><span></span></div>
    </section>
  );
}
