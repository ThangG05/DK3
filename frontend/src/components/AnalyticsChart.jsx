import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  CartesianGrid, 
  Cell 
} from "recharts";

const AnalyticsChart = ({ data }) => {
  // Định nghĩa màu sắc để biểu đồ không bị mặc định màu đen
  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444'];

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 mt-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold text-slate-800 tracking-tight">Thống kê chiến dịch</h3>
        <span className="text-xs font-medium text-slate-400 uppercase tracking-widest">Real-time Data</span>
      </div>

      <div className="h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            {/* Thêm lưới ngang mờ cho biểu đồ */}
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
            
            <XAxis 
              dataKey="name" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: '#64748b', fontSize: 12, fontWeight: 500 }}
              dy={10}
            />
            
            <YAxis 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: '#64748b', fontSize: 12 }} 
            />

            {/* Tùy chỉnh Tooltip để trông mượt hơn */}
            <Tooltip 
              cursor={{ fill: '#f8fafc' }}
              contentStyle={{ 
                borderRadius: '12px', 
                border: 'none', 
                boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
                padding: '10px 14px'
              }}
              itemStyle={{ fontSize: '13px', fontWeight: 600 }}
            />

            {/* Bar với màu sắc cụ thể và bo góc */}
            <Bar 
              dataKey="value" 
              radius={[6, 6, 0, 0]} 
              barSize={45}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default AnalyticsChart;