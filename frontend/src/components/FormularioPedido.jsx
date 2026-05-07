import { useState } from "react";

export default function FormularioPedido({ onEnviar, onCancelar }) {
  const [form, setForm] = useState({ clienteNombre: "", telefono: "", direccion: "" });

  const change = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        <h3 style={{ margin: "0 0 16px" }}>Tus datos</h3>
        <input name="clienteNombre" placeholder="Nombre *" value={form.clienteNombre} onChange={change} style={styles.input} />
        <input name="telefono" placeholder="Teléfono" value={form.telefono} onChange={change} style={styles.input} />
        <input name="direccion" placeholder="Dirección (opcional)" value={form.direccion} onChange={change} style={styles.input} />
        <button onClick={() => form.clienteNombre && onEnviar(form)} style={styles.btn}>Enviar por WhatsApp</button>
        <button onClick={onCancelar} style={styles.cancel}>Cancelar</button>
      </div>
    </div>
  );
}

const styles = {
  overlay: { position: "fixed", inset: 0, background: "rgba(0,0,0,.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100 },
  modal: { background: "#fff", borderRadius: 12, padding: 24, width: "90%", maxWidth: 400, display: "flex", flexDirection: "column", gap: 10 },
  input: { padding: "10px 12px", border: "1px solid #ddd", borderRadius: 8, fontSize: 15 },
  btn: { padding: "12px 0", background: "#25D366", color: "#fff", border: "none", borderRadius: 10, fontSize: 15, fontWeight: "bold", cursor: "pointer" },
  cancel: { padding: "8px 0", background: "none", border: "none", color: "#999", cursor: "pointer", fontSize: 14 },
};
