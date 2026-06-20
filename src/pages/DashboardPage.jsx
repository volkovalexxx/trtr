import { VirtualCard } from "../components/cards/VirtualCard";
import { ActivationPanel } from "../components/dashboard/ActivationPanel";
import { BalancePanel } from "../components/dashboard/BalancePanel";
import { CardActions } from "../components/dashboard/CardActions";
import { ConnectedWallets } from "../components/dashboard/ConnectedWallets";
import { IssueCardPanel } from "../components/dashboard/IssueCardPanel";
import { MobileBalanceCard } from "../components/dashboard/MobileBalanceCard";
import { TopUpRoutes } from "../components/dashboard/TopUpRoutes";
import { TransactionsPreview } from "../components/dashboard/TransactionsPreview";

export function DashboardPage({
  cardFlipped,
  currency,
  data,
  openAddWalletModal,
  openInactiveActionModal,
  openPayModal,
  openTopUpModal,
  setCardFlipped,
  setCurrency,
  t,
}) {
  return (
    <div className="dashboardGrid">
      <section className="cardColumn">
        <div className="cardSlot">
          <VirtualCard
            flipped={cardFlipped}
            inactive
            onToggle={() => setCardFlipped((value) => !value)}
            labels={{
              inactive: t("inactive"),
              cardHolder: t("cardHolder"),
              expires: t("expires"),
              cardLocked: t("cardLocked"),
              lockedText: t("lockedText"),
            }}
          />
        </div>
        <MobileBalanceCard currency={currency} setCurrency={setCurrency} t={t} />
        <CardActions
          openInactiveActionModal={openInactiveActionModal}
          openPayModal={openPayModal}
          openTopUpModal={openTopUpModal}
          t={t}
        />
        <BalancePanel currency={currency} setCurrency={setCurrency} t={t} />
        <ConnectedWallets className="responsiveWallets" onAddWallet={openAddWalletModal} t={t} />
      </section>

      <section className="centerColumn">
        <ActivationPanel currency={currency} t={t} />
        <TopUpRoutes t={t} />
        <TransactionsPreview transactions={data.transactions} t={t} />
        <IssueCardPanel className="responsiveIssuePanel" t={t} />
      </section>

      <section className="rightColumn">
        <ConnectedWallets className="desktopOnlyPanel" onAddWallet={openAddWalletModal} t={t} />
        <IssueCardPanel className="desktopOnlyPanel" t={t} />
      </section>
    </div>
  );
}
