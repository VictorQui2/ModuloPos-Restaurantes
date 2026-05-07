export default function Carrito({ items, onQuitar, total, onConfirmar }) {
  if (!items.length) return null;

  return (
    <div style={styles.wrapper}>
      <h3 style={{ margin: "0 0 8px" }}>Tu pedido</h3>
      {items.map((i) => (
        <div key={i.id} style={styles.row}>
          <span>{i.cantidad}x {i.nombre}</span>
          <span>${(i.precio * i.cantidad).toLocaleString()}</span>
          <button onClick={() => onQuitar(i.id)} style={styles.x}>✕</button>
        </div>
      ))}
      <div style={styles.total}>Total: <strong>${total.toLocaleString()}</strong></div>
      <button onClick={onConfirmar} style={styles.btn}>Confirmar pedido</button>
    </div>
  );
}

const styles = {
  wrapper: { position: "fixed", bottom: 0, left: 0, right: 0, background: "#fff", padding: 16, boxShadow: "0 -2px 12px rgba(0,0,0,.15)", maxWidth: 480, margin: "0 auto" },
  row: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "4px 0", fontSize: 14 },
  x: { background: "none", border: "none", cursor: "pointer", color: "#999", fontSize: 12 },
  total: { margin: "8px 0", fontSize: 15 },
  btn: { width: "100%", padding: "12px 0", background: "#25D366", color: "#fff", border: "none", borderRadius: 10, fontSize: 16, fontWeight: "bold", cursor: "pointer" },
};
