export const getEmailVerificationSuccessTemplate = (): string => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>E-posta Doğrulama - Sana İyi Usta</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      text-align: center;
      padding: 40px 20px;
      background-color: #f5f5f5;
      color: #333;
      line-height: 1.6;
    }
    .container {
      max-width: 600px;
      margin: 0 auto;
      background-color: #fff;
      padding: 30px;
      border-radius: 8px;
      box-shadow: 0 2px 10px rgba(0,0,0,0.1);
    }
    h1 {
      color: #2c3e50;
      margin-bottom: 20px;
    }
    .success-icon {
      color: #2ecc71;
      font-size: 60px;
      margin-bottom: 20px;
    }
    .message {
      font-size: 18px;
      margin-bottom: 30px;
    }
  </style>
</head>
<body>
  <div class="container">
    <h1>Sana İyi Usta</h1>
    <div class="success-icon">✓</div>
    <div class="message">
      <strong>E-posta adresiniz başarıyla doğrulandı!</strong>
      <p>Artık Sana İyi Usta uygulamasını kullanmaya başlayabilirsiniz.</p>
    </div>
  </div>
</body>
</html>
`;
