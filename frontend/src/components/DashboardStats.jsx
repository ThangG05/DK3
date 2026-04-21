import { Users, Send, MousePointerClick } from "lucide-react";

const DashboardStats = ({ stats }) => {
  const data = [
    { 
      title: "Nhân viên", 
      value: stats.total_employees, 
      color: "text-blue-600", 
      bg: "bg-blue-50",
      icon: <Users size={20} /> 
    },
    { 
      title: "Đã gửi", 
      value: stats.total_sent, 
      color: "text-emerald-600", 
      bg: "bg-emerald-50",
      icon: <Send size={20} /> 
    },
    { 
      title: "Tỷ lệ Click", 
      value: `${stats.click_rate || 0}%`, 
      sub: `${stats.total_clicked} lượt click`, 
      color: "text-rose-600", 
      bg: "bg-rose-50",
      icon: <MousePointerClick size={20} /> 
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      {data.map((item, i) => (
        <div key={i} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-start justify-between hover:shadow-md transition-shadow duration-200">
          <div>
            <p className="text-sm font-semibold text-slate-500 uppercase tracking-tight">
              {item.title}
            </p>
            <h2 className={`text-3xl font-bold mt-2 tracking-tight ${item.color}`}>
              {item.value || 0}
            </h2>
            {item.sub && (
              <p className="text-xs text-slate-400 mt-2 font-medium bg-slate-50 inline-block px-2 py-1 rounded-md">
                {item.sub}
              </p>
            )}
          </div>
          
          <div className={`p-3 rounded-xl ${item.bg} ${item.color}`}>
            {item.icon}
          </div>
        </div>
      ))}
    </div>
  );
};

export default DashboardStats;