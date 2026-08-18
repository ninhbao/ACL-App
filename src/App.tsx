import React, { useState, useEffect } from "react";
import { Navbar } from "./components/Navbar";
import { OverviewDashboard } from "./components/OverviewDashboard";
import { AIDiagnosisView } from "./components/AIDiagnosisView";
import { PersonalizedCarePlan } from "./components/PersonalizedCarePlan";
import { GardenProfileManager } from "./components/GardenProfileManager";
import { FarmDiaryLogs } from "./components/FarmDiaryLogs";
import { AIConsultantChat } from "./components/AIConsultantChat";
import { WeatherForecastView } from "./components/WeatherForecastView";
import { ModalNewGarden } from "./components/ModalNewGarden";
import { 
  GardenProfile, 
  DiagnosisRecord, 
  CareTask, 
  FarmDiaryLog,
  LogCategory
} from "./types";
import { 
  SAMPLE_GARDENS, 
  INITIAL_DIAGNOSES, 
  INITIAL_CARE_TASKS, 
  INITIAL_DIARY_LOGS 
} from "./data/sampleGardens";

const DATA_VERSION = "v3_bp_tn";

export default function App() {
  // 1. Garden State (with localStorage persistence & version check)
  const [gardens, setGardens] = useState<GardenProfile[]>(() => {
    try {
      const ver = localStorage.getItem("agricare_version");
      if (ver === DATA_VERSION) {
        const saved = localStorage.getItem("agricare_gardens");
        if (saved) return JSON.parse(saved);
      }
    } catch (e) {
      console.error(e);
    }
    return SAMPLE_GARDENS;
  });

  const [currentGardenId, setCurrentGardenId] = useState<string>(() => {
    try {
      const ver = localStorage.getItem("agricare_version");
      if (ver === DATA_VERSION) {
        const saved = localStorage.getItem("agricare_active_garden_id");
        if (saved && SAMPLE_GARDENS.some(g => g.id === saved)) return saved;
      }
    } catch (e) {}
    return SAMPLE_GARDENS[0]?.id || "garden-binhphuoc";
  });

  // Active Garden Profile
  const currentGarden =
    gardens.find((g) => g.id === currentGardenId) || gardens[0] || SAMPLE_GARDENS[0];

  // 2. Health & Diagnostic Records
  const [diagnoses, setDiagnoses] = useState<DiagnosisRecord[]>(() => {
    try {
      const ver = localStorage.getItem("agricare_version");
      if (ver === DATA_VERSION) {
        const saved = localStorage.getItem("agricare_diagnoses");
        if (saved) return JSON.parse(saved);
      }
    } catch (e) {}
    return INITIAL_DIAGNOSES;
  });

  // 3. Care Schedule Tasks
  const [tasks, setTasks] = useState<CareTask[]>(() => {
    try {
      const ver = localStorage.getItem("agricare_version");
      if (ver === DATA_VERSION) {
        const saved = localStorage.getItem("agricare_tasks");
        if (saved) return JSON.parse(saved);
      }
    } catch (e) {}
    return INITIAL_CARE_TASKS;
  });

  // 4. Farm Diary Logs
  const [logs, setLogs] = useState<FarmDiaryLog[]>(() => {
    try {
      const ver = localStorage.getItem("agricare_version");
      if (ver === DATA_VERSION) {
        const saved = localStorage.getItem("agricare_logs");
        if (saved) return JSON.parse(saved);
      }
    } catch (e) {}
    return INITIAL_DIARY_LOGS;
  });

  // Navigation State
  const [activeTab, setActiveTab] = useState<string>("overview");
  const [targetPlotForDiagnosis, setTargetPlotForDiagnosis] = useState<string | undefined>(undefined);
  const [isNewGardenModalOpen, setIsNewGardenModalOpen] = useState(false);

  // Persistence Effects
  useEffect(() => {
    localStorage.setItem("agricare_version", DATA_VERSION);
    localStorage.setItem("agricare_gardens", JSON.stringify(gardens));
  }, [gardens]);

  useEffect(() => {
    localStorage.setItem("agricare_active_garden_id", currentGardenId);
  }, [currentGardenId]);

  useEffect(() => {
    localStorage.setItem("agricare_diagnoses", JSON.stringify(diagnoses));
  }, [diagnoses]);

  useEffect(() => {
    localStorage.setItem("agricare_tasks", JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem("agricare_logs", JSON.stringify(logs));
  }, [logs]);

  // Handlers
  const handleSelectGarden = (g: GardenProfile) => {
    setCurrentGardenId(g.id);
  };

  const handleAddGarden = (newGarden: GardenProfile) => {
    setGardens((prev) => [newGarden, ...prev]);
    setCurrentGardenId(newGarden.id);
    setActiveTab("overview");
  };

  const handleUpdateGarden = (updated: GardenProfile) => {
    setGardens((prev) => prev.map((g) => (g.id === updated.id ? updated : g)));
  };

  const handleDeleteGarden = (id: string) => {
    if (gardens.length <= 1) {
      alert("Hệ thống cần lưu giữ ít nhất 1 nhà vườn.");
      return;
    }
    const filtered = gardens.filter((g) => g.id !== id);
    setGardens(filtered);
    setCurrentGardenId(filtered[0].id);
  };

  const handleSaveDiagnosis = (record: DiagnosisRecord) => {
    setDiagnoses((prev) => [record, ...prev]);
    
    // If severity is severe/critical, also automatically create care task reminder
    if (record.result.severityLevel === "severe" || record.result.severityLevel === "critical") {
      const autoTask: CareTask = {
        id: `task-auto-${Date.now()}`,
        farmId: record.farmId,
        plotId: record.plotId,
        date: new Date().toISOString().slice(0, 10),
        title: `Xử lý đặc trị: ${record.result.diseaseName}`,
        category: "pest_control",
        timeOfDay: "Sáng sớm",
        instructions: record.result.organicTreatment?.[0] || record.result.chemicalTreatment?.[0] || "Thực hiện theo phác đồ bác sĩ AI",
        priority: "high",
        isCompleted: false
      };
      setTasks((prev) => [autoTask, ...prev]);
    }
  };

  const handleUpdateDiagnosisStatus = (id: string, status: "active" | "treating" | "recovered") => {
    setDiagnoses((prev) =>
      prev.map((d) => (d.id === id ? { ...d, status } : d))
    );
  };

  const handleAddTask = (newTask: CareTask) => {
    setTasks((prev) => [newTask, ...prev]);
  };

  const handleToggleTask = (id: string) => {
    const task = tasks.find((t) => t.id === id);
    if (!task) return;

    const willBeCompleted = !task.isCompleted;
    const completedTime = willBeCompleted
      ? new Date().toISOString().slice(0, 16).replace("T", " ")
      : undefined;

    // 1. Update task state and persist
    setTasks((prev) => {
      const updated = prev.map((t) =>
        t.id === id
          ? {
              ...t,
              isCompleted: willBeCompleted,
              completedAt: completedTime
            }
          : t
      );
      try {
        localStorage.setItem("agricare_tasks", JSON.stringify(updated));
      } catch (e) {
        console.error("Error saving tasks:", e);
      }
      return updated;
    });

    // 2. Automatically sync to Farm Diary Logs by garden & plot
    const syncLogId = `log-sync-task-${task.id}`;

    if (willBeCompleted) {
      // Map task category to log category
      let logCategory: LogCategory = "general";
      if (task.category === "fertilizer") logCategory = "fertilizing";
      else if (task.category === "pest_control") logCategory = "treatment";
      else if (task.category === "soil_care") logCategory = "soil_test";
      else if (task.category === "harvest") logCategory = "harvest";
      else if (task.category === "inspection") logCategory = "inspection";

      // Extract material information if relevant
      let materialName: string | undefined = undefined;
      if (task.materials && task.materials.length > 0) {
        materialName = task.materials
          .map((m) => `${m.name}${m.dosage ? ` (${m.dosage})` : ""}${m.costVND ? ` [${m.costVND.toLocaleString("vi-VN")} đ]` : ""}`)
          .join(" + ");
      } else if (task.category === "fertilizer" || task.category === "pest_control") {
        materialName = task.dosage ? `${task.title} (${task.dosage})` : task.title;
      }

      const newSyncedLog: FarmDiaryLog = {
        id: syncLogId,
        farmId: task.farmId,
        plotId: task.plotId,
        date: new Date().toISOString().slice(0, 10),
        category: logCategory,
        title: task.title,
        details: `[Tự động đồng bộ từ Lịch canh tác & Phác đồ] Đã hoàn thành nhiệm vụ: ${task.instructions || task.title}.${task.dosage ? ` Vật tư & Liều lượng: ${task.dosage}.` : ""}${task.timeOfDay ? ` Khung giờ: ${task.timeOfDay}.` : ""}`,
        materialName: materialName,
        materials: task.materials && task.materials.length > 0 ? task.materials : undefined,
        operatorName: task.assignedTo || currentGarden.ownerName || "Chủ vườn",
        metrics: {
          costVND: task.costVND,
        }
      };

      setLogs((prev) => {
        const withoutOld = prev.filter((l) => l.id !== syncLogId);
        const updated = [newSyncedLog, ...withoutOld];
        try {
          localStorage.setItem("agricare_logs", JSON.stringify(updated));
        } catch (e) {
          console.error("Error syncing diary logs:", e);
        }
        return updated;
      });
    } else {
      // If unchecked, remove the automatically synced log
      setLogs((prev) => {
        const updated = prev.filter((l) => l.id !== syncLogId);
        try {
          localStorage.setItem("agricare_logs", JSON.stringify(updated));
        } catch (e) {
          console.error("Error removing uncompleted log sync:", e);
        }
        return updated;
      });
    }
  };

  const handleDeleteTask = (id: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  };

  const handleAddLog = (newLog: FarmDiaryLog) => {
    setLogs((prev) => {
      const updated = [newLog, ...prev];
      try {
        localStorage.setItem("agricare_logs", JSON.stringify(updated));
      } catch (e) {
        console.error("Error persisting diary logs to localStorage:", e);
      }
      return updated;
    });
  };

  const handleDeleteLog = (id: string) => {
    setLogs((prev) => {
      const updated = prev.filter((l) => l.id !== id);
      try {
        localStorage.setItem("agricare_logs", JSON.stringify(updated));
      } catch (e) {
        console.error("Error updating diary logs in localStorage:", e);
      }
      return updated;
    });
  };

  const handleOpenDiagnosisFromOverview = (plotId?: string) => {
    setTargetPlotForDiagnosis(plotId);
    setActiveTab("diagnosis");
  };

  return (
    <div className="min-h-screen bg-[#F9FBF9] text-[#1a2e18] flex flex-col font-sans antialiased selection:bg-[#E8F3E8] selection:text-[#2D5A27]">
      {/* Top Navigation & Garden Switcher Bar */}
      <Navbar
        gardens={gardens}
        currentGarden={currentGarden}
        onSelectGarden={handleSelectGarden}
        onOpenNewGardenModal={() => setIsNewGardenModalOpen(true)}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeTab === "overview" && (
          <OverviewDashboard
            garden={currentGarden}
            diagnoses={diagnoses}
            tasks={tasks}
            logs={logs}
            onNavigateTab={(tab) => setActiveTab(tab)}
            onOpenNewDiagnosis={handleOpenDiagnosisFromOverview}
          />
        )}

        {activeTab === "diagnosis" && (
          <AIDiagnosisView
            garden={currentGarden}
            selectedPlotId={targetPlotForDiagnosis}
            diagnoses={diagnoses}
            onSaveDiagnosis={handleSaveDiagnosis}
            onUpdateDiagnosisStatus={handleUpdateDiagnosisStatus}
            onAddTaskFromDiagnosis={(diag) => {
              setActiveTab("care-plan");
            }}
          />
        )}

        {activeTab === "weather" && (
          <WeatherForecastView
            garden={currentGarden}
            onAddTaskFromWeather={(task) => handleAddTask(task)}
            onNavigateToCarePlan={() => setActiveTab("care-plan")}
          />
        )}

        {activeTab === "care-plan" && (
          <PersonalizedCarePlan
            garden={currentGarden}
            tasks={tasks}
            onAddTask={handleAddTask}
            onToggleTask={handleToggleTask}
            onDeleteTask={handleDeleteTask}
          />
        )}

        {activeTab === "diary" && (
          <FarmDiaryLogs
            garden={currentGarden}
            logs={logs}
            onAddLog={handleAddLog}
            onDeleteLog={handleDeleteLog}
          />
        )}

        {activeTab === "plots" && (
          <GardenProfileManager
            garden={currentGarden}
            onUpdateGarden={handleUpdateGarden}
            onDeleteGarden={handleDeleteGarden}
          />
        )}

        {activeTab === "consultant" && (
          <AIConsultantChat
            garden={currentGarden}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white/90 border-t border-[#E2ECE2] py-6 text-center text-xs text-[#527050] mt-auto">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div>
            Hệ thống Quản Lý Sức Khoẻ Cây Trồng Cá Nhân Hoá • <strong className="text-[#2D5A27]">{currentGarden.name}</strong> ({currentGarden.location})
          </div>
          <div className="text-[#739270]">
            Ứng dụng Trí tuệ Nhân tạo Nông Y & Tiêu chuẩn {currentGarden.cultivationStandard.split(" ")[0]}
          </div>
        </div>
      </footer>

      {/* Modal: New Garden */}
      <ModalNewGarden
        isOpen={isNewGardenModalOpen}
        onClose={() => setIsNewGardenModalOpen(false)}
        onAddGarden={handleAddGarden}
      />
    </div>
  );
}
