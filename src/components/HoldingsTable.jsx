import { useRef, useEffect, useState } from "react";
import { formatINR, formatNumber, gainClass } from "../utils/format";

function AssetLogo({ logo, coin }) {
  const [imgError, setImgError] = useState(false);

  if (imgError || !logo) {
    return (
      <div className="asset-logo-fallback">
        {coin?.slice(0, 2).toUpperCase() || "??"}
      </div>
    );
  }

  return (
    <img
      src={logo}
      alt={coin}
      className="asset-logo"
      onError={() => setImgError(true)}
    />
  );
}

function GainCell({ gain, balance, isPost }) {
  const cls = gainClass(gain);
  const sign = gain >= 0 ? "+" : "";
  const isZero = gain === 0 && balance === 0;

  if (isZero) {
    return (
      <div className="gain-cell">
        <span className="gain-amount" style={{ color: "var(--text-muted)" }}>—</span>
      </div>
    );
  }

  return (
    <div className="gain-cell">
      <span className={`gain-badge ${cls}`}>
        {sign}{formatINR(gain)}
      </span>
      <span className="gain-balance">{formatNumber(balance)} coins</span>
    </div>
  );
}

/**
 * HoldingsTable
 * holdings     – array of holding objects from API
 * selectedIds  – Set of selected row indices
 * onToggle     – fn(index) toggle one row
 * onToggleAll  – fn(allSelected: bool)
 */
export default function HoldingsTable({
  holdings,
  selectedIds,
  onToggle,
  onToggleAll,
}) {
  const headerCheckRef = useRef(null);

  const allSelected = holdings.length > 0 && selectedIds.size === holdings.length;
  const someSelected = selectedIds.size > 0 && selectedIds.size < holdings.length;

  // handle indeterminate state
  useEffect(() => {
    if (headerCheckRef.current) {
      headerCheckRef.current.indeterminate = someSelected;
    }
  }, [someSelected]);

  const handleHeaderCheck = (e) => {
    onToggleAll(e.target.checked);
  };

  if (!holdings || holdings.length === 0) {
    return (
      <div className="table-wrapper">
        <p className="table-empty">No holdings found.</p>
      </div>
    );
  }

  return (
    <div className="table-wrapper">
      <div className="table-scroll">
        <table>
          <thead>
            <tr>
              <th className="checkbox-cell">
                <input
                  ref={headerCheckRef}
                  type="checkbox"
                  className="custom-checkbox"
                  checked={allSelected}
                  onChange={handleHeaderCheck}
                  id="select-all-checkbox"
                  aria-label="Select all holdings"
                />
              </th>
              <th>Asset</th>
              <th>Holdings &amp; Avg Buy Price</th>
              <th>Current Price</th>
              <th>Short-Term Gain</th>
              <th>Long-Term Gain</th>
              <th>Amount to Sell</th>
            </tr>
          </thead>
          <tbody>
            {holdings.map((h, idx) => {
              const isSelected = selectedIds.has(idx);
              return (
                <tr
                  key={`${h.coin}-${idx}`}
                  className={isSelected ? "selected" : ""}
                  onClick={() => onToggle(idx)}
                  style={{ cursor: "pointer" }}
                >
                  {/* Checkbox */}
                  <td className="checkbox-cell" onClick={(e) => e.stopPropagation()}>
                    <input
                      type="checkbox"
                      className="custom-checkbox"
                      checked={isSelected}
                      onChange={() => onToggle(idx)}
                      id={`checkbox-${idx}`}
                      aria-label={`Select ${h.coin}`}
                    />
                  </td>

                  {/* Asset */}
                  <td>
                    <div className="asset-cell">
                      <AssetLogo logo={h.logo} coin={h.coin} />
                      <div>
                        <div className="asset-name">{h.coin}</div>
                        <div className="asset-fullname" title={h.coinName}>
                          {h.coinName}
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Holdings & Avg Buy Price */}
                  <td>
                    <div className="holdings-cell">
                      <span className="holdings-amount">
                        {formatNumber(h.totalHolding)} {h.coin}
                      </span>
                      <span className="holdings-avg">
                        Avg: {formatINR(h.averageBuyPrice)}
                      </span>
                    </div>
                  </td>

                  {/* Current Price */}
                  <td>
                    <span className="price-value">{formatINR(h.currentPrice)}</span>
                  </td>

                  {/* Short-Term Gain */}
                  <td>
                    <GainCell gain={h.stcg?.gain ?? 0} balance={h.stcg?.balance ?? 0} />
                  </td>

                  {/* Long-Term Gain */}
                  <td>
                    <GainCell gain={h.ltcg?.gain ?? 0} balance={h.ltcg?.balance ?? 0} />
                  </td>

                  {/* Amount to Sell */}
                  <td>
                    {isSelected ? (
                      <span className="amount-sell">
                        {formatNumber(h.totalHolding)} {h.coin}
                      </span>
                    ) : (
                      <span className="amount-sell empty">—</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
