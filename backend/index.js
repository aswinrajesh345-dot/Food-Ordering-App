require('dotenv').config();
const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('./db');

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  console.error('Missing JWT_SECRET. Set JWT_SECRET in backend/.env or the environment before starting the backend.');
  process.exit(1);
}

const app = express();
const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN || 'http://localhost:5173';
app.use(cors({ origin: CLIENT_ORIGIN }));
app.use(express.json());

// Run database migrations and seeding on start to ensure schema is correct & seeded
async function runMigrations() {
  try {
    // 1. Ensure required columns are present
    await db.query(`
      ALTER TABLE restaurants ADD COLUMN IF NOT EXISTS cuisine TEXT;
      ALTER TABLE restaurants ADD COLUMN IF NOT EXISTS delivery_time TEXT;
      ALTER TABLE restaurants ADD COLUMN IF NOT EXISTS delivery_fee NUMERIC(5,2) DEFAULT 0.00;
      ALTER TABLE restaurants ADD COLUMN IF NOT EXISTS email TEXT UNIQUE;
      ALTER TABLE restaurants ADD COLUMN IF NOT EXISTS password_hash TEXT;
    `);

    // 1b. Ensure users table exists
    await db.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT NOW()
      );
    `);

    // 1c. Ensure admins table exists
    await db.query(`
      CREATE TABLE IF NOT EXISTS admins (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT NOW()
      );
    `);

    // 1d. Ensure user_id column is present on orders table
    await db.query(`
      ALTER TABLE orders ADD COLUMN IF NOT EXISTS user_id INTEGER REFERENCES users(id) ON DELETE SET NULL;
    `);
    console.log('Database migrations verified successfully');

    // 2. Check if database needs seeding (less than 5 restaurants)
    const countRes = await db.query('SELECT COUNT(*) FROM restaurants');
    const count = parseInt(countRes.rows[0].count, 10);
    
    if (count < 5) {
      console.log(`Found ${count} restaurants. Seeding rich default data...`);
      const sqlPath = path.join(__dirname, 'db', 'init.sql');
      if (fs.existsSync(sqlPath)) {
        const sql = fs.readFileSync(sqlPath, 'utf8');
        await db.query(sql);
        console.log('Database successfully initialized and seeded with rich mock data');
      } else {
        console.warn(`Could not find init.sql at ${sqlPath}`);
      }
    }

    // 2a. Check if restaurants need credential seeding
    const restRows = await db.query('SELECT id, name, email FROM restaurants');
    for (const r of restRows.rows) {
      if (r.name === 'Pasta Palace') {
        const email = 'pastapalace@gmail.com';
        const password = 'abcd12345';
        const hash = await bcrypt.hash(password, 10);
        await db.query('UPDATE restaurants SET email = $1, password_hash = $2 WHERE id = $3', [email, hash, r.id]);
        console.log(`Verified credentials for restaurant: ${r.name} (${email})`);
      } else if (!r.email) {
        // E.g. "Sushi Spot" -> slug "sushispot" -> email "sushispot@quickbite.com"
        const slug = r.name.toLowerCase().replace(/\s+/g, '');
        const email = `${slug}@quickbite.com`;
        const password = `${slug}123`;
        const hash = await bcrypt.hash(password, 10);
        await db.query('UPDATE restaurants SET email = $1, password_hash = $2 WHERE id = $3', [email, hash, r.id]);
        console.log(`Seeded credentials for restaurant: ${r.name} (${email} / ${slug}123)`);
      }
    }

    // 2b. Ensure admin account exists
    const adminEmail = 'admin@gmail.com';
    const adminPassword = 'admin12345';
    const adminHash = await bcrypt.hash(adminPassword, 10);
    await db.query(
      `INSERT INTO admins (name, email, password_hash)
       VALUES ($1, $2, $3)
       ON CONFLICT (email)
       DO UPDATE SET name = EXCLUDED.name, password_hash = EXCLUDED.password_hash`,
      ['QuickBite Admin', adminEmail, adminHash]
    );
    console.log(`Verified admin credentials (${adminEmail})`);

    // 2c. Check if users table needs seeding (if empty)
    const userCountRes = await db.query('SELECT COUNT(*) FROM users');
    const userCount = parseInt(userCountRes.rows[0].count, 10);
    if (userCount === 0) {
      console.log('No users found. Seeding demo user...');
      const demoHash = await bcrypt.hash('demo123', 10);
      await db.query(
        'INSERT INTO users (name, email, password_hash) VALUES ($1, $2, $3)',
        ['Demo User', 'demo@quickbite.com', demoHash]
      );
      console.log('Demo user seeded successfully (demo@quickbite.com / demo123)');
    }


    // 3. Fix any broken image URLs (old Unsplash IDs that return 404)
    await db.query(`
      UPDATE restaurants SET image_url = 'https://images.unsplash.com/photo-1551183053-bf91a1d81141?auto=format&fit=crop&w=800&q=60'
        WHERE image_url LIKE '%photo-1523986371872%';
      UPDATE restaurants SET image_url = 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?auto=format&fit=crop&w=800&q=60'
        WHERE image_url LIKE '%photo-1562158070%';
    `);
    console.log('Image URL integrity check complete');
  } catch (e) {
    console.error('Database migration or seeding check failed:', e.message);
  }
}

// health
app.get('/health', async (req, res) => {
  try {
    await db.query('SELECT 1');
    res.json({ status: 'ok' });
  } catch (e) {
    res.status(500).json({ status: 'db error' });
  }
});

// --- AUTH MIDDLEWARE ---
function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Authentication required' });
  }
  try {
    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (e) {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
}

function adminMiddleware(req, res, next) {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Admin access required' });
  }
  next();
}

// --- AUTH ROUTES ---
app.post('/auth/signup', async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ error: 'Name, email, and password are required' });
  }
  if (password.length < 6) {
    return res.status(400).json({ error: 'Password must be at least 6 characters' });
  }
  try {
    // Check if user already exists
    const existing = await db.query('SELECT id FROM users WHERE email = $1', [email.toLowerCase()]);
    if (existing.rows.length > 0) {
      return res.status(409).json({ error: 'An account with this email already exists' });
    }
    const password_hash = await bcrypt.hash(password, 10);
    const result = await db.query(
      'INSERT INTO users (name, email, password_hash) VALUES ($1, $2, $3) RETURNING id, name, email, created_at',
      [name.trim(), email.toLowerCase().trim(), password_hash]
    );
    const user = result.rows[0];
    const token = jwt.sign({ id: user.id, name: user.name, email: user.email }, JWT_SECRET, { expiresIn: '7d' });
    res.json({ user, token });
  } catch (e) {
    console.error('Signup error:', e);
    res.status(500).json({ error: 'Signup failed. Please try again.' });
  }
});

app.post('/auth/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }
  try {
    const result = await db.query('SELECT * FROM users WHERE email = $1', [email.toLowerCase()]);
    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }
    const user = result.rows[0];
    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }
    const token = jwt.sign({ id: user.id, name: user.name, email: user.email }, JWT_SECRET, { expiresIn: '7d' });
    res.json({
      user: { id: user.id, name: user.name, email: user.email, created_at: user.created_at },
      token
    });
  } catch (e) {
    console.error('Login error:', e);
    res.status(500).json({ error: 'Login failed. Please try again.' });
  }
});

app.post('/auth/restaurant/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }
  try {
    const result = await db.query('SELECT * FROM restaurants WHERE email = $1', [email.toLowerCase().trim()]);
    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }
    const restaurant = result.rows[0];
    const valid = await bcrypt.compare(password, restaurant.password_hash);
    if (!valid) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }
    const token = jwt.sign({ id: restaurant.id, role: 'restaurant', name: restaurant.name, email: restaurant.email }, JWT_SECRET, { expiresIn: '7d' });
    res.json({
      user: { id: restaurant.id, role: 'restaurant', name: restaurant.name, email: restaurant.email },
      token
    });
  } catch (e) {
    console.error('Restaurant login error:', e);
    res.status(500).json({ error: 'Login failed. Please try again.' });
  }
});

app.post('/auth/admin/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }
  try {
    const result = await db.query('SELECT * FROM admins WHERE email = $1', [email.toLowerCase().trim()]);
    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }
    const admin = result.rows[0];
    const valid = await bcrypt.compare(password, admin.password_hash);
    if (!valid) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }
    const token = jwt.sign({ id: admin.id, role: 'admin', name: admin.name, email: admin.email }, JWT_SECRET, { expiresIn: '7d' });
    res.json({
      user: { id: admin.id, role: 'admin', name: admin.name, email: admin.email, created_at: admin.created_at },
      token
    });
  } catch (e) {
    console.error('Admin login error:', e);
    res.status(500).json({ error: 'Login failed. Please try again.' });
  }
});

app.get('/auth/me', authMiddleware, async (req, res) => {
  try {
    if (req.user.role === 'admin') {
      const result = await db.query('SELECT id, name, email, created_at FROM admins WHERE id = $1', [req.user.id]);
      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Admin not found' });
      }
      return res.json({ ...result.rows[0], role: 'admin' });
    }

    if (req.user.role === 'restaurant') {
      const result = await db.query('SELECT id, name, email, cuisine, delivery_time, delivery_fee FROM restaurants WHERE id = $1', [req.user.id]);
      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Restaurant not found' });
      }
      return res.json({ ...result.rows[0], role: 'restaurant' });
    }

    // Default to customer
    const result = await db.query('SELECT id, name, email, created_at FROM users WHERE id = $1', [req.user.id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json({ ...result.rows[0], role: 'customer' });
  } catch (e) {
    console.error('Auth me error:', e);
    res.status(500).json({ error: 'Failed to fetch user' });
  }
});

// --- ADMIN ROUTES ---
app.get('/admin/users', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const result = await db.query(
      `SELECT u.id, u.name, u.email, u.created_at, COUNT(o.id)::int AS order_count
       FROM users u
       LEFT JOIN orders o ON o.user_id = u.id
       GROUP BY u.id
       ORDER BY u.created_at DESC`
    );
    res.json(result.rows);
  } catch (e) {
    console.error('Admin users error:', e);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

app.delete('/admin/users/:id', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const result = await db.query('DELETE FROM users WHERE id = $1 RETURNING id', [req.params.id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json({ success: true, id: result.rows[0].id });
  } catch (e) {
    console.error('Admin delete user error:', e);
    res.status(500).json({ error: 'Failed to delete user' });
  }
});

app.get('/admin/restaurants', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const result = await db.query(
      `SELECT r.id, r.name, r.description, r.image_url, r.cuisine, r.delivery_time,
              r.delivery_fee, r.email, COUNT(DISTINCT mi.id)::int AS menu_count,
              COUNT(DISTINCT o.id)::int AS order_count
       FROM restaurants r
       LEFT JOIN menu_items mi ON mi.restaurant_id = r.id
       LEFT JOIN orders o ON o.restaurant_id = r.id
       GROUP BY r.id
       ORDER BY r.name`
    );
    res.json(result.rows);
  } catch (e) {
    console.error('Admin restaurants error:', e);
    res.status(500).json({ error: 'Failed to fetch restaurants' });
  }
});

app.patch('/admin/restaurants/:id', authMiddleware, adminMiddleware, async (req, res) => {
  const { name, description, image_url, cuisine, delivery_time, delivery_fee, email, password } = req.body;
  const updates = [];
  const values = [];

  function addUpdate(column, value) {
    values.push(value);
    updates.push(`${column} = $${values.length}`);
  }

  if (name !== undefined) {
    if (!String(name).trim()) {
      return res.status(400).json({ error: 'Restaurant name is required' });
    }
    addUpdate('name', String(name).trim());
  }
  if (description !== undefined) addUpdate('description', String(description || '').trim());
  if (image_url !== undefined) addUpdate('image_url', String(image_url || '').trim());
  if (cuisine !== undefined) addUpdate('cuisine', String(cuisine || '').trim());
  if (delivery_time !== undefined) addUpdate('delivery_time', String(delivery_time || '').trim());
  if (delivery_fee !== undefined) addUpdate('delivery_fee', Number(delivery_fee) || 0);
  if (email !== undefined) {
    const normalizedEmail = String(email || '').trim().toLowerCase();
    addUpdate('email', normalizedEmail || null);
  }
  if (password) {
    if (String(password).length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters' });
    }
    const passwordHash = await bcrypt.hash(String(password), 10);
    addUpdate('password_hash', passwordHash);
  }

  if (updates.length === 0) {
    return res.status(400).json({ error: 'No restaurant fields provided' });
  }

  try {
    values.push(req.params.id);
    const result = await db.query(
      `UPDATE restaurants
       SET ${updates.join(', ')}
       WHERE id = $${values.length}
       RETURNING id, name, description, image_url, cuisine, delivery_time, delivery_fee, email`,
      values
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Restaurant not found' });
    }
    res.json(result.rows[0]);
  } catch (e) {
    console.error('Admin update restaurant error:', e);
    if (e.code === '23505') {
      return res.status(409).json({ error: 'Restaurant email already exists' });
    }
    res.status(500).json({ error: 'Failed to update restaurant' });
  }
});

app.get('/restaurants', async (req, res) => {
  const q = (req.query.q || req.query.search || '').trim();
  const cuisine = (req.query.cuisine || '').trim();
  try {
    let result;
    if (cuisine && cuisine.toLowerCase() !== 'all') {
      result = await db.query(
        `SELECT r.*, COALESCE(avg_rev.avg_rating,0) AS avg_rating, COALESCE(avg_rev.count,0) AS review_count
         FROM restaurants r
         LEFT JOIN (
           SELECT restaurant_id, ROUND(AVG(rating)::numeric,2) AS avg_rating, COUNT(*) AS count
           FROM reviews GROUP BY restaurant_id
         ) avg_rev ON avg_rev.restaurant_id = r.id
         WHERE r.cuisine ILIKE $1
         ORDER BY avg_rating DESC, r.name`,
        [cuisine]
      );
    } else {
      const search = q ? `%${q}%` : '%';
      result = await db.query(
        `SELECT r.*, COALESCE(avg_rev.avg_rating,0) AS avg_rating, COALESCE(avg_rev.count,0) AS review_count
         FROM restaurants r
         LEFT JOIN (
           SELECT restaurant_id, ROUND(AVG(rating)::numeric,2) AS avg_rating, COUNT(*) AS count
           FROM reviews GROUP BY restaurant_id
         ) avg_rev ON avg_rev.restaurant_id = r.id
         WHERE r.name ILIKE $1 OR r.description ILIKE $1 OR r.cuisine ILIKE $1
         ORDER BY avg_rating DESC, r.name`,
        [search]
      );
    }
    res.json(result.rows);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'db error' });
  }
});

app.get('/restaurants/:id/menu', async (req, res) => {
  const id = req.params.id;
  try {
    const result = await db.query('SELECT * FROM menu_items WHERE restaurant_id=$1 ORDER BY price ASC', [id]);
    res.json(result.rows);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'db error' });
  }
});

app.get('/restaurants/:id', async (req, res) => {
  const id = req.params.id;
  try {
    const r = await db.query('SELECT * FROM restaurants WHERE id=$1', [id]);
    if (r.rows.length === 0) return res.status(404).json({ error: 'not found' });
    const menu = await db.query('SELECT * FROM menu_items WHERE restaurant_id=$1 ORDER BY price ASC', [id]);
    const reviews = await db.query('SELECT * FROM reviews WHERE restaurant_id=$1 ORDER BY created_at DESC', [id]);
    const avg = await db.query('SELECT ROUND(AVG(rating)::numeric,2) AS avg_rating, COUNT(*) AS count FROM reviews WHERE restaurant_id=$1', [id]);
    res.json({ restaurant: r.rows[0], menu: menu.rows, reviews: reviews.rows, stats: avg.rows[0] });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'db error' });
  }
});

app.post('/restaurants/:id/reviews', async (req, res) => {
  const id = req.params.id;
  const { reviewer_name, rating, comment } = req.body;
  if (!rating || rating < 1 || rating > 5) return res.status(400).json({ error: 'invalid rating' });
  try {
    const ins = await db.query('INSERT INTO reviews (restaurant_id, reviewer_name, rating, comment) VALUES ($1,$2,$3,$4) RETURNING *', [id, reviewer_name || 'Anonymous', rating, comment]);
    const avg = await db.query('SELECT ROUND(AVG(rating)::numeric,2) AS avg_rating, COUNT(*) AS count FROM reviews WHERE restaurant_id=$1', [id]);
    res.json({ review: ins.rows[0], stats: avg.rows[0] });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'db error' });
  }
});

async function attachItemsToOrders(orders) {
  if (orders.length === 0) {
    return [];
  }

  const orderIds = orders.map(order => order.id);
  const itemsRes = await db.query(
    `SELECT oi.*, mi.name as menu_item_name
     FROM order_items oi
     JOIN menu_items mi ON oi.menu_item_id = mi.id
     WHERE oi.order_id = ANY($1::int[])
     ORDER BY oi.id`,
    [orderIds]
  );

  const itemsMap = {};
  itemsRes.rows.forEach(item => {
    if (!itemsMap[item.order_id]) {
      itemsMap[item.order_id] = [];
    }
    itemsMap[item.order_id].push(item);
  });

  return orders.map(order => ({
    ...order,
    items: itemsMap[order.id] || []
  }));
}

// GET /orders: Fetch customer order history or restaurant incoming orders
app.get('/orders', authMiddleware, async (req, res) => {
  try {
    let ordersRes;

    if (req.user.role === 'restaurant') {
      ordersRes = await db.query(
        `SELECT o.*, r.name as restaurant_name, r.image_url as restaurant_image, u.email as customer_email
         FROM orders o
         JOIN restaurants r ON o.restaurant_id = r.id
         LEFT JOIN users u ON o.user_id = u.id
         WHERE o.restaurant_id = $1
         ORDER BY
           CASE o.status
             WHEN 'pending' THEN 1
             WHEN 'preparing' THEN 2
             WHEN 'out_for_delivery' THEN 3
             WHEN 'delivered' THEN 4
             ELSE 5
           END,
           o.created_at DESC`,
        [req.user.id]
      );
    } else {
      ordersRes = await db.query(
        `SELECT o.*, r.name as restaurant_name, r.image_url as restaurant_image
         FROM orders o
         JOIN restaurants r ON o.restaurant_id = r.id
         WHERE o.user_id = $1
         ORDER BY o.created_at DESC`,
        [req.user.id]
      );
    }

    const orders = await attachItemsToOrders(ordersRes.rows);
    res.json(orders);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'db error' });
  }
});

// PATCH /orders/:id/status: Update status of an order (e.g. pending -> preparing -> out_for_delivery -> delivered)
app.patch('/orders/:id/status', authMiddleware, async (req, res) => {
  const id = req.params.id;
  const { status } = req.body;
  const validStatuses = ['pending', 'preparing', 'out_for_delivery', 'delivered'];
  
  if (!validStatuses.includes(status)) {
    return res.status(400).json({ error: 'Invalid status' });
  }

  if (req.user.role !== 'restaurant') {
    return res.status(403).json({ error: 'Only restaurants can update order status' });
  }

  try {
    const result = await db.query(
      'UPDATE orders SET status = $1 WHERE id = $2 AND restaurant_id = $3 RETURNING *',
      [status, id, req.user.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Order not found' });
    }

    res.json(result.rows[0]);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'db error' });
  }
});

app.post('/orders', authMiddleware, async (req, res) => {
  const { restaurant_id, items, customer_name, address } = req.body;
  if (req.user.role === 'restaurant') {
    return res.status(403).json({ error: 'Restaurant accounts cannot place customer orders' });
  }

  try {
    await db.query('BEGIN');
    const orderRes = await db.query(
      'INSERT INTO orders (restaurant_id, customer_name, address, status, total, user_id) VALUES ($1,$2,$3,$4,$5,$6) RETURNING id',
      [restaurant_id, customer_name, address, 'pending', 0, req.user.id]
    );
    const orderId = orderRes.rows[0].id;
    let total = 0;
    for (const it of items) {
      const m = await db.query('SELECT price FROM menu_items WHERE id=$1', [it.menu_item_id]);
      const price = m.rows[0].price;
      total += price * it.quantity;
      await db.query('INSERT INTO order_items (order_id, menu_item_id, quantity, price) VALUES ($1,$2,$3,$4)', [
        orderId,
        it.menu_item_id,
        it.quantity,
        price,
      ]);
    }
    
    // Add delivery fee to total
    const restRes = await db.query('SELECT delivery_fee FROM restaurants WHERE id=$1', [restaurant_id]);
    const deliveryFee = Number(restRes.rows[0]?.delivery_fee || 0);
    const orderTotal = total + deliveryFee;

    await db.query('UPDATE orders SET total=$1 WHERE id=$2', [orderTotal, orderId]);
    await db.query('COMMIT');
    res.json({ orderId, total: orderTotal });
  } catch (e) {
    await db.query('ROLLBACK');
    console.error(e);
    res.status(500).json({ error: 'order failed' });
  }
});

const port = process.env.PORT || 4000;
app.listen(port, async () => {
  console.log(`Server listening on ${port}`);
  if (!process.env.DATABASE_URL) {
    console.warn('Warning: DATABASE_URL is not set. Set it in server/.env or environment.');
  }

  try {
    await db.query('SELECT 1');
    console.log('Database connection OK');
    await runMigrations();
  } catch (e) {
    console.error('Database connection failed:', e.message);
  }
});
