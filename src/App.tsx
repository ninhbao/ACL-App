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
  FarmDiaryLog 
} from "./types";
import { 
  SAMPLE_GARDENS, 
  INITIAL_DIAGNOSES, 
  INITIAL_CARE_TASKS, 
  INITIAL_DIARY_LOGS 
} from "./data/sampleGardens";

export default function App() {
  // 1. Garden State (with localStorage persistence)
  const [gardens, setGardens] = useState<GardenProfile[]>(() => {
    try {
      const saved = localStorage.getItem("agricare_gardens");
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return SAMPLE_GARDENS;
  });

  const [currentGardenId, setCurrentGardenId] = useState<string>(() => {
    try {
      const saved = localStorage.getItem("agricare_active_garden_id");
      if (saved) return saved;
    } catch (e) {}
    return SAMPLE_GARDENS[0]?.id || "garden-daklak-saurieng";
  });

  // Active Garden Profile
  const currentGarden =
    gardens.find((g) => g.id === currentGardenId) || gardens[0] || SAMPLE_GARDENS[0];

  // 2. Health & Diagnostic Records
  const [diagnoses, setDiagnoses] = useState<DiagnosisRecord[]>(() => {
    try {
      const saved = localStorage.getItem("agricare_diagnoses");
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return INITIAL_DIAGNOSES;
  });

  // 3. Care Schedule Tasks
  const [tasks, setTasks] = useState<CareTask[]>(() => {
    try {
      const saved = localStorage.getItem("agricare_tasks");
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return INITIAL_CARE_TASKS;
  });

  // 4. Farm Diary Logs
  const [logs, setLogs] = useState<FarmDiaryLog[]>(() => {
    try {
      const saved = localStorage.getItem("agricare_logs");
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return INITIAL_DIARY_LOGS;
  });

  // Navigation State
  const [activeTab, setActiveTab] = useState<string>("overview");
  const [targetPlotForDiagnosis, setTargetPlotForDiagnosis] = useState<string | undefined>(undefined);
  const [isNewGardenModalOpen, setIsNewGardenModalOpen] = useState(false);

  // Persistence Effects
  useEffect(() => {
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
    setTasks((prev) =>
      prev.map((t) =>
        t.id === id
          ? {
              ...t,
              isCompleted: !t.isCompleted,
              completedAt: !t.isCompleted ? new Date().toISOString().slice(0, 16).replace("T", " ") : undefined
            }
          : t
      )
    );
  };

  const handleDeleteTask = (id: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  };

  const handleAddLog = (newLog: FarmDiaryLog) => {
    setLogs((prev) => [newLog, ...prev]);
  };

  const handleDeleteLog = (id: string) => {
    setLogs((prev) => prev.filter((l) => l.id !== id));
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
