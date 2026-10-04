import { useEffect, useState } from 'react';
import axios from 'axios';

const API = import.meta.env.VITE_API_URL ?? 'http://localhost:8000';

declare global {
  interface Window { google?: { accounts: { id: { initialize: (config: { client_id: string; callback: (response: { credential: string }) => void }) => void; renderButton: (element: HTMLElement, options: Record<string, string>) => void } } } }
}

type User = { id: number; name: string; email: string };
type Props = { onAuthenticated: (user: User, token: string) => void };
type AuthResult = { success: boolean; user?: User; token?: string; message?: string };

export default function AuthScreen({ onAuthenticated }: Props) {
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID as string | undefined;

  const finish = (result: AuthResult) => {
    if (result.success && result.user && result.token) onAuthenticated(result.user, result.token);
    else setError(result.message ?? 'Authentication failed.');
  };

  useEffect(() => {
    if (!googleClientId) return;
    const render = () => {
      if (!window.google) return false;
      const target = document.getElementById('google-button');
      if (!target || target.dataset.rendered) return true;
      window.google.accounts.id.initialize({ client_id: googleClientId, callback: response => {
        void axios.post(`${API}/api/auth/google`, { credential: response.credential }).then(result => finish(result.data)).catch(() => setError('Google sign-in could not connect to the backend.'));
      }});
      window.google.accounts.id.renderButton(target, { theme: 'filled_black', size: 'large', width: '320' });
      target.dataset.rendered = 'true';
      return true;
    };
    if (render()) return;
    const timer = window.setInterval(() => { if (render()) window.clearInterval(timer); }, 250);
    return () => window.clearInterval(timer);
  }, [googleClientId]);

  const submit = async () => {
    setError(''); setBusy(true);
    try {
      const endpoint = mode === 'login' ? '/api/auth/login' : '/api/auth/signup';
      const result = await axios.post(`${API}${endpoint}`, mode === 'login' ? { email, password } : { name, email, password });
      finish(result.data);
    } catch (requestError) {
      setError(axios.isAxiosError(requestError) ? (requestError.response?.data?.message ?? 'Backend is not running. Start uvicorn on port 8000.') : 'Unable to connect to the backend.');
    } finally { setBusy(false); }
  };

  return <div className="auth-shell">
    <div className="auth-art"><div className="auth-orbit orbit-one" /><div className="auth-orbit orbit-two" /><div className="auth-logo">AI</div><p className="eyebrow">AI-DS VISUALIZER PRO</p><h1>Learn DSA.<br /><em>Ask AI. Master.</em></h1><p>Turn every algorithm into an experience you can see, understand, and remember.</p><div className="auth-points"><span>✦ Safe structured execution</span><span>◈ Step-by-step visual learning</span></div></div>
    <div className="auth-card">
      <div className="auth-brand"><span className="brand-mark">AI</span><div><span className="auth-kicker">AI-DS VISUALIZER PRO</span><strong>Welcome back</strong><small>Continue your learning journey</small></div></div>
      <div className="auth-tabs"><button className={mode === 'login' ? 'selected' : ''} onClick={() => setMode('login')}>Sign in</button><button className={mode === 'signup' ? 'selected' : ''} onClick={() => setMode('signup')}>Create account</button></div>
      {mode === 'signup' && <label>Name<input value={name} onChange={e => setName(e.target.value)} placeholder="Your name" /></label>}
      <label>Email<input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" /></label>
      <label>Password<div className="password-field"><input type={showPassword ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} placeholder={mode === 'signup' ? 'At least 8 characters' : 'Your password'} onKeyDown={e => e.key === 'Enter' && void submit()} /><button type="button" onClick={() => setShowPassword(!showPassword)} aria-label={showPassword ? 'Hide password' : 'Show password'}>{showPassword ? 'Hide' : 'Show'}</button></div></label>
      {error && <div className="auth-error">{error}</div>}
      <button className="auth-submit" disabled={busy} onClick={() => void submit()}>{busy ? 'Please wait…' : mode === 'login' ? 'Sign in' : 'Create account'} <span>↗</span></button>
      <p className="auth-terms">By continuing, you agree to use this educational workspace responsibly.</p>
    </div>
  </div>;
}
