import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../services/api";
import { Send, ArrowLeft, Eye } from "lucide-react";

const CampaignDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [isSending, setIsSending] = useState(false);

  useEffect(() => {
    API.get(`/campaigns/${id}`)
      .then(res => setData(res.data))
      .catch(err => console.error("Lỗi fetch data:", err));
  }, [id]);

  const handleSend = async () => {
    if (!window.confirm("Xác nhận gửi email chiến dịch này đến toàn bộ danh sách?")) return;

    setIsSending(true);
    try {
      await API.post(`/campaigns/${id}/send`);
      alert("Chiến dịch đã bắt đầu được gửi đi!");
    } catch (err) {
      alert("Có lỗi khi gửi chiến dịch.");
    } finally {
      setIsSending(false);
    }
  };

  // 🔥 FIX: decode lỗi kiểu ThÃ´ng bÃ¡o
  const decodeUTF8 = (str) => {
    try {
      return decodeURIComponent(escape(str));
    } catch {
      return str;
    }
  };

  if (!data) return (
    <div className="flex items-center justify-center h-64 text-slate-500 font-medium">
      <div className="animate-pulse">Đang tải chi tiết chiến dịch...</div>
    </div>
  );

  const { campaign, stats } = data;

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-in fade-in duration-500">
      
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-slate-500 hover:text-slate-800 transition-colors font-medium text-sm"
        >
          <ArrowLeft size={18} /> Quay lại danh sách
        </button>

        <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
          campaign.Status === 'Completed' 
            ? 'bg-emerald-100 text-emerald-700' 
            : 'bg-blue-100 text-blue-700'
        }`}>
          {campaign.Status}
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* LEFT */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
            
            <h2 className="text-2xl font-extrabold text-slate-800 mb-6">
              {decodeUTF8(campaign.CampaignName)}
            </h2>

            <div className="space-y-4">
              <div className="flex justify-between p-3 bg-slate-50 rounded-xl">
                <span className="text-sm">Đã gửi</span>
                <span className="font-bold">{stats.total_sent}</span>
              </div>

              <div className="flex justify-between p-3 bg-slate-50 rounded-xl">
                <span className="text-sm">Lượt click</span>
                <span className="font-bold text-rose-600">{stats.total_clicked}</span>
              </div>
            </div>

            <button 
              onClick={handleSend}
              disabled={isSending || campaign.Status === 'Completed'}
              className="w-full mt-8 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 text-white py-4 rounded-xl font-bold"
            >
              <Send size={18} className="inline mr-2" />
              {isSending ? "Đang xử lý..." : "Gửi Campaign"}
            </button>

          </div>
        </div>

        {/* RIGHT */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl shadow-sm border overflow-hidden">

            <div className="p-4 border-b bg-slate-50 flex items-center gap-2 text-slate-500">
              <Eye size={16} />
              <span className="text-xs font-bold uppercase">Preview Email</span>
            </div>

            <div className="p-8">

              <div className="mb-6">
                <h4 className="text-xs text-slate-400 mb-1">Subject</h4>
                <p className="text-lg font-semibold">
                  {decodeUTF8(campaign.EmailSubject)}
                </p>
              </div>

              <div className="border-t pt-6">
                <h4 className="text-xs text-slate-400 mb-4">Body</h4>

                {/* 🔥 FIX CHÍNH */}
                <div
                  style={{
                    fontFamily: "Arial, Helvetica, sans-serif",
                    lineHeight: "1.6",
                    whiteSpace: "pre-wrap"
                  }}
                  className="p-6 bg-slate-50 rounded-xl border min-h-[300px]"
                  dangerouslySetInnerHTML={{
                    __html: decodeUTF8(campaign.EmailContent_HTML)
                  }}
                />

              </div>

            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default CampaignDetail;