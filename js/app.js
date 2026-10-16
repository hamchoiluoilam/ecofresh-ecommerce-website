/**
 * EcoFresh Market - Master Application Logic
 * State management, cart, search, modals, countdown, VietQR generator, and utilities
 */

// Global State
const AppState = {
  cart: JSON.parse(localStorage.getItem('ecofresh_cart') || '[]'),
  currentDiscount: 0,
  appliedCoupon: '',
  onlineUsers: Math.floor(Math.random() * 15) + 22,
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

function updateCartQuantity(productId, delta) {
  const item = AppState.cart.find(item => item.id === productId);
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
  AppState.cart = AppState.cart.filter(item => item.id !== productId);
  saveCart();
  showToast('Đã xóa sản phẩm khỏi giỏ hàng', 'error');
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
      <button onclick="removeFromCart(${item.id})" style="background:none; color:var(--muted); font-size:14px; padding:4px;">
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
      dropdown.innerHTML = matches.slice(0, 5).map(p => `
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
          <span style="font-size: 14px; color: var(--muted); text-decoration: line-through;">${formatCurrency(p.oldPrice)}</span>
          <span style="font-size: 13px; color: var(--slate); font-weight: 600;">/ ${p.unit}</span>
        </div>

        <p style="font-size: 13.5px; color: var(--slate); line-height: 1.5; margin-bottom: 14px;">${p.description}</p>
        
        <div style="font-size: 12.5px; color: var(--muted); margin-bottom: 8px;">
          <strong><i class="fa-solid fa-location-dot" style="color:var(--primary);"></i> Vùng trồng:</strong> ${p.origin}
        </div>
        <div style="font-size: 12.5px; color: var(--muted); margin-bottom: 16px;">
          <strong><i class="fa-solid fa-utensils" style="color:var(--primary);"></i> Gợi ý món ngon:</strong> ${p.cookingTips}
        </div>

        <div style="margin-top: auto; display: flex; align-items: center; gap: 14px;">
          <div style="display: flex; align-items: center; border: 1px solid var(--border); border-radius: var(--radius-full); overflow: hidden;">
            <button onclick="changeModalQty(-1)" style="width: 36px; height: 36px; background: white; font-weight: bold;">-</button>
            <input id="modal-qty" type="text" value="1" readonly style="width: 40px; text-align: center; font-weight: 700; font-size: 14px;">
            <button onclick="changeModalQty(1)" style="width: 36px; height: 36px; background: white; font-weight: bold;">+</button>
          </div>
          <button class="btn btn-primary" onclick="addModalProductToCart(${p.id})" style="flex: 1;">
            <i class="fa-solid fa-basket-shopping"></i> Thêm vào giỏ hàng
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
  const goal = document.getElementById('bmi-goal')?.value;
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
    advice = 'Khuyên dùng bổ sung thực phẩm giàu đạm sạch (Gà đồi, Thịt heo vi sinh, Gạo lứt ST25) và các loại hạt dinh dưỡng.';
    comboRec = 'Gói Combo Gia Đình Đầy Đủ Dưỡng Chất Eco-Family';
  } else if (bmi <= 24.9) {
    status = 'Thể trạng cân đối tuyệt vời!';
    color = '#10B981';
    advice = 'Duy trì chế độ ăn cân bằng với 50% rau xanh hữu cơ, 25% đạm sạch và 25% tinh bột nguyên cám.';
    comboRec = 'Gói Rau củ tươi tuần Eco-Basic';
  } else {
    status = 'Thể trạng thừa cân - Nên ăn Eat Clean';
    color = '#EF4444';
    advice = 'Ưu tiên rau lá xanh đậm (Cải xoăn Kale, Cải bó xôi), ức gà sinh học và uống nước ép cần tây detox mỗi sáng.';
    comboRec = 'Gói Combo Eat Clean & Detox Xanh 7 Ngày';
  }

  if (resultBox) {
    resultBox.style.display = 'block';
    resultBox.innerHTML = `
      <div style="background: #F8FAFC; border: 2px solid ${color}; padding: 18px; border-radius: var(--radius-md); text-align: center;">
        <div style="font-size: 13px; color: var(--muted); text-transform: uppercase; font-weight: 700;">Chỉ số BMI của bạn</div>
        <div style="font-size: 38px; font-weight: 800; color: ${color}; line-height: 1.2;">${bmi}</div>
        <div style="font-size: 15px; font-weight: 700; color: var(--dark); margin-bottom: 10px;">${status}</div>
        <p style="font-size: 13px; color: var(--slate); line-height: 1.5; margin-bottom: 14px;">${advice}</p>
        <div style="background: white; border: 1px dashed var(--primary); padding: 10px; border-radius: var(--radius-sm); font-size: 13px;">
          <strong style="color: var(--primary-deep);"><i class="fa-solid fa-leaf"></i> Gói thực phẩm khuyên dùng:</strong><br>
          ${comboRec}
        </div>
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

  // Random fluctuation for real-time vibe
  setInterval(() => {
    AppState.onlineUsers += Math.floor(Math.random() * 5) - 2;
    if (AppState.onlineUsers < 15) AppState.onlineUsers = 18;
    if (onlineEl) onlineEl.textContent = AppState.onlineUsers;
  }, 4000);
}

// Initializer
document.addEventListener('DOMContentLoaded', () => {
  updateCartBadge();
  setupSearchAutocomplete();
  startFlashSaleTimer();
  initVisitorCounter();

  // Close modals when clicking backdrop
  document.querySelectorAll('.modal-overlay').forEach(overlay => {
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) {
        overlay.classList.remove('active');
      }
    });
  });
});
