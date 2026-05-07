// Placeholder de imagen rayado (SVG) — para fotos de productos
// Color base configurable. Genera líneas diagonales sutiles + tag mono.
function StripedPlaceholder({ tone = '#d6cab4', stripe = 'rgba(0,0,0,0.06)', label, style = {} }) {
  const id = React.useId();
  return (
    <div style={{
      position: 'relative', width: '100%', height: '100%',
      background: tone, overflow: 'hidden', borderRadius: 'inherit',
      ...style,
    }}>
      <svg width="100%" height="100%" style={{ position: 'absolute', inset: 0 }}>
        <defs>
          <pattern id={id} width="14" height="14" patternUnits="userSpaceOnUse" patternTransform="rotate(35)">
            <line x1="0" y1="0" x2="0" y2="14" stroke={stripe} strokeWidth="6" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill={`url(#${id})`} />
      </svg>
      {label && (
        <div style={{
          position: 'absolute', left: 8, bottom: 6,
          fontFamily: 'ui-monospace, "JetBrains Mono", Menlo, monospace',
          fontSize: 9, letterSpacing: '0.04em', textTransform: 'uppercase',
          color: 'rgba(0,0,0,0.45)',
        }}>{label}</div>
      )}
    </div>
  );
}

// Iconos SVG simples (línea) — solo formas geométricas básicas
const Ico = {
  search: (s = 16, c = 'currentColor') => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round">
      <circle cx="11" cy="11" r="7" /><line x1="20" y1="20" x2="16.5" y2="16.5" />
    </svg>
  ),
  bag: (s = 18, c = 'currentColor') => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 8h14l-1.2 11.2a2 2 0 0 1-2 1.8H8.2a2 2 0 0 1-2-1.8L5 8z" />
      <path d="M9 8V6a3 3 0 0 1 6 0v2" />
    </svg>
  ),
  plus: (s = 14, c = 'currentColor') => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2.4" strokeLinecap="round">
      <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  ),
  minus: (s = 14, c = 'currentColor') => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2.4" strokeLinecap="round">
      <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  ),
  back: (s = 18, c = 'currentColor') => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="15 5 8 12 15 19" />
    </svg>
  ),
  filter: (s = 16, c = 'currentColor') => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round">
      <line x1="3" y1="7" x2="21" y2="7" /><line x1="6" y1="12" x2="18" y2="12" /><line x1="9" y1="17" x2="15" y2="17" />
    </svg>
  ),
  print: (s = 16, c = 'currentColor') => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="6 9 6 3 18 3 18 9" />
      <rect x="4" y="9" width="16" height="9" rx="1.5" />
      <rect x="7" y="14" width="10" height="6" rx="1" />
    </svg>
  ),
  clock: (s = 13, c = 'currentColor') => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round">
      <circle cx="12" cy="12" r="9" /><polyline points="12 7 12 12 15 14" />
    </svg>
  ),
  chev: (s = 14, c = 'currentColor', dir = 'right') => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"
      style={{ transform: dir === 'down' ? 'rotate(90deg)' : dir === 'left' ? 'rotate(180deg)' : dir === 'up' ? 'rotate(-90deg)' : 'none' }}>
      <polyline points="9 6 15 12 9 18" />
    </svg>
  ),
  flame: (s = 14, c = 'currentColor') => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8" strokeLinejoin="round">
      <path d="M12 3c1 4 4 5 4 9a4 4 0 0 1-8 0c0-2 1-3 1-5 0 2 2 3 3 0z" />
    </svg>
  ),
  user: (s = 14, c = 'currentColor') => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round">
      <circle cx="12" cy="9" r="3.5" /><path d="M5 20c1-4 4-6 7-6s6 2 7 6" />
    </svg>
  ),
  table: (s = 14, c = 'currentColor') => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round">
      <ellipse cx="12" cy="9" rx="8" ry="3" /><line x1="12" y1="12" x2="12" y2="20" />
      <line x1="9" y1="20" x2="15" y2="20" />
    </svg>
  ),
};

// Chip horizontal para categorías
function pesos(n) { return '$' + n.toLocaleString('es-MX'); }

// hook para tiempo "vivo"
function useTick(ms = 30000) {
  const [, set] = React.useState(0);
  React.useEffect(() => {
    const id = setInterval(() => set((x) => x + 1), ms);
    return () => clearInterval(id);
  }, [ms]);
}

window.POS_HELPERS = { StripedPlaceholder, Ico, pesos, useTick };
