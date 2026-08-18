import React, { useState } from "react";
import { 
  Sprout, 
  MapPin, 
  Check, 
  Layers, 
  FlaskConical, 
  Droplets, 
  ShieldCheck,
  Sparkles
} from "lucide-react";
import { GardenProfile, SoilType, IrrigationType, CultivationStandard, GrowthStage } from "../types";

interface ModalNewGardenProps {
  isOpen: boolean;
  onClose: () => void;
  onAddGarden: (garden: GardenProfile) => void;
}

const PRESET_TEMPLATES = [
  {
    title: "Vườn Sầu Riêng Xuất Khẩu (Tây Nguyên)",
    name: "Trang Trại Sầu Riêng Krông Pắc",
    location: "Krông Pắc, Đắk Lắk",
    soilType: "Đất đỏ Bazan Tây Nguyên" as SoilType,
    soilPH: 5.6,
    irrigationType: "Tưới nhỏ giọt bù áp Israel" as IrrigationType,
    cultivationStandard: "VietGAP (Nông nghiệp sạch)" as CultivationStandard,
    crop: "Sầu riêng",
    variety: "Ri6 & Musang King",
    treeCount: 150,
    areaHa: 2.5
  },
  {
    title: "Vườn Bưởi Da Xanh & Cam Sành (Miền Tây)",
    name: "Vườn Bưởi Da Xanh Sông Tiền",
    location: "Châu Thành, Bến Tre",
    soilType: "Đất phù sa ngọt sông Tiền/sông Hậu" as SoilType,
    soilPH: 6.2,
    irrigationType: "Tưới phun mưa cục bộ dưới gốc" as IrrigationType,
    cultivationStandard: "Hữu cơ Sinh học (Organic 100%)" as CultivationStandard,
    crop: "Bưởi Da Xanh",
    variety: "Ruột hồng Bến Tre",
    treeCount: 180,
    areaHa: 1.8
  },
  {
    title: "Nông Trại Công Nghệ Cao (Đà Lạt / Lâm Đồng)",
    name: "Nông Trại Dâu Tây & Rau Quả Nhà Màng",
    location: "Lạc Dương, Lâm Đồng",
    soilType: "Đất mùn đồi núi dốc / Cao nguyên" as SoilType,
    soilPH: 6.0,
    irrigationType: "Tưới phun sương tự động nhà màng" as IrrigationType,
    cultivationStandard: "GlobalGAP (Xuất khẩu quốc tế)" as CultivationStandard,
    crop: "Dâu tây & Ớt chuông",
    variety: "Bạch Tuyết Pearl White",
    treeCount: 5000,
    areaHa: 1.2
  },
  {
    title: "Vườn Thanh Long Chong Đèn (Bình Thuận)",
    name: "Trang Trại Thanh Long Ruột Đỏ Hàm Thuận",
    location: "Hàm Thuận Nam, Bình Thuận",
    soilType: "Đất thịt nhẹ pha cát ven biển" as SoilType,
    soilPH: 5.8,
    irrigationType: "Tưới nhỏ giọt bù áp Israel" as IrrigationType,
    cultivationStandard: "VietGAP (Nông nghiệp sạch)" as CultivationStandard,
    crop: "Thanh Long",
    variety: "Ruột đỏ LĐ1",
    treeCount: 1200,
    areaHa: 3.0
  }
];

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

export const ModalNewGarden: React.FC<ModalNewGardenProps> = ({
  isOpen,
  onClose,
  onAddGarden,
}) => {
  const [name, setName] = useState("");
  const [ownerName, setOwnerName] = useState("");
  const [phone, setPhone] = useState("");
  const [location, setLocation] = useState("");
  const [totalAreaHa, setTotalAreaHa] = useState(2.0);
  const [soilType, setSoilType] = useState<SoilType>("Đất đỏ Bazan Tây Nguyên");
  const [soilPH, setSoilPH] = useState(5.8);
  const [irrigationType, setIrrigationType] = useState<IrrigationType>("Tưới nhỏ giọt bù áp Israel");
  const [cultivationStandard, setCultivationStandard] = useState<CultivationStandard>("VietGAP (Nông nghiệp sạch)");
  const [initialCrop, setInitialCrop] = useState("Sầu riêng");
  const [initialVariety, setInitialVariety] = useState("Ri6");
  const [initialTrees, setInitialTrees] = useState(120);

  if (!isOpen) return null;

  const applyTemplate = (t: typeof PRESET_TEMPLATES[0]) => {
    setName(t.name);
    setLocation(t.location);
    setSoilType(t.soilType);
    setSoilPH(t.soilPH);
    setIrrigationType(t.irrigationType);
    setCultivationStandard(t.cultivationStandard);
    setInitialCrop(t.crop);
    setInitialVariety(t.variety);
    setInitialTrees(t.treeCount);
    setTotalAreaHa(t.areaHa);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const newGardenId = `garden-${Date.now()}`;
    const newGarden: GardenProfile = {
      id: newGardenId,
      name,
      ownerName: ownerName || "Chủ vườn",
      phone: phone || "09xx xxx xxx",
      location: location || "Việt Nam",
      totalAreaHa: Number(totalAreaHa),
      soilType,
      soilPH: Number(soilPH),
      irrigationType,
      cultivationStandard,
      createdAt: new Date().toISOString().slice(0, 10),
      weatherStation: {
        tempC: 29.0,
        humidityPct: 80,
        condition: "Nắng gián đoạn",
        rainfallMm: 5,
        forecast: "Độ ẩm phù hợp sinh trưởng lá non."
      },
      plots: [
        {
          id: `plot-${Date.now()}-1`,
          name: `Lô 1 - ${initialCrop} ${initialVariety}`,
          cropName: initialCrop,
          variety: initialVariety,
          treeCount: Number(initialTrees),
          plantedYear: 2022,
          treeAgeYears: 4,
          stage: "Phát triển thân lá / Làm cơi đọt",
          areaM2: Number(totalAreaHa) * 10000,
          healthScore: 90,
          lastInspectionDate: new Date().toISOString().slice(0, 10)
        }
      ]
    };

    onAddGarden(newGarden);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-2xl w-full shadow-2xl border border-[#E2ECE2] animate-in fade-in zoom-in-95 duration-150 max-h-[90vh] overflow-y-auto space-y-6">
        
        <div className="flex items-start justify-between pb-3 border-b border-[#F0F5F0]">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E8F3E8] text-[#2D5A27] text-xs font-bold mb-1.5 border border-emerald-200">
              <Sprout className="w-3.5 h-3.5 text-[#2D5A27]" />
              <span>Thiết Lập Nhà Vườn Mới</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
              Cá Nhân Hoá Hồ Sơ Nhà Vườn
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 font-bold p-1 cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Quick Templates */}
        <div>
          <span className="text-xs font-bold text-[#527050] uppercase tracking-wider block mb-2.5">
            Chọn mẫu nhanh theo vùng miền & cây trồng:
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {PRESET_TEMPLATES.map((t, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => applyTemplate(t)}
                className="p-3.5 text-left rounded-2xl border border-[#E2ECE2] hover:border-[#2D5A27] bg-[#F9FBF9] hover:bg-[#E8F3E8]/50 transition text-xs group cursor-pointer"
              >
                <div className="font-bold text-slate-900 group-hover:text-[#2D5A27]">{t.title}</div>
                <div className="text-[11px] text-[#739270] mt-0.5">{t.location} • {t.crop}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Form Fields */}
        <form onSubmit={handleSubmit} className="space-y-4 text-xs sm:text-sm">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block font-bold text-slate-700 mb-1">Tên nhà vườn / Trang trại:</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ví dụ: Vườn Sầu Riêng Gia Đình Bác Năm..."
                className="w-full p-3 bg-[#F9FBF9] border border-[#E2ECE2] rounded-2xl outline-none focus:ring-2 focus:ring-[#2D5A27] font-semibold"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Họ tên chủ vườn:</label>
              <input
                type="text"
                value={ownerName}
                onChange={(e) => setOwnerName(e.target.value)}
                placeholder="Nguyễn Văn A"
                className="w-full p-3 bg-[#F9FBF9] border border-[#E2ECE2] rounded-2xl outline-none"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Số điện thoại liên hệ:</label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="0912 345 678"
                className="w-full p-3 bg-[#F9FBF9] border border-[#E2ECE2] rounded-2xl outline-none"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Địa phương (Tỉnh / Huyện):</label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Ví dụ: Cái Bè, Tiền Giang"
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
              <label className="block font-bold text-slate-700 mb-1">Chất đất đặc thù:</label>
              <select
                value={soilType}
                onChange={(e) => setSoilType(e.target.value as SoilType)}
                className="w-full p-3 bg-[#F9FBF9] border border-[#E2ECE2] rounded-2xl outline-none font-semibold cursor-pointer"
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
                className="w-full p-3 bg-[#F9FBF9] border border-[#E2ECE2] rounded-2xl outline-none font-semibold cursor-pointer"
              >
                {IRRIGATION_OPTIONS.map((it) => (
                  <option key={it} value={it}>
                    {it}
                  </option>
                ))}
              </select>
            </div>

            <div className="sm:col-span-2">
              <label className="block font-bold text-slate-700 mb-1">Tiêu chuẩn canh tác hướng tới:</label>
              <select
                value={cultivationStandard}
                onChange={(e) => setCultivationStandard(e.target.value as CultivationStandard)}
                className="w-full p-3 bg-[#F9FBF9] border border-[#E2ECE2] rounded-2xl outline-none font-semibold cursor-pointer"
              >
                {STANDARD_OPTIONS.map((cs) => (
                  <option key={cs} value={cs}>
                    {cs}
                  </option>
                ))}
              </select>
            </div>

            {/* Initial Plot setup */}
            <div className="sm:col-span-2 p-4 bg-[#F4F9F4] rounded-2xl border border-emerald-200 space-y-2.5">
              <span className="font-bold text-[#1E3F1A] block text-xs uppercase tracking-wider">
                Lô Cây Trồng Khởi Tạo Đầu Tiên:
              </span>
              <div className="grid grid-cols-3 gap-2.5">
                <div>
                  <label className="text-[11px] text-[#527050] block font-semibold">Cây trồng:</label>
                  <input
                    type="text"
                    value={initialCrop}
                    onChange={(e) => setInitialCrop(e.target.value)}
                    className="w-full p-2.5 bg-white border border-[#E2ECE2] rounded-xl text-xs outline-none font-semibold"
                  />
                </div>
                <div>
                  <label className="text-[11px] text-[#527050] block font-semibold">Giống:</label>
                  <input
                    type="text"
                    value={initialVariety}
                    onChange={(e) => setInitialVariety(e.target.value)}
                    className="w-full p-2.5 bg-white border border-[#E2ECE2] rounded-xl text-xs outline-none font-semibold"
                  />
                </div>
                <div>
                  <label className="text-[11px] text-[#527050] block font-semibold">Số lượng cây:</label>
                  <input
                    type="number"
                    value={initialTrees}
                    onChange={(e) => setInitialTrees(Number(e.target.value))}
                    className="w-full p-2.5 bg-white border border-[#E2ECE2] rounded-xl text-xs outline-none font-semibold"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-[#F0F5F0] flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 font-semibold text-slate-600 hover:bg-slate-100 rounded-2xl cursor-pointer"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 bg-[#2D5A27] hover:bg-[#1E3F1A] text-white font-bold rounded-2xl shadow-sm flex items-center gap-1.5 cursor-pointer"
            >
              <Check className="w-4 h-4" />
              <span>Khởi Tạo Nhà Vườn</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
