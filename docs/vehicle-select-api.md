# Vehicle Select API Dokümantasyonu

Bu dokümantasyon, araç seçimi için API endpointlerini detaylandırır. Tüm isteklerde JWT yetkilendirmesi gereklidir.

## Temel URL

```
/vehicle-select
```

## Endpointler

### 1. Araç Markalarını Listeleme

Sistemde kayıtlı tüm araç markalarını alfabetik sıralamayla getirir.

**URL:** `GET /vehicle-select/brands`

**Yetkilendirme:** JWT Token gerekli

**Başarılı Yanıt:**
```json
[
  {
    "id": "1",
    "name": "Audi"
  },
  {
    "id": "2",
    "name": "BMW"
  },
  {
    "id": "3",
    "name": "Mercedes"
  }
]
```

**Hata Yanıtları:**
- `401 Unauthorized`: Geçersiz veya eksik yetkilendirme
- `500 Internal Server Error`: Sunucu hatası

### 2. Markaya Göre Modelleri Listeleme

Belirli bir araç markasına ait tüm modelleri alfabetik sıralamayla getirir.

**URL:** `GET /vehicle-select/brands/:brandId/models`

**Parametreler:**
- `brandId` (path): Marka ID değeri

**Yetkilendirme:** JWT Token gerekli

**Başarılı Yanıt:**
```json
[
  {
    "id": "1",
    "name": "A3",
    "brand_id": "1"
  },
  {
    "id": "2",
    "name": "A4",
    "brand_id": "1"
  },
  {
    "id": "3",
    "name": "Q5",
    "brand_id": "1"
  }
]
```

**Hata Yanıtları:**
- `401 Unauthorized`: Geçersiz veya eksik yetkilendirme
- `500 Internal Server Error`: Sunucu hatası

### 3. Modele Göre Üretim Yıllarını Listeleme

Belirli bir araç modeline ait tüm üretim yıllarını azalan sıralama ile getirir (en yeni yıl en üstte).

**URL:** `GET /vehicle-select/models/:modelId/years`

**Parametreler:**
- `modelId` (path): Model ID değeri

**Yetkilendirme:** JWT Token gerekli

**Başarılı Yanıt:**
```json
[
  {
    "id": "1",
    "year": 2023,
    "model_id": "1"
  },
  {
    "id": "2",
    "year": 2022,
    "model_id": "1"
  },
  {
    "id": "3",
    "year": 2021,
    "model_id": "1"
  }
]
```

**Hata Yanıtları:**
- `401 Unauthorized`: Geçersiz veya eksik yetkilendirme
- `500 Internal Server Error`: Sunucu hatası

### 4. Üretim Yılına Göre Varyantları Listeleme

Belirli bir üretim yılına ait tüm araç varyantlarını alfabetik sıralamayla getirir.

**URL:** `GET /vehicle-select/years/:yearId/variants`

**Parametreler:**
- `yearId` (path): Üretim yılı ID değeri

**Yetkilendirme:** JWT Token gerekli

**Başarılı Yanıt:**
```json
[
  {
    "id": "1",
    "name": "1.4 TSI",
    "model_year_id": "1"
  },
  {
    "id": "2",
    "name": "2.0 TDI",
    "model_year_id": "1"
  },
  {
    "id": "3",
    "name": "2.0 TFSI Quattro",
    "model_year_id": "1"
  }
]
```

**Hata Yanıtları:**
- `401 Unauthorized`: Geçersiz veya eksik yetkilendirme
- `500 Internal Server Error`: Sunucu hatası

### 5. Varyanta Göre Tam Araç Bilgisini Getirme

Varyant ID'sini kullanarak araç hakkında tam bilgiyi getirir.

**URL:** `GET /vehicle-select/vehicle/:variantId`

**Parametreler:**
- `variantId` (path): Varyant ID değeri

**Yetkilendirme:** JWT Token gerekli

**Başarılı Yanıt:**
```json
{
  "brand": "Audi",
  "brandId": "1",
  "model": "A3",
  "modelId": "1",
  "year": 2023,
  "yearId": "1",
  "variant": "1.4 TSI",
  "variantId": "1"
}
```

**Hata Yanıtları:**
- `401 Unauthorized`: Geçersiz veya eksik yetkilendirme
- `404 Not Found`: Belirtilen varyant bulunamadı
- `500 Internal Server Error`: Sunucu hatası

## Data Modelleri

### BrandDto
```
{
  id: string;     // Marka benzersiz tanımlayıcısı
  name: string;   // Marka adı
}
```

### ModelDto
```
{
  id: string;      // Model benzersiz tanımlayıcısı
  name: string;    // Model adı
  brand_id: string; // İlişkili marka ID'si
}
```

### YearDto
```
{
  id: string;      // Üretim yılı benzersiz tanımlayıcısı
  year: number;    // Üretim yılı değeri
  model_id: string; // İlişkili model ID'si
}
```

### VariantDto
```
{
  id: string;          // Varyant benzersiz tanımlayıcısı
  name: string;        // Varyant adı
  model_year_id: string; // İlişkili üretim yılı ID'si
}
```

### VehicleInfoDto
```
{
  brand: string;     // Marka adı
  brandId: string;   // Marka ID'si
  model: string;     // Model adı
  modelId: string;   // Model ID'si
  year: number;      // Üretim yılı
  yearId: string;    // Üretim yılı ID'si
  variant: string;   // Varyant adı
  variantId: string; // Varyant ID'si
}
```
