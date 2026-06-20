import { currencies } from "../../constants/currencies";
import { formatActivationAmount } from "../../constants/money";

export function MobileBalanceCard({ currency, setCurrency, t }) {
  const inactiveText = t("inactiveUntil").replace("{amount}", formatActivationAmount(currency));

  return (
    <section className="mobileBalanceCard">
      <div className="mobileBalanceTop">
        <span>{t("cardBalance")}</span>
        <div className="currencySwitch">
          {currencies.map((item) => (
            <button className={currency === item ? "active" : ""} key={item} onClick={() => setCurrency(item)}>{item}</button>
          ))}
        </div>
      </div>
      <div className="mobileBalanceMain">
        <strong>{currency}0.00</strong>
        <p>{inactiveText}</p>
      </div>
    </section>
  );
}
