import { formatINR, gainClass } from "../utils/format";

function GainRow({ label, value, isPost }) {
  const cls = gainClass(value);
  return (
    <div className="gains-row">
      <span className="gains-row-label">{label}</span>
      <span
        className={`gains-row-value ${isPost ? "" : cls}`}
      >
        {formatINR(value)}
      </span>
    </div>
  );
}

function NetRow({ label, value, isPost }) {
  const cls = gainClass(value);
  return (
    <div className="gains-net-row">
      <span className="gains-net-label">{label}</span>
      <span
        className={`gains-net-value ${isPost ? "" : cls}`}
        style={isPost ? { color: "white" } : {}}
      >
        {formatINR(value)}
      </span>
    </div>
  );
}

/**
 * CapitalGainsCard
 * variant: "pre" | "post"
 * gains: { stcg: { profits, losses }, ltcg: { profits, losses } }
 * savings: number | null  (only used in post card)
 */
export default function CapitalGainsCard({ variant, gains, savings }) {
  const isPost = variant === "post";

  const stcgNet = (gains?.stcg?.profits ?? 0) - (gains?.stcg?.losses ?? 0);
  const ltcgNet = (gains?.ltcg?.profits ?? 0) - (gains?.ltcg?.losses ?? 0);
  const realised = stcgNet + ltcgNet;

  const showSavings = isPost && savings !== null && savings > 0;

  return (
    <div className={`gains-card ${variant} fade-in`}>
      {/* Card Header */}
      <div className="card-header">
        <span className="card-title">
          {isPost ? "After Tax Loss Harvesting" : "Pre-Harvesting"}
        </span>
        <div className="card-icon">
          {isPost ? "💎" : "📊"}
        </div>
      </div>

      <div className="gains-divider" />

      {/* Short-Term Capital Gains */}
      <p className="gains-section-label">Short-Term Capital Gains</p>
      <div className="gains-rows">
        <GainRow
          label="Profits"
          value={gains?.stcg?.profits ?? 0}
          isPost={isPost}
        />
        <GainRow
          label="Losses"
          value={-(gains?.stcg?.losses ?? 0)}
          isPost={isPost}
        />
      </div>
      <NetRow
        label="Short-Term Net Gains"
        value={stcgNet}
        isPost={isPost}
      />

      {/* Long-Term Capital Gains */}
      <p className="gains-section-label" style={{ marginTop: "var(--space-4)" }}>
        Long-Term Capital Gains
      </p>
      <div className="gains-rows">
        <GainRow
          label="Profits"
          value={gains?.ltcg?.profits ?? 0}
          isPost={isPost}
        />
        <GainRow
          label="Losses"
          value={-(gains?.ltcg?.losses ?? 0)}
          isPost={isPost}
        />
      </div>
      <NetRow
        label="Long-Term Net Gains"
        value={ltcgNet}
        isPost={isPost}
      />

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

      {/* Savings Banner (only on post card) */}
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
