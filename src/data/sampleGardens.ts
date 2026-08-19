import { GardenProfile, DiagnosisRecord, CareTask, FarmDiaryLog } from "../types";

export const SAMPLE_GARDENS: GardenProfile[] = [
  {
    id: "garden-bp-phuoc",
    name: "Vườn Sầu Riêng Dona & Ri6 Bù Đăng",
    region: "Khu Vực Bình Phước",
    ownerName: "Nguyễn Văn Phước",
    phone: "0918 234 567",
    location: "Huyện Bù Đăng, Tỉnh Bình Phước",
    farmCode: "VN-BPC-0892",
    totalAreaHa: 4.5,
    soilType: "Đất đỏ Bazan Đông Nam Bộ / Bình Phước",
    soilPH: 5.8,
    irrigationType: "Tưới nhỏ giọt bù áp Israel",
    cultivationStandard: "VietGAP (Nông nghiệp sạch)",
    createdAt: "2024-02-15",
    notes: "Vùng đất đỏ bazan Bình Phước tầng canh tác dày, đồi thoai thoải thoát nước tốt. Chuyên canh sầu riêng Dona & Ri6 theo VietGAP và quản lý dịch hại IPM.",
    weatherStation: {
      tempC: 30.5,
      humidityPct: 78,
      condition: "Nắng ráo, chiều tối có mưa dông nhiệt nhẹ",
      rainfallMm: 15,
      forecast: "Thời tiết Bình Phước ấm áp, thích hợp cơi đọt phát triển và nuôi quả. Chú ý thoát nước rãnh sau mưa dông."
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
        name: "Lô B - Sầu Riêng Ri6 & Musang King Làm Cơi Đọt 2",
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
        name: "Lô C - Vườn Sầu Riêng Kiến Thiết 2 Năm Tuổi",
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
    id: "garden-bp-nam",
    name: "Vườn Cây Ăn Trái & Tiêu Bù Gia Mập",
    region: "Khu Vực Bình Phước",
    ownerName: "Lê Hoàng Nam",
    phone: "0977 456 123",
    location: "Huyện Bù Gia Mập, Tỉnh Bình Phước",
    farmCode: "VN-BPC-0914",
    totalAreaHa: 3.5,
    soilType: "Đất đỏ Bazan Đông Nam Bộ / Bình Phước",
    soilPH: 6.0,
    irrigationType: "Tưới phun mưa cục bộ dưới gốc",
    cultivationStandard: "Hướng hữu cơ / An toàn sinh học",
    createdAt: "2024-04-10",
    notes: "Vườn canh tác kết hợp hữu cơ sinh học, sử dụng phân chuồng ủ trichoderma và thảm cỏ giữ ẩm.",
    weatherStation: {
      tempC: 30.0,
      humidityPct: 80,
      condition: "Nắng gián đoạn, mát mẻ về chiều",
      rainfallMm: 10,
      forecast: "Nhiệt ẩm ổn định, chú ý phòng ngừa bọ cánh cứng chích hút."
    },
    plots: [
      {
        id: "plot-bpn-1",
        name: "Lô 1 - Bơ Booth 7 & Sầu Riêng Xen Canh",
        cropName: "Bơ & Sầu riêng",
        variety: "Bơ Booth 7 + Ri6",
        treeCount: 160,
        plantedYear: 2020,
        treeAgeYears: 6,
        stage: "Nuôi trái / Định hình phẩm chất",
        areaM2: 20000,
        healthScore: 89,
        lastInspectionDate: "2026-08-16"
      }
    ]
  },
  {
    id: "garden-tn-mai",
    name: "Vườn Mãng Cầu Dai Tân Châu",
    region: "Khu Vực Tây Ninh",
    ownerName: "Trần Thị Mai",
    phone: "0909 778 899",
    location: "Xã Tân Phú, Huyện Tân Châu, Tỉnh Tây Ninh",
    farmCode: "VN-TNH-0341",
    totalAreaHa: 3.8,
    soilType: "Đất phù sa cổ / Đất xám bạc màu",
    soilPH: 6.2,
    irrigationType: "Tưới phun mưa cục bộ dưới gốc",
    cultivationStandard: "VietGAP (Nông nghiệp sạch)",
    createdAt: "2023-10-18",
    notes: "Chuyên canh Mãng Cầu Dai Tây Ninh theo tiêu chuẩn OCOP và VietGAP, xử lý trái vụ.",
    weatherStation: {
      tempC: 32.2,
      humidityPct: 72,
      condition: "Nắng ấm chan hòa, trời trong, gió nhẹ",
      rainfallMm: 0,
      forecast: "Nắng ráo thuận lợi quang hợp tích tụ đường độ brix. Tưới giữ ẩm 2 ngày/lần."
    },
    plots: [
      {
        id: "plot-tn-1",
        name: "Lô 1 - Mãng Cầu Dai Núi Bà Nuôi Trái & Bao Trái",
        cropName: "Mãng cầu dai",
        variety: "Mãng Cầu Dai Núi Bà",
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
        name: "Lô 2 - Bưởi Da Xanh & Mít Ruột Đỏ Làm Cơi Đọt",
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
  },
  {
    id: "garden-tn-tuan",
    name: "Vườn Bưởi Da Xanh & Sầu Riêng Dương Minh Châu",
    region: "Khu Vực Tây Ninh",
    ownerName: "Ngô Minh Tuấn",
    phone: "0933 881 290",
    location: "Huyện Dương Minh Châu, Tỉnh Tây Ninh",
    farmCode: "VN-TNH-0518",
    totalAreaHa: 2.5,
    soilType: "Đất phù sa cổ / Đất xám bạc màu",
    soilPH: 6.0,
    irrigationType: "Tưới nhỏ giọt bù áp Israel",
    cultivationStandard: "GlobalGAP (Xuất khẩu quốc tế)",
    createdAt: "2024-01-12",
    notes: "Khu vực cạnh hồ Dầu Tiếng, nguồn nước dồi dào, canh tác GlobalGAP xuất khẩu.",
    weatherStation: {
      tempC: 32.0,
      humidityPct: 74,
      condition: "Nắng ráo, gió mát từ hồ Dầu Tiếng",
      rainfallMm: 2,
      forecast: "Thời tiết lý tưởng cho phát triển trái và kiểm soát rầy rệp."
    },
    plots: [
      {
        id: "plot-tnt-1",
        name: "Lô A - Bưởi Da Xanh Ruột Hồng Đang Nuôi Trái",
        cropName: "Bưởi Da Xanh",
        variety: "Da Xanh ruột hồng Bến Tre ghép",
        treeCount: 190,
        plantedYear: 2021,
        treeAgeYears: 5,
        stage: "Nuôi trái / Định hình phẩm chất",
        areaM2: 14000,
        healthScore: 94,
        lastInspectionDate: "2026-08-16"
      }
    ]
  },
  {
    id: "garden-dl-krong",
    name: "Vườn Sầu Riêng & Cà Phê Cư M'gar",
    region: "Khu Vực Đắk Lắk",
    ownerName: "Y Krong Niê",
    phone: "0988 554 321",
    location: "Huyện Cư M'gar, Tỉnh Đắk Lắk",
    farmCode: "VN-DLK-0775",
    totalAreaHa: 5.0,
    soilType: "Đất đỏ Bazan Tây Nguyên",
    soilPH: 5.6,
    irrigationType: "Tưới phun mưa cục bộ dưới gốc",
    cultivationStandard: "VietGAP (Nông nghiệp sạch)",
    createdAt: "2023-08-20",
    notes: "Vùng thủ phủ cà phê và sầu riêng Đắk Lắk, đất đỏ bazan tầng dày trên 2m, khí hậu 2 mùa mưa nắng rõ rệt.",
    weatherStation: {
      tempC: 27.8,
      humidityPct: 84,
      condition: "Mát mẻ, mây dông chiều tối Tây Nguyên",
      rainfallMm: 22,
      forecast: "Mưa dông Tây Nguyên về chiều. Cần kiểm tra nấm Phytophthora cổ rễ sầu riêng."
    },
    plots: [
      {
        id: "plot-dl-1",
        name: "Lô 1 - Sầu Riêng Dona Cư M'gar 8 Năm Tuổi",
        cropName: "Sầu riêng",
        variety: "Dona Thái Lan",
        treeCount: 180,
        plantedYear: 2018,
        treeAgeYears: 8,
        stage: "Nuôi trái / Định hình phẩm chất",
        areaM2: 25000,
        healthScore: 87,
        recentIssue: "Chú ý xì mủ nứt thân gốc do ẩm cao",
        lastInspectionDate: "2026-08-17"
      }
    ]
  },
  {
    id: "garden-tg-loi",
    name: "Vườn Sầu Riêng Cái Bè ĐBSCL",
    region: "Khu Vực Tiền Giang",
    ownerName: "Huỳnh Văn Lợi",
    phone: "0913 678 910",
    location: "Xã Hòa Khánh, Huyện Cái Bè, Tiền Giang",
    farmCode: "VN-TGG-0219",
    totalAreaHa: 2.2,
    soilType: "Đất phù sa ngọt sông Tiền/sông Hậu",
    soilPH: 5.9,
    irrigationType: "Tưới tràn rãnh mương truyền thống",
    cultivationStandard: "VietGAP (Nông nghiệp sạch)",
    createdAt: "2023-05-14",
    notes: "Đất phù sa sông Tiền màu mỡ, hệ thống liếp và mương dẫn nước điều tiết linh hoạt.",
    weatherStation: {
      tempC: 31.0,
      humidityPct: 82,
      condition: "Nắng tốt ban ngày, triều cường và mưa rào nhẹ",
      rainfallMm: 12,
      forecast: "Kiểm tra mực nước mương liếp, tránh để rễ sầu riêng ngập úng khi triều dâng."
    },
    plots: [
      {
        id: "plot-tg-1",
        name: "Lô Liếp 1 - Sầu Riêng Ri6 Cái Bè",
        cropName: "Sầu riêng",
        variety: "Ri6",
        treeCount: 130,
        plantedYear: 2019,
        treeAgeYears: 7,
        stage: "Nuôi trái / Định hình phẩm chất",
        areaM2: 12000,
        healthScore: 91,
        lastInspectionDate: "2026-08-17"
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
