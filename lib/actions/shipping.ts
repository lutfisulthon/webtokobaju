"use server";

const RAJAONGKIR_API_KEY = process.env.RAJAONGKIR_API_KEY;
const RAJAONGKIR_BASE_URL = "https://api.rajaongkir.com/starter"; // starter/basic API

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

export interface CostDetails {
  value: number;
  etd: string;
  note: string;
}

export interface CostOption {
  service: string;
  description: string;
  cost: CostDetails[];
}

export interface ShippingCourierResult {
  code: string;
  name: string;
  costs: CostOption[];
}

// Mock Data for offline testing
const MOCK_PROVINCES: Province[] = [
  { province_id: "9", province: "DKI Jakarta" },
  { province_id: "11", province: "Jawa Barat" },
  { province_id: "12", province: "Jawa Tengah" },
  { province_id: "15", province: "Jawa Timur" },
  { province_id: "34", province: "Sumatera Utara" },
];

const MOCK_CITIES: Record<string, City[]> = {
  "9": [
    { city_id: "151", province_id: "9", province: "DKI Jakarta", type: "Kota", city_name: "Jakarta Barat", postal_code: "11820" },
    { city_id: "152", province_id: "9", province: "DKI Jakarta", type: "Kota", city_name: "Jakarta Pusat", postal_code: "10110" },
    { city_id: "153", province_id: "9", province: "DKI Jakarta", type: "Kota", city_name: "Jakarta Selatan", postal_code: "12190" },
    { city_id: "154", province_id: "9", province: "DKI Jakarta", type: "Kota", city_name: "Jakarta Timur", postal_code: "13320" },
  ],
  "11": [
    { city_id: "23", province_id: "11", province: "Jawa Barat", type: "Kota", city_name: "Bandung", postal_code: "40111" },
    { city_id: "54", province_id: "11", province: "Jawa Barat", type: "Kota", city_name: "Bekasi", postal_code: "17121" },
    { city_id: "78", province_id: "11", province: "Jawa Barat", type: "Kota", city_name: "Bogor", postal_code: "16119" },
  ],
  "12": [
    { city_id: "399", province_id: "12", province: "Jawa Tengah", type: "Kota", city_name: "Semarang", postal_code: "50125" },
    { city_id: "427", province_id: "12", province: "Jawa Tengah", type: "Kota", city_name: "Surakarta (Solo)", postal_code: "57112" },
  ],
  "15": [
    { city_id: "256", province_id: "15", province: "Jawa Timur", type: "Kota", city_name: "Malang", postal_code: "65111" },
    { city_id: "444", province_id: "15", province: "Jawa Timur", type: "Kota", city_name: "Surabaya", postal_code: "60111" },
  ],
  "34": [
    { city_id: "278", province_id: "34", province: "Sumatera Utara", type: "Kota", city_name: "Medan", postal_code: "20111" },
  ],
};

const MOCK_COSTS: Record<string, Record<string, number>> = {
  // From origin (e.g. Jakarta/153) to destination
  "151": { jne: 9000, jnt: 8000, sicepat: 9000 },
  "152": { jne: 9000, jnt: 8000, sicepat: 9000 },
  "153": { jne: 9000, jnt: 8000, sicepat: 9000 },
  "154": { jne: 9000, jnt: 8000, sicepat: 9000 },
  "23": { jne: 12000, jnt: 11000, sicepat: 12000 },
  "54": { jne: 10000, jnt: 9000, sicepat: 10000 },
  "78": { jne: 11000, jnt: 10000, sicepat: 11000 },
  "399": { jne: 19000, jnt: 18000, sicepat: 19000 },
  "427": { jne: 19000, jnt: 18000, sicepat: 19000 },
  "256": { jne: 22000, jnt: 21000, sicepat: 22000 },
  "444": { jne: 21000, jnt: 20000, sicepat: 21000 },
  "278": { jne: 32000, jnt: 30000, sicepat: 32000 },
};

export async function getProvinces(): Promise<Province[]> {
  if (!RAJAONGKIR_API_KEY) {
    console.log("RajaOngkir API Key not found, using Mock Provinces");
    return MOCK_PROVINCES;
  }

  try {
    const res = await fetch(`${RAJAONGKIR_BASE_URL}/province`, {
      headers: {
        key: RAJAONGKIR_API_KEY,
      },
      next: { revalidate: 86400 }, // Cache 1 day
    });

    if (!res.ok) throw new Error("Failed to fetch provinces");
    const data = await res.json();
    return data.rajaongkir.results;
  } catch (error) {
    console.error("Error fetching RajaOngkir provinces, falling back to mock:", error);
    return MOCK_PROVINCES;
  }
}

export async function getCities(provinceId: string): Promise<City[]> {
  if (!RAJAONGKIR_API_KEY) {
    console.log("RajaOngkir API Key not found, using Mock Cities for provinceId", provinceId);
    return MOCK_CITIES[provinceId] || [];
  }

  try {
    const res = await fetch(`${RAJAONGKIR_BASE_URL}/city?province=${provinceId}`, {
      headers: {
        key: RAJAONGKIR_API_KEY,
      },
      next: { revalidate: 86400 },
    });

    if (!res.ok) throw new Error("Failed to fetch cities");
    const data = await res.json();
    return data.rajaongkir.results;
  } catch (error) {
    console.error(`Error fetching RajaOngkir cities for province ${provinceId}, falling back to mock:`, error);
    return MOCK_CITIES[provinceId] || [];
  }
}

export async function getShippingCost(
  destinationCityId: string,
  weight: number = 1000, // weight in grams
  courier: "jne" | "pos" | "tiki" = "jne"
): Promise<ShippingCourierResult[]> {
  // Default origin is Jakarta Selatan (city_id: 153)
  const originCityId = "153"; 

  if (!RAJAONGKIR_API_KEY) {
    console.log("RajaOngkir API Key not found, simulating cost for destinationCityId", destinationCityId);
    
    // Simulate cost calculation
    const baseRate = MOCK_COSTS[destinationCityId]?.[courier] || 15000;
    const weightKg = Math.ceil(weight / 1000);
    const costValue = baseRate * weightKg;

    return [
      {
        code: courier,
        name: courier === "jne" ? "Jalur Nugraha Ekakurir (JNE)" : courier === "pos" ? "POS Indonesia" : "Titipan Kilat (TIKI)",
        costs: [
          {
            service: "REG",
            description: "Layanan Reguler",
            cost: [
              {
                value: costValue,
                etd: "2-3 Hari",
                note: "",
              },
            ],
          },
          {
            service: "OKE",
            description: "Ongkos Kirim Ekonomis",
            cost: [
              {
                value: Math.max(costValue - 3000, 5000),
                etd: "3-5 Hari",
                note: "",
              },
            ],
          },
        ],
      },
    ];
  }

  try {
    const res = await fetch(`${RAJAONGKIR_BASE_URL}/cost`, {
      method: "POST",
      headers: {
        key: RAJAONGKIR_API_KEY,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        origin: originCityId,
        destination: destinationCityId,
        weight: weight,
        courier: courier,
      }),
    });

    if (!res.ok) throw new Error("Failed to fetch shipping costs");
    const data = await res.json();
    
    // API returns data.rajaongkir.results as array of couriers
    return data.rajaongkir.results;
  } catch (error) {
    console.error("Error fetching RajaOngkir shipping cost, falling back to mock:", error);
    
    const baseRate = MOCK_COSTS[destinationCityId]?.[courier] || 15000;
    const weightKg = Math.ceil(weight / 1000);
    const costValue = baseRate * weightKg;

    return [
      {
        code: courier,
        name: courier.toUpperCase(),
        costs: [
          {
            service: "REG",
            description: "Regular Service (Mock)",
            cost: [
              {
                value: costValue,
                etd: "2-3",
                note: "",
              },
            ],
          },
        ],
      },
    ];
  }
}
