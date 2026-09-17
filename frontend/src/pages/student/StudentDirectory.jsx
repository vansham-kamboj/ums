import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, Filter, Download, UserPlus, Eye, Mail, Phone, BookOpen, Sparkles, CheckCircle2, MoreHorizontal } from 'lucide-react';
import { useStudent } from '../../context/StudentContext';
import StatusBadge from '../../components/ui/StatusBadge';

export default function StudentDirectory() {
  const navigate = useNavigate();
  const { students, loading } = useStudent();
  const [search, setSearch] = useState('');
  const [selectedStudents, setSelectedStudents] = useState([]);

  const filteredStudents = students.filter(s =>
    !search ||
    `${s.firstName || ''} ${s.lastName || ''}`.toLowerCase().includes(search.toLowerCase()) ||
    (s.admissionNumber && s.admissionNumber.toLowerCase().includes(search.toLowerCase())) ||
    (s.phone && s.phone.includes(search))
  );

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground font-heading">Students</h1>
          <p className="text-muted-foreground text-sm mt-1">
            {filteredStudents.length} enrolled students across active classes
          </p>
        </div>
        <div className="flex gap-3">
          <Link to="/students/registrations/new" className="primary-button text-sm px-4 py-2">
            <UserPlus className="w-4 h-4" /> Add Student
          </Link>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-3 justify-between items-center">
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <input
            type="text"
            placeholder="Search records..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-card/60 border border-glass-border rounded-xl text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-brand/30 shadow-sm font-body"
          />
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button className="secondary-button text-xs py-2 px-3">
            <Filter className="w-3.5 h-3.5 text-brand" /> Filter
          </button>
        </div>
      </div>

      {/* Lovable Glass Table */}
      <div className="glass-panel overflow-hidden p-0 border border-glass-border shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-glass-border text-muted-foreground text-[11px] font-bold uppercase tracking-wider bg-card/30">
                <th className="py-4 px-6">STUDENT</th>
                <th className="py-4 px-6">ROLL NO.</th>
                <th className="py-4 px-6">CLASS / SECTION</th>
                <th className="py-4 px-6">GUARDIAN</th>
                <th className="py-4 px-6">CONTACT</th>
                <th className="py-4 px-6">STATUS</th>
                <th className="py-4 px-6 text-right"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-glass-border text-sm">
              {loading ? (
                <tr>
                  <td colSpan="7" className="py-12 text-center text-muted-foreground font-body">
                    <div className="w-8 h-8 border-2 border-brand/20 border-t-brand rounded-full animate-spin mx-auto mb-3" />
                    Loading enrolled students...
                  </td>
                </tr>
              ) : filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan="7" className="py-12 text-center text-muted-foreground font-body">
                    No students found.
                  </td>
                </tr>
              ) : (
                filteredStudents.map((student) => (
                  <tr 
                    key={student.id}
                    onClick={() => navigate(`/students/${student.id}`)}
                    className="hover:bg-card/70 transition-all cursor-pointer group"
                  >
                    {/* Student Name + Initials Avatar */}
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-brand/10 text-brand font-bold text-xs flex items-center justify-center border border-brand/20 shrink-0">
                          {student.firstName?.charAt(0)}{student.lastName?.charAt(0)}
                        </div>
                        <p className="font-semibold text-foreground group-hover:text-brand transition-colors font-body">
                          {student.firstName} {student.lastName}
                        </p>
                      </div>
                    </td>

                    {/* Roll No */}
                    <td className="py-4 px-6 text-xs text-muted-foreground font-mono">
                      {student.admissionNumber || 'A-1001'}
                    </td>

                    {/* Class / Section */}
                    <td className="py-4 px-6 text-xs text-foreground font-medium">
                      {student.batch?.name || student.batch?.course?.name || 'Grade 10 · A'}
                    </td>

                    {/* Guardian */}
                    <td className="py-4 px-6 text-xs text-muted-foreground">
                      {student.fatherName || student.motherName || 'Parent / Guardian'}
                    </td>

                    {/* Contact */}
                    <td className="py-4 px-6 text-xs text-muted-foreground font-mono">
                      {student.phone || '+91 98765 43210'}
                    </td>

                    {/* Status Pill */}
                    <td className="py-4 px-6">
                      <StatusBadge status={student.status || (student.isActive !== false ? 'Active' : 'Inactive')} />
                    </td>

                    {/* Action Icon */}
                    <td className="py-4 px-6 text-right" onClick={(e) => e.stopPropagation()}>
                      <Link to={`/students/${student.id}`} className="p-2 rounded-lg hover:bg-card text-muted-foreground hover:text-brand transition-colors inline-block">
                        <MoreHorizontal className="w-4 h-4" />
                      </Link>
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
