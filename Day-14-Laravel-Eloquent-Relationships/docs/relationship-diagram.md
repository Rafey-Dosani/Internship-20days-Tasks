# Category–Product relationship

```mermaid
erDiagram
    CATEGORIES ||--o{ PRODUCTS : contains
    CATEGORIES {
        bigint id PK
        string name UK
        text description
        datetime created_at
        datetime updated_at
    }
    PRODUCTS {
        bigint id PK
        bigint category_id FK
        string name
        text description
        decimal price
        datetime created_at
        datetime updated_at
    }
```

Each product belongs to exactly one category through the non-null `products.category_id` foreign key. A category may have zero or more products. Deleting a category cascades to its products at the database level.
