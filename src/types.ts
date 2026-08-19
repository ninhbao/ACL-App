export type SoilType =
  | "Đất đỏ Bazan Đông Nam Bộ / Bình Phước"
  | "Đất đỏ Bazan Tây Nguyên"
  | "Đất phù sa ngọt sông Tiền/sông Hậu"
  | "Đất phù sa cổ / Đất xám bạc màu"
  | "Đất thịt nhẹ pha cát ven biển"
  | "Đất sét pha thịt giữ nước"
  | "Đất mùn đồi núi dốc / Cao nguyên"
  | "Đất phèn nhẹ đã cải tạo";

export type IrrigationType =
  | "Tưới nhỏ giọt bù áp Israel"
  | "Tưới phun mưa cục bộ dưới gốc"
  | "Tưới phun sương tự động nhà màng"
  | "Tưới tràn rãnh mương truyền thống"
  | "Tưới bán tự động dây kéo tay";

export type CultivationStandard =
  | "VietGAP (Nông nghiệp sạch)"
  | "GlobalGAP (Xuất khẩu quốc tế)"
  | "Hữu cơ Sinh học (Organic 100%)"
  | "Hướng hữu cơ / An toàn sinh học"
  | "Canh tác truyền thống cải tiến";

export type GrowthStage =
  | "Kiến thiết cơ bản (Cây con 1-2 năm)"
  | "Phát triển thân lá / Làm cơi đọt"
  | "Phân hoá mầm hoa / Xử lý ra hoa"
  | "Nở hoa & Đậu trái non"
  | "Nuôi trái / Định hình phẩm chất"
  | "Trước thu hoạch 15-30 ngày"
  | "Phục hồi cây sau thu hoạch";

export type SeverityLevel = "mild" | "moderate" | "severe" | "critical";

export interface GardenPlot {
  id: string;
  name: string; // ví dụ: "Lô A - Đang làm đọt"
  cropName: string; // ví dụ: "Sầu riêng"
  variety: string; // ví dụ: "Ri6 / Musang King"
  treeCount: number; // ví dụ: 120 cây
  plantedYear: number; // ví dụ: 2020
  treeAgeYears: number; // ví dụ: 5 tuổi
  stage: GrowthStage;
  areaM2: number;
  healthScore: number; // 0 - 100
  recentIssue?: string;
  lastInspectionDate?: string;
}

export interface GardenProfile {
  id: string;
  name: string;
  region: string; // Khu vực canh tác (ví dụ: "Bình Phước", "Tây Ninh", "Đắk Lắk", "Tiền Giang")
  ownerName: string; // Tên chủ vườn (ví dụ: Nguyễn Văn Phước)
  phone: string;
  location: string; // Tỉnh / Huyện / Địa chỉ
  farmCode?: string; // Mã số vùng trồng (MSVT)
  totalAreaHa: number;
  soilType: SoilType;
  soilPH: number; // ví dụ: 5.8
  irrigationType: IrrigationType;
  cultivationStandard: CultivationStandard;
  plots: GardenPlot[];
  weatherStation: {
    tempC: number;
    humidityPct: number;
    condition: string;
    rainfallMm: number;
    forecast: string;
  };
  notes?: string;
  createdAt: string;
}

export interface AIDiagnosisResult {
  diseaseName: string;
  scientificName?: string;
  severityLevel: SeverityLevel;
  confidenceScore: number;
  causeAnalysis: string;
  symptomMatches: string[];
  organicTreatment: string[];
  chemicalTreatment: string[];
  soilAdjustment: string;
  wateringAdvisory: string;
  preventativeMeasures: string[];
  estimatedRecoveryDays: number;
}

export interface DiagnosisRecord {
  id: string;
  farmId: string;
  plotId: string;
  cropName: string;
  date: string;
  imageUrl?: string;
  symptoms: string;
  result: AIDiagnosisResult;
  status: "active" | "treating" | "recovered";
  notes?: string;
}

export type TaskCategory =
  | "irrigation"
  | "fertilizer"
  | "pest_control"
  | "pruning"
  | "soil_care"
  | "harvest"
  | "inspection";

export interface TaskMaterialItem {
  id?: string;
  name: string;
  dosage: string;
  costVND?: number;
}

export interface CareTask {
  id: string;
  farmId: string;
  plotId: string;
  date: string;
  title: string;
  category: TaskCategory;
  timeOfDay: string;
  instructions: string;
  dosage?: string;
  materials?: TaskMaterialItem[];
  priority: "high" | "medium" | "low";
  isCompleted: boolean;
  completedAt?: string;
  costVND?: number;
  assignedTo?: string;
}

export type LogCategory =
  | "treatment"
  | "fertilizing"
  | "harvest"
  | "soil_test"
  | "weather_event"
  | "inspection"
  | "general";

export interface FarmDiaryLog {
  id: string;
  farmId: string;
  plotId: string;
  date: string;
  category: LogCategory;
  title: string;
  details: string;
  materialName?: string;
  materials?: TaskMaterialItem[];
  quantity?: number;
  unit?: string;
  unitPriceVND?: number;
  supplier?: string;
  batchNumber?: string;
  metrics?: {
    soilPH?: number;
    soilMoisture?: number;
    ecLevel?: number;
    temperature?: number;
    humidity?: number;
    yieldKg?: number;
    costVND?: number;
  };
  operatorName: string;
  images?: string[];
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
}

export interface GroundingSource {
  title: string;
  url: string;
}

export interface DailyForecast {
  date: string;
  dayName: string;
  tempMin: number;
  tempMax: number;
  humidity: number;
  condition: string;
  iconType: "sunny" | "partly-cloudy" | "cloudy" | "rain" | "heavy-rain" | "thunderstorm";
  rainChance: number;
  rainfallMm?: number;
  windSpeedKmh?: number;
  cropRiskLevel: "low" | "medium" | "high" | "critical";
  riskSummary: string;
}

export interface CropRiskAlert {
  id: string;
  title: string;
  category: "fungal" | "pest" | "waterlogging" | "heat_stress" | "wind_damage" | "spray_window";
  severity: "low" | "medium" | "high" | "critical";
  affectedPlots?: string[];
  description: string;
  triggerCondition: string;
  preventativeActions: string[];
  recommendedProducts?: string[];
  sprayWindowAdvice?: {
    isOptimalToSpray: boolean;
    recommendedTime: string;
    notes: string;
  };
}

export interface RealtimeWeatherForecastData {
  location: string;
  resolvedAddress?: string;
  fetchedAt: string;
  isRealtimeGrounded: boolean;
  searchQueries?: string[];
  groundingSources: GroundingSource[];
  current: {
    tempC: number;
    feelsLikeC: number;
    humidityPct: number;
    condition: string;
    windSpeedKmh: number;
    windDirection: string;
    rainChancePct: number;
    rainfallMm: number;
    uvIndex: number;
    pressureHpa?: number;
    dewPointC?: number;
  };
  dailyForecasts: DailyForecast[];
  cropRiskAlerts: CropRiskAlert[];
  overallAgriculturalSummary: string;
  soilImpactAssessment: string;
  irrigationRecommendation: string;
}

