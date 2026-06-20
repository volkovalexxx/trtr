import { LockKeyhole, Search, SlidersHorizontal } from "lucide-react";

export function TransactionsPage({ t }) {
  return (
    <LockedFeaturePage
      t={t}
      variant="transactions"
    />
  );
}

export function WithdrawalPage({ t }) {
  return (
    <LockedFeaturePage
      t={t}
      variant="withdrawal"
    />
  );
}

function LockedFeaturePage({ t, variant }) {
  return (
    <div className="accountPage lockedFeaturePage">
      <section className={`lockedPreview block ${variant === "transactions" ? "lockedTransactionsPreview" : "lockedWithdrawalPreview"}`}>
        <div className="lockedPreviewContent">
          {variant === "transactions" ? (
            <div className="lockedTransactionsTable">
              <div className="transactionsToolbar">
                <label>
                  <Search size={18} />
                  <input placeholder="Search transactions" readOnly />
                </label>
                <button type="button"><SlidersHorizontal size={17} />Filters</button>
                <button type="button">All types</button>
                <button type="button">Date range</button>
              </div>
              <div className="transactionsTableShell">
                <table>
                  <thead>
                    <tr>
                      <th>Transaction</th>
                      <th>Type</th>
                      <th>Network</th>
                      <th>Status</th>
                      <th>Amount</th>
                      <th>Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="transactionsEmptyRow">
                      <td colSpan="6">No transactions yet</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className="withdrawalExchangeForm">
              <div className="exchangeAmountPanel">
                <span>You send</span>
                <div>
                  <input placeholder="0.00" readOnly />
                  <button type="button">Choose currency</button>
                </div>
              </div>
              <div className="exchangeRouteGrid">
                <label>
                  <span>Network</span>
                  <button type="button">Choose network</button>
                </label>
                <label>
                  <span>Coin</span>
                  <button type="button">Choose coin</button>
                </label>
              </div>
              <label className="exchangeAddressField">
                <span>Destination wallet</span>
                <input placeholder="Select network first" readOnly />
              </label>
              <button className="exchangePreviewButton" type="button">Preview withdrawal</button>
            </div>
          )}
        </div>
        <div className="lockedOverlay">
          <span><LockKeyhole size={20} /></span>
          <strong>{t("unavailable")}</strong>
          <p>{t("lockedFeatureRequirement")}</p>
        </div>
      </section>
    </div>
  );
}
