
import React, { useState } from 'react';
import { InventoryItem, HandoverRecord, SlocType } from '../types';
import { Plus, Trash2, Send, Wand2, Loader2, CheckCircle } from 'lucide-react';
import { generateHandoverSummary } from '../services/geminiService';

interface HandoverFormProps {
  inventory: InventoryItem[];
  onAddHandover: (record: HandoverRecord) => void;
}

const HandoverForm: React.FC<HandoverFormProps> = ({ inventory, onAddHandover }) => {
  const [senderName, setSenderName] = useState('');
  const [receiverName, setReceiverName] = useState('');
  const [fromSloc, setFromSloc] = useState<SlocType>('1000');
  const [toSloc, setToSloc] = useState<SlocType>('1001');
  const [selectedItems, setSelectedItems] = useState<{ itemId: string; quantity: number }[]>([]);
  const [aiLoading, setAiLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const addItem = () => {
    setSelectedItems([...selectedItems, { itemId: '', quantity: 1 }]);
  };

  const removeItem = (index: number) => {
    setSelectedItems(selectedItems.filter((_, i) => i !== index));
  };

  const updateItem = (index: number, field: string, value: string | number) => {
    const updated = [...selectedItems];
    updated[index] = { ...updated[index], [field]: value };
    setSelectedItems(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!senderName || !receiverName || selectedItems.length === 0) return;

    setAiLoading(true);
    const itemDetails = selectedItems.map(si => {
      const item = inventory.find(i => i.id === si.itemId);
      return {
        itemId: si.itemId,
        itemName: item?.name || 'Unknown',
        quantity: si.quantity
      };
    });

    const aiSummary = await generateHandoverSummary({
      senderName,
      receiverName,
      fromSloc,
      toSloc,
      items: itemDetails
    });

    const newHandover: HandoverRecord = {
      id: `HND-${Date.now()}`,
      date: new Date().toLocaleString(),
      fromSloc,
      toSloc,
      items: itemDetails,
      senderName,
      receiverName,
      status: 'Completed',
      aiSummary
    };

    onAddHandover(newHandover);
    setAiLoading(false);
    setIsSuccess(true);
    
    // Reset form after delay
    setTimeout(() => {
      setIsSuccess(false);
      setSenderName('');
      setReceiverName('');
      setSelectedItems([]);
    }, 2000);
  };

  const availableItems = inventory.filter(i => i.sloc === fromSloc);

  if (isSuccess) {
    return (
      <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-slate-200 text-center animate-in fade-in zoom-in">
        <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-6">
          <CheckCircle size={40} />
        </div>
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Serah Terima Berhasil!</h2>
        <p className="text-slate-500">Dokumen telah diarsip dan stok telah diperbarui.</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
      <div className="flex items-center gap-3 mb-8 border-b border-slate-100 pb-4">
        <Send className="text-blue-600" />
        <h3 className="text-xl font-bold">Formulir Serah Terima Barang</h3>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700">Nama Pengirim</label>
            <input
              type="text"
              required
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              placeholder="Contoh: Andi Pratama"
              value={senderName}
              onChange={(e) => setSenderName(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700">Nama Penerima</label>
            <input
              type="text"
              required
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              placeholder="Contoh: Budi Santoso"
              value={receiverName}
              onChange={(e) => setReceiverName(e.target.value)}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 bg-blue-50 rounded-2xl border border-blue-100">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-blue-800">Dari SLOC (Asal)</label>
            <select
              className="w-full p-3 bg-white border border-blue-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
              value={fromSloc}
              onChange={(e) => {
                setFromSloc(e.target.value as SlocType);
                setToSloc(e.target.value === '1000' ? '1001' : '1000');
              }}
            >
              <option value="1000">1000 (Gudang Utama)</option>
              <option value="1001">1001 (Penyimpanan Sekunder)</option>
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-blue-800">Ke SLOC (Tujuan)</label>
            <select
              className="w-full p-3 bg-white border border-blue-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
              value={toSloc}
              onChange={(e) => {
                setToSloc(e.target.value as SlocType);
                setFromSloc(e.target.value === '1000' ? '1001' : '1000');
              }}
            >
              <option value="1000">1000 (Gudang Utama)</option>
              <option value="1001">1001 (Penyimpanan Sekunder)</option>
            </select>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <label className="text-sm font-semibold text-slate-700">Daftar Barang</label>
            <button
              type="button"
              onClick={addItem}
              className="flex items-center gap-2 text-sm font-bold text-blue-600 hover:text-blue-700 bg-blue-50 px-3 py-2 rounded-lg"
            >
              <Plus size={16} /> Tambah Barang
            </button>
          </div>

          {selectedItems.map((item, index) => (
            <div key={index} className="flex gap-4 items-end animate-in slide-in-from-left-2 duration-300">
              <div className="flex-1 space-y-2">
                <select
                  required
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl"
                  value={item.itemId}
                  onChange={(e) => updateItem(index, 'itemId', e.target.value)}
                >
                  <option value="">Pilih Barang...</option>
                  {availableItems.map(inv => (
                    <option key={inv.id} value={inv.id} disabled={selectedItems.some((si, i) => si.itemId === inv.id && i !== index)}>
                      {inv.name} (Stok: {inv.quantity})
                    </option>
                  ))}
                </select>
              </div>
              <div className="w-24 space-y-2">
                <input
                  type="number"
                  min="1"
                  required
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl"
                  placeholder="Qty"
                  value={item.quantity}
                  onChange={(e) => updateItem(index, 'quantity', parseInt(e.target.value))}
                />
              </div>
              <button
                type="button"
                onClick={() => removeItem(index)}
                className="p-3 text-red-500 hover:bg-red-50 rounded-xl transition-colors"
              >
                <Trash2 size={20} />
              </button>
            </div>
          ))}
          
          {selectedItems.length === 0 && (
            <div className="p-8 text-center border-2 border-dashed border-slate-200 rounded-2xl text-slate-400">
              Belum ada barang yang ditambahkan
            </div>
          )}
        </div>

        <div className="pt-6 border-t border-slate-100">
          <button
            type="submit"
            disabled={aiLoading || selectedItems.length === 0}
            className="w-full flex items-center justify-center gap-3 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 text-white font-bold py-4 rounded-2xl transition-all shadow-lg shadow-blue-200"
          >
            {aiLoading ? (
              <>
                <Loader2 className="animate-spin" />
                Menganalisis Laporan dengan Gemini...
              </>
            ) : (
              <>
                <Wand2 size={20} />
                Proses Serah Terima & Buat Summary AI
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default HandoverForm;
