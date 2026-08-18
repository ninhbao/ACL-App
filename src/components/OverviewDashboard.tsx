import React, { useState } from "react";
import { 
  Activity, 
  AlertTriangle, 
  CheckCircle2, 
  Sparkles, 
  Calendar, 
  Droplets, 
  Flame, 
  Layers, 
  TrendingUp, 
  ArrowUpRight, 
  Plus, 
  FileText, 
  ShieldAlert, 
  HeartHandshake,
  ExternalLink,
  ChevronRight,
  Info,
  Clock,
  FlaskConical,
  CloudSun,
  CloudRain,
  Wind
} from "lucide-react";
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid,
  BarChart,
  Bar,
  Cell
} from "recharts";
import { GardenProfile, CareTask, DiagnosisRecord, FarmDiaryLog } from "../types";

interface OverviewDashboardProps {
  garden: GardenProfile;
  diagnoses: DiagnosisRecord[];
  tasks: CareTask[];
  logs: FarmDiaryLog[];
  onNavigateTab: (tab: string, extra?: any) => void;
  onOpenNewDiagnosis: (plotId?: string) => void;
}

export const OverviewDashboard: React.FC<OverviewDashboardProps> = ({
  garden,
  diagnoses,
  tasks,
  logs,
  onNavigateTab,
  onOpenNewDiagnosis,
}) => {
  const [analyzingRisk, setAnalyzingRisk] = useState(false);
  const [aiRiskReport, setAiRiskReport] = useState<any>(null);

  // Calculate stats
  const totalPlots = garden.plots.length;
  const totalTrees = garden.plots.reduce((acc, p) => acc + p.treeCount, 0);
  const avgHealth = Math.round(
    garden.plots.reduce((acc, p) => acc + p.healthScore, 0) / (totalPlots || 1)
  );

  const pendingTasks = tasks.filter((t) => !t.isCompleted);
  const todayTasks = tasks.filter((t) => !t.isCompleted && t.date <= new Date().toISOString().slice(0, 10));
  const activeIssues = diagnoses.filter((d) => d.status === "active" || d.status === "treating");

  // Health Trend Chart Data (Mocking trend over last 6 weeks based on garden)
  const healthTrendData = [
    { week: "T1", health: Math.max(60, avgHealth - 12), ph: Number((garden.soilPH - 0.4).toFixed(1)), moisture: 70 },
    { week: "T2", health: Math.max(65, avgHealth - 9), ph: Number((garden.soilPH - 0.2).toFixed(1)), moisture: 75 },
    { week: "T3", health: Math.max(68, avgHealth - 6), ph: Number((garden.soilPH - 0.1).toFixed(1)), moisture: 82 },
    { week: "T4", health: Math.max(72, avgHealth - 4), ph: Number((garden.soilPH + 0.1).toFixed(1)), moisture: 78 },
    { week: "T5", health: Math.max(75, avgHealth - 2), ph: Number(garden.soilPH.toFixed(1)), moisture: 80 },
    { week: "Hiện tại", health: avgHealth, ph: Number(garden.soilPH.toFixed(1)), moisture: garden.weatherStation.humidityPct }
  ];

  // Personalized Environmental Risk trigger
  const runAiRiskAnalysis = async () => {
    setAnalyzingRisk(true);
    try {
      const res = await fetch("/api/analyze-environment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          gardenInfo: {
            name: garden.name,
            location: garden.location,
            soilType: garden.soilType,
            irrigationType: garden.irrigationType
          },
          weatherData: {
            temp: garden.weatherStation.tempC,
            humidity: garden.weatherStation.humidityPct,
            condition: garden.weatherStation.condition,
            rainfall: garden.weatherStation.rainfallMm
          }
        })
      });
      const data = await res.json();
      if (data.success) {
        setAiRiskReport(data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setAnalyzingRisk(false);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Banner: Bento Hero Tile */}
      <div className="bg-[#1E3F1A] rounded-3xl text-white p-6 sm:p-7 shadow-[0_10px_30px_-10px_rgba(30,63,26,0.4)] border border-[#2D5A27]">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="space-y-2.5 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#2D5A27] text-[#A3D99E] text-xs font-semibold border border-emerald-400/20">
              <Sparkles className="w-3.5 h-3.5 text-[#A3D99E]" />
              <span>Hồ sơ sức khỏe cá nhân hoá • {garden.cultivationStandard}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              {garden.name}
            </h1>
            <p className="text-[#D1E7D1] text-sm leading-relaxed">
              Chủ vườn: <strong className="text-white">{garden.ownerName}</strong> ({garden.phone}) • {garden.location}. Tổng diện tích <strong className="text-white">{garden.totalAreaHa} ha</strong> ({totalTrees.toLocaleString()} gốc) trên nền <strong className="text-amber-200">{garden.soilType}</strong>.
            </p>
          </div>

          {/* Quick Action CTA Buttons */}
          <div className="flex flex-wrap gap-2.5 w-full lg:w-auto">
            <button
              id="quick-action-diagnose-btn"
              type="button"
              onClick={() => onOpenNewDiagnosis()}
              className="flex-1 sm:flex-none px-4 py-3 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-bold text-xs sm:text-sm rounded-2xl shadow-lg shadow-amber-950/20 flex items-center justify-center gap-2 transition transform active:scale-95 cursor-pointer"
            >
              <Sparkles className="w-4 h-4 fill-slate-950" />
              <span>Bác Sĩ AI Khám Cây</span>
            </button>

            <button
              id="quick-action-weather-btn"
              type="button"
              onClick={() => onNavigateTab("weather")}
              className="px-4 py-3 bg-[#162e13] hover:bg-[#1f3f1b] text-amber-300 font-semibold text-xs sm:text-sm rounded-2xl border border-amber-400/30 flex items-center justify-center gap-2 transition cursor-pointer"
            >
              <CloudSun className="w-4 h-4 text-amber-300" />
              <span>Dự Báo Khí Tượng</span>
            </button>

            <button
              id="quick-action-plan-btn"
              type="button"
              onClick={() => onNavigateTab("care-plan")}
              className="flex-1 sm:flex-none px-4 py-3 bg-[#2D5A27] hover:bg-[#386b31] text-white font-semibold text-xs sm:text-sm rounded-2xl border border-emerald-400/30 shadow-sm flex items-center justify-center gap-2 transition cursor-pointer"
            >
              <Calendar className="w-4 h-4 text-[#A3D99E]" />
              <span>Lịch Phác Đồ ({pendingTasks.length})</span>
            </button>

            <button
              id="quick-action-diary-btn"
              type="button"
              onClick={() => onNavigateTab("diary")}
              className="px-4 py-3 bg-[#162e13] hover:bg-[#1f3f1b] text-[#A3D99E] font-semibold text-xs sm:text-sm rounded-2xl border border-[#2D5A27] flex items-center justify-center gap-2 transition cursor-pointer"
            >
              <FileText className="w-4 h-4 text-[#A3D99E]" />
              <span>Nhật Ký</span>
            </button>
          </div>
        </div>
      </div>

      {/* 4 Bento Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Overall Health Score Card */}
        <div className="bg-white rounded-3xl p-5 border border-[#E2ECE2] shadow-[0_4px_20px_-4px_rgba(45,90,39,0.06)] flex flex-col justify-between hover:border-[#2D5A27]/40 transition">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-semibold uppercase text-[#527050] tracking-wider">
                Chỉ số sức khỏe toàn vườn
              </p>
              <div className="flex items-baseline gap-2 mt-2">
                <span className={`text-3xl sm:text-4xl font-extrabold ${
                  avgHealth >= 85 ? "text-[#2D5A27]" : avgHealth >= 70 ? "text-amber-600" : "text-rose-600"
                }`}>
                  {avgHealth}%
                </span>
                <span className="text-xs font-bold text-[#2D5A27] bg-[#E8F3E8] px-2.5 py-0.5 rounded-full border border-emerald-200">
                  {avgHealth >= 85 ? "Rất Tốt" : avgHealth >= 70 ? "Cần Theo Dõi" : "Báo Động"}
                </span>
              </div>
            </div>
            <div className={`p-3 rounded-2xl ${
              avgHealth >= 85 ? "bg-[#E8F3E8] text-[#2D5A27]" : "bg-amber-100 text-amber-700"
            }`}>
              <Activity className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-[#F0F5F0] text-xs text-[#527050] flex justify-between items-center">
            <span>{garden.plots.filter(p => p.healthScore >= 85).length}/{totalPlots} Lô đạt chuẩn cao</span>
            <span className="font-semibold text-[#2D5A27]">Mục tiêu: 95%</span>
          </div>
        </div>

        {/* Active Issues / Pest Alert Card */}
        <div className="bg-white rounded-3xl p-5 border border-[#E2ECE2] shadow-[0_4px_20px_-4px_rgba(45,90,39,0.06)] flex flex-col justify-between hover:border-amber-300 transition">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-semibold uppercase text-[#527050] tracking-wider">
                Cảnh báo sâu bệnh đang trị
              </p>
              <div className="flex items-baseline gap-2 mt-2">
                <span className={`text-3xl sm:text-4xl font-extrabold ${
                  activeIssues.length > 0 ? "text-amber-600" : "text-[#2D5A27]"
                }`}>
                  {activeIssues.length}
                </span>
                <span className="text-xs text-[#739270]">vấn đề ghi nhận</span>
              </div>
            </div>
            <div className={`p-3 rounded-2xl ${
              activeIssues.length > 0 ? "bg-amber-100 text-amber-700" : "bg-[#E8F3E8] text-[#2D5A27]"
            }`}>
              <ShieldAlert className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-[#F0F5F0] text-xs text-[#527050] flex justify-between items-center">
            <span>{diagnoses.filter(d => d.status === "recovered").length} ca đã khỏi bệnh</span>
            <button 
              type="button"
              onClick={() => onNavigateTab("diagnosis")}
              className="text-[#2D5A27] font-semibold hover:underline flex items-center cursor-pointer"
            >
              Chi tiết <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Soil & Microclimate Gauge */}
        <div className="bg-white rounded-3xl p-5 border border-[#E2ECE2] shadow-[0_4px_20px_-4px_rgba(45,90,39,0.06)] flex flex-col justify-between hover:border-cyan-300 transition">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-semibold uppercase text-[#527050] tracking-wider">
                Chỉ số đất & Vi khí hậu
              </p>
              <div className="flex items-baseline gap-2 mt-2">
                <span className="text-2xl font-bold text-slate-800">
                  pH {garden.soilPH}
                </span>
                <span className="text-xs text-cyan-800 bg-cyan-50 px-2 py-0.5 rounded-full font-medium border border-cyan-100">
                  Ẩm {garden.weatherStation.humidityPct}%
                </span>
              </div>
            </div>
            <div className="p-3 rounded-2xl bg-cyan-50 text-cyan-700">
              <FlaskConical className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-[#F0F5F0] text-xs text-[#527050] flex justify-between items-center">
            <span>{garden.weatherStation.tempC}°C • {garden.weatherStation.condition}</span>
            <button
              type="button"
              onClick={() => onNavigateTab("weather")}
              className="text-[#2D5A27] font-semibold hover:underline flex items-center gap-0.5 cursor-pointer"
            >
              Dự báo <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Today's Tasks */}
        <div className="bg-white rounded-3xl p-5 border border-[#E2ECE2] shadow-[0_4px_20px_-4px_rgba(45,90,39,0.06)] flex flex-col justify-between hover:border-[#2D5A27]/40 transition">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-semibold uppercase text-[#527050] tracking-wider">
                Nhiệm vụ chăm sóc hôm nay
              </p>
              <div className="flex items-baseline gap-2 mt-2">
                <span className="text-3xl sm:text-4xl font-extrabold text-slate-800">
                  {todayTasks.length}
                </span>
                <span className="text-xs text-[#739270]">việc cần xử lý</span>
              </div>
            </div>
            <div className="p-3 rounded-2xl bg-[#E8F3E8] text-[#2D5A27]">
              <Calendar className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-[#F0F5F0] text-xs text-[#527050] flex justify-between items-center">
            <span>Tổng tồn: {pendingTasks.length} việc</span>
            <button
              type="button"
              onClick={() => onNavigateTab("care-plan")}
              className="text-[#2D5A27] font-semibold hover:underline flex items-center cursor-pointer"
            >
              Xem lịch <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Real-time Meteorological & Search Grounding Weather Feature Bento Banner */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-[#E2ECE2] shadow-[0_4px_20px_-4px_rgba(45,90,39,0.06)] flex flex-col md:flex-row items-start md:items-center justify-between gap-5 hover:border-[#2D5A27]/40 transition">
        <div className="flex items-start sm:items-center gap-4">
          <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200/60 text-amber-600 shrink-0">
            <CloudSun className="w-6 h-6 text-amber-500" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold text-[#2D5A27] bg-[#E8F3E8] px-2.5 py-0.5 rounded-full uppercase tracking-wider border border-emerald-200">
                Google Search Grounding
              </span>
              <span className="text-xs text-slate-500 font-medium">
                Khí tượng thời gian thực • {garden.location}
              </span>
            </div>
            <h3 className="text-base font-bold text-slate-900 mt-1">
              Dự Báo Khí Tượng & Khung Giờ Vàng Phun Thuốc Cho Cây Trồng
            </h3>
            <p className="text-xs text-[#527050] mt-0.5 line-clamp-1">
              Theo dõi xác suất mưa, áp suất, độ ẩm vi khí hậu và cảnh báo nguy cơ nấm bệnh/sâu hại 7 ngày tới.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto shrink-0">
          <button
            id="overview-open-weather-forecast-btn"
            type="button"
            onClick={() => onNavigateTab("weather")}
            className="w-full md:w-auto px-4 py-2.5 bg-[#2D5A27] hover:bg-[#1E3F1A] text-white text-xs font-bold rounded-2xl shadow-sm flex items-center justify-center gap-2 transition cursor-pointer"
          >
            <CloudSun className="w-4 h-4 text-amber-300" />
            <span>Mở Dự Báo Khí Tượng 7 Ngày</span>
            <ChevronRight className="w-3.5 h-3.5 text-white/70" />
          </button>
        </div>
      </div>

      {/* Dynamic AI Ecological & Pest Risk Advisory Panel */}
      <div className="bg-gradient-to-r from-[#F4F9F4] via-[#FDFBF7] to-[#FAF8F5] rounded-3xl p-5 sm:p-6 border border-[#E2ECE2] shadow-[0_4px_20px_-4px_rgba(45,90,39,0.04)]">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-4 border-b border-[#E2ECE2]">
          <div className="flex items-center gap-3.5">
            <div className="p-2.5 rounded-2xl bg-[#2D5A27] text-white shadow-sm">
              <ShieldAlert className="w-5 h-5 text-[#A3D99E]" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                Dự Báo Nguy Cơ Sâu Bệnh & Khuyến Nghị Sinh Thái Cho {garden.soilType.split(" ")[0]} {garden.soilType.split(" ")[1]}
                <span className="text-[11px] bg-[#E8F3E8] text-[#2D5A27] px-2.5 py-0.5 rounded-full font-semibold border border-emerald-200">
                  Cá nhân hoá theo vườn
                </span>
              </h2>
              <p className="text-xs text-[#527050] mt-0.5">
                Dựa trên độ ẩm {garden.weatherStation.humidityPct}%, nhiệt độ {garden.weatherStation.tempC}°C và lịch sử bệnh tại {garden.location}.
              </p>
            </div>
          </div>

          <button
            id="run-ai-risk-btn"
            type="button"
            onClick={runAiRiskAnalysis}
            disabled={analyzingRisk}
            className="px-4 py-2.5 bg-[#2D5A27] hover:bg-[#1E3F1A] disabled:opacity-50 text-white text-xs font-bold rounded-2xl shadow-sm flex items-center gap-2 transition shrink-0 cursor-pointer"
          >
            {analyzingRisk ? (
              <>
                <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>AI Đang Phân Tích...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-3.5 h-3.5 text-[#A3D99E]" />
                <span>Quét Cảnh Báo Sâu Bệnh Mới</span>
              </>
            )}
          </button>
        </div>

        {/* Advisory Bento Sub-Cards */}
        <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white p-4 rounded-2xl border border-[#E2ECE2] shadow-sm">
            <div className="flex items-center gap-2 text-xs font-bold text-amber-900 uppercase">
              <AlertTriangle className="w-4 h-4 text-amber-600" />
              <span>Nguy cơ Nấm Phytophthora & Thán Thư</span>
            </div>
            <p className="text-xs text-slate-700 mt-2 leading-relaxed">
              {aiRiskReport?.warnings?.[0]?.description ||
                `Độ ẩm vườn ${garden.weatherStation.humidityPct}% kết hợp chất đất ${garden.soilType} là môi trường nấm lây lan nhanh ở các vết xì mủ thân cành và lá non.`}
            </p>
            <div className="mt-3 text-[11px] font-semibold text-[#2D5A27] bg-[#E8F3E8] p-2 rounded-xl border border-emerald-100">
              Giải pháp: Phun nấm đối kháng Trichoderma + quét vôi cổ rễ.
            </div>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-[#E2ECE2] shadow-sm">
            <div className="flex items-center gap-2 text-xs font-bold text-cyan-900 uppercase">
              <Droplets className="w-4 h-4 text-cyan-600" />
              <span>Cân Bằng Nước & pH Đất ({garden.soilPH})</span>
            </div>
            <p className="text-xs text-slate-700 mt-2 leading-relaxed">
              Hệ thống {garden.irrigationType} cần điều chỉnh tưới 2-3 ngày/lần. Tránh tưới đẫm vào chiều muộn gây ẩm độ ban đêm vượt ngưỡng 90%.
            </p>
            <div className="mt-3 text-[11px] font-semibold text-cyan-800 bg-cyan-50 p-2 rounded-xl border border-cyan-100">
              Hành động: Bổ sung 300g vôi Dolomite/gốc để ổn định pH {garden.soilPH}.
            </div>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-[#E2ECE2] shadow-sm">
            <div className="flex items-center gap-2 text-xs font-bold text-[#2D5A27] uppercase">
              <CheckCircle2 className="w-4 h-4 text-[#2D5A27]" />
              <span>Tiêu chuẩn {garden.cultivationStandard}</span>
            </div>
            <p className="text-xs text-slate-700 mt-2 leading-relaxed">
              Tuân thủ thời gian cách ly (PHI) và nhật ký vật tư để duy trì chứng nhận xuất khẩu. Ưu tiên chế phẩm sinh học vi sinh thế hệ mới.
            </p>
            <div className="mt-3 text-[11px] font-semibold text-slate-700 bg-slate-50 p-2 rounded-xl border border-slate-100">
              Tình trạng: Nhật ký canh tác cập nhật đều đặn.
            </div>
          </div>
        </div>
      </div>

      {/* Main Bento Grid: Plots Status & Health Trend Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Interactive Plot Health Cards */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Layers className="w-5 h-5 text-[#2D5A27]" />
                <span>Tình Trạng Các Lô / Khu Canh Tác ({garden.plots.length})</span>
              </h2>
              <p className="text-xs text-[#527050]">
                Theo dõi chi tiết sức khỏe, giống cây, tuổi cây và giai đoạn sinh trưởng
              </p>
            </div>
            <button
              type="button"
              onClick={() => onNavigateTab("plots")}
              className="text-xs font-semibold text-[#2D5A27] hover:text-[#1E3F1A] flex items-center gap-1 cursor-pointer"
            >
              Quản lý Lô <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Plot Bento Tiles */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {garden.plots.map((plot) => (
              <div
                key={plot.id}
                className="bg-white rounded-3xl p-5 border border-[#E2ECE2] shadow-[0_4px_20px_-4px_rgba(45,90,39,0.06)] hover:shadow-md hover:border-[#2D5A27]/40 transition flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="font-bold text-sm text-slate-900 line-clamp-1">
                        {plot.name}
                      </h3>
                      <div className="text-xs text-[#2D5A27] font-semibold mt-0.5">
                        {plot.cropName} • {plot.variety}
                      </div>
                    </div>
                    <span
                      className={`text-xs px-2.5 py-1 rounded-full font-extrabold shrink-0 ${
                        plot.healthScore >= 85
                          ? "bg-[#E8F3E8] text-[#2D5A27] border border-emerald-200"
                          : plot.healthScore >= 70
                          ? "bg-amber-100 text-amber-800 border border-amber-200"
                          : "bg-rose-100 text-rose-800 border border-rose-200"
                      }`}
                    >
                      {plot.healthScore}%
                    </span>
                  </div>

                  {/* Progress Bar */}
                  <div className="w-full bg-[#F0F5F0] h-2 rounded-full mt-3 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        plot.healthScore >= 85
                          ? "bg-[#2D5A27]"
                          : plot.healthScore >= 70
                          ? "bg-amber-500"
                          : "bg-rose-500"
                      }`}
                      style={{ width: `${plot.healthScore}%` }}
                    />
                  </div>

                  {/* Plot Specs */}
                  <div className="mt-3.5 grid grid-cols-2 gap-2 text-[11px] text-slate-600 bg-[#F9FBF9] p-3 rounded-2xl border border-[#E2ECE2]">
                    <div>
                      <span className="text-[#739270] block">Quy mô:</span>
                      <strong className="text-slate-800 font-semibold">{plot.treeCount} cây ({plot.areaM2} m²)</strong>
                    </div>
                    <div>
                      <span className="text-[#739270] block">Tuổi cây:</span>
                      <strong className="text-slate-800 font-semibold">{plot.treeAgeYears} năm ({plot.plantedYear})</strong>
                    </div>
                    <div className="col-span-2">
                      <span className="text-[#739270] block">Giai đoạn:</span>
                      <span className="text-[#2D5A27] font-semibold">{plot.stage}</span>
                    </div>
                  </div>

                  {plot.recentIssue && (
                    <div className="mt-2.5 flex items-start gap-1.5 text-[11px] text-amber-800 bg-amber-50/90 p-2.5 rounded-xl border border-amber-200/60">
                      <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                      <span>{plot.recentIssue}</span>
                    </div>
                  )}
                </div>

                {/* Plot Action Buttons */}
                <div className="mt-4 pt-3 border-t border-[#F0F5F0] flex items-center justify-between gap-2">
                  <span className="text-[11px] text-[#739270]">
                    Khám gần nhất: {plot.lastInspectionDate || "Hôm nay"}
                  </span>
                  <button
                    type="button"
                    onClick={() => onOpenNewDiagnosis(plot.id)}
                    className="px-3 py-1.5 bg-[#E8F3E8] hover:bg-[#D4E8D4] text-[#2D5A27] text-xs font-semibold rounded-xl border border-emerald-200 flex items-center gap-1.5 transition cursor-pointer"
                  >
                    <Sparkles className="w-3 h-3 text-[#2D5A27]" />
                    <span>Khám AI</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right 1 Col: Health Trend Chart & Priority Tasks Bento Tile */}
        <div className="space-y-4">
          <div className="bg-white rounded-3xl p-5 border border-[#E2ECE2] shadow-[0_4px_20px_-4px_rgba(45,90,39,0.06)]">
            <h2 className="text-sm font-bold text-slate-900 flex items-center justify-between">
              <span className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-[#2D5A27]" />
                Xu Hướng Sức Khỏe Vườn
              </span>
              <span className="text-xs font-semibold text-[#2D5A27] bg-[#E8F3E8] px-2 py-0.5 rounded-full">{avgHealth}% Đạt</span>
            </h2>
            <p className="text-[11px] text-[#527050] mt-0.5">
              Diễn biến điểm sức khỏe 6 tuần qua
            </p>

            <div className="h-44 mt-3">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={healthTrendData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                  <defs>
                    <linearGradient id="healthGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#2D5A27" stopOpacity={0.35}/>
                      <stop offset="95%" stopColor="#2D5A27" stopOpacity={0.0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="week" tick={{ fontSize: 11 }} stroke="#94a3b8" />
                  <YAxis domain={[50, 100]} tick={{ fontSize: 11 }} stroke="#94a3b8" />
                  <Tooltip 
                    contentStyle={{ borderRadius: '12px', fontSize: '12px', border: '1px solid #E2ECE2', backgroundColor: '#ffffff' }}
                    formatter={(value: any) => [`${value}%`, "Điểm sức khỏe"]}
                  />
                  <Area type="monotone" dataKey="health" stroke="#2D5A27" strokeWidth={2.5} fillOpacity={1} fill="url(#healthGrad)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            <div className="mt-2 pt-2.5 border-t border-[#F0F5F0] grid grid-cols-2 gap-2 text-center text-xs">
              <div className="p-2 rounded-xl bg-[#F9FBF9] border border-[#E2ECE2]">
                <span className="text-[#739270] text-[10px] block">pH Đất Trung Bình</span>
                <span className="font-bold text-slate-800">{garden.soilPH}</span>
              </div>
              <div className="p-2 rounded-xl bg-[#F9FBF9] border border-[#E2ECE2]">
                <span className="text-[#739270] text-[10px] block">Độ Ẩm Vi Khí Hậu</span>
                <span className="font-bold text-cyan-800">{garden.weatherStation.humidityPct}%</span>
              </div>
            </div>
          </div>

          {/* Today's Priority Tasks List Bento Tile */}
          <div className="bg-white rounded-3xl p-5 border border-[#E2ECE2] shadow-[0_4px_20px_-4px_rgba(45,90,39,0.06)]">
            <div className="flex items-center justify-between pb-3 border-b border-[#F0F5F0]">
              <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#2D5A27]" />
                <span>Việc Cần Làm Sớm</span>
              </h2>
              <button
                type="button"
                onClick={() => onNavigateTab("care-plan")}
                className="text-xs font-semibold text-[#2D5A27] hover:underline cursor-pointer"
              >
                Tất cả ({tasks.length})
              </button>
            </div>

            <div className="mt-3 space-y-2.5">
              {tasks.slice(0, 3).map((task) => (
                <div
                  key={task.id}
                  className={`p-3 rounded-2xl border text-xs transition ${
                    task.isCompleted
                      ? "bg-[#F9FBF9] border-[#E2ECE2] opacity-60 line-through"
                      : task.priority === "high"
                      ? "bg-rose-50/70 border-rose-200"
                      : "bg-[#F9FBF9] border-[#E2ECE2]"
                  }`}
                >
                  <div className="flex items-start justify-between gap-1">
                    <span className="font-bold text-slate-800 line-clamp-1">{task.title}</span>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase shrink-0 ${
                      task.priority === "high" ? "bg-rose-100 text-rose-800" : "bg-[#E8F3E8] text-[#2D5A27]"
                    }`}>
                      {task.priority === "high" ? "Gấp" : "Bình thường"}
                    </span>
                  </div>
                  <div className="text-[11px] text-[#527050] mt-1.5 flex items-center gap-2">
                    <span>{task.timeOfDay}</span>
                    <span>•</span>
                    <span className="text-[#2D5A27] font-semibold">{task.dosage || "Theo hướng dẫn"}</span>
                  </div>
                </div>
              ))}

              {tasks.length === 0 && (
                <p className="text-xs text-slate-400 text-center py-4">Chưa có lịch chăm sóc nào được tạo.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
