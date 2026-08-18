import React, { useState, useMemo, useRef } from "react";
import { 
  BookOpenCheck, 
  Plus, 
  Search, 
  Filter, 
  Printer, 
  Calendar, 
  FlaskConical, 
  Leaf, 
  CloudRain, 
  TrendingUp, 
  DollarSign, 
  CheckCircle,
  CheckCircle2,
  FileSpreadsheet,
  Download,
  Trash2,
  Package,
  Scale,
  Tag,
  Building2,
  Sparkles,
  Info,
  Calculator,
  Coins,
  Image as ImageIcon,
  Camera,
  UploadCloud,
  X,
  Maximize2,
  Eye
} from "lucide-react";
import { GardenProfile, FarmDiaryLog, LogCategory, TaskMaterialItem } from "../types";

interface FarmDiaryLogsProps {
  garden: GardenProfile;
  logs: FarmDiaryLog[];
  onAddLog: (log: FarmDiaryLog) => void;
  onDeleteLog: (id: string) => void;
}

interface FormMaterialItem {
  id: string;
  name: string;
  dosage: string;
  costVND: string | number;
}

const CATEGORY_MAP: Record<LogCategory, { label: string; icon: any; color: string }> = {
  treatment: { label: "Xử lý thuốc / Sinh học", icon: FlaskConical, color: "bg-rose-50 text-rose-700 border-rose-200" },
  fertilizing: { label: "Bón phân / Dinh dưỡng", icon: Leaf, color: "bg-emerald-50 text-emerald-700 border-emerald-200" },
  harvest: { label: "Thu hoạch & Xuất bán", icon: TrendingUp, color: "bg-amber-50 text-amber-700 border-amber-200" },
  soil_test: { label: "Đo kiểm tra Đất & Nước", icon: FlaskConical, color: "bg-cyan-50 text-cyan-700 border-cyan-200" },
  weather_event: { label: "Hiện tượng thời tiết", icon: CloudRain, color: "bg-blue-50 text-blue-700 border-blue-200" },
  inspection: { label: "Giám sát định kỳ", icon: CheckCircle, color: "bg-purple-50 text-purple-700 border-purple-200" },
  general: { label: "Ghi chép chung", icon: BookOpenCheck, color: "bg-slate-50 text-slate-700 border-slate-200" }
};

const POPULAR_MATERIALS = [
  "Phân hữu cơ khoáng Bounce Back (Úc)",
  "Phân bón NPK Đầu Trâu 20-20-15+TE",
  "Axit Humic 85% Kích rễ tơ",
  "Phân Kali Sunfat (K2SO4) hữu cơ",
  "Nấm đối kháng Trichoderma Harzianum",
  "Vôi nông nghiệp Dolomite khử chua",
  "Thuốc trừ bệnh Amistar Top 325SC",
  "Chế phẩm Nano Bạc Đồng Sinh Học",
  "Phân bón lá Canxi Bo dẻo cuống"
];

const COMMON_UNITS = [
  "kg",
  "bao (25kg)",
  "bao (50kg)",
  "lít",
  "chai (250ml)",
  "chai (500ml)",
  "chai (1L)",
  "can (5L)",
  "gói (100g)",
  "gói (500g)",
  "tấn"
];

export const FarmDiaryLogs: React.FC<FarmDiaryLogsProps> = ({
  garden,
  logs,
  onAddLog,
  onDeleteLog,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCat, setSelectedCat] = useState<string>("all");
  const [selectedPlot, setSelectedPlot] = useState<string>("all");
  const [showAddModal, setShowAddModal] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // New Log Form State
  const [logTitle, setLogTitle] = useState("");
  const [logCat, setLogCat] = useState<LogCategory>("fertilizing");
  const [logPlotId, setLogPlotId] = useState(garden.plots[0]?.id || "");
  const [logDate, setLogDate] = useState(new Date().toISOString().slice(0, 10));
  const [logDetails, setLogDetails] = useState("");
  const [logOperator, setLogOperator] = useState(garden.ownerName || "Chủ vườn");
  
  // Materials List with 3 distinct fields: Name, Dosage, Cost
  const [materialsList, setMaterialsList] = useState<FormMaterialItem[]>([
    { id: "mat-1", name: "", dosage: "", costVND: "" }
  ]);

  const handleAddMaterialRow = () => {
    setMaterialsList((prev) => [
      ...prev,
      { id: `mat-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`, name: "", dosage: "", costVND: "" }
    ]);
  };

  const handleRemoveMaterialRow = (index: number) => {
    if (materialsList.length <= 1) {
      setMaterialsList([{ id: `mat-${Date.now()}`, name: "", dosage: "", costVND: "" }]);
      return;
    }
    setMaterialsList((prev) => prev.filter((_, i) => i !== index));
  };

  const handleMaterialChange = (index: number, field: keyof FormMaterialItem, value: any) => {
    setMaterialsList((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  const totalMaterialsCost = useMemo(() => {
    return materialsList.reduce((acc, m) => {
      const cost = typeof m.costVND === "number" ? m.costVND : Number(m.costVND) || 0;
      return acc + (isNaN(cost) ? 0 : Math.max(0, cost));
    }, 0);
  }, [materialsList]);

  // Traceability & details
  const [logSupplier, setLogSupplier] = useState<string>("");
  const [logBatchNumber, setLogBatchNumber] = useState<string>("");

  // Technical metrics
  const [logSoilPH, setLogSoilPH] = useState<string>("");
  const [logMoisture, setLogMoisture] = useState<string>("");
  const [logYield, setLogYield] = useState<string>("");

  // Image Upload State for Log Form
  const [logImages, setLogImages] = useState<string[]>([]);
  const [isDraggingImage, setIsDraggingImage] = useState(false);
  const [activeLightbox, setActiveLightbox] = useState<{ url: string; title?: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const processImageFiles = (files: FileList | File[]) => {
    const fileArray = Array.from(files).filter(f => f.type.startsWith("image/"));
    if (fileArray.length === 0) return;

    fileArray.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === "string") {
          setLogImages(prev => [...prev, reader.result as string]);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const handleImageFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processImageFiles(e.target.files);
      // Reset input value so re-selecting same file triggers event
      e.target.value = "";
    }
  };

  const handleImageDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDraggingImage(true);
  };

  const handleImageDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDraggingImage(false);
  };

  const handleImageDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDraggingImage(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processImageFiles(e.dataTransfer.files);
    }
  };

  const handleRemoveImage = (indexToRemove: number) => {
    setLogImages(prev => prev.filter((_, idx) => idx !== indexToRemove));
  };

  // Synchronize plot and operator when garden changes
  React.useEffect(() => {
    if (garden.plots && garden.plots.length > 0) {
      setLogPlotId(garden.plots[0].id);
    }
    setLogOperator(garden.ownerName || "Chủ vườn");
  }, [garden.id, garden.ownerName]);

  const farmLogs = logs.filter((l) => l.farmId === garden.id);

  const filteredLogs = farmLogs.filter((l) => {
    if (selectedCat !== "all" && l.category !== selectedCat) return false;
    if (selectedPlot !== "all" && l.plotId !== selectedPlot) return false;
    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      const matchMaterials = l.materials?.some((m) => 
        m.name.toLowerCase().includes(q) || m.dosage.toLowerCase().includes(q)
      );
      return (
        l.title.toLowerCase().includes(q) ||
        l.details.toLowerCase().includes(q) ||
        l.operatorName.toLowerCase().includes(q) ||
        (l.materialName && l.materialName.toLowerCase().includes(q)) ||
        (l.supplier && l.supplier.toLowerCase().includes(q)) ||
        Boolean(matchMaterials)
      );
    }
    return true;
  });

  // Calculate stats
  const totalCost = farmLogs.reduce((acc, l) => {
    if (l.materials && l.materials.length > 0) {
      const matTotal = l.materials.reduce((s, m) => s + (m.costVND || 0), 0);
      if (matTotal > 0) return acc + matTotal;
    }
    if (l.quantity && l.unitPriceVND) {
      return acc + (l.quantity * l.unitPriceVND);
    }
    return acc + (l.metrics?.costVND || 0);
  }, 0);

  const fertilizerLogs = farmLogs.filter(l => l.category === "fertilizing");
  const fertilizerCost = fertilizerLogs.reduce((acc, l) => {
    if (l.materials && l.materials.length > 0) {
      const matTotal = l.materials.reduce((s, m) => s + (m.costVND || 0), 0);
      if (matTotal > 0) return acc + matTotal;
    }
    if (l.quantity && l.unitPriceVND) {
      return acc + (l.quantity * l.unitPriceVND);
    }
    return acc + (l.metrics?.costVND || 0);
  }, 0);

  const totalYield = farmLogs.reduce((acc, l) => acc + (l.metrics?.yieldKg || 0), 0);

  const handleOpenAddModal = (cat: LogCategory = "fertilizing") => {
    setLogCat(cat);
    setLogPlotId(garden.plots[0]?.id || "");
    setLogDate(new Date().toISOString().slice(0, 10));
    setLogOperator(garden.ownerName || "Chủ vườn");
    setMaterialsList([{ id: `mat-${Date.now()}`, name: "", dosage: "", costVND: "" }]);
    setLogImages([]);
    setShowAddModal(true);
  };

  const handleCreateLog = (e: React.FormEvent) => {
    e.preventDefault();

    // Filter valid materials
    const validMaterials: TaskMaterialItem[] = materialsList
      .map((m) => ({
        name: m.name.trim(),
        dosage: m.dosage.trim(),
        costVND: m.costVND !== "" && !isNaN(Number(m.costVND)) ? Math.max(0, Number(m.costVND)) : undefined
      }))
      .filter((m) => m.name !== "" || m.dosage !== "" || (m.costVND !== undefined && m.costVND > 0));

    let combinedMaterialName = "";
    if (validMaterials.length > 0) {
      combinedMaterialName = validMaterials
        .map((m) => {
          if (m.name && m.dosage) return `${m.name} (${m.dosage})`;
          if (m.name) return m.name;
          return m.dosage;
        })
        .join(", ");
    }

    const calculatedCost = totalMaterialsCost > 0 ? totalMaterialsCost : undefined;

    // Auto-generate title and details if empty
    const derivedTitle = logTitle.trim() 
      || (combinedMaterialName ? `Bón ${combinedMaterialName}` : `Nhật ký ${CATEGORY_MAP[logCat]?.label || "canh tác"}`);

    const derivedDetails = logDetails.trim() 
      || (combinedMaterialName ? `Sử dụng ${combinedMaterialName}.${logSupplier.trim() ? ` Đơn vị cung cấp: ${logSupplier.trim()}.` : ""}` : derivedTitle);

    const targetPlot = logPlotId || garden.plots[0]?.id || "plot-all";

    const newLog: FarmDiaryLog = {
      id: `log-${Date.now()}`,
      farmId: garden.id,
      plotId: targetPlot,
      date: logDate || new Date().toISOString().slice(0, 10),
      category: logCat,
      title: derivedTitle,
      details: derivedDetails,
      materialName: combinedMaterialName || undefined,
      materials: validMaterials.length > 0 ? validMaterials : undefined,
      supplier: logSupplier.trim() || undefined,
      batchNumber: logBatchNumber.trim() || undefined,
      operatorName: logOperator.trim() || garden.ownerName || "Chủ vườn",
      images: logImages.length > 0 ? logImages : undefined,
      metrics: {
        soilPH: logSoilPH ? parseFloat(logSoilPH) : undefined,
        soilMoisture: logMoisture ? parseFloat(logMoisture) : undefined,
        costVND: calculatedCost,
        yieldKg: logYield ? parseFloat(logYield) : undefined
      }
    };

    onAddLog(newLog);
    
    // Reset filters so the user immediately sees the newly added log at the top of the list!
    setSelectedCat("all");
    setSelectedPlot("all");
    setSearchTerm("");
    
    setShowAddModal(false);
    setToastMessage(`Đã lưu thành công nhật ký: "${derivedTitle}"!`);
    setTimeout(() => setToastMessage(null), 4000);
    
    // Reset form
    setLogTitle("");
    setLogDetails("");
    setMaterialsList([{ id: `mat-${Date.now()}`, name: "", dosage: "", costVND: "" }]);
    setLogSupplier("");
    setLogBatchNumber("");
    setLogSoilPH("");
    setLogMoisture("");
    setLogYield("");
    setLogImages([]);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header Bento Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-7 border border-[#E2ECE2] shadow-[0_4px_20px_-4px_rgba(45,90,39,0.06)] flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E8F3E8] text-[#2D5A27] text-xs font-bold mb-2.5 border border-emerald-200">
            <BookOpenCheck className="w-3.5 h-3.5 text-[#2D5A27]" />
            <span>Sổ Tay Canh Tác Điện Tử Chuẩn {garden.cultivationStandard.split(" ")[0]}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Nhật Ký Canh Tác & Minh Bạch Vật Tư
          </h1>
          <p className="text-[#527050] text-xs sm:text-sm mt-1.5 leading-relaxed max-w-2xl">
            Ghi chép chi tiết từng đợt bón phân, tên vật tư, số lượng, đơn giá thành tiền và nhà cung cấp để phục vụ truy xuất nguồn gốc nông sản.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
          <button
            type="button"
            onClick={handlePrint}
            className="px-4 py-3 bg-[#F4F9F4] hover:bg-[#E8F3E8] text-[#2D5A27] font-semibold text-xs sm:text-sm rounded-2xl border border-[#E2ECE2] flex items-center gap-2 transition cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span>In Báo Cáo Sổ Canh Tác</span>
          </button>

          <button
            id="open-add-log-modal-btn"
            type="button"
            onClick={() => handleOpenAddModal("fertilizing")}
            className="px-5 py-3 bg-[#2D5A27] hover:bg-[#1E3F1A] text-white font-bold text-xs sm:text-sm rounded-2xl shadow-md flex items-center gap-2 transition cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Ghi Nhật Ký / Bón Phân Mới</span>
          </button>
        </div>
      </div>

      {/* Success Toast Banner */}
      {toastMessage && (
        <div className="bg-[#E8F3E8] border border-[#A3D99E] text-[#1E3F1A] px-5 py-3.5 rounded-2xl flex items-center justify-between shadow-sm animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="flex items-center gap-2 text-xs sm:text-sm font-semibold">
            <CheckCircle className="w-4 h-4 text-[#2D5A27]" />
            <span>{toastMessage}</span>
          </div>
          <button
            type="button"
            onClick={() => setToastMessage(null)}
            className="text-[#527050] hover:text-[#1E3F1A] font-bold text-sm cursor-pointer p-1"
          >
            ✕
          </button>
        </div>
      )}

      {/* 4 Bento Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white rounded-3xl p-5 sm:p-6 border border-[#E2ECE2] shadow-[0_4px_20px_-4px_rgba(45,90,39,0.06)] flex flex-col justify-between">
          <span className="text-xs text-[#527050] font-bold uppercase tracking-wider">Tổng Số Bản Ghi</span>
          <div className="text-3xl font-extrabold text-slate-900 mt-2">{farmLogs.length} <span className="text-sm font-medium text-[#739270]">lần ghi</span></div>
          <div className="text-[11px] text-[#2D5A27] font-semibold mt-2 flex items-center gap-1">
            <CheckCircle className="w-3.5 h-3.5" /> Đầy đủ số liệu minh chứng
          </div>
        </div>

        <div className="bg-white rounded-3xl p-5 sm:p-6 border border-[#E2ECE2] shadow-[0_4px_20px_-4px_rgba(45,90,39,0.06)] flex flex-col justify-between">
          <span className="text-xs text-[#527050] font-bold uppercase tracking-wider">Chi Phí Phân Bón & Dinh Dưỡng</span>
          <div className="text-2xl sm:text-3xl font-extrabold text-emerald-800 mt-2">
            {fertilizerCost > 0 ? `${fertilizerCost.toLocaleString()} đ` : "0 đ"}
          </div>
          <div className="text-[11px] text-[#527050] mt-2 flex items-center gap-1 font-medium">
            <Leaf className="w-3.5 h-3.5 text-emerald-600" />
            <span>{fertilizerLogs.length} lần bón phân / dưỡng rễ</span>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-5 sm:p-6 border border-[#E2ECE2] shadow-[0_4px_20px_-4px_rgba(45,90,39,0.06)] flex flex-col justify-between">
          <span className="text-xs text-[#527050] font-bold uppercase tracking-wider">Tổng Chi Phí Tất Cả Vật Tư</span>
          <div className="text-2xl sm:text-3xl font-extrabold text-amber-700 mt-2">
            {totalCost > 0 ? `${totalCost.toLocaleString()} đ` : "0 đ"}
          </div>
          <div className="text-[11px] text-[#739270] mt-2">Phân bón, BVTV sinh học, vôi, vi sinh</div>
        </div>

        <div className="bg-white rounded-3xl p-5 sm:p-6 border border-[#E2ECE2] shadow-[0_4px_20px_-4px_rgba(45,90,39,0.06)] flex flex-col justify-between">
          <span className="text-xs text-[#527050] font-bold uppercase tracking-wider">Sản Lượng Đã Thu Hoạch</span>
          <div className="text-3xl font-extrabold text-[#2D5A27] mt-2">
            {totalYield > 0 ? `${totalYield.toLocaleString()} kg` : "0 kg"}
          </div>
          <div className="text-[11px] text-[#739270] mt-2">Theo hồ sơ xuất kho</div>
        </div>
      </div>

      {/* Quick Category Chips */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        <button
          type="button"
          onClick={() => setSelectedCat("all")}
          className={`px-4 py-2 rounded-2xl text-xs font-bold transition whitespace-nowrap cursor-pointer ${
            selectedCat === "all"
              ? "bg-[#2D5A27] text-white shadow-sm"
              : "bg-white text-slate-700 hover:bg-[#E8F3E8] border border-[#E2ECE2]"
          }`}
        >
          Tất cả ({farmLogs.length})
        </button>

        <button
          type="button"
          onClick={() => setSelectedCat("fertilizing")}
          className={`px-4 py-2 rounded-2xl text-xs font-bold transition flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
            selectedCat === "fertilizing"
              ? "bg-emerald-700 text-white shadow-sm"
              : "bg-white text-emerald-800 hover:bg-emerald-50 border border-emerald-200"
          }`}
        >
          <Leaf className="w-3.5 h-3.5" />
          <span>Bón phân & Dinh dưỡng ({fertilizerLogs.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setSelectedCat("treatment")}
          className={`px-4 py-2 rounded-2xl text-xs font-bold transition flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
            selectedCat === "treatment"
              ? "bg-rose-700 text-white shadow-sm"
              : "bg-white text-rose-800 hover:bg-rose-50 border border-rose-200"
          }`}
        >
          <FlaskConical className="w-3.5 h-3.5" />
          <span>Xử lý thuốc / Sinh học ({farmLogs.filter(l => l.category === "treatment").length})</span>
        </button>

        <button
          type="button"
          onClick={() => setSelectedCat("soil_test")}
          className={`px-4 py-2 rounded-2xl text-xs font-bold transition flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
            selectedCat === "soil_test"
              ? "bg-cyan-700 text-white shadow-sm"
              : "bg-white text-cyan-800 hover:bg-cyan-50 border border-cyan-200"
          }`}
        >
          <FlaskConical className="w-3.5 h-3.5" />
          <span>Đo Đất & Nước ({farmLogs.filter(l => l.category === "soil_test").length})</span>
        </button>

        <button
          type="button"
          onClick={() => setSelectedCat("harvest")}
          className={`px-4 py-2 rounded-2xl text-xs font-bold transition flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
            selectedCat === "harvest"
              ? "bg-amber-700 text-white shadow-sm"
              : "bg-white text-amber-800 hover:bg-amber-50 border border-amber-200"
          }`}
        >
          <TrendingUp className="w-3.5 h-3.5" />
          <span>Thu hoạch ({farmLogs.filter(l => l.category === "harvest").length})</span>
        </button>
      </div>

      {/* Filter & Search Bento Bar */}
      <div className="bg-white rounded-3xl p-4 sm:p-5 border border-[#E2ECE2] shadow-[0_4px_20px_-4px_rgba(45,90,39,0.06)] flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="relative w-full md:w-96">
          <Search className="w-4 h-4 text-[#739270] absolute left-3.5 top-3.5" />
          <input
            type="text"
            placeholder="Tìm theo tên vật tư, phân bón, nội dung, người làm..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-3.5 py-2.5 text-xs sm:text-sm bg-[#F9FBF9] border border-[#E2ECE2] rounded-2xl outline-none focus:ring-2 focus:ring-[#2D5A27]"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
          <select
            value={selectedPlot}
            onChange={(e) => setSelectedPlot(e.target.value)}
            className="bg-[#F9FBF9] border border-[#E2ECE2] text-xs sm:text-sm text-slate-700 font-semibold px-3.5 py-2.5 rounded-2xl outline-none cursor-pointer"
          >
            <option value="all">Tất cả Lô vườn</option>
            {garden.plots.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>

          <select
            value={selectedCat}
            onChange={(e) => setSelectedCat(e.target.value)}
            className="bg-[#F9FBF9] border border-[#E2ECE2] text-xs sm:text-sm text-slate-700 font-semibold px-3.5 py-2.5 rounded-2xl outline-none cursor-pointer"
          >
            <option value="all">Tất cả hạng mục</option>
            {Object.entries(CATEGORY_MAP).map(([k, v]) => (
              <option key={k} value={k}>
                {v.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Logs Table / Bento Card List */}
      <div className="bg-white rounded-3xl border border-[#E2ECE2] shadow-[0_4px_20px_-4px_rgba(45,90,39,0.06)] overflow-hidden">
        <div className="divide-y divide-[#F0F5F0]">
          {filteredLogs.map((log) => {
            const cat = CATEGORY_MAP[log.category] || CATEGORY_MAP.general;
            const CatIcon = cat.icon;
            const plotObj = garden.plots.find((p) => p.id === log.plotId);
            const calculatedTotal = (log.quantity && log.unitPriceVND)
              ? log.quantity * log.unitPriceVND
              : log.metrics?.costVND;

            return (
              <div key={log.id} className="p-5 sm:p-6 hover:bg-[#F9FBF9] transition flex flex-col sm:flex-row items-start justify-between gap-4">
                <div className="space-y-2.5 flex-1 w-full">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className={`text-[11px] font-bold px-3 py-0.5 rounded-full border flex items-center gap-1.5 ${cat.color}`}>
                      <CatIcon className="w-3 h-3" />
                      <span>{cat.label}</span>
                    </span>

                    <span className="text-xs font-semibold text-slate-700 bg-[#F4F9F4] px-2.5 py-0.5 rounded-full border border-[#E2ECE2]">
                      {plotObj?.name || "Toàn vườn"}
                    </span>

                    <span className="text-xs text-[#739270] flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-[#739270]" />
                      <span>{log.date}</span>
                    </span>

                    {(log.id.startsWith("log-sync-task-") || log.details.includes("[Tự động đồng bộ")) && (
                      <span className="text-[10px] font-bold text-[#1E3F1A] bg-[#E8F3E8] px-2.5 py-0.5 rounded-full border border-emerald-200 flex items-center gap-1">
                        <Sparkles className="w-3 h-3 text-[#2D5A27]" />
                        <span>Đồng bộ từ Lịch Phác Đồ</span>
                      </span>
                    )}
                  </div>

                  <h3 className="text-base font-bold text-slate-900">
                    {log.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-[#527050] leading-relaxed">
                    {log.details}
                  </p>

                  {/* PROMINENT MATERIAL & FERTILIZER INFORMATION BOX */}
                  {(log.materials && log.materials.length > 0) ? (
                    <div className="bg-[#F4F9F4] border border-[#D0E5D0] rounded-2xl p-3.5 sm:p-4 my-2 text-xs space-y-2.5">
                      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#E2ECE2] pb-2">
                        <div className="flex items-center gap-2 font-bold text-[#1E3F1A]">
                          <Package className="w-4 h-4 text-[#2D5A27]" />
                          <span className="text-xs sm:text-sm">Chi Tiết Vật Tư Sử Dụng ({log.materials.length} mục)</span>
                        </div>
                        {calculatedTotal !== undefined && calculatedTotal > 0 && (
                          <div className="text-xs sm:text-sm font-extrabold text-emerald-900 bg-white px-2.5 py-1 rounded-xl border border-[#D0E5D0]">
                            Tổng chi phí: {calculatedTotal.toLocaleString("vi-VN")} đ
                          </div>
                        )}
                      </div>

                      <div className="space-y-2">
                        {log.materials.map((mat, idx) => (
                          <div
                            key={idx}
                            className="bg-white p-2.5 rounded-xl border border-[#E2ECE2] flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs shadow-2xs"
                          >
                            <div className="flex flex-wrap items-center gap-2">
                              <span className="w-5 h-5 rounded-lg bg-[#E8F3E8] text-[#2D5A27] font-bold text-[11px] flex items-center justify-center shrink-0">
                                {idx + 1}
                              </span>
                              <span className="font-bold text-slate-800 text-xs sm:text-sm">{mat.name}</span>
                              {mat.dosage && (
                                <span className="text-[#527050] bg-[#F4F9F4] px-2 py-0.5 rounded-md font-medium text-[11px] border border-[#E2ECE2]">
                                  Liều lượng / Định mức: {mat.dosage}
                                </span>
                              )}
                            </div>
                            {mat.costVND !== undefined && mat.costVND > 0 && (
                              <div className="text-[#2D5A27] font-extrabold text-xs bg-[#E8F3E8] px-2.5 py-1 rounded-lg border border-[#A3D99E] self-end sm:self-auto">
                                {mat.costVND.toLocaleString("vi-VN")} đ
                              </div>
                            )}
                          </div>
                        ))}
                      </div>

                      {(log.supplier || log.batchNumber) && (
                        <div className="flex flex-wrap items-center gap-3 pt-1 text-[11px] text-[#527050] border-t border-[#E2ECE2]">
                          {log.supplier && (
                            <span>
                              Đại lý / Nguồn gốc: <strong className="text-slate-700">{log.supplier}</strong>
                            </span>
                          )}
                          {log.batchNumber && (
                            <span>
                              Mã lô VietGAP: <strong className="font-mono text-slate-700">{log.batchNumber}</strong>
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  ) : log.materialName ? (
                    <div className="bg-[#F4F9F4] border border-[#D0E5D0] rounded-2xl p-3.5 sm:p-4 my-2 text-xs space-y-2.5">
                      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#E2ECE2] pb-2">
                        <div className="flex items-center gap-2 font-bold text-[#1E3F1A]">
                          <Package className="w-4 h-4 text-[#2D5A27]" />
                          <span className="text-xs sm:text-sm">{log.materialName}</span>
                        </div>
                        {calculatedTotal !== undefined && calculatedTotal > 0 && (
                          <div className="text-xs sm:text-sm font-extrabold text-emerald-900 bg-white px-2.5 py-1 rounded-xl border border-[#D0E5D0]">
                            Thành tiền: {calculatedTotal.toLocaleString("vi-VN")} đ
                          </div>
                        )}
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-0.5 text-slate-700">
                        {log.quantity !== undefined && (
                          <div className="bg-white/80 p-2 rounded-xl border border-[#E2ECE2]">
                            <span className="text-[10px] text-[#739270] block font-semibold">Số lượng sử dụng</span>
                            <span className="font-bold text-slate-900 text-xs">
                              {log.quantity} {log.unit || "kg"}
                            </span>
                          </div>
                        )}

                        {log.unitPriceVND !== undefined && (
                          <div className="bg-white/80 p-2 rounded-xl border border-[#E2ECE2]">
                            <span className="text-[10px] text-[#739270] block font-semibold">Đơn giá vật tư</span>
                            <span className="font-bold text-slate-900 text-xs">
                              {log.unitPriceVND.toLocaleString("vi-VN")} đ/{log.unit || "đơn vị"}
                            </span>
                          </div>
                        )}

                        {log.supplier && (
                          <div className="bg-white/80 p-2 rounded-xl border border-[#E2ECE2] col-span-2 sm:col-span-1">
                            <span className="text-[10px] text-[#739270] block font-semibold">Nhà cung cấp</span>
                            <span className="font-semibold text-slate-800 text-xs truncate block" title={log.supplier}>
                              {log.supplier}
                            </span>
                          </div>
                        )}

                        {log.batchNumber && (
                          <div className="bg-white/80 p-2 rounded-xl border border-[#E2ECE2] col-span-2 sm:col-span-1">
                            <span className="text-[10px] text-[#739270] block font-semibold">Số lô / Mã</span>
                            <span className="font-mono text-slate-800 text-xs">
                              {log.batchNumber}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  ) : null}

                  {/* Photo Gallery if images exist */}
                  {log.images && log.images.length > 0 && (
                    <div className="space-y-1.5 pt-1">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
                        <ImageIcon className="w-3.5 h-3.5 text-[#2D5A27]" />
                        <span>Hình ảnh hiện trường ({log.images.length} ảnh):</span>
                      </div>
                      <div className="flex flex-wrap items-center gap-2">
                        {log.images.map((imgUrl, imgIdx) => (
                          <div
                            key={imgIdx}
                            onClick={() => setActiveLightbox({ url: imgUrl, title: `${log.title} (Ảnh ${imgIdx + 1}/${log.images?.length})` })}
                            className="group relative w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden border border-[#D0E5D0] bg-slate-100 cursor-pointer shadow-2xs hover:shadow-md transition"
                          >
                            <img
                              src={imgUrl}
                              alt={`Hình ảnh ${log.title} ${imgIdx + 1}`}
                              className="w-full h-full object-cover group-hover:scale-105 transition duration-200"
                            />
                            <div className="absolute inset-0 bg-black/25 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
                              <Maximize2 className="w-4 h-4 text-white drop-shadow" />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Metrics Badges */}
                  <div className="flex flex-wrap items-center gap-2 text-xs pt-1">
                    {log.metrics?.soilPH !== undefined && (
                      <span className="bg-cyan-50 text-cyan-800 font-semibold px-2.5 py-0.5 rounded-lg border border-cyan-200">
                        pH Đất: {log.metrics.soilPH}
                      </span>
                    )}
                    {log.metrics?.soilMoisture !== undefined && (
                      <span className="bg-blue-50 text-blue-800 font-semibold px-2.5 py-0.5 rounded-lg border border-blue-200">
                        Độ ẩm: {log.metrics.soilMoisture}%
                      </span>
                    )}
                    {!log.materialName && !log.materials?.length && log.metrics?.costVND !== undefined && (
                      <span className="bg-amber-50 text-amber-800 font-semibold px-2.5 py-0.5 rounded-lg border border-amber-200">
                        Chi phí: {log.metrics.costVND.toLocaleString("vi-VN")} đ
                      </span>
                    )}
                    {log.metrics?.yieldKg !== undefined && (
                      <span className="bg-[#E8F3E8] text-[#2D5A27] font-semibold px-2.5 py-0.5 rounded-lg border border-emerald-200">
                        Sản lượng thu: {log.metrics.yieldKg} kg
                      </span>
                    )}
                    <span className="text-[#739270] text-xs">
                      Người phụ trách: <strong className="text-slate-800">{log.operatorName}</strong>
                    </span>
                  </div>
                </div>

                <div className="shrink-0 self-end sm:self-center">
                  <button
                    type="button"
                    onClick={() => onDeleteLog(log.id)}
                    className="p-2.5 text-slate-400 hover:text-rose-600 rounded-xl hover:bg-rose-50 transition cursor-pointer"
                    title="Xoá bản ghi"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}

          {filteredLogs.length === 0 && (
            <div className="p-14 text-center text-xs text-[#739270] space-y-3">
              <BookOpenCheck className="w-12 h-12 text-[#A3D99E] mx-auto" />
              <p className="text-sm font-medium">Chưa có nhật ký canh tác nào khớp với bộ lọc.</p>
            </div>
          )}
        </div>
      </div>

      {/* MODAL: New Log Entry */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <form
            onSubmit={handleCreateLog}
            className="bg-white rounded-3xl p-6 sm:p-8 max-w-2xl w-full shadow-2xl border border-[#E2ECE2] animate-in fade-in zoom-in-95 duration-150 space-y-4 text-xs sm:text-sm my-8 max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-start justify-between pb-2 border-b border-[#F0F5F0]">
              <div>
                <h3 className="text-lg font-bold text-slate-900">
                  Ghi Nhật Ký Canh Tác / Bón Phân Mới
                </h3>
                <p className="text-xs text-[#527050] mt-0.5">
                  Cập nhật đầy đủ danh mục vật tư, liều lượng và chi phí theo tiêu chuẩn VietGAP & GlobalGAP
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-slate-600 font-bold text-base cursor-pointer p-1"
              >
                ✕
              </button>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Tiêu đề hoạt động:</label>
              <input
                type="text"
                value={logTitle}
                onChange={(e) => setLogTitle(e.target.value)}
                placeholder="Ví dụ: Bón phân hữu cơ vi sinh Bounce Back đợt 2... (Tự tạo nếu để trống)"
                className="w-full p-3 bg-[#F9FBF9] border border-[#E2ECE2] rounded-2xl outline-none focus:ring-2 focus:ring-[#2D5A27] font-medium text-xs sm:text-sm"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Phân loại:</label>
                <select
                  value={logCat}
                  onChange={(e) => setLogCat(e.target.value as LogCategory)}
                  className="w-full p-3 bg-[#F9FBF9] border border-[#E2ECE2] rounded-2xl outline-none cursor-pointer text-xs sm:text-sm"
                >
                  {Object.entries(CATEGORY_MAP).map(([k, v]) => (
                    <option key={k} value={k}>
                      {v.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Lô canh tác:</label>
                <select
                  value={logPlotId}
                  onChange={(e) => setLogPlotId(e.target.value)}
                  className="w-full p-3 bg-[#F9FBF9] border border-[#E2ECE2] rounded-2xl outline-none cursor-pointer text-xs sm:text-sm"
                >
                  {garden.plots.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} ({p.cropName})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* SEPARATED MATERIALS SECTION: 3 INPUTS (NAME, DOSAGE, COST) + DYNAMIC ROWS + TOTAL COST */}
            <div className="p-4 bg-[#F4F9F4] rounded-2xl border border-[#D5E8D5] space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Package className="w-4 h-4 text-[#2D5A27]" />
                  <label className="font-bold text-slate-800 text-xs sm:text-sm">
                    Vật Tư, Phân Bón & Thuốc BVTV
                  </label>
                </div>
                <button
                  type="button"
                  onClick={handleAddMaterialRow}
                  className="inline-flex items-center gap-1 text-xs font-bold text-[#2D5A27] hover:text-[#1E3F1A] bg-white hover:bg-[#E8F3E8] px-3 py-1.5 rounded-xl border border-[#A3D99E] shadow-2xs transition cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Thêm vật tư</span>
                </button>
              </div>

              {/* Quick suggestion chips */}
              <div className="flex flex-wrap items-center gap-1.5 pb-1">
                <span className="text-[11px] text-[#527050] font-medium flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-[#2D5A27]" /> Gợi ý nhanh:
                </span>
                {POPULAR_MATERIALS.slice(0, 5).map((m) => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => {
                      setMaterialsList((prev) => {
                        const emptyIdx = prev.findIndex((item) => !item.name.trim());
                        if (emptyIdx >= 0) {
                          const updated = [...prev];
                          updated[emptyIdx] = { ...updated[emptyIdx], name: m };
                          return updated;
                        }
                        return [
                          ...prev,
                          { id: `mat-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`, name: m, dosage: "", costVND: "" }
                        ];
                      });
                    }}
                    className="text-[11px] bg-white hover:bg-[#E8F3E8] text-[#2D5A27] px-2.5 py-0.5 rounded-lg border border-[#D0E5D0] transition cursor-pointer"
                  >
                    {m}
                  </button>
                ))}
              </div>

              <div className="space-y-2.5 max-h-56 overflow-y-auto pr-0.5">
                {materialsList.map((item, idx) => (
                  <div
                    key={item.id}
                    className="p-3 bg-white rounded-2xl border border-[#E2ECE2] shadow-2xs space-y-2"
                  >
                    <div className="grid grid-cols-1 sm:grid-cols-12 gap-2.5 items-end">
                      {/* 1. Tên Vật Tư */}
                      <div className="sm:col-span-5">
                        <label className="block text-[11px] font-bold text-slate-600 mb-1">
                          Tên Vật Tư #{idx + 1}:
                        </label>
                        <input
                          type="text"
                          value={item.name}
                          onChange={(e) => handleMaterialChange(idx, "name", e.target.value)}
                          placeholder="Ví dụ: NPK 20-20-15, Trichoderma..."
                          className="w-full p-2.5 text-xs bg-[#F9FBF9] border border-[#E2ECE2] rounded-xl outline-none focus:ring-2 focus:ring-[#2D5A27]"
                        />
                      </div>

                      {/* 2. Liều Lượng */}
                      <div className="sm:col-span-4">
                        <label className="block text-[11px] font-bold text-slate-600 mb-1">
                          Liều Lượng / Số Lượng:
                        </label>
                        <input
                          type="text"
                          value={item.dosage}
                          onChange={(e) => handleMaterialChange(idx, "dosage", e.target.value)}
                          placeholder="500g/gốc, 50kg, 250ml/200L..."
                          className="w-full p-2.5 text-xs bg-[#F9FBF9] border border-[#E2ECE2] rounded-xl outline-none focus:ring-2 focus:ring-[#2D5A27]"
                        />
                      </div>

                      {/* 3. Chi Phí */}
                      <div className="sm:col-span-3 flex items-end gap-1.5">
                        <div className="flex-1">
                          <label className="block text-[11px] font-bold text-slate-600 mb-1">
                            Chi Phí (VNĐ):
                          </label>
                          <input
                            type="number"
                            min="0"
                            step="1000"
                            value={item.costVND}
                            onChange={(e) => handleMaterialChange(idx, "costVND", e.target.value)}
                            placeholder="85000"
                            className="w-full p-2.5 text-xs bg-[#F9FBF9] border border-[#E2ECE2] rounded-xl outline-none focus:ring-2 focus:ring-[#2D5A27]"
                          />
                        </div>

                        {materialsList.length > 1 && (
                          <button
                            type="button"
                            onClick={() => handleRemoveMaterialRow(idx)}
                            className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition cursor-pointer mb-0.5"
                            title="Xóa dòng vật tư này"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Live Calculated Total Cost Banner */}
              <div className="p-3.5 bg-white rounded-2xl border border-[#A3D99E] flex items-center justify-between shadow-2xs">
                <div className="flex items-center gap-2 text-slate-700">
                  <div className="w-7 h-7 rounded-xl bg-[#E8F3E8] flex items-center justify-center text-[#2D5A27]">
                    <Calculator className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-bold text-xs text-slate-800 block">Tổng Chi Phí Vật Tư:</span>
                    <span className="text-[11px] text-[#527050]">Tự động cộng dồn theo các mục trên</span>
                  </div>
                </div>
                <div className="flex items-baseline gap-1 bg-[#F4F9F4] px-3.5 py-1.5 rounded-xl border border-[#D5E8D5]">
                  <span className="text-base font-extrabold text-[#2D5A27]">
                    {totalMaterialsCost.toLocaleString("vi-VN")}
                  </span>
                  <span className="text-xs font-bold text-[#527050]">VNĐ</span>
                </div>
              </div>

              {/* Supplier & Batch Information for traceability */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                <div>
                  <label className="text-[11px] font-semibold text-slate-600 block mb-1">Nhà cung cấp / Đại lý VTNN:</label>
                  <input
                    type="text"
                    placeholder="Ví dụ: Đại lý VTNN Nông Xanh, Cty CP BVTV..."
                    value={logSupplier}
                    onChange={(e) => setLogSupplier(e.target.value)}
                    className="w-full p-2.5 bg-white border border-[#E2ECE2] rounded-xl text-xs outline-none"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-slate-600 block mb-1">Số lô / Mã truy xuất VietGAP:</label>
                  <input
                    type="text"
                    placeholder="Ví dụ: BB-2026-08A, LÔ-08/26"
                    value={logBatchNumber}
                    onChange={(e) => setLogBatchNumber(e.target.value)}
                    className="w-full p-2.5 bg-white border border-[#E2ECE2] rounded-xl text-xs outline-none font-mono"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Ngày thực hiện:</label>
                <input
                  type="date"
                  value={logDate}
                  onChange={(e) => setLogDate(e.target.value)}
                  className="w-full p-3 bg-[#F9FBF9] border border-[#E2ECE2] rounded-2xl outline-none text-xs sm:text-sm"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Người phụ trách:</label>
                <input
                  type="text"
                  value={logOperator}
                  onChange={(e) => setLogOperator(e.target.value)}
                  className="w-full p-3 bg-[#F9FBF9] border border-[#E2ECE2] rounded-2xl outline-none text-xs sm:text-sm"
                />
              </div>
            </div>

            {/* 4. Description & Technical Guidance + Image Attachment */}
            <div className="space-y-2">
              <label className="block font-bold text-slate-700">Mô tả chi tiết & Hướng dẫn kỹ thuật:</label>
              <textarea
                rows={3}
                value={logDetails}
                onChange={(e) => setLogDetails(e.target.value)}
                placeholder="Ghi rõ cách bón (rải mép tán, châm nước nhỏ giọt), tình trạng cơi đọt, độ ẩm đất... (Tự động tạo mô tả nếu để trống)"
                className="w-full p-3 bg-[#F9FBF9] border border-[#E2ECE2] rounded-2xl outline-none resize-none text-xs sm:text-sm focus:ring-2 focus:ring-[#2D5A27]"
              />

              {/* Image Upload and Attachment Section */}
              <div className="bg-[#F9FBF9] p-3.5 rounded-2xl border border-[#E2ECE2] space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-lg bg-[#E8F3E8] text-[#2D5A27] flex items-center justify-center">
                      <Camera className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <span className="text-xs font-bold text-slate-800 block">Hình ảnh đính kèm nhật ký</span>
                      <span className="text-[11px] text-[#527050]">Chụp ảnh hoặc tải lên hiện trạng vườn, bao bì phân thuốc, hóa đơn hoặc mã QR VietGAP</span>
                    </div>
                  </div>

                  {logImages.length > 0 && (
                    <button
                      type="button"
                      onClick={() => setLogImages([])}
                      className="text-[11px] font-semibold text-rose-600 hover:text-rose-700 hover:underline cursor-pointer"
                    >
                      Xóa tất cả ({logImages.length})
                    </button>
                  )}
                </div>

                {/* Drag & Drop or Click Area */}
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleImageFileInput}
                  accept="image/*"
                  multiple
                  className="hidden"
                />

                <div
                  onDragOver={handleImageDragOver}
                  onDragLeave={handleImageDragLeave}
                  onDrop={handleImageDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className={`border-2 border-dashed rounded-2xl p-4 text-center cursor-pointer transition flex flex-col items-center justify-center gap-2 ${
                    isDraggingImage
                      ? "border-[#2D5A27] bg-[#E8F3E8]/50"
                      : "border-[#D0E5D0] hover:border-[#2D5A27] bg-white hover:bg-[#F4F9F4]"
                  }`}
                >
                  <div className="w-10 h-10 rounded-2xl bg-[#E8F3E8] text-[#2D5A27] flex items-center justify-center">
                    <UploadCloud className="w-5 h-5" />
                  </div>
                  <div className="space-y-0.5">
                    <p className="text-xs font-bold text-slate-700">
                      Kéo thả ảnh vào đây hoặc <span className="text-[#2D5A27] underline">chọn từ thiết bị</span>
                    </p>
                    <p className="text-[11px] text-slate-400">
                      Hỗ trợ JPG, PNG, WEBP — Có thể chọn nhiều ảnh cùng lúc
                    </p>
                  </div>
                </div>

                {/* Thumbnails grid */}
                {logImages.length > 0 && (
                  <div className="space-y-2 pt-1">
                    <div className="flex items-center justify-between text-[11px] font-bold text-slate-600">
                      <span>Danh sách ảnh đã chọn ({logImages.length}):</span>
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="text-[#2D5A27] hover:underline flex items-center gap-1 cursor-pointer"
                      >
                        <Plus className="w-3 h-3" />
                        <span>Thêm ảnh khác</span>
                      </button>
                    </div>

                    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2.5">
                      {logImages.map((img, idx) => (
                        <div
                          key={idx}
                          className="group relative aspect-square rounded-xl overflow-hidden border border-[#D0E5D0] bg-slate-100 shadow-2xs"
                        >
                          <img
                            src={img}
                            alt={`Ảnh nhật ký ${idx + 1}`}
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-1.5 p-1">
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setActiveLightbox({ url: img, title: `Ảnh đính kèm #${idx + 1}` });
                              }}
                              className="p-1.5 bg-white/90 text-slate-800 rounded-lg hover:bg-white transition cursor-pointer"
                              title="Xem ảnh phóng to"
                            >
                              <Eye className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleRemoveImage(idx);
                              }}
                              className="p-1.5 bg-rose-600 text-white rounded-lg hover:bg-rose-700 transition cursor-pointer"
                              title="Xóa ảnh này"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                          <span className="absolute bottom-1 left-1 bg-black/60 text-white text-[9px] font-bold px-1.5 py-0.2 rounded">
                            #{idx + 1}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Optional Technical Metrics */}
            <div className="bg-[#F4F9F4] p-3.5 rounded-2xl border border-[#E2ECE2] space-y-2">
              <span className="text-[11px] font-bold uppercase text-[#527050] block">
                Chỉ Số Đo Đạc Kỹ Thuật Bổ Sung (Không Bắt Buộc)
              </span>
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="text-[11px] text-slate-600 block">pH Đất:</label>
                  <input
                    type="number"
                    step="0.1"
                    placeholder="ví dụ: 5.8"
                    value={logSoilPH}
                    onChange={(e) => setLogSoilPH(e.target.value)}
                    className="w-full p-2 bg-white border border-[#E2ECE2] rounded-xl text-xs outline-none"
                  />
                </div>
                <div>
                  <label className="text-[11px] text-slate-600 block">Độ ẩm đất (%):</label>
                  <input
                    type="number"
                    placeholder="ví dụ: 80"
                    value={logMoisture}
                    onChange={(e) => setLogMoisture(e.target.value)}
                    className="w-full p-2 bg-white border border-[#E2ECE2] rounded-xl text-xs outline-none"
                  />
                </div>
                <div>
                  <label className="text-[11px] text-slate-600 block">Thu hoạch (kg):</label>
                  <input
                    type="number"
                    placeholder="ví dụ: 250"
                    value={logYield}
                    onChange={(e) => setLogYield(e.target.value)}
                    className="w-full p-2 bg-white border border-[#E2ECE2] rounded-xl text-xs outline-none"
                  />
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-[#F0F5F0] flex items-center justify-between gap-2">
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2.5 font-semibold text-slate-600 hover:bg-slate-100 rounded-xl cursor-pointer"
              >
                Đóng
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 bg-[#2D5A27] hover:bg-[#1E3F1A] text-white font-bold rounded-2xl shadow-sm flex items-center gap-2 cursor-pointer transition"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Lưu Nhật Ký & Chi Phí</span>
              </button>
            </div>
          </form>
        </div>
      )}
      {/* Full-size Image Lightbox Modal */}
      {activeLightbox && (
        <div 
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setActiveLightbox(null)}
        >
          <div 
            className="relative max-w-4xl max-h-[90vh] bg-slate-900 rounded-2xl overflow-hidden shadow-2xl flex flex-col border border-white/10"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-3.5 bg-black/50 text-white border-b border-white/10">
              <span className="text-xs sm:text-sm font-semibold truncate max-w-md">
                {activeLightbox.title || "Xem hình ảnh chi tiết"}
              </span>
              <button
                type="button"
                onClick={() => setActiveLightbox(null)}
                className="p-1.5 hover:bg-white/20 text-white rounded-xl transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-2 sm:p-4 flex items-center justify-center overflow-auto max-h-[calc(90vh-60px)]">
              <img
                src={activeLightbox.url}
                alt="Hình ảnh phóng to"
                className="max-h-[75vh] w-auto max-w-full rounded-xl object-contain shadow-md"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

