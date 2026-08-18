import React, { useState, useRef } from "react";
import { 
  Sparkles, 
  UploadCloud, 
  Camera, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  ShieldCheck, 
  Leaf, 
  Droplets, 
  FlaskConical, 
  History, 
  BookmarkCheck, 
  CalendarPlus, 
  RefreshCw,
  Image as ImageIcon,
  ChevronRight,
  Info,
  Bug,
  Activity,
  Layers
} from "lucide-react";
import { GardenProfile, GardenPlot, AIDiagnosisResult, DiagnosisRecord } from "../types";

interface AIDiagnosisViewProps {
  garden: GardenProfile;
  selectedPlotId?: string;
  diagnoses: DiagnosisRecord[];
  onSaveDiagnosis: (record: DiagnosisRecord) => void;
  onUpdateDiagnosisStatus: (id: string, status: "active" | "treating" | "recovered") => void;
  onAddTaskFromDiagnosis: (diagnosis: DiagnosisRecord) => void;
}

// Preset samples for fast demonstration
const SAMPLE_PRESETS = [
  {
    title: "Cháy đọt & Thán thư sầu riêng",
    crop: "Sầu riêng",
    symptoms: "Chóp lá non và mép lá bị cháy khô màu nâu cánh gián, lá bánh tẻ bị thâm quầng vàng, rụng lá non hàng loạt sau mưa.",
    image: "https://images.unsplash.com/photo-1597848212624-a19eb35e2651?auto=format&fit=crop&w=600&q=80"
  },
  {
    title: "Bọ trĩ & Rầy phấn trắng hại cơi non",
    crop: "Sầu riêng / Cây có múi",
    symptoms: "Mặt dưới lá non xuất hiện các đốm xám chì bạc, đọt non bị chùn lại, mép lá cong queo hình thuyền và giòn dễ rách.",
    image: "https://images.unsplash.com/photo-1530836369250-ef72a3f5cda8?auto=format&fit=crop&w=600&q=80"
  },
  {
    title: "Xì mủ thân gốc (Phytophthora)",
    crop: "Sầu riêng / Bưởi",
    symptoms: "Vỏ thân cây rỉ nhựa nâu đen ươn ướt, cạo nhẹ lớp vỏ thấy gỗ thâm đen, lá trên cành tương ứng bị vàng rụng.",
    image: "https://images.unsplash.com/photo-1542273917363-3b1817f69a2d?auto=format&fit=crop&w=600&q=80"
  },
  {
    title: "Sâu vẽ bùa & Loét vi khuẩn lá cam bưởi",
    crop: "Bưởi / Cam / Chanh",
    symptoms: "Lá non có các đường ngoằn ngoèo màng bạc sáng bóng, xuất hiện các nốt sần tròn nâu nhô cao có quầng vàng xung quanh.",
    image: "https://images.unsplash.com/photo-1587334274328-64186a80aeee?auto=format&fit=crop&w=600&q=80"
  }
];

const SYMPTOM_TAGS = [
  "Cháy chóp và bìa lá",
  "Đốm nâu quầng vàng",
  "Vàng lá gân xanh",
  "Xì mủ ướt thân cành",
  "Đọt non quăn queo chùn ngọn",
  "Rụng hoa & trái non",
  "Mặt dưới lá có phấn trắng/rỉ sắt",
  "Bọ trĩ chích hút đọt",
  "Rệp sáp bám cuống trái",
  "Thối rễ tơ / nghẹt rễ"
];

export const AIDiagnosisView: React.FC<AIDiagnosisViewProps> = ({
  garden,
  selectedPlotId,
  diagnoses,
  onSaveDiagnosis,
  onUpdateDiagnosisStatus,
  onAddTaskFromDiagnosis,
}) => {
  const [activePlot, setActivePlot] = useState<GardenPlot>(() => {
    if (selectedPlotId) {
      const found = garden.plots.find((p) => p.id === selectedPlotId);
      if (found) return found;
    }
    return garden.plots[0] || {
      id: "default-plot",
      name: "Lô chính",
      cropName: "Cây trồng",
      variety: "Tiêu chuẩn",
      treeCount: 100,
      plantedYear: 2022,
      treeAgeYears: 3,
      stage: "Phát triển thân lá / Làm cơi đọt",
      areaM2: 5000,
      healthScore: 85
    };
  });

  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [symptomText, setSymptomText] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [isDiagnosing, setIsDiagnosing] = useState(false);
  const [currentResult, setCurrentResult] = useState<AIDiagnosisResult | null>(null);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Filter diagnoses for this garden
  const farmDiagnoses = diagnoses.filter((d) => d.farmId === garden.id);

  const toggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter((t) => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const applyPreset = (preset: typeof SAMPLE_PRESETS[0]) => {
    setSelectedImage(preset.image);
    setSymptomText(preset.symptoms);
  };

  const runDiagnosis = async () => {
    setIsDiagnosing(true);
    setCurrentResult(null);
    setSavedSuccess(false);

    const fullSymptoms = [
      symptomText,
      selectedTags.length > 0 ? `Các dấu hiệu lựa chọn: ${selectedTags.join(", ")}` : ""
    ].filter(Boolean).join(". ");

    try {
      const res = await fetch("/api/diagnose", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          imageBase64: selectedImage && selectedImage.startsWith("data:") ? selectedImage : undefined,
          mimeType: selectedImage && selectedImage.startsWith("data:") ? selectedImage.split(";")[0].split(":")[1] : undefined,
          cropName: activePlot.cropName,
          plotName: activePlot.name,
          stage: activePlot.stage,
          symptoms: fullSymptoms || "Lá có đốm nâu và dấu hiệu kém phát triển",
          gardenInfo: {
            name: garden.name,
            location: garden.location,
            soilType: garden.soilType,
            irrigationType: garden.irrigationType,
            cultivationStandard: garden.cultivationStandard
          }
        })
      });

      const json = await res.json();
      if (json.success && json.data) {
        setCurrentResult(json.data);
      }
    } catch (err) {
      console.error("Diagnosis failure:", err);
    } finally {
      setIsDiagnosing(false);
    }
  };

  const saveToRecords = () => {
    if (!currentResult) return;
    const newRecord: DiagnosisRecord = {
      id: `diag-${Date.now()}`,
      farmId: garden.id,
      plotId: activePlot.id,
      cropName: `${activePlot.cropName} (${activePlot.variety})`,
      date: new Date().toISOString().slice(0, 10),
      imageUrl: selectedImage || undefined,
      symptoms: symptomText || selectedTags.join(", ") || "Dấu hiệu bất thường trên tán lá",
      result: currentResult,
      status: "treating"
    };

    onSaveDiagnosis(newRecord);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header Info Bento Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-7 border border-[#E2ECE2] shadow-[0_4px_20px_-4px_rgba(45,90,39,0.06)] flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E8F3E8] text-[#2D5A27] text-xs font-bold mb-2.5 border border-emerald-200">
            <Sparkles className="w-3.5 h-3.5 text-[#2D5A27]" />
            <span>Trí tuệ nhân tạo Bảo vệ Thực vật</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Bác Sĩ Cây Trồng AI Cá Nhân Hoá
          </h1>
          <p className="text-[#527050] text-xs sm:text-sm mt-1.5 leading-relaxed max-w-2xl">
            Chẩn đoán sâu bệnh, thiếu hụt dinh dưỡng và đưa ra phác đồ điều trị an toàn chuẩn hoá theo loại đất <strong className="text-[#2D5A27] font-bold">{garden.soilType}</strong> và tiêu chuẩn <strong className="text-[#2D5A27] font-bold">{garden.cultivationStandard}</strong>.
          </p>
        </div>

        {/* Plot Selector */}
        <div className="bg-[#F9FBF9] p-4 rounded-2xl border border-[#E2ECE2] w-full md:w-auto shadow-sm">
          <label className="block text-[11px] font-bold uppercase tracking-wider text-[#527050] mb-1.5">
            Chọn Lô / Cây Cần Khám:
          </label>
          <select
            id="diagnosis-plot-select"
            value={activePlot.id}
            onChange={(e) => {
              const plot = garden.plots.find((p) => p.id === e.target.value);
              if (plot) setActivePlot(plot);
            }}
            className="w-full bg-white text-xs sm:text-sm font-semibold text-slate-800 border border-[#E2ECE2] rounded-xl px-3.5 py-2.5 focus:ring-2 focus:ring-[#2D5A27] outline-none cursor-pointer"
          >
            {garden.plots.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name} ({p.cropName} - {p.variety})
              </option>
            ))}
          </select>
          <div className="text-[11px] text-[#739270] mt-2">
            Giai đoạn: <span className="font-semibold text-[#2D5A27]">{activePlot.stage}</span>
          </div>
        </div>
      </div>

      {/* Main Input Form & Diagnostic Flow */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Col: Upload & Symptom details (5 cols) */}
        <div className="lg:col-span-5 space-y-5">
          <div className="bg-white rounded-3xl p-6 border border-[#E2ECE2] shadow-[0_4px_20px_-4px_rgba(45,90,39,0.06)] space-y-4">
            <h2 className="font-bold text-sm text-slate-900 flex items-center gap-2">
              <Camera className="w-4 h-4 text-[#2D5A27]" />
              <span>1. Hình Ảnh Triệu Chứng Cây Bệnh</span>
            </h2>

            {/* Image Preview / Upload Area */}
            <div 
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-2xl p-4 text-center cursor-pointer transition-all flex flex-col items-center justify-center min-h-[200px] relative overflow-hidden ${
                selectedImage 
                  ? "border-[#2D5A27] bg-[#E8F3E8]/30" 
                  : "border-[#D4E8D4] hover:border-[#2D5A27] bg-[#F9FBF9]"
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageUpload}
              />

              {selectedImage ? (
                <div className="w-full relative group">
                  <img
                    src={selectedImage}
                    alt="Cây trồng cần khám"
                    className="w-full h-48 object-cover rounded-xl shadow-sm"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition rounded-xl flex items-center justify-center text-white text-xs font-semibold">
                    Nhấn để đổi ảnh khác
                  </div>
                </div>
              ) : (
                <div className="space-y-2.5 py-4">
                  <div className="w-12 h-12 rounded-2xl bg-[#E8F3E8] text-[#2D5A27] flex items-center justify-center mx-auto shadow-sm">
                    <UploadCloud className="w-6 h-6" />
                  </div>
                  <div className="text-xs font-bold text-slate-800">
                    Tải ảnh lá / thân / trái / rễ cây bị bệnh
                  </div>
                  <p className="text-[11px] text-[#739270] max-w-xs mx-auto">
                    Chụp rõ nét phần lá bệnh, đốm lá hoặc triệu chứng bất thường để AI nhận diện chuẩn xác nhất
                  </p>
                </div>
              )}
            </div>

            {/* Preset Samples */}
            <div>
              <span className="text-[11px] font-bold text-[#527050] uppercase tracking-wider block mb-2">
                Hoặc thử nhanh mẫu bệnh phổ biến:
              </span>
              <div className="grid grid-cols-2 gap-2">
                {SAMPLE_PRESETS.map((sample, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => applyPreset(sample)}
                    className="p-2.5 rounded-xl text-left border border-[#E2ECE2] hover:border-[#2D5A27] bg-[#F9FBF9] hover:bg-[#E8F3E8]/50 transition text-xs group cursor-pointer"
                  >
                    <div className="font-semibold text-slate-800 group-hover:text-[#2D5A27] line-clamp-1">
                      {sample.title}
                    </div>
                    <div className="text-[10px] text-[#739270]">{sample.crop}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Quick Symptom Tags */}
            <div className="pt-3 border-t border-[#F0F5F0]">
              <label className="block text-xs font-bold text-slate-800 mb-2">
                2. Chọn nhanh triệu chứng quan sát được:
              </label>
              <div className="flex flex-wrap gap-1.5">
                {SYMPTOM_TAGS.map((tag) => {
                  const active = selectedTags.includes(tag);
                  return (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => toggleTag(tag)}
                      className={`text-xs px-3 py-1.5 rounded-xl border transition font-medium cursor-pointer ${
                        active
                          ? "bg-[#2D5A27] text-white border-[#2D5A27] shadow-sm"
                          : "bg-[#F9FBF9] text-[#527050] border-[#E2ECE2] hover:bg-[#E8F3E8]"
                      }`}
                    >
                      {tag}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Detailed Symptoms Input */}
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1.5">
                3. Mô tả thêm diễn biến triệu chứng (nếu có):
              </label>
              <textarea
                value={symptomText}
                onChange={(e) => setSymptomText(e.target.value)}
                placeholder="Ví dụ: Bệnh xuất hiện sau 3 ngày mưa dầm, lan nhanh từ lá già sang cơi non..."
                rows={3}
                className="w-full text-xs sm:text-sm text-slate-800 p-3 bg-[#F9FBF9] border border-[#E2ECE2] rounded-2xl focus:ring-2 focus:ring-[#2D5A27] outline-none resize-none"
              />
            </div>

            {/* Submit Button */}
            <button
              id="submit-ai-diagnosis-btn"
              type="button"
              onClick={runDiagnosis}
              disabled={isDiagnosing}
              className="w-full py-3.5 px-4 bg-[#2D5A27] hover:bg-[#1E3F1A] disabled:opacity-50 text-white font-bold text-sm rounded-2xl shadow-lg shadow-emerald-950/20 flex items-center justify-center gap-2 transition transform active:scale-98 cursor-pointer"
            >
              {isDiagnosing ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>AI Đang Phân Tích & Đối Soát Thổ Nhưỡng...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-[#A3D99E]" />
                  <span>Chẩn Đoán Bệnh & Xuất Phác Đồ Ngay</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Right Col: Diagnosis Outcome & Prescriptions (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          {currentResult ? (
            <div className="bg-white rounded-3xl p-6 border border-[#2D5A27]/30 shadow-[0_6px_24px_-4px_rgba(45,90,39,0.12)] space-y-6">
              
              {/* Header Title & Severity Score */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 border-b border-[#F0F5F0]">
                <div>
                  <div className="flex items-center gap-2">
                    <span className={`text-xs px-3 py-1 rounded-full font-extrabold uppercase ${
                      currentResult.severityLevel === "critical"
                        ? "bg-rose-100 text-rose-800 border border-rose-200"
                        : currentResult.severityLevel === "severe"
                        ? "bg-orange-100 text-orange-800 border border-orange-200"
                        : currentResult.severityLevel === "moderate"
                        ? "bg-amber-100 text-amber-800 border border-amber-200"
                        : "bg-[#E8F3E8] text-[#2D5A27] border border-emerald-200"
                    }`}>
                      Mức độ: {currentResult.severityLevel === "critical" ? "Nguy Cấp" : currentResult.severityLevel === "severe" ? "Nghiêm Trọng" : currentResult.severityLevel === "moderate" ? "Trung Bình" : "Nhẹ"}
                    </span>
                    <span className="text-xs text-[#527050]">
                      Độ tin cậy AI: <strong>{currentResult.confidenceScore}%</strong>
                    </span>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-black text-slate-900 mt-1.5">
                    {currentResult.diseaseName}
                  </h2>
                  {currentResult.scientificName && (
                    <p className="text-xs text-[#739270] italic">
                      Tên khoa học: {currentResult.scientificName}
                    </p>
                  )}
                </div>

                {/* Save & Action */}
                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <button
                    type="button"
                    onClick={saveToRecords}
                    className="flex-1 sm:flex-none px-4 py-2.5 bg-[#2D5A27] hover:bg-[#1E3F1A] text-white text-xs font-bold rounded-2xl flex items-center justify-center gap-1.5 shadow-sm transition cursor-pointer"
                  >
                    <BookmarkCheck className="w-4 h-4 text-[#A3D99E]" />
                    <span>{savedSuccess ? "Đã Lưu Hồ Sơ!" : "Lưu Vào Hồ Sơ"}</span>
                  </button>
                </div>
              </div>

              {/* Cause & Garden Context Analysis */}
              <div className="bg-[#F4F9F4] p-4 rounded-2xl border border-[#E2ECE2]">
                <h3 className="text-xs font-bold text-[#1E3F1A] uppercase tracking-wider flex items-center gap-1.5">
                  <Info className="w-4 h-4 text-[#2D5A27]" />
                  <span>Phân Tích Nguyên Nhân Cho {garden.name}</span>
                </h3>
                <p className="text-xs sm:text-sm text-slate-800 mt-2 leading-relaxed">
                  {currentResult.causeAnalysis}
                </p>
              </div>

              {/* Matched Symptoms Checklist */}
              <div>
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2">
                  Triệu Chứng Nhận Diện Đặc Trưng:
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {currentResult.symptomMatches?.map((sym, idx) => (
                    <div
                      key={idx}
                      className="flex items-start gap-2 text-xs text-slate-700 bg-[#F9FBF9] p-3 rounded-xl border border-[#E2ECE2]"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#2D5A27] shrink-0 mt-0.5" />
                      <span>{sym}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Two Protocols: Organic & Chemical */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Organic / Biological Regimen */}
                <div className="bg-[#E8F3E8]/40 p-4 rounded-2xl border border-[#D4E8D4] flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-2 text-xs font-bold text-[#2D5A27] uppercase pb-2 border-b border-[#D4E8D4]">
                      <Leaf className="w-4 h-4 text-[#2D5A27]" />
                      <span>Phác Đồ Sinh Học / Hữu Cơ (Ưu Tiên)</span>
                    </div>
                    <ul className="mt-3 space-y-2 text-xs text-slate-700">
                      {currentResult.organicTreatment?.map((step, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <span className="w-4 h-4 rounded-full bg-[#2D5A27] text-white text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                            {idx + 1}
                          </span>
                          <span>{step}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="mt-3 pt-2 text-[11px] font-semibold text-[#2D5A27] border-t border-[#D4E8D4]">
                    Thân thiện môi trường đất & thiên địch.
                  </div>
                </div>

                {/* Chemical / Safe Intervention Regimen */}
                <div className="bg-amber-50/50 p-4 rounded-2xl border border-amber-200 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-2 text-xs font-bold text-amber-900 uppercase pb-2 border-b border-amber-200/60">
                      <FlaskConical className="w-4 h-4 text-amber-700" />
                      <span>Phác Đồ Hoá Học (Nếu Bệnh Nặng)</span>
                    </div>
                    <ul className="mt-3 space-y-2 text-xs text-slate-700">
                      {currentResult.chemicalTreatment?.map((step, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <span className="w-4 h-4 rounded-full bg-amber-200 text-amber-900 text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                            {idx + 1}
                          </span>
                          <span>{step}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="mt-3 pt-2 text-[11px] font-semibold text-amber-900 border-t border-amber-100">
                    Tuân thủ nghiêm ngặt thời gian cách ly (PHI).
                  </div>
                </div>
              </div>

              {/* Soil & Watering Customization for this Farm */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3.5 bg-[#F9FBF9] rounded-2xl border border-[#E2ECE2]">
                  <span className="font-bold text-slate-800 flex items-center gap-1.5 mb-1 text-xs">
                    <FlaskConical className="w-3.5 h-3.5 text-amber-600" />
                    Điều chỉnh đất ({garden.soilType}):
                  </span>
                  <p className="text-[#527050] leading-relaxed">
                    {currentResult.soilAdjustment}
                  </p>
                </div>

                <div className="p-3.5 bg-[#F9FBF9] rounded-2xl border border-[#E2ECE2]">
                  <span className="font-bold text-slate-800 flex items-center gap-1.5 mb-1 text-xs">
                    <Droplets className="w-3.5 h-3.5 text-cyan-600" />
                    Điều chỉnh hệ thống tưới:
                  </span>
                  <p className="text-[#527050] leading-relaxed">
                    {currentResult.wateringAdvisory}
                  </p>
                </div>
              </div>

              {/* Recovery Estimation & Long term prevention */}
              <div className="pt-3 border-t border-[#F0F5F0] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2 text-[#527050]">
                  <Clock className="w-4 h-4 text-[#2D5A27]" />
                  <span>Dự kiến thời gian phục hồi: <strong>{currentResult.estimatedRecoveryDays} ngày</strong></span>
                </div>
                <div className="text-[#2D5A27] font-semibold flex items-center gap-1">
                  <ShieldCheck className="w-4 h-4 text-[#2D5A27]" />
                  <span>Tiêu chuẩn: {garden.cultivationStandard}</span>
                </div>
              </div>
            </div>
          ) : (
            /* Empty state / Welcome prompt */
            <div className="bg-white rounded-3xl p-8 border border-[#E2ECE2] shadow-[0_4px_20px_-4px_rgba(45,90,39,0.06)] text-center space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-[#E8F3E8] text-[#2D5A27] flex items-center justify-center mx-auto shadow-inner">
                <Sparkles className="w-8 h-8" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Sẵn Sàng Chẩn Đoán Cây Trồng
                </h3>
                <p className="text-xs text-[#527050] max-w-md mx-auto mt-1 leading-relaxed">
                  Tải lên hình ảnh lá bệnh hoặc chọn mẫu bệnh ở khung bên trái. Hệ thống sẽ kết hợp mô hình AI cùng dữ liệu thổ nhưỡng <strong className="text-slate-700">{garden.soilType}</strong> của vườn bạn để kê đơn chuẩn xác.
                </p>
              </div>

              <div className="pt-4 border-t border-[#F0F5F0] grid grid-cols-1 sm:grid-cols-3 gap-3 text-left">
                <div className="p-3.5 rounded-2xl bg-[#F9FBF9] border border-[#E2ECE2]">
                  <span className="font-bold text-xs text-slate-800 block">1. Nhận diện sâu bệnh</span>
                  <p className="text-[11px] text-[#739270] mt-0.5">Phát hiện nấm, vi khuẩn, rệp, bọ trĩ, thiếu vi lượng.</p>
                </div>
                <div className="p-3.5 rounded-2xl bg-[#F9FBF9] border border-[#E2ECE2]">
                  <span className="font-bold text-xs text-slate-800 block">2. Kê đơn sinh học & hoá</span>
                  <p className="text-[11px] text-[#739270] mt-0.5">Hướng dẫn chi tiết liều lượng pha bình và thời điểm phun.</p>
                </div>
                <div className="p-3.5 rounded-2xl bg-[#F9FBF9] border border-[#E2ECE2]">
                  <span className="font-bold text-xs text-slate-800 block">3. Lưu nhật ký VietGAP</span>
                  <p className="text-[11px] text-[#739270] mt-0.5">Theo dõi lịch sử phục hồi của từng lô cây trồng.</p>
                </div>
              </div>
            </div>
          )}

          {/* Past Diagnoses History Section */}
          <div className="bg-white rounded-3xl p-5 border border-[#E2ECE2] shadow-[0_4px_20px_-4px_rgba(45,90,39,0.06)] space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-[#F0F5F0]">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <History className="w-4 h-4 text-[#2D5A27]" />
                <span>Lịch Sử Khám Bệnh Của Vườn ({farmDiagnoses.length})</span>
              </h3>
              <span className="text-xs text-[#527050]">Gần đây nhất</span>
            </div>

            <div className="divide-y divide-[#F0F5F0]">
              {farmDiagnoses.map((record) => (
                <div key={record.id} className="py-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-800">{record.result.diseaseName}</span>
                      <span className={`text-[10px] px-2.5 py-0.5 rounded-full font-bold uppercase ${
                        record.status === "recovered"
                          ? "bg-[#E8F3E8] text-[#2D5A27] border border-emerald-200"
                          : record.status === "treating"
                          ? "bg-amber-100 text-amber-800 border border-amber-200"
                          : "bg-rose-100 text-rose-800 border border-rose-200"
                      }`}>
                        {record.status === "recovered" ? "Đã Khỏi" : record.status === "treating" ? "Đang Điều Trị" : "Mới Khám"}
                      </span>
                    </div>
                    <div className="text-[#739270] flex items-center gap-2">
                      <span>{record.cropName}</span>
                      <span>•</span>
                      <span>Ngày khám: {record.date}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {record.status !== "recovered" && (
                      <button
                        type="button"
                        onClick={() => onUpdateDiagnosisStatus(record.id, "recovered")}
                        className="px-3 py-1.5 bg-[#E8F3E8] hover:bg-[#D4E8D4] text-[#2D5A27] font-semibold rounded-xl border border-emerald-200 transition cursor-pointer"
                      >
                        Đánh dấu Đã Khỏi
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => setCurrentResult(record.result)}
                      className="px-3 py-1.5 bg-[#F9FBF9] hover:bg-[#E8F3E8] text-slate-700 font-semibold rounded-xl border border-[#E2ECE2] transition cursor-pointer"
                    >
                      Xem đơn
                    </button>
                  </div>
                </div>
              ))}

              {farmDiagnoses.length === 0 && (
                <p className="text-xs text-slate-400 py-4 text-center">Chưa có ca khám bệnh nào được lưu cho vườn này.</p>
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
