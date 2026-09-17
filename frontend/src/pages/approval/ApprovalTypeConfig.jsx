import { useState, useEffect } from 'react';
import { Settings, Plus, Edit2, Trash2, ChevronUp, ChevronDown, GripVertical, Loader2, Users, Shield } from 'lucide-react';
import api from '../../services/api';
import { useToast } from '../../context/ToastContext';
import Modal from '../../components/ui/Modal';
import EmptyState from '../../components/ui/EmptyState';

export default function ApprovalTypeConfig() {
  const toast = useToast();
  const [approvalTypes, setApprovalTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedType, setSelectedType] = useState(null);
  const [levels, setLevels] = useState([]);
  const [showTypeModal, setShowTypeModal] = useState(false);
  const [showLevelModal, setShowLevelModal] = useState(false);
  const [typeForm, setTypeForm] = useState({ name: '', module: '' });
  const [levelForm, setLevelForm] = useState({ approverRole: '', requireAll: false });
  const [saving, setSaving] = useState(false);
  const [employees, setEmployees] = useState([]);

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [typesRes, empRes] = await Promise.all([
        api.get('/approvals/types').catch(() => ({ data: { data: [] } })),
        api.get('/employees/directory').catch(() => api.get('/employees').catch(() => ({ data: { data: [] } }))),
      ]);
      const types = Array.isArray(typesRes.data.data) ? typesRes.data.data : [];
      setEmployees(Array.isArray(empRes.data.data) ? empRes.data.data : []);

      if (types.length === 0) {
        // Demo data
        const demoTypes = [
          { id: 'demo-1', name: 'Leave Approval', module: 'Leave Requests', levels: [
            { id: 'l1', sequence: 1, approverRole: 'HOD', requireAll: false },
            { id: 'l2', sequence: 2, approverRole: 'Admin', requireAll: false },
          ]},
          { id: 'demo-2', name: 'Requisition Approval', module: 'Inventory', levels: [
            { id: 'l3', sequence: 1, approverRole: 'HOD', requireAll: false },
            { id: 'l4', sequence: 2, approverRole: 'Accountant', requireAll: false },
            { id: 'l5', sequence: 3, approverRole: 'Admin', requireAll: false },
          ]},
          { id: 'demo-3', name: 'Fee Concession Approval', module: 'Fee & Finance', levels: [
            { id: 'l6', sequence: 1, approverRole: 'Accountant', requireAll: false },
            { id: 'l7', sequence: 2, approverRole: 'Admin', requireAll: true },
          ]},
        ];
        setApprovalTypes(demoTypes);
        setSelectedType(demoTypes[0]);
        setLevels(demoTypes[0].levels);
      } else {
        setApprovalTypes(types);
      }
    } catch { toast.error('Failed to load approval configuration'); }
    finally { setLoading(false); }
  };

  const handleSelectType = (type) => {
    setSelectedType(type);
    setLevels(type.levels || []);
  };

  const handleCreateType = async () => {
    setSaving(true);
    try {
      await api.post('/approvals/types', typeForm);
      toast.success('Approval type created');
      setShowTypeModal(false);
      setTypeForm({ name: '', module: '' });
      fetchData();
    } catch {
      // Demo: add locally
      const newType = { id: `demo-${Date.now()}`, ...typeForm, levels: [] };
      setApprovalTypes(prev => [...prev, newType]);
      setShowTypeModal(false);
      setTypeForm({ name: '', module: '' });
      toast.success('Approval type created');
    }
    finally { setSaving(false); }
  };

  const handleAddLevel = () => {
    const newLevel = {
      id: `lvl-${Date.now()}`,
      sequence: levels.length + 1,
      approverRole: levelForm.approverRole,
      requireAll: levelForm.requireAll,
    };
    const updatedLevels = [...levels, newLevel];
    setLevels(updatedLevels);
    if (selectedType) {
      setApprovalTypes(prev => prev.map(t => t.id === selectedType.id ? { ...t, levels: updatedLevels } : t));
    }
    setShowLevelModal(false);
    setLevelForm({ approverRole: '', requireAll: false });
    toast.success('Level added');
  };

  const moveLevel = (idx, direction) => {
    const newLevels = [...levels];
    const swapIdx = idx + direction;
    if (swapIdx < 0 || swapIdx >= newLevels.length) return;
    [newLevels[idx], newLevels[swapIdx]] = [newLevels[swapIdx], newLevels[idx]];
    newLevels.forEach((l, i) => l.sequence = i + 1);
    setLevels(newLevels);
  };

  const removeLevel = (idx) => {
    const newLevels = levels.filter((_, i) => i !== idx);
    newLevels.forEach((l, i) => l.sequence = i + 1);
    setLevels(newLevels);
    toast.success('Level removed');
  };

  const modules = ['Leave Requests', 'Inventory', 'Fee & Finance', 'Gate Pass', 'Recruitment', 'General'];
  const roles = ['Admin', 'HOD', 'Teacher', 'Accountant', 'Librarian', 'HR Manager', 'Front Office'];

  if (loading) {
    return (
      <div className="space-y-6 animate-fade-in">
        <div className="h-8 w-64 bg-bg rounded-md animate-shimmer" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="h-96 bg-bg rounded-md animate-shimmer" />
          <div className="lg:col-span-2 h-96 bg-bg rounded-md animate-shimmer" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Approval Configuration</h1>
          <p className="text-sm text-text-secondary mt-1">Configure approval types and their multi-level approval chains</p>
        </div>
        <button onClick={() => setShowTypeModal(true)}
          className="px-4 py-2.5 bg-brand-600 hover:bg-brand-500 text-white text-sm font-medium rounded-md transition-colors inline-flex items-center gap-2">
          <Plus className="w-4 h-4" /> New Approval Type
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Approval Types List */}
        <div className="bg-surface rounded-md border border-border overflow-hidden">
          <div className="p-4 border-b border-border">
            <h2 className="font-semibold text-text-primary text-sm flex items-center gap-2">
              <Settings className="w-4 h-4 text-brand-600" /> Approval Types
            </h2>
          </div>
          <div className="divide-y divide-border">
            {approvalTypes.map(type => (
              <button key={type.id} onClick={() => handleSelectType(type)}
                className={`w-full px-4 py-3.5 text-left transition-colors ${
                  selectedType?.id === type.id ? 'bg-brand-100 border-r-2 border-brand-600' : 'hover:bg-bg'
                }`}>
                <h3 className={`text-sm font-medium ${selectedType?.id === type.id ? 'text-brand-600' : 'text-text-primary'}`}>{type.name}</h3>
                <div className="flex items-center gap-3 mt-1">
                  <span className="text-xs text-text-disabled">{type.module}</span>
                  <span className="text-xs text-text-disabled">• {(type.levels || []).length} levels</span>
                </div>
              </button>
            ))}
            {approvalTypes.length === 0 && (
              <div className="p-6 text-center text-text-disabled text-sm">No approval types configured</div>
            )}
          </div>
        </div>

        {/* Levels Configuration */}
        <div className="lg:col-span-2">
          {!selectedType ? (
            <div className="bg-surface rounded-md border border-border">
              <EmptyState title="Select an approval type" message="Choose a type from the left to configure its approval levels." icon={Shield} />
            </div>
          ) : (
            <div className="bg-surface rounded-md border border-border overflow-hidden">
              <div className="p-4 border-b border-border flex items-center justify-between">
                <div>
                  <h2 className="font-semibold text-text-primary text-sm">{selectedType.name} — Approval Levels</h2>
                  <p className="text-xs text-text-disabled mt-0.5">Requests will go through these levels in order</p>
                </div>
                <button onClick={() => setShowLevelModal(true)}
                  className="px-3 py-1.5 bg-brand-600 hover:bg-brand-500 text-white text-xs font-medium rounded-md inline-flex items-center gap-1.5">
                  <Plus className="w-3.5 h-3.5" /> Add Level
                </button>
              </div>

              {levels.length === 0 ? (
                <div className="p-8 text-center">
                  <Shield className="w-8 h-8 mx-auto mb-2 text-text-disabled opacity-50" />
                  <p className="text-sm text-text-disabled">No approval levels configured yet</p>
                  <button onClick={() => setShowLevelModal(true)}
                    className="mt-3 text-sm text-brand-600 hover:text-brand-500 font-medium">Add the first level</button>
                </div>
              ) : (
                <div className="divide-y divide-border">
                  {levels.map((level, idx) => (
                    <div key={level.id} className="px-5 py-4 flex items-center justify-between group">
                      <div className="flex items-center gap-4">
                        <div className="flex flex-col gap-0.5">
                          <button onClick={() => moveLevel(idx, -1)} disabled={idx === 0}
                            className="p-0.5 text-text-disabled hover:text-text-secondary disabled:opacity-20 transition-colors">
                            <ChevronUp className="w-3.5 h-3.5" />
                          </button>
                          <button onClick={() => moveLevel(idx, 1)} disabled={idx === levels.length - 1}
                            className="p-0.5 text-text-disabled hover:text-text-secondary disabled:opacity-20 transition-colors">
                            <ChevronDown className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        <div className="w-8 h-8 rounded-full bg-brand-100 flex items-center justify-center text-brand-600 text-sm font-bold">
                          {level.sequence}
                        </div>
                        <div>
                          <h3 className="text-sm font-medium text-text-primary">{level.approverRole}</h3>
                          <p className="text-xs text-text-disabled mt-0.5">
                            {level.requireAll ? 'All approvers at this level must approve' : 'Any one approver suffices'}
                          </p>
                        </div>
                      </div>
                      <button onClick={() => removeLevel(idx)}
                        className="p-1.5 rounded-md opacity-0 group-hover:opacity-100 hover:bg-danger-50 text-text-disabled hover:text-danger-600 transition-all">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Visual Flow */}
              {levels.length > 0 && (
                <div className="px-5 py-4 border-t border-border bg-bg/30">
                  <h4 className="text-xs font-semibold text-text-disabled uppercase tracking-wider mb-3">Approval Flow</h4>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="px-2.5 py-1 bg-bg border border-border rounded-md text-xs font-medium text-text-secondary">Requester submits</span>
                    {levels.map((level, idx) => (
                      <div key={level.id} className="flex items-center gap-2">
                        <span className="text-text-disabled">→</span>
                        <span className="px-2.5 py-1 bg-brand-100 border border-brand-100 rounded-md text-xs font-medium text-brand-600">
                          L{level.sequence}: {level.approverRole}
                        </span>
                      </div>
                    ))}
                    <span className="text-text-disabled">→</span>
                    <span className="px-2.5 py-1 bg-success-100 border border-success-100 rounded-md text-xs font-medium text-success-600">Done</span>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Create Type Modal */}
      <Modal isOpen={showTypeModal} onClose={() => setShowTypeModal(false)} title="New Approval Type">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1.5">Name <span className="text-danger-600">*</span></label>
            <input type="text" value={typeForm.name} onChange={e => setTypeForm(p => ({ ...p, name: e.target.value }))}
              placeholder="e.g., Leave Approval" className="w-full px-4 py-2.5 bg-bg border border-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-brand-600/20 focus:border-brand-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1.5">Applies to Module <span className="text-danger-600">*</span></label>
            <select value={typeForm.module} onChange={e => setTypeForm(p => ({ ...p, module: e.target.value }))}
              className="w-full px-4 py-2.5 bg-bg border border-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-brand-600/20 focus:border-brand-500">
              <option value="">Select Module</option>
              {modules.map(m => <option key={m} value={m}>{m}</option>)}
            </select>
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button onClick={() => setShowTypeModal(false)} className="px-4 py-2 text-sm text-text-secondary hover:bg-bg rounded-md">Cancel</button>
            <button onClick={handleCreateType} disabled={saving || !typeForm.name || !typeForm.module}
              className="px-4 py-2 bg-brand-600 hover:bg-brand-500 text-white text-sm font-medium rounded-md disabled:opacity-50 inline-flex items-center gap-2">
              {saving && <Loader2 className="w-4 h-4 animate-spin" />} Create
            </button>
          </div>
        </div>
      </Modal>

      {/* Add Level Modal */}
      <Modal isOpen={showLevelModal} onClose={() => setShowLevelModal(false)} title="Add Approval Level">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1.5">Approver Role <span className="text-danger-600">*</span></label>
            <select value={levelForm.approverRole} onChange={e => setLevelForm(p => ({ ...p, approverRole: e.target.value }))}
              className="w-full px-4 py-2.5 bg-bg border border-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-brand-600/20 focus:border-brand-500">
              <option value="">Select Role</option>
              {roles.map(r => <option key={r} value={r}>{r}</option>)}
            </select>
          </div>
          <div className="flex items-center gap-3">
            <input type="checkbox" id="requireAll" checked={levelForm.requireAll} onChange={e => setLevelForm(p => ({ ...p, requireAll: e.target.checked }))}
              className="rounded border-border text-brand-600 focus:ring-brand-600/20" />
            <label htmlFor="requireAll" className="text-sm text-text-secondary">Require all approvers at this level to approve</label>
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button onClick={() => setShowLevelModal(false)} className="px-4 py-2 text-sm text-text-secondary hover:bg-bg rounded-md">Cancel</button>
            <button onClick={handleAddLevel} disabled={!levelForm.approverRole}
              className="px-4 py-2 bg-brand-600 hover:bg-brand-500 text-white text-sm font-medium rounded-md disabled:opacity-50">
              Add Level
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
