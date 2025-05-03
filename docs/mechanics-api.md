# Mechanics API Dokümantasyonu

Bu dokümantasyon, tamirci (mekanik) yönetimi için API endpointlerini detaylandırır. Tüm isteklerde JWT yetkilendirmesi gereklidir.


### 17. Kullanıcının Tamirci Profilini Kontrol Etme

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

PROFİLİ YOKSA:
{
  "hasMechanicProfile": false,  // Kullanıcının tamirci profili yoksa false
  "profile": null               // Profil yoksa null olarak döner
}

## Temel URL

```
/mechanics
```

## Endpointler

### 1. Tamirci Profili Oluşturma

Sistemde yeni bir tamirci profili oluşturur.

**URL:** `POST /mechanics`

**Yetkilendirme:** JWT Token gerekli

**İstek Gövdesi:**
```json
{
  "business_name": "Ahmet Usta Oto Servis",
  "on_site_service": true
}
```

**Başarılı Yanıt:**
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
- `500 Internal Server Error`: Sunucu hatası

### 2. Tamirci Bilgilerini Getirme

Belirli bir tamircinin profil bilgilerini getirir.

**URL:** `GET /mechanics/:id`

**Parametreler:**
- `id` (path): Tamirci ID değeri

**Yetkilendirme:** JWT Token gerekli

**Başarılı Yanıt:**
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
- `404 Not Found`: Belirtilen ID'li tamirci bulunamadı
- `500 Internal Server Error`: Sunucu hatası

### 3. Tamirci Bilgilerini Güncelleme

Mevcut bir tamirci profilini günceller. İsteği yapan kullanıcı, tamircinin sahibi olmalıdır.

**URL:** `PATCH /mechanics/:id`

**Parametreler:**
- `id` (path): Tamirci ID değeri

**Yetkilendirme:** JWT Token gerekli

**İstek Gövdesi:**
```json
{
  "business_name": "Ahmet Usta Yeni İsim",
  "on_site_service": false
}
```

**Başarılı Yanıt:**
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
- `403 Forbidden`: Kullanıcı bu tamirciyi güncelleme yetkisine sahip değil
- `404 Not Found`: Belirtilen ID'li tamirci bulunamadı
- `400 Bad Request`: Geçersiz istek gövdesi
- `500 Internal Server Error`: Sunucu hatası

### 4. Tamirci Profilini Silme

Bir tamirci profilini sistemden siler. İsteği yapan kullanıcı, tamircinin sahibi olmalıdır.

**URL:** `DELETE /mechanics/:id`

**Parametreler:**
- `id` (path): Tamirci ID değeri

**Yetkilendirme:** JWT Token gerekli

**Başarılı Yanıt:**
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
- `403 Forbidden`: Kullanıcı bu tamirciyi silme yetkisine sahip değil
- `404 Not Found`: Belirtilen ID'li tamirci bulunamadı
- `500 Internal Server Error`: Sunucu hatası

### 5. Tamircinin Desteklediği Araçları Getirme

Bir tamircinin desteklediği araç markalarını listeler. İsteği yapan kullanıcı, tamircinin sahibi olmalıdır.

**URL:** `GET /mechanics/:id/supported-vehicles`

**Parametreler:**
- `id` (path): Tamirci ID değeri

**Yetkilendirme:** JWT Token gerekli, Tamirci Sahibi Olmalı (MechanicOwnerGuard)

**Başarılı Yanıt:**
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
  {
    "id": "sv2-uuid-5678",
    "mechanic_id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
    "brand_id": "br2-uuid-9012",
    "brands": {
      "id": "br2-uuid-9012",
      "name": "BMW"
    }
  }
]
```

**Hata Yanıtları:**
- `401 Unauthorized`: Geçersiz veya eksik yetkilendirme
- `403 Forbidden`: Kullanıcı bu tamircinin bilgilerine erişim yetkisine sahip değil
- `404 Not Found`: Belirtilen ID'li tamirci bulunamadı
- `500 Internal Server Error`: Sunucu hatası

### 6. Tamirciye Desteklenen Araç Ekleme

Bir tamirciye desteklediği araç markası ekler. İsteği yapan kullanıcı, tamircinin sahibi olmalıdır. `mechanic_id` URL'deki `:id` parametresinden alınır.

**URL:** `POST /mechanics/:id/supported-vehicles`

**Parametreler:**
- `id` (path): Tamirci ID değeri

**Yetkilendirme:** JWT Token gerekli, Tamirci Sahibi Olmalı (MechanicOwnerGuard)

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

**Başarılı Yanıt (Tekil):**
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

**Başarılı Yanıt (Çoklu):**
```json
[
  {
    "id": "sv3-uuid-1234",
    "mechanic_id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
    "brand_id": "br3-uuid-3456",
    "brands": {
      "id": "br3-uuid-3456",
      "name": "Mercedes"
    }
  },
  {
    "id": "sv4-uuid-5678",
    "mechanic_id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
    "brand_id": "br4-uuid-7890",
    "brands": {
      "id": "br4-uuid-7890",
      "name": "Toyota"
    }
  }
]
```

**Hata Yanıtları:**
- `401 Unauthorized`: Geçersiz veya eksik yetkilendirme
- `403 Forbidden`: Kullanıcı bu tamirciye desteklenen araç ekleme yetkisine sahip değil
- `404 Not Found`: Belirtilen ID'li tamirci veya marka bulunamadı
- `400 Bad Request`: Geçersiz istek gövdesi (örn: `brand_id` eksik veya geçersiz)
- `500 Internal Server Error`: Sunucu hatası

### 7. Tamircinin Desteklediği Aracı Silme

Bir tamircinin desteklediği belirli bir araç markasını kaldırır. İsteği yapan kullanıcı, tamircinin sahibi olmalıdır.

**URL:** `DELETE /mechanics/:id/supported-vehicles/:brandId`

**Parametreler:**
- `id` (path): Tamirci ID değeri
- `brandId` (path): Marka ID değeri

**Yetkilendirme:** JWT Token gerekli

**Başarılı Yanıt:**
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
- `403 Forbidden`: Kullanıcı bu işlemi yapma yetkisine sahip değil
- `404 Not Found`: Belirtilen ID'li tamirci veya desteklenen araç bulunamadı
- `500 Internal Server Error`: Sunucu hatası

### 8. Tamircinin Desteklediği Araçları Toplu Güncelleme

Tamircinin desteklediği araç listesini toplu olarak günceller. Mevcut desteklenen araçlar listesi, istek gövdesindeki liste ile değiştirilir. İsteği yapan kullanıcı, tamircinin sahibi olmalıdır. `mechanic_id` URL'deki `:id` parametresinden alınır.

**URL:** `PATCH /mechanics/:id/supported-vehicles`

**Parametreler:**
- `id` (path): Tamirci ID değeri

**Yetkilendirme:** JWT Token gerekli, Tamirci Sahibi Olmalı (MechanicOwnerGuard)

**İstek Gövdesi:**
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

**Başarılı Yanıt:**
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
  {
    "id": "sv5-uuid-9012",
    "mechanic_id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
    "brand_id": "br5-uuid-1234",
    "brands": {
      "id": "br5-uuid-1234",
      "name": "Honda"
    }
  }
]
```

**Hata Yanıtları:**
- `401 Unauthorized`: Geçersiz veya eksik yetkilendirme
- `403 Forbidden`: Kullanıcı bu işlemi yapma yetkisine sahip değil
- `404 Not Found`: Belirtilen ID'li tamirci veya istekteki markalardan biri bulunamadı
- `400 Bad Request`: Geçersiz istek gövdesi (örn: boş dizi, `brand_id` eksik veya geçersiz)
- `500 Internal Server Error`: Sunucu hatası

### 9. Tamircinin Çalışma Saatlerini Getirme

Bir tamircinin çalışma saatlerini listeler. İsteği yapan kullanıcı, tamircinin sahibi olmalıdır.

**URL:** `GET /mechanics/:id/working-hours`

**Parametreler:**
- `id` (path): Tamirci ID değeri

**Yetkilendirme:** JWT Token gerekli, Tamirci Sahibi Olmalı (MechanicOwnerGuard)

**Başarılı Yanıt:**
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
  {
    "id": "wh2-uuid-5678",
    "mechanic_id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
    "day_of_week": 2,
    "start_time": "09:00",
    "end_time": "18:00",
    "slot_duration": 30,
    "is_day_off": false
  }
]
```

**Hata Yanıtları:**
- `401 Unauthorized`: Geçersiz veya eksik yetkilendirme
- `403 Forbidden`: Kullanıcı bu tamircinin bilgilerine erişim yetkisine sahip değil
- `404 Not Found`: Belirtilen ID'li tamirci bulunamadı
- `500 Internal Server Error`: Sunucu hatası

### 10. Tamirciye Çalışma Saati Ekleme

Bir tamirciye çalışma saati ekler (veya mevcut günü günceller - upsert). İsteği yapan kullanıcı, tamircinin sahibi olmalıdır. `mechanic_id` URL'deki `:id` parametresinden alınır.

**URL:** `POST /mechanics/:id/working-hours`

**Parametreler:**
- `id` (path): Tamirci ID değeri

**Yetkilendirme:** JWT Token gerekli, Tamirci Sahibi Olmalı (MechanicOwnerGuard)

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
  {
    "day_of_week": 3,
    "start_time": "09:00",
    "end_time": "18:00",
    "slot_duration": 30,
    "is_day_off": false
  },
  {
    "day_of_week": 4,
    "start_time": "09:00",
    "end_time": "18:00",
    "slot_duration": 30,
    "is_day_off": false
  },
  {
    "day_of_week": 6,         // Örnek: Cumartesi tatil
    "start_time": "00:00",    // Tatil günü saatler önemsiz
    "end_time": "00:00",
    "slot_duration": 60,      // Tatil günü süre önemsiz
    "is_day_off": true
  }
]
```

**Başarılı Yanıt (Tekil):**
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

**Başarılı Yanıt (Çoklu):**
```json
[
  {
    "id": "wh3-uuid-1234",
    "mechanic_id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
    "day_of_week": 3,
    "start_time": "09:00",
    "end_time": "18:00",
    "slot_duration": 30,
    "is_day_off": false
  },
  {
    "id": "wh4-uuid-5678",
    "mechanic_id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
    "day_of_week": 4,
    "start_time": "09:00",
    "end_time": "18:00",
    "slot_duration": 30,
    "is_day_off": false
  },
  {
    "id": "wh5-uuid-9012",
    "mechanic_id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
    "day_of_week": 6,
    "start_time": "00:00",
    "end_time": "00:00",
    "slot_duration": 60,
    "is_day_off": true
  }
]
```

**Hata Yanıtları:**
- `401 Unauthorized`: Geçersiz veya eksik yetkilendirme
- `403 Forbidden`: Kullanıcı bu tamirciye çalışma saati ekleme yetkisine sahip değil
- `404 Not Found`: Belirtilen ID'li tamirci bulunamadı
- `400 Bad Request`: Geçersiz istek gövdesi (örn: zorunlu alan eksik, format hatası)
- `500 Internal Server Error`: Sunucu hatası

### 11. Tamircinin Çalışma Saatini Güncelleme

Bir tamircinin belirli bir çalışma saatini (ID ile belirtilen) günceller. İsteği yapan kullanıcı, tamircinin sahibi olmalıdır.

**URL:** `PATCH /mechanics/:id/working-hours/:hourId`

**Parametreler:**
- `id` (path): Tamirci ID değeri
- `hourId` (path): Çalışma saati ID değeri

**Yetkilendirme:** JWT Token gerekli, Tamirci Sahibi Olmalı (MechanicOwnerGuard)

**İstek Gövdesi:** (Güncellenmek istenen alanları içerir)
```json
{
  "start_time": "10:00",    // İsteğe bağlı (HH:MM formatı)
  "end_time": "19:00",      // İsteğe bağlı (HH:MM formatı)
  "slot_duration": 45,      // İsteğe bağlı (dakika cinsinden, min 15)
  "is_day_off": false       // İsteğe bağlı (boolean)
}
```

**Başarılı Yanıt:**
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
- `403 Forbidden`: Kullanıcı bu işlemi yapma yetkisine sahip değil
- `404 Not Found`: Belirtilen ID'li tamirci veya çalışma saati (`hourId`) bulunamadı
- `400 Bad Request`: Geçersiz istek gövdesi (örn: format hatası)
- `500 Internal Server Error`: Sunucu hatası

### 12. Tamircinin Çalışma Saatini Silme

Bir tamircinin belirli bir çalışma saatini siler. İsteği yapan kullanıcı, tamircinin sahibi olmalıdır.

**URL:** `DELETE /mechanics/:id/working-hours/:hourId`

**Parametreler:**
- `id` (path): Tamirci ID değeri
- `hourId` (path): Çalışma saati ID değeri

**Yetkilendirme:** JWT Token gerekli

**Başarılı Yanıt:**
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
- `403 Forbidden`: Kullanıcı bu işlemi yapma yetkisine sahip değil
- `404 Not Found`: Belirtilen ID'li tamirci veya çalışma saati bulunamadı
- `500 Internal Server Error`: Sunucu hatası

### 13. Tamircinin Kategorilerini Getirme

Bir tamircinin hizmet verdiği kategorileri listeler. İsteği yapan kullanıcı, tamircinin sahibi olmalıdır.

**URL:** `GET /mechanics/:id/categories`

**Parametreler:**
- `id` (path): Tamirci ID değeri

**Yetkilendirme:** JWT Token gerekli, Tamirci Sahibi Olmalı (MechanicOwnerGuard)

**Başarılı Yanıt:**
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
  {
    "id": "mc2-uuid-5678",
    "mechanic_id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
    "category_id": "cat2-uuid-9012",
    "categories": {
      "id": "cat2-uuid-9012",
      "name": "Fren Sistemi"
    }
  }
]
```

**Hata Yanıtları:**
- `401 Unauthorized`: Geçersiz veya eksik yetkilendirme
- `403 Forbidden`: Kullanıcı bu tamircinin bilgilerine erişim yetkisine sahip değil
- `404 Not Found`: Belirtilen ID'li tamirci bulunamadı
- `500 Internal Server Error`: Sunucu hatası

### 14. Tamirciye Kategori Ekleme

Bir tamirciye kategori ekler. İsteği yapan kullanıcı, tamircinin sahibi olmalıdır. `mechanic_id` URL'deki `:id` parametresinden alınır.

**URL:** `POST /mechanics/:id/categories`

**Parametreler:**
- `id` (path): Tamirci ID değeri

**Yetkilendirme:** JWT Token gerekli, Tamirci Sahibi Olmalı (MechanicOwnerGuard)

**İstek Gövdesi (Tekil):**
```json
{
  "category_id": "cat3-uuid-3456" // Zorunlu
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

**Başarılı Yanıt (Tekil):**
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

**Başarılı Yanıt (Çoklu):**
```json
[
  {
    "id": "mc3-uuid-1234",
    "mechanic_id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
    "category_id": "cat3-uuid-3456",
    "categories": {
      "id": "cat3-uuid-3456",
      "name": "Elektrik Sistemleri"
    }
  },
  {
    "id": "mc4-uuid-5678",
    "mechanic_id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
    "category_id": "cat4-uuid-7890",
    "categories": {
      "id": "cat4-uuid-7890",
      "name": "Klima Sistemleri"
    }
  }
]
```

**Hata Yanıtları:**
- `401 Unauthorized`: Geçersiz veya eksik yetkilendirme
- `403 Forbidden`: Kullanıcı bu tamirciye kategori ekleme yetkisine sahip değil
- `404 Not Found`: Belirtilen ID'li tamirci veya kategori bulunamadı
- `400 Bad Request`: Geçersiz istek gövdesi (örn: `category_id` eksik veya geçersiz)
- `500 Internal Server Error`: Sunucu hatası

### 15. Tamircinin Kategorisini Silme

Bir tamircinin belirli bir kategorisini siler. İsteği yapan kullanıcı, tamircinin sahibi olmalıdır.

**URL:** `DELETE /mechanics/:id/categories/:categoryId`

**Parametreler:**
- `id` (path): Tamirci ID değeri
- `categoryId` (path): Kategori ID değeri

**Yetkilendirme:** JWT Token gerekli, Tamirci Sahibi Olmalı (MechanicOwnerGuard)

**Başarılı Yanıt:** (Silinen kaydın bilgileri döner)
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
- `403 Forbidden`: Kullanıcı bu işlemi yapma yetkisine sahip değil
- `404 Not Found`: Belirtilen ID'li tamirci veya tamirciye ait belirtilen kategori kaydı bulunamadı
- `500 Internal Server Error`: Sunucu hatası

### 16. Tamircinin Kategorilerini Toplu Güncelleme

Tamircinin kategorilerini toplu olarak günceller. Mevcut kategoriler listesi, istek gövdesindeki liste ile değiştirilir. İsteği yapan kullanıcı, tamircinin sahibi olmalıdır. `mechanic_id` URL'deki `:id` parametresinden alınır.

**URL:** `PATCH /mechanics/:id/categories`

**Parametreler:**
- `id` (path): Tamirci ID değeri

**Yetkilendirme:** JWT Token gerekli, Tamirci Sahibi Olmalı (MechanicOwnerGuard)

**İstek Gövdesi:**
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

**Başarılı Yanıt:** (Güncellenmiş kategori listesi döner)
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
  {
    "id": "mc5-uuid-9012",
    "mechanic_id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
    "category_id": "cat5-uuid-1234",
    "categories": {
      "id": "cat5-uuid-1234",
      "name": "Şanzıman Tamiri"
    }
  }
]
```

**Hata Yanıtları:**
- `401 Unauthorized`: Geçersiz veya eksik yetkilendirme
- `403 Forbidden`: Kullanıcı bu işlemi yapma yetkisine sahip değil
- `404 Not Found`: Belirtilen ID'li tamirci veya istekteki kategorilerden biri bulunamadı
- `400 Bad Request`: Geçersiz istek gövdesi (örn: boş dizi, `category_id` eksik veya geçersiz)
- `500 Internal Server Error`: Sunucu hatası

## Data Modelleri

### MechanicProfileDto
```typescript
{
  user_id?: string;       // İlişkilendirilmiş kullanıcı ID'si (POST işleminde otomatik atanır, PATCH işleminde isteğe bağlı)
  business_name: string;  // Tamirci işletme adı (Zorunlu)
  on_site_service?: boolean; // Yerinde servis hizmeti sunuyorsa true (İsteğe bağlı)
}
```

### MechanicWorkingHoursDto
```typescript
{
  mechanic_id?: string;   // Tamirci ID'si (POST/PATCH işlemlerinde URL'den alınır, istek gövdesinde gönderilmez)
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
  mechanic_id: string;    // Tamirci ID'si (POST/PATCH işlemlerinde URL'den alınır, istek gövdesinde gönderilmez)
  brand_id: string;       // Marka ID'si (Zorunlu)
}
```
**Not:** `POST /mechanics/:id/supported-vehicles` ve `PATCH /mechanics/:id/supported-vehicles` endpointlerinde istek gövdesi sadece `brand_id` içerir. `mechanic_id` URL'den alınır.

### MechanicCategoryDto
```typescript
{
  mechanic_id: string;    // Tamirci ID'si (POST/PATCH işlemlerinde URL'den alınır, istek gövdesinde gönderilmez)
  category_id: string;    // Kategori ID'si (Zorunlu)
}
```
**Not:** `POST /mechanics/:id/categories` ve `PATCH /mechanics/:id/categories` endpointlerinde istek gövdesi sadece `category_id` içerir. `mechanic_id` URL'den alınır.
