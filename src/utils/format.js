/**
 * formatINR – formats a number as Indian Rupees (₹)
 * toFixed(2) with compact notation for very large values
 */
export function formatINR(value) {
  if (value === null || value === undefined || isNaN(value)) return "₹0.00";

  const abs = Math.abs(value);
  let formatted;

  if (abs >= 1e7) {
    formatted = (value / 1e7).toFixed(2) + " Cr";
  } else if (abs >= 1e5) {
    formatted = (value / 1e5).toFixed(2) + " L";
  } else {
    formatted = new Intl.NumberFormat("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  }

  return `₹${formatted}`;
}

/**
 * formatNumber – compact display for holdings / balances
 */
export function formatNumber(value, decimals = 6) {
  if (value === null || value === undefined || isNaN(value)) return "0";
  const abs = Math.abs(value);

  // Extremely small scientific notation values
  if (abs > 0 && abs < 1e-6) return value.toExponential(3);

  return new Intl.NumberFormat("en-IN", {
    minimumFractionDigits: 0,
    maximumFractionDigits: decimals,
  }).format(value);
}

/**
 * gainClass – CSS class based on sign of gain value
 */
export function gainClass(value) {
  if (value > 0) return "positive";
  if (value < 0) return "negative";
  return "zero";
}

/**
 * gainSign – prefix + / - explicitly
 */
export function gainSign(value) {
  return value >= 0 ? "+" : "";
}
