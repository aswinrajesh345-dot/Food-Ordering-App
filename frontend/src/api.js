const API = import.meta.env.VITE_API_URL || 'http://localhost:4000'

// --- TOKEN MANAGEMENT ---
export function getToken() {
  return localStorage.getItem('qb_token')
}

export function setToken(token) {
  if (token) {
    localStorage.setItem('qb_token', token)
  } else {
    localStorage.removeItem('qb_token')
  }
}

export function clearToken() {
  localStorage.removeItem('qb_token')
}

function authHeaders() {
  const token = getToken()
  return token ? { 'Authorization': `Bearer ${token}` } : {}
}

// --- AUTH API ---
export async function login(email, password) {
  const r = await fetch(`${API}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  })
  const data = await r.json()
  if (!r.ok) throw new Error(data.error || 'Login failed')
  return data
}

export async function restaurantLogin(email, password) {
  const r = await fetch(`${API}/auth/restaurant/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  })
  const data = await r.json()
  if (!r.ok) throw new Error(data.error || 'Restaurant login failed')
  return data
}

export async function adminLogin(email, password) {
  const r = await fetch(`${API}/auth/admin/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  })
  const data = await r.json()
  if (!r.ok) throw new Error(data.error || 'Admin login failed')
  return data
}

export async function signup(name, email, password) {
  const r = await fetch(`${API}/auth/signup`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email, password }),
  })
  const data = await r.json()
  if (!r.ok) throw new Error(data.error || 'Signup failed')
  return data
}

export async function getMe() {
  const r = await fetch(`${API}/auth/me`, {
    headers: { ...authHeaders() },
  })
  if (!r.ok) throw new Error('Not authenticated')
  return r.json()
}

// --- RESTAURANT API (PUBLIC) ---
export async function getRestaurants() {
  const r = await fetch(`${API}/restaurants`)
  return r.json()
}

export async function getMenu(restaurantId) {
  const r = await fetch(`${API}/restaurants/${restaurantId}/menu`)
  return r.json()
}

export async function searchRestaurants(q, cuisine) {
  const url = new URL(`${API}/restaurants`);
  if (q) url.searchParams.set('q', q);
  if (cuisine) url.searchParams.set('cuisine', cuisine);
  const r = await fetch(url.toString());
  return r.json();
}

export async function getRestaurant(id) {
  const r = await fetch(`${API}/restaurants/${id}`);
  return r.json();
}

export async function postReview(restaurantId, review) {
  const r = await fetch(`${API}/restaurants/${restaurantId}/reviews`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(review),
  });
  return r.json();
}

// --- ORDER API (AUTHENTICATED) ---
export async function postOrder(order) {
  const r = await fetch(`${API}/orders`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...authHeaders() },
    body: JSON.stringify(order),
  })
  const data = await r.json()
  if (!r.ok) throw new Error(data.error || 'Failed to place order')
  return data
}

export async function getOrders() {
  const r = await fetch(`${API}/orders`, {
    headers: { ...authHeaders() },
  });
  const data = await r.json();
  if (!r.ok) throw new Error(data.error || 'Failed to load orders');
  return data;
}

export async function updateOrderStatus(orderId, status) {
  const r = await fetch(`${API}/orders/${orderId}/status`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json', ...authHeaders() },
    body: JSON.stringify({ status }),
  });
  const data = await r.json();
  if (!r.ok) throw new Error(data.error || 'Failed to update order status');
  return data;
}

// --- ADMIN API ---
export async function getAdminUsers() {
  const r = await fetch(`${API}/admin/users`, {
    headers: { ...authHeaders() },
  })
  const data = await r.json()
  if (!r.ok) throw new Error(data.error || 'Failed to load users')
  return data
}

export async function deleteAdminUser(userId) {
  const r = await fetch(`${API}/admin/users/${userId}`, {
    method: 'DELETE',
    headers: { ...authHeaders() },
  })
  const data = await r.json()
  if (!r.ok) throw new Error(data.error || 'Failed to delete user')
  return data
}

export async function getAdminRestaurants() {
  const r = await fetch(`${API}/admin/restaurants`, {
    headers: { ...authHeaders() },
  })
  const data = await r.json()
  if (!r.ok) throw new Error(data.error || 'Failed to load restaurants')
  return data
}

export async function updateAdminRestaurant(restaurantId, updates) {
  const r = await fetch(`${API}/admin/restaurants/${restaurantId}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json', ...authHeaders() },
    body: JSON.stringify(updates),
  })
  const data = await r.json()
  if (!r.ok) throw new Error(data.error || 'Failed to update restaurant')
  return data
}
