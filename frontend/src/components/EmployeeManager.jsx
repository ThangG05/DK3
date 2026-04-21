import { useEffect, useState } from "react";
import API from "../services/api";
import { UserPlus, Trash2, Mail, Building2 } from "lucide-react";

const EmployeeManager = () => {
  const [list, setList] = useState([]);
  const [form, setForm] = useState({ FullName: "", Email: "", Department: "" });
  const [loading, setLoading] = useState(false);

  const fetch = async () => {
    try {
      const res = await API.get("/employees/");
      setList(res.data);
    } catch (err) {
      console.error("Lỗi lấy danh sách:", err);
    }
  };

  useEffect(() => { fetch(); }, []);

  const submit = async (e) => {
    e.preventDefault();
    if (!form.FullName || !form.Email) return alert("Vui lòng nhập đủ tên và email");
    
    setLoading(true);
    await API.post("/employees/", form);
    setForm({ FullName: "", Email: "", Department: "" });
    await fetch();
    setLoading(false);
  };

  const deleteEmployee = async (id) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa nhân viên này?")) {
      await API.delete(`/employees/${id}`);
      fetch();
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden animate-in fade-in duration-500">
      {/* Header */}
      <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
        <div>
          <h2 className="text-xl font-bold text-slate-800">Quản lý nhân viên</h2>
          <p className="text-sm text-slate-500">Thêm và quản lý danh sách mục tiêu giả lập</p>
        </div>
        <span className="bg-blue-100 text-blue-700 px-4 py-1 rounded-full text-xs font-bold ring-4 ring-blue-50">
          {list.length} Tổng số
        </span>
      </div>

      {/* Form Input */}
      <form onSubmit={submit} className="p-6 grid grid-cols-1 md:grid-cols-4 gap-4 bg-slate-50/30 border-b border-slate-100">
        <div className="relative">
          <input 
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all text-sm"
            placeholder="Họ và tên" 
            value={form.FullName}
            onChange={e => setForm({...form, FullName: e.target.value})} 
          />
          <UserPlus className="absolute left-3 top-3 text-slate-400" size={18} />
        </div>
        <div className="relative">
          <input 
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all text-sm"
            placeholder="Email công ty" 
            value={form.Email}
            onChange={e => setForm({...form, Email: e.target.value})} 
          />
          <Mail className="absolute left-3 top-3 text-slate-400" size={18} />
        </div>
        <div className="relative">
          <input 
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all text-sm"
            placeholder="Phòng ban" 
            value={form.Department}
            onChange={e => setForm({...form, Department: e.target.value})} 
          />
          <Building2 className="absolute left-3 top-3 text-slate-400" size={18} />
        </div>
        <button 
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 text-white rounded-xl font-semibold transition-all shadow-lg shadow-blue-100 active:scale-95"
        >
          {loading ? "Đang lưu..." : "Thêm nhân viên"}
        </button>
      </form>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/80 text-slate-500 text-xs uppercase tracking-wider">
              <th className="px-6 py-4 font-bold">Thông tin nhân viên</th>
              <th className="px-6 py-4 font-bold">Phòng ban</th>
              <th className="px-6 py-4 font-bold text-right">Hành động</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {list.length > 0 ? list.map(e => (
              <tr key={e.EmployeeID} className="hover:bg-blue-50/30 transition-colors group">
                <td className="px-6 py-4">
                  <div className="font-bold text-slate-800 group-hover:text-blue-600 transition-colors">{e.FullName}</div>
                  <div className="text-sm text-slate-500">{e.Email}</div>
                </td>
                <td className="px-6 py-4">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-800">
                    {e.Department || "N/A"}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <button 
                    onClick={() => deleteEmployee(e.EmployeeID)}
                    className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all"
                  >
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            )) : (
              <tr>
                <td colSpan="3" className="px-6 py-10 text-center text-slate-400 italic">
                  Chưa có nhân viên nào trong danh sách.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default EmployeeManager;