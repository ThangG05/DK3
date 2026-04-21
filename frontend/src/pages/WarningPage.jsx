import { useSearchParams } from "react-router-dom";
import { ShieldAlert, AlertTriangle, ChevronLeft, Lock } from "lucide-react";

const WarningPage = () => {
  const [params] = useSearchParams();
  const token = params.get("t");

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 p-6">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-900/20 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-rose-900/10 rounded-full blur-[120px]"></div>
      </div>

      <div className="max-w-xl w-full bg-white rounded-[2.5rem] shadow-2xl shadow-black/50 overflow-hidden relative z-10 animate-in zoom-in duration-500">
        {/* Warning Header */}
        <div className="bg-rose-600 p-10 text-center text-white">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-white/20 rounded-3xl backdrop-blur-md mb-6 animate-bounce">
            <ShieldAlert size={48} />
          </div>
          <h1 className="text-3xl font-black tracking-tight mb-2">CẢNH BÁO BẢO MẬT</h1>
          <p className="text-rose-100 font-medium italic">Bạn vừa tương tác với một liên kết không an toàn</p>
        </div>

        {/* Content Body */}
        <div className="p-10 space-y-8">
          <div className="text-center space-y-4">
            <h2 className="text-2xl font-bold text-slate-800 italic uppercase tracking-tighter">
              "Bạn đã bị Phishing!"
            </h2>
            <div className="h-1 w-20 bg-slate-100 mx-auto rounded-full"></div>
            <p className="text-slate-600 leading-relaxed font-medium">
              Rất may, đây chỉ là một phần của chương trình <strong>Diễn tập An toàn thông tin</strong> nội bộ. 
              Mục tiêu của chúng tôi là giúp bạn nhận diện các mối đe dọa thực tế.
            </p>
          </div>

          {/* Token Box */}
          <div className="bg-slate-50 border border-slate-100 p-5 rounded-2xl flex items-center justify-between">
            <div className="flex items-center gap-3 text-slate-500">
              <Lock size={18} />
              <span className="text-xs font-bold uppercase tracking-widest">Mã định danh (Token)</span>
            </div>
            <code className="text-blue-600 font-mono font-bold bg-white px-3 py-1 rounded-lg shadow-sm border border-slate-100">
              {token || "System-Testing"}
            </code>
          </div>

          {/* Education Section */}
          <div className="space-y-4">
            <p className="text-xs font-black text-slate-400 uppercase tracking-widest text-center">Cách phòng tránh lần sau</p>
            <div className="grid grid-cols-1 gap-3">
              <div className="flex items-center gap-4 p-4 bg-emerald-50 rounded-2xl border border-emerald-100">
                <AlertTriangle className="text-emerald-600 shrink-0" size={20} />
                <p className="text-sm text-emerald-900 font-medium leading-tight">Luôn kiểm tra kỹ địa chỉ email người gửi.</p>
              </div>
              <div className="flex items-center gap-4 p-4 bg-emerald-50 rounded-2xl border border-emerald-100">
                <AlertTriangle className="text-emerald-600 shrink-0" size={20} />
                <p className="text-sm text-emerald-900 font-medium leading-tight">Không nhập mật khẩu vào các trang web lạ.</p>
              </div>
            </div>
          </div>

         
        </div>
      </div>
    </div>
  );
};

export default WarningPage;