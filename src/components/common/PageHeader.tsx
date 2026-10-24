import React from 'react';

interface PageHeaderProps {
  moduleBadge: string;
  badgeColor?: string;
  title: string;
  description: string;
  countBadge?: string;
  actions?: React.ReactNode;
}

export const PageHeader: React.FC<PageHeaderProps> = ({
  moduleBadge,
  badgeColor = 'bg-blue-50 text-blue-700 border-blue-200',
  title,
  description,
  countBadge,
  actions,
}) => {
  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-5 sm:p-6 mb-6">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        {/* Title and Info Block */}
        <div className="space-y-1.5 max-w-2xl">
          <div className="flex items-center gap-2.5 flex-wrap">
            <span
              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold border tracking-wide uppercase ${badgeColor}`}
            >
              {moduleBadge}
            </span>
            {countBadge && (
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium bg-slate-100 text-slate-700 border border-slate-200">
                {countBadge}
              </span>
            )}
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            {title}
          </h1>
          <p className="text-sm text-slate-500 leading-relaxed">
            {description}
          </p>
        </div>

        {/* Action Buttons Block with ample gap and spacing */}
        {actions && (
          <div className="flex flex-wrap items-center gap-3 pt-2 lg:pt-0 border-t lg:border-t-0 border-slate-100">
            {actions}
          </div>
        )}
      </div>
    </div>
  );
};
