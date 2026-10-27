import { useState } from 'react';
import { Routes, Route, NavLink } from 'react-router-dom';
import { useApp } from './context/AppContext.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Mood from './pages/Mood.jsx';
import Journal from './pages/Journal.jsx';
import Meditate from './pages/Meditate.jsx';
import Explore from './pages/Explore.jsx';

const links = [['/', 'Dashboard'], ['/mood', 'Mood'], ['/journal', 'Journal'], ['/meditate', 'Meditate'], ['/explore', 'Explore']];

function AuthPage({ onLogin }) {
  const [mode, setMode] = useState('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  function changeMode(next) {
    setMode(next); setMessage(''); setError(''); setPassword(''); setConfirm('');
  }

  function handleSubmit(e) {
    e.preventDefault(); setMessage(''); setError('');
    const users = JSON.parse(localStorage.getItem('mb-users') || '[]');
    const cleanEmail = email.trim().toLowerCase();
    if (mode === 'signup') {
      if (password.length < 6) return setError('Password must be at least 6 characters.');
      if (password !== confirm) return setError('Passwords do not match.');
      if (users.some(user => user.email === cleanEmail)) return setError('This email is already registered. Please log in.');
      const user = { name: name.trim(), email: cleanEmail, password };
      localStorage.setItem('mb-users', JSON.stringify([...users, user]));
      onLogin(user);
    } else if (mode === 'login') {
      const user = users.find(item => item.email === cleanEmail && item.password === password);
      if (!user) return setError('Email or password is incorrect. Please try again or sign up.');
      onLogin(user);
    } else {
      const index = users.findIndex(item => item.email === cleanEmail);
      if (index === -1) return setError('No account found with this email.');
      if (password.length < 6) return setError('New password must be at least 6 characters.');
      if (password !== confirm) return setError('Passwords do not match.');
      users[index].password = password;
      localStorage.setItem('mb-users', JSON.stringify(users));
      changeMode('login');
      setMessage('Password changed. You can now log in.');
    }
  }

  return <main className="login-page">
    <section className="login-box">
      <h1>🌱 MindBloom</h1>
      <p className="login-intro">A simple space to take care of your mind.</p>
      <div className="login-tabs">
        <button type="button" className={mode === 'login' ? 'selected' : ''} onClick={() => changeMode('login')}>Login</button>
        <button type="button" className={mode === 'signup' ? 'selected' : ''} onClick={() => changeMode('signup')}>Sign up</button>
        <button type="button" className={mode === 'forgot' ? 'selected' : ''} onClick={() => changeMode('forgot')}>Forgot password</button>
      </div>
      <h2>{mode === 'login' ? 'Login to your account' : mode === 'signup' ? 'Create an account' : 'Reset your password'}</h2>
      {message && <p className="login-message">{message}</p>}
      {error && <p className="login-error">{error}</p>}
      <form onSubmit={handleSubmit} className="login-form">
        {mode === 'signup' && <label>Name<input value={name} onChange={e => setName(e.target.value)} placeholder="Enter your name" required /></label>}
        <label>Email<input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Enter your email" required /></label>
        {mode !== 'forgot' ? <label>Password<input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Enter your password" required /></label> : <label>New password<input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Enter a new password" required minLength={6} /></label>}
        {(mode === 'signup' || mode === 'forgot') && <label>Confirm password<input type="password" value={confirm} onChange={e => setConfirm(e.target.value)} placeholder="Enter password again" required minLength={6} /></label>}
        <button className="btn login-submit" type="submit">{mode === 'login' ? 'Login' : mode === 'signup' ? 'Create account' : 'Reset password'}</button>
      </form>
      {mode === 'login' && <p className="login-bottom">New here? <button type="button" onClick={() => changeMode('signup')}>Sign up</button></p>}
      {mode === 'signup' && <p className="login-bottom">Already have an account? <button type="button" onClick={() => changeMode('login')}>Login</button></p>}
      {mode === 'forgot' && <p className="login-bottom">Remember your password? <button type="button" onClick={() => changeMode('login')}>Back to login</button></p>}
    </section>
  </main>;
}

export default function App() {
  const { theme, setTheme } = useApp();
  const [currentUser, setCurrentUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem('mb-session') || 'null'); } catch { return null; }
  });
  function handleLogin(user) {
    const session = { name: user.name || user.email.split('@')[0], email: user.email };
    localStorage.setItem('mb-session', JSON.stringify(session));
    setCurrentUser(session);
  }
  function logout() { localStorage.removeItem('mb-session'); setCurrentUser(null); }
  if (!currentUser) return <AuthPage onLogin={handleLogin} />;
  return <><header className="nav"><h1>🌱 MindBloom</h1>
    <nav>{links.map(([to, label]) => <NavLink key={to} to={to} end={to === '/'}>{label}</NavLink>)}</nav>
    <div className="nav-actions"><span>Hi, {currentUser.name}</span><button className="btn ghost" onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}>{theme === 'light' ? '🌙' : '☀️'}</button><button className="btn ghost" onClick={logout}>Log out</button></div>
  </header><main className="container"><Routes>
    <Route path="/" element={<Dashboard />} /><Route path="/mood" element={<Mood />} /><Route path="/journal" element={<Journal />} />
    <Route path="/meditate" element={<Meditate />} /><Route path="/explore" element={<Explore />} /><Route path="*" element={<h2>Page not found</h2>} />
  </Routes></main><footer>MindBloom · Front-End Engineering-II · Data is stored in your browser</footer></>;
}
