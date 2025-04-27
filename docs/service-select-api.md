# Service Select API

## GET /services/categories

### Açıklama
Tüm kategorileri getirir. İsteğe bağlı olarak `parentId` filtresi ile üst veya alt kategoriler alınabilir.

### İstek
```http
GET /services/categories
```

#### Query Parametreleri
| Parametre | Tip    | Açıklama                                   |
|-----------|--------|-------------------------------------------|
| parentId  | string | Belirli bir üst kategoriye ait alt kategorileri getirir. |

### Örnek İstek
```http
GET /services/categories?parentId=null
```

### Cevap
```json
[
    {
        "id": "384e7701-b6ac-4a73-92a7-a429c606fbd1",
        "name": "Akü Kontrol & Bakım",
        "parent_id": "00000000-0000-0000-0000-000000000005",
        "created_at": "2025-04-27T09:40:15.670Z"
    },
    {
        "id": "435d0ca2-e354-499c-be06-18ba41a74ca9",
        "name": "Akü & Şarj Sistemi",
        "parent_id": "00000000-0000-0000-0000-000000000002",
        "created_at": "2025-04-27T09:40:15.670Z"
    },
    {
        "id": "00000000-0000-0000-0000-000000000007",
        "name": "Araç Detaylı Temizlik ve Kuaför Hizmetleri",
        "parent_id": null,
        "created_at": "2025-04-27T09:31:12.160Z"
    }
]
```

---

## GET /services/parent-categories

### Açıklama
Sadece üst kategorileri (parent_id null olanlar) getirir.

### İstek
```http
GET /services/parent-categories
```

### Örnek İstek
```http
GET /services/parent-categories
```

### Cevap
```json
[
    {
        "id": "00000000-0000-0000-0000-000000000007",
        "name": "Araç Detaylı Temizlik ve Kuaför Hizmetleri",
        "parent_id": null,
        "created_at": "2025-04-27T09:31:12.160Z"
    },
    {
        "id": "00000000-0000-0000-0000-000000000009",
        "name": "Araç Ekspertiz ve Muayene İşlemleri",
        "parent_id": null,
        "created_at": "2025-04-27T09:31:12.160Z"
    }
]
```

---

## GET /services/category-tree

### Açıklama
Tüm kategori ağacını optimize edilmiş bir şekilde getirir.

### İstek
```http
GET /services/category-tree
```

### Örnek İstek
```http
GET /services/category-tree
```

### Cevap
```json
[
    {
        "id": "00000000-0000-0000-0000-000000000007",
        "name": "Araç Detaylı Temizlik ve Kuaför Hizmetleri",
        "parent_id": null,
        "created_at": "2025-04-27T09:31:12.160Z",
        "subcategories": [
            {
                "id": "10bfad30-1af9-467c-ba8e-7dc63c5f9e80",
                "name": "Dış Yıkama",
                "parent_id": "00000000-0000-0000-0000-000000000007",
                "created_at": "2025-04-27T09:40:15.670Z"
            }
        ]
    }
]
```

---

## GET /services/category/:id

### Açıklama
Belirtilen ID'ye sahip kategoriyi getirir.

### İstek
```http
GET /services/category/:id
```

#### Path Parametreleri
| Parametre | Tip    | Açıklama                  |
|-----------|--------|--------------------------|
| id        | string | Kategori ID'si           |

### Örnek İstek
```http
GET /services/category/384e7701-b6ac-4a73-92a7-a429c606fbd1
```

### Cevap
```json
{
    "id": "384e7701-b6ac-4a73-92a7-a429c606fbd1",
    "name": "Akü Kontrol & Bakım",
    "parent_id": "00000000-0000-0000-0000-000000000005",
    "created_at": "2025-04-27T09:40:15.670Z"
}
```

---

## GET /services/subcategories/:parentId

### Açıklama
Belirtilen üst kategoriye ait alt kategorileri getirir.

### İstek
```http
GET /services/subcategories/:parentId
```

#### Path Parametreleri
| Parametre | Tip    | Açıklama                  |
|-----------|--------|--------------------------|
| parentId  | string | Üst kategori ID'si       |

### Örnek İstek
```http
GET /services/subcategories/00000000-0000-0000-0000-000000000007
```

### Cevap
```json
[
    {
        "id": "10bfad30-1af9-467c-ba8e-7dc63c5f9e80",
        "name": "Dış Yıkama",
        "parent_id": "00000000-0000-0000-0000-000000000007",
        "created_at": "2025-04-27T09:40:15.670Z"
    },
    {
        "id": "31100ee6-8d19-41ea-94a6-748abd9da1b3",
        "name": "İç Detaylı Temizlik",
        "parent_id": "00000000-0000-0000-0000-000000000007",
        "created_at": "2025-04-27T09:40:15.670Z"
    }
]
```
