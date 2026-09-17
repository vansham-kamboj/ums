import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import api from '../../services/api';
import { useToast } from '../../context/ToastContext';

export default function SubjectInchargeModal({ subjectRecord, onClose }) {
  const [employees, setEmployees] = useState([]);
  const [formData, setFormData] = useState({
    employeeId: '',
    startDate: new Date().toISOString().split('T')[0],
    endDate: ''
  });
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  useEffect(() => {
    // Fetch employees for the dropdown
    api.get('/employees').then(res => {
      // Handle generic paginated response structure
      const items = Array.isArray(res.data.data) ? res.data.data : (res.data.data?.data || []);
      setEmployees(items);
    }).catch(err => {
      console.error('Failed to load employees', err);
      toast.error('Failed to load employees');
    });
  }, [toast]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.employeeId) {
      toast.error('Please select an employee');
      return;
    }
    
    setLoading(true);
    try {
      await api.post(`/academic/subjects/${subjectRecord.id}/incharge`, formData);
      toast.success('Subject Incharge assigned successfully');
      onClose();
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || 'Failed to assign incharge');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden flex flex-col">
        <div className="px-6 py-4 border-b border-border-color flex justify-between items-center bg-gray-50/50">
          <h2 className="text-lg font-semibold text-text-primary">Assign Incharge</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-full transition-colors text-text-secondary">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">
          <div className="mb-4 text-sm text-text-secondary">
            Assigning to Subject Record: <span className="font-medium text-text-primary">{subjectRecord.subject?.name || 'Unknown'}</span>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-text-primary mb-1">Employee <span className="text-red-500">*</span></label>
              <select
                name="employeeId"
                value={formData.employeeId}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-white border border-border-color rounded-md focus:border-brand-500 focus:ring-1 focus:ring-brand-500"
                required
              >
                <option value="">Select Employee</option>
                {employees.map(emp => (
                  <option key={emp.id} value={emp.id}>{emp.firstName} {emp.lastName}</option>
                ))}
              </select>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-text-primary mb-1">Start Date <span className="text-red-500">*</span></label>
                <input
                  type="date"
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleChange}
                  className="w-full px-3 py-2 bg-white border border-border-color rounded-md"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-text-primary mb-1">End Date</label>
                <input
                  type="date"
                  name="endDate"
                  value={formData.endDate}
                  onChange={handleChange}
                  className="w-full px-3 py-2 bg-white border border-border-color rounded-md"
                />
              </div>
            </div>

            <div className="flex gap-3 pt-4 border-t border-border-color mt-6">
              <button type="button" onClick={onClose} className="flex-1 px-4 py-2 text-text-secondary hover:bg-gray-100 rounded-md">
                Cancel
              </button>
              <button type="submit" disabled={loading} className="flex-1 px-4 py-2 bg-brand-600 text-white rounded-md disabled:opacity-50">
                {loading ? 'Assigning...' : 'Assign'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
