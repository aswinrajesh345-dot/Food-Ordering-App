import React, { useEffect, useState } from 'react'
import {
  searchRestaurants,
  getRestaurant,
  postOrder,
  postReview,
  getOrders,
  updateOrderStatus,
  login as apiLogin,
  restaurantLogin as apiRestaurantLogin,
  adminLogin as apiAdminLogin,
  signup as apiSignup,
  getAdminUsers,
  deleteAdminUser,
  getAdminRestaurants,
  updateAdminRestaurant,
  getMe,
  getToken,
  setToken,
  clearToken
} from './api'

// --- CUSTOM SVG ICONS ---
const ChefIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="brand-icon"><path d="M6 18V6a4 4 0 0 1 8 0v12"></path><path d="M18 18V9a4 4 0 0 0-8 0v9"></path><path d="M3 18h18a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1v-2a1 1 0 0 1 1-1z"></path></svg>
)

const SearchIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
)

const StarIcon = ({ filled }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill={filled ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: filled ? "var(--warning)" : "var(--border)", fill: filled ? "var(--warning)" : "none" }}><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
)

const CartIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg>
)

const ClockIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
)

const CloseIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
)

const SunIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>
)

const MoonIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>
)

const BikeIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="3" width="15" height="13" rx="2" ry="2"></rect><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon><circle cx="5.5" cy="18.5" r="2.5"></circle><circle cx="18.5" cy="18.5" r="2.5"></circle></svg>
)

const MapPinIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
)

const ReceiptIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 2v20l2-1 2 1 2-1 2 1 2-1 2 1 2-1 2 1V2l-2 1-2-1-2 1-2-1-2 1-2-1-2 1-2-1z"></path><path d="M6 8h12"></path><path d="M6 12h12"></path></svg>
)

const TrashIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
)

const PlusIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
)

const MinusIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line></svg>
)

const CheckIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
)

const CreditCardIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect><line x1="1" y1="10" x2="23" y2="10"></line></svg>
)

const CashIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23"></line><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>
)

const UserIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
)

const EyeIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
)

const EyeOffIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>
)

const LogOutIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
)

const MailIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
)

const LockIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
)

// --- AUTH PAGE COMPONENTS ---
const AUTH_BG_EMOJIS = ['🍕', '🍔', '🍣', '🌮', '🍰', '🍜', '🥗', '🍩']

function LoginPage({ onLogin, onSwitchToSignup, onSwitchToRestaurant, onSwitchToAdmin, theme, setTheme }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    if (!email.trim() || !password) {
      setError('Please fill in all fields')
      return
    }
    setLoading(true)
    try {
      const data = await apiLogin(email.trim(), password)
      setToken(data.token)
      onLogin(data.user)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-bg-elements">
        {AUTH_BG_EMOJIS.map((emoji, i) => (
          <span key={i} className="auth-bg-emoji">{emoji}</span>
        ))}
      </div>

      <div className="auth-theme-toggle">
        <button
          className="icon-btn"
          onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
          title="Toggle theme"
          style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.15)', color: '#fff' }}
        >
          {theme === 'light' ? <MoonIcon /> : <SunIcon />}
        </button>
      </div>

      <div className="auth-card">
        <div className="auth-logo">
          <ChefIcon />
          <h1>QuickBite</h1>
        </div>

        <h2>Welcome Back</h2>
        <p className="auth-subtitle">Sign in to continue ordering delicious food</p>

        {error && <div className="auth-error">{error}</div>}

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email Address</label>
            <div className="auth-input-wrapper">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                autoComplete="email"
              />
            </div>
          </div>

          <div className="form-group">
            <label>Password</label>
            <div className="auth-input-wrapper">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                autoComplete="current-password"
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
                tabIndex={-1}
              >
                {showPassword ? <EyeOffIcon /> : <EyeIcon />}
              </button>
            </div>
          </div>

          <button type="submit" className="auth-submit-btn" disabled={loading}>
            {loading && <span className="auth-spinner"></span>}
            {loading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>

        <div className="auth-switch">
          Don't have an account?{' '}
          <button onClick={onSwitchToSignup}>Create one</button>
        </div>

        <div className="auth-switch auth-switch-secondary">
          Restaurant partner?{' '}
          <button onClick={onSwitchToRestaurant}>Restaurant login</button>
        </div>

        <div className="auth-switch auth-switch-secondary">
          Admin team?{' '}
          <button onClick={onSwitchToAdmin}>Admin login</button>
        </div>
      </div>
    </div>
  )
}

function SignupPage({ onSignup, onSwitchToLogin, theme, setTheme }) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    if (!name.trim() || !email.trim() || !password) {
      setError('Please fill in all fields')
      return
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters')
      return
    }
    setLoading(true)
    try {
      const data = await apiSignup(name.trim(), email.trim(), password)
      setToken(data.token)
      onSignup(data.user)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-bg-elements">
        {AUTH_BG_EMOJIS.map((emoji, i) => (
          <span key={i} className="auth-bg-emoji">{emoji}</span>
        ))}
      </div>

      <div className="auth-theme-toggle">
        <button
          className="icon-btn"
          onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
          title="Toggle theme"
          style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.15)', color: '#fff' }}
        >
          {theme === 'light' ? <MoonIcon /> : <SunIcon />}
        </button>
      </div>

      <div className="auth-card">
        <div className="auth-logo">
          <ChefIcon />
          <h1>QuickBite</h1>
        </div>

        <h2>Create Account</h2>
        <p className="auth-subtitle">Join QuickBite and start ordering today</p>

        {error && <div className="auth-error">{error}</div>}

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Full Name</label>
            <div className="auth-input-wrapper">
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Tony Stark"
                autoComplete="name"
              />
            </div>
          </div>

          <div className="form-group">
            <label>Email Address</label>
            <div className="auth-input-wrapper">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                autoComplete="email"
              />
            </div>
          </div>

          <div className="form-group">
            <label>Password</label>
            <div className="auth-input-wrapper">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Min. 6 characters"
                autoComplete="new-password"
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
                tabIndex={-1}
              >
                {showPassword ? <EyeOffIcon /> : <EyeIcon />}
              </button>
            </div>
          </div>

          <button type="submit" className="auth-submit-btn" disabled={loading}>
            {loading && <span className="auth-spinner"></span>}
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>

        <div className="auth-switch">
          Already have an account?{' '}
          <button onClick={onSwitchToLogin}>Sign in</button>
        </div>
      </div>
    </div>
  )
}

function RestaurantLoginPage({ onLogin, onSwitchToCustomer, theme, setTheme }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    if (!email.trim() || !password) {
      setError('Please fill in all fields')
      return
    }
    setLoading(true)
    try {
      const data = await apiRestaurantLogin(email.trim(), password)
      setToken(data.token)
      onLogin(data.user)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-bg-elements">
        {AUTH_BG_EMOJIS.map((emoji, i) => (
          <span key={i} className="auth-bg-emoji">{emoji}</span>
        ))}
      </div>

      <div className="auth-theme-toggle">
        <button
          className="icon-btn"
          onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
          title="Toggle theme"
          style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.15)', color: '#fff' }}
        >
          {theme === 'light' ? <MoonIcon /> : <SunIcon />}
        </button>
      </div>

      <div className="auth-card">
        <div className="auth-logo">
          <ChefIcon />
          <h1>QuickBite</h1>
        </div>

        <h2>Restaurant Portal</h2>
        <p className="auth-subtitle">Sign in to manage incoming customer orders</p>

        {error && <div className="auth-error">{error}</div>}

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Restaurant Email</label>
            <div className="auth-input-wrapper">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="pastapalace@gmail.com"
                autoComplete="email"
              />
            </div>
          </div>

          <div className="form-group">
            <label>Password</label>
            <div className="auth-input-wrapper">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter restaurant password"
                autoComplete="current-password"
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
                tabIndex={-1}
              >
                {showPassword ? <EyeOffIcon /> : <EyeIcon />}
              </button>
            </div>
          </div>

          <button type="submit" className="auth-submit-btn" disabled={loading}>
            {loading && <span className="auth-spinner"></span>}
            {loading ? 'Opening Dashboard...' : 'Open Dashboard'}
          </button>
        </form>

        <div className="auth-switch">
          Ordering food?{' '}
          <button onClick={onSwitchToCustomer}>Customer login</button>
        </div>
      </div>
    </div>
  )
}

function AdminLoginPage({ onLogin, onSwitchToCustomer, theme, setTheme }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    if (!email.trim() || !password) {
      setError('Please fill in all fields')
      return
    }
    setLoading(true)
    try {
      const data = await apiAdminLogin(email.trim(), password)
      setToken(data.token)
      onLogin(data.user)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-bg-elements">
        {AUTH_BG_EMOJIS.map((emoji, i) => (
          <span key={i} className="auth-bg-emoji">{emoji}</span>
        ))}
      </div>

      <div className="auth-theme-toggle">
        <button
          className="icon-btn"
          onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
          title="Toggle theme"
          style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.15)', color: '#fff' }}
        >
          {theme === 'light' ? <MoonIcon /> : <SunIcon />}
        </button>
      </div>

      <div className="auth-card">
        <div className="auth-logo">
          <ChefIcon />
          <h1>QuickBite</h1>
        </div>

        <h2>Admin Portal</h2>
        <p className="auth-subtitle">Sign in to manage users and restaurants</p>

        {error && <div className="auth-error">{error}</div>}

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Admin Email</label>
            <div className="auth-input-wrapper">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@gmail.com"
                autoComplete="email"
              />
            </div>
          </div>

          <div className="form-group">
            <label>Password</label>
            <div className="auth-input-wrapper">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter admin password"
                autoComplete="current-password"
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
                tabIndex={-1}
              >
                {showPassword ? <EyeOffIcon /> : <EyeIcon />}
              </button>
            </div>
          </div>

          <button type="submit" className="auth-submit-btn" disabled={loading}>
            {loading && <span className="auth-spinner"></span>}
            {loading ? 'Opening Admin...' : 'Open Admin Dashboard'}
          </button>
        </form>

        <div className="auth-switch">
          Back to QuickBite?{' '}
          <button onClick={onSwitchToCustomer}>Customer login</button>
        </div>
      </div>
    </div>
  )
}

// --- RATING COMPONENT ---
function Stars({ n }) {
  const value = Math.round(Number(n) || 0)
  return (
    <span className="stars" style={{ display: 'inline-flex', gap: '2px' }}>
      {Array.from({ length: 5 }).map((_, i) => (
        <StarIcon key={i} filled={i < value} />
      ))}
    </span>
  )
}

// --- CUISINE CONSTANTS ---
const CUISINES = [
  { name: 'All', emoji: '🍽️' },
  { name: 'Italian', emoji: '🍝' },
  { name: 'Japanese', emoji: '🍣' },
  { name: 'Burgers', emoji: '🍔' },
  { name: 'Mexican', emoji: '🌮' },
  { name: 'Desserts', emoji: '🍰' }
]

const ORDER_STATUSES = [
  { value: 'pending', label: 'Pending' },
  { value: 'preparing', label: 'Preparing' },
  { value: 'out_for_delivery', label: 'Out for delivery' },
  { value: 'delivered', label: 'Delivered' }
]

function formatStatus(status) {
  return ORDER_STATUSES.find(item => item.value === status)?.label || status.replace(/_/g, ' ')
}

function formatMoney(value) {
  return `₹${Number(value || 0).toFixed(2)}`
}

function RestaurantDashboard({ user, orders, ordersLoading, updatingOrderId, onRefresh, onStatusChange, onLogout, theme, setTheme }) {
  const [statusFilter, setStatusFilter] = useState('active')

  const activeOrders = orders.filter(order => order.status !== 'delivered')
  const pendingOrders = orders.filter(order => order.status === 'pending')
  const completedOrders = orders.filter(order => order.status === 'delivered')
  const totalRevenue = orders.reduce((sum, order) => sum + Number(order.total || 0), 0)

  const visibleOrders = orders.filter(order => {
    if (statusFilter === 'all') return true
    if (statusFilter === 'active') return order.status !== 'delivered'
    return order.status === statusFilter
  })

  return (
    <div className="app restaurant-admin">
      <div className="theme-switch-wrapper">
        <button
          className="icon-btn"
          onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
          title="Toggle light/dark mode"
        >
          {theme === 'light' ? <MoonIcon /> : <SunIcon />}
        </button>
      </div>

      <header className="topbar restaurant-topbar">
        <div className="brand">
          <ChefIcon />
          <h1>QuickBite</h1>
        </div>

        <div className="restaurant-nav-title">
          <span>{user.cuisine || 'Restaurant'}</span>
          <strong>{user.name}</strong>
        </div>

        <div className="nav-actions">
          <button className="refresh-btn" onClick={onRefresh} disabled={ordersLoading}>
            <ReceiptIcon /> {ordersLoading ? 'Refreshing...' : 'Refresh'}
          </button>

          <div className="user-menu" style={{ marginLeft: '8px' }}>
            <div className="user-avatar" title={user.email}>
              {user.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() || 'R'}
            </div>
            <span className="user-name">{user.name}</span>
            <button className="logout-btn" onClick={onLogout}>
              <LogOutIcon /> Logout
            </button>
          </div>
        </div>
      </header>

      <section className="restaurant-admin-hero">
        <div>
          <span className="cuisine-tag">{user.email}</span>
          <h2>Order Management</h2>
          <p>{activeOrders.length} active orders need attention right now.</p>
        </div>

        <div className="restaurant-stat-grid">
          <div className="restaurant-stat-card">
            <span>Active</span>
            <strong>{activeOrders.length}</strong>
          </div>
          <div className="restaurant-stat-card">
            <span>Pending</span>
            <strong>{pendingOrders.length}</strong>
          </div>
          <div className="restaurant-stat-card">
            <span>Completed</span>
            <strong>{completedOrders.length}</strong>
          </div>
          <div className="restaurant-stat-card">
            <span>Revenue</span>
            <strong>{formatMoney(totalRevenue)}</strong>
          </div>
        </div>
      </section>

      <nav className="restaurant-status-tabs">
        <button className={statusFilter === 'active' ? 'active' : ''} onClick={() => setStatusFilter('active')}>
          Active
        </button>
        <button className={statusFilter === 'all' ? 'active' : ''} onClick={() => setStatusFilter('all')}>
          All
        </button>
        {ORDER_STATUSES.map(status => (
          <button
            key={status.value}
            className={statusFilter === status.value ? 'active' : ''}
            onClick={() => setStatusFilter(status.value)}
          >
            {status.label}
          </button>
        ))}
      </nav>

      {ordersLoading && orders.length === 0 ? (
        <div className="panel empty-panel">
          <div className="auth-spinner" style={{ width: '36px', height: '36px', border: '3px solid var(--border)', borderTopColor: 'var(--accent)' }}></div>
          <h2>Loading Orders</h2>
        </div>
      ) : visibleOrders.length === 0 ? (
        <div className="panel empty-panel">
          <ReceiptIcon />
          <h2>No Orders Here</h2>
          <p>Orders matching this status will appear here.</p>
        </div>
      ) : (
        <section className="restaurant-orders-list">
          {visibleOrders.map(order => (
            <article key={order.id} className="restaurant-order-card">
              <div className="restaurant-order-head">
                <div>
                  <h3>Order #{order.id}</h3>
                  <span>{new Date(order.created_at).toLocaleString()}</span>
                </div>
                <span className={`order-badge ${order.status}`}>{formatStatus(order.status)}</span>
              </div>

              <div className="restaurant-order-meta">
                <div>
                  <span>Customer</span>
                  <strong>{order.customer_name || 'Guest'}</strong>
                </div>
                <div>
                  <span>Contact</span>
                  <strong>{order.customer_email || 'Not available'}</strong>
                </div>
                <div>
                  <span>Total</span>
                  <strong>{formatMoney(order.total)}</strong>
                </div>
              </div>

              <div className="restaurant-address">
                <MapPinIcon />
                <span>{order.address || 'No address provided'}</span>
              </div>

              <div className="restaurant-order-items">
                {order.items.map(item => (
                  <div key={item.id}>
                    <span>{item.quantity}x {item.menu_item_name}</span>
                    <strong>{formatMoney(Number(item.price) * Number(item.quantity))}</strong>
                  </div>
                ))}
              </div>

              <div className="restaurant-status-controls">
                {ORDER_STATUSES.map(status => (
                  <button
                    key={status.value}
                    className={`status-step-btn ${order.status === status.value ? 'active' : ''}`}
                    onClick={() => onStatusChange(order.id, status.value)}
                    disabled={order.status === status.value || updatingOrderId === order.id}
                  >
                    {status.label}
                  </button>
                ))}
              </div>
            </article>
          ))}
        </section>
      )}
    </div>
  )
}

function AdminDashboard({ user, onLogout, theme, setTheme }) {
  const [activeTab, setActiveTab] = useState('users')
  const [users, setUsers] = useState([])
  const [restaurants, setRestaurants] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [editingRestaurantId, setEditingRestaurantId] = useState(null)
  const [restaurantDraft, setRestaurantDraft] = useState({})
  const [savingRestaurant, setSavingRestaurant] = useState(false)
  const [deletingUserId, setDeletingUserId] = useState(null)

  useEffect(() => {
    loadAdminData()
  }, [])

  async function loadAdminData() {
    setLoading(true)
    setError('')
    try {
      const [loadedUsers, loadedRestaurants] = await Promise.all([
        getAdminUsers(),
        getAdminRestaurants()
      ])
      setUsers(loadedUsers)
      setRestaurants(loadedRestaurants)
    } catch (err) {
      setError(err.message || 'Unable to load admin data')
    } finally {
      setLoading(false)
    }
  }

  async function handleDeleteUser(targetUser) {
    const ok = window.confirm(`Delete user ${targetUser.name}? Their old orders will stay in reports without an owner.`)
    if (!ok) return
    setDeletingUserId(targetUser.id)
    setError('')
    try {
      await deleteAdminUser(targetUser.id)
      setUsers(current => current.filter(item => item.id !== targetUser.id))
    } catch (err) {
      setError(err.message || 'Failed to delete user')
    } finally {
      setDeletingUserId(null)
    }
  }

  function startRestaurantEdit(restaurant) {
    setEditingRestaurantId(restaurant.id)
    setRestaurantDraft({
      name: restaurant.name || '',
      cuisine: restaurant.cuisine || '',
      email: restaurant.email || '',
      delivery_time: restaurant.delivery_time || '',
      delivery_fee: restaurant.delivery_fee || 0,
      image_url: restaurant.image_url || '',
      description: restaurant.description || '',
      password: ''
    })
  }

  async function saveRestaurant(e) {
    e.preventDefault()
    if (!editingRestaurantId) return
    setSavingRestaurant(true)
    setError('')
    try {
      const payload = { ...restaurantDraft }
      if (!payload.password) {
        delete payload.password
      }
      const updated = await updateAdminRestaurant(editingRestaurantId, payload)
      setRestaurants(current => current.map(item => (
        item.id === updated.id ? { ...item, ...updated } : item
      )))
      setEditingRestaurantId(null)
      setRestaurantDraft({})
    } catch (err) {
      setError(err.message || 'Failed to update restaurant')
    } finally {
      setSavingRestaurant(false)
    }
  }

  const totalOrders = restaurants.reduce((sum, restaurant) => sum + Number(restaurant.order_count || 0), 0)

  return (
    <div className="app admin-dashboard">
      <div className="theme-switch-wrapper">
        <button
          className="icon-btn"
          onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
          title="Toggle light/dark mode"
        >
          {theme === 'light' ? <MoonIcon /> : <SunIcon />}
        </button>
      </div>

      <header className="topbar restaurant-topbar admin-topbar">
        <div className="brand">
          <ChefIcon />
          <h1>QuickBite</h1>
        </div>

        <div className="restaurant-nav-title">
          <span>Admin</span>
          <strong>{user.name}</strong>
        </div>

        <div className="nav-actions">
          <button className="refresh-btn" onClick={loadAdminData} disabled={loading}>
            <ReceiptIcon /> {loading ? 'Refreshing...' : 'Refresh'}
          </button>

          <div className="user-menu" style={{ marginLeft: '8px' }}>
            <div className="user-avatar" title={user.email}>
              {user.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() || 'A'}
            </div>
            <span className="user-name">{user.name}</span>
            <button className="logout-btn" onClick={onLogout}>
              <LogOutIcon /> Logout
            </button>
          </div>
        </div>
      </header>

      <section className="restaurant-admin-hero admin-hero">
        <div>
          <span className="cuisine-tag">{user.email}</span>
          <h2>Admin Management</h2>
          <p>Manage customer accounts and restaurant profiles from one workspace.</p>
        </div>

        <div className="restaurant-stat-grid">
          <div className="restaurant-stat-card">
            <span>Users</span>
            <strong>{users.length}</strong>
          </div>
          <div className="restaurant-stat-card">
            <span>Restaurants</span>
            <strong>{restaurants.length}</strong>
          </div>
          <div className="restaurant-stat-card">
            <span>Orders</span>
            <strong>{totalOrders}</strong>
          </div>
          <div className="restaurant-stat-card">
            <span>Mode</span>
            <strong>Admin</strong>
          </div>
        </div>
      </section>

      <nav className="restaurant-status-tabs admin-tabs">
        <button className={activeTab === 'users' ? 'active' : ''} onClick={() => setActiveTab('users')}>
          Users
        </button>
        <button className={activeTab === 'restaurants' ? 'active' : ''} onClick={() => setActiveTab('restaurants')}>
          Restaurants
        </button>
      </nav>

      {error && <div className="alert">{error}</div>}

      {loading ? (
        <div className="panel empty-panel">
          <div className="auth-spinner" style={{ width: '36px', height: '36px', border: '3px solid var(--border)', borderTopColor: 'var(--accent)' }}></div>
          <h2>Loading Admin Data</h2>
        </div>
      ) : activeTab === 'users' ? (
        <section className="admin-card-list">
          {users.length === 0 ? (
            <div className="panel empty-panel">
              <UserIcon />
              <h2>No Users</h2>
              <p>Customer accounts will appear here after signup.</p>
            </div>
          ) : users.map(customer => (
            <article key={customer.id} className="admin-row-card">
              <div className="admin-row-main">
                <div className="user-avatar">{customer.name.slice(0, 2).toUpperCase()}</div>
                <div>
                  <h3>{customer.name}</h3>
                  <span>{customer.email}</span>
                </div>
              </div>
              <div className="admin-row-meta">
                <span>{customer.order_count} orders</span>
                <span>{new Date(customer.created_at).toLocaleDateString()}</span>
              </div>
              <button
                className="danger-btn"
                onClick={() => handleDeleteUser(customer)}
                disabled={deletingUserId === customer.id}
              >
                {deletingUserId === customer.id ? 'Deleting...' : 'Delete'}
              </button>
            </article>
          ))}
        </section>
      ) : (
        <div className="admin-restaurant-grid">
          <section className="admin-card-list">
            {restaurants.map(restaurant => (
              <article key={restaurant.id} className={`admin-row-card restaurant-admin-card ${editingRestaurantId === restaurant.id ? 'selected' : ''}`}>
                <div className="admin-row-main">
                  <img src={restaurant.image_url} alt={restaurant.name} />
                  <div>
                    <h3>{restaurant.name}</h3>
                    <span>{restaurant.cuisine || 'Cuisine not set'} • {restaurant.email || 'No login email'}</span>
                  </div>
                </div>
                <div className="admin-row-meta">
                  <span>{restaurant.menu_count} menu items</span>
                  <span>{restaurant.order_count} orders</span>
                </div>
                <button className="track-btn" onClick={() => startRestaurantEdit(restaurant)}>
                  Edit
                </button>
              </article>
            ))}
          </section>

          <section className="admin-edit-panel">
            {editingRestaurantId ? (
              <form onSubmit={saveRestaurant}>
                <div className="panel-header">
                  <h2>Edit Restaurant</h2>
                  <button type="button" className="track-btn" onClick={() => setEditingRestaurantId(null)}>
                    Cancel
                  </button>
                </div>

                <div className="form-group">
                  <label>Name</label>
                  <input value={restaurantDraft.name} onChange={(e) => setRestaurantDraft(prev => ({ ...prev, name: e.target.value }))} required />
                </div>
                <div className="form-group">
                  <label>Cuisine</label>
                  <input value={restaurantDraft.cuisine} onChange={(e) => setRestaurantDraft(prev => ({ ...prev, cuisine: e.target.value }))} />
                </div>
                <div className="form-group">
                  <label>Restaurant Login Email</label>
                  <input type="email" value={restaurantDraft.email} onChange={(e) => setRestaurantDraft(prev => ({ ...prev, email: e.target.value }))} />
                </div>
                <div className="form-group">
                  <label>New Password</label>
                  <input type="password" value={restaurantDraft.password} onChange={(e) => setRestaurantDraft(prev => ({ ...prev, password: e.target.value }))} placeholder="Leave blank to keep current password" />
                </div>
                <div className="admin-form-grid">
                  <div className="form-group">
                    <label>Delivery Time</label>
                    <input value={restaurantDraft.delivery_time} onChange={(e) => setRestaurantDraft(prev => ({ ...prev, delivery_time: e.target.value }))} />
                  </div>
                  <div className="form-group">
                    <label>Delivery Fee</label>
                    <input type="number" min="0" step="0.01" value={restaurantDraft.delivery_fee} onChange={(e) => setRestaurantDraft(prev => ({ ...prev, delivery_fee: e.target.value }))} />
                  </div>
                </div>
                <div className="form-group">
                  <label>Image URL</label>
                  <input value={restaurantDraft.image_url} onChange={(e) => setRestaurantDraft(prev => ({ ...prev, image_url: e.target.value }))} />
                </div>
                <div className="form-group">
                  <label>Description</label>
                  <textarea value={restaurantDraft.description} onChange={(e) => setRestaurantDraft(prev => ({ ...prev, description: e.target.value }))} />
                </div>

                <button type="submit" className="checkout-btn" disabled={savingRestaurant}>
                  {savingRestaurant ? 'Saving...' : 'Save Restaurant'}
                </button>
              </form>
            ) : (
              <div className="empty-panel">
                <ChefIcon />
                <h2>Select a Restaurant</h2>
                <p>Choose a restaurant from the list to update profile and login details.</p>
              </div>
            )}
          </section>
        </div>
      )}
    </div>
  )
}

export default function App() {
  // Theme state
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light')

  // Auth state
  const [user, setUser] = useState(null)
  const [authScreen, setAuthScreen] = useState('login') // 'login' | 'signup' | 'restaurant-login' | 'admin-login'
  const [authLoading, setAuthLoading] = useState(true)

  // Search & Filter state
  const [q, setQ] = useState('')
  const [selectedCuisine, setSelectedCuisine] = useState('All')

  // Data states
  const [restaurants, setRestaurants] = useState([])
  const [details, setDetails] = useState(null)
  const [orders, setOrders] = useState([])
  const [cart, setCart] = useState({})
  const [ordersLoading, setOrdersLoading] = useState(false)
  const [updatingOrderId, setUpdatingOrderId] = useState(null)

  // Interactive panels
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [isOrdersOpen, setIsOrdersOpen] = useState(false)
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false)
  const [activeTrackingOrder, setActiveTrackingOrder] = useState(null)

  // Review states
  const [reviewerName, setReviewerName] = useState('')
  const [reviewText, setReviewText] = useState('')
  const [reviewRating, setReviewRating] = useState(5)
  const [hoverRating, setHoverRating] = useState(0)

  // Checkout Form states
  const [custName, setCustName] = useState('')
  const [address, setAddress] = useState('')
  const [paymentMethod, setPaymentMethod] = useState('card')
  const [orderPlacedSuccess, setOrderPlacedSuccess] = useState(false)
  const [lastPlacedOrder, setLastPlacedOrder] = useState(null)

  // Global UX states
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // Sync theme to root HTML element
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    localStorage.setItem('theme', theme)
  }, [theme])

  // Verify auth on mount and load restaurants
  useEffect(() => {
    async function checkAuth() {
      const token = getToken()
      if (token) {
        try {
          const userData = await getMe()
          setUser(userData)
          if (userData.role === 'customer' || !userData.role) {
            setCustName(userData.name)
          }
        } catch (err) {
          console.error('Auth verification failed:', err)
          clearToken()
          setUser(null)
        }
      }
      setAuthLoading(false)
    }
    checkAuth()
    loadRestaurants()
  }, [])

  // Load orders when user logs in
  useEffect(() => {
    if (user && user.role !== 'admin') {
      loadOrders()
    } else {
      setOrders([])
    }
  }, [user])

  // Load restaurants when cuisine filter changes
  useEffect(() => {
    loadRestaurants(q, selectedCuisine)
  }, [selectedCuisine])

  async function loadRestaurants(query = '', cuisine = 'All') {
    setLoading(true)
    setError('')
    try {
      const result = await searchRestaurants(query, cuisine === 'All' ? '' : cuisine)
      setRestaurants(result)
      if (result.length > 0) {
        // Default to select first restaurant, unless already selected one is in the results
        const isAlreadySelectedInResult = result.some(r => r.id === details?.restaurant?.id)
        if (!isAlreadySelectedInResult) {
          openRestaurant(result[0].id)
        }
      } else {
        setDetails(null)
      }
    } catch (err) {
      setError('Unable to load restaurants. Please try again.')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  async function loadOrders() {
    setOrdersLoading(true)
    try {
      const ords = await getOrders()
      setOrders(ords)
      // If we are currently tracking an order, keep its details updated
      if (activeTrackingOrder) {
        const updated = ords.find(o => o.id === activeTrackingOrder.id)
        if (updated) {
          setActiveTrackingOrder(updated)
        }
      }
    } catch (err) {
      console.error('Error fetching orders:', err)
    } finally {
      setOrdersLoading(false)
    }
  }

  function handleLogout() {
    clearToken()
    setUser(null)
    setOrders([])
    setCart({})
    setIsCartOpen(false)
    setIsOrdersOpen(false)
    setIsCheckoutOpen(false)
    setActiveTrackingOrder(null)
    setAuthScreen('login')
  }

  function doSearch(e) {
    e?.preventDefault()
    loadRestaurants(q, selectedCuisine)
  }

  async function openRestaurant(id) {
    setError('')
    try {
      const d = await getRestaurant(id)
      setDetails(d)
    } catch (err) {
      setError('Unable to load restaurant details.')
      console.error(err)
    }
  }

  // --- CART OPERATIONS ---
  const cartItemsArray = Object.values(cart)
  const cartSubtotal = cartItemsArray.reduce((sum, item) => sum + (item.price * item.quantity), 0)
  const cartDeliveryFee = details?.restaurant?.delivery_fee ? Number(details.restaurant.delivery_fee) : 0
  const cartTax = Number((cartSubtotal * 0.08).toFixed(2))
  const cartTotal = Number((cartSubtotal + cartDeliveryFee + cartTax).toFixed(2))
  const cartItemCount = cartItemsArray.reduce((count, item) => count + item.quantity, 0)

  function addToCart(item) {
    setCart((current) => {
      const existing = current[item.id]
      const quantity = (existing?.quantity || 0) + 1
      return { ...current, [item.id]: { ...item, quantity } }
    })
  }

  function removeFromCart(itemId) {
    setCart((current) => {
      const copy = { ...current }
      delete copy[itemId]
      return copy
    })
  }

  function updateQuantity(itemId, amount) {
    setCart((current) => {
      const existing = current[itemId]
      if (!existing) return current
      const newQty = existing.quantity + amount
      if (newQty <= 0) {
        const copy = { ...current }
        delete copy[itemId]
        return copy
      }
      return { ...current, [itemId]: { ...existing, quantity: newQty } }
    })
  }

  // --- CHECKOUT AND ORDER PLACEMENT ---
  function handleOpenCheckout() {
    if (cartItemsArray.length === 0) return
    setOrderPlacedSuccess(false)
    setLastPlacedOrder(null)
    setIsCheckoutOpen(true)
  }

  async function submitCheckout(e) {
    e.preventDefault()
    if (!custName.trim() || !address.trim()) {
      return alert('Please fill in all details.')
    }

    const items = cartItemsArray.map(item => ({
      menu_item_id: item.id,
      quantity: item.quantity
    }))

    try {
      const response = await postOrder({
        restaurant_id: details.restaurant.id,
        items,
        customer_name: custName,
        address
      })

      // Success
      setLastPlacedOrder({
        id: response.orderId,
        total: response.total,
        restaurant_name: details.restaurant.name
      })
      setOrderPlacedSuccess(true)
      setCart({})
      loadOrders()
    } catch (err) {
      console.error(err)
      alert('Failed to place order. Please try again.')
    }
  }

  function handleTrackOrder(order) {
    setActiveTrackingOrder(order)
    setIsCheckoutOpen(false)
    setIsOrdersOpen(false)
  }

  // --- REVIEW SYSTEM ---
  async function submitReview(e) {
    e.preventDefault()
    if (!details) return
    if (!reviewText.trim()) return alert('Please enter a review.')

    try {
      await postReview(details.restaurant.id, {
        reviewer_name: reviewerName.trim() || 'Anonymous',
        rating: reviewRating,
        comment: reviewText
      })
      const refreshed = await getRestaurant(details.restaurant.id)
      setDetails(refreshed)
      setReviewText('')
      setReviewerName('')
      setReviewRating(5)
      // Reload restaurants list to update average ratings in the sidebar
      const updatedList = await searchRestaurants(q, selectedCuisine === 'All' ? '' : selectedCuisine)
      setRestaurants(updatedList)
    } catch (err) {
      console.error(err)
      alert('Failed to submit review.')
    }
  }

  async function handleUpdateOrderStatus(orderId, nextStatus) {
    setUpdatingOrderId(orderId)
    try {
      const updated = await updateOrderStatus(orderId, nextStatus)
      setOrders(prev => prev.map(order => (
        order.id === orderId ? { ...order, status: updated.status } : order
      )))
      if (activeTrackingOrder && activeTrackingOrder.id === orderId) {
        setActiveTrackingOrder(prev => ({ ...prev, status: updated.status }))
      }
      loadOrders()
    } catch (err) {
      console.error(err)
      alert('Failed to update status.')
    } finally {
      setUpdatingOrderId(null)
    }
  }

  // Helper for tracking steps UI
  function getProgressPercentage(status) {
    switch (status) {
      case 'pending': return 10;
      case 'preparing': return 45;
      case 'out_for_delivery': return 80;
      case 'delivered': return 100;
      default: return 0;
    }
  }

  if (authLoading) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', background: 'var(--bg)', color: 'var(--text)' }}>
        <div className="auth-spinner" style={{ width: '40px', height: '40px', border: '3.5px solid var(--border)', borderTopColor: 'var(--accent)' }}></div>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 600 }}>Loading QuickBite...</h2>
      </div>
    )
  }

  if (!user) {
    if (authScreen === 'signup') {
      return (
        <SignupPage
          onSignup={(u) => {
            setUser(u)
            setCustName(u.name)
          }}
          onSwitchToLogin={() => setAuthScreen('login')}
          theme={theme}
          setTheme={setTheme}
        />
      )
    }

    if (authScreen === 'restaurant-login') {
      return (
        <RestaurantLoginPage
          onLogin={(u) => {
            setUser(u)
            setOrders([])
            setCart({})
          }}
          onSwitchToCustomer={() => setAuthScreen('login')}
          theme={theme}
          setTheme={setTheme}
        />
      )
    }

    if (authScreen === 'admin-login') {
      return (
        <AdminLoginPage
          onLogin={(u) => {
            setUser(u)
            setOrders([])
            setCart({})
          }}
          onSwitchToCustomer={() => setAuthScreen('login')}
          theme={theme}
          setTheme={setTheme}
        />
      )
    }

    return (
      <LoginPage
        onLogin={(u) => {
          setUser(u)
          setCustName(u.name)
        }}
        onSwitchToSignup={() => setAuthScreen('signup')}
        onSwitchToRestaurant={() => setAuthScreen('restaurant-login')}
        onSwitchToAdmin={() => setAuthScreen('admin-login')}
        theme={theme}
        setTheme={setTheme}
      />
    )
  }

  if (user.role === 'admin') {
    return (
      <AdminDashboard
        user={user}
        onLogout={handleLogout}
        theme={theme}
        setTheme={setTheme}
      />
    )
  }

  if (user.role === 'restaurant') {
    return (
      <RestaurantDashboard
        user={user}
        orders={orders}
        ordersLoading={ordersLoading}
        updatingOrderId={updatingOrderId}
        onRefresh={loadOrders}
        onStatusChange={handleUpdateOrderStatus}
        onLogout={handleLogout}
        theme={theme}
        setTheme={setTheme}
      />
    )
  }

  return (
    <div className="app">
      {/* Floating Theme Button */}
      <div className="theme-switch-wrapper">
        <button
          className="icon-btn"
          onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
          title="Toggle light/dark mode"
        >
          {theme === 'light' ? <MoonIcon /> : <SunIcon />}
        </button>
      </div>

      {/* Floating Cart Button (Mobile Friendly) */}
      {cartItemCount > 0 && (
        <button
          className="floating-cart"
          onClick={() => setIsCartOpen(true)}
          title="Open Cart"
        >
          <CartIcon />
          <span className="badge">{cartItemCount}</span>
        </button>
      )}

      {/* TOPBAR NAVIGATION */}
      <header className="topbar">
        <div className="brand" onClick={() => { setSelectedCuisine('All'); setQ(''); loadRestaurants('', 'All'); }}>
          <ChefIcon />
          <h1>QuickBite</h1>
        </div>

        <form className="search-bar" onSubmit={doSearch}>
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search restaurants, cuisines, dishes..."
          />
          <button type="submit">
            <SearchIcon /> Search
          </button>
        </form>

        <div className="nav-actions">
          <button className="icon-btn" onClick={() => setIsOrdersOpen(true)} title="My Orders">
            <ReceiptIcon />
            {orders.length > 0 && <span className="badge">{orders.filter(o => o.status !== 'delivered').length}</span>}
          </button>
          <button className="icon-btn" onClick={() => setIsCartOpen(true)} title="Cart">
            <CartIcon />
            {cartItemCount > 0 && <span className="badge">{cartItemCount}</span>}
          </button>

          <div className="user-menu" style={{ marginLeft: '8px' }}>
            <div className="user-avatar" title={user.email}>
              {user.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() || 'U'}
            </div>
            <span className="user-name">{user.name}</span>
            <button 
              className="logout-btn" 
              onClick={handleLogout}
            >
              <LogOutIcon /> Logout
            </button>
          </div>
        </div>
      </header>

      {/* CUISINE FILTER PILLS */}
      <nav className="cuisine-filters">
        {CUISINES.map((c) => (
          <button
            key={c.name}
            className={`filter-pill ${selectedCuisine === c.name ? 'active' : ''}`}
            onClick={() => setSelectedCuisine(c.name)}
          >
            <span>{c.emoji}</span> {c.name}
          </button>
        ))}
      </nav>

      {error && <div className="alert">{error}</div>}

      {/* MAIN LAYOUT COLUMNS */}
      <div className="columns">
        {/* SIDEBAR: RESTAURANT LIST */}
        <section className="sidebar">
          <div className="panel">
            <div className="panel-header">
              <h2>Restaurants</h2>
              <span>{restaurants.length} found</span>
            </div>

            <div className="restaurant-list">
              {loading && restaurants.length === 0 && (
                <div className="skeleton-container">
                  <div className="skeleton-card"></div>
                  <div className="skeleton-card"></div>
                  <div className="skeleton-card"></div>
                </div>
              )}
              {!loading && restaurants.length === 0 && (
                <div className="empty-state">No restaurants match your search.</div>
              )}
              {restaurants.map((restaurant) => (
                <article
                  key={restaurant.id}
                  className={`restaurant-card ${details?.restaurant?.id === restaurant.id ? 'selected' : ''}`}
                  onClick={() => openRestaurant(restaurant.id)}
                >
                  <div className="restaurant-image-wrapper">
                    <img src={restaurant.image_url} alt={restaurant.name} loading="lazy" />
                    <span className="restaurant-badge">{restaurant.cuisine}</span>
                  </div>
                  <div className="restaurant-info">
                    <h3>{restaurant.name}</h3>
                    <p>{restaurant.description}</p>
                    <div className="restaurant-meta">
                      <span className="rating">
                        <Stars n={restaurant.avg_rating} />
                        <strong>{Number(restaurant.avg_rating) > 0 ? Number(restaurant.avg_rating).toFixed(1) : 'New'}</strong>
                      </span>
                      <span>({restaurant.review_count} reviews)</span>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* CONTENT PANEL: RESTAURANT MENU AND REVIEWS */}
        <section className="content">
          {details ? (
            <>
              {/* RESTAURANT HERO HEADER */}
              <div className="restaurant-hero">
                <div className="hero-image-wrapper">
                  <img src={details.restaurant.image_url} alt={details.restaurant.name} />
                </div>
                <div className="hero-details">
                  <span className="cuisine-tag">{details.restaurant.cuisine}</span>
                  <h2>{details.restaurant.name}</h2>
                  <p className="description">{details.restaurant.description}</p>
                  
                  <div className="hero-stats">
                    <div className="hero-stat-item">
                      <Stars n={details.stats?.avg_rating} />
                      <strong>{Number(details.stats?.avg_rating) > 0 ? Number(details.stats?.avg_rating).toFixed(1) : 'New'}</strong>
                      <span>({details.stats?.count || 0} reviews)</span>
                    </div>
                    <div className="hero-stat-item">
                      <ClockIcon />
                      <span>Delivery: <strong>{details.restaurant.delivery_time || '20-30 min'}</strong></span>
                    </div>
                    <div className="hero-stat-item">
                      <BikeIcon />
                      <span>Fee: <strong>{Number(details.restaurant.delivery_fee) > 0 ? `₹${details.restaurant.delivery_fee}` : 'Free'}</strong></span>
                    </div>
                  </div>
                </div>
              </div>

              {/* MENU SECTION */}
              <div>
                <h3 className="section-title">Menu Items</h3>
                <div className="menu-grid">
                  {details.menu.map((item) => {
                    const cartItem = cart[item.id]
                    return (
                      <div key={item.id} className="menu-card">
                        <div className="menu-info">
                          <h4>{item.name}</h4>
                          <p>{item.description}</p>
                        </div>
                        <div className="menu-footer">
                          <span className="price">₹{item.price}</span>
                          {cartItem ? (
                            <div className="qty-selector">
                              <button className="qty-btn" onClick={() => updateQuantity(item.id, -1)}><MinusIcon /></button>
                              <span className="qty-value">{cartItem.quantity}</span>
                              <button className="qty-btn" onClick={() => updateQuantity(item.id, 1)}><PlusIcon /></button>
                            </div>
                          ) : (
                            <button onClick={() => addToCart(item)}>
                              <PlusIcon /> Add to Cart
                            </button>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* REVIEWS SECTION */}
              <div className="panel">
                <h3 className="section-title">Customer Reviews</h3>
                <div className="reviews-container">
                  {details.reviews.length === 0 ? (
                    <div className="empty-state">No reviews yet. Be the first to review!</div>
                  ) : (
                    details.reviews.map((review) => (
                      <div key={review.id} className="review-card">
                        <div className="review-header">
                          <div className="reviewer-avatar">
                            {review.reviewer_name.slice(0, 2).toUpperCase()}
                          </div>
                          <div className="reviewer-details">
                            <strong>{review.reviewer_name}</strong>
                            <span>{new Date(review.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                          </div>
                          <Stars n={review.rating} />
                        </div>
                        <p>{review.comment}</p>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* REVIEW FORM */}
              <form onSubmit={submitReview} className="review-form">
                <h3 className="section-title">Write a Review</h3>
                <div className="form-group">
                  <label htmlFor="reviewer-name">Your Name</label>
                  <input
                    id="reviewer-name"
                    value={reviewerName}
                    onChange={(e) => setReviewerName(e.target.value)}
                    placeholder="Enter your name (optional)"
                  />
                </div>

                <div className="form-group">
                  <label>Rating</label>
                  <div className="star-rating-input">
                    {[1, 2, 3, 4, 5].map((score) => (
                      <button
                        type="button"
                        key={score}
                        className={`star-input-btn ${score <= (hoverRating || reviewRating) ? 'selected' : ''}`}
                        onMouseEnter={() => setHoverRating(score)}
                        onMouseLeave={() => setHoverRating(0)}
                        onClick={() => setReviewRating(score)}
                        aria-label={`Rate ${score} stars`}
                      >
                        ★
                      </button>
                    ))}
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="review-comment">Review Comment</label>
                  <textarea
                    id="review-comment"
                    value={reviewText}
                    onChange={(e) => setReviewText(e.target.value)}
                    placeholder="Tell us what you liked or how we can improve..."
                    required
                  />
                </div>

                <button type="submit" className="submit-btn">Submit Feedback</button>
              </form>
            </>
          ) : (
            <div className="panel empty-panel">
              <ChefIcon />
              <h2>Welcome to QuickBite</h2>
              <p>Explore top-rated restaurants, browse menus, and track order deliveries in real-time.</p>
            </div>
          )}
        </section>
      </div>

      {/* --- CART DRAWER (SLIDE OUT PANEL) --- */}
      <div className={`side-drawer-overlay ${isCartOpen ? 'open' : ''}`} onClick={() => setIsCartOpen(false)}></div>
      <div className={`side-drawer ${isCartOpen ? 'open' : ''}`}>
        <div className="drawer-header">
          <h2><CartIcon /> Shopping Cart</h2>
          <button className="icon-btn" onClick={() => setIsCartOpen(false)}><CloseIcon /></button>
        </div>
        <div className="drawer-content">
          {cartItemsArray.length === 0 ? (
            <div className="empty-panel" style={{ height: '100%' }}>
              <CartIcon />
              <h2>Your Cart is Empty</h2>
              <p>Add delicious items from the menu to start your order.</p>
            </div>
          ) : (
            <div className="cart-items-list">
              {cartItemsArray.map((item) => (
                <div key={item.id} className="cart-item">
                  <div className="cart-item-details">
                    <h4>{item.name}</h4>
                    <span className="price">₹{item.price} each</span>
                  </div>
                  <div className="qty-selector">
                    <button className="qty-btn" onClick={() => updateQuantity(item.id, -1)}><MinusIcon /></button>
                    <span className="qty-value">{item.quantity}</span>
                    <button className="qty-btn" onClick={() => updateQuantity(item.id, 1)}><PlusIcon /></button>
                  </div>
                  <button className="icon-btn" onClick={() => removeFromCart(item.id)} style={{ padding: '8px', width: 'auto', height: 'auto', borderRadius: '8px' }}>
                    <TrashIcon />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
        {cartItemsArray.length > 0 && (
          <div className="drawer-footer">
            <div className="cart-summary-row">
              <span>Subtotal:</span>
              <strong>₹{cartSubtotal.toFixed(2)}</strong>
            </div>
            <div className="cart-summary-row">
              <span>Delivery Fee:</span>
              <strong>₹{cartDeliveryFee.toFixed(2)}</strong>
            </div>
            <div className="cart-summary-row">
              <span>Estimated Tax (8%):</span>
              <strong>₹{cartTax.toFixed(2)}</strong>
            </div>
            <div className="cart-summary-row total">
              <span>Grand Total:</span>
              <strong>₹{cartTotal.toFixed(2)}</strong>
            </div>
            <button className="checkout-btn" onClick={handleOpenCheckout}>Proceed to Checkout</button>
          </div>
        )}
      </div>

      {/* --- ORDER HISTORY DRAWER --- */}
      <div className={`side-drawer-overlay ${isOrdersOpen ? 'open' : ''}`} onClick={() => setIsOrdersOpen(false)}></div>
      <div className={`side-drawer ${isOrdersOpen ? 'open' : ''}`}>
        <div className="drawer-header">
          <h2><ReceiptIcon /> Order History</h2>
          <button className="icon-btn" onClick={() => setIsOrdersOpen(false)}><CloseIcon /></button>
        </div>
        <div className="drawer-content">
          {orders.length === 0 ? (
            <div className="empty-panel" style={{ height: '100%' }}>
              <ReceiptIcon />
              <h2>No Orders Placed Yet</h2>
              <p>Any orders you place will appear here along with their status.</p>
            </div>
          ) : (
            <div className="orders-history-list">
              {orders.map((order) => (
                <div key={order.id} className="order-history-card">
                  <div className="order-history-header">
                    <img src={order.restaurant_image} alt={order.restaurant_name} className="order-history-img" />
                    <div className="order-history-title">
                      <h4>{order.restaurant_name}</h4>
                      <span>Order #{order.id} • {new Date(order.created_at).toLocaleDateString()}</span>
                    </div>
                    <span className={`order-badge ${order.status}`}>{order.status.replace(/_/g, ' ')}</span>
                  </div>
                  
                  <div className="order-history-items">
                    {order.items.map((item, idx) => (
                      <div key={idx}>
                        {item.quantity}x {item.menu_item_name}
                      </div>
                    ))}
                  </div>

                  <div className="order-history-footer">
                    <span className="order-history-total">Total: ₹{order.total}</span>
                    <button className="track-btn" onClick={() => handleTrackOrder(order)}>Track Live</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* --- INTERACTIVE CHECKOUT MODAL --- */}
      <div className={`modal-overlay ${isCheckoutOpen ? 'open' : ''}`} onClick={() => setIsCheckoutOpen(false)}>
        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
          <div className="modal-header">
            <h3>{orderPlacedSuccess ? 'Order Confirmed!' : 'Delivery Details'}</h3>
            <button className="icon-btn" onClick={() => setIsCheckoutOpen(false)}><CloseIcon /></button>
          </div>

          {orderPlacedSuccess && lastPlacedOrder ? (
            <div className="success-screen">
              <div className="success-icon-wrapper">
                <CheckIcon />
              </div>
              <h2>Thank You for Ordering!</h2>
              <p style={{ margin: '12px 0 24px', color: 'var(--muted)' }}>
                Your order at <strong>{lastPlacedOrder.restaurant_name}</strong> has been successfully placed.<br/>
                Total Charged: <strong>₹{Number(lastPlacedOrder.total).toFixed(2)}</strong>
              </p>
              <button
                className="checkout-btn"
                onClick={() => {
                  const savedOrder = orders.find(o => o.id === lastPlacedOrder.id) || { id: lastPlacedOrder.id, status: 'pending', restaurant_name: lastPlacedOrder.restaurant_name };
                  handleTrackOrder(savedOrder);
                }}
              >
                Track Live Delivery
              </button>
            </div>
          ) : (
            <form onSubmit={submitCheckout}>
              <div className="form-group">
                <label htmlFor="checkout-name">Your Full Name</label>
                <input
                  id="checkout-name"
                  value={custName}
                  onChange={(e) => setCustName(e.target.value)}
                  placeholder="e.g. Tony Stark"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="checkout-address">Delivery Address</label>
                <input
                  id="checkout-address"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="e.g. 10880 Malibu Point, CA"
                  required
                />
              </div>

              <div className="form-group">
                <label>Payment Method</label>
                <div className="payment-grid">
                  <div
                    className={`payment-card-option ${paymentMethod === 'card' ? 'selected' : ''}`}
                    onClick={() => setPaymentMethod('card')}
                  >
                    <CreditCardIcon />
                    <span>Credit / Debit Card</span>
                  </div>
                  <div
                    className={`payment-card-option ${paymentMethod === 'cash' ? 'selected' : ''}`}
                    onClick={() => setPaymentMethod('cash')}
                  >
                    <CashIcon />
                    <span>Cash on Delivery</span>
                  </div>
                </div>
              </div>

              <div style={{ margin: '20px 0', borderTop: '1px solid var(--border)', paddingTop: '16px' }}>
                <div className="cart-summary-row" style={{ fontSize: '0.9rem' }}>
                  <span>Order Subtotal:</span>
                  <span>₹{cartSubtotal.toFixed(2)}</span>
                </div>
                <div className="cart-summary-row" style={{ fontSize: '0.9rem' }}>
                  <span>Delivery & Handling:</span>
                  <span>₹{cartDeliveryFee.toFixed(2)}</span>
                </div>
                <div className="cart-summary-row total" style={{ padding: '0', border: '0', marginTop: '4px' }}>
                  <span>Total Amount Due:</span>
                  <span>₹{cartTotal.toFixed(2)}</span>
                </div>
              </div>

              <button type="submit" className="checkout-btn">Place Delivery Order</button>
            </form>
          )}
        </div>
      </div>

      {/* --- LIVE ORDER TRACKER DIALOG (WITH SIMULATOR) --- */}
      <div className={`modal-overlay ${activeTrackingOrder ? 'open' : ''}`} onClick={() => setActiveTrackingOrder(null)}>
        {activeTrackingOrder && (
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '600px' }}>
            <div className="modal-header">
              <h3>Track Order #{activeTrackingOrder.id}</h3>
              <button className="icon-btn" onClick={() => setActiveTrackingOrder(null)}><CloseIcon /></button>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
              <img src={activeTrackingOrder.restaurant_image} alt={activeTrackingOrder.restaurant_name} style={{ width: '48px', height: '48px', borderRadius: '8px', objectFit: 'cover' }} />
              <div>
                <h4 style={{ fontSize: '1.1rem' }}>{activeTrackingOrder.restaurant_name}</h4>
                <p style={{ color: 'var(--muted)', fontSize: '0.85rem' }}>Delivering to: {activeTrackingOrder.address}</p>
              </div>
            </div>

            {/* TRACKING TIMELINE BAR */}
            <div className="tracking-steps">
              <div
                className="tracking-progress-bar"
                style={{ width: `${getProgressPercentage(activeTrackingOrder.status)}%` }}
              ></div>
              
              <div className={`tracking-step ${activeTrackingOrder.status === 'pending' ? 'active' : 'done'}`}>
                <div className="step-node">1</div>
                <div className="step-label">Placed</div>
              </div>
              <div className={`tracking-step ${activeTrackingOrder.status === 'preparing' ? 'active' : (['out_for_delivery', 'delivered'].includes(activeTrackingOrder.status) ? 'done' : '')}`}>
                <div className="step-node">2</div>
                <div className="step-label">Preparing</div>
              </div>
              <div className={`tracking-step ${activeTrackingOrder.status === 'out_for_delivery' ? 'active' : (activeTrackingOrder.status === 'delivered' ? 'done' : '')}`}>
                <div className="step-node">3</div>
                <div className="step-label">On Way</div>
              </div>
              <div className={`tracking-step ${activeTrackingOrder.status === 'delivered' ? 'active done' : ''}`}>
                <div className="step-node">4</div>
                <div className="step-label">Arrived</div>
              </div>
            </div>

            <div style={{ background: 'var(--input-bg)', padding: '16px', borderRadius: '12px', textAlign: 'center', marginBottom: '24px' }}>
              <span style={{ fontSize: '0.85rem', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Current Status</span>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--accent)', textTransform: 'capitalize', marginTop: '4px' }}>
                {activeTrackingOrder.status.replace(/_/g, ' ')}
              </h2>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
