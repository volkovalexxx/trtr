import { ArrowRight, Plus, WalletCards } from "lucide-react";
import { useState } from "react";
import { currencies } from "../constants/currencies";
import { activationAmountUsd } from "../constants/money";

const routes = {
  TRON: {
    assets: ["USDT", "TRX"],
    label: "Fast USDT TRC20 route",
    note: "Priority route for activation deposits and future cashback mechanics.",
  },
  EVM: {
    assets: ["USDT", "ETH", "BNB"],
    label: "Ethereum, BSC, and EVM wallets",
    note: "Prepared for users funding from common EVM wallets.",
  },
  SOL: {
    assets: ["USDC", "SOL"],
    label: "Solana wallet route",
    note: "Route for fast SOL or USDC funding support.",
  },
};

export function TopUpPage({ currency, openAddWalletModal, openTopUpModal, setCurrency, t }) {
  const [route, setRoute] = useState("TRON");
  const [asset, setAsset] = useState("USDT");
  const [amount, setAmount] = useState(String(activationAmountUsd));
  const routeConfig = routes[route];

  const selectRoute = (nextRoute) => {
    setRoute(nextRoute);
    setAsset(routes[nextRoute].assets[0]);
  };

  return (
    <div className="accountPage topUpPage">
      <section className="topUpGrid topUpGridSingle">
        <div className="topUpBuilder block">
          <div className="blockHead">
            <h4>{t("topUpBuilderTitle")}</h4>
            <button onClick={openAddWalletModal}>{t("add")}</button>
          </div>

          <div className="topUpWalletEmpty">
            <span><WalletCards size={22} /></span>
            <div>
              <strong>{t("topUpWalletEmptyTitle")}</strong>
              <p>{t("topUpWalletEmptyText")}</p>
            </div>
            <button onClick={openAddWalletModal} type="button"><Plus size={16} />{t("add")}</button>
          </div>

          <div className="topUpField">
            <label>{t("topUpRouteLabel")}</label>
            <div className="topUpRouteSwitch">
              {Object.keys(routes).map((item) => (
                <button className={route === item ? "active" : ""} key={item} onClick={() => selectRoute(item)} type="button">
                  {item}
                </button>
              ))}
            </div>
            <p>{routeConfig.label}</p>
          </div>

          <div className="topUpField">
            <label>{t("topUpAssetLabel")}</label>
            <div className="topUpAssetSwitch">
              {routeConfig.assets.map((item) => (
                <button className={asset === item ? "active" : ""} key={item} onClick={() => setAsset(item)} type="button">
                  {item}
                </button>
              ))}
            </div>
          </div>

          <div className="topUpField">
            <label>{t("topUpAmountLabel")}</label>
            <div className="topUpAmountBox">
              <div className="currencySwitch">
                {currencies.map((item) => (
                  <button className={currency === item ? "active" : ""} key={item} onClick={() => setCurrency(item)} type="button">{item}</button>
                ))}
              </div>
              <input inputMode="decimal" value={amount} onChange={(event) => setAmount(event.target.value)} />
            </div>
          </div>

          <button className="primary topUpSubmit" onClick={openTopUpModal} type="button">
            {t("continue")}
            <ArrowRight size={18} />
          </button>
        </div>
      </section>
    </div>
  );
}
