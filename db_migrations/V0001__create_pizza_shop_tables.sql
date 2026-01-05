-- Таблица пользователей
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    phone VARCHAR(20) UNIQUE NOT NULL,
    name VARCHAR(100),
    bonus_balance INTEGER DEFAULT 0,
    is_admin BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Таблица продуктов
CREATE TABLE IF NOT EXISTS products (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    category VARCHAR(20) NOT NULL CHECK (category IN ('pizza', 'snack', 'drink')),
    price_25 INTEGER,
    price_30 INTEGER,
    price INTEGER,
    image TEXT NOT NULL,
    description TEXT,
    is_popular BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Таблица заказов
CREATE TABLE IF NOT EXISTS orders (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    total_price INTEGER NOT NULL,
    bonus_used INTEGER DEFAULT 0,
    status VARCHAR(20) DEFAULT 'new' CHECK (status IN ('new', 'preparing', 'delivery', 'completed', 'cancelled')),
    delivery_address TEXT,
    phone VARCHAR(20) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Таблица позиций заказа
CREATE TABLE IF NOT EXISTS order_items (
    id SERIAL PRIMARY KEY,
    order_id INTEGER REFERENCES orders(id),
    product_id INTEGER REFERENCES products(id),
    product_name VARCHAR(100) NOT NULL,
    selected_size INTEGER CHECK (selected_size IN (25, 30)),
    quantity INTEGER NOT NULL,
    price INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Таблица конструктора пиццы
CREATE TABLE IF NOT EXISTS pizza_constructor (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    name VARCHAR(100),
    ingredients TEXT[] NOT NULL,
    size INTEGER NOT NULL CHECK (size IN (25, 30)),
    price INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Индексы для оптимизации
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);

-- Вставка тестового админа
INSERT INTO users (phone, name, bonus_balance, is_admin) 
VALUES ('+79999999999', 'Администратор', 0, TRUE)
ON CONFLICT (phone) DO NOTHING;

-- Вставка продуктов
INSERT INTO products (name, category, price_25, price_30, price, image, description, is_popular) VALUES
('Маргарита', 'pizza', 450, 650, NULL, 'https://cdn.poehali.dev/projects/0f5461ef-e977-4acb-bc1d-3e42fe98118a/files/1eaa96bb-5865-4559-8683-8bb4cf189eed.jpg', 'Томаты, моцарелла, базилик', TRUE),
('Пепперони', 'pizza', 520, 720, NULL, 'https://cdn.poehali.dev/projects/0f5461ef-e977-4acb-bc1d-3e42fe98118a/files/c780be09-37d7-4dab-8d23-571afe6e3ddf.jpg', 'Пепперони, моцарелла, томатный соус', FALSE),
('4 Сыра', 'pizza', 580, 780, NULL, 'https://cdn.poehali.dev/projects/0f5461ef-e977-4acb-bc1d-3e42fe98118a/files/010ad7f9-3328-48e3-b559-49860de9be5b.jpg', 'Моцарелла, чеддер, пармезан, дор блю', TRUE),
('Гавайская', 'pizza', 490, 690, NULL, 'https://cdn.poehali.dev/projects/0f5461ef-e977-4acb-bc1d-3e42fe98118a/files/1eaa96bb-5865-4559-8683-8bb4cf189eed.jpg', 'Курица, ананасы, моцарелла', FALSE),
('Мясная', 'pizza', 620, 850, NULL, 'https://cdn.poehali.dev/projects/0f5461ef-e977-4acb-bc1d-3e42fe98118a/files/c780be09-37d7-4dab-8d23-571afe6e3ddf.jpg', 'Говядина, свинина, курица, бекон', FALSE),
('Вегетарианская', 'pizza', 480, 680, NULL, 'https://cdn.poehali.dev/projects/0f5461ef-e977-4acb-bc1d-3e42fe98118a/files/010ad7f9-3328-48e3-b559-49860de9be5b.jpg', 'Перец, томаты, грибы, оливки', FALSE),
('Барбекю', 'pizza', 550, 750, NULL, 'https://cdn.poehali.dev/projects/0f5461ef-e977-4acb-bc1d-3e42fe98118a/files/1eaa96bb-5865-4559-8683-8bb4cf189eed.jpg', 'Курица, соус барбекю, лук, бекон', FALSE),
('Морская', 'pizza', 680, 920, NULL, 'https://cdn.poehali.dev/projects/0f5461ef-e977-4acb-bc1d-3e42fe98118a/files/c780be09-37d7-4dab-8d23-571afe6e3ddf.jpg', 'Креветки, кальмары, мидии, лосось', FALSE),
('Мексиканская', 'pizza', 540, 740, NULL, 'https://cdn.poehali.dev/projects/0f5461ef-e977-4acb-bc1d-3e42fe98118a/files/010ad7f9-3328-48e3-b559-49860de9be5b.jpg', 'Острая говядина, халапеньо, кукуруза', FALSE),
('Цезарь', 'pizza', 590, 790, NULL, 'https://cdn.poehali.dev/projects/0f5461ef-e977-4acb-bc1d-3e42fe98118a/files/1eaa96bb-5865-4559-8683-8bb4cf189eed.jpg', 'Курица, салат айсберг, пармезан, соус цезарь', FALSE),
('Карбонара', 'pizza', 570, 770, NULL, 'https://cdn.poehali.dev/projects/0f5461ef-e977-4acb-bc1d-3e42fe98118a/files/c780be09-37d7-4dab-8d23-571afe6e3ddf.jpg', 'Бекон, сливочный соус, пармезан, яйцо', FALSE),
('Дьябло', 'pizza', 560, 760, NULL, 'https://cdn.poehali.dev/projects/0f5461ef-e977-4acb-bc1d-3e42fe98118a/files/010ad7f9-3328-48e3-b559-49860de9be5b.jpg', 'Острая салями, халапеньо, чили', FALSE),
('Трюфельная', 'pizza', 750, 980, NULL, 'https://cdn.poehali.dev/projects/0f5461ef-e977-4acb-bc1d-3e42fe98118a/files/1eaa96bb-5865-4559-8683-8bb4cf189eed.jpg', 'Трюфельное масло, белые грибы, пармезан', TRUE),
('Куриные крылышки BBQ', 'snack', NULL, NULL, 320, 'https://cdn.poehali.dev/projects/0f5461ef-e977-4acb-bc1d-3e42fe98118a/files/c780be09-37d7-4dab-8d23-571afe6e3ddf.jpg', '8 шт, соус барбекю', FALSE),
('Картофель фри', 'snack', NULL, NULL, 180, 'https://cdn.poehali.dev/projects/0f5461ef-e977-4acb-bc1d-3e42fe98118a/files/010ad7f9-3328-48e3-b559-49860de9be5b.jpg', 'Хрустящий картофель с соусом', FALSE),
('Сырные палочки', 'snack', NULL, NULL, 250, 'https://cdn.poehali.dev/projects/0f5461ef-e977-4acb-bc1d-3e42fe98118a/files/1eaa96bb-5865-4559-8683-8bb4cf189eed.jpg', '6 шт, сырный соус', FALSE),
('Наггетсы', 'snack', NULL, NULL, 280, 'https://cdn.poehali.dev/projects/0f5461ef-e977-4acb-bc1d-3e42fe98118a/files/c780be09-37d7-4dab-8d23-571afe6e3ddf.jpg', '10 шт, соус на выбор', FALSE),
('Лимонад классический', 'drink', NULL, NULL, 150, 'https://cdn.poehali.dev/projects/0f5461ef-e977-4acb-bc1d-3e42fe98118a/files/010ad7f9-3328-48e3-b559-49860de9be5b.jpg', '0.5л, домашний', FALSE),
('Лимонад малиновый', 'drink', NULL, NULL, 160, 'https://cdn.poehali.dev/projects/0f5461ef-e977-4acb-bc1d-3e42fe98118a/files/1eaa96bb-5865-4559-8683-8bb4cf189eed.jpg', '0.5л, с малиной', FALSE),
('Лимонад манго-маракуйя', 'drink', NULL, NULL, 170, 'https://cdn.poehali.dev/projects/0f5461ef-e977-4acb-bc1d-3e42fe98118a/files/c780be09-37d7-4dab-8d23-571afe6e3ddf.jpg', '0.5л, тропический', FALSE)
ON CONFLICT DO NOTHING;