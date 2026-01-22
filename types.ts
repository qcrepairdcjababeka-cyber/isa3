
export type SlocType = '1000' | '1001';

export interface InventoryItem {
  id: string;
  name: string;
  category: string;
  quantity: number;
  unit: string;
  sloc: SlocType;
  lastUpdated: string;
}

export interface HandoverRecord {
  id: string;
  date: string;
  fromSloc: SlocType;
  toSloc: SlocType;
  items: {
    itemId: string;
    itemName: string;
    quantity: number;
  }[];
  receiverName: string;
  senderName: string;
  status: 'Draft' | 'Completed';
  aiSummary?: string;
}

export type ViewType = 'dashboard' | 'inventory' | 'handover' | 'history';
