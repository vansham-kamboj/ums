import { useState, useEffect, useCallback } from 'react';
import { Plus, Search, Edit2, Trash2, Download, ChevronLeft, ChevronRight, Eye, Filter, RefreshCw } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import StatusBadge from './ui/StatusBadge';
import EmptyState from './ui/EmptyState';
import LoadingSkeleton from './ui/LoadingSkeleton';
import ConfirmDialog from './ui/ConfirmDialog';
import { useToast } from '../context/ToastContext';
import { useAuth } from '../context/AuthContext';

function formatCellValue(value, col) {
  if (value === null || value === undefined) return '—';
  if (col.render) return col.render(value);
  if (col.type === 'status' || col.type === 'badge') return <StatusBadge status={value} />;
  if (col.type === 'boolean') return <StatusBadge status={String(value)} />;
  if (col.type === 'date') {
    try {
      return new Intl.DateTimeFormat('en-IN', { year: 'numeric', month: 'short', day: 'numeric' }).format(new Date(value));
    } catch { return String(value); }
  }
  if (col.type === 'datetime') {
    try {
      return new Intl.DateTimeFormat('en-IN', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }).format(new Date(value));
    } catch { return String(value); }
  }
  if (col.type === 'currency') {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(Number(value));
  }
  if (typeof value === 'object') return JSON.stringify(value);
  return String(value);
}

export default function GenericList({ title, endpoint, columns, editPath, createPath, detailPath, subtitle, actions: extraActions, filters: filterConfig, hideCreate, hideDelete, readOnlyForScopes = [] }) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);
  const [total, setTotal] = useState(0);
  const [deleteModal, setDeleteModal] = useState({ open: false, id: null });
  const [deleting, setDeleting] = useState(false);
  const [sortBy, setSortBy] = useState(null);
  const [sortDir, setSortDir] = useState('asc');
  const isReadOnly = user && readOnlyForScopes.includes(user.scope);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const params = { page, limit: pageSize };
      if (search) params.search = search;
      if (sortBy) {
        params.sortBy = sortBy;
        params.sortOrder = sortDir;
      }
      const res = await api.get(endpoint, { params });
      const resData = res.data;
      if (Array.isArray(resData.data)) {
        setData(resData.data);
        setTotal(resData.meta?.total || resData.total || resData.data.length);
      } else if (resData.data && Array.isArray(resData.data.data)) {
        setData(resData.data.data);
        setTotal(resData.data.meta?.total || resData.data.total || resData.data.data.length);
      } else {
        setData([]);
        setTotal(0);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      setData([]);
    } finally {
      setLoading(false);
    }
  }, [endpoint, search, page, pageSize, sortBy, sortDir]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Reset page when search changes
  useEffect(() => {
    setPage(1);
  }, [search]);

  const handleDelete = async () => {
    if (!deleteModal.id) return;
    setDeleting(true);
    try {
      await api.delete(`${endpoint}/${deleteModal.id}`);
      toast.success('Record deleted successfully');
      fetchData();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete record');
    } finally {
      setDeleting(false);
      setDeleteModal({ open: false, id: null });
    }
  };

  const handleSort = (key) => {
    if (sortBy === key) {
      setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(key);
      setSortDir('asc');
    }
  };

  const totalPages = Math.ceil(total / pageSize) || 1;

  const resolveValue = (row, key) => {
    if (key.includes('.')) {
      return key.split('.').reduce((obj, k) => obj?.[k], row);
    }
    return row[key];
  };

  return (
    <div className="space-y-5 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-text-primary">{title}</h2>
          {subtitle && <p className="text-sm text-text-secondary mt-0.5">{subtitle}</p>}
        </div>
        <div className="flex items-center gap-2">
          {extraActions}
          {!hideCreate && createPath && !isReadOnly && (
            <Link
              to={createPath}
              className="inline-flex items-center gap-2 bg-brand-600 hover:bg-brand-500 text-white px-4 py-2.5 rounded-md font-medium text-sm shadow-sm shadow-brand-600/20 hover:shadow-md hover:shadow-brand-600/30 transition-all"
            >
              <Plus className="w-4 h-4" />
              Add New
            </Link>
          )}
        </div>
      </div>

      {/* Table Card */}
      <div className="bg-surface rounded-md border border-border shadow-sm overflow-hidden">
        {/* Toolbar */}
        <div className="px-4 py-3 border-b border-border flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-disabled w-4 h-4" />
            <input
              type="text"
              placeholder="Search..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-bg border border-border rounded-md text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-600/20 focus:border-brand-500 transition-all"
            />
          </div>
          <div className="flex items-center gap-2">
            <button onClick={fetchData} className="p-2 rounded-md hover:bg-bg text-text-disabled hover:text-text-secondary transition-colors" title="Refresh">
              <RefreshCw className="w-4 h-4" />
            </button>
            <select
              value={pageSize}
              onChange={(e) => { setPageSize(Number(e.target.value)); setPage(1); }}
              className="text-sm border border-border rounded-md px-2 py-2 bg-surface focus:outline-none focus:ring-2 focus:ring-brand-600/20"
            >
              <option value={10}>10 / page</option>
              <option value={25}>25 / page</option>
              <option value={50}>50 / page</option>
              <option value={100}>100 / page</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          {loading ? (
            <LoadingSkeleton rows={pageSize > 10 ? 10 : pageSize} columns={columns.length} />
          ) : data.length === 0 ? (
            <EmptyState
              title={search ? 'No results found' : `No ${title.toLowerCase()} yet`}
              message={search ? `Try a different search query.` : `Click "Add New" to create the first record.`}
              action={!hideCreate && createPath && !search && !isReadOnly ? (
                <Link to={createPath} className="inline-flex items-center gap-2 bg-brand-600 hover:bg-brand-500 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors">
                  <Plus className="w-4 h-4" /> Add {title.replace(/s$/, '')}
                </Link>
              ) : undefined}
            />
          ) : (
            <table className="w-full text-left">
              <thead>
                <tr className="bg-bg/80 border-b border-border">
                  {columns.map((col) => (
                    <th
                      key={col.key}
                      onClick={() => handleSort(col.key)}
                      className="px-5 py-3 text-xs font-semibold text-text-secondary uppercase tracking-wider cursor-pointer hover:text-text-secondary select-none"
                    >
                      <span className="flex items-center gap-1">
                        {col.label}
                        {sortBy === col.key && (
                          <span className="text-brand-500">{sortDir === 'asc' ? '↑' : '↓'}</span>
                        )}
                      </span>
                    </th>
                  ))}
                  <th className="px-5 py-3 text-xs font-semibold text-text-secondary uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {data.map((row, idx) => (
                  <tr
                    key={row.id || idx}
                    className="hover:bg-brand-100/30 transition-colors cursor-pointer group"
                    onClick={() => {
                      if (detailPath) navigate(detailPath.replace(':id', row.id));
                      else if (editPath) navigate(editPath.replace(':id', row.id));
                    }}
                  >
                    {columns.map((col) => (
                      <td key={col.key} className="px-5 py-3.5 text-sm text-text-secondary">
                        {formatCellValue(resolveValue(row, col.key), col)}
                      </td>
                    ))}
                    <td className="px-5 py-3.5 text-right" onClick={(e) => e.stopPropagation()}>
                      <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        {detailPath && (
                          <Link to={detailPath.replace(':id', row.id)} className="p-1.5 rounded-md hover:bg-bg text-text-disabled hover:text-brand-600 transition-colors">
                            <Eye className="w-4 h-4" />
                          </Link>
                        )}
                        {editPath && !isReadOnly && (
                          <Link to={editPath.replace(':id', row.id)} className="p-1.5 rounded-md hover:bg-bg text-text-disabled hover:text-brand-600 transition-colors">
                            <Edit2 className="w-4 h-4" />
                          </Link>
                        )}
                        {(!hideDelete && !isReadOnly) && (
                          <button
                            onClick={() => setDeleteModal({ open: true, id: row.id })}
                            className="p-1.5 rounded-md hover:bg-danger-50 text-text-disabled hover:text-danger-600 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Pagination */}
        {data.length > 0 && (
          <div className="px-5 py-3 border-t border-border flex items-center justify-between bg-bg/50">
            <p className="text-sm text-text-secondary">
              Showing <span className="font-medium">{(page - 1) * pageSize + 1}</span> to <span className="font-medium">{Math.min(page * pageSize, total)}</span> of <span className="font-medium">{total}</span>
            </p>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page <= 1}
                className="p-1.5 rounded-md hover:bg-border disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNum;
                if (totalPages <= 5) {
                  pageNum = i + 1;
                } else if (page <= 3) {
                  pageNum = i + 1;
                } else if (page >= totalPages - 2) {
                  pageNum = totalPages - 4 + i;
                } else {
                  pageNum = page - 2 + i;
                }
                return (
                  <button
                    key={pageNum}
                    onClick={() => setPage(pageNum)}
                    className={`w-8 h-8 rounded-md text-sm font-medium transition-colors ${
                      page === pageNum
                        ? 'bg-brand-600 text-white shadow-sm'
                        : 'hover:bg-border text-text-secondary'
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}
              <button
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page >= totalPages}
                className="p-1.5 rounded-md hover:bg-border disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Delete Confirm */}
      <ConfirmDialog
        isOpen={deleteModal.open}
        onClose={() => setDeleteModal({ open: false, id: null })}
        onConfirm={handleDelete}
        title="Delete Record"
        message="Are you sure you want to delete this record? This action cannot be undone."
        confirmText="Delete"
        loading={deleting}
      />
    </div>
  );
}
