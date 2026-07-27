import { useState, useEffect } from 'react';
import { Plus, Search, MoreVertical, Edit2, Trash2 } from 'lucide-react';
import { academicService } from '../services/academicService';
import { useToast } from '../context/ToastContext';
import { format } from 'date-fns';

export default function AcademicSessions() {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const toast = useToast();

  useEffect(() => {
    fetchSessions();
  }, []);

  const fetchSessions = async () => {
    try {
      setLoading(true);
      const res = await academicService.getSessions();
      setSessions(res.data || []);
    } catch (error) {
      toast.error('Failed to load academic sessions');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await academicService.getSessions({ search });
      setSessions(res.data || []);
    } catch (error) {
      toast.error('Search failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-text-primary">Academic Sessions</h2>
          <p className="text-sm text-text-secondary mt-1">Manage academic years and terms</p>
        </div>
        <button className="bg-brand-600 hover:bg-brand-500 text-white px-4 py-2 rounded-md font-medium flex items-center gap-2">
          <Plus size={20} />
          New Session
        </button>
      </div>

      <div className="bg-surface rounded-md border border-border shadow-sm overflow-hidden">
        <div className="p-4 border-b border-border flex justify-between items-center bg-bg/50">
          <form onSubmit={handleSearch} className="relative w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-disabled" size={18} />
            <input 
              type="text" 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search sessions..." 
              className="w-full pl-10 pr-4 py-2 border border-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-brand-600 focus:border-brand-600"
            />
          </form>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-bg border-b border-border text-xs uppercase tracking-wider text-text-secondary font-semibold">
                <th className="px-6 py-4">Name</th>
                <th className="px-6 py-4">Start Date</th>
                <th className="px-6 py-4">End Date</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan="5" className="px-6 py-8 text-center text-text-secondary">
                    Loading sessions...
                  </td>
                </tr>
              ) : sessions.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-8 text-center text-text-secondary">
                    No academic sessions found.
                  </td>
                </tr>
              ) : (
                sessions.map((session) => (
                  <tr key={session.id} className="hover:bg-bg">
                    <td className="px-6 py-4 font-medium text-text-primary">
                      {session.name} {session.isDefault && <span className="ml-2 text-xs bg-brand-100 text-brand-700 px-2 py-0.5 rounded-full">Default</span>}
                    </td>
                    <td className="px-6 py-4 text-text-secondary">
                      {session.startDate ? format(new Date(session.startDate), 'MMM dd, yyyy') : '-'}
                    </td>
                    <td className="px-6 py-4 text-text-secondary">
                      {session.endDate ? format(new Date(session.endDate), 'MMM dd, yyyy') : '-'}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                        session.isArchived ? 'bg-bg text-text-secondary' : 'bg-green-100 text-green-700'
                      }`}>
                        {session.isArchived ? 'Archived' : 'Active'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2 text-text-disabled">
                        <button className="p-1 hover:text-brand-600 transition-colors"><Edit2 size={16} /></button>
                        <button className="p-1 hover:text-red-600 transition-colors"><Trash2 size={16} /></button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
