import { useState } from 'react';
import { Globe, Plus, Edit2, Eye, Trash2, Code, Layout, FileText, GripVertical, Save, Loader2, ArrowLeft, Search, Sparkles, CheckCircle2, Layers, Sliders, ExternalLink } from 'lucide-react';
import { useToast } from '../../context/ToastContext';
import StatusBadge from '../../components/ui/StatusBadge';
import Modal from '../../components/ui/Modal';

const PAGE_TEMPLATES = ['Blank', 'About Us', 'Contact', 'FAQ', 'Landing Page', 'Department'];

export default function PageBuilder() {
  const toast = useToast();
  const [mode, setMode] = useState('list');
  const [search, setSearch] = useState('');
  const [pages, setPages] = useState([
    { id: 1, title: 'Home Page', slug: '/', template: 'Landing Page', status: 'published', lastModified: '2026-08-20', views: '14.2K' },
    { id: 2, title: 'About Institution', slug: '/about', template: 'About Us', status: 'published', lastModified: '2026-08-15', views: '5.8K' },
    { id: 3, title: 'Admissions Portal', slug: '/admissions', template: 'Landing Page', status: 'published', lastModified: '2026-08-10', views: '22.1K' },
    { id: 4, title: 'Contact & Campus Map', slug: '/contact', template: 'Contact', status: 'published', lastModified: '2026-07-25', views: '3.4K' },
    { id: 5, title: 'Career & Placements', slug: '/placements', template: 'Blank', status: 'draft', lastModified: '2026-08-18', views: '0' },
  ]);
  const [form, setForm] = useState({ title: '', slug: '', template: 'Blank', content: '', status: 'draft' });
  const [saving, setSaving] = useState(false);
  const [sections, setSections] = useState([
    { id: 1, type: 'hero', title: 'Hero Banner Section', content: 'Welcome to Our Premier Institution — Empowering Future Leaders' },
    { id: 2, type: 'text', title: 'Institutional Overview', content: 'Established in 1995, delivering world-class academic programs...' },
    { id: 3, type: 'features', title: 'Key Highlights Grid', content: '3-column feature cards highlighting research, faculty & campus' },
  ]);

  const handleSave = () => {
    if (!form.title) { toast.warning('Page title is required'); return; }
    setSaving(true);
    setTimeout(() => {
      setPages(prev => [{ id: Date.now(), ...form, views: '0', lastModified: new Date().toISOString().split('T')[0] }, ...prev]);
      setMode('list');
      setForm({ title: '', slug: '', template: 'Blank', content: '', status: 'draft' });
      setSaving(false);
      toast.success('Page saved successfully');
    }, 500);
  };

  const filteredPages = pages.filter(p => !search || p.title.toLowerCase().includes(search.toLowerCase()) || p.slug.toLowerCase().includes(search.toLowerCase()));

  if (mode === 'edit') {
    return (
      <div className="space-y-6 animate-fade-in pb-12">
        {/* Top Editor Bar */}
        <div className="glass-panel p-4 rounded-2xl border border-glass-border flex items-center justify-between shadow-lg">
          <div className="flex items-center gap-3">
            <button onClick={() => setMode('list')} className="secondary-button p-2.5 rounded-xl text-brand hover:bg-brand/10 transition-colors" title="Back to pages">
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-xl font-bold text-foreground font-heading">Visual Page Builder</h1>
              <p className="text-xs text-muted-foreground">Configure page blocks, layouts and publication status</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button className="secondary-button text-xs px-4 py-2.5 rounded-xl inline-flex items-center gap-1.5">
              <Eye className="w-4 h-4 text-brand" /> Live Preview
            </button>
            <button onClick={handleSave} disabled={saving} className="primary-button text-xs px-5 py-2.5 rounded-xl inline-flex items-center gap-2 shadow-md">
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />} Save Page
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-3 space-y-4">
            <div className="glass-panel p-5 rounded-2xl border border-glass-border space-y-3 shadow-lg">
              <input
                type="text"
                value={form.title}
                onChange={e => setForm(p => ({ ...p, title: e.target.value, slug: '/' + e.target.value.toLowerCase().replace(/\s+/g, '-') }))}
                placeholder="Page Title (e.g. Campus Facilities)..."
                className="w-full text-2xl font-extrabold bg-transparent border-none focus:outline-none text-foreground placeholder:text-muted-foreground font-heading"
              />
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-md glass-subtle text-brand border border-brand/20">
                  URL: {form.slug || '/untitled-page'}
                </span>
              </div>
            </div>

            {/* Section Builder Canvas */}
            <div className="glass-panel p-5 rounded-2xl border border-glass-border space-y-4 shadow-lg">
              <div className="flex items-center justify-between border-b border-glass-border pb-3">
                <div className="flex items-center gap-2">
                  <Layers className="w-4 h-4 text-brand" />
                  <h3 className="text-base font-bold text-foreground font-heading">Page Layout Sections</h3>
                </div>
                <span className="text-xs text-muted-foreground font-semibold">{sections.length} blocks configured</span>
              </div>

              <div className="space-y-3">
                {sections.map((section) => (
                  <div key={section.id} className="glass-row group hover:border-brand/40 transition-all cursor-pointer">
                    <div className="cursor-grab text-muted-foreground hover:text-brand p-1 rounded-lg hover:bg-brand/10 transition-colors">
                      <GripVertical className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2.5 mb-1">
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-brand/10 text-brand border border-brand/20">
                          {section.type} Block
                        </span>
                        <span className="text-sm font-bold text-foreground truncate">{section.title}</span>
                      </div>
                      <p className="text-xs text-muted-foreground leading-relaxed truncate">{section.content}</p>
                    </div>
                    <div className="flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="p-1.5 rounded-lg text-muted-foreground hover:text-brand hover:bg-brand/10 transition-colors">
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button className="p-1.5 rounded-lg text-muted-foreground hover:text-brand hover:bg-brand/10 transition-colors">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}

                <button className="w-full py-4 border-2 border-dashed border-brand/30 rounded-2xl text-xs font-bold text-brand hover:bg-brand/5 hover:border-brand/60 transition-all inline-flex items-center justify-center gap-2 shadow-inner">
                  <Plus className="w-4 h-4" /> Add New Layout Block
                </button>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="glass-panel p-5 rounded-2xl border border-glass-border space-y-4 shadow-lg">
              <div className="flex items-center gap-2 border-b border-glass-border pb-3">
                <Sliders className="w-4 h-4 text-brand" />
                <h3 className="text-base font-bold text-foreground font-heading">Page Settings</h3>
              </div>
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-bold text-muted-foreground mb-1.5">Layout Template</label>
                  <select
                    value={form.template}
                    onChange={e => setForm(p => ({ ...p, template: e.target.value }))}
                    className="w-full px-3.5 py-2.5 glass-subtle border border-glass-border rounded-xl text-xs font-medium text-foreground focus:outline-none"
                  >
                    {PAGE_TEMPLATES.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-muted-foreground mb-1.5">Publication Status</label>
                  <select
                    value={form.status}
                    onChange={e => setForm(p => ({ ...p, status: e.target.value }))}
                    className="w-full px-3.5 py-2.5 glass-subtle border border-glass-border rounded-xl text-xs font-medium text-foreground focus:outline-none"
                  >
                    <option value="draft">Draft Mode</option>
                    <option value="published">Publish Live</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Header Banner */}
      <div className="glass-panel p-6 rounded-3xl border border-glass-border shadow-xl backdrop-blur-md relative overflow-hidden">
        <div className="absolute -top-12 -right-12 w-56 h-56 bg-brand/10 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 relative z-10">
          <div className="flex items-center gap-4">
            <div className="p-3.5 rounded-2xl bg-brand/10 border border-brand/20 text-brand shadow-md backdrop-blur-md">
              <Globe className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold text-foreground font-heading">Website Site Pages</h1>
                <span className="px-2.5 py-0.5 text-[10px] font-bold rounded-full bg-brand/15 text-brand border border-brand/30 uppercase tracking-wider">
                  CMS Engine
                </span>
              </div>
              <p className="text-sm text-muted-foreground mt-0.5">Manage public web pages, landing pages, and visual sections</p>
            </div>
          </div>

          <button onClick={() => setMode('edit')} className="primary-button text-xs px-5 py-2.5 rounded-xl inline-flex items-center gap-2 shadow-lg">
            <Plus className="w-4 h-4" /> New Site Page
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="glass-panel p-4 rounded-2xl border border-glass-border shadow-lg flex justify-between items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search site pages by title or URL slug..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 glass-subtle border border-glass-border rounded-xl text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-brand/30"
          />
        </div>
        <span className="text-xs font-semibold text-muted-foreground">{filteredPages.length} Pages Configured</span>
      </div>

      {/* Glass Pages Directory — Clean List View */}
      <div className="glass-panel p-5 rounded-3xl border border-glass-border shadow-xl backdrop-blur-md space-y-3">
        {filteredPages.map(page => (
          <div
            key={page.id}
            className="glass-row group hover:border-brand/40 hover:bg-brand/5 hover:translate-x-1 transition-all duration-200"
          >
            <div className="w-10 h-10 rounded-xl bg-brand/10 text-brand flex items-center justify-center border border-brand/20 shadow-sm shrink-0 group-hover:scale-105 transition-transform">
              <Globe className="w-5 h-5" />
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2.5">
                <h3 className="text-sm font-bold text-foreground group-hover:text-brand transition-colors font-heading truncate">
                  {page.title}
                </h3>
                <span className="font-mono text-[11px] font-bold text-brand bg-brand/10 px-2 py-0.5 rounded border border-brand/20 shrink-0">
                  {page.slug}
                </span>
              </div>
              <div className="flex items-center gap-4 mt-1 text-xs text-muted-foreground">
                <span>Template: <strong className="text-foreground font-semibold">{page.template}</strong></span>
                <span>•</span>
                <span>Modified: {page.lastModified}</span>
                <span>•</span>
                <span>Views: <strong className="text-foreground font-semibold">{page.views}</strong></span>
              </div>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <StatusBadge status={page.status === 'published' ? 'active' : 'draft'} label={page.status === 'published' ? 'Live' : 'Draft'} size="xs" />

              <div className="flex items-center gap-2">
                <button onClick={() => setMode('edit')} className="secondary-button text-xs px-3 py-1.5 rounded-xl inline-flex items-center gap-1.5 font-semibold">
                  <Edit2 className="w-3.5 h-3.5 text-brand" /> Edit
                </button>
                <a href={page.slug} target="_blank" rel="noreferrer" className="secondary-button text-xs px-3 py-1.5 rounded-xl inline-flex items-center gap-1.5 font-semibold">
                  <ExternalLink className="w-3.5 h-3.5 text-muted-foreground" /> Visit
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}