import React, { useState, useMemo } from "react";
import { 
  Calendar, 
  Sparkles, 
  Plus, 
  CheckCircle2, 
  Circle, 
  Clock, 
  Droplets, 
  Leaf, 
  FlaskConical, 
  Scissors, 
  Eye, 
  Filter, 
  AlertCircle, 
  Layers,
  ChevronDown,
  Trash2,
  DollarSign,
  BookOpenCheck,
  Calculator,
  Coins,
  Package
} from "lucide-react";
import { GardenProfile, GardenPlot, CareTask, TaskCategory, TaskMaterialItem } from "../types";

interface PersonalizedCarePlanProps {
  garden: GardenProfile;
  tasks: CareTask[];
  onAddTask: (task: CareTask) => void;
  onToggleTask: (id: string) => void;
  onDeleteTask: (id: string) => void;
}

interface FormMaterialItem {
  id: string;
  name: string;
  dosage: string;
  costVND: string | number;
}

const CATEGORY_MAP: Record<TaskCategory, { label: string; icon: any; color: string }> = {
  irrigation: { label: "Tưới nước", icon: Droplets, color: "text-cyan-700 bg-cyan-50 border-cyan-200" },
  fertilizer: { label: "Bón phân / Dinh dưỡng", icon: Leaf, color: "text-emerald-700 bg-emerald-50 border-emerald-200" },
  pest_control: { label: "Phun phòng sâu bệnh", icon: FlaskConical, color: "text-amber-700 bg-amber-50 border-amber-200" },
  pruning: { label: "Tỉa cành / Vệ sinh tán", icon: Scissors, color: "text-purple-700 bg-purple-50 border-purple-200" },
  soil_care: { label: "Cải tạo & Đo pH đất", icon: AlertCircle, color: "text-orange-700 bg-orange-50 border-orange-200" },
  harvest: { label: "Thu hoạch", icon: CheckCircle2, color: "text-green-700 bg-green-50 border-green-200" },
  inspection: { label: "Thăm vườn & Đánh giá", icon: Eye, color: "text-blue-700 bg-blue-50 border-blue-200" }
};

export const PersonalizedCarePlan: React.FC<PersonalizedCarePlanProps> = ({
  garden,
  tasks,
  onAddTask,
  onToggleTask,
  onDeleteTask,
}) => {
  const [selectedPlotFilter, setSelectedPlotFilter] = useState<string>("all");
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>("all");
  const [showAiModal, setShowAiModal] = useState<boolean>(false);
  const [showNewTaskModal, setShowNewTaskModal] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // AI Plan Generation State
  const [targetPlotId, setTargetPlotId] = useState<string>(garden.plots[0]?.id || "");
  const [planGoal, setPlanGoal] = useState<string>("Tăng cường sức đề kháng mùa mưa & Dưỡng cơi đọt đồng loạt");
  const [planDays, setPlanDays] = useState<number>(14);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [generatedOverview, setGeneratedOverview] = useState<string>("");

  // New Custom Task State
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newTaskCategory, setNewTaskCategory] = useState<TaskCategory>("fertilizer");
  const [newTaskPlotId, setNewTaskPlotId] = useState(garden.plots[0]?.id || "");
  const [newTaskDate, setNewTaskDate] = useState(new Date().toISOString().slice(0, 10));
  const [newTaskTime, setNewTaskTime] = useState("Sáng sớm (06:00 - 08:00)");
  const [newTaskInstructions, setNewTaskInstructions] = useState("");
  const [newTaskPriority, setNewTaskPriority] = useState<"high" | "medium" | "low">("medium");

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

  // Filtered tasks for current garden
  const farmTasks = tasks.filter((t) => t.farmId === garden.id);
  const filteredTasks = farmTasks.filter((t) => {
    if (selectedPlotFilter !== "all" && t.plotId !== selectedPlotFilter) return false;
    if (selectedCategoryFilter !== "all" && t.category !== selectedCategoryFilter) return false;
    return true;
  });

  const completedCount = farmTasks.filter((t) => t.isCompleted).length;
  const progressPct = farmTasks.length > 0 ? Math.round((completedCount / farmTasks.length) * 100) : 0;

  const handleGenerateAiPlan = async () => {
    setIsGenerating(true);
    const plot = garden.plots.find((p) => p.id === targetPlotId) || garden.plots[0];

    try {
      const res = await fetch("/api/generate-plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          gardenInfo: {
            name: garden.name,
            location: garden.location,
            soilType: garden.soilType,
            irrigationType: garden.irrigationType,
            cultivationStandard: garden.cultivationStandard
          },
          plot: {
            id: plot?.id,
            name: plot?.name,
            cropName: plot?.cropName,
            variety: plot?.variety,
            treeAge: plot?.treeAgeYears,
            stage: plot?.stage
          },
          durationDays: planDays,
          focusGoal: planGoal
        })
      });

      const data = await res.json();
      if (data.success && data.plan) {
        setGeneratedOverview(data.overviewNote || "");
        const today = new Date();

        data.plan.forEach((item: any, idx: number) => {
          const taskDate = new Date(today);
          taskDate.setDate(today.getDate() + (item.dayOffset || idx + 1));

          const createdTask: CareTask = {
            id: `task-ai-${Date.now()}-${idx}`,
            farmId: garden.id,
            plotId: plot.id,
            date: taskDate.toISOString().slice(0, 10),
            title: item.title,
            category: item.category || "pest_control",
            timeOfDay: item.timeOfDay || "Buổi sáng",
            instructions: item.instructions || "",
            dosage: item.dosage || "",
            priority: item.priority || "medium",
            isCompleted: false,
            assignedTo: "Đội ngũ chăm sóc"
          };
          onAddTask(createdTask);
        });

        setShowAiModal(false);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCreateCustomTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;

    // Filter valid materials
    const validMaterials: TaskMaterialItem[] = materialsList
      .map((m) => ({
        name: m.name.trim(),
        dosage: m.dosage.trim(),
        costVND: m.costVND !== "" && !isNaN(Number(m.costVND)) ? Math.max(0, Number(m.costVND)) : undefined
      }))
      .filter((m) => m.name !== "" || m.dosage !== "" || m.costVND !== undefined);

    // Format combined dosage text
    let combinedDosage = "";
    if (validMaterials.length > 0) {
      combinedDosage = validMaterials
        .map((m) => {
          if (m.name && m.dosage) return `${m.name}: ${m.dosage}`;
          if (m.name) return m.name;
          return m.dosage;
        })
        .join(", ");
    }

    const taskCost = totalMaterialsCost > 0 ? totalMaterialsCost : undefined;

    const task: CareTask = {
      id: `task-${Date.now()}`,
      farmId: garden.id,
      plotId: newTaskPlotId,
      date: newTaskDate,
      title: newTaskTitle.trim(),
      category: newTaskCategory,
      timeOfDay: newTaskTime,
      instructions: newTaskInstructions.trim(),
      dosage: combinedDosage || undefined,
      materials: validMaterials.length > 0 ? validMaterials : undefined,
      costVND: taskCost,
      priority: newTaskPriority,
      isCompleted: false,
      assignedTo: "Chủ vườn / Nhân công"
    };

    onAddTask(task);
    setShowNewTaskModal(false);
    setNewTaskTitle("");
    setNewTaskInstructions("");
    setMaterialsList([{ id: `mat-${Date.now()}`, name: "", dosage: "", costVND: "" }]);
  };

  const handleToggleWithFeedback = (task: CareTask) => {
    const willComplete = !task.isCompleted;
    onToggleTask(task.id);
    const plot = garden.plots.find((p) => p.id === task.plotId);
    const plotName = plot ? plot.name : "Lô vườn";
    if (willComplete) {
      setToastMessage(`Đã hoàn thành "${task.title}" và tự động đồng bộ sang Nhật ký canh tác của ${plotName}!`);
    } else {
      setToastMessage(`Đã hủy hoàn thành và thu hồi ghi chép tương ứng khỏi Nhật ký.`);
    }
    setTimeout(() => setToastMessage(null), 4500);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header Bar Bento Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-7 border border-[#E2ECE2] shadow-[0_4px_20px_-4px_rgba(45,90,39,0.06)] flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E8F3E8] text-[#2D5A27] text-xs font-bold mb-2.5 border border-emerald-200">
            <Calendar className="w-3.5 h-3.5 text-[#2D5A27]" />
            <span>Phác Đồ & Lịch Canh Tác Cá Nhân Hoá</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Lịch Chăm Sóc & Dinh Dưỡng Cây Trồng
          </h1>
          <p className="text-[#527050] text-xs sm:text-sm mt-1.5 leading-relaxed max-w-2xl">
            Phác đồ điều tiết theo đúng tuổi cây, loại đất <strong className="text-[#2D5A27] font-bold">{garden.soilType}</strong> và tiêu chuẩn <strong className="text-[#2D5A27] font-bold">{garden.cultivationStandard}</strong>. Dữ liệu khi hoàn thành sẽ <strong className="text-[#2D5A27]">tự động đồng bộ vào Nhật ký canh tác</strong>.
          </p>
        </div>

        {/* Buttons */}
        <div className="flex flex-wrap gap-2.5 w-full md:w-auto">
          <button
            id="open-ai-care-plan-modal-btn"
            type="button"
            onClick={() => setShowAiModal(true)}
            className="flex-1 md:flex-none px-4 py-3 bg-[#2D5A27] hover:bg-[#1E3F1A] text-white font-bold text-xs sm:text-sm rounded-2xl shadow-md flex items-center justify-center gap-2 transition cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-[#A3D99E]" />
            <span>AI Tạo Phác Đồ Vườn</span>
          </button>

          <button
            id="open-new-task-modal-btn"
            type="button"
            onClick={() => setShowNewTaskModal(true)}
            className="px-4 py-3 bg-[#162e13] hover:bg-[#1f3f1b] text-[#A3D99E] font-semibold text-xs sm:text-sm rounded-2xl border border-[#2D5A27] flex items-center justify-center gap-1.5 transition cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Thêm Nhiệm Vụ</span>
          </button>
        </div>
      </div>

      {/* Sync Toast Notification */}
      {toastMessage && (
        <div className="bg-[#E8F3E8] border border-[#A3D99E] text-[#1E3F1A] px-5 py-3.5 rounded-2xl flex items-center justify-between shadow-sm animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="flex items-center gap-2 text-xs sm:text-sm font-semibold">
            <BookOpenCheck className="w-4 h-4 text-[#2D5A27]" />
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

      {/* Progress & Overview Bento Card */}
      <div className="bg-[#F4F9F4] rounded-3xl p-5 sm:p-6 border border-[#E2ECE2] shadow-[0_4px_20px_-4px_rgba(45,90,39,0.04)] flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4 w-full md:w-auto">
          <div className="w-14 h-14 rounded-2xl bg-[#2D5A27] text-white font-extrabold text-lg flex items-center justify-center shadow-md shrink-0">
            {progressPct}%
          </div>
          <div>
            <h3 className="font-bold text-sm text-[#1E3F1A]">
              Tiến Độ Thực Hiện Phác Đồ Canh Tác
            </h3>
            <p className="text-xs text-[#527050] mt-0.5">
              Đã hoàn thành <strong>{completedCount}</strong> trên tổng số <strong>{farmTasks.length}</strong> công việc đề ra.
            </p>
          </div>
        </div>

        {/* Quick Filter Selectors */}
        <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto justify-end">
          <div className="flex items-center gap-2 bg-white px-3.5 py-2 rounded-2xl border border-[#E2ECE2] text-xs shadow-sm">
            <Layers className="w-3.5 h-3.5 text-[#527050]" />
            <select
              value={selectedPlotFilter}
              onChange={(e) => setSelectedPlotFilter(e.target.value)}
              className="bg-transparent font-semibold text-slate-700 outline-none cursor-pointer"
            >
              <option value="all">Tất cả Lô vườn</option>
              {garden.plots.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2 bg-white px-3.5 py-2 rounded-2xl border border-[#E2ECE2] text-xs shadow-sm">
            <Filter className="w-3.5 h-3.5 text-[#527050]" />
            <select
              value={selectedCategoryFilter}
              onChange={(e) => setSelectedCategoryFilter(e.target.value)}
              className="bg-transparent font-semibold text-slate-700 outline-none cursor-pointer"
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
      </div>

      {/* Task Timeline Bento Tiles */}
      <div className="space-y-3">
        {filteredTasks.map((task) => {
          const catInfo = CATEGORY_MAP[task.category] || CATEGORY_MAP.pest_control;
          const CatIcon = catInfo.icon;
          const plotObj = garden.plots.find((p) => p.id === task.plotId);

          return (
            <div
              key={task.id}
              className={`bg-white rounded-3xl p-5 border transition-all shadow-[0_4px_20px_-4px_rgba(45,90,39,0.06)] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${
                task.isCompleted
                  ? "border-[#E2ECE2] bg-[#F9FBF9] opacity-70"
                  : task.priority === "high"
                  ? "border-rose-300 hover:border-rose-400"
                  : "border-[#E2ECE2] hover:border-[#2D5A27]/40"
              }`}
            >
              {/* Left Details */}
              <div className="flex items-start gap-3.5 flex-1">
                {/* Complete Toggle Button */}
                <button
                  type="button"
                  onClick={() => handleToggleWithFeedback(task)}
                  className="mt-1 shrink-0 text-slate-400 hover:text-[#2D5A27] transition cursor-pointer"
                  title={task.isCompleted ? "Hủy hoàn thành (thu hồi đồng bộ)" : "Đánh dấu hoàn thành & Tự động đồng bộ sang Nhật ký"}
                >
                  {task.isCompleted ? (
                    <CheckCircle2 className="w-6 h-6 text-[#2D5A27] fill-[#E8F3E8]" />
                  ) : (
                    <Circle className="w-6 h-6 hover:stroke-[#2D5A27]" />
                  )}
                </button>

                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className={`text-[11px] font-bold px-3 py-0.5 rounded-full border flex items-center gap-1.5 ${catInfo.color}`}>
                      <CatIcon className="w-3 h-3" />
                      <span>{catInfo.label}</span>
                    </span>

                    <span className="text-xs font-semibold text-slate-600 bg-[#F9FBF9] px-2.5 py-0.5 rounded-full border border-[#E2ECE2]">
                      {plotObj?.name || "Lô vườn"}
                    </span>

                    {task.isCompleted && (
                      <span className="text-[11px] font-bold text-emerald-800 bg-[#E8F3E8] px-2.5 py-0.5 rounded-full border border-emerald-200 flex items-center gap-1">
                        <BookOpenCheck className="w-3 h-3 text-[#2D5A27]" />
                        <span>Đã đồng bộ sang Nhật ký</span>
                      </span>
                    )}

                    {task.priority === "high" && !task.isCompleted && (
                      <span className="text-[10px] font-extrabold bg-rose-100 text-rose-800 px-2.5 py-0.5 rounded-full uppercase">
                        Ưu tiên cao
                      </span>
                    )}
                  </div>

                  <h3 className={`text-sm sm:text-base font-bold text-slate-900 mt-1 ${
                    task.isCompleted ? "line-through text-slate-500" : ""
                  }`}>
                    {task.title}
                  </h3>

                  {task.instructions && (
                    <p className="text-xs text-[#527050] leading-relaxed max-w-2xl mt-0.5">
                      {task.instructions}
                    </p>
                  )}

                  <div className="flex flex-wrap items-center gap-3 text-xs text-[#739270] pt-1.5">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-[#527050]" />
                      {task.date} • {task.timeOfDay}
                    </span>
                    {task.dosage && (
                      <span className="text-[#2D5A27] font-semibold bg-[#E8F3E8] px-2.5 py-0.5 rounded-lg border border-emerald-100">
                        Liều: {task.dosage}
                      </span>
                    )}
                    {task.costVND !== undefined && task.costVND > 0 && (
                      <span className="text-amber-800 font-bold bg-amber-50 px-2.5 py-0.5 rounded-lg border border-amber-200 flex items-center gap-1">
                        <Coins className="w-3.5 h-3.5 text-amber-600" />
                        <span>Chi phí: {task.costVND.toLocaleString("vi-VN")} đ</span>
                      </span>
                    )}
                    {task.assignedTo && (
                      <span className="text-slate-500">Phụ trách: {task.assignedTo}</span>
                    )}
                  </div>

                  {/* Material breakdown badges if present */}
                  {task.materials && task.materials.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-1.5">
                      {task.materials.map((mat, idx) => (
                        <span
                          key={idx}
                          className="inline-flex items-center gap-1 text-[11px] font-medium bg-[#F4F9F4] text-[#2D5A27] px-2.5 py-0.5 rounded-lg border border-[#E2ECE2]"
                        >
                          <Package className="w-3 h-3 text-[#527050]" />
                          <span className="font-semibold">{mat.name}</span>
                          {mat.dosage && <span className="text-slate-500">({mat.dosage})</span>}
                          {mat.costVND !== undefined && mat.costVND > 0 && (
                            <span className="font-bold text-amber-700 bg-amber-100/80 px-1.5 py-0.2 rounded text-[10px] ml-0.5">
                              {mat.costVND.toLocaleString("vi-VN")}đ
                            </span>
                          )}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Right Action */}
              <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                <button
                  type="button"
                  onClick={() => onDeleteTask(task.id)}
                  className="p-2.5 text-slate-400 hover:text-rose-600 rounded-xl hover:bg-rose-50 transition cursor-pointer"
                  title="Xoá nhiệm vụ"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}

        {filteredTasks.length === 0 && (
          <div className="bg-white rounded-3xl p-12 border border-[#E2ECE2] shadow-[0_4px_20px_-4px_rgba(45,90,39,0.06)] text-center space-y-3">
            <Calendar className="w-12 h-12 text-[#A3D99E] mx-auto" />
            <h3 className="text-base font-bold text-slate-800">
              Không có công việc nào trong danh mục này
            </h3>
            <p className="text-xs text-[#527050] max-w-sm mx-auto">
              Bấm nút "AI Tạo Phác Đồ Vườn" để tự động tạo lịch dinh dưỡng và phòng trừ sâu bệnh thông minh.
            </p>
            <button
              type="button"
              onClick={() => setShowAiModal(true)}
              className="mt-2 px-5 py-2.5 bg-[#2D5A27] text-white font-bold text-xs rounded-2xl shadow-sm inline-flex items-center gap-1.5 cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#A3D99E]" />
              <span>Tạo phác đồ ngay</span>
            </button>
          </div>
        )}
      </div>

      {/* MODAL: AI Care Plan Generator */}
      {showAiModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl border border-[#E2ECE2] animate-in fade-in zoom-in-95 duration-150 space-y-5">
            <div className="flex items-start justify-between">
              <div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E8F3E8] text-[#2D5A27] text-xs font-bold mb-1 border border-emerald-200">
                  <Sparkles className="w-3.5 h-3.5 text-[#2D5A27]" />
                  <span>Kỹ Sư AI Nông Nghiệp</span>
                </div>
                <h3 className="text-xl font-bold text-slate-900">
                  Lập Phác Đồ Chăm Sóc Cá Nhân Hoá
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowAiModal(false)}
                className="text-slate-400 hover:text-slate-600 text-sm font-bold p-1 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-[#527050]">
              Mô hình AI sẽ tính toán thời điểm bón phân, tỷ lệ NPK/Hữu cơ, chu kỳ tưới và lịch phun phòng sâu bệnh riêng cho loại đất <strong className="text-slate-800">{garden.soilType}</strong> tại <strong className="text-slate-800">{garden.location}</strong>.
            </p>

            <div className="space-y-4 text-xs sm:text-sm">
              {/* Select Plot */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Chọn Lô Cây Trồng Áp Dụng:
                </label>
                <select
                  value={targetPlotId}
                  onChange={(e) => setTargetPlotId(e.target.value)}
                  className="w-full p-3 bg-[#F9FBF9] border border-[#E2ECE2] rounded-2xl font-semibold text-slate-800 outline-none focus:ring-2 focus:ring-[#2D5A27]"
                >
                  {garden.plots.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} ({p.cropName} - {p.variety}) - Giai đoạn: {p.stage}
                    </option>
                  ))}
                </select>
              </div>

              {/* Goal */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Mục Tiêu & Định Hướng Canh Tác:
                </label>
                <select
                  value={planGoal}
                  onChange={(e) => setPlanGoal(e.target.value)}
                  className="w-full p-3 bg-[#F9FBF9] border border-[#E2ECE2] rounded-2xl text-slate-800 outline-none focus:ring-2 focus:ring-[#2D5A27] font-medium"
                >
                  <option value="Tăng cường sức đề kháng mùa mưa & Dưỡng cơi đọt đồng loạt">
                    Tăng cường sức đề kháng mùa mưa & Dưỡng cơi đọt đồng loạt
                  </option>
                  <option value="Kích thích phân hoá mầm hoa & Dưỡng hoa mập mạp">
                    Kích thích phân hoá mầm hoa & Dưỡng hoa mập mạp
                  </option>
                  <option value="Chống rụng trái non & Tăng độ ngọt tròn quả">
                    Chống rụng trái non & Tăng độ ngọt tròn quả
                  </option>
                  <option value="Phục hồi cây suy kiệt & Tái tạo rễ tơ sau thu hoạch">
                    Phục hồi cây suy kiệt & Tái tạo rễ tơ sau thu hoạch
                  </option>
                  <option value="Phòng trừ nấm thán thư, xì mủ và bọ trĩ theo chuẩn VietGAP">
                    Phòng trừ nấm thán thư, xì mủ và bọ trĩ theo chuẩn VietGAP
                  </option>
                </select>
              </div>

              {/* Days duration */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Khung Thời Gian Lập Kế Hoạch:
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[7, 14, 30].map((d) => (
                    <button
                      key={d}
                      type="button"
                      onClick={() => setPlanDays(d)}
                      className={`py-2.5 rounded-2xl border text-xs font-bold transition cursor-pointer ${
                        planDays === d
                          ? "bg-[#2D5A27] text-white border-[#2D5A27] shadow-sm"
                          : "bg-[#F9FBF9] text-[#527050] border-[#E2ECE2] hover:bg-[#E8F3E8]"
                      }`}
                    >
                      {d} Ngày tới
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="pt-3 border-t border-[#F0F5F0] flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowAiModal(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl cursor-pointer"
              >
                Hủy bỏ
              </button>
              <button
                type="button"
                onClick={handleGenerateAiPlan}
                disabled={isGenerating}
                className="px-5 py-2.5 bg-[#2D5A27] hover:bg-[#1E3F1A] disabled:opacity-50 text-white font-bold text-xs sm:text-sm rounded-2xl shadow-md flex items-center gap-2 transition cursor-pointer"
              >
                {isGenerating ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Đang Tạo Phác Đồ...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-[#A3D99E]" />
                    <span>Tạo Lịch Chăm Sóc AI</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: Custom Manual Task */}
      {showNewTaskModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <form
            onSubmit={handleCreateCustomTask}
            className="bg-white rounded-3xl p-6 sm:p-8 max-w-2xl w-full shadow-2xl border border-[#E2ECE2] animate-in fade-in zoom-in-95 duration-150 space-y-4 text-xs sm:text-sm my-8 max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-start justify-between pb-2 border-b border-[#F0F5F0]">
              <div>
                <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <span>Thêm Nhiệm Vụ Chăm Sóc Mới</span>
                </h3>
                <p className="text-xs text-[#527050] mt-0.5">
                  Lên lịch hoạt động canh tác kèm định mức vật tư và chi phí chi tiết
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowNewTaskModal(false)}
                className="text-slate-400 hover:text-slate-600 font-bold p-1 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Tên công việc / hoạt động:</label>
              <input
                type="text"
                required
                value={newTaskTitle}
                onChange={(e) => setNewTaskTitle(e.target.value)}
                placeholder="Ví dụ: Bón phân thúc cơi đọt Lô A, Phun ngừa nấm Phytophthora..."
                className="w-full p-3 bg-[#F9FBF9] border border-[#E2ECE2] rounded-2xl outline-none focus:ring-2 focus:ring-[#2D5A27]"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Hạng mục:</label>
                <select
                  value={newTaskCategory}
                  onChange={(e) => setNewTaskCategory(e.target.value as TaskCategory)}
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
                <label className="block font-bold text-slate-700 mb-1">Lô áp dụng:</label>
                <select
                  value={newTaskPlotId}
                  onChange={(e) => setNewTaskPlotId(e.target.value)}
                  className="w-full p-3 bg-[#F9FBF9] border border-[#E2ECE2] rounded-2xl outline-none cursor-pointer"
                >
                  {garden.plots.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} ({p.cropName})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Ngày thực hiện:</label>
                <input
                  type="date"
                  value={newTaskDate}
                  onChange={(e) => setNewTaskDate(e.target.value)}
                  className="w-full p-3 bg-[#F9FBF9] border border-[#E2ECE2] rounded-2xl outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Thời điểm trong ngày:</label>
                <input
                  type="text"
                  value={newTaskTime}
                  onChange={(e) => setNewTaskTime(e.target.value)}
                  placeholder="Sáng sớm / Chiều mát"
                  className="w-full p-3 bg-[#F9FBF9] border border-[#E2ECE2] rounded-2xl outline-none"
                />
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
                          Liều Lượng:
                        </label>
                        <input
                          type="text"
                          value={item.dosage}
                          onChange={(e) => handleMaterialChange(idx, "dosage", e.target.value)}
                          placeholder="500g/gốc, 250ml/200L..."
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
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Hướng dẫn / Ghi chú kỹ thuật:</label>
              <textarea
                value={newTaskInstructions}
                onChange={(e) => setNewTaskInstructions(e.target.value)}
                rows={2}
                placeholder="Ghi chú thêm về quy cách tưới xả, bảo hộ lao động hoặc hướng gió khi phun..."
                className="w-full p-3 bg-[#F9FBF9] border border-[#E2ECE2] rounded-2xl outline-none resize-none"
              />
            </div>

            <div className="pt-3 border-t border-[#F0F5F0] flex items-center justify-between gap-2">
              <button
                type="button"
                onClick={() => setShowNewTaskModal(false)}
                className="px-4 py-2.5 font-semibold text-slate-600 hover:bg-slate-100 rounded-xl cursor-pointer"
              >
                Đóng
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 bg-[#2D5A27] hover:bg-[#1E3F1A] text-white font-bold rounded-2xl shadow-sm flex items-center gap-2 cursor-pointer transition"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Lưu Nhiệm Vụ & Chi Phí</span>
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
