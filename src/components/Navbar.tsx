import React from "react";
import { 
  Sprout, 
  MapPin, 
  ChevronDown, 
  Plus, 
  CloudSun, 
  Thermometer, 
  Droplets, 
  Sparkles,
  Layers,
  CalendarDays,
  BookOpenCheck,
  BotMessageSquare,
  Activity,
  SlidersHorizontal
} from "lucide-react";
import { GardenProfile } from "../types";

interface NavbarProps {
  gardens: GardenProfile[];
  currentGarden: GardenProfile;
  onSelectGarden: (garden: GardenProfile) => void;
  onOpenNewGardenModal: () => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  gardens,
  currentGarden,
  onSelectGarden,
  onOpenNewGardenModal,
  activeTab,
  setActiveTab,
}) => {
  const [dropdownOpen, setDropdownOpen] = React.useState(false);

  const avgHealth = Math.round(
    currentGarden.plots.reduce((acc, p) => acc + p.healthScore, 0) /
      (currentGarden.plots.length || 1)
  );

  return (
    <header className="bg-[#1E3F1A] text-white shadow-md sticky top-0 z-40 border-b border-[#2D5A27]">
      {/* Top Bar: Garden Switcher & Real-time Weather Context */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-wrap items-center justify-between gap-4">
        
        {/* Brand & Garden Switcher */}
        <div className="flex items-center gap-3">
          <div className="bg-[#2D5A27] p-2.5 rounded-2xl border border-emerald-400/20 flex items-center justify-center shadow-sm">
            <Sprout className="w-5 h-5 text-[#A3D99E]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-xs uppercase tracking-wider text-[#A3D99E]">
                Nông Y Thông Minh
              </span>
              <span className="bg-[#2D5A27]/90 text-[11px] text-[#E8F3E8] px-2.5 py-0.5 rounded-full border border-emerald-400/20 font-medium">
                Cá nhân hoá nhà vườn
              </span>
            </div>

            {/* Dropdown Selector */}
            <div className="relative mt-0.5">
              <button
                id="garden-select-dropdown-btn"
                type="button"
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-2 text-base sm:text-lg font-bold text-white hover:text-[#A3D99E] transition-colors text-left"
              >
                <span>{currentGarden.name}</span>
                <ChevronDown className="w-4 h-4 text-[#A3D99E] transition-transform duration-200" />
              </button>

              {dropdownOpen && (
                <div 
                  className="absolute left-0 mt-2 w-80 sm:w-96 bg-white text-slate-800 rounded-2xl shadow-2xl border border-[#E2ECE2] py-2 z-50 animate-in fade-in zoom-in-95 duration-150"
                  onMouseLeave={() => setDropdownOpen(false)}
                >
                  <div className="px-4 py-2.5 border-b border-slate-100 flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                      Chọn nhà vườn của bạn ({gardens.length})
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        setDropdownOpen(false);
                        onOpenNewGardenModal();
                      }}
                      className="text-xs font-semibold text-[#2D5A27] hover:text-[#1E3F1A] flex items-center gap-1"
                    >
                      <Plus className="w-3.5 h-3.5" /> Thêm vườn mới
                    </button>
                  </div>

                  <div className="max-h-72 overflow-y-auto divide-y divide-slate-100">
                    {gardens.map((g) => {
                      const isSelected = g.id === currentGarden.id;
                      const gAvgHealth = Math.round(
                        g.plots.reduce((acc, p) => acc + p.healthScore, 0) / (g.plots.length || 1)
                      );
                      return (
                        <button
                          key={g.id}
                          type="button"
                          onClick={() => {
                            onSelectGarden(g);
                            setDropdownOpen(false);
                          }}
                          className={`w-full text-left px-4 py-3 transition-colors flex items-start justify-between gap-2 hover:bg-[#F9FBF9] ${
                            isSelected ? "bg-[#E8F3E8]/80 font-medium" : ""
                          }`}
                        >
                          <div>
                            <div className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
                              {g.name}
                              {isSelected && (
                                <span className="w-2 h-2 rounded-full bg-[#2D5A27] inline-block" />
                              )}
                            </div>
                            <div className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                              <MapPin className="w-3 h-3 text-slate-400" />
                              {g.location} • {g.totalAreaHa} ha
                            </div>
                            <div className="text-[11px] text-[#2D5A27] font-medium mt-1">
                              {g.soilType.split(" ")[0]} {g.soilType.split(" ")[1]} • {g.cultivationStandard.split(" ")[0]}
                            </div>
                          </div>
                          <div className="text-right">
                            <span
                              className={`text-xs px-2.5 py-0.5 rounded-full font-bold inline-block ${
                                gAvgHealth >= 85
                                  ? "bg-[#E8F3E8] text-[#2D5A27]"
                                  : gAvgHealth >= 70
                                  ? "bg-amber-100 text-amber-800"
                                  : "bg-rose-100 text-rose-800"
                              }`}
                            >
                              {gAvgHealth}% Khỏe
                            </span>
                            <div className="text-[10px] text-slate-400 mt-1">
                              {g.plots.length} lô canh tác
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>

                  <div className="p-2.5 border-t border-slate-100 bg-[#F9FBF9] rounded-b-2xl">
                    <button
                      type="button"
                      onClick={() => {
                        setDropdownOpen(false);
                        onOpenNewGardenModal();
                      }}
                      className="w-full py-2.5 px-3 bg-[#2D5A27] hover:bg-[#1E3F1A] text-white text-xs font-semibold rounded-xl flex items-center justify-center gap-1.5 shadow-sm transition"
                    >
                      <Plus className="w-4 h-4" /> Thiết lập nhà vườn mới cá nhân hoá
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Garden Quick Characteristics & Local Weather Header */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs">
          {/* Location & Soil Pill */}
          <div className="bg-[#2D5A27]/80 border border-emerald-400/20 px-3.5 py-1.5 rounded-xl flex items-center gap-2">
            <MapPin className="w-3.5 h-3.5 text-[#A3D99E]" />
            <span className="text-[#E8F3E8] font-medium">{currentGarden.location}</span>
            <span className="text-emerald-400/50">|</span>
            <span className="text-[#A3D99E] font-medium">{currentGarden.soilType}</span>
          </div>

          {/* Microclimate Weather Widget - clickable to jump to Weather Forecast */}
          <button
            id="nav-weather-quick-btn"
            type="button"
            onClick={() => setActiveTab("weather")}
            className={`border border-emerald-400/20 px-3.5 py-1.5 rounded-xl flex items-center gap-2.5 transition cursor-pointer ${
              activeTab === "weather"
                ? "bg-[#2D5A27] text-white ring-2 ring-amber-400/40"
                : "bg-[#162e13] hover:bg-[#1f3f1b]"
            }`}
            title="Xem dự báo thời tiết & rủi ro chi tiết"
          >
            <CloudSun className="w-4 h-4 text-amber-300 shrink-0" />
            <div className="flex items-center gap-2">
              <span className="font-bold text-amber-200">{currentGarden.weatherStation.tempC}°C</span>
              <span className="text-emerald-200 flex items-center gap-0.5">
                <Droplets className="w-3 h-3 text-cyan-300" />
                {currentGarden.weatherStation.humidityPct}%
              </span>
            </div>
            <span className="hidden md:inline text-[11px] text-emerald-200/90 max-w-[160px] truncate">
              {currentGarden.weatherStation.condition}
            </span>
          </button>

          {/* Overall Health Indicator */}
          <div className={`px-3.5 py-1.5 rounded-xl border font-bold flex items-center gap-1.5 shadow-sm ${
            avgHealth >= 85
              ? "bg-[#2D5A27] border-emerald-400/30 text-[#A3D99E]"
              : avgHealth >= 70
              ? "bg-amber-700/60 border-amber-400/40 text-amber-200"
              : "bg-rose-700/60 border-rose-400/40 text-rose-200"
          }`}>
            <Activity className="w-3.5 h-3.5" />
            <span>Sức khỏe: {avgHealth}%</span>
          </div>
        </div>
      </div>

      {/* Main Navigation Tabs */}
      <div className="bg-[#173014] border-t border-[#2D5A27]/60">
        <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8 flex overflow-x-auto no-scrollbar gap-1.5 py-1.5">
          <button
            id="nav-tab-overview"
            type="button"
            onClick={() => setActiveTab("overview")}
            className={`px-3.5 py-2 text-xs sm:text-sm font-semibold rounded-xl transition-all flex items-center gap-2 whitespace-nowrap ${
              activeTab === "overview"
                ? "bg-[#2D5A27] text-white shadow-sm border border-emerald-400/30"
                : "text-emerald-100/80 hover:text-white hover:bg-[#2D5A27]/50"
            }`}
          >
            <Activity className="w-4 h-4 text-[#A3D99E]" />
            <span>Tổng Quan Sức Khỏe</span>
          </button>

          <button
            id="nav-tab-diagnosis"
            type="button"
            onClick={() => setActiveTab("diagnosis")}
            className={`px-3.5 py-2 text-xs sm:text-sm font-semibold rounded-xl transition-all flex items-center gap-2 whitespace-nowrap ${
              activeTab === "diagnosis"
                ? "bg-[#2D5A27] text-white shadow-sm border border-emerald-400/30"
                : "text-emerald-100/80 hover:text-white hover:bg-[#2D5A27]/50"
            }`}
          >
            <Sparkles className="w-4 h-4 text-amber-300 animate-pulse" />
            <span>Bác Sĩ Cây Trồng AI</span>
          </button>

          <button
            id="nav-tab-weather"
            type="button"
            onClick={() => setActiveTab("weather")}
            className={`px-3.5 py-2 text-xs sm:text-sm font-semibold rounded-xl transition-all flex items-center gap-2 whitespace-nowrap ${
              activeTab === "weather"
                ? "bg-[#2D5A27] text-white shadow-sm border border-emerald-400/30 ring-1 ring-amber-400/40"
                : "text-emerald-100/80 hover:text-white hover:bg-[#2D5A27]/50"
            }`}
          >
            <CloudSun className="w-4 h-4 text-amber-300" />
            <span>Dự Báo Thời Tiết & Rủi Ro</span>
          </button>

          <button
            id="nav-tab-care-plan"
            type="button"
            onClick={() => setActiveTab("care-plan")}
            className={`px-3.5 py-2 text-xs sm:text-sm font-semibold rounded-xl transition-all flex items-center gap-2 whitespace-nowrap ${
              activeTab === "care-plan"
                ? "bg-[#2D5A27] text-white shadow-sm border border-emerald-400/30"
                : "text-emerald-100/80 hover:text-white hover:bg-[#2D5A27]/50"
            }`}
          >
            <CalendarDays className="w-4 h-4 text-[#A3D99E]" />
            <span>Lịch Chăm Sóc & Phác Đồ</span>
          </button>

          <button
            id="nav-tab-diary"
            type="button"
            onClick={() => setActiveTab("diary")}
            className={`px-3.5 py-2 text-xs sm:text-sm font-semibold rounded-xl transition-all flex items-center gap-2 whitespace-nowrap ${
              activeTab === "diary"
                ? "bg-[#2D5A27] text-white shadow-sm border border-emerald-400/30"
                : "text-emerald-100/80 hover:text-white hover:bg-[#2D5A27]/50"
            }`}
          >
            <BookOpenCheck className="w-4 h-4 text-[#A3D99E]" />
            <span>Nhật Ký Canh Tác</span>
          </button>

          <button
            id="nav-tab-plots"
            type="button"
            onClick={() => setActiveTab("plots")}
            className={`px-3.5 py-2 text-xs sm:text-sm font-semibold rounded-xl transition-all flex items-center gap-2 whitespace-nowrap ${
              activeTab === "plots"
                ? "bg-[#2D5A27] text-white shadow-sm border border-emerald-400/30"
                : "text-emerald-100/80 hover:text-white hover:bg-[#2D5A27]/50"
            }`}
          >
            <Layers className="w-4 h-4 text-[#A3D99E]" />
            <span>Hồ Sơ & Lô Vườn ({currentGarden.plots.length})</span>
          </button>

          <button
            id="nav-tab-consultant"
            type="button"
            onClick={() => setActiveTab("consultant")}
            className={`px-3.5 py-2 text-xs sm:text-sm font-semibold rounded-xl transition-all flex items-center gap-2 whitespace-nowrap ${
              activeTab === "consultant"
                ? "bg-[#2D5A27] text-white shadow-sm border border-emerald-400/30"
                : "text-emerald-100/80 hover:text-white hover:bg-[#2D5A27]/50"
            }`}
          >
            <BotMessageSquare className="w-4 h-4 text-[#A3D99E]" />
            <span>Trợ Lý Nông Y AI</span>
          </button>
        </div>
      </div>
    </header>
  );
};
