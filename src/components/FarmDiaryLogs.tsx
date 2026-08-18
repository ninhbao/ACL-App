import React, { useState } from "react";
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
  FileSpreadsheet,
  Download,
  Trash2
} from "lucide-react";
import { GardenProfile, FarmDiaryLog, LogCategory } from "../types";

interface FarmDiaryLogsProps {
  garden: GardenProfile;
  logs: FarmDiaryLog[];
  onAddLog: (log: FarmDiaryLog) => void;
  onDeleteLog: (id: string) => void;
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
  const [isPrinting, setIsPrinting] = useState(false);

  // New Log Form State
  const [logTitle, setLogTitle] = useState("");
  const [logCat, setLogCat] = useState<LogCategory>("fertilizing");
  const [logPlotId, setLogPlotId] = useState(garden.plots[0]?.id || "");
  const [logDate, setLogDate] = useState(new Date().toISOString().slice(0, 10));
  const [logDetails, setLogDetails] = useState("");
  const [logOperator, setLogOperator] = useState(garden.ownerName || "Chủ vườn");
  const [logSoilPH, setLogSoilPH] = useState<string>("");
  const [logMoisture, setLogMoisture] = useState<string>("");
  const [logCost, setLogCost] = useState<string>("");
  const [logYield, setLogYield] = useState<string>("");

  const farmLogs = logs.filter((l) => l.farmId === garden.id);

  const filteredLogs = farmLogs.filter((l) => {
    if (selectedCat !== "all" && l.category !== selectedCat) return false;
    if (selectedPlot !== "all" && l.plotId !== selectedPlot) return false;
    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      return l.title.toLowerCase().includes(q) || l.details.toLowerCase().includes(q) || l.operatorName.toLowerCase().includes(q);
    }
    return true;
  });

  const totalCost = farmLogs.reduce((acc, l) => acc + (l.metrics?.costVND || 0), 0);
  const totalYield = farmLogs.reduce((acc, l) => acc + (l.metrics?.yieldKg || 0), 0);

  const handleCreateLog = (e: React.FormEvent) => {
    e.preventDefault();
    if (!logTitle.trim()) return;

    const newLog: FarmDiaryLog = {
      id: `log-${Date.now()}`,
      farmId: garden.id,
      plotId: logPlotId,
      date: logDate,
      category: logCat,
      title: logTitle,
      details: logDetails,
      operatorName: logOperator,
      metrics: {
        soilPH: logSoilPH ? parseFloat(logSoilPH) : undefined,
        soilMoisture: logMoisture ? parseFloat(logMoisture) : undefined,
        costVND: logCost ? parseInt(logCost, 10) : undefined,
        yieldKg: logYield ? parseFloat(logYield) : undefined
      }
    };

    onAddLog(newLog);
    setShowAddModal(false);
    setLogTitle("");
    setLogDetails("");
    setLogSoilPH("");
    setLogMoisture("");
    setLogCost("");
    setLogYield("");
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
            Ghi chép toàn bộ quá trình xử lý dinh dưỡng, phòng trừ sâu bệnh, đo pH đất và thu hoạch để phục vụ truy xuất nguồn gốc.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
          <button
            type="button"
            onClick={handlePrint}
            className="px-4 py-3 bg-[#F4F9F4] hover:bg-[#E8F3E8] text-[#2D5A27] font-semibold text-xs sm:text-sm rounded-2xl border border-[#E2ECE2] flex items-center gap-2 transition cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span>In Báo Cáo VietGAP</span>
          </button>

          <button
            id="open-add-log-modal-btn"
            type="button"
            onClick={() => setShowAddModal(true)}
            className="px-5 py-3 bg-[#2D5A27] hover:bg-[#1E3F1A] text-white font-bold text-xs sm:text-sm rounded-2xl shadow-md flex items-center gap-2 transition cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Ghi Nhật Ký Mới</span>
          </button>
        </div>
      </div>

      {/* 3 Bento Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="bg-white rounded-3xl p-6 border border-[#E2ECE2] shadow-[0_4px_20px_-4px_rgba(45,90,39,0.06)] flex flex-col justify-between">
          <span className="text-xs text-[#527050] font-bold uppercase tracking-wider">Tổng Số Bản Ghi</span>
          <div className="text-3xl font-extrabold text-slate-900 mt-2">{farmLogs.length} <span className="text-sm font-medium text-[#739270]">lần ghi</span></div>
          <div className="text-[11px] text-[#2D5A27] font-semibold mt-2 flex items-center gap-1">
            <CheckCircle className="w-3.5 h-3.5" /> Đầy đủ số liệu minh chứng
          </div>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-[#E2ECE2] shadow-[0_4px_20px_-4px_rgba(45,90,39,0.06)] flex flex-col justify-between">
          <span className="text-xs text-[#527050] font-bold uppercase tracking-wider">Tổng Chi Phí Vật Tư</span>
          <div className="text-3xl font-extrabold text-amber-700 mt-2">
            {totalCost > 0 ? `${totalCost.toLocaleString()} đ` : "Chưa nhập"}
          </div>
          <div className="text-[11px] text-[#739270] mt-2">Phân bón, chế phẩm sinh học, vôi</div>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-[#E2ECE2] shadow-[0_4px_20px_-4px_rgba(45,90,39,0.06)] flex flex-col justify-between">
          <span className="text-xs text-[#527050] font-bold uppercase tracking-wider">Sản Lượng Đã Thu Hoạch</span>
          <div className="text-3xl font-extrabold text-[#2D5A27] mt-2">
            {totalYield > 0 ? `${totalYield.toLocaleString()} kg` : "0 kg"}
          </div>
          <div className="text-[11px] text-[#739270] mt-2">Theo hồ sơ xuất kho</div>
        </div>
      </div>

      {/* Filter & Search Bento Bar */}
      <div className="bg-white rounded-3xl p-4 sm:p-5 border border-[#E2ECE2] shadow-[0_4px_20px_-4px_rgba(45,90,39,0.06)] flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-[#739270] absolute left-3.5 top-3.5" />
          <input
            type="text"
            placeholder="Tìm theo nội dung, vật tư, người làm..."
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

            return (
              <div key={log.id} className="p-5 sm:p-6 hover:bg-[#F9FBF9] transition flex flex-col sm:flex-row items-start justify-between gap-4">
                <div className="space-y-2 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className={`text-[11px] font-bold px-3 py-0.5 rounded-full border flex items-center gap-1.5 ${cat.color}`}>
                      <CatIcon className="w-3 h-3" />
                      <span>{cat.label}</span>
                    </span>

                    <span className="text-xs font-semibold text-slate-700 bg-[#F4F9F4] px-2.5 py-0.5 rounded-full border border-[#E2ECE2]">
                      {plotObj?.name || "Toàn vườn"}
                    </span>

                    <span className="text-xs text-[#739270]">
                      {log.date}
                    </span>
                  </div>

                  <h3 className="text-sm sm:text-base font-bold text-slate-900">
                    {log.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-[#527050] leading-relaxed">
                    {log.details}
                  </p>

                  {/* Metrics Badges */}
                  <div className="flex flex-wrap items-center gap-2.5 text-xs pt-1.5">
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
                    {log.metrics?.costVND !== undefined && (
                      <span className="bg-amber-50 text-amber-800 font-semibold px-2.5 py-0.5 rounded-lg border border-amber-200">
                        Chi phí: {log.metrics.costVND.toLocaleString()} đ
                      </span>
                    )}
                    {log.metrics?.yieldKg !== undefined && (
                      <span className="bg-[#E8F3E8] text-[#2D5A27] font-semibold px-2.5 py-0.5 rounded-lg border border-emerald-200">
                        Sản lượng: {log.metrics.yieldKg} kg
                      </span>
                    )}
                    <span className="text-[#739270]">
                      Người thực hiện: <strong className="text-slate-800">{log.operatorName}</strong>
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
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4">
          <form
            onSubmit={handleCreateLog}
            className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl border border-[#E2ECE2] animate-in fade-in zoom-in-95 duration-150 space-y-4 text-xs sm:text-sm"
          >
            <div className="flex items-start justify-between pb-2 border-b border-[#F0F5F0]">
              <h3 className="text-lg font-bold text-slate-900">
                Ghi Nhật Ký Canh Tác Mới
              </h3>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-slate-600 font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Tiêu đề hoạt động:</label>
              <input
                type="text"
                required
                value={logTitle}
                onChange={(e) => setLogTitle(e.target.value)}
                placeholder="Ví dụ: Bón phân hữu cơ vi sinh + đo pH đợt 2..."
                className="w-full p-3 bg-[#F9FBF9] border border-[#E2ECE2] rounded-2xl outline-none focus:ring-2 focus:ring-[#2D5A27] font-medium"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Phân loại:</label>
                <select
                  value={logCat}
                  onChange={(e) => setLogCat(e.target.value as LogCategory)}
                  className="w-full p-3 bg-[#F9FBF9] border border-[#E2ECE2] rounded-2xl outline-none cursor-pointer"
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
                  className="w-full p-3 bg-[#F9FBF9] border border-[#E2ECE2] rounded-2xl outline-none cursor-pointer"
                >
                  {garden.plots.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Ngày thực hiện:</label>
                <input
                  type="date"
                  value={logDate}
                  onChange={(e) => setLogDate(e.target.value)}
                  className="w-full p-3 bg-[#F9FBF9] border border-[#E2ECE2] rounded-2xl outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Người phụ trách:</label>
                <input
                  type="text"
                  value={logOperator}
                  onChange={(e) => setLogOperator(e.target.value)}
                  className="w-full p-3 bg-[#F9FBF9] border border-[#E2ECE2] rounded-2xl outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Mô tả chi tiết & Tình trạng cây:</label>
              <textarea
                required
                rows={3}
                value={logDetails}
                onChange={(e) => setLogDetails(e.target.value)}
                placeholder="Ghi rõ tên loại phân bón, liều lượng, tình hình sinh trưởng của lá, chồi, hoa, trái..."
                className="w-full p-3 bg-[#F9FBF9] border border-[#E2ECE2] rounded-2xl outline-none resize-none"
              />
            </div>

            {/* Optional Metrics */}
            <div className="bg-[#F4F9F4] p-3.5 rounded-2xl border border-[#E2ECE2] space-y-2">
              <span className="text-[11px] font-bold uppercase text-[#527050] block">
                Chỉ Số Đo Đạc Kỹ Thuật (Không Bắt Buộc)
              </span>
              <div className="grid grid-cols-2 gap-2">
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
                  <label className="text-[11px] text-slate-600 block">Chi phí vật tư (VNĐ):</label>
                  <input
                    type="number"
                    placeholder="ví dụ: 500000"
                    value={logCost}
                    onChange={(e) => setLogCost(e.target.value)}
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

            <div className="pt-3 border-t border-[#F0F5F0] flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 font-semibold text-slate-600 hover:bg-slate-100 rounded-xl cursor-pointer"
              >
                Đóng
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 bg-[#2D5A27] hover:bg-[#1E3F1A] text-white font-bold rounded-2xl shadow-sm cursor-pointer"
              >
                Lưu Bản Ghi
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
