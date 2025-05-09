# S3 Bucket Yapılandırması

## 1. Public Okuma İzinleri Ayarlama

1. [AWS Management Console](https://console.aws.amazon.com/)'a giriş yapın
2. S3 servisine gidin
3. Bucket'ınızı seçin
4. "Permissions" (İzinler) sekmesine tıklayın
5. "Block Public Access" (Genel Erişimi Engelle) ayarlarını düzenleyin
6. "Block all public access" kutusunu kaldırın (public okuma izni için)
7. "I acknowledge..." yazısını onaylayın ve "Save changes" (Değişiklikleri Kaydet) düğmesine tıklayın

## 2. Bucket Politikası Ekleme

"Bucket Policy" (Bucket Politikası) bölümüne gidin ve "Edit" (Düzenle) düğmesine tıklayın. Aşağıdaki JSON'u ekleyin:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::your-bucket-name/*"
    }
  ]
}
```

**Not:** `your-bucket-name` kısmını kendi bucket isminiz ile değiştirin.

## 3. CORS Yapılandırması

"Cross-origin resource sharing (CORS)" bölümüne gidin ve "Edit" (Düzenle) düğmesine tıklayın. Aşağıdaki JSON'u ekleyin:

```json
[
  {
    "AllowedHeaders": ["*"],
    "AllowedMethods": ["GET", "HEAD", "PUT", "POST"],
    "AllowedOrigins": ["*"],  // Güvenlik için sadece belirli domainleri ekleyin, örn: ["https://yourapp.com"]
    "ExposeHeaders": ["ETag"],
    "MaxAgeSeconds": 3000
  }
]
```

## 4. AWS CLI ile Yapılandırma

AWS CLI kullanarak da aynı yapılandırmaları uygulayabilirsiniz:

### CORS yapılandırması için:

```bash
aws s3api put-bucket-cors --bucket your-bucket-name --cors-configuration '{
  "CORSRules": [
    {
      "AllowedHeaders": ["*"],
      "AllowedMethods": ["GET", "HEAD", "PUT", "POST"],
      "AllowedOrigins": ["*"],
      "ExposeHeaders": ["ETag"],
      "MaxAgeSeconds": 3000
    }
  ]
}'
```

### Bucket politikası için:

```bash
aws s3api put-bucket-policy --bucket your-bucket-name --policy '{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::your-bucket-name/*"
    }
  ]
}'
```

## Güvenlik Uyarısı

Public izinleri açarken güvenlik riskleri olabileceğini unutmayın. Production ortamında:

1. AllowedOrigins'i sadece gerçekten ihtiyaç duyulan domainlerle sınırlayın
2. Eğer mümkünse AWS CloudFront gibi bir CDN kullanarak S3 erişimini koruyun
3. Bucket'ınızın yazma izinlerini kısıtlayın, sadece okuma izni verin
```

## İzinleri Test Etme

Yapılandırmanızın doğru çalışıp çalışmadığını test etmek için:

1. Bucket'a bir test dosyası yükleyin
2. Yüklenen dosyanın URL'ini tarayıcınızda açmayı deneyin
3. Bir tarayıcı konsolu üzerinden CORS isteği test edin:

```javascript
fetch('https://your-bucket-name.s3.amazonaws.com/test-file.jpg')
  .then(response => console.log('Success!', response))
  .catch(error => console.error('Error:', error));
```
