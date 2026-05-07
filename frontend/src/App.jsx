import { BrowserRouter, Routes, Route } from "react-router-dom";
import Menu from "./pages/Menu";
import Panel from "./pages/Panel";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/menu/:slug" element={<Menu />} />
        <Route path="/panel" element={<Panel />} />
        <Route path="*" element={<p style={{ padding: 24 }}>404 - Página no encontrada</p>} />
      </Routes>
    </BrowserRouter>
  );
}
