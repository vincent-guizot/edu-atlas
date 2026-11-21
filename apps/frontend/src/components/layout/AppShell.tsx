import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import { Sidebar } from "./Sidebar";
import { FloatingExportButton } from "../common/FloatingExportButton";

export const AppShell: React.FC = () => {
  const [period, setPeriod] = useState("2026");

  const handleGlobalExport = () => {
    window.location.href = "/reports";
  };

  return (
    <div className="h-screen bg-[#F5F8FC] flex font-sans text-[#172B4D] overflow-hidden">
      {/* Fixed Sidebar */}
      <Sidebar collapsed={false} />

      {/* Fixed Main App Card (Framed identically to floating Sidebar) */}
      <div className="flex-1 ml-[244px] my-4 mr-4 h-[calc(100vh-2rem)] flex flex-col min-w-0 bg-white rounded-xl border border-[#EAF0F6] shadow-[0_12px_40px_-12px_rgba(21,59,102,0.18)] overflow-hidden">
        {/* Scrollable Content Area: Only internal page content scrolls */}
        <main className="flex-1 overflow-y-auto px-7 pb-10 pt-6 max-w-[1600px] w-full mx-auto">
          <Outlet context={{ period, setPeriod }} />
        </main>
      </div>

      {/* Floating Export Data Button */}
      <FloatingExportButton onExport={handleGlobalExport} />
    </div>
  );
};
