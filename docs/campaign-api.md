# Kampanya API Dokümantasyonu

Bu dokümantasyon, tamircilerin kampanya oluşturma, listeleme, güncelleme ve silme işlemleri için kullanılacak API endpointlerini açıklamaktadır.

## Kimlik Doğrulama

Tüm API endpointleri JWT tabanlı kimlik doğrulama gerektirir. İstek yaparken `Authorization` başlığında JWT token'ı şu formatta gönderilmelidir:

```
Authorization: Bearer <token>
```

## Endpointler

### Tamircinin Kendi Kampanyalarını Listeleme

```
GET /campaigns
```

**Açıklama:** Giriş yapmış tamirciye ait tüm kampanyaları listeler.

**Başarılı Yanıt (200 OK):**
```json
[
  {
    "id": "uuid",
    "mechanic_id": "uuid",
    "title": "Kış Bakım Kampanyası",
    "description": "Aracınız kışa hazır mı?",
    "discount_rate": 15,
    "valid_until": "2023-12-31T00:00:00.000Z",
    "created_at": "2023-09-15T10:30:00.000Z",
    "categories": [
      {
        "id": "uuid",
        "name": "Motor Bakımı"
      }
    ],
    "brands": [
      {
        "id": "uuid",
        "name": "Toyota"
      }
    ]
  }
]
```

**Hata Yanıtları:**
- `400 Bad Request`: Bu tamirci için kampanya işlemi yapma yetkiniz yok
- `404 Not Found`: Tamirci profili bulunamadı
- `403 Forbidden`: Bu işlemi gerçekleştirme yetkiniz yok
- `500 Internal Server Error`: Sunucu hatası

### Kampanya Oluşturma

```
POST /campaigns
```

**Açıklama:** Giriş yapmış tamirci için yeni kampanya oluşturur.

**İstek Gövdesi:**
```json
{
  "title": "Kış Bakım Kampanyası",
  "description": "Aracınız kışa hazır mı?",
  "discount_rate": 15,
  "valid_until": "2023-12-31",
  "brand_ids": ["uuid1", "uuid2"],
  "category_ids": ["uuid1", "uuid2"]
}
```

**Zorunlu Alanlar:**
- `title`: Kampanya başlığı
- `discount_rate`: İndirim oranı (1-100 arası bir sayı)
- `valid_until`: Kampanyanın geçerlilik tarihi (YYYY-MM-DD formatında)
- `brand_ids`: Kampanyanın geçerli olduğu marka ID'leri (en az bir marka gerekli)
- `category_ids`: Kampanyanın geçerli olduğu kategori ID'leri (en az bir kategori gerekli)

**Opsiyonel Alanlar:**
- `description`: Kampanya açıklaması

**Başarılı Yanıt (201 Created):**
```json
{
  "id": "uuid",
  "mechanic_id": "uuid",
  "title": "Kış Bakım Kampanyası",
  "description": "Aracınız kışa hazır mı?",
  "discount_rate": 15,
  "valid_until": "2023-12-31T00:00:00.000Z",
  "created_at": "2023-09-15T10:30:00.000Z",
  "categories": [
    {
      "id": "uuid",
      "name": "Motor Bakımı"
    }
  ],
  "brands": [
    {
      "id": "uuid",
      "name": "Toyota"
    }
  ]
}
```

**Hata Yanıtları:**
- `400 Bad Request`: 
  - Bu tamirci için kampanya işlemi yapma yetkiniz yok
  - En az bir marka seçmelisiniz
  - En az bir kategori seçmelisiniz
  - Bir veya daha fazla marka için hizmet vermiyorsunuz
  - Bir kategori için hizmet vermiyorsunuz
  - Geçersiz tarih formatı
  - Kampanya bitiş tarihi gelecek bir tarih olmalıdır
- `404 Not Found`: Tamirci profili bulunamadı 
- `500 Internal Server Error`: 
  - Veritabanı hatası oluştu
  - Bu kampanya bilgileri ile zaten bir kayıt mevcut
  - Referans verilen bir kayıt bulunamadı
  - İlgili kayıt bulunamadı

### Kampanya Güncelleme

```
PATCH /campaigns/:id
```

**Açıklama:** Var olan bir kampanyayı günceller.

**URL Parametreleri:**
- `id` (UUID): Kampanyanın benzersiz ID'si

**İstek Gövdesi:**
```json
{
  "title": "Güncellenmiş Kampanya",
  "description": "Yeni açıklama",
  "discount_rate": 20,
  "valid_until": "2023-12-31",
  "brand_ids": ["uuid1", "uuid2"],
  "category_ids": ["uuid1", "uuid2"]
}
```

**Not:** Tüm alanlar opsiyoneldir. Sadece değiştirmek istediğiniz alanları gönderin.

**Başarılı Yanıt (200 OK):**
```json
{
  "id": "uuid",
  "mechanic_id": "uuid",
  "title": "Güncellenmiş Kampanya",
  "description": "Yeni açıklama",
  "discount_rate": 20,
  "valid_until": "2023-12-31T00:00:00.000Z",
  "created_at": "2023-09-15T10:30:00.000Z",
  "categories": [
    {
      "id": "uuid",
      "name": "Motor Bakımı"
    }
  ],
  "brands": [
    {
      "id": "uuid",
      "name": "Toyota"
    }
  ]
}
```

**Hata Yanıtları:**
- `400 Bad Request`: 
  - Bu tamirci için kampanya işlemi yapma yetkiniz yok
  - Bu kampanya üzerinde işlem yapma yetkiniz yok
  - En az bir marka seçmelisiniz (brand_ids boş dizi olarak gönderildiğinde)
  - En az bir kategori seçmelisiniz (category_ids boş dizi olarak gönderildiğinde)
  - Geçersiz tarih formatı
  - Kampanya bitiş tarihi gelecek bir tarih olmalıdır
- `403 Forbidden`: Bu işlemi gerçekleştirme yetkiniz yok
- `404 Not Found`: 
  - ID'si olan kampanya bulunamadı
  - Tamirci profili bulunamadı
- `500 Internal Server Error`: Veritabanı hatası oluştu

### Kampanya Silme

```
DELETE /campaigns/:id
```

**Açıklama:** Var olan bir kampanyayı siler.

**URL Parametreleri:**
- `id` (UUID): Kampanyanın benzersiz ID'si

**Başarılı Yanıt (200 OK):**
```json
{
  "message": "Kampanya başarıyla silindi"
}
```

**Hata Yanıtları:**
- `400 Bad Request`: 
  - Bu tamirci için kampanya işlemi yapma yetkiniz yok
  - Bu kampanya üzerinde işlem yapma yetkiniz yok
- `403 Forbidden`: Bu işlemi gerçekleştirme yetkiniz yok
- `404 Not Found`: 
  - Kampanya bulunamadı veya zaten silinmiş
  - Tamirci profili bulunamadı
- `500 Internal Server Error`: Veritabanı hatası oluştu

### Müşteriler İçin Uygun Kampanyaları Listeleme

```
GET /campaigns/campaign-for-customer
```

**Açıklama:** Giriş yapmış müşteri için uygun kampanyaları listeler. Müşterinin araç markaları ve varsayılan konum bilgisi kullanılarak kişiselleştirilmiş kampanya önerileri sunar.

**Başarılı Yanıt (200 OK):**
```json
[
  {
    "id": "uuid",
    "mechanic_id": "uuid",
    "mechanic_name": "ABC Oto Servis",
    "mechanic_image": "https://example.com/images/profile.jpg",
    "title": "Kış Bakım Kampanyası",
    "discount_rate": 15,
    "valid_until": "2023-12-31T00:00:00.000Z",
    "categories": [
      {
        "id": "uuid",
        "name": "Motor Bakımı"
      }
    ]
  }
]
```

**Yanıt Özellikleri:**
- Sadeleştirilmiş kampanya bilgileri (başlık, indirim oranı, geçerlilik tarihi)
- Tamirci adı ve profil resmi
- İlgili kategori bilgileri
- Sadece geçerlilik süresi dolmamış kampanyalar listelenir
- Sonuçlar oluşturulma tarihine göre azalan sırada listelenir

**Hata Yanıtları:**
- `400 Bad Request`: Bu hizmetten yararlanabilmek için varsayılan konumunuzu ayarlamanız gerekiyor veya Kampanyaları görebilmek için araç ya da araçlarınızı eklemelisiniz
- `404 Not Found`: 
  - Kullanıcı bulunamadı
  - Müşteri profili bulunamadı
- `403 Forbidden`: Bu işlemi gerçekleştirme yetkiniz yok
- `500 Internal Server Error`: Sunucu hatası

### Kampanya Detaylarını Görüntüleme

```
GET /campaigns/:id/details
```

**Açıklama:** Belirli bir kampanyanın tüm detaylarını ve ilgili tamirci bilgilerini gösterir.

**URL Parametreleri:**
- `id` (UUID): Kampanyanın benzersiz ID'si

**Başarılı Yanıt (200 OK):**
```json
{
  "id": "uuid",
  "title": "Kış Bakım Kampanyası",
  "description": "Aracınız kışa hazır mı?",
  "discount_rate": 15,
  "valid_until": "2023-12-31T00:00:00.000Z",
  "created_at": "2023-09-15T10:30:00.000Z",
  "categories": [
    {
      "id": "uuid",
      "name": "Motor Bakımı"
    }
  ],
  "brands": [
    {
      "id": "uuid",
      "name": "Toyota"
    }
  ],
  "mechanic": {
    "id": "uuid",
    "business_name": "ABC Oto Servis",
    "average_rating": 4.5,
    "total_reviews": 28,
    "profile_image": "https://example.com/images/profile.jpg",
    "full_name": "Ahmet Yılmaz",
    "locations": [
      {
        "id": "uuid",
        "address": "Bağdat Caddesi No: 123",
        "city": "İstanbul",
        "district": "Kadıköy",
        "latitude": 40.9876,
        "longitude": 29.1234
      }
    ]
  }
}
```

**Hata Yanıtları:**
- `404 Not Found`: Kampanya bulunamadı
- `500 Internal Server Error`: Kampanya detayları sorgulanırken bir sunucu hatası oluştu

## Veri Modelleri

### Kampanya DTO (Data Transfer Object)

```typescript
{
  title: string;           // Kampanya başlığı (zorunlu)
  description?: string;    // Kampanya açıklaması (opsiyonel)
  discount_rate: number;   // İndirim oranı (1-100 arası, zorunlu)
  valid_until: string;     // Geçerlilik tarihi (YYYY-MM-DD formatı, zorunlu)
  brand_ids: string[];     // Marka ID'leri (zorunlu) bir ya da birden fazla olabilir
  category_ids: string[];  // Kategori ID'leri (zorunlu) bir ya da birden fazla olabilir
}
```

### Kampanya Yanıt Modeli

Tüm yanıtlar (listeleme, oluşturma ve güncelleme için) aşağıdaki formatta döner:

```typescript
{
  id: string;              // Kampanya ID'si
  mechanic_id: string;     // Tamirci ID'si
  title: string;           // Kampanya başlığı
  description: string;     // Kampanya açıklaması
  discount_rate: number;   // İndirim oranı
  valid_until: string;     // Geçerlilik tarihi (ISO formatı)
  created_at: string;      // Oluşturulma tarihi (ISO formatı)
  categories: [            // Kampanya kategorileri
    {
      id: string;
      name: string;
    }
  ],
  brands: [                // Kampanya markaları
    {
      id: string;
      name: string;
    }
  ]
}
```
