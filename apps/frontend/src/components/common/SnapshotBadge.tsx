import React from 'react';
import { Database, Calendar, AlertCircle } from 'lucide-react';

interface SnapshotBadgeProps {
  snapshotDate?: string;
  period?: string;
  source?: string;
  isDemoData?: boolean;
}

export const SnapshotBadge: React.FC<SnapshotBadgeProps> = ({
  snapshotDate = '2026-10-20',
  period = '2026',
  source = 'EduAtlas Demo Dataset',
  isDemoData = true,
}) => {
  return (
    <div className="flex flex-wrap items-center gap-2 text-xs bg-white border border-[#DCE5EF] px-3 py-1.5 rounded-lg shadow-xs">
      <div className="flex items-center gap-1.5 text-[#153B66] font-medium">
        <Calendar className="w-3.5 h-3.5 text-[#25A9A1]" />
        <span>Snapshot: {snapshotDate.split('T')[0]} (T.A. {period})</span>
      </div>
      <span className="text-[#DCE5EF]">|</span>
      <div className="flex items-center gap-1.5 text-[#526579]">
        <Database className="w-3.5 h-3.5 text-[#526579]" />
        <span>{source}</span>
      </div>
      {isDemoData && (
        <span className="inline-flex items-center gap-1 bg-[#FFC857]/20 text-[#B7791F] font-semibold px-2 py-0.5 rounded text-[11px] border border-[#FFC857]/40">
          <AlertCircle className="w-3 h-3" />
          Simulated Data
        </span>
      )}
    </div>
  );
};
