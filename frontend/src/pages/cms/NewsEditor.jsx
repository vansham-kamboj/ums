import { useState } from 'react';
import { Newspaper, Save, ArrowLeft, Plus, Calendar, Tag, Eye, Loader2, Edit2, Search, Zap, Star, Flame } from 'lucide-react';
import { useToast } from '../../context/ToastContext';
import StatusBadge from '../../components/ui/StatusBadge';

export default function NewsEditor() {
  const toast = useToast();
  const [mode, setMode] = useState('list');
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [articles, setArticles] = useState([
    { id: 1, title: 'University Ranks Top 10 in National Institutional Survey', category: 'Achievement', priority: 'breaking', status: 'published', date: '2026-08-18', excerpt: 'Our institution has been recognized among the top 10 universities for excellence in research, infrastructure and placement rates...' },
    { id: 2, title: 'New Merit & Need-Based Scholarship Program Launched', category: 'Announcement', priority: 'featured', status: 'published', date: '2026-08-12', excerpt: 'Financial assistance and full tuition fee waivers available for high-achieving student applicants across all undergraduate programs...' },
    { id: 3, title: 'Quantum Computing Research Paper Published in IEEE Journal', category: 'Research', priority: 'normal', status: 'draft', date: '2026-08-08', excerpt: 'Faculty members and postgraduate scholars contribute landmark findings in quantum algorithm optimization...' },
    { id: 4, title: 'Campus Sustainability & Zero-Carbon Green Initiative', category: 'Campus', priority: 'normal', status: 'published', date: '2026-07-25', excerpt: 'Green campus initiatives including solar rooftop installation and rainwater harvesting systems commissioned...' },
  ]);
  const [form, setForm] = useState({ title: '', category: 'Announcement', content: '', excerpt: '', status: 'draft', priority: 'normal' });

  const CATEGORIES = ['Achievement', 'Announcement', 'Research', 'Campus', 'Alumni', 'Placement'];

  const handleSave = () => {
    if (!form.title) { toast.warning('Headline title is required'); return; }
    setSaving(true);
    setTimeout(() => {
      setArticles(prev => [{ id: Date.now(), ...form, date: new Date().toISOString().split('T')[0] }, ...prev]);
      setMode('list');
      setForm({ title: '', category: 'Announcement', content: '', excerpt: '', status: 'draft', priority: 'normal' });
      setSaving(false);
      toast.success('News article saved successfully');
    }, 500);
  };

  const filteredArticles = articles.filter(a => {
    const matchesSearch = !search || a.title.toLowerCase().includes(search.toLowerCase()) || a.excerpt.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = !selectedCategory || a.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  if (mode === 'edit') {
    return (
      <div className="space-y-6 animate-fade-in pb-12">
        {/* Editor Top Bar */}
        <div className="glass-panel p-4 rounded-2xl border border-white/60 flex items-center justify-between shadow-lg">
          <div className="flex items-center gap-3">
            <button onClick={() => setMode('list')} className="secondary-button p-2.5 rounded-xl text-brand hover:bg-brand/10 transition-colors" title="Back to news">
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-xl font-bold text-foreground font-heading">New Press Release / News Article</h1>
              <p className="text-xs text-muted-foreground">Publish breaking news, achievements or campus announcements</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <select
              value={form.status}
              onChange={e => setForm(p => ({ ...p, status: e.target.value }))}
              className="px-3.5 py-2 glass-subtle border border-glass-border rounded-xl text-xs font-semibold text-foreground focus:outline-none focus:ring-2 focus:ring-brand/30"
            >
              <option value="draft">Save as Draft</option>
              <option value="published">Publish Now</option>
            </select>
            <button onClick={handleSave} disabled={saving} className="primary-button text-xs px-5 py-2.5 rounded-xl inline-flex items-center gap-2 shadow-md">
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />} Save Article
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            <div className="glass-panel p-5 rounded-2xl border border-white/60 space-y-4 shadow-lg">
              <input
                type="text"
                value={form.title}
                onChange={e => setForm(p => ({ ...p, title: e.target.value }))}
                placeholder="News Headline Title..."
                className="w-full text-2xl font-extrabold bg-transparent border-none focus:outline-none text-foreground placeholder:text-muted-foreground font-heading"
              />
              <textarea
                value={form.excerpt}
                onChange={e => setForm(p => ({ ...p, excerpt: e.target.value }))}
                placeholder="Brief summary for news feeds and homepage ticker..."
                rows={2}
                className="w-full px-4 py-3 glass-subtle border border-glass-border rounded-xl text-xs text-foreground focus:outline-none resize-none leading-relaxed"
              />
            </div>

            <div className="glass-panel p-5 rounded-2xl border border-white/60 space-y-4 shadow-lg">
              <label className="block text-xs font-bold text-muted-foreground">Full Article Content</label>
              <textarea
                value={form.content}
                onChange={e => setForm(p => ({ ...p, content: e.target.value }))}
                placeholder="Full news story content body..."
                rows={14}
                className="w-full px-4 py-3 glass-subtle border border-glass-border/60 rounded-xl text-sm text-foreground focus:outline-none resize-none leading-relaxed font-sans"
              />
            </div>
          </div>

          <div className="glass-panel p-5 rounded-2xl border border-white/60 space-y-5 h-fit shadow-lg">
            <h3 className="text-base font-bold text-foreground font-heading border-b border-glass-border pb-3">Article Settings</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-muted-foreground mb-1.5">Category</label>
                <select
                  value={form.category}
                  onChange={e => setForm(p => ({ ...p, category: e.target.value }))}
                  className="w-full px-3.5 py-2.5 glass-subtle border border-glass-border rounded-xl text-xs font-medium text-foreground focus:outline-none"
                >
                  {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-muted-foreground mb-1.5">Priority / Banner Highlight</label>
                <select
                  value={form.priority}
                  onChange={e => setForm(p => ({ ...p, priority: e.target.value }))}
                  className="w-full px-3.5 py-2.5 glass-subtle border border-glass-border rounded-xl text-xs font-medium text-foreground focus:outline-none"
                >
                  <option value="normal">Standard News</option>
                  <option value="featured">Featured Story (Homepage)</option>
                  <option value="breaking">Breaking News Ticker</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Banner Header */}
      <div className="glass-panel p-6 rounded-3xl border border-white/60 shadow-xl backdrop-blur-md relative overflow-hidden">
        <div className="absolute -top-12 -right-12 w-56 h-56 bg-gradient-to-br from-rose-400/20 via-brand/10 to-transparent rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 relative z-10">
          <div className="flex items-center gap-4">
            <div className="p-3.5 rounded-2xl bg-gradient-to-tr from-rose-500/20 via-brand/20 to-purple-500/20 border border-rose-500/30 text-rose-500 shadow-md backdrop-blur-md">
              <Newspaper className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold text-foreground font-heading">News & Press Releases</h1>
                <span className="px-2.5 py-0.5 text-[10px] font-bold rounded-full bg-rose-500/15 text-rose-600 dark:text-rose-400 border border-rose-500/30 uppercase tracking-wider">
                  Live Feed
                </span>
              </div>
              <p className="text-sm text-muted-foreground mt-0.5">Publish official press releases, achievements, and institutional news</p>
            </div>
          </div>

          <button onClick={() => setMode('edit')} className="primary-button text-xs px-5 py-2.5 rounded-xl inline-flex items-center gap-2 shadow-lg">
            <Plus className="w-4 h-4" /> New Article
          </button>
        </div>
      </div>

      {/* Search and Category Filter Bar */}
      <div className="glass-panel p-4 rounded-2xl border border-white/60 shadow-lg flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search news by headline..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 glass-subtle border border-glass-border rounded-xl text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-brand/30"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
          <button
            onClick={() => setSelectedCategory('')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
              !selectedCategory ? 'bg-brand text-white shadow-md' : 'glass-subtle text-muted-foreground hover:text-foreground'
            }`}
          >
            All Categories
          </button>
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all whitespace-nowrap ${
                selectedCategory === cat ? 'bg-brand text-white shadow-md' : 'glass-subtle text-muted-foreground hover:text-foreground'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Articles Glass Table */}
      <div className="glass-panel p-0 overflow-hidden rounded-3xl border border-white/60 shadow-xl backdrop-blur-md">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="bg-white/40 dark:bg-slate-800/40 backdrop-blur-md border-b border-glass-border text-muted-foreground text-xs uppercase tracking-wider font-semibold">
                <th className="px-6 py-4">Headline</th>
                <th className="px-6 py-4">Category</th>
                <th className="px-6 py-4">Priority Tag</th>
                <th className="px-6 py-4">Publish Date</th>
                <th className="px-6 py-4 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-glass-border/50">
              {filteredArticles.map(article => (
                <tr key={article.id} className="glass-card-interactive hover:bg-white/60 dark:hover:bg-slate-800/60 transition-all">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      {article.priority === 'breaking' && <Flame className="w-4 h-4 text-rose-500 animate-pulse shrink-0" />}
                      {article.priority === 'featured' && <Star className="w-4 h-4 text-amber-500 shrink-0" />}
                      <p className="font-bold text-foreground hover:text-brand transition-colors cursor-pointer">{article.title}</p>
                    </div>
                    <p className="text-xs text-muted-foreground truncate max-w-lg mt-0.5">{article.excerpt}</p>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-3 py-1 rounded-full text-xs font-semibold bg-brand/10 text-brand border border-brand/20">
                      {article.category}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    {article.priority === 'breaking' ? (
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-rose-500/15 text-rose-600 dark:text-rose-400 border border-rose-500/30 uppercase tracking-wider inline-flex items-center gap-1">
                        <Flame className="w-3 h-3" /> Breaking
                      </span>
                    ) : article.priority === 'featured' ? (
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30 uppercase tracking-wider inline-flex items-center gap-1">
                        <Star className="w-3 h-3" /> Featured
                      </span>
                    ) : (
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-slate-500/10 text-slate-600 dark:text-slate-400 border border-slate-500/20 uppercase">
                        Standard
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-mono">
                      <Calendar className="w-3.5 h-3.5 text-brand" />
                      {article.date}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <StatusBadge status={article.status === 'published' ? 'active' : 'inactive'} label={article.status} size="xs" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}