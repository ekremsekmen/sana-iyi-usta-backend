export const getEmailVerificationTemplate = (
  verificationUrl: string,
): string => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 20px; font-family: Arial, sans-serif; background-color: #f5f5f5;">
  <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 30px; border-radius: 10px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
    <div style="text-align: center; margin-bottom: 30px;">
      <h1 style="color: #2c3e50; margin: 0; font-size: 24px;">Sana İyi Usta App</h1>
      <p style="color: #7f8c8d; margin-top: 10px;">E-posta Doğrulama</p>
    </div>
    <div style="color: #34495e; font-size: 16px; line-height: 1.5;">
      <p style="margin: 10px 0;">Merhaba,</p>
      <p style="margin: 10px 0;">SanaİyiUsta hesabınızı oluşturmak için e-posta adresinizi doğrulamanız gerekiyor.</p>
      <div style="text-align: center; margin: 30px 0;">
        <a href="${verificationUrl}" style="background-color: #3498db; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block; font-size: 16px;">E-postamı Doğrula</a>
      </div>
      <p style="font-size: 14px; color: #95a5a6; text-align: center; margin: 10px 0;">Bu link 24 saat boyunca geçerlidir.</p>
    </div>
  </div>
</body>
</html>
`;
