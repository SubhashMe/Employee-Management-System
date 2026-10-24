import React, { useEffect, useRef } from 'react';
import { useEMS } from '../../context/EMSContext';
import {
  Search,
  X,
  User,
  Calendar,
  AlertTriangle,
  Target,
  ArrowRight
} from 'lucide-react';

export const SearchModal: React.FC = () => {
  const {
    searchQuery,
    setSearchQuery,
    searchResults,
    isSearchModalOpen,
    setIsSearchModalOpen,
    setActiveTab,
  } = useEMS();

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isSearchModalOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 50);
    }
  }, [isSearchModalOpen]);

  // Global keydown handler for Ctrl+K / Cmd+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchModalOpen(true);
      }
      if (e.key === 'Escape' && isSearchModalOpen) {
        setIsSearchModalOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isSearchModalOpen, setIsSearchModalOpen]);

  if (!isSearchModalOpen) return null;

  const handleSelectResult = (targetTab: string) => {
    setActiveTab(targetTab);
    setIsSearchModalOpen(false);
    setSearchQuery('');
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Employee':
        return <User className="w-4 h-4 text-blue-600" />;
      case 'Leave':
        return <Calendar className="w-4 h-4 text-emerald-600" />;
      case 'Grievance':
        return <AlertTriangle className="w-4 h-4 text-rose-600" />;
      case 'Goal':
        return <Target className="w-4 h-4 text-purple-600" />;
      default:
        return <Search className="w-4 h-4 text-slate-500" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-slate-900/60 backdrop-blur-sm transition-opacity">
      <div
        className="fixed inset-0"
        onClick={() => setIsSearchModalOpen(false)}
        aria-hidden="true"
      />

      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden z-10 animate-in fade-in zoom-in-95 duration-150">
        {/* Search Header Bar */}
        <div className="flex items-center px-4 py-3.5 border-b border-slate-200 bg-slate-50/50">
          <Search className="w-5 h-5 text-slate-400 mr-3 flex-shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search employees, skills, leaves, grievances, goals... (e.g. Aarav, DevOps, Casual)"
            className="w-full bg-transparent border-0 text-slate-900 placeholder:text-slate-400 text-sm font-medium focus:outline-none focus:ring-0"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="p-1 text-slate-400 hover:text-slate-600 rounded-md mr-1"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={() => setIsSearchModalOpen(false)}
            className="px-2 py-1 text-xs font-semibold text-slate-500 bg-white border border-slate-200 rounded-md shadow-2xs hover:bg-slate-100"
          >
            ESC
          </button>
        </div>

        {/* Results Area */}
        <div className="max-h-96 overflow-y-auto p-3">
          {searchQuery.trim() === '' ? (
            <div className="py-10 text-center">
              <Search className="w-8 h-8 text-slate-300 mx-auto mb-2" />
              <p className="text-sm font-semibold text-slate-700">Quick Global Search</p>
              <p className="text-xs text-slate-400 max-w-xs mx-auto mt-1">
                Type employee names, departments, designations, leave entries, or grievance IDs.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-2 mt-4">
                {['Aarav', 'Engineering', 'Diwali', 'GRV-IN', 'Director'].map((keyword) => (
                  <button
                    key={keyword}
                    onClick={() => setSearchQuery(keyword)}
                    className="text-xs px-2.5 py-1 rounded-full bg-slate-100 hover:bg-blue-50 hover:text-blue-600 text-slate-600 border border-slate-200 transition"
                  >
                    {keyword}
                  </button>
                ))}
              </div>
            </div>
          ) : searchResults.length === 0 ? (
            <div className="py-12 text-center">
              <p className="text-sm font-semibold text-slate-700">No matching records found</p>
              <p className="text-xs text-slate-400 mt-1">
                No matching results found for "{searchQuery}". Try a different keyword or designation.
              </p>
            </div>
          ) : (
            <div className="space-y-1">
              <div className="px-2 py-1 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                Matching Records ({searchResults.length})
              </div>
              {searchResults.map((item) => (
                <button
                  key={`${item.category}-${item.id}`}
                  onClick={() => handleSelectResult(item.targetTab)}
                  className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 transition text-left group border border-transparent hover:border-slate-200"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-8 h-8 rounded-lg bg-slate-100 group-hover:bg-blue-50 flex items-center justify-center flex-shrink-0 transition">
                      {getCategoryIcon(item.category)}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-slate-900 truncate">
                          {item.title}
                        </span>
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
                          {item.category}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 truncate mt-0.5">
                        {item.subtitle}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 flex-shrink-0 ml-3">
                    {item.badge && (
                      <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-blue-50 text-blue-700">
                        {item.badge}
                      </span>
                    )}
                    <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-blue-600 group-hover:translate-x-0.5 transition" />
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Footer shortcuts */}
        <div className="px-4 py-2.5 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <div className="flex items-center gap-4">
            <span>Press <kbd className="font-mono bg-white border border-slate-200 px-1 rounded shadow-2xs">ESC</kbd> to exit</span>
            <span className="hidden sm:inline">Click result to open module</span>
          </div>
          <span className="font-medium text-blue-600">OptiPeople Global Search</span>
        </div>
      </div>
    </div>
  );
};
