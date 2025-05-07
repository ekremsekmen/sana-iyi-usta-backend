# Randevu Modülü API Dokümantasyonu

Bu doküman, Sana İyi Usta uygulamasındaki randevu işlemlerine ait API endpointlerini açıklamaktadır.

## Genel Bilgiler

- Tüm endpointler JWT korumalıdır (`JwtGuard`)
- URL tabanı: `/appointments`

## Endpointler


 !!!!! BURAYI YENİ EKLEDİM İŞİNE YARAYACAK RANDEVU DETAYLARINDA ARAÇ BAKIM KAYITLARINI 
 !!!!!                      DA GETİRİYOR                 !!!!!!!!!
 

### 8. Randevu Detaylarını Getirme

Bir randevunun tüm detaylarını (araç bakım kayıtları dahil) gösterir.

**URL:** `GET /appointments/details/:id`  
**URL Parametreleri:** `id` - Randevu ID'si

**Başarılı Yanıt:**
```json
{
  "id": "UUID",
  "mechanic_id": "UUID",
  "customer_id": "UUID",
  "vehicle_id": "UUID",
  "appointment_date": "2023-10-20T14:00:00Z",
  "start_time": "2023-10-20T14:00:00Z",
  "end_time": "2023-10-20T15:00:00Z",
  "status": "pending",
  "description": "Araç bakımı yapılacak",
  "appointment_type": "AT_SERVICE",
  "location_id": "UUID",
  "created_at": "2023-10-15T10:30:00Z",
  "mechanics": {
    "users": {
      "id": "UUID",
      "full_name": "Ahmet Usta",
      "profile_image": "url_to_image",
      "phone_number": "+905551234567"
    }
  },
  "customers": {
    "users": {
      "id": "UUID",
      "full_name": "Mehmet Müşteri",
      "profile_image": "url_to_image",
      "phone_number": "+905559876543"
    }
  },
  "locations": {
    "id": "UUID",
    "address": "Örnek Mah. Test Sok. No:1",
    "latitude": 41.0082,
    "longitude": 28.9784,
    "city": "İstanbul",
    "district": "Kadıköy"
  },
  "customer_vehicles": {
    "brands": {
      "name": "Toyota"
    },
    "models": {
      "name": "Corolla"
    },
    "variants": {
      "name": "1.6 Vision"
    },
    "model_years": {
      "year": 2020
    }
  },
  "vehicle_maintenance_records": {
    "id": "UUID",
    "service_date": "2023-10-20T15:00:00Z",
    "details": "Yağ değişimi, filtre değişimi ve genel kontroller yapıldı",
    "cost": 1500.00,
    "odometer": 45000,
    "next_due_date": "2024-04-20T00:00:00Z"
  },
  "ratings_reviews": {
    "id": "UUID",
    "rating": 4.5,
    "review": "Servis çok iyiydi, teşekkürler",
    "created_at": "2023-10-21T10:00:00Z",
    "mechanic_response": "Bizi tercih ettiğiniz için teşekkürler!"
  }
}
```

**Not:** Bu endpoint, kullanıcı rolüne bağlı olarak erişim kontrolü yapar. Sadece randevuya ait müşteri veya tamirci bu bilgileri görüntüleyebilir.

**Yetki Kontrolü:**
- Müşteri: Sadece kendi randevularını görüntüleyebilir
- Tamirci: Sadece kendisine ait randevuları görüntüleyebilir

**Hata Yanıtları:**
- `404 Not Found`: Randevu bulunamadı
- `403 Forbidden`: Bu randevuyu görüntüleme yetkiniz yok



--------------------------------------------------------------------




### 1. Randevu Oluşturma

Müşterilerin yeni bir randevu oluşturması için kullanılır.

**URL:** `POST /appointments`  
**Rol Kısıtlaması:** Sadece `customer` rolündeki kullanıcılar erişebilir

**Request Body:**
```json
{
  "mechanic_id": "UUID",
  "vehicle_id": "UUID",
  "start_time": "2023-10-20T14:00:00Z",
  "end_time": "2023-10-20T15:00:00Z",
  "description": "Araç bakımı yapılacak",
  "appointment_type": "AT_SERVICE | ON_SITE"
}
```

**Not:** Location bilgisi sistem tarafından otomatik olarak atanır. "AT_SERVICE" ise mechanic in konumunda, ON_SITE ise customer ın konumunda olur.

**Başarılı Yanıt:** 
```json
{
  "id": "UUID",
  "mechanic_id": "UUID",
  "customer_id": "UUID",
  "vehicle_id": "UUID",
  "appointment_date": "2023-10-20T14:00:00Z",
  "start_time": "2023-10-20T14:00:00Z",
  "end_time": "2023-10-20T15:00:00Z",
  "status": "pending",
  "description": "Araç bakımı yapılacak",
  "appointment_type": "AT_SERVICE",
  "location_id": "UUID",
  "created_at": "2023-10-15T10:30:00Z",
  "updated_at": "2023-10-15T10:30:00Z"
}
```

### 2. Uygun Zaman Aralıklarını Getirme

Belirli bir tamirci için uygun randevu saatlerini getirir.

**URL:** `POST /appointments/mechanic-available-slots`  

**Request Body:**
```json
{
  "mechanic_id": "UUID",
  "date": "2023-10-20",
  "appointment_type": "AT_SERVICE | ON_SITE (opsiyonel)"
}
```

**Başarılı Yanıt:**
```json
[
  {
    "start_time": "2023-10-20T09:00:00Z",
    "end_time": "2023-10-20T10:00:00Z",
    "available": true
  },
  {
    "start_time": "2023-10-20T10:00:00Z",
    "end_time": "2023-10-20T11:00:00Z",
    "available": false
  },
  // ...diğer zaman aralıkları
]
```

### 3. Müşteri Randevularını Getirme

Giriş yapmış müşterinin kendi randevularını listeler.

**URL:** `GET /appointments/customer-appointments`  
**Rol Kısıtlaması:** Müşteri rolündeki kullanıcılar için

**Başarılı Yanıt:**
```json
[
  {
    "id": "UUID",
    "start_time": "2023-10-20T14:00:00Z",
    "end_time": "2023-10-20T15:00:00Z",
    "status": "pending",
    "description": "Araç bakımı yapılacak",
    "appointment_type": "AT_SERVICE",
    "mechanics": {
      "id": "UUID",
      "users": {
        "id": "UUID",
        "name": "Ahmet Usta",
        // ...diğer kullanıcı bilgileri
      }
    },
    "locations": {
      "id": "UUID",
      "name": "Ana Servis",
      // ...diğer lokasyon bilgileri
    },
    "customer_vehicles": {
      "id": "UUID",
      "brands": {
        "name": "Toyota"
      },
      "models": {
        "name": "Corolla"
      },
      // ...diğer araç bilgileri
    }
  },
  // ...diğer randevular
]
```

### 4. Tamirci Randevularını Getirme

Giriş yapmış tamircinin kendi randevularını listeler.

**URL:** `GET /appointments/mechanic-appointments`  
**Rol Kısıtlaması:** Tamirci rolündeki kullanıcılar için

**Başarılı Yanıt:**
```json
[
  {
    "id": "UUID",
    "start_time": "2023-10-20T14:00:00Z",
    "end_time": "2023-10-20T15:00:00Z",
    "status": "pending",
    "description": "Araç bakımı yapılacak",
    "appointment_type": "AT_SERVICE",
    "customers": {
      "id": "UUID",
      "users": {
        "id": "UUID",
        "name": "Mehmet Müşteri",
        // ...diğer kullanıcı bilgileri
      }
    },
    "locations": {
      "id": "UUID",
      "name": "Ana Servis",
      // ...diğer lokasyon bilgileri
    },
    "customer_vehicles": {
      "id": "UUID",
      "brands": {
        "name": "Toyota"
      },
      "models": {
        "name": "Corolla"
      },
      // ...diğer araç bilgileri
    }
  },
  // ...diğer randevular
]
```

### 5. Randevu İptal Etme

Müşteri veya tamirci randevuyu iptal edebilir.

**URL:** `PATCH /appointments/:id/cancel`  
**URL Parametreleri:** `id` - Randevu ID'si

**Başarılı Yanıt:**
```json
{
  "id": "UUID",
  "status": "canceled",
  // ...diğer randevu bilgileri
}
```

### 6. Randevu Onaylama

Tamirci, bekleyen bir randevuyu onaylayabilir.

**URL:** `PATCH /appointments/:id/approve`  
**URL Parametreleri:** `id` - Randevu ID'si
**Rol Kısıtlaması:** Sadece tamirci rolündeki kullanıcılar erişebilir

**Başarılı Yanıt:**
```json
{
  "id": "UUID",
  "status": "confirmed",
  // ...diğer randevu bilgileri
}
```

### 7. Randevu Tamamlama

Tamirci, onaylanmış bir randevuyu tamamlayabilir.

**URL:** `PATCH /appointments/:id/complete`  
**URL Parametreleri:** `id` - Randevu ID'si
**Rol Kısıtlaması:** Sadece tamirci rolündeki kullanıcılar erişebilir

**Başarılı Yanıt:**
```json
{
  "id": "UUID",
  "status": "completed",
  // ...diğer randevu bilgileri
}
```

## Veri Modelleri

### CreateAppointmentDto

```typescript
{
  mechanic_id: string; // UUID
  vehicle_id: string; // UUID
  start_time: string; // ISO DateTime
  end_time: string; // ISO DateTime
  description?: string; // Opsiyonel
  appointment_type: AppointmentType; // "AT_SERVICE" | "ON_SITE"
}
```

### GetAvailableSlotsDto

```typescript
{
  mechanic_id: string; // UUID
  date: string; // ISO Date
  appointment_type?: AppointmentType; // Opsiyonel
}
```

## Durum Kodları

- `200 OK`: İşlem başarılı
- `201 Created`: Randevu başarıyla oluşturuldu
- `400 Bad Request`: Hatalı istek (geçersiz veri formatı vb.)
- `401 Unauthorized`: Yetkilendirme hatası (token yok veya geçersiz)
- `403 Forbidden`: İzin hatası (gerekli role sahip değil)
- `404 Not Found`: Kaynak bulunamadı (randevu, mekanik vb.)
- `409 Conflict`: Çakışma hatası (seçilen zaman aralığı dolu vb.)
- `500 Internal Server Error`: Sunucu hatası
