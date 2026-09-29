/**
 * App - Presentation Layer (DOM Controller, Dynamic CSR, Events & Local State)
 * Mengelola rendering dinamis antarmuka (Client-Side Rendering), 4 UI States,
 * Universal Dynamic Modal, Filter Kategori, Form Dispatching, dan LocalStorage Persistence.
 */
class App {
  constructor() {
    this.state = {
      profile: null,
      projects: [],
      services: [],
      activeCategory: 'Semua',
      orderHistory: JSON.parse(localStorage.getItem('petra_orders_history') || '[]')
    };

    this.init();
  }

  /**
   * Inisialisasi aplikasi saat DOM siap
   */
  async init() {
    this.setupEventListeners();
    this.updateOrderBadgeCount();
    
    // Muat data utama secara paralel
    await Promise.all([
      this.loadProfileData(),
      this.loadProjectsData(),
      this.loadServicesData()
    ]);
  }

  /**
   * Safe Sanitization String untuk mencegah DOM-Based XSS Attacks
   * @param {string} str - Input mentah yang akan disanitasi
   * @returns {string} String aman terenkode HTML
   */
  escapeHTML(str) {
    if (typeof str !== 'string') return str;
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  /* ==========================================================================
     1. UI STATES MANAGEMENT & DATA LOADING (Projects, Services, Profile)
     ========================================================================== */

  /**
   * Memuat data Profil dari data/profile.json
   */
  async loadProfileData() {
    try {
      const data = await ApiService.fetchProfile();
      this.state.profile = data.developer;
      this.renderProfileSection();
    } catch (err) {
      console.warn('Gagal memuat profil dinamis:', err);
    }
  }

  /**
   * Memuat data Portofolio Proyek & mengelola 4 UI States
   */
  async loadProjectsData() {
    const container = document.getElementById('projectsContainer');
    if (!container) return;

    // STATE 1: LOADING STATE (Render Skeleton Cards)
    this.renderProjectsSkeleton(container);

    try {
      const projects = await ApiService.fetchProjects();
      this.state.projects = projects;

      // Render filter kategori tombol
      this.renderCategoryFilterButtons();

      // STATE 2: SUCCESS STATE (Render Projects Grid)
      this.renderProjectsGrid();
    } catch (err) {
      // STATE 4: ERROR FALLBACK ALERT STATE
      this.renderProjectsError(container, err);
    }
  }

  /**
   * Memuat data Katalog Layanan & mengelola UI States
   */
  async loadServicesData() {
    const container = document.getElementById('servicesContainer');
    const selectEl = document.getElementById('jenis-layanan');
    if (!container) return;

    // Loading Spinner / Skeleton
    container.innerHTML = `
      <div class="col-12 text-center py-5">
        <div class="spinner-border text-primary" role="status">
          <span class="visually-hidden">Memuat Layanan...</span>
        </div>
        <p class="mt-2 text-muted">Memuat katalog paket layanan dinamis...</p>
      </div>
    `;

    try {
      const services = await ApiService.fetchServices();
      this.state.services = services;

      // Render Services Cards
      this.renderServicesGrid(container);

      // Populate Select Option di Formulir Layanan
      if (selectEl) {
        this.populateServiceSelectOptions(selectEl, services);
      }
    } catch (err) {
      container.innerHTML = `
        <div class="col-12">
          <div class="alert alert-danger text-center shadow-sm">
            <i class="bi bi-exclamation-triangle-fill me-2"></i>
            Gagal memuat katalog layanan: <strong>${this.escapeHTML(err.message)}</strong>.
            <button class="btn btn-sm btn-outline-danger ms-3" onclick="window.app.loadServicesData()">Coba Lagi</button>
          </div>
        </div>
      `;
    }
  }

  /* ==========================================================================
     2. RENDERING LOGIC (Presentation Layer)
     ========================================================================== */

  /**
   * Render profil dinamis di UI jika elemen tersedia
   */
  renderProfileSection() {
    if (!this.state.profile) return;
    const p = this.state.profile;
    
    // Update counter statistik jika ada
    const certCountEl = document.getElementById('statCertificatesCount');
    if (certCountEl) certCountEl.textContent = p.statistics.totalCertificates;
  }

  /**
   * State 1: Render Skeleton Cards saat memuat data proyek
   */
  renderProjectsSkeleton(container) {
    let skeletonHTML = '';
    for (let i = 0; i < 4; i++) {
      skeletonHTML += `
        <div class="col-md-6 col-lg-3">
          <div class="card card-project border-0 shadow-sm h-100 skeleton-card">
            <div class="skeleton-img"></div>
            <div class="card-body p-3">
              <div class="skeleton-line w-75 mb-2"></div>
              <div class="skeleton-line w-50 mb-3"></div>
              <div class="skeleton-line w-100 mb-1"></div>
              <div class="skeleton-line w-100"></div>
            </div>
          </div>
        </div>
      `;
    }
    container.innerHTML = `<div class="row g-4">${skeletonHTML}</div>`;
  }

  /**
   * State 2 & 3: Render Projects Grid (Success & Empty State)
   */
  renderProjectsGrid() {
    const container = document.getElementById('projectsContainer');
    if (!container) return;

    // Filter projects berdasarkan active category
    const filteredProjects = this.state.activeCategory === 'Semua'
      ? this.state.projects
      : this.state.projects.filter(p => p.category.toLowerCase() === this.state.activeCategory.toLowerCase());

    // STATE 3: EMPTY STATE (Jika hasil filter kosong)
    if (filteredProjects.length === 0) {
      container.innerHTML = `
        <div class="col-12">
          <div class="alert alert-info text-center py-4 shadow-sm border-0">
            <i class="bi bi-info-circle fs-3 d-block mb-2 text-primary"></i>
            <h5>Tidak Ada Proyek Ditemukan</h5>
            <p class="mb-0 text-muted">Belum ada koleksi proyek untuk kategori <strong>"${this.escapeHTML(this.state.activeCategory)}"</strong>.</p>
          </div>
        </div>
      `;
      return;
    }

    // STATE 2: SUCCESS RENDER STATE
    let cardsHTML = '';
    filteredProjects.forEach(proj => {
      const tagsHTML = proj.tags ? proj.tags.map(t => `<span class="badge bg-light text-dark border me-1 mb-1">${this.escapeHTML(t)}</span>`).join('') : '';
      
      cardsHTML += `
        <div class="col-md-6 col-lg-3">
          <div class="card card-project border-0 shadow-sm h-100">
            <div class="position-relative overflow-hidden card-img-wrapper">
              <img src="${this.escapeHTML(proj.thumbnail)}" class="card-img-top project-thumbnail" alt="${this.escapeHTML(proj.title)}">
              <span class="badge bg-primary position-absolute top-0 end-0 m-2 px-2 py-1">${this.escapeHTML(proj.category)}</span>
            </div>
            <div class="card-body d-flex flex-column p-3">
              <h5 class="card-title fw-bold text-dark fs-6 mb-2">${this.escapeHTML(proj.title)}</h5>
              <p class="card-text text-secondary small flex-grow-1 mb-3">${this.escapeHTML(proj.description)}</p>
              
              <div class="mb-3">
                <small class="text-primary fw-semibold d-block mb-1"><i class="bi bi-graph-up-arrow me-1"></i>${this.escapeHTML(proj.metrics)}</small>
                <div class="d-flex flex-wrap">${tagsHTML}</div>
              </div>
              
              <button type="button" class="btn btn-outline-primary btn-sm w-100 rounded-pill mt-auto fw-bold" onclick="window.app.openProjectModal('${this.escapeHTML(proj.id)}')">
                <i class="bi bi-eye me-1"></i> lihat Detail Rincian
              </button>
            </div>
          </div>
        </div>
      `;
    });

    container.innerHTML = `<div class="row g-4">${cardsHTML}</div>`;
  }

  /**
   * State 4: Defensive Error Alert State saat API Fetch gagal
   */
  renderProjectsError(container, err) {
    container.innerHTML = `
      <div class="col-12">
        <div class="alert alert-danger p-4 shadow-sm border-0 text-center">
          <i class="bi bi-exclamation-diamond fs-2 d-block mb-2 text-danger"></i>
          <h5 class="fw-bold">Gagal Memuat Data Portofolio!</h5>
          <p class="mb-3 text-secondary">Terjadi kesalahan koneksi atau berkas JSON tidak ditemukan: <code>${this.escapeHTML(err.message)}</code></p>
          <button type="button" class="btn btn-danger px-4 rounded-pill fw-bold" onclick="window.app.loadProjectsData()">
            <i class="bi bi-arrow-clockwise me-1"></i> Coba Muat Ulang Data
          </button>
        </div>
      </div>
    `;
  }

  /**
   * Render Filter Kategori Tombol untuk Proyek
   */
  renderCategoryFilterButtons() {
    const filterContainer = document.getElementById('projectFilterContainer');
    if (!filterContainer) return;

    const categories = ['Semua', ...new Set(this.state.projects.map(p => p.category))];

    let buttonsHTML = categories.map(cat => {
      const activeClass = cat.toLowerCase() === this.state.activeCategory.toLowerCase() ? 'btn-primary active' : 'btn-outline-primary';
      return `
        <button type="button" class="btn ${activeClass} btn-sm rounded-pill px-3 m-1 fw-semibold filter-btn" data-category="${this.escapeHTML(cat)}">
          ${this.escapeHTML(cat)}
        </button>
      `;
    }).join('');

    filterContainer.innerHTML = `<div class="d-flex flex-wrap justify-content-center mb-4">${buttonsHTML}</div>`;

    // Add click listeners to filter buttons
    filterContainer.querySelectorAll('.filter-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        this.state.activeCategory = e.target.getAttribute('data-category');
        this.renderCategoryFilterButtons();
        this.renderProjectsGrid();
      });
    });
  }

  /**
   * Render Cards Paket Layanan
   */
  renderServicesGrid(container) {
    let cardsHTML = '';
    this.state.services.forEach(svc => {
      const featuresHTML = svc.features.map(f => `<li class="mb-2"><i class="bi bi-check-circle-fill text-success me-2"></i>${this.escapeHTML(f)}</li>`).join('');
      const badgeHTML = svc.badge ? `<span class="badge bg-warning text-dark position-absolute top-0 end-0 m-3 fw-bold px-3 py-2 rounded-pill">${this.escapeHTML(svc.badge)}</span>` : '';

      cardsHTML += `
        <div class="col-md-6 col-lg-4">
          <div class="card service-card border-0 shadow-sm h-100 position-relative">
            ${badgeHTML}
            <div class="card-body p-4 d-flex flex-column">
              <h4 class="fw-bold text-dark mb-1 fs-5">${this.escapeHTML(svc.title)}</h4>
              <p class="text-muted small mb-3">${this.escapeHTML(svc.category)}</p>
              
              <div class="price-tag mb-3 p-3 bg-light rounded text-center">
                <span class="fs-4 fw-bold text-primary">${this.escapeHTML(svc.price)}</span>
                <small class="d-block text-muted">Estimasi: ${this.escapeHTML(svc.estimatedTime)}</small>
              </div>

              <p class="card-text text-secondary mb-3 small">${this.escapeHTML(svc.description)}</p>

              <ul class="list-unstyled small mb-4 flex-grow-1">
                ${featuresHTML}
              </ul>

              <a href="#formulir-layanan" onclick="window.app.selectServiceOption('${this.escapeHTML(svc.id)}')" class="btn btn-primary w-100 rounded-pill fw-bold">
                <i class="bi bi-cart-plus me-1"></i> Pesan Paket Ini
              </a>
            </div>
          </div>
        </div>
      `;
    });

    container.innerHTML = `<div class="row g-4">${cardsHTML}</div>`;
  }

  /**
   * Populate Opsi Select Layanan pada Formulir
   */
  populateServiceSelectOptions(selectEl, services) {
    selectEl.innerHTML = '<option value="" disabled selected>-- Pilih Layanan Utama --</option>';
    services.forEach(svc => {
      const opt = document.createElement('option');
      opt.value = svc.id;
      opt.textContent = `${svc.title} (${svc.price})`;
      selectEl.appendChild(opt);
    });
  }

  /**
   * Memilih opsi layanan secara cepat dari tombol card
   */
  selectServiceOption(serviceId) {
    const selectEl = document.getElementById('jenis-layanan');
    if (selectEl) {
      selectEl.value = serviceId;
    }
  }

  /* ==========================================================================
     3. UNIVERSAL DYNAMIC MODAL COMPONENT (1 Modal Utama di HTML)
     ========================================================================== */

  /**
   * Membuka Universal Dynamic Modal dan menginjeksi rincian proyek secara presisi
   * @param {string} projectId - ID unik proyek yang diklik
   */
  openProjectModal(projectId) {
    const proj = this.state.projects.find(p => p.id === projectId);
    if (!proj) return;

    const modalTitle = document.getElementById('projectModalTitle');
    const modalBody = document.getElementById('projectModalBody');
    const modalEl = document.getElementById('universalProjectModal');

    if (!modalTitle || !modalBody || !modalEl) return;

    // Injeksi Judul dengan Sanitasi
    modalTitle.textContent = proj.title;

    // Injeksi Dynamic HTML Body tanpa duplikasi elemen HTML modal
    modalBody.innerHTML = `
      <div class="row g-4">
        <div class="col-md-6">
          <img src="${this.escapeHTML(proj.thumbnail)}" class="img-fluid rounded shadow-sm w-100" alt="${this.escapeHTML(proj.title)}">
        </div>
        <div class="col-md-6">
          <div class="badge bg-primary px-3 py-2 rounded-pill mb-2">${this.escapeHTML(proj.category)}</div>
          <h4 class="fw-bold text-dark">${this.escapeHTML(proj.title)}</h4>
          <p class="text-secondary small mb-3">${this.escapeHTML(proj.description)}</p>

          <div class="p-3 bg-light rounded mb-3 border">
            <div class="fw-bold text-dark small mb-1"><i class="bi bi-trophy text-warning me-1"></i> Penghargaan & Pencapaian:</div>
            <div class="text-primary fw-semibold small">${this.escapeHTML(proj.award || 'Proyek Portofolio Terdaftar')}</div>
          </div>

          <div class="mb-3">
            <div class="fw-bold text-dark small mb-1"><i class="bi bi-speedometer2 text-info me-1"></i> Metric Kinerja:</div>
            <span class="badge bg-info text-dark">${this.escapeHTML(proj.metrics)}</span>
          </div>

          <div class="mb-3">
            <div class="fw-bold text-dark small mb-1">Teknologi & Tags:</div>
            <div>
              ${proj.tags ? proj.tags.map(t => `<span class="badge bg-secondary me-1 mb-1">${this.escapeHTML(t)}</span>`).join('') : ''}
            </div>
          </div>
        </div>
        <div class="col-12 mt-2">
          <hr>
          <h6 class="fw-bold text-dark"><i class="bi bi-file-text me-1"></i> Rincian Deskripsi Arsitektural:</h6>
          <p class="text-muted small">${this.escapeHTML(proj.details || proj.description)}</p>
        </div>
      </div>
    `;

    // Operasionalkan Bootstrap 5 Modal API
    const bsModal = bootstrap.Modal.getOrCreateInstance(modalEl);
    bsModal.show();
  }

  /* ==========================================================================
     4. DECOUPLED FORM REST DISPATCHING & LOCALSTORAGE PERSISTENCE
     ========================================================================== */

  /**
   * Event Listeners Setup
   */
  setupEventListeners() {
    const form = document.getElementById('contactForm');
    if (form) {
      form.addEventListener('submit', (e) => this.handleFormSubmit(e, form));
    }
  }

  /**
   * Menangani pengiriman formulir asinkron tanpa full page reload
   */
  async handleFormSubmit(e, form) {
    e.preventDefault(); // Mencegah full page reload standar

    const formData = new FormData(form);
    const payload = Object.fromEntries(formData.entries());

    // Ambil opsi tambahan checkbox
    const opsiCheckboxes = form.querySelectorAll('input[name="opsi"]:checked');
    const opsiArr = Array.from(opsiCheckboxes).map(cb => cb.value);
    payload.opsi = opsiArr;

    const submitBtn = form.querySelector('button[type="submit"]') || form.querySelector('button.btn-primary');
    if (!submitBtn) return;

    const originalBtnText = submitBtn.innerHTML;

    // Disabled state & UI Spinner
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-2" role="status"></span>Mengirim Permintaan REST API...';

    try {
      // Dispatched via ApiService (AJAX/Fetch POST simulation)
      const result = await ApiService.submitServiceOrder(payload);

      // Simpan ke localStorage
      this.saveOrderToLocalStorage(result.data);

      // Tampilkan Feedback Toast Bootstrap
      this.showToastNotification('Sukses!', result.message, 'success');

      // Reset form
      form.reset();
    } catch (err) {
      console.error('Error submitting form:', err);
      this.showToastNotification('Gagal!', err.message || 'Terjadi kesalahan saat mengirim pesanan.', 'danger');
    } finally {
      // Restore submit button state
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalBtnText;
    }
  }

  /**
   * Simpan catatan pesanan ke localStorage secara terdistribusi di sisi klien
   */
  saveOrderToLocalStorage(orderData) {
    this.state.orderHistory.unshift(orderData);
    localStorage.setItem('petra_orders_history', JSON.stringify(this.state.orderHistory));
    this.updateOrderBadgeCount();
  }

  /**
   * Update badge jumlah pesanan yang tersimpan di UI secara reaktif
   */
  updateOrderBadgeCount() {
    const badgeEl = document.getElementById('orderHistoryBadge');
    const count = this.state.orderHistory.length;
    if (badgeEl) {
      badgeEl.textContent = `${count} Pesanan Tersimpan`;
      badgeEl.classList.toggle('d-none', count === 0);
    }
  }

  /**
   * Menampilkan Notifikasi Umpan Balik Visual Toast Bootstrap
   * @param {string} title - Judul Toast
   * @param {string} message - Pesan Toast
   * @param {string} type - 'success' | 'danger' | 'info'
   */
  showToastNotification(title, message, type = 'success') {
    let toastContainer = document.getElementById('toastContainer');
    if (!toastContainer) {
      toastContainer = document.createElement('div');
      toastContainer.id = 'toastContainer';
      toastContainer.className = 'toast-container position-fixed bottom-0 end-0 p-3';
      toastContainer.style.zIndex = '1100';
      document.body.appendChild(toastContainer);
    }

    const toastId = `toast-${Date.now()}`;
    const bgClass = type === 'success' ? 'bg-success text-white' : type === 'danger' ? 'bg-danger text-white' : 'bg-primary text-white';

    const toastHTML = `
      <div id="${toastId}" class="toast align-items-center ${bgClass} border-0 shadow-lg" role="alert" aria-live="assertive" aria-atomic="true">
        <div class="d-flex">
          <div class="toast-body">
            <h6 class="fw-bold mb-1"><i class="bi bi-check-circle-fill me-2"></i>${this.escapeHTML(title)}</h6>
            <span>${this.escapeHTML(message)}</span>
          </div>
          <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
        </div>
      </div>
    `;

    toastContainer.insertAdjacentHTML('beforeend', toastHTML);

    const toastEl = document.getElementById(toastId);
    const bsToast = new bootstrap.Toast(toastEl, { delay: 4500 });
    bsToast.show();

    toastEl.addEventListener('hidden.bs.toast', () => {
      toastEl.remove();
    });
  }
}

// Inisialisasi Aplikasi Web
document.addEventListener('DOMContentLoaded', () => {
  window.app = new App();
});
