import { GardenProfile, DiagnosisRecord, CareTask, FarmDiaryLog } from "../types";

export const SAMPLE_GARDENS: GardenProfile[] = [
  {
    id: "garden-binhphuoc",
    name: "Nhà Vườn Khu Vực Bình Phước",
    ownerName: "Nguyễn Văn Phước",
    phone: "0918 234 567",
    location: "Huyện Bù Đăng, Tỉnh Bình Phước (Đông Nam Bộ)",
    totalAreaHa: 4.5,
    soilType: "Đất đỏ Bazan Đông Nam Bộ / Bình Phước",
    soilPH: 5.8,
    irrigationType: "Tưới nhỏ giọt bù áp Israel",
    cultivationStandard: "VietGAP (Nông nghiệp sạch)",
    createdAt: "2024-02-15",
    notes: "Vùng đất đỏ bazan Bình Phước màu mỡ tầng canh tác dày, địa hình đồi thoai thoải thoát nước cực tốt. Chuyên canh sầu riêng Dona & Ri6 xuất khẩu theo quy chuẩn VietGAP kết hợp quản lý dịch hại tổng hợp IPM.",
    weatherStation: {
      tempC: 30.5,
      humidityPct: 78,
      condition: "Nắng ráo, chiều tối có mưa dông nhiệt nhẹ",
      rainfallMm: 15,
      forecast: "Thời tiết Bình Phước ấm áp, độ ẩm vừa phải thích hợp cơi đọt phát triển và nuôi quả. Cần kiểm tra rãnh thoát nước sau cơn dông."
    },
    plots: [
      {
        id: "plot-bp-1",
        name: "Lô A - Sầu Riêng Monthong (Dona) Nuôi Trái",
        cropName: "Sầu riêng",
        variety: "Monthong (Dona)",
        treeCount: 120,
        plantedYear: 2019,
        treeAgeYears: 7,
        stage: "Nuôi trái / Định hình phẩm chất",
        areaM2: 15000,
        healthScore: 90,
        recentIssue: "Có rầy nhảy nhẹ rải rác trên chồi non mép vườn",
        lastInspectionDate: "2026-08-17"
      },
      {
        id: "plot-bp-2",
        name: "Lô B - Sầu Riêng Ri6 & Musang King Đang Làm Cơi Đọt 2",
        cropName: "Sầu riêng",
        variety: "Ri6 & Musang King (D197)",
        treeCount: 140,
        plantedYear: 2021,
        treeAgeYears: 5,
        stage: "Phát triển thân lá / Làm cơi đọt",
        areaM2: 18000,
        healthScore: 84,
        recentIssue: "Vàng lá gân xanh nhẹ ở vài cây phía triền dốc",
        lastInspectionDate: "2026-08-16"
      },
      {
        id: "plot-bp-3",
        name: "Lô C - Vườn Sầu Riêng Kiến Thiết Cơ Bản 2 Năm Tuổi",
        cropName: "Sầu riêng gốc ghép",
        variety: "Gốc ghép địa phương + chồi Dona",
        treeCount: 220,
        plantedYear: 2024,
        treeAgeYears: 2,
        stage: "Kiến thiết cơ bản (Cây con 1-2 năm)",
        areaM2: 12000,
        healthScore: 96,
        lastInspectionDate: "2026-08-15"
      }
    ]
  },
  {
    id: "garden-tayninh",
    name: "Nhà Vườn Khu Vực Tây Ninh",
    ownerName: "Trần Văn Ninh & Chú Sáu",
    phone: "0909 778 899",
    location: "Chân Núi Bà Đen, TP. Tây Ninh, Tỉnh Tây Ninh",
    totalAreaHa: 3.2,
    soilType: "Đất phù sa cổ / Đất xám bạc màu",
    soilPH: 6.2,
    irrigationType: "Tưới phun mưa cục bộ dưới gốc",
    cultivationStandard: "VietGAP (Nông nghiệp sạch)",
    createdAt: "2023-10-18",
    notes: "Vùng đất chân núi Bà Đen có thổ nhưỡng đặc thù và khí hậu nhiều nắng gió điều hòa từ hồ Dầu Tiếng, chuyên canh Mãng Cầu Dai Bà Đen trứ danh (chỉ dẫn địa lý OCOP) kết hợp Bưởi Da Xanh ruột hồng.",
    weatherStation: {
      tempC: 32.2,
      humidityPct: 72,
      condition: "Nắng ấm chan hòa, trời trong, gió nhẹ chân núi",
      rainfallMm: 0,
      forecast: "Thời tiết Tây Ninh nắng ráo thuận lợi quang hợp tích tụ đường độ brix. Duy trì tưới phun mưa giữ ẩm mặt liếp 2 ngày/lần."
    },
    plots: [
      {
        id: "plot-tn-1",
        name: "Lô 1 - Mãng Cầu Dai Bà Đen Nuôi Trái & Bao Trái",
        cropName: "Mãng cầu dai",
        variety: "Mãng Cầu Dai Núi Bà Đen",
        treeCount: 280,
        plantedYear: 2020,
        treeAgeYears: 6,
        stage: "Nuôi trái / Định hình phẩm chất",
        areaM2: 16000,
        healthScore: 92,
        recentIssue: "Chú ý rệp sáp bông phấn bám cuống quả",
        lastInspectionDate: "2026-08-17"
      },
      {
        id: "plot-tn-2",
        name: "Lô 2 - Bưởi Da Xanh & Mít Ruột Đỏ In-đô Làm Cơi Đọt",
        cropName: "Bưởi Da Xanh",
        variety: "Bưởi Da Xanh & Mít Ruột Đỏ",
        treeCount: 160,
        plantedYear: 2023,
        treeAgeYears: 3,
        stage: "Phát triển thân lá / Làm cơi đọt",
        areaM2: 16000,
        healthScore: 88,
        recentIssue: "Sâu vẽ bùa nhẹ trên cơi đọt non mới nhú",
        lastInspectionDate: "2026-08-16"
      }
    ]
  }
];

export const INITIAL_DIAGNOSES: DiagnosisRecord[] = [
  {
    id: "diag-bp-001",
    farmId: "garden-binhphuoc",
    plotId: "plot-bp-2",
    cropName: "Sầu riêng Ri6 & Musang King",
    date: "2026-08-16",
    symptoms: "Cháy rìa chóp lá non hình chữ V, có đốm thâm nâu quầng vàng, rụng vài đọt lá bánh tẻ sau trận mưa dầm.",
    status: "treating",
    result: {
      diseaseName: "Bệnh Thán Thư (Colletotrichum gloeosporioides) & Bọ Trĩ Chích Hút",
      scientificName: "Colletotrichum gloeosporioides",
      severityLevel: "moderate",
      confidenceScore: 94,
      causeAnalysis: "Do đất đỏ Bazan tích tụ ẩm cao sau chuỗi ngày mưa dầm, độ ẩm vườn đạt 78%. Đọt non mới nhú giàu đường khử là thức ăn hấp dẫn của bọ trĩ, vết thương chích hút tạo cửa ngõ cho nấm thán thư xâm nhiễm.",
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
      soilAdjustment: "Đất đỏ bazan Bình Phước có xu hướng chua khi mưa nhiều: Rải 300g vôi dolomite/gốc quanh mép tán, không bón đạm ure lúc này.",
      wateringAdvisory: "Tạm ngắt tưới nhỏ giọt 2 ngày. Xẻ rãnh thoát nước giữa 2 hàng cây chống ứ nước cổ rễ.",
      preventativeMeasures: [
        "Phun ngừa định kỳ khi cây vừa nhú đọt bằng hạt gạo (mũi giáo)",
        "Tỉa bớt cành vượt rậm rạp bên trong tán để đón ánh sáng triệt để"
      ],
      estimatedRecoveryDays: 12
    }
  },
  {
    id: "diag-tn-001",
    farmId: "garden-tayninh",
    plotId: "plot-tn-1",
    cropName: "Mãng Cầu Dai Bà Đen",
    date: "2026-08-15",
    symptoms: "Xuất hiện lớp phấn sáp trắng bám ở kẽ cuống trái và mắt quả mãng cầu, kèm theo kiến đen bò xung quanh.",
    status: "treating",
    result: {
      diseaseName: "Rệp Sáp Bông (Planococcus citri) hại Mãng Cầu Dai Tây Ninh",
      scientificName: "Planococcus citri Risso",
      severityLevel: "moderate",
      confidenceScore: 96,
      causeAnalysis: "Thời tiết Tây Ninh nắng ấm khô ráo tạo điều kiện cho rệp sáp phát triển bám vào mắt quả hút nhựa, đồng thời tiết dịch mật thu hút nấm bồ hóng đen bám đen vỏ quả làm giảm mẫu mã xuất khẩu.",
      symptomMatches: [
        "Lớp phấn bông trắng xốp bám dày ở cuống và kẽ mắt trái",
        "Có kiến đen cộng sinh tha rệp lây lan sang cành khác",
        "Mắt quả bị chai sượng, chậm lớn"
      ],
      organicTreatment: [
        "Dùng vòi nước áp lực cao xịt thẳng vào chùm quả để rửa trôi lớp phấn sáp",
        "Phun Dầu khoáng sinh học SK Enspray 99EC pha nấm ký sinh Beauveria bassiana",
        "Bẫy bả chua ngọt tiêu diệt kiến đen cộng sinh"
      ],
      chemicalTreatment: [
        "Khi mật độ rệp cao: Phun Spirotetramat (Movento 150OD) hoặc Buprofezin (Applaud 10WP) nồng độ khuyến cáo",
        "Thời gian cách ly an toàn: 10 ngày trước thu hoạch"
      ],
      soilAdjustment: "Rắc vôi bột và quét vôi quanh gốc cây để ngăn chặn kiến đen tha ấu trùng rệp từ đất lên tán.",
      wateringAdvisory: "Tưới giữ ẩm đều liếp chân núi, kết hợp rửa tán vào sáng sớm.",
      preventativeMeasures: [
        "Tiến hành bao trái bằng túi lưới chuyên dụng khi trái bằng quả trứng gà",
        "Tỉa cành thông thoáng sau mỗi đợt cắt cành làm bông"
      ],
      estimatedRecoveryDays: 9
    }
  },
  {
    id: "diag-tn-002",
    farmId: "garden-tayninh",
    plotId: "plot-tn-2",
    cropName: "Bưởi Da Xanh Tây Ninh",
    date: "2026-08-14",
    symptoms: "Lá non xuất hiện các đường ngoằn ngoèo màu trắng bạc, mép lá bị quăn queo co rúm.",
    status: "recovered",
    result: {
      diseaseName: "Sâu Vẽ Bùa hại cây có múi (Phyllocnistis citrella)",
      scientificName: "Phyllocnistis citrella Stainton",
      severityLevel: "mild",
      confidenceScore: 98,
      causeAnalysis: "Sâu non đục dưới lớp biểu bì lá bưởi non đang giai đoạn bung đọt cơi 2, để lại vệt màng trắng bóng ngoằn ngoèo.",
      symptomMatches: [
        "Đường hầm ngoằn ngoèo bạc trắng sáng dưới biểu bì",
        "Lá non biến dạng, cong queo",
        "Vết thương dễ dẫn đến bệnh loét vi khuẩn (Xanthomonas)"
      ],
      organicTreatment: [
        "Phun Dầu khoáng sinh học SK Enspray 99 EC (pha 30-40ml/20 lít nước)",
        "Tưới gốc bằng chế phẩm vi sinh Bacillus thuringiensis (Bt)",
        "Bảo vệ thiên địch kiến vàng và ong ký sinh trong vườn"
      ],
      chemicalTreatment: [
        "Trường hợp khẩn cấp: Phun hoạt chất Spinetoram (Radiant 60SC) 15ml / bình 25L lúc đọt non vừa nhú 1-2cm"
      ],
      soilAdjustment: "Bổ sung phân trùn quế hữu cơ quanh tán để kích thích đọt ra đồng loạt.",
      wateringAdvisory: "Tưới giữ ẩm đều đặn vào sáng sớm.",
      preventativeMeasures: [
        "Cắt tỉa tạo cơi đọt tập trung, tránh để cây ra đọt rải rác quanh năm"
      ],
      estimatedRecoveryDays: 7
    }
  }
];

export const INITIAL_CARE_TASKS: CareTask[] = [
  {
    id: "task-bp-001",
    farmId: "garden-binhphuoc",
    plotId: "plot-bp-1",
    date: "2026-08-18",
    title: "Bón phân NPK Ba Số Đều (15-15-15) + Humic dưỡng trái",
    category: "fertilizer",
    timeOfDay: "Chiều mát (16:30)",
    instructions: "Rải đều phân theo hình chiếu tán lá, cách gốc 60cm, tưới đẫm sau khi rải.",
    dosage: "350g NPK + 50g Humic/gốc",
    materials: [
      { name: "Phân bón NPK Đầu Trâu 15-15-15", dosage: "350g/gốc", costVND: 2100000 },
      { name: "Axit Humic 85% Kích rễ tơ", dosage: "50g/gốc", costVND: 450000 }
    ],
    priority: "high",
    isCompleted: false,
    assignedTo: "Anh Phước & Đội làm vườn"
  },
  {
    id: "task-bp-002",
    farmId: "garden-binhphuoc",
    plotId: "plot-bp-2",
    date: "2026-08-18",
    title: "Phun Trichoderma + Amino Acid cơi đọt 2",
    category: "pest_control",
    timeOfDay: "Sáng sớm (06:00)",
    instructions: "Phun ướt đẫm 2 mặt lá non và thân cành để khống chế thán thư và dưỡng lá dày dẻo cuống.",
    dosage: "500ml Amino + 200g Trichoderma / phuy 200L",
    materials: [
      { name: "Nấm đối kháng Trichoderma", dosage: "200g/phuy 200L", costVND: 180000 },
      { name: "Amino Acid sinh học dưỡng lá", dosage: "500ml/phuy 200L", costVND: 220000 }
    ],
    priority: "high",
    isCompleted: false,
    assignedTo: "Đội kỹ thuật Bình Phước"
  },
  {
    id: "task-bp-003",
    farmId: "garden-binhphuoc",
    plotId: "plot-bp-1",
    date: "2026-08-19",
    title: "Kiểm tra tỉa bớt trái méo, trái sâu cuống Lô A",
    category: "pruning",
    timeOfDay: "Buổi sáng",
    instructions: "Mỗi chùm giữ lại 1-2 trái cân đối, tròn đều, gai xanh, cuống to dẻo để quả đạt loại 1 xuất khẩu.",
    dosage: "Định mức giữ 70-90 trái/cây 7 năm tuổi",
    priority: "medium",
    isCompleted: false,
    assignedTo: "Anh Phước trực tiếp tuyển chọn"
  },
  {
    id: "task-tn-001",
    farmId: "garden-tayninh",
    plotId: "plot-tn-1",
    date: "2026-08-18",
    title: "Bón phân hữu cơ khoáng & Kali Sunfat sinh học dưỡng mãng cầu",
    category: "fertilizer",
    timeOfDay: "Sáng sớm",
    instructions: "Rải phân quanh mặt liếp dưới tán mãng cầu dai, tưới phun sương 20 phút giữ ẩm.",
    dosage: "2kg Hữu cơ vi sinh + 150g Kali K2SO4/cây",
    materials: [
      { name: "Phân hữu cơ Bounce Back", dosage: "2kg/gốc", costVND: 1600000 },
      { name: "Phân Kali Sunfat K2SO4 hữu cơ", dosage: "150g/gốc", costVND: 840000 }
    ],
    priority: "high",
    isCompleted: true,
    completedAt: "2026-08-17 08:30",
    assignedTo: "Chú Sáu Tây Ninh"
  },
  {
    id: "task-tn-002",
    farmId: "garden-tayninh",
    plotId: "plot-tn-1",
    date: "2026-08-19",
    title: "Bao trái mãng cầu dai Bà Đen đợt 2",
    category: "pruning",
    timeOfDay: "Buổi sáng mát",
    instructions: "Sử dụng túi bao chuyên dụng bao các quả đường kính 4-6cm chống ruồi vàng và rệp sáp.",
    dosage: "Bao 500 quả đạt chuẩn",
    priority: "high",
    isCompleted: false,
    assignedTo: "Đội nhân công Tây Ninh"
  }
];

export const INITIAL_DIARY_LOGS: FarmDiaryLog[] = [
  {
    id: "log-bp-001",
    farmId: "garden-binhphuoc",
    plotId: "plot-bp-1",
    date: "2026-08-17",
    category: "fertilizing",
    title: "Bón phân hữu cơ vi sinh & Kích rễ tơ đợt 2 - Bình Phước",
    details: "Bón rải quanh mép tán 120 gốc sầu riêng Monthong (7 năm tuổi). Kết hợp hòa Humic Acid tưới ẩm giúp phục hồi hệ rễ tơ sau đợt mưa lớn.",
    materials: [
      { name: "Phân hữu cơ khoáng Bounce Back (Úc)", dosage: "60 bao (25kg)", costVND: 19200000 },
      { name: "Axit Humic 85% Kích rễ", dosage: "10 gói (1kg)", costVND: 1200000 }
    ],
    materialName: "Phân hữu cơ Bounce Back (Úc) + Humic 85%",
    quantity: 60,
    unit: "bao (25kg)",
    unitPriceVND: 320000,
    supplier: "Đại lý VTNN Nông Xanh Bình Phước",
    batchNumber: "BP-BB-2026-08A",
    metrics: {
      costVND: 20400000,
      soilMoisture: 78,
      soilPH: 5.8
    },
    operatorName: "Nguyễn Văn Phước"
  },
  {
    id: "log-bp-002",
    farmId: "garden-binhphuoc",
    plotId: "plot-bp-2",
    date: "2026-08-15",
    category: "treatment",
    title: "Xử lý đốm thán thư và dưỡng cơi đọt non Lô B",
    details: "Phun chế phẩm sinh học Amistar Top 325SC kết hợp Nano Bạc Đồng phòng trị nấm thán thư lá cho 140 cây Ri6 & Musang King.",
    materials: [
      { name: "Thuốc trừ bệnh sinh học Amistar Top 325SC", dosage: "6 chai (250ml)", costVND: 1710000 },
      { name: "Chế phẩm Nano Bạc Đồng Sinh Học", dosage: "4 chai (500ml)", costVND: 640000 }
    ],
    materialName: "Amistar Top 325SC + Nano Bạc Đồng",
    supplier: "Cửa hàng BVTV Bù Đăng, Bình Phước",
    batchNumber: "AT-325-BP",
    metrics: {
      costVND: 2350000
    },
    operatorName: "Đội kỹ thuật Bình Phước"
  },
  {
    id: "log-bp-003",
    farmId: "garden-binhphuoc",
    plotId: "plot-bp-1",
    date: "2026-08-10",
    category: "fertilizing",
    title: "Bón NPK Cân Đối 20-20-15+TE nuôi cơi đọt sầu riêng",
    details: "Rải đều 350g/gốc đón cơi đọt 2, châm nước tưới nhỏ giọt bù áp 45 phút để phân tan thấm đều tầng rễ 20cm.",
    materials: [
      { name: "Phân bón NPK Đầu Trâu 20-20-15+TE", dosage: "150 kg", costVND: 3600000 }
    ],
    materialName: "Phân bón NPK Đầu Trâu 20-20-15+TE",
    supplier: "Cty CP Phân Bón Bình Điền",
    batchNumber: "DT-2026-08K",
    metrics: {
      costVND: 3600000
    },
    operatorName: "Nguyễn Văn Phước"
  },
  {
    id: "log-tn-001",
    farmId: "garden-tayninh",
    plotId: "plot-tn-1",
    date: "2026-08-16",
    category: "fertilizing",
    title: "Bón dưỡng trái Kali Sunfat sinh học & Vi sinh hữu cơ Mãng Cầu",
    details: "Bón định kỳ mỗi cây mãng cầu dai 200g Kali trắng K2SO4 kết hợp phân trùn quế hữu cơ nhằm tăng độ ngọt thanh và nở gai đều.",
    materials: [
      { name: "Phân bón Kali Sunfat (K2SO4 50%) hữu cơ sinh học", dosage: "80 kg", costVND: 2800000 },
      { name: "Phân hữu cơ trùn quế", dosage: "30 bao", costVND: 1500000 }
    ],
    materialName: "Kali Sunfat sinh học K2SO4 + Phân trùn quế",
    supplier: "Hợp tác xã Mãng Cầu Dai Tây Ninh",
    batchNumber: "TN-MC-2026",
    metrics: {
      costVND: 4300000
    },
    operatorName: "Trần Văn Ninh"
  },
  {
    id: "log-tn-002",
    farmId: "garden-tayninh",
    plotId: "plot-tn-1",
    date: "2026-08-12",
    category: "harvest",
    title: "Thu hoạch Mãng Cầu Dai Núi Bà Đen đợt 1 tuyển chọn",
    details: "Thu 180kg mãng cầu dai tuyển chọn đạt tiêu chuẩn loại 1 (trọng lượng 400 - 600g/quả, mắt gai nở đều, da căng sáng). Giao cho chuỗi siêu thị VietGAP.",
    metrics: {
      yieldKg: 180,
      costVND: 420000
    },
    operatorName: "Trần Văn Ninh & Chú Sáu"
  },
  {
    id: "log-tn-003",
    farmId: "garden-tayninh",
    plotId: "plot-tn-1",
    date: "2026-08-08",
    category: "soil_test",
    title: "Đo pH và độ ẩm đất liếp chân núi Bà Đen",
    details: "Đo tại 6 vị trí quanh Lô 1. pH trung bình đạt 6.2, đất tơi xốp, hệ vi sinh vật đất phát triển tốt.",
    materials: [
      { name: "Vôi nông nghiệp Dolomite khử chua", dosage: "200 kg", costVND: 800000 }
    ],
    materialName: "Vôi nông nghiệp Dolomite Tây Ninh",
    supplier: "Vôi Nông Nghiệp Tây Ninh",
    metrics: {
      soilPH: 6.2,
      soilMoisture: 72,
      costVND: 800000,
      temperature: 32,
      humidity: 74
    },
    operatorName: "Trần Văn Ninh"
  }
];
