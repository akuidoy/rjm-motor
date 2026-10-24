/**
 * RJM MOTOR - Database Produk & Konfigurasi Dealer
 * Memisahkan data dari logika tampilan (Separation of Concerns)
 */

const DEALER_CONFIG = {
    name: "RJM MOTOR",
    tagline: "Showroom & Dealer Sepeda Motor Baru",
    whatsappNumber: "6285715065872", // Ganti dengan nomor WhatsApp aktif (tanpa tanda +)
    isWhatsappConfigured: true,     // Ubah jadi true jika nomor sudah diisi
    defaultGreeting: "Halo Pak Aceng",
};

const CREDIT_CONFIG = {
    minDpPercentage: 0.12,
    availableTenors: [11, 17, 23, 29, 35],
    schemes: [
        {
            id: "estimasi_standar",
            name: "Skema Reguler (Estimasi Indikatif)",
            monthlyFlatRate: 0.0175,
            adminAndInsuranceFee: 850000,
            description: "Perhitungan menggunakan asumsi suku bunga flat indikatif 1,75% per bulan."
        }
    ]
};

const MOTOR_PRODUCTS = [
    {
        id: "honda-beat-cbs-2026",
        brand: "Honda",
        name: "Honda BeAT",
        variant: "CBS",
        modelYear: 2026,
        category: "Matic",
        otrPrice: 18980000,
        priceStatus: "verified",
        priceLabel: "Harga OTR (Acuan DKI Jakarta)",
        priceSource: "PT Astra Honda Motor (astra-honda.com)",
        lastUpdated: "Januari 2026",
        minDp: 2300000,
        image: "ASET/IMAGES/beatcbs/merah-birucbs.png",
      images: [
            "ASET/IMAGES/beatcbs/merah-cbs.png",
            "ASET/IMAGES/beatcbs/cbs-biru.png",
            "ASET/IMAGES/beatcbs/beat-cbs.png",
            "ASET/IMAGES/beatcbs/merah-birucbs.png",
            "ASET/IMAGES/beatcbs/black-mattecbs.png"
        ],

        // 3. Nama tombol warna (urutannya menyesuaikan daftar images di atas):
        colors: [
            "Jazz Glossy Red Black",  // Ketika diklik -> pindah ke Slide 1
            "Jazz Glossy Black",      // Ketika diklik -> pindah ke Slide 2
            "Jazz Glossy Blue Black",
            "Infinite Glossy Red Blue",      // Ketika diklik -> pindah ke Slide 2
            "Infinite Matte Black"  // Ketika diklik -> pindah ke Slide 3
        ],
        colors: ["Jazz Glossy Red Black", "Jazz Glossy Blue Black", "Jazz Glossy Black", "Infinite Glossy Red Blue", "Infinite Matte Black"],
        specs: {
            mesin: "4-Langkah, SOHC, eSP",
            kapasitas: "109,5 cc",
            suplaiBbm: "Injeksi (PGM-FI)",
            transmisi: "Otomatis, V-Matic",
            dayaMaksimum: "6,6 kW (9,0 PS) / 7.500 rpm",
            torsiMaksimum: "9,2 Nm (0,94 kgf.m) / 6.000 rpm",
            remDepan: "Cakram Hidrolik, Piston Tunggal",
            remBelakang: "Tromol (Combi Brake System)",
            rangka: "eSAF (enhanced Smart Architecture Frame)",
            tangkiBbm: "4,2 Liter"
        },
        warranty: {
            rangka: "5 Tahun tanpa batas jarak tempuh",
            mesin: "3 Tahun atau 36.000 km",
            injeksi: "5 Tahun atau 60.000 km",
            kelistrikan: "1 Tahun atau 12.000 km"
        },
        description: "Skutik kompak yang gesit dan irit bahan bakar untuk mobilitas harian di perkotaan."
    },
    {
        id: "honda-beat-Street-2026",
        brand: "Honda",
        name: "Honda BeAT",
        variant: "Street",
        modelYear: 2026,
        category: "Matic",
        otrPrice: 18980000,
        priceStatus: "verified",
        priceLabel: "Harga OTR (Acuan DKI Jakarta)",
        priceSource: "PT Astra Honda Motor (astra-honda.com)",
        lastUpdated: "Januari 2026",
        minDp: 2300000,
        image: "ASET/IMAGES/beatstreet/varian-2-3-26062026-063605.webp",
      images: [
            "ASET/IMAGES/beatstreet/varian-2-3-26062026-063605.webp", // Slide 1 (Cocok dengan warna ke-1)
            "ASET/IMAGES/beatstreet/varian-3-1-1-30062026-033754.webp",       // Slide 2 (Cocok dengan warna ke-2)
            "ASET/IMAGES/beatstreet/varian-1-3-26062026-063608.webp"  
        ],
        // 3. Nama tombol warna (urutannya menyesuaikan daftar images di atas):
        colors: [
            "Street Matte Brown",  // Ketika diklik -> pindah ke Slide 1
            "Street Matte Grey",      // Ketika diklik -> pindah ke Slide 2
            "Street Matte Black"
        ],
        colors: ["Street Matte Brown", "Street Matte Grey", "Street Matte Black"],
        specs: {
            mesin: "4-Langkah, SOHC, eSP",
            kapasitas: "109,5 cc",
            suplaiBbm: "Injeksi (PGM-FI)",
            transmisi: "Otomatis, V-Matic",
            dayaMaksimum: "6,6 kW (9,0 PS) / 7.500 rpm",
            torsiMaksimum: "9,2 Nm (0,94 kgf.m) / 6.000 rpm",
            remDepan: "Cakram Hidrolik, Piston Tunggal",
            remBelakang: "Tromol (Combi Brake System)",
            rangka: "eSAF (enhanced Smart Architecture Frame)",
            tangkiBbm: "4,2 Liter"
        },
        warranty: {
            rangka: "5 Tahun tanpa batas jarak tempuh",
            mesin: "3 Tahun atau 36.000 km",
            injeksi: "5 Tahun atau 60.000 km",
            kelistrikan: "1 Tahun atau 12.000 km"
        },
        description: "Skutik kompak yang gesit dan irit bahan bakar untuk mobilitas harian di perkotaan."
    },
    {
        id: "honda-beat-deluxe-smartkey-2026",
        brand: "Honda",
        name: "Honda BeAT",
        variant: "Deluxe Smart Key",
        modelYear: 2026,
        category: "Matic",
        otrPrice: 20381000,
        priceStatus: "verified",
        priceLabel: "Harga OTR (Acuan DKI Jakarta)",
        priceSource: "PT Astra Honda Motor (astra-honda.com)",
        lastUpdated: "Januari 2026",
        minDp: 2500000,
        image: "ASET/IMAGES/beatkey/blue-key.jpeg",
        images: [
            "ASET/IMAGES/beatkey/bworn-key.jpeg",
            "ASET/IMAGES/beatkey/blue-key.jpeg",
            "ASET/IMAGES/beatkey/black-key.jpeg"
        ],
        colors: ["Deluxe Matte Brown", "Deluxe Matte Blue", "Deluxe Matte Black"],
        specs: {
            mesin: "4-Langkah, SOHC, eSP",
            kapasitas: "109,5 cc",
            suplaiBbm: "Injeksi (PGM-FI)",
            transmisi: "Otomatis, V-Matic",
            dayaMaksimum: "6,6 kW (9,0 PS) / 7.500 rpm",
            torsiMaksimum: "9,2 Nm (0,94 kgf.m) / 6.000 rpm",
            remDepan: "Cakram Hidrolik, Piston Tunggal",
            remBelakang: "Tromol (CBS + ISS)",
            rangka: "eSAF (enhanced Smart Architecture Frame)",
            tangkiBbm: "4,2 Liter"
        },
        warranty: {
            rangka: "5 Tahun tanpa batas jarak tempuh",
            mesin: "3 Tahun atau 36.000 km",
            injeksi: "5 Tahun atau 60.000 km",
            kelistrikan: "1 Tahun atau 12.000 km"
        },
        description: "Varian tertinggi Honda BeAT dengan warna matte eksklusif dan Honda Smart Key System."
    },
    {
        id: "honda-scoopy-fashion-2026",
        brand: "Honda",
        name: "Honda Scoopy",
        variant: "Fashion",
        modelYear: 2026,
        category: "Matic",
        otrPrice: 22876000,
        priceStatus: "verified",
        priceLabel: "Harga OTR (Acuan DKI Jakarta)",
        priceSource: "PT Astra Honda Motor (astra-honda.com)",
        lastUpdated: "Januari 2026",
        minDp: 2800000,
        image: "ASET/IMAGES/varian-warna-515x504-05-13112025-031217.webp",
        images: [
            "ASET/IMAGES/varian-warna-515x504-05-13112025-031217.webp",
            "ASET/IMAGES/varian-warna-515x504-04-13112025-031214.webp",
            "ASET/IMAGES/varian-warna-515x504-07-13112025-031223.webp",
            "ASET/IMAGES/varian-warna-515x504-06-13112025-031220.webp"
        ],
        colors: ["Fashion Blue", "Fashion Cream", "Fashion Red", "Fashion Black"],
        specs: {
            mesin: "4-Langkah, SOHC, eSP, Pendingin Udara",
            kapasitas: "109,5 cc",
            suplaiBbm: "Injeksi (PGM-FI)",
            transmisi: "Otomatis, V-Matic",
            dayaMaksimum: "6,6 kW (9,0 PS) / 7.500 rpm",
            torsiMaksimum: "9,2 Nm (0,94 kgf.m) / 6.000 rpm",
            remDepan: "Cakram Hidrolik, Piston Tunggal",
            remBelakang: "Tromol (Combi Brake System)",
            rangka: "eSAF (enhanced Smart Architecture Frame)",
            tangkiBbm: "4,2 Liter"
        },
        warranty: {
            rangka: "5 Tahun tanpa batas jarak tempuh",
            mesin: "3 Tahun atau 36.000 km",
            injeksi: "5 Tahun atau 60.000 km",
            kelistrikan: "1 Tahun atau 12.000 km"
        },
        description: "Skutik bergaya retro-modern yang ikonik dengan lampu depan LED Projector."
    },
    {
        id: "honda-genio-2026",
        brand: "Honda",
        name: "Honda Genio",
        variant: "CBS & ISS",
        modelYear: 2026,
        category: "Matic",
        otrPrice: 22876000,
        priceStatus: "verified",
        priceLabel: "Harga OTR (Acuan DKI Jakarta)",
        priceSource: "PT Astra Honda Motor (astra-honda.com)",
        lastUpdated: "Januari 2026",
        minDp: 2800000,
        image: "ASET/IMAGES/genio/varian-warna-515x504px-green-21052026-111936.webp",
        images: [
            "ASET/IMAGES/genio/varian-warna-515x504px-brown-21052026-111932.webp",
            "ASET/IMAGES/genio/varian-warna-515x504px-green-21052026-111936.webp",
            "ASET/IMAGES/genio/varian-warna-515x504px-black-21052026-111941.webp",
            "ASET/IMAGES/genio/07-varian-warna-04-29102025-031844.webp",
            "ASET/IMAGES/genio/07-varian-warna-05-29102025-031847.webp",
            "ASET/IMAGES/genio/07-varian-warna-06-29102025-031849.webp"
        ],
        colors: ["Fabulous Matte Brown", "Fabulous Matte Green", "Fabulous Matte Black", "Vibrant Tri-Tone", "Vibrant B&W", "Vibrant Black"],
        specs: {
            mesin: "4-Langkah, SOHC, eSP, Pendingin Udara",
            kapasitas: "109,5 cc",
            suplaiBbm: "Injeksi (PGM-FI)",
            transmisi: "Otomatis, V-Matic",
            dayaMaksimum: "6,6 kW (9,0 PS) / 7.500 rpm",
            torsiMaksimum: "9,3 Nm (0,95 kgf.m) / 5.500 rpm",
            remDepan: "Cakram Hidrolik, Piston Tunggal",
            remBelakang: "Tromol (Combi Brake System)",
            rangka: "eSAF (enhanced Smart Architecture Frame)",
            tangkiBbm: "4,2 Liter"
        },
        warranty: {
            rangka: "5 Tahun tanpa batas jarak tempuh",
            mesin: "3 Tahun atau 36.000 km",
            injeksi: "5 Tahun atau 60.000 km",
            kelistrikan: "1 Tahun atau 12.000 km"
        },
        description: "Eksis tanpa batas bareng Honda Genio. Skuter matik kasual yang gesit, irit, dan punya desain timeless. Pilihan tepat buat mobilitas harian anak muda urban."
    },
     {
        id: "honda-scoopy-prestige-2026",
        brand: "Honda",
        name: "Honda Scoopy",
        variant: "Prestige & Stylish",
        modelYear: 2026,
        category: "Matic",
        otrPrice: 22876000,
        priceStatus: "verified",
        priceLabel: "Harga OTR (Acuan DKI Jakarta)",
        priceSource: "PT Astra Honda Motor (astra-honda.com)",
        lastUpdated: "Januari 2026",
        minDp: 2800000,
        image: "ASET/IMAGES/varian-warna-515x504-10-13112025-031231.webp",
        images: [
            "ASET/IMAGES/varian-warna-515x504-10-13112025-031231.webp",
            "ASET/IMAGES/varian-warna-515x504-09-13112025-031228.webp",
            "ASET/IMAGES/varian-warna-515x504-08-13112025-031225.webp",
            "ASET/IMAGES/varian-warna-515x504-02-13112025-031208.webp",
            "ASET/IMAGES/varian-warna-515x504-01-13112025-031205.webp",
            "ASET/IMAGES/varian-warna-515x504-03-13112025-031211.webp"
        ],
        colors: ["Prestige Red", "Prestige Black", "Prestige White", "Stylish Green", "Stylish Grey", "Stylish Beige"],
        specs: {
            mesin: "4-Langkah, SOHC, eSP, Pendingin Udara",
            kapasitas: "109,5 cc",
            suplaiBbm: "Injeksi (PGM-FI)",
            transmisi: "Otomatis, V-Matic",
            dayaMaksimum: "6,6 kW (9,0 PS) / 7.500 rpm",
            torsiMaksimum: "9,2 Nm (0,94 kgf.m) / 6.000 rpm",
            remDepan: "Cakram Hidrolik, Piston Tunggal",
            remBelakang: "Tromol (Combi Brake System)",
            rangka: "eSAF (enhanced Smart Architecture Frame)",
            tangkiBbm: "4,2 Liter"
        },
        warranty: {
            rangka: "5 Tahun tanpa batas jarak tempuh",
            mesin: "3 Tahun atau 36.000 km",
            injeksi: "5 Tahun atau 60.000 km",
            kelistrikan: "1 Tahun atau 12.000 km"
        },
        description: "Skutik bergaya retro-modern yang ikonik dengan lampu depan LED Projector."
    },
    {
        id: "honda-vario-125-&-Street-2026",
        brand: "Honda",
        name: "Honda Vario",
        variant: "125 & Street",
        modelYear: 2026,
        category: "Matic",
        otrPrice: 24410000,
        priceStatus: "verified",
        priceLabel: "Harga OTR (Acuan DKI Jakarta)",
        priceSource: "PT Astra Honda Motor (astra-honda.com)",
        lastUpdated: "Januari 2026",
        minDp: 3000000,
        image: "ASET/IMAGES/vario/varian-warna-9-1-05122025-011001.webp",
        images: [
            "ASET/IMAGES/vario/mint.png",
            "ASET/IMAGES/vario/image.png",
            "ASET/IMAGES/vario/varian-warna-9-1-05122025-011001.webp"
        ],
        colors: ["Sporty Mint", "Sporty Red", "Sporty Black"],
        specs: {
            mesin: "4-Langkah, SOHC, eSP, Pendinginan Cairan",
            kapasitas: "124,8 cc",
            suplaiBbm: "Injeksi (PGM-FI)",
            transmisi: "Otomatis, V-Matic",
            dayaMaksimum: "8,2 kW (11,1 PS) / 8.500 rpm",
            torsiMaksimum: "10,8 Nm (1,1 kgf.m) / 5.000 rpm",
            remDepan: "Wavy Disc Brake",
            remBelakang: "Tromol (Combi Brake System)",
            rangka: "Underbone",
            tangkiBbm: "5,5 Liter"
        },
        warranty: {
            rangka: "5 Tahun tanpa batas jarak tempuh",
            mesin: "3 Tahun atau 36.000 km",
            injeksi: "5 Tahun atau 60.000 km",
            kelistrikan: "1 Tahun atau 12.000 km"
        },
        description: "Skutik sporty berkapasitas 125cc dengan pendingin cairan (liquid-cooled)."
    },
    {
        id: "honda-pcx-160-cbs-2026",
        brand: "Honda",
        name: "Honda PCX",
        variant: "160",
        modelYear: 2026,
        category: "Matic",
        otrPrice: 34350000,
        priceStatus: "verified",
        priceLabel: "Harga OTR (Acuan DKI Jakarta)",
        priceSource: "PT Astra Honda Motor (astra-honda.com)",
        lastUpdated: "Januari 2026",
        minDp: 4200000,
        image: "ASET/IMAGES/pcx/varian-warna-515x504-05-3-11022026-055545.webp",
        images: [
            "ASET/IMAGES/pcx/white.png",
            "ASET/IMAGES/pcx/silver.png",
            "ASET/IMAGES/pcx/varian-warna-515x504-05-3-11022026-055545.webp",
            "ASET/IMAGES/pcx/image.png"
        ],
        colors: ["Exceptional White", "Exceptional Matte Silver", "Exceptional Red", "Exceptional Black"],
        specs: {
            mesin: "4-Langkah, 4-Katup, eSP+, Pendingin Cairan",
            kapasitas: "156,9 cc",
            suplaiBbm: "Injeksi (PGM-FI)",
            transmisi: "Otomatis, V-Matic",
            dayaMaksimum: "11,8 kW (16,0 PS) / 8.500 rpm",
            torsiMaksimum: "14,7 Nm (1,5 kgf.m) / 6.500 rpm",
            remDepan: "Cakram Hidrolik",
            remBelakang: "Cakram Hidrolik",
            rangka: "Double Cradle",
            tangkiBbm: "8,1 Liter"
        },
        warranty: {
            rangka: "5 Tahun tanpa batas jarak tempuh",
            mesin: "3 Tahun atau 36.000 km",
            injeksi: "5 Tahun atau 60.000 km",
            kelistrikan: "1 Tahun atau 12.000 km"
        },
        description: "Big scooter premium dengan mesin generasi terbaru 160cc 4-katup eSP+."
    }
];