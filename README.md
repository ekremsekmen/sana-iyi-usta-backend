# Sanayi Usta Backend  

Bu proje, ustalar ve araç sahipleri için bir platformun backend tarafını oluşturmaktadır. NestJS ile geliştirilmiştir.  

## 📂 Proje Yapısı  

```bash
sana-iyi-usta-backend/
│── src/
│   ├── modules/               # 🔹 Uygulamanın ana modülleri (Her biri bağımsız çalışır)
│   │   ├── auth/              # 🛡️ Kullanıcı kimlik doğrulama ve yetkilendirme işlemleri
│   │   │   ├── auth.module.ts         
│   │   │   ├── auth.controller.ts     
│   │   │   ├── auth.service.ts        
│   │   │   ├── auth.entity.ts         
│   │   │   ├── auth.dto.ts            
│   │   ├── users/             # 👥 Kullanıcı yönetimi (Usta & Araç sahibi hesapları)
│   │   │   ├── users.module.ts        
│   │   │   ├── users.controller.ts    
│   │   │   ├── users.service.ts       
│   │   │   ├── users.entity.ts        
│   │   │   ├── users.dto.ts           
│   │   ├── mechanics/         # 🔧 Usta profilleri ve hizmet bilgileri
│   │   │   ├── mechanics.module.ts    
│   │   │   ├── mechanics.controller.ts 
│   │   │   ├── mechanics.service.ts   
│   │   │   ├── mechanics.entity.ts    
│   │   │   ├── mechanics.dto.ts       
│   │   ├── appointments/      # 📅 Randevu yönetimi
│   │   │   ├── appointments.module.ts 
│   │   │   ├── appointments.controller.ts 
│   │   │   ├── appointments.service.ts 
│   │   │   ├── appointments.entity.ts  
│   │   │   ├── appointments.dto.ts     
│   │   ├── vehicles/          # 🚗 Araç yönetimi (Kullanıcıların araç bilgileri)
│   │   │   ├── vehicles.module.ts      
│   │   │   ├── vehicles.controller.ts  
│   │   │   ├── vehicles.service.ts     
│   │   │   ├── vehicles.entity.ts      
│   │   │   ├── vehicles.dto.ts         
│   │   ├── campaigns/         # 🎉 Kampanya yönetimi (Ustalar özel kampanyalar oluşturabilir)
│   │   │   ├── campaigns.module.ts     
│   │   │   ├── campaigns.controller.ts 
│   │   │   ├── campaigns.service.ts    
│   │   │   ├── campaigns.entity.ts     
│   │   │   ├── campaigns.dto.ts        
│   │   ├── notifications/     # 🔔 Bildirim yönetimi (Push, SMS, E-posta)
│   │   │   ├── notifications.module.ts
│   │   │   ├── notifications.controller.ts
│   │   │   ├── notifications.service.ts
│   │   │   ├── notifications.entity.ts
│   │   │   ├── notifications.dto.ts
│   │   ├── messages/          # 💬 Usta ve müşteri mesajlaşma
│   │   │   ├── messages.module.ts
│   │   │   ├── messages.controller.ts
│   │   │   ├── messages.service.ts
│   │   │   ├── messages.entity.ts
│   │   │   ├── messages.dto.ts
│   │   ├── reviews/           # ⭐ Usta değerlendirme ve yorumlar
│   │   │   ├── reviews.module.ts
│   │   │   ├── reviews.controller.ts
│   │   │   ├── reviews.service.ts
│   │   │   ├── reviews.entity.ts
│   │   │   ├── reviews.dto.ts
│   ├── common/                # 🔥 Ortak kullanılacak kodlar (Global bileşenler)
│   │   ├── guards/            # 🛡️ Yetkilendirme korumaları (JWT vs.)
│   │   │   ├── jwt.guard.ts            
│   │   ├── filters/           # 🚨 Hata yönetimi (Global hata yakalayıcı)
│   │   │   ├── http-exception.filter.ts 
│   │   ├── interceptors/      # 🔄 Request & Response manipülasyonları
│   │   │   ├── logging.interceptor.ts   
│   │   ├── decorators/        # 🏷️ Özel NestJS dekoratörleri (User ID çekme vs.)
│   ├── utils/                 # 🔧 Yardımcı fonksiyonlar
│   │   ├── helpers.ts
│   ├── config/                # ⚙️ Konfigürasyon dosyaları (Env değişkenleri vs.)
│   │   ├── database.config.ts 
│   │   ├── app.config.ts      
│   ├── main.ts                # 🚀 Uygulamanın başlangıç noktası (NestJS burada başlıyor)
│── .env                       # 🌎 Ortam değişkenleri (Gizli API anahtarları buraya gelir)
│── tsconfig.json              # 🛠️ TypeScript ayarları
│── package.json               # 📦 Bağımlılık listesi
│── README.md                  # 📖 Proje dökümantasyonu
