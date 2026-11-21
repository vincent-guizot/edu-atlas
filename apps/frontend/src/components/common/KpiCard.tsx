import React from 'react';
import { LucideIcon, TrendingUp, TrendingDown } from 'lucide-react';
import { formatNumber } from '../../lib/formatters';

interface KpiCardProps {
  title: string;
  value: number | string;
  icon: LucideIcon;
  subtitle?: string;
  trend?: {
    value: string;
    isPositive: boolean;
  };
  accentColor?: string; // hex
}

export const KpiCard: React.FC<KpiCardProps> = ({
  title,
  value,
  icon: Icon,
  subtitle,
  trend,
  accentColor = '#25A9A1',
}) => {
  return (
    <div className="bg-white border border-[#DCE5EF] rounded-xl p-5 shadow-xs hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold text-[#526579] uppercase tracking-wider">{title}</p>
          <h3 className="text-2xl font-bold text-[#172B4D] mt-1 font-heading">
            {typeof value === 'number' ? formatNumber(value) : value}
          </h3>
        </div>
        <div
          className="p-3 rounded-lg flex items-center justify-center"
          style={{ backgroundColor: `${accentColor}15`, color: accentColor }}
        >
          <Icon className="w-6 h-6" />
        </div>
      </div>

      {(subtitle || trend) && (
        <div className="mt-3 flex items-center gap-2 text-xs">
          {trend && (
            <span
              className={`inline-flex items-center gap-1 font-semibold px-1.5 py-0.5 rounded ${
                trend.isPositive ? 'bg-emerald-50 text-[#16835D]' : 'bg-rose-50 text-[#C2414B]'
              }`}
            >
              {trend.isPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
              {trend.value}
            </span>
          )}
          {subtitle && <span className="text-[#526579]">{subtitle}</span>}
        </div>
      )}
    </div>
  );
};
