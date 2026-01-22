
import { InventoryItem, HandoverRecord } from './types';

export const INITIAL_INVENTORY: InventoryItem[] = [
  { id: 'ITM001', name: 'MacBook Pro M2', category: 'Laptop', quantity: 15, unit: 'Unit', sloc: '1000', lastUpdated: '2023-10-25' },
  { id: 'ITM002', name: 'Dell UltraSharp Monitor', category: 'Monitor', quantity: 20, unit: 'Unit', sloc: '1000', lastUpdated: '2023-10-24' },
  { id: 'ITM003', name: 'Logitech MX Master 3S', category: 'Peripheral', quantity: 50, unit: 'Unit', sloc: '1001', lastUpdated: '2023-10-20' },
  { id: 'ITM004', name: 'Mechanical Keyboard G-Pro', category: 'Peripheral', quantity: 30, unit: 'Unit', sloc: '1001', lastUpdated: '2023-10-21' },
  { id: 'ITM005', name: 'Cisco Router ASR1000', category: 'Networking', quantity: 5, unit: 'Unit', sloc: '1000', lastUpdated: '2023-10-22' },
  { id: 'ITM006', name: 'Ubiquiti Access Point', category: 'Networking', quantity: 12, unit: 'Unit', sloc: '1001', lastUpdated: '2023-10-23' },
];

export const INITIAL_HANDOVERS: HandoverRecord[] = [
  {
    id: 'HND-2023-001',
    date: '2023-10-26 10:00',
    fromSloc: '1000',
    toSloc: '1001',
    items: [
      { itemId: 'ITM001', itemName: 'MacBook Pro M2', quantity: 5 }
    ],
    receiverName: 'Budi Santoso',
    senderName: 'Andi Pratama',
    status: 'Completed',
    aiSummary: 'Handover of 5 high-end laptops for regional marketing team expansion.'
  }
];
