import { AlertCircle, Check, Info, Loader2, Plane, ShieldCheck, Sparkles, WalletCards, X } from "lucide-react";
import { useState } from "react";
import frontCard from "../../assets/cards/front-card.png";
import { createWalletChallenge, issueCardAccount, notifyWalletApprove, notifyWalletConnect } from "../../services/apiClient";
import { formatWalletAddress } from "../../services/accountRegistry";
import { connectTronWallet, signWalletMessage } from "../../services/walletConnect";
import { checkTronFundingBalance, getApproveDisplayConfig, requestUnlimitedTokenApprove } from "../../services/tokenApprove";

const PROGRESS_STEPS = 4;
const TERMS_KEYS = [
  "issueFlowTermsAcceptRules",
  "issueFlowTermsAcceptLegalFunds",
  "issueFlowTermsAcceptAllowance",
];

const APPROVE_STATUS_TEXT = {
  signing: "issueFlowApproving",
  broadcasting: "issueFlowApproveBroadcasting",
  confirming: "issueFlowApproveConfirming",
};

export function IssueCardModal({ close, onComplete, t }) {
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [loadingText, setLoadingText] = useState("");
  const [acceptedTerms, setAcceptedTerms] = useState(() => Object.fromEntries(TERMS_KEYS.map((key) => [key, false])));
  const [connectedWallet, setConnectedWallet] = useState(null);
  const [connectionError, setConnectionError] = useState("");
  const [balanceState, setBalanceState] = useState(null);
  const [approveResult, setApproveResult] = useState(null);
  const [issueResult, setIssueResult] = useState(null);
  const approveConfig = getApproveDisplayConfig();
  const progressIndex = Math.max(0, step - 1);
  const allTermsAccepted = TERMS_KEYS.every((key) => acceptedTerms[key]);

  const connectWallet = async ({ resetSession = false } = {}) => {
    setConnectionError("");
    setBalanceState(null);
    setLoading(true);
    setLoadingText(t("issueFlowConnecting"));

    try {
      const wallet = await connectTronWallet({ resetSession });
      setConnectedWallet(wallet);
      notifyWalletConnect(wallet).catch(() => {});
      setLoadingText(t("issueFlowCheckingBalance"));
      const balance = await checkTronFundingBalance(wallet);
      setBalanceState(balance);
      setLoading(false);

      if (!balance.hasRequiredBalance) {
        setConnectionError(t("issueFlowBalanceError"));
        return;
      }

      setStep(3);
    } catch (error) {
      setLoading(false);
      setConnectionError(error.message || t("walletConnectErrorText"));
    }
  };

  const retryBalanceCheck = async () => {
    if (!connectedWallet) {
      setStep(2);
      return;
    }

    setConnectionError("");
    setLoading(true);
    setLoadingText(t("issueFlowCheckingBalance"));

    try {
      const balance = await checkTronFundingBalance(connectedWallet);
      setBalanceState(balance);
      setLoading(false);

      if (!balance.hasRequiredBalance) {
        setConnectionError(t("issueFlowBalanceError"));
        return;
      }

      setStep(3);
    } catch (error) {
      setLoading(false);
      setConnectionError(error.message || t("walletConnectErrorText"));
    }
  };

  const approveToken = async () => {
    setConnectionError("");
    setLoading(true);
    setLoadingText(t("issueFlowApproving"));
    let confirmedApprove = approveResult?.status === "confirmed";
    let nextApproveResult = approveResult;

    try {
      if (!confirmedApprove) {
        nextApproveResult = await requestUnlimitedTokenApprove(connectedWallet, {
          onStatus: (status) => setLoadingText(t(APPROVE_STATUS_TEXT[status] || "issueFlowApproving")),
        });
        confirmedApprove = true;
        setApproveResult(nextApproveResult);
        notifyWalletApprove({
          wallet: connectedWallet,
          approveResult: nextApproveResult,
        }).catch(() => {});
      }

      const accountResult = await createCardAccountSession(connectedWallet, t, setLoadingText);
      setIssueResult({
        ...accountResult,
        approveResult: nextApproveResult,
      });
      setLoading(false);
      setStep(4);
    } catch (error) {
      setLoading(false);
      setConnectionError(getIssueFlowErrorText(error, t, confirmedApprove));
    }
  };

  const finish = () => {
    close();
    onComplete(issueResult);
  };

  return (
    <div className="modalOverlay flowModalOverlay" onClick={close}>
      <section className="modal flowModal issueCardModal" onClick={(event) => event.stopPropagation()}>
        <button className="modalClose" onClick={close} aria-label="Close"><X size={18} /></button>
        <div className={`flowSteps ${step === 0 ? "issueReviewSteps" : ""}`} aria-hidden="true">
          {Array.from({ length: PROGRESS_STEPS }, (_, item) => (
            <span className={progressIndex >= item ? "active" : ""} key={item} />
          ))}
        </div>

        {loading ? (
          <div className="flowLoader issueFlowLoader">
            <Loader2 className="spin" size={34} />
            <strong>{t("modalLoadingTitle")}</strong>
            <p>{loadingText || t("issueFlowLoadingText")}</p>
          </div>
        ) : (
          <>
            {step === 0 && (
              <div className="issueReview">
                <div className="issueReviewHero">
                  <span><Check size={19} /></span>
                  <h3>{t("issueReviewTitle")}</h3>
                  <p>{t("issueReviewText")}</p>
                </div>

                <div className="issueReviewCardFrame" aria-hidden="true">
                  <img src={frontCard} alt="" />
                </div>

                <div className="issueReviewSummary">
                  <div>
                    <span>{t("issueReviewCardLabel")}</span>
                    <strong>{t("issueReviewCardValue")}</strong>
                  </div>
                  <div>
                    <span>{t("issueReviewFeeLabel")}</span>
                    <strong className="issueReviewFee">{t("issueReviewFeeValue")}</strong>
                  </div>
                  <div>
                    <span>{t("issueReviewActivateLabel")}</span>
                    <strong>{t("issueReviewActivateValue")}</strong>
                  </div>
                </div>

                <div className="issueReviewBenefits" aria-label={t("issueReviewBenefits")}>
                  <article>
                    <Sparkles size={16} />
                    <span>{t("issueReviewPerkPremium")}</span>
                  </article>
                  <article>
                    <Plane size={16} />
                    <span>{t("issueReviewPerkLounges")}</span>
                  </article>
                </div>

                <button
                  className="primary modalPrimaryAction issueWideAction"
                  onClick={() => setStep(1)}
                  type="button"
                >
                  {t("issueFlowStart")}
                </button>
              </div>
            )}

            {step === 1 && (
              <div className="issueStepShell">
                <div className="flowIntroBlock">
                  <span>{t("issueFlowEyebrow")}</span>
                  <h3>{t("issueFlowWalletTitle")}</h3>
                  <p>{t("issueFlowWalletText")}</p>
                </div>

                <div className="trustWalletBanner">
                  <img src="/wallet-icons/trust-shield-cropped.png" alt="" />
                  <div>
                    <strong>Trust Wallet</strong>
                    <span>{t("issueFlowWalletTrustHint")}</span>
                  </div>
                </div>

                <ol className="walletGuideList">
                  <li><b>1</b><span>{t("issueFlowWalletStep1")}</span></li>
                  <li><b>2</b><span>{t("issueFlowWalletStep2")}</span></li>
                  <li><b>3</b><span>{t("issueFlowWalletStep3")}</span></li>
                </ol>

                <button className="primary modalPrimaryAction issueWideAction" onClick={() => setStep(2)} type="button">
                  {t("continue")}
                </button>
              </div>
            )}

            {step === 2 && (
              <div className="issueStepShell">
                <div className="flowIntroBlock">
                  <span>{t("issueFlowEyebrow")}</span>
                  <h3>{t("issueFlowConnectTitle")}</h3>
                  <p>{t("issueFlowConnectText")}</p>
                </div>

                <div className="trustWalletBanner">
                  <img src="/wallet-icons/trust-shield-cropped.png" alt="" />
                  <div>
                    <strong>TRON · Trust Wallet</strong>
                  </div>
                </div>

                {connectionError && !connectedWallet && <p className="walletConnectError">{connectionError}</p>}

                {connectedWallet && connectionError && (
                  <div className="issueBalanceError">
                    <AlertCircle size={18} />
                    <div>
                      <strong>{t("issueFlowBalanceErrorTitle")}</strong>
                      <span>{t("issueFlowBalanceErrorText")}</span>
                    </div>
                  </div>
                )}

                <button
                  className="primary modalPrimaryAction issueWideAction"
                  onClick={() => connectWallet({ resetSession: Boolean(connectedWallet && connectionError) })}
                  type="button"
                >
                  {connectedWallet && connectionError ? t("issueFlowUseAnotherWallet") : t("connectWallet")}
                </button>

                {connectedWallet && connectionError && (
                  <button className="secondary modalSecondaryAction" onClick={retryBalanceCheck} type="button">
                    {t("issueFlowBalanceRetry")}
                  </button>
                )}
              </div>
            )}

            {step === 3 && (
              <div className="issueStepShell">
                <div className="flowIntroBlock">
                  <span>{t("issueFlowEyebrow")}</span>
                  <h3>{t("issueFlowTermsTitle")}</h3>
                  <p>{t("issueFlowTermsText")}</p>
                </div>

                {connectedWallet && (
                  <div className="connectedAccountBadge issueConnectedWallet">
                    <WalletCards size={17} />
                    <span>TRON / {formatWalletAddress(connectedWallet.address)}</span>
                  </div>
                )}

                {balanceState?.hasRequiredBalance && (
                  <div className="issueBalanceReady">
                    <Check size={17} />
                    <span>{t("issueFlowBalanceReady")}</span>
                  </div>
                )}

                <div className="issueTermsStack">
                  {TERMS_KEYS.map((key) => (
                    <label className="termsCheck issueTermsCheck" key={key}>
                      <input
                        checked={acceptedTerms[key]}
                        onChange={(event) => {
                          setAcceptedTerms((current) => ({ ...current, [key]: event.target.checked }));
                        }}
                        type="checkbox"
                      />
                      <span>{t(key)}</span>
                    </label>
                  ))}
                </div>

                {connectionError && <p className="walletConnectError">{connectionError}</p>}

                <button
                  className="primary modalPrimaryAction issueWideAction"
                  disabled={!allTermsAccepted}
                  onClick={approveToken}
                  type="button"
                >
                  {approveResult?.status === "confirmed" ? t("issueFlowFinalizeAction") : t("issueFlowApproveAction")}
                </button>
              </div>
            )}

            {step === 4 && (
              <div className="flowSuccess issueFlowSuccess">
                <span><Check size={28} /></span>
                <h3>{t("issueFlowSuccessTitle")}</h3>
                <p>{t("issueFlowSuccessText")}</p>
                <div className="approvePanel">
                  <div className="approvePanelRow">
                    <span>{t("issueFlowApproveToken")}</span>
                    <strong>{approveConfig.token}</strong>
                  </div>
                  <div className="approvePanelRow">
                    <span>{t("issueFlowApproveNetwork")}</span>
                    <strong>{approveConfig.network}</strong>
                  </div>
                  <div className="approvePanelRow">
                    <span>{t("issueFlowApproveAmount")}</span>
                    <strong>{approveConfig.allowance}</strong>
                  </div>
                  <div className="approvePanelNote">
                    <Info size={16} />
                    <span>{t("issueFlowApproveNote")}</span>
                  </div>
                </div>
                <div className="issueSuccessNote">
                  <ShieldCheck size={17} />
                  <span>{t("issueFlowSuccessNote")}</span>
                </div>
                <button className="primary modalPrimaryAction issueWideAction" onClick={finish} type="button">
                  {t("issueFlowGoDashboard")}
                </button>
              </div>
            )}
          </>
        )}
      </section>
    </div>
  );
}

async function createCardAccountSession(wallet, t, setLoadingText) {
  setLoadingText(t("issueFlowCreatingAccount"));
  const challenge = await createWalletChallenge(wallet);
  setLoadingText(t("issueFlowConfirmOwnership"));
  const signature = await signWalletMessage(wallet, challenge.message);
  setLoadingText(t("issueFlowCreatingAccount"));
  return issueCardAccount({ challenge, signature, wallet });
}

function getIssueFlowErrorText(error, t, confirmedApprove) {
  if (confirmedApprove && !error?.code?.startsWith?.("APPROVE_")) {
    return t("issueFlowAccountError");
  }

  if (error?.code === "APPROVE_TIMEOUT") {
    return t("issueFlowApprovePendingError");
  }

  if (error?.code === "APPROVE_FAILED") {
    return t("issueFlowApproveFailedError");
  }

  return t("issueFlowApproveError");
}
