import { useState, useEffect } from 'react';
import { Building2, Layers, FolderTree, Plus, Edit2, Trash2, Search, ChevronRight, Loader2, X } from 'lucide-react';
import api from '../../services/api';
import { useToast } from '../../context/ToastContext';
import Modal from '../../components/ui/Modal';
import EmptyState from '../../components/ui/EmptyState';
import StatusBadge from '../../components/ui/StatusBadge';

function QuickForm({ fields, onSubmit, onCancel, loading, title }) {
  const [formData, setFormData] = useState({});
  return (
    <div className="space-y-4">
      {fields.map(f => (
        <div key={f.name}>
          <label className="block text-sm font-medium text-text-secondary mb-1.5">{f.label}{f.required && <span className="text-danger-600 ml-0.5">*</span>}</label>
          {f.type === 'api-select' ? (
            <select value={formData[f.name] || ''} onChange={e => setFormData(prev => ({ ...prev, [f.name]: e.target.value }))}
              className="w-full px-4 py-2.5 bg-bg border border-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-brand-600/20 focus:border-brand-500">
              <option value="">Select {f.label}</option>
              {(f.options || []).map(o => <option key={o.id} value={o.id}>{o.name}</option>)}
            </select>
          ) : (
            <input type={f.type || 'text'} value={formData[f.name] || ''} onChange={e => setFormData(prev => ({ ...prev, [f.name]: e.target.value }))}
              placeholder={f.placeholder || f.label} required={f.required}
              className="w-full px-4 py-2.5 bg-bg border border-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-brand-600/20 focus:border-brand-500" />
          )}
        </div>
      ))}
      <div className="flex justify-end gap-3 pt-2">
        <button onClick={onCancel} className="px-4 py-2 text-sm font-medium text-text-secondary hover:bg-bg rounded-md transition-colors">Cancel</button>
        <button onClick={() => onSubmit(formData)} disabled={loading}
          className="px-4 py-2 bg-brand-600 hover:bg-brand-500 text-white text-sm font-medium rounded-md disabled:opacity-50 transition-colors inline-flex items-center gap-2">
          {loading && <Loader2 className="w-4 h-4 animate-spin" />}
          Save
        </button>
      </div>
    </div>
  );
}

export default function ProgramDepartments() {
  const toast = useToast();
  const [programTypes, setProgramTypes] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [programs, setPrograms] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedType, setSelectedType] = useState(null);
  const [modal, setModal] = useState({ open: false, type: null });
  const [saving, setSaving] = useState(false);

  useEffect(() => { fetchAll(); }, []);

  const fetchAll = async () => {
    setLoading(true);
    try {
      const [ptRes, deptRes, progRes, empRes] = await Promise.all([
        api.get('/academic/program-types'),
        api.get('/academic/departments'),
        api.get('/academic/programs'),
        api.get('/employee/employees').catch(() => api.get('/employees/directory')).catch(() => ({ data: { data: [] } })),
      ]);
      setProgramTypes(Array.isArray(ptRes.data.data) ? ptRes.data.data : []);
      setDepartments(Array.isArray(deptRes.data.data) ? deptRes.data.data : []);
      setPrograms(Array.isArray(progRes.data.data) ? progRes.data.data : []);
      const empList = Array.isArray(empRes.data?.data) ? empRes.data.data : [];
      setEmployees(empList.map(e => ({ id: e.id, name: `${e.firstName || ''} ${e.lastName || ''}`.trim() || e.email || 'Employee' })));
    } catch { toast.error('Failed to load academic data'); }
    finally { setLoading(false); }
  };

  const handleCreate = async (entity, data) => {
    setSaving(true);
    try {
      const payload = { ...data };
      if (payload.duration) payload.duration = parseInt(payload.duration) || 4;
      if (payload.totalSemesters) payload.totalSemesters = parseInt(payload.totalSemesters) || 8;
      const endpoints = { 'program-type': '/academic/program-types', department: '/academic/departments', program: '/academic/programs' };
      await api.post(endpoints[entity], payload);
      toast.success(`${entity.replace('-', ' ')} created successfully`);
      setModal({ open: false, type: null });
      fetchAll();
    } catch (err) { toast.error(err.response?.data?.message || 'Failed to create'); }
    finally { setSaving(false); }
  };

  const filteredPrograms = programs.filter(p => {
    if (selectedType && p.programTypeId !== selectedType) return false;
    if (search && !p.name.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const getTypePrograms = (typeId) => programs.filter(p => p.programTypeId === typeId);

  if (loading) {
    return (
      <div className="space-y-6 animate-fade-in">
        <div className="h-8 w-64 bg-bg rounded-md animate-shimmer" />
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {[1,2,3,4].map(i => <div key={i} className="h-48 bg-bg rounded-md animate-shimmer" />)}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground font-heading">Programs & Departments</h1>
          <p className="text-sm text-muted-foreground mt-1">Manage top-level departments, degree programs, and program types</p>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={() => setModal({ open: true, type: 'department' })}
            className="secondary-button">
            <Building2 className="w-4 h-4" /> Add Department
          </button>
          <button onClick={() => setModal({ open: true, type: 'program' })}
            className="primary-button">
            <Plus className="w-4 h-4" /> Add Program
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left: Program Types sidebar */}
        <div className="lg:col-span-1">
          <div className="glass-panel overflow-hidden">
            <div className="p-4 border-b border-glass-border flex justify-between items-center">
              <h2 className="font-semibold text-foreground text-sm flex items-center gap-2 font-heading">
                <Layers className="w-4 h-4 text-brand" /> Program Types
              </h2>
              <button onClick={() => setModal({ open: true, type: 'program-type' })}
                className="p-1 text-muted-foreground hover:text-foreground transition-colors">
                <Plus className="w-4 h-4" />
              </button>
            </div>
            <div className="divide-y divide-glass-border">
              <button onClick={() => setSelectedType(null)}
                className={`w-full px-4 py-3 text-left text-sm transition-colors duration-150 flex items-center justify-between ${
                  !selectedType ? 'nav-item-active font-semibold' : 'text-foreground/80 hover:bg-white/40 dark:hover:bg-white/10'
                }`}>
                <span>All Types</span>
                <span className={`text-xs rounded-full px-2 py-0.5 font-medium ${!selectedType ? 'bg-white/20 text-white' : 'glass-subtle text-muted-foreground'}`}>{programs.length}</span>
              </button>
              {programTypes.map(pt => (
                <button key={pt.id} onClick={() => setSelectedType(pt.id)}
                  className={`w-full px-4 py-3 text-left text-sm transition-colors duration-150 flex items-center justify-between ${
                    selectedType === pt.id ? 'nav-item-active font-semibold' : 'text-foreground/80 hover:bg-white/40 dark:hover:bg-white/10'
                  }`}>
                  <div>
                    <span className="block font-semibold">{pt.name}</span>
                    {pt.code && <span className={`text-xs ${selectedType === pt.id ? 'text-white/80' : 'text-muted-foreground'}`}>{pt.code}</span>}
                  </div>
                  <span className={`text-xs rounded-full px-2 py-0.5 font-medium ${selectedType === pt.id ? 'bg-white/20 text-white' : 'glass-subtle text-muted-foreground'}`}>
                    {getTypePrograms(pt.id).length}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Departments */}
          <div className="glass-panel overflow-hidden mt-4">
            <div className="p-4 border-b border-glass-border flex justify-between items-center">
              <h2 className="font-semibold text-foreground text-sm flex items-center gap-2 font-heading">
                <Building2 className="w-4 h-4 text-accent" /> Departments
              </h2>
              <button onClick={() => setModal({ open: true, type: 'department' })}
                className="p-1 text-muted-foreground hover:text-foreground transition-colors">
                <Plus className="w-4 h-4" />
              </button>
            </div>
            <div className="p-3 space-y-2">
              {departments.map(d => {
                const hodEmp = employees.find(e => e.id === d.hodId);
                return (
                  <div key={d.id} className="glass-row justify-between items-center group hover:border-brand/40 hover:bg-brand/5 hover:translate-x-1 transition-all duration-200">
                    <div className="flex items-center gap-2.5">
                      <div className="mini-avatar shrink-0">
                        {d.name.split(' ').map(p => p[0]).join('').slice(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-foreground">{d.name}</span>
                          {d.code && <span className="text-[11px] text-brand font-mono font-semibold">{d.code}</span>}
                        </div>
                        {hodEmp && <p className="text-[10px] text-muted-foreground mt-0.5 font-medium">HOD: {hodEmp.name}</p>}
                      </div>
                    </div>
                    <button className="opacity-0 group-hover:opacity-100 p-1 text-muted-foreground hover:text-brand transition-all">
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                );
              })}
              {departments.length === 0 && (
                <p className="text-center py-4 text-sm text-muted-foreground">No departments yet</p>
              )}
            </div>
          </div>
        </div>

        {/* Right: Programs grid */}
        <div className="lg:col-span-3">
          <div className="glass-panel overflow-hidden rounded-2xl border border-glass-border">
            <div className="p-4 border-b border-glass-border flex flex-wrap gap-4 items-center justify-between">
              <div className="relative flex-1 min-w-[250px]">
                <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input type="text" placeholder="Search programs..." value={search} onChange={e => setSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 glass-subtle rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-brand/30 transition-all text-foreground" />
              </div>
              <span className="text-xs text-muted-foreground font-semibold">{filteredPrograms.length} programs active</span>
            </div>

            {filteredPrograms.length === 0 ? (
              <EmptyState
                title="No programs found"
                message={search ? 'Try adjusting your search criteria.' : 'Create your first academic program to get started.'}
                icon={FolderTree}
                action={
                  <button onClick={() => setModal({ open: true, type: 'program' })}
                    className="primary-button text-xs mt-2">
                    <Plus className="w-4 h-4" /> Add Program
                  </button>
                }
              />
            ) : (
              <div className="divide-y divide-glass-border">
                {filteredPrograms.map(prog => {
                  const pType = programTypes.find(pt => pt.id === prog.programTypeId);
                  const dept = departments.find(d => d.id === prog.departmentId);
                  const initials = prog.name.split(' ').map(p => p[0]).join('').slice(0, 2).toUpperCase();
                  return (
                    <div key={prog.id} className="px-5 py-3.5 hover:bg-white/40 dark:hover:bg-white/10 transition-colors duration-150 group flex items-center justify-between cursor-pointer">
                      <div className="flex items-center gap-3.5">
                        <div className="mini-avatar shrink-0">
                          {initials}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="text-xs font-bold text-foreground font-heading">{prog.name}</h3>
                            {prog.code && <span className="text-[11px] text-brand font-mono font-semibold">{prog.code}</span>}
                          </div>
                          <div className="flex items-center gap-3 mt-1">
                            {pType && <StatusBadge status="active" label={pType.name} size="xs" />}
                            {dept && <span className="text-[11px] text-muted-foreground font-medium">Dept: {dept.name}</span>}
                            <span className="text-[11px] text-muted-foreground font-medium">• {prog.duration || 4} Years ({prog.totalSemesters || 8} Sems)</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 opacity-80 group-hover:opacity-100 transition-opacity">
                        <button className="secondary-button p-1.5"><Edit2 className="w-3.5 h-3.5 text-brand" /></button>
                        <button className="secondary-button p-1.5 text-rose-500"><Trash2 className="w-3.5 h-3.5" /></button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modals */}
      <Modal isOpen={modal.open && modal.type === 'program-type'} onClose={() => setModal({ open: false, type: null })} title="Add Program Type">
        <QuickForm fields={[
          { name: 'name', label: 'Program Type Name (e.g. UG/PG/Diploma)', required: true },
          { name: 'code', label: 'Code', required: true },
        ]} onSubmit={data => handleCreate('program-type', data)} onCancel={() => setModal({ open: false, type: null })} loading={saving} />
      </Modal>
      <Modal isOpen={modal.open && modal.type === 'department'} onClose={() => setModal({ open: false, type: null })} title="Add Department">
        <QuickForm fields={[
          { name: 'name', label: 'Department Name (e.g. School of Computer Sciences)', required: true },
          { name: 'code', label: 'Department Code (e.g. SOCS)', required: true },
          { name: 'hodId', label: 'Head of Department (HOD)', type: 'api-select', options: employees },
          { name: 'description', label: 'Description' },
        ]} onSubmit={data => handleCreate('department', data)} onCancel={() => setModal({ open: false, type: null })} loading={saving} />
      </Modal>
      <Modal isOpen={modal.open && modal.type === 'program'} onClose={() => setModal({ open: false, type: null })} title="Add Program">
        <QuickForm fields={[
          { name: 'name', label: 'Program Name (e.g. BTech)', required: true },
          { name: 'code', label: 'Program Code', required: true },
          { name: 'departmentId', label: 'Department', type: 'api-select', options: departments, required: true },
          { name: 'programTypeId', label: 'Program Type (UG/PG/Diploma)', type: 'api-select', options: programTypes, required: true },
          { name: 'duration', label: 'Duration (in Years, e.g. 4)', type: 'number', placeholder: '4' },
          { name: 'totalSemesters', label: 'Total Semesters (e.g. 8)', type: 'number', placeholder: '8' },
        ]} onSubmit={data => handleCreate('program', data)} onCancel={() => setModal({ open: false, type: null })} loading={saving} />
      </Modal>
    </div>
  );
}
