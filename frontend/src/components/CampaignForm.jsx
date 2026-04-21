import { Wand2, Loader2 } from "lucide-react";

const CampaignForm = ({ topic, setTopic, onGenerate, loading }) => {
  return (
    <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 w-full max-w-2xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-blue-50 rounded-lg">
          <Wand2 className="text-blue-600" size={24} />
        </div>
        <div>
          <h3 className="text-xl font-bold text-slate-800">Tạo nội dung AI</h3>
          <p className="text-sm text-slate-500">Nhập kịch bản để AI tự động soạn thảo email</p>
        </div>
      </div>

      <div className="space-y-4">
        <textarea
          placeholder="Ví dụ: Thông báo cập nhật chính sách bảo mật mới cho nhân viên..."
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          className="w-full h-40 p-4 text-slate-700 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all resize-none bg-slate-50 hover:bg-white focus:bg-white"
        />

        <button
          onClick={onGenerate}
          disabled={loading || !topic.trim()}
          className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 text-white font-semibold py-3 px-6 rounded-xl transition-all shadow-md shadow-blue-200 active:scale-[0.98]"
        >
          {loading ? (
            <>
              <Loader2 className="animate-spin" size={20} />
              <span>Đang xử lý nội dung...</span>
            </>
          ) : (
            <>
              <Wand2 size={20} />
              <span>Generate Email</span>
            </>
          )}
        </button>
      </div>
      
      {!topic && !loading && (
        <p className="text-center text-xs text-slate-400 mt-4 italic">
          * Gợi ý: Mô tả càng chi tiết, kết quả AI trả về càng chính xác.
        </p>
      )}
    </div>
  );
};

export default CampaignForm;