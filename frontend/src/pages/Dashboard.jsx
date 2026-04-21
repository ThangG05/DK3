import { useEffect, useState } from "react";
import API from "../services/api";
import DashboardStats from "../components/DashboardStats";
import AnalyticsChart from "../components/AnalyticsChart";
import { LayoutDashboard, RefreshCcw, Calendar } from "lucide-react";

const Dashboard = () => {
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    setLoading(true);
    try {
      const res = await API.get("/stats");
      setStats(res.data);
    } catch (err) {
      console.error("Lỗi cập nhật stats:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const chart = [
    { name: "Email đã gửi", value: stats.total_sent || 0 },
    { name: "Lượt Click", value: stats.total_clicked || 0 }
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      {/* Top Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-blue-600 mb-1">
            <LayoutDashboard size={18} />
            <span className="text-xs font-bold uppercase tracking-[0.2em]">Tổng quan hệ thống</span>
          </div>
          <h1 className="text-3xl font-black text-slate-800 tracking-tight">
            Chào buổi tối, <span className="text-blue-600">Himass205</span>
          </h1>
          <div className="flex items-center gap-2 text-slate-400 text-sm mt-1 font-medium">
            <Calendar size={14} />
            <span>Hôm nay, {new Date().toLocaleDateString('vi-VN')}</span>
          </div>
        </div>

        <button 
          onClick={fetchStats}
          disabled={loading}
          className="flex items-center gap-2 bg-white border border-slate-200 text-slate-600 px-4 py-2.5 rounded-xl font-bold text-sm hover:bg-slate-50 hover:border-slate-300 transition-all shadow-sm active:scale-95 disabled:opacity-50"
        >
          <RefreshCcw size={16} className={loading ? "animate-spin" : ""} />
          Làm mới dữ liệu
        </button>
      </div>

      {/* Main Stats Grid */}
      <div className="relative">
        <DashboardStats stats={stats} />
      </div>

      {/* Chart Section */}
      <div className="grid grid-cols-1 gap-6">
        <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="p-6 border-b border-slate-50 flex items-center justify-between">
            <h3 className="font-bold text-slate-800">Biểu đồ hiệu quả kịch bản</h3>
            <div className="flex gap-2">
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-blue-500"></span>
                <span className="text-[10px] font-bold text-slate-400 uppercase">Gửi đi</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-emerald-500"></span>
                <span className="text-[10px] font-bold text-slate-400 uppercase">Phản hồi</span>
              </div>
            </div>
          </div>
          <div className="p-4 md:p-8">
            <AnalyticsChart data={chart} />
          </div>
        </div>
      </div>
      
      {/* Footer Info */}
      <div className="bg-blue-600 rounded-3xl p-8 text-white relative overflow-hidden shadow-xl shadow-blue-200">
        <div className="relative z-10">
          <h4 className="text-xl font-bold mb-2">Mẹo bảo mật hệ thống</h4>
          <p className="text-blue-100 text-sm max-w-2xl leading-relaxed">
            Thường xuyên cập nhật danh sách nhân viên và các kịch bản AI mới để nâng cao hiệu quả diễn tập giả lập. Các biểu đồ trên được cập nhật theo thời gian thực từ API backend.
          </p>
        </div>
        <div className="absolute top-[-20%] right-[-5%] opacity-10">
          <LayoutDashboard size={200} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;