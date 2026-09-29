/**
 * ApiService - Data Access Layer (API logic & HTTP Fetch)
 * Mengelola komunikasi data asinkron dengan decoupled JSON data providers
 * dan mensimulasikan RESTful POST endpoint untuk pemesanan layanan.
 */
class ApiService {
  /**
   * Helper internal untuk pemanggilan HTTP Fetch dengan defensive error handling
   * @param {string} url - URL endpoint berkas JSON
   * @returns {Promise<any>} Data JSON hasil parsing
   */
  static async #fetchJSON(url) {
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP Error ${response.status}: ${response.statusText}`);
      }
      const data = await response.json();
      return data;
    } catch (err) {
      console.error(`[API Network Error] Gagal memuat dari ${url}:`, err);
      throw err;
    }
  }

  /**
   * Memuat biodata profil & statistik mahasiswa
   */
  static async fetchProfile() {
    return await this.#fetchJSON('./data/profile.json');
  }

  /**
   * Memuat koleksi portofolio proyek
   */
  static async fetchProjects() {
    return await this.#fetchJSON('./data/projects.json');
  }

  /**
   * Memuat katalog paket layanan & tarif
   */
  static async fetchServices() {
    return await this.#fetchJSON('./data/services.json');
  }

  /**
   * Simulasi Pengiriman Form RESTful via HTTP POST asinkron (Decoupled Form Dispatch)
   * @param {Object} payloadDTO - Object Data Transfer Payload formulir
   * @returns {Promise<Object>} Respon REST API JSON DTO
   */
  static async submitServiceOrder(payloadDTO) {
    return new Promise((resolve, reject) => {
      // Mensimulasikan latensi jaringan 700ms untuk pengujian DevTools & UI Spinner
      setTimeout(() => {
        // Validasi defensif sederhana
        if (!payloadDTO.nama || !payloadDTO.email || !payloadDTO.pesan) {
          reject(new Error("Formulir tidak lengkap: Nama, email, dan pesan wajib diisi."));
          return;
        }

        const simulatedResponse = {
          success: true,
          status: 201,
          statusText: "Created",
          message: "Permintaan layanan berhasil diproses oleh Mock RESTful API Gateway.",
          data: {
            orderId: `ORD-${Date.now().toString().slice(-6)}`,
            timestamp: new Date().toISOString(),
            customer: payloadDTO.nama,
            email: payloadDTO.email,
            service: payloadDTO['jenis-layanan'] || payloadDTO.serviceId || 'General Inquiry',
            category: payloadDTO.kategori || 'Standard',
            options: payloadDTO.opsi || [],
            notes: payloadDTO.pesan
          }
        };

        resolve(simulatedResponse);
      }, 700);
    });
  }
}

// Export global jika tidak menggunakan modul ES6 bertipe module
window.ApiService = ApiService;
