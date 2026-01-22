
import React from 'react';
import { HandoverRecord } from '../types';
import { Calendar, User, ArrowRight, FileText, Sparkles } from 'lucide-react';

interface HandoverHistoryProps {
  history: HandoverRecord[];
}

const HandoverHistory: React.FC<HandoverHistoryProps> = ({ history }) => {
  return (
    <div className="space-y-6">
      {history.slice().reverse().map((record) => (
        <div key={record.id} className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden hover:border-blue-300 transition-all">
          <div className="bg-slate-50 px-6 py-4 border-b border-slate-200 flex flex-wrap justify-between items-center gap-4">
            <div className="flex items-center gap-4">
              <span className="font-mono text-sm font-bold text-slate-600">{record.id}</span>
              <div className="flex items-center gap-2 text-slate-400">
                <Calendar size={16} />
                <span className="text-xs">{record.date}</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-500 uppercase">Transfer:</span>
              <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs font-bold rounded">SLOC {record.fromSloc}</span>
              <ArrowRight size={14} className="text-slate-400" />
              <span className="px-2 py-0.5 bg-emerald-100 text-emerald-700 text-xs font-bold rounded">SLOC {record.toSloc}</span>
            </div>
          </div>

          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <div className="flex gap-8">
                <div>
                  <p className="text-xs font-semibold text-slate-400 uppercase mb-1">Pengirim</p>
                  <div className="flex items-center gap-2 text-slate-800 font-bold">
                    <User size={16} className="text-blue-500" />
                    {record.senderName}
                  </div>
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-400 uppercase mb-1">Penerima</p>
                  <div className="flex items-center gap-2 text-slate-800 font-bold">
                    <User size={16} className="text-emerald-500" />
                    {record.receiverName}
                  </div>
                </div>
              </div>

              <div>
                <p className="text-xs font-semibold text-slate-400 uppercase mb-2">Item Terlampir</p>
                <div className="space-y-1">
                  {record.items.map((item, idx) => (
                    <div key={idx} className="flex justify-between items-center p-2 bg-slate-50 rounded-lg text-sm border border-slate-100">
                      <span className="text-slate-700 font-medium">{item.itemName}</span>
                      <span className="font-bold text-slate-900">{item.quantity} Qty</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="bg-indigo-50/50 p-5 rounded-xl border border-indigo-100 flex flex-col h-full">
              <div className="flex items-center gap-2 mb-3">
                <Sparkles size={18} className="text-indigo-600" />
                <h4 className="text-sm font-bold text-indigo-900">AI Report Summary</h4>
              </div>
              <p className="text-sm text-indigo-800/80 italic leading-relaxed flex-1">
                "{record.aiSummary || 'No summary available.'}"
              </p>
              <button className="mt-4 flex items-center gap-2 text-xs font-bold text-indigo-600 hover:text-indigo-700">
                <FileText size={14} /> Download Berita Acara (PDF)
              </button>
            </div>
          </div>
        </div>
      ))}

      {history.length === 0 && (
        <div className="bg-white p-20 rounded-2xl border border-dashed border-slate-200 text-center">
          <p className="text-slate-400">Belum ada riwayat transaksi handover.</p>
        </div>
      )}
    </div>
  );
};

export default HandoverHistory;
