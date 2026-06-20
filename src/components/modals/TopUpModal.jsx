import { Check, Loader2, Plus, X } from "lucide-react";
import { useMemo, useState } from "react";

const wallets = [
  { id: "tron", network: "TRON", address: "TQ8s...91kA", asset: "USDT TRC20" },
  { id: "evm", network: "EVM", address: "0x48...4832", asset: "ETH / BSC" },
  { id: "sol", network: "SOL", address: "7sJ9...mP2q", asset: "Solana" },
];

const assetsByNetwork = {
  TRON: ["USDT", "TRX"],
  EVM: ["USDT", "ETH", "BNB"],
  SOL: ["SOL", "USDC"],
};

const cryptoRates = {
  USDT: 1,
  USDC: 1,
  TRX: 0.12,
  ETH: 3500,
  BNB: 620,
  SOL: 150,
};

const fiatSymbols = ["$", "€", "£"];

export function TopUpModal({ close, t }) {
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [wallet, setWallet] = useState(wallets[0]);
  const [network, setNetwork] = useState("TRON");
  const [asset, setAsset] = useState("USDT");
  const [fiat, setFiat] = useState("$");
  const [amount, setAmount] = useState("105");

  const cryptoAmount = useMemo(() => {
    const numericAmount = Number(amount || 0);
    const rate = cryptoRates[asset] || 1;
    return numericAmount > 0 ? (numericAmount / rate).toFixed(asset === "USDT" || asset === "USDC" ? 2 : 6) : "0.00";
  }, [amount, asset]);

  const runStep = (nextStep) => {
    setLoading(true);
    window.setTimeout(() => {
      setLoading(false);
      setStep(nextStep);
    }, 850);
  };

  const selectNetwork = (nextNetwork) => {
    setNetwork(nextNetwork);
    setAsset(assetsByNetwork[nextNetwork][0]);
  };

  return (
    <div className="modalOverlay flowModalOverlay" onClick={close}>
      <section className="modal flowModal" onClick={(event) => event.stopPropagation()}>
        <button className="modalClose" onClick={close} aria-label="Close"><X size={18} /></button>
        <div className="flowSteps" aria-hidden="true">
          {[0, 1, 2, 3].map((item) => <span className={step >= item ? "active" : ""} key={item} />)}
        </div>

        {loading ? (
          <div className="flowLoader">
            <Loader2 className="spin" size={32} />
            <strong>{t("modalLoadingTitle")}</strong>
            <p>{t("modalLoadingText")}</p>
          </div>
        ) : (
          <>
            {step === 0 && (
              <>
                <h3>{t("topUpModalTitle")}</h3>
                <p>{t("topUpModalWalletText")}</p>
                <div className="flowChoiceList">
                  {wallets.map((item) => (
                    <button className={wallet.id === item.id ? "active" : ""} key={item.id} onClick={() => setWallet(item)}>
                      <span><b>{item.network}</b><small>{item.asset}</small></span>
                      <strong>{item.address}</strong>
                    </button>
                  ))}
                  <button className="flowDashed" onClick={() => selectNetwork("TRON")}>
                    <Plus size={17} />
                    {t("addNewWallet")}
                  </button>
                </div>
                <button className="primary modalPrimaryAction" onClick={() => runStep(1)}>{t("continue")}</button>
              </>
            )}

            {step === 1 && (
              <>
                <h3>{t("topUpModalAssetTitle")}</h3>
                <p>{t("topUpModalAssetText")}</p>
                <div className="flowSegment">
                  {Object.keys(assetsByNetwork).map((item) => (
                    <button className={network === item ? "active" : ""} key={item} onClick={() => selectNetwork(item)}>{item}</button>
                  ))}
                </div>
                <div className="flowSegment soft">
                  {assetsByNetwork[network].map((item) => (
                    <button className={asset === item ? "active" : ""} key={item} onClick={() => setAsset(item)}>{item}</button>
                  ))}
                </div>
                <button className="primary modalPrimaryAction" onClick={() => runStep(2)}>{t("continue")}</button>
              </>
            )}

            {step === 2 && (
              <>
                <h3>{t("topUpModalAmountTitle")}</h3>
                <p>{t("topUpModalAmountText")}</p>
                <div className="amountInput">
                  <select value={fiat} onChange={(event) => setFiat(event.target.value)}>
                    {fiatSymbols.map((item) => <option key={item}>{item}</option>)}
                  </select>
                  <input value={amount} onChange={(event) => setAmount(event.target.value)} inputMode="decimal" />
                </div>
                <div className="quoteBox">
                  <span>{t("estimatedCharge")}</span>
                  <strong>{cryptoAmount} {asset}</strong>
                  <small>{wallet.network} · {wallet.address}</small>
                </div>
                <button className="primary modalPrimaryAction" onClick={() => runStep(3)}>{t("confirmTopUp")}</button>
              </>
            )}

            {step === 3 && (
              <div className="flowSuccess">
                <span><Check size={28} /></span>
                <h3>{t("topUpSuccessTitle")}</h3>
                <p>{t("topUpSuccessText")}</p>
                <button className="primary modalPrimaryAction" onClick={close}>{t("done")}</button>
              </div>
            )}
          </>
        )}
      </section>
    </div>
  );
}
