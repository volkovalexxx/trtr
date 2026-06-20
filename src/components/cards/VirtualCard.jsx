import { LockKeyhole } from "lucide-react";
import frontCard from "../../assets/cards/front-card.png";
import backCard from "../../assets/cards/back-card.png";

export function VirtualCard({ flipped, inactive, labels, onToggle }) {
  return (
    <div className={`virtualCardWrap ${inactive ? "inactive" : ""}`}>
      <button
        className={`virtualCard ${flipped ? "isFlipped" : ""}`}
        onClick={onToggle}
        type="button"
      >
        <div className="virtualCardFace cardFrontImage">
          <img className="cardArtwork" src={frontCard} alt="" draggable="false" />
          <div className="cardData cardNumberSlot">4821 **** **** 4832</div>
          <div className="cardData cardHolderSlot">
            <small>{labels.cardHolder}</small>
            <strong>ANONIM USER</strong>
          </div>
          <div className="cardData cardExpirySlot">
            <small>{labels.expires}</small>
            <strong>12/30</strong>
          </div>
        </div>

        <div className="virtualCardFace cardBackImage">
          <img className="cardArtwork" src={backCard} alt="" draggable="false" />
          <div className="cardData signatureSlot">ANONIM USER</div>
          <div className="cardData cvcSlot">***</div>
        </div>
      </button>

      {inactive && (
        <div className="inactiveOverlay">
          <LockKeyhole className="inactiveOverlayIcon" size={18} strokeWidth={2.4} aria-hidden="true" />
          <strong>{labels.cardLocked}</strong>
        </div>
      )}
    </div>
  );
}
