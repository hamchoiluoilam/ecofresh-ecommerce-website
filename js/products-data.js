/**
 * EcoFresh Market - Mock Database & Product Catalog
 * Comprehensive 2-level categories, products, services, and articles
 */

const CATEGORIES = [
  {
    id: "rau-cu",
    name: "Rau củ hữu cơ",
    slug: "rau-cu-huu-co",
    icon: "fa-solid fa-carrot",
    image: "https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=400&q=80",
    count: 24,
    children: [
      { id: "rau-an-la", name: "Rau ăn lá", count: 12 },
      { id: "rau-an-cu-qua", name: "Rau ăn củ & quả", count: 8 },
      { id: "nam-tuoi", name: "Nấm tươi sạch", count: 4 }
    ]
  },
  {
    id: "trai-cay",
    name: "Trái cây tươi sạch",
    slug: "trai-cay-tuoi-sach",
    icon: "fa-solid fa-apple-whole",
    image: "https://images.unsplash.com/photo-1619566636858-adf3ef46400b?auto=format&fit=crop&w=400&q=80",
    count: 18,
    children: [
      { id: "trai-cay-viet-nam", name: "Trái cây đặc sản Việt", count: 10 },
      { id: "trai-cay-nhap-khau", name: "Trái cây nhập khẩu cao cấp", count: 8 }
    ]
  },
  {
    id: "thit-hai-san",
    name: "Thịt & Thủy hải sản",
    slug: "thit-hai-san-sinh-hoc",
    icon: "fa-solid fa-drumstick-bite",
    image: "https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?auto=format&fit=crop&w=400&q=80",
    count: 16,
    children: [
      { id: "thit-heo-sinh-hoc", name: "Thịt heo vi sinh", count: 6 },
      { id: "thit-bo-uc", name: "Thịt bò ăn cỏ", count: 5 },
      { id: "hai-san-tuoi", name: "Thủy hải sản tự nhiên", count: 5 }
    ]
  },
  {
    id: "gao-ngu-coc",
    name: "Gạo & Ngũ cốc",
    slug: "gao-ngu-coc-huu-co",
    icon: "fa-solid fa-wheat-awn",
    image: "https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=400&q=80",
    count: 12,
    children: [
      { id: "gao-st25", name: "Gạo đặc sản ST25", count: 4 },
      { id: "hat-dinh-duong", name: "Hạt & Yến mạch dinh dưỡng", count: 8 }
    ]
  },
  {
    id: "combo-gia-dinh",
    name: "Combo bữa ăn",
    slug: "combo-thuc-don-gia-dinh",
    icon: "fa-solid fa-bowl-food",
    image: "https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=400&q=80",
    count: 8,
    children: [
      { id: "combo-tuan", name: "Combo đi chợ tuần", count: 4 },
      { id: "meal-kit", name: "Combo sơ chế Ready-to-cook", count: 4 }
    ]
  },
  {
    id: "gia-vi-tu-nhien",
    name: "Gia vị tự nhiên",
    slug: "gia-vi-thao-moc",
    icon: "fa-solid fa-mortar-pestle",
    image: "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=400&q=80",
    count: 10,
    children: [
      { id: "mat-ong", name: "Mật ong & Thảo mộc", count: 5 },
      { id: "nuoc-mam", name: "Nước mắm truyền thống", count: 5 }
    ]
  }
];

const PRODUCTS = [
  {
    id: 1,
    code: "EF-KBX-500",
    name: "Cải bó xôi (Rau chân vịt) hữu cơ Đà Lạt",
    category: "rau-cu",
    subCategory: "rau-an-la",
    categoryName: "Rau củ hữu cơ",
    price: 38000,
    oldPrice: 48000,
    unit: "Túi 500g",
    stock: 45,
    origin: "HTX Nông nghiệp Đơn Dương, Lâm Đồng",
    cert: "VietGAP",
    rating: 5.0,
    reviewsCount: 38,
    image: "https://images.unsplash.com/photo-1576045057995-568f588f82fb?auto=format&fit=crop&w=600&q=80",
    isFlashSale: true,
    soldPercent: 78,
    description: "Cải bó xôi hữu cơ được canh tác hoàn toàn theo tiêu chuẩn VietGAP nghiêm ngặt tại thung lũng Đơn Dương. Thân mềm, lá xanh mướt, giàu sắt, canxi, chất xơ và vitamin C.",
    cookingTips: "Thích hợp nấu canh tôm thịt, xào tỏi, ép nước detox sống hoặc làm sốt pasta dinh dưỡng."
  },
  {
    id: 2,
    code: "EF-KALE-300",
    name: "Cải xoăn Kale xoăn khủng organic",
    category: "rau-cu",
    subCategory: "rau-an-la",
    categoryName: "Rau củ hữu cơ",
    price: 45000,
    oldPrice: 55000,
    unit: "Túi 300g",
    stock: 30,
    origin: "Nông trại BioFresh Mộc Châu",
    cert: "USDA Organic",
    rating: 4.9,
    reviewsCount: 52,
    image: "https://images.unsplash.com/photo-1524179091875-bf99a9a6fa57?auto=format&fit=crop&w=600&q=80",
    isFlashSale: true,
    soldPercent: 88,
    description: "Nữ hoàng của các loại rau xanh với hàm lượng chất chống oxy hóa cực cao, vitamin K gấp 6 lần nhu cầu hàng ngày, giúp thanh lọc cơ thể và trẻ hóa làn da.",
    cookingTips: "Xay sinh tố xanh (Green Smoothie) cùng chuối, táo hoặc nướng sấy giòn làm snack kale giòn rụm."
  },
  {
    id: 3,
    code: "EF-CAM-HY-1KG",
    name: "Cam sành Hàm Yên mọng nước ngọt thanh",
    category: "trai-cay",
    subCategory: "trai-cay-viet-nam",
    categoryName: "Trái cây tươi sạch",
    price: 52000,
    oldPrice: 65000,
    unit: "Túi 1kg (3-4 quả)",
    stock: 80,
    origin: "Vùng trồng Hàm Yên, Tuyên Quang",
    cert: "VietGAP",
    rating: 4.8,
    reviewsCount: 64,
    image: "https://images.unsplash.com/photo-1611080626919-7cf5a9dbab5b?auto=format&fit=crop&w=600&q=80",
    isFlashSale: true,
    soldPercent: 65,
    description: "Cam sành chính gốc vỏ sần mỏng, tép cam vàng cam đậm đà, vị ngọt đậm pha chút chua thanh mát, nhiều nước không hạt sượng.",
    cookingTips: "Vắt nước uống bổ sung vitamin C mỗi sáng hoặc làm thạch cam tráng miệng cho trẻ nhỏ."
  },
  {
    id: 4,
    code: "EF-HEO-BC-500",
    name: "Thịt ba chỉ heo quế sinh học sạch thơm",
    category: "thit-hai-san",
    subCategory: "thit-heo-sinh-hoc",
    categoryName: "Thịt & Thủy hải sản",
    price: 115000,
    oldPrice: 135000,
    unit: "Khay 500g (hút chân không)",
    stock: 25,
    origin: "Trang trại chăn nuôi vi sinh Hòa Bình",
    cert: "HACCP & VietGAP",
    rating: 5.0,
    reviewsCount: 91,
    image: "https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?auto=format&fit=crop&w=600&q=80",
    isFlashSale: true,
    soldPercent: 92,
    description: "Thịt heo được nuôi bằng thảo dược và men vi sinh, hoàn toàn không chất kích thích tăng trọng, tỷ lệ nạc mỡ đan xen đều, luộc không sủi bọt hôi.",
    cookingTips: "Luộc chấm mắm tôm/mắm nêm, kho trứng tàu hoặc áp chảo sốt mật ong thơm lừng."
  },
  {
    id: 5,
    code: "EF-CADIEU-DL",
    name: "Cà chua bi socola giống F1 ngọt giòn",
    category: "rau-cu",
    subCategory: "rau-an-cu-qua",
    categoryName: "Rau củ hữu cơ",
    price: 42000,
    oldPrice: 50000,
    unit: "Hộp 400g",
    stock: 50,
    origin: "Vườn ươm công nghệ cao Lạc Dương, Đà Lạt",
    cert: "GlobalGAP",
    rating: 4.9,
    reviewsCount: 43,
    image: "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=600&q=80",
    isFlashSale: false,
    soldPercent: 40,
    description: "Cà chua bi màu nâu tím đặc trưng, giòn ngọt đậm đà, chứa lượng lycopene cao gấp 3 lần cà chua đỏ thông thường.",
    cookingTips: "Ăn tươi trực tiếp như trái cây tráng miệng hoặc trộn cùng salad xà lách sốt dầu giấm."
  },
  {
    id: 6,
    code: "EF-GAO-ST25",
    name: "Gạo thượng hạng ST25 Ông Cua lúa tôm",
    category: "gao-ngu-coc",
    subCategory: "gao-st25",
    categoryName: "Gạo & Ngũ cốc",
    price: 195000,
    oldPrice: 215000,
    unit: "Túi 5kg",
    stock: 120,
    origin: "Bán đảo Cà Mau - Sóc Trăng",
    cert: "Gạo ngon nhất thế giới",
    rating: 5.0,
    reviewsCount: 110,
    image: "https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=600&q=80",
    isFlashSale: false,
    soldPercent: 75,
    description: "Gạo hạt dài trắng trong, khi nấu chín tỏa mùi thơm lá dứa quyến rũ, cơm dẻo mềm ngay cả khi để nguội.",
    cookingTips: "Nấu tỷ lệ chuẩn 1 bát gạo : 1 đến 1.1 bát nước, không cần xới đảo nhiều trong lúc sôi."
  },
  {
    id: 7,
    code: "EF-GA-DOI-1C",
    name: "Gà ta đồi Yên Thế thả tự nhiên nguyên con",
    category: "thit-hai-san",
    subCategory: "thit-heo-sinh-hoc",
    categoryName: "Thịt & Thủy hải sản",
    price: 240000,
    oldPrice: 280000,
    unit: "Con 1.4kg - 1.6kg (làm sạch)",
    stock: 18,
    origin: "Hợp tác xã Gà đồi Yên Thế, Bắc Giang",
    cert: "VietGAP",
    rating: 4.8,
    reviewsCount: 29,
    image: "https://images.unsplash.com/photo-1587593810167-a84920ea0781?auto=format&fit=crop&w=600&q=80",
    isFlashSale: false,
    soldPercent: 30,
    description: "Gà chạy bộ trên đồi cây, thịt chắc, da vàng óng mỡ màng giòn sần sật, nước luộc gà ngọt đậm đà không ngấy.",
    cookingTips: "Luộc cùng hành gừng chấm muối tiêu chanh, hoặc nướng lá chanh thơm nức mũi."
  },
  {
    id: 8,
    code: "EF-CB-WEEKLY",
    name: "Combo Rau củ tuần gia đình Eco-Family 4 người",
    category: "combo-gia-dinh",
    subCategory: "combo-tuan",
    categoryName: "Combo bữa ăn",
    price: 360000,
    oldPrice: 420000,
    unit: "Thùng 7 loại rau củ (5.5kg)",
    stock: 20,
    origin: "Hệ thống nông trại đối tác EcoFresh",
    cert: "VietGAP & Hữu cơ",
    rating: 5.0,
    reviewsCount: 84,
    image: "https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=600&q=80",
    isFlashSale: false,
    soldPercent: 95,
    description: "Gói tiết kiệm trọn gói gồm: Cải bó xôi, Cải xoăn, Bí đỏ hồ lô, Cà rốt hữu cơ, Khoai lang mật, Cà chua bi và Rau thơm gia vị đủ dùng cho 3-4 bữa ăn gia đình.",
    cookingTips: "Đã được bảo quản lạnh đóng gói riêng biệt từng loại, có thực đơn gợi ý món ăn đính kèm."
  }
];

const SERVICES = [
  {
    id: "sub-basic",
    name: "Gói đi chợ Eco-Basic",
    price: "1.800.000đ / tháng",
    frequency: "Giao 3 lần / tuần",
    idealFor: "Người độc thân hoặc cặp đôi trẻ",
    features: [
      "12 lần giao hàng giữ lạnh miễn phí tận cửa",
      "Mỗi lần gồm 2 loại rau lá + 1 loại củ quả gia vị tươi",
      "Tiết kiệm 15% so với mua lẻ từng ngày",
      "Đổi món linh hoạt trước 18h mỗi ngày"
    ]
  },
  {
    id: "sub-family",
    name: "Gói đi chợ Eco-Family",
    price: "3.600.000đ / tháng",
    frequency: "Giao 3 lần / tuần",
    idealFor: "Hộ gia đình 3 - 5 người",
    features: [
      "Đầy đủ: Thịt sinh học, Hải sản tươi, Rau hữu cơ & Trái cây",
      "Miễn phí 100% dịch vụ sơ chế Ready-to-cook",
      "Tặng kèm gói gia vị tự nhiên độc quyền",
      "Chuyên gia dinh dưỡng lên thực đơn cân bằng calo"
    ]
  },
  {
    id: "service-prep",
    name: "Dịch vụ sơ chế sạch Ready-to-cook",
    price: "Từ 15.000đ / khẩu phần",
    frequency: "Theo từng đơn đặt hàng",
    idealFor: "Người bận rộn muốn nấu ăn nhanh trong 15 phút",
    features: [
      "Rau củ rửa sạch bằng máy sục ozone loại bỏ 99.9% vi khuẩn",
      "Thái khúc, gọt vỏ sẵn sàng nấu",
      "Thịt cá tẩm ướp sốt chuẩn công thức đầu bếp",
      "Đóng gói hút chân không trong túi sinh học thân thiện"
    ]
  }
];

const NEWS = [
  {
    id: 1,
    title: "Bí quyết chọn rau củ sạch và cách nhận biết dư lượng thuốc trừ sâu",
    category: "Mẹo hay nhà bếp",
    date: "15/10/2026",
    author: "Bác sĩ Dinh dưỡng Minh Anh",
    readTime: "5 phút đọc",
    thumbnail: "https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=600&q=80",
    sapo: "Làm thế nào để các bà nội trợ phân biệt được rau trồng theo tiêu chuẩn hữu cơ với rau phun thuốc kích thích ngoài chợ truyền thống? Dưới đây là 5 dấu hiệu trực quan giúp bạn nhận biết dễ dàng.",
    content: `
      <h3>1. Quan sát màu sắc và hình dáng lá rau</h3>
      <p>Rau hữu cơ tự nhiên thường có màu xanh hơi vàng nhạt tự nhiên, lá dày và có kích thước vừa phải không đồng đều. Ngược lại, rau dùng nhiều đạm hóa học thường có màu xanh mướt bóng bẩy bất thường, thân cây to mập nhưng rất giòn dễ gãy dập.</p>
      <h3>2. Kiểm tra độ giòn ngọt khi chế biến</h3>
      <p>Khi xào nấu, rau sạch VietGAP và hữu cơ sẽ giữ được vị ngọt thanh đậm đà, nước canh trong veo không bị đục ngầu hay có mùi hăng hóa chất.</p>
      <h3>3. Cách rửa và bảo quản giữ trọn vitamin</h3>
      <p>Không nên ngâm rau trong nước muối quá đặc làm tế bào rau mất nước và teo tóp. Hãy rửa dưới vòi nước chảy nhẹ và để ráo tự nhiên trước khi bọc màng giữ mát tủ lạnh.</p>
    `
  },
  {
    id: 2,
    title: "Thực đơn Eat Clean 7 ngày thanh lọc cơ thể cho dân văn phòng bận rộn",
    category: "Cẩm nang sống xanh",
    date: "12/10/2026",
    author: "Chuyên gia Eat Clean Hoàng Lan",
    readTime: "6 phút đọc",
    thumbnail: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=600&q=80",
    sapo: "Chế độ ăn sạch không đồng nghĩa với nhịn ăn hay đồ ăn nhạt nhẽo. Hãy cùng EcoFresh khám phá thực đơn 7 ngày đầy đủ chất dinh dưỡng, nhẹ bụng và giúp tăng cường năng lượng làm việc.",
    content: `
      <h3>Thứ Hai: Khởi động tuần mới nhẹ nhàng</h3>
      <p>Bữa sáng: Sinh tố cải xoăn Kale chuối yến mạch. Bữa trưa: Salad ức gà áp chảo sốt mè rang. Bữa tối: Cá hồi nướng măng tây và khoai lang mật nướng.</p>
      <h3>Thứ Ba: Tăng cường chất xơ</h3>
      <p>Cơm gạo lứt ST25 ăn kèm thịt heo luộc thảo mộc và đĩa cải bó xôi xào tỏi dầu ô liu.</p>
    `
  },
  {
    id: 3,
    title: "Hành trình đưa rau hữu cơ từ thung lũng Đà Lạt đến từng căn bếp gia đình",
    category: "Chuyện nông nghiệp sạch",
    date: "08/10/2026",
    author: "Ban Biên Tập EcoFresh",
    readTime: "4 phút đọc",
    thumbnail: "https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=600&q=80",
    sapo: "Phóng sự thực tế về quy trình thu hoạch từ 4 giờ sáng, phân loại và bảo quản trong thùng giữ nhiệt chuyên dụng của các xã viên Hợp tác xã nông nghiệp Đơn Dương.",
    content: `
      <p>Để đảm bảo rau giữ được độ giòn ngọt nguyên bản, toàn bộ quá trình từ lúc cắt gốc tại luống đất đến khi chuyển vào kho mát trung tâm chỉ diễn ra trong vòng chưa đầy 6 giờ đồng hồ...</p>
    `
  }
];
