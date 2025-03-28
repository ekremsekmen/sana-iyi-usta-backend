# Sanayi Usta Backend

Bu proje, ustalar ve araç sahipleri için bir platformun backend tarafını oluşturmaktadır. NestJS ile geliştirilmiştir.

## 📂 Proje Yapısı

```bash
sana-iyi-usta-backend/

├── prisma
│   └── schema.prisma
└── src
    ├── app.controller.ts
    ├── app.module.ts
    ├── app.service.ts
    ├── common
    │   ├── decorators
    │   │   └── user.decorator.ts
    │   ├── filters
    │   │   ├── database-exception.filter.ts
    │   │   ├── http-exception.filter.ts
    │   │   └── validation-exception.filter.ts
    │   ├── guards
    │   │   └── jwt
    │   │       └── jwt.guard.ts
    │   ├── interceptors
    │   │   └── logging
    │   │       └── logging.interceptor.ts
    │   └── middlewares
    │       └── logger.middleware.ts
    ├── config
    │   ├── app.config.ts
    │   └── database.config.ts
    ├── main.ts
    ├── modules
    │   ├── appointments
    │   │   ├── appointments.controller.ts
    │   │   ├── appointments.module.ts
    │   │   ├── appointments.service.ts
    │   │   └── dto
    │   │       ├── create-appointment.dto.ts
    │   │       └── update-appointment.dto.ts
    │   ├── auth
    │   │   ├── auth.controller.ts
    │   │   ├── auth.module.ts
    │   │   ├── auth.service.ts
    │   │   └── dto
    │   │       ├── login.dto.ts
    │   │       └── register.dto.ts
    │   ├── campaigns
    │   │   ├── campaigns.controller.ts
    │   │   ├── campaigns.module.ts
    │   │   ├── campaigns.service.ts
    │   │   └── dto
    │   │       ├── create-campaign.dto.ts
    │   │       └── update-campaign.dto.ts
    │   ├── customers
    │   │   ├── customers.controller.ts
    │   │   ├── customers.module.ts
    │   │   ├── customers.service.ts
    │   │   └── dto
    │   │       ├── create-customer.dto.ts
    │   │       └── update-customer.dto.ts
    │   ├── mechanics
    │   │   ├── dto
    │   │   │   ├── create-mechanic.dto.ts
    │   │   │   └── update-mechanic.dto.ts
    │   │   ├── mechanics.controller.ts
    │   │   ├── mechanics.module.ts
    │   │   └── mechanics.service.ts
    │   ├── messages
    │   │   ├── dto
    │   │   │   ├── create-message.dto.ts
    │   │   │   └── update-message.dto.ts
    │   │   ├── messages.controller.ts
    │   │   ├── messages.module.ts
    │   │   └── messages.service.ts
    │   ├── notifications
    │   │   ├── dto
    │   │   │   ├── create-notification.dto.ts
    │   │   │   └── update-notification.dto.ts
    │   │   ├── notifications.controller.ts
    │   │   ├── notifications.module.ts
    │   │   └── notifications.service.ts
    │   ├── reviews
    │   │   ├── dto
    │   │   │   ├── create-review.dto.ts
    │   │   │   └── update-review.dto.ts
    │   │   ├── reviews.controller.ts
    │   │   ├── reviews.module.ts
    │   │   └── reviews.service.ts
    │   ├── service-requests
    │   │   ├── dto
    │   │   │   ├── create-service-request.dto.ts
    │   │   │   └── update-service-request.dto.ts
    │   │   ├── service-requests.controller.ts
    │   │   ├── service-requests.module.ts
    │   │   └── service-requests.service.ts
    │   ├── users
    │   │   ├── dto
    │   │   │   ├── create-user.dto.ts
    │   │   │   └── update-user.dto.ts
    │   │   ├── users.controller.ts
    │   │   ├── users.module.ts
    │   │   └── users.service.ts
    │   └── vehicles
    │       ├── dto
    │       │   ├── create-vehicle.dto.ts
    │       │   └── update-vehicle.dto.ts
    │       ├── vehicles.controller.ts
    │       ├── vehicles.module.ts
    │       └── vehicles.service.ts
    ├── prisma
    │   ├── prisma.module.ts
    │   └── prisma.service.ts
    ├── tests
    └── utils
        └── helpers.ts
```
