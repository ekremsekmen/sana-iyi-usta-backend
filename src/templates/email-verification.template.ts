export const getEmailVerificationTemplate = (
  verificationUrl: string,
): string => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="color-scheme" content="light">
  <meta name="supported-color-schemes" content="light">
  <title>E-posta Doğrulama - Sana İyi Usta</title>
</head>
<body style="margin: 0; padding: 20px; font-family: Arial, Helvetica, sans-serif; background-color: #f5f5f5; color: #333333;">
  <table width="100%" border="0" cellspacing="0" cellpadding="0">
    <tr>
      <td align="center">
        <table style="max-width: 600px; width: 100%; background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); overflow: hidden;">
          <tr>
            <td style="padding: 30px 30px 20px 30px; text-align: center; border-bottom: 1px solid #eeeeee;">
              <h1 style="color: #2c3e50; margin: 0; font-size: 24px; font-weight: 700;">Sana İyi Usta</h1>
              <p style="color: #7f8c8d; margin-top: 10px; font-size: 16px;">E-posta Adresinizi Doğrulayın</p>
            </td>
          </tr>
          <tr>
            <td style="padding: 30px; color: #34495e; font-size: 16px; line-height: 1.5;">
              <p style="margin: 0 0 15px 0;">Merhaba,</p>
              <p style="margin: 0 0 25px 0;">SanaİyiUsta uygulamasına kaydolduğunuz için teşekkür ederiz. Hesabınızı etkinleştirmek için lütfen aşağıdaki butona tıklayarak e-posta adresinizi doğrulayın.</p>
              <table width="100%" border="0" cellspacing="0" cellpadding="0">
                <tr>
                  <td align="center" style="padding: 20px 0 30px 0;">
                    <a href="${verificationUrl}" style="background-color: #3498db; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block; font-size: 16px; font-weight: bold;">E-postamı Doğrula</a>
                  </td>
                </tr>
              </table>
              <p style="font-size: 14px; color: #95a5a6; text-align: center; margin: 0 0 15px 0;">Bu bağlantı 24 saat boyunca geçerlidir.</p>
              <p style="font-size: 14px; margin: 25px 0 0 0;">Bu e-postayı istemediğiniz halde aldıysanız, lütfen görmezden gelin.</p>
            </td>
          </tr>
          <tr>
            <td style="padding: 20px; text-align: center; background-color: #f8f9fa; color: #95a5a6; font-size: 12px; border-top: 1px solid #eeeeee;">
              <p style="margin: 0;">© ${new Date().getFullYear()} Sana İyi Usta. Tüm hakları saklıdır.</p>
              <p style="margin: 5px 0 0 0;">Bu e-posta, hesap doğrulama işlemi için gönderilmiştir.</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`;
