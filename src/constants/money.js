export const activationAmountUsd = 105;
export const activationTopUpUsd = 100;
export const activationFeeUsd = 5;

export const currencyRates = {
  "$": 1,
  "€": 97 / 105,
  "£": 82 / 105,
};

export function formatMoney(currency, usdAmount) {
  const value = usdAmount * (currencyRates[currency] || 1);
  return `${currency}${Math.round(value)}`;
}

export function formatActivationAmount(currency) {
  return formatMoney(currency, activationAmountUsd);
}
