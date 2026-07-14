// Database wilayah administratif Indonesia (38 Provinsi, Kota/Kabupaten Utama, dan Kecamatan)

export interface Province {
  province_id: string;
  province: string;
}

export interface City {
  city_id: string;
  province_id: string;
  province: string;
  type: string;
  city_name: string;
  postal_code: string;
}

export const PROVINCES: Province[] = [
  { province_id: "1", province: "Bali" },
  { province_id: "2", province: "Bangka Belitung" },
  { province_id: "3", province: "Banten" },
  { province_id: "4", province: "Bengkulu" },
  { province_id: "5", province: "DI Yogyakarta" },
  { province_id: "6", province: "DKI Jakarta" },
  { province_id: "7", province: "Gorontalo" },
  { province_id: "8", province: "Jambi" },
  { province_id: "9", province: "Jawa Barat" },
  { province_id: "10", province: "Jawa Tengah" },
  { province_id: "11", province: "Jawa Timur" },
  { province_id: "12", province: "Kalimantan Barat" },
  { province_id: "13", province: "Kalimantan Selatan" },
  { province_id: "14", province: "Kalimantan Tengah" },
  { province_id: "15", province: "Kalimantan Timur" },
  { province_id: "16", province: "Kalimantan Utara" },
  { province_id: "17", province: "Kepulauan Riau" },
  { province_id: "18", province: "Lampung" },
  { province_id: "19", province: "Maluku" },
  { province_id: "20", province: "Maluku Utara" },
  { province_id: "21", province: "Nusa Tenggara Barat" },
  { province_id: "22", province: "Nusa Tenggara Timur" },
  { province_id: "23", province: "Papua" },
  { province_id: "24", province: "Papua Barat" },
  { province_id: "25", province: "Papua Barat Daya" },
  { province_id: "26", province: "Papua Pegunungan" },
  { province_id: "27", province: "Papua Selatan" },
  { province_id: "28", province: "Papua Tengah" },
  { province_id: "29", province: "Riau" },
  { province_id: "30", province: "Sulawesi Barat" },
  { province_id: "31", province: "Sulawesi Selatan" },
  { province_id: "32", province: "Sulawesi Tengah" },
  { province_id: "33", province: "Sulawesi Tenggara" },
  { province_id: "34", province: "Sulawesi Utara" },
  { province_id: "35", province: "Sumatera Barat" },
  { province_id: "36", province: "Sumatera Selatan" },
  { province_id: "37", province: "Sumatera Utara" },
  { province_id: "38", province: "Aceh" }
];

export const CITIES: Record<string, City[]> = {
  // Bali
  "1": [
    { city_id: "101", province_id: "1", province: "Bali", type: "Kota", city_name: "Denpasar", postal_code: "80234" },
    { city_id: "102", province_id: "1", province: "Bali", type: "Kabupaten", city_name: "Badung", postal_code: "80361" },
    { city_id: "103", province_id: "1", province: "Bali", type: "Kabupaten", city_name: "Gianyar", postal_code: "80511" },
  ],
  // Bangka Belitung
  "2": [
    { city_id: "201", province_id: "2", province: "Bangka Belitung", type: "Kota", city_name: "Pangkal Pinang", postal_code: "33115" },
  ],
  // Banten
  "3": [
    { city_id: "301", province_id: "3", province: "Banten", type: "Kota", city_name: "Tangerang", postal_code: "15111" },
    { city_id: "302", province_id: "3", province: "Banten", type: "Kota", city_name: "Tangerang Selatan", postal_code: "15310" },
    { city_id: "303", province_id: "3", province: "Banten", type: "Kota", city_name: "Serang", postal_code: "42111" },
    { city_id: "304", province_id: "3", province: "Banten", type: "Kota", city_name: "Cilegon", postal_code: "42411" },
  ],
  // Bengkulu
  "4": [
    { city_id: "401", province_id: "4", province: "Bengkulu", type: "Kota", city_name: "Bengkulu", postal_code: "38119" },
  ],
  // DI Yogyakarta
  "5": [
    { city_id: "501", province_id: "5", province: "DI Yogyakarta", type: "Kota", city_name: "Yogyakarta", postal_code: "55111" },
    { city_id: "502", province_id: "5", province: "DI Yogyakarta", type: "Kabupaten", city_name: "Sleman", postal_code: "55511" },
    { city_id: "503", province_id: "5", province: "DI Yogyakarta", type: "Kabupaten", city_name: "Bantul", postal_code: "55711" },
  ],
  // DKI Jakarta
  "6": [
    { city_id: "601", province_id: "6", province: "DKI Jakarta", type: "Kota", city_name: "Jakarta Selatan", postal_code: "12190" },
    { city_id: "602", province_id: "6", province: "DKI Jakarta", type: "Kota", city_name: "Jakarta Pusat", postal_code: "10110" },
    { city_id: "603", province_id: "6", province: "DKI Jakarta", type: "Kota", city_name: "Jakarta Barat", postal_code: "11820" },
    { city_id: "604", province_id: "6", province: "DKI Jakarta", type: "Kota", city_name: "Jakarta Timur", postal_code: "13320" },
    { city_id: "605", province_id: "6", province: "DKI Jakarta", type: "Kota", city_name: "Jakarta Utara", postal_code: "14110" },
  ],
  // Gorontalo
  "7": [
    { city_id: "701", province_id: "7", province: "Gorontalo", type: "Kota", city_name: "Gorontalo", postal_code: "96115" },
  ],
  // Jambi
  "8": [
    { city_id: "801", province_id: "8", province: "Jambi", type: "Kota", city_name: "Jambi", postal_code: "36111" },
  ],
  // Jawa Barat
  "9": [
    { city_id: "901", province_id: "9", province: "Jawa Barat", type: "Kota", city_name: "Bandung", postal_code: "40111" },
    { city_id: "902", province_id: "9", province: "Jawa Barat", type: "Kota", city_name: "Bekasi", postal_code: "17121" },
    { city_id: "903", province_id: "9", province: "Jawa Barat", type: "Kota", city_name: "Depok", postal_code: "16411" },
    { city_id: "904", province_id: "9", province: "Jawa Barat", type: "Kota", city_name: "Bogor", postal_code: "16119" },
    { city_id: "905", province_id: "9", province: "Jawa Barat", type: "Kota", city_name: "Tasikmalaya", postal_code: "46111" },
    { city_id: "906", province_id: "9", province: "Jawa Barat", type: "Kota", city_name: "Cirebon", postal_code: "45111" },
  ],
  // Jawa Tengah
  "10": [
    { city_id: "1001", province_id: "10", province: "Jawa Tengah", type: "Kota", city_name: "Semarang", postal_code: "50125" },
    { city_id: "1002", province_id: "10", province: "Jawa Tengah", type: "Kota", city_name: "Surakarta (Solo)", postal_code: "57112" },
    { city_id: "1003", province_id: "10", province: "Jawa Tengah", type: "Kota", city_name: "Magelang", postal_code: "56111" },
    { city_id: "1004", province_id: "10", province: "Jawa Tengah", type: "Kota", city_name: "Pekalongan", postal_code: "51111" },
  ],
  // Jawa Timur
  "11": [
    { city_id: "1101", province_id: "11", province: "Jawa Timur", type: "Kota", city_name: "Surabaya", postal_code: "60111" },
    { city_id: "1102", province_id: "11", province: "Jawa Timur", type: "Kota", city_name: "Malang", postal_code: "65111" },
    { city_id: "1103", province_id: "11", province: "Jawa Timur", type: "Kota", city_name: "Kediri", postal_code: "64111" },
    { city_id: "1104", province_id: "11", province: "Jawa Timur", type: "Kota", city_name: "Madiun", postal_code: "63111" },
  ],
  // Kalimantan Barat
  "12": [
    { city_id: "1201", province_id: "12", province: "Kalimantan Barat", type: "Kota", city_name: "Pontianak", postal_code: "78111" },
  ],
  // Kalimantan Selatan
  "13": [
    { city_id: "1301", province_id: "13", province: "Kalimantan Selatan", type: "Kota", city_name: "Banjarmasin", postal_code: "70111" },
  ],
  // Kalimantan Tengah
  "14": [
    { city_id: "1401", province_id: "14", province: "Kalimantan Tengah", type: "Kota", city_name: "Palangkaraya", postal_code: "73111" },
  ],
  // Kalimantan Timur
  "15": [
    { city_id: "1501", province_id: "15", province: "Kalimantan Timur", type: "Kota", city_name: "Samarinda", postal_code: "75111" },
    { city_id: "1502", province_id: "15", province: "Kalimantan Timur", type: "Kota", city_name: "Balikpapan", postal_code: "76111" },
  ],
  // Kalimantan Utara
  "16": [
    { city_id: "1601", province_id: "16", province: "Kalimantan Utara", type: "Kota", city_name: "Tarakan", postal_code: "77111" },
  ],
  // Kepulauan Riau
  "17": [
    { city_id: "1701", province_id: "17", province: "Kepulauan Riau", type: "Kota", city_name: "Batam", postal_code: "29411" },
    { city_id: "1702", province_id: "17", province: "Kepulauan Riau", type: "Kota", city_name: "Tanjung Pinang", postal_code: "29111" },
  ],
  // Lampung
  "18": [
    { city_id: "1801", province_id: "18", province: "Lampung", type: "Kota", city_name: "Bandar Lampung", postal_code: "35111" },
  ],
  // Maluku
  "19": [
    { city_id: "1901", province_id: "19", province: "Maluku", type: "Kota", city_name: "Ambon", postal_code: "97111" },
  ],
  // Maluku Utara
  "20": [
    { city_id: "2001", province_id: "20", province: "Maluku Utara", type: "Kota", city_name: "Ternate", postal_code: "97711" },
  ],
  // Nusa Tenggara Barat
  "21": [
    { city_id: "2101", province_id: "21", province: "Nusa Tenggara Barat", type: "Kota", city_name: "Mataram", postal_code: "83111" },
  ],
  // Nusa Tenggara Timur
  "22": [
    { city_id: "2201", province_id: "22", province: "Nusa Tenggara Timur", type: "Kota", city_name: "Kupang", postal_code: "85111" },
  ],
  // Papua
  "23": [
    { city_id: "2301", province_id: "23", province: "Papua", type: "Kota", city_name: "Jayapura", postal_code: "99111" },
  ],
  // Papua Barat
  "24": [
    { city_id: "2401", province_id: "24", province: "Papua Barat", type: "Kabupaten", city_name: "Manokwari", postal_code: "98311" },
  ],
  // Papua Barat Daya
  "25": [
    { city_id: "2501", province_id: "25", province: "Papua Barat Daya", type: "Kota", city_name: "Sorong", postal_code: "98411" },
  ],
  // Papua Pegunungan
  "26": [
    { city_id: "2601", province_id: "26", province: "Papua Pegunungan", type: "Kabupaten", city_name: "Jayawijaya (Wamena)", postal_code: "99511" },
  ],
  // Papua Selatan
  "27": [
    { city_id: "2701", province_id: "27", province: "Papua Selatan", type: "Kabupaten", city_name: "Merauke", postal_code: "99611" },
  ],
  // Papua Tengah
  "28": [
    { city_id: "2801", province_id: "28", province: "Papua Tengah", type: "Kabupaten", city_name: "Nabire", postal_code: "98811" },
  ],
  // Riau
  "29": [
    { city_id: "2901", province_id: "29", province: "Riau", type: "Kota", city_name: "Pekanbaru", postal_code: "28111" },
    { city_id: "2902", province_id: "29", province: "Riau", type: "Kota", city_name: "Dumai", postal_code: "28811" },
  ],
  // Sulawesi Barat
  "30": [
    { city_id: "3001", province_id: "30", province: "Sulawesi Barat", type: "Kabupaten", city_name: "Mamuju", postal_code: "91511" },
  ],
  // Sulawesi Selatan
  "31": [
    { city_id: "3101", province_id: "31", province: "Sulawesi Selatan", type: "Kota", city_name: "Makassar", postal_code: "90111" },
    { city_id: "3102", province_id: "31", province: "Sulawesi Selatan", type: "Kota", city_name: "Parepare", postal_code: "91111" },
  ],
  // Sulawesi Tengah
  "32": [
    { city_id: "3201", province_id: "32", province: "Sulawesi Tengah", type: "Kota", city_name: "Palu", postal_code: "94111" },
  ],
  // Sulawesi Tenggara
  "33": [
    { city_id: "3301", province_id: "33", province: "Sulawesi Tenggara", type: "Kota", city_name: "Kendari", postal_code: "93111" },
  ],
  // Sulawesi Utara
  "34": [
    { city_id: "3401", province_id: "34", province: "Sulawesi Utara", type: "Kota", city_name: "Manado", postal_code: "95111" },
  ],
  // Sumatera Barat
  "35": [
    { city_id: "3501", province_id: "35", province: "Sumatera Barat", type: "Kota", city_name: "Padang", postal_code: "25111" },
    { city_id: "3502", province_id: "35", province: "Sumatera Barat", type: "Kota", city_name: "Bukittinggi", postal_code: "26111" },
  ],
  // Sumatera Selatan
  "36": [
    { city_id: "3601", province_id: "36", province: "Sumatera Selatan", type: "Kota", city_name: "Palembang", postal_code: "30111" },
  ],
  // Sumatera Utara
  "37": [
    { city_id: "3701", province_id: "37", province: "Sumatera Utara", type: "Kota", city_name: "Medan", postal_code: "20111" },
    { city_id: "3702", province_id: "37", province: "Sumatera Utara", type: "Kota", city_name: "Binjai", postal_code: "20711" },
  ],
  // Aceh
  "38": [
    { city_id: "3801", province_id: "38", province: "Aceh", type: "Kota", city_name: "Banda Aceh", postal_code: "23111" },
  ]
};

export const DISTRICTS: Record<string, string[]> = {
  // Denpasar
  "101": ["Denpasar Barat", "Denpasar Selatan", "Denpasar Timur", "Denpasar Utara"],
  "102": ["Kuta", "Kuta Utara", "Kuta Selatan", "Mengwi", "Abiansemal"],
  "103": ["Ubud", "Sukawati", "Tampak Siring", "Gianyar", "Blahbatuh"],
  // Pangkal Pinang
  "201": ["Bukit Intan", "Gerunggang", "Pangkal Balam", "Rangkui", "Taman Sari"],
  // Tangerang / Tangsel
  "301": ["Cipondoh", "Ciledug", "Karawaci", "Tangerang", "Batuceper", "Jatiuwung"],
  "302": ["Serpong", "Serpong Utara", "Ciputat", "Ciputat Timur", "Pamulang", "Pondok Aren", "Setu"],
  "303": ["Serang", "Cipocok Jaya", "Kasemen", "Taktakan", "Curug", "Walantaka"],
  "304": ["Cilegon", "Cibeber", "Citangkil", "Ciwandan", "Gerem", "Pulomerak"],
  // Bengkulu
  "401": ["Gading Cempaka", "Muara Bangka Hulu", "Ratu Agung", "Ratu Samban", "Teluk Segara"],
  // Yogyakarta / Sleman / Bantul
  "501": ["Mantinegaran", "Gondokusuman", "Malioboro", "Kotagede", "Umbulharjo", "Danurejan"],
  "502": ["Depok", "Mlati", "Gamping", "Kalasan", "Ngaglik", "Cangkringan"],
  "503": ["Banguntapan", "Sewon", "Kasihan", "Bantul", "Imogiri"],
  // Jakarta
  "601": ["Kebayoran Baru", "Kebayoran Lama", "Cilandak", "Pasar Minggu", "Tebet", "Setiabudi", "Pancoran", "Jagakarsa", "Mampang Prapatan", "Pesanggrahan"],
  "602": ["Menteng", "Tanah Abang", "Gambir", "Senen", "Kemayoran", "Sawah Besar", "Cempaka Putih", "Johar Baru"],
  "603": ["Kembangan", "Kebon Jeruk", "Palmerah", "Grogol Petamburan", "Cengkareng", "Kalideres", "Tambora", "Taman Sari"],
  "604": ["Jatinegara", "Duren Sawit", "Pulogadung", "Cakung", "Kramat Jati", "Makasar", "Ciracas", "Pasar Rebo"],
  "605": ["Penjaringan", "Tanjung Priok", "Kelapa Gading", "Koja", "Pademangan", "Cilincing"],
  // Gorontalo
  "701": ["Kota Selatan", "Kota Utara", "Kota Barat", "Kota Timur", "Dumbo Raya"],
  // Jambi
  "801": ["Danau Teluk", "Jambi Selatan", "Jambi Timur", "Pasar Jambi", "Telanaipura"],
  // Bandung / Bekasi / Depok / Bogor
  "901": ["Coblong", "Dago", "Cibeunying", "Sumur Bandung", "Lengkong", "Regol", "Astanaanyar"],
  "902": ["Bekasi Barat", "Bekasi Timur", "Bekasi Utara", "Bekasi Selatan", "Pondok Gede", "Jatiasih"],
  "903": ["Margonda", "Beji", "Pancoran Mas", "Sukmajaya", "Cimanggis", "Sawangan", "Limo"],
  "904": ["Bogor Timur", "Bogor Barat", "Bogor Tengah", "Bogor Selatan", "Bogor Utara", "Tanah Sareal"],
  "905": ["Cihideung", "Cipedes", "Indihiang", "Kawalu", "Mangkubumi"],
  "906": ["Harjamukti", "Kejaksan", "Kesambi", "Lemahwungkuk", "Pekalipan"],
  // Semarang / Solo / Magelang / Pekalongan
  "1001": ["Semarang Tengah", "Semarang Barat", "Semarang Timur", "Semarang Selatan", "Semarang Utara"],
  "1002": ["Laweyan", "Banjarsari", "Pasar Kliwon", "Jebres", "Serengan"],
  "1003": ["Magelang Selatan", "Magelang Tengah", "Magelang Utara"],
  "1004": ["Pekalongan Barat", "Pekalongan Selatan", "Pekalongan Timur", "Pekalongan Utara"],
  // Surabaya / Malang / Kediri / Madiun
  "1101": ["Tegalsari", "Genteng", "Bubutan", "Simokerto", "Gubeng", "Wonokromo", "Sukolilo", "Rungkut"],
  "1102": ["Klojen", "Blimbing", "Lowokwaru", "Sukun", "Kedungkandang"],
  "1103": ["Kota", "Mojoroto", "Pesantren"],
  "1104": ["Kartoharjo", "Manguharjo", "Taman"],
  // Pontianak
  "1201": ["Pontianak Kota", "Pontianak Barat", "Pontianak Selatan", "Pontianak Tenggara", "Pontianak Timur"],
  // Banjarmasin
  "1301": ["Banjarmasin Barat", "Banjarmasin Selatan", "Banjarmasin Tengah", "Banjarmasin Timur", "Banjarmasin Utara"],
  // Palangkaraya
  "1401": ["Bukit Batu", "Jekan Raya", "Pahandut", "Sabangau"],
  // Samarinda / Balikpapan
  "1501": ["Samarinda Ulu", "Samarinda Ilir", "Samarinda Kota", "Samarinda Utara", "Palaran"],
  "1502": ["Balikpapan Kota", "Balikpapan Barat", "Balikpapan Selatan", "Balikpapan Tengah", "Balikpapan Utara"],
  // Tarakan
  "1601": ["Tarakan Barat", "Tarakan Tengah", "Tarakan Timur", "Tarakan Utara"],
  // Batam / Tanjung Pinang
  "1701": ["Batam Kota", "Lubuk Baja", "Batu Ampar", "Sekupang", "Nongsa", "Sagulung"],
  "1702": ["Tanjung Pinang Barat", "Tanjung Pinang Kota", "Tanjung Pinang Timur", "Bukit Bestari"],
  // Bandar Lampung
  "1801": ["Kedaton", "Rajabasa", "Tanjung Karang Pusat", "Tanjung Karang Timur", "Teluk Betung Utara"],
  // Ambon
  "1901": ["Leitimur", "Nusaniwe", "Sirimau", "Teluk Ambon"],
  // Ternate
  "2001": ["Ternate Selatan", "Ternate Tengah", "Ternate Utara", "Pulau Ternate"],
  // Mataram
  "2101": ["Ampenan", "Cakranegara", "Mataram", "Sandi Jaya", "Selaparang"],
  // Kupang
  "2201": ["Alak", "Kelapa Lima", "Kota Raja", "Maulafa", "Oebobo"],
  // Jayapura
  "2301": ["Abepura", "Heram", "Jayapura Selatan", "Jayapura Utara", "Muara Tami"],
  // Manokwari
  "2401": ["Manokwari Barat", "Manokwari Selatan", "Manokwari Timur", "Manokwari Utara"],
  // Sorong
  "2501": ["Sorong Barat", "Sorong Kota", "Sorong Manoi", "Sorong Timur", "Sorong Utara"],
  // Wamena
  "2601": ["Wamena", "Asolokobal", "Hubikiato", "Pelebaga", "Wosilimo"],
  // Merauke
  "2701": ["Merauke", "Kimaam", "Muting", "Okaba", "Sota"],
  // Nabire
  "2801": ["Nabire", "Makimi", "Siriwo", "Teluk Kimi", "Yaro"],
  // Pekanbaru / Dumai
  "2901": ["Bukit Raya", "Lima Puluh", "Payung Sekaki", "Pekanbaru Kota", "Senapelan", "Tampan"],
  "2902": ["Dumai Barat", "Dumai Kota", "Dumai Selatan", "Dumai Timur", "Medang Kampai"],
  // Mamuju
  "3001": ["Mamuju", "Kalukku", "Simboro", "Tapalang"],
  // Makassar / Parepare
  "3101": ["Biringkanaya", "Manggala", "Panakkukang", "Rappocini", "Tamalate", "Ujung Pandang"],
  "3102": ["Bacukiki", "Soreang", "Ujung"],
  // Palu
  "3201": ["Palu Barat", "Palu Selatan", "Palu Timur", "Palu Utara", "Mantikulore"],
  // Kendari
  "3301": ["Kadia", "Kambu", "Kendari", "Kendari Barat", "Mandonga", "Poasia"],
  // Manado
  "3401": ["Bunaken", "Malalayang", "Mapanget", "Sario", "Tikala", "Wanea"],
  // Padang / Bukittinggi
  "3501": ["Padang Barat", "Padang Selatan", "Padang Timur", "Padang Utara", "Koto Tangah"],
  "3502": ["Guguk Panjang", "Aur Birugo Tigo Baleh", "Mandiangin Koto Selayan"],
  // Palembang
  "3601": ["Alang-Alang Lebar", "Bukit Kecil", "Ilir Timur I", "Ilir Timur II", "Sako", "Sukarami"],
  // Medan / Binjai
  "3701": ["Medan Baru", "Medan Selayang", "Medan Sunggal", "Medan Johor", "Medan Kota", "Medan Petisah"],
  "3702": ["Binjai Barat", "Binjai Kota", "Binjai Selatan", "Binjai Timur", "Binjai Utara"],
  // Banda Aceh
  "3801": ["Baiturrahman", "Kuta Alam", "Meuraxa", "Syiah Kuala", "Ulee Kareng"]
};
