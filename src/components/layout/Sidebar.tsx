import React from 'react';
import { useEMS } from '../../context/EMSContext';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutDashboard,
  Users,
  CalendarDays,
  Target,
  IndianRupee,
  HeartHandshake,
  LogOut,
  X,
  Building2,
  ShieldCheck,
  ChevronRight
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const { activeTab, setActiveTab, employees, leaves, grievances } = useEMS();
  const { logout, user } = useAuth();

  const pendingLeavesCount = leaves.filter(l => l.status === 'Pending').length;
  const activeGrievanceCount = grievances.filter(g => g.status === 'Under Investigation').length;

  const navItems = [
    {
      id: 'overview',
      label: 'Executive Overview',
      subtitle: 'Workforce KPIs & Metrics',
      icon: LayoutDashboard,
    },
    {
      id: 'onboarding',
      label: 'Employee Directory',
      subtitle: 'Profiles, Roles & Records',
      icon: Users,
      badge: `${employees.length}`,
    },
    {
      id: 'attendance',
      label: 'Leaves & Shifts',
      subtitle: 'Quotas, Approvals & Calendar',
      icon: CalendarDays,
      badge: pendingLeavesCount > 0 ? `${pendingLeavesCount} Req` : undefined,
      badgeAlert: pendingLeavesCount > 0,
    },
    {
      id: 'performance',
      label: 'OKRs & Appraisals',
      subtitle: 'Quarterly Goals & Review',
      icon: Target,
    },
    {
      id: 'payroll',
      label: 'Payroll & Compensation',
      subtitle: 'Salary Slips & Tax Slabs (₹)',
      icon: IndianRupee,
    },
    {
      id: 'relations',
      label: 'Grievance Mediation',
      subtitle: 'Confidential Case Tickets',
      icon: HeartHandshake,
      badge: activeGrievanceCount > 0 ? `${activeGrievanceCount} Open` : undefined,
      badgeAlert: activeGrievanceCount > 0,
    },
    {
      id: 'offboarding',
      label: 'Offboarding & KT',
      subtitle: 'Exit Clearance & Assets',
      icon: LogOut,
    },
  ];

  return (
    <>
      {/* Mobile Backdrop Overlay - closes sidebar on tap */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/60 backdrop-blur-xs md:hidden transition-opacity"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-72 bg-white border-r border-slate-200/90 flex flex-col justify-between transition-transform duration-300 ease-in-out md:static md:translate-x-0 ${
          isOpen ? 'translate-x-0 shadow-2xl md:shadow-none' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col flex-1 overflow-y-auto">
          {/* Brand Header - Prominently displays Logo and Name especially on Mobile */}
          <div className="p-5 border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-md shadow-blue-500/20 flex-shrink-0">
                <Building2 className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="text-base font-extrabold text-slate-900 tracking-tight block truncate">
                    OptiPeople
                  </span>
                  <span className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200/60">
                    EMS
                  </span>
                </div>
                <span className="text-[11px] font-medium text-slate-500 block truncate">
                  Enterprise Workforce Suite
                </span>
              </div>
            </div>

            {/* Mobile Close Button */}
            <button
              onClick={onClose}
              className="md:hidden p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition"
              aria-label="Close navigation sidebar"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="p-3.5 space-y-1.5 flex-1">
            <div className="px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Core Modules
            </div>

            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    // Responsive requirement: auto-close sidebar after selection
                    onClose();
                  }}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-left transition group ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-sm shadow-blue-600/25 font-semibold'
                      : 'text-slate-700 hover:bg-slate-100/80 font-medium'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <Icon
                      className={`w-4 h-4 flex-shrink-0 ${
                        isActive ? 'text-white' : 'text-slate-500 group-hover:text-blue-600'
                      }`}
                    />
                    <div className="min-w-0">
                      <div className="text-xs sm:text-sm font-semibold truncate leading-tight">
                        {item.label}
                      </div>
                      <div
                        className={`text-[10px] truncate leading-tight mt-0.5 ${
                          isActive ? 'text-blue-100' : 'text-slate-400'
                        }`}
                      >
                        {item.subtitle}
                      </div>
                    </div>
                  </div>

                  {item.badge && (
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full flex-shrink-0 ml-2 ${
                        isActive
                          ? 'bg-blue-700 text-white'
                          : item.badgeAlert
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-slate-200 text-slate-700'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Footer Identity & Sign Out Block */}
        <div className="p-4 border-t border-slate-100 bg-slate-50/50">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center text-xs font-bold flex-shrink-0">
                {user ? user.slice(0, 2).toUpperCase() : 'AD'}
              </div>
              <div className="min-w-0">
                <span className="text-xs font-bold text-slate-900 block truncate">
                  {user || 'Admin'}
                </span>
                <span className="text-[10px] text-slate-500 flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-emerald-600" />
                  CHRO & Governance
                </span>
              </div>
            </div>

            <button
              onClick={() => {
                onClose();
                logout();
              }}
              title="Sign Out"
              className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>

          <div className="text-[10px] text-slate-400 text-center font-medium">
            OptiPeople HCM v3.4 • ISO 27001 Certified
          </div>
        </div>
      </aside>
    </>
  );
};
