export default function ProductCard({ producto, onAgregar }) {
  return (
    <div style={styles.card}>
      {producto.imagen && <img src={producto.imagen} alt={producto.nombre} style={styles.img} />}
      <div style={styles.info}>
        <strong>{producto.nombre}</strong>
        {producto.descripcion && <p style={styles.desc}>{producto.descripcion}</p>}
        <span style={styles.precio}>${producto.precio.toLocaleString()}</span>
      </div>
      <button onClick={() => onAgregar(producto)} style={styles.btn}>+ Agregar</button>
    </div>
  );
}

const styles = {
  card: { display: "flex", alignItems: "center", gap: 12, padding: "12px 0", borderBottom: "1px solid #eee" },
  img: { width: 64, height: 64, objectFit: "cover", borderRadius: 8 },
  info: { flex: 1 },
  desc: { margin: "2px 0", fontSize: 13, color: "#666" },
  precio: { fontWeight: "bold", color: "#1a1a1a" },
  btn: { padding: "6px 14px", background: "#25D366", color: "#fff", border: "none", borderRadius: 8, cursor: "pointer", fontWeight: "bold" },
};
