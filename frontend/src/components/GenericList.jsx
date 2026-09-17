import { useState, useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
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

export default function GenericList({ title, endpoint, columns, editPath, createPath, detailPath, subtitle, actions: extraActions, rowActions = [], filters: filterConfig, hideCreate, hideDelete, readOnlyForScopes = [] }) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();
  const queryClient = useQueryClient();
  
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);
  const [sortBy, setSortBy] = useState(null);
  const [sortDir, setSortDir] = useState('asc');

  const [deleteModal, setDeleteModal] = useState({ open: false, id: null });
  const [deleting, setDeleting] = useState(false);
  const isReadOnly = user && readOnlyForScopes.includes(user.scope);

  const { data: queryResponse, isLoading: loading, isFetching, refetch } = useQuery({
    queryKey: ['genericList', endpoint, page, pageSize, search, sortBy, sortDir],
    queryFn: async () => {
      const params = { page, limit: pageSize };
      if (search) params.search = search;
      if (sortBy) {
        params.sortBy = sortBy;
        params.sortOrder = sortDir;
      }
      const res = await api.get(endpoint, { params });
      const resData = res.data;
      let fetchedData = [];
      let fetchedTotal = 0;
      if (Array.isArray(resData.data)) {
        fetchedData = resData.data;
        fetchedTotal = resData.meta?.total || resData.total || resData.data.length;
      } else if (resData.data && Array.isArray(resData.data.data)) {
        fetchedData = resData.data.data;
        fetchedTotal = resData.data.meta?.total || resData.data.total || resData.data.data.length;
      }
      return { data: fetchedData, total: fetchedTotal };
    },
    staleTime: 5 * 60 * 1000, // 5 minutes cache staleTime for static setup resources
  });

  const data = queryResponse?.data || [];
  const total = queryResponse?.total || 0;

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
      queryClient.invalidateQueries({ queryKey: ['genericList', endpoint] });
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
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-foreground font-heading">{title}</h2>
          {subtitle && <p className="text-sm text-muted-foreground mt-0.5">{subtitle}</p>}
        </div>
        <div className="flex items-center gap-2">
          {extraActions}
          {!hideCreate && createPath && !isReadOnly && (
            <Link
              to={createPath}
              className="primary-button text-sm px-4 py-2"
            >
              <Plus className="w-4 h-4" />
              Add New
            </Link>
          )}
        </div>
      </div>

      {/* Glass Container Panel */}
      <div className="glass-panel p-4 space-y-4">
        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-glass-border">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <input
              type="text"
              placeholder="Search records..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-card/60 border border-glass-border rounded-xl text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-brand/40"
            />
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => { genericListCache.delete(cacheKey); fetchData(false); }} className="secondary-button p-2" title="Refresh from Database">
              <RefreshCw className="w-4 h-4 text-brand" />
            </button>
            <select
              value={pageSize}
              onChange={(e) => { setPageSize(Number(e.target.value)); setPage(1); }}
              className="text-xs border border-glass-border rounded-xl px-3 py-2 bg-card/60 text-foreground focus:outline-none focus:ring-2 focus:ring-brand/40"
            >
              <option value={10}>10 / page</option>
              <option value={25}>25 / page</option>
              <option value={50}>50 / page</option>
              <option value={100}>100 / page</option>
            </select>
          </div>
        </div>

        {/* Content Table / Cards Container */}
        <div className="glass-panel overflow-hidden rounded-2xl border border-glass-border">
          {loading ? (
            <LoadingSkeleton rows={pageSize > 10 ? 10 : pageSize} columns={columns.length} />
          ) : data.length === 0 ? (
            <EmptyState
              title={search ? 'No results found' : `No ${title.toLowerCase()} yet`}
              message={search ? `Try a different search query.` : `Click "Add New" to create the first record.`}
              action={!hideCreate && createPath && !search && !isReadOnly ? (
                <Link to={createPath} className="primary-button text-xs mt-2">
                  <Plus className="w-4 h-4" /> Add {title.replace(/s$/, '')}
                </Link>
              ) : undefined}
            />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-glass-border text-muted-foreground text-[11px] uppercase tracking-wider font-semibold">
                    {columns.map((col) => (
                      <th
                        key={col.key}
                        onClick={() => handleSort(col.key)}
                        className="px-5 py-3.5 cursor-pointer hover:text-foreground select-none"
                      >
                        <span className="flex items-center gap-1">
                          {col.label}
                          {sortBy === col.key && (
                            <span className="text-brand font-bold">{sortDir === 'asc' ? '↑' : '↓'}</span>
                          )}
                        </span>
                      </th>
                    ))}
                    <th className="px-5 py-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-glass-border text-sm">
                  {data.map((row, idx) => (
                    <tr
                      key={row.id || idx}
                      className="hover:bg-white/40 dark:hover:bg-white/10 transition-colors duration-150 cursor-pointer group"
                      onClick={() => {
                        if (detailPath) navigate(detailPath.replace(':id', row.id));
                        else if (editPath) navigate(editPath.replace(':id', row.id));
                      }}
                    >
                      {columns.map((col, cIdx) => (
                        <td key={col.key} className="px-5 py-3.5 text-foreground font-medium">
                          {cIdx === 0 && typeof resolveValue(row, col.key) === 'string' && resolveValue(row, col.key).length > 1 ? (
                            <div className="flex items-center gap-3">
                              <div className="mini-avatar shrink-0">
                                {resolveValue(row, col.key).split(' ').map(p => p[0]).join('').slice(0, 2).toUpperCase()}
                              </div>
                              <span>{formatCellValue(resolveValue(row, col.key), col)}</span>
                            </div>
                          ) : (
                            formatCellValue(resolveValue(row, col.key), col)
                          )}
                        </td>
                      ))}
                    <td className="px-5 py-3.5 text-right" onClick={(e) => e.stopPropagation()}>
                      <div className="flex justify-end gap-1.5 opacity-80 group-hover:opacity-100 transition-opacity">
                        {detailPath && (
                          <Link to={detailPath.replace(':id', row.id)} className="secondary-button p-1.5" title="View">
                            <Eye className="w-4 h-4 text-brand" />
                          </Link>
                        )}
                        {editPath && !isReadOnly && (
                          <Link to={editPath.replace(':id', row.id)} className="secondary-button p-1.5" title="Edit">
                            <Edit2 className="w-4 h-4 text-brand" />
                          </Link>
                        )}
                        {rowActions.map((action, i) => (
                          <button
                            key={i}
                            onClick={() => action.onClick(row)}
                            className="secondary-button p-1.5"
                            title={action.label}
                          >
                            {typeof action.icon === 'function' ? action.icon(row) : action.icon}
                          </button>
                        ))}
                        {(!hideDelete && !isReadOnly) && (
                          <button
                            onClick={() => setDeleteModal({ open: true, id: row.id })}
                            className="secondary-button p-1.5 text-red-500 hover:text-red-600"
                            title="Delete"
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
            </div>
          )}
        </div>

        {/* Pagination */}
        {data.length > 0 && (
          <div className="pt-3 border-t border-glass-border flex items-center justify-between text-xs">
            <p className="text-muted-foreground">
              Showing <span className="font-semibold text-foreground">{(page - 1) * pageSize + 1}</span> to <span className="font-semibold text-foreground">{Math.min(page * pageSize, total)}</span> of <span className="font-semibold text-foreground">{total}</span>
            </p>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page <= 1}
                className="secondary-button p-1.5 disabled:opacity-40"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNum;
                if (totalPages <= 5) pageNum = i + 1;
                else if (page <= 3) pageNum = i + 1;
                else if (page >= totalPages - 2) pageNum = totalPages - 4 + i;
                else pageNum = page - 2 + i;
                
                return (
                  <button
                    key={pageNum}
                    onClick={() => setPage(pageNum)}
                    className={`w-7 h-7 rounded-lg text-xs font-semibold transition-all ${
                      page === pageNum
                        ? 'bg-brand text-white shadow-md shadow-brand/20'
                        : 'glass-subtle text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}
              <button
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page >= totalPages}
                className="secondary-button p-1.5 disabled:opacity-40"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Delete Confirm Dialog */}
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
