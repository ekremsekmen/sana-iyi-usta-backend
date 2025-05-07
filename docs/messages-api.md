# Mesajlaşma API Dokümantasyonu

Bu dokümantasyon, mesajlaşma modülü için tüm API endpointlerini ve WebSocket olaylarını içermektedir.

## Kimlik Doğrulama

Tüm HTTP endpoint'leri için JWT token gereklidir. Token, `Authorization` header'ında `Bearer {token}` formatında gönderilmelidir.

WebSocket bağlantıları için token, bağlantı sırasında `auth.token` ya da `headers.authorization` üzerinden sağlanmalıdır.

## HTTP Endpoints

### Mesaj Gönderme

Yeni bir mesaj oluşturur.

- **URL:** `/messages`
- **Metod:** `POST`
- **Yetkilendirme Gerekli:** Evet

**İstek Gövdesi:**

```json
{
  "receiverId": "string",
  "content": "string"
}
```

**Başarılı Yanıt:**

```json
{
  "id": "string",
  "senderId": "string",
  "receiverId": "string",
  "content": "string",
  "sentAt": "string",
  "isRead": false
}
```

**Hata Yanıtı:**

```json
{
  "statusCode": 404,
  "message": "Alıcı kullanıcı bulunamadı",
  "error": "Not Found"
}
```

### Konuşma Listesi Alma

Kullanıcının tüm konuşmalarını listeler.

- **URL:** `/messages/conversations`
- **Metod:** `GET`
- **Yetkilendirme Gerekli:** Evet

**Başarılı Yanıt:**

```json
[
  {
    "user_id": "string",
    "full_name": "string",
    "profile_image": "string",
    "last_message": "string",
    "last_message_time": "string",
    "unread_count": 0
  }
]
```

### Belirli Bir Kullanıcı ile Konuşma Alma

Belirli bir kullanıcı ile olan tüm mesajlaşma geçmişini getirir.

- **URL:** `/messages/conversation/:userId`
- **Metod:** `GET`
- **Yetkilendirme Gerekli:** Evet

**Parametreler:**

- `userId`: Konuşma yapılan kullanıcının ID'si

**Başarılı Yanıt:**

```json
{
  "user": {
    "id": "string",
    "full_name": "string",
    "profile_image": "string"
  },
  "messages": [
    {
      "id": "string",
      "senderId": "string",
      "receiverId": "string",
      "content": "string",
      "sentAt": "string",
      "isRead": false
    }
  ],
  "unreadCount": 0
}
```

**Hata Yanıtı:**

```json
{
  "statusCode": 404,
  "message": "Kullanıcı bulunamadı",
  "error": "Not Found"
}
```

### Mesajı Okundu Olarak İşaretleme

Belirli bir mesajı okundu olarak işaretler.

- **URL:** `/messages/:messageId/read`
- **Metod:** `PUT`
- **Yetkilendirme Gerekli:** Evet

**Parametreler:**

- `messageId`: Okundu olarak işaretlenecek mesajın ID'si

**Başarılı Yanıt:**

```json
{
  "id": "string",
  "senderId": "string",
  "receiverId": "string",
  "content": "string",
  "sentAt": "string",
  "isRead": true
}
```

**Hata Yanıtı:**

```json
{
  "statusCode": 404,
  "message": "Mesaj bulunamadı",
  "error": "Not Found"
}
```

ya da

```json
{
  "statusCode": 404,
  "message": "Bu mesajı okundu olarak işaretleme yetkiniz yok",
  "error": "Not Found"
}
```

### Tüm Mesajları Okundu Olarak İşaretleme

Belirli bir göndericiden gelen tüm mesajları okundu olarak işaretler.

- **URL:** `/messages/read-all/:senderId`
- **Metod:** `PUT`
- **Yetkilendirme Gerekli:** Evet

**Parametreler:**

- `senderId`: Mesajları okundu olarak işaretlenecek gönderici kullanıcının ID'si

**Başarılı Yanıt:**

```json
{
  "success": true
}
```

### Konuşma Silme

İki kullanıcı arasındaki tüm mesajlaşma geçmişini siler.

- **URL:** `/messages/conversation/:userId`
- **Metod:** `DELETE`
- **Yetkilendirme Gerekli:** Evet

**Parametreler:**

- `userId`: Konuşması silinecek kullanıcının ID'si

**Başarılı Yanıt:**

```json
{
  "success": true
}
```

**Hata Yanıtı:**

```json
{
  "statusCode": 404,
  "message": "Kullanıcı bulunamadı",
  "error": "Not Found"
}
```

## WebSocket Olayları

### Bağlantı Kurma

Socket.IO istemcisini başlatırken JWT token'ı sağlamalısınız:

```javascript
const socket = io('WS_URL', {
  auth: {
    token: 'JWT_TOKEN'
  }
});
```

veya

```javascript
const socket = io('WS_URL', {
  extraHeaders: {
    Authorization: 'Bearer JWT_TOKEN'
  }
});
```

### Gönderilen Olaylar (Client -> Server)

#### sendMessage

Yeni bir mesaj göndermek için kullanılır.

```javascript
socket.emit('sendMessage', {
  receiverId: 'string',
  content: 'string'
});
```

#### markAsRead

Bir mesajı okundu olarak işaretlemek için kullanılır.

```javascript
socket.emit('markAsRead', {
  messageId: 'string'
});
```

#### markAllAsRead

Belirli bir göndericiden gelen tüm mesajları okundu olarak işaretlemek için kullanılır.

```javascript
socket.emit('markAllAsRead', {
  senderId: 'string'
});
```

#### deleteConversation

Bir konuşmayı silmek için kullanılır.

```javascript
socket.emit('deleteConversation', {
  otherUserId: 'string'
});
```

### Alınan Olaylar (Server -> Client)

#### newMessage

Yeni bir mesaj alındığında tetiklenir.

```javascript
socket.on('newMessage', (message) => {
  console.log(message);
  // {
  //   id: 'string',
  //   senderId: 'string',
  //   receiverId: 'string',
  //   content: 'string',
  //   sentAt: 'string',
  //   isRead: false
  // }
});
```

#### messageRead

Bir mesaj okunduğunda tetiklenir.

```javascript
socket.on('messageRead', (data) => {
  console.log(data);
  // { messageId: 'string' }
});
```

#### allMessagesRead

Tüm mesajlar okunduğunda tetiklenir.

```javascript
socket.on('allMessagesRead', (data) => {
  console.log(data);
  // { receiverId: 'string' }
});
```

#### conversationDeleted

Bir konuşma silindiğinde tetiklenir.

```javascript
socket.on('conversationDeleted', (data) => {
  console.log(data);
  // { userId: 'string' }
});
```

#### notification

Genel bildirimler için kullanılır. Farklı bildirim tipleri için örnekler:

```javascript
socket.on('notification', (notification) => {
  switch(notification.type) {
    case 'new_message':
      // Yeni mesaj bildirimi
      console.log(notification.message);
      break;
    case 'message_read':
      // Mesaj okundu bildirimi
      console.log(notification.messageId);
      break;
    case 'all_messages_read':
      // Tüm mesajlar okundu bildirimi
      console.log(notification.receiverId);
      break;
    case 'conversation_deleted':
      // Konuşma silindi bildirimi
      console.log(notification.userId);
      break;
  }
});
```
