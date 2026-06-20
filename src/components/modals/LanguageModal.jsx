import { Check, X } from "lucide-react";

export function LanguageModal({ close, languageOptions, lang, setLang }) {
  return (
    <div className="languageModalOverlay" onClick={close}>
      <section className="languageModal" onClick={(event) => event.stopPropagation()}>
        <div className="languageModalHead">
          <div>
            <span>Language</span>
            <h3>Select interface language</h3>
          </div>
          <button onClick={close} aria-label="Close"><X size={18} /></button>
        </div>
        <div className="languageList">
          {languageOptions.map((item) => (
            <button
              className={item.code === lang ? "selected" : ""}
              key={item.code}
              onClick={() => {
                setLang(item.code);
                setTimeout(close, 180);
              }}
              type="button"
            >
              <span>{item.name}</span>
              <small>{item.label}</small>
              {item.code === lang && <Check size={18} />}
            </button>
          ))}
        </div>
      </section>
    </div>
  );
}
