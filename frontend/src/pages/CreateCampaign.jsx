import { useState } from "react";
import API from "../services/api";
import { Wand2, Save, Sparkles, Layout, Mail } from "lucide-react";

const CreateCampaign = () => {
  const [topic, setTopic] = useState("");
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);

  const generate = async () => {
    if (!topic.trim()) return;
    setLoading(true);
    try {
      const res = await API.post("/campaigns/generate", { topic });
      setPreview(res.data);
    } catch (err) {
      alert("Lỗi khi tạo nội dung!");
    } finally {
      setLoading(false);
    }
  };

  const save = async () => {
    try {
      await API.post("/campaigns", {
        name: topic.length > 30 ? `${topic.substring(0, 30)}...` : topic,
        subject: preview.subject,
        body: preview.body
      });
      alert("Đã lưu thành công!");
      setPreview(null);
      setTopic("");
    } catch (err) {
      alert("Lỗi khi lưu campaign!");
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in duration-700">
      {/* Input Header Section */}
      <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-5">
          <Sparkles size={120} />
        </div>
        
        <div className="relative">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-blue-600 rounded-2xl shadow-lg shadow-blue-200">
              <Wand2 className="text-white" size={24} />
            </div>
            <div>
              <h1 className="text-2xl font-black text-slate-800 tracking-tight">Tạo mẫu email phishing</h1>
              <p className="text-slate-500 text-sm font-medium">Sử dụng trí tuệ nhân tạo để soạn thảo kịch bản diễn tập</p>
            </div>
          </div>

          <div className="space-y-4">
            <label className="block text-sm font-bold text-slate-700 ml-1">Chủ đề hoặc tình huống giả định</label>
            <textarea 
              className="w-full p-5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-100 focus:bg-white focus:border-blue-500 outline-none transition-all min-h-[120px] text-slate-700 leading-relaxed"
              placeholder="Ví dụ: Thông báo trúng thưởng quà tặng cuối năm từ phòng nhân sự..."
              value={topic}
              onChange={e => setTopic(e.target.value)}
            />

            <button 
              onClick={generate}
              disabled={loading || !topic.trim()}
              className="flex items-center justify-center gap-2 bg-slate-900 hover:bg-black disabled:bg-slate-200 text-white px-8 py-4 rounded-2xl font-bold transition-all shadow-xl shadow-slate-200 active:scale-95"
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                  <span>Đang suy nghĩ...</span>
                </div>
              ) : (
                <>
                  <Sparkles size={18} />
                  <span>Tạo kịch bản ngay</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Preview Section */}
      {preview && (
        <div className="bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden animate-in slide-in-from-bottom-8 duration-500">
          <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center px-8">
            <div className="flex items-center gap-2 text-slate-400">
              <Layout size={18} />
              <span className="text-xs font-black uppercase tracking-[0.2em]">Bản nháp từ AI</span>
            </div>
            <button 
              onClick={save} 
              className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white px-5 py-2 rounded-xl transition-all font-bold shadow-lg shadow-emerald-100 active:scale-95"
            >
              <Save size={18} />
              Lưu vào hệ thống
            </button>
          </div>
          
          <div className="p-8 md:p-12">
            <div className="max-w-3xl mx-auto border border-slate-100 rounded-2xl shadow-inner bg-white overflow-hidden">
              {/* Email UI Header */}
              <div className="bg-slate-50 p-6 border-b border-slate-100">
                <div className="flex items-center gap-4 mb-3">
                  <span className="text-xs font-bold text-slate-400 w-16 uppercase">Từ:</span>
                  <span className="text-sm font-medium text-slate-700 bg-white px-3 py-1 rounded-lg border border-slate-200">AI Security Generator</span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-xs font-bold text-slate-400 w-16 uppercase">Tiêu đề:</span>
                  <span className="text-sm font-bold text-blue-600">{preview.subject}</span>
                </div>
              </div>
              
              {/* Email Content Body */}
              <div className="p-8 md:p-12 min-h-[400px]">
                <div className="flex items-center gap-2 mb-8 text-slate-300">
                  <Mail size={20} />
                  <div className="h-[1px] flex-1 bg-slate-100"></div>
                </div>
                <article 
                  className="prose prose-slate max-w-none prose-headings:text-slate-800 prose-p:text-slate-600" 
                  dangerouslySetInnerHTML={{ __html: preview.body }} 
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreateCampaign;