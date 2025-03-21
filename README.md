# Sanayi Usta Backend  

Bu proje, ustalar ve araç sahipleri için bir platformun backend tarafını oluşturmaktadır. NestJS ile geliştirilmiştir.  

## 📂 Proje Yapısı  

```bash
sana-iyi-usta-backend/
│── src/
│   ├── app.controller.ts      # 🎮 Ana kontrolcü
│   ├── app.module.ts          # 📦 Ana modül
│   ├── app.service.ts         # 🔧 Ana servis
│   ├── modules/               # 🔹 Uygulamanın ana modülleri (Her biri bağımsız çalışır)
│   │   ├── auth/              # 🛡️ Kullanıcı kimlik doğrulama ve yetkilendirme işlemleri
│   │   │   ├── auth.module.ts         
│   │   │   ├── auth.controller.ts     
│   │   │   ├── auth.service.ts        
│   │   │   ├── auth.entity.ts         
│   │   │   └── dto/
│   │   │       ├── login.dto.ts
│   │   │       └── register.dto.ts
│   │   ├── users/             # 👥 Kullanıcı yönetimi (Usta & Araç sahibi hesapları)
│   │   │   ├── users.module.ts        
│   │   │   ├── users.controller.ts    
│   │   │   ├── users.service.ts       
│   │   │   ├── users.entity.ts        
│   │   │   └── dto/
│   │   │       ├── create-user.dto.ts
│   │   │       └── update-user.dto.ts
│   │   ├── mechanics/         # 🔧 Usta profilleri ve hizmet bilgileri
│   │   │   ├── mechanics.module.ts    
│   │   │   ├── mechanics.controller.ts 
│   │   │   ├── mechanics.service.ts   
│   │   │   ├── mechanics.entity.ts    
│   │   │   └── dto/
│   │   │       ├── create-mechanic.dto.ts
│   │   │       └── update-mechanic.dto.ts
│   │   ├── appointments/      # 📅 Randevu yönetimi
│   │   │   ├── appointments.module.ts 
│   │   │   ├── appointments.controller.ts 
│   │   │   ├── appointments.service.ts 
│   │   │   ├── appointments.entity.ts  
│   │   │   └── dto/
│   │   │       ├── create-appointment.dto.ts
│   │   │       └── update-appointment.dto.ts
│   │   ├── vehicles/          # 🚗 Araç yönetimi (Kullanıcıların araç bilgileri)
│   │   │   ├── vehicles.module.ts      
│   │   │   ├── vehicles.controller.ts  
│   │   │   ├── vehicles.service.ts     
│   │   │   ├── vehicles.entity.ts      
│   │   │   └── dto/
│   │   │       ├── create-vehicle.dto.ts
│   │   │       └── update-vehicle.dto.ts
│   │   ├── campaigns/         # 🎉 Kampanya yönetimi (Ustalar özel kampanyalar oluşturabilir)
│   │   │   ├── campaigns.module.ts     
│   │   │   ├── campaigns.controller.ts 
│   │   │   ├── campaigns.service.ts    
│   │   │   ├── campaigns.entity.ts     
│   │   │   └── dto/
│   │   │       ├── create-campaign.dto.ts
│   │   │       └── update-campaign.dto.ts
│   │   ├── notifications/     # 🔔 Bildirim yönetimi (Push, SMS, E-posta)
│   │   │   ├── notifications.module.ts
│   │   │   ├── notifications.controller.ts
│   │   │   ├── notifications.service.ts
│   │   │   ├── notifications.entity.ts
│   │   │   └── dto/
│   │   │       ├── create-notification.dto.ts
│   │   │       └── update-notification.dto.ts
│   │   ├── messages/          # 💬 Usta ve müşteri mesajlaşma
│   │   │   ├── messages.module.ts
│   │   │   ├── messages.controller.ts
│   │   │   ├── messages.service.ts
│   │   │   ├── messages.entity.ts
│   │   │   └── dto/
│   │   │       ├── create-message.dto.ts
│   │   │       └── update-message.dto.ts
│   │   ├── reviews/           # ⭐ Usta değerlendirme ve yorumlar
│   │   │   ├── reviews.module.ts
│   │   │   ├── reviews.controller.ts
│   │   │   ├── reviews.service.ts
│   │   │   ├── reviews.entity.ts
│   │   │   └── dto/
│   │   │       ├── create-review.dto.ts
│   │   │       └── update-review.dto.ts
│   │   ├── service-requests/  # 🛠️ Servis talepleri
│   │   │   ├── service-requests.module.ts
│   │   │   ├── service-requests.controller.ts
│   │   │   ├── service-requests.service.ts
│   │   │   ├── service-requests.entity.ts
│   │   │   └── dto/
│   │   │       ├── create-service-request.dto.ts
│   │   │       └── update-service-request.dto.ts
│   │   ├── customers/         # 👥 Müşteri yönetimi
│   │   │   ├── customers.module.ts
│   │   │   ├── customers.controller.ts
│   │   │   ├── customers.service.ts
│   │   │   ├── customers.entity.ts
│   │   │   └── dto/
│   │   │       ├── create-customer.dto.ts
│   │   │       └── update-customer.dto.ts
│   ├── common/                # 🔥 Ortak kullanılacak kodlar (Global bileşenler)
│   │   ├── decorators/        # 🏷️ Özel NestJS dekoratörleri
│   │   │   └── user.decorator.ts
│   │   ├── filters/           # 🚨 Hata yönetimi
│   │   │   ├── database-exception.filter.ts
│   │   │   ├── http-exception.filter.ts
│   │   │   └── validation-exception.filter.ts
│   │   ├── guards/            # 🛡️ Yetkilendirme korumaları
│   │   │   └── jwt/
│   │   │       └── jwt.guard.ts
│   │   ├── interceptors/      # 🔄 Request & Response manipülasyonları
│   │   │   └── logging/
│   │   │       └── logging.interceptor.ts
│   │   └── middlewares/       # 🔗 Ara katman yazılımları
│   │       └── logger.middleware.ts
│   ├── config/                # ⚙️ Konfigürasyon dosyaları
│   │   ├── database.config.ts
│   │   └── app.config.ts
│   ├── utils/                 # 🔧 Yardımcı fonksiyonlar
│   │   └── helpers.ts
│   └── main.ts                # 🚀 Uygulamanın başlangıç noktası
├── nest-cli.json             # 🛠️ NestJS CLI yapılandırması
├── tsconfig.json             # 🛠️ TypeScript ayarları
├── package.json              # 📦 Bağımlılık listesi
└── README.md                 # 📖 Proje dökümantasyonu
