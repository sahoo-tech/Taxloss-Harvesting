import { useState, useEffect, useMemo } from "react";
import "./App.css";
import Header from "./components/Header";
import CapitalGainsCard from "./components/CapitalGainsCard";
import HoldingsTable from "./components/HoldingsTable";
import { fetchHoldings, fetchCapitalGains } from "./api/mockApi";
import { HowItWorksPopover, ImportantNotes } from "./components/InfoSections";

/* ─── Skeleton Card (loading state) ──────────────────────── */
function SkeletonCard() {
  return (
    <div className="skeleton-card">
      <div className="skeleton skeleton-line" style={{ width: "40%", height: 12 }} />
      <div style={{ height: 16 }} />
      <div className="skeleton skeleton-line" style={{ width: "100%", height: 14 }} />
      <div className="skeleton skeleton-line" style={{ width: "100%", height: 14 }} />
      <div className="skeleton skeleton-line" style={{ width: "80%",  height: 14 }} />
      <div style={{ height: 16 }} />
      <div className="skeleton skeleton-line" style={{ width: "100%", height: 14 }} />
      <div className="skeleton skeleton-line" style={{ width: "100%", height: 14 }} />
      <div className="skeleton skeleton-line" style={{ width: "80%",  height: 14 }} />
      <div style={{ height: 20 }} />
      <div className="skeleton skeleton-line" style={{ width: "55%",  height: 32 }} />
    </div>
  );
}

/* ─── Skeleton Table (loading state) ──────────────────────── */
function SkeletonTable() {
  return (
    <div className="table-wrapper" style={{ padding: "var(--space-5)" }}>
      {[...Array(6)].map((_, i) => (
        <div
          key={i}
          className="skeleton skeleton-line"
          style={{ width: "100%", height: 52, marginBottom: 10, borderRadius: 8 }}
        />
      ))}
    </div>
  );
}

/* ─── Helper: compute post-harvest gains ──────────────────── */
function computePostGains(baseGains, holdings, selectedIds) {
  // Start from the base API gains
  let stcgProfits = baseGains.stcg.profits;
  let stcgLosses  = baseGains.stcg.losses;
  let ltcgProfits = baseGains.ltcg.profits;
  let ltcgLosses  = baseGains.ltcg.losses;

  selectedIds.forEach((idx) => {
    const h = holdings[idx];
    if (!h) return;

    const stcgGain = h.stcg?.gain ?? 0;
    const ltcgGain = h.ltcg?.gain ?? 0;

    // Short-term
    if (stcgGain > 0) {
      stcgProfits += stcgGain;
    } else if (stcgGain < 0) {
      stcgLosses += Math.abs(stcgGain);
    }

    // Long-term
    if (ltcgGain > 0) {
      ltcgProfits += ltcgGain;
    } else if (ltcgGain < 0) {
      ltcgLosses += Math.abs(ltcgGain);
    }
  });

  return {
    stcg: { profits: stcgProfits, losses: stcgLosses },
    ltcg: { profits: ltcgProfits, losses: ltcgLosses },
  };
}

/* ─── Sort holdings: largest absolute gain first ─────────── */
function sortHoldings(holdings) {
  return [...holdings].sort((a, b) => {
    const gainA = Math.abs((a.stcg?.gain ?? 0) + (a.ltcg?.gain ?? 0));
    const gainB = Math.abs((b.stcg?.gain ?? 0) + (b.ltcg?.gain ?? 0));
    return gainB - gainA;
  });
}

/* ─── Main App ──────────────────────────────────────────── */
export default function App() {
  const [holdings, setHoldings]       = useState([]);
  const [baseGains, setBaseGains]     = useState(null);
  const [selectedIds, setSelectedIds] = useState(new Set());
  const [loading, setLoading]         = useState(true);
  const [error, setError]             = useState(null);

  // Fetch data on mount
  useEffect(() => {
    Promise.all([fetchHoldings(), fetchCapitalGains()])
      .then(([holdingsRes, gainsRes]) => {
        setHoldings(sortHoldings(holdingsRes));
        setBaseGains(gainsRes.capitalGains);
      })
      .catch((err) => {
        console.error(err);
        setError("Failed to load data. Please try again.");
      })
      .finally(() => setLoading(false));
  }, []);

  // Toggle single row
  const handleToggle = (idx) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      next.has(idx) ? next.delete(idx) : next.add(idx);
      return next;
    });
  };

  // Toggle all rows
  const handleToggleAll = (selectAll) => {
    if (selectAll) {
      setSelectedIds(new Set(holdings.map((_, i) => i)));
    } else {
      setSelectedIds(new Set());
    }
  };

  // Compute post-harvest gains whenever selection changes
  const postGains = useMemo(() => {
    if (!baseGains) return null;
    return computePostGains(baseGains, holdings, selectedIds);
  }, [baseGains, holdings, selectedIds]);

  // Compute savings
  const savings = useMemo(() => {
    if (!baseGains || !postGains) return null;
    const preRealised =
      (baseGains.stcg.profits - baseGains.stcg.losses) +
      (baseGains.ltcg.profits - baseGains.ltcg.losses);
    const postRealised =
      (postGains.stcg.profits - postGains.stcg.losses) +
      (postGains.ltcg.profits - postGains.ltcg.losses);
    const saved = preRealised - postRealised;
    return saved > 0 ? saved : null;
  }, [baseGains, postGains]);

  return (
    <div className="app">
      <Header />

      <main className="main-content">
        {/* Page Title + How it Works */}
        <div className="page-title-section fade-in">
          <div className="page-title-row">
            <h1 className="page-title">Tax Harvesting</h1>
            <HowItWorksPopover />
          </div>
          {/* Important Notes Accordion */}
          <ImportantNotes />
        </div>

        {/* Error State */}
        {error && (
          <div className="error-state">
            <p>⚠️ {error}</p>
          </div>
        )}

        {/* Capital Gains Cards */}
        {!error && (
          <div className="cards-grid">
            {loading ? (
              <>
                <SkeletonCard />
                <SkeletonCard />
              </>
            ) : (
              <>
                <CapitalGainsCard
                  variant="pre"
                  gains={baseGains}
                  savings={null}
                />
                <CapitalGainsCard
                  variant="post"
                  gains={postGains}
                  savings={savings}
                />
              </>
            )}
          </div>
        )}

        {/* Holdings Table */}
        {!error && (
          <section className="holdings-section">
            <div className="holdings-header">
              <div style={{ display: "flex", alignItems: "center", gap: "var(--space-3)" }}>
                <h2 className="holdings-title">Holdings</h2>
                {!loading && (
                  <span className="holdings-count">{holdings.length} assets</span>
                )}
              </div>
              {selectedIds.size > 0 && (
                <span className="holdings-selected-info">
                  {selectedIds.size} asset{selectedIds.size > 1 ? "s" : ""} selected for harvesting
                </span>
              )}
            </div>

            {loading ? (
              <SkeletonTable />
            ) : (
              <HoldingsTable
                holdings={holdings}
                selectedIds={selectedIds}
                onToggle={handleToggle}
                onToggleAll={handleToggleAll}
              />
            )}
          </section>
        )}
      </main>
    </div>
  );
}
