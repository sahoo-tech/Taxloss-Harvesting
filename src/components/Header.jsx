export default function Header({ theme, toggleTheme }) {
  return (
    <header className="header">
      <div className="header-inner">
        <a className="logo" href="#">
          <div className="logo-mark">K</div>
          <span className="logo-text">KoinX</span>
        </a>
        <div style={{ display: "flex", alignItems: "center", gap: "var(--space-4)" }}>
          <span className="header-badge">Tax Loss Harvesting</span>
          <button 
            className="theme-toggle" 
            onClick={toggleTheme}
            aria-label="Toggle theme"
          >
            {theme === "dark" ? "☀️" : "🌙"}
          </button>
        </div>
      </div>
    </header>
  );
}
