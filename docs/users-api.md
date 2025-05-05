# Users API Dokümantasyonu

Bu dokümantasyon, kullanıcı yönetimi için API endpointlerini detaylandırır. Tüm isteklerde JWT yetkilendirmesi gereklidir.

## Temel URL

```
/users
```

## Endpointler

### 1. Mevcut Kullanıcı Bilgilerini Getirme

Oturum açmış olan kullanıcının kendi profil bilgilerini getirir.

**URL:** `GET /users/me`

**Yetkilendirme:** JWT Token gerekli

**Başarılı Yanıt:**
```json
{
  "id": "u1s2e3r4-5678-90ab-cdef-ghijklmnopqr",
  "full_name": "Ahmet Yılmaz",
  "phone_number": "5551234567",
  "role": "customer",
  "profile_image": "https://example.com/path/to/profile.jpg",
  "created_at": "2023-10-27T10:00:00.000Z",
  "e_mail": "kullanici@example.com"
}
```

**Hata Yanıtları:**
- `401 Unauthorized`: Geçersiz veya eksik yetkilendirme
- `404 Not Found`: Kullanıcı bulunamadı
- `500 Internal Server Error`: Sunucu hatası

### 2. Mevcut Kullanıcı Bilgilerini Güncelleme

Oturum açmış olan kullanıcının kendi profil bilgilerini günceller. Telefon numarası, profil resmi ve tam ad bilgilerinden birini, ikisini veya üçünü birden güncelleyebilirsiniz.

**URL:** `PATCH /users/me`

**Yetkilendirme:** JWT Token gerekli

**İstek Gövdesi Örnekleri:**

Sadece telefon numarası güncellenirse:
```json
{
  "phone_number": "5559876543"
}
```

Sadece tam ad güncellenirse:
```json
{
  "full_name": "Mehmet Yılmaz"
}
```

Sadece profil resmi güncellenirse:
```json
{
  "profile_image": "https://example.com/new/profile.jpg"
}
```

Birden fazla alan aynı anda güncellenirse:
```json
{
  "phone_number": "5559876543",
  "full_name": "Mehmet Yılmaz",
  "profile_image": "https://example.com/new/profile.jpg"
}
```

**Başarılı Yanıt:**
```json
{
  "id": "u1s2e3r4-5678-90ab-cdef-ghijklmnopqr",
  "full_name": "Mehmet Yılmaz",
  "phone_number": "5559876543",
  "profile_image": "https://example.com/new/profile.jpg",
  "e_mail": "kullanici@example.com",
  "role": "customer",
  "created_at": "2023-10-27T10:00:00.000Z"
}
```

**Hata Yanıtları:**
- `401 Unauthorized`: Geçersiz veya eksik yetkilendirme
- `400 Bad Request`: Geçersiz istek gövdesi
- `404 Not Found`: Kullanıcı bulunamadı
- `500 Internal Server Error`: Sunucu hatası

### 3. Kullanıcı Hesabını Silme

Oturum açmış olan kullanıcının kendi hesabını siler.

**URL:** `DELETE /users/me`

**Yetkilendirme:** JWT Token gerekli

**Başarılı Yanıt:**
```json
{
  "message": "Kullanıcı başarıyla silindi"
}
```

**Hata Yanıtları:**
- `401 Unauthorized`: Geçersiz veya eksik yetkilendirme
- `404 Not Found`: Kullanıcı bulunamadı
- `500 Internal Server Error`: Sunucu hatası

### 4. Belirli Bir Kullanıcının TÜMM Bilgilerini Getirme

ID ile belirtilen kullanıcının profil bilgilerini ve rolüne bağlı (mekanik veya müşteri) detaylı bilgilerini getirir.

**URL:** `GET /users/:id`

**Parametreler:**
- `id` (path): Kullanıcı ID değeri

**Yetkilendirme:** JWT Token gerekli

**Başarılı Yanıt (Müşteri Örneği):**
```json
{
  "user": {
    "id": "a1d2m3i4n-5678-90ab-cdef-user12345678",
    "full_name": "Ayşe Kara",
    "phone_number": "5551112233",
    "role": "customer",
    "user_role": "customer",
    "profile_image": null,
    "created_at": "2023-10-26T14:00:00.000Z",
    "e_mail": "ayse@example.com",
    "default_location": {
      "id": "l1o2c3-4567-89ab-cdef-location123456",
      "address": "Atatürk Mahallesi, Vatan Caddesi No:15",
      "city": "İstanbul",
      "district": "Kadıköy",
      "label": "Ev",
      "latitude": "40.9876543",
      "longitude": "29.1234567"
    }
  },
  "customer": {
    "id": "c1u2s3t4-5678-90ab-cdef-customer12345",
    "user_id": "a1d2m3i4n-5678-90ab-cdef-user12345678",
    "created_at": "2023-10-26T14:00:00.000Z"
  }
}
```

**Başarılı Yanıt (Mekanik Örneği):**
```json
{
  "user": {
    "id": "a1d2m3i4n-5678-90ab-cdef-user12345678",
    "full_name": "Mehmet Usta",
    "phone_number": "5551112233",
    "role": "mechanic",
    "user_role": "mechanic",
    "profile_image": "https://example.com/path/to/profile.jpg",
    "created_at": "2023-10-26T14:00:00.000Z",
    "e_mail": "mehmet@example.com",
    "default_location": {
      "id": "l1o2c3-4567-89ab-cdef-location123456",
      "address": "Usta Mahallesi, Tamir Sokak No:5",
      "city": "İstanbul",
      "district": "Ümraniye",
      "label": "İşyeri",
      "latitude": "41.0123456",
      "longitude": "29.0987654"
    }
  },
  "mechanic": {
    "id": "m1e2c3h4-5678-90ab-cdef-mechanic12345",
    "user_id": "a1d2m3i4n-5678-90ab-cdef-user12345678",
    "business_name": "Mehmet Oto Tamir",
    "on_site_service": true,
    "average_rating": "4.8",
    "created_at": "2023-10-26T14:00:00.000Z",
    "mechanic_categories": [
      {
        "id": "c1a2t3-4567-89ab-cdef-category12345",
        "mechanic_id": "m1e2c3h4-5678-90ab-cdef-mechanic12345",
        "category_id": "c1a2t3-4567-89ab-cdef-catitem12345",
        "created_at": "2023-10-26T14:00:00.000Z",
        "categories": {
          "id": "c1a2t3-4567-89ab-cdef-catitem12345",
          "name": "Motor Tamiri"
        }
      }
    ],
    "mechanic_working_hours": [
      {
        "id": "w1o2r3k-4567-89ab-cdef-work12345678",
        "mechanic_id": "m1e2c3h4-5678-90ab-cdef-mechanic12345",
        "day_of_week": 1,
        "start_time": "09:00",
        "end_time": "18:00",
        "slot_duration": 60,
        "is_day_off": false
      }
    ],
    "mechanic_supported_vehicles": [
      {
        "id": "v1e2h3-4567-89ab-cdef-vehicle12345",
        "mechanic_id": "m1e2c3h4-5678-90ab-cdef-mechanic12345",
        "brand_id": "b1r2a3-4567-89ab-cdef-brand12345678",
        "brands": {
          "id": "b1r2a3-4567-89ab-cdef-brand12345678",
          "name": "Toyota"
        }
      }
    ]
  }
}
```

**Hata Yanıtları:**
- `401 Unauthorized`: Geçersiz veya eksik yetkilendirme
- `404 Not Found`: Belirtilen ID'li kullanıcı bulunamadı
- `500 Internal Server Error`: Sunucu hatası

### 5. Varsayılan Konum Bilgisini Getirme

Oturum açmış olan kullanıcının varsayılan konum bilgilerini getirir.

**URL:** `GET /users/default-location`

**Yetkilendirme:** JWT Token gerekli

**Başarılı Yanıt:**
```json
{
  "id": "u1s2e3r4-5678-90ab-cdef-ghijklmnopqr",
  "default_location": {
    "id": "l1o2c3-4567-89ab-cdef-location123456",
    "address": "Atatürk Mahallesi, Vatan Caddesi No:15",
    "city": "İstanbul",
    "district": "Kadıköy",
    "label": "Ev",
    "latitude": "40.9876543",
    "longitude": "29.1234567"
  }
}
```

**Yanıt (Varsayılan konum ayarlanmamışsa):**
```json
{
  "id": "u1s2e3r4-5678-90ab-cdef-ghijklmnopqr",
  "default_location": null
}
```

**Hata Yanıtları:**
- `401 Unauthorized`: Geçersiz veya eksik yetkilendirme
- `404 Not Found`: Kullanıcı bulunamadı
- `500 Internal Server Error`: Sunucu hatası

### 6. Varsayılan Konum Ayarlama

Kullanıcının mevcut lokasyonlarından birini varsayılan konum olarak ayarlar.

**URL:** `PATCH /users/default-location/:locationId`

**Parametreler:**
- `locationId` (path): Varsayılan olarak ayarlanacak konum ID değeri

**Yetkilendirme:** JWT Token gerekli

**Başarılı Yanıt:**
```json
{
  "id": "u1s2e3r4-5678-90ab-cdef-ghijklmnopqr",
  "default_location_id": "l1o2c3-4567-89ab-cdef-location123456",
  "locations_users_default_location_idTolocations": {
    "id": "l1o2c3-4567-89ab-cdef-location123456",
    "address": "Atatürk Mahallesi, Vatan Caddesi No:15",
    "city": "İstanbul",
    "district": "Kadıköy",
    "label": "Ev", 
    "latitude": "40.9876543",
    "longitude": "29.1234567"
  }
}
```

**Hata Yanıtları:**
- `401 Unauthorized`: Geçersiz veya eksik yetkilendirme
- `404 Not Found`: Belirtilen konum bulunamadı veya kullanıcıya ait değil
- `500 Internal Server Error`: Sunucu hatası

## Data Modelleri

### UpdateUserDto
```typescript
{
  phone_number?: string;       // İsteğe bağlı (telefon numarası)
  profile_image?: string;      // İsteğe bağlı (profil resmi URL'si)
  full_name?: string;          // İsteğe bağlı (kullanıcının tam adı)
}
```

### UserResponseDto (Yanıtlar için)
```typescript
{
  id: string;               // Kullanıcı benzersiz tanımlayıcısı
  full_name: string;        // Kullanıcının tam adı
  phone_number: string;     // Telefon numarası (null olabilir)
  role: string;             // Kullanıcı rolü: "customer", "mechanic" veya "admin"
  profile_image: string;    // Profil resmi URL'si (null olabilir)
  created_at: string;       // Hesap oluşturma tarihi (ISO formatında)
  e_mail: string;           // E-posta adresi
}
```

### DefaultLocationDto
```typescript
{
  id: string;              // Konum benzersiz tanımlayıcısı
  address: string;         // Tam adres
  city?: string;           // Şehir (null olabilir)
  district?: string;       // İlçe (null olabilir)
  label?: string;          // Konum etiketi (örn: "Ev", "İş") (null olabilir)
  latitude?: Decimal;      // Enlem değeri (null olabilir)
  longitude?: Decimal;     // Boylam değeri (null olabilir)
}
```

### DefaultLocationResponseDto
```typescript
{
  id: string;                    // Kullanıcı benzersiz tanımlayıcısı
  default_location: DefaultLocationDto | null;  // Varsayılan konum bilgisi
}
```

## Önemli Notlar

1. Tüm API istekleri JWT token gerektirmektedir ve `Authorization: Bearer {token}` header'ı ile gönderilmelidir.
2. Kullanıcı bilgisi güncellenirken `phone_number`, `profile_image` ve `full_name` alanları değiştirilebilir. Bu alanların hepsini birden güncellemek zorunda değilsiniz, sadece değiştirmek istediğiniz alanları gönderebilirsiniz. Örneğin, sadece tam adı güncellemek istiyorsanız, request body'de sadece `full_name` alanını gönderebilirsiniz. Diğer bilgiler (örn: e-mail, role) bu endpoint üzerinden değiştirilemez.
3. Kullanıcı hesabı silindiğinde, bu işlem geri alınamaz ve kullanıcının tüm ilişkili verileri de silinebilir.
4. ID ile kullanıcı getirme endpointi, diğer kullanıcıların temel bilgilerini görüntülemek için kullanılabilir. Bu, özellikle mekanik-müşteri ilişkisi için kullanışlıdır.
5. Tüm tarih değerleri ISO 8601 formatında döndürülür (örn: "2023-10-27T10:00:00.000Z").
6. Varsayılan konum ayarlanırken, yalnızca kullanıcının kendi lokasyonlarından biri kullanılabilir.
7. Varsayılan konum bilgisi uygulamada hızlı erişim için kullanılır ve kullanıcı deneyimini iyileştirir.
