import { X } from "lucide-react";

export function InactivePayModal({ close, onPrimary, primaryLabel, text, title, t }) {
  const hasPrimaryAction = Boolean(onPrimary || primaryLabel);

  return (
    <div className="modalOverlay" onClick={close}>
      <section className="modal" onClick={(event) => event.stopPropagation()}>
        <button className="modalClose" onClick={close} aria-label="Close"><X size={18} /></button>
        <h3>{title || t("inactivePayTitle")}</h3>
        <p>{text || t("inactivePayText")}</p>
        {hasPrimaryAction && (
          <button className="primary modalPrimaryAction" onClick={onPrimary || close}>{primaryLabel}</button>
        )}
      </section>
    </div>
  );
}
