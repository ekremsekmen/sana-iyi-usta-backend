# Service Select API Dokümantasyonu

Bu dokümantasyon, hizmet seçimi için API endpointlerini detaylandırır. Tüm isteklerde JWT yetkilendirmesi gereklidir.

## Temel URL

```
/service-select
```

## Endpointler

### 1. Hizmet Kategorilerini Listeleme

Sistemde kayıtlı tüm hizmet kategorilerini alfabetik sıralamayla getirir.

**URL:** `GET /service-select/categories`

**Yetkilendirme:** JWT Token gerekli

**Başarılı Yanıt:**
```json
[
  {
    "id": 7,
    "name": "Araç Detaylı Temizlik ve Kuaför Hizmetleri",
    "category": null
  },
  {
    "id": 9,
    "name": "Araç Ekspertiz ve Muayene İşlemleri",
    "category": null
  },
  {
    "id": 6,
    "name": "Cam, Aksesuar ve Donanım Montajı",
    "category": null
  },
  {
    "id": 2,
    "name": "Elektrik ve Elektronik Sistemler",
    "category": null
  }
]
```

**Hata Yanıtları:**
- `401 Unauthorized`: Geçersiz veya eksik yetkilendirme
- `500 Internal Server Error`: Sunucu hatası

### 2. Kategoriye Göre Alt Kategorileri Listeleme

Belirli bir hizmet kategorisine ait tüm alt kategorileri alfabetik sıralamayla getirir.

**URL:** `GET /service-select/categories/:categoryId/subcategories`

**Parametreler:**
- `categoryId` (path): Kategori ID değeri (number)

**Yetkilendirme:** JWT Token gerekli

**Başarılı Yanıt:**
```json
[
  {
    "id": "2ef96a63-4f8d-447f-b359-a39388c49018",
    "category_id": 5,
    "name": "Akü Kontrol & Bakım",
    "created_at": "2025-04-24T23:16:25.835Z"
  },
  {
    "id": "abbf8230-bddc-4cb7-ba56-7429e97f62da",
    "category_id": 5,
    "name": "Fren Balatası & Disk Değişimi",
    "created_at": "2025-04-24T23:16:25.835Z"
  },
  {
    "id": "fe242f1f-a269-46f2-8750-b308c599dee9",
    "category_id": 5,
    "name": "Genel Bakım Paketi",
    "created_at": "2025-04-24T23:16:25.835Z"
  }
]
```

**Hata Yanıtları:**
- `401 Unauthorized`: Geçersiz veya eksik yetkilendirme
- `404 Not Found`: Belirtilen kategoriye ait alt kategoriler bulunamadı
- `500 Internal Server Error`: Sunucu hatası

### 3. Alt Kategoriye Göre Tam Hizmet Bilgisini Getirme

Alt kategori ID'sini kullanarak hizmet hakkında tam bilgiyi getirir.

**URL:** `GET /service-select/subcategories/:subcategoryId`

**Parametreler:**
- `subcategoryId` (path): Alt kategori ID değeri (string)

**Yetkilendirme:** JWT Token gerekli

**Başarılı Yanıt:**
```json
{
  "category_id": 5,
  "subcategory_id": "2ef96a63-4f8d-447f-b359-a39388c49018",
  "category": "Periyodik Bakım ve Servis İşlemleri",
  "subcategory": "Akü Kontrol & Bakım"
}
```

**Hata Yanıtları:**
- `401 Unauthorized`: Geçersiz veya eksik yetkilendirme
- `404 Not Found`: Belirtilen alt kategori bulunamadı
- `500 Internal Server Error`: Sunucu hatası

## Data Modelleri

### ServiceCategoryDto
```
{
  id: number;      // Kategori benzersiz tanımlayıcısı
  name: string;    // Kategori adı
  category?: string; // Üst kategori adı (opsiyonel, çoğunlukla null)
}
```

### ServiceSubcategoryDto
```
{
  id: string;       // Alt kategori benzersiz tanımlayıcısı (UUID formatında)
  name: string;     // Alt kategori adı
  category_id: number; // İlişkili kategori ID'si
  created_at: string;  // Oluşturulma tarihi (ISO formatında)
}
```

### ServiceInfoDto
```
{
  category_id: number;     // Kategori ID'si
  subcategory_id: string;  // Alt kategori ID'si (UUID formatında)
  category: string;        // Kategori adı
  subcategory: string;     // Alt kategori adı
}
```
