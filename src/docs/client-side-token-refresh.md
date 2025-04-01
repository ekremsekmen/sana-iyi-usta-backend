# İstemci Tarafında Token Yenileme Süreci

## Adım Adım Açıklama

1. **Kullanıcı login olur ve token'lar alınır**
   - Login isteği `/auth/login` endpoint'ine gönderilir
   - Başarılı login sonucunda `access_token` ve `refresh_token` alınır ve cihazda saklanır
   - `access_token` 15 dakika geçerlidir
   - `refresh_token` 30 gün geçerlidir

2. **Normal API istekleri**
   - Her API isteğinde `access_token` otomatik olarak istek header'ına eklenir:
   ```
   Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR...
   ```

3. **Token süresi dolduğunda ne olur?**
   - Diyelim ki kullanıcı uygulamayı kullanırken 15 dakika geçti
   - Kullanıcı yeni bir işlem yaptığında (örneğin bir listeyi yeniledi)
   - Bu istek için backend'e bir API çağrısı yapılır
   - Backend 401 Unauthorized hatası döner çünkü access token süresi dolmuştur
   - **İşte burada otomatik yenileme devreye girer**

4. **Otomatik yenileme**
   - İstemci 401 hatasını yakalar
   - Cihazda saklanan refresh token'ı kullanarak `/auth/refresh` endpoint'ine istek yapar
   - Endpoint yeni bir access token ve refresh token döner
   - İstemci bu yeni token'ları cihazda saklar
   - İstemci, başarısız olan orijinal isteği bu yeni access token ile tekrar dener
   - Kullanıcı hiçbir kesinti yaşamaz, token yenileme işlemi arka planda otomatik gerçekleşir

5. **Refresh token süresi dolduğunda**
   - Eğer refresh token da süresi dolmuş veya geçersizse (30 gün sonra)
   - `/auth/refresh` endpoint'i hata döner
   - Veritabanından süresi dolmuş refresh token kaydı silinir
   - "Refresh token expired" hatası fırlatılır
   - İstemci tarafında bu hata yakalanır ve kullanıcı login ekranına yönlendirilir

## Kod Örneği: İstemci Tarafı Otomatik Yenileme

```typescript
// Axios ile örnek (React/React Native için)
import axios from 'axios';

const api = axios.create({
  baseURL: 'https://api.sanaiyi-usta.com',
});

// Her istekte access token'ı ekle
api.interceptors.request.use((config) => {
  const accessToken = localStorage.getItem('access_token');
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

// 401 hatası aldığında otomatik yenile
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    // Token süresi dolmuş mu kontrol et
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true; // tekrar deneme flag'i
      
      try {
        // Refresh token ile yeni token al
        const refreshToken = localStorage.getItem('refresh_token');
        const response = await axios.post('/auth/refresh', { 
          refresh_token: refreshToken 
        });
        
        // Yeni token'ları sakla
        const { access_token, refresh_token } = response.data;
        localStorage.setItem('access_token', access_token);
        localStorage.setItem('refresh_token', refresh_token);
        
        // Başarısız olan isteği yeni token ile tekrar dene
        return axios(originalRequest);
      } catch (refreshError) {
        // Refresh token da geçersizse, logout yap
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        window.location.href = '/login'; // Login ekranına yönlendir
        return Promise.reject(refreshError);
      }
    }
    
    return Promise.reject(error);
  }
);

export default api;
```

## Özet

İstemci tarafında token yenileme süreci **kullanıcı için tamamen şeffaftır**. Kullanıcının hiçbir şey yapmasına gerek kalmadan, token geçersiz olduğunda otomatik olarak yenilenir ve kullanıcı deneyimi kesintisiz devam eder.

Backend tarafında sadece bir `/auth/refresh` endpoint'i sağlamanız yeterlidir. İstemci tarafında ise yukarıdaki gibi bir interceptor kullanarak token yenilemeyi otomatikleştirebilirsiniz.
