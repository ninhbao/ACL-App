import { GardenProfile, DiagnosisRecord, CareTask, FarmDiaryLog } from "../types";

export const SAMPLE_GARDENS: GardenProfile[] = [
  {
    id: "garden-daklak-saurieng",
    name: "Vườn Sầu Riêng Bác Ba - Krông Pắc",
    ownerName: "Nguyễn Văn Ba",
    phone: "0918 345 678",
    location: "Krông Pắc, Đắk Lắk (Tây Nguyên)",
    totalAreaHa: 3.5,
    soilType: "Đất đỏ Bazan Tây Nguyên",
    soilPH: 5.6,
    irrigationType: "Tưới nhỏ giọt bù áp Israel",
    cultivationStandard: "VietGAP (Nông nghiệp sạch)",
    createdAt: "2024-03-15",
    notes: "Đất đỏ bazan tầng dày, thoát nước tốt nhưng dễ bị rửa trôi canxi & magie vào mùa mưa bão. Mục tiêu giữ đọt thuần thục đồng đều để nuôi trái đạt chuẩn xuất khẩu.",
    weatherStation: {
      tempC: 28.5,
      humidityPct: 82,
      condition: "Nắng gián đoạn, chiều có mưa dông nhiệt",
      rainfallMm: 24,
      forecast: "Độ ẩm ban đêm cao >90%, nguy cơ nấm Phytophthora bùng phát trên lá non và cổ rễ."
    },
    plots: [
      {
        id: "plot-sr-1",
        name: "Lô A - Sầu Riêng Ri6 Đang Nuôi Trái (Trứng Gà)",
        cropName: "Sầu riêng",
        variety: "Ri6",
        treeCount: 95,
        plantedYear: 2019,
        treeAgeYears: 6,
        stage: "Nuôi trái / Định hình phẩm chất",
        areaM2: 12000,
        healthScore: 88,
        recentIssue: "Có dấu hiệu bọ trĩ nhẹ trên chồi ngọn non",
        lastInspectionDate: "2026-08-15"
      },
      {
        id: "plot-sr-2",
        name: "Lô B - Musang King & Black Thorn Làm Cơi Đọt 2",
        cropName: "Sầu riêng",
        variety: "Musang King (D197)",
        treeCount: 110,
        plantedYear: 2021,
        treeAgeYears: 4,
        stage: "Phát triển thân lá / Làm cơi đọt",
        areaM2: 15000,
        healthScore: 74,
        recentIssue: "Vàng lá gân xanh nhẹ ở vài cây góc triền dốc",
        lastInspectionDate: "2026-08-16"
      },
      {
        id: "plot-sr-3",
        name: "Lô C - Vườn Ươm Cây Giống Ghép Mới",
        cropName: "Sầu riêng gốc ghép",
        variety: "Gốc ghép địa phương + chồi Dona",
        treeCount: 450,
        plantedYear: 2024,
        treeAgeYears: 1,
        stage: "Kiến thiết cơ bản (Cây con 1-2 năm)",
        areaM2: 8000,
        healthScore: 95,
        lastInspectionDate: "2026-08-14"
      }
    ]
  },
  {
    id: "garden-bentre-buoidaixanh",
    name: "Trang Trại Bưởi Da Xanh & Cam Sành Sông Tiền",
    ownerName: "Trần Thị Mai & Chú Tư",
    phone: "0909 888 123",
    location: "Châu Thành, Bến Tre (Đồng Bằng Sông Cửu Long)",
    totalAreaHa: 2.2,
    soilType: "Đất phù sa ngọt sông Tiền/sông Hậu",
    soilPH: 6.2,
    irrigationType: "Tưới phun mưa cục bộ dưới gốc",
    cultivationStandard: "Hữu cơ Sinh học (Organic 100%)",
    createdAt: "2023-11-20",
    notes: "Đất phù sa màu mỡ ven sông Tiền, lên liếp mô cao thoát nước triều cường. Chú trọng nuôi cỏ tạo thảm thực vật sinh thái chống xói mòn và giun đất phát triển.",
    weatherStation: {
      tempC: 31.0,
      humidityPct: 76,
      condition: "Nắng ấm, gió nhẹ từ sông Tiền",
      rainfallMm: 0,
      forecast: "Thời tiết thuận lợi quang hợp. Cần duy trì tưới giữ ẩm mặt mô 2 ngày/lần."
    },
    plots: [
      {
        id: "plot-buoi-1",
        name: "Liếp 1 - Bưởi Da Xanh Xuất Khẩu Giai Đoạn Vô Nước",
        cropName: "Bưởi Da Xanh",
        variety: "Da Xanh ruột hồng Bến Tre",
        treeCount: 160,
        plantedYear: 2018,
        treeAgeYears: 7,
        stage: "Nuôi trái / Định hình phẩm chất",
        areaM2: 10000,
        healthScore: 92,
        lastInspectionDate: "2026-08-17"
      },
      {
        id: "plot-cam-2",
        name: "Liếp 2 - Cam Sành Kiến Thiết Hướng Hữu Cơ",
        cropName: "Cam Sành",
        variety: "Cam sành Tam Bình",
        treeCount: 220,
        plantedYear: 2023,
        treeAgeYears: 2,
        stage: "Phát triển thân lá / Làm cơi đọt",
        areaM2: 12000,
        healthScore: 84,
        recentIssue: "Xuất hiện sâu vẽ bùa ở cơi lá non đầu tuần",
        lastInspectionDate: "2026-08-16"
      }
    ]
  },
  {
    id: "garden-dalat-greenhouse",
    name: "Nông Trại Công Nghệ Cao An Bình - Đà Lạt",
    ownerName: "Lê Hoàng Phúc",
    phone: "0977 654 321",
    location: "Lạc Dương, Lâm Đồng",
    totalAreaHa: 1.5,
    soilType: "Đất mùn đồi núi dốc / Cao nguyên",
    soilPH: 6.0,
    irrigationType: "Tưới phun sương tự động nhà màng",
    cultivationStandard: "GlobalGAP (Xuất khẩu quốc tế)",
    createdAt: "2024-01-10",
    notes: "Canh tác trong nhà màng công nghệ cao Israel, kết hợp giá thể xơ dừa xử lý và châm phân tự động định lượng EC/pH theo giờ.",
    weatherStation: {
      tempC: 21.0,
      humidityPct: 88,
      condition: "Sương mù sáng sớm, se lạnh, nhiều mây",
      rainfallMm: 12,
      forecast: "Nhiệt độ dao động 16-23°C. Cần quạt thông gió nhà màng để tránh đọng sương đốm lá."
    },
    plots: [
      {
        id: "plot-nm-1",
        name: "Nhà Màng 1 - Dâu Tây Bạch Tuyết & Hana Nhật Bản",
        cropName: "Dâu tây",
        variety: "Bạch Tuyết Pearl White & Hana",
        treeCount: 8500,
        plantedYear: 2024,
        treeAgeYears: 1,
        stage: "Nở hoa & Đậu trái non",
        areaM2: 5000,
        healthScore: 96,
        lastInspectionDate: "2026-08-17"
      },
      {
        id: "plot-nm-2",
        name: "Nhà Màng 2 - Ớt Chuông Sweet Pepper & Cà Chua Cherry",
        cropName: "Ớt chuông",
        variety: "Ớt chuông đỏ vàng Đà Lạt",
        treeCount: 4200,
        plantedYear: 2024,
        treeAgeYears: 1,
        stage: "Nuôi trái / Định hình phẩm chất",
        areaM2: 10000,
        healthScore: 90,
        recentIssue: "Bệnh phấn trắng đốm nhỏ trên tán dưới",
        lastInspectionDate: "2026-08-15"
      }
    ]
  }
];

export const INITIAL_DIAGNOSES: DiagnosisRecord[] = [
  {
    id: "diag-001",
    farmId: "garden-daklak-saurieng",
    plotId: "plot-sr-2",
    cropName: "Sầu riêng Musang King",
    date: "2026-08-16",
    symptoms: "Cháy rìa chóp lá non, có đốm thâm nâu quầng vàng, rụng vài đọt lá bánh tẻ sau trận mưa dầm.",
    status: "treating",
    result: {
      diseaseName: "Bệnh Thán Thư (Colletotrichum gloeosporioides) & Bọ Trĩ Chích Hút",
      scientificName: "Colletotrichum gloeosporioides",
      severityLevel: "moderate",
      confidenceScore: 94,
      causeAnalysis: "Do đất đỏ Bazan tích tụ ẩm cao sau chuỗi ngày mưa dầm, độ ẩm vườn đạt 82%. Đọt non mới nhú giàu đường khử là thức ăn hấp dẫn của bọ trĩ, vết thương chích hút tạo cửa ngõ cho nấm thán thư xâm nhiễm.",
      symptomMatches: [
        "Vết thâm hoại tử từ chóp lá lan hình chữ V",
        "Mặt dưới lá có vết rỉ đồng nhẹ do bọ trĩ",
        "Gân lá non bị giòn và cong quẹo"
      ],
      organicTreatment: [
        "Phun nấm đối kháng Trichoderma kết hợp nấm xanh nấm trắng (Metarhizium + Beauveria) để diệt bọ trĩ",
        "Phun tinh dầu thảo mộc Neem Oil 0.3% vào sáng sớm để xua đuổi côn trùng",
        "Bổ sung Canxi-Bo hữu cơ qua lá để vách tế bào đọt dẻo dai"
      ],
      chemicalTreatment: [
        "Nếu mật độ bọ trĩ cao: Sử dụng Imidacloprid (Confidor 100SL) 15ml / bình 25L luân phiên với Abamectin 3.6EC",
        "Trị nấm thán thư: Phun Difenoconazole + Azoxystrobin (Amistar Top 325SC) pha 20ml / bình 25L",
        "Thời gian cách ly an toàn: 14 ngày"
      ],
      soilAdjustment: "Đất đỏ bazan có xu hướng chua khi mưa nhiều: Rải 300g vôi dolomite/gốc quanh mép tán, không bón đạm ure lúc này.",
      wateringAdvisory: "Tạm ngắt tưới nhỏ giọt 3 ngày. Xẻ rãnh thoát nước giữa 2 hàng cây chống ứ nước cổ rễ.",
      preventativeMeasures: [
        "Phun ngừa định kỳ khi cây vừa nhú đọt bằng hạt gạo (mũi giáo)",
        "Tỉa bớt cành vượt rậm rạp bên trong tán để đón ánh sáng triệt để"
      ],
      estimatedRecoveryDays: 12
    }
  },
  {
    id: "diag-002",
    farmId: "garden-bentre-buoidaixanh",
    plotId: "plot-cam-2",
    cropName: "Cam Sành",
    date: "2026-08-14",
    symptoms: "Lá non xuất hiện các đường ngoằn ngoèo màu trắng bạc, mép lá bị quăn queo co rúm.",
    status: "recovered",
    result: {
      diseaseName: "Sâu Vẽ Bùa hại cây có múi (Phyllocnistis citrella)",
      scientificName: "Phyllocnistis citrella Stainton",
      severityLevel: "mild",
      confidenceScore: 98,
      causeAnalysis: "Sâu non đục dưới lớp biểu bì lá cam non đang giai đoạn bung đọt phù sa, để lại vệt màng trắng bóng ngoằn ngoèo làm giảm 40% khả năng quang hợp.",
      symptomMatches: [
        "Đường hầm ngoằn ngoèo bạc trắng sáng dưới biểu bì",
        "Lá non biến dạng, cong queo như chiếc thuyền",
        "Vết thương dễ dẫn đến bệnh loét vi khuẩn (Xanthomonas)"
      ],
      organicTreatment: [
        "Phun Dầu khoáng sinh học SK Enspray 99 EC (pha 30-40ml/20 lít nước) bịt lỗ thở của sâu non",
        "Tưới gốc bằng chế phẩm vi sinh Bacillus thuringiensis (Bt)",
        "Bảo vệ thiên địch kiến vàng và ong ký sinh trong vườn"
      ],
      chemicalTreatment: [
        "Trường hợp khẩn cấp: Phun hoạt chất Spinetoram (Radiant 60SC) 15ml / bình 25L lúc đọt non vừa nhú 1-2cm"
      ],
      soilAdjustment: "Đất phù sa bồi ngọt: Bổ sung 5kg phân trùn quế hữu cơ quanh tán để kích thích đọt ra đồng loạt, giúp việc phòng trừ tập trung 1 lần duy nhất.",
      wateringAdvisory: "Tưới giữ ẩm đều đặn vào sáng sớm.",
      preventativeMeasures: [
        "Cắt tỉa tạo cơi đọt tập trung, tránh để cây ra đọt rải rác quanh năm",
        "Nuôi thả đàn kiến vàng làm rào cản sinh học tự nhiên"
      ],
      estimatedRecoveryDays: 7
    }
  }
];

export const INITIAL_CARE_TASKS: CareTask[] = [
  {
    id: "task-001",
    farmId: "garden-daklak-saurieng",
    plotId: "plot-sr-1",
    date: "2026-08-18",
    title: "Bón phân NPK Ba Số Đều (15-15-15) + Humic dưỡng trái",
    category: "fertilizer",
    timeOfDay: "Chiều mát (16:30)",
    instructions: "Rải đều phân theo hình chiếu tán lá, cách gốc 60cm, tưới đẫm sau khi rải.",
    dosage: "350g NPK + 50g Humic/gốc",
    priority: "high",
    isCompleted: false,
    assignedTo: "Anh Ba & Đội làm vườn"
  },
  {
    id: "task-002",
    farmId: "garden-daklak-saurieng",
    plotId: "plot-sr-2",
    date: "2026-08-18",
    title: "Phun Trichoderma + Amino Acid cơi đọt 2",
    category: "pest_control",
    timeOfDay: "Sáng sớm (06:00)",
    instructions: "Phun ướt đẫm 2 mặt lá non và thân cành để khống chế thán thư và dưỡng lá dày.",
    dosage: "500ml Amino + 200g Trichoderma / phuy 200L",
    priority: "high",
    isCompleted: false,
    assignedTo: "Chú Tám phun thuốc"
  },
  {
    id: "task-003",
    farmId: "garden-daklak-saurieng",
    plotId: "plot-sr-1",
    date: "2026-08-19",
    title: "Kiểm tra tỉa bớt trái méo, trái sâu cuống",
    category: "pruning",
    timeOfDay: "Buổi sáng",
    instructions: "Mỗi chùm giữ lại 1-2 trái cân đối, tròn đều, gai xanh, cuống to dẻo.",
    dosage: "Định mức giữ 60-80 trái/cây 6 năm tuổi",
    priority: "medium",
    isCompleted: false,
    assignedTo: "Bác Ba trực tiếp tỉa"
  },
  {
    id: "task-004",
    farmId: "garden-bentre-buoidaixanh",
    plotId: "plot-buoi-1",
    date: "2026-08-18",
    title: "Bổ sung Kali Hữu Cơ & Tro Dừa tăng độ ngọt tép bưởi",
    category: "fertilizer",
    timeOfDay: "Sáng sớm",
    instructions: "Rải phân Kali sulphate sinh học lên mặt mô, phủ lớp rơm mỏng giữ ẩm.",
    dosage: "200g Kali sinh học + 1kg tro trấu/gốc",
    priority: "high",
    isCompleted: true,
    completedAt: "2026-08-17 08:30",
    assignedTo: "Cô Mai"
  }
];

export const INITIAL_DIARY_LOGS: FarmDiaryLog[] = [
  {
    id: "log-001",
    farmId: "garden-daklak-saurieng",
    plotId: "plot-sr-1",
    date: "2026-08-16",
    category: "soil_test",
    title: "Đo pH và độ ẩm đất sau đợt mưa lớn",
    details: "Đo tại 6 vị trí quanh Lô A. pH dao động từ 5.4 đến 5.8. Độ ẩm tầng 0-20cm đạt 85%. Rễ tơ trắng phát triển tốt, không có mùi chua thối.",
    metrics: {
      soilPH: 5.6,
      soilMoisture: 85,
      temperature: 28,
      humidity: 82
    },
    operatorName: "Nguyễn Văn Ba"
  },
  {
    id: "log-002",
    farmId: "garden-daklak-saurieng",
    plotId: "plot-sr-2",
    date: "2026-08-15",
    category: "treatment",
    title: "Xử lý đốm thán thư và dưỡng đọt Lô B",
    details: "Phun chế phẩm vi sinh Amistar Top kết hợp bón vôi nông nghiệp khử khuẩn cổ rễ cho 110 cây Musang King.",
    metrics: {
      costVND: 1450000
    },
    operatorName: "Đội kỹ thuật vườn"
  },
  {
    id: "log-003",
    farmId: "garden-bentre-buoidaixanh",
    plotId: "plot-buoi-1",
    date: "2026-08-12",
    category: "harvest",
    title: "Thu hoạch bưởi da xanh đợt 1 tuyển chọn",
    details: "Thu 120 quả bưởi đạt tiêu chuẩn loại 1 (trọng lượng 1.4 - 1.8kg/quả), độ brix đạt 12.5%. Giao cho vựa xuất khẩu.",
    metrics: {
      yieldKg: 195,
      costVND: 350000
    },
    operatorName: "Trần Thị Mai"
  }
];
