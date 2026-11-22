import React from "react";
import { NavLink } from "react-router-dom";
import {
  Home,
  BarChart2,
  LayoutGrid,
  MapPin,
  Layers,
  Search,
  Table,
  Calendar,
  Sliders,
  GitFork,
  Database,
  FileText,
  TrendingUp,
  FileSpreadsheet,
  Scale,
  DollarSign,
  ArrowLeftRight,
} from "lucide-react";

interface SidebarProps {
  collapsed?: boolean;
  onToggle?: () => void;
}

type NavItem = {
  to: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  end?: boolean;
};

type NavSection = {
  title: string;
  items: NavItem[];
};

const navSections: NavSection[] = [
  {
    title: "RINGKASAN & GRAFIK",
    items: [
      { to: "/overview", label: "Overview", icon: Home },
      {
        to: "/visualizations",
        label: "Visualizations",
        icon: BarChart2,
        end: true,
      },
      {
        to: "/visualizations/advanced",
        label: "Advanced Visualization",
        icon: LayoutGrid,
      },
    ],
  },
  {
    title: "PETA & DIREKTORI",
    items: [
      { to: "/maps", label: "Interactive Maps", icon: MapPin, end: true },
      { to: "/maps/advanced", label: "Advanced Maps", icon: Layers },
      { to: "/data-explorer", label: "Data Explorer", icon: Search },
      { to: "/data-grid", label: "Advanced Data Grid", icon: Table },
      { to: "/flow", label: "Flow & Network", icon: GitFork },
    ],
  },
  {
    title: "ANALITIK & KEBIJAKAN",
    items: [
      { to: "/simulator", label: "Simulator Proyeksi", icon: TrendingUp },
      { to: "/policy-brief", label: "Policy Brief Studio", icon: FileSpreadsheet },
      { to: "/equity-studio", label: "Disparitas 3T", icon: Scale },
      { to: "/budget-analytics", label: "Transparansi Anggaran", icon: DollarSign },
      { to: "/comparator", label: "Komparator Institusi", icon: ArrowLeftRight },
    ],
  },
  {
    title: "OPERASIONAL & SISTEM",
    items: [
      { to: "/calendar", label: "Calendar & Scheduling", icon: Calendar },
      { to: "/timeline", label: "Timeline & Gantt", icon: Sliders },
      { to: "/data-status", label: "API & Data Status", icon: Database },
      { to: "/reports", label: "Reports & Export", icon: FileText },
    ],
  },
];

export const Sidebar: React.FC<SidebarProps> = () => {
  return (
    <aside className="fixed top-4 left-4 bottom-4 w-[212px] bg-white rounded-xl border border-[#EAF0F6] shadow-[0_12px_40px_-12px_rgba(21,59,102,0.18)] flex flex-col z-40 select-none">
      {/* Brand Header */}
      <div className="py-4 px-3.5 flex items-center gap-2.5 border-b border-[#F1F5F9]">
        <img
          src="/brand/icon-mark.png"
          alt="EduAtlas"
          className="w-9 h-9 object-contain shrink-0"
        />
        <div className="flex flex-col min-w-0 text-left">
          <h1 className="text-[15px] font-extrabold tracking-tight font-heading text-atlas-navy leading-snug">
            EduAtlas
          </h1>
          <p className="text-[10px] text-[#526579] tracking-tight leading-tight font-medium mt-0.5">
            Explore Education Through Data.
          </p>
        </div>
      </div>

      {/* Navigation Links with Categorized Section Headers */}
      <nav className="flex-1 overflow-y-auto py-2.5 px-2.5 space-y-3 custom-scrollbar">
        {navSections.map((section, secIdx) => (
          <div key={secIdx} className="space-y-0.5">
            <div className="px-2.5 py-1 text-[10px] font-extrabold text-[#94A3B8] tracking-wider uppercase">
              {section.title}
            </div>
            {section.items.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.end}
                  className={({ isActive }) =>
                    `flex items-center justify-between px-2.5 py-2 rounded-xl text-[12px] font-medium transition-all ${
                      isActive
                        ? "bg-[#E6F8F6] text-[#25A9A1] font-bold shadow-2xs"
                        : "text-[#526579] hover:bg-[#F8FAFC] hover:text-[#172B4D]"
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      <div className="flex items-center gap-2.5 min-w-0">
                        <Icon
                          className={`w-3.5 h-3.5 shrink-0 ${
                            isActive ? "text-[#25A9A1]" : "text-[#526579]"
                          }`}
                        />
                        <span className="truncate">{item.label}</span>
                      </div>
                      {isActive && (
                        <span className="w-1.5 h-1.5 rounded-full bg-[#25A9A1] shrink-0" />
                      )}
                    </>
                  )}
                </NavLink>
              );
            })}
          </div>
        ))}
      </nav>
    </aside>
  );
};
