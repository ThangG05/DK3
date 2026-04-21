import { BrowserRouter, Routes, Route } from "react-router-dom";
import Sidebar from "./components/Sidebar";

import Dashboard from "./pages/Dashboard";
import Campaigns from "./pages/Campaigns";
import CampaignDetail from "./pages/CampaignDetail";
import CreateCampaign from "./pages/CreateCampaign";
import Employees from "./pages/Employees";
import WarningPage from "./pages/WarningPage";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>

        {/* 🔴 Trang WARNING - KHÔNG có layout */}
        <Route path="/warning" element={<WarningPage />} />

        {/* 🟢 Các trang còn lại có Sidebar */}
        <Route
          path="*"
          element={
            <div className="flex min-h-screen bg-slate-50 text-slate-900 font-sans">
              <Sidebar />

              <div className="flex-1 ml-64 p-8 md:p-12 transition-all duration-300">
                <div className="max-w-7xl mx-auto">
                  <Routes>
                    <Route path="/" element={<Dashboard />} />
                    <Route path="/campaigns" element={<Campaigns />} />
                    <Route path="/campaign/:id" element={<CampaignDetail />} />
                    <Route path="/create" element={<CreateCampaign />} />
                    <Route path="/employees" element={<Employees />} />
                  </Routes>
                </div>
              </div>
            </div>
          }
        />

      </Routes>
    </BrowserRouter>
  );
};

export default App;