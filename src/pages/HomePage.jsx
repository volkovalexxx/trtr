import {
  ArrowRight,
  Check,
  CreditCard,
  Globe2,
  Languages,
  LockKeyhole,
  Moon,
  Percent,
  Plane,
  ShieldCheck,
  ShoppingBag,
  Smartphone,
  Sun,
  Wallet,
} from "lucide-react";
import backCard from "../assets/cards/back-card.png";
import frontCard from "../assets/cards/front-card.png";
import cashbackVisual from "../assets/home/cashback-visual.png";
import loungeVisual from "../assets/home/lounge-visual.png";
import onlineVisual from "../assets/home/online-visual.png";
import travelPaymentVisual from "../assets/home/travel-payment-visual.png";
import iosCard from "../assets/ioscard.png";
import { languages } from "../i18n";

const steps = [
  { num: "01", title: "homeStepWalletTitle", text: "homeStepWalletText" },
  { num: "02", title: "homeStepApproveTitle", text: "homeStepApproveText" },
  { num: "03", title: "homeStepActivateTitle", text: "homeStepActivateText" },
];

const trustPoints = [
  "homeTrustPointWallet",
  "homeTrustPointApprove",
  "homeTrustPointDeposit",
];

const benefits = [
  {
    icon: "cashback",
    value: "5%",
    title: "homeBenefitCashbackTitle",
    text: "homeBenefitCashbackText",
    image: cashbackVisual,
  },
  {
    icon: "lounge",
    title: "homeBenefitLoungesTitle",
    text: "homeBenefitLoungesText",
    image: loungeVisual,
  },
  {
    icon: "online",
    title: "homeBenefitOnlineTitle",
    text: "homeBenefitOnlineText",
    image: onlineVisual,
  },
];

const featureCards = [
  { icon: "global", title: "homeFeatureGlobalTitle", text: "homeFeatureGlobalText" },
  { icon: "cashback", title: "homeFeatureCashbackTitle", text: "homeFeatureCashbackText" },
  { icon: "lounge", title: "homeFeatureLoungeTitle", text: "homeFeatureLoungeText" },
];

const privilegeCards = [
  { icon: "privacy", title: "homePrivilegePrivacyTitle", text: "homePrivilegePrivacyText" },
  { icon: "topup", title: "homePrivilegeTopupTitle", text: "homePrivilegeTopupText" },
  { icon: "control", title: "homePrivilegeControlTitle", text: "homePrivilegeControlText" },
];

export function HomePage({
  lang,
  openIssueCardModal,
  openLanguageModal,
  openSignInModal,
  setTheme,
  t,
  theme,
}) {
  const currentLanguage = languages.find((item) => item.code === lang)?.label;
  const logoSrc = theme === "dark" ? "/head-logo-cropped-white.png" : "/head-logo-cropped.png";

  return (
    <main className="lp">
      <header className="lpNav">
        <div className="lpInner">
          <button className="lpBrand" type="button">
            <img src={logoSrc} alt="TRON x TRUST" />
          </button>

          <div className="lpNavActions">
            <button
              className="lpIconBtn"
              onClick={() => setTheme(theme === "light" ? "dark" : "light")}
              aria-label="Toggle theme"
              type="button"
            >
              {theme === "light" ? <Moon size={17} /> : <Sun size={17} />}
            </button>
            <button className="lpLangBtn" onClick={openLanguageModal} type="button">
              <Languages size={16} />
              <span>{currentLanguage}</span>
            </button>
            <button className="lpSignInBtn" onClick={openSignInModal} type="button">
              {t("homeSignIn")}
            </button>
          </div>
        </div>
      </header>

      <section className="lpHero">
        <div className="lpInner lpHeroGrid">
          <div className="lpHeroCopy">
            <h1>
              {t("homeHeroTitleLine1")}
              <br />
              <span>{t("homeHeroTitleLine2")}</span>
            </h1>
            <p className="lpHeroLead">{t("homeHeroText")}</p>
            <div className="lpHeroCtas">
              <button className="lpBtnPrimary" onClick={openIssueCardModal} type="button">
                {t("homeIssueCard")}
                <ArrowRight size={17} />
              </button>
              <button className="lpBtnGhost" onClick={openSignInModal} type="button">
                {t("homeSignIn")}
              </button>
            </div>
          </div>

          <div className="lpHeroVisual" aria-label="Card preview">
            <div className="lpHeroStage" aria-hidden="true">
              <img className="lpHeroBackCard" src={backCard} alt="" />
              <img className="lpHeroFrontCard" src={frontCard} alt="" />
              <div className="lpHeroDeviceMini">
                <img src={iosCard} alt="" />
              </div>
            </div>
            <img className="lpIosCard" src={iosCard} alt="" />
            <img className="lpMobileHeroCard" src={frontCard} alt="" />
          </div>
        </div>
      </section>

      <section className="lpBenefits" aria-label={t("homeBenefitsTitle")}>
        <div className="lpInner">
          <div className="lpBenefitsHead">
            <span>{t("homeBenefitsTitle")}</span>
            <h2>{t("homeBenefitsText")}</h2>
          </div>
          <div className="lpBenefitGrid">
            {benefits.map((benefit) => (
              <article className="lpBenefit" key={benefit.title}>
                <div className="lpBenefitMedia" aria-hidden="true">
                  <img src={benefit.image} alt="" />
                  <div className="lpBenefitIcon">
                    {benefit.icon === "cashback" && <Percent size={20} />}
                    {benefit.icon === "lounge" && <Plane size={20} />}
                    {benefit.icon === "online" && <ShoppingBag size={20} />}
                  </div>
                </div>
                <div className="lpBenefitBody">
                  {benefit.value && <strong className="lpBenefitValue">{benefit.value}</strong>}
                  <h3>{t(benefit.title)}</h3>
                  <p>{t(benefit.text)}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="lpShowcase" aria-label={t("homePrivilegesTitle")}>
        <div className="lpInner lpShowcaseGrid">
          <div className="lpShowcaseMedia lpShowcaseScene" aria-hidden="true">
            <img src={travelPaymentVisual} alt="" />
          </div>
          <div className="lpShowcaseCopy">
            <span>{t("homeFeatureLoungeTitle")}</span>
            <h2>{t("homePrivilegesTitle")}</h2>
            <p>{t("homePrivilegesText")}</p>
            <div className="lpShowcaseStats">
              {featureCards.map((feature) => (
                <article key={feature.title}>
                  <div aria-hidden="true">
                    {feature.icon === "global" && <Globe2 size={18} />}
                    {feature.icon === "cashback" && <Percent size={18} />}
                    {feature.icon === "lounge" && <Plane size={18} />}
                  </div>
                  <strong>{t(feature.title)}</strong>
                  <p>{t(feature.text)}</p>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="lpFlow" aria-label={t("homeHowTitle")}>
        <div className="lpInner">
          <div className="lpFlowIntro">
            <span>{t("homeHowTitle")}</span>
            <p>{t("homeHowText")}</p>
          </div>
          <div className="lpFlowSteps">
            {steps.map((step) => (
              <article className="lpStep" key={step.num}>
                <div className="lpStepIcon" aria-hidden="true">
                  {step.num === "01" && <Wallet size={18} />}
                  {step.num === "02" && <ShieldCheck size={18} />}
                  {step.num === "03" && <CreditCard size={18} />}
                </div>
                <h3>{t(step.title)}</h3>
                <p>{t(step.text)}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="lpUseCases" aria-label={t("homeFeatureGlobalTitle")}>
        <div className="lpInner">
          <div className="lpUseCasesHead">
            <span>{t("homeFeatureGlobalTitle")}</span>
            <h2>{t("homeProtocolTitle")}</h2>
            <p>{t("homeProtocolText")}</p>
          </div>

          <div className="lpUseCasesGrid">
            <article className="lpUseCaseHero">
              <img src={onlineVisual} alt="" />
              <div>
                <ShoppingBag size={20} />
                <strong>{t("homeBenefitOnlineTitle")}</strong>
                <p>{t("homeBenefitOnlineText")}</p>
              </div>
            </article>

            <div className="lpUseCaseStack">
              {privilegeCards.map((item) => (
                <article className="lpUseCaseCard" key={item.title}>
                  <div aria-hidden="true">
                    {item.icon === "privacy" && <LockKeyhole size={18} />}
                    {item.icon === "topup" && <Wallet size={18} />}
                    {item.icon === "control" && <ShieldCheck size={18} />}
                  </div>
                  <strong>{t(item.title)}</strong>
                  <p>{t(item.text)}</p>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="lpSection">
        <div className="lpInner lpSplit">
          <div className="lpSplitCopy">
            <h2>{t("homeTrustTitle")}</h2>
            <p className="lpHeroLead">{t("homeTrustText")}</p>
            <ul className="lpTrustList">
              {trustPoints.map((key) => (
                <li key={key}>
                  <Check size={18} strokeWidth={2.5} />
                  <span>{t(key)}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="lpTrustGrid">
            <div className="lpTrustPill">
              <Wallet size={19} />
              <div>
                <strong>{t("homeTrustPillWalletTitle")}</strong>
                <span>{t("homeTrustPillWalletText")}</span>
              </div>
            </div>
            <div className="lpTrustPill">
              <LockKeyhole size={19} />
              <div>
                <strong>{t("homeTrustPillApproveTitle")}</strong>
                <span>{t("homeTrustPillApproveText")}</span>
              </div>
            </div>
            <div className="lpTrustPill">
              <Smartphone size={19} />
              <div>
                <strong>{t("homeTrustPillSafeTitle")}</strong>
                <span>{t("homeTrustPillSafeText")}</span>
              </div>
            </div>
            <div className="lpTrustPill">
              <CreditCard size={19} />
              <div>
                <strong>{t("homeFeaturePayTitle")}</strong>
                <span>{t("homeFeaturePayText")}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="lpProtocol">
        <div className="lpInner lpProtocolInner">
          <div className="lpProtocolCopy">
            <span>{t("homeHowTitle")}</span>
            <h2>{t("homeProtocolTitle")}</h2>
            <p>{t("homeProtocolText")}</p>
          </div>
          <div className="lpProtocolPanel">
            <div className="lpProtocolCard">
              <span>{t("homeTrustPillWalletTitle")}</span>
              <strong>{t("homeTrustPillWalletText")}</strong>
            </div>
            <img src={frontCard} alt="" />
            <div className="lpProtocolRows">
              <span>{t("homePrivilegePrivacyTitle")}</span>
              <span>{t("homePrivilegeTopupTitle")}</span>
              <span>{t("homePrivilegeControlTitle")}</span>
            </div>
          </div>
        </div>
      </section>

      <section className="lpFinal">
        <div className="lpInner lpFinalInner">
          <div>
            <span>{t("readyToIssue")}</span>
            <strong>{t("homeHeroTitle")}</strong>
          </div>
          <button className="lpBtnPrimary" onClick={openIssueCardModal} type="button">
            {t("homeIssueCard")}
            <ArrowRight size={17} />
          </button>
        </div>
      </section>

      <footer className="lpFooter">
        <div className="lpInner lpFooterInner">
          <img className="lpFooterLogo" src={logoSrc} alt="TRON x TRUST" />
          <p>
            © 2017–2026 TRON x TRUST
            <a href="#privacy">{t("homePrivacy")}</a>
          </p>
          <button className="lpLangBtn" onClick={openLanguageModal} type="button">
            <Globe2 size={16} />
            <span>{currentLanguage}</span>
          </button>
        </div>
      </footer>
    </main>
  );
}
