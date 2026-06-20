import { useEffect, useState } from "react";
import { Sidebar } from "./components/layout/Sidebar";
import { TopBar } from "./components/layout/TopBar";
import { AddWalletModal } from "./components/modals/AddWalletModal";
import { InactivePayModal } from "./components/modals/InactivePayModal";
import { IssueCardModal } from "./components/modals/IssueCardModal";
import { LanguageModal } from "./components/modals/LanguageModal";
import { SignInModal } from "./components/modals/SignInModal";
import { TopUpModal } from "./components/modals/TopUpModal";
import { useDashboard } from "./hooks/useDashboard";
import { languages, translate } from "./i18n";
import { DashboardPage } from "./pages/DashboardPage";
import { HomePage } from "./pages/HomePage";
import { TransactionsPage, WithdrawalPage } from "./pages/LockedFeaturePage";
import { TopUpPage } from "./pages/TopUpPage";

const pageRoutes = {
  home: "/",
  dashboard: "/dashboard",
  transactions: "/transactions",
  topUp: "/top-up",
  withdrawal: "/withdrawal",
};

const routePages = {
  ...Object.fromEntries(Object.entries(pageRoutes).map(([page, route]) => [route, page])),
  "/transfer": "topUp",
};

const protectedPages = new Set(["dashboard", "transactions", "topUp", "withdrawal"]);

function getPageFromPath() {
  return routePages[window.location.pathname] || "home";
}

function App() {
  const [page, setPageState] = useState(() => (protectedPages.has(getPageFromPath()) ? "home" : getPageFromPath()));
  const [lang, setLang] = useState("en");
  const [currency, setCurrency] = useState("$");
  const [payModal, setPayModal] = useState(false);
  const [topUpModal, setTopUpModal] = useState(false);
  const [addWalletModal, setAddWalletModal] = useState(false);
  const [inactiveActionModal, setInactiveActionModal] = useState(null);
  const [issueCardModal, setIssueCardModal] = useState(false);
  const [signInModal, setSignInModal] = useState(false);
  const [authSession, setAuthSession] = useState(null);
  const [cardFlipped, setCardFlipped] = useState(false);
  const [languageModal, setLanguageModal] = useState(false);
  const [theme, setTheme] = useState("light");
  const { data, loading } = useDashboard();
  const t = (key) => translate(lang, key);
  const authenticated = Boolean(authSession?.token);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
  }, [theme]);

  useEffect(() => {
    if (protectedPages.has(getPageFromPath())) {
      window.history.replaceState(null, "", "/");
    }
  }, []);

  useEffect(() => {
    const handlePopState = () => {
      const nextPage = getPageFromPath();
      if (protectedPages.has(nextPage) && !authenticated) {
        setPageState("home");
        window.history.replaceState(null, "", "/");
        return;
      }

      setPageState(nextPage);
    };
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, [authenticated]);

  const setPage = (nextPage) => {
    if (protectedPages.has(nextPage) && !authenticated) {
      setPageState("home");
      if (window.location.pathname !== "/") {
        window.history.pushState(null, "", "/");
      }
      return;
    }

    const route = pageRoutes[nextPage] || "/";
    setPageState(nextPage);
    if (window.location.pathname !== route) {
      window.history.pushState(null, "", route);
    }
  };

  const enterAuthenticatedDashboard = (authResult) => {
    setAuthSession(authResult?.session || null);
    setPageState("dashboard");
    if (window.location.pathname !== pageRoutes.dashboard) {
      window.history.pushState(null, "", pageRoutes.dashboard);
    }
  };

  const handleTopUpModalAction = () => {
    setInactiveActionModal(null);
    requestAnimationFrame(() => {
      document.getElementById("top-up-routes")?.scrollIntoView({ behavior: "smooth", block: "center" });
    });
  };

  const languageModalNode = languageModal && (
    <LanguageModal
      close={() => setLanguageModal(false)}
      languageOptions={languages}
      lang={lang}
      setLang={setLang}
    />
  );

  if (page === "home") {
    return (
      <>
        <HomePage
          lang={lang}
          openIssueCardModal={() => setIssueCardModal(true)}
          openLanguageModal={() => setLanguageModal(true)}
          openSignInModal={() => setSignInModal(true)}
          setPage={setPage}
          setTheme={setTheme}
          t={t}
          theme={theme}
        />
        {issueCardModal && (
          <IssueCardModal
            close={() => setIssueCardModal(false)}
            onComplete={enterAuthenticatedDashboard}
            t={t}
          />
        )}
        {signInModal && (
          <SignInModal
            close={() => setSignInModal(false)}
            onRegister={() => {
              setSignInModal(false);
              setIssueCardModal(true);
            }}
            onSuccess={enterAuthenticatedDashboard}
            t={t}
          />
        )}
        {languageModalNode}
      </>
    );
  }

  if (loading || !data) return <main className="shell"><p>Loading dashboard...</p></main>;

  return (
    <main className="shell">
      <Sidebar page={page} setPage={setPage} t={t} />
      <section className="content">
        <TopBar
          lang={lang}
          page={page}
          openLanguageModal={() => setLanguageModal(true)}
          setTheme={setTheme}
          t={t}
          theme={theme}
        />
        {page === "dashboard" && (
          <DashboardPage
            cardFlipped={cardFlipped}
            currency={currency}
            data={data}
            openAddWalletModal={() => setAddWalletModal(true)}
            openInactiveActionModal={setInactiveActionModal}
            openPayModal={() => setPayModal(true)}
            openTopUpModal={() => setTopUpModal(true)}
            setCardFlipped={setCardFlipped}
            setCurrency={setCurrency}
            t={t}
          />
        )}
        {page === "topUp" && (
          <TopUpPage
            currency={currency}
            openAddWalletModal={() => setAddWalletModal(true)}
            openTopUpModal={() => setTopUpModal(true)}
            setCurrency={setCurrency}
            t={t}
          />
        )}
        {page === "transactions" && <TransactionsPage currency={currency} onTopUp={() => setTopUpModal(true)} t={t} />}
        {page === "withdrawal" && <WithdrawalPage currency={currency} onTopUp={() => setTopUpModal(true)} t={t} />}
      </section>
      {payModal && <InactivePayModal close={() => setPayModal(false)} t={t} />}
      {topUpModal && <TopUpModal close={() => setTopUpModal(false)} t={t} />}
      {addWalletModal && <AddWalletModal close={() => setAddWalletModal(false)} t={t} />}
      {inactiveActionModal && (
        <InactivePayModal
          close={() => setInactiveActionModal(null)}
          primaryLabel={t("topUp")}
          onPrimary={handleTopUpModalAction}
          text={inactiveActionModal === "freeze" ? t("inactiveFreezeText") : t("inactiveDetailsText")}
          title={t("inactiveActionTitle")}
          t={t}
        />
      )}
      {languageModalNode}
    </main>
  );
}

export default App;
