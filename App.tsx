
import React, { useState } from 'react';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import InventoryTable from './components/InventoryTable';
import HandoverForm from './components/HandoverForm';
import HandoverHistory from './components/HandoverHistory';
import { ViewType, InventoryItem, HandoverRecord } from './types';
import { INITIAL_INVENTORY, INITIAL_HANDOVERS } from './constants';

const App: React.FC = () => {
  const [activeView, setActiveView] = useState<ViewType>('dashboard');
  const [inventory, setInventory] = useState<InventoryItem[]>(INITIAL_INVENTORY);
  const [handoverHistory, setHandoverHistory] = useState<HandoverRecord[]>(INITIAL_HANDOVERS);

  const handleAddHandover = (newRecord: HandoverRecord) => {
    // 1. Update Inventory State
    const updatedInventory = [...inventory];
    
    newRecord.items.forEach(hItem => {
      // Deduct from sender SLOC
      const senderIdx = updatedInventory.findIndex(i => i.id === hItem.itemId && i.sloc === newRecord.fromSloc);
      if (senderIdx !== -1) {
        updatedInventory[senderIdx].quantity -= hItem.quantity;
      }

      // Add to receiver SLOC
      const receiverIdx = updatedInventory.findIndex(i => i.id === hItem.itemId && i.sloc === newRecord.toSloc);
      if (receiverIdx !== -1) {
        updatedInventory[receiverIdx].quantity += hItem.quantity;
      } else {
        // If item doesn't exist in target SLOC yet, create it (simplified logic)
        const sourceItem = inventory.find(i => i.id === hItem.itemId);
        if (sourceItem) {
          updatedInventory.push({
            ...sourceItem,
            id: sourceItem.id, // In a real app we might handle collisions differently
            sloc: newRecord.toSloc,
            quantity: hItem.quantity,
            lastUpdated: new Date().toISOString().split('T')[0]
          });
        }
      }
    });

    setInventory(updatedInventory);
    setHandoverHistory([...handoverHistory, newRecord]);
    
    // Switch to history view after success
    setTimeout(() => {
      setActiveView('history');
    }, 2500);
  };

  const renderView = () => {
    switch (activeView) {
      case 'dashboard':
        return <Dashboard inventory={inventory} />;
      case 'inventory':
        return <InventoryTable inventory={inventory} />;
      case 'handover':
        return <HandoverForm inventory={inventory} onAddHandover={handleAddHandover} />;
      case 'history':
        return <HandoverHistory history={handoverHistory} />;
      default:
        return <Dashboard inventory={inventory} />;
    }
  };

  return (
    <Layout activeView={activeView} setActiveView={setActiveView}>
      {renderView()}
    </Layout>
  );
};

export default App;
