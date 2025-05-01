# Locations API Dokümantasyonu

Bu dokümantasyon, kullanıcı konumlarının yönetimi için API endpointlerini detaylandırır. Tüm isteklerde JWT yetkilendirmesi gereklidir.

## Temel URL

```
/locations
```

## Endpointler

### 1. Konum Oluşturma

Kullanıcı için yeni bir konum kaydı oluşturur.

**URL:** `POST /locations`

**Yetkilendirme:** JWT Token gerekli

**İstek Gövdesi:**
```json
{
  "address": "Atatürk Mah. Cumhuriyet Cad. No:123",
  "latitude": 40.9876,
  "longitude": 29.1234,
  "label": "Ev",
  "city": "İstanbul",
  "district": "Kadıköy"
}
```

**Başarılı Yanıt:**
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "user_id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  "address": "Atatürk Mah. Cumhuriyet Cad. No:123",
  "latitude": 40.9876,
  "longitude": 29.1234,
  "label": "Ev",
  "city": "İstanbul",
  "district": "Kadıköy",
  "created_at": "2024-05-10T15:30:45.123Z",
  "updated_at": "2024-05-10T15:30:45.123Z"
}
```

**Hata Yanıtları:**
- `401 Unauthorized`: Geçersiz veya eksik yetkilendirme
- `400 Bad Request`: Geçersiz istek gövdesi (örn: zorunlu alanların eksik olması)
- `500 Internal Server Error`: Sunucu hatası

### 2. Kullanıcının Tüm Konumlarını Listeleme

Mevcut kullanıcıya ait tüm konumları listeler.

**URL:** `GET /locations`

**Yetkilendirme:** JWT Token gerekli

**Başarılı Yanıt:**
```json
[
  {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "user_id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
    "address": "Atatürk Mah. Cumhuriyet Cad. No:123",
    "latitude": 40.9876,
    "longitude": 29.1234,
    "label": "Ev",
    "city": "İstanbul",
    "district": "Kadıköy",
    "created_at": "2024-05-10T15:30:45.123Z",
    "updated_at": "2024-05-10T15:30:45.123Z"
  },
  {
    "id": "550e8400-e29b-41d4-a716-446655440001",
    "user_id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
    "address": "İş Merkezi, Bağdat Cad. No:456",
    "latitude": 40.9456,
    "longitude": 29.0567,
    "label": "Ofis",
    "city": "İstanbul",
    "district": "Beşiktaş",
    "created_at": "2024-05-11T10:15:30.987Z",
    "updated_at": "2024-05-11T10:15:30.987Z"
  }
]
```

**Hata Yanıtları:**
- `401 Unauthorized`: Geçersiz veya eksik yetkilendirme
- `500 Internal Server Error`: Sunucu hatası

### 3. Tek Bir Konumu Getirme

ID ile belirtilen tek bir konumun detaylarını getirir.

**URL:** `GET /locations/:id`

**Parametreler:**
- `id` (path): Konum ID değeri

**Yetkilendirme:** JWT Token gerekli

**Başarılı Yanıt:**
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "user_id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  "address": "Atatürk Mah. Cumhuriyet Cad. No:123",
  "latitude": 40.9876,
  "longitude": 29.1234,
  "label": "Ev",
  "city": "İstanbul",
  "district": "Kadıköy",
  "created_at": "2024-05-10T15:30:45.123Z",
  "updated_at": "2024-05-10T15:30:45.123Z"
}
```

**Hata Yanıtları:**
- `401 Unauthorized`: Geçersiz veya eksik yetkilendirme
- `403 Forbidden`: Kullanıcı bu konuma erişim yetkisine sahip değil
- `404 Not Found`: Belirtilen ID'li konum bulunamadı
- `500 Internal Server Error`: Sunucu hatası

### 4. Konum Bilgisini Güncelleme

Mevcut bir konum kaydını günceller. İsteği yapan kullanıcı, konumun sahibi olmalıdır.

**URL:** `PATCH /locations/:id`

**Parametreler:**
- `id` (path): Konum ID değeri

**Yetkilendirme:** JWT Token gerekli

**İstek Gövdesi:** (Sadece değiştirilmek istenen alanları içerir)
```json
{
  "address": "Atatürk Mah. Cumhuriyet Cad. No:125",
  "label": "Yeni Ev"
}
```

**Başarılı Yanıt:**
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "user_id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  "address": "Atatürk Mah. Cumhuriyet Cad. No:125",
  "latitude": 40.9876,
  "longitude": 29.1234,
  "label": "Yeni Ev",
  "city": "İstanbul",
  "district": "Kadıköy",
  "created_at": "2024-05-10T15:30:45.123Z",
  "updated_at": "2024-05-12T09:22:18.456Z"
}
```

**Hata Yanıtları:**
- `401 Unauthorized`: Geçersiz veya eksik yetkilendirme
- `403 Forbidden`: Kullanıcı bu konumu güncelleme yetkisine sahip değil
- `404 Not Found`: Belirtilen ID'li konum bulunamadı
- `400 Bad Request`: Geçersiz istek gövdesi
- `500 Internal Server Error`: Sunucu hatası

### 5. Konum Silme

Bir konum kaydını sistemden siler. İsteği yapan kullanıcı, konumun sahibi olmalıdır.

**URL:** `DELETE /locations/:id`

**Parametreler:**
- `id` (path): Konum ID değeri

**Yetkilendirme:** JWT Token gerekli

**Başarılı Yanıt:**
```json
{
  "message": "Konum başarıyla silindi"
}
```

**Hata Yanıtları:**
- `401 Unauthorized`: Geçersiz veya eksik yetkilendirme
- `403 Forbidden`: Kullanıcı bu konumu silme yetkisine sahip değil
- `404 Not Found`: Belirtilen ID'li konum bulunamadı
- `500 Internal Server Error`: Sunucu hatası

## Data Modelleri

### LocationDto
```typescript
{
  address: string;        // Adres (Zorunlu)
  latitude?: Decimal;     // Enlem koordinatı (İsteğe bağlı)
  longitude?: Decimal;    // Boylam koordinatı (İsteğe bağlı)
  label?: string;         // Konum etiketi, örn: "Ev", "İş" (İsteğe bağlı)
  city?: string;          // Şehir (İsteğe bağlı)
  district?: string;      // İlçe (İsteğe bağlı)
}
```

### Location (Response Model)
```typescript
{
  id: string;             // Konum benzersiz tanımlayıcısı
  user_id: string;        // Konumun sahibi olan kullanıcı ID'si
  address: string;        // Adres
  latitude?: Decimal;     // Enlem koordinatı
  longitude?: Decimal;    // Boylam koordinatı
  label?: string;         // Konum etiketi
  city?: string;          // Şehir
  district?: string;      // İlçe
  created_at: Date;       // Oluşturulma tarihi
  updated_at: Date;       // Son güncelleme tarihi
}
```

### Decimal Veri Tipi Hakkında Not

`latitude` ve `longitude` değerleri, Prisma ORM'in `Decimal` tipinde saklanmaktadır. Frontend tarafında JSON işleme sırasında:

1. API'den alınan `Decimal` değerler string olarak serialize edilir
2. Bu değerleri kullanırken aşağıdaki işlemler uygulanabilir:
   - JavaScript'te: `Number(değer)` veya `parseFloat(değer)` kullanarak sayıya dönüştürme
   - TypeScript'te: Bu değerleri sayısal işlemlerde kullanmadan önce `+değer` veya `Number(değer)` ile dönüştürme
3. Hassas konum bilgileri için, dönüşüm sonrası oluşabilecek yuvarlama hatalarına dikkat edilmelidir

Konum verileri ile çalışırken, yüksek hassasiyette işlemler için özel kütüphaneler (decimal.js, big.js vb.) kullanılması değerlendirilebilir.
