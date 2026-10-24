import React, { useState } from 'react';
import { useEMS } from '../context/EMSContext';
import { PageHeader } from '../components/common/PageHeader';
import { formatDate } from '../utils/currency';
import {
  HeartHandshake,
  ShieldAlert,
  Smile,
  Lock,
  CheckCircle2,
  Clock,
  Plus,
  X,
  AlertTriangle,
  MessageSquare,
  ShieldCheck
} from 'lucide-react';

export const RelationsPage: React.FC = () => {
  const { grievances, addGrievance, resolveGrievance } = useEMS();
  const [selectedTicketId, setSelectedTicketId] = useState<string>(grievances[0]?.id || 'GRV-501');
  const [resolutionInput, setResolutionInput] = useState<string>('');
  const [showAddModal, setShowAddModal] = useState<boolean>(false);

  // New ticket state
  const [newCategory, setNewCategory] = useState<any>('Workplace Conflict');
  const [newSeverity, setNewSeverity] = useState<any>('Medium');
  const [newSubject, setNewSubject] = useState<string>('');
  const [newDescription, setNewDescription] = useState<string>('');
  const [isConfidential, setIsConfidential] = useState<boolean>(true);
  const [formError, setFormError] = useState<string | null>(null);

  const selectedTicket = grievances.find(g => g.id === selectedTicketId) || grievances[0];

  const handleResolveSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!resolutionInput.trim() || !selectedTicket) return;
    resolveGrievance(selectedTicket.id, resolutionInput.trim());
    setResolutionInput('');
  };

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSubject.trim() || !newDescription.trim()) {
      setFormError('Please enter both subject and detailed description.');
      return;
    }

    addGrievance({
      category: newCategory,
      severity: newSeverity,
      subject: newSubject.trim(),
      description: newDescription.trim(),
      isConfidential,
      status: 'Under Investigation',
    });

    setNewSubject('');
    setNewDescription('');
    setFormError(null);
    setShowAddModal(false);
  };

  const pendingCount = grievances.filter(g => g.status === 'Under Investigation').length;
  const resolvedCount = grievances.filter(g => g.status === 'Resolved').length;

  return (
    <div className="space-y-6">
      {/* Enterprise Page Header */}
      <PageHeader
        moduleBadge="Enterprise HR Module 05"
        badgeColor="bg-rose-50 text-rose-700 border-rose-200"
        title="Employee Relations & Grievance Mediation"
        description="Confidential mediation portal, POSH compliance, neutral grievance arbitration, and organizational pulse monitoring."
        countBadge={`${pendingCount} Active Cases`}
        actions={
          <button
            onClick={() => setShowAddModal(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-semibold shadow-sm shadow-rose-500/20 transition"
          >
            <Plus className="w-4 h-4" />
            <span>Raise Confidential Ticket</span>
          </button>
        }
      />

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Workplace Sentiment
            </span>
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Smile className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-slate-900 mt-2">4.4 / 5.0</div>
          <div className="text-xs font-medium text-emerald-600 mt-1">
            Healthy team pulse check
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Pending Inquiries
            </span>
            <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-slate-900 mt-2">{pendingCount}</div>
          <div className="text-xs font-medium text-amber-700 mt-1">
            Under confidential HR review
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Resolved Cases
            </span>
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-slate-900 mt-2">{resolvedCount}</div>
          <div className="text-xs font-medium text-blue-600 mt-1">
            Formal mediation closed
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Resolution SLA
            </span>
            <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-slate-900 mt-2">48 Hours</div>
          <div className="text-xs font-medium text-purple-600 mt-1">
            100% compliant with policy
          </div>
        </div>
      </div>

      {/* Main Grid: Ticket List vs Detailed Dossier */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Tickets Queue */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-2xs">
            <div className="pb-3 border-b border-slate-100 mb-3 flex items-center justify-between">
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                Grievance Tickets Queue ({grievances.length})
              </h2>
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                End-to-End Encrypted
              </span>
            </div>

            <div className="space-y-2.5 max-h-[520px] overflow-y-auto pr-1">
              {grievances.map((ticket) => {
                const isSelected = selectedTicket?.id === ticket.id;
                return (
                  <div
                    key={ticket.id}
                    onClick={() => setSelectedTicketId(ticket.id)}
                    className={`p-3.5 rounded-xl border transition cursor-pointer space-y-1.5 ${
                      isSelected
                        ? 'bg-rose-50/70 border-rose-400 shadow-2xs'
                        : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono font-bold text-slate-900">
                        {ticket.ticketNumber}
                      </span>
                      <span
                        className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${
                          ticket.status === 'Resolved'
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            : 'bg-amber-50 text-amber-700 border-amber-200'
                        }`}
                      >
                        {ticket.status}
                      </span>
                    </div>

                    <h4 className="text-xs sm:text-sm font-bold text-slate-900 truncate">
                      {ticket.subject}
                    </h4>

                    <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
                      <span>{ticket.category}</span>
                      <span className="font-semibold text-rose-600">
                        {ticket.severity} Priority
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column: Case Investigation Dossier */}
        <div className="lg:col-span-7 space-y-4">
          {selectedTicket ? (
            <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-2xs space-y-5">
              <div className="flex items-start justify-between pb-4 border-b border-slate-100 gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-800 border border-slate-200">
                      {selectedTicket.ticketNumber}
                    </span>
                    <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200">
                      {selectedTicket.severity} Severity
                    </span>
                    {selectedTicket.isConfidential && (
                      <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-900 text-white flex items-center gap-1">
                        <Lock className="w-3 h-3 text-rose-400" />
                        Confidential
                      </span>
                    )}
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 mt-2">
                    {selectedTicket.subject}
                  </h3>
                  <div className="text-xs text-slate-500 mt-1">
                    Filed on {formatDate(selectedTicket.submittedDate)} • Category: {selectedTicket.category}
                  </div>
                </div>

                <span
                  className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${
                    selectedTicket.status === 'Resolved'
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                      : 'bg-amber-50 text-amber-700 border-amber-200'
                  }`}
                >
                  {selectedTicket.status}
                </span>
              </div>

              {/* Case Narrative */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
                <span className="text-[11px] font-bold uppercase text-slate-500 block">
                  Statement of Grievance
                </span>
                <p className="text-xs text-slate-800 leading-relaxed">
                  {selectedTicket.description}
                </p>
              </div>

              {/* Resolution Note if resolved */}
              {selectedTicket.status === 'Resolved' && selectedTicket.resolutionNote && (
                <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 space-y-1.5">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-900">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    Formal Mediation Resolution Note
                  </div>
                  <p className="text-xs text-slate-800 leading-relaxed">
                    {selectedTicket.resolutionNote}
                  </p>
                </div>
              )}

              {/* Action Form if pending */}
              {selectedTicket.status !== 'Resolved' && (
                <form onSubmit={handleResolveSubmit} className="space-y-3 pt-2">
                  <label className="block text-xs font-semibold text-slate-700">
                    Mediation Conclusion & Action Plan *
                  </label>
                  <textarea
                    rows={3}
                    value={resolutionInput}
                    onChange={(e) => setResolutionInput(e.target.value)}
                    placeholder="Enter formal mediation notes, corrective counseling, or policy adjustment..."
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-rose-600 focus:bg-white"
                    required
                  />
                  <div className="flex justify-end">
                    <button
                      type="submit"
                      className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold shadow-sm shadow-emerald-500/20 transition"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Record Resolution & Close Case</span>
                    </button>
                  </div>
                </form>
              )}
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-slate-200/80 p-12 text-center text-slate-400">
              Select a ticket from the queue to view case details.
            </div>
          )}
        </div>
      </div>

      {/* Raise Ticket Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/70">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Submit Confidential Grievance Ticket
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Direct submission to Chief People Officer under strict whistleblower privacy.
                </p>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="p-6 space-y-4">
              {formError && (
                <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700">
                  {formError}
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Grievance Category *
                  </label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-rose-600 focus:bg-white"
                  >
                    <option value="Workplace Conflict">Workplace Conflict</option>
                    <option value="Compensation & Benefits">Compensation & Benefits</option>
                    <option value="Harassment & Ethics">Harassment & Ethics (POSH)</option>
                    <option value="Managerial Feedback">Managerial Feedback</option>
                    <option value="General Policy">General Policy</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Severity *
                  </label>
                  <select
                    value={newSeverity}
                    onChange={(e) => setNewSeverity(e.target.value)}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-rose-600 focus:bg-white"
                  >
                    <option value="Low">Low Priority</option>
                    <option value="Medium">Medium Priority</option>
                    <option value="High">High Priority</option>
                    <option value="Critical">Critical Priority</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Subject / Summary *
                </label>
                <input
                  type="text"
                  value={newSubject}
                  onChange={(e) => setNewSubject(e.target.value)}
                  placeholder="e.g. Discrepancy in project overtime compensation allocation"
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-rose-600 focus:bg-white"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Detailed Incident Statement *
                </label>
                <textarea
                  rows={4}
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  placeholder="Detail the circumstance, dates, persons involved, and attempted resolutions..."
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-rose-600 focus:bg-white"
                  required
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="confidential-check"
                  checked={isConfidential}
                  onChange={(e) => setIsConfidential(e.target.checked)}
                  className="w-4 h-4 text-rose-600 rounded border-slate-300 focus:ring-rose-500"
                />
                <label htmlFor="confidential-check" className="text-xs text-slate-700 font-medium cursor-pointer">
                  Tag as Strictly Confidential Whistleblower Report
                </label>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-semibold shadow-sm shadow-rose-500/20 transition"
                >
                  File Ticket
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
