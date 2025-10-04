// src/App.tsx

import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Layout from "@/components/Layout";
import Home from "@/pages/Home";
import About from "@/pages/About";
import DashboardPage from "@/pages/DashboardPage";
import DataSources from "@/pages/DataSources";
import NotFound from "@/pages/NotFound";

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/data-sources" element={<DataSources />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;