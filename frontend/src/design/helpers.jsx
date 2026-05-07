import { useId } from "react";
import { TX } from "./tokens";

export function pesos(n) {
  return "$" + Number(n).toLocaleString("es-CO");
}

export function Dots({ flex = 1 }) {
  return (
    <div style={{
      flex, height: 1, marginBottom: 4,
      backgroundImage: `radial-gradient(circle, ${TX.line} 1px, transparent 1px)`,
      backgroundSize: "4px 1px", backgroundRepeat: "repeat-x",
    }} />
  );
}

export function StripedPlaceholder({ tone = "#d6cab4", stripe = "rgba(0,0,0,0.06)", label, style = {} }) {
  const id = useId();
  return (
    <div style={{ position: "relative", width: "100%", height: "100%", background: tone, overflow: "hidden", borderRadius: "inherit", ...style }}>
      <svg width="100%" height="100%" style={{ position: "absolute", inset: 0 }}>
        <defs>
          <pattern id={id} width="14" height="14" patternUnits="userSpaceOnUse" patternTransform="rotate(35)">
            <line x1="0" y1="0" x2="0" y2="14" stroke={stripe} strokeWidth="6" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill={`url(#${id})`} />
      </svg>
      {label && (
        <div style={{ position: "absolute", left: 8, bottom: 6, fontFamily: TX.mono, fontSize: 9, letterSpacing: "0.04em", textTransform: "uppercase", color: "rgba(0,0,0,0.45)" }}>
          {label}
        </div>
      )}
    </div>
  );
}

export const Ico = {
  search: (s = 16, c = "currentColor") => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round">
      <circle cx="11" cy="11" r="7" /><line x1="20" y1="20" x2="16.5" y2="16.5" />
    </svg>
  ),
  bag: (s = 18, c = "currentColor") => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 8h14l-1.2 11.2a2 2 0 0 1-2 1.8H8.2a2 2 0 0 1-2-1.8L5 8z" />
      <path d="M9 8V6a3 3 0 0 1 6 0v2" />
    </svg>
  ),
  plus: (s = 14, c = "currentColor") => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2.4" strokeLinecap="round">
      <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  ),
  minus: (s = 14, c = "currentColor") => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2.4" strokeLinecap="round">
      <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  ),
  back: (s = 18, c = "currentColor") => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="15 5 8 12 15 19" />
    </svg>
  ),
  clock: (s = 13, c = "currentColor") => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round">
      <circle cx="12" cy="12" r="9" /><polyline points="12 7 12 12 15 14" />
    </svg>
  ),
  chev: (s = 14, c = "currentColor", dir = "right") => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"
      style={{ transform: dir === "down" ? "rotate(90deg)" : dir === "left" ? "rotate(180deg)" : dir === "up" ? "rotate(-90deg)" : "none" }}>
      <polyline points="9 6 15 12 9 18" />
    </svg>
  ),
  print: (s = 16, c = "currentColor") => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="6 9 6 3 18 3 18 9" />
      <rect x="4" y="9" width="16" height="9" rx="1.5" />
      <rect x="7" y="14" width="10" height="6" rx="1" />
    </svg>
  ),
  whatsapp: (s = 18, c = "currentColor") => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill={c}>
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z"/>
    </svg>
  ),
};

const CAT_TONE = {
  burgers: "#7a5c3a", tacos: "#8a6420", sides: "#6a5840",
  bebidas: "#5a6a3a", postres: "#7a4c40", general: "#6a5840",
};
export function catTone(cat) {
  return CAT_TONE[cat] || "#6a5840";
}
