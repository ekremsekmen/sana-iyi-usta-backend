# Users API Dokümantasyonu

Bu dokümantasyon, kullanıcı yönetimi için API endpointlerini detaylandırır. Tüm isteklerde JWT yetkilendirmesi gereklidir.

!!!!!!!!!!!!!

### 7. Profil Resmi Yükleme

Oturum açmış olan kullanıcının profil resmini yükler ve günceller.

**URL:** `PATCH /users/me/profile-image`

**Yetkilendirme:** JWT Token gerekli

**Content-Type:** `multipart/form-data`

**Form Parametreleri:**
- `file`: Yüklenecek resim dosyası (JPEG, PNG vb.)

**Başarılı Yanıt:**
```json
{
  "id": "u1s2e3r4-5678-90ab-cdef-ghijklmnopqr",
  "profile_image": "https://example.com/storage/profile-images/12345.jpg"
}



---
---
---




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
  "user": {
    "id": "u1s2e3r4-5678-90ab-cdef-ghijklmnopqr",
    "full_name": "Ahmet Yılmaz",
    "phone_number": "5551234567",
    "role": "customer",
    "profile_image": "https://example.com/path/to/profile.jpg",
    "email": "kullanici@example.com"
  },
  "customer": {
    "id": "c1u2s3t4-5678-90ab-cdef-customer12345"
  }
}
```

**Alternatif Yanıt (Mekanik profili için):**
```json
{
  "user": {
    "id": "u1s2e3r4-5678-90ab-cdef-ghijklmnopqr",
    "full_name": "Mehmet Usta",
    "phone_number": "5551234567", 
    "role": "mechanic",
    "profile_image": "https://example.com/path/to/profile.jpg",
    "email": "mehmet@example.com"
  },
  "mechanic": {
    "id": "m1e2c3h4-5678-90ab-cdef-mechanic12345",
    "business_name": "Mehmet Oto Tamir",
    "on_site_service": true,
    "average_rating": 4.8
  }
}
```

**Hata Yanıtları:**
- `401 Unauthorized`: Geçersiz veya eksik yetkilendirme
- `404 Not Found`: Kullanıcı bulunamadı
- `500 Internal Server Error`: Sunucu hatası

### 2. Mevcut Kullanıcı Bilgilerini Güncelleme

Oturum açmış olan kullanıcının kendi profil bilgilerini günceller.

**URL:** `PATCH /users/me`

**Yetkilendirme:** JWT Token gerekli

**İstek Gövdesi:**
```json
{
  "phone_number": "5559876543",
  "full_name": "Mehmet Yılmaz",
  "profile_image": "https://example.com/new/profile.jpg"
}
```

**Not:** Güncellemek istediğiniz alanları göndermeniz yeterlidir, tüm alanları göndermeniz zorunlu değildir.

**Başarılı Yanıt:**
```json
{
  "id": "u1s2e3r4-5678-90ab-cdef-ghijklmnopqr",
  "full_name": "Mehmet Yılmaz",
  "phone_number": "5559876543",
  "profile_image": "https://example.com/new/profile.jpg",
  "role": "customer"
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

### 4. Belirli Bir Kullanıcının Bilgilerini Getirme

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
    "profile_image": null,
    "email": "ayse@example.com"
  },
  "customer": {
    "id": "c1u2s3t4-5678-90ab-cdef-customer12345"
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
    "profile_image": "https://example.com/path/to/profile.jpg",
    "email": "mehmet@example.com"
  },
  "mechanic": {
    "id": "m1e2c3h4-5678-90ab-cdef-mechanic12345",
    "business_name": "Mehmet Oto Tamir",
    "on_site_service": true,
    "average_rating": 4.8
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
  role?: string;               // İsteğe bağlı (kullanıcı rolü)
}
```

### BasicUserInfo
```typescript
{
  id: string;               // Kullanıcı benzersiz tanımlayıcısı
  phone_number?: string;    // Telefon numarası (opsiyonel)
  profile_image?: string;   // Profil resmi URL'si (opsiyonel)
  full_name?: string;       // Kullanıcının tam adı (opsiyonel)
  role?: string;            // Kullanıcı rolü (opsiyonel)
  email?: string;           // E-posta adresi (opsiyonel)
}
```

### BasicMechanicInfo
```typescript
{
  id: string;               // Mekanik benzersiz tanımlayıcısı
  business_name: string;    // İşletme adı
  on_site_service?: boolean; // Yerinde servis sağlıyor mu (opsiyonel)
  average_rating?: number;  // Ortalama değerlendirme puanı (opsiyonel)
}
```

### BasicCustomerInfo
```typescript
{
  id: string;               // Müşteri benzersiz tanımlayıcısı
}
```

### UserProfileResponseDto
```typescript
{
  user: BasicUserInfo;         // Kullanıcı temel bilgileri
  mechanic?: BasicMechanicInfo; // Eğer kullanıcı mekanikse (opsiyonel)
  customer?: BasicCustomerInfo; // Eğer kullanıcı müşteriyse (opsiyonel)
}
```

### DefaultLocationResponseDto
```typescript
{
  id: string;                    // Kullanıcı benzersiz tanımlayıcısı
  default_location: any | null;  // Varsayılan konum bilgisi
}
```

## Önemli Notlar

1. Tüm API istekleri JWT token gerektirmektedir ve `Authorization: Bearer {token}` header'ı ile gönderilmelidir.
2. Kullanıcı bilgisi güncellenirken `phone_number`, `profile_image`, `full_name` ve `role` alanları değiştirilebilir. Bu alanların hepsini birden güncellemek zorunda değilsiniz, sadece değiştirmek istediğiniz alanları gönderebilirsiniz.
3. Kullanıcı hesabı silindiğinde, bu işlem geri alınamaz ve kullanıcının tüm ilişkili verileri de silinebilir.
4. ID ile kullanıcı getirme endpointi, kullanıcıların profil bilgilerini görüntülemek için kullanılabilir. Bu yanıt kullanıcının rolüne göre (mekanik veya müşteri) ek bilgiler içerir.
5. Varsayılan konum ayarlanırken, yalnızca kullanıcının kendi lokasyonlarından biri kullanılabilir.
6. Varsayılan konum bilgisi uygulamada hızlı erişim için kullanılır ve kullanıcı deneyimini iyileştirir.
