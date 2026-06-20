import { Bell, Languages, Moon, Sun, UserRound } from "lucide-react";
import { languages } from "../../i18n";

export function TopBar({ lang, page, openLanguageModal, setTheme, t, theme }) {
  return (
    <header className="headerRow">
      <div className="mobileBrand">
        <img className="brandMark" src="/tron-coin-logo.webp" alt="TRON x TRUST" />
        <div>
          <p>{t("walletOperations")}</p>
          <h2>{t(page)}</h2>
        </div>
      </div>
      <div className="desktopTitle">
        <p>{t("walletOperations")}</p>
        <h2>{t(page)}</h2>
      </div>
      <div className="headerActions">
        <button className="iconOnly" aria-label="Alerts"><Bell size={18} /></button>
        <button
          className="iconOnly"
          onClick={() => setTheme(theme === "light" ? "dark" : "light")}
          aria-label="Toggle theme"
        >
          {theme === "light" ? <Moon size={18} /> : <Sun size={18} />}
        </button>
        <button className="languageSwitch" onClick={openLanguageModal} type="button">
          <Languages size={17} />
          <span>{languages.find((item) => item.code === lang)?.label}</span>
        </button>
        <button className="avatar" aria-label="Profile"><UserRound size={18} /></button>
      </div>
    </header>
  );
}
