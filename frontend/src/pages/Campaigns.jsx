import { useEffect, useState } from "react";
import API from "../services/api";
import { Link } from "react-router-dom";
import { Mail, Calendar, ChevronRight, BarChart2, Plus } from "lucide-react";

const Campaigns = () => {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get("/campaigns")
      .then(res => {
        setList(res.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  // 🔥 FIX decode lỗi UTF-8
  const decodeUTF8 = (str) => {
    if (!str) return "";
    try {
      return decodeURIComponent(escape(str));
    } catch {
      return str;
    }
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case "Completed":
        return "bg-emerald-100 text-emerald-700 border-emerald-200";
      case "Pending":
        return "bg-amber-100 text-amber-700 border-amber-200";
      default:
        return "bg-blue-100 text-blue-700 border-blue-200";
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      
      {/* Header */}
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-800">
            Chiến dịch Phishing
          </h1>
          <p className="text-slate-500 mt-1">
            Theo dõi và quản lý các kịch bản diễn tập
          </p>
        </div>

        <Link 
          to="/create" 
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-bold"
        >
          <Plus size={18} />
          Tạo mới
        </Link>
      </div>

      {/* Loading */}
      {loading ? (
        <div className="grid md:grid-cols-3 gap-6">
          {[1,2,3].map(i => (
            <div key={i} className="h-48 bg-slate-100 animate-pulse rounded-2xl" />
          ))}
        </div>
      ) : list.length > 0 ? (

        <div className="grid md:grid-cols-3 gap-6">
          {list.map((c) => (
            <Link 
              key={c.CampaignID} 
              to={`/campaign/${c.CampaignID}`}
              className="group bg-white p-6 rounded-2xl border hover:shadow-xl transition"
            >

              <div className="mb-3">
                <span className={`px-2 py-1 text-xs font-bold rounded-full border ${getStatusStyle(c.Status)}`}>
                  {c.Status}
                </span>
              </div>

              {/* 🔥 FIX NAME */}
              <h3 className="text-lg font-bold text-slate-800 mb-3 line-clamp-2">
                {decodeUTF8(c.CampaignName)}
              </h3>

              <div className="text-xs text-slate-400 mb-4">
                <Calendar size={14} className="inline mr-1" />
                {new Date().toLocaleDateString("vi-VN")}
              </div>

              <div className="flex justify-between items-center pt-3 border-t">
                <span className="text-blue-600 text-xs font-bold">
                  Xem chi tiết
                </span>
                <ChevronRight size={16} />
              </div>

            </Link>
          ))}
        </div>

      ) : (
        <div className="text-center py-20 text-slate-400">
          <Mail size={40} className="mx-auto mb-4" />
          <p>Chưa có chiến dịch nào</p>
          <Link to="/create" className="text-blue-600 font-bold">
            Tạo ngay
          </Link>
        </div>
      )}
    </div>
  );
};

export default Campaigns;