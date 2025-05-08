# Bildirim Sistemi API Dokümantasyonu

Bu doküman, Sana İyi Usta uygulamasının bildirim sistemini ve ilgili API endpointlerini açıklar.

## Genel Bakış

Bildirim sistemi, kullanıcılara çeşitli olaylar hakkında bilgi vermek için tasarlanmıştır. Bildirimler veritabanında saklanır ve isteğe bağlı olarak Firebase Cloud Messaging (FCM) aracılığıyla mobil push bildirimleri olarak da gönderilir.

## Otomatik Bildirim Türleri

Sistem, aşağıdaki durumlarda otomatik olarak bildirim oluşturur:

### 1. Randevu Bildirimleri

| Olay | Alıcı | Açıklama |
|------|-------|----------|
| Randevu Oluşturma | Tamirci | Müşteri yeni bir randevu oluşturduğunda tamirciye bildirim gönderilir |
| Randevu Onayı | Müşteri | Tamirci randevuyu onayladığında müşteriye bildirim gönderilir |
| Randevu İptali (Müşteri) | Tamirci | Müşteri randevuyu iptal ettiğinde tamirciye bildirim gönderilir |
| Randevu İptali (Tamirci) | Müşteri | Tamirci randevuyu iptal ettiğinde müşteriye bildirim gönderilir |
| Randevu Tamamlama | Müşteri | Tamirci randevuyu tamamladığında müşteriye bildirim gönderilir |
| Randevu Hatırlatması | Müşteri | Randevu tarihinden bir gün önce müşteriye hatırlatma bildirimi gönderilir |

### 2. Bakım Kayıt Bildirimleri

| Olay | Alıcı | Açıklama |
|------|-------|----------|
| Bakım Kaydı Oluşturma | Müşteri | Tamirci bir bakım kaydı oluşturduğunda müşteriye bildirim gönderilir |
| Bakım Hatırlatması | Müşteri | Aracın periyodik bakım zamanı yaklaştığında müşteriye otomatik bildirim gönderilir (her gün 10:00'da kontrol edilir) |

### 3. Mesaj Bildirimleri

| Olay | Alıcı | Açıklama |
|------|-------|----------|
| Yeni Mesaj | Mesajın Alıcısı | Bir kullanıcı mesaj gönderdiğinde, alıcıya bildirim gönderilir (5 dakika içinde tekrar bildirim gönderilmez) |

### 4. Değerlendirme Bildirimleri

| Olay | Alıcı | Açıklama |
|------|-------|----------|
| Yeni Değerlendirme | Tamirci | Müşteri bir değerlendirme yaptığında tamirciye bildirim gönderilir |

### 5. Kampanya Bildirimleri

| Olay | Alıcı | Açıklama |
|------|-------|----------|
| Yeni Kampanya | Müşteriler | Tamirci yeni bir kampanya oluşturduğunda hedef kitleye (aynı şehirde belirli araçlara sahip müşteriler) bildirim gönderilir |

## Bildirim API Endpointleri

Kullanıcılar, aşağıdaki API endpointleri aracılığıyla bildirimlerini yönetebilirler:

### Bildirimleri Listeleme

```
GET /notifications
```

Oturum açmış kullanıcının tüm bildirimlerini getirir. Bildirimler oluşturulma tarihine göre azalan sırayla listelenir.

**Cevap örneği:**

```json
[
  {
    "id": "uuid",
    "user_id": "uuid",
    "message": "Bildirim metni",
    "type": "appointment_created",
    "is_read": false,
    "created_at": "2023-01-01T12:00:00Z",
    "updated_at": "2023-01-01T12:00:00Z"
  },
  ...
]
```

### Tüm Bildirimleri Okundu İşaretleme

```
PATCH /notifications/mark-read-all
```

Kullanıcının tüm okunmamış bildirimlerini okundu olarak işaretler.

**Cevap örneği:**

```json
{
  "success": true,
  "count": 3,
  "message": "3 bildirim okundu olarak işaretlendi"
}
```

### Tek Bildirim Okundu İşaretleme

```
PATCH /notifications/:id/mark-read
```

Belirtilen bildirimi okundu olarak işaretler.

**Cevap örneği:**

```json
{
  "success": true,
  "message": "Bildirim okundu olarak işaretlendi"
}
```

### Tüm Bildirimleri Silme
```
DELETE /notifications/delete-all
```

Kullanıcının tüm bildirimlerini siler.

**Cevap örneği:**

```json
{
  "success": true,
  "count": 5,
  "message": "5 bildirim silindi"
}
```

### Tek Bildirim Silme
```
DELETE /notifications/:id/delete
```

Belirtilen bildirimi siler.

**Cevap örneği:**

```json
{
  "success": true,
  "message": "Bildirim silindi"
}
```

## Push Bildirimleri Hakkında

Mobil cihazlara push bildirimleri Firebase Cloud Messaging (FCM) aracılığıyla gönderilir. Kullanıcının FCM token'ı varsa, ilgili bildirimler hem uygulama içinde hem de push bildirim olarak gönderilir.

Uygulama, FCM entegrasyonunun başarısız olduğu durumlarda bile çalışmaya devam eder - bildirimler veritabanında saklanır ve kullanıcı uygulamayı açtığında görüntülenebilir.

## Zamanlanmış Bildirimler

Sistem, aşağıdaki durumlarda otomatik olarak bildirimler gönderir:

- **Randevu Hatırlatmaları**: Randevu öncesinde otomatik olarak gönderilir
- **Bakım Hatırlatmaları**: Her gün saat 10:00'da kontrol edilir, yaklaşan bakımlar için bildirim gönderilir

## Teknik Notlar

1. Bildirimler hem veritabanında saklanır hem de (mümkünse) FCM aracılığıyla gönderilir
2. Eğer aynı konuşma içinde son 5 dakika içinde bir bildirim gönderildiyse, yeni mesajlar için tekrar bildirim gönderilmez
3. FCM token'ları kullanıcı oturum açtığında kaydedilir ve bildirimler için kullanılır
4. Aynı kullanıcının birden fazla cihazı varsa, tüm cihazlara bildirim gönderilir
5. FCM erişiminde sorun olması durumunda sistem simülasyon modunda çalışabilir, bu durumda bildirimlerin gönderildiği simüle edilir