import { useEffect, useState } from "react";
import API from "../services/api";
import { UserPlus, Trash2, Mail, Building2, Loader2 } from "lucide-react"; // Thêm Loader2 để làm hiệu ứng loading

const EmployeeManager = () => {
  const [list, setList] = useState([]);
  const [form, setForm] = useState({ FullName: "", Email: "", Department: "" });
  const [loading, setLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(false); // Trạng thái riêng cho việc load danh sách

  // Hàm lấy danh sách nhân viên (Backend lúc này đã lọc IsActive = True)
  const fetchEmployees = async () => {
    setIsFetching(true);
    try {
      const res = await API.get("/employees/");
      setList(res.data);
    } catch (err) {
      console.error("Lỗi lấy danh sách:", err);
    } finally {
      setIsFetching(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  // Hàm thêm nhân viên mới
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.FullName || !form.Email) return alert("Vui lòng nhập đủ tên và email");

    setLoading(true);
    try {
      await API.post("/employees/", form);
      setForm({ FullName: "", Email: "", Department: "" });
      await fetchEmployees();
    } catch (err) {
      alert(err.response?.data?.detail || "Lỗi khi thêm nhân viên");
    } finally {
      setLoading(false);
    }
  };

  // Hàm xóa nhân viên (Thực tế là gọi API để update IsActive = false)
  const deleteEmployee = async (id) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa nhân viên này khỏi danh sách hoạt động?")) {
      setLoading(true);
      try {
        await API.delete(`/employees/${id}`);
        // Tải lại danh sách ngay lập tức để người dùng thấy nhân viên đã "biến mất"
        await fetchEmployees();
      } catch (err) {
        console.error("Lỗi khi xóa:", err);
        alert("Không thể xóa nhân viên. Vui lòng thử lại sau.");
      } finally {
        setLoading(false);
      }
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
        <div className="flex items-center gap-3">
          {isFetching && <Loader2 className="animate-spin text-blue-500" size={18} />}
          <span className="bg-blue-100 text-blue-700 px-4 py-1 rounded-full text-xs font-bold ring-4 ring-blue-50">
            {list.length} Nhân viên hoạt động
          </span>
        </div>
      </div>

      {/* Form Input */}
      <form onSubmit={handleSubmit} className="p-6 grid grid-cols-1 md:grid-cols-4 gap-4 bg-slate-50/30 border-b border-slate-100">
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
          type="submit"
          disabled={loading}
          className="flex items-center justify-center bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 text-white rounded-xl font-semibold transition-all shadow-lg shadow-blue-100 active:scale-95 px-4 py-2.5"
        >
          {loading ? <Loader2 className="animate-spin mr-2" size={18} /> : null}
          {loading ? "Đang xử lý..." : "Thêm nhân viên"}
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
                    disabled={loading}
                    className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all disabled:opacity-50"
                  >
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            )) : (
              <tr>
                <td colSpan="3" className="px-6 py-10 text-center text-slate-400 italic">
                  {isFetching ? "Đang tải dữ liệu..." : "Chưa có nhân viên nào trong danh sách hoạt động."}
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