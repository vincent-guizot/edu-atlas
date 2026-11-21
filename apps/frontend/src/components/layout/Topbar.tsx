import React from 'react';
import { Bell, ChevronDown } from 'lucide-react';

// Global account bar: notifications + user profile, aligned to the far right.
export const Topbar: React.FC = () => {
  return (
    <div className="flex items-center justify-end gap-4 mb-1">
      {/* Notifications */}
      <button
        type="button"
        aria-label="Notifikasi"
        className="relative w-9 h-9 flex items-center justify-center rounded-full text-[#526579] hover:bg-white hover:text-[#172B4D] hover:shadow-2xs transition-all"
      >
        <Bell className="w-[18px] h-[18px]" />
        <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-[#C2414B] ring-2 ring-[#F5F8FC]" />
      </button>

      {/* User profile with classic English name */}
      <button
        type="button"
        className="flex items-center gap-2 cursor-pointer select-none rounded-full pl-1 pr-2 py-1 hover:bg-white hover:shadow-2xs transition-all"
      >
        <span className="w-9 h-9 rounded-full bg-[#E0F7F6] text-[#25A9A1] font-bold text-xs flex items-center justify-center border border-[#BCECE8]">
          PS
        </span>
        <span className="text-[13px] font-bold text-[#172B4D] whitespace-nowrap">Lord Percival Sterling</span>
        <ChevronDown className="w-4 h-4 text-[#526579]" />
      </button>
    </div>
  );
};
