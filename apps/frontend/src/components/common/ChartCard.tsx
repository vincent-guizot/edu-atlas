import React from 'react';

interface ChartCardProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  action?: React.ReactNode;
  className?: string;
}

export const ChartCard: React.FC<ChartCardProps> = ({
  title,
  subtitle,
  children,
  action,
  className = '',
}) => {
  return (
    <div className={`bg-white border border-[#DCE5EF] rounded-xl p-5 shadow-xs flex flex-col ${className}`}>
      <div className="flex items-start justify-between mb-4">
        <div>
          <h4 className="text-base font-bold text-[#172B4D] font-heading">{title}</h4>
          {subtitle && <p className="text-xs text-[#526579] mt-0.5">{subtitle}</p>}
        </div>
        {action && <div>{action}</div>}
      </div>
      <div className="flex-1 w-full min-h-[260px]">{children}</div>
    </div>
  );
};
