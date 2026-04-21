import { Link, useLocation } from "react-router-dom";
import { LayoutDashboard, Mail, PlusCircle, Users, ShieldAlert, ChevronRight } from "lucide-react";

const Sidebar = () => {
  const { pathname } = useLocation();

  const menu = [
    { name: "Dashboard", path: "/", icon: <LayoutDashboard size={20} /> },
    { name: "Campaigns", path: "/campaigns", icon: <Mail size={20} /> },
    { name: "Tạo Campaign", path: "/create", icon: <PlusCircle size={20} /> },
    { name: "Nhân viên", path: "/employees", icon: <Users size={20} /> },
  ];

  return (
    <aside className="w-64 bg-slate-900 h-screen p-6 fixed left-0 top-0 text-white shadow-2xl z-50 flex flex-col border-r border-slate-800">
      {/* Brand Logo */}
      <div className="flex items-center gap-3 mb-12 px-2 group cursor-pointer">
        <div className="p-2 bg-blue-600/20 rounded-xl group-hover:bg-blue-600/30 transition-colors">
          <ShieldAlert className="text-blue-400" size={24} />
        </div>
        <h2 className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
          Phishing Admin
        </h2>
      </div>

      {/* Menu Navigation */}
      <nav className="flex-1 space-y-1.5">
        <p className="text-[10px] uppercase font-bold text-slate-500 tracking-[0.2em] mb-4 px-2">
          Main Menu
        </p>
        {menu.map((item) => {
          const isActive = pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center justify-between p-3 rounded-xl transition-all duration-300 group ${
                isActive 
                  ? "bg-blue-600 shadow-lg shadow-blue-900/40 text-white" 
                  : "text-slate-400 hover:bg-slate-800/50 hover:text-slate-100"
              }`}
            >
              <div className="flex items-center gap-3">
                <span className={`${isActive ? "text-white" : "text-slate-500 group-hover:text-blue-400"} transition-colors`}>
                  {item.icon}
                </span>
                <span className="font-semibold text-[15px]">{item.name}</span>
              </div>
              
              {isActive && (
                <ChevronRight size={14} className="text-blue-200 animate-pulse" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Footer Sidebar (Tùy chọn) */}
      <div className="mt-auto pt-6 border-t border-slate-800">
        <div className="flex items-center gap-3 px-2 py-3 rounded-xl bg-slate-800/30 border border-slate-800/50">
          <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center font-bold text-xs">
            MT
          </div>
          <div className="overflow-hidden">
            <p className="text-sm font-bold truncate">Himass205</p>
            <p className="text-[10px] text-slate-500 truncate">Administrator</p>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;