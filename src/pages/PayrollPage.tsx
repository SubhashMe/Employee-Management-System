import React, { useState } from 'react';
import { useEMS } from '../context/EMSContext';
import { PageHeader } from '../components/common/PageHeader';
import { formatINR, formatCompactINR } from '../utils/currency';
import {
  IndianRupee,
  Download,
  CreditCard,
  ShieldCheck,
  Receipt,
  Calculator,
  Percent,
  Building,
  CheckCircle2,
  FileCheck,
  Printer,
  X
} from 'lucide-react';

export const PayrollPage: React.FC = () => {
  const { employees } = useEMS();
  const [selectedEmpId, setSelectedEmpId] = useState<string>(employees[0]?.id || 'EMP-1001');
  const [bonusInput, setBonusInput] = useState<number>(25000); // in INR
  const [lossOfPayDays, setLossOfPayDays] = useState<number>(0);
  const [showSlipModal, setShowSlipModal] = useState<boolean>(false);

  const selectedEmp = employees.find(e => e.id === selectedEmpId) || employees[0];

  // Indian Payroll Breakdown (Monthly figures derived from Annual CTC)
  const monthlyCTC = (selectedEmp.salary.base + selectedEmp.salary.hra + selectedEmp.salary.allowances) / 12;

  // Basic is typically 50% of CTC
  const baseMonthly = Math.round(monthlyCTC * 0.50);
  // HRA is 40% of Basic
  const hraMonthly = Math.round(baseMonthly * 0.40);
  // Special Allowance is the remainder
  const specialAllowance = Math.max(0, Math.round(monthlyCTC - (baseMonthly + hraMonthly)));

  // Gross Monthly before LOP
  const grossMonthly = baseMonthly + hraMonthly + specialAllowance + bonusInput;

  // Loss of Pay computation on 30-day base
  const perDayPay = monthlyCTC / 30;
  const lopDeduction = Math.round(lossOfPayDays * perDayPay);

  // Indian Statutory Deductions:
  // 1. EPF (Employee Provident Fund) - 12% of basic or capped at ₹1,800
  const epfDeduction = Math.min(Math.round(baseMonthly * 0.12), 1800);
  // 2. Professional Tax (PT) - ₹200/month in Karnataka/Maharashtra
  const professionalTax = 200;
  // 3. TDS (Income Tax under Section 115BAC New Regime) ~10-15% of gross
  const tdsDeduction = Math.round((grossMonthly - epfDeduction) * 0.10);
  // 4. Health & Medical Benefit deduction
  const healthInsurance = 1250;

  const totalDeductions = epfDeduction + professionalTax + tdsDeduction + healthInsurance + lopDeduction;
  const netTakeHome = Math.max(0, grossMonthly - totalDeductions);

  return (
    <div className="space-y-6">
      {/* Enterprise Page Header */}
      <PageHeader
        moduleBadge="Enterprise HR Module 04"
        badgeColor="bg-blue-50 text-blue-700 border-blue-200"
        title="Compensation, Payroll & Statutory Tax (₹)"
        description="Gross-to-net Indian Rupee computations, Section 115BAC TDS withholding, EPFO provident fund reconciliations, and draft salary slips."
        countBadge="Currency: Indian Rupee (₹)"
        actions={
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-slate-500">Employee:</span>
              <select
                value={selectedEmpId}
                onChange={(e) => setSelectedEmpId(e.target.value)}
                className="bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600 shadow-2xs"
              >
                {employees.map(emp => (
                  <option key={emp.id} value={emp.id}>
                    {emp.name} ({emp.department})
                  </option>
                ))}
              </select>
            </div>

            <button
              onClick={() => setShowSlipModal(true)}
              className="inline-flex items-center gap-2 px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold shadow-sm shadow-blue-500/20 transition"
            >
              <Receipt className="w-4 h-4" />
              <span>Generate Payslip (₹)</span>
            </button>
          </div>
        }
      />

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Monthly Gross */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Monthly Gross Pay
            </span>
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <IndianRupee className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-2">
            {formatINR(grossMonthly)}
          </div>
          <div className="text-xs font-medium text-slate-500 mt-1">
            Basic + HRA + Allowances + Bonus
          </div>
        </div>

        {/* Deductions */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Total Deductions
            </span>
            <div className="w-9 h-9 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
              <Percent className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-rose-600 mt-2">
            {formatINR(totalDeductions)}
          </div>
          <div className="text-xs font-medium text-slate-500 mt-1">
            EPF + PT + TDS + LOP
          </div>
        </div>

        {/* Net Take-Home */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Net Take-Home Pay
            </span>
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <CreditCard className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-emerald-600 mt-2">
            {formatINR(netTakeHome)}
          </div>
          <div className="text-xs font-medium text-emerald-700 mt-1">
            Ready for Bank Direct Deposit (NEFT/RTGS)
          </div>
        </div>

        {/* Statutory Compliance */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Statutory Status
            </span>
            <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl font-extrabold text-slate-900 mt-2">
            EPFO & IT COMPLIANT
          </div>
          <div className="text-xs font-medium text-slate-500 mt-1">
            Challan Form 16 / 24Q Ready
          </div>
        </div>
      </div>

      {/* Main Grid: Parameters Simulator vs Guidelines */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Interactive Gross-to-Net Breakdown */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-2xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 mb-5 gap-3">
              <div>
                <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                  <Calculator className="w-4 h-4 text-blue-600" />
                  Salary Parameters & Gross-to-Net Simulator
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Real-time payroll simulation for {selectedEmp.name} (Annual CTC: {formatINR(selectedEmp.salary.base + selectedEmp.salary.hra + selectedEmp.salary.allowances)})
                </p>
              </div>

              <button
                onClick={() => setShowSlipModal(true)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg text-xs font-semibold border border-blue-200/60 transition"
              >
                <FileCheck className="w-3.5 h-3.5" />
                <span>View Slip</span>
              </button>
            </div>

            {/* Parameter Inputs in INR */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-xl bg-slate-50 border border-slate-200/80 mb-6">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Quarterly Bonus / Incentive in INR (₹)
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2 text-xs font-bold text-slate-400">₹</span>
                  <input
                    type="number"
                    value={bonusInput}
                    onChange={(e) => setBonusInput(Number(e.target.value) || 0)}
                    className="w-full pl-7 pr-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Loss of Pay (Unapproved Days Absent)
                </label>
                <input
                  type="number"
                  min="0"
                  max="30"
                  value={lossOfPayDays}
                  onChange={(e) => setLossOfPayDays(Number(e.target.value) || 0)}
                  className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>
            </div>

            {/* Earnings & Deductions Tables */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Earnings Table */}
              <div className="p-4 rounded-xl border border-emerald-200/80 bg-emerald-50/20 space-y-2.5">
                <div className="flex items-center justify-between text-xs font-bold uppercase pb-2 border-b border-emerald-200 text-emerald-900">
                  <span>Earnings Component</span>
                  <span>Amount (₹)</span>
                </div>
                <div className="flex justify-between text-xs text-slate-700">
                  <span>Basic Pay</span>
                  <span className="font-semibold text-slate-900">{formatINR(baseMonthly)}</span>
                </div>
                <div className="flex justify-between text-xs text-slate-700">
                  <span>House Rent Allowance (HRA)</span>
                  <span className="font-semibold text-slate-900">{formatINR(hraMonthly)}</span>
                </div>
                <div className="flex justify-between text-xs text-slate-700">
                  <span>Special Allowance</span>
                  <span className="font-semibold text-slate-900">{formatINR(specialAllowance)}</span>
                </div>
                <div className="flex justify-between text-xs text-blue-700 font-semibold">
                  <span>Performance Incentive</span>
                  <span>+{formatINR(bonusInput)}</span>
                </div>
                <div className="flex justify-between text-xs font-bold border-t border-emerald-200 pt-2 text-emerald-900">
                  <span>TOTAL GROSS</span>
                  <span>{formatINR(grossMonthly)}</span>
                </div>
              </div>

              {/* Deductions Table */}
              <div className="p-4 rounded-xl border border-rose-200/80 bg-rose-50/20 space-y-2.5">
                <div className="flex items-center justify-between text-xs font-bold uppercase pb-2 border-b border-rose-200 text-rose-900">
                  <span>Statutory Deductions</span>
                  <span>Amount (₹)</span>
                </div>
                <div className="flex justify-between text-xs text-slate-700">
                  <span>EPF (Employee Contribution)</span>
                  <span className="font-semibold text-slate-900">{formatINR(epfDeduction)}</span>
                </div>
                <div className="flex justify-between text-xs text-slate-700">
                  <span>Professional Tax (PT)</span>
                  <span className="font-semibold text-slate-900">{formatINR(professionalTax)}</span>
                </div>
                <div className="flex justify-between text-xs text-slate-700">
                  <span>TDS (Income Tax Sec 115BAC)</span>
                  <span className="font-semibold text-slate-900">{formatINR(tdsDeduction)}</span>
                </div>
                <div className="flex justify-between text-xs text-slate-700">
                  <span>Group Health Insurance</span>
                  <span className="font-semibold text-slate-900">{formatINR(healthInsurance)}</span>
                </div>
                {lossOfPayDays > 0 && (
                  <div className="flex justify-between text-xs text-rose-700 font-semibold">
                    <span>Loss of Pay ({lossOfPayDays}d)</span>
                    <span>-{formatINR(lopDeduction)}</span>
                  </div>
                )}
                <div className="flex justify-between text-xs font-bold border-t border-rose-200 pt-2 text-rose-900">
                  <span>TOTAL DEDUCTIONS</span>
                  <span>{formatINR(totalDeductions)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Statutory Notes & Tax Regime Details */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-2xs space-y-4">
            <div className="pb-3 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                Indian Statutory Guidelines
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Compliant with Indian Ministry of Finance standards
              </p>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                <strong className="block font-bold text-slate-900">
                  Section 115BAC Default Tax Regime
                </strong>
                <p className="text-slate-600 leading-relaxed">
                  Tax slabs calculated automatically under the New Tax Regime with ₹75,000 standard deduction factored in.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                <strong className="block font-bold text-slate-900">
                  EPFO Provident Fund Compliance
                </strong>
                <p className="text-slate-600 leading-relaxed">
                  12% contribution matched by employer and submitted to EPFO Unified Portal before the 15th of each month.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                <strong className="block font-bold text-slate-900">
                  Loss of Pay (LOP) Policy
                </strong>
                <p className="text-slate-600 leading-relaxed">
                  Unexcused absences beyond approved casual/sick allocations result in exact per-day salary deduction.
                </p>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-600">Disbursement Cycle:</span>
              <span className="font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                OCTOBER 31, 2026
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Indian Standard Salary Slip Modal */}
      {showSlipModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/70">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center">
                  <Building className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    Confidential Salary Slip
                  </h3>
                  <p className="text-xs text-slate-500">
                    Payroll Month: October 2026 • Currency: INR (₹)
                  </p>
                </div>
              </div>

              <button
                onClick={() => setShowSlipModal(false)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Slip Body */}
            <div className="p-6 space-y-5 max-h-[75vh] overflow-y-auto text-xs">
              {/* Company Header */}
              <div className="text-center pb-4 border-b border-slate-200">
                <h2 className="text-base font-extrabold text-slate-900">
                  OptiPeople Global Technologies India Pvt. Ltd.
                </h2>
                <p className="text-slate-500 text-[11px] mt-0.5">
                  CIN: U72200KA2022PTC158941 • Registered Office: Embassy TechVillage, Outer Ring Road, Bengaluru - 560103
                </p>
              </div>

              {/* Employee & Bank Info */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3.5 rounded-xl bg-slate-50 border border-slate-200 font-medium">
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Name</span>
                  <span className="font-bold text-slate-900">{selectedEmp.name}</span>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Employee ID</span>
                  <span className="font-mono font-bold text-slate-900">{selectedEmp.id}</span>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">PAN Number</span>
                  <span className="font-mono font-bold text-slate-900">{selectedEmp.panNumber || 'ABCPS1234F'}</span>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">EPFO UAN</span>
                  <span className="font-mono font-bold text-slate-900">{selectedEmp.pfUan || '100987654321'}</span>
                </div>
              </div>

              {/* Earnings & Deductions Tables */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="border border-slate-200 rounded-xl overflow-hidden">
                  <div className="bg-slate-100 px-3 py-2 font-bold text-slate-800 flex justify-between">
                    <span>Earnings</span>
                    <span>Amount (₹)</span>
                  </div>
                  <div className="p-3 space-y-2">
                    <div className="flex justify-between"><span>Basic Pay</span><span>{formatINR(baseMonthly)}</span></div>
                    <div className="flex justify-between"><span>HRA</span><span>{formatINR(hraMonthly)}</span></div>
                    <div className="flex justify-between"><span>Special Allowance</span><span>{formatINR(specialAllowance)}</span></div>
                    <div className="flex justify-between font-semibold text-blue-700"><span>Bonus</span><span>+{formatINR(bonusInput)}</span></div>
                    <div className="flex justify-between font-bold border-t border-slate-200 pt-2 text-slate-900">
                      <span>Gross Earnings</span>
                      <span>{formatINR(grossMonthly)}</span>
                    </div>
                  </div>
                </div>

                <div className="border border-slate-200 rounded-xl overflow-hidden">
                  <div className="bg-slate-100 px-3 py-2 font-bold text-slate-800 flex justify-between">
                    <span>Deductions</span>
                    <span>Amount (₹)</span>
                  </div>
                  <div className="p-3 space-y-2">
                    <div className="flex justify-between"><span>EPF Contribution</span><span>{formatINR(epfDeduction)}</span></div>
                    <div className="flex justify-between"><span>Professional Tax (PT)</span><span>{formatINR(professionalTax)}</span></div>
                    <div className="flex justify-between"><span>TDS (Sec 115BAC)</span><span>{formatINR(tdsDeduction)}</span></div>
                    <div className="flex justify-between"><span>Medical Insurance</span><span>{formatINR(healthInsurance)}</span></div>
                    {lossOfPayDays > 0 && (
                      <div className="flex justify-between text-rose-600 font-semibold">
                        <span>LOP ({lossOfPayDays}d)</span>
                        <span>-{formatINR(lopDeduction)}</span>
                      </div>
                    )}
                    <div className="flex justify-between font-bold border-t border-slate-200 pt-2 text-rose-600">
                      <span>Total Deductions</span>
                      <span>{formatINR(totalDeductions)}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Net Pay Callout */}
              <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-between">
                <div>
                  <span className="text-[11px] font-bold uppercase text-emerald-800 block">
                    Net Take-Home Pay (INR)
                  </span>
                  <span className="text-xs text-emerald-700">
                    Disbursed directly to Registered HDFC / ICICI Corporate Salary Account
                  </span>
                </div>
                <div className="text-2xl font-black text-emerald-700">
                  {formatINR(netTakeHome)}
                </div>
              </div>

              <div className="text-[11px] text-slate-400 text-center">
                This is a computer-generated document requiring no physical signature. Registered under the Payment of Wages Act, 1936.
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-end gap-3 px-6 py-3.5 border-t border-slate-100 bg-slate-50">
              <button
                type="button"
                onClick={() => setShowSlipModal(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-200/60 rounded-xl transition"
              >
                Close
              </button>
              <button
                type="button"
                onClick={() => window.print()}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-xl text-xs font-semibold shadow-2xs transition"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print Document</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
