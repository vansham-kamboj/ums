import { useState, useEffect } from 'react';
import { Package, AlertTriangle, Plus, Search, ArrowUpDown, Edit2, Minus, PlusIcon, ShoppingCart, TrendingDown, Box, Loader2 } from 'lucide-react';
import api from '../../services/api';
import { useToast } from '../../context/ToastContext';
import Tabs from '../../components/ui/Tabs';
import Modal from '../../components/ui/Modal';
import StatusBadge from '../../components/ui/StatusBadge';
import EmptyState from '../../components/ui/EmptyState';

const DEMO_ITEMS = [
  { id: 1, name: 'A4 Paper Ream', category: 'Stationery', quantity: 150, reorderLevel: 50, unit: 'pcs', lastUpdated: '2026-08-18' },
  { id: 2, name: 'Whiteboard Markers', category: 'Stationery', quantity: 30, reorderLevel: 40, unit: 'pcs', lastUpdated: '2026-08-15' },
  { id: 3, name: 'Lab Beakers 250ml', category: 'Lab Equipment', quantity: 80, reorderLevel: 20, unit: 'pcs', lastUpdated: '2026-08-10' },
  { id: 4, name: 'Chairs (Student)', category: 'Furniture', quantity: 12, reorderLevel: 30, unit: 'pcs', lastUpdated: '2026-08-12' },
  { id: 5, name: 'Printer Cartridge', category: 'IT Supplies', quantity: 5, reorderLevel: 10, unit: 'pcs', lastUpdated: '2026-08-19' },
  { id: 6, name: 'Sanitizer (5L)', category: 'Hygiene', quantity: 25, reorderLevel: 10, unit: 'bottles', lastUpdated: '2026-08-14' },
  { id: 7, name: 'Projector Bulb', category: 'IT Supplies', quantity: 2, reorderLevel: 5, unit: 'pcs', lastUpdated: '2026-08-08' },
  { id: 8, name: 'Register Book', category: 'Stationery', quantity: 200, reorderLevel: 50, unit: 'pcs', lastUpdated: '2026-08-20' },
];

const DEMO_REQUISITIONS = [
  { id: 'REQ-001', requestedBy: 'Dr. Kumar (CS Dept)', items: '20x Whiteboard Markers, 5x A4 Reams', status: 'pending', date: '2026-08-20', urgency: 'normal' },
  { id: 'REQ-002', requestedBy: 'Prof. Singh (EE Dept)', items: '10x Lab Beakers, 2x Multimeters', status: 'approved', date: '2026-08-18', urgency: 'high' },
  { id: 'REQ-003', requestedBy: 'Library Dept', items: '50x Register Books', status: 'fulfilled', date: '2026-08-15', urgency: 'normal' },
  { id: 'REQ-004', requestedBy: 'Admin Office', items: '3x Printer Cartridges, 10x Sanitizer', status: 'pending', date: '2026-08-19', urgency: 'urgent' },
];

const CATEGORIES = ['All', 'Stationery', 'Lab Equipment', 'Furniture', 'IT Supplies', 'Hygiene'];

export default function InventoryDashboard() {
  const toast = useToast();
  const [items, setItems] = useState(DEMO_ITEMS);
  const [requisitions, setRequisitions] = useState(DEMO_REQUISITIONS);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showAdjustModal, setShowAdjustModal] = useState(false);
  const [adjustItem, setAdjustItem] = useState(null);
  const [adjustQty, setAdjustQty] = useState(0);
  const [form, setForm] = useState({ name: '', category: '', quantity: '', reorderLevel: '', unit: 'pcs' });

  const filteredItems = items.filter(item => {
    const matchSearch = !search || item.name.toLowerCase().includes(search.toLowerCase());
    const matchCategory = categoryFilter === 'All' || item.category === categoryFilter;
    return matchSearch && matchCategory;
  });

  const lowStockItems = items.filter(i => i.quantity <= i.reorderLevel);
  const totalValue = items.reduce((s, i) => s + i.quantity, 0);

  const handleAddItem = () => {
    if (!form.name || !form.category) { toast.warning('Fill required fields'); return; }
    setItems(prev => [...prev, {
      id: Date.now(), ...form, quantity: parseInt(form.quantity) || 0, reorderLevel: parseInt(form.reorderLevel) || 10,
      lastUpdated: new Date().toISOString().split('T')[0],
    }]);
    setShowAddModal(false);
    setForm({ name: '', category: '', quantity: '', reorderLevel: '', unit: 'pcs' });
    toast.success('Item added to inventory');
  };

  const handleAdjust = () => {
    if (!adjustItem || adjustQty === 0) return;
    setItems(prev => prev.map(i =>
      i.id === adjustItem.id ? { ...i, quantity: Math.max(0, i.quantity + adjustQty), lastUpdated: new Date().toISOString().split('T')[0] } : i
    ));
    toast.success(`Stock ${adjustQty > 0 ? 'added' : 'reduced'} for ${adjustItem.name}`);
    setShowAdjustModal(false);
    setAdjustItem(null);
    setAdjustQty(0);
  };

  const openAdjust = (item) => {
    setAdjustItem(item);
    setAdjustQty(0);
    setShowAdjustModal(true);
  };

  const stockTab = (
    <div className="space-y-4">
      {/* Category Pills & Search */}
      <div className="glass-panel p-4 flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
        <div className="flex gap-1.5 flex-wrap">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all border ${
                categoryFilter === cat
                  ? 'bg-brand text-white border-brand shadow-sm'
                  : 'glass-subtle border-glass-border text-muted-foreground hover:text-foreground'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search items..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 glass-subtle border border-glass-border rounded-xl text-sm placeholder:text-muted-foreground text-foreground focus:outline-none"
          />
        </div>
      </div>

      {/* Items Table */}
      <div className="glass-panel p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="border-b border-glass-border text-muted-foreground text-xs uppercase tracking-wider font-semibold">
                <th className="px-5 py-3.5">Item Name</th>
                <th className="px-5 py-3.5">Category</th>
                <th className="px-5 py-3.5 text-right">In Stock</th>
                <th className="px-5 py-3.5 text-right">Reorder Level</th>
                <th className="px-5 py-3.5 text-center">Status</th>
                <th className="px-5 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-glass-border">
              {filteredItems.map(item => {
                const isLow = item.quantity <= item.reorderLevel;
                return (
                  <tr key={item.id} className="glass-card-interactive hover:bg-card/80 transition-all">
                    <td className="px-5 py-3.5 font-bold text-foreground">
                      <div className="flex items-center gap-2">
                        <Box className="w-4 h-4 text-brand flex-shrink-0" />
                        <span>{item.name}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-muted-foreground font-medium text-xs">{item.category}</td>
                    <td className="px-5 py-3.5 text-right font-mono font-bold text-foreground">{item.quantity} {item.unit}</td>
                    <td className="px-5 py-3.5 text-right font-mono text-xs text-muted-foreground">{item.reorderLevel} {item.unit}</td>
                    <td className="px-5 py-3.5 text-center">
                      <StatusBadge status={isLow ? 'danger' : 'active'} label={isLow ? 'Low Stock' : 'Sufficient'} size="xs" />
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <button onClick={() => openAdjust(item)} className="secondary-button text-xs px-3 py-1 text-brand">
                        Adjust Stock
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const reqTab = (
    <div className="glass-panel p-0 overflow-hidden">
      <div className="p-4 border-b border-glass-border flex justify-between items-center">
        <h3 className="text-base font-bold text-foreground font-heading">Item Requisitions</h3>
        <span className="text-xs text-muted-foreground font-semibold">{requisitions.length} Requests</span>
      </div>
      <div className="divide-y divide-glass-border">
        {requisitions.map(req => (
          <div key={req.id} className="px-5 py-4 glass-card-interactive hover:bg-card/80 transition-all flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-sm font-bold text-foreground">{req.id}</span>
                <span className="text-xs text-muted-foreground">• {req.requestedBy}</span>
              </div>
              <p className="text-xs text-foreground/80 font-medium">{req.items}</p>
              <p className="text-[11px] text-muted-foreground mt-1">Date: {req.date}</p>
            </div>
            <StatusBadge status={req.status === 'fulfilled' ? 'active' : req.status === 'approved' ? 'pending' : 'inactive'} label={req.status} />
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground font-heading">Inventory & Stock Control</h1>
          <p className="text-sm text-muted-foreground mt-1">Manage stock items, track low stock alerts, and fulfill requisitions</p>
        </div>
        <button onClick={() => setShowAddModal(true)} className="primary-button text-sm px-4 py-2.5 inline-flex items-center gap-2">
          <Plus className="w-4 h-4" /> Add Item
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="glass-panel p-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-muted-foreground">Total Stock Items</span>
            <Package className="w-5 h-5 text-brand" />
          </div>
          <p className="text-2xl font-bold text-foreground font-heading">{items.length} SKUs</p>
          <p className="text-xs text-muted-foreground mt-1">{totalValue} Total Units</p>
        </div>

        <div className="glass-panel p-5 border border-rose-500/30 bg-rose-500/5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-muted-foreground">Low Stock Alerts</span>
            <AlertTriangle className="w-5 h-5 text-rose-500" />
          </div>
          <p className="text-2xl font-bold text-rose-500 font-heading">{lowStockItems.length} Items</p>
          <p className="text-xs text-rose-600/80 mt-1 font-semibold">Below reorder threshold</p>
        </div>

        <div className="glass-panel p-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-muted-foreground">Pending Requisitions</span>
            <ShoppingCart className="w-5 h-5 text-amber-600" />
          </div>
          <p className="text-2xl font-bold text-amber-600 font-heading">{requisitions.filter(r => r.status === 'pending').length} Orders</p>
          <p className="text-xs text-muted-foreground mt-1">Awaiting approval</p>
        </div>
      </div>

      <Tabs
        tabs={[
          { id: 'stock', label: 'Stock Items', content: stockTab },
          { id: 'reqs', label: 'Requisitions', content: reqTab },
        ]}
      />

      {/* Add Item Modal */}
      <Modal open={showAddModal} onClose={() => setShowAddModal(false)} title="Add New Stock Item">
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-foreground mb-1">Item Name *</label>
            <input
              type="text"
              value={form.name}
              onChange={e => setForm({ ...form, name: e.target.value })}
              placeholder="e.g. A4 Paper Ream"
              className="w-full px-3 py-2 glass-subtle border border-glass-border rounded-xl text-sm text-foreground focus:outline-none"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-foreground mb-1">Category *</label>
              <select
                value={form.category}
                onChange={e => setForm({ ...form, category: e.target.value })}
                className="w-full px-3 py-2 glass-subtle border border-glass-border rounded-xl text-sm text-foreground focus:outline-none"
              >
                <option value="">Select category</option>
                {CATEGORIES.filter(c => c !== 'All').map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-foreground mb-1">Unit</label>
              <input
                type="text"
                value={form.unit}
                onChange={e => setForm({ ...form, unit: e.target.value })}
                placeholder="pcs / boxes"
                className="w-full px-3 py-2 glass-subtle border border-glass-border rounded-xl text-sm text-foreground focus:outline-none"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-foreground mb-1">Initial Quantity</label>
              <input
                type="number"
                value={form.quantity}
                onChange={e => setForm({ ...form, quantity: e.target.value })}
                placeholder="0"
                className="w-full px-3 py-2 glass-subtle border border-glass-border rounded-xl text-sm text-foreground font-mono focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-foreground mb-1">Reorder Level</label>
              <input
                type="number"
                value={form.reorderLevel}
                onChange={e => setForm({ ...form, reorderLevel: e.target.value })}
                placeholder="10"
                className="w-full px-3 py-2 glass-subtle border border-glass-border rounded-xl text-sm text-foreground font-mono focus:outline-none"
              />
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <button onClick={() => setShowAddModal(false)} className="secondary-button text-xs px-4 py-2">Cancel</button>
            <button onClick={handleAddItem} className="primary-button text-xs px-4 py-2">Add Item</button>
          </div>
        </div>
      </Modal>

      {/* Adjust Stock Modal */}
      <Modal open={showAdjustModal} onClose={() => setShowAdjustModal(false)} title="Adjust Stock Quantity">
        {adjustItem && (
          <div className="space-y-4">
            <div className="glass-panel p-4 space-y-1">
              <p className="text-sm font-bold text-foreground">{adjustItem.name}</p>
              <p className="text-xs text-muted-foreground">Current Stock: <strong className="text-foreground">{adjustItem.quantity} {adjustItem.unit}</strong></p>
            </div>
            <div>
              <label className="block text-xs font-semibold text-foreground mb-1">Stock Adjustment (+ / -)</label>
              <input
                type="number"
                value={adjustQty}
                onChange={e => setAdjustQty(parseInt(e.target.value) || 0)}
                placeholder="Use +10 to add or -5 to reduce"
                className="w-full px-3 py-2 glass-subtle border border-glass-border rounded-xl text-sm text-foreground font-mono focus:outline-none"
              />
            </div>
            <div className="flex justify-end gap-2">
              <button onClick={() => setShowAdjustModal(false)} className="secondary-button text-xs px-4 py-2">Cancel</button>
              <button onClick={handleAdjust} className="primary-button text-xs px-4 py-2">Save Adjustment</button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}