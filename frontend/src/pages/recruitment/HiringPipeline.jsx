import { useState } from 'react';
import { Briefcase, Users, Plus, Search, ChevronRight, Clock, CheckCircle, XCircle, User, Mail, Phone, Calendar, MapPin, Star, Filter, GripVertical, ArrowRight, Eye, MessageSquare, Loader2 } from 'lucide-react';
import { useToast } from '../../context/ToastContext';
import Modal from '../../components/ui/Modal';
import StatusBadge from '../../components/ui/StatusBadge';

const PIPELINE_STAGES = [
  { key: 'applied', label: 'Applied', color: 'bg-sky-500/15 text-sky-600 border-sky-500/30' },
  { key: 'screening', label: 'Screening', color: 'bg-amber-500/15 text-amber-600 border-amber-500/30' },
  { key: 'interview', label: 'Interview', color: 'bg-brand/15 text-brand border-brand/30' },
  { key: 'offer', label: 'Offer', color: 'bg-emerald-500/15 text-emerald-600 border-emerald-500/30' },
  { key: 'hired', label: 'Hired', color: 'bg-emerald-600/15 text-emerald-700 border-emerald-600/30' },
  { key: 'rejected', label: 'Rejected', color: 'bg-rose-500/15 text-rose-600 border-rose-500/30' },
];

const DEMO_VACANCIES = [
  { id: 1, title: 'Assistant Professor - Computer Science', department: 'CS', positions: 2, applicants: 14, status: 'open', posted: '2026-07-15' },
  { id: 2, title: 'Lab Technician - Electronics', department: 'EE', positions: 1, applicants: 8, status: 'open', posted: '2026-08-01' },
  { id: 3, title: 'Administrative Officer', department: 'Admin', positions: 1, applicants: 22, status: 'open', posted: '2026-07-20' },
  { id: 4, title: 'Professor - Mechanical Engineering', department: 'ME', positions: 1, applicants: 6, status: 'closed', posted: '2026-06-10' },
];

const DEMO_CANDIDATES = [
  { id: 1, name: 'Dr. Arun Mehta', email: 'arun.m@email.com', phone: '9876543210', vacancy: 'Asst. Prof - CS', stage: 'interview', rating: 4, applied: '2026-08-05', experience: '5 years', education: 'Ph.D Computer Science' },
  { id: 2, name: 'Priya Narayanan', email: 'priya.n@email.com', phone: '9876543211', vacancy: 'Asst. Prof - CS', stage: 'screening', rating: 3, applied: '2026-08-08', experience: '3 years', education: 'M.Tech Computer Science' },
  { id: 3, name: 'Rohit Verma', email: 'rohit.v@email.com', phone: '9876543212', vacancy: 'Lab Tech - EE', stage: 'applied', rating: 0, applied: '2026-08-12', experience: '2 years', education: 'B.Tech Electronics' },
  { id: 4, name: 'Sneha Kapoor', email: 'sneha.k@email.com', phone: '9876543213', vacancy: 'Admin Officer', stage: 'offer', rating: 5, applied: '2026-07-25', experience: '8 years', education: 'MBA' },
  { id: 5, name: 'Vikash Jain', email: 'vikash.j@email.com', phone: '9876543214', vacancy: 'Admin Officer', stage: 'interview', rating: 4, applied: '2026-07-28', experience: '6 years', education: 'MBA HR' },
  { id: 6, name: 'Kavita Singh', email: 'kavita.s@email.com', phone: '9876543215', vacancy: 'Asst. Prof - CS', stage: 'applied', rating: 0, applied: '2026-08-15', experience: '4 years', education: 'M.Tech AI/ML' },
  { id: 7, name: 'Amit Chauhan', email: 'amit.c@email.com', phone: '9876543216', vacancy: 'Prof - ME', stage: 'hired', rating: 5, applied: '2026-06-15', experience: '12 years', education: 'Ph.D Mechanical' },
  { id: 8, name: 'Deepa Rao', email: 'deepa.r@email.com', phone: '9876543217', vacancy: 'Admin Officer', stage: 'rejected', rating: 2, applied: '2026-07-22', experience: '1 year', education: 'BBA' },
];

export default function HiringPipeline() {
  const toast = useToast();
  const [view, setView] = useState('pipeline'); // pipeline | list | vacancies
  const [candidates, setCandidates] = useState(DEMO_CANDIDATES);
  const [vacancies] = useState(DEMO_VACANCIES);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [search, setSearch] = useState('');

  const filteredCandidates = candidates.filter(c =>
    !search || c.name.toLowerCase().includes(search.toLowerCase()) || c.vacancy.toLowerCase().includes(search.toLowerCase())
  );

  const moveStage = (candidateId, newStage) => {
    setCandidates(prev => prev.map(c => c.id === candidateId ? { ...c, stage: newStage } : c));
    toast.success(`Candidate moved to ${newStage}`);
  };

  // Pipeline / Kanban view
  const pipelineView = (
    <div className="flex gap-4 overflow-x-auto pb-4 min-h-[420px]">
      {PIPELINE_STAGES.filter(s => s.key !== 'rejected').map(stage => {
        const stageCandidates = filteredCandidates.filter(c => c.stage === stage.key);
        return (
          <div key={stage.key} className="flex-shrink-0 w-72">
            <div className={`px-3.5 py-2.5 rounded-t-2xl border ${stage.color} text-xs font-bold uppercase tracking-wider flex items-center justify-between`}>
              <span>{stage.label}</span>
              <span className="w-5 h-5 rounded-full glass-panel flex items-center justify-center text-xs font-bold">{stageCandidates.length}</span>
            </div>
            <div className="glass-panel border-t-0 rounded-t-none p-3 space-y-3 min-h-[340px]">
              {stageCandidates.map(c => (
                <div
                  key={c.id}
                  onClick={() => setSelectedCandidate(c)}
                  className="glass-card-interactive p-3 rounded-xl border border-glass-border/70 hover:shadow-lg transition-all cursor-pointer group"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <div className="brand-mark w-8 h-8 rounded-xl flex items-center justify-center text-white text-xs font-bold font-heading shadow-sm">
                      {c.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-foreground truncate group-hover:text-brand transition-colors">{c.name}</p>
                      <p className="text-[11px] text-muted-foreground truncate">{c.vacancy}</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between pt-2 border-t border-glass-border/40">
                    <div className="flex gap-0.5">
                      {[1, 2, 3, 4, 5].map(s => (
                        <Star key={s} className={`w-3 h-3 ${s <= c.rating ? 'text-amber-500 fill-amber-500' : 'text-muted-foreground/30'}`} />
                      ))}
                    </div>
                    <span className="text-[11px] text-muted-foreground font-medium">{c.experience}</span>
                  </div>
                </div>
              ))}
              {stageCandidates.length === 0 && (
                <div className="py-12 text-center text-xs text-muted-foreground font-medium">No candidates</div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );

  // Vacancies list view
  const vacanciesView = (
    <div className="glass-panel p-0 divide-y divide-glass-border overflow-hidden">
      {vacancies.map(v => (
        <div key={v.id} className="px-5 py-4 glass-card-interactive hover:bg-card/80 transition-colors flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="brand-mark w-10 h-10 rounded-xl flex items-center justify-center text-white text-xs font-bold font-heading shadow-sm">
              <Briefcase className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-foreground">{v.title}</h3>
              <p className="text-xs text-muted-foreground">{v.department} • {v.positions} position{v.positions > 1 ? 's' : ''} • Posted {v.posted}</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-xs font-semibold text-brand">{v.applicants} Applicants</span>
            <StatusBadge status={v.status === 'open' ? 'active' : 'inactive'} label={v.status} />
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground font-heading">Recruitment & Hiring</h1>
          <p className="text-sm text-muted-foreground mt-1">Track job openings and candidate hiring pipeline</p>
        </div>
        <div className="flex gap-2">
          <div className="flex glass-subtle rounded-xl border border-glass-border p-1">
            <button
              onClick={() => setView('pipeline')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${view === 'pipeline' ? 'bg-brand text-white shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}
            >
              Pipeline
            </button>
            <button
              onClick={() => setView('vacancies')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${view === 'vacancies' ? 'bg-brand text-white shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}
            >
              Vacancies
            </button>
          </div>
          <button className="primary-button text-sm px-4 py-2.5 inline-flex items-center gap-2">
            <Plus className="w-4 h-4" /> Post Vacancy
          </button>
        </div>
      </div>

      {/* Search Header */}
      <div className="glass-panel p-4">
        <div className="relative max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search candidates or job titles..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 glass-subtle rounded-xl text-sm placeholder:text-muted-foreground text-foreground focus:outline-none focus:ring-2 focus:ring-brand/30"
          />
        </div>
      </div>

      {view === 'pipeline' ? pipelineView : vacanciesView}

      {/* Candidate Modal */}
      <Modal open={!!selectedCandidate} onClose={() => setSelectedCandidate(null)} title="Candidate Details">
        {selectedCandidate && (
          <div className="space-y-4">
            <div className="glass-panel p-4 space-y-3">
              <div className="flex items-center gap-3 border-b border-glass-border pb-3">
                <div className="brand-mark w-12 h-12 rounded-xl flex items-center justify-center text-white text-base font-bold font-heading shadow-sm">
                  {selectedCandidate.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <h3 className="text-base font-bold text-foreground">{selectedCandidate.name}</h3>
                  <p className="text-xs text-muted-foreground">{selectedCandidate.vacancy} • {selectedCandidate.education}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div><span className="text-muted-foreground">Email:</span> <p className="font-semibold text-foreground">{selectedCandidate.email}</p></div>
                <div><span className="text-muted-foreground">Phone:</span> <p className="font-semibold text-foreground">{selectedCandidate.phone}</p></div>
                <div><span className="text-muted-foreground">Experience:</span> <p className="font-semibold text-foreground">{selectedCandidate.experience}</p></div>
                <div><span className="text-muted-foreground">Applied On:</span> <p className="font-semibold text-foreground">{selectedCandidate.applied}</p></div>
              </div>

              <div className="pt-2 border-t border-glass-border">
                <label className="block text-xs font-semibold text-muted-foreground mb-1">Current Stage</label>
                <select
                  value={selectedCandidate.stage}
                  onChange={e => moveStage(selectedCandidate.id, e.target.value)}
                  className="w-full px-3 py-2 glass-subtle border border-glass-border rounded-xl text-sm text-foreground focus:outline-none"
                >
                  {PIPELINE_STAGES.map(s => <option key={s.key} value={s.key}>{s.label}</option>)}
                </select>
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <button onClick={() => setSelectedCandidate(null)} className="secondary-button text-xs px-4 py-2">Close</button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}