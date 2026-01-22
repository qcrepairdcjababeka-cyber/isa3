
import React, { useState } from 'react';
import { InventoryItem } from '../types';
import { Search, Filter, ArrowUpRight, ArrowDownRight } from 'lucide-react';

interface InventoryTableProps {
  inventory: InventoryItem[];
}

const InventoryTable: React.FC<InventoryTableProps> = ({ inventory }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [slocFilter, setSlocFilter] = useState<'all' | '1000' | '1001'>('all');

  const filtered = inventory.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) || item.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSloc = slocFilter === 'all' || item.sloc === slocFilter;
    return matchesSearch && matchesSloc;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input
            type="text"
            placeholder="Cari item berdasarkan nama atau ID..."
            className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-3">
          <Filter className="text-slate-400" size={18} />
          <select
            className="bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium focus:ring-2 focus:ring-blue-500 outline-none"
            value={slocFilter}
            onChange={(e) => setSlocFilter(e.target.value as any)}
          >
            <option value="all">Semua SLOC</option>
            <option value="1000">SLOC 1000 (Utama)</option>
            <option value="1001">SLOC 1001 (Sekunder)</option>
          </select>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200">
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">ID Barang</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Nama Barang</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Kategori</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">SLOC</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Stok</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Terakhir Diperbarui</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filtered.map((item) => (
              <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4 font-mono text-xs text-slate-500">{item.id}</td>
                <td className="px-6 py-4 font-semibold text-slate-800">{item.name}</td>
                <td className="px-6 py-4">
                  <span className="px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-xs font-medium">
                    {item.category}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${
                    item.sloc === '1000' ? 'bg-blue-100 text-blue-700' : 'bg-emerald-100 text-emerald-700'
                  }`}>
                    {item.sloc === '1000' ? <ArrowUpRight size={12}/> : <ArrowDownRight size={12}/>}
                    {item.sloc}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className={`text-sm font-bold ${item.quantity < 10 ? 'text-red-500' : 'text-slate-900'}`}>
                    {item.quantity} {item.unit}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-slate-500">{item.lastUpdated}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <div className="p-12 text-center text-slate-400">
            <Package size={48} className="mx-auto mb-4 opacity-20" />
            <p>Tidak ada data inventory ditemukan</p>
          </div>
        )}
      </div>
    </div>
  );
};

const Package = ({ size, className }: any) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="m7.5 4.27 9 5.15" /><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" />
    <path d="m3.3 7 8.7 5 8.7-5" /><path d="M12 22V12" />
  </svg>
);

export default InventoryTable;
