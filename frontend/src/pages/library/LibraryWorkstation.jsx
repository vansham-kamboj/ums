import { useState, useEffect, useCallback } from 'react';
import { BookOpen, RotateCcw, Search, BookCopy, AlertTriangle, CheckCircle, Loader2, Plus, RefreshCw } from 'lucide-react';
import api from '../../services/api';
import { useToast } from '../../context/ToastContext';
import { useAuth } from '../../context/AuthContext';
import Tabs from '../../components/ui/Tabs';
import SearchInput from '../../components/ui/SearchInput';
import StatusBadge from '../../components/ui/StatusBadge';
import Modal from '../../components/ui/Modal';

function formatDate(d) {
  if (!d) return '—';
  return new Intl.DateTimeFormat('en-IN', { year: 'numeric', month: 'short', day: 'numeric' }).format(new Date(d));
}

function daysOverdue(dueDate) {
  const diff = Math.ceil((new Date() - new Date(dueDate)) / (1000 * 60 * 60 * 24));
  return diff > 0 ? diff : 0;
}

// ============ Issue Tab ============
function IssueTab() {
  const toast = useToast();
  const [selectedBook, setSelectedBook] = useState(null);
  const [selectedMember, setSelectedMember] = useState(null);
  const [copies, setCopies] = useState([]);
  const [loadingCopies, setLoadingCopies] = useState(false);
  const [issuing, setIssuing] = useState(false);

  const searchBooks = async (q) => {
    const res = await api.get('/library', { params: { search: q, limit: 10 } });
    return Array.isArray(res.data.data) ? res.data.data : [];
  };

  const searchMembers = async (q) => {
    const res = await api.get('/library/search-members', { params: { search: q } });
    return res.data.data || [];
  };

  useEffect(() => {
    if (!selectedBook) { setCopies([]); return; }
    const fetchCopies = async () => {
      setLoadingCopies(true);
      try {
        const res = await api.get(`/library/${selectedBook.id}/copies`);
        setCopies(res.data.data || []);
      } catch { setCopies([]); }
      finally { setLoadingCopies(false); }
    };
    fetchCopies();
  }, [selectedBook]);

  const handleIssue = async (copyId) => {
    if (!selectedMember) { toast.warning('Select a member first'); return; }
    setIssuing(true);
    try {
      const res = await api.post('/library/issue', {
        bookCopyId: copyId,
        studentId: selectedMember.type === 'student' ? selectedMember.id : undefined,
      });
      const data = res.data.data;
      toast.success(`Book issued! Due: ${formatDate(data.dueDate)}`);
      // Refresh copies
      const copyRes = await api.get(`/library/${selectedBook.id}/copies`);
      setCopies(copyRes.data.data || []);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to issue book');
    } finally { setIssuing(false); }
  };

  return (
    <div className="space-y-5">
      {/* Search Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-medium text-text-secondary mb-1.5">Search Book</label>
          <SearchInput
            placeholder="Search by title, ISBN, or author..."
            onSearch={searchBooks}
            onSelect={setSelectedBook}
            renderResult={(book) => (
              <div>
                <p className="font-medium text-text-primary">{book.title}</p>
                <p className="text-xs text-text-secondary">{book.author || 'Unknown Author'} · {book.availableCopies}/{book.totalCopies} available</p>
              </div>
            )}
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-text-secondary mb-1.5">Search Member</label>
          <SearchInput
            placeholder="Search by name or admission number..."
            onSearch={searchMembers}
            onSelect={setSelectedMember}
            renderResult={(m) => (
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-brand-100 flex items-center justify-center text-xs font-semibold text-brand-600">
                  {(m.name || '?')[0]}
                </div>
                <div>
                  <p className="font-medium text-text-primary">{m.name}</p>
                  <p className="text-xs text-text-secondary">{m.admissionNo} · {m.issuedCount} books issued</p>
                </div>
              </div>
            )}
          />
        </div>
      </div>

      {/* Selected items */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {selectedBook && (
          <div className="bg-brand-100/30 border border-brand-100 rounded-md p-4">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-medium text-text-secondary uppercase tracking-wide">Selected Book</p>
                <p className="text-sm font-semibold text-text-primary mt-1">{selectedBook.title}</p>
                <p className="text-xs text-text-secondary mt-0.5">{selectedBook.author} · ISBN: {selectedBook.isbn || '—'}</p>
              </div>
              <button onClick={() => { setSelectedBook(null); setCopies([]); }} className="text-text-disabled hover:text-text-secondary">
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
        {selectedMember && (
          <div className="bg-success-100/50 border border-success-100 rounded-md p-4">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-medium text-text-secondary uppercase tracking-wide">Selected Member</p>
                <p className="text-sm font-semibold text-text-primary mt-1">{selectedMember.name}</p>
                <p className="text-xs text-text-secondary mt-0.5">{selectedMember.admissionNo} · {selectedMember.issuedCount} books currently issued</p>
              </div>
              <button onClick={() => setSelectedMember(null)} className="text-text-disabled hover:text-text-secondary">
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Available Copies */}
      {selectedBook && (
        <div className="bg-surface border border-border rounded-md overflow-hidden">
          <div className="px-5 py-3 border-b border-border bg-bg/50">
            <h4 className="text-sm font-semibold text-text-primary">Available Copies</h4>
          </div>
          {loadingCopies ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-6 h-6 text-brand-500 animate-spin" />
            </div>
          ) : copies.length === 0 ? (
            <div className="py-8 text-center text-sm text-text-secondary">No copies found for this book</div>
          ) : (
            <table className="w-full text-left">
              <thead>
                <tr className="bg-bg/80 border-b border-border">
                  <th className="px-5 py-2.5 text-xs font-semibold text-text-secondary uppercase tracking-wider">Copy #</th>
                  <th className="px-5 py-2.5 text-xs font-semibold text-text-secondary uppercase tracking-wider">Barcode</th>
                  <th className="px-5 py-2.5 text-xs font-semibold text-text-secondary uppercase tracking-wider">Condition</th>
                  <th className="px-5 py-2.5 text-xs font-semibold text-text-secondary uppercase tracking-wider">Status</th>
                  <th className="px-5 py-2.5 text-xs font-semibold text-text-secondary uppercase tracking-wider text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {copies.map(copy => {
                  const isIssued = copy.issues && copy.issues.length > 0;
                  return (
                    <tr key={copy.id} className="hover:bg-bg/40 transition-colors">
                      <td className="px-5 py-3 text-sm font-medium text-text-primary">{copy.copyNumber}</td>
                      <td className="px-5 py-3 text-sm text-text-secondary">{copy.barcode || '—'}</td>
                      <td className="px-5 py-3 text-sm text-text-secondary">{copy.condition}</td>
                      <td className="px-5 py-3">
                        {copy.isAvailable ? (
                          <StatusBadge status="active" label="Available" />
                        ) : (
                          <StatusBadge status="inactive" label="Issued" />
                        )}
                      </td>
                      <td className="px-5 py-3 text-right">
                        {copy.isAvailable ? (
                          <button
                            onClick={() => handleIssue(copy.id)}
                            disabled={!selectedMember || issuing}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-brand-600 text-white rounded-md hover:bg-brand-500 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                          >
                            {issuing ? <Loader2 className="w-3 h-3 animate-spin" /> : <BookOpen className="w-3 h-3" />}
                            Issue
                          </button>
                        ) : (
                          <span className="text-xs text-text-disabled">
                            {isIssued && copy.issues[0]?.student
                              ? `Issued to ${copy.issues[0].student.firstName}`
                              : 'Unavailable'}
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  );
}

// ============ Return Tab ============
function ReturnTab() {
  const toast = useToast();
  const { user } = useAuth();
  const [selectedMember, setSelectedMember] = useState(null);
  const [issuedBooks, setIssuedBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [returning, setReturning] = useState(null);
  const [finePreview, setFinePreview] = useState(null);

  const searchMembers = async (q) => {
    const res = await api.get('/library/search-members', { params: { search: q } });
    return res.data.data || [];
  };

  const fetchIssued = useCallback(async (memberId) => {
    setLoading(true);
    try {
      const res = await api.get(`/library/member/${memberId}/issued`);
      setIssuedBooks(res.data.data || []);
    } catch { setIssuedBooks([]); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => {
    if (selectedMember) fetchIssued(selectedMember.id);
    else setIssuedBooks([]);
  }, [selectedMember, fetchIssued]);

  const handleReturn = async (issue, waiveFine = false) => {
    setReturning(issue.id);
    try {
      const res = await api.post('/library/return', { issueId: issue.id, waiveFine });
      const data = res.data.data;
      if (data.fine > 0 && !waiveFine) {
        toast.success(`Book returned. Fine: ₹${data.fine}`);
      } else {
        toast.success('Book returned successfully');
      }
      setFinePreview(null);
      if (selectedMember) fetchIssued(selectedMember.id);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Return failed');
    } finally { setReturning(null); }
  };

  const showFinePreview = (issue) => {
    const overdue = daysOverdue(issue.dueDate);
    if (overdue > 0) {
      setFinePreview({ issue, overdueDays: overdue, fine: overdue * 2 }); // ₹2/day default shown
    } else {
      handleReturn(issue);
    }
  };

  return (
    <div className="space-y-5">
      <div className="max-w-md">
        <label className="block text-xs font-medium text-text-secondary mb-1.5">Search Member</label>
        <SearchInput
          placeholder="Search by name or admission number..."
          onSearch={searchMembers}
          onSelect={(m) => { setSelectedMember(m); setFinePreview(null); }}
          renderResult={(m) => (
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-brand-100 flex items-center justify-center text-xs font-semibold text-brand-600">
                {(m.name || '?')[0]}
              </div>
              <div>
                <p className="font-medium text-text-primary">{m.name}</p>
                <p className="text-xs text-text-secondary">{m.admissionNo} · {m.issuedCount} books issued</p>
              </div>
            </div>
          )}
        />
      </div>

      {selectedMember && (
        <div className="bg-surface border border-border rounded-md overflow-hidden">
          <div className="px-5 py-3 border-b border-border bg-bg/50 flex items-center justify-between">
            <div>
              <h4 className="text-sm font-semibold text-text-primary">Books Issued to {selectedMember.name}</h4>
              <p className="text-xs text-text-secondary mt-0.5">{issuedBooks.length} books currently issued</p>
            </div>
            <button onClick={() => fetchIssued(selectedMember.id)} className="p-1.5 rounded-md hover:bg-bg text-text-disabled hover:text-text-secondary">
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-6 h-6 text-brand-500 animate-spin" />
            </div>
          ) : issuedBooks.length === 0 ? (
            <div className="py-8 text-center text-sm text-text-secondary">No books currently issued</div>
          ) : (
            <table className="w-full text-left">
              <thead>
                <tr className="bg-bg/80 border-b border-border">
                  <th className="px-5 py-2.5 text-xs font-semibold text-text-secondary uppercase tracking-wider">Book</th>
                  <th className="px-5 py-2.5 text-xs font-semibold text-text-secondary uppercase tracking-wider">Copy #</th>
                  <th className="px-5 py-2.5 text-xs font-semibold text-text-secondary uppercase tracking-wider">Issue Date</th>
                  <th className="px-5 py-2.5 text-xs font-semibold text-text-secondary uppercase tracking-wider">Due Date</th>
                  <th className="px-5 py-2.5 text-xs font-semibold text-text-secondary uppercase tracking-wider">Status</th>
                  <th className="px-5 py-2.5 text-xs font-semibold text-text-secondary uppercase tracking-wider text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {issuedBooks.map(issue => {
                  const overdue = daysOverdue(issue.dueDate);
                  return (
                    <tr key={issue.id} className={`transition-colors ${overdue > 0 ? 'bg-danger-100/20' : 'hover:bg-bg/40'}`}>
                      <td className="px-5 py-3">
                        <p className="text-sm font-medium text-text-primary">{issue.bookCopy?.book?.title}</p>
                        <p className="text-xs text-text-secondary">{issue.bookCopy?.book?.author}</p>
                      </td>
                      <td className="px-5 py-3 text-sm text-text-secondary">{issue.bookCopy?.copyNumber}</td>
                      <td className="px-5 py-3 text-sm text-text-secondary">{formatDate(issue.issueDate)}</td>
                      <td className="px-5 py-3 text-sm text-text-secondary">{formatDate(issue.dueDate)}</td>
                      <td className="px-5 py-3">
                        {overdue > 0 ? (
                          <span className="inline-flex items-center gap-1 text-xs font-medium text-danger-600 bg-danger-100 px-2 py-1 rounded-full">
                            <AlertTriangle className="w-3 h-3" />
                            {overdue} days overdue
                          </span>
                        ) : (
                          <StatusBadge status="active" label="On Time" />
                        )}
                      </td>
                      <td className="px-5 py-3 text-right">
                        <button
                          onClick={() => showFinePreview(issue)}
                          disabled={returning === issue.id}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-success-600 text-white rounded-md hover:bg-success-600/90 disabled:opacity-40 transition-colors"
                        >
                          {returning === issue.id ? <Loader2 className="w-3 h-3 animate-spin" /> : <RotateCcw className="w-3 h-3" />}
                          Return
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      )}

      {/* Fine Preview Modal */}
      <Modal
        isOpen={!!finePreview}
        onClose={() => setFinePreview(null)}
        title="Overdue Fine"
        size="sm"
        footer={
          <>
            {user?.scope === 'ADMIN' && (
              <button
                onClick={() => handleReturn(finePreview.issue, true)}
                className="px-4 py-2 text-sm font-medium text-text-secondary bg-surface border border-border rounded-md hover:bg-bg transition-colors"
              >
                Waive Fine
              </button>
            )}
            <button
              onClick={() => handleReturn(finePreview.issue, false)}
              className="px-4 py-2 text-sm font-medium text-white bg-brand-600 rounded-md hover:bg-brand-500 transition-colors"
            >
              Return with Fine
            </button>
          </>
        }
      >
        {finePreview && (
          <div className="space-y-3">
            <div className="flex items-center gap-3 p-3 bg-danger-100/50 border border-danger-100 rounded-md">
              <AlertTriangle className="w-5 h-5 text-danger-600 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-danger-600">This book is overdue by {finePreview.overdueDays} day{finePreview.overdueDays > 1 ? 's' : ''}</p>
                <p className="text-xs text-text-secondary mt-0.5">Fine: ₹{finePreview.fine} (₹2/day)</p>
              </div>
            </div>
            <div className="text-sm text-text-secondary">
              <p><strong>Book:</strong> {finePreview.issue.bookCopy?.book?.title}</p>
              <p><strong>Due Date:</strong> {formatDate(finePreview.issue.dueDate)}</p>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}

// ============ Catalog Sub-page ============
function CatalogView() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const pageSize = 20;

  const fetchBooks = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get('/library', { params: { search, page, limit: pageSize } });
      const data = res.data;
      setBooks(Array.isArray(data.data) ? data.data : []);
      setTotal(data.meta?.total || data.total || 0);
    } catch { setBooks([]); }
    finally { setLoading(false); }
  }, [search, page]);

  useEffect(() => { fetchBooks(); }, [fetchBooks]);
  useEffect(() => { setPage(1); }, [search]);

  const totalPages = Math.ceil(total / pageSize) || 1;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-base font-semibold text-text-primary">Book Catalog</h3>
        <div className="relative w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-disabled" />
          <input
            type="text"
            placeholder="Search catalog..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-bg border border-border rounded-md text-sm placeholder-text-disabled focus:outline-none focus:ring-2 focus:ring-brand-600/20 focus:border-brand-500 transition-all"
          />
        </div>
      </div>

      <div className="bg-surface border border-border rounded-md overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="w-6 h-6 text-brand-500 animate-spin" />
          </div>
        ) : books.length === 0 ? (
          <div className="py-12 text-center">
            <BookCopy className="w-10 h-10 text-text-disabled mx-auto mb-3" />
            <p className="text-sm text-text-secondary">{search ? 'No books found for your search' : 'No books in the library yet'}</p>
          </div>
        ) : (
          <>
            <table className="w-full text-left">
              <thead>
                <tr className="bg-bg/80 border-b border-border">
                  <th className="px-5 py-2.5 text-xs font-semibold text-text-secondary uppercase tracking-wider">Title</th>
                  <th className="px-5 py-2.5 text-xs font-semibold text-text-secondary uppercase tracking-wider">Author</th>
                  <th className="px-5 py-2.5 text-xs font-semibold text-text-secondary uppercase tracking-wider">ISBN</th>
                  <th className="px-5 py-2.5 text-xs font-semibold text-text-secondary uppercase tracking-wider">Category</th>
                  <th className="px-5 py-2.5 text-xs font-semibold text-text-secondary uppercase tracking-wider text-right">Availability</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {books.map(book => (
                  <tr key={book.id} className="hover:bg-bg/40 transition-colors">
                    <td className="px-5 py-3">
                      <p className="text-sm font-medium text-text-primary">{book.title}</p>
                      {book.publisher && <p className="text-xs text-text-secondary">{book.publisher}</p>}
                    </td>
                    <td className="px-5 py-3 text-sm text-text-secondary">{book.author || '—'}</td>
                    <td className="px-5 py-3 text-sm text-text-secondary font-mono text-xs">{book.isbn || '—'}</td>
                    <td className="px-5 py-3 text-sm text-text-secondary">{book.category || '—'}</td>
                    <td className="px-5 py-3 text-right">
                      <span className={`inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full ${
                        book.availableCopies === 0
                          ? 'bg-danger-100 text-danger-600'
                          : book.availableCopies < book.totalCopies
                          ? 'bg-warning-100 text-warning-600'
                          : 'bg-success-100 text-success-600'
                      }`}>
                        {book.availableCopies} of {book.totalCopies} available
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {totalPages > 1 && (
              <div className="px-5 py-3 border-t border-border flex items-center justify-between bg-bg/50">
                <p className="text-sm text-text-secondary">
                  Page {page} of {totalPages} · {total} books
                </p>
                <div className="flex items-center gap-1">
                  <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page <= 1}
                    className="px-3 py-1.5 text-sm rounded-md hover:bg-border disabled:opacity-40 disabled:cursor-not-allowed transition-colors">
                    Prev
                  </button>
                  <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page >= totalPages}
                    className="px-3 py-1.5 text-sm rounded-md hover:bg-border disabled:opacity-40 disabled:cursor-not-allowed transition-colors">
                    Next
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

// ============ Main Library Workstation ============
export default function LibraryWorkstation() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    api.get('/library/reports').then(res => setStats(res.data.data)).catch(() => {});
  }, []);

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h2 className="text-2xl font-bold text-text-primary" style={{ fontFamily: 'var(--font-display)' }}>Library</h2>
        <p className="text-sm text-text-secondary mt-0.5">Issue, return, and manage library books</p>
      </div>

      {/* Stats Row */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Total Books', value: stats.totalBooks, icon: BookOpen },
            { label: 'Total Copies', value: stats.totalCopies, icon: BookCopy },
            { label: 'Currently Issued', value: stats.issuedCopies, icon: CheckCircle },
            { label: 'Overdue', value: stats.overdueCount, icon: AlertTriangle, danger: stats.overdueCount > 0 },
          ].map((s, i) => (
            <div key={i} className="bg-surface border border-border rounded-md p-4 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-text-secondary uppercase tracking-wide">{s.label}</span>
                <s.icon className={`w-4 h-4 ${s.danger ? 'text-danger-600' : 'text-text-disabled'}`} />
              </div>
              <p className={`text-2xl font-semibold mt-2 ${s.danger ? 'text-danger-600' : 'text-text-primary'}`} style={{ fontVariantNumeric: 'tabular-nums' }}>
                {s.value}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Issue / Return Tabs */}
      <Tabs
        tabs={[
          {
            key: 'issue',
            label: 'Issue Book',
            icon: BookOpen,
            content: <IssueTab />,
          },
          {
            key: 'return',
            label: 'Return Book',
            icon: RotateCcw,
            content: <ReturnTab />,
          },
        ]}
      />

      {/* Catalog */}
      <div className="border-t border-border pt-6">
        <CatalogView />
      </div>
    </div>
  );
}
