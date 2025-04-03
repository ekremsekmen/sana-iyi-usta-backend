# Sana İyi Usta Backend - Modüler Yapı Planı

Bu doküman, projedeki veritabanı tablolarının hangi modüller tarafından yönetileceğini ve her modülün temel sorumluluklarını açıklar.

## 1. Auth Module
**İlgili Tablolar:**
- `user_auth`
- `refresh_tokens`
- `email_verifications`
- `user_sessions`

**Temel Sorumluluklar:**
- Kullanıcı kimlik doğrulama (yerel ve sosyal medya entegrasyonları)
- Token oluşturma ve doğrulama
- Oturum yönetimi
- 2FA (İki faktörlü kimlik doğrulama) yönetimi
- Şifre sıfırlama
- Email doğrulama süreçleri

## 2. Users Module
**İlgili Tablolar:**
- `users` (temel tablo)
- `customers` ve `mechanics` (kullanıcı tipine göre referans)

**Temel Sorumluluklar:**
- Kullanıcı profil yönetimi
- Yetki kontrolü 
- Kullanıcı arama ve listeleme
- Kullanıcı hesap ayarları
- Ortak kullanıcı özellikleri

## 3. Customers Module
**İlgili Tablolar:**
- `customers` (temel tablo)
- `users` (ilişkili kullanıcı bilgileri)
- `customer_vehicles` (araç-müşteri ilişkisi)

**Temel Sorumluluklar:**
- Müşteri profil bilgilerinin yönetimi
- Müşteri-araç ilişkilerinin yönetimi
- Müşteri konum bilgileri

## 4. Mechanics Module
**İlgili Tablolar:**
- `mechanics` (temel tablo)
- `users` (ilişkili kullanıcı bilgileri)
- `mechanic_services` (sunulan hizmetler)
- `mechanic_supported_vehicles` (desteklenen araç tipleri)
- `advertisements` (tamirci reklamları)

**Temel Sorumluluklar:**
- Tamirci/usta profil yönetimi
- Hizmet listesi ve fiyatlandırma
- Çalışma saatleri ve konum
- Desteklenen araçların yönetimi
- Reklam ve öne çıkarma işlemleri

## 5. Vehicles Module
**İlgili Tablolar:**
- `brands` (araç markaları)
- `models` (araç modelleri)
- `model_years` (model yılları)
- `variants` (araç varyantları)
- `customer_vehicles` (müşteri araçları)
- `vehicle_maintenance_records` (araç bakım kayıtları)

**Temel Sorumluluklar:**
- Araç kataloğu yönetimi (marka, model, yıl, varyant)
- Araç bakım takibi
- Müşteriye ait araçların kaydı ve yönetimi
- Araç bilgilerinin güncellenmesi

## 6. ServiceRequests Module
**İlgili Tablolar:**
- `customer_service_requests` (temel tablo)
- `requested_services_list` (talep edilen hizmetler)
- `services_categories` (hizmet kategorileri)

**Temel Sorumluluklar:**
- Servis taleplerinin oluşturulması ve işlenmesi
- Hizmet kategorilerinin yönetimi
- Talep edilen hizmetlerin listesi
- Servis talep durumu takibi
- Usta-müşteri eşleştirme

## 7. Appointments Module
**İlgili Tablolar:**
- `appointments` (temel tablo)
- `customer_service_requests` (bağlantılı servis talebi)

**Temel Sorumluluklar:**
- Randevu oluşturma ve yönetim
- Randevu durumu takibi
- Takvim entegrasyonu
- Randevu hatırlatmaları
- Randevu onay/iptal işlemleri

## 8. Reviews Module
**İlgili Tablolar:**
- `ratings_reviews` (temel tablo)
- `appointments` (bağlantılı randevu)
- `customer_service_requests` (bağlantılı servis talebi)

**Temel Sorumluluklar:**
- Değerlendirme ve yorumların yönetimi
- Puan hesaplama ve gösterme
- Değerlendirme moderasyonu
- Memnuniyet analizi

## 9. Campaigns Module
**İlgili Tablolar:**
- `campaigns` (temel tablo)
- `campaign_categories` (kampanya kategorileri)

**Temel Sorumluluklar:**
- Kampanya oluşturma ve yönetim
- Kampanya hedef kitle tanımlama
- Kampanya geçerlilik süreleri
- Kampanya performans takibi
- İndirim ve promosyon yönetimi

## 10. Messages Module
**İlgili Tablolar:**
- `messages` (temel tablo)

**Temel Sorumluluklar:**
- Mesaj gönderme ve alma
- Sohbet geçmişi
- Okuma durumu takibi
- Mesaj bildirimleri
- Medya paylaşımı

## 11. Notifications Module
**İlgili Tablolar:**
- `notifications` (temel tablo)

**Temel Sorumluluklar:**
- Push bildirimleri yönetimi
- Bildirim tercihleri
- Bildirim geçmişi
- Bildirim gönderimleri
- Bildirim tipleri yönetimi

## 12. Payments Module
**İlgili Tablolar:**
- `payments` (temel tablo)

**Temel Sorumluluklar:**
- Ödeme işlemleri
- Fatura oluşturma
- Ödeme geçmişi
- Ödeme yöntemi yönetimi
- İptal ve iade işlemleri

