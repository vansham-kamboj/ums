import React, { useState, useEffect } from 'react';
import { X, Upload, AlertCircle, CheckCircle2 } from 'lucide-react';
import api from '../../services/api';
import { useToast } from '../../context/ToastContext';

export default function CourseImportModal({ onClose }) {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [programs, setPrograms] = useState([]);
  const [selectedProgram, setSelectedProgram] = useState('');
  const toast = useToast();

  useEffect(() => {
    api.get('/academic/programs').then(res => {
      setPrograms(res.data.data || []);
    });
  }, []);

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!selectedProgram) {
      toast.error('Please select a program first');
      return;
    }
    
    // In a real scenario, you'd parse CSV/Excel here or send it to backend.
    // The backend expects an array of course objects for `/academic/courses/import`.
    // Let's assume we parse a simple format (e.g. JSON for demo or we just read CSV).
    // For this boilerplate, we'll simulate reading it and sending to backend.
    setLoading(true);
    
    try {
      const text = await file.text();
      // Very basic CSV parsing (Name,Code,Duration,DivisionId)
      const lines = text.split('\n').filter(line => line.trim());
      const headers = lines[0].split(',');
      const courses = lines.slice(1).map(line => {
        const parts = line.split(',');
        return {
          programId: selectedProgram,
          name: parts[0]?.trim(),
          code: parts[1]?.trim(),
          duration: parseInt(parts[2]?.trim() || '0', 10),
          isActive: true
        };
      }).filter(c => c.name && c.code);

      const res = await api.post('/academic/courses/import', { courses });
      setResults({ importedCount: res.data.data?.importedCount || courses.length });
      toast.success('Courses imported successfully');
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || 'Failed to import courses');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden flex flex-col">
        <div className="px-6 py-4 border-b border-border-color flex justify-between items-center bg-gray-50/50">
          <h2 className="text-lg font-semibold text-text-primary">Import Courses</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-full transition-colors text-text-secondary">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto">
          {results ? (
            <div className="text-center py-6">
              <div className="mx-auto w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-4">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-medium text-text-primary mb-2">Import Complete</h3>
              <p className="text-text-secondary">Successfully imported {results.importedCount} courses.</p>
              <button onClick={() => { onClose(); window.location.reload(); }} className="mt-6 w-full py-2 bg-brand-600 text-white rounded-md">
                Done
              </button>
            </div>
          ) : (
            <form onSubmit={handleUpload} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-text-primary mb-1">Target Program <span className="text-red-500">*</span></label>
                <select
                  value={selectedProgram}
                  onChange={e => setSelectedProgram(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-border-color rounded-md"
                  required
                >
                  <option value="">Select a program</option>
                  {programs.map(p => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-text-primary mb-1">CSV File <span className="text-red-500">*</span></label>
                <input
                  type="file"
                  accept=".csv"
                  onChange={e => setFile(e.target.files[0])}
                  className="w-full px-3 py-2 bg-white border border-border-color rounded-md"
                  required
                />
                <p className="text-xs text-text-secondary mt-1">Expected columns: Name, Code, Duration (Months)</p>
              </div>

              <div className="bg-blue-50 border border-blue-100 text-blue-700 p-3 rounded-md flex items-start gap-2 text-sm mt-4">
                <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
                <p>Please ensure your CSV uses the correct headers and matches the expected format.</p>
              </div>
              
              <div className="flex gap-3 pt-4 border-t border-border-color mt-6">
                <button type="button" onClick={onClose} className="flex-1 px-4 py-2 text-text-secondary hover:bg-gray-100 rounded-md">
                  Cancel
                </button>
                <button type="submit" disabled={loading || !file} className="flex-1 px-4 py-2 bg-brand-600 text-white rounded-md disabled:opacity-50">
                  {loading ? 'Importing...' : 'Upload & Import'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
