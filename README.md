# Sana İyi Usta Backend

Bu proje, ustalar ve araç sahipleri için bir platformun backend tarafını oluşturmaktadır. NestJS ile geliştirilmiştir.

## 📂 Proje Yapısı

```bash
sana-iyi-usta-backend/
├── docs/
│   └── auth-api-documentation.md
├── prisma/
│   └── schema.prisma
└── src/
    ├── app.controller.ts
    ├── app.module.ts
    ├── app.service.ts
    ├── common/
    │   ├── decorators/
    │   ├── enums/
    │   ├── exceptions/
    │   ├── filters/
    │   │   ├── database-exception.filter.ts
    │   │   ├── http-exception.filter.ts
    │   │   └── validation-exception.filter.ts
    │   ├── guards/
    │   │   ├── jwt/
    │   │   │   └── jwt.guard.ts
    │   │   └── throttler/
    │   │       └── throttler.guard.ts
    │   ├── interceptors/
    │   │   └── logging/
    │   │       └── logging.interceptor.ts
    │   ├── middlewares/
    │   │   └── logger.middleware.ts
    │   ├── utils/
    │   └── validators/
    ├── config/
    │   ├── app.config.ts
    │   └── database.config.ts
    ├── main.ts
    ├── modules/
    │   ├── appointments/
    │   │   ├── appointments.controller.ts
    │   │   ├── appointments.module.ts
    │   │   ├── appointments.service.ts
    │   │   └── dto/
    │   │       ├── create-appointment.dto.ts
    │   │       └── update-appointment.dto.ts
    │   ├── auth/
    │   │   ├── auth.controller.ts
    │   │   ├── auth.module.ts
    │   │   ├── dto/
    │   │   │   ├── email.dto.ts
    │   │   │   ├── login.dto.ts
    │   │   │   ├── refresh-token.dto.ts
    │   │   │   ├── register.dto.ts
    │   │   │   └── social-auth.dto.ts
    │   │   ├── guards/
    │   │   │   ├── apple-auth.guard.ts
    │   │   │   ├── google-auth.guard.ts
    │   │   │   ├── jwt-auth.guard.ts
    │   │   │   └── local-auth.guard.ts
    │   │   ├── services/
    │   │   │   ├── auth-validation.service.ts
    │   │   │   ├── auth.service.ts
    │   │   │   ├── email.service.ts
    │   │   │   ├── local-authentication.service.ts
    │   │   │   ├── session-manager.service.ts
    │   │   │   ├── social-authentication.service.ts
    │   │   │   ├── token-manager.service.ts
    │   │   │   ├── user-registration.service.ts
    │   │   │   └── user-session.service.ts
    │   │   └── strategies/
    │   │       ├── facebook.strategy.ts
    │   │       ├── google.strategy.ts
    │   │       ├── icloud.strategy.ts
    │   │       ├── jwt.strategy.ts
    │   │       └── local.strategy.ts
    │   ├── campaigns/
    │   │   ├── campaigns.controller.ts
    │   │   ├── campaigns.module.ts
    │   │   ├── campaigns.service.ts
    │   │   └── dto/
    │   │       ├── create-campaign.dto.ts
    │   │       └── update-campaign.dto.ts
    │   ├── customers/
    │   │   ├── customers.controller.ts
    │   │   ├── customers.module.ts
    │   │   ├── customers.service.ts
    │   │   └── dto/
    │   │       ├── create-customer.dto.ts
    │   │       └── update-customer.dto.ts
    │   ├── mechanics/
    │   │   ├── mechanics.controller.ts
    │   │   ├── mechanics.module.ts
    │   │   ├── mechanics.service.ts
    │   │   └── dto/
    │   │       ├── create-mechanic.dto.ts
    │   │       └── update-mechanic.dto.ts
    │   ├── messages/
    │   │   ├── messages.controller.ts
    │   │   ├── messages.module.ts
    │   │   ├── messages.service.ts
    │   │   └── dto/
    │   │       ├── create-message.dto.ts
    │   │       └── update-message.dto.ts
    │   ├── notifications/
    │   │   ├── notifications.controller.ts
    │   │   ├── notifications.module.ts
    │   │   ├── notifications.service.ts
    │   │   └── dto/
    │   │       ├── create-notification.dto.ts
    │   │       └── update-notification.dto.ts
    │   ├── reviews/
    │   │   ├── reviews.controller.ts
    │   │   ├── reviews.module.ts
    │   │   ├── reviews.service.ts
    │   │   └── dto/
    │   │       ├── create-review.dto.ts
    │   │       └── update-review.dto.ts
    │   ├── service-requests/
    │   │   ├── service-requests.controller.ts
    │   │   ├── service-requests.module.ts
    │   │   ├── service-requests.service.ts
    │   │   └── dto/
    │   │       ├── create-service-request.dto.ts
    │   │       └── update-service-request.dto.ts
    │   ├── users/
    │   │   ├── users.controller.ts
    │   │   ├── users.module.ts
    │   │   ├── users.service.ts
    │   │   └── dto/
    │   │       ├── create-user.dto.ts
    │   │       └── update-user.dto.ts
    │   ├── vehicles/
    │   │   ├── vehicles.controller.ts
    │   │   ├── vehicles.module.ts
    │   │   ├── vehicles.service.ts
    │   │   └── dto/
    │   │       ├── create-vehicle.dto.ts
    │   │       └── update-vehicle.dto.ts
    │   └── verification/
    ├── prisma/
    │   ├── prisma.module.ts
    │   └── prisma.service.ts
    ├── templates/
    │   └── email-verification.template.ts
    ├── tests/
    └── utils/
        └── helpers.ts
```

## 📦 Modüller

- **Auth**: Kimlik doğrulama ve yetkilendirme (JWT, Google, Facebook ve Apple OAuth)
- **Users**: Kullanıcı yönetimi
- **Mechanics**: Tamirci/usta yönetimi
- **Vehicles**: Araç yönetimi
- **Appointments**: Randevu sistemi
- **ServiceRequests**: Servis talepleri
- **Campaigns**: Kampanya yönetimi
- **Reviews**: Değerlendirme sistemi
- **Messages**: Mesajlaşma sistemi
- **Notifications**: Bildirim sistemi
- **Customers**: Müşteri yönetimi
- **Verification**: Hesap doğrulama sistemi

## 🛠 Teknik Altyapı

- **Framework**: NestJS
- **Veritabanı**: PostgreSQL + Prisma ORM
- **Authentication**: JWT + Google, Facebook & Apple OAuth
- **Dokümantasyon**: API belgeleri docs/ klasöründe bulunmaktadır
- **Güvenlik**: Rate limiting, JWT tabanlı yetkilendirme
- **Email**: Şablon tabanlı email gönderimi için destek
