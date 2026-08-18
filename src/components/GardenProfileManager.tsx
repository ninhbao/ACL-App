import React, { useState } from "react";
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
  Sprout
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
  garden: GardenProfile;
  onUpdateGarden: (updated: GardenProfile) => void;
  onDeleteGarden: (id: string) => void;
}

const SOIL_OPTIONS: SoilType[] = [
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
  garden,
  onUpdateGarden,
  onDeleteGarden,
}) => {
  const [isEditingInfo, setIsEditingInfo] = useState(false);
  const [showAddPlotModal, setShowAddPlotModal] = useState(false);
  const [editingPlotId, setEditingPlotId] = useState<string | null>(null);

  // Profile Form State
  const [name, setName] = useState(garden.name);
  const [ownerName, setOwnerName] = useState(garden.ownerName);
  const [phone, setPhone] = useState(garden.phone);
  const [location, setLocation] = useState(garden.location);
  const [totalAreaHa, setTotalAreaHa] = useState(garden.totalAreaHa);
  const [soilType, setSoilType] = useState<SoilType>(garden.soilType);
  const [soilPH, setSoilPH] = useState(garden.soilPH);
  const [irrigationType, setIrrigationType] = useState<IrrigationType>(garden.irrigationType);
  const [cultivationStandard, setCultivationStandard] = useState<CultivationStandard>(garden.cultivationStandard);
  const [notes, setNotes] = useState(garden.notes || "");

  // New Plot Form State
  const [plotName, setPlotName] = useState("");
  const [cropName, setCropName] = useState("");
  const [variety, setVariety] = useState("");
  const [treeCount, setTreeCount] = useState(100);
  const [plantedYear, setPlantedYear] = useState(2022);
  const [treeAgeYears, setTreeAgeYears] = useState(4);
  const [stage, setStage] = useState<GrowthStage>("Phát triển thân lá / Làm cơi đọt");
  const [areaM2, setAreaM2] = useState(5000);
  const [healthScore, setHealthScore] = useState(90);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    const updated: GardenProfile = {
      ...garden,
      name,
      ownerName,
      phone,
      location,
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

  const handleCreatePlot = (e: React.FormEvent) => {
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
      healthScore: Number(healthScore)
    };

    const updated: GardenProfile = {
      ...garden,
      plots: [...garden.plots, newPlot]
    };

    onUpdateGarden(updated);
    setShowAddPlotModal(false);
    setPlotName("");
    setCropName("");
    setVariety("");
  };

  const handleDeletePlot = (plotId: string) => {
    if (garden.plots.length <= 1) {
      alert("Nhà vườn cần ít nhất 1 lô canh tác.");
      return;
    }
    const updated: GardenProfile = {
      ...garden,
      plots: garden.plots.filter((p) => p.id !== plotId)
    };
    onUpdateGarden(updated);
  };

  const handleUpdatePlotHealth = (plotId: string, newScore: number) => {
    const updated: GardenProfile = {
      ...garden,
      plots: garden.plots.map((p) => (p.id === plotId ? { ...p, healthScore: newScore } : p))
    };
    onUpdateGarden(updated);
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Garden Profile Bento Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E2ECE2] shadow-[0_4px_20px_-4px_rgba(45,90,39,0.06)] space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-5 border-b border-[#F0F5F0]">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E8F3E8] text-[#2D5A27] text-xs font-bold mb-2 border border-emerald-200">
              <Sprout className="w-3.5 h-3.5 text-[#2D5A27]" />
              <span>Hồ Sơ Đặc Thù Nhà Vườn</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              {garden.name}
            </h1>
            <p className="text-xs sm:text-sm text-[#527050] mt-1">
              Cá nhân hoá điều kiện thổ nhưỡng, hệ thống tưới và quy chuẩn chất lượng
            </p>
          </div>

          <button
            type="button"
            onClick={() => setIsEditingInfo(!isEditingInfo)}
            className="px-4 py-2.5 bg-[#E8F3E8] hover:bg-[#d8edd8] text-[#2D5A27] text-xs font-bold rounded-2xl border border-emerald-200 flex items-center gap-2 transition cursor-pointer"
          >
            <Edit3 className="w-4 h-4" />
            <span>{isEditingInfo ? "Đóng chỉnh sửa" : "Chỉnh Sửa Thông Tin"}</span>
          </button>
        </div>

        {isEditingInfo ? (
          <form onSubmit={handleSaveProfile} className="space-y-4 text-xs sm:text-sm">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Tên nhà vườn / Trang trại:</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full p-3 bg-[#F9FBF9] border border-[#E2ECE2] rounded-2xl outline-none focus:ring-2 focus:ring-[#2D5A27] font-semibold"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Chủ vườn & Số điện thoại:</label>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    value={ownerName}
                    onChange={(e) => setOwnerName(e.target.value)}
                    placeholder="Tên chủ vườn"
                    className="w-full p-3 bg-[#F9FBF9] border border-[#E2ECE2] rounded-2xl outline-none"
                  />
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="SĐT"
                    className="w-full p-3 bg-[#F9FBF9] border border-[#E2ECE2] rounded-2xl outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Địa phương / Khu vực:</label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="Ví dụ: Châu Thành, Bến Tre"
                  className="w-full p-3 bg-[#F9FBF9] border border-[#E2ECE2] rounded-2xl outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Tổng diện tích (ha) & pH Đất:</label>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="number"
                    step="0.1"
                    value={totalAreaHa}
                    onChange={(e) => setTotalAreaHa(Number(e.target.value))}
                    className="w-full p-3 bg-[#F9FBF9] border border-[#E2ECE2] rounded-2xl outline-none"
                  />
                  <input
                    type="number"
                    step="0.1"
                    value={soilPH}
                    onChange={(e) => setSoilPH(Number(e.target.value))}
                    className="w-full p-3 bg-[#F9FBF9] border border-[#E2ECE2] rounded-2xl outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Loại thổ nhưỡng đặc trưng:</label>
                <select
                  value={soilType}
                  onChange={(e) => setSoilType(e.target.value as SoilType)}
                  className="w-full p-3 bg-[#F9FBF9] border border-[#E2ECE2] rounded-2xl font-semibold outline-none cursor-pointer"
                >
                  {SOIL_OPTIONS.map((st) => (
                    <option key={st} value={st}>
                      {st}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Hệ thống tưới tiêu:</label>
                <select
                  value={irrigationType}
                  onChange={(e) => setIrrigationType(e.target.value as IrrigationType)}
                  className="w-full p-3 bg-[#F9FBF9] border border-[#E2ECE2] rounded-2xl font-semibold outline-none cursor-pointer"
                >
                  {IRRIGATION_OPTIONS.map((it) => (
                    <option key={it} value={it}>
                      {it}
                    </option>
                  ))}
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="block font-bold text-slate-700 mb-1">Tiêu chuẩn canh tác áp dụng:</label>
                <select
                  value={cultivationStandard}
                  onChange={(e) => setCultivationStandard(e.target.value as CultivationStandard)}
                  className="w-full p-3 bg-[#F9FBF9] border border-[#E2ECE2] rounded-2xl font-semibold outline-none cursor-pointer"
                >
                  {STANDARD_OPTIONS.map((cs) => (
                    <option key={cs} value={cs}>
                      {cs}
                    </option>
                  ))}
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="block font-bold text-slate-700 mb-1">Ghi chú thổ nhưỡng & Lưu ý riêng của vườn:</label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full p-3 bg-[#F9FBF9] border border-[#E2ECE2] rounded-2xl outline-none resize-none"
                />
              </div>
            </div>

            <div className="pt-3 border-t border-[#F0F5F0] flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsEditingInfo(false)}
                className="px-4 py-2 font-semibold text-slate-600 hover:bg-slate-100 rounded-xl cursor-pointer"
              >
                Hủy
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 bg-[#2D5A27] hover:bg-[#1E3F1A] text-white font-bold rounded-2xl shadow-sm flex items-center gap-1.5 cursor-pointer"
              >
                <Check className="w-4 h-4" />
                <span>Lưu Thay Đổi</span>
              </button>
            </div>
          </form>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
            <div className="p-4 rounded-2xl bg-[#F9FBF9] border border-[#E2ECE2] space-y-1">
              <span className="text-[#739270] font-bold uppercase text-[10px] block">Chủ vườn & Vị trí</span>
              <div className="font-extrabold text-slate-900 text-sm">{garden.ownerName}</div>
              <div className="text-slate-600 font-medium">{garden.phone}</div>
              <div className="text-[#2D5A27] font-semibold">{garden.location}</div>
            </div>

            <div className="p-4 rounded-2xl bg-[#F9FBF9] border border-[#E2ECE2] space-y-1">
              <span className="text-[#739270] font-bold uppercase text-[10px] block">Quy mô & Thổ nhưỡng</span>
              <div className="font-extrabold text-slate-900 text-sm">{garden.totalAreaHa} ha (Tổng vườn)</div>
              <div className="text-slate-700 font-medium">{garden.soilType}</div>
              <div className="text-cyan-800 font-bold">pH Đất trung bình: {garden.soilPH}</div>
            </div>

            <div className="p-4 rounded-2xl bg-[#F9FBF9] border border-[#E2ECE2] space-y-1">
              <span className="text-[#739270] font-bold uppercase text-[10px] block">Tưới tiêu & Chuẩn</span>
              <div className="font-extrabold text-slate-900 text-sm">{garden.irrigationType}</div>
              <div className="text-[#2D5A27] font-semibold">{garden.cultivationStandard}</div>
            </div>

            <div className="p-4 rounded-2xl bg-[#F9FBF9] border border-[#E2ECE2] space-y-1">
              <span className="text-[#739270] font-bold uppercase text-[10px] block">Cấu trúc vườn</span>
              <div className="font-extrabold text-slate-900 text-sm">{garden.plots.length} Lô canh tác</div>
              <div className="text-slate-600 font-medium">
                {garden.plots.reduce((acc, p) => acc + p.treeCount, 0).toLocaleString()} gốc cây
              </div>
            </div>

            {garden.notes && (
              <div className="sm:col-span-2 lg:col-span-4 p-4 rounded-2xl bg-[#F4F9F4] border border-emerald-100 text-xs text-slate-700">
                <strong className="text-[#1E3F1A] font-bold">Lưu ý đặc thù: </strong>
                {garden.notes}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Plots / Zones Management Section */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E2ECE2] shadow-[0_4px_20px_-4px_rgba(45,90,39,0.06)] space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-[#F0F5F0]">
          <div>
            <h2 className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
              <Layers className="w-5 h-5 text-[#2D5A27]" />
              <span>Danh Sách Lô & Khu Vực Canh Tác ({garden.plots.length})</span>
            </h2>
            <p className="text-xs sm:text-sm text-[#527050] mt-1">
              Quản lý riêng biệt từng lô theo giống cây, tuổi cây và tình trạng sức khỏe
            </p>
          </div>

          <button
            id="open-add-plot-modal-btn"
            type="button"
            onClick={() => setShowAddPlotModal(true)}
            className="px-4 py-2.5 bg-[#2D5A27] hover:bg-[#1E3F1A] text-white font-bold text-xs sm:text-sm rounded-2xl shadow-sm flex items-center gap-1.5 transition cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Thêm Lô Canh Tác</span>
          </button>
        </div>

        {/* Plots Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {garden.plots.map((plot) => (
            <div
              key={plot.id}
              className="p-5 rounded-3xl border border-[#E2ECE2] bg-[#F9FBF9] hover:bg-white hover:border-[#2D5A27]/40 hover:shadow-md transition space-y-4 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="font-extrabold text-slate-900 text-base line-clamp-1">{plot.name}</h3>
                    <div className="text-xs font-semibold text-[#2D5A27] mt-0.5">
                      {plot.cropName} • {plot.variety}
                    </div>
                  </div>
                  <span
                    className={`text-xs px-2.5 py-0.5 rounded-full font-extrabold shrink-0 border ${
                      plot.healthScore >= 85
                        ? "bg-[#E8F3E8] text-[#2D5A27] border-emerald-200"
                        : plot.healthScore >= 70
                        ? "bg-amber-100 text-amber-800 border-amber-200"
                        : "bg-rose-100 text-rose-800 border-rose-200"
                    }`}
                  >
                    {plot.healthScore}%
                  </span>
                </div>

                <div className="mt-3.5 space-y-2 text-xs text-slate-600">
                  <div className="flex justify-between">
                    <span className="text-[#739270]">Số lượng cây:</span>
                    <strong className="text-slate-800">{plot.treeCount} cây ({plot.areaM2} m²)</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#739270]">Năm trồng / Tuổi:</span>
                    <strong className="text-slate-800">{plot.plantedYear} ({plot.treeAgeYears} năm tuổi)</strong>
                  </div>
                  <div>
                    <span className="text-[#739270] block">Giai đoạn:</span>
                    <span className="font-semibold text-[#1E3F1A]">{plot.stage}</span>
                  </div>
                </div>

                {plot.recentIssue && (
                  <div className="mt-3 text-[11px] text-amber-800 bg-amber-50 p-2 rounded-xl border border-amber-200">
                    {plot.recentIssue}
                  </div>
                )}
              </div>

              {/* Action Bar for Plot */}
              <div className="pt-3 border-t border-[#E2ECE2] flex items-center justify-between gap-2">
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] text-[#739270] font-semibold">Sức khỏe:</span>
                  <input
                    type="range"
                    min="40"
                    max="100"
                    value={plot.healthScore}
                    onChange={(e) => handleUpdatePlotHealth(plot.id, Number(e.target.value))}
                    className="w-20 accent-[#2D5A27]"
                  />
                </div>

                <button
                  type="button"
                  onClick={() => handleDeletePlot(plot.id)}
                  className="text-slate-400 hover:text-rose-600 p-1.5 rounded-lg hover:bg-rose-50 transition cursor-pointer"
                  title="Xoá Lô này"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* MODAL: New Plot */}
      {showAddPlotModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4">
          <form
            onSubmit={handleCreatePlot}
            className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl border border-[#E2ECE2] animate-in fade-in zoom-in-95 duration-150 space-y-4 text-xs sm:text-sm"
          >
            <div className="flex items-start justify-between pb-2 border-b border-[#F0F5F0]">
              <h3 className="text-lg font-bold text-slate-900">
                Thêm Lô / Khu Vực Canh Tác Mới
              </h3>
              <button
                type="button"
                onClick={() => setShowAddPlotModal(false)}
                className="text-slate-400 hover:text-slate-600 font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Tên Lô / Khu vực:</label>
              <input
                type="text"
                required
                value={plotName}
                onChange={(e) => setPlotName(e.target.value)}
                placeholder="Ví dụ: Lô D - Sầu riêng tơ năm 3..."
                className="w-full p-3 bg-[#F9FBF9] border border-[#E2ECE2] rounded-2xl outline-none focus:ring-2 focus:ring-[#2D5A27] font-semibold"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Loại cây trồng:</label>
                <input
                  type="text"
                  required
                  value={cropName}
                  onChange={(e) => setCropName(e.target.value)}
                  placeholder="Ví dụ: Sầu riêng, Bưởi, Dâu tây..."
                  className="w-full p-3 bg-[#F9FBF9] border border-[#E2ECE2] rounded-2xl outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Tên giống cây:</label>
                <input
                  type="text"
                  value={variety}
                  onChange={(e) => setVariety(e.target.value)}
                  placeholder="Ví dụ: Ri6, Dona, Da Xanh..."
                  className="w-full p-3 bg-[#F9FBF9] border border-[#E2ECE2] rounded-2xl outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Số cây:</label>
                <input
                  type="number"
                  value={treeCount}
                  onChange={(e) => setTreeCount(Number(e.target.value))}
                  className="w-full p-2 bg-[#F9FBF9] border border-[#E2ECE2] rounded-2xl outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Năm trồng:</label>
                <input
                  type="number"
                  value={plantedYear}
                  onChange={(e) => setPlantedYear(Number(e.target.value))}
                  className="w-full p-2 bg-[#F9FBF9] border border-[#E2ECE2] rounded-2xl outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Tuổi cây (năm):</label>
                <input
                  type="number"
                  value={treeAgeYears}
                  onChange={(e) => setTreeAgeYears(Number(e.target.value))}
                  className="w-full p-2 bg-[#F9FBF9] border border-[#E2ECE2] rounded-2xl outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Giai đoạn sinh trưởng:</label>
              <select
                value={stage}
                onChange={(e) => setStage(e.target.value as GrowthStage)}
                className="w-full p-3 bg-[#F9FBF9] border border-[#E2ECE2] rounded-2xl outline-none font-medium cursor-pointer"
              >
                {STAGE_OPTIONS.map((stg) => (
                  <option key={stg} value={stg}>
                    {stg}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Diện tích lô (m²):</label>
                <input
                  type="number"
                  value={areaM2}
                  onChange={(e) => setAreaM2(Number(e.target.value))}
                  className="w-full p-2.5 bg-[#F9FBF9] border border-[#E2ECE2] rounded-2xl outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Điểm sức khỏe (%):</label>
                <input
                  type="number"
                  min="30"
                  max="100"
                  value={healthScore}
                  onChange={(e) => setHealthScore(Number(e.target.value))}
                  className="w-full p-2.5 bg-[#F9FBF9] border border-[#E2ECE2] rounded-2xl outline-none"
                />
              </div>
            </div>

            <div className="pt-3 border-t border-[#F0F5F0] flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowAddPlotModal(false)}
                className="px-4 py-2 font-semibold text-slate-600 hover:bg-slate-100 rounded-xl cursor-pointer"
              >
                Đóng
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 bg-[#2D5A27] hover:bg-[#1E3F1A] text-white font-bold rounded-2xl shadow-sm cursor-pointer"
              >
                Tạo Lô Canh Tác
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
