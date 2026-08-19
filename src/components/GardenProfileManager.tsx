import React, { useState, useEffect } from "react";
import { 
  Layers, 
  Plus, 
  MapPin, 
  Phone, 
  User, 
  Sparkles, 
  Trash2, 
  Edit3, 
  Check, 
  Activity, 
  Droplets, 
  FlaskConical, 
  ShieldCheck,
  Trees,
  Sprout,
  Building2,
  Search,
  Filter,
  ArrowRight,
  BarChart3,
  Calendar,
  AlertCircle
} from "lucide-react";
import { 
  GardenProfile, 
  GardenPlot, 
  SoilType, 
  IrrigationType, 
  CultivationStandard, 
  GrowthStage 
} from "../types";

interface GardenProfileManagerProps {
  gardens: GardenProfile[];
  activeGardenId: string;
  onSelectGarden: (id: string) => void;
  onAddGarden: (garden: GardenProfile) => void;
  onUpdateGarden: (updated: GardenProfile) => void;
  onDeleteGarden: (id: string) => void;
  onOpenAddGardenModal: () => void;
}

const SOIL_OPTIONS: SoilType[] = [
  "Đất đỏ Bazan Đông Nam Bộ / Bình Phước",
  "Đất đỏ Bazan Tây Nguyên",
  "Đất phù sa ngọt sông Tiền/sông Hậu",
  "Đất phù sa cổ / Đất xám bạc màu",
  "Đất thịt nhẹ pha cát ven biển",
  "Đất sét pha thịt giữ nước",
  "Đất mùn đồi núi dốc / Cao nguyên",
  "Đất phèn nhẹ đã cải tạo"
];

const IRRIGATION_OPTIONS: IrrigationType[] = [
  "Tưới nhỏ giọt bù áp Israel",
  "Tưới phun mưa cục bộ dưới gốc",
  "Tưới phun sương tự động nhà màng",
  "Tưới tràn rãnh mương truyền thống",
  "Tưới bán tự động dây kéo tay"
];

const STANDARD_OPTIONS: CultivationStandard[] = [
  "VietGAP (Nông nghiệp sạch)",
  "GlobalGAP (Xuất khẩu quốc tế)",
  "Hữu cơ Sinh học (Organic 100%)",
  "Hướng hữu cơ / An toàn sinh học",
  "Canh tác truyền thống cải tiến"
];

const STAGE_OPTIONS: GrowthStage[] = [
  "Kiến thiết cơ bản (Cây con 1-2 năm)",
  "Phát triển thân lá / Làm cơi đọt",
  "Phân hoá mầm hoa / Xử lý ra hoa",
  "Nở hoa & Đậu trái non",
  "Nuôi trái / Định hình phẩm chất",
  "Trước thu hoạch 15-30 ngày",
  "Phục hồi cây sau thu hoạch"
];

export const GardenProfileManager: React.FC<GardenProfileManagerProps> = ({
  gardens,
  activeGardenId,
  onSelectGarden,
  onAddGarden,
  onUpdateGarden,
  onDeleteGarden,
  onOpenAddGardenModal,
}) => {
  const currentGarden = gardens.find((g) => g.id === activeGardenId) || gardens[0] || {} as GardenProfile;

  // Filter states for Garden List
  const [selectedRegionFilter, setSelectedRegionFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Edit Selected Garden Profile State
  const [isEditingInfo, setIsEditingInfo] = useState(false);
  const [name, setName] = useState(currentGarden.name || "");
  const [region, setRegion] = useState(currentGarden.region || "Khu Vực Bình Phước");
  const [ownerName, setOwnerName] = useState(currentGarden.ownerName || "");
  const [phone, setPhone] = useState(currentGarden.phone || "");
  const [location, setLocation] = useState(currentGarden.location || "");
  const [farmCode, setFarmCode] = useState(currentGarden.farmCode || "");
  const [totalAreaHa, setTotalAreaHa] = useState(currentGarden.totalAreaHa || 1);
  const [soilType, setSoilType] = useState<SoilType>(currentGarden.soilType || SOIL_OPTIONS[0]);
  const [soilPH, setSoilPH] = useState(currentGarden.soilPH || 5.8);
  const [irrigationType, setIrrigationType] = useState<IrrigationType>(currentGarden.irrigationType || IRRIGATION_OPTIONS[0]);
  const [cultivationStandard, setCultivationStandard] = useState<CultivationStandard>(currentGarden.cultivationStandard || STANDARD_OPTIONS[0]);
  const [notes, setNotes] = useState(currentGarden.notes || "");

  // Update local form when currentGarden changes
  useEffect(() => {
    if (currentGarden) {
      setName(currentGarden.name || "");
      setRegion(currentGarden.region || "Khu Vực Bình Phước");
      setOwnerName(currentGarden.ownerName || "");
      setPhone(currentGarden.phone || "");
      setLocation(currentGarden.location || "");
      setFarmCode(currentGarden.farmCode || "");
      setTotalAreaHa(currentGarden.totalAreaHa || 1);
      setSoilType(currentGarden.soilType || SOIL_OPTIONS[0]);
      setSoilPH(currentGarden.soilPH || 5.8);
      setIrrigationType(currentGarden.irrigationType || IRRIGATION_OPTIONS[0]);
      setCultivationStandard(currentGarden.cultivationStandard || STANDARD_OPTIONS[0]);
      setNotes(currentGarden.notes || "");
      setIsEditingInfo(false);
    }
  }, [currentGarden.id]);

  // Plots Modal State
  const [showAddPlotModal, setShowAddPlotModal] = useState(false);
  const [plotName, setPlotName] = useState("");
  const [cropName, setCropName] = useState("");
  const [variety, setVariety] = useState("");
  const [treeCount, setTreeCount] = useState(100);
  const [plantedYear, setPlantedYear] = useState(2022);
  const [treeAgeYears, setTreeAgeYears] = useState(4);
  const [stage, setStage] = useState<GrowthStage>("Phát triển thân lá / Làm cơi đọt");
  const [areaM2, setAreaM2] = useState(5000);
  const [healthScore, setHealthScore] = useState(90);

  // Computed regions list
  const availableRegions = Array.from(new Set(gardens.map((g) => g.region || "Khu Vực Khác")));

  // Filtered gardens
  const filteredGardens = gardens.filter((g) => {
    const matchRegion = selectedRegionFilter === "all" || g.region === selectedRegionFilter;
    const matchSearch =
      searchQuery.trim() === "" ||
      g.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      g.ownerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (g.region && g.region.toLowerCase().includes(searchQuery.toLowerCase())) ||
      g.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (g.farmCode && g.farmCode.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchRegion && matchSearch;
  });

  // Aggregated Stats
  const totalAreaAll = gardens.reduce((sum, g) => sum + (g.totalAreaHa || 0), 0);
  const totalPlotsAll = gardens.reduce((sum, g) => sum + (g.plots?.length || 0), 0);
  const totalTreesAll = gardens.reduce(
    (sum, g) => sum + (g.plots?.reduce((pSum, p) => pSum + (p.treeCount || 0), 0) || 0),
    0
  );
  const uniqueOwnersCount = new Set(gardens.map((g) => g.ownerName.toLowerCase())).size;

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    const updated: GardenProfile = {
      ...currentGarden,
      name,
      region,
      ownerName,
      phone,
      location,
      farmCode: farmCode.trim() || undefined,
      totalAreaHa: Number(totalAreaHa),
      soilType,
      soilPH: Number(soilPH),
      irrigationType,
      cultivationStandard,
      notes
    };
    onUpdateGarden(updated);
    setIsEditingInfo(false);
  };

  const handleAddPlot = (e: React.FormEvent) => {
    e.preventDefault();
    if (!plotName.trim() || !cropName.trim()) return;

    const newPlot: GardenPlot = {
      id: `plot-${Date.now()}`,
      name: plotName,
      cropName,
      variety: variety || "Chuẩn địa phương",
      treeCount: Number(treeCount),
      plantedYear: Number(plantedYear),
      treeAgeYears: Number(treeAgeYears),
      stage,
      areaM2: Number(areaM2),
      healthScore: Number(healthScore),
      lastInspectionDate: new Date().toISOString().slice(0, 10)
    };

    const updated: GardenProfile = {
      ...currentGarden,
      plots: [...currentGarden.plots, newPlot]
    };

    onUpdateGarden(updated);
    setShowAddPlotModal(false);
    setPlotName("");
    setCropName("");
    setVariety("");
  };

  const handleDeletePlot = (plotId: string) => {
    if (currentGarden.plots.length <= 1) {
      alert("Nhà vườn cần duy trì ít nhất 1 lô canh tác.");
      return;
    }
    const updated: GardenProfile = {
      ...currentGarden,
      plots: currentGarden.plots.filter((p) => p.id !== plotId)
    };
    onUpdateGarden(updated);
  };

  const handleUpdatePlotHealth = (plotId: string, newScore: number) => {
    const updated: GardenProfile = {
      ...currentGarden,
      plots: currentGarden.plots.map((p) => (p.id === plotId ? { ...p, healthScore: newScore } : p))
    };
    onUpdateGarden(updated);
  };

  return (
    <div className="space-y-8 pb-12">
      
      {/* 1. Header & Overview of Multi-Garden Network */}
      <div className="bg-gradient-to-br from-[#1E3F1A] to-[#142B12] text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-[#2D5A27] relative overflow-hidden">
        <div className="absolute right-0 top-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-800/60 border border-emerald-400/30 text-emerald-300 text-xs font-bold">
              <Building2 className="w-3.5 h-3.5" />
              <span>Hệ Thống Quản Lý Vùng Canh Tác & Hộ Nông Dân</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              Quản Lý Vườn Theo Khu Vực & Chủ Vườn
            </h1>
            <p className="text-emerald-200/80 text-xs sm:text-sm max-w-2xl">
              Phân loại danh mục nhà vườn theo tỉnh thành/vùng thổ nhưỡng, theo dõi chủ hộ và cá nhân hoá phác đồ nông học riêng biệt cho từng thửa đất.
            </p>
          </div>

          <button
            id="btn-add-new-garden"
            type="button"
            onClick={onOpenAddGardenModal}
            className="px-5 py-3 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white text-xs sm:text-sm font-bold rounded-2xl shadow-lg border border-emerald-400/40 flex items-center gap-2 transition-all cursor-pointer shrink-0 group"
          >
            <Plus className="w-4 h-4 group-hover:rotate-90 transition-transform duration-200" />
            <span>Thêm Nhà Vườn Mới</span>
          </button>
        </div>

        {/* Global Network Stats Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mt-6 pt-6 border-t border-emerald-800/60 text-xs">
          <div className="bg-white/5 border border-white/10 p-3 sm:p-4 rounded-2xl backdrop-blur-sm">
            <span className="text-emerald-300/80 block font-medium">Tổng Nhà Vườn</span>
            <div className="text-xl sm:text-2xl font-black text-white mt-0.5">
              {gardens.length} <span className="text-xs font-normal text-emerald-300">vườn</span>
            </div>
            <span className="text-[11px] text-emerald-200/60 mt-1 block">trên {availableRegions.length} khu vực</span>
          </div>

          <div className="bg-white/5 border border-white/10 p-3 sm:p-4 rounded-2xl backdrop-blur-sm">
            <span className="text-emerald-300/80 block font-medium">Chủ Hộ Liên Kết</span>
            <div className="text-xl sm:text-2xl font-black text-amber-300 mt-0.5">
              {uniqueOwnersCount} <span className="text-xs font-normal text-emerald-300">chủ hộ</span>
            </div>
            <span className="text-[11px] text-emerald-200/60 mt-1 block">hợp tác xã & nông hộ</span>
          </div>

          <div className="bg-white/5 border border-white/10 p-3 sm:p-4 rounded-2xl backdrop-blur-sm">
            <span className="text-emerald-300/80 block font-medium">Tổng Diện Tích</span>
            <div className="text-xl sm:text-2xl font-black text-white mt-0.5">
              {totalAreaAll.toFixed(1)} <span className="text-xs font-normal text-emerald-300">ha</span>
            </div>
            <span className="text-[11px] text-emerald-200/60 mt-1 block">khoảng {(totalAreaAll * 10000).toLocaleString("vi-VN")} m²</span>
          </div>

          <div className="bg-white/5 border border-white/10 p-3 sm:p-4 rounded-2xl backdrop-blur-sm">
            <span className="text-emerald-300/80 block font-medium">Quy Mô Cây Trồng</span>
            <div className="text-xl sm:text-2xl font-black text-cyan-300 mt-0.5">
              {totalTreesAll.toLocaleString("vi-VN")} <span className="text-xs font-normal text-emerald-300">cây</span>
            </div>
            <span className="text-[11px] text-emerald-200/60 mt-1 block">thuộc {totalPlotsAll} phân lô canh tác</span>
          </div>
        </div>
      </div>

      {/* 2. Region Tabs & Garden Cards Selection Matrix */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 flex items-center gap-2">
              <MapPin className="w-5 h-5 text-emerald-700" />
              <span>Danh Sách Vườn Phân Bổ Theo Khu Vực & Chủ Hộ</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Nhấp vào nhà vườn để chọn làm vườn làm việc hiện tại hoặc xem/sửa chi tiết.
            </p>
          </div>

          {/* Search Box */}
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tìm theo tên vườn, chủ hộ, MSVT..."
              className="w-full pl-9 pr-3 py-2 bg-white border border-slate-200 rounded-xl text-xs outline-none focus:ring-2 focus:ring-emerald-600 shadow-sm"
            />
          </div>
        </div>

        {/* Region Filter Badges */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
          <button
            type="button"
            onClick={() => setSelectedRegionFilter("all")}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
              selectedRegionFilter === "all"
                ? "bg-[#2D5A27] text-white shadow-sm"
                : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-100"
            }`}
          >
            <span>Tất Cả Khu Vực</span>
            <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${selectedRegionFilter === "all" ? "bg-white/20 text-white" : "bg-slate-100 text-slate-700"}`}>
              {gardens.length}
            </span>
          </button>

          {availableRegions.map((r) => {
            const count = gardens.filter((g) => g.region === r).length;
            const isSelected = selectedRegionFilter === r;
            return (
              <button
                key={r}
                type="button"
                onClick={() => setSelectedRegionFilter(r)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
                  isSelected
                    ? "bg-[#2D5A27] text-white shadow-sm"
                    : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-100"
                }`}
              >
                <span>📍 {r}</span>
                <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${isSelected ? "bg-white/20 text-white" : "bg-slate-100 text-slate-700"}`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Gardens Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredGardens.map((g) => {
            const isCurrent = g.id === currentGarden.id;
            const avgGardenHealth = Math.round(
              g.plots.reduce((sum, p) => sum + p.healthScore, 0) / (g.plots.length || 1)
            );

            return (
              <div
                key={g.id}
                className={`bg-white rounded-2xl p-5 border transition-all flex flex-col justify-between shadow-sm relative group ${
                  isCurrent
                    ? "border-emerald-600 ring-2 ring-emerald-500/30 bg-emerald-50/20"
                    : "border-[#E2ECE2] hover:border-emerald-400 hover:shadow-md"
                }`}
              >
                {/* Active Garden Badge */}
                {isCurrent && (
                  <div className="absolute top-4 right-4 bg-emerald-700 text-white text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 shadow-sm">
                    <Check className="w-3 h-3" />
                    <span>Đang Làm Việc</span>
                  </div>
                )}

                <div className="space-y-3">
                  {/* Region & FarmCode */}
                  <div className="flex items-center gap-2 flex-wrap pr-16">
                    <span className="px-2.5 py-0.5 bg-emerald-100 text-[#2D5A27] text-[11px] font-extrabold rounded-lg border border-emerald-200">
                      📍 {g.region || "Khu Vực"}
                    </span>
                    {g.farmCode && (
                      <span className="px-2 py-0.5 bg-slate-100 text-slate-600 text-[10px] font-mono rounded font-semibold">
                        MSVT: {g.farmCode}
                      </span>
                    )}
                  </div>

                  {/* Garden Name */}
                  <h3 className="text-base font-extrabold text-slate-900 group-hover:text-emerald-800 transition-colors">
                    {g.name}
                  </h3>

                  {/* Owner & Phone Details */}
                  <div className="bg-[#F9FBF9] p-3 rounded-xl border border-[#E2ECE2] space-y-1.5 text-xs text-slate-700">
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-1.5 font-bold text-slate-900">
                        <User className="w-3.5 h-3.5 text-emerald-700" />
                        Chủ vườn: {g.ownerName}
                      </span>
                      <span className="text-[11px] text-slate-500 font-mono flex items-center gap-1">
                        <Phone className="w-3 h-3 text-slate-400" />
                        {g.phone}
                      </span>
                    </div>

                    <div className="flex items-center gap-1 text-[11px] text-slate-500 truncate">
                      <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                      <span className="truncate">{g.location}</span>
                    </div>
                  </div>

                  {/* Cultivation specs */}
                  <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-600 pt-1">
                    <div className="bg-slate-50 p-2 rounded-lg border border-slate-100">
                      <span className="text-slate-400 block text-[10px]">Quy mô:</span>
                      <strong className="text-slate-800">{g.totalAreaHa} ha</strong> • {g.plots.length} lô
                    </div>

                    <div className="bg-slate-50 p-2 rounded-lg border border-slate-100">
                      <span className="text-slate-400 block text-[10px]">Tiêu chuẩn:</span>
                      <strong className="text-emerald-700 truncate block">{g.cultivationStandard.split(" ")[0]}</strong>
                    </div>

                    <div className="bg-slate-50 p-2 rounded-lg border border-slate-100">
                      <span className="text-slate-400 block text-[10px]">Thổ nhưỡng:</span>
                      <span className="truncate block font-medium">{g.soilType.split("/")[0]}</span>
                    </div>

                    <div className="bg-slate-50 p-2 rounded-lg border border-slate-100">
                      <span className="text-slate-400 block text-[10px]">Sức khỏe vườn:</span>
                      <span className={`font-bold flex items-center gap-1 ${
                        avgGardenHealth >= 85 ? "text-emerald-700" : "text-amber-700"
                      }`}>
                        <Activity className="w-3 h-3" />
                        {avgGardenHealth}%
                      </span>
                    </div>
                  </div>
                </div>

                {/* Card Action Buttons */}
                <div className="flex items-center justify-between gap-2 pt-4 mt-4 border-t border-slate-100 text-xs">
                  {isCurrent ? (
                    <button
                      type="button"
                      onClick={() => setIsEditingInfo(true)}
                      className="px-3 py-2 bg-emerald-100 hover:bg-emerald-200 text-emerald-800 font-bold rounded-xl flex items-center gap-1.5 transition cursor-pointer text-xs"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>Sửa Thông Tin</span>
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => onSelectGarden(g.id)}
                      className="px-4 py-2 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white font-bold rounded-xl flex items-center gap-1.5 transition shadow-sm cursor-pointer text-xs"
                    >
                      <span>Chọn Làm Việc</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  )}

                  {gardens.length > 1 && (
                    <button
                      type="button"
                      onClick={() => {
                        if (confirm(`Bạn có chắc chắn muốn xóa "${g.name}" khỏi hệ thống?`)) {
                          onDeleteGarden(g.id);
                        }
                      }}
                      className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition cursor-pointer"
                      title="Xóa nhà vườn"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 3. Detailed Profile & Plots of Active Garden */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E2ECE2] shadow-[0_4px_20px_-4px_rgba(45,90,39,0.06)] space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-5 border-b border-[#F0F5F0]">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E8F3E8] text-[#2D5A27] text-xs font-bold mb-2 border border-emerald-200">
              <Sprout className="w-3.5 h-3.5 text-[#2D5A27]" />
              <span>Hồ Sơ Canh Tác Chi Tiết Của Vườn Đang Chọn</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              {currentGarden.name}
            </h2>
            <p className="text-xs sm:text-sm text-[#527050] mt-1 flex items-center gap-2 flex-wrap">
              <span>📍 {currentGarden.region}</span>
              <span>•</span>
              <span>Chủ vườn: <strong className="text-slate-800">{currentGarden.ownerName}</strong> ({currentGarden.phone})</span>
              <span>•</span>
              <span>Vị trí: <strong className="text-slate-800">{currentGarden.location}</strong></span>
            </p>
          </div>

          <button
            type="button"
            onClick={() => setIsEditingInfo(!isEditingInfo)}
            className="px-4 py-2.5 bg-[#E8F3E8] hover:bg-[#d8edd8] text-[#2D5A27] text-xs font-bold rounded-2xl border border-emerald-200 flex items-center gap-2 transition cursor-pointer shrink-0"
          >
            <Edit3 className="w-4 h-4" />
            <span>{isEditingInfo ? "Đóng chỉnh sửa" : "Chỉnh Sửa Thông Số"}</span>
          </button>
        </div>

        {/* Edit Form or Readonly Overview Grid */}
        {isEditingInfo ? (
          <form onSubmit={handleSaveProfile} className="space-y-6 animate-fadeIn">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Khu Vực Canh Tác
                </label>
                <input
                  type="text"
                  value={region}
                  onChange={(e) => setRegion(e.target.value)}
                  placeholder="Ví dụ: Khu Vực Bình Phước, Khu Vực Tây Ninh..."
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-[#2D5A27]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Tên Nhà Vườn
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-[#2D5A27]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Tên Chủ Vườn / Đại Diện
                </label>
                <input
                  type="text"
                  value={ownerName}
                  onChange={(e) => setOwnerName(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-[#2D5A27]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Số Điện Thoại
                </label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-[#2D5A27]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Mã Số Vùng Trồng (MSVT)
                </label>
                <input
                  type="text"
                  value={farmCode}
                  onChange={(e) => setFarmCode(e.target.value)}
                  placeholder="Ví dụ: VN-BPC-0892"
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm font-mono outline-none focus:ring-2 focus:ring-[#2D5A27]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Tổng Diện Tích (ha)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={totalAreaHa}
                  onChange={(e) => setTotalAreaHa(parseFloat(e.target.value) || 1)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-[#2D5A27]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Độ pH Đất
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={soilPH}
                  onChange={(e) => setSoilPH(parseFloat(e.target.value) || 5.8)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-[#2D5A27]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Loại Đất Thổ Nhưỡng
                </label>
                <select
                  value={soilType}
                  onChange={(e) => setSoilType(e.target.value as SoilType)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-[#2D5A27]"
                >
                  {SOIL_OPTIONS.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Hệ Thống Tưới
                </label>
                <select
                  value={irrigationType}
                  onChange={(e) => setIrrigationType(e.target.value as IrrigationType)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-[#2D5A27]"
                >
                  {IRRIGATION_OPTIONS.map((i) => (
                    <option key={i} value={i}>
                      {i}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Tiêu Chuẩn Canh Tác
                </label>
                <select
                  value={cultivationStandard}
                  onChange={(e) => setCultivationStandard(e.target.value as CultivationStandard)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-[#2D5A27]"
                >
                  {STANDARD_OPTIONS.map((st) => (
                    <option key={st} value={st}>
                      {st}
                    </option>
                  ))}
                </select>
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Địa Chỉ Vườn Cụ Thể
                </label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-[#2D5A27]"
                />
              </div>

              <div className="sm:col-span-2 lg:col-span-3">
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Ghi Chú Nông Học & Khí Hậu Địa Phương
                </label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-[#2D5A27]"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setIsEditingInfo(false)}
                className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-xl text-sm font-semibold"
              >
                Hủy
              </button>
              <button
                type="submit"
                className="px-6 py-2 bg-[#2D5A27] hover:bg-[#23471e] text-white rounded-xl text-sm font-bold shadow-md transition"
              >
                Lưu Thay Đổi
              </button>
            </div>
          </form>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-[#F9FBF9] p-4 rounded-2xl border border-[#E2ECE2]">
              <span className="text-xs text-[#527050] font-medium flex items-center gap-1.5">
                <FlaskConical className="w-3.5 h-3.5 text-[#2D5A27]" />
                Độ pH & Thổ Nhưỡng
              </span>
              <div className="text-lg font-bold text-slate-900 mt-1">
                pH {currentGarden.soilPH}
              </div>
              <div className="text-xs text-slate-500 mt-0.5 truncate">
                {currentGarden.soilType}
              </div>
            </div>

            <div className="bg-[#F9FBF9] p-4 rounded-2xl border border-[#E2ECE2]">
              <span className="text-xs text-[#527050] font-medium flex items-center gap-1.5">
                <Droplets className="w-3.5 h-3.5 text-[#2D5A27]" />
                Hệ Thống Tưới Tiêu
              </span>
              <div className="text-base font-bold text-slate-900 mt-1 truncate">
                {currentGarden.irrigationType}
              </div>
              <div className="text-xs text-emerald-700 font-semibold mt-0.5">
                Tiết kiệm nước tự động
              </div>
            </div>

            <div className="bg-[#F9FBF9] p-4 rounded-2xl border border-[#E2ECE2]">
              <span className="text-xs text-[#527050] font-medium flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-[#2D5A27]" />
                Tiêu Chuẩn Sản Xuất
              </span>
              <div className="text-base font-bold text-slate-900 mt-1 truncate">
                {currentGarden.cultivationStandard.split(" ")[0]}
              </div>
              <div className="text-xs text-slate-500 mt-0.5">
                {currentGarden.cultivationStandard}
              </div>
            </div>

            <div className="bg-[#F9FBF9] p-4 rounded-2xl border border-[#E2ECE2]">
              <span className="text-xs text-[#527050] font-medium flex items-center gap-1.5">
                <Trees className="w-3.5 h-3.5 text-[#2D5A27]" />
                Quy Mô Canh Tác
              </span>
              <div className="text-lg font-bold text-slate-900 mt-1">
                {currentGarden.totalAreaHa} ha
              </div>
              <div className="text-xs text-slate-500 mt-0.5">
                {currentGarden.plots.length} phân lô canh tác
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 4. Plots Management of Active Garden */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
              <Layers className="w-5 h-5 text-emerald-700" />
              <span>Danh Sách Phân Lô Canh Tác ({currentGarden.plots.length} Lô)</span>
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              Theo dõi tuổi cây, giống ghép, giai đoạn sinh trưởng và điểm sức khỏe của từng lô trong vườn.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setShowAddPlotModal(true)}
            className="px-4 py-2.5 bg-[#2D5A27] hover:bg-[#23471e] text-white text-xs sm:text-sm font-bold rounded-2xl shadow-sm flex items-center gap-2 transition cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Thêm Lô Vườn Mới</span>
          </button>
        </div>

        {/* Plots Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {currentGarden.plots.map((plot) => (
            <div
              key={plot.id}
              className="bg-white rounded-3xl p-5 sm:p-6 border border-[#E2ECE2] shadow-[0_4px_20px_-4px_rgba(45,90,39,0.04)] space-y-4 flex flex-col justify-between hover:border-emerald-300 transition"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="space-y-1">
                    <span className="px-2.5 py-0.5 bg-emerald-50 text-emerald-800 text-[11px] font-bold rounded-full border border-emerald-200">
                      {plot.cropName} • {plot.variety}
                    </span>
                    <h4 className="font-extrabold text-slate-900 text-base">
                      {plot.name}
                    </h4>
                  </div>

                  <div className={`px-2.5 py-1 rounded-xl text-xs font-bold flex items-center gap-1 ${
                    plot.healthScore >= 85
                      ? "bg-emerald-100 text-emerald-800"
                      : plot.healthScore >= 70
                      ? "bg-amber-100 text-amber-800"
                      : "bg-rose-100 text-rose-800"
                  }`}>
                    <Activity className="w-3.5 h-3.5" />
                    <span>{plot.healthScore}%</span>
                  </div>
                </div>

                <div className="bg-[#F9FBF9] p-3 rounded-2xl border border-[#E2ECE2] text-xs space-y-1.5 text-slate-700">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Giai đoạn:</span>
                    <span className="font-bold text-[#2D5A27] text-right truncate max-w-[170px]">
                      {plot.stage}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Quy mô:</span>
                    <span className="font-semibold text-slate-800">
                      {plot.treeCount} cây ({(plot.areaM2 / 1000).toFixed(1)} công)
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Năm trồng:</span>
                    <span className="font-semibold text-slate-800">
                      {plot.plantedYear} ({plot.treeAgeYears} năm tuổi)
                    </span>
                  </div>
                  {plot.recentIssue && (
                    <div className="pt-1 text-[11px] text-amber-700 flex items-start gap-1">
                      <AlertCircle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                      <span>{plot.recentIssue}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Plot Health Control Slider */}
              <div className="space-y-1.5 pt-2 border-t border-slate-100">
                <div className="flex justify-between text-[11px] text-slate-500">
                  <span>Cập nhật chỉ số sức khỏe:</span>
                  <span className="font-bold text-slate-800">{plot.healthScore}/100</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={plot.healthScore}
                  onChange={(e) => handleUpdatePlotHealth(plot.id, parseInt(e.target.value) || 0)}
                  className="w-full accent-emerald-600 cursor-pointer h-1.5 bg-slate-200 rounded-lg"
                />

                <div className="flex justify-end pt-1">
                  <button
                    type="button"
                    onClick={() => handleDeletePlot(plot.id)}
                    className="text-[11px] text-rose-500 hover:text-rose-700 hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <Trash2 className="w-3 h-3" />
                    <span>Xóa lô</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add Plot Modal */}
      {showAddPlotModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-2xl border border-emerald-100">
            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Layers className="w-5 h-5 text-emerald-700" />
              <span>Thêm Lô Canh Tác Cho {currentGarden.name}</span>
            </h3>

            <form onSubmit={handleAddPlot} className="space-y-3 text-xs sm:text-sm">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Tên Lô (Thửa)
                </label>
                <input
                  type="text"
                  required
                  value={plotName}
                  onChange={(e) => setPlotName(e.target.value)}
                  placeholder="Ví dụ: Lô D - Sầu Riêng Tơ"
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-[#2D5A27]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Loại Cây Trồng
                  </label>
                  <input
                    type="text"
                    required
                    value={cropName}
                    onChange={(e) => setCropName(e.target.value)}
                    placeholder="Ví dụ: Sầu riêng, Bưởi, Mãng cầu"
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-[#2D5A27]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Giống / Chủng Loại
                  </label>
                  <input
                    type="text"
                    value={variety}
                    onChange={(e) => setVariety(e.target.value)}
                    placeholder="Ví dụ: Dona, Ri6, Musang King"
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-[#2D5A27]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Số Cây
                  </label>
                  <input
                    type="number"
                    value={treeCount}
                    onChange={(e) => setTreeCount(parseInt(e.target.value) || 50)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Năm Trồng
                  </label>
                  <input
                    type="number"
                    value={plantedYear}
                    onChange={(e) => setPlantedYear(parseInt(e.target.value) || 2022)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Tuổi Cây (Năm)
                  </label>
                  <input
                    type="number"
                    value={treeAgeYears}
                    onChange={(e) => setTreeAgeYears(parseInt(e.target.value) || 3)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Giai Đoạn Sinh Trưởng
                </label>
                <select
                  value={stage}
                  onChange={(e) => setStage(e.target.value as GrowthStage)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm"
                >
                  {STAGE_OPTIONS.map((stg) => (
                    <option key={stg} value={stg}>
                      {stg}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setShowAddPlotModal(false)}
                  className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#2D5A27] text-white rounded-xl font-bold shadow-md hover:bg-[#23471e]"
                >
                  Thêm Lô Vườn
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
