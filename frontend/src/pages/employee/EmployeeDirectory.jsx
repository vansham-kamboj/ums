import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Filter, Download, UserPlus, Edit2, MoreVertical, Phone, Mail, Building2, Users, Briefcase } from 'lucide-react';
import api from '../../services/api';
import StatusBadge from '../../components/ui/StatusBadge';
import EmptyState from '../../components/ui/EmptyState';

export default function EmployeeDirectory() {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedEmployees, setSelectedEmployees] = useState([]);
  const [departmentFilter, setDepartmentFilter] = useState('');
  const [viewMode, setViewMode] = useState('table'); // table | grid

  useEffect(() => {
    fetchEmployees();
  }, [search]);

  const fetchEmployees = async () => {
    try {
      const res = await api.get('/employees', { params: { search } });
      setEmployees(Array.isArray(res.data.data) ? res.data.data : []);
    } catch (error) {
      // Demo data fallback
      setEmployees([
        { id: 1, firstName: 'Dr. Anand', lastName: 'Kumar', email: 'anand.k@university.edu', phone: '9876543210', employeeCode: 'EMP-001', department: 'Computer Science', designation: 'Professor', status: 'active' },
        { id: 2, firstName: 'Prof. Meera', lastName: 'Sharma', email: 'meera.s@university.edu', phone: '9876543211', employeeCode: 'EMP-002', department: 'Mathematics', designation: 'Assoc. Professor', status: 'active' },
        { id: 3, firstName: 'Dr. Rajesh', lastName: 'Singh', email: 'rajesh.s@university.edu', phone: '9876543212', employeeCode: 'EMP-003', department: 'Electronics', designation: 'Professor', status: 'active' },
        { id: 4, firstName: 'Mrs. Priya', lastName: 'Reddy', email: 'priya.r@university.edu', phone: '9876543213', employeeCode: 'EMP-004', department: 'Admin', designation: 'Admin Officer', status: 'active' },
        { id: 5, firstName: 'Mr. Vikram', lastName: 'Patil', email: 'vikram.p@university.edu', phone: '9876543214', employeeCode: 'EMP-005', department: 'Mechanical', designation: 'Asst. Professor', status: 'on_leave' },
        { id: 6, firstName: 'Ms. Sneha', lastName: 'Gupta', email: 'sneha.g@university.edu', phone: '9876543215', employeeCode: 'EMP-006', department: 'Library', designation: 'Librarian', status: 'active' },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const departments = [...new Set(employees.map(e => e.department).filter(Boolean))];
  const filtered = employees.filter(e => {
    const matchDept = !departmentFilter || e.department === departmentFilter;
    return matchDept;
  });

  const totalActive = employees.filter(e => e.status === 'active').length;
  const totalOnLeave = employees.filter(e => e.status === 'on_leave').length;

  const toggleSelect = (id) => {
    setSelectedEmployees(prev => prev.includes(id) ? prev.filter(e => e !== id) : [...prev, id]);
  };
  const toggleAll = () => {
    if (selectedEmployees.length === filtered.length) setSelectedEmployees([]);
    else setSelectedEmployees(filtered.map(e => e.id));
  };

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground font-heading">Employee Directory</h1>
          <p className="text-sm text-muted-foreground mt-1">Manage and view all staff members</p>
        </div>
        <div className="flex gap-2">
          {selectedEmployees.length > 0 && (
            <button className="secondary-button text-xs font-semibold inline-flex items-center gap-2">
              <Download className="w-4 h-4 text-brand" /> Export ({selectedEmployees.length})
            </button>
          )}
          <Link to="/employees/new" className="primary-button text-sm px-4 py-2.5 inline-flex items-center gap-2">
            <UserPlus className="w-4 h-4" /> Add Employee
          </Link>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="glass-panel p-4">
          <p className="text-xs text-muted-foreground font-medium mb-1">Total Staff</p>
          <p className="text-2xl font-bold text-foreground font-heading">{employees.length}</p>
        </div>
        <div className="glass-panel p-4">
          <p className="text-xs text-muted-foreground font-medium mb-1">Active Staff</p>
          <p className="text-2xl font-bold text-emerald-600 font-heading">{totalActive}</p>
        </div>
        <div className="glass-panel p-4">
          <p className="text-xs text-muted-foreground font-medium mb-1">On Leave</p>
          <p className="text-2xl font-bold text-amber-600 font-heading">{totalOnLeave}</p>
        </div>
        <div className="glass-panel p-4">
          <p className="text-xs text-muted-foreground font-medium mb-1">Departments</p>
          <p className="text-2xl font-bold text-brand font-heading">{departments.length}</p>
        </div>
      </div>

      {/* Search + Filters Container */}
      <div className="glass-panel p-4 space-y-4">
        <div className="flex flex-col sm:flex-row justify-between gap-4 pb-2 border-b border-glass-border">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search by name, code, or email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 glass-subtle rounded-xl text-sm placeholder:text-muted-foreground text-foreground focus:outline-none focus:ring-2 focus:ring-brand/30"
            />
          </div>
          <div className="flex gap-2">
            <select
              value={departmentFilter}
              onChange={e => setDepartmentFilter(e.target.value)}
              className="px-3 py-2 glass-subtle rounded-xl text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-brand/30 border border-glass-border"
            >
              <option value="">All Departments</option>
              {departments.map(d => <option key={d} value={d}>{d}</option>)}
            </select>
            <div className="flex glass-subtle rounded-xl border border-glass-border p-1">
              <button
                onClick={() => setViewMode('table')}
                className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all ${viewMode === 'table' ? 'bg-brand text-white shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}
              >
                Table
              </button>
              <button
                onClick={() => setViewMode('grid')}
                className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all ${viewMode === 'grid' ? 'bg-brand text-white shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}
              >
                Grid
              </button>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="p-12 text-center">
            <div className="w-8 h-8 border-3 border-brand/30 border-t-brand rounded-full animate-spin mx-auto" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-8">
            <EmptyState title="No employees found" message="Try adjusting your search or filters." icon={Users} />
          </div>
        ) : viewMode === 'table' ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-glass-border text-muted-foreground text-xs uppercase tracking-wider font-semibold">
                  <th className="px-5 py-3.5 w-12">
                    <input
                      type="checkbox"
                      checked={selectedEmployees.length === filtered.length && filtered.length > 0}
                      onChange={toggleAll}
                      className="rounded border-glass-border text-brand focus:ring-brand/30"
                    />
                  </th>
                  <th className="px-5 py-3.5">Employee</th>
                  <th className="px-5 py-3.5">Code</th>
                  <th className="px-5 py-3.5">Department</th>
                  <th className="px-5 py-3.5">Contact</th>
                  <th className="px-5 py-3.5 text-center">Status</th>
                  <th className="px-5 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-glass-border text-sm">
                {filtered.map(emp => (
                  <tr key={emp.id} className="glass-card-interactive hover:bg-card/80 transition-all group">
                    <td className="px-5 py-3.5">
                      <input
                        type="checkbox"
                        checked={selectedEmployees.includes(emp.id)}
                        onChange={() => toggleSelect(emp.id)}
                        className="rounded border-glass-border text-brand focus:ring-brand/30"
                      />
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="brand-mark w-9 h-9 rounded-xl flex items-center justify-center text-white text-xs font-bold font-heading shadow-sm flex-shrink-0">
                          {emp.firstName?.[0]}{emp.lastName?.[0] || ''}
                        </div>
                        <div>
                          <Link to={`/employees/${emp.id}`} className="text-sm font-semibold text-foreground hover:text-brand transition-colors">
                            {emp.firstName} {emp.lastName}
                          </Link>
                          <p className="text-xs text-muted-foreground">{emp.designation || 'Staff'}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-sm text-foreground/80 font-mono">{emp.employeeCode || '—'}</td>
                    <td className="px-5 py-3.5 text-sm text-foreground/80">{emp.department || '—'}</td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <Mail className="w-3.5 h-3.5 text-brand" />
                        {emp.email || '—'}
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-center">
                      <StatusBadge status={emp.status === 'active' ? 'active' : emp.status === 'on_leave' ? 'pending' : 'inactive'} label={emp.status === 'active' ? 'Active' : emp.status === 'on_leave' ? 'On Leave' : 'Inactive'} size="xs" />
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <Link to={`/employees/${emp.id}`} className="secondary-button p-2 inline-block">
                        <Edit2 className="w-4 h-4 text-brand" />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          /* Grid view */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map(emp => (
              <Link
                key={emp.id}
                to={`/employees/${emp.id}`}
                className="glass-card-interactive p-4 border border-glass-border/70 rounded-2xl hover:shadow-xl transition-all group block"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="brand-mark w-11 h-11 rounded-xl flex items-center justify-center text-white text-sm font-bold font-heading shadow-sm">
                    {emp.firstName?.[0]}{emp.lastName?.[0] || ''}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-bold text-foreground truncate group-hover:text-brand transition-colors">
                      {emp.firstName} {emp.lastName}
                    </h3>
                    <p className="text-xs text-muted-foreground truncate">{emp.designation || 'Staff'}</p>
                  </div>
                  <StatusBadge status={emp.status === 'active' ? 'active' : 'pending'} label={emp.status === 'active' ? 'Active' : 'Leave'} size="xs" />
                </div>
                <div className="space-y-2 text-xs text-muted-foreground border-t border-glass-border/50 pt-3">
                  <div className="flex items-center gap-2"><Building2 className="w-3.5 h-3.5 text-brand" />{emp.department || '—'}</div>
                  <div className="flex items-center gap-2"><Mail className="w-3.5 h-3.5 text-brand" /><span className="truncate">{emp.email || '—'}</span></div>
                  <div className="flex items-center gap-2"><Phone className="w-3.5 h-3.5 text-brand" />{emp.phone || '—'}</div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
