import { useState, useEffect } from "react";
import { TX } from "../design/tokens";

function useIsMobile() {
  const [v, setV] = useState(() => window.innerWidth <= 480);
  useEffect(() => {
    const fn = () => setV(window.innerWidth <= 480);
    window.addEventListener("resize", fn);
    return () => window.removeEventListener("resize", fn);
  }, []);
  return v;
}

export default function PhoneShell({ children }) {
  const isMobile = useIsMobile();

  if (isMobile) {
    return (
      <div style={{
        position: "fixed", inset: 0,
        background: TX.bg,
        display: "flex", flexDirection: "column",
        overflow: "hidden",
        paddingTop: "env(safe-area-inset-top, 0px)",
        paddingBottom: "env(safe-area-inset-bottom, 0px)",
      }}>
        {children}
      </div>
    );
  }

  return (
    <div style={{
      width: 392, height: 800,
      background: "#16110d", borderRadius: 48, padding: 12,
      boxShadow: "0 30px 80px rgba(0,0,0,0.6), 0 0 0 1.5px rgba(0,0,0,0.5) inset, 0 1px 0 rgba(255,255,255,0.08) inset",
      flexShrink: 0,
    }}>
      <div style={{ width: "100%", height: "100%", borderRadius: 38, overflow: "hidden", position: "relative", background: TX.bg }}>
        {/* status bar */}
        <div style={{
          position: "absolute", top: 0, left: 0, right: 0, height: 38,
          display: "flex", alignItems: "flex-end", justifyContent: "space-between",
          padding: "0 24px 6px", zIndex: 30,
          font: "600 13px/1 -apple-system, system-ui", color: TX.ink, pointerEvents: "none",
        }}>
          <span>14:30</span>
          <div style={{ display: "flex", gap: 5, alignItems: "center", opacity: 0.85 }}>
            <svg width="15" height="10" viewBox="0 0 19 12">
              <rect x="0" y="7.5" width="3.2" height="4.5" rx="0.7" fill="currentColor"/>
              <rect x="4.8" y="5" width="3.2" height="7" rx="0.7" fill="currentColor"/>
              <rect x="9.6" y="2.5" width="3.2" height="9.5" rx="0.7" fill="currentColor"/>
              <rect x="14.4" y="0" width="3.2" height="12" rx="0.7" fill="currentColor"/>
            </svg>
            <svg width="20" height="10" viewBox="0 0 27 13">
              <rect x="0.5" y="0.5" width="23" height="12" rx="3.5" stroke="currentColor" strokeOpacity="0.5" fill="none"/>
              <rect x="2" y="2" width="17" height="9" rx="2" fill="currentColor"/>
            </svg>
          </div>
        </div>
        {/* notch */}
        <div style={{ position: "absolute", top: 8, left: "50%", transform: "translateX(-50%)", width: 110, height: 30, background: "#000", borderRadius: 999, zIndex: 40 }} />
        {/* content */}
        <div style={{ position: "absolute", top: 38, left: 0, right: 0, bottom: 0, overflow: "hidden", display: "flex", flexDirection: "column" }}>
          {children}
        </div>
        {/* home indicator */}
        <div style={{ position: "absolute", bottom: 6, left: "50%", transform: "translateX(-50%)", width: 130, height: 4, borderRadius: 2, background: "rgba(244,235,217,0.6)", zIndex: 30 }} />
      </div>
    </div>
  );
}
