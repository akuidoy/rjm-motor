/**
 * RJM MOTOR - Main Application Script (Final & Full Protected Version)
 * Mendukung Image Slider Warna, serta tetap aman (tidak error) 
 * meskipun elemen Harga, Simulasi Kredit, atau bagian tertentu dihapus dari HTML.
 */

// 1. Fungsi Utilitas Format Rupiah
function formatRupiah(number) {
    if (typeof number !== "number" || isNaN(number)) return "Rp 0";
    return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(number);
}

// Helper aman untuk mengisi teks elemen (Tidak akan error jika elemen HTML dihapus)
function setSafeText(elementId, textValue) {
    const el = document.getElementById(elementId);
    if (el) {
        el.textContent = textValue;
    }
}

// 2. Generator Gambar Fallback SVG
window.createMotorFallbackSvg = function (title, subtitle, theme = "light") {
    const bg = theme === "dark" ? "#181B1F" : "#F3F4F6";
    const fg = theme === "dark" ? "#FFFFFF" : "#111315";
    const sub = theme === "dark" ? "#9CA3AF" : "#6B7280";
    const stroke = theme === "dark" ? "#2E343D" : "#D1D5DB";

    const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 380" width="100%" height="100%">
        <rect width="600" height="380" fill="${bg}"/>
        <rect x="20" y="20" width="560" height="340" fill="none" stroke="${stroke}" stroke-width="1.5" stroke-dasharray="6 6"/>
        <g transform="translate(150, 95)" stroke="${fg}" stroke-width="4" fill="none" opacity="0.22">
            <circle cx="55" cy="135" r="42"/>
            <circle cx="55" cy="135" r="18"/>
            <circle cx="245" cy="135" r="42"/>
            <circle cx="245" cy="135" r="18"/>
            <path d="M55 135 L105 55 L155 55 L185 115 L245 135" stroke-linejoin="round"/>
            <path d="M90 80 L175 80 L215 45 L245 135" stroke-linejoin="round"/>
            <line x1="85" y1="35" x2="120" y2="55" stroke-width="6" stroke-linecap="round"/>
        </g>
        <rect x="245" y="65" width="110" height="22" rx="2" fill="#D91C24"/>
        <text x="300" y="80" text-anchor="middle" fill="#FFFFFF" font-family="sans-serif" font-size="10" font-weight="bold" letter-spacing="1">RJM MOTOR</text>
        <text x="300" y="275" text-anchor="middle" fill="${fg}" font-family="sans-serif" font-size="20" font-weight="bold">${title}</text>
        <text x="300" y="302" text-anchor="middle" fill="${sub}" font-family="sans-serif" font-size="13" font-weight="600">${subtitle}</text>
        <text x="300" y="335" text-anchor="middle" fill="${sub}" font-family="monospace" font-size="10">Siapkan foto asli di folder assets/images/</text>
    </svg>`;

    return "data:image/svg+xml;charset=UTF-8," + encodeURIComponent(svg);
};

// 3. Fungsi Perhitungan Cicilan Bulanan Indikatif
function calculateIndicativeCredit(otrPrice, downPayment, tenorMonths) {
    const scheme = (typeof CREDIT_CONFIG !== "undefined" && CREDIT_CONFIG.schemes)
        ? CREDIT_CONFIG.schemes[0]
        : { monthlyFlatRate: 0.0175, adminAndInsuranceFee: 850000 };

    const principalPure = Math.max(0, otrPrice - downPayment);
    const adminFee = scheme.adminAndInsuranceFee;
    const totalPrincipalFinanced = principalPure + adminFee;

    const totalInterest = totalPrincipalFinanced * scheme.monthlyFlatRate * tenorMonths;
    const rawMonthly = (totalPrincipalFinanced + totalInterest) / tenorMonths;
    const monthlyInstallment = Math.ceil(rawMonthly / 1000) * 1000;
    const totalInstallmentsPaid = monthlyInstallment * tenorMonths;
    const grandTotalWithDp = totalInstallmentsPaid + downPayment;

    return {
        otrPrice,
        downPayment,
        principalPure,
        adminFee,
        monthlyInstallment,
        totalInstallmentsPaid,
        grandTotalWithDp,
        tenorMonths
    };
}

// 4. Fungsi Pengiriman Pesan WhatsApp
function openWhatsAppChat(customMessage) {
    const encodedMsg = encodeURIComponent(customMessage);

    if (typeof DEALER_CONFIG === "undefined" || !DEALER_CONFIG.isWhatsappConfigured || DEALER_CONFIG.whatsappNumber === "6280000000000") {
        showToast(
            `Nomor WhatsApp dealer belum dikonfigurasi di file js/products.js. Pesan otomatis siap dikirim: "${customMessage}"`
        );
        return;
    }

    const waUrl = `https://wa.me/${DEALER_CONFIG.whatsappNumber}?text=${encodedMsg}`;
    window.open(waUrl, "_blank", "noopener,noreferrer");
}

function buildProductWhatsAppMessage(motor, extraInfo = "") {
    const greeting = (typeof DEALER_CONFIG !== "undefined" && DEALER_CONFIG.defaultGreeting) ? DEALER_CONFIG.defaultGreeting : "Halo RJM MOTOR";
    const fullMotorName = `${motor.name} ${motor.variant}`;
    let baseMessage = `${greeting}, saya tertarik dengan ${fullMotorName}. Saya ingin mengetahui harga OTR terbaru dan pilihan kreditnya.`;
    if (extraInfo) {
        baseMessage += ` (${extraInfo})`;
    }
    return baseMessage;
}

function showToast(message) {
    const toast = document.getElementById("toastNotification");
    if (!toast) {
        alert(message);
        return;
    }
    toast.textContent = message;
    toast.classList.add("show");
    clearTimeout(window._toastTimer);
    window._toastTimer = setTimeout(() => {
        toast.classList.remove("show");
    }, 6000);
}

// 5. State Aplikasi Global
let activeSimulatorTenor = 35;
let currentModalMotor = null;
let currentSlideIndex = 0;
let modalMotorImages = [];

document.addEventListener("DOMContentLoaded", () => {
    initNavbar();
    if (typeof MOTOR_PRODUCTS !== "undefined") {
        renderCatalog(MOTOR_PRODUCTS);
    }
    initCatalogFilters();
    initCreditSimulator();
    initModalEvents();
    initFaqAccordion();
    initGlobalWhatsAppButtons();
});

// ==========================================================================
// A. Navigasi & Hamburger Menu
// ==========================================================================
function initNavbar() {
    const hamburgerBtn = document.getElementById("hamburgerBtn");
    const navMenu = document.getElementById("navMenu");
    const navLinks = document.querySelectorAll(".nav-link");

    if (hamburgerBtn && navMenu) {
        hamburgerBtn.addEventListener("click", (e) => {
            e.stopPropagation();
            const isOpen = navMenu.classList.toggle("open");
            hamburgerBtn.classList.toggle("active", isOpen);
            hamburgerBtn.setAttribute("aria-expanded", String(isOpen));
        });

        document.addEventListener("click", (e) => {
            if (!navMenu.contains(e.target) && !hamburgerBtn.contains(e.target) && navMenu.classList.contains("open")) {
                navMenu.classList.remove("open");
                hamburgerBtn.classList.remove("active");
                hamburgerBtn.setAttribute("aria-expanded", "false");
            }
        });

        document.addEventListener("keydown", (e) => {
            if (e.key === "Escape" && navMenu.classList.contains("open")) {
                navMenu.classList.remove("open");
                hamburgerBtn.classList.remove("active");
                hamburgerBtn.setAttribute("aria-expanded", "false");
            }
        });
    }

    navLinks.forEach(link => {
        link.addEventListener("click", () => {
            navLinks.forEach(l => l.classList.remove("active"));
            link.classList.add("active");
            if (navMenu) {
                navMenu.classList.remove("open");
                if (hamburgerBtn) {
                    hamburgerBtn.classList.remove("active");
                    hamburgerBtn.setAttribute("aria-expanded", "false");
                }
            }
        });
    });

    document.querySelectorAll("[data-quick-search]").forEach(item => {
        item.addEventListener("click", () => {
            const keyword = item.getAttribute("data-quick-search");
            const searchInput = document.getElementById("searchInput");
            if (searchInput) {
                searchInput.value = keyword;
                applyCatalogFilters();
            }
        });
    });
}

// ==========================================================================
// B. Katalog Motor, Filter & Pencarian
// ==========================================================================
function renderCatalog(productsList) {
    const grid = document.getElementById("catalogGrid");
    const countText = document.getElementById("catalogCountText");
    if (!grid) return;

    grid.innerHTML = "";

    if (!productsList || productsList.length === 0) {
        if (countText) countText.textContent = "Tidak ditemukan unit yang sesuai dengan kriteria pencarian.";
        grid.innerHTML = `
            <div class="empty-catalog-box">
                <h3>Unit Tidak Ditemukan</h3>
                <p>Silakan ubah kata kunci pencarian atau atur ulang filter kategori.</p>
            </div>
        `;
        return;
    }

    if (countText) countText.textContent = `Menampilkan ${productsList.length} unit sepeda motor`;

    productsList.forEach(motor => {
        const isVerified = motor.priceStatus === "verified" && motor.otrPrice > 0;
        const priceDisplay = isVerified
            ? formatRupiah(motor.otrPrice)
            : "Hubungi Sales untuk Harga Terbaru";

        const dpDisplay = isVerified && motor.minDp
            ? formatRupiah(motor.minDp)
            : "Konfirmasi Sales";

        let installmentDisplay = "Konfirmasi Sales";
        if (isVerified && motor.minDp) {
            const calc = calculateIndicativeCredit(motor.otrPrice, motor.minDp, 35);
            installmentDisplay = `${formatRupiah(calc.monthlyInstallment)} /bln (35x)`;
        }

        const fullTitle = `${motor.name} ${motor.variant}`;
        const fallbackSvg = window.createMotorFallbackSvg(
            fullTitle,
            `${motor.category} • Model ${motor.modelYear}`,
            "light"
        );

        const card = document.createElement("article");
        card.className = "motor-card";
        card.innerHTML = `
            <div class="motor-card-top">
                <div class="card-badges">
                    <span class="badge-category">${motor.category}</span>
                    <span class="badge-year">${motor.modelYear}</span>
                </div>
                <img 
                    src="${motor.image}" 
                    alt="${fullTitle}" 
                    class="motor-card-img"
                    loading="lazy"
                    onerror="this.onerror=null; this.src='${fallbackSvg}';"
                >
            </div>
            <div class="motor-card-body">
                <span class="motor-brand-line">${motor.brand}</span>
                <h3 class="motor-title">${fullTitle}</h3>
                
                <div class="motor-pricing-box">
                    <span class="price-label-tag">${motor.priceLabel || "Harga OTR"}</span>
                    <div class="price-main-value font-mono">${priceDisplay}</div>
                    
                    <div class="credit-quick-info">
                        <div>
                            <span class="cq-label">DP Mulai Dari</span>
                            <span class="cq-val font-mono">${dpDisplay}</span>
                        </div>
                        <div>
                            <span class="cq-label">Estimasi Cicilan</span>
                            <span class="cq-val font-mono">${installmentDisplay}</span>
                        </div>
                    </div>
                </div>

                <div class="motor-card-actions">
                    <button type="button" class="btn btn-outline-gray btn-sm js-detail-btn" data-id="${motor.id}">
                        Detail Motor
                    </button>
                    <button type="button" class="btn btn-primary btn-sm btn-wa-full js-wa-product-btn" data-id="${motor.id}">
                        Tanya Sales (WhatsApp)
                    </button>
                </div>
            </div>
        `;

        grid.appendChild(card);
    });

    grid.querySelectorAll(".js-detail-btn").forEach(btn => {
        btn.addEventListener("click", () => openMotorModal(btn.getAttribute("data-id")));
    });

    grid.querySelectorAll(".js-sim-btn").forEach(btn => {
        btn.addEventListener("click", () => loadMotorIntoSimulator(btn.getAttribute("data-id")));
    });

    grid.querySelectorAll(".js-wa-product-btn").forEach(btn => {
        btn.addEventListener("click", () => {
            const motor = MOTOR_PRODUCTS.find(m => m.id === btn.getAttribute("data-id"));
            if (motor) {
                openWhatsAppChat(buildProductWhatsAppMessage(motor));
            }
        });
    });
}

function initCatalogFilters() {
    const searchInput = document.getElementById("searchInput");
    const brandFilter = document.getElementById("brandFilter");
    const categoryFilter = document.getElementById("categoryFilter");
    const sortFilter = document.getElementById("sortFilter");
    const resetBtn = document.getElementById("resetFilterBtn");

    const controls = [searchInput, brandFilter, categoryFilter, sortFilter];
    controls.forEach(ctrl => {
        if (!ctrl) return;
        ctrl.addEventListener("input", applyCatalogFilters);
        ctrl.addEventListener("change", applyCatalogFilters);
    });

    if (resetBtn) {
        resetBtn.addEventListener("click", () => {
            if (searchInput) searchInput.value = "";
            if (brandFilter) brandFilter.value = "all";
            if (categoryFilter) categoryFilter.value = "all";
            if (sortFilter) sortFilter.value = "default";
            applyCatalogFilters();
        });
    }
}

function applyCatalogFilters() {
    if (typeof MOTOR_PRODUCTS === "undefined") return;

    const searchEl = document.getElementById("searchInput");
    const brandEl = document.getElementById("brandFilter");
    const categoryEl = document.getElementById("categoryFilter");
    const sortEl = document.getElementById("sortFilter");
    const resetBtn = document.getElementById("resetFilterBtn");

    const keyword = searchEl ? searchEl.value.trim().toLowerCase() : "";
    const brand = brandEl ? brandEl.value : "all";
    const category = categoryEl ? categoryEl.value : "all";
    const sort = sortEl ? sortEl.value : "default";

    const isFiltered = keyword !== "" || brand !== "all" || category !== "all" || sort !== "default";
    if (resetBtn) {
        resetBtn.style.display = isFiltered ? "inline-block" : "none";
    }

    let filtered = MOTOR_PRODUCTS.filter(item => {
        const fullText = `${item.brand} ${item.name} ${item.variant} ${item.category}`.toLowerCase();
        const matchKeyword = keyword === "" || fullText.includes(keyword);
        const matchBrand = brand === "all" || item.brand === brand;
        const matchCategory = category === "all" || item.category === category;
        return matchKeyword && matchBrand && matchCategory;
    });

    if (sort === "price-asc") {
        filtered.sort((a, b) => a.otrPrice - b.otrPrice);
    } else if (sort === "price-desc") {
        filtered.sort((a, b) => b.otrPrice - a.otrPrice);
    }

    renderCatalog(filtered);
}

// ==========================================================================
// C. Simulasi Kredit Interaktif (Dilengkapi Pengaman jika HTML Dihapus)
// ==========================================================================
function initCreditSimulator() {
    const motorSelect = document.getElementById("simMotorSelect");
    const priceInput = document.getElementById("simPriceInput");
    const dpInput = document.getElementById("simDpInput");
    const dpSlider = document.getElementById("simDpSlider");
    const schemeSelect = document.getElementById("simSchemeSelect");
    const tenorBtns = document.querySelectorAll(".tenor-btn");
    const askCreditWaBtn = document.getElementById("btnAskCreditWa");

    if (!motorSelect || !priceInput || !dpInput || !dpSlider || !schemeSelect) {
        return;
    }

    MOTOR_PRODUCTS.forEach(motor => {
        const opt = document.createElement("option");
        opt.value = motor.id;
        opt.textContent = `${motor.name} ${motor.variant} — ${formatRupiah(motor.otrPrice)}`;
        motorSelect.appendChild(opt);
    });

    if (MOTOR_PRODUCTS.length > 0) {
        motorSelect.value = MOTOR_PRODUCTS[0].id;
        syncSimulatorInputsWithMotor(MOTOR_PRODUCTS[0]);
    }

    motorSelect.addEventListener("change", () => {
        const selectedId = motorSelect.value;
        const motor = MOTOR_PRODUCTS.find(m => m.id === selectedId);
        if (motor) {
            syncSimulatorInputsWithMotor(motor);
        } else {
            setSafeText("resUnitTitle", "Simulasi Harga Kustom");
            updateSimulationCalculation();
        }
    });

    priceInput.addEventListener("input", () => {
        motorSelect.value = "custom";
        setSafeText("resUnitTitle", "Simulasi Harga Kustom");
        updateSliderBounds();
        updateSimulationCalculation();
    });

    dpInput.addEventListener("input", () => {
        dpSlider.value = dpInput.value;
        updateSimulationCalculation();
    });

    dpSlider.addEventListener("input", () => {
        dpInput.value = dpSlider.value;
        updateSimulationCalculation();
    });

    tenorBtns.forEach(btn => {
        btn.addEventListener("click", () => {
            tenorBtns.forEach(b => b.classList.remove("active"));
            btn.classList.add("active");
            activeSimulatorTenor = parseInt(btn.getAttribute("data-tenor"), 10);
            updateSimulationCalculation();
        });
    });

    schemeSelect.addEventListener("change", updateSimulationCalculation);

    if (askCreditWaBtn) {
        askCreditWaBtn.addEventListener("click", () => {
            const unitEl = document.getElementById("resUnitTitle");
            const unitName = unitEl ? unitEl.textContent : "Sepeda Motor";
            const otr = formatRupiah(Number(priceInput.value));
            const dp = formatRupiah(Number(dpInput.value));
            const msg = `${DEALER_CONFIG.defaultGreeting}, saya tertarik dengan ${unitName} (Harga OTR ${otr}). Saya ingin mengetahui harga OTR terbaru dan pilihan kreditnya dengan rencana DP sekitar ${dp} untuk tenor ${activeSimulatorTenor} bulan.`;
            openWhatsAppChat(msg);
        });
    }
}

function syncSimulatorInputsWithMotor(motor) {
    const priceInput = document.getElementById("simPriceInput");
    const dpInput = document.getElementById("simDpInput");
    if (!priceInput || !dpInput) return;

    priceInput.value = motor.otrPrice;
    dpInput.value = motor.minDp;
    setSafeText("resUnitTitle", `${motor.name} ${motor.variant} (${motor.modelYear})`);

    updateSliderBounds();
    updateSimulationCalculation();
}

function updateSliderBounds() {
    const priceInput = document.getElementById("simPriceInput");
    const dpSlider = document.getElementById("simDpSlider");
    if (!priceInput || !dpSlider) return;

    const price = Math.max(5000000, Number(priceInput.value) || 0);
    const minDp = Math.ceil((price * CREDIT_CONFIG.minDpPercentage) / 100000) * 100000;
    const maxDp = Math.floor((price * 0.8) / 100000) * 100000;

    dpSlider.min = minDp;
    dpSlider.max = maxDp;

    setSafeText("minDpHint", `Min. Indikatif: ${formatRupiah(minDp)}`);
    setSafeText("maxDpHint", `Maks: ${formatRupiah(maxDp)}`);
}

function updateSimulationCalculation() {
    const priceInput = document.getElementById("simPriceInput");
    const dpInput = document.getElementById("simDpInput");
    const schemeSelect = document.getElementById("simSchemeSelect");
    if (!priceInput || !dpInput || !schemeSelect) return;

    const price = Number(priceInput.value) || 0;
    const dp = Number(dpInput.value) || 0;
    const schemeValue = schemeSelect.value;
    const dpError = document.getElementById("simDpError");

    const minAllowedDp = Math.round(price * CREDIT_CONFIG.minDpPercentage);
    const maxAllowedDp = Math.round(price * 0.85);
    const dpPercent = price > 0 ? ((dp / price) * 100).toFixed(1) : 0;

    setSafeText("simDpPercentBadge", `${dpPercent}% dari OTR`);

    if (dpError) {
        if (dp < minAllowedDp) {
            dpError.style.display = "block";
            dpError.textContent = `Perhatian: Uang muka di bawah batas minimum indikatif 12% (${formatRupiah(minAllowedDp)}).`;
        } else if (dp >= price) {
            dpError.style.display = "block";
            dpError.textContent = "Uang muka tidak boleh melebihi atau sama dengan Harga OTR motor.";
        } else {
            dpError.style.display = "none";
        }
    }

    if (schemeValue === "leasing_resmi") {
        setSafeText("resMonthlyInstallment", "Konfirmasi Sales");
        setSafeText("resTenorSummary", `Tenor ${activeSimulatorTenor} Bulan (Mengikuti Tabel Leasing)`);
        setSafeText("resOtrPrice", formatRupiah(price));
        setSafeText("resDownPayment", formatRupiah(dp));
        setSafeText("resPrincipal", formatRupiah(Math.max(0, price - dp)));
        setSafeText("resAdminFee", "Sesuai Polis Leasing");
        setSafeText("resTotalInstallments", "Menunggu Tabel Resmi");
        setSafeText("resGrandTotal", "Menunggu Tabel Resmi");
        return;
    }

    const result = calculateIndicativeCredit(price, Math.min(dp, maxAllowedDp), activeSimulatorTenor);

    setSafeText("resMonthlyInstallment", formatRupiah(result.monthlyInstallment));
    setSafeText("resTenorSummary", `Selama ${result.tenorMonths} Bulan (Estimasi Indikatif)`);
    setSafeText("resOtrPrice", formatRupiah(result.otrPrice));
    setSafeText("resDownPayment", formatRupiah(result.downPayment));
    setSafeText("resPrincipal", formatRupiah(result.principalPure));
    setSafeText("resAdminFee", formatRupiah(result.adminFee));
    setSafeText("resTotalInstallments", formatRupiah(result.totalInstallmentsPaid));
    setSafeText("resGrandTotal", formatRupiah(result.grandTotalWithDp));
}

function loadMotorIntoSimulator(motorId) {
    const motor = MOTOR_PRODUCTS.find(m => m.id === motorId);
    if (!motor) return;

    const motorSelect = document.getElementById("simMotorSelect");
    const simSection = document.getElementById("simulasi");

    if (!motorSelect || !simSection) {
        openWhatsAppChat(buildProductWhatsAppMessage(motor, "Mohon info simulasi kredit dan tabel angsurannya"));
        return;
    }

    motorSelect.value = motor.id;
    syncSimulatorInputsWithMotor(motor);
    simSection.scrollIntoView({ behavior: "smooth" });
}

// ==========================================================================
// D. Modal Detail Motor & Image Slider (Dilengkapi Pengaman Anti-Crash)
// ==========================================================================
function openMotorModal(motorId) {
    const motor = MOTOR_PRODUCTS.find(m => m.id === motorId);
    if (!motor) return;

    currentModalMotor = motor;
    const modal = document.getElementById("motorDetailModal");
    if (!modal) return;

    const fullTitle = `${motor.name} ${motor.variant} (${motor.modelYear})`;

    setSafeText("modalBrandBadge", `${motor.brand} • ${motor.category}`);
    setSafeText("modalMotorTitle", fullTitle);

    // Siapkan daftar gambar untuk slider (atau gambar tunggal jika struktur HTML masih pakai #modalMotorImg)
    const colorCount = (motor.colors && motor.colors.length > 0) ? motor.colors.length : 1;
    modalMotorImages = (motor.images && motor.images.length > 0)
        ? motor.images
        : Array.from({ length: colorCount }, () => motor.image);

    currentSlideIndex = 0;
    renderModalSlider();

    // Mendukung juga jika di HTML masih memakai <img id="modalMotorImg"> biasa
    const legacyModalImg = document.getElementById("modalMotorImg");
    if (legacyModalImg) {
        const fallbackSvg = window.createMotorFallbackSvg(fullTitle, `Varian ${motor.variant}`, "light");
        legacyModalImg.onerror = function () {
            this.onerror = null;
            this.src = fallbackSvg;
        };
        legacyModalImg.src = modalMotorImages[0];
        legacyModalImg.alt = fullTitle;
    }

    // Menggunakan setSafeText agar TIDAK ERROR jika kotak harga dihapus dari HTML
    setSafeText("modalPriceLabel", motor.priceLabel || "Harga OTR");
    setSafeText("modalOtrPrice", formatRupiah(motor.otrPrice));
    setSafeText("modalMinDp", formatRupiah(motor.minDp));
    setSafeText("modalPriceSource", motor.priceSource || "-");
    setSafeText("modalLastUpdated", motor.lastUpdated || "-");
    setSafeText("modalDescription", motor.description || "");

    const colorList = document.getElementById("modalColorList");
    if (colorList && Array.isArray(motor.colors)) {
        colorList.innerHTML = "";
        motor.colors.forEach((color, index) => {
            const btnColor = document.createElement("button");
            btnColor.type = "button";
            btnColor.className = `color-tag ${index === 0 ? "active-color" : ""}`;
            btnColor.textContent = color;
            btnColor.addEventListener("click", () => {
                goToSlide(index);
            });
            colorList.appendChild(btnColor);
        });
    }

    const specsTbody = document.querySelector("#modalSpecsTable tbody");
    if (specsTbody && motor.specs) {
        specsTbody.innerHTML = `
            <tr><td>Tipe Mesin</td><td>${motor.specs.mesin || "-"}</td></tr>
            <tr><td>Kapasitas Mesin</td><td>${motor.specs.kapasitas || "-"}</td></tr>
            <tr><td>Sistem Suplai BBM</td><td>${motor.specs.suplaiBbm || "-"}</td></tr>
            <tr><td>Transmisi</td><td>${motor.specs.transmisi || "-"}</td></tr>
            <tr><td>Daya Maksimum</td><td>${motor.specs.dayaMaksimum || "-"}</td></tr>
            <tr><td>Torsi Maksimum</td><td>${motor.specs.torsiMaksimum || "-"}</td></tr>
            <tr><td>Rem Depan / Belakang</td><td>${motor.specs.remDepan || "-"} / ${motor.specs.remBelakang || "-"}</td></tr>
            <tr><td>Tipe Rangka</td><td>${motor.specs.rangka || "-"}</td></tr>
            <tr><td>Kapasitas Tangki BBM</td><td>${motor.specs.tangkiBbm || "-"}</td></tr>
        `;
    }

    const warrantyList = document.getElementById("modalWarrantyList");
    if (warrantyList && motor.warranty) {
        warrantyList.innerHTML = `
            <li><strong>Garansi Rangka:</strong> ${motor.warranty.rangka || "-"}</li>
            <li><strong>Garansi Mesin:</strong> ${motor.warranty.mesin || "-"}</li>
            <li><strong>Garansi Komponen PGM-FI:</strong> ${motor.warranty.injeksi || "-"}</li>
            <li><strong>Garansi Kelistrikan:</strong> ${motor.warranty.kelistrikan || "-"}</li>
        `;
    }

    modal.classList.add("open");
    modal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
}

function renderModalSlider() {
    const track = document.getElementById("modalSliderTrack");
    const dotsContainer = document.getElementById("sliderDots");
    if (!track) return;

    track.innerHTML = "";
    if (dotsContainer) dotsContainer.innerHTML = "";

    modalMotorImages.forEach((imgSrc, index) => {
        const slide = document.createElement("div");
        slide.className = "slider-slide";

        const colorName = (currentModalMotor && currentModalMotor.colors && currentModalMotor.colors[index])
            ? currentModalMotor.colors[index]
            : `Varian ${index + 1}`;

        const fallbackSvg = window.createMotorFallbackSvg(
            currentModalMotor ? `${currentModalMotor.name} ${currentModalMotor.variant}` : "RJM MOTOR",
            colorName,
            "light"
        );

        slide.innerHTML = `
            <img src="${imgSrc}" alt="${colorName}" loading="lazy" onerror="this.onerror=null; this.src='${fallbackSvg}';">
        `;
        track.appendChild(slide);

        if (dotsContainer) {
            const dot = document.createElement("button");
            dot.type = "button";
            dot.className = `slider-dot ${index === currentSlideIndex ? "active" : ""}`;
            dot.setAttribute("aria-label", `Pindah ke gambar ${index + 1}`);
            dot.addEventListener("click", () => goToSlide(index));
            dotsContainer.appendChild(dot);
        }
    });

    updateSlidePosition();
}

function goToSlide(index) {
    if (!modalMotorImages || modalMotorImages.length === 0) return;

    if (index < 0) {
        currentSlideIndex = modalMotorImages.length - 1;
    } else if (index >= modalMotorImages.length) {
        currentSlideIndex = 0;
    } else {
        currentSlideIndex = index;
    }
    updateSlidePosition();
}

function updateSlidePosition() {
    const track = document.getElementById("modalSliderTrack");
    if (track) {
        track.style.transform = `translateX(-${currentSlideIndex * 100}%)`;
    }

    // Jika masih menggunakan <img id="modalMotorImg"> biasa, ganti src-nya juga saat warna diklik
    const legacyModalImg = document.getElementById("modalMotorImg");
    if (legacyModalImg && modalMotorImages[currentSlideIndex]) {
        legacyModalImg.src = modalMotorImages[currentSlideIndex];
    }

    document.querySelectorAll(".slider-dot").forEach((dot, idx) => {
        dot.classList.toggle("active", idx === currentSlideIndex);
    });

    document.querySelectorAll("#modalColorList .color-tag").forEach((tag, idx) => {
        tag.classList.toggle("active-color", idx === currentSlideIndex);
    });
}

// Fungsi Penutup Modal (Dibuat global di window agar onclick="closeMotorModal()" selalu berfungsi)
window.closeMotorModal = function () {
    const modal = document.getElementById("motorDetailModal");
    if (!modal) return;
    modal.classList.remove("open");
    modal.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
};

function initModalEvents() {
    const modal = document.getElementById("motorDetailModal");
    const closeBtn = document.getElementById("closeModalBtn");
    const simulateBtn = document.getElementById("modalSimulateBtn");
    const waBtn = document.getElementById("modalWaBtn");
    const prevBtn = document.getElementById("sliderPrevBtn");
    const nextBtn = document.getElementById("sliderNextBtn");

    if (closeBtn) {
        closeBtn.addEventListener("click", window.closeMotorModal);
    }

    if (modal) {
        modal.addEventListener("click", e => {
            if (e.target === modal) window.closeMotorModal();
        });
    }

    document.addEventListener("keydown", e => {
        if (e.key === "Escape") window.closeMotorModal();
    });

    if (prevBtn) {
        prevBtn.addEventListener("click", () => goToSlide(currentSlideIndex - 1));
    }

    if (nextBtn) {
        nextBtn.addEventListener("click", () => goToSlide(currentSlideIndex + 1));
    }

    if (simulateBtn) {
        simulateBtn.addEventListener("click", () => {
            if (currentModalMotor) {
                window.closeMotorModal();
                loadMotorIntoSimulator(currentModalMotor.id);
            }
        });
    }

    if (waBtn) {
        waBtn.addEventListener("click", () => {
            if (!currentModalMotor) return;
            const selectedPurchaseRadio = document.querySelector('input[name="modalPurchaseType"]:checked');
            const purchaseMethod = selectedPurchaseRadio ? selectedPurchaseRadio.value : "Tunai / Kredit";
            const selectedColor = (currentModalMotor.colors && currentModalMotor.colors[currentSlideIndex])
                ? `, Warna: ${currentModalMotor.colors[currentSlideIndex]}`
                : "";
            const message = buildProductWhatsAppMessage(currentModalMotor, `Rencana pembelian: ${purchaseMethod}${selectedColor}`);
            openWhatsAppChat(message);
        });
    }
}

// ==========================================================================
// E. Accordion FAQ & Tombol WhatsApp Umum
// ==========================================================================
function initFaqAccordion() {
    const items = document.querySelectorAll(".faq-item");
    items.forEach(item => {
        const btn = item.querySelector(".faq-question");
        const icon = item.querySelector(".faq-icon");
        if (!btn || !icon) return;
        btn.addEventListener("click", () => {
            const isOpen = item.classList.toggle("open");
            btn.setAttribute("aria-expanded", String(isOpen));
            icon.textContent = isOpen ? "−" : "+";
        });
    });
}

function initGlobalWhatsAppButtons() {
    document.querySelectorAll(".js-wa-general").forEach(btn => {
        btn.addEventListener("click", () => {
            const greeting = (typeof DEALER_CONFIG !== "undefined" && DEALER_CONFIG.defaultGreeting) ? DEALER_CONFIG.defaultGreeting : "Halo RJM MOTOR";
            const msg = `${greeting}, saya ingin berkonsultasi mengenai ketersediaan unit sepeda motor baru. Mohon Bantuannya.`;
            openWhatsAppChat(msg);
        });
    });
}