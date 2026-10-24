import React, { useState } from 'react';
import { useEMS } from '../context/EMSContext';
import type { Employee } from '../types/ems';
import { PageHeader } from '../components/common/PageHeader';
import { formatINR, formatCompactINR, formatDate } from '../utils/currency';
import {
  Users,
  Search,
  Plus,
  UserCheck,
  CheckCircle2,
  Clock,
  FileText,
  Building,
  Mail,
  Calendar,
  IndianRupee,
  MapPin,
  Phone,
  Shield,
  X,
  AlertCircle,
  Briefcase
} from 'lucide-react';

export const OnboardingPage: React.FC = () => {
  const { employees, addEmployee } = useEMS();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDept, setSelectedDept] = useState('All');
  const [selectedEmpId, setSelectedEmpId] = useState<string>(employees[0]?.id || 'EMP-1001');
  const [showAddModal, setShowAddModal] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: '',
    department: 'Engineering' as Employee['department'],
    manager: 'Aarav Sharma',
    location: 'Bengaluru, Karnataka (Tech Campus)',
    phone: '+91 98000 00000',
    joiningDate: new Date().toISOString().split('T')[0],
    baseCTC: 1800000,
    panNumber: '',
    pfUan: '',
  });

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const selectedEmp = employees.find(e => e.id === selectedEmpId) || employees[0];

  const filteredEmployees = employees.filter((emp) => {
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !q ||
      emp.name.toLowerCase().includes(q) ||
      emp.role.toLowerCase().includes(q) ||
      emp.id.toLowerCase().includes(q) ||
      emp.email.toLowerCase().includes(q) ||
      emp.skills.some(s => s.toLowerCase().includes(q));
    const matchesDept = selectedDept === 'All' || emp.department === selectedDept;
    return matchesSearch && matchesDept;
  });

  const validateForm = () => {
    const errors: Record<string, string> = {};
    if (!formData.name.trim()) errors.name = 'Full name is required';
    if (!formData.email.trim()) errors.email = 'Corporate email is required';
    else if (!formData.email.includes('@')) errors.email = 'Invalid corporate email address';
    if (!formData.role.trim()) errors.role = 'Designation/Role is required';
    if (!formData.panNumber.trim()) errors.panNumber = 'Valid PAN number required for Indian statutory payroll';
    if (!formData.baseCTC || formData.baseCTC <= 0) errors.baseCTC = 'Annual CTC in INR (₹) must be greater than zero';
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    const baseAmount = Number(formData.baseCTC);
    const hraAmount = Math.round(baseAmount * 0.4);
    const allowancesAmount = Math.round(baseAmount * 0.15);
    const deductionsAmount = Math.round(baseAmount * 0.1);

    addEmployee({
      name: formData.name.trim(),
      email: formData.email.trim(),
      role: formData.role.trim(),
      department: formData.department,
      manager: formData.manager,
      joiningDate: formData.joiningDate,
      status: 'Onboarding',
      salary: {
        base: baseAmount,
        hra: hraAmount,
        allowances: allowancesAmount,
        deductions: deductionsAmount,
      },
      skills: ['Enterprise HCM', 'Cross-functional Collaboration'],
      kpiRating: 4.0,
      onboardingProgress: 20,
      phone: formData.phone,
      location: formData.location,
      panNumber: formData.panNumber.toUpperCase(),
      pfUan: formData.pfUan || '100' + Math.floor(100000000 + Math.random() * 900000000),
    });

    // Reset and close
    setFormData({
      name: '',
      email: '',
      role: '',
      department: 'Engineering',
      manager: 'Aarav Sharma',
      location: 'Bengaluru, Karnataka (Tech Campus)',
      phone: '+91 98000 00000',
      joiningDate: new Date().toISOString().split('T')[0],
      baseCTC: 1800000,
      panNumber: '',
      pfUan: '',
    });
    setFormErrors({});
    setShowAddModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Enterprise Page Header */}
      <PageHeader
        moduleBadge="Enterprise HR Module 01"
        badgeColor="bg-blue-50 text-blue-700 border-blue-200"
        title="Employee Directory & Lifecycle Records"
        description="Enterprise personnel registry, PAN & PF UAN verification, 30-60-90 day KPI roadmaps, and statutory documentation trackers."
        countBadge={`${employees.length} Personnel Active`}
        actions={
          <button
            onClick={() => setShowAddModal(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold shadow-sm shadow-blue-500/20 transition"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Personnel</span>
          </button>
        }
      />

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-2xs">
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
          <div className="text-xs font-medium text-emerald-600 mt-1">
            Active workforce in system
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              In Onboarding
            </span>
            <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-slate-900 mt-2">
            {employees.filter(e => e.status === 'Onboarding').length}
          </div>
          <div className="text-xs font-medium text-slate-500 mt-1">
            30-60-90 Day Roadmap cycle
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Average Ramp Time
            </span>
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <UserCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-slate-900 mt-2">
            38 Days
          </div>
          <div className="text-xs font-medium text-emerald-600 mt-1">
            18% faster than benchmark
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              KYC & PAN Compliance
            </span>
            <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <FileText className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-slate-900 mt-2">
            100%
          </div>
          <div className="text-xs font-medium text-slate-500 mt-1">
            Income Tax & EPFO verified
          </div>
        </div>
      </div>

      {/* Directory Search & Profile Detail Split */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Personnel List */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-2xs">
            {/* Search and Filter Inputs */}
            <div className="flex flex-col sm:flex-row gap-2.5 mb-4">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  placeholder="Search name, role, ID..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 pl-9 pr-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white transition"
                />
              </div>

              <select
                value={selectedDept}
                onChange={(e) => setSelectedDept(e.target.value)}
                className="bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 px-3 py-2.5 font-medium focus:outline-none focus:ring-2 focus:ring-blue-600"
              >
                <option value="All">All Depts</option>
                <option value="Engineering">Engineering</option>
                <option value="Product">Product</option>
                <option value="Operations">Operations</option>
                <option value="Human Resources">HR</option>
                <option value="Finance">Finance</option>
              </select>
            </div>

            {/* Employee Cards List */}
            <div className="space-y-2.5 max-h-[560px] overflow-y-auto pr-1">
              {filteredEmployees.length === 0 ? (
                <div className="p-8 text-center text-slate-400 text-xs">
                  No personnel matching "{searchQuery}".
                </div>
              ) : (
                filteredEmployees.map((emp) => {
                  const isSelected = selectedEmp?.id === emp.id;
                  return (
                    <div
                      key={emp.id}
                      onClick={() => setSelectedEmpId(emp.id)}
                      className={`p-3.5 rounded-xl border transition cursor-pointer flex items-center justify-between ${
                        isSelected
                          ? 'bg-blue-50/70 border-blue-500 shadow-xs'
                          : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-10 h-10 rounded-xl bg-slate-900 text-white font-bold flex items-center justify-center text-xs flex-shrink-0">
                          {emp.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="text-xs sm:text-sm font-bold text-slate-900 truncate">
                              {emp.name}
                            </span>
                            <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-slate-100 text-slate-600 border border-slate-200">
                              {emp.id}
                            </span>
                          </div>
                          <div className="text-xs text-slate-500 truncate mt-0.5">
                            {emp.role} • {emp.department}
                          </div>
                        </div>
                      </div>

                      <div className="text-right flex flex-col items-end flex-shrink-0 ml-2">
                        <span
                          className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${
                            emp.status === 'Active'
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                              : emp.status === 'Onboarding'
                              ? 'bg-amber-50 text-amber-700 border-amber-200'
                              : 'bg-rose-50 text-rose-700 border-rose-200'
                          }`}
                        >
                          {emp.status}
                        </span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Detailed Employee Dossier */}
        <div className="lg:col-span-7 space-y-4">
          {selectedEmp ? (
            <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-2xs space-y-6">
              {/* Profile Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-5 border-b border-slate-100 gap-4">
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-extrabold flex items-center justify-center text-xl shadow-sm shadow-blue-500/20">
                    {selectedEmp.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h2 className="text-xl font-extrabold text-slate-900">
                        {selectedEmp.name}
                      </h2>
                      <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200 font-semibold">
                        {selectedEmp.id}
                      </span>
                      <span className="text-xs px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200 font-semibold">
                        {selectedEmp.department}
                      </span>
                    </div>
                    <p className="text-xs font-semibold text-slate-600 mt-1">
                      {selectedEmp.role}
                    </p>
                    <div className="flex flex-wrap items-center gap-3 mt-2 text-xs text-slate-500">
                      <span className="flex items-center gap-1">
                        <Mail className="w-3.5 h-3.5 text-slate-400" />
                        {selectedEmp.email}
                      </span>
                      <span className="flex items-center gap-1">
                        <Building className="w-3.5 h-3.5 text-slate-400" />
                        Rep: {selectedEmp.manager}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        Joined: {formatDate(selectedEmp.joiningDate)}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col items-start sm:items-end flex-shrink-0">
                  <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                    Performance KPI
                  </span>
                  <span className="text-lg font-extrabold text-slate-900 mt-0.5 inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200">
                    ★ {selectedEmp.kpiRating} / 5.0
                  </span>
                </div>
              </div>

              {/* Statutory & Compensation Dossier (INR) */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80">
                  <div className="text-[11px] font-semibold text-slate-500 uppercase flex items-center gap-1">
                    <IndianRupee className="w-3.5 h-3.5 text-blue-600" />
                    Annual CTC
                  </div>
                  <div className="text-lg font-bold text-slate-900 mt-1">
                    {formatINR(selectedEmp.salary.base + selectedEmp.salary.hra + selectedEmp.salary.allowances)}
                  </div>
                  <div className="text-[11px] text-slate-500 mt-0.5">
                    Base: {formatCompactINR(selectedEmp.salary.base)}/yr
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80">
                  <div className="text-[11px] font-semibold text-slate-500 uppercase flex items-center gap-1">
                    <Shield className="w-3.5 h-3.5 text-emerald-600" />
                    Indian PAN
                  </div>
                  <div className="text-sm font-mono font-bold text-slate-900 mt-1">
                    {selectedEmp.panNumber || 'ABCPS1234F'}
                  </div>
                  <div className="text-[11px] text-emerald-600 mt-0.5 font-medium">
                    Verified with NSDL
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80">
                  <div className="text-[11px] font-semibold text-slate-500 uppercase flex items-center gap-1">
                    <Briefcase className="w-3.5 h-3.5 text-purple-600" />
                    EPFO UAN
                  </div>
                  <div className="text-sm font-mono font-bold text-slate-900 mt-1">
                    {selectedEmp.pfUan || '100987654321'}
                  </div>
                  <div className="text-[11px] text-purple-600 mt-0.5 font-medium">
                    Unified Portal Linked
                  </div>
                </div>
              </div>

              {/* Contact and Workstation Details */}
              <div className="p-4 rounded-xl bg-slate-50/70 border border-slate-200/80 text-xs space-y-2">
                <div className="font-semibold text-slate-700 uppercase tracking-wider text-[11px]">
                  Deployment Location & Contact
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-slate-600">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-slate-400" />
                    <span>{selectedEmp.location || 'Bengaluru, Karnataka (Tech Campus)'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-slate-400" />
                    <span>{selectedEmp.phone || '+91 98450 12345'}</span>
                  </div>
                </div>
              </div>

              {/* 30-60-90 Day Milestone Roadmap */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                    30-60-90 Day Onboarding Roadmap & Progress
                  </h3>
                  <span className="text-xs font-bold text-blue-600">
                    {selectedEmp.onboardingProgress || 100}% Completed
                  </span>
                </div>

                <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-blue-600 transition-all duration-300"
                    style={{ width: `${selectedEmp.onboardingProgress || 100}%` }}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                  <div className="p-3 rounded-xl border border-slate-200 bg-white">
                    <div className="flex items-center justify-between text-xs font-bold text-slate-900 mb-1">
                      <span>Day 01 - 30</span>
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    </div>
                    <p className="text-xs text-slate-500">
                      Orientation, POSH training, corporate IT equipment issuance & Git repo access.
                    </p>
                  </div>

                  <div className="p-3 rounded-xl border border-slate-200 bg-white">
                    <div className="flex items-center justify-between text-xs font-bold text-slate-900 mb-1">
                      <span>Day 31 - 60</span>
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    </div>
                    <p className="text-xs text-slate-500">
                      First sprint deliverables, buddy shadowing, architecture review, and 1st check-in.
                    </p>
                  </div>

                  <div className="p-3 rounded-xl border border-slate-200 bg-white">
                    <div className="flex items-center justify-between text-xs font-bold text-slate-900 mb-1">
                      <span>Day 61 - 90</span>
                      <Clock className="w-4 h-4 text-amber-500" />
                    </div>
                    <p className="text-xs text-slate-500">
                      Independent milestone ownership, quarterly KPI alignment, and confirmation sign-off.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-slate-200/80 p-12 text-center text-slate-400">
              Select an employee from the directory to view complete dossier.
            </div>
          )}
        </div>
      </div>

      {/* Add Employee Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="relative w-full max-w-xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/70">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Register New Personnel
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Enter statutory employee record details with Indian Rupee (₹) compensation.
                </p>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Vikram Malhotra"
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white"
                  />
                  {formErrors.name && (
                    <p className="text-xs text-rose-600 mt-1">{formErrors.name}</p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Corporate Email *
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="e.g. vikram.m@optipeople.in"
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white"
                  />
                  {formErrors.email && (
                    <p className="text-xs text-rose-600 mt-1">{formErrors.email}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Designation / Role *
                  </label>
                  <input
                    type="text"
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    placeholder="e.g. Lead Security Architect"
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white"
                  />
                  {formErrors.role && (
                    <p className="text-xs text-rose-600 mt-1">{formErrors.role}</p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Department *
                  </label>
                  <select
                    value={formData.department}
                    onChange={(e) => setFormData({ ...formData, department: e.target.value as any })}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white"
                  >
                    <option value="Engineering">Engineering</option>
                    <option value="Product">Product</option>
                    <option value="Operations">Operations</option>
                    <option value="Human Resources">Human Resources</option>
                    <option value="Finance">Finance</option>
                    <option value="Sales">Sales</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Annual CTC in INR (₹) *
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-2.5 text-sm font-semibold text-slate-400">₹</span>
                    <input
                      type="number"
                      value={formData.baseCTC}
                      onChange={(e) => setFormData({ ...formData, baseCTC: Number(e.target.value) })}
                      placeholder="e.g. 1800000"
                      className="w-full pl-8 pr-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white font-medium"
                    />
                  </div>
                  {formErrors.baseCTC && (
                    <p className="text-xs text-rose-600 mt-1">{formErrors.baseCTC}</p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Indian PAN Number *
                  </label>
                  <input
                    type="text"
                    value={formData.panNumber}
                    onChange={(e) => setFormData({ ...formData, panNumber: e.target.value.toUpperCase() })}
                    placeholder="e.g. ABCDE1234F"
                    maxLength={10}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white font-mono uppercase"
                  />
                  {formErrors.panNumber && (
                    <p className="text-xs text-rose-600 mt-1">{formErrors.panNumber}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    EPFO UAN (Universal Account Number)
                  </label>
                  <input
                    type="text"
                    value={formData.pfUan}
                    onChange={(e) => setFormData({ ...formData, pfUan: e.target.value })}
                    placeholder="e.g. 100987654321"
                    maxLength={12}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Deployment Location
                  </label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    placeholder="e.g. Bengaluru, Karnataka (Tech Hub)"
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold shadow-sm shadow-blue-500/20 transition"
                >
                  Complete Registration
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
