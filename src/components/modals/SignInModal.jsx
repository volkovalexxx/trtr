import { Check, KeyRound, Loader2, ShieldAlert, Wallet, X } from "lucide-react";
import { useState } from "react";
import frontCard from "../../assets/cards/front-card.png";
import { createWalletChallenge, signInWithWallet } from "../../services/apiClient";
import { formatWalletAddress } from "../../services/accountRegistry";
import { connectTronWallet, signWalletMessage } from "../../services/walletConnect";

export function SignInModal({ close, onSuccess, onRegister, t }) {
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [connectedWallet, setConnectedWallet] = useState(null);
  const [connectionError, setConnectionError] = useState("");

  const isRegistered = connectedWallet?.registered;

  const connectWallet = async () => {
    setConnectionError("");
    setLoading(true);
    let connectedCandidate = null;

    try {
      const wallet = await connectTronWallet();
      connectedCandidate = wallet;
      const challenge = await createWalletChallenge(wallet);
      const signature = await signWalletMessage(wallet, challenge.message);
      const authResult = await signInWithWallet({ challenge, signature, wallet });
      setConnectedWallet({
        ...wallet,
        authResult,
        registered: true,
      });
      setLoading(false);
      setStep(1);
    } catch (error) {
      setLoading(false);
      if (error.message === "No card account is linked to this wallet.") {
        setConnectedWallet({
          address: connectedCandidate?.address,
          network: "TRON",
          registered: false,
        });
        setStep(1);
        return;
      }
      setConnectionError(error.message || t("walletConnectErrorText"));
    }
  };

  const enterDashboard = () => {
    close();
    onSuccess(connectedWallet.authResult);
  };

  return (
    <div className="modalOverlay flowModalOverlay" onClick={close}>
      <section className="modal flowModal signInModal" onClick={(event) => event.stopPropagation()}>
        <button className="modalClose" onClick={close} aria-label="Close"><X size={18} /></button>
        <div className="flowSteps" aria-hidden="true">
          {[0, 1].map((item) => <span className={step >= item ? "active" : ""} key={item} />)}
        </div>

        {loading ? (
          <div className="flowLoader">
            <Loader2 className="spin" size={34} />
            <strong>{t("signInLoadingTitle")}</strong>
            <p>{t("signInLoadingText")}</p>
          </div>
        ) : (
          <>
            {step === 0 && (
              <div className="signInStepShell">
                <div className="signInHeroVisual" aria-hidden="true">
                  <img src={frontCard} alt="" />
                  <span><KeyRound size={18} /></span>
                </div>

                <div className="flowIntroBlock signInIntroBlock">
                  <span>{t("homeSignIn")}</span>
                  <h3>{t("signInFlowTitle")}</h3>
                  <p>{t("signInFlowText")}</p>
                </div>

                <div className="trustWalletBanner">
                  <img src="/wallet-icons/trust-shield-cropped.png" alt="" />
                  <div>
                    <strong>TRON · Trust Wallet</strong>
                    <span>{t("signInFlowHint")}</span>
                  </div>
                </div>

                {connectionError && <p className="walletConnectError">{connectionError}</p>}

                <button className="primary modalPrimaryAction issueWideAction" onClick={connectWallet} type="button">
                  {t("connectWallet")}
                </button>
              </div>
            )}

            {step === 1 && isRegistered && (
              <div className="flowSuccess signInResult">
                <span><Check size={28} /></span>
                <h3>{t("signInSuccessTitle")}</h3>
                <p>{t("signInSuccessText")}</p>
                <div className="connectedAccountBadge">
                  <Wallet size={17} />
                  <span>TRON / {formatWalletAddress(connectedWallet.address)}</span>
                </div>
                <button className="primary modalPrimaryAction issueWideAction" onClick={enterDashboard} type="button">
                  {t("signInGoDashboard")}
                </button>
              </div>
            )}

            {step === 1 && !isRegistered && (
              <div className="flowSuccess signInResult signInError">
                <span><ShieldAlert size={28} /></span>
                <h3>{t("signInMissingTitle")}</h3>
                <p>{t("signInMissingText")}</p>
                <div className="connectedAccountBadge error">
                  <Wallet size={17} />
                  <span>TRON / {formatWalletAddress(connectedWallet.address)}</span>
                </div>
                {onRegister && (
                  <button className="primary modalPrimaryAction issueWideAction" onClick={onRegister} type="button">
                    {t("homeIssueCard")}
                  </button>
                )}
                <button
                  className="flowModalSecondary"
                  onClick={() => {
                    setConnectedWallet(null);
                    setStep(0);
                  }}
                  type="button"
                >
                  {t("signInTryAnother")}
                </button>
              </div>
            )}
          </>
        )}
      </section>
    </div>
  );
}
