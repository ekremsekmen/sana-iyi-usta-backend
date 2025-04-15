# Sana İyi Usta API Dokümantasyonu

Bu dokümantasyon, Sana İyi Usta uygulamasının backend API'lerini tanımlar. Tüm endpoint'ler, gerekli parametre bilgileri, örnek istek ve yanıtlar burada listelenmiştir.

## Kimlik Doğrulama (Authentication) API'leri

Kimlik doğrulama ve kullanıcı yönetimi için gerekli tüm API'ler.

### Mevcut Endpoint'ler

| Method | Endpoint                  | Açıklama                          |
|:------:|:--------------------------|:----------------------------------|
| POST   | `/auth/register`          | Yeni kullanıcı kaydı              |
| GET    | `/auth/verify-email`      | E-posta doğrulama                 |
| POST   | `/auth/login`             | E-posta ve şifre ile giriş        |
| POST   | `/auth/refresh`           | Access token yenileme             |
| POST   | `/auth/logout`            | Kullanıcı oturumunu sonlandırma   |
| POST   | `/auth/google/mobile`     | Google hesabı ile giriş           |
| POST   | `/auth/apple/mobile`      | Apple ID ile giriş                |
| POST   | `/auth/facebook/mobile`   | Facebook hesabı ile giriş         |
| POST   | `/auth/forgot-password`   | Şifre sıfırlama kodu gönderme     |
| POST   | `/auth/verify-reset-code` | Şifre sıfırlama kodu doğrulama    |
| POST   | `/auth/reset-password`    | Şifre sıfırlama (yeni şifre)      |
| POST   | `/auth/change-password`   | Şifre değiştirme (giriş sonrası)  |

### Kullanıcı Kaydı

Yeni bir kullanıcı hesabı oluşturur.

- **URL**: `/auth/register`
- **Method**: `POST`
- **Content-Type**: `application/json`

**İstek (Request)**

```json
{
  "full_name": "Mehmet Yılmaz",
  "e_mail": "mehmet@example.com",
  "password": "guvenli-parola123",
  "role": "customer",  // "customer" veya "mechanic" veya "admin"
  "auth_provider": "local",
  "kvkk_approved": true,
  "terms_approved": true
}
```

**Başarılı Yanıt (201 Created)**

```json
{
  "userId": "8f7d6e5c-4b3a-2a1c-9f8e-7d6c5b4a3f2e",
  "verificationEmailSent": true
}
```

**Hata Yanıtı (400 Bad Request)**

```json
{
  "statusCode": 400,
  "message": "Şifre zorunludur"
}
```

**Hata Yanıtı (409 Conflict)**

```json
{
  "statusCode": 409,
  "message": "Bu hesap zaten mevcut"
}
```

### Email Doğrulama

Kayıt olduktan gönderilen e-posta linki ile e posta doğrular.

- **URL**: `/auth/verify-email`
- **Method**: `GET`
- **Query Parametresi**: `token=[doğrulama_token]`

**Başarılı Yanıt (200 OK)**

```json
{
  "redirectUrl": "sanaiyi-usta://email-verified?email=mehmet@example.com&status=success"
}
```

> **Not**: Doğrulama işlemi başarılı olduğunda, sistem kullanıcıyı otomatik olarak mobil uygulamaya yönlendirir. Yanıtta dönen `redirectUrl` bir deep link (derin bağlantı) içerir ve `sanaiyi-usta://` protokolü ile mobil uygulamayı açar. Uygulama bu bağlantıyı yakalayarak doğrulama durumunu işler ve kullanıcıya başarılı doğrulama mesajı gösterir.

**Hata Yanıtı (400 Bad Request)**

```json
{
  "statusCode": 400,
  "message": "Doğrulama bağlantısının süresi dolmuş"
}
```

**Hata Yanıtı (404 Not Found)**

```json
{
  "statusCode": 404,
  "message": "Geçersiz doğrulama bağlantısı"
}
```

### Yerel Giriş (Local Login)

E-posta ve parola ile kullanıcı girişi yapar.

- **URL**: `/auth/login`
- **Method**: `POST`
- **Content-Type**: `application/json`

**İstek (Request)**

```json
{
  "e_mail": "mehmet@example.com",
  "password": "guvenli-parola123"
}
```

> **Not**: Parola en az 8 karakter uzunluğunda olmalıdır. Daha kısa parolalar için sistem 400 Bad Request hatası döndürür.

**Başarılı Yanıt (200 OK)**

```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refresh_token": "abcdef1234567890:ghijklmnopqrstuvwxyz1234567890...",
  "token_type": "Bearer",
  "expires_in": 900,
  "user": {
    "id": "8f7d6e5c-4b3a-2a1c-9f8e-7d6c5b4a3f2e",
    "full_name": "Mehmet Yılmaz",
    "e_mail": "mehmet@example.com",
    "role": "customer"
  }
}
```

**Hata Yanıtı (400 Bad Request)**

```json
{
  "statusCode": 400,
  "message": "Şifre en az 8 karakter olmalıdır"
}
```

**Hata Yanıtı (401 Unauthorized)**

```json
{
  "statusCode": 401,
  "message": "Geçersiz kullanıcı adı veya şifre"
}
```

veya 

```json
{
  "statusCode": 401,
  "message": "E-posta adresiniz doğrulanmamış"
}
```

### Google ile Mobil Giriş

Google OAuth2 ile mobil uygulama için kimlik doğrulama ve giriş yapar.

- **URL**: `/auth/google/mobile`
- **Method**: `POST`
- **Content-Type**: `application/json`

**İstek (Request)**

```json
{
  "accessToken": "google-oauth2-access-token",
  "providerId": "google-user-id",
  "email": "mehmet@gmail.com",
  "fullName": "Mehmet Yılmaz",
  "role": "customer",
  "kvkkApproved": true,
  "termsApproved": true
}
```

**Başarılı Yanıt (200 OK)**

```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refresh_token": "abcdef1234567890:ghijklmnopqrstuvwxyz1234567890...",
  "token_type": "Bearer",
  "expires_in": 900,
  "user": {
    "id": "8f7d6e5c-4b3a-2a1c-9f8e-7d6c5b4a3f2e",
    "full_name": "Mehmet Yılmaz",
    "e_mail": "mehmet@gmail.com",
    "role": "customer"
  }
}
```

**Hata Yanıtı (401 Unauthorized)**

```json
{
  "statusCode": 401,
  "message": "Geçersiz kullanıcı adı veya şifre"
}
```

### Apple ile Mobil Giriş

Apple ID ile mobil uygulama için kimlik doğrulama ve giriş yapar.

- **URL**: `/auth/apple/mobile`
- **Method**: `POST`
- **Content-Type**: `application/json`

**İstek (Request)**

```json
{
  "providerId": "apple-user-id",
  "email": "mehmet@icloud.com",
  "fullName": "Mehmet Yılmaz",
  "role": "customer",
  "kvkkApproved": true,
  "termsApproved": true
}
```

**Başarılı Yanıt (200 OK)**

```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refresh_token": "abcdef1234567890:ghijklmnopqrstuvwxyz1234567890...",
  "token_type": "Bearer",
  "expires_in": 900,
  "user": {
    "id": "8f7d6e5c-4b3a-2a1c-9f8e-7d6c5b4a3f2e",
    "full_name": "Mehmet Yılmaz",
    "e_mail": "mehmet@icloud.com",
    "role": "customer"
  }
}
```

**Hata Yanıtı (400 Bad Request)**

```json
{
  "statusCode": 400,
  "message": "Apple ile kimlik doğrulama başarısız"
}
```

### Facebook ile Mobil Giriş

Facebook OAuth ile mobil uygulama için kimlik doğrulama ve giriş yapar.

- **URL**: `/auth/facebook/mobile`
- **Method**: `POST`
- **Content-Type**: `application/json`

**İstek (Request)**

```json
{
  "accessToken": "facebook-access-token",
  "providerId": "facebook-user-id",
  "email": "mehmet@example.com",
  "fullName": "Mehmet Yılmaz",
  "role": "customer",
  "kvkkApproved": true,
  "termsApproved": true
}
```

**Başarılı Yanıt (200 OK)**

```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refresh_token": "abcdef1234567890:ghijklmnopqrstuvwxyz1234567890...",
  "token_type": "Bearer",
  "expires_in": 900,
  "user": {
    "id": "8f7d6e5c-4b3a-2a1c-9f8e-7d6c5b4a3f2e",
    "full_name": "Mehmet Yılmaz",
    "e_mail": "mehmet@example.com",
    "role": "customer"
  }
}
```

**Hata Yanıtı (401 Unauthorized)**

```json
{
  "statusCode": 401,
  "message": "Geçersiz kullanıcı adı veya şifre"
}
```

### Çıkış (Logout)

Kullanıcı oturumunu sonlandırır.

- **URL**: `/auth/logout`
- **Method**: `POST`
- **Content-Type**: `application/json`
- **Authorization**: `Bearer [access_token]`

**İstek (Request)**

```json
{
  "refresh_token": "abcdef1234567890:ghijklmnopqrstuvwxyz1234567890..."
}
```

**Başarılı Yanıt (200 OK)**

```json
{
  "message": "Logged out successfully",
  "status": "success"
}
```

**Hata Yanıtı (401 Unauthorized)**

```json
{
  "statusCode": 401,
  "message": "Unauthorized"
}
```

### Token Yenileme (Refresh Token)

Access token süresi dolduğunda, mobil uygulama elindeki refresh token'ı kullanarak yeni bir access token alabilir.

- **URL**: `/auth/refresh`
- **Method**: `POST`
- **Content-Type**: `application/json`

**İstek (Request)**

```json
{
  "refresh_token": "abcdef1234567890:ghijklmnopqrstuvwxyz1234567890..."
}
```

> **Not**: Mobil uygulama, giriş yaptığında aldığı refresh token'ı güvenli bir şekilde saklamalı ve access token süresi dolduğunda (15 dakika sonra) bu endpoint'e refresh token'ı göndererek yeni bir token kümesi almalıdır. Her token yenileme işlemi sonucunda yeni bir refresh token da döndürülür, bu nedenle uygulama en son aldığı refresh token'ı saklamalıdır.

**Başarılı Yanıt (200 OK)**

```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refresh_token": "newabcdef1234567890:ghijklmnopqrstuvwxyz1234567890...",
  "token_type": "Bearer",
  "expires_in": 900
}
```

**Hata Yanıtı (401 Unauthorized)**

```json
{
  "statusCode": 401,
  "message": "Geçersiz veya süresi dolmuş refresh token"
}
```

### Şifre Sıfırlama - 1. Aşama (Sıfırlama Talebi)

Kullanıcı şifresini unuttuğunda, e-posta adresini kullanarak şifre sıfırlama sürecini başlatır. Sistem, kullanıcının e-posta adresine 6 haneli bir doğrulama kodu gönderir.

- **URL**: `/auth/forgot-password`
- **Method**: `POST`
- **Content-Type**: `application/json`

**İstek (Request)**

```json
{
  "email": "mehmet@example.com"
}
```

**Başarılı Yanıt (200 OK)**

```json
{
  "message": "Şifre sıfırlama kodu e-posta adresinize gönderildi",
  "status": "success"
}
```

**Sosyal Medya Hesabı Yanıtı (200 OK)**

```json
{
  "message": "Bu hesap sadece sosyal medya ile giriş yapmaktadır. Lütfen sosyal giriş yöntemini kullanın.",
  "status": "social_auth_only",
  "socialProviders": ["google", "facebook", "icloud"]
}
```

**Hata Yanıtı (404 Not Found)**

```json
{
  "statusCode": 404,
  "message": "Bu e-posta adresi ile kayıtlı bir hesap bulunamadı"
}
```

### Şifre Sıfırlama - 2. Aşama (Kod Doğrulama)

Kullanıcı, e-posta adresine gönderilen 6 haneli doğrulama kodunu girerek doğrular.

- **URL**: `/auth/verify-reset-code`
- **Method**: `POST`
- **Content-Type**: `application/json`

**İstek (Request)**

```json
{
  "email": "mehmet@example.com",
  "code": "123456"
}
```

**Başarılı Yanıt (200 OK)**

```json
{
  "message": "Doğrulama kodu geçerli. Yeni şifrenizi belirleyebilirsiniz.",
  "status": "success",
  "isValid": true
}
```

**Hata Yanıtı (400 Bad Request)**

```json
{
  "message": "Geçersiz doğrulama kodu",
  "status": "error",
  "isValid": false
}
```

veya

```json
{
  "message": "Doğrulama kodunun süresi dolmuş",
  "status": "error",
  "isValid": false
}
```

### Şifre Sıfırlama - 3. Aşama (Yeni Şifre Belirleme)

Kullanıcı, doğrulanmış kod ile birlikte yeni şifresini belirler.

- **URL**: `/auth/reset-password`
- **Method**: `POST`
- **Content-Type**: `application/json`

**İstek (Request)**

```json
{
  "email": "mehmet@example.com",
  "code": "123456",
  "newPassword": "yeni-guvenli-parola123"
}
```

**Başarılı Yanıt (200 OK)**

```json
{
  "message": "Şifreniz başarıyla sıfırlandı",
  "status": "success"
}
```

**Hata Yanıtı (400 Bad Request)**

```json
{
  "message": "Geçersiz doğrulama kodu",
  "status": "error"
}
```

veya

```json
{
  "statusCode": 400,
  "message": "Bu e-posta adresi ile kayıtlı bir yerel hesap bulunamadı"
}
```

> ## 🔒 FRONTEND ŞİFRE SIFIRLAMA AKIŞI
> 
> Şifre sıfırlama işlemi frontend tarafında 3 aşamalı bir süreçtir ve her aşamada önceki adımlardan gelen bilgilerin korunması gerekmektedir:
> 
> **1. Aşama: E-posta Girişi**
> - Kullanıcı sadece e-posta adresini girer
> - `/auth/forgot-password` endpoint'ine sadece e-posta bilgisi gönderilir
> - **Saklanması gereken:** E-posta adresi (sonraki aşamalarda kullanılacak)
> 
> **2. Aşama: Doğrulama Kodu Girişi**
> - Kullanıcıdan 6 haneli doğrulama kodunu girmesi istenir
> - `/auth/verify-reset-code` endpoint'ine 1. adımda saklanan e-posta ile birlikte doğrulama kodu gönderilir
> - **Saklanması gereken:** E-posta adresi ve doğrulama kodu (3. aşamada kullanılacak)
> 
> **3. Aşama: Yeni Şifre Belirleme**
> - Kullanıcı yeni şifresini belirler
> - `/auth/reset-password` endpoint'ine şu bilgiler gönderilir:
>   - 1. aşamadan saklanan e-posta adresi
>   - 2. aşamadan saklanan doğrulama kodu
>   - Yeni şifre
> 
> **Önemli Hatırlatmalar:**
> 
> - Tüm aşamalarda **aynı e-posta adresi** kullanılmalıdır, farklı bir e-posta kullanılırsa işlem başarısız olur
> - Doğrulama kodu 15 dakika geçerlidir, bu süre içinde işlem tamamlanmalıdır
> - Eğer kullanıcı 2. aşamada kodun doğrulanmasını beklerken sayfayı yeniler veya kapatırsa, tüm süreci yeniden başlatmalıdır
> - Şifre en az 8 karakter uzunluğunda olmalıdır
> - Frontend'de saklanan geçici verilerin (e-posta ve kod) güvenli bir şekilde saklanması önerilir (örn. memory state veya encrypted local storage)
> - Kullanıcıya her aşamada ne yapması gerektiği açıkça belirtilmelidir

### Şifre Değiştirme (Giriş Sonrası)

Kullanıcı, giriş yaptıktan sonra mevcut şifresini değiştirir.

- **URL**: `/auth/change-password`
- **Method**: `POST`
- **Content-Type**: `application/json`
- **Authorization**: `Bearer [access_token]`

**İstek (Request)**

```json
{
  "oldPassword": "eski-parola",
  "newPassword": "yeni-parola123",
  "newPasswordConfirm": "yeni-parola123"
}
```

**Başarılı Yanıt (200 OK)**

```json
{
  "message": "Şifreniz başarıyla değiştirildi",
  "status": "success"
}
```

**Hata Yanıtı (400 Bad Request)**

```json
{
  "message": "Yeni şifreler eşleşmiyor",
  "status": "error"
}
```

veya

```json
{
  "message": "Geçersiz kullanıcı adı veya şifre",
  "status": "error"
}
```

## Önemli Notlar ve Kısıtlamalar

1. **Access Token Ömrü**: Access token'lar 15 dakika (900 saniye) geçerlidir.
2. **Refresh Token Ömrü**: Refresh token'lar 30 gün geçerlidir.
3. **Aktif Cihaz Sayısı**: Bir kullanıcı en fazla 2 cihazda aktif oturum açabilir. Yeni bir cihazda giriş yapıldığında en eski oturum sonlandırılır.
4. **E-posta Doğrulama**: Local provider ile kayıt olunduktan sonra, giriş yapabilmek için e-posta adresinin doğrulanması zorunludur.
5. **Authorization Header**: Korunan API'lere erişim için `Authorization: Bearer [access_token]` header'ı kullanılmalıdır.
6. **FCM Token**: Bildirim alabilmek için, mobil uygulama Firebase'den aldığı FCM token'ı `fcm-token` header'ında göndermelidir. Bu token özellikle şu durumlarda alınır:
   - Kullanıcı login olduğunda (`/auth/login`, `/auth/google/mobile`, vb.)
   - Herhangi bir API isteği yapıldığında (`Authorization` header'ı ile birlikte)
   
   **Mobil Uygulama İçin Önerilen FCM Token Yaklaşımı:**
   - Firebase'den FCM token alındığında veya güncellendiğinde bu token'ı uygulama içinde kaydedin
   - Login isteğinde bu token'ı header'da gönderin
   - Token değiştiğinde, herhangi bir API isteği sırasında yeni token'ı da header'da gönderin
   - Bu şekilde, FCM token kullanıcıya müdahale gerektirmeden arka planda yönetilmiş olur. Kullanıcıya özel bir izin veya bilgi istemenize gerek kalmaz.
   
7. **Device ID**: Cihaz kimliği belirtmek için (isteğe bağlı) `device-id` header'ı eklenebilir.

## Hata Kodları ve Anlamları

| HTTP Kodu | Açıklama                                         |
|-----------|--------------------------------------------------|
| 400       | Geçersiz istek veya eksik parametreler           |
| 401       | Kimlik doğrulama başarısız veya token geçersiz   |
| 403       | Yetkisiz erişim veya kaynağa erişim engellendi   |
| 404       | İstenen kaynak bulunamadı                        |
| 409       | Çakışma (örn. hesap zaten mevcut)                |
| 422       | İşleme hatası (geçersiz veri formatı)            |
| 500       | Sunucu hatası                                    |

## API Kullanım Örnekleri

### Kullanıcı Kaydı ve Giriş Akışı

1. `/auth/register` endpoint'ini kullanarak yeni bir kullanıcı oluşturun
2. Kullanıcı e-posta adresine gönderilen doğrulama bağlantısını takip ederek hesabını onaylasın
3. `/auth/login` endpoint'ini kullanarak giriş yapın
4. Dönen access token'ı Authorization header'ında kullanarak korumalı API'lere erişin
5. Access token süresi dolduğunda `/auth/refresh` endpoint'ini kullanarak yeni bir token alın
6. Oturumu sonlandırmak için `/auth/logout` endpoint'ini kullanın

### Sosyal Medya Girişi Akışı

1. Mobil uygulamada ilgili sosyal medya sağlayıcısıyla (Google, Apple veya Facebook) kimlik doğrulama yapın
2. Sağlayıcıdan alınan token/kimlik bilgilerini ilgili endpoint'e gönderin (örn. `/auth/google/mobile`)
3. Dönen access token'ı korumalı API'ler için kullanın
4. Diğer adımlar yerel giriş ile aynıdır.

### Token Yenileme Akışı

1. Kullanıcı uygulamaya giriş yaptığında, uygulama bir access token ve bir refresh token alır
2. Uygulama, access token'ı API isteklerinde Authorization header'ında kullanır: `Authorization: Bearer [access_token]`
3. Access token süresi dolduğunda (15 dakika sonra), API 401 Unauthorized hatası döndürür
4. Bu durumda uygulama, sakladığı refresh token'ı kullanarak `/auth/refresh` endpoint'ine istek gönderir
5. Başarılı yanıt durumunda yeni bir access token ve refresh token alır
6. Uygulama, eski refresh token'ı yenisiyle değiştirir ve API isteklerine yeni access token ile devam eder
7. Eğer refresh token da geçerliliğini yitirmişse (30 gün sonra), kullanıcı tekrar giriş yapmalıdır

> ## ⚠️ PROAKTİF TOKEN YENİLEME VE KESİNTİSİZ KULLANICI DENEYİMİ
>
> Mobil uygulama, access token süresi dolmadan önce proaktif olarak token yenileme işlemi yapmalıdır. Bu yaklaşım, kullanıcıya kesintisiz bir deneyim sağlamak için kritik öneme sahiptir.
>
> **Önerilen Yaklaşım:**
> 
> - Access token süresinin dolmasına **1-2 dakika kala** otomatik olarak token yenileme isteği gönderin
> - Bu sayede kullanıcı aktif bir işlem yaparken "oturum süresi doldu" hatası almaz
> - API çağrıları arasında kesinti yaşanmaz ve kullanıcı işlemlerine sorunsuz devam edebilir
> - Kullanıcının tekrar giriş yapması gerekmez
>
> Proaktif token yenilemenin uygulanması, özellikle form doldurma, ödeme işlemleri veya uzun süren işlemler sırasında kullanıcı memnuniyeti açısından büyük önem taşır. Bu yöntem, uygulama içi akışın bozulmamasını sağlar ve kullanıcının oturum sorunlarıyla uğraşmak zorunda kalmamasını garantiler.
