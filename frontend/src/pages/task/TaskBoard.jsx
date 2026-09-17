import { useState } from 'react';
import { ListTodo, Plus, Clock, CheckCircle, AlertCircle, User, Calendar, Flag, Search, GripVertical, MoreHorizontal, ChevronDown, Tag, Loader2, LayoutGrid, List } from 'lucide-react';
import { useToast } from '../../context/ToastContext';
import Modal from '../../components/ui/Modal';
import StatusBadge from '../../components/ui/StatusBadge';

const PRIORITIES = [
  { key: 'urgent', label: 'Urgent', color: 'bg-rose-500/15 text-rose-600 border-rose-500/30' },
  { key: 'high', label: 'High', color: 'bg-amber-500/15 text-amber-600 border-amber-500/30' },
  { key: 'medium', label: 'Medium', color: 'bg-sky-500/15 text-sky-600 border-sky-500/30' },
  { key: 'low', label: 'Low', color: 'glass-subtle text-muted-foreground border-glass-border' },
];

const COLUMNS = [
  { key: 'todo', label: 'To Do', icon: ListTodo, color: 'text-sky-600', badgeBg: 'bg-sky-500/15 text-sky-600' },
  { key: 'in_progress', label: 'In Progress', icon: Clock, color: 'text-amber-600', badgeBg: 'bg-amber-500/15 text-amber-600' },
  { key: 'review', label: 'In Review', icon: AlertCircle, color: 'text-brand', badgeBg: 'bg-brand/15 text-brand' },
  { key: 'done', label: 'Done', icon: CheckCircle, color: 'text-emerald-600', badgeBg: 'bg-emerald-500/15 text-emerald-600' },
];

const DEMO_TASKS = [
  { id: 1, title: 'Prepare mid-term exam papers', description: 'Set question papers for all CS subjects', assignee: 'Dr. Kumar', priority: 'high', status: 'in_progress', dueDate: '2026-08-25', tags: ['Exam'] },
  { id: 2, title: 'Submit annual budget proposal', description: 'Department budget for FY 2027', assignee: 'Admin Office', priority: 'urgent', status: 'todo', dueDate: '2026-08-22', tags: ['Finance'] },
  { id: 3, title: 'Update student attendance records', description: 'Compile July attendance for all batches', assignee: 'Prof. Sharma', priority: 'medium', status: 'done', dueDate: '2026-08-15', tags: ['Academic'] },
  { id: 4, title: 'Lab equipment inventory check', description: 'Physical verification of EE lab equipment', assignee: 'Lab Tech', priority: 'medium', status: 'review', dueDate: '2026-08-28', tags: ['Inventory'] },
  { id: 5, title: 'Event planning — Freshers Welcome', description: 'Coordinate with student council for event setup', assignee: 'Student Affairs', priority: 'high', status: 'todo', dueDate: '2026-09-01', tags: ['Event'] },
  { id: 6, title: 'Fix classroom AC units', description: 'Block B classrooms 201-205 AC not cooling', assignee: 'Maintenance', priority: 'urgent', status: 'in_progress', dueDate: '2026-08-21', tags: ['Maintenance'] },
  { id: 7, title: 'Publish semester results', description: 'Upload grades to student portal', assignee: 'Exam Cell', priority: 'high', status: 'todo', dueDate: '2026-08-30', tags: ['Exam'] },
  { id: 8, title: 'Library catalog digitization', description: 'Phase 2 — scan remaining 2000 books', assignee: 'Library Team', priority: 'low', status: 'in_progress', dueDate: '2026-09-15', tags: ['Library'] },
  { id: 9, title: 'Review hostel complaint logs', description: 'Respond to pending warden complaints', assignee: 'Hostel Admin', priority: 'medium', status: 'review', dueDate: '2026-08-23', tags: ['Hostel'] },
];

export default function TaskBoard() {
  const toast = useToast();
  const [tasks, setTasks] = useState(DEMO_TASKS);
  const [view, setView] = useState('board');
  const [search, setSearch] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [form, setForm] = useState({ title: '', description: '', assignee: '', priority: 'medium', dueDate: '', status: 'todo' });
  const [dragging, setDragging] = useState(null);

  const filtered = tasks.filter(t => !search || t.title.toLowerCase().includes(search.toLowerCase()) || t.assignee.toLowerCase().includes(search.toLowerCase()));

  const getPriorityConfig = (p) => PRIORITIES.find(pr => pr.key === p) || PRIORITIES[3];

  const handleAdd = () => {
    if (!form.title) { toast.warning('Title is required'); return; }
    setTasks(prev => [...prev, { id: Date.now(), ...form, tags: [] }]);
    setShowAddModal(false);
    setForm({ title: '', description: '', assignee: '', priority: 'medium', dueDate: '', status: 'todo' });
    toast.success('Task created successfully');
  };

  const moveTask = (taskId, newStatus) => {
    setTasks(prev => prev.map(t => t.id === taskId ? { ...t, status: newStatus } : t));
  };

  // Board View
  const boardView = (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 min-h-[550px]">
      {COLUMNS.map(col => {
        const colTasks = filtered.filter(t => t.status === col.key);
        return (
          <div
            key={col.key}
            className="glass-panel p-4 flex flex-col rounded-2xl border border-glass-border/80 shadow-sm"
            onDragOver={e => e.preventDefault()}
            onDrop={() => { if (dragging) { moveTask(dragging, col.key); setDragging(null); } }}
          >
            {/* Column Header */}
            <div className="flex items-center justify-between pb-3.5 border-b border-glass-border/60 mb-3">
              <div className="flex items-center gap-2">
                <col.icon className={`w-4 h-4 ${col.color}`} />
                <span className="text-xs font-bold uppercase tracking-wider text-foreground">{col.label}</span>
              </div>
              <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${col.badgeBg}`}>
                {colTasks.length}
              </span>
            </div>

            {/* Column Cards */}
            <div className="flex-1 space-y-3 min-h-[380px]">
              {colTasks.map(task => {
                const pCfg = getPriorityConfig(task.priority);
                const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && task.status !== 'done';
                return (
                  <div
                    key={task.id}
                    draggable
                    onDragStart={() => setDragging(task.id)}
                    className="bg-white/70 hover:bg-white/95 border border-white/80 rounded-2xl p-4 shadow-sm hover:shadow-md transition-all cursor-grab active:cursor-grabbing group space-y-2.5"
                  >
                    <div className="flex items-center justify-between">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${pCfg.color}`}>
                        {pCfg.label}
                      </span>
                      <button className="p-1 rounded-lg text-muted-foreground opacity-0 group-hover:opacity-100 hover:text-foreground hover:bg-black/5 transition-all">
                        <MoreHorizontal className="w-4 h-4" />
                      </button>
                    </div>

                    <div>
                      <h4 className="text-sm font-bold text-foreground leading-snug group-hover:text-brand transition-colors">
                        {task.title}
                      </h4>
                      {task.description && (
                        <p className="text-xs text-muted-foreground line-clamp-2 mt-1 leading-relaxed">
                          {task.description}
                        </p>
                      )}
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                      <div className="flex items-center gap-2">
                        <div className="brand-mark w-6 h-6 rounded-full flex items-center justify-center text-white text-[10px] font-bold shadow-xs">
                          {task.assignee.split(' ').map(n => n[0]).join('').slice(0, 2)}
                        </div>
                        <span className="text-xs font-semibold text-foreground/80 truncate max-w-[100px]">{task.assignee}</span>
                      </div>
                      {task.dueDate && (
                        <span className={`text-xs inline-flex items-center gap-1 font-mono font-medium ${isOverdue ? 'text-rose-500 font-bold' : 'text-muted-foreground'}`}>
                          <Calendar className="w-3.5 h-3.5" />
                          {new Date(task.dueDate).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })}
                        </span>
                      )}
                    </div>

                    {task.tags.length > 0 && (
                      <div className="flex gap-1.5 pt-1">
                        {task.tags.map(tag => (
                          <span key={tag} className="px-2 py-0.5 bg-slate-100/80 text-slate-600 text-[10px] font-bold rounded-md">
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
              {colTasks.length === 0 && (
                <div className="py-20 text-center text-xs text-muted-foreground font-medium">No tasks in this column</div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );

  // List View
  const listView = (
    <div className="glass-panel p-0 overflow-hidden">
      <table className="w-full text-left border-collapse text-sm">
        <thead>
          <tr className="border-b border-glass-border text-muted-foreground text-xs uppercase tracking-wider font-semibold">
            <th className="px-5 py-3.5">Task Title</th>
            <th className="px-5 py-3.5">Assignee</th>
            <th className="px-5 py-3.5">Priority</th>
            <th className="px-5 py-3.5">Due Date</th>
            <th className="px-5 py-3.5 text-center">Status</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-glass-border">
          {filtered.map(task => {
            const pCfg = getPriorityConfig(task.priority);
            return (
              <tr key={task.id} className="glass-card-interactive hover:bg-card/80 transition-all">
                <td className="px-5 py-3.5 font-bold text-foreground">{task.title}</td>
                <td className="px-5 py-3.5 text-muted-foreground font-medium">{task.assignee}</td>
                <td className="px-5 py-3.5">
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${pCfg.color}`}>{pCfg.label}</span>
                </td>
                <td className="px-5 py-3.5 font-mono text-xs text-muted-foreground">{task.dueDate}</td>
                <td className="px-5 py-3.5 text-center">
                  <StatusBadge status={task.status === 'done' ? 'active' : task.status === 'in_progress' ? 'pending' : 'inactive'} label={task.status.replace('_', ' ')} size="xs" />
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );

  return (
    <div className="space-y-6 animate-fade-in pb-12 pt-2">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground font-heading">Workflow Tasks</h1>
          <p className="text-sm text-muted-foreground mt-1">Kanban board for tracking department tasks and workflows</p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Integrated Search Input */}
          <div className="relative w-64">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search tasks or assignees..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 glass-subtle border border-glass-border rounded-xl text-sm placeholder:text-muted-foreground text-foreground focus:outline-none focus:ring-2 focus:ring-brand/30"
            />
          </div>

          <div className="flex glass-subtle rounded-xl border border-glass-border p-1">
            <button
              onClick={() => setView('board')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all inline-flex items-center gap-1.5 ${
                view === 'board' ? 'bg-brand text-white shadow-sm' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5" /> Board
            </button>
            <button
              onClick={() => setView('list')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all inline-flex items-center gap-1.5 ${
                view === 'list' ? 'bg-brand text-white shadow-sm' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <List className="w-3.5 h-3.5" /> List
            </button>
          </div>

          <button onClick={() => setShowAddModal(true)} className="primary-button text-sm px-4 py-2.5 inline-flex items-center gap-2">
            <Plus className="w-4 h-4" /> Create Task
          </button>
        </div>
      </div>

      {view === 'board' ? boardView : listView}

      {/* Create Task Modal */}
      <Modal open={showAddModal} onClose={() => setShowAddModal(false)} title="Create New Task">
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-foreground mb-1">Task Title *</label>
            <input
              type="text"
              value={form.title}
              onChange={e => setForm({ ...form, title: e.target.value })}
              placeholder="e.g. Prepare semester timetable"
              className="w-full px-3 py-2 glass-subtle border border-glass-border rounded-xl text-sm text-foreground focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-foreground mb-1">Description</label>
            <textarea
              rows={3}
              value={form.description}
              onChange={e => setForm({ ...form, description: e.target.value })}
              placeholder="Task details and expectations..."
              className="w-full px-3 py-2 glass-subtle border border-glass-border rounded-xl text-sm text-foreground focus:outline-none"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-foreground mb-1">Assignee</label>
              <input
                type="text"
                value={form.assignee}
                onChange={e => setForm({ ...form, assignee: e.target.value })}
                placeholder="Name or team"
                className="w-full px-3 py-2 glass-subtle border border-glass-border rounded-xl text-sm text-foreground focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-foreground mb-1">Priority</label>
              <select
                value={form.priority}
                onChange={e => setForm({ ...form, priority: e.target.value })}
                className="w-full px-3 py-2 glass-subtle border border-glass-border rounded-xl text-sm text-foreground focus:outline-none"
              >
                {PRIORITIES.map(p => <option key={p.key} value={p.key}>{p.label}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-foreground mb-1">Due Date</label>
            <input
              type="date"
              value={form.dueDate}
              onChange={e => setForm({ ...form, dueDate: e.target.value })}
              className="w-full px-3 py-2 glass-subtle border border-glass-border rounded-xl text-sm text-foreground focus:outline-none"
            />
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <button onClick={() => setShowAddModal(false)} className="secondary-button text-xs px-4 py-2">Cancel</button>
            <button onClick={handleAdd} className="primary-button text-xs px-4 py-2">Create Task</button>
          </div>
        </div>
      </Modal>
    </div>
  );
}