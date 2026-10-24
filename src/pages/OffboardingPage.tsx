import React, { useState } from 'react';
import { useEMS } from '../context/EMSContext';
import { PageHeader } from '../components/common/PageHeader';
import { formatDate } from '../utils/currency';
import {
  FileCheck2,
  UserX,
  Laptop,
  CheckCircle2,
  Clock,
  ShieldCheck,
  CheckSquare,
  Square,
  AlertCircle
} from 'lucide-react';

export const OffboardingPage: React.FC = () => {
  const { exits, updateExitStatus } = useEMS();
  const selectedExit = exits[0]; // Nikhil Rathi

  const [assetChecks, setAssetChecks] = useState({
    macbook: true,
    securityKey: true,
    idBadge: false,
    creditCard: true
  });

  const [ktProgressState, setKtProgressState] = useState<number>(selectedExit ? selectedExit.ktProgress : 80);
  const [clearanceIssued, setClearanceIssued] = useState<boolean>(selectedExit?.status === 'Cleared');

  const toggleAsset = (key: keyof typeof assetChecks) => {
    setAssetChecks(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleFinalClearance = () => {
    if (!selectedExit) return;
    updateExitStatus(selectedExit.id, 'Cleared');
    setClearanceIssued(true);
  };

  return (
    <div className="space-y-6">
      {/* Enterprise Page Header */}
      <PageHeader
        moduleBadge="Enterprise HR Module 06"
        badgeColor="bg-amber-50 text-amber-700 border-amber-200"
        title="Offboarding, KT & Asset Handover"
        description="Structured exit interview synthesis, knowledge transfer (KT) milestones, hardware recovery checklist, and Full & Final (FnF) statutory clearance."
        countBadge="1 Notice Cycle Active"
      />

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Serving Notice
            </span>
            <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <UserX className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-slate-900 mt-2">1 Employee</div>
          <div className="text-xs font-medium text-amber-700 mt-1">
            Notice period concluding Nov 15
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              KT Handover
            </span>
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <FileCheck2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-slate-900 mt-2">{ktProgressState}%</div>
          <div className="text-xs font-medium text-blue-600 mt-1">
            Documentation & repo handoff
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Asset Handover
            </span>
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Laptop className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-slate-900 mt-2">
            {Object.values(assetChecks).filter(Boolean).length} / 4 Items
          </div>
          <div className="text-xs font-medium text-emerald-600 mt-1">
            Hardware verification underway
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Exit Interview
            </span>
            <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl font-extrabold text-slate-900 mt-2">COMPLETED</div>
          <div className="text-xs font-medium text-slate-500 mt-1">
            Feedback cataloged & signed off
          </div>
        </div>
      </div>

      {/* Main Grid: Exit Dossier vs Interview Insights */}
      {selectedExit ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: KT & Hardware Recovery */}
          <div className="lg:col-span-7 space-y-4">
            <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-2xs space-y-6">
              {/* Employee Offboarding Banner */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-bold text-slate-900">
                      {selectedExit.employeeName}
                    </h3>
                    <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
                      {selectedExit.employeeId}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">
                    Resignation: {formatDate(selectedExit.resignationDate)} • Last Working Day:{' '}
                    <span className="font-semibold text-slate-800">{formatDate(selectedExit.lastWorkingDay)}</span>
                  </p>
                  <p className="text-xs text-slate-600 italic mt-1">
                    Reason: "{selectedExit.reasonForLeaving}"
                  </p>
                </div>

                <span
                  className={`text-xs font-semibold px-2.5 py-1 rounded-full border self-start sm:self-center ${
                    clearanceIssued || selectedExit.status === 'Cleared'
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                      : 'bg-amber-50 text-amber-700 border-amber-200'
                  }`}
                >
                  {clearanceIssued ? 'Cleared' : selectedExit.status}
                </span>
              </div>

              {/* Knowledge Transfer Tracker */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                      <FileCheck2 className="w-4 h-4 text-blue-600" />
                      Knowledge Transfer (KT) Completion
                    </h4>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Operational handover to team successor
                    </p>
                  </div>
                  <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 border border-blue-200">
                    {ktProgressState}%
                  </span>
                </div>

                <input
                  type="range"
                  min="0"
                  max="100"
                  value={ktProgressState}
                  onChange={(e) => setKtProgressState(Number(e.target.value))}
                  className="w-full accent-blue-600 cursor-pointer"
                />

                <div className="space-y-2 pt-1 text-xs">
                  <div className="p-3 rounded-xl border border-slate-200 bg-slate-50/60 flex items-center justify-between">
                    <span className="font-medium text-slate-800">
                      Financial models & ERP vendor credential handover
                    </span>
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                      Signed by CFO
                    </span>
                  </div>

                  <div className="p-3 rounded-xl border border-slate-200 bg-slate-50/60 flex items-center justify-between">
                    <span className="font-medium text-slate-800">
                      Q4 audit workpapers & forecasting spreadsheets
                    </span>
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                      Archived
                    </span>
                  </div>

                  <div className="p-3 rounded-xl border border-slate-200 bg-slate-50/60 flex items-center justify-between">
                    <span className="font-medium text-slate-800">
                      Bank account signatory & 2FA revocation
                    </span>
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200">
                      Nov 15 Cutoff
                    </span>
                  </div>
                </div>
              </div>

              {/* Hardware Recovery Checklist */}
              <div className="pt-4 border-t border-slate-100 space-y-3">
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                    <Laptop className="w-4 h-4 text-emerald-600" />
                    Company Asset Recovery Verification
                  </h4>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Click any item to toggle check-in status:
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div
                    onClick={() => toggleAsset('macbook')}
                    className={`p-3 rounded-xl border cursor-pointer flex items-center justify-between transition ${
                      assetChecks.macbook
                        ? 'bg-emerald-50 border-emerald-300 text-emerald-900 font-semibold'
                        : 'bg-white border-slate-200 text-slate-700'
                    }`}
                  >
                    <span>Apple MacBook Pro 16" (M2)</span>
                    {assetChecks.macbook ? (
                      <CheckSquare className="w-4 h-4 text-emerald-600" />
                    ) : (
                      <Square className="w-4 h-4 text-slate-400" />
                    )}
                  </div>

                  <div
                    onClick={() => toggleAsset('securityKey')}
                    className={`p-3 rounded-xl border cursor-pointer flex items-center justify-between transition ${
                      assetChecks.securityKey
                        ? 'bg-emerald-50 border-emerald-300 text-emerald-900 font-semibold'
                        : 'bg-white border-slate-200 text-slate-700'
                    }`}
                  >
                    <span>YubiKey 5C Security Token</span>
                    {assetChecks.securityKey ? (
                      <CheckSquare className="w-4 h-4 text-emerald-600" />
                    ) : (
                      <Square className="w-4 h-4 text-slate-400" />
                    )}
                  </div>

                  <div
                    onClick={() => toggleAsset('idBadge')}
                    className={`p-3 rounded-xl border cursor-pointer flex items-center justify-between transition ${
                      assetChecks.idBadge
                        ? 'bg-emerald-50 border-emerald-300 text-emerald-900 font-semibold'
                        : 'bg-white border-slate-200 text-slate-700'
                    }`}
                  >
                    <span>Smart RFID Campus Access Badge</span>
                    {assetChecks.idBadge ? (
                      <CheckSquare className="w-4 h-4 text-emerald-600" />
                    ) : (
                      <Square className="w-4 h-4 text-slate-400" />
                    )}
                  </div>

                  <div
                    onClick={() => toggleAsset('creditCard')}
                    className={`p-3 rounded-xl border cursor-pointer flex items-center justify-between transition ${
                      assetChecks.creditCard
                        ? 'bg-emerald-50 border-emerald-300 text-emerald-900 font-semibold'
                        : 'bg-white border-slate-200 text-slate-700'
                    }`}
                  >
                    <span>Corporate HDFC MasterCard</span>
                    {assetChecks.creditCard ? (
                      <CheckSquare className="w-4 h-4 text-emerald-600" />
                    ) : (
                      <Square className="w-4 h-4 text-slate-400" />
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Exit Interview & Clearance Actions */}
          <div className="lg:col-span-5 space-y-4">
            <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-2xs space-y-4">
              <div className="pb-3 border-b border-slate-100">
                <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                  Exit Interview Findings
                </h4>
                <p className="text-xs text-slate-500 mt-0.5">
                  Archived organizational learnings and handover status
                </p>
              </div>

              <div className="space-y-3 text-xs">
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                  <span className="font-bold text-slate-800 uppercase text-[10px] block">
                    Departure Reason
                  </span>
                  <p className="text-slate-600 leading-relaxed">
                    Voluntary departure to pursue full-time Executive MBA at Indian School of Business (ISB).
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                  <span className="font-bold text-slate-800 uppercase text-[10px] block">
                    Reporting Manager Relationship
                  </span>
                  <p className="text-slate-600 leading-relaxed">
                    Rated team collaboration 4.9/5. Praised mentorship under CFO Sunita Mehra.
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-emerald-50/60 border border-emerald-200 space-y-1">
                  <span className="font-bold text-emerald-900 uppercase text-[10px] block">
                    Re-Hire Eligibility
                  </span>
                  <p className="text-emerald-800 font-medium">
                    Status: "Highly Eligible for Future Leadership Re-hire"
                  </p>
                </div>
              </div>

              {/* FnF Settlement Action */}
              <div className="pt-4 border-t border-slate-100 space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-700">Full & Final (FnF):</span>
                  <span className="font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                    Audited & Reconciled
                  </span>
                </div>

                <button
                  onClick={handleFinalClearance}
                  disabled={clearanceIssued}
                  className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-200 disabled:text-slate-500 text-white font-semibold rounded-xl text-xs shadow-sm shadow-emerald-500/20 transition disabled:cursor-not-allowed"
                >
                  {clearanceIssued ? 'FnF Clearance Formally Granted' : 'Issue Formal FnF Clearance & Relieving Letter'}
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200/80 p-12 text-center text-slate-400">
          No personnel currently in active exit or notice period.
        </div>
      )}
    </div>
  );
};
