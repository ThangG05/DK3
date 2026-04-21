import EmployeeManager from "../components/EmployeeManager";
import { Users, UserPlus } from "lucide-react";

export default function Employees() {
  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-blue-600 mb-1">
            <Users size={18} />
            <span className="text-xs font-bold uppercase tracking-[0.2em]"></span>
          </div>
          <h1 className="text-3xl font-black text-slate-800 tracking-tight">
            Quản lý nhân sự
          </h1>
          <p className="text-slate-500 text-sm mt-1 font-medium">
            Danh sách nhân viên nhận email diễn tập trong hệ thống.
          </p>
        </div>

        {/* Nút hỗ trợ nhanh nếu cần */}
        <div className="flex gap-3">
          <button className="bg-white border border-slate-200 text-slate-600 px-4 py-2 rounded-xl text-sm font-bold hover:bg-slate-50 transition-all shadow-sm">
            Import Excel
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
        <EmployeeManager />
      </div>
      
      {/* Footer Note */}
      <div className="p-4 bg-amber-50 rounded-2xl border border-amber-100 flex items-start gap-3">
        <div className="p-1 bg-amber-100 rounded-lg text-amber-600">
          <UserPlus size={16} />
        </div>
        <p className="text-xs text-amber-800 leading-relaxed">
          <strong>Lưu ý:</strong> Đảm bảo địa chỉ email của nhân viên là chính xác.
        </p>
      </div>
    </div>
  );
}