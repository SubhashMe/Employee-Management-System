import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useEMS } from '../../context/EMSContext';
import {
  Menu,
  Search,
  Bell,
  Building2,
  LogOut,
  User,
  CheckCheck,
  Trash2,
  Calendar,
  AlertTriangle,
  IndianRupee,
  CheckCircle,
  Clock
} from 'lucide-react';

interface HeaderProps {
  onMobileMenuToggle: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onMobileMenuToggle }) => {
  const { logout, user } = useAuth();
  const {
    activeTab,
    setActiveTab,
    notifications,
    markNotificationRead,
    markAllNotificationsRead,
    clearNotifications,
    unreadNotificationsCount,
    setIsSearchModalOpen,
  } = useEMS();

  const [notificationsOpen, setNotificationsOpen] = useState<boolean>(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState<boolean>(false);

  const notifRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setNotificationsOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setProfileDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getModuleTitle = (tab: string) => {
    switch (tab) {
      case 'overview':
        return 'Executive Overview';
      case 'onboarding':
        return 'Employee Directory';
      case 'attendance':
        return 'Leaves & Attendance';
      case 'performance':
        return 'OKRs & Appraisals';
      case 'payroll':
        return 'Payroll & Tax Slabs';
      case 'relations':
        return 'Employee Grievances';
      case 'offboarding':
        return 'Exit & KT Clearance';
      default:
        return 'Enterprise Portal';
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'leave':
        return <Calendar className="w-4 h-4 text-emerald-600" />;
      case 'payroll':
        return <IndianRupee className="w-4 h-4 text-blue-600" />;
      case 'grievance':
        return <AlertTriangle className="w-4 h-4 text-rose-600" />;
      case 'exit':
        return <Clock className="w-4 h-4 text-amber-600" />;
      default:
        return <CheckCircle className="w-4 h-4 text-indigo-600" />;
    }
  };

  const handleNotificationClick = (id: string, targetModule: string) => {
    markNotificationRead(id);
    setActiveTab(targetModule);
    setNotificationsOpen(false);
  };

  return (
    <header className="h-16 bg-white border-b border-slate-200/90 px-4 sm:px-6 flex items-center justify-between sticky top-0 z-30 shadow-2xs">
      {/* Left Section: Mobile Menu Trigger + Brand with Fix for Logo-to-Name Gap */}
      <div className="flex items-center gap-3 sm:gap-4 min-w-0">
        {/* Mobile Hamburger */}
        <button
          onClick={onMobileMenuToggle}
          className="md:hidden p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition"
          aria-label="Open navigation menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Brand Block - generous gap between logo and text to fix "logo se name chipka hua hai" */}
        <div className="flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-sm shadow-blue-500/20 flex-shrink-0">
            <Building2 className="w-5 h-5" />
          </div>
          <div className="flex flex-col justify-center">
            <div className="flex items-center gap-2">
              <span className="text-base sm:text-lg font-extrabold text-slate-900 tracking-tight leading-none">
                OptiPeople
              </span>
              <span className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200/60 hidden sm:inline-block">
                Enterprise
              </span>
            </div>
            <span className="text-[11px] font-medium text-slate-500 leading-tight mt-0.5 hidden xs:block">
              {getModuleTitle(activeTab)}
            </span>
          </div>
        </div>
      </div>

      {/* Center Section: Functional Global Search Box with Shortcut */}
      <div className="hidden md:flex items-center flex-1 max-w-md mx-6">
        <button
          type="button"
          onClick={() => setIsSearchModalOpen(true)}
          className="w-full flex items-center justify-between px-3.5 py-2 bg-slate-50 hover:bg-slate-100/80 border border-slate-200 rounded-xl text-slate-500 text-sm transition group"
        >
          <div className="flex items-center gap-2.5">
            <Search className="w-4 h-4 text-slate-400 group-hover:text-blue-600 transition" />
            <span className="text-xs sm:text-sm font-normal text-slate-400">
              Search employees, leaves, grievances...
            </span>
          </div>
          <kbd className="hidden lg:inline-flex items-center gap-0.5 font-mono text-[10px] font-semibold text-slate-500 bg-white border border-slate-200 px-1.5 py-0.5 rounded shadow-2xs">
            Ctrl+K
          </kbd>
        </button>
      </div>

      {/* Right Section: Mobile Search, Notification Bell, User Avatar & Sign Out */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Mobile Search Icon Button */}
        <button
          onClick={() => setIsSearchModalOpen(true)}
          className="md:hidden p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition"
          aria-label="Search"
        >
          <Search className="w-5 h-5" />
        </button>

        {/* Currency Tag */}
        <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-50 border border-emerald-200/60 text-emerald-700 text-xs font-semibold">
          <IndianRupee className="w-3.5 h-3.5" />
          <span>INR (₹) Standard</span>
        </div>

        {/* Notification Bell Dropdown */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => setNotificationsOpen(!notificationsOpen)}
            className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl relative transition"
            aria-label="Notifications"
          >
            <Bell className="w-5 h-5" />
            {unreadNotificationsCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-rose-600 text-white text-[10px] font-bold flex items-center justify-center ring-2 ring-white">
                {unreadNotificationsCount}
              </span>
            )}
          </button>

          {/* Notification Menu */}
          {notificationsOpen && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-150">
              <div className="p-3.5 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-bold text-slate-900">Notifications</h3>
                  {unreadNotificationsCount > 0 && (
                    <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-rose-100 text-rose-700">
                      {unreadNotificationsCount} new
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={markAllNotificationsRead}
                    title="Mark all as read"
                    className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-slate-100 rounded-md transition"
                  >
                    <CheckCheck className="w-4 h-4" />
                  </button>
                  <button
                    onClick={clearNotifications}
                    title="Clear all notifications"
                    className="p-1.5 text-slate-500 hover:text-rose-600 hover:bg-slate-100 rounded-md transition"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
                {notifications.length === 0 ? (
                  <div className="p-8 text-center text-slate-400">
                    <Bell className="w-8 h-8 mx-auto mb-2 opacity-40" />
                    <p className="text-sm font-medium">All caught up!</p>
                    <p className="text-xs mt-1">No notifications right now.</p>
                  </div>
                ) : (
                  notifications.map((item) => (
                    <div
                      key={item.id}
                      onClick={() => handleNotificationClick(item.id, item.targetModule)}
                      className={`p-3.5 flex items-start gap-3 hover:bg-slate-50 transition cursor-pointer ${
                        !item.read ? 'bg-blue-50/40' : ''
                      }`}
                    >
                      <div className="w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center flex-shrink-0 mt-0.5 shadow-2xs">
                        {getNotificationIcon(item.type)}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-1">
                          <h4 className="text-xs font-bold text-slate-900 truncate">
                            {item.title}
                          </h4>
                          <span className="text-[10px] text-slate-400 flex-shrink-0">
                            {item.time}
                          </span>
                        </div>
                        <p className="text-xs text-slate-600 line-clamp-2 mt-0.5 leading-relaxed">
                          {item.description}
                        </p>
                      </div>
                      {!item.read && (
                        <div className="w-2 h-2 rounded-full bg-blue-600 flex-shrink-0 mt-2" />
                      )}
                    </div>
                  ))
                )}
              </div>

              {notifications.length > 0 && (
                <div className="p-2 border-t border-slate-100 bg-slate-50 text-center">
                  <span className="text-[11px] text-slate-500 font-medium">
                    Click any alert to navigate to its module
                  </span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* User Profile Dropdown with Logout */}
        <div className="relative" ref={profileRef}>
          <button
            onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
            className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-slate-100 transition"
          >
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center text-xs font-bold shadow-2xs">
              AD
            </div>
            <div className="hidden sm:block text-left">
              <span className="text-xs font-bold text-slate-800 block leading-tight">
                {user || 'Admin'}
              </span>
              <span className="text-[10px] font-medium text-slate-500 block leading-tight">
                HR Director
              </span>
            </div>
          </button>

          {profileDropdownOpen && (
            <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-200 py-1.5 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
              <div className="px-4 py-2.5 border-b border-slate-100">
                <p className="text-xs font-semibold text-slate-900">{user || 'Admin'}</p>
                <p className="text-[11px] text-slate-500 truncate">admin@optipeople.in</p>
                <div className="mt-1.5 inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                  Role: Corporate CHRO
                </div>
              </div>

              <div className="py-1">
                <button
                  onClick={() => {
                    setActiveTab('overview');
                    setProfileDropdownOpen(false);
                  }}
                  className="w-full flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 transition"
                >
                  <User className="w-4 h-4 text-slate-400" />
                  <span>Workforce Dashboard</span>
                </button>
              </div>

              <div className="border-t border-slate-100 pt-1">
                <button
                  onClick={() => {
                    setProfileDropdownOpen(false);
                    logout();
                  }}
                  className="w-full flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 transition"
                >
                  <LogOut className="w-4 h-4 text-rose-500" />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
