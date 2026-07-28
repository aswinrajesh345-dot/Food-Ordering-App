-- Create tables
CREATE TABLE IF NOT EXISTS restaurants (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  image_url TEXT,
  cuisine TEXT,
  delivery_time TEXT,
  delivery_fee NUMERIC(5,2) DEFAULT 0.00,
  email TEXT UNIQUE,
  password_hash TEXT
);

-- Ensure columns exist in case the table already existed
ALTER TABLE restaurants ADD COLUMN IF NOT EXISTS image_url TEXT;
ALTER TABLE restaurants ADD COLUMN IF NOT EXISTS cuisine TEXT;
ALTER TABLE restaurants ADD COLUMN IF NOT EXISTS delivery_time TEXT;
ALTER TABLE restaurants ADD COLUMN IF NOT EXISTS delivery_fee NUMERIC(5,2) DEFAULT 0.00;
ALTER TABLE restaurants ADD COLUMN IF NOT EXISTS email TEXT UNIQUE;
ALTER TABLE restaurants ADD COLUMN IF NOT EXISTS password_hash TEXT;

CREATE TABLE IF NOT EXISTS menu_items (
  id SERIAL PRIMARY KEY,
  restaurant_id INTEGER REFERENCES restaurants(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  price NUMERIC(8,2) NOT NULL
);

CREATE TABLE IF NOT EXISTS orders (
  id SERIAL PRIMARY KEY,
  restaurant_id INTEGER REFERENCES restaurants(id),
  customer_name TEXT,
  address TEXT,
  status TEXT,
  total NUMERIC(10,2) DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS order_items (
  id SERIAL PRIMARY KEY,
  order_id INTEGER REFERENCES orders(id) ON DELETE CASCADE,
  menu_item_id INTEGER REFERENCES menu_items(id),
  quantity INTEGER,
  price NUMERIC(8,2)
);

CREATE TABLE IF NOT EXISTS reviews (
  id SERIAL PRIMARY KEY,
  restaurant_id INTEGER REFERENCES restaurants(id) ON DELETE CASCADE,
  reviewer_name TEXT,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS admins (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

ALTER TABLE orders ADD COLUMN IF NOT EXISTS user_id INTEGER REFERENCES users(id) ON DELETE SET NULL;

-- Clean slate seeding to get pristine, rich starter data
TRUNCATE restaurants, menu_items, orders, order_items, reviews RESTART IDENTITY CASCADE;

-- Seed sample restaurants
INSERT INTO restaurants (id, name, description, image_url, cuisine, delivery_time, delivery_fee) VALUES
(1, 'Pasta Palace', 'Handmade artisanal pasta, house-cooked sauces, and classic Italian desserts.', 'https://images.unsplash.com/photo-1551183053-bf91a1d81141?auto=format&fit=crop&w=800&q=60', 'Italian', '25-35 min', 1.99),
(2, 'Sushi Spot', 'Ultra-fresh premium sashimi, specialty rolls, and authentic Japanese appetizers.', 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?auto=format&fit=crop&w=800&q=60', 'Japanese', '30-40 min', 2.49),
(3, 'Burger House', 'Flame-grilled gourmet Angus beef burgers, seasoned fries, and creamy milkshakes.', 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=800&q=60', 'Burgers', '15-25 min', 0.99),
(4, 'Taco Corner', 'Authentic street tacos, stuffed burritos, fresh house guacamole, and chips.', 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?auto=format&fit=crop&w=800&q=60', 'Mexican', '20-30 min', 1.49),
(5, 'Sweet Dreams', 'Decadent French macarons, warm lava cakes, cheesecakes, and specialty hot beverages.', 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=800&q=60', 'Desserts', '10-20 min', 3.49);

-- Seed menu items
INSERT INTO menu_items (id, restaurant_id, name, description, price) VALUES
-- Pasta Place
(1, 1, 'Spaghetti Bolognese', 'Slow-simmered beef ragu with fresh parmesan and herbs.', 14.50),
(2, 1, 'Penne Arrabiata', 'Spicy tomato sauce, fresh garlic, basil, and extra virgin olive oil.', 11.00),
(3, 1, 'Classic Lasagna', 'Layers of fresh pasta, bolognese, creamy bechamel, and melted mozzarella.', 16.00),
(4, 1, 'Tiramisu', 'Espresso-soaked ladyfingers with whipped mascarpone cream and cocoa powder.', 8.50),

-- Sushi Spot
(5, 2, 'Salmon Roll', 'Fresh Atlantic salmon, cucumber, avocado, rolled with sesame seeds.', 9.50),
(6, 2, 'Tuna Sashimi', 'Five thick slices of premium fresh yellowfin tuna.', 15.00),
(7, 2, 'Dragon Roll', 'Eel and cucumber inside, topped with avocado and sweet unagi sauce.', 13.50),
(8, 2, 'Miso Soup', 'Traditional dashi broth with tofu, seaweed, and green onions.', 4.00),

-- Burger House
(9, 3, 'Classic Cheeseburger', 'Angus beef patty, cheddar, lettuce, tomato, pickles, and house sauce.', 10.99),
(10, 3, 'Bacon BBQ Burger', 'Angus patty, crispy applewood bacon, cheddar, crispy onion rings, BBQ sauce.', 12.99),
(11, 3, 'Veggie Burger', 'House-made quinoa and black bean patty, avocado, lettuce, garlic aioli.', 11.49),
(12, 3, 'Truffle Parmesan Fries', 'Crispy thin-cut fries tossed in white truffle oil and fresh parmesan.', 5.99),

-- Taco Corner
(13, 4, 'Al Pastor Tacos', 'Three corn tortillas with marinated pork, pineapple, cilantro, and onions.', 9.00),
(14, 4, 'Grande Beef Burrito', 'Seared beef, seasoned rice, black beans, pico de gallo, and sour cream.', 10.50),
(15, 4, 'Cheese Quesadilla', 'Large flour tortilla filled with a blend of melted Monterey Jack and cheddar.', 8.00),
(16, 4, 'Chips & Fresh Guacamole', 'Crispy corn tortilla chips paired with daily-made fresh guacamole.', 6.50),

-- Sweet Dreams
(17, 5, 'Chocolate Lava Cake', 'Warm chocolate cake with a molten fudge center, served with vanilla bean sauce.', 7.99),
(18, 5, 'Strawberry Cheesecake', 'Creamy New York style cheesecake topped with fresh strawberry compote.', 6.99),
(19, 5, 'Macaron Box (6 pcs)', 'Assortment of chocolate, vanilla, pistachio, raspberry, lemon, and caramel.', 9.99),
(20, 5, 'Iced Matcha Latte', 'Whisked organic Japanese matcha with chilled milk over ice.', 4.99);

-- Seed reviews
INSERT INTO reviews (restaurant_id, reviewer_name, rating, comment) VALUES
(1, 'Asha', 5, 'Absolutely loved the lasagna! The pasta was perfectly cooked and authentic.'),
(1, 'Ravi', 4, 'Great flavors, portions were very generous. Will order again!'),
(2, 'Mei', 5, 'The fish is incredibly fresh here. The dragon roll is a must-try.'),
(2, 'Ken', 4, 'Superb quality sashimi, though a bit on the expensive side.'),
(3, 'Sarah', 5, 'The bacon BBQ burger is hands down the best burger in town. Perfectly cooked.'),
(3, 'John', 3, 'Burger was decent but the truffle fries were a bit cold on delivery.'),
(4, 'Carlos', 5, 'Authentic street tacos! The al pastor with pineapple is perfect.'),
(4, 'Elena', 4, 'Great burritos, packed with ingredients. Salsa has a nice kick!'),
(5, 'Emily', 5, 'The chocolate lava cake was heaven in a box! Arrived warm too.'),
(5, 'Liam', 5, 'Lovely macaron selection. Excellent packaging and delicious flavors.');

-- Reset sequence values in case of manual inserts
SELECT setval('restaurants_id_seq', (SELECT MAX(id) FROM restaurants));
SELECT setval('menu_items_id_seq', (SELECT MAX(id) FROM menu_items));
SELECT setval('reviews_id_seq', (SELECT MAX(id) FROM reviews));
