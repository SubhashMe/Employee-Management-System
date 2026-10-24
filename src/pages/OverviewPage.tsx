import React from 'react';
import { useEMS } from '../context/EMSContext';
import { PageHeader } from '../components/common/PageHeader';
import { formatCompactINR } from '../utils/currency';
import {
  Users,
  CalendarDays,
  Target,
  IndianRupee,
  HeartHandshake,
  LogOut,
  ArrowUpRight,
  ShieldCheck,
  TrendingUp,
  UserCheck,
  Building,
  CheckCircle2,
  Clock
} from 'lucide-react';

interface OverviewPageProps {
  onNavigate: (module: string) => void;
}

export const OverviewPage: React.FC<OverviewPageProps> = ({ onNavigate }) => {
  const { employees, leaves, grievances, goals, exits } = useEMS();

  const onboardingCount = employees.filter(e => e.status === 'Onboarding').length;
  const activeCount = employees.filter(e => e.status === 'Active').length;
  const pendingLeaves = leaves.filter(l => l.status === 'Pending').length;
  const activeGrievances = grievances.filter(g => g.status === 'Under Investigation').length;
  const exitsCount = exits.filter(e => e.status !== 'Cleared').length;

  // Calculate annual total CTC payout across all active employees in INR
  const totalAnnualPayrollINR = employees.reduce((acc, curr) => {
    return acc + (curr.salary.base + curr.salary.hra + curr.salary.allowances);
  }, 0);

  // Department counts
  const departmentCounts = employees.reduce((acc, emp) => {
    acc[emp.department] = (acc[emp.department] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="space-y-6">
      {/* Enterprise Page Header */}
      <PageHeader
        moduleBadge="Enterprise Command Center"
        badgeColor="bg-blue-50 text-blue-700 border-blue-200"
        title="Workforce Governance & Analytics"
        description="Autonomous Human Capital operations governing talent records, leaves, appraisals, compliant Indian payroll (₹), grievance mediation, and offboarding."
        countBadge={`${employees.length} Total Headcount`}
        actions={
          <div className="flex items-center gap-2">
            <button
              onClick={() => onNavigate('onboarding')}
              className="inline-flex items-center gap-2 px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold shadow-sm shadow-blue-500/20 transition"
            >
              <Users className="w-3.5 h-3.5" />
              <span>Manage Directory</span>
            </button>
            <button
              onClick={() => onNavigate('payroll')}
              className="inline-flex items-center gap-2 px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold border border-slate-200 transition"
            >
              <IndianRupee className="w-3.5 h-3.5" />
              <span>Payroll Run (₹)</span>
            </button>
          </div>
        }
      />

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Headcount */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-2xs hover:border-slate-300 transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Total Headcount
            </span>
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-slate-900 mt-2">
            {employees.length}
          </div>
          <div className="flex items-center gap-1.5 mt-2 text-xs font-medium text-emerald-600">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>{activeCount} Active • {onboardingCount} Onboarding</span>
          </div>
        </div>

        {/* Annual Payroll Outlay in INR */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-2xs hover:border-slate-300 transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Annual Payroll Outlay
            </span>
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <IndianRupee className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-slate-900 mt-2">
            {formatCompactINR(totalAnnualPayrollINR)}
          </div>
          <div className="text-xs font-medium text-slate-500 mt-2">
            Indian Rupee (₹) Base + HRA + Allowances
          </div>
        </div>

        {/* Leave Requests & Presence */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-2xs hover:border-slate-300 transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Attendance & Leave
            </span>
            <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <CalendarDays className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-slate-900 mt-2">
            96.4%
          </div>
          <div className="flex items-center gap-1.5 mt-2 text-xs font-medium text-amber-700">
            <Clock className="w-3.5 h-3.5" />
            <span>{pendingLeaves} Approval Requests Pending</span>
          </div>
        </div>

        {/* Employee Relations & Compliance */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-2xs hover:border-slate-300 transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Relations & Health
            </span>
            <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-slate-900 mt-2">
            98.5%
          </div>
          <div className="flex items-center gap-1.5 mt-2 text-xs font-medium text-purple-700">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>{activeGrievances} Open Grievances • ISO Compliant</span>
          </div>
        </div>
      </div>

      {/* Two Column Section: Department Breakdown + Quick Navigation */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Department Distribution */}
        <div className="lg:col-span-1 bg-white rounded-2xl border border-slate-200/80 p-5 shadow-2xs">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              Department Distribution
            </h2>
            <Building className="w-4 h-4 text-slate-400" />
          </div>

          <div className="space-y-3.5">
            {Object.entries(departmentCounts).map(([dept, count]) => {
              const percent = Math.round((count / employees.length) * 100);
              return (
                <div key={dept} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-700">{dept}</span>
                    <span className="font-bold text-slate-900">{count} ({percent}%)</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-blue-600 transition-all duration-300"
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-5 pt-4 border-t border-slate-100 text-xs text-slate-500 flex items-center justify-between">
            <span>Primary Technology Pod: Bengaluru HQ</span>
            <span className="font-semibold text-blue-600">6 Locations</span>
          </div>
        </div>

        {/* Module Fast-Launch Grid */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200/80 p-5 shadow-2xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                Enterprise Lifecycle Modules
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Direct access to core human resource operations and workflows
              </p>
            </div>
            <UserCheck className="w-4 h-4 text-slate-400" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {/* Module 1: Directory */}
            <div
              onClick={() => onNavigate('onboarding')}
              className="p-4 rounded-xl border border-slate-200/90 hover:border-blue-400 hover:shadow-xs transition cursor-pointer group bg-slate-50/50 hover:bg-white"
            >
              <div className="flex items-center justify-between">
                <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center">
                  <Users className="w-4 h-4" />
                </div>
                <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600 group-hover:translate-x-0.5 transition" />
              </div>
              <h3 className="text-sm font-bold text-slate-900 mt-3 group-hover:text-blue-600 transition">
                Employee Directory & Profiles
              </h3>
              <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                Manage roles, PAN/UAN details, 30-60-90 day onboarding roadmaps, and competencies.
              </p>
              <div className="mt-3 pt-2 border-t border-slate-200/60 flex items-center justify-between text-[11px] font-semibold text-slate-600">
                <span>{employees.length} Personnel Registered</span>
                <span className="text-blue-600">Open Directory →</span>
              </div>
            </div>

            {/* Module 2: Leaves */}
            <div
              onClick={() => onNavigate('attendance')}
              className="p-4 rounded-xl border border-slate-200/90 hover:border-emerald-400 hover:shadow-xs transition cursor-pointer group bg-slate-50/50 hover:bg-white"
            >
              <div className="flex items-center justify-between">
                <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center">
                  <CalendarDays className="w-4 h-4" />
                </div>
                <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-600 group-hover:translate-x-0.5 transition" />
              </div>
              <h3 className="text-sm font-bold text-slate-900 mt-3 group-hover:text-emerald-600 transition">
                Leaves, Shifts & Rosters
              </h3>
              <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                Casual, Sick, and Paid leave quotas, manager approvals, and shift attendance tracking.
              </p>
              <div className="mt-3 pt-2 border-t border-slate-200/60 flex items-center justify-between text-[11px] font-semibold text-slate-600">
                <span className={pendingLeaves > 0 ? 'text-amber-600' : 'text-slate-600'}>
                  {pendingLeaves} Pending Approvals
                </span>
                <span className="text-emerald-600">Review Leaves →</span>
              </div>
            </div>

            {/* Module 3: Performance */}
            <div
              onClick={() => onNavigate('performance')}
              className="p-4 rounded-xl border border-slate-200/90 hover:border-purple-400 hover:shadow-xs transition cursor-pointer group bg-slate-50/50 hover:bg-white"
            >
              <div className="flex items-center justify-between">
                <div className="w-8 h-8 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center">
                  <Target className="w-4 h-4" />
                </div>
                <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-purple-600 group-hover:translate-x-0.5 transition" />
              </div>
              <h3 className="text-sm font-bold text-slate-900 mt-3 group-hover:text-purple-600 transition">
                OKRs & Performance Reviews
              </h3>
              <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                Quarterly performance milestones, progress metrics, and 1-5 scale KPI evaluations.
              </p>
              <div className="mt-3 pt-2 border-t border-slate-200/60 flex items-center justify-between text-[11px] font-semibold text-slate-600">
                <span>{goals.length} Active Goals</span>
                <span className="text-purple-600">View OKRs →</span>
              </div>
            </div>

            {/* Module 4: Payroll in INR */}
            <div
              onClick={() => onNavigate('payroll')}
              className="p-4 rounded-xl border border-slate-200/90 hover:border-blue-400 hover:shadow-xs transition cursor-pointer group bg-slate-50/50 hover:bg-white"
            >
              <div className="flex items-center justify-between">
                <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center">
                  <IndianRupee className="w-4 h-4" />
                </div>
                <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600 group-hover:translate-x-0.5 transition" />
              </div>
              <h3 className="text-sm font-bold text-slate-900 mt-3 group-hover:text-blue-600 transition">
                Payroll & Compensation (₹)
              </h3>
              <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                Indian tax slabs (115BAC), EPF, TDS, and printable PDF draft salary slips in INR.
              </p>
              <div className="mt-3 pt-2 border-t border-slate-200/60 flex items-center justify-between text-[11px] font-semibold text-slate-600">
                <span>Cycle: Monthly Payout</span>
                <span className="text-blue-600">Run Payroll →</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
