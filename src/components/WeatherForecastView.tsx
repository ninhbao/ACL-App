import React, { useState, useEffect } from "react";
import { 
  CloudSun, 
  CloudRain, 
  Sun, 
  CloudLightning, 
  CloudDrizzle, 
  Cloud, 
  Droplets, 
  Wind, 
  Compass, 
  ShieldAlert, 
  AlertTriangle, 
  CheckCircle2, 
  RefreshCw, 
  ExternalLink, 
  Calendar, 
  Sparkles, 
  MapPin, 
  Search, 
  ArrowUpRight, 
  Info, 
  Check, 
  Clock, 
  Thermometer, 
  Eye, 
  FlaskConical, 
  Gauge
} from "lucide-react";
import { 
  GardenProfile, 
  CareTask, 
  RealtimeWeatherForecastData, 
  DailyForecast, 
  CropRiskAlert 
} from "../types";

interface WeatherForecastViewProps {
  garden: GardenProfile;
  onAddTaskFromWeather?: (task: CareTask) => void;
  onNavigateToCarePlan?: () => void;
  onUpdateLocation?: (loc: string, weather?: any) => void;
}

const REGION_QUICK_SEARCH = [
  { name: "Bù Đăng, Bình Phước", desc: "Đông Nam Bộ • Đất đỏ Bazan • Sầu riêng, Điều, Tiêu" },
  { name: "Núi Bà Đen, Tây Ninh", desc: "Đông Nam Bộ • Đất phù sa cổ • Mãng cầu dai, Bưởi" },
  { name: "Cư M'gar, Đắk Lắk", desc: "Tây Nguyên • Đất đỏ Bazan • Sầu riêng, Cà phê" },
  { name: "Cái Bè, Tiền Giang", desc: "ĐBSCL • Phù sa ngọt • Sầu riêng, Mít" },
  { name: "Long Khánh, Đồng Nai", desc: "Đông Nam Bộ • Chôm chôm, Măng cụt" },
  { name: "Lạc Dương, Lâm Đồng", desc: "Cao nguyên • Rau củ quả công nghệ cao" }
];

export const WeatherForecastView: React.FC<WeatherForecastViewProps> = ({
  garden,
  onAddTaskFromWeather,
  onNavigateToCarePlan,
  onUpdateLocation,
}) => {
  const [locationQuery, setLocationQuery] = useState(garden.location);
  const [loading, setLoading] = useState(false);
  const [isDetectingGps, setIsDetectingGps] = useState(false);
  const [forecastData, setForecastData] = useState<RealtimeWeatherForecastData | null>(null);
  const [selectedDay, setSelectedDay] = useState<DailyForecast | null>(null);
  const [addedTasks, setAddedTasks] = useState<Record<string, boolean>>({});
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);

  // Trigger GPS detection directly from weather view
  const handleDetectGps = () => {
    if (typeof window !== "undefined" && "geolocation" in navigator) {
      setIsDetectingGps(true);
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            const { latitude, longitude } = position.coords;
            const res = await fetch("/api/detect-location-weather", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ lat: latitude, lon: longitude })
            });
            const data = await res.json();
            if (data.success && data.locationName) {
              setLocationQuery(data.locationName);
              fetchWeatherForecast(data.locationName);
              if (onUpdateLocation) {
                onUpdateLocation(data.locationName, data.current);
              }
              setFeedbackMessage(`Đã xác định vị trí hiện tại: ${data.locationName}`);
              setTimeout(() => setFeedbackMessage(null), 3000);
            }
          } catch (e) {
            console.error("GPS detection error in weather view:", e);
          } finally {
            setIsDetectingGps(false);
          }
        },
        (err) => {
          console.warn("GPS error:", err);
          setIsDetectingGps(false);
          setFeedbackMessage("Không thể truy cập GPS, vui lòng cho phép quyền vị trí trên trình duyệt.");
          setTimeout(() => setFeedbackMessage(null), 4000);
        },
        { timeout: 8000, enableHighAccuracy: true }
      );
    }
  };

  // Fetch meteorological data using Search Grounding
  const fetchWeatherForecast = async (loc?: string) => {
    const query = loc || locationQuery || garden.location;
    setLoading(true);
    try {
      const res = await fetch("/api/weather-forecast", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          location: query,
          gardenInfo: {
            name: garden.name,
            location: query,
            soilType: garden.soilType,
            irrigationType: garden.irrigationType,
            cultivationStandard: garden.cultivationStandard
          },
          plots: garden.plots.map(p => ({
            name: p.name,
            cropName: p.cropName,
            variety: p.variety,
            stage: p.stage,
            healthScore: p.healthScore
          }))
        })
      });

      const json = await res.json();
      if (json.success && json.data) {
        setForecastData(json.data);
        if (json.data.dailyForecasts?.length > 0) {
          setSelectedDay(json.data.dailyForecasts[0]);
        }
      }
    } catch (err) {
      console.error("Fetch weather forecast error:", err);
    } finally {
      setLoading(false);
    }
  };

  // Initial load
  useEffect(() => {
    fetchWeatherForecast(garden.location);
    setLocationQuery(garden.location);
  }, [garden.id, garden.location]);

  // Handle adding risk prevention task directly to the Care Plan
  const handleAddRiskToPlan = (alert: CropRiskAlert) => {
    if (!onAddTaskFromWeather) return;

    const newTask: CareTask = {
      id: `task-weather-${Date.now()}-${alert.id}`,
      farmId: garden.id,
      plotId: garden.plots[0]?.id || "plot-all",
      date: new Date().toISOString().slice(0, 10),
      title: `[Cảnh báo thời tiết] ${alert.title}`,
      category: alert.category === "fungal" || alert.category === "pest" ? "pest_control" : alert.category === "waterlogging" ? "soil_care" : "irrigation",
      timeOfDay: alert.sprayWindowAdvice?.recommendedTime || "Sáng sớm (06:00 - 08:00)",
      instructions: alert.preventativeActions?.[0] || alert.description,
      dosage: alert.recommendedProducts?.join(", ") || "Xem chi tiết khuyến cáo",
      priority: alert.severity === "high" || alert.severity === "critical" ? "high" : "medium",
      isCompleted: false
    };

    onAddTaskFromWeather(newTask);
    setAddedTasks(prev => ({ ...prev, [alert.id]: true }));
    setFeedbackMessage(`Đã thêm nhiệm vụ "${alert.title}" vào Lịch Chăm Sóc!`);
    setTimeout(() => setFeedbackMessage(null), 3500);
  };

  const getWeatherIcon = (type: string, className = "w-6 h-6") => {
    switch (type) {
      case "sunny":
        return <Sun className={`${className} text-amber-500`} />;
      case "partly-cloudy":
        return <CloudSun className={`${className} text-amber-400`} />;
      case "cloudy":
        return <Cloud className={`${className} text-slate-400`} />;
      case "rain":
        return <CloudRain className={`${className} text-cyan-500`} />;
      case "heavy-rain":
        return <CloudDrizzle className={`${className} text-blue-600`} />;
      case "thunderstorm":
        return <CloudLightning className={`${className} text-purple-600`} />;
      default:
        return <CloudSun className={`${className} text-amber-400`} />;
    }
  };

  const current = forecastData?.current;

  return (
    <div className="space-y-6 pb-12">
      {/* Toast Feedback Notification */}
      {feedbackMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#1E3F1A] text-white px-5 py-3 rounded-2xl shadow-2xl border border-emerald-400/30 flex items-center gap-3 animate-in fade-in slide-in-from-bottom-5">
          <CheckCircle2 className="w-5 h-5 text-[#A3D99E]" />
          <span className="text-xs sm:text-sm font-semibold">{feedbackMessage}</span>
        </div>
      )}

      {/* Top Banner: Search Grounding Realtime Meteorological Tile */}
      <div className="bg-[#1E3F1A] rounded-3xl text-white p-6 sm:p-8 border border-[#2D5A27] shadow-[0_10px_30px_-10px_rgba(30,63,26,0.4)] space-y-6">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#2D5A27] text-[#A3D99E] text-xs font-bold border border-emerald-400/20">
              <Sparkles className="w-3.5 h-3.5 text-[#A3D99E] animate-pulse" />
              <span>Google Search Grounding Khí Tượng Thời Gian Thực</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white flex items-center gap-2.5">
              Dự Báo Thời Tiết & Rủi Ro Cây Trồng
            </h1>
            <p className="text-[#D1E7D1] text-xs sm:text-sm leading-relaxed">
              Truy vấn dữ liệu khí tượng thực tế và phân tích nguy cơ sâu bệnh, úng ngập, cháy lá cho vườn <strong className="text-white">{garden.name}</strong> ({forecastData?.resolvedAddress || garden.location}) trên nền đất <strong className="text-amber-200">{garden.soilType}</strong>.
            </p>
          </div>

          {/* Quick Stats & Refresh Button */}
          <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
            <button
              id="refresh-weather-btn"
              type="button"
              onClick={() => fetchWeatherForecast()}
              disabled={loading}
              className="px-4 py-3 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-bold text-xs sm:text-sm rounded-2xl shadow-lg shadow-amber-950/20 flex items-center justify-center gap-2 transition transform active:scale-95 disabled:opacity-50 cursor-pointer"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
              <span>{loading ? "Đang Quét Dữ Liệu..." : "Cập Nhật Thời Tiết Thực"}</span>
            </button>

            {onNavigateToCarePlan && (
              <button
                type="button"
                onClick={onNavigateToCarePlan}
                className="px-4 py-3 bg-[#2D5A27] hover:bg-[#386b31] text-white font-semibold text-xs sm:text-sm rounded-2xl border border-emerald-400/30 shadow-sm flex items-center justify-center gap-2 transition cursor-pointer"
              >
                <Calendar className="w-4 h-4 text-[#A3D99E]" />
                <span>Xem Lịch Canh Tác</span>
              </button>
            )}
          </div>
        </div>

        {/* Location Search Bar & Quick Region Selector */}
        <div className="pt-4 border-t border-[#2D5A27] space-y-3">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              fetchWeatherForecast(locationQuery);
            }}
            className="flex flex-col sm:flex-row gap-2 max-w-2xl"
          >
            <div className="relative flex-1">
              <MapPin className="w-4 h-4 text-[#A3D99E] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={locationQuery}
                onChange={(e) => setLocationQuery(e.target.value)}
                placeholder="Nhập địa điểm vườn hoặc dùng nút GPS bên cạnh..."
                className="w-full pl-10 pr-4 py-2.5 bg-[#162e13] border border-[#2D5A27] text-white placeholder-emerald-200/50 rounded-2xl text-xs sm:text-sm outline-none focus:ring-2 focus:ring-[#A3D99E]"
              />
            </div>
            
            {/* Direct GPS Button */}
            <button
              type="button"
              onClick={handleDetectGps}
              disabled={isDetectingGps}
              title="Định vị tọa độ hiện tại bằng GPS"
              className="px-3.5 py-2.5 bg-[#2D5A27] hover:bg-[#386b31] text-[#A3D99E] hover:text-white font-bold text-xs sm:text-sm rounded-2xl border border-emerald-400/30 transition flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50 shrink-0"
            >
              <MapPin className={`w-4 h-4 ${isDetectingGps ? "animate-spin text-amber-300" : "text-emerald-400"}`} />
              <span>{isDetectingGps ? "Đang dò GPS..." : "Dùng Vị Trí Hiện Tại"}</span>
            </button>

            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2.5 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-bold text-xs sm:text-sm rounded-2xl shadow-sm transition flex items-center justify-center gap-1.5 cursor-pointer shrink-0"
            >
              <Search className="w-4 h-4" />
              <span>Tra Cứu</span>
            </button>
          </form>

          {/* Preset Regions */}
          <div className="flex flex-wrap items-center gap-1.5 text-xs">
            <span className="text-[#A3D99E] text-[11px] font-semibold mr-1">Vùng trọng điểm:</span>
            {REGION_QUICK_SEARCH.map((reg) => (
              <button
                key={reg.name}
                type="button"
                onClick={() => {
                  setLocationQuery(reg.name);
                  fetchWeatherForecast(reg.name);
                }}
                className="px-2.5 py-1 bg-[#162e13] hover:bg-[#2D5A27] text-[#D1E7D1] hover:text-white rounded-xl border border-[#2D5A27] text-[11px] font-medium transition cursor-pointer"
              >
                {reg.name}
              </button>
            ))}
          </div>

          {/* Sync Timestamp & Grounding Badge */}
          <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] text-[#A3D99E] pt-2">
            <div className="flex items-center gap-2">
              <Clock className="w-3.5 h-3.5" />
              <span>Dữ liệu khí tượng cập nhật lúc: <strong>{forecastData?.fetchedAt || "Mới nhất"}</strong></span>
            </div>
            <div className="flex items-center gap-1.5 text-amber-200">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Tìm kiếm đối soát qua Google Search Grounding</span>
            </div>
          </div>
        </div>
      </div>

      {/* Loading Skeleton */}
      {loading && !forecastData && (
        <div className="bg-white rounded-3xl p-12 border border-[#E2ECE2] text-center space-y-4 shadow-sm">
          <div className="w-10 h-10 border-4 border-[#2D5A27] border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="font-bold text-slate-800 text-sm">Đang kết nối Google Search Grounding & phân tích mô hình vi khí hậu cho vườn...</p>
          <p className="text-xs text-[#527050]">Đang thu thập lượng mưa, áp suất, độ ẩm và đối soát nguy cơ sâu bệnh...</p>
        </div>
      )}

      {/* Main Meteorological Content Bento Grid */}
      {forecastData && (
        <>
          {/* Bento Row 1: Real-time Live Weather Station Metrics */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Main Current Hero Card */}
            <div className="bg-white rounded-3xl p-6 border border-[#E2ECE2] shadow-[0_4px_20px_-4px_rgba(45,90,39,0.06)] flex flex-col justify-between hover:border-[#2D5A27]/40 transition">
              <div>
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-[#527050]">
                      Thời tiết hiện tại
                    </span>
                    <h3 className="text-base font-extrabold text-slate-900 mt-0.5 flex items-center gap-1.5">
                      <MapPin className="w-4 h-4 text-[#2D5A27]" />
                      {forecastData.location}
                    </h3>
                  </div>
                  <div className="p-3 bg-[#E8F3E8] rounded-2xl">
                    <CloudSun className="w-7 h-7 text-[#2D5A27]" />
                  </div>
                </div>

                <div className="mt-5 flex items-baseline gap-4">
                  <span className="text-5xl font-black text-slate-900 tracking-tight">
                    {current?.tempC || 28}°C
                  </span>
                  <div className="space-y-0.5">
                    <span className="text-xs text-slate-500 block">
                      Cảm nhận như <strong>{current?.feelsLikeC || 31}°C</strong>
                    </span>
                    <span className="text-xs font-bold text-[#2D5A27] bg-[#E8F3E8] px-2.5 py-0.5 rounded-full inline-block border border-emerald-200">
                      {current?.condition || "Mây thay đổi"}
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-[#F0F5F0] space-y-2">
                <div className="text-xs text-slate-700 leading-relaxed font-medium">
                  {forecastData.overallAgriculturalSummary}
                </div>
              </div>
            </div>

            {/* Micro-climate Gauges Grid (2 cols) */}
            <div className="lg:col-span-2 grid grid-cols-2 sm:grid-cols-3 gap-3.5">
              
              {/* Humidity */}
              <div className="bg-white rounded-3xl p-4.5 border border-[#E2ECE2] shadow-[0_4px_20px_-4px_rgba(45,90,39,0.06)] flex flex-col justify-between">
                <div className="flex items-center justify-between text-xs text-[#527050] font-semibold">
                  <span>Độ Ẩm Không Khí</span>
                  <Droplets className="w-4 h-4 text-cyan-600" />
                </div>
                <div className="mt-2">
                  <span className="text-2xl font-black text-cyan-900">
                    {current?.humidityPct || 84}%
                  </span>
                  <p className="text-[11px] text-slate-500 mt-1">
                    {(current?.humidityPct || 84) > 80 ? "Ẩm cao • Dễ bùng nấm bệnh" : "Độ ẩm lý tưởng cho đọt non"}
                  </p>
                </div>
                <div className="w-full bg-[#F0F5F0] h-1.5 rounded-full mt-2 overflow-hidden">
                  <div className="bg-cyan-600 h-full rounded-full" style={{ width: `${current?.humidityPct || 84}%` }} />
                </div>
              </div>

              {/* Rain Chance & Precipitation */}
              <div className="bg-white rounded-3xl p-4.5 border border-[#E2ECE2] shadow-[0_4px_20px_-4px_rgba(45,90,39,0.06)] flex flex-col justify-between">
                <div className="flex items-center justify-between text-xs text-[#527050] font-semibold">
                  <span>Xác Suất Mưa</span>
                  <CloudRain className="w-4 h-4 text-blue-600" />
                </div>
                <div className="mt-2">
                  <span className="text-2xl font-black text-blue-900">
                    {current?.rainChancePct || 65}%
                  </span>
                  <p className="text-[11px] text-slate-500 mt-1">
                    Lượng mưa ước tính: <strong>{current?.rainfallMm || 15} mm</strong>
                  </p>
                </div>
                <div className="w-full bg-[#F0F5F0] h-1.5 rounded-full mt-2 overflow-hidden">
                  <div className="bg-blue-600 h-full rounded-full" style={{ width: `${current?.rainChancePct || 65}%` }} />
                </div>
              </div>

              {/* Wind Speed & Direction */}
              <div className="bg-white rounded-3xl p-4.5 border border-[#E2ECE2] shadow-[0_4px_20px_-4px_rgba(45,90,39,0.06)] flex flex-col justify-between">
                <div className="flex items-center justify-between text-xs text-[#527050] font-semibold">
                  <span>Gió & Hướng</span>
                  <Wind className="w-4 h-4 text-teal-600" />
                </div>
                <div className="mt-2">
                  <span className="text-2xl font-black text-teal-900">
                    {current?.windSpeedKmh || 12} <span className="text-xs font-normal">km/h</span>
                  </span>
                  <p className="text-[11px] text-slate-500 mt-1">
                    Hướng: <strong>{current?.windDirection || "Tây Nam"}</strong>
                  </p>
                </div>
                <div className="text-[10px] text-teal-700 font-semibold mt-1">
                  {(current?.windSpeedKmh || 12) < 15 ? "Gió nhẹ • Phun thuốc tốt" : "Gió mạnh • Dễ trôi thuốc"}
                </div>
              </div>

              {/* UV Index */}
              <div className="bg-white rounded-3xl p-4.5 border border-[#E2ECE2] shadow-[0_4px_20px_-4px_rgba(45,90,39,0.06)] flex flex-col justify-between">
                <div className="flex items-center justify-between text-xs text-[#527050] font-semibold">
                  <span>Chỉ Số UV Nắng</span>
                  <Sun className="w-4 h-4 text-amber-600" />
                </div>
                <div className="mt-2">
                  <span className="text-2xl font-black text-amber-900">
                    {current?.uvIndex || 7} <span className="text-xs font-normal">/12</span>
                  </span>
                  <p className="text-[11px] text-slate-500 mt-1">
                    {(current?.uvIndex || 7) >= 8 ? "Bức xạ cao • Chú ý cháy lá" : "Bức xạ vừa • Thuận lợi"}
                  </p>
                </div>
                <div className="w-full bg-[#F0F5F0] h-1.5 rounded-full mt-2 overflow-hidden">
                  <div className="bg-amber-500 h-full rounded-full" style={{ width: `${((current?.uvIndex || 7) / 12) * 100}%` }} />
                </div>
              </div>

              {/* Soil Impact Guidance */}
              <div className="bg-white rounded-3xl p-4.5 border border-[#E2ECE2] shadow-[0_4px_20px_-4px_rgba(45,90,39,0.06)] flex flex-col justify-between col-span-2 sm:col-span-2">
                <div className="flex items-center justify-between text-xs text-[#527050] font-semibold">
                  <span>Thổ Nhưỡng ({garden.soilType.split(" ")[0]} {garden.soilType.split(" ")[1]})</span>
                  <FlaskConical className="w-4 h-4 text-[#2D5A27]" />
                </div>
                <p className="text-xs text-slate-700 mt-2 line-clamp-2">
                  {forecastData.soilImpactAssessment}
                </p>
                <div className="text-[11px] font-semibold text-[#2D5A27] bg-[#E8F3E8] p-2 rounded-xl border border-emerald-100 mt-2">
                  {forecastData.irrigationRecommendation}
                </div>
              </div>
            </div>
          </div>

          {/* Bento Row 2: 7-Day Interactive Meteorological & Risk Trend */}
          <div className="bg-white rounded-3xl p-6 border border-[#E2ECE2] shadow-[0_4px_20px_-4px_rgba(45,90,39,0.06)] space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
              <div>
                <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-[#2D5A27]" />
                  <span>Dự Báo Khí Tượng 7 Ngày Tới & Điểm Rủi Ro Nông Vụ</span>
                </h2>
                <p className="text-xs text-[#527050]">
                  Nhấp vào từng ngày để xem chi tiết khuyến cáo canh tác và phòng trừ rủi ro
                </p>
              </div>
              <span className="text-xs font-semibold text-[#2D5A27] bg-[#E8F3E8] px-3 py-1 rounded-full border border-emerald-200">
                7 Ngày Chu Kỳ Canh Tác
              </span>
            </div>

            {/* 7-Day Card Slider / Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3 pt-2">
              {forecastData.dailyForecasts?.map((day, idx) => {
                const isSelected = selectedDay?.date === day.date;
                return (
                  <button
                    key={day.date || idx}
                    type="button"
                    onClick={() => setSelectedDay(day)}
                    className={`p-3.5 rounded-2xl border text-left transition flex flex-col justify-between gap-3 cursor-pointer ${
                      isSelected
                        ? "bg-[#E8F3E8] border-[#2D5A27] shadow-md ring-2 ring-[#2D5A27]/20"
                        : "bg-[#F9FBF9] border-[#E2ECE2] hover:bg-white hover:border-[#2D5A27]/40 hover:shadow-sm"
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-xs text-slate-900">{day.dayName}</span>
                        <span className="text-[10px] text-slate-400">
                          {day.date.slice(5).replace("-", "/")}
                        </span>
                      </div>

                      <div className="my-2.5 flex items-center justify-center py-1">
                        {getWeatherIcon(day.iconType, "w-8 h-8")}
                      </div>

                      <div className="text-center">
                        <span className="text-sm font-extrabold text-slate-900">
                          {day.tempMax}°
                        </span>
                        <span className="text-xs text-slate-400 ml-1">
                          / {day.tempMin}°
                        </span>
                      </div>
                    </div>

                    <div className="space-y-1.5 pt-2 border-t border-[#E2ECE2]/60">
                      <div className="flex items-center justify-between text-[11px] text-blue-700">
                        <span className="flex items-center gap-1">
                          <Droplets className="w-3 h-3 text-blue-500" /> Mưa:
                        </span>
                        <strong>{day.rainChance}%</strong>
                      </div>

                      <div className="text-center">
                        <span
                          className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase block ${
                            day.cropRiskLevel === "critical"
                              ? "bg-rose-100 text-rose-800 border border-rose-200"
                              : day.cropRiskLevel === "high"
                              ? "bg-amber-100 text-amber-800 border border-amber-200"
                              : day.cropRiskLevel === "medium"
                              ? "bg-yellow-100 text-yellow-800 border border-yellow-200"
                              : "bg-[#E8F3E8] text-[#2D5A27] border border-emerald-200"
                          }`}
                        >
                          {day.cropRiskLevel === "critical"
                            ? "Báo Động"
                            : day.cropRiskLevel === "high"
                            ? "Rủi ro cao"
                            : day.cropRiskLevel === "medium"
                            ? "Theo dõi"
                            : "An toàn"}
                        </span>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Selected Day Expanded Details Box */}
            {selectedDay && (
              <div className="mt-4 p-4.5 bg-[#F4F9F4] rounded-2xl border border-emerald-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-start gap-3.5">
                  <div className="p-3 bg-white rounded-2xl border border-emerald-200 shadow-sm">
                    {getWeatherIcon(selectedDay.iconType, "w-6 h-6")}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-bold text-[#1E3F1A]">
                        Chi Tiết Nông Vụ: {selectedDay.dayName} ({selectedDay.date})
                      </h4>
                      <span className="text-xs text-[#2D5A27] font-semibold">
                        {selectedDay.condition}
                      </span>
                    </div>
                    <p className="text-xs text-slate-700 mt-1 leading-relaxed">
                      {selectedDay.riskSummary}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4 text-xs font-semibold shrink-0 bg-white p-3 rounded-xl border border-emerald-200 shadow-sm">
                  <div>
                    <span className="text-slate-400 text-[10px] block">Nhiệt độ:</span>
                    <span className="text-slate-800">{selectedDay.tempMin}°C - {selectedDay.tempMax}°C</span>
                  </div>
                  <div className="w-px h-6 bg-slate-200" />
                  <div>
                    <span className="text-slate-400 text-[10px] block">Độ ẩm:</span>
                    <span className="text-cyan-700">{selectedDay.humidity}%</span>
                  </div>
                  <div className="w-px h-6 bg-slate-200" />
                  <div>
                    <span className="text-slate-400 text-[10px] block">Lượng mưa:</span>
                    <span className="text-blue-700">{selectedDay.rainfallMm || 0} mm</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Bento Row 3: Actionable Crop Risk Preparation Alerts */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <ShieldAlert className="w-5 h-5 text-[#2D5A27]" />
                  <span>Cảnh Báo & Chuẩn Bị Phòng Ngừa Rủi Ro Cây Trồng</span>
                </h2>
                <p className="text-xs text-[#527050]">
                  Phác đồ bảo vệ cây trồng cá nhân hoá dựa trên dữ liệu khí tượng thực tế
                </p>
              </div>
              <span className="text-xs text-slate-500 font-medium">
                {forecastData.cropRiskAlerts?.length || 0} Cảnh báo quan trọng
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {forecastData.cropRiskAlerts?.map((alert) => {
                const isTaskAdded = addedTasks[alert.id];

                return (
                  <div
                    key={alert.id}
                    className="bg-white rounded-3xl p-5 border border-[#E2ECE2] shadow-[0_4px_20px_-4px_rgba(45,90,39,0.06)] flex flex-col justify-between space-y-4 hover:border-[#2D5A27]/40 transition"
                  >
                    <div className="space-y-3">
                      {/* Header Badge & Title */}
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <span
                            className={`p-2 rounded-xl ${
                              alert.severity === "high" || alert.severity === "critical"
                                ? "bg-rose-100 text-rose-700"
                                : "bg-amber-100 text-amber-700"
                            }`}
                          >
                            <AlertTriangle className="w-4 h-4" />
                          </span>
                          <span
                            className={`text-[10px] px-2.5 py-0.5 rounded-full font-extrabold uppercase ${
                              alert.severity === "high" || alert.severity === "critical"
                                ? "bg-rose-100 text-rose-800"
                                : "bg-amber-100 text-amber-800"
                            }`}
                          >
                            {alert.severity === "high" || alert.severity === "critical" ? "Nguy cơ cao" : "Nguy cơ vừa"}
                          </span>
                        </div>
                      </div>

                      <h3 className="font-bold text-sm text-slate-900 line-clamp-2">
                        {alert.title}
                      </h3>

                      {/* Trigger Condition */}
                      <div className="text-[11px] text-amber-800 bg-amber-50 p-2.5 rounded-xl border border-amber-200/60 font-medium">
                        <strong>Tác nhân kích hoạt:</strong> {alert.triggerCondition}
                      </div>

                      {/* Description */}
                      <p className="text-xs text-slate-600 leading-relaxed">
                        {alert.description}
                      </p>

                      {/* Preventative Action Checklist */}
                      <div className="space-y-1.5 pt-2 border-t border-[#F0F5F0]">
                        <span className="text-[11px] font-bold text-[#2D5A27] uppercase tracking-wider block">
                          Biện pháp chuẩn bị:
                        </span>
                        {alert.preventativeActions?.slice(0, 3).map((act, i) => (
                          <div key={i} className="flex items-start gap-1.5 text-xs text-slate-700">
                            <Check className="w-3.5 h-3.5 text-[#2D5A27] shrink-0 mt-0.5" />
                            <span>{act}</span>
                          </div>
                        ))}
                      </div>

                      {/* Spray Window Guidance */}
                      {alert.sprayWindowAdvice && (
                        <div className="p-2.5 rounded-xl bg-[#F4F9F4] border border-emerald-200 text-xs space-y-1">
                          <div className="flex items-center gap-1.5 font-bold text-[#1E3F1A]">
                            <Clock className="w-3.5 h-3.5 text-[#2D5A27]" />
                            <span>Khung giờ vàng phun thuốc:</span>
                          </div>
                          <p className="text-[#2D5A27] font-semibold">
                            {alert.sprayWindowAdvice.recommendedTime}
                          </p>
                          <p className="text-[11px] text-slate-500">
                            {alert.sprayWindowAdvice.notes}
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Bottom Action Button */}
                    <div className="pt-3 border-t border-[#F0F5F0]">
                      <button
                        type="button"
                        onClick={() => handleAddRiskToPlan(alert)}
                        disabled={isTaskAdded}
                        className={`w-full py-2.5 px-3 rounded-2xl text-xs font-bold flex items-center justify-center gap-1.5 transition cursor-pointer ${
                          isTaskAdded
                            ? "bg-[#E8F3E8] text-[#2D5A27] border border-emerald-200"
                            : "bg-[#2D5A27] hover:bg-[#1E3F1A] text-white shadow-sm"
                        }`}
                      >
                        {isTaskAdded ? (
                          <>
                            <CheckCircle2 className="w-4 h-4 text-[#2D5A27]" />
                            <span>Đã Thêm Vào Lịch Chăm Sóc</span>
                          </>
                        ) : (
                          <>
                            <Calendar className="w-4 h-4 text-[#A3D99E]" />
                            <span>Lên Lịch Phòng Trị Trong Phác Đồ</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Bento Row 4: Google Search Grounding Sources & Web Citations */}
          <div className="bg-white rounded-3xl p-6 border border-[#E2ECE2] shadow-[0_4px_20px_-4px_rgba(45,90,39,0.06)] space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-500" />
                <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                  Nguồn Dữ Liệu Khí Tượng Được Tìm Kiếm (Search Grounding Sources)
                </h3>
              </div>
              <span className="text-[11px] text-[#739270]">
                {forecastData.groundingSources?.length || 0} nguồn xác thực
              </span>
            </div>

            <p className="text-xs text-slate-500">
              Dữ liệu khí tượng thời gian thực được Gemini 3.7 Flash tra cứu trực tiếp qua Google Search từ các trung tâm dự báo khí tượng và nông nghiệp:
            </p>

            <div className="flex flex-wrap gap-2 pt-1">
              {forecastData.groundingSources?.map((src, idx) => (
                <a
                  key={idx}
                  href={src.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#F9FBF9] hover:bg-[#E8F3E8] border border-[#E2ECE2] hover:border-[#2D5A27] text-xs font-semibold text-slate-700 hover:text-[#2D5A27] transition"
                >
                  <span>{src.title}</span>
                  <ExternalLink className="w-3 h-3 text-slate-400" />
                </a>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};
