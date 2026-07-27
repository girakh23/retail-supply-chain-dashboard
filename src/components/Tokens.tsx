export function Tokens() {
  return (
    <style>{`
      .nl-root {
        --canvas: #F3F5FA;
        --panel: #FFFFFF;
        --panel-2: #F3F5FA;
        --panel-3: #EDF0F8;
        --border: #E6E9F2;
        --border-soft: #EEF1F8;
        --text: #1A2036;
        --muted: #6B7690;
        --muted-2: #98A2B8;
        --amber: #F5A524;
        --teal: #12B886;
        --violet: #7C5CFC;
        --blue: #3D7BFF;
        --rose: #FF5D8F;
        --danger: #F1494F;
        --good: #12B886;
        --shadow-card: 0 1px 2px rgba(30,41,79,0.04), 0 10px 28px -14px rgba(30,41,79,0.14);
        font-family: 'Inter', ui-sans-serif, system-ui, sans-serif;
        background: var(--canvas);
        color: var(--text);
      }
      .nl-display { font-family: 'Space Grotesk', 'Inter', sans-serif; letter-spacing: -0.01em; }
      .nl-mono { font-family: 'IBM Plex Mono', ui-monospace, monospace; }
      .nl-panel { background: var(--panel); border: 1px solid var(--border); border-radius: 16px; box-shadow: var(--shadow-card); }
      .nl-panel-2 { background: var(--panel-2); border: 1px solid var(--border); border-radius: 10px; }
      .nl-panel-3 { background: var(--panel-3); border: 1px solid var(--border-soft); border-radius: 10px; }
      .nl-scroll::-webkit-scrollbar { width: 6px; height: 6px; }
      .nl-scroll::-webkit-scrollbar-thumb { background: #D6DCEA; border-radius: 4px; }
      .nl-fade-in { animation: nl-fade 0.35s ease both; }
      @keyframes nl-fade { from { opacity: 0; transform: translateY(6px);} to { opacity:1; transform: translateY(0);} }
      a.nl-navlink { text-decoration: none; }
      .nl-hover-lift { transition: transform 0.15s ease, box-shadow 0.15s ease, border-color 0.15s ease; }
      .nl-hover-lift:hover { transform: translateY(-3px); box-shadow: 0 16px 32px -14px rgba(30,41,79,0.22); }
    `}</style>
  );
}

export function useGoogleFonts() {
  if (typeof document === "undefined") return;
  const id = "northline-fonts";
  if (document.getElementById(id)) return;
  const link = document.createElement("link");
  link.id = id;
  link.rel = "stylesheet";
  link.href =
    "https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=Inter:wght@400;500;600&family=IBM+Plex+Mono:wght@400;500&display=swap";
  document.head.appendChild(link);
}
