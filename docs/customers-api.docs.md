# Müşteri API Dokümantasyonu

Bu dokümantasyon, müşteri hesapları ve araçları için mevcut API endpoint'lerini açıklar.

## Genel Bilgiler

- Tüm endpoint'ler için JWT kimlik doğrulaması gereklidir
- Başarısız kimlik doğrulama durumunda `401 Unauthorized` yanıtı döner
- Bütün istek ve yanıtlar JSON formatındadır

## Araç Yönetimi

### Kullanıcının Araçlarını Listeleme

Bir kullanıcının kayıtlı tüm araçlarını getirir.

**URL:** `GET /customers/vehicles`

**Yetkilendirme:** JWT Token gerekli

**Başarılı Yanıt:**
- **Kod:** 200 OK
- **İçerik Örneği:**
```json
[
  {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "customer_id": "a7ef5d32-f92c-4bd4-8339-d3577bf65658",
    "brand_id": "12345678-abcd-1234-efgh-123456789abc",
    "model_id": "23456789-bcde-2345-fghi-234567890abc",
    "model_year_id": "34567890-cdef-3456-ghij-345678901abc",
    "variant_id": "45678901-defg-4567-hijk-456789012abc",
    "plate_number": "34ABC123",
    "created_at": "2023-06-15T10:23:42Z",
    "brands": {
      "id": "12345678-abcd-1234-efgh-123456789abc",
      "name": "BMW"
    },
    "models": {
      "id": "23456789-bcde-2345-fghi-234567890abc",
      "name": "3 Serisi"
    },
    "model_years": {
      "id": "34567890-cdef-3456-ghij-345678901abc",
      "year": 2020
    },
    "variants": {
      "id": "45678901-defg-4567-hijk-456789012abc",
      "name": "320i"
    }
  }
]
```

**Hata Yanıtları:**
- **Kod:** 401 Unauthorized - Yetkilendirme başarısız
  - **Mesaj:** "Unauthorized" - Geçersiz veya eksik JWT token
- **Kod:** 404 Not Found - Müşteri profili bulunamadı
  - **Mesaj:** "Bu kullanıcı için müşteri profili bulunamadı"

### Kullanıcı İçin Araç Ekleme

Oturum açmış kullanıcı için yeni bir araç ekler.

**URL:** `POST /customers/vehicles`

**Yetkilendirme:** JWT Token gerekli

**İstek Gövdesi:**
```json
{
  "brand_id": "12345678-abcd-1234-efgh-123456789abc",  // Zorunlu, UUID formatında
  "model_id": "23456789-bcde-2345-fghi-234567890abc",  // Zorunlu, UUID formatında
  "model_year_id": "34567890-cdef-3456-ghij-345678901abc",  // Zorunlu, UUID formatında
  "variant_id": "45678901-defg-4567-hijk-456789012abc",  // Zorunlu, UUID formatında
  "plate_number": "34ABC123"  // İsteğe bağlı, string
}
```

**Başarılı Yanıt:**
- **Kod:** 201 Created
- **İçerik Örneği:**
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "customer_id": "a7ef5d32-f92c-4bd4-8339-d3577bf65658",
  "brand_id": "12345678-abcd-1234-efgh-123456789abc",
  "model_id": "23456789-bcde-2345-fghi-234567890abc",
  "model_year_id": "34567890-cdef-3456-ghij-345678901abc",
  "variant_id": "45678901-defg-4567-hijk-456789012abc",
  "plate_number": "34ABC123",
  "created_at": "2023-06-15T10:23:42Z",
  "brands": {
    "id": "12345678-abcd-1234-efgh-123456789abc",
    "name": "BMW"
  },
  "models": {
    "id": "23456789-bcde-2345-fghi-234567890abc",
    "name": "3 Serisi"
  },
  "model_years": {
    "id": "34567890-cdef-3456-ghij-345678901abc",
    "year": 2020
  },
  "variants": {
    "id": "45678901-defg-4567-hijk-456789012abc",
    "name": "320i"
  }
}
```

**Hata Yanıtları:**
- **Kod:** 400 Bad Request - Geçersiz veri formatı
  - **Mesaj:** İlgili doğrulama hatası mesajları (örn. "brand_id alanı zorunludur", "brand_id geçerli bir UUID olmalıdır")
- **Kod:** 401 Unauthorized - Yetkilendirme başarısız
  - **Mesaj:** "Unauthorized" - Geçersiz veya eksik JWT token
- **Kod:** 404 Not Found - Müşteri profili bulunamadı
  - **Mesaj:** "Bu kullanıcı için müşteri profili bulunamadı"

### Belirli Bir Aracı Görüntüleme

Kullanıcının belirli bir aracının detaylarını getirir.

**URL:** `GET /customers/vehicles/:vehicleId`

**URL Parametreleri:**
- `vehicleId` - Görüntülenecek aracın UUID'si

**Yetkilendirme:** JWT Token gerekli

**Başarılı Yanıt:**
- **Kod:** 200 OK
- **İçerik Örneği:**
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "customer_id": "a7ef5d32-f92c-4bd4-8339-d3577bf65658",
  "brand_id": "12345678-abcd-1234-efgh-123456789abc",
  "model_id": "23456789-bcde-2345-fghi-234567890abc",
  "model_year_id": "34567890-cdef-3456-ghij-345678901abc",
  "variant_id": "45678901-defg-4567-hijk-456789012abc",
  "plate_number": "34ABC123",
  "created_at": "2023-06-15T10:23:42Z",
  "brands": {
    "id": "12345678-abcd-1234-efgh-123456789abc",
    "name": "BMW"
  },
  "models": {
    "id": "23456789-bcde-2345-fghi-234567890abc",
    "name": "3 Serisi"
  },
  "model_years": {
    "id": "34567890-cdef-3456-ghij-345678901abc",
    "year": 2020
  },
  "variants": {
    "id": "45678901-defg-4567-hijk-456789012abc",
    "name": "320i"
  }
}
```

**Hata Yanıtları:**
- **Kod:** 401 Unauthorized - Yetkilendirme başarısız
  - **Mesaj:** "Unauthorized" - Geçersiz veya eksik JWT token
- **Kod:** 404 Not Found - Araç veya müşteri profili bulunamadı
  - **Mesaj:** "Bu kullanıcı için müşteri profili bulunamadı" veya "Araç bulunamadı veya bu müşteriye ait değil"

### Aracı Silme

Kullanıcının belirli bir aracını siler. Araç silinirken, ilgili tüm bakım kayıtları da silinir.

**URL:** `DELETE /customers/vehicles/:vehicleId`

**URL Parametreleri:**
- `vehicleId` - Silinecek aracın UUID'si

**Yetkilendirme:** JWT Token gerekli

**Başarılı Yanıt:**
- **Kod:** 204 No Content

**Hata Yanıtları:**
- **Kod:** 401 Unauthorized - Yetkilendirme başarısız
  - **Mesaj:** "Unauthorized" - Geçersiz veya eksik JWT token
- **Kod:** 404 Not Found - Araç veya müşteri profili bulunamadı
  - **Mesaj:** "Bu kullanıcı için müşteri profili bulunamadı" veya "Araç bulunamadı veya bu müşteriye ait değil"

## Araç Bakım Kayıtları

### Araç Bakım Kayıtlarını Görüntüleme

Belirli bir aracın bakım kayıtlarını getirir. Kayıtlar en yeni servis tarihinden en eskiye doğru sıralanır (service_date: 'desc').

**URL:** `GET /customers/vehicles/:vehicleId/maintenance-records`

**URL Parametreleri:**
- `vehicleId` - Bakım kayıtları görüntülenecek aracın UUID'si

**Yetkilendirme:** JWT Token gerekli

**Başarılı Yanıt:**
- **Kod:** 200 OK
- **İçerik Örneği:**
```json
[
  {
    "id": "550e8400-e29b-41d4-a716-446655440001",
    "vehicle_id": "550e8400-e29b-41d4-a716-446655440000",
    "mechanic_id": "67890123-efgh-6789-ijkl-678901234abc",
    "service_date": "2023-05-10T09:30:00Z",
    "details": "Yağ değişimi, filtre değişimi",
    "cost": "750.00",
    "odometer": 25000,
    "created_at": "2023-05-10T10:15:30Z",
    "next_due_date": "2023-11-10T09:30:00Z",
    "mechanics": {
      "id": "67890123-efgh-6789-ijkl-678901234abc",
      "business_name": "ABC Servis"
    }
  },
  {
    "id": "550e8400-e29b-41d4-a716-446655440002",
    "vehicle_id": "550e8400-e29b-41d4-a716-446655440000",
    "mechanic_id": "67890123-efgh-6789-ijkl-678901234abc",
    "service_date": "2022-11-15T14:00:00Z",
    "details": "Fren balataları değişimi",
    "cost": "1200.00",
    "odometer": 20000,
    "created_at": "2022-11-15T15:30:45Z",
    "next_due_date": null,
    "mechanics": {
      "id": "67890123-efgh-6789-ijkl-678901234abc",
      "business_name": "ABC Servis"
    }
  }
]
```

**Hata Yanıtları:**
- **Kod:** 401 Unauthorized - Yetkilendirme başarısız
  - **Mesaj:** "Unauthorized" - Geçersiz veya eksik JWT token
- **Kod:** 404 Not Found - Araç veya müşteri profili bulunamadı
  - **Mesaj:** "Bu kullanıcı için müşteri profili bulunamadı" veya "Araç bulunamadı veya bu müşteriye ait değil"
