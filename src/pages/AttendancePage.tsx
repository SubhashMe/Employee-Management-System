import React, { useState } from 'react';
import { useEMS } from '../context/EMSContext';
import { PageHeader } from '../components/common/PageHeader';
import { formatDate } from '../utils/currency';
import {
  CalendarDays,
  Clock,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  UserCheck,
  Calendar,
  Filter,
  Plus,
  X
} from 'lucide-react';

export const AttendancePage: React.FC = () => {
  const { leaves, updateLeaveStatus, addLeave, employees } = useEMS();
  const [filterStatus, setFilterStatus] = useState<string>('All');
  const [showApplyModal, setShowApplyModal] = useState<boolean>(false);

  // Form State
  const [selectedEmpId, setSelectedEmpId] = useState<string>(employees[0]?.id || '');
  const [leaveType, setLeaveType] = useState<'Casual Leave' | 'Sick Leave' | 'Paid Leave'>('Casual Leave');
  const [startDate, setStartDate] = useState<string>('2026-10-26');
  const [endDate, setEndDate] = useState<string>('2026-10-28');
  const [daysCount, setDaysCount] = useState<number>(3);
  const [reason, setReason] = useState<string>('');
  const [formError, setFormError] = useState<string | null>(null);

  const filteredLeaves = leaves.filter(l => {
    if (filterStatus === 'All') return true;
    return l.status === filterStatus;
  });

  const pendingLeaves = leaves.filter(l => l.status === 'Pending').length;
  const approvedLeaves = leaves.filter(l => l.status === 'Approved').length;

  const handleApplySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reason.trim()) {
      setFormError('Please specify the justification or reason for leave.');
      return;
    }

    const emp = employees.find(e => e.id === selectedEmpId) || employees[0];

    addLeave({
      employeeId: emp.id,
      employeeName: emp.name,
      department: emp.department,
      type: leaveType,
      startDate,
      endDate,
      days: daysCount,
      reason: reason.trim(),
      status: 'Pending',
    });

    setReason('');
    setFormError(null);
    setShowApplyModal(false);
  };

  const shiftRoster = [
    { empId: 'EMP-1001', name: 'Aarav Sharma', role: 'Principal Architect', shift: 'General (09:30 - 18:30)', availability: 'Active Online', status: 'Present' },
    { empId: 'EMP-1002', name: 'Priya Sundaram', role: 'Director Product', shift: 'Executive (10:00 - 19:00)', availability: 'In Strategy Review', status: 'Present' },
    { empId: 'EMP-1003', name: 'Rohan Mukherjee', role: 'Lead DevOps', shift: 'On-Call Pod (14:00 - 23:00)', availability: 'Monitoring AWS Clusters', status: 'Present' },
    { empId: 'EMP-1004', name: 'Sneha Iyer', role: 'People Partner', shift: 'General (09:30 - 18:30)', availability: 'Interviews & Mediation', status: 'Present' },
    { empId: 'EMP-1006', name: 'Ananya Deshmukh', role: 'Associate SDE', shift: 'General (09:30 - 18:30)', availability: 'Feature Sprint Pod', status: 'Present' },
  ];

  return (
    <div className="space-y-6">
      {/* Enterprise Page Header */}
      <PageHeader
        moduleBadge="Enterprise HR Module 02"
        badgeColor="bg-emerald-50 text-emerald-700 border-emerald-200"
        title="Leaves, Rosters & Workforce Availability"
        description="Statutory company leave governance (Casual: 12d, Sick: 10d, Earned: 18d), manager sign-offs, and daily shift presence."
        countBadge={`${pendingLeaves} Pending Requests`}
        actions={
          <button
            onClick={() => setShowApplyModal(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold shadow-sm shadow-emerald-500/20 transition"
          >
            <Plus className="w-4 h-4" />
            <span>Apply For Leave</span>
          </button>
        }
      />

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Daily Presence
            </span>
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <UserCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-slate-900 mt-2">96.8%</div>
          <div className="text-xs font-medium text-emerald-600 mt-1">
            Standard attendance met
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Pending Approvals
            </span>
            <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-slate-900 mt-2">{pendingLeaves}</div>
          <div className="text-xs font-medium text-amber-700 mt-1">
            Awaiting manager sign-off
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Approved Cycle
            </span>
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-slate-900 mt-2">{approvedLeaves}</div>
          <div className="text-xs font-medium text-blue-600 mt-1">
            Cleared for current month
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              On-Call Coverage
            </span>
            <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <CalendarDays className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-slate-900 mt-2">100%</div>
          <div className="text-xs font-medium text-purple-600 mt-1">
            Primary & Secondary active
          </div>
        </div>
      </div>

      {/* Main Content Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Leave Applications Ledger */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-2xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5 pb-4 border-b border-slate-100">
              <div>
                <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-emerald-600" />
                  Leave Request Queue
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Verify leave allocations before approving or rejecting.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <Filter className="w-3.5 h-3.5 text-slate-400" />
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-700 px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-600"
                >
                  <option value="All">All Requests</option>
                  <option value="Pending">Pending Approvals</option>
                  <option value="Approved">Approved</option>
                  <option value="Rejected">Rejected</option>
                </select>
              </div>
            </div>

            <div className="space-y-3">
              {filteredLeaves.length === 0 ? (
                <div className="p-8 text-center text-slate-400 text-xs">
                  No leave requests found for selected filter.
                </div>
              ) : (
                filteredLeaves.map((req) => (
                  <div
                    key={req.id}
                    className="p-4 rounded-xl border border-slate-200 bg-white hover:border-slate-300 transition flex flex-col md:flex-row md:items-center justify-between gap-4"
                  >
                    <div className="space-y-1.5 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-sm font-bold text-slate-900">
                          {req.employeeName}
                        </span>
                        <span className="text-xs text-slate-500">
                          ({req.department})
                        </span>
                        <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200">
                          {req.id}
                        </span>
                      </div>

                      <div className="flex flex-wrap items-center gap-2 text-xs text-slate-600">
                        <span className="px-2 py-0.5 rounded-md bg-amber-50 text-amber-800 border border-amber-200/60 font-semibold text-[11px]">
                          {req.type}
                        </span>
                        <span>•</span>
                        <span>
                          {formatDate(req.startDate)} to {formatDate(req.endDate)}
                        </span>
                        <span className="font-semibold text-slate-800">
                          ({req.days} Days)
                        </span>
                      </div>

                      <p className="text-xs text-slate-600 italic bg-slate-50 p-2 rounded-lg border border-slate-100 mt-1">
                        "{req.reason}"
                      </p>
                    </div>

                    <div className="flex items-center gap-2 self-start md:self-center flex-shrink-0 pt-2 md:pt-0">
                      {req.status === 'Pending' ? (
                        <>
                          <button
                            onClick={() => updateLeaveStatus(req.id, 'Approved')}
                            className="inline-flex items-center gap-1 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold shadow-2xs transition"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Approve</span>
                          </button>
                          <button
                            onClick={() => updateLeaveStatus(req.id, 'Rejected')}
                            className="inline-flex items-center gap-1 px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-lg text-xs font-semibold transition"
                          >
                            <XCircle className="w-3.5 h-3.5" />
                            <span>Reject</span>
                          </button>
                        </>
                      ) : (
                        <span
                          className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${
                            req.status === 'Approved'
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                              : 'bg-rose-50 text-rose-700 border-rose-200'
                          }`}
                        >
                          {req.status}
                        </span>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Shift Rotations & Availability */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-2xs">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
              <div>
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                  Daily Shift Rotations
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Live team availability and roster pods
                </p>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                POD BENGALURU
              </span>
            </div>

            <div className="space-y-2.5">
              {shiftRoster.map((item, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-xl border border-slate-200/80 bg-slate-50/50 hover:bg-white transition space-y-1.5"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-xs sm:text-sm font-bold text-slate-900">
                        {item.name}
                      </span>
                      <span className="text-xs text-slate-500 block">
                        {item.role}
                      </span>
                    </div>
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                      {item.status}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-xs pt-1.5 border-t border-slate-200/60 text-slate-600">
                    <span className="font-medium">{item.shift}</span>
                    <span className="font-semibold text-blue-600">{item.availability}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Apply Leave Modal */}
      {showApplyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/70">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Submit Leave Application
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Requests will be routed to reporting manager for approval.
                </p>
              </div>
              <button
                onClick={() => setShowApplyModal(false)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleApplySubmit} className="p-6 space-y-4">
              {formError && (
                <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700">
                  {formError}
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Employee *
                </label>
                <select
                  value={selectedEmpId}
                  onChange={(e) => setSelectedEmpId(e.target.value)}
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:bg-white"
                >
                  {employees.map(emp => (
                    <option key={emp.id} value={emp.id}>
                      {emp.name} ({emp.role} • {emp.department})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Leave Type *
                  </label>
                  <select
                    value={leaveType}
                    onChange={(e) => setLeaveType(e.target.value as any)}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:bg-white"
                  >
                    <option value="Casual Leave">Casual Leave (12d/yr)</option>
                    <option value="Sick Leave">Sick Leave (10d/yr)</option>
                    <option value="Paid Leave">Earned/Paid Leave (18d/yr)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Number of Days *
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={30}
                    value={daysCount}
                    onChange={(e) => setDaysCount(Number(e.target.value))}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:bg-white font-medium"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Start Date *
                  </label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    End Date *
                  </label>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Reason / Handover Note *
                </label>
                <textarea
                  rows={3}
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="Detail reason for absence and team on-call handover..."
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:bg-white"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowApplyModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold shadow-sm shadow-emerald-500/20 transition"
                >
                  Submit Request
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
