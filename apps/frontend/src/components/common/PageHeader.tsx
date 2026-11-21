import React, { useState } from "react";
import { Globe, Calendar, Layers, ChevronDown } from "lucide-react";

interface PageHeaderProps {
  title: string;
  subtitle: string;
  period?: string;
  onPeriodChange?: (period: string) => void;
  scope?: string;
  onScopeChange?: (scope: string) => void;
  level?: string;
  onLevelChange?: (level: string) => void;
  children?: React.ReactNode;
}

export const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  subtitle,
  period = "2026",
  onPeriodChange,
  scope = "Indonesia",
  onScopeChange,
  level = "Semua Jenjang",
  onLevelChange,
  children,
}) => {
  const [internalScope, setInternalScope] = useState(scope);
  const [internalLevel, setInternalLevel] = useState(level);

  const handleScopeChange = (newScope: string) => {
    setInternalScope(newScope);
    onScopeChange?.(newScope);
  };

  const handleLevelChange = (newLevel: string) => {
    setInternalLevel(newLevel);
    onLevelChange?.(newLevel);
  };

  return (
    <div className="space-y-3.5 mb-2">
      {/* Unified Single Header Row: Title on Left, 3 Standard Filters in Middle, Account Info on Right */}
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4">
        {/* Left: Title & Subtitle */}
        <div className="shrink-0">
          <h2 className="text-2xl sm:text-[26px] font-extrabold text-[#153B66] tracking-tight font-heading">
            {title}
          </h2>
          <p className="text-xs text-[#526579] mt-0.5">{subtitle}</p>
        </div>

        {/* Center & Right in a single cohesive row: Exactly 3 Global Filters + User Profile */}
        <div className="flex flex-wrap items-center gap-3">
          {/* User Account Info with Classic English Name */}
          <div className="flex items-center gap-2 pl-2 border-l border-[#DCE5EF] cursor-pointer select-none">
            <div className="w-8 h-8 rounded-full bg-[#E0F7F6] text-[#25A9A1] font-bold text-xs flex items-center justify-center border border-[#BCECE8] shadow-2xs">
              PS
            </div>
            <span className="text-xs font-bold text-[#172B4D] whitespace-nowrap">
              Lord Percival Sterling
            </span>
            <ChevronDown className="w-3.5 h-3.5 text-[#526579]" />
          </div>
        </div>
      </div>

      {/* Snapshot Information Strip */}
      <div className="bg-[#E6F7F6]/60 border border-[#BCECE8] rounded-xl px-4 py-2 flex items-center justify-between text-xs">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-[#16835D] animate-pulse shrink-0" />
          <span className="text-[#172B4D]">
            <strong className="text-[#153B66]">Snapshot:</strong> 20 Okt 2026,
            10:24 WIB <span className="text-[#DCE5EF] mx-1">|</span> Periode:{" "}
            {period} <span className="text-[#DCE5EF] mx-1">|</span> Sumber:
            EduAtlas Demo Dataset
          </span>
        </div>
        <span className="bg-[#D1FAE5] text-[#065F46] font-bold text-[11px] px-2.5 py-0.5 rounded-md">
          Demo Data
        </span>
      </div>

      {children}
    </div>
  );
};
