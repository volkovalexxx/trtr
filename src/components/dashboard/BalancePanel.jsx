import { currencies } from "../../constants/currencies";
import { formatActivationAmount } from "../../constants/money";

export function BalancePanel({ currency, setCurrency, t }) {
  const inactiveText = t("inactiveUntil").replace("{amount}", formatActivationAmount(currency));

  return (
    <section className="statPanel desktopBalancePanel">
      <div className="desktopBalanceTop">
        <p>{t("cardBalance")}</p>
        <div className="currencySwitch desktopCurrencySwitch">
          {currencies.map((item) => (
            <button className={currency === item ? "active" : ""} key={item} onClick={() => setCurrency(item)}>{item}</button>
          ))}
        </div>
      </div>
      <strong>{currency}0.00</strong>
      <span>{inactiveText}</span>
      <div className="miniStats">
        <div><small>{t("activation")}</small><b>0%</b></div>
        <div><small>{t("required")}</small><b>{formatActivationAmount(currency)}</b></div>
      </div>
    </section>
  );
}
