# Mechanics API Dokümantasyonu

Bu dokümantasyon, tamirci (mekanik) yönetimi için API endpointlerini detaylandırır. Tüm isteklerde JWT yetkilendirmesi gereklidir.

## Temel URL

```
/mechanics
```

## Araç Bakım Kayıtları Endpointleri

### 1. Araç Bakım Kaydı Oluşturma

Giriş yapmış tamircinin bir araç için bakım kaydı oluşturmasını sağlar. Kayıt yalnızca onaylanmış veya tamamlanmış randevular için oluşturulabilir.Bakım kaydı girilen araç randevudaki araç olmalıdır.

**URL:** `POST /mechanics/maintenance-records`

**Yetkilendirme:** JWT Token gerekli

**İstek Gövdesi:**
```json
{
  "appointment_id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890", // Randevu ID (zorunlu)
  "details": "Yağ değişimi, filtre değişimi ve genel bakım yapıldı", // Bakım detayları (zorunlu)
  "cost": 1500.50, // Bakım maliyeti (zorunlu)
  "odometer": 78500, // Kilometre bilgisi (zorunlu)
  "next_due_date": "2023-12-15" // Sonraki bakım için önerilen tarih (isteğe bağlı)
}
```

**Başarılı Yanıt (201 Created):**
```json
{
  "id": "m1b2c3d4-e5f6-7890-abcd-ef1234567890",
  "vehicle_id": "v1b2c3d4-e5f6-7890-abcd-ef1234567890",
  "mechanic_id": "mech1-uuid-1234",
  "customer_id": "cust1-uuid-5678",
  "details": "Yağ değişimi, filtre değişimi ve genel bakım yapıldı",
  "cost": 1500.50,
  "odometer": 78500,
  "service_date": "2023-09-15T14:30:00Z", // Otomatik oluşturulan servis tarihi
  "next_due_date": "2023-12-15T00:00:00Z" // Sonraki bakım tarihi (belirtildiyse)
}
```

**Hata Yanıtları:**
- `401 Unauthorized`: Geçersiz veya eksik yetkilendirme
- `404 Not Found`: Kullanıcının tamirci profili veya belirtilen randevu bulunamadı
- `400 Bad Request`: Geçersiz istek gövdesi, randevu tamirciye ait değil veya randevu durumu uygun değil (onaylanmış veya tamamlanmış olmalı)
- `500 Internal Server Error`: Sunucu hatası

### 2. Araç İçin Bakım Kayıtlarını Getirme

Tamircinin belirli bir araç için oluşturduğu bakım kayıtlarını tarih sırasına göre listeler.

**URL:** `GET /mechanics/vehicles/:vehicleId/maintenance-records`

**Parametreler:**
- `vehicleId` (path): Bakım kayıtları getirilecek araç ID değeri

**Yetkilendirme:** JWT Token gerekli

**Başarılı Yanıt (200 OK):**
```json
[
  {
    "id": "m1b2c3d4-e5f6-7890-abcd-ef1234567890",
    "vehicle_id": "v1b2c3d4-e5f6-7890-abcd-ef1234567890",
    "mechanic_id": "mech1-uuid-1234",
    "customer_id": "cust1-uuid-5678",
    "details": "Yağ değişimi, filtre değişimi ve genel bakım yapıldı",
    "cost": 1500.50,
    "odometer": 78500,
    "service_date": "2023-09-15T14:30:00Z",
    "next_due_date": "2023-12-15T00:00:00Z"
  },
  // ... diğer bakım kayıtları (en yeniden en eskiye doğru sıralı)
]
```

**Hata Yanıtları:**
- `401 Unauthorized`: Geçersiz veya eksik yetkilendirme
- `404 Not Found`: Kullanıcının tamirci profili bulunamadı
- `500 Internal Server Error`: Sunucu hatası

## Kullanıcının Tamirci Profilini Kontrol Etme

Giriş yapmış olan kullanıcının bir tamirci profili olup olmadığını kontrol eder.

**URL:** `GET /mechanics/profile/check`

**Yetkilendirme:** JWT Token gerekli

**Başarılı Yanıt:**
```json
{
  "hasMechanicProfile": true,  // Kullanıcının tamirci profili varsa true, yoksa false
  "profile": {                 // Tamirci profili varsa detaylar, yoksa null
    "id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
    "business_name": "Ahmet Usta Oto Servis",
    "on_site_service": true,
    "user_id": "u1s2e3r4-5678-90ab-cdef-ghijklmnopqr"
  }
}
```

**Profili Yoksa:**
```json
{
  "hasMechanicProfile": false,  // Kullanıcının tamirci profili yoksa false
  "profile": null               // Profil yoksa null olarak döner
}
```

**Hata Yanıtları:**
- `401 Unauthorized`: Geçersiz veya eksik yetkilendirme

## Tamirci Profil Endpointleri

### 1. Tamirci Profili Oluşturma

Giriş yapmış kullanıcı için sistemde yeni bir tamirci profili oluşturur.

**URL:** `POST /mechanics`

**Yetkilendirme:** JWT Token gerekli

**İstek Gövdesi:**
```json
{
  "business_name": "Ahmet Usta Oto Servis",
  "on_site_service": true
}
```

**Başarılı Yanıt (201 Created):**
```json
{
  "id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  "business_name": "Ahmet Usta Oto Servis",
  "on_site_service": true,
  "user_id": "u1s2e3r4-5678-90ab-cdef-ghijklmnopqr"
}
```

**Hata Yanıtları:**
- `401 Unauthorized`: Geçersiz veya eksik yetkilendirme
- `400 Bad Request`: Geçersiz istek gövdesi
- `409 Conflict`: Kullanıcının zaten bir tamirci profili var
- `500 Internal Server Error`: Sunucu hatası

### 2. Tamirci Bilgilerini Getirme

Giriş yapmış kullanıcının tamirci profil bilgilerini getirir.

**URL:** `GET /mechanics`

**Yetkilendirme:** JWT Token gerekli

**Başarılı Yanıt (200 OK):**
```json
{
  "id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  "business_name": "Ahmet Usta Oto Servis",
  "on_site_service": true,
  "user_id": "u1s2e3r4-5678-90ab-cdef-ghijklmnopqr"
}
```

**Hata Yanıtları:**
- `401 Unauthorized`: Geçersiz veya eksik yetkilendirme
- `404 Not Found`: Kullanıcının tamirci profili bulunamadı
- `500 Internal Server Error`: Sunucu hatası

### 3. Tamirci Bilgilerini Güncelleme

Giriş yapmış kullanıcının mevcut tamirci profilini günceller.

**URL:** `PATCH /mechanics`

**Yetkilendirme:** JWT Token gerekli

**İstek Gövdesi:**
```json
{
  "business_name": "Ahmet Usta Yeni İsim",
  "on_site_service": false
}
```

**Başarılı Yanıt (200 OK):**
```json
{
  "id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  "business_name": "Ahmet Usta Yeni İsim",
  "on_site_service": false,
  "user_id": "u1s2e3r4-5678-90ab-cdef-ghijklmnopqr"
}
```

**Hata Yanıtları:**
- `401 Unauthorized`: Geçersiz veya eksik yetkilendirme
- `404 Not Found`: Kullanıcının tamirci profili bulunamadı
- `400 Bad Request`: Geçersiz istek gövdesi
- `500 Internal Server Error`: Sunucu hatası

### 4. Tamirci Profilini Silme

Giriş yapmış kullanıcının tamirci profilini sistemden siler.

**URL:** `DELETE /mechanics`

**Yetkilendirme:** JWT Token gerekli

**Başarılı Yanıt (200 OK):** (Silinen profilin bilgileri döner)
```json
{
  "id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  "business_name": "Ahmet Usta Oto Servis",
  "on_site_service": true,
  "user_id": "u1s2e3r4-5678-90ab-cdef-ghijklmnopqr"
}
```

**Hata Yanıtları:**
- `401 Unauthorized`: Geçersiz veya eksik yetkilendirme
- `404 Not Found`: Kullanıcının tamirci profili bulunamadı
- `500 Internal Server Error`: Sunucu hatası

## Desteklenen Araçlar Endpointleri

### 1. Tamircinin Desteklediği Araçları Getirme

Giriş yapmış kullanıcının tamirci profilinin desteklediği araç markalarını listeler.

**URL:** `GET /mechanics/supported-vehicles`

**Yetkilendirme:** JWT Token gerekli

**Başarılı Yanıt (200 OK):**
```json
[
  {
    "id": "sv1-uuid-1234",
    "mechanic_id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
    "brand_id": "br1-uuid-5678",
    "brands": {
      "id": "br1-uuid-5678",
      "name": "Audi"
    }
  },
  // ... diğer desteklenen araçlar
]
```

**Hata Yanıtları:**
- `401 Unauthorized`: Geçersiz veya eksik yetkilendirme
- `404 Not Found`: Kullanıcının tamirci profili bulunamadı
- `500 Internal Server Error`: Sunucu hatası

### 2. Tamirciye Desteklenen Araç Ekleme

Giriş yapmış kullanıcının tamirci profiline desteklediği araç markası ekler.

**URL:** `POST /mechanics/supported-vehicles`

**Yetkilendirme:** JWT Token gerekli

**İstek Gövdesi (Tekil):**
```json
{
  "brand_id": "br3-uuid-3456"
}
```

**İstek Gövdesi (Çoklu):**
```json
[
  {
    "brand_id": "br3-uuid-3456"
  },
  {
    "brand_id": "br4-uuid-7890"
  }
]
```

**Başarılı Yanıt (201 Created - Tekil):**
```json
{
  "id": "sv3-uuid-1234",
  "mechanic_id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  "brand_id": "br3-uuid-3456",
  "brands": {
    "id": "br3-uuid-3456",
    "name": "Mercedes"
  }
}
```

**Başarılı Yanıt (201 Created - Çoklu):**
```json
[
  // ... eklenen araçlar
]
```

**Hata Yanıtları:**
- `401 Unauthorized`: Geçersiz veya eksik yetkilendirme
- `404 Not Found`: Kullanıcının tamirci profili veya belirtilen marka(lar) bulunamadı
- `400 Bad Request`: Geçersiz istek gövdesi
- `500 Internal Server Error`: Sunucu hatası

### 3. Tamircinin Desteklediği Aracı Silme

Giriş yapmış kullanıcının tamirci profilinin desteklediği belirli bir araç markasını kaldırır.

**URL:** `DELETE /mechanics/supported-vehicles/:brandId`

**Parametreler:**
- `brandId` (path): Kaldırılacak Marka ID değeri

**Yetkilendirme:** JWT Token gerekli

**Başarılı Yanıt (200 OK):** (Silinen kaydın bilgileri döner)
```json
{
  "id": "sv1-uuid-1234",
  "mechanic_id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  "brand_id": "br1-uuid-5678",
  "brands": {
    "id": "br1-uuid-5678",
    "name": "Audi"
  }
}
```

**Hata Yanıtları:**
- `401 Unauthorized`: Geçersiz veya eksik yetkilendirme
- `404 Not Found`: Kullanıcının tamirci profili veya belirtilen desteklenen araç kaydı bulunamadı
- `500 Internal Server Error`: Sunucu hatası

### 4. Tamircinin Desteklediği Araçları Toplu Güncelleme

Giriş yapmış kullanıcının tamirci profilinin desteklediği araç listesini toplu olarak günceller. Mevcut desteklenen araçlar listesi, istek gövdesindeki liste ile değiştirilir.

**URL:** `PATCH /mechanics/supported-vehicles`

**Yetkilendirme:** JWT Token gerekli

**İstek Gövdesi:** (Sadece `brand_id` içeren nesnelerden oluşan dizi)
```json
[
  {
    "brand_id": "br1-uuid-5678"
  },
  {
    "brand_id": "br5-uuid-1234"
  }
]
```

**Başarılı Yanıt (200 OK):** (Güncellenmiş desteklenen araç listesi döner)
```json
[
  // ... güncellenmiş liste
]
```

**Hata Yanıtları:**
- `401 Unauthorized`: Geçersiz veya eksik yetkilendirme
- `404 Not Found`: Kullanıcının tamirci profili veya istekteki markalardan biri bulunamadı
- `400 Bad Request`: Geçersiz istek gövdesi
- `500 Internal Server Error`: Sunucu hatası

## Çalışma Saatleri Endpointleri

### 1. Tamircinin Çalışma Saatlerini Getirme

Giriş yapmış kullanıcının tamirci profilinin çalışma saatlerini listeler.

**URL:** `GET /mechanics/working-hours`

**Yetkilendirme:** JWT Token gerekli

**Başarılı Yanıt (200 OK):**
```json
[
  {
    "id": "wh1-uuid-1234",
    "mechanic_id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
    "day_of_week": 1,
    "start_time": "09:00",
    "end_time": "18:00",
    "slot_duration": 30,
    "is_day_off": false
  },
  // ... diğer çalışma saatleri
]
```

**Hata Yanıtları:**
- `401 Unauthorized`: Geçersiz veya eksik yetkilendirme
- `404 Not Found`: Kullanıcının tamirci profili bulunamadı
- `500 Internal Server Error`: Sunucu hatası

### 2. Tamirciye Çalışma Saati Ekleme / Güncelleme (Upsert)

Giriş yapmış kullanıcının tamirci profiline çalışma saati ekler veya mevcut günü günceller.

**URL:** `POST /mechanics/working-hours`

**Yetkilendirme:** JWT Token gerekli

**İstek Gövdesi (Tekil):**
```json
{
  "day_of_week": 3,         // Zorunlu (0-6, 0=Pazar)
  "start_time": "09:00",    // Zorunlu (HH:MM formatı)
  "end_time": "18:00",      // Zorunlu (HH:MM formatı)
  "slot_duration": 30,      // Zorunlu (dakika cinsinden, min 15)
  "is_day_off": false       // İsteğe bağlı (varsayılan: false)
}
```

**İstek Gövdesi (Çoklu):**
```json
[
  // ... çalışma saati nesneleri
]
```

**Başarılı Yanıt (201 Created - Tekil):**
```json
{
  "id": "wh3-uuid-1234",
  "mechanic_id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  "day_of_week": 3,
  "start_time": "09:00",
  "end_time": "18:00",
  "slot_duration": 30,
  "is_day_off": false
}
```

**Başarılı Yanıt (201 Created - Çoklu):**
```json
[
  // ... eklenen/güncellenen çalışma saatleri
]
```

**Hata Yanıtları:**
- `401 Unauthorized`: Geçersiz veya eksik yetkilendirme
- `404 Not Found`: Kullanıcının tamirci profili bulunamadı
- `400 Bad Request`: Geçersiz istek gövdesi
- `500 Internal Server Error`: Sunucu hatası

### 3. Tamirci Çalışma Saatini Güncelleme

Giriş yapmış kullanıcının tamirci profilinin belirli bir çalışma saatini (ID ile belirtilen) günceller.

**URL:** `PATCH /mechanics/working-hours/:hourId`

**Parametreler:**
- `hourId` (path): Güncellenecek Çalışma saati ID değeri

**Yetkilendirme:** JWT Token gerekli

**İstek Gövdesi:** (Güncellenmek istenen alanları içerir)
```json
{
  "start_time": "10:00",    // İsteğe bağlı (HH:MM formatı)
  "end_time": "19:00",      // İsteğe bağlı (HH:MM formatı)
  "slot_duration": 45,      // İsteğe bağlı (dakika cinsinden, min 15)
  "is_day_off": false       // İsteğe bağlı (boolean)
}
```

**Başarılı Yanıt (200 OK):**
```json
{
  "id": "wh1-uuid-1234", // Güncellenen kaydın ID'si
  "mechanic_id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  "day_of_week": 1,       // Güncellenmeyen alanlar da döner
  "start_time": "10:00",
  "end_time": "19:00",
  "slot_duration": 45,
  "is_day_off": false
}
```

**Hata Yanıtları:**
- `401 Unauthorized`: Geçersiz veya eksik yetkilendirme
- `404 Not Found`: Kullanıcının tamirci profili veya belirtilen çalışma saati bulunamadı veya kullanıcıya ait değil
- `400 Bad Request`: Geçersiz istek gövdesi
- `500 Internal Server Error`: Sunucu hatası

### 4. Tamirci Çalışma Saatini Silme

Giriş yapmış kullanıcının tamirci profilinin belirli bir çalışma saatini siler.

**URL:** `DELETE /mechanics/working-hours/:hourId`

**Parametreler:**
- `hourId` (path): Silinecek Çalışma saati ID değeri

**Yetkilendirme:** JWT Token gerekli

**Başarılı Yanıt (200 OK):** (Silinen kaydın bilgileri döner)
```json
{
  "id": "wh1-uuid-1234",
  "mechanic_id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  "day_of_week": 1,
  "start_time": "09:00",
  "end_time": "18:00",
  "slot_duration": 30,
  "is_day_off": false
}
```

**Hata Yanıtları:**
- `401 Unauthorized`: Geçersiz veya eksik yetkilendirme
- `404 Not Found`: Kullanıcının tamirci profili veya belirtilen çalışma saati bulunamadı veya kullanıcıya ait değil
- `500 Internal Server Error`: Sunucu hatası

## Kategoriler Endpointleri

### 1. Tamircinin Kategorilerini Getirme

Giriş yapmış kullanıcının tamirci profilinin hizmet verdiği kategorileri listeler.

**URL:** `GET /mechanics/categories`

**Yetkilendirme:** JWT Token gerekli

**Başarılı Yanıt (200 OK):**
```json
[
  {
    "id": "mc1-uuid-1234",
    "mechanic_id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
    "category_id": "cat1-uuid-5678",
    "categories": {
      "id": "cat1-uuid-5678",
      "name": "Motor Tamiri"
    }
  },
  // ... diğer kategoriler
]
```

**Hata Yanıtları:**
- `401 Unauthorized`: Geçersiz veya eksik yetkilendirme
- `404 Not Found`: Kullanıcının tamirci profili bulunamadı
- `500 Internal Server Error`: Sunucu hatası

### 2. Tamirciye Kategori Ekleme

Giriş yapmış kullanıcının tamirci profiline kategori ekler.

**URL:** `POST /mechanics/categories`

**Yetkilendirme:** JWT Token gerekli

**İstek Gövdesi (Tekil):**
```json
{
  "category_id": "cat3-uuid-3456"
}
```

**İstek Gövdesi (Çoklu):**
```json
[
  {
    "category_id": "cat3-uuid-3456"
  },
  {
    "category_id": "cat4-uuid-7890"
  }
]
```

**Başarılı Yanıt (201 Created - Tekil):**
```json
{
  "id": "mc3-uuid-1234",
  "mechanic_id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  "category_id": "cat3-uuid-3456",
  "categories": {
    "id": "cat3-uuid-3456",
    "name": "Elektrik Sistemleri"
  }
}
```

**Başarılı Yanıt (201 Created - Çoklu):**
```json
[
  // ... eklenen kategoriler
]
```

**Hata Yanıtları:**
- `401 Unauthorized`: Geçersiz veya eksik yetkilendirme
- `404 Not Found`: Kullanıcının tamirci profili veya belirtilen kategori(ler) bulunamadı
- `400 Bad Request`: Geçersiz istek gövdesi
- `500 Internal Server Error`: Sunucu hatası

### 3. Tamircinin Kategorisini Silme

Giriş yapmış kullanıcının tamirci profilinin belirli bir kategorisini siler.

**URL:** `DELETE /mechanics/categories/:categoryId`

**Parametreler:**
- `categoryId` (path): Silinecek Kategori ID değeri

**Yetkilendirme:** JWT Token gerekli

**Başarılı Yanıt (200 OK):** (Silinen kaydın bilgileri döner)
```json
{
  "id": "mc1-uuid-1234",
  "mechanic_id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  "category_id": "cat1-uuid-5678",
  "categories": {
    "id": "cat1-uuid-5678",
    "name": "Motor Tamiri"
  }
}
```

**Hata Yanıtları:**
- `401 Unauthorized`: Geçersiz veya eksik yetkilendirme
- `404 Not Found`: Kullanıcının tamirci profili veya tamirciye ait belirtilen kategori kaydı bulunamadı
- `500 Internal Server Error`: Sunucu hatası

### 4. Tamircinin Kategorilerini Toplu Güncelleme

Giriş yapmış kullanıcının tamirci profilinin kategorilerini toplu olarak günceller. Mevcut kategoriler listesi, istek gövdesindeki liste ile değiştirilir.

**URL:** `PATCH /mechanics/categories`

**Yetkilendirme:** JWT Token gerekli

**İstek Gövdesi:** (Sadece `category_id` içeren nesnelerden oluşan dizi)
```json
[
  {
    "category_id": "cat1-uuid-5678"
  },
  {
    "category_id": "cat5-uuid-1234"
  }
]
```

**Başarılı Yanıt (200 OK):** (Güncellenmiş kategori listesi döner)
```json
[
  // ... güncellenmiş liste
]
```

**Hata Yanıtları:**
- `401 Unauthorized`: Geçersiz veya eksik yetkilendirme
- `404 Not Found`: Kullanıcının tamirci profili veya istekteki kategorilerden biri bulunamadı
- `400 Bad Request`: Geçersiz istek gövdesi
- `500 Internal Server Error`: Sunucu hatası

## Tamirci Arama Endpointi

### Tamircileri Arama

Çeşitli kriterlere göre filtrelenmiş tamirci listesi elde etmek için kullanılır.

**URL:** `POST /mechanics/search`

**Yetkilendirme:** JWT Token gerekli

**İstek Gövdesi:**
```json
{
  "city": "İstanbul",               // Aranacak şehir (zorunlu)
  "brandId": "uuid-123",            // Araç markası ID (zorunlu)
  "categoryId": "uuid-456",         // Hizmet kategorisi ID (zorunlu)
  "onSiteService": true,            // Yerinde servis tercihi (isteğe bağlı)
  "page": 0,                        // Sayfa numarası (0'dan başlar, varsayılan: 0)
  "limit": 20,                      // Sayfa başına sonuç sayısı (varsayılan: 20, max: 50)
  "ratingSort": "desc",             // Puan sıralaması ("asc" veya "desc", varsayılan: "desc")
  "sortBy": "rating"                // Sıralama kriteri ("rating" veya "distance", varsayılan: "rating")
}
```

**Başarılı Yanıt (200 OK):**
```json
{
  "mechanics": [
    {
      "id": "mech-uuid-123",
      "business_name": "Ahmet Usta Oto Servis",
      "on_site_service": true,
      "average_rating": 4.7,
      "user_id": "user-uuid-123",
      "user": {
        "full_name": "Ahmet Yılmaz",
        "profile_image": "https://example.com/images/profile.jpg"
      },
      "distance": 3.2,              // Kilometre cinsinden uzaklık (kullanıcının konumu biliniyorsa)
      "categories": [
        {
          "id": "cat-uuid-123",
          "name": "Motor Tamiri"
        },
        {
          "id": "cat-uuid-456",
          "name": "Elektrik Sistemleri" 
        }
      ],
      "supported_vehicles": [
        {
          "id": "brand-uuid-123",
          "name": "Mercedes"
        },
        {
          "id": "brand-uuid-456",
          "name": "BMW"
        }
      ]
    },
    // ... diğer tamirciler
  ],
  "total": 42                      // Toplam sonuç sayısı
}
```

**Filtreleme Bilgileri:**

1. **Şehir Bazlı Filtreleme**: `city` parametresi ile belirli bir şehirdeki tamirciler listelenir. Eğer şehir belirtilmezse, kullanıcının varsayılan konumundaki şehir kullanılır.

2. **Marka Bazlı Filtreleme**: `brandId` parametresi ile belirli bir araç markasında servis veren tamirciler listelenir.

3. **Kategori Bazlı Filtreleme**: `categoryId` parametresi ile belirli bir hizmet kategorisinde servis veren tamirciler listelenir.

4. **Yerinde Servis Filtresi**: `onSiteService` parametresi `true` olarak belirtilirse, sadece yerinde servis veren tamirciler listelenir.

**Sıralama Seçenekleri:**

- **Değerlendirme Puanına Göre**: `sortBy: "rating"` ile tamirciler ortalama puanlarına göre listelenir. `ratingSort` parametresi ile sıralama yönü belirlenebilir.

- **Mesafeye Göre**: `sortBy: "distance"` ile tamirciler kullanıcıya olan uzaklıklarına göre yakından uzağa doğru listelenir. Bu seçenek yalnızca kullanıcının ve tamircinin konum bilgileri mevcutsa çalışır.

**Sayfalama:**

Sonuçlar `page` ve `limit` parametreleri ile sayfalanabilir. `page` sıfırdan başlar ve `limit` ile her sayfada kaç sonuç gösterileceği belirlenir.

**Hata Yanıtları:**
- `401 Unauthorized`: Geçersiz veya eksik yetkilendirme
- `400 Bad Request`: Geçersiz istek gövdesi
- `404 Not Found`: Kullanıcı bulunamadı
- `500 Internal Server Error`: Sunucu hatası

**Not:** Kullanıcının varsayılan konum bilgisi mevcut ise, sonuçlarda tamircilerin uzaklığı (`distance`) kilometre cinsinden hesaplanır ve bu değere göre sıralama yapılabilir.

## Tamirci Detay Endpointleri

### Kullanıcı ID'si İle Tamirci Detaylarını Getirme

Belirli bir kullanıcıya ait tamirci profilinin tüm detaylı bilgilerini getirir. Bu, tamirci profili, temel kullanıcı bilgileri, çalışma saatleri, desteklenen araçlar, hizmet kategorileri ve müşteri değerlendirmelerini içeren kapsamlı bir veri kümesidir.

**URL:** `GET /mechanics/detail-by-userid/:userId`

**Parametreler:**
- `userId` (path): Tamirci detayları getirilecek kullanıcının ID değeri

**Yetkilendirme:** JWT Token gerekli

**Başarılı Yanıt (200 OK):**
```json
{
  "user": {
    "id": "u1s2e3r4-5678-90ab-cdef-ghijklmnopqr",
    "full_name": "Ahmet Yılmaz",
    "phone_number": "+905551234567",
    "profile_image": "https://example.com/images/profile.jpg",
    "email": "ahmet@ornek.com",
    "default_location": {
      "id": "loc1-uuid-1234",
      "city": "İstanbul",
      "district": "Kadıköy",
      "address": "Örnek Mahallesi, Örnek Sokak No:1",
      "latitude": 40.9876,
      "longitude": 29.0123
    },
    "locations": [
      // Tüm kayıtlı konumlar
    ]
  },
  "mechanic": {
    "id": "mech-uuid-1234",
    "business_name": "Ahmet Usta Oto Servis",
    "on_site_service": true,
    "average_rating": 4.8,
    "created_at": "2023-01-15T08:30:00Z"
  },
  "working_hours": [
    {
      "id": "wh1-uuid-1234",
      "mechanic_id": "mech-uuid-1234",
      "day_of_week": 1,
      "start_time": "09:00",
      "end_time": "18:00",
      "slot_duration": 30,
      "is_day_off": false
    },
    // Diğer çalışma saatleri
  ],
  "supported_vehicles": [
    {
      "id": "sv1-uuid-1234",
      "brand": {
        "id": "br1-uuid-5678",
        "name": "Mercedes"
      }
    },
    // Diğer desteklenen araçlar
  ],
  "categories": [
    {
      "id": "mc1-uuid-1234",
      "category": {
        "id": "cat1-uuid-5678",
        "name": "Motor Tamiri"
      }
    },
    // Diğer hizmet kategorileri
  ],
  "ratings": [
    {
      "id": "rat1-uuid-1234",
      "rating": 5,
      "review": "Harika servis, çok memnun kaldım. İşini titizlikle yapıyor.",
      "mechanic_response": "Değerlendirmeniz için teşekkürler, tekrar görüşmek dileğiyle!",
      "created_at": "2023-05-20T14:30:00Z",
      "customer": {
        "id": "cust1-uuid-5678",
        "full_name": "Mehmet Demir",
        "profile_image": "https://example.com/images/mehmet.jpg"
      }
    },
    // Diğer değerlendirmeler (en yeniden en eskiye doğru sıralı)
  ]
}
```

**Hata Yanıtları:**
- `401 Unauthorized`: Geçersiz veya eksik yetkilendirme
- `404 Not Found`: Belirtilen ID'ye sahip kullanıcı veya kullanıcıya ait tamirci profili bulunamadı
- `500 Internal Server Error`: Sunucu hatası

### Tamirci ID'si İle Tamirci Detaylarını Getirme

Belirli bir tamirci ID'sine ait tamirci profilinin tüm detaylı bilgilerini getirir. Kullanıcı ID'si yerine doğrudan tamirci ID'si ile sorgulama yapabilmek için kullanılır.

**URL:** `GET /mechanics/detail-by-mechanicid/:mechanicId`

**Parametreler:**
- `mechanicId` (path): Detayları getirilecek tamircinin ID değeri

**Yetkilendirme:** JWT Token gerekli

**Başarılı Yanıt (200 OK):**
```json
{
  "user": {
    "id": "u1s2e3r4-5678-90ab-cdef-ghijklmnopqr",
    "full_name": "Ahmet Yılmaz",
    "phone_number": "+905551234567",
    "profile_image": "https://example.com/images/profile.jpg",
    "email": "ahmet@ornek.com",
    "default_location": {
      "id": "loc1-uuid-1234",
      "city": "İstanbul",
      "district": "Kadıköy",
      "address": "Örnek Mahallesi, Örnek Sokak No:1",
      "latitude": 40.9876,
      "longitude": 29.0123
    },
    "locations": [
      // Tüm kayıtlı konumlar
    ]
  },
  "mechanic": {
    "id": "mech-uuid-1234",
    "business_name": "Ahmet Usta Oto Servis",
    "on_site_service": true,
    "average_rating": 4.8,
    "created_at": "2023-01-15T08:30:00Z"
  },
  "working_hours": [
    // Çalışma saatleri bilgileri
  ],
  "supported_vehicles": [
    // Desteklenen araçlar bilgileri
  ],
  "categories": [
    // Hizmet kategorileri bilgileri
  ],
  "ratings": [
    // Değerlendirmeler
  ]
}
```

**Hata Yanıtları:**
- `401 Unauthorized`: Geçersiz veya eksik yetkilendirme
- `404 Not Found`: Belirtilen ID'ye sahip tamirci profili bulunamadı
- `500 Internal Server Error`: Sunucu hatası

**Kullanım Notları:**
- Bu endpoint'ler tamirci profiline ait tüm ilişkili verileri tek bir istekte getirir, böylece ön yüz uygulamalarında tamirci profil sayfalarını oluşturmak için gereken tüm bilgiler tek seferde sağlanır.
- Kullanıcı bilgileri bölümü, iletişim ve konum bilgilerini içerir.
- Çalışma saatleri, hafta içindeki her gün için sıralı olarak sunulur.
- Desteklenen araçlar, tamircinin servis verebileceği tüm araç markalarını listeler.
- Kategoriler, tamircinin uzmanlaştığı hizmet türlerini gösterir.
- Değerlendirmeler bölümü, müşterilerin yaptığı yorumları ve puanlamaları içerir. Tamircinin cevapları da (varsa) burada görüntülenir.

## Data Modelleri

### MechanicProfileDto
```typescript
{
  // user_id JWT token'dan alınır, istek gövdesinde gönderilmez.
  business_name: string;  // Tamirci işletme adı (Zorunlu)
  on_site_service?: boolean; // Yerinde servis hizmeti sunuyorsa true (İsteğe bağlı, varsayılan: false)
}
```

### MechanicWorkingHoursDto
```typescript
{
  // mechanic_id JWT token'dan alınır, istek gövdesinde gönderilmez.
  day_of_week: number;    // Haftanın günü (0-6, 0 = Pazar) (Zorunlu)
  start_time: string;     // Başlangıç saati (örn: "09:00") (Zorunlu)
  end_time: string;       // Bitiş saati (örn: "18:00") (Zorunlu)
  slot_duration: number;  // Randevu süresi (dakika, min 15) (Zorunlu)
  is_day_off?: boolean;   // İzin günü ise true (İsteğe bağlı, varsayılan: false)
}
```

### MechanicSupportedVehicleDto
```typescript
{
  // mechanic_id JWT token'dan alınır, istek gövdesinde gönderilmez.
  brand_id: string;       // Marka ID'si (Zorunlu)
}
```

### MechanicCategoryDto
```typescript
{
  // mechanic_id JWT token'dan alınır, istek gövdesinde gönderilmez.
  category_id: string;    // Kategori ID'si (Zorunlu)
}
```

### SearchMechanicsDto
```typescript
{
  city: string;                   // Aranacak şehir (Zorunlu)
  brandId: string;                // Araç markası UUID (Zorunlu)
  categoryId: string;             // Hizmet kategorisi UUID (Zorunlu)
  onSiteService?: boolean;        // Yerinde servis filtresi (İsteğe bağlı)
  page?: number;                  // Sayfa numarası (İsteğe bağlı, varsayılan: 0)
  limit?: number;                 // Sayfa başına sonuç sayısı (İsteğe bağlı, varsayılan: 20, maximum: 50)
  ratingSort?: 'asc' | 'desc';    // Puan sıralaması yönü (İsteğe bağlı, varsayılan: 'desc')
  sortBy?: 'rating' | 'distance'; // Sıralama kriteri (İsteğe bağlı, varsayılan: 'rating')
}
```
