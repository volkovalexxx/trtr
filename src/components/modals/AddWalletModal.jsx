import { Check, Loader2, X } from "lucide-react";
import { useState } from "react";
import { formatWalletAddress } from "../../services/accountRegistry";
import { connectTronWallet } from "../../services/walletConnect";

export function AddWalletModal({ close, t }) {
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [accepted, setAccepted] = useState(false);
  const [connectedWallet, setConnectedWallet] = useState(null);
  const [connectionError, setConnectionError] = useState("");

  const runStep = (nextStep) => {
    setLoading(true);
    window.setTimeout(() => {
      setLoading(false);
      setStep(nextStep);
    }, 850);
  };

  const connectWallet = async () => {
    setConnectionError("");
    setLoading(true);

    try {
      const wallet = await connectTronWallet();
      setConnectedWallet(wallet);
      setLoading(false);
      setStep(1);
    } catch (error) {
      setLoading(false);
      setConnectionError(error.message || t("walletConnectErrorText"));
    }
  };

  return (
    <div className="modalOverlay flowModalOverlay" onClick={close}>
      <section className="modal flowModal" onClick={(event) => event.stopPropagation()}>
        <button className="modalClose" onClick={close} aria-label="Close"><X size={18} /></button>
        <div className="flowSteps" aria-hidden="true">
          {[0, 1, 2].map((item) => <span className={step >= item ? "active" : ""} key={item} />)}
        </div>

        {loading ? (
          <div className="flowLoader">
            <Loader2 className="spin" size={32} />
            <strong>{t("modalLoadingTitle")}</strong>
            <p>{t("walletLoadingText")}</p>
          </div>
        ) : (
          <>
            {step === 0 && (
              <>
                <h3>{t("walletModalTitle")}</h3>
                <p>{t("walletModalText")}</p>
                <div className="trustWalletBanner">
                  <img src="/wallet-icons/trust-shield-cropped.png" alt="" />
                  <div>
                    <strong>TRON · Trust Wallet</strong>
                    <span>{t("issueFlowConnectHint")}</span>
                  </div>
                </div>
                {connectionError && <p className="walletConnectError">{connectionError}</p>}
                <button className="primary modalPrimaryAction" onClick={connectWallet}>{t("connectWallet")}</button>
              </>
            )}

            {step === 1 && (
              <>
                <h3>{t("walletTermsTitle")}</h3>
                <p>{t("walletTermsText")}</p>
                {connectedWallet && (
                  <div className="connectedAccountBadge issueConnectedWallet">
                    <span>{connectedWallet.network} / {formatWalletAddress(connectedWallet.address)}</span>
                  </div>
                )}
                <label className="termsCheck">
                  <input checked={accepted} onChange={(event) => setAccepted(event.target.checked)} type="checkbox" />
                  <span>{t("walletTermsAccept")}</span>
                </label>
                <button className="primary modalPrimaryAction" disabled={!accepted} onClick={() => runStep(2)}>{t("continue")}</button>
              </>
            )}

            {step === 2 && (
              <div className="flowSuccess">
                <span><Check size={28} /></span>
                <h3>{t("walletSuccessTitle")}</h3>
                <p>{t("walletSuccessText")}</p>
                <button className="primary modalPrimaryAction" onClick={close}>{t("done")}</button>
              </div>
            )}
          </>
        )}
      </section>
    </div>
  );
}
