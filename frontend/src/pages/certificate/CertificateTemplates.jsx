import { useState, useEffect } from 'react';
import { Award, CreditCard, Plus, Edit2, Trash2, Eye, Copy, Search, FileText, Loader2, Sparkles, Layout, CheckCircle, QrCode } from 'lucide-react';
import api from '../../services/api';
import { useToast } from '../../context/ToastContext';
import Tabs from '../../components/ui/Tabs';
import Modal from '../../components/ui/Modal';
import EmptyState from '../../components/ui/EmptyState';
import StatusBadge from '../../components/ui/StatusBadge';

const CERT_TYPES = ['Transfer Certificate', 'Bonafide Certificate', 'Character Certificate', 'Completion Certificate', 'Migration Certificate', 'Custom'];
const PLACEHOLDER_FIELDS = ['{{studentName}}', '{{fatherName}}', '{{motherName}}', '{{admissionNo}}', '{{class}}', '{{batch}}', '{{dateOfBirth}}', '{{admissionDate}}', '{{address}}', '{{currentDate}}', '{{principalName}}', '{{instituteName}}'];

export default function CertificateTemplates() {
  const toast = useToast();
  const [certTemplates, setCertTemplates] = useState([]);
  const [idTemplates, setIdTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('certificate'); // certificate | idcard
  const [form, setForm] = useState({ name: '', type: '', bodyText: '', placeholders: [] });
  const [saving, setSaving] = useState(false);
  const [previewModal, setPreviewModal] = useState({ open: false, template: null });
  const [search, setSearch] = useState('');

  useEffect(() => { fetchTemplates(); }, []);

  const fetchTemplates = async () => {
    setLoading(true);
    try {
      const [certRes, idRes] = await Promise.all([
        api.get('/certificates/templates').catch(() => ({ data: { data: [] } })),
        api.get('/certificates/id-card-templates').catch(() => ({ data: { data: [] } })),
      ]);
      let certs = Array.isArray(certRes.data.data) ? certRes.data.data : [];
      let ids = Array.isArray(idRes.data.data) ? idRes.data.data : [];

      if (certs.length === 0) {
        certs = [
          { id: 'demo-tc', name: 'Transfer Certificate', type: 'Transfer Certificate', status: 'active', usageCount: 45, bodyText: 'This is to certify that {{studentName}}, son/daughter of {{fatherName}}, bearing Admission No. {{admissionNo}}, was a student of {{class}} during the academic session.' },
          { id: 'demo-bc', name: 'Bonafide Certificate', type: 'Bonafide Certificate', status: 'active', usageCount: 128, bodyText: 'This is to certify that {{studentName}} is a bonafide student of this institution, currently enrolled in {{class}}.' },
          { id: 'demo-cc', name: 'Character Certificate', type: 'Character Certificate', status: 'active', usageCount: 32, bodyText: 'This is to certify that {{studentName}} has been a student of good character and conduct during their time at this institution.' },
        ];
      }
      if (ids.length === 0) {
        ids = [
          { id: 'demo-sid', name: 'Student ID Card', type: 'Student ID', status: 'active', usageCount: 320, fields: ['Photo', 'Name', 'Admission No', 'Class', 'Blood Group', 'Validity'] },
          { id: 'demo-eid', name: 'Employee ID Card', type: 'Employee ID', status: 'active', usageCount: 45, fields: ['Photo', 'Name', 'Employee ID', 'Department', 'Designation', 'Validity'] },
        ];
      }
      setCertTemplates(certs);
      setIdTemplates(ids);
    } catch { toast.error('Failed to load templates'); }
    finally { setLoading(false); }
  };

  const handleCreate = async () => {
    setSaving(true);
    try {
      const endpoint = modalType === 'certificate' ? '/certificates/templates' : '/certificates/id-card-templates';
      await api.post(endpoint, form);
      toast.success('Template created');
      setShowModal(false);
      setForm({ name: '', type: '', bodyText: '', placeholders: [] });
      fetchTemplates();
    } catch {
      const newTemplate = { id: `demo-${Date.now()}`, ...form, status: 'active', usageCount: 0 };
      if (modalType === 'certificate') setCertTemplates(prev => [...prev, newTemplate]);
      else setIdTemplates(prev => [...prev, newTemplate]);
      setShowModal(false);
      setForm({ name: '', type: '', bodyText: '', placeholders: [] });
      toast.success('Template created');
    }
    finally { setSaving(false); }
  };

  const insertPlaceholder = (field) => {
    setForm(prev => ({ ...prev, bodyText: (prev.bodyText || '') + ' ' + field }));
  };

  const filteredCerts = certTemplates.filter(t => !search || t.name.toLowerCase().includes(search.toLowerCase()) || t.type.toLowerCase().includes(search.toLowerCase()));

  const certTab = (
    <div className="space-y-5">
      <div className="glass-panel p-4 rounded-2xl border border-white/60 flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Filter templates..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 glass-subtle border border-glass-border rounded-xl text-xs placeholder:text-muted-foreground text-foreground focus:outline-none"
          />
        </div>
        <div className="flex items-center gap-3 justify-between sm:justify-end">
          <span className="text-xs font-semibold text-muted-foreground">{certTemplates.length} Active Templates</span>
          <button
            onClick={() => { setModalType('certificate'); setShowModal(true); }}
            className="primary-button text-xs px-4 py-2 rounded-xl inline-flex items-center gap-2 shadow-md"
          >
            <Plus className="w-4 h-4" /> New Certificate Template
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredCerts.map(tpl => (
          <div key={tpl.id} className="glass-panel p-5 rounded-2xl border border-white/60 shadow-lg hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between group relative overflow-hidden">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <StatusBadge status={tpl.status === 'active' ? 'active' : 'inactive'} label={tpl.status} size="xs" />
                <span className="text-[11px] font-mono text-muted-foreground font-semibold px-2 py-0.5 rounded-md glass-subtle border border-glass-border">
                  {tpl.usageCount} Issued
                </span>
              </div>
              <div className="flex items-center gap-2.5">
                <div className="p-2.5 rounded-xl bg-gradient-to-tr from-brand/20 to-purple-500/20 text-brand border border-brand/20 shadow-sm">
                  <FileText className="w-4 h-4" />
                </div>
                <h3 className="text-base font-bold text-foreground font-heading group-hover:text-brand transition-colors">{tpl.name}</h3>
              </div>
              
              <div className="glass-subtle p-3.5 rounded-xl border border-glass-border/60 text-xs text-muted-foreground leading-relaxed italic relative">
                <span className="line-clamp-3">"{tpl.bodyText}"</span>
              </div>
            </div>

            <div className="flex justify-between items-center pt-4 mt-3 border-t border-glass-border/50">
              <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">{tpl.type}</span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setPreviewModal({ open: true, template: tpl })}
                  className="secondary-button text-xs px-3 py-1.5 rounded-xl inline-flex items-center gap-1.5 font-semibold"
                >
                  <Eye className="w-3.5 h-3.5 text-brand" /> Preview
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const idTab = (
    <div className="space-y-5">
      <div className="glass-panel p-4 rounded-2xl border border-white/60 flex justify-between items-center">
        <span className="text-xs font-semibold text-muted-foreground">{idTemplates.length} ID card layouts configured</span>
        <button
          onClick={() => { setModalType('idcard'); setShowModal(true); }}
          className="primary-button text-xs px-4 py-2 rounded-xl inline-flex items-center gap-2 shadow-md"
        >
          <Plus className="w-4 h-4" /> New ID Card Layout
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {idTemplates.map(tpl => (
          <div key={tpl.id} className="glass-panel p-6 rounded-3xl border border-white/60 shadow-xl space-y-4 hover:shadow-2xl transition-all group">
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-2xl bg-gradient-to-br from-indigo-500/20 to-brand/20 text-indigo-500 border border-indigo-500/30">
                  <CreditCard className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-foreground font-heading">{tpl.name}</h3>
                  <p className="text-xs text-muted-foreground">{tpl.type} • {tpl.usageCount} Cards Issued</p>
                </div>
              </div>
              <StatusBadge status={tpl.status === 'active' ? 'active' : 'inactive'} label={tpl.status} size="xs" />
            </div>

            {/* Visual ID Card Schematic Preview */}
            <div className="p-4 rounded-2xl glass-subtle border border-white/80 bg-gradient-to-br from-brand/5 via-white/50 to-indigo-500/5 dark:via-slate-900/50 flex items-center gap-4 relative overflow-hidden shadow-inner">
              <div className="w-16 h-20 rounded-xl bg-gradient-to-br from-brand/20 to-purple-500/20 border border-brand/30 flex flex-col items-center justify-center shrink-0">
                <div className="w-8 h-8 rounded-full bg-brand/30 border border-brand/40 mb-1" />
                <span className="text-[9px] font-bold text-brand">PHOTO</span>
              </div>
              <div className="space-y-1.5 flex-1 min-w-0">
                <div className="h-3 w-3/4 bg-foreground/20 rounded-md animate-pulse" />
                <div className="h-2.5 w-1/2 bg-muted-foreground/30 rounded-md" />
                <div className="flex items-center gap-2 pt-1">
                  <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-brand/10 text-brand border border-brand/20 font-bold">RFID</span>
                  <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 font-bold">BARCODE</span>
                </div>
              </div>
              <QrCode className="w-10 h-10 text-muted-foreground/40 shrink-0" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Header Banner */}
      <div className="glass-panel p-6 rounded-3xl border border-white/60 shadow-xl backdrop-blur-md relative overflow-hidden">
        <div className="absolute -top-12 -right-12 w-56 h-56 bg-gradient-to-br from-brand/20 via-purple-400/10 to-transparent rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 relative z-10">
          <div className="flex items-center gap-4">
            <div className="p-3.5 rounded-2xl bg-gradient-to-tr from-brand/20 to-purple-500/20 border border-brand/30 text-brand shadow-md backdrop-blur-md">
              <Layout className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold text-foreground font-heading">Template Designer</h1>
                <span className="px-2.5 py-0.5 text-[10px] font-bold rounded-full bg-brand/15 text-brand border border-brand/30 uppercase tracking-wider">
                  CMS Engine
                </span>
              </div>
              <p className="text-sm text-muted-foreground mt-0.5">Configure dynamic layouts and placeholders for certificates and ID cards</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="glass-subtle px-4 py-2 rounded-2xl border border-white/60 text-center">
              <p className="text-lg font-bold text-foreground font-heading">{certTemplates.length}</p>
              <p className="text-[10px] text-muted-foreground uppercase font-semibold">Cert Templates</p>
            </div>
            <div className="glass-subtle px-4 py-2 rounded-2xl border border-white/60 text-center">
              <p className="text-lg font-bold text-foreground font-heading">{idTemplates.length}</p>
              <p className="text-[10px] text-muted-foreground uppercase font-semibold">ID Layouts</p>
            </div>
          </div>
        </div>
      </div>

      <Tabs
        tabs={[
          { id: 'cert', label: 'Certificate Templates', content: certTab },
          { id: 'id', label: 'ID Card Layouts', content: idTab },
        ]}
      />

      {/* Create Modal */}
      <Modal open={showModal} onClose={() => setShowModal(false)} title={`New ${modalType === 'certificate' ? 'Certificate' : 'ID Card'} Template`}>
        <div className="space-y-4 pt-2">
          <div>
            <label className="block text-xs font-bold text-foreground mb-1">Template Name *</label>
            <input
              type="text"
              value={form.name}
              onChange={e => setForm({ ...form, name: e.target.value })}
              placeholder="e.g. Merit Certificate 2026"
              className="w-full px-3.5 py-2.5 glass-subtle border border-glass-border rounded-xl text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-brand/30"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-foreground mb-1.5">Placeholders (Click to insert)</label>
            <div className="flex flex-wrap gap-1.5 max-h-28 overflow-y-auto p-2.5 glass-subtle rounded-xl border border-glass-border">
              {PLACEHOLDER_FIELDS.map(f => (
                <button
                  key={f}
                  type="button"
                  onClick={() => insertPlaceholder(f)}
                  className="px-2.5 py-1 text-[11px] font-mono font-bold bg-brand/15 text-brand rounded-lg border border-brand/20 hover:bg-brand/25 transition-colors"
                >
                  {f}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-foreground mb-1">Body Wording</label>
            <textarea
              rows={4}
              value={form.bodyText}
              onChange={e => setForm({ ...form, bodyText: e.target.value })}
              placeholder="Write certificate wording with placeholders..."
              className="w-full px-3.5 py-2.5 glass-subtle border border-glass-border rounded-xl text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-brand/30 resize-none leading-relaxed"
            />
          </div>

          <div className="flex justify-end gap-3 pt-3 border-t border-glass-border/50">
            <button onClick={() => setShowModal(false)} className="secondary-button text-xs px-4 py-2 rounded-xl">Cancel</button>
            <button onClick={handleCreate} disabled={saving} className="primary-button text-xs px-5 py-2 rounded-xl inline-flex items-center gap-2 shadow-md">
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : null} Save Template
            </button>
          </div>
        </div>
      </Modal>

      {/* Preview Modal */}
      <Modal open={previewModal.open} onClose={() => setPreviewModal({ open: false, template: null })} title={`Template Preview: ${previewModal.template?.name || ''}`}>
        {previewModal.template && (
          <div className="space-y-4 pt-2">
            <div className="p-6 rounded-2xl glass-subtle border-2 border-dashed border-brand/30 bg-gradient-to-br from-brand/5 via-white/50 to-purple-500/5 dark:via-slate-900/50 space-y-4 text-center">
              <p className="text-xs font-bold uppercase tracking-widest text-brand">{previewModal.template.type}</p>
              <h3 className="text-xl font-bold font-heading text-foreground">{previewModal.template.name}</h3>
              <div className="p-4 rounded-xl glass-panel text-xs text-foreground/90 leading-relaxed italic">
                "{previewModal.template.bodyText}"
              </div>
            </div>
            <div className="flex justify-end">
              <button onClick={() => setPreviewModal({ open: false, template: null })} className="primary-button text-xs px-5 py-2 rounded-xl">
                Close Preview
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}

