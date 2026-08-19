import React, { useState, useRef, useEffect } from "react";
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
  User,
  Phone,
  Check,
  Search,
  Building2
} from "lucide-react";
import { GardenProfile } from "../types";

interface NavbarProps {
  gardens: GardenProfile[];
  currentGarden: GardenProfile;
  onSelectGarden: (gardenId: string) => void;
  onOpenAddGarden: () => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  gpsStatus?: "locating" | "ready" | "denied" | "error";
  onRefreshLocation?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  gardens,
  currentGarden,
  onSelectGarden,
  onOpenAddGarden,
  activeTab,
  setActiveTab,
  gpsStatus = "ready",
  onRefreshLocation,
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedRegionFilter, setSelectedRegionFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const regions = Array.from(new Set(gardens.map((g) => g.region || "Khu Vực Khác")));

  const filteredGardens = gardens.filter((g) => {
    const matchRegion = selectedRegionFilter === "all" || g.region === selectedRegionFilter;
    const matchSearch =
      searchQuery.trim() === "" ||
      g.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      g.ownerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (g.region && g.region.toLowerCase().includes(searchQuery.toLowerCase())) ||
      g.location.toLowerCase().includes(searchQuery.toLowerCase());
    return matchRegion && matchSearch;
  });

  const avgHealth = Math.round(
    currentGarden.plots.reduce((acc, p) => acc + p.healthScore, 0) /
      (currentGarden.plots.length || 1)
  );

  return (
    <header className="bg-[#1E3F1A] text-white shadow-md sticky top-0 z-40 border-b border-[#2D5A27]">
      {/* Top Bar: Brand & Garden Selection by Region / Owner & Live Weather */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex flex-wrap items-center justify-between gap-3">
        
        {/* Brand & Active Region / Owner Selector */}
        <div className="flex items-center gap-3">
          <div className="bg-[#2D5A27] p-2.5 rounded-2xl border border-emerald-400/20 flex items-center justify-center shadow-sm">
            <Sprout className="w-5.5 h-5.5 text-[#A3D99E]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-sm sm:text-base uppercase tracking-wider text-white">
                Nông Y Thông Minh
              </span>
              <span className="bg-[#2D5A27] text-[10px] sm:text-[11px] text-[#A3D99E] px-2 py-0.5 rounded-full border border-emerald-400/30 font-semibold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Quản lý theo Khu Vực & Chủ Vườn
              </span>
            </div>

            {/* Interactive Region & Garden Owner Switcher Button */}
            <div className="relative mt-1" ref={dropdownRef}>
              <button
                id="nav-garden-selector-btn"
                type="button"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center gap-2 px-2.5 py-1 bg-[#2D5A27] hover:bg-[#386b31] border border-emerald-400/30 rounded-xl text-xs font-semibold text-white transition cursor-pointer shadow-sm group"
              >
                <span className="bg-emerald-400/20 text-emerald-300 px-1.5 py-0.5 rounded text-[11px] font-bold">
                  📍 {currentGarden.region || "Khu Vực"}
                </span>
                <span className="text-emerald-100 flex items-center gap-1">
                  <User className="w-3 h-3 text-[#A3D99E]" />
                  <strong className="text-white">{currentGarden.ownerName}</strong>
                  <span className="hidden sm:inline text-[#A3D99E]/80">({currentGarden.name})</span>
                </span>
                <ChevronDown className={`w-3.5 h-3.5 text-[#A3D99E] transition-transform duration-200 ${isDropdownOpen ? "rotate-180" : ""}`} />
              </button>

              {/* Dropdown Menu - Garden Management by Region & Owner */}
              {isDropdownOpen && (
                <div className="absolute left-0 top-full mt-2 w-[340px] sm:w-[460px] bg-white rounded-2xl shadow-2xl border border-emerald-200/80 z-50 text-slate-800 p-3.5 space-y-3 animate-fadeIn">
                  
                  {/* Dropdown Header & Search */}
                  <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                    <div className="flex items-center gap-2">
                      <Building2 className="w-4 h-4 text-emerald-700" />
                      <span className="font-bold text-xs sm:text-sm text-slate-900">
                        Chọn Vườn Theo Khu Vực & Chủ Hộ
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setIsDropdownOpen(false);
                        onOpenAddGarden();
                      }}
                      className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-[11px] font-bold flex items-center gap-1 transition"
                    >
                      <Plus className="w-3 h-3" />
                      <span>Thêm Vườn</span>
                    </button>
                  </div>

                  {/* Search Bar */}
                  <div className="relative">
                    <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Tìm theo khu vực, chủ vườn, vị trí..."
                      className="w-full pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:ring-2 focus:ring-emerald-600 focus:bg-white"
                    />
                  </div>

                  {/* Region Filter Badges */}
                  <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1">
                    <button
                      type="button"
                      onClick={() => setSelectedRegionFilter("all")}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-bold whitespace-nowrap transition ${
                        selectedRegionFilter === "all"
                          ? "bg-[#2D5A27] text-white"
                          : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                      }`}
                    >
                      Tất Cả ({gardens.length})
                    </button>
                    {regions.map((r) => {
                      const count = gardens.filter((g) => g.region === r).length;
                      return (
                        <button
                          key={r}
                          type="button"
                          onClick={() => setSelectedRegionFilter(r)}
                          className={`px-2.5 py-1 rounded-lg text-[11px] font-bold whitespace-nowrap transition flex items-center gap-1 ${
                            selectedRegionFilter === r
                              ? "bg-[#2D5A27] text-white"
                              : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                          }`}
                        >
                          <span>{r}</span>
                          <span className="opacity-70">({count})</span>
                        </button>
                      );
                    })}
                  </div>

                  {/* Gardens List */}
                  <div className="max-h-[260px] overflow-y-auto space-y-2 pr-1 divide-y divide-slate-100">
                    {filteredGardens.map((g) => {
                      const isSelected = g.id === currentGarden.id;
                      return (
                        <div
                          key={g.id}
                          onClick={() => {
                            onSelectGarden(g.id);
                            setIsDropdownOpen(false);
                          }}
                          className={`p-2.5 rounded-xl cursor-pointer transition flex items-start justify-between gap-3 ${
                            isSelected
                              ? "bg-emerald-50/90 border border-emerald-300"
                              : "hover:bg-slate-50"
                          }`}
                        >
                          <div className="space-y-1 flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="text-[10px] font-bold bg-emerald-100 text-[#2D5A27] px-2 py-0.5 rounded-md">
                                {g.region || "Khu Vực"}
                              </span>
                              <h4 className="font-bold text-xs text-slate-900 truncate">
                                {g.name}
                              </h4>
                            </div>
                            <div className="text-[11px] text-slate-600 flex items-center gap-2 flex-wrap">
                              <span className="flex items-center gap-1 font-semibold text-slate-800">
                                <User className="w-3 h-3 text-emerald-600" />
                                {g.ownerName}
                              </span>
                              <span className="text-slate-300">•</span>
                              <span className="flex items-center gap-1 text-slate-500">
                                <Phone className="w-3 h-3 text-slate-400" />
                                {g.phone}
                              </span>
                              <span className="text-slate-300">•</span>
                              <span className="text-emerald-700 font-medium">{g.totalAreaHa} ha ({g.plots.length} lô)</span>
                            </div>
                            <div className="text-[10px] text-slate-400 truncate flex items-center gap-1">
                              <MapPin className="w-2.5 h-2.5 text-slate-400 shrink-0" />
                              <span className="truncate">{g.location}</span>
                            </div>
                          </div>

                          <div className="flex flex-col items-end gap-1.5 shrink-0">
                            {isSelected ? (
                              <span className="p-1 bg-emerald-600 text-white rounded-full">
                                <Check className="w-3.5 h-3.5" />
                              </span>
                            ) : (
                              <span className="text-[11px] text-emerald-700 hover:underline font-semibold mt-1">
                                Chọn
                              </span>
                            )}
                            <span className="text-[10px] text-slate-400 font-mono">
                              {g.soilType.includes("Bazan") ? "Bazan" : "Phù sa"}
                            </span>
                          </div>
                        </div>
                      );
                    })}

                    {filteredGardens.length === 0 && (
                      <div className="py-6 text-center text-xs text-slate-400">
                        Không tìm thấy nhà vườn nào khớp với bộ lọc.
                      </div>
                    )}
                  </div>

                  {/* Dropdown Footer */}
                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
                    <span className="text-slate-500 font-medium">
                      Tổng cộng: <strong>{gardens.length}</strong> nhà vườn
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        setIsDropdownOpen(false);
                        setActiveTab("plots");
                      }}
                      className="text-emerald-700 hover:text-emerald-900 font-bold hover:underline"
                    >
                      Quản lý chi tiết tất cả vườn →
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Real-time Location & Weather Pills */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          {/* Real-time Auto-Detected Location Pill */}
          <button
            id="nav-location-gps-btn"
            type="button"
            onClick={onRefreshLocation}
            title="Nhấn để tự động cập nhật lại vị trí hiện tại qua GPS"
            className="bg-[#2D5A27]/90 hover:bg-[#254b20] border border-emerald-400/25 px-3 py-1.5 rounded-xl flex items-center gap-2 transition cursor-pointer group shadow-sm"
          >
            <MapPin className={`w-3.5 h-3.5 ${gpsStatus === "locating" ? "text-amber-300 animate-spin" : "text-[#A3D99E] group-hover:scale-110 transition-transform"}`} />
            <span className="text-[#E8F3E8] font-medium max-w-[150px] sm:max-w-[200px] truncate">
              {currentGarden.location || "Đang định vị..."}
            </span>
            <span className="bg-emerald-500/20 text-emerald-300 text-[10px] px-1.5 py-0.2 rounded font-mono font-bold">
              {gpsStatus === "locating" ? "Đang dò..." : "GPS"}
            </span>
          </button>

          {/* Microclimate Weather Widget */}
          <button
            id="nav-weather-quick-btn"
            type="button"
            onClick={() => setActiveTab("weather")}
            className={`border border-emerald-400/25 px-3 py-1.5 rounded-xl flex items-center gap-2 transition cursor-pointer shadow-sm ${
              activeTab === "weather"
                ? "bg-[#2D5A27] text-white ring-2 ring-amber-400/40"
                : "bg-[#162e13] hover:bg-[#1f3f1b]"
            }`}
            title="Xem dự báo thời tiết & rủi ro chi tiết theo vị trí này"
          >
            <CloudSun className="w-4 h-4 text-amber-300 shrink-0" />
            <div className="flex items-center gap-1.5 font-semibold">
              <span className="text-amber-200">{currentGarden.weatherStation.tempC}°C</span>
              <span className="text-emerald-200/50">•</span>
              <span className="text-emerald-200 flex items-center gap-0.5">
                <Droplets className="w-3 h-3 text-cyan-300" />
                {currentGarden.weatherStation.humidityPct}%
              </span>
            </div>
            <span className="hidden lg:inline text-[11px] text-emerald-200/90 max-w-[130px] truncate">
              {currentGarden.weatherStation.condition}
            </span>
          </button>

          {/* Overall Health Indicator */}
          <div className={`px-3 py-1.5 rounded-xl border font-bold flex items-center gap-1.5 shadow-sm ${
            avgHealth >= 85
              ? "bg-[#2D5A27] border-emerald-400/30 text-[#A3D99E]"
              : avgHealth >= 70
              ? "bg-amber-700/60 border-amber-400/40 text-amber-200"
              : "bg-rose-700/60 border-rose-400/40 text-rose-200"
          }`}>
            <Activity className="w-3.5 h-3.5" />
            <span>{avgHealth}% Khỏe</span>
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
            <span>Quản Lý Vườn & Khu Vực ({gardens.length})</span>
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
