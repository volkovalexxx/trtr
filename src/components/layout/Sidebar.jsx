import { ArrowDownToLine, ArrowUpFromLine, Gauge, ListOrdered } from "lucide-react";

const navItems = [
  { page: "dashboard", icon: Gauge },
  { page: "transactions", icon: ListOrdered },
  { page: "topUp", icon: ArrowDownToLine },
  { page: "withdrawal", icon: ArrowUpFromLine },
];

export function Sidebar({ page, setPage, t }) {
  return (
    <aside className="sidebar">
      <div className="brandBlock">
        <img className="brandMark" src="/tron-coin-logo.webp" alt="TRON x TRUST" />
        <div>
          <h1>TRON x TRUST</h1>
        </div>
      </div>
      <nav>
        {navItems.map(({ page: itemPage, icon: Icon }) => (
          <button className={page === itemPage ? "active" : ""} key={itemPage} onClick={() => setPage(itemPage)}>
            <Icon size={18} />
            <span>{t(itemPage)}</span>
          </button>
        ))}
      </nav>
      <div className="sideFooter">
        <span>{t("cardStatus")}</span>
        <strong>{t("readyToIssue")}</strong>
      </div>
    </aside>
  );
}
