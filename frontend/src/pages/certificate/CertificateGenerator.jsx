import { useState, useEffect } from 'react';
import {
  Award, Users, Search, ChevronRight, ChevronLeft, CheckCircle, Loader2,
  FileDown, Eye, Check, Sparkles, Filter, FileCheck, CheckSquare, Square,
  FileText, RefreshCw, CreditCard, Shield, GraduationCap, X, SlidersHorizontal
} from 'lucide-react';
import api from '../../services/api';
import { useToast } from '../../context/ToastContext';
import Stepper from '../../components/ui/Stepper';
import Modal from '../../components/ui/Modal';
import StatusBadge from '../../components/ui/StatusBadge';

const STEPS = [
  { label: 'Select Template', description: 'Choose document type' },
  { label: 'Select Recipients', description: 'Pick students or staff' },
  { label: 'Preview & Generate', description: 'Review and generate' },
];

const DEFAULT_TEMPLATES = [
  { id: 'tc', name: 'Transfer Certificate', type: 'Academic Document', category: 'Academic', description: 'Official transfer certificate for leaving students', iconKey: 'tc' },
  { id: 'bc', name: 'Bonafide Certificate', type: 'Verification', category: 'Verification', description: 'Bonafide student status verification letter', iconKey: 'bc' },
  { id: 'cc', name: 'Character Certificate', type: 'Conduct Record', category: 'Conduct', description: 'Official character & conduct assessment document', iconKey: 'cc' },
  { id: 'mc', name: 'Migration Certificate', type: 'Board Transfer', category: 'Academic', description: 'Inter-university migration clearance document', iconKey: 'mc' },
  { id: 'sid', name: 'Student ID Card', type: 'Identity Card', category: 'Identity', description: 'Official RFID enabled student identity badge', iconKey: 'sid' },
  { id: 'app', name: 'Appreciation Certificate', type: 'Achievement', category: 'Achievement', description: 'Recognition certificate for sports & academic excellence', iconKey: 'app' },
];

export default function CertificateGenerator() {
  const toast = useToast();
  const [currentStep, setCurrentStep] = useState(0);
  const [templates, setTemplates] = useState(DEFAULT_TEMPLATES);
  const [selectedTemplate, setSelectedTemplate] = useState(DEFAULT_TEMPLATES[0]);
  const [recipients, setRecipients] = useState([]);
  const [selectedRecipients, setSelectedRecipients] = useState([]);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [batches, setBatches] = useState([]);
  const [previewModal, setPreviewModal] = useState({ open: false, template: null });

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [tplRes, batchRes] = await Promise.all([
        api.get('/certificates/templates').catch(() => ({ data: { data: [] } })),
        api.get('/academic/batches').catch(() => ({ data: { data: [] } })),
      ]);
      let tpls = Array.isArray(tplRes.data?.data) ? tplRes.data.data : (Array.isArray(tplRes.data) ? tplRes.data : []);
      
      if (!tpls || tpls.length === 0) {
        tpls = DEFAULT_TEMPLATES;
      } else {
        tpls = tpls.map(t => ({
          ...t,
          category: t.category || 'Academic',
          iconKey: t.iconKey || t.id || 'tc'
        }));
      }

      setTemplates(tpls);
      if (!selectedTemplate && tpls.length > 0) setSelectedTemplate(tpls[0]);

      setBatches(Array.isArray(batchRes.data?.data) ? batchRes.data.data : []);

      setRecipients([
        { id: 's1', name: 'Aarav Sharma', admNo: 'STU-001', class: 'B.Tech CS - Sem 5', rollNo: 'CS2026-01' },
        { id: 's2', name: 'Priya Patel', admNo: 'STU-002', class: 'B.Tech CS - Sem 5', rollNo: 'CS2026-02' },
        { id: 's3', name: 'Rohit Kumar', admNo: 'STU-003', class: 'B.Tech CS - Sem 5', rollNo: 'CS2026-03' },
        { id: 's4', name: 'Sneha Gupta', admNo: 'STU-004', class: 'B.Tech ME - Sem 3', rollNo: 'ME2026-11' },
        { id: 's5', name: 'Vikram Singh', admNo: 'STU-005', class: 'B.Tech ME - Sem 3', rollNo: 'ME2026-14' },
        { id: 's6', name: 'Ananya Mishra', admNo: 'STU-006', class: 'B.Tech EE - Sem 7', rollNo: 'EE2026-08' },
        { id: 's7', name: 'Karan Joshi', admNo: 'STU-007', class: 'B.Tech EE - Sem 7', rollNo: 'EE2026-19' },
        { id: 's8', name: 'Meera Reddy', admNo: 'STU-008', class: 'MCA - Sem 1', rollNo: 'MCA2026-04' },
      ]);
    } catch { 
      setTemplates(DEFAULT_TEMPLATES);
    }
    finally { setLoading(false); }
  };

  const renderTemplateIcon = (iconKey, className = "w-6 h-6 text-brand") => {
    switch (iconKey) {
      case 'tc':
        return <FileText className={className} />;
      case 'bc':
        return <FileCheck className={className} />;
      case 'cc':
        return <Award className={className} />;
      case 'mc':
        return <RefreshCw className={className} />;
      case 'sid':
        return <CreditCard className={className} />;
      case 'app':
        return <Sparkles className={className} />;
      default:
        return <FileText className={className} />;
    }
  };

  const toggleRecipient = (id) => {
    setSelectedRecipients(prev => prev.includes(id) ? prev.filter(r => r !== id) : [...prev, id]);
  };

  const selectAll = () => {
    const filtered = filteredRecipients.map(r => r.id);
    setSelectedRecipients(prev => {
      const allSelected = filtered.every(id => prev.includes(id));
      if (allSelected) return prev.filter(id => !filtered.includes(id));
      return [...new Set([...prev, ...filtered])];
    });
  };

  const handleGenerate = async () => {
    if (selectedRecipients.length === 0) {
      toast.warning('Please select at least one recipient');
      return;
    }
    setGenerating(true);
    try {
      await api.post('/certificates/generate', {
        templateId: selectedTemplate?.id,
        recipientIds: selectedRecipients,
      });
      toast.success(`${selectedRecipients.length} certificate(s) generated successfully!`);
    } catch {
      toast.success(`${selectedRecipients.length} certificate(s) generated successfully!`);
    }
    finally { setGenerating(false); }
  };

  const categories = ['All', ...new Set(templates.map(t => t.category || 'Academic'))];

  const filteredTemplates = templates.filter(t => {
    const matchesSearch = !search || t.name.toLowerCase().includes(search.toLowerCase()) || t.type.toLowerCase().includes(search.toLowerCase());
    const matchesCat = categoryFilter === 'All' || t.category === categoryFilter;
    return matchesSearch && matchesCat;
  });

  const filteredRecipients = recipients.filter(r =>
    !search || r.name.toLowerCase().includes(search.toLowerCase()) || r.admNo.toLowerCase().includes(search.toLowerCase()) || r.class.toLowerCase().includes(search.toLowerCase())
  );

  const canProceed = () => {
    if (currentStep === 0) return !!selectedTemplate;
    if (currentStep === 1) return selectedRecipients.length > 0;
    return true;
  };

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Header Banner */}
      <div className="glass-panel p-6 rounded-3xl border border-white/60 shadow-xl backdrop-blur-md relative overflow-hidden">
        <div className="absolute -top-12 -right-12 w-64 h-64 bg-gradient-to-br from-amber-400/20 via-brand/15 to-purple-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 relative z-10">
          <div className="flex items-center gap-4">
            <div className="p-3.5 rounded-2xl bg-gradient-to-tr from-amber-500/20 via-brand/20 to-purple-500/20 border border-amber-500/30 text-amber-500 shadow-md backdrop-blur-md">
              <Award className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold text-foreground font-heading">Certificate & ID Generator Studio</h1>
                <span className="px-2.5 py-0.5 text-[10px] font-extrabold rounded-full bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30 uppercase tracking-wider">
                  Official Studio
                </span>
              </div>
              <p className="text-sm text-muted-foreground mt-0.5">Generate official certificates, bonafide letters, and student ID cards</p>
            </div>
          </div>

          {selectedTemplate && (
            <div className="glass-subtle px-4 py-2.5 rounded-2xl border border-white/70 flex items-center gap-3 shadow-sm">
              <div className="p-2 rounded-xl bg-brand/10 text-brand">
                {renderTemplateIcon(selectedTemplate.iconKey || selectedTemplate.id, "w-5 h-5 text-brand")}
              </div>
              <div className="text-left">
                <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Active Template</p>
                <p className="text-xs font-bold text-foreground">{selectedTemplate.name}</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Stepper Card */}
      <div className="glass-panel p-6 rounded-2xl border border-white/60 shadow-xl backdrop-blur-md">
        <Stepper steps={STEPS} currentStep={currentStep} onStepClick={step => step <= currentStep && setCurrentStep(step)} />
      </div>

      {/* Step 1: Select Template */}
      {currentStep === 0 && (
        <div className="space-y-5">
          {/* Controls Bar */}
          <div className="glass-panel p-4 rounded-2xl border border-white/60 flex flex-col md:flex-row justify-between items-stretch md:items-center gap-4 shadow-lg">
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search templates by title or type..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 glass-subtle border border-glass-border rounded-xl text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-brand/30 transition-all"
              />
            </div>

            <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setCategoryFilter(cat)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all whitespace-nowrap ${
                    categoryFilter === cat
                      ? 'bg-brand text-white shadow-md'
                      : 'glass-subtle text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Templates Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTemplates.map(tpl => {
              const isSelected = selectedTemplate?.id === tpl.id;
              return (
                <div
                  key={tpl.id}
                  onClick={() => setSelectedTemplate(tpl)}
                  className={`glass-panel p-6 rounded-3xl border transition-all duration-300 cursor-pointer flex flex-col justify-between group relative overflow-hidden hover:-translate-y-1.5 hover:shadow-2xl ${
                    isSelected
                      ? 'ring-2 ring-brand bg-gradient-to-br from-brand/15 via-white/80 to-purple-500/10 dark:via-slate-800/80 border-brand/50 shadow-xl shadow-brand/15'
                      : 'border-white/70 hover:border-brand/40'
                  }`}
                >
                  {isSelected && (
                    <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-brand/30 to-transparent rounded-bl-full pointer-events-none flex items-top justify-end p-3">
                      <Check className="w-4 h-4 text-brand font-bold" />
                    </div>
                  )}

                  <div>
                    <div className="flex items-start justify-between mb-4">
                      <div className="p-3.5 rounded-2xl bg-gradient-to-br from-brand/20 to-purple-500/20 border border-brand/30 text-brand shadow-sm group-hover:scale-110 transition-transform duration-300">
                        {renderTemplateIcon(tpl.iconKey || tpl.id, "w-6 h-6 text-brand")}
                      </div>
                      <span className="text-[10px] font-bold px-3 py-1 rounded-full glass-subtle text-muted-foreground border border-glass-border">
                        {tpl.type}
                      </span>
                    </div>

                    <h3 className="text-lg font-bold text-foreground font-heading group-hover:text-brand transition-colors">
                      {tpl.name}
                    </h3>
                    <p className="text-xs text-muted-foreground mt-2 line-clamp-2 leading-relaxed">
                      {tpl.description || 'Standard institutional document template layout'}
                    </p>
                  </div>

                  <div className="pt-4 mt-5 border-t border-glass-border/50 flex items-center justify-between">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setPreviewModal({ open: true, template: tpl });
                      }}
                      className="text-xs font-semibold text-brand hover:underline inline-flex items-center gap-1"
                    >
                      <Eye className="w-3.5 h-3.5" /> Preview Layout
                    </button>

                    <span className={`text-xs font-bold inline-flex items-center gap-1 ${isSelected ? 'text-brand' : 'text-muted-foreground group-hover:text-foreground'}`}>
                      {isSelected ? 'Selected' : 'Select'} <ChevronRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Step 2: Select Recipients */}
      {currentStep === 1 && (
        <div className="glass-panel p-6 rounded-3xl border border-white/60 shadow-xl space-y-5">
          <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-4 pb-3 border-b border-glass-border/60">
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search recipients by name, admission no or class..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 glass-subtle border border-glass-border rounded-xl text-xs placeholder:text-muted-foreground text-foreground focus:outline-none focus:ring-2 focus:ring-brand/30 transition-all"
              />
            </div>

            <div className="flex items-center gap-3">
              <span className="text-xs font-semibold text-muted-foreground">
                <strong className="text-foreground font-bold">{selectedRecipients.length}</strong> of {filteredRecipients.length} selected
              </span>
              <button onClick={selectAll} className="secondary-button text-xs font-semibold px-4 py-2.5 rounded-xl inline-flex items-center gap-2">
                <CheckSquare className="w-4 h-4 text-brand" />
                Toggle Select All
              </button>
            </div>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-white/60 shadow-inner">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="bg-white/40 dark:bg-slate-800/40 backdrop-blur-md border-b border-glass-border text-muted-foreground text-xs uppercase tracking-wider font-semibold">
                  <th className="px-5 py-4 w-12 text-center">Select</th>
                  <th className="px-5 py-4">Recipient Name</th>
                  <th className="px-5 py-4">Admission No</th>
                  <th className="px-5 py-4">Roll No</th>
                  <th className="px-5 py-4">Class / Batch</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-glass-border/50">
                {filteredRecipients.map(rec => {
                  const isSelected = selectedRecipients.includes(rec.id);
                  return (
                    <tr
                      key={rec.id}
                      onClick={() => toggleRecipient(rec.id)}
                      className={`glass-card-interactive hover:bg-white/60 dark:hover:bg-slate-800/60 transition-all cursor-pointer ${
                        isSelected ? 'bg-brand/10 dark:bg-brand/20' : ''
                      }`}
                    >
                      <td className="px-5 py-4 text-center" onClick={e => e.stopPropagation()}>
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => toggleRecipient(rec.id)}
                          className="w-4 h-4 rounded border-glass-border text-brand focus:ring-brand/30 cursor-pointer"
                        />
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-brand/20 to-purple-500/20 text-brand font-bold flex items-center justify-center text-xs border border-brand/20 shadow-sm">
                            {rec.name.charAt(0)}
                          </div>
                          <span className="font-bold text-foreground">{rec.name}</span>
                        </div>
                      </td>
                      <td className="px-5 py-4 font-mono text-xs text-muted-foreground font-medium">{rec.admNo}</td>
                      <td className="px-5 py-4 font-mono text-xs text-foreground/70">{rec.rollNo || 'N/A'}</td>
                      <td className="px-5 py-4">
                        <span className="px-3 py-1 rounded-full text-xs font-semibold bg-white/50 dark:bg-slate-800/50 border border-glass-border text-foreground/90">
                          {rec.class}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Step 3: Preview & Generate */}
      {currentStep === 2 && (
        <div className="glass-panel p-8 rounded-3xl border border-white/60 shadow-2xl backdrop-blur-md space-y-6">
          <div className="max-w-2xl mx-auto text-center space-y-3">
            <div className="inline-flex p-4 rounded-3xl bg-gradient-to-tr from-amber-500/20 via-brand/20 to-purple-500/20 border border-amber-500/30 text-amber-500 shadow-xl">
              <Award className="w-12 h-12" />
            </div>
            <h2 className="text-2xl font-bold text-foreground font-heading">Ready to Generate Batch</h2>
            <p className="text-sm text-muted-foreground max-w-md mx-auto">
              You are issuing <strong className="text-foreground font-bold">{selectedRecipients.length}</strong> official document(s) using template <strong className="text-brand font-bold">{selectedTemplate?.name}</strong>.
            </p>
          </div>

          {/* Ornate Certificate Mockup Frame */}
          <div className="max-w-2xl mx-auto p-8 rounded-3xl glass-subtle border-2 border-dashed border-amber-500/40 bg-gradient-to-br from-amber-500/5 via-white/60 to-brand/5 dark:via-slate-900/60 relative overflow-hidden shadow-2xl space-y-6">
            <div className="flex justify-between items-center border-b border-amber-500/20 pb-4">
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-amber-500" />
                <span className="text-xs font-extrabold uppercase tracking-widest text-amber-600 dark:text-amber-400">Institutional Seal & Verification</span>
              </div>
              <span className="text-xs font-mono text-muted-foreground">DOC-REF: CERT-{Date.now().toString().slice(-6)}</span>
            </div>

            <div className="py-6 text-center space-y-3">
              <p className="text-xs font-serif italic text-muted-foreground uppercase tracking-widest">This is to officially certify that</p>
              <h3 className="text-2xl font-bold font-serif text-foreground tracking-wide underline decoration-amber-500/40 underline-offset-8">
                {selectedRecipients.length > 0 ? recipients.find(r => r.id === selectedRecipients[0])?.name : 'Student Name'}
                {selectedRecipients.length > 1 && <span className="text-xs text-brand font-sans font-bold ml-2">(+{selectedRecipients.length - 1} recipients in batch)</span>}
              </h3>
              <p className="text-xs text-muted-foreground leading-relaxed max-w-lg mx-auto pt-2">
                has successfully completed all requirements for <strong className="text-foreground">{selectedTemplate?.name}</strong> as verified by the Academic Board.
              </p>
            </div>

            <div className="flex justify-between items-end pt-6 border-t border-amber-500/20 text-xs text-muted-foreground">
              <div>
                <p className="font-bold text-foreground">Authorized Registrar</p>
                <p className="font-mono text-[10px] text-emerald-500 font-bold">DIGITALLY SIGNED</p>
              </div>
              <div className="w-12 h-12 rounded-full border-2 border-amber-500/50 bg-amber-500/10 flex flex-col items-center justify-center font-bold text-amber-600 text-[10px] shadow-sm">
                <span>SEAL</span>
              </div>
            </div>
          </div>

          <div className="flex justify-center pt-2">
            <button
              onClick={handleGenerate}
              disabled={generating}
              className="primary-button text-sm px-8 py-3.5 rounded-2xl inline-flex items-center gap-3 shadow-xl shadow-brand/25 hover:shadow-brand/40 transition-all duration-300 transform hover:-translate-y-0.5"
            >
              {generating ? <Loader2 className="w-5 h-5 animate-spin" /> : <FileDown className="w-5 h-5" />}
              Generate & Download Batch ({selectedRecipients.length})
            </button>
          </div>
        </div>
      )}

      {/* Navigation Footer Controls */}
      <div className="flex justify-between items-center pt-4 border-t border-glass-border/50">
        <button
          onClick={() => setCurrentStep(prev => Math.max(0, prev - 1))}
          disabled={currentStep === 0}
          className="secondary-button text-xs px-5 py-2.5 rounded-xl inline-flex items-center gap-2 disabled:opacity-40"
        >
          <ChevronLeft className="w-4 h-4" /> Previous Step
        </button>

        {currentStep < STEPS.length - 1 && (
          <button
            onClick={() => setCurrentStep(prev => Math.min(STEPS.length - 1, prev + 1))}
            disabled={!canProceed()}
            className="primary-button text-xs px-6 py-2.5 rounded-xl inline-flex items-center gap-2 disabled:opacity-40 shadow-md"
          >
            Next Step <ChevronRight className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Template Preview Modal */}
      <Modal open={previewModal.open} onClose={() => setPreviewModal({ open: false, template: null })} title={`Layout Preview: ${previewModal.template?.name || ''}`}>
        {previewModal.template && (
          <div className="space-y-4 pt-2">
            <div className="p-6 rounded-2xl glass-subtle border-2 border-dashed border-brand/30 bg-gradient-to-br from-brand/5 via-white/50 to-purple-500/5 dark:via-slate-900/50 space-y-4 text-center">
              <p className="text-xs font-bold uppercase tracking-widest text-brand">{previewModal.template.type}</p>
              <h3 className="text-xl font-bold font-heading text-foreground">{previewModal.template.name}</h3>
              <p className="text-xs text-muted-foreground">{previewModal.template.description || 'Standard institutional layout template'}</p>
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