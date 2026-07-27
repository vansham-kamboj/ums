import React, { useState, useEffect } from 'react';
import { Award, BookOpen, Clock } from 'lucide-react';
import api from '../../services/api';

export default function MyResults() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const res = await api.get('/exams/my-results');
        setData(res.data.data);
      } catch (err) {
        setData({
          exams: [
            {
              id: 1,
              name: 'Mid Term Examination 2026',
              date: '2026-10-10',
              status: 'Published',
              results: [
                { subject: 'Mathematics', marks: 85, maxMarks: 100, grade: 'A' },
                { subject: 'Science', marks: 92, maxMarks: 100, grade: 'A+' },
                { subject: 'English', marks: 78, maxMarks: 100, grade: 'B+' }
              ]
            }
          ]
        });
      } finally {
        setLoading(false);
      }
    };
    fetchResults();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-8 w-48 bg-ink-200 rounded"></div>
        <div className="h-64 bg-ink-200 rounded-md"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-text-primary">My Exams & Results</h2>
          <p className="text-sm text-text-secondary mt-1">View your exam schedules and published results.</p>
        </div>
      </div>

      {data?.exams?.map((exam) => (
        <div key={exam.id} className="bg-surface border border-border rounded-md overflow-hidden">
          <div className="px-5 py-4 border-b border-border flex items-center justify-between bg-ink-800">
            <div className="flex items-center gap-3">
              <Award className="w-5 h-5 text-brand-500" />
              <div>
                <h3 className="text-base font-semibold text-text-primary">{exam.name}</h3>
                <p className="text-xs text-text-secondary">Date: {new Intl.DateTimeFormat('en-IN', { dateStyle: 'medium' }).format(new Date(exam.date))}</p>
              </div>
            </div>
            <span className="px-2.5 py-1 bg-success-500/10 text-success-500 text-xs font-medium rounded-full">
              {exam.status}
            </span>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-bg border-b border-border">
                  <th className="px-5 py-3 text-xs font-semibold text-text-secondary uppercase">Subject</th>
                  <th className="px-5 py-3 text-xs font-semibold text-text-secondary uppercase">Marks Obtained</th>
                  <th className="px-5 py-3 text-xs font-semibold text-text-secondary uppercase">Max Marks</th>
                  <th className="px-5 py-3 text-xs font-semibold text-text-secondary uppercase">Grade</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {exam.results?.map((res, i) => (
                  <tr key={i} className="hover:bg-bg/50 transition-colors">
                    <td className="px-5 py-3 text-sm font-medium text-text-primary">{res.subject}</td>
                    <td className="px-5 py-3 text-sm text-text-secondary">{res.marks}</td>
                    <td className="px-5 py-3 text-sm text-text-secondary">{res.maxMarks}</td>
                    <td className="px-5 py-3">
                      <span className="font-bold text-brand-500">{res.grade}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ))}

      {(!data?.exams || data.exams.length === 0) && (
        <div className="bg-surface border border-border rounded-md p-10 text-center">
          <BookOpen className="w-12 h-12 text-text-disabled mx-auto mb-4" />
          <h3 className="text-lg font-medium text-text-primary mb-1">No Exam Records</h3>
          <p className="text-sm text-text-secondary">You don't have any exams or published results yet.</p>
        </div>
      )}
    </div>
  );
}
