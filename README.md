# Sana İyi Usta Backend

Bu proje, ustalar ve araç sahipleri için bir platformun backend tarafını oluşturmaktadır. NestJS ile geliştirilmiştir.

## 📂 Proje Yapısı

```bash
sana-iyi-usta-backend/
├── prisma/
│   └── schema.prisma
└── src/
    ├── app.controller.ts
    ├── app.module.ts
    ├── app.service.ts
    ├── common/
    │   ├── decorators/
    │   │   └── user.decorator.ts
    │   ├── filters/
    │   │   ├── database-exception.filter.ts
    │   │   ├── http-exception.filter.ts
    │   │   └── validation-exception.filter.ts
    │   ├── guards/
    │   │   └── jwt/
    │   │       └── jwt.guard.ts
    │   ├── interceptors/
    │   │   └── logging/
    │   │       └── logging.interceptor.ts
    │   └── middlewares/
    │       └── logger.middleware.ts
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
    │   │   ├── auth.service.ts
    │   │   ├── dto/
    │   │   │   ├── login.dto.ts
    │   │   │   ├── register.dto.ts
    │   │   │   └── social-auth.dto.ts
    │   │   └── strategies/
    │   │       ├── apple.strategy.ts
    │   │       └── google.strategy.ts
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
    │   ├── email/
    │   │   ├── email.controller.ts
    │   │   ├── email.module.ts
    │   │   ├── email.service.ts
    │   │   └── dto/
    │   │       ├── send-verification-email.dto.ts
    │   │       └── verify-email.dto.ts
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
    │   └── vehicles/
    │       ├── vehicles.controller.ts
    │       ├── vehicles.module.ts
    │       ├── vehicles.service.ts
    │       └── dto/
    │           ├── create-vehicle.dto.ts
    │           └── update-vehicle.dto.ts
    ├── prisma/
    │   ├── prisma.module.ts
    │   └── prisma.service.ts
    ├── tests/
    └── utils/
        └── helpers.ts
```

## 📦 Modüller

- **Auth**: Kimlik doğrulama ve yetkilendirme
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
- **Email**: E-posta yönetimi

## 🛠 Teknik Altyapı

- **Framework**: NestJS
- **Veritabanı**: PostgreSQL + Prisma ORM
- **Authentication**: JWT + Google & Apple OAuth
