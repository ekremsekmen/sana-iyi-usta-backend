# Reviews API Documentation

Bu dökümantasyon, Sana İyi Usta Uygulaması'nın değerlendirme (reviews) modülünün API endpointlerini açıklamaktadır.

## Genel Bilgiler

- Tüm istekler JWT token ile yetkilendirilmelidir
- Base URL: `/reviews`
- Tüm istekler JSON formatında veri alır ve döndürür

## Endpointler

### 1. Değerlendirme Oluşturma

**Endpoint:** `POST /reviews`

**Açıklama:** Bir randevu için yeni bir değerlendirme oluşturur. Sadece müşteri rolüne sahip kullanıcılar tarafından kullanılabilir.

**İstek Gövdesi (Request Body):**
```json
{
  "appointment_id": "UUID",
  "rating": 5,
  "review": "Çok iyi hizmet aldım, teşekkürler."
}
```

**Yanıt (Response):**
```json
{
  "id": "UUID",
  "appointment_id": "UUID",
  "mechanic_id": "UUID",
  "customer_id": "UUID",
  "rating": 5,
  "review": "Çok iyi hizmet aldım, teşekkürler.",
  "mechanic_response": null,
  "created_at": "2023-01-01T12:00:00Z",
  "updated_at": "2023-01-01T12:00:00Z"
}
```

**Kısıtlamalar:**
- Sadece tamamlanmış (completed) randevular değerlendirilebilir
- Bir randevu sadece bir kez değerlendirilebilir
- Sadece kendi randevularını değerlendirebilirsin

### 2. Usta Değerlendirmelerini Getirme (Kendisi için)

**Endpoint:** `GET /reviews/mechanics/me`

**Açıklama:** Giriş yapmış olan ustanın tüm değerlendirmelerini getirir.

**Yanıt (Response):**
```json
{
  "reviews": [
    {
      "id": "UUID",
      "rating": 4,
      "review": "İyi bir hizmet",
      "mechanic_response": "Teşekkür ederim",
      "created_at": "2023-01-01T12:00:00Z",
      "customers": {
        "users": {
          "full_name": "Ahmet Yılmaz",
          "profile_image": "image_url"
        }
      },
      "appointments": {
        "appointment_date": "2023-01-01T10:00:00Z",
        "appointment_type": "Bakım",
        "customer_vehicles": {
          "brands": { "name": "Toyota" },
          "models": { "name": "Corolla" },
          "plate_number": "34AB1234"
        }
      }
    }
  ],
  "average_rating": 4.2,
  "total_reviews": 10,
  "rating_distribution": {
    "1": 0,
    "2": 1,
    "3": 2,
    "4": 3,
    "5": 4
  }
}
```

### 3. Usta Değerlendirmelerini ID'ye Göre Getirme

**Endpoint:** `GET /reviews/mechanics/:mechanicId`

**Açıklama:** Belirli bir ustanın tüm değerlendirmelerini getirir.

**Path Parametreleri:**
- `mechanicId`: Ustanın benzersiz ID'si

**Yanıt (Response):**
```json
[
  {
    "id": "UUID",
    "rating": 5,
    "review": "Mükemmel hizmet",
    "mechanic_response": "Teşekkürler",
    "created_at": "2023-01-01T12:00:00Z",
    "customers": {
      "users": {
        "full_name": "Mehmet Demir",
        "profile_image": "image_url"
      }
    }
  }
]
```

### 4. Değerlendirme Detayını Getirme

**Endpoint:** `GET /reviews/:id`

**Açıklama:** Belirli bir değerlendirmenin detaylarını getirir.

**Path Parametreleri:**
- `id`: Değerlendirmenin benzersiz ID'si

**Yanıt (Response):**
```json
{
  "id": "UUID",
  "rating": 4,
  "review": "Hızlı ve kaliteli hizmet",
  "mechanic_response": "Bizi tercih ettiğiniz için teşekkürler",
  "created_at": "2023-01-01T12:00:00Z",
  "customers": {
    "users": {
      "full_name": "Ali Veli",
      "profile_image": "image_url"
    }
  },
  "mechanics": {
    "users": {
      "full_name": "Uğur Usta",
      "profile_image": "image_url"
    }
  }
}
```

### 5. Değerlendirme Güncelleme

**Endpoint:** `PUT /reviews/:id`

**Açıklama:** Bir değerlendirmeyi günceller. Sadece değerlendirmeyi oluşturan müşteri tarafından kullanılabilir.

**Path Parametreleri:**
- `id`: Değerlendirmenin benzersiz ID'si

**İstek Gövdesi (Request Body):**
```json
{
  "rating": 4,
  "review": "Hizmet iyiydi ama biraz gecikmeli oldu"
}
```

**Yanıt (Response):**
```json
{
  "id": "UUID",
  "rating": 4,
  "review": "Hizmet iyiydi ama biraz gecikmeli oldu",
  "mechanic_response": "Önceki yanıt varsa korunur",
  "created_at": "2023-01-01T12:00:00Z",
  "updated_at": "2023-01-02T12:00:00Z"
}
```

### 6. Değerlendirmeye Usta Yanıtı Ekleme

**Endpoint:** `POST /reviews/:id/responses`

**Açıklama:** Bir değerlendirmeye usta yanıtı ekler. Sadece değerlendirilen usta tarafından kullanılabilir.

**Path Parametreleri:**
- `id`: Değerlendirmenin benzersiz ID'si

**İstek Gövdesi (Request Body):**
```json
{
  "mechanic_response": "Geri bildiriminiz için teşekkür ederiz. Gelecekte daha iyi hizmet sunmak için çalışacağız."
}
```

**Yanıt (Response):**
```json
{
  "id": "UUID",
  "rating": 4,
  "review": "Orjinal değerlendirme metni",
  "mechanic_response": "Geri bildiriminiz için teşekkür ederiz. Gelecekte daha iyi hizmet sunmak için çalışacağız.",
  "updated_at": "2023-01-02T12:00:00Z"
}
```

### 7. Değerlendirme Silme

**Endpoint:** `DELETE /reviews/:id`

**Açıklama:** Bir değerlendirmeyi siler. Sadece değerlendirmeyi oluşturan müşteri tarafından kullanılabilir.

**Path Parametreleri:**
- `id`: Değerlendirmenin benzersiz ID'si

**Yanıt (Response):**
```json
{
  "message": "Değerlendirme başarıyla silindi"
}
```

### 8. Kullanıcının Kendi Değerlendirmelerini Getirme

**Endpoint:** `GET /reviews/me`

**Açıklama:** Giriş yapmış olan müşterinin oluşturduğu tüm değerlendirmeleri getirir.

**Yanıt (Response):**
```json
[
  {
    "id": "UUID",
    "rating": 5,
    "review": "Çok memnun kaldım",
    "mechanic_response": "Teşekkürler",
    "created_at": "2023-01-01T12:00:00Z",
    "mechanics": {
      "users": {
        "full_name": "Cem Usta",
        "profile_image": "image_url"
      }
    },
    "appointments": {
      "appointment_date": "2023-01-01T10:00:00Z",
      "appointment_type": "Bakım",
      "service_location": "Atölye"
    }
  }
]
```
