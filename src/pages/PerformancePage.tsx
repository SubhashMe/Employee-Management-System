import React, { useState } from 'react';
import { useEMS } from '../context/EMSContext';
import { PageHeader } from '../components/common/PageHeader';
import {
  Target,
  Award,
  AlertCircle,
  BarChart3,
  CheckCircle2,
  FileText,
  Plus,
  X,
  TrendingUp,
  Sliders
} from 'lucide-react';

export const PerformancePage: React.FC = () => {
  const { goals, addGoal, updateGoalProgress, employees } = useEMS();
  const [selectedEmpId, setSelectedEmpId] = useState<string>(employees[0]?.id || 'EMP-1001');
  const [showAddModal, setShowAddModal] = useState<boolean>(false);

  // New Goal State
  const [newTitle, setNewTitle] = useState('');
  const [newTarget, setNewTarget] = useState('');
  const [newQuarter, setNewQuarter] = useState('Q4 2026');
  const [newWeight, setNewWeight] = useState(30);

  const selectedEmp = employees.find(e => e.id === selectedEmpId) || employees[0];
  const empGoals = goals.filter(g => g.employeeId === selectedEmp.id);

  const handleAddGoalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newTarget.trim()) return;

    addGoal({
      employeeId: selectedEmp.id,
      title: newTitle.trim(),
      targetMetric: newTarget.trim(),
      quarter: newQuarter,
      weight: Number(newWeight),
      currentProgress: 10,
      status: 'On Track',
    });

    setNewTitle('');
    setNewTarget('');
    setShowAddModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Enterprise Page Header */}
      <PageHeader
        moduleBadge="Enterprise HR Module 03"
        badgeColor="bg-purple-50 text-purple-700 border-purple-200"
        title="OKRs & Performance Reviews"
        description="Quarterly business deliverable mapping, 1–5 performance rating scale, weighted milestone tracking, and structured PIP protocols."
        countBadge={`${goals.length} Strategic Objectives`}
        actions={
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-slate-500">Employee:</span>
              <select
                value={selectedEmpId}
                onChange={(e) => setSelectedEmpId(e.target.value)}
                className="bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-600 shadow-2xs"
              >
                {employees.map(emp => (
                  <option key={emp.id} value={emp.id}>
                    {emp.name} ({emp.role})
                  </option>
                ))}
              </select>
            </div>

            <button
              onClick={() => setShowAddModal(true)}
              className="inline-flex items-center gap-2 px-3.5 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-semibold shadow-sm shadow-purple-500/20 transition"
            >
              <Plus className="w-4 h-4" />
              <span>Add Goal</span>
            </button>
          </div>
        }
      />

      {/* KPI Overview Tiles */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Performance Rating
            </span>
            <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <Award className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-slate-900 mt-2">
            ★ {selectedEmp.kpiRating} / 5.0
          </div>
          <div className="text-xs font-medium text-emerald-600 mt-1">
            Weighted Q4 Appraisal Score
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Active Objectives
            </span>
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Target className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-slate-900 mt-2">
            {empGoals.length} Items
          </div>
          <div className="text-xs font-medium text-slate-500 mt-1">
            Aligned with Department KPIs
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Peer Benchmark
            </span>
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <BarChart3 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-slate-900 mt-2">
            TOP 15%
          </div>
          <div className="text-xs font-medium text-slate-500 mt-1">
            {selectedEmp.department} Pod Average: 4.2
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              PIP Threshold Check
            </span>
            <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <AlertCircle className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-emerald-600 mt-2">
            {selectedEmp.kpiRating < 3.0 ? 'TRIGGERED' : 'CLEAR'}
          </div>
          <div className="text-xs font-medium text-slate-500 mt-1">
            Threshold minimum: 3.0
          </div>
        </div>
      </div>

      {/* Main Grid: OKRs vs Structured Review */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Deliverables */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-2xs">
            <div className="pb-4 border-b border-slate-100 mb-4 flex items-center justify-between">
              <div>
                <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                  <Target className="w-4 h-4 text-purple-600" />
                  Quarterly Deliverables & Milestones
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Translating executive strategy into individual deliverables.
                </p>
              </div>
              <span className="text-xs font-bold text-slate-600">
                {selectedEmp.name}
              </span>
            </div>

            <div className="space-y-4">
              {empGoals.length === 0 ? (
                <div className="p-8 text-center text-slate-400 text-xs">
                  No active goals registered for this employee yet. Click "Add Goal" above to create one.
                </div>
              ) : (
                empGoals.map((goal) => (
                  <div
                    key={goal.id}
                    className="p-4 rounded-xl border border-slate-200/90 bg-white hover:border-slate-300 transition space-y-3 shadow-2xs"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-purple-50 text-purple-700 border border-purple-200">
                            {goal.quarter}
                          </span>
                          <span className="text-xs font-semibold text-slate-500">
                            Weight: {goal.weight}%
                          </span>
                        </div>
                        <h3 className="text-sm font-bold text-slate-900 mt-1.5">
                          {goal.title}
                        </h3>
                        <p className="text-xs text-slate-600 mt-0.5">
                          Target Metric: <span className="font-medium text-slate-800">{goal.targetMetric}</span>
                        </p>
                      </div>

                      <span
                        className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${
                          goal.status === 'On Track' || goal.status === 'Exceeded'
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            : 'bg-amber-50 text-amber-700 border-amber-200'
                        }`}
                      >
                        {goal.status}
                      </span>
                    </div>

                    {/* Progress Slider */}
                    <div className="space-y-1.5 bg-slate-50/70 p-3 rounded-xl border border-slate-200/60">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-semibold text-slate-600 flex items-center gap-1">
                          <Sliders className="w-3.5 h-3.5 text-slate-400" />
                          Update Progress
                        </span>
                        <span className="font-bold text-purple-700">{goal.currentProgress}%</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={goal.currentProgress}
                        onChange={(e) => updateGoalProgress(goal.id, Number(e.target.value))}
                        className="w-full accent-purple-600 cursor-pointer"
                      />
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Structured Review Assessment */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-2xs">
            <div className="pb-4 border-b border-slate-100 mb-4">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <FileText className="w-4 h-4 text-purple-600" />
                Structured Performance Review
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Evaluation protocol for {selectedEmp.name}
              </p>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3.5 rounded-xl border border-emerald-200 bg-emerald-50/40">
                <div className="font-bold text-emerald-900 mb-1 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  1. Key Deliverables & Impact
                </div>
                <p className="text-slate-700 leading-relaxed">
                  Demonstrated consistent architecture rigor, zero unhandled regression escapes, and maintained high team morale on mission-critical sprints.
                </p>
              </div>

              <div className="p-3.5 rounded-xl border border-amber-200 bg-amber-50/40">
                <div className="font-bold text-amber-900 mb-1 flex items-center gap-1.5">
                  <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
                  2. Competency Growth & Training
                </div>
                <p className="text-slate-700 leading-relaxed">
                  Recommended for advanced cloud optimization masterclass and cross-departmental executive mentorship program.
                </p>
              </div>

              <div className="p-3.5 rounded-xl border border-purple-200 bg-purple-50/40">
                <div className="font-bold text-purple-900 mb-1 flex items-center gap-1.5">
                  <Award className="w-3.5 h-3.5 text-purple-600" />
                  3. Executive Rating Assessment
                </div>
                <div className="flex items-center justify-between py-1">
                  <span className="font-semibold text-slate-700">Appraisal Band:</span>
                  <span className="font-bold px-2 py-0.5 rounded-md bg-white border border-purple-200 text-purple-700">
                    ★ {selectedEmp.kpiRating} / 5.0 (Exceeds Expectations)
                  </span>
                </div>
                <p className="text-slate-600 text-[11px] mt-1 leading-relaxed">
                  Strong candidate for annual increment & variable performance incentive in upcoming compensation cycle.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add Goal Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/70">
              <h3 className="text-base font-bold text-slate-900">
                Add Performance Objective (OKR)
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddGoalSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Objective Title *
                </label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Reduce CI/CD build latency by 40%"
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-600 focus:bg-white"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Target Metric & Success Criteria *
                </label>
                <input
                  type="text"
                  value={newTarget}
                  onChange={(e) => setNewTarget(e.target.value)}
                  placeholder="e.g. Average pipeline run from 18m to 6m"
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-600 focus:bg-white"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Quarter
                  </label>
                  <select
                    value={newQuarter}
                    onChange={(e) => setNewQuarter(e.target.value)}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-600 focus:bg-white"
                  >
                    <option value="Q4 2026">Q4 2026</option>
                    <option value="Q1 2027">Q1 2027</option>
                    <option value="Q2 2027">Q2 2027</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Weight (%)
                  </label>
                  <input
                    type="number"
                    min={10}
                    max={100}
                    value={newWeight}
                    onChange={(e) => setNewWeight(Number(e.target.value))}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-600 focus:bg-white"
                  />
                </div>
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
                  className="px-5 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-semibold shadow-sm shadow-purple-500/20 transition"
                >
                  Save Objective
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
