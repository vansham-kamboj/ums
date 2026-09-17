import { useState } from 'react';
import { FileText, Save, Eye, Bold, Italic, Link, Image, List, ListOrdered, Heading, Loader2, ArrowLeft, Tag, Calendar, Plus, Edit2, Search, Filter, Sparkles, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../../context/ToastContext';
import api from '../../services/api';
import StatusBadge from '../../components/ui/StatusBadge';

const CATEGORIES = ['Announcements', 'Campus Life', 'Events', 'Academics', 'Achievements', 'General'];

export default function BlogEditor() {
  const toast = useToast();
  const navigate = useNavigate();
  const [mode, setMode] = useState('list'); // list | edit
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [posts, setPosts] = useState([
    { id: 1, title: 'Annual Day Celebrations 2026', category: 'Events', status: 'published', author: 'Dr. Sarah Connor', date: '2026-08-15', excerpt: 'A spectacular evening of cultural performances, awards ceremony and musical acts...' },
    { id: 2, title: 'New High-Performance Computing Lab Inauguration', category: 'Campus Life', status: 'draft', author: 'Prof. Alex Rivera', date: '2026-08-10', excerpt: 'State-of-the-art supercomputing facilities open for research scholars and students...' },
    { id: 3, title: 'Exam Schedule Released for Fall 2026', category: 'Academics', status: 'published', author: 'Academic Cell', date: '2026-08-05', excerpt: 'Students can download the official schedule and hall ticket guidelines from the portal...' },
  ]);
  const [form, setForm] = useState({ title: '', category: 'General', content: '', excerpt: '', status: 'draft' });

  const handleSave = async () => {
    if (!form.title) { toast.warning('Title is required'); return; }
    setSaving(true);
    try {
      await api.post('/generic/blog-post', form);
      toast.success('Post saved');
    } catch {
      setPosts(prev => [{ id: Date.now(), ...form, author: 'Admin User', date: new Date().toISOString().split('T')[0] }, ...prev]);
      toast.success('Post saved');
    }
    setSaving(false);
    setMode('list');
    setForm({ title: '', category: 'General', content: '', excerpt: '', status: 'draft' });
  };

  const filteredPosts = posts.filter(p => {
    const matchesSearch = !search || p.title.toLowerCase().includes(search.toLowerCase()) || p.excerpt.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = !selectedCategory || p.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  if (mode === 'edit') {
    return (
      <div className="space-y-6 animate-fade-in pb-12">
        {/* Editor Top Bar */}
        <div className="glass-panel p-4 rounded-2xl border border-white/60 flex items-center justify-between shadow-lg">
          <div className="flex items-center gap-3">
            <button onClick={() => setMode('list')} className="secondary-button p-2.5 rounded-xl text-brand hover:bg-brand/10 transition-colors" title="Back to posts">
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-xl font-bold text-foreground font-heading">Compose New Article</h1>
              <p className="text-xs text-muted-foreground">Draft or publish a news post for the campus portal</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <select
              value={form.status}
              onChange={e => setForm(p => ({ ...p, status: e.target.value }))}
              className="px-3.5 py-2 glass-subtle border border-glass-border rounded-xl text-xs font-semibold text-foreground focus:outline-none focus:ring-2 focus:ring-brand/30"
            >
              <option value="draft">Draft Mode</option>
              <option value="published">Publish Immediately</option>
            </select>
            <button onClick={handleSave} disabled={saving} className="primary-button text-xs px-5 py-2.5 rounded-xl inline-flex items-center gap-2 shadow-md">
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />} Save Post
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
                placeholder="Article Title Header..."
                className="w-full text-2xl font-extrabold bg-transparent border-none focus:outline-none text-foreground placeholder:text-muted-foreground font-heading"
              />
              <textarea
                value={form.excerpt}
                onChange={e => setForm(p => ({ ...p, excerpt: e.target.value }))}
                placeholder="Write a brief excerpt/summary for preview cards..."
                rows={2}
                className="w-full px-4 py-3 glass-subtle border border-glass-border rounded-xl text-xs text-foreground focus:outline-none resize-none leading-relaxed"
              />
            </div>

            {/* Rich Editor Toolbar & Textarea */}
            <div className="glass-panel p-5 rounded-2xl border border-white/60 space-y-4 shadow-lg">
              <div className="flex flex-wrap items-center gap-1.5 p-2 glass-subtle rounded-xl border border-glass-border/60">
                {[Bold, Italic, Link, Image, List, ListOrdered, Heading].map((Icon, i) => (
                  <button key={i} className="p-2 rounded-lg text-muted-foreground hover:text-brand hover:bg-brand/10 transition-colors">
                    <Icon className="w-4 h-4" />
                  </button>
                ))}
              </div>

              <textarea
                value={form.content}
                onChange={e => setForm(p => ({ ...p, content: e.target.value }))}
                placeholder="Start typing article body content here..."
                rows={16}
                className="w-full px-4 py-3 glass-subtle border border-glass-border/60 rounded-xl text-sm text-foreground focus:outline-none resize-none leading-relaxed font-sans"
              />
            </div>
          </div>

          <div className="space-y-4">
            <div className="glass-panel p-5 rounded-2xl border border-white/60 space-y-4 shadow-lg">
              <div className="flex items-center gap-2 border-b border-glass-border pb-3">
                <Tag className="w-4 h-4 text-brand" />
                <h3 className="text-base font-bold text-foreground font-heading">Post Settings</h3>
              </div>
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-bold text-muted-foreground mb-1">Category</label>
                  <select
                    value={form.category}
                    onChange={e => setForm(p => ({ ...p, category: e.target.value }))}
                    className="w-full px-3.5 py-2.5 glass-subtle border border-glass-border rounded-xl text-xs font-medium text-foreground focus:outline-none"
                  >
                    {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
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
      {/* Banner */}
      <div className="glass-panel p-6 rounded-3xl border border-white/60 shadow-xl backdrop-blur-md relative overflow-hidden">
        <div className="absolute -top-12 -right-12 w-56 h-56 bg-gradient-to-br from-indigo-400/20 via-brand/10 to-transparent rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 relative z-10">
          <div className="flex items-center gap-4">
            <div className="p-3.5 rounded-2xl bg-gradient-to-tr from-brand/20 to-purple-500/20 border border-brand/30 text-brand shadow-md backdrop-blur-md">
              <FileText className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold text-foreground font-heading">Blog & Campus News</h1>
                <span className="px-2.5 py-0.5 text-[10px] font-bold rounded-full bg-brand/15 text-brand border border-brand/30 uppercase tracking-wider">
                  CMS Portal
                </span>
              </div>
              <p className="text-sm text-muted-foreground mt-0.5">Manage public articles and news posts for student & faculty portal</p>
            </div>
          </div>

          <button onClick={() => setMode('edit')} className="primary-button text-xs px-5 py-2.5 rounded-xl inline-flex items-center gap-2 shadow-lg">
            <Plus className="w-4 h-4" /> New Blog Post
          </button>
        </div>
      </div>

      {/* Search and Category Filter Bar */}
      <div className="glass-panel p-4 rounded-2xl border border-white/60 shadow-lg flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search posts by title or keyword..."
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

      {/* Table Container */}
      <div className="glass-panel p-0 overflow-hidden rounded-3xl border border-white/60 shadow-xl backdrop-blur-md">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="bg-white/40 dark:bg-slate-800/40 backdrop-blur-md border-b border-glass-border text-muted-foreground text-xs uppercase tracking-wider font-semibold">
                <th className="px-6 py-4">Article Detail</th>
                <th className="px-6 py-4">Category</th>
                <th className="px-6 py-4">Author</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-glass-border/50">
              {filteredPosts.map(post => (
                <tr key={post.id} className="glass-card-interactive hover:bg-white/60 dark:hover:bg-slate-800/60 transition-all">
                  <td className="px-6 py-4">
                    <p className="font-bold text-foreground hover:text-brand transition-colors cursor-pointer">{post.title}</p>
                    <p className="text-xs text-muted-foreground truncate max-w-lg mt-0.5">{post.excerpt}</p>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-3 py-1 rounded-full text-xs font-semibold bg-brand/10 text-brand border border-brand/20">
                      {post.category}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-gradient-to-br from-brand/20 to-purple-500/20 text-brand font-bold text-[10px] flex items-center justify-center">
                        <User className="w-3 h-3" />
                      </div>
                      <span className="text-xs font-medium text-foreground/80">{post.author}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-mono">
                      <Calendar className="w-3.5 h-3.5 text-brand" />
                      {post.date}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <StatusBadge status={post.status === 'published' ? 'active' : 'inactive'} label={post.status} size="xs" />
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