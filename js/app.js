/**
 * EcoFresh Market - Master Application Logic
 * State management, cart, search, modals, countdown, VietQR generator, and utilities
 */

// Global State
const AppState = {
  cart: JSON.parse(localStorage.getItem('ecofresh_cart') || '[]'),
  currentDiscount: 0,
  appliedCoupon: '',
  onlineUsers: Math.floor(Math.random() * 15) + 24,
  todayVisits: 1480 + Math.floor(Math.random() * 50),
  totalVisits: 128450 + Math.floor(Math.random() * 200)
};

// Utilities
function formatCurrency(amount) {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
}

function showToast(message, type = 'success') {
  let container = document.querySelector('.toast-container');
  if (!container) {
    container = document.createElement('div');
    container.className = 'toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = `toast ${type === 'error' ? 'toast-error' : ''}`;
  toast.innerHTML = `
    <div class="toast-icon">
      <i class="${type === 'error' ? 'fa-solid fa-triangle-exclamation' : 'fa-solid fa-circle-check'}"></i>
    </div>
    <div class="toast-message">${message}</div>
  `;
  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(100%)';
    setTimeout(() => toast.remove(), 300);
  }, 3500);
}

// Cart Management
function saveCart() {
  localStorage.setItem('ecofresh_cart', JSON.stringify(AppState.cart));
  updateCartBadge();
  renderMiniCart();
  if (typeof renderCartPage === 'function') {
    renderCartPage();
  }
}

function addToCart(productId, quantity = 1) {
  const product = PRODUCTS.find(p => p.id === productId);
  if (!product) return;

  const existing = AppState.cart.find(item => item.id === productId);
  if (existing) {
    existing.quantity += quantity;
  } else {
    AppState.cart.push({
      id: product.id,
      name: product.name,
      price: product.price,
      oldPrice: product.oldPrice,
      unit: product.unit,
      image: product.image,
      quantity: quantity
    });
  }
  saveCart();
  showToast(`Đã thêm "${product.name}" vào giỏ hàng thành công!`);
}

// Buy Now (Thêm vào giỏ và chuyển ngay tới trang thanh toán)
function buyNow(productId) {
  const product = PRODUCTS.find(p => p.id === productId);
  if (!product) return;

  const existing = AppState.cart.find(item => item.id === productId);
  if (!existing) {
    AppState.cart.push({
      id: product.id,
      name: product.name,
      price: product.price,
      oldPrice: product.oldPrice,
      unit: product.unit,
      image: product.image,
      quantity: 1
    });
    saveCart();
  }
  window.location.href = 'cart.html';
}

// Đặt Gói Combo / Dịch Vụ và chuyển ngay tới thanh toán
function bookService(serviceId) {
  const service = SERVICES.find(s => s.id === serviceId);
  if (!service) return;

  const existing = AppState.cart.find(item => item.id === service.id);
  if (existing) {
    existing.quantity += 1;
  } else {
    AppState.cart.push({
      id: service.id,
      name: service.name,
      price: service.numericPrice,
      oldPrice: Math.round(service.numericPrice * 1.15),
      unit: "Gói dịch vụ",
      image: service.image,
      quantity: 1,
      isService: true
    });
  }
  saveCart();
  showToast(`Đã chọn ${service.name}. Đang chuyển đến trang thanh toán...`);
  setTimeout(() => {
    window.location.href = 'cart.html';
  }, 400);
}

function updateCartQuantity(productId, delta) {
  const item = AppState.cart.find(item => item.id == productId);
  if (item) {
    item.quantity += delta;
    if (item.quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    saveCart();
  }
}

function removeFromCart(productId) {
  AppState.cart = AppState.cart.filter(item => item.id != productId);
  saveCart();
  showToast('Đã xóa món khỏi giỏ hàng', 'error');
}

function updateCartBadge() {
  const badges = document.querySelectorAll('.cart-count-badge');
  const totalItems = AppState.cart.reduce((sum, item) => sum + item.quantity, 0);
  badges.forEach(badge => {
    badge.textContent = totalItems;
  });

  const totalMoneyEl = document.querySelector('.header-cart-total');
  if (totalMoneyEl) {
    const totalAmount = AppState.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    totalMoneyEl.textContent = formatCurrency(totalAmount);
  }
}

function renderMiniCart() {
  const miniCartList = document.querySelector('.mini-cart-items');
  if (!miniCartList) return;

  if (AppState.cart.length === 0) {
    miniCartList.innerHTML = `
      <div style="text-align:center; padding: 20px; color: var(--muted);">
        <i class="fa-solid fa-basket-shopping" style="font-size: 36px; margin-bottom: 8px;"></i>
        <p>Giỏ hàng của bạn đang trống</p>
      </div>
    `;
    return;
  }

  miniCartList.innerHTML = AppState.cart.map(item => `
    <div style="display:flex; gap:10px; padding:10px 0; border-bottom:1px solid #f1f5f9; align-items:center;">
      <img src="${item.image}" style="width:45px; height:45px; border-radius:6px; object-fit:cover;">
      <div style="flex:1;">
        <h5 style="font-size:13px; font-weight:600; line-height:1.3;">${item.name}</h5>
        <div style="font-size:12px; color:var(--muted);">${formatCurrency(item.price)} x ${item.quantity}</div>
      </div>
      <button onclick="removeFromCart('${item.id}')" style="background:none; color:var(--muted); font-size:14px; padding:4px;">
        <i class="fa-solid fa-xmark"></i>
      </button>
    </div>
  `).join('');
}

// Instant Search with Autocomplete
function setupSearchAutocomplete() {
  const searchInput = document.querySelector('.search-input');
  const dropdown = document.querySelector('.search-results-dropdown');
  if (!searchInput || !dropdown) return;

  searchInput.addEventListener('input', (e) => {
    const keyword = e.target.value.trim().toLowerCase();
    if (keyword.length < 2) {
      dropdown.classList.remove('active');
      return;
    }

    const matches = PRODUCTS.filter(p => 
      p.name.toLowerCase().includes(keyword) || 
      p.categoryName.toLowerCase().includes(keyword) ||
      p.origin.toLowerCase().includes(keyword)
    );

    if (matches.length === 0) {
      dropdown.innerHTML = `
        <div style="padding: 16px; text-align: center; color: var(--muted); font-size: 13.5px;">
          Không tìm thấy sản phẩm nào khớp với "<strong>${keyword}</strong>"
        </div>
      `;
    } else {
      dropdown.innerHTML = matches.slice(0, 6).map(p => `
        <div class="search-result-item" onclick="openProductModal(${p.id})">
          <img class="search-result-thumb" src="${p.image}" alt="${p.name}">
          <div class="search-result-info">
            <div class="search-result-name">${p.name}</div>
            <div class="search-result-price">${formatCurrency(p.price)} <span style="font-size:11px; color:var(--muted); font-weight:normal;">/ ${p.unit}</span></div>
          </div>
          <span style="font-size:11px; background:var(--primary-light); color:var(--primary-deep); padding:2px 6px; border-radius:4px; font-weight:700;">${p.cert}</span>
        </div>
      `).join('');
    }
    dropdown.classList.add('active');
  });

  document.addEventListener('click', (e) => {
    if (!e.target.closest('.header-search')) {
      dropdown.classList.remove('active');
    }
  });
}

// Product Quick View Modal
function openProductModal(productId) {
  const p = PRODUCTS.find(item => item.id === productId);
  if (!p) return;

  const modal = document.getElementById('product-detail-modal');
  if (!modal) return;

  const modalBody = modal.querySelector('.modal-body');
  modalBody.innerHTML = `
    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 24px;">
      <div>
        <div style="border-radius: var(--radius-md); overflow: hidden; height: 320px; background: var(--light-bg); margin-bottom: 12px;">
          <img src="${p.image}" style="width:100%; height:100%; object-fit:cover;">
        </div>
        <div style="display: flex; gap: 8px;">
          <span class="badge-cert" style="font-size: 11px; padding: 4px 8px;">Tiêu chuẩn: ${p.cert}</span>
          <span style="background: #E2E8F0; font-size: 11px; padding: 4px 8px; border-radius: 4px; font-weight: 600;">Mã: ${p.code}</span>
        </div>
      </div>
      <div style="display: flex; flex-direction: column;">
        <span style="font-size: 12px; color: var(--primary-dark); font-weight: 700; text-transform: uppercase;">${p.categoryName}</span>
        <h2 style="font-size: 20px; font-weight: 800; color: var(--dark); margin: 6px 0 10px;">${p.name}</h2>
        
        <div style="display: flex; align-items: center; gap: 6px; font-size: 13px; color: var(--accent); margin-bottom: 12px;">
          <span>★ ${p.rating}</span>
          <span style="color: var(--muted);">(${p.reviewsCount} khách hàng đã đánh giá)</span>
        </div>

        <div style="background: var(--primary-bg); padding: 12px 16px; border-radius: var(--radius-sm); margin-bottom: 16px; display: flex; align-items: baseline; gap: 12px;">
          <span style="font-size: 24px; font-weight: 800; color: var(--primary-deep);">${formatCurrency(p.price)}</span>
          ${p.oldPrice ? `<span style="font-size: 14px; color: var(--muted); text-decoration: line-through;">${formatCurrency(p.oldPrice)}</span>` : ''}
          <span style="font-size: 13px; color: var(--slate); font-weight: 600;">/ ${p.unit}</span>
        </div>

        <p style="font-size: 13.5px; color: var(--slate); line-height: 1.5; margin-bottom: 14px;">${p.description}</p>
        
        <div style="font-size: 12.5px; color: var(--muted); margin-bottom: 8px;">
          <strong><i class="fa-solid fa-location-dot" style="color:var(--primary);"></i> Vùng trồng / Nguồn gốc:</strong> ${p.origin}
        </div>
        <div style="font-size: 12.5px; color: var(--muted); margin-bottom: 16px;">
          <strong><i class="fa-solid fa-utensils" style="color:var(--primary);"></i> Gợi ý món ngon:</strong> ${p.cookingTips}
        </div>

        <div style="margin-top: auto; display: flex; align-items: center; gap: 10px;">
          <div style="display: flex; align-items: center; border: 1px solid var(--border); border-radius: var(--radius-full); overflow: hidden;">
            <button onclick="changeModalQty(-1)" style="width: 34px; height: 34px; background: white; font-weight: bold;">-</button>
            <input id="modal-qty" type="text" value="1" readonly style="width: 36px; text-align: center; font-weight: 700; font-size: 14px;">
            <button onclick="changeModalQty(1)" style="width: 34px; height: 34px; background: white; font-weight: bold;">+</button>
          </div>
          <button class="btn btn-primary" onclick="addModalProductToCart(${p.id})" style="flex: 1; padding: 10px 14px;">
            <i class="fa-solid fa-basket-shopping"></i> Thêm giỏ
          </button>
          <button class="btn btn-accent" onclick="buyNow(${p.id})" style="padding: 10px 16px;">
            Mua ngay
          </button>
        </div>

        <div style="display: flex; align-items: center; gap: 10px; margin-top: 14px; font-size: 12px; color: var(--muted);">
          <span>Chia sẻ:</span>
          <a href="https://facebook.com" target="_blank" style="color: #1877F2; font-size: 16px;"><i class="fa-brands fa-facebook"></i></a>
          <a href="https://zalo.me" target="_blank" style="color: #0068FF; font-size: 16px;"><i class="fa-solid fa-comment-dots"></i></a>
        </div>
      </div>
    </div>
  `;
  modal.classList.add('active');
}

function changeModalQty(delta) {
  const input = document.getElementById('modal-qty');
  if (input) {
    let val = parseInt(input.value) || 1;
    val += delta;
    if (val < 1) val = 1;
    input.value = val;
  }
}

function addModalProductToCart(productId) {
  const input = document.getElementById('modal-qty');
  const qty = parseInt(input?.value) || 1;
  addToCart(productId, qty);
  closeModal('product-detail-modal');
}

// Modal xem chi tiết Hợp Tác Xã
function openCooperativeModal(coopId) {
  const c = COOPERATIVES.find(item => item.id === coopId);
  if (!c) return;

  let modal = document.getElementById('cooperative-detail-modal');
  if (!modal) {
    modal = document.createElement('div');
    modal.className = 'modal-overlay';
    modal.id = 'cooperative-detail-modal';
    modal.innerHTML = `
      <div class="modal-box" style="max-width: 720px;">
        <div class="modal-header">
          <div class="modal-title"><i class="fa-solid fa-seedling" style="color:var(--primary);"></i> Thông tin chi tiết Hợp tác xã liên kết</div>
          <button class="modal-close-btn" onclick="closeModal('cooperative-detail-modal')"><i class="fa-solid fa-xmark"></i></button>
        </div>
        <div class="modal-body" id="cooperative-modal-body"></div>
      </div>
    `;
    document.body.appendChild(modal);
    modal.addEventListener('click', (e) => {
      if (e.target === modal) modal.classList.remove('active');
    });
  }

  const body = document.getElementById('cooperative-modal-body');
  body.innerHTML = `
    <div style="margin-bottom: 20px; border-radius: var(--radius-md); overflow: hidden; height: 260px; box-shadow: var(--shadow-sm);">
      <img src="${c.image}" style="width: 100%; height: 100%; object-fit: cover;">
    </div>
    
    <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 14px; flex-wrap: wrap; gap: 10px;">
      <div>
        <span class="badge-cert" style="font-size: 11px; padding: 4px 10px;">Chứng nhận: ${c.certCode}</span>
        <h2 style="font-size: 22px; font-weight: 800; color: var(--dark); margin-top: 6px;">${c.name}</h2>
      </div>
      <div style="background: var(--primary-bg); color: var(--primary-deep); padding: 8px 14px; border-radius: var(--radius-sm); font-size: 13px; font-weight: 700;">
        Năm thành lập: ${c.establishedYear}
      </div>
    </div>

    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 14px; background: #F8FAFC; border: 1px solid var(--border); border-radius: var(--radius-sm); padding: 14px; margin-bottom: 18px; font-size: 13px;">
      <div><strong><i class="fa-solid fa-location-dot" style="color:var(--primary);"></i> Địa chỉ:</strong><br>${c.location}</div>
      <div><strong><i class="fa-solid fa-chart-area" style="color:var(--primary);"></i> Quy mô diện tích:</strong><br>${c.scale}</div>
      <div><strong><i class="fa-solid fa-boxes-packing" style="color:var(--primary);"></i> Sản lượng hàng năm:</strong><br>${c.annualYield}</div>
      <div><strong><i class="fa-solid fa-carrot" style="color:var(--primary);"></i> Nông sản chủ lực:</strong><br>${c.crops}</div>
    </div>

    <div style="margin-bottom: 16px;">
      <h4 style="font-size: 15px; font-weight: 700; color: var(--primary-deep); margin-bottom: 6px;">
        <i class="fa-solid fa-shield-halved"></i> Quy trình canh tác an toàn khép kín:
      </h4>
      <p style="font-size: 13.5px; line-height: 1.6; color: var(--slate);">${c.farmingProcess}</p>
    </div>

    <div style="margin-bottom: 20px;">
      <h4 style="font-size: 15px; font-weight: 700; color: var(--primary-deep); margin-bottom: 6px;">
        <i class="fa-solid fa-handshake"></i> Cam kết hợp tác cùng EcoFresh Market:
      </h4>
      <p style="font-size: 13.5px; line-height: 1.6; color: var(--slate);">${c.description}</p>
    </div>

    <div style="text-align: right; border-top: 1px solid var(--border); padding-top: 14px;">
      <a href="products.html" class="btn btn-primary" onclick="closeModal('cooperative-detail-modal')">
        <i class="fa-solid fa-basket-shopping"></i> Xem sản phẩm từ hợp tác xã này
      </a>
    </div>
  `;

  modal.classList.add('active');
}

function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) modal.classList.remove('active');
}

// Flash Sale Countdown Timer
function startFlashSaleTimer() {
  const hoursEl = document.getElementById('flash-hours');
  const minsEl = document.getElementById('flash-mins');
  const secsEl = document.getElementById('flash-secs');
  if (!hoursEl || !minsEl || !secsEl) return;

  let totalSeconds = 4 * 3600 + 25 * 60 + 38;

  setInterval(() => {
    if (totalSeconds <= 0) totalSeconds = 24 * 3600;
    totalSeconds--;

    const h = Math.floor(totalSeconds / 3600);
    const m = Math.floor((totalSeconds % 3600) / 60);
    const s = totalSeconds % 60;

    hoursEl.textContent = String(h).padStart(2, '0');
    minsEl.textContent = String(m).padStart(2, '0');
    secsEl.textContent = String(s).padStart(2, '0');
  }, 1000);
}

// BMI & Meal Plan Recommendation Calculator Tool
function openBmiCalculator() {
  const modal = document.getElementById('bmi-calculator-modal');
  if (modal) modal.classList.add('active');
}

function calculateBmi() {
  const height = parseFloat(document.getElementById('bmi-height')?.value) / 100;
  const weight = parseFloat(document.getElementById('bmi-weight')?.value);
  const resultBox = document.getElementById('bmi-result-box');

  if (!height || !weight || height <= 0 || weight <= 0) {
    showToast('Vui lòng nhập chiều cao và cân nặng hợp lệ!', 'error');
    return;
  }

  const bmi = (weight / (height * height)).toFixed(1);
  let status = '';
  let color = '';
  let advice = '';
  let comboRec = '';

  if (bmi < 18.5) {
    status = 'Cơ thể nhẹ cân - Cần bổ sung dinh dưỡng';
    color = '#F59E0B';
    advice = 'Khuyên dùng bổ sung thực phẩm giàu đạm sạch (Gà đồi, Thịt bò Úc, Gạo lứt ST25) và các loại nấm tươi bổ dưỡng.';
    comboRec = 'Gói Combo Gia Đình Đầy Đủ Dưỡng Chất Eco-Family';
  } else if (bmi <= 24.9) {
    status = 'Thể trạng cân đối tuyệt vời!';
    color = '#10B981';
    advice = 'Duy trì chế độ ăn cân bằng với 50% rau xanh hữu cơ, 25% đạm sạch và 25% tinh bột nguyên cám.';
    comboRec = 'Gói Đi Chợ Tuần Eco-Basic';
  } else {
    status = 'Thể trạng thừa cân - Nên ăn Eat Clean';
    color = '#EF4444';
    advice = 'Ưu tiên rau lá xanh đậm (Cải xoăn Kale, Cải bó xôi, súp lơ baby), ức gà sinh học và cá hồi Nauy ít béo.';
    comboRec = 'Combo Eat Clean 7 Ngày Thanh Lọc Mỡ Thừa';
  }

  if (resultBox) {
    resultBox.style.display = 'block';
    resultBox.innerHTML = `
      <div style="background: #F8FAFC; border: 2px solid ${color}; padding: 18px; border-radius: var(--radius-md); text-align: center;">
        <div style="font-size: 13px; color: var(--muted); text-transform: uppercase; font-weight: 700;">Chỉ số BMI của bạn</div>
        <div style="font-size: 38px; font-weight: 800; color: ${color}; line-height: 1.2;">${bmi}</div>
        <div style="font-size: 15px; font-weight: 700; color: var(--dark); margin-bottom: 10px;">${status}</div>
        <p style="font-size: 13px; color: var(--slate); line-height: 1.5; margin-bottom: 14px;">${advice}</p>
        <div style="background: white; border: 1px dashed var(--primary); padding: 12px; border-radius: var(--radius-sm); font-size: 13px; margin-bottom:12px;">
          <strong style="color: var(--primary-deep);"><i class="fa-solid fa-leaf"></i> Gói thực phẩm khuyên dùng:</strong><br>
          <span style="font-weight:700; font-size:14px;">${comboRec}</span>
        </div>
        <button class="btn btn-primary" onclick="bookService('sub-family')" style="width:100%;">
          <i class="fa-solid fa-basket-shopping"></i> Đặt gói gợi ý & Thanh toán ngay
        </button>
      </div>
    `;
  }
}

// Live Visitor Counter Simulation
function initVisitorCounter() {
  const onlineEl = document.getElementById('stat-online-users');
  const todayEl = document.getElementById('stat-today-visits');
  const totalEl = document.getElementById('stat-total-visits');

  if (onlineEl) onlineEl.textContent = AppState.onlineUsers;
  if (todayEl) todayEl.textContent = AppState.todayVisits.toLocaleString('vi-VN');
  if (totalEl) totalEl.textContent = AppState.totalVisits.toLocaleString('vi-VN');

  setInterval(() => {
    AppState.onlineUsers += Math.floor(Math.random() * 5) - 2;
    if (AppState.onlineUsers < 15) AppState.onlineUsers = 20;
    if (onlineEl) onlineEl.textContent = AppState.onlineUsers;
  }, 4000);
}

// Initializer
document.addEventListener('DOMContentLoaded', () => {
  updateCartBadge();
  setupSearchAutocomplete();
  startFlashSaleTimer();
  initVisitorCounter();

  document.querySelectorAll('.modal-overlay').forEach(overlay => {
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) {
        overlay.classList.remove('active');
      }
    });
  });
});
