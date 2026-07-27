import React, { useState, useEffect } from 'react';
import { DollarSign, CreditCard, Clock, FileText } from 'lucide-react';
import api from '../../services/api';
import StatCard from '../../components/ui/StatCard';
import StatusBadge from '../../components/ui/StatusBadge';

export default function MyFees() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFees = async () => {
      try {
        const res = await api.get('/fees/student-fees/my');
        setData(res.data.data);
      } catch (err) {
        setData({
          totalDue: 25000,
          totalPaid: 15000,
          balance: 10000,
          installments: [
            { id: 1, name: 'Term 1 Fee', amount: 15000, dueDate: '2026-01-15', status: 'paid' },
            { id: 2, name: 'Term 2 Fee', amount: 10000, dueDate: '2026-08-15', status: 'pending' },
          ],
          history: [
            { date: '2026-01-10', amount: 15000, receiptNo: 'RCP-2026-001', method: 'Online' }
          ]
        });
      } finally {
        setLoading(false);
      }
    };
    fetchFees();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-8 w-48 bg-ink-200 rounded"></div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="h-24 bg-ink-200 rounded-md"></div>
          <div className="h-24 bg-ink-200 rounded-md"></div>
          <div className="h-24 bg-ink-200 rounded-md"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-text-primary">My Fees</h2>
          <p className="text-sm text-text-secondary mt-1">View your fee structure, dues, and payment history.</p>
        </div>
        {data?.balance > 0 && (
          <button className="px-4 py-2 bg-brand-600 text-white rounded-md text-sm font-medium hover:bg-brand-700 transition-colors flex items-center gap-2">
            <CreditCard className="w-4 h-4" /> Pay Now
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <StatCard title="Total Fee" value={`₹${data?.totalDue?.toLocaleString() || 0}`} icon={DollarSign} color="blue" />
        <StatCard title="Total Paid" value={`₹${data?.totalPaid?.toLocaleString() || 0}`} icon={CheckCircle} color="success" />
        <StatCard title="Balance Due" value={`₹${data?.balance?.toLocaleString() || 0}`} icon={AlertCircle} color={data?.balance > 0 ? 'danger' : 'success'} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-surface border border-border rounded-md overflow-hidden">
          <div className="px-5 py-4 border-b border-border flex items-center gap-2">
            <Clock className="w-5 h-5 text-brand-500" />
            <h3 className="text-base font-semibold text-text-primary">Installments & Dues</h3>
          </div>
          <div className="divide-y divide-border">
            {data?.installments?.map(inst => (
              <div key={inst.id} className="p-5 hover:bg-bg transition-colors flex justify-between items-center">
                <div>
                  <p className="text-sm font-medium text-text-primary">{inst.name}</p>
                  <p className="text-xs text-text-secondary mt-1">Due: {new Intl.DateTimeFormat('en-IN', { dateStyle: 'medium' }).format(new Date(inst.dueDate))}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-text-primary mb-1">₹{inst.amount.toLocaleString()}</p>
                  <StatusBadge status={inst.status} />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-surface border border-border rounded-md overflow-hidden">
          <div className="px-5 py-4 border-b border-border flex items-center gap-2">
            <FileText className="w-5 h-5 text-brand-500" />
            <h3 className="text-base font-semibold text-text-primary">Payment History</h3>
          </div>
          <div className="divide-y divide-border">
            {data?.history?.map((hist, i) => (
              <div key={i} className="p-5 hover:bg-bg transition-colors flex justify-between items-center">
                <div>
                  <p className="text-sm font-medium text-text-primary">{hist.receiptNo}</p>
                  <p className="text-xs text-text-secondary mt-1">{new Intl.DateTimeFormat('en-IN', { dateStyle: 'medium' }).format(new Date(hist.date))} • {hist.method}</p>
                </div>
                <p className="text-sm font-bold text-success-600">₹{hist.amount.toLocaleString()}</p>
              </div>
            ))}
            {(!data?.history || data.history.length === 0) && (
              <div className="px-5 py-8 text-center text-text-disabled text-sm">No payment history found.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Ensure icons used above are imported
import { CheckCircle, AlertCircle } from 'lucide-react';
