
import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import { InventoryItem } from '../types';
import { Package, Send, AlertTriangle, ArrowRightLeft, Sparkles } from 'lucide-react';
import { getInventoryInsights } from '../services/geminiService';

interface DashboardProps {
  inventory: InventoryItem[];
}

const Dashboard: React.FC<DashboardProps> = ({ inventory }) => {
  const [aiInsight, setAiInsight] = React.useState<string>('Analysing inventory...');
  const [loadingAi, setLoadingAi] = React.useState(true);

  React.useEffect(() => {
    const fetchInsights = async () => {
      setLoadingAi(true);
      const insight = await getInventoryInsights(inventory);
      setAiInsight(insight);
      setLoadingAi(false);
    };
    fetchInsights();
  }, [inventory]);

  const sloc1000Count = inventory.filter(i => i.sloc === '1000').reduce((acc, curr) => acc + curr.quantity, 0);
  const sloc1001Count = inventory.filter(i => i.sloc === '1001').reduce((acc, curr) => acc + curr.quantity, 0);

  const pieData = [
    { name: 'SLOC 1000', value: sloc1000Count },
    { name: 'SLOC 1001', value: sloc1001Count },
  ];

  const barData = inventory.slice(0, 5).map(item => ({
    name: item.name,
    stock: item.quantity
  }));

  const COLORS = ['#2563eb', '#10b981'];

  return (
    <div className="space-y-6">
      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Stock Units" value={sloc1000Count + sloc1001Count} icon={Package} color="blue" />
        <StatCard title="Items in Main (1000)" value={sloc1000Count} icon={ArrowRightLeft} color="emerald" />
        <StatCard title="Items in Sec (1001)" value={sloc1001Count} icon={Send} color="amber" />
        <StatCard title="Low Stock Alerts" value={inventory.filter(i => i.quantity < 10).length} icon={AlertTriangle} color="red" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Charts */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <h3 className="text-lg font-bold mb-4">Stock Distribution by Item</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData}>
                <XAxis dataKey="name" fontSize={12} />
                <YAxis />
                <Tooltip />
                <Bar dataKey="stock" fill="#2563eb" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <h3 className="text-lg font-bold mb-4">SLOC Allocation</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={pieData} innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend verticalAlign="bottom" height={36}/>
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 space-y-2">
            <div className="flex justify-between items-center text-sm">
              <span className="text-slate-500">Main Warehouse (1000)</span>
              <span className="font-bold">{((sloc1000Count / (sloc1000Count + sloc1001Count)) * 100).toFixed(1)}%</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-slate-500">Secondary (1001)</span>
              <span className="font-bold">{((sloc1001Count / (sloc1000Count + sloc1001Count)) * 100).toFixed(1)}%</span>
            </div>
          </div>
        </div>
      </div>

      {/* AI Insights Card */}
      <div className="bg-gradient-to-br from-indigo-500 to-purple-600 p-6 rounded-2xl shadow-lg text-white">
        <div className="flex items-center gap-2 mb-4">
          <Sparkles className="text-yellow-300" />
          <h3 className="text-lg font-bold">Smart Inventory Analysis (Powered by Gemini)</h3>
        </div>
        <div className="bg-white/10 backdrop-blur-sm p-4 rounded-xl border border-white/20">
          {loadingAi ? (
            <div className="animate-pulse space-y-2">
              <div className="h-4 bg-white/20 rounded w-3/4"></div>
              <div className="h-4 bg-white/20 rounded w-full"></div>
              <div className="h-4 bg-white/20 rounded w-1/2"></div>
            </div>
          ) : (
            <p className="text-white leading-relaxed text-sm whitespace-pre-line">{aiInsight}</p>
          )}
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ title, value, icon: Icon, color }: any) => {
  const colors: Record<string, string> = {
    blue: 'bg-blue-50 text-blue-600 border-blue-100',
    emerald: 'bg-emerald-50 text-emerald-600 border-emerald-100',
    amber: 'bg-amber-50 text-amber-600 border-amber-100',
    red: 'bg-red-50 text-red-600 border-red-100',
  };

  return (
    <div className={`p-6 rounded-2xl border shadow-sm flex items-center justify-between bg-white`}>
      <div>
        <p className="text-sm font-medium text-slate-500 mb-1">{title}</p>
        <p className="text-2xl font-bold text-slate-900">{value}</p>
      </div>
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${colors[color]}`}>
        <Icon size={24} />
      </div>
    </div>
  );
};

export default Dashboard;
