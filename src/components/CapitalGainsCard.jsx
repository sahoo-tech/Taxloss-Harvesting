import { formatINR, gainClass } from "../utils/format";

/**
 * CapitalGainsCard
 * variant: "pre" | "post"
 * gains: { stcg: { profits, losses }, ltcg: { profits, losses } }
 * savings: number | null  (only used in post card)
 */
export default function CapitalGainsCard({ variant, gains, savings }) {
  const isPost = variant === "post";

  // Aggregate short-term + long-term into single totals
  const totalProfits = (gains?.stcg?.profits ?? 0) + (gains?.ltcg?.profits ?? 0);
  const totalLosses  = (gains?.stcg?.losses  ?? 0) + (gains?.ltcg?.losses  ?? 0);
  const netGains     = totalProfits - totalLosses;
  const realised     = netGains;

  const showSavings = isPost && savings !== null && savings > 0;

  const rowStyle = (value) =>
    isPost ? {} : { color: value < 0 ? "var(--red)" : value > 0 ? "var(--green)" : "var(--text-primary)" };

  return (
    <div className={`gains-card ${variant} fade-in`}>
      {/* Card Header */}
      <div className="card-header">
        <span className="card-title">
          {isPost ? "After Tax Loss Harvesting" : "Pre-Harvesting"}
        </span>
      </div>

      <div className="gains-divider" />

      {/* Profits */}
      <div className="gains-rows">
        <div className="gains-row">
          <span className="gains-row-label">Profits</span>
          <span className="gains-row-value" style={rowStyle(totalProfits)}>
            {formatINR(totalProfits)}
          </span>
        </div>

        {/* Losses */}
        <div className="gains-row">
          <span className="gains-row-label">Losses</span>
          <span className="gains-row-value" style={rowStyle(-totalLosses)}>
            -{formatINR(totalLosses)}
          </span>
        </div>
      </div>

      {/* Net Capital Gains */}
      <div className="gains-net-row">
        <span className="gains-net-label">Net Capital Gains</span>
        <span
          className="gains-net-value"
          style={isPost ? { color: "white" } : rowStyle(netGains)}
        >
          {formatINR(netGains)}
        </span>
      </div>

      {/* Realised Capital Gains */}
      <div className="realised-section">
        <p className="realised-label">REALISED CAPITAL GAINS</p>
        <p
          className={`realised-value ${!isPost ? gainClass(realised) : ""}`}
          style={isPost ? { color: "white" } : {}}
        >
          {formatINR(realised)}
        </p>
      </div>

      {/* Savings Banner (only on post card when savings exist) */}
      {showSavings && (
        <div className="savings-banner">
          <span className="savings-icon">🎉</span>
          <span className="savings-text">
            You&apos;re going to save{" "}
            <span className="savings-amount">{formatINR(savings)}</span>
          </span>
        </div>
      )}
    </div>
  );
}
