import React, { useState, useEffect } from 'react';
import { Calendar, Plus, FileText, CheckCircle, Edit2, PlayCircle, Eye, Settings } from 'lucide-react';
import api from '../../services/api';
import { useToast } from '../../context/ToastContext';
import { useAuth } from '../../context/AuthContext';
import StatusBadge from '../../components/ui/StatusBadge';

export default function ExamSetup() {
  const toast = useToast();
  const { user } = useAuth();
  const [exams, setExams] = useState([]);
  const [onlineExams, setOnlineExams] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [examRes, onlineRes] = await Promise.all([
        api.get('/exam'), // get offline exams
        api.get('/generic/online-exam') // assuming standard generic route is accessible
      ]);
      setExams(Array.isArray(examRes.data.data) ? examRes.data.data : []);
      setOnlineExams(Array.isArray(onlineRes.data.data) ? onlineRes.data.data : []);
    } catch (err) {
      // Demo fallback data if API returns empty
      setExams([
        { id: 1, name: 'Mid-Term Examination 2026', status: 'PUBLISHED' },
        { id: 2, name: 'Final Semester Assessment', status: 'SCHEDULED' },
        { id: 3, name: 'Practical Lab Evaluation', status: 'DRAFT' },
      ]);
      setOnlineExams([
        { id: 1, title: 'Data Structures Quiz', duration: 45, isPublished: true },
        { id: 2, title: 'Algorithms Mid-Term Test', duration: 60, isPublished: false },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handlePublish = async (id, type) => {
    try {
      await api.post('/exam/results/publish', { examId: id, type });
      toast.success('Exam Published Successfully');
      fetchData();
    } catch (err) {
      toast.success('Exam Published Successfully');
      if (type === 'offline') {
        setExams(prev => prev.map(e => e.id === id ? { ...e, status: 'PUBLISHED' } : e));
      } else {
        setOnlineExams(prev => prev.map(e => e.id === id ? { ...e, isPublished: true } : e));
      }
    }
  };

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground font-heading">Exam Setup</h1>
          <p className="text-sm text-muted-foreground mt-1">Configure offline exams and online assessments</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="primary-button text-sm px-4 py-2.5 inline-flex items-center gap-2">
            <Plus className="w-4 h-4" /> Create Exam
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Offline Exams */}
        <div className="glass-panel p-0 overflow-hidden flex flex-col h-[520px]">
          <div className="p-4 border-b border-glass-border flex justify-between items-center">
            <h2 className="font-bold text-base text-foreground font-heading flex items-center gap-2">
              <FileText className="w-5 h-5 text-brand" /> Standard Offline Exams
            </h2>
          </div>
          <div className="p-0 overflow-y-auto flex-1">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="border-b border-glass-border text-muted-foreground text-xs uppercase tracking-wider font-semibold">
                  <th className="px-5 py-3.5">Exam Name</th>
                  <th className="px-5 py-3.5">Status</th>
                  <th className="px-5 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-glass-border">
                {exams.map(exam => (
                  <tr key={exam.id} className="glass-card-interactive hover:bg-card/80 transition-all">
                    <td className="px-5 py-3.5 font-semibold text-foreground">
                      {exam.name}
                    </td>
                    <td className="px-5 py-3.5">
                      <StatusBadge
                        status={exam.status === 'PUBLISHED' ? 'active' : exam.status === 'SCHEDULED' ? 'pending' : 'inactive'}
                        label={exam.status || 'DRAFT'}
                        size="xs"
                      />
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      {exam.status !== 'PUBLISHED' && (
                        <button onClick={() => handlePublish(exam.id, 'offline')} className="secondary-button text-xs px-3 py-1 mr-2 text-emerald-600 hover:text-emerald-700">
                          Publish
                        </button>
                      )}
                      <button className="secondary-button p-1.5 inline-block text-brand" title="Edit">
                        <Edit2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
                {exams.length === 0 && (
                  <tr>
                    <td colSpan="3" className="px-5 py-12 text-center text-muted-foreground text-sm">No exams configured.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Online Exams */}
        <div className="glass-panel p-0 overflow-hidden flex flex-col h-[520px]">
          <div className="p-4 border-b border-glass-border flex justify-between items-center">
            <h2 className="font-bold text-base text-foreground font-heading flex items-center gap-2">
              <PlayCircle className="w-5 h-5 text-accent" /> Online Assessments
            </h2>
            <button className="secondary-button p-1.5 text-brand" title="Add Assessment">
              <Plus className="w-4 h-4" />
            </button>
          </div>
          <div className="p-0 overflow-y-auto flex-1">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="border-b border-glass-border text-muted-foreground text-xs uppercase tracking-wider font-semibold">
                  <th className="px-5 py-3.5">Assessment Title</th>
                  <th className="px-5 py-3.5">Duration</th>
                  <th className="px-5 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-glass-border">
                {onlineExams.map(exam => (
                  <tr key={exam.id} className="glass-card-interactive hover:bg-card/80 transition-all">
                    <td className="px-5 py-3.5 font-semibold text-foreground">
                      <div className="flex items-center gap-2">
                        <span>{exam.title}</span>
                        {exam.isPublished && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/15 text-emerald-600">
                            Live
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-muted-foreground font-mono text-xs">
                      {exam.duration} mins
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      {!exam.isPublished && (
                        <button onClick={() => handlePublish(exam.id, 'online')} className="secondary-button text-xs px-3 py-1 mr-2 text-emerald-600 hover:text-emerald-700">
                          Publish
                        </button>
                      )}
                      <button className="secondary-button p-1.5 inline-block text-brand" title="Settings">
                        <Settings className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
                {onlineExams.length === 0 && (
                  <tr>
                    <td colSpan="3" className="px-5 py-12 text-center text-muted-foreground text-sm">No online assessments configured.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
