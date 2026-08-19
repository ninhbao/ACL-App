import React, { useState } from "react";
import { 
  X, 
  Sprout, 
  MapPin, 
  User, 
  Phone, 
  Layers, 
  Droplets, 
  FlaskConical, 
  ShieldCheck, 
  FileText,
  Plus
} from "lucide-react";
import { 
  GardenProfile, 
  SoilType, 
  IrrigationType, 
  CultivationStandard, 
  GrowthStage,
  GardenPlot 
} from "../types";

interface ModalAddGardenProps {
  isOpen: boolean;
  onClose: () => void;
  onAddGarden: (newGarden: GardenProfile) => void;
  existingRegions: string[];
}

const DEFAULT_REGIONS = [
  "Khu Vực Bình Phước",
  "Khu Vực Tây Ninh",
  "Khu Vực Đắk Lắk",
  "Khu Vực Tiền Giang",
  "Khu Vực Đồng Nai",
  "Khu Vực Lâm Đồng",
  "Khu Vực Bến Tre",
  "Khu Vực Cần Thơ"
];

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

export const ModalAddGarden: React.FC<ModalAddGardenProps> = ({
  isOpen,
  onClose,
  onAddGarden,
  existingRegions
}) => {
  const allRegions = Array.from(new Set([...DEFAULT_REGIONS, ...existingRegions]));

  const [region, setRegion] = useState(allRegions[0] || "Khu Vực Bình Phước");
  const [customRegion, setCustomRegion] = useState("");
  const [isCustomRegion, setIsCustomRegion] = useState(false);

  const [ownerName, setOwnerName] = useState("");
  const [phone, setPhone] = useState("");
  const [gardenName, setGardenName] = useState("");
  const [location, setLocation] = useState("");
  const [farmCode, setFarmCode] = useState("");
  const [totalAreaHa, setTotalAreaHa] = useState(3.0);
  const [soilType, setSoilType] = useState<SoilType>(SOIL_OPTIONS[0]);
  const [soilPH, setSoilPH] = useState(5.8);
  const [irrigationType, setIrrigationType] = useState<IrrigationType>(IRRIGATION_OPTIONS[0]);
  const [cultivationStandard, setCultivationStandard] = useState<CultivationStandard>(STANDARD_OPTIONS[0]);
  const [notes, setNotes] = useState("");

  // Initial plot details
  const [plotName, setPlotName] = useState("Lô 1 - Vườn Chính");
  const [cropName, setCropName] = useState("Sầu riêng");
  const [variety, setVariety] = useState("Dona / Ri6");
  const [treeCount, setTreeCount] = useState(150);
  const [plantedYear, setPlantedYear] = useState(2021);
  const [stage, setStage] = useState<GrowthStage>("Phát triển thân lá / Làm cơi đọt");

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalRegion = isCustomRegion && customRegion.trim() ? customRegion.trim() : region;
    const finalName = gardenName.trim() || `Vườn ${ownerName ? ownerName : "Mới"} - ${finalRegion}`;

    const initialPlot: GardenPlot = {
      id: `plot-${Date.now()}-1`,
      name: plotName.trim() || "Lô 1",
      cropName: cropName.trim() || "Cây ăn trái",
      variety: variety.trim() || "Giống chuẩn",
      treeCount: Number(treeCount) || 100,
      plantedYear: Number(plantedYear) || 2022,
      treeAgeYears: Math.max(1, new Date().getFullYear() - (Number(plantedYear) || 2022)),
      stage: stage,
      areaM2: Math.round((Number(totalAreaHa) || 1) * 10000),
      healthScore: 92,
      lastInspectionDate: new Date().toISOString().slice(0, 10)
    };

    const newGarden: GardenProfile = {
      id: `garden-${Date.now()}`,
      name: finalName,
      region: finalRegion,
      ownerName: ownerName.trim() || "Chủ vườn",
      phone: phone.trim() || "0900 000 000",
      location: location.trim() || `${finalRegion}, Việt Nam`,
      farmCode: farmCode.trim() || undefined,
      totalAreaHa: Number(totalAreaHa) || 1.0,
      soilType,
      soilPH: Number(soilPH) || 6.0,
      irrigationType,
      cultivationStandard,
      plots: [initialPlot],
      weatherStation: {
        tempC: 30,
        humidityPct: 75,
        condition: "Nắng nhẹ, có mây rải rác",
        rainfallMm: 5,
        forecast: `Thời tiết tại ${finalRegion} ổn định, thuận lợi cho chăm sóc cây trồng.`
      },
      notes: notes.trim(),
      createdAt: new Date().toISOString().slice(0, 10)
    };

    onAddGarden(newGarden);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-3xl w-full max-h-[92vh] overflow-hidden flex flex-col shadow-2xl border border-emerald-100">
        
        {/* Modal Header */}
        <div className="bg-[#1E3F1A] text-white p-5 sm:p-6 flex items-center justify-between border-b border-[#2D5A27]">
          <div className="flex items-center gap-3">
            <div className="bg-[#2D5A27] p-2.5 rounded-2xl border border-emerald-400/20 flex items-center justify-center shadow-sm">
              <Sprout className="w-5 h-5 text-[#A3D99E]" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-bold tracking-tight text-white">
                Thêm Nhà Vườn Mới Theo Khu Vực & Chủ Vườn
              </h2>
              <p className="text-xs text-[#D1E7D1] mt-0.5">
                Định danh khu vực canh tác, chủ hộ và thiết lập phác đồ nông học riêng biệt
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-xl transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Form Content */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-6 flex-1 text-slate-800 text-sm">
          
          {/* Section 1: Khu vực & Chủ Vườn */}
          <div className="bg-[#F9FBF9] p-4 sm:p-5 rounded-2xl border border-[#E2ECE2] space-y-4">
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-[#2D5A27] flex items-center gap-2">
              <MapPin className="w-4 h-4 text-emerald-600" />
              1. Phân Loại Khu Vực & Thông Tin Chủ Vườn
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Khu Vực */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Khu Vực Canh Tác <span className="text-rose-500">*</span>
                </label>
                {!isCustomRegion ? (
                  <div className="space-y-2">
                    <select
                      value={region}
                      onChange={(e) => {
                        if (e.target.value === "custom") {
                          setIsCustomRegion(true);
                        } else {
                          setRegion(e.target.value);
                        }
                      }}
                      className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-semibold text-slate-800 outline-none focus:ring-2 focus:ring-[#2D5A27]"
                    >
                      {allRegions.map((r) => (
                        <option key={r} value={r}>
                          📍 {r}
                        </option>
                      ))}
                      <option value="custom">+ Thêm khu vực mới...</option>
                    </select>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={customRegion}
                      onChange={(e) => setCustomRegion(e.target.value)}
                      placeholder="Ví dụ: Khu Vực Gia Lai, Khu Vực Bến Tre..."
                      className="flex-1 px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-[#2D5A27]"
                      autoFocus
                    />
                    <button
                      type="button"
                      onClick={() => setIsCustomRegion(false)}
                      className="px-3 py-2 text-xs text-slate-600 hover:bg-slate-200 rounded-xl font-medium"
                    >
                      Chọn lại
                    </button>
                  </div>
                )}
              </div>

              {/* Tên Chủ Vườn */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Họ Tên Chủ Vườn / Đại Diện <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={ownerName}
                    onChange={(e) => setOwnerName(e.target.value)}
                    placeholder="Ví dụ: Nguyễn Văn An, Chú Sáu..."
                    className="w-full pl-10 pr-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-[#2D5A27]"
                  />
                </div>
              </div>

              {/* Số điện thoại */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Số Điện Thoại Liên Hệ <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="0918 xxx xxx"
                    className="w-full pl-10 pr-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-[#2D5A27]"
                  />
                </div>
              </div>

              {/* Mã số vùng trồng */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Mã Số Vùng Trồng (MSVT / Farm Code)
                </label>
                <input
                  type="text"
                  value={farmCode}
                  onChange={(e) => setFarmCode(e.target.value)}
                  placeholder="Ví dụ: VN-BPC-0892 (nếu có)"
                  className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-mono outline-none focus:ring-2 focus:ring-[#2D5A27]"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Thông tin vườn & Thổ nhưỡng */}
          <div className="bg-[#F9FBF9] p-4 sm:p-5 rounded-2xl border border-[#E2ECE2] space-y-4">
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-[#2D5A27] flex items-center gap-2">
              <FlaskConical className="w-4 h-4 text-emerald-600" />
              2. Thông Tin Chi Tiết & Đặc Thù Nông Học
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Tên vườn */}
              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Tên Nhà Vườn
                </label>
                <input
                  type="text"
                  value={gardenName}
                  onChange={(e) => setGardenName(e.target.value)}
                  placeholder="Để trống sẽ tự động đặt tên theo Chủ vườn & Khu vực"
                  className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-[#2D5A27]"
                />
              </div>

              {/* Vị trí / Địa chỉ */}
              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Địa Chỉ Vườn Cụ Thể (Xã / Huyện / Tỉnh)
                </label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="Ví dụ: Xã Tân Lập, Huyện Đồng Phú, Tỉnh Bình Phước"
                  className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-[#2D5A27]"
                />
              </div>

              {/* Tổng diện tích */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Tổng Diện Tích (Hecta - ha)
                </label>
                <input
                  type="number"
                  step="0.1"
                  min="0.1"
                  value={totalAreaHa}
                  onChange={(e) => setTotalAreaHa(parseFloat(e.target.value) || 1)}
                  className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-semibold outline-none focus:ring-2 focus:ring-[#2D5A27]"
                />
              </div>

              {/* pH Đất */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Độ pH Đất Trung Bình (4.0 - 8.0)
                </label>
                <input
                  type="number"
                  step="0.1"
                  min="3.0"
                  max="9.0"
                  value={soilPH}
                  onChange={(e) => setSoilPH(parseFloat(e.target.value) || 5.8)}
                  className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-semibold outline-none focus:ring-2 focus:ring-[#2D5A27]"
                />
              </div>

              {/* Loại đất */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Loại Đất Thổ Nhưỡng
                </label>
                <select
                  value={soilType}
                  onChange={(e) => setSoilType(e.target.value as SoilType)}
                  className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm font-medium outline-none focus:ring-2 focus:ring-[#2D5A27]"
                >
                  {SOIL_OPTIONS.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>

              {/* Hệ thống tưới */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Hệ Thống Tưới Tiêu
                </label>
                <select
                  value={irrigationType}
                  onChange={(e) => setIrrigationType(e.target.value as IrrigationType)}
                  className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm font-medium outline-none focus:ring-2 focus:ring-[#2D5A27]"
                >
                  {IRRIGATION_OPTIONS.map((i) => (
                    <option key={i} value={i}>
                      {i}
                    </option>
                  ))}
                </select>
              </div>

              {/* Tiêu chuẩn canh tác */}
              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Tiêu Chuẩn Canh Tác
                </label>
                <select
                  value={cultivationStandard}
                  onChange={(e) => setCultivationStandard(e.target.value as CultivationStandard)}
                  className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm font-medium outline-none focus:ring-2 focus:ring-[#2D5A27]"
                >
                  {STANDARD_OPTIONS.map((std) => (
                    <option key={std} value={std}>
                      {std}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Section 3: Lô Canh Tác Khởi Tạo */}
          <div className="bg-[#F9FBF9] p-4 sm:p-5 rounded-2xl border border-[#E2ECE2] space-y-4">
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-[#2D5A27] flex items-center gap-2">
              <Layers className="w-4 h-4 text-emerald-600" />
              3. Thiết Lập Lô Canh Tác Ban Đầu
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Tên Lô Vườn
                </label>
                <input
                  type="text"
                  value={plotName}
                  onChange={(e) => setPlotName(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Cây Trồng & Giống
                </label>
                <input
                  type="text"
                  value={variety}
                  onChange={(e) => setVariety(e.target.value)}
                  placeholder="Ví dụ: Sầu riêng Dona, Ri6..."
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Số Lượng Cây (Gốc)
                </label>
                <input
                  type="number"
                  value={treeCount}
                  onChange={(e) => setTreeCount(parseInt(e.target.value) || 50)}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm"
                />
              </div>
            </div>
          </div>

          {/* Modal Actions */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 text-slate-600 hover:bg-slate-100 font-semibold rounded-2xl transition cursor-pointer text-xs sm:text-sm"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white font-bold rounded-2xl shadow-md transition flex items-center gap-2 cursor-pointer text-xs sm:text-sm"
            >
              <Plus className="w-4 h-4" />
              <span>Tạo Nhà Vườn Mới</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
