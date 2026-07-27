import React, { useState, useEffect } from 'react';
import { Users, GraduationCap, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../../services/api';

export default function GuardianChildren() {
  const [children, setChildren] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchChildren = async () => {
      try {
        const res = await api.get('/guardians/my-children');
        setChildren(res.data.data);
      } catch (err) {
        // Mock data
        setChildren([
          {
            id: 1,
            firstName: 'Aarav',
            lastName: 'Sharma',
            admissionNumber: 'ADM-2026-001',
            course: { name: 'Class 10' },
            batch: { name: 'Section A' }
          },
          {
            id: 2,
            firstName: 'Diya',
            lastName: 'Sharma',
            admissionNumber: 'ADM-2026-042',
            course: { name: 'Class 8' },
            batch: { name: 'Section B' }
          }
        ]);
      } finally {
        setLoading(false);
      }
    };
    fetchChildren();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-8 w-48 bg-ink-200 rounded"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="h-48 bg-ink-200 rounded-md"></div>
          <div className="h-48 bg-ink-200 rounded-md"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-text-primary">My Children</h2>
          <p className="text-sm text-text-secondary mt-1">View academic records and details of your linked children.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {children.map(child => (
          <div key={child.id} className="bg-surface border border-border rounded-lg overflow-hidden flex flex-col hover:border-brand-500/50 hover:shadow-md transition-all">
            <div className="p-6 flex items-center gap-4 border-b border-border">
              <div className="w-16 h-16 bg-brand-500/10 text-brand-500 rounded-full flex items-center justify-center text-xl font-bold">
                {child.firstName.charAt(0)}{child.lastName.charAt(0)}
              </div>
              <div>
                <h3 className="text-xl font-bold text-text-primary">{child.firstName} {child.lastName}</h3>
                <p className="text-sm font-medium text-text-secondary mt-1">Adm No: {child.admissionNumber}</p>
              </div>
            </div>
            
            <div className="p-5 flex-1 space-y-3 bg-ink-800">
              <div className="flex items-center gap-3">
                <GraduationCap className="w-5 h-5 text-text-disabled" />
                <span className="text-sm text-text-secondary">Course: <strong className="text-text-primary">{child.course?.name || 'N/A'}</strong></span>
              </div>
              <div className="flex items-center gap-3">
                <Users className="w-5 h-5 text-text-disabled" />
                <span className="text-sm text-text-secondary">Batch: <strong className="text-text-primary">{child.batch?.name || 'N/A'}</strong></span>
              </div>
            </div>
            
            <Link to={`/guardian/child/${child.id}`} className="block w-full p-4 bg-bg text-center text-sm font-semibold text-brand-500 hover:text-brand-600 hover:bg-brand-500/5 transition-colors border-t border-border flex items-center justify-center gap-2">
              View Dashboard <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        ))}
      </div>

      {children.length === 0 && (
        <div className="bg-surface border border-border rounded-md p-10 text-center">
          <Users className="w-12 h-12 text-text-disabled mx-auto mb-4" />
          <h3 className="text-lg font-medium text-text-primary mb-1">No Linked Children</h3>
          <p className="text-sm text-text-secondary">Please contact the administration to link your children's profiles.</p>
        </div>
      )}
    </div>
  );
}
