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

const navItems: NavItem[] = [
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
  { to: "/maps", label: "Interactive Maps", icon: MapPin, end: true },
  { to: "/maps/advanced", label: "Advanced Maps", icon: Layers },
  { to: "/data-explorer", label: "Data Explorer", icon: Search },
  { to: "/data-grid", label: "Advanced Data Grid", icon: Table },
  { to: "/calendar", label: "Calendar & Scheduling", icon: Calendar },
  { to: "/timeline", label: "Timeline & Gantt", icon: Sliders },
  { to: "/flow", label: "Flow & Network", icon: GitFork },
  { to: "/data-status", label: "API & Data Status", icon: Database },
  { to: "/reports", label: "Reports & Export", icon: FileText },
];

export const Sidebar: React.FC<SidebarProps> = () => {
  return (
    <aside className="fixed top-4 left-4 bottom-4 w-[208px] bg-white rounded-xl border border-[#EAF0F6] shadow-[0_12px_40px_-12px_rgba(21,59,102,0.18)] flex flex-col z-40 select-none">
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

      {/* Navigation Links */}
      <nav className="flex-1 overflow-y-auto py-3 px-3 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `flex items-center justify-between px-3.5 py-2.5 rounded-xl text-[13px] font-medium transition-all ${
                  isActive
                    ? "bg-[#E6F8F6] text-[#25A9A1] font-bold shadow-2xs"
                    : "text-[#526579] hover:bg-[#F8FAFC] hover:text-[#172B4D]"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <div className="flex items-center gap-3">
                    <Icon
                      className={`w-4 h-4 shrink-0 ${isActive ? "text-[#25A9A1]" : "text-[#526579]"}`}
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
      </nav>
    </aside>
  );
};
