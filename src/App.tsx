import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Shell } from "./Shell";
import { Overview } from "./pages/Overview";
import { Inventory } from "./pages/Inventory";
import { Pricing } from "./pages/Pricing";
import { Insights } from "./pages/Insights";

/**
 * BrowserRouter gives clean URLs (e.g. /overview instead of /#/overview).
 * This requires the host to rewrite all paths to index.html so a page
 * refresh on a route like /inventory still loads the app — see
 * vercel.json in the project root for that rewrite rule.
 */
export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Shell />}>
          <Route index element={<Navigate to="/overview" replace />} />
          <Route path="overview" element={<Overview />} />
          <Route path="inventory" element={<Inventory />} />
          <Route path="pricing" element={<Pricing />} />
          <Route path="insights" element={<Insights />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
