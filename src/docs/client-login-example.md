# İstemci Tarafında Login ve Kullanıcı Bilgilerini Kullanma

## Login İşlemi Sonrası

```typescript
// Login başarılı olduğunda
async function handleLogin(email, password) {
  try {
    const response = await api.post('/auth/login', { e_mail: email, password });
    
    // Token'ları sakla
    localStorage.setItem('access_token', response.data.access_token);
    localStorage.setItem('refresh_token', response.data.refresh_token);
    
    // Kullanıcı bilgilerini sakla
    localStorage.setItem('user', JSON.stringify(response.data.user));
    
    // Kullanıcı rolüne göre doğru sayfaya yönlendir
    if (response.data.user.role === 'mechanic') {
      router.push('/mechanic/dashboard');
    } else if (response.data.user.role === 'customer') {
      router.push('/customer/dashboard');
    } else if (response.data.user.role === 'admin') {
      router.push('/admin/dashboard');
    }
  } catch (error) {
    console.error('Login failed:', error);
    setError('Giriş başarısız. Lütfen bilgilerinizi kontrol edin.');
  }
}
```

## Kullanıcı Bilgilerini Kullanma

```typescript
// Herhangi bir component içinde
function UserProfile() {
  const [user, setUser] = useState(null);
  
  useEffect(() => {
    // Local storage'dan kullanıcı bilgilerini al
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);
  
  if (!user) return <div>Yükleniyor...</div>;
  
  return (
    <div>
      <h1>Hoş geldiniz, {user.full_name}</h1>
      <p>E-posta: {user.e_mail}</p>
      <p>Kullanıcı ID: {user.id}</p>
      <p>Rol: {user.role === 'mechanic' ? 'Usta' : 'Müşteri'}</p>
      
      {user.role === 'mechanic' && (
        <div>
          <h2>Usta Paneli</h2>
          <button>Servis Taleplerini Görüntüle</button>
          <button>Randevuları Yönet</button>
        </div>
      )}
      
      {user.role === 'customer' && (
        <div>
          <h2>Müşteri Paneli</h2>
          <button>Yeni Servis Talebi Oluştur</button>
          <button>Araçlarımı Görüntüle</button>
        </div>
      )}
    </div>
  );
}
```

Bu şekilde, kullanıcı bilgilerini login sırasında istemci tarafında saklayarak uygulamanın farklı bölümlerinde kolayca erişebilir ve kullanabilirsiniz.
