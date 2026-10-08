import React, { useState } from 'react';
import { LogIn, UserPlus } from 'lucide-react';

export default function CustomerAuth({ onLoginSuccess }) {
  const [mode, setMode] = useState('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      const url = mode === 'login' ? '/api/neon/auth/login' : '/api/neon/auth/signup';
      const payload = mode === 'login' ? { email, password } : { email, password, name };
      
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      
      if (res.ok && data.success) {
        onLoginSuccess(data.user);
      } else {
        setError(data.error || 'Authentication failed');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="glass" style={{ padding: '2rem', borderRadius: '1rem', maxWidth: '400px', margin: '0 auto' }}>
      <h3 style={{ fontSize: '1.5rem', marginBottom: '1.5rem', textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
        {mode === 'login' ? <LogIn size={24} color="var(--primary)" /> : <UserPlus size={24} color="var(--primary)" />}
        {mode === 'login' ? 'Customer Login' : 'Create Account'}
      </h3>
      
      {error && (
        <div style={{ backgroundColor: '#FEE2E2', color: '#DC2626', padding: '0.75rem', borderRadius: '0.5rem', marginBottom: '1rem', fontSize: '0.875rem' }}>
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {mode === 'signup' && (
          <div>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.5rem' }}>Full Name</label>
            <input type="text" value={name} onChange={e => setName(e.target.value)} className="search-input" style={{ width: '100%' }} required />
          </div>
        )}
        
        <div>
          <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.5rem' }}>Email</label>
          <input type="email" value={email} onChange={e => setEmail(e.target.value)} className="search-input" style={{ width: '100%' }} required />
        </div>
        
        <div>
          <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.5rem' }}>Password</label>
          <input type="password" value={password} onChange={e => setPassword(e.target.value)} className="search-input" style={{ width: '100%' }} required minLength={6} />
        </div>
        
        <button type="submit" className="btn-primary" style={{ width: '100%', marginTop: '0.5rem' }} disabled={loading}>
          {loading ? 'Please wait...' : (mode === 'login' ? 'Login' : 'Sign Up')}
        </button>
      </form>
      
      <div style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.875rem' }}>
        {mode === 'login' ? "Don't have an account? " : "Already have an account? "}
        <button 
          onClick={() => { setMode(mode === 'login' ? 'signup' : 'login'); setError(''); }} 
          style={{ background: 'none', border: 'none', color: 'var(--primary)', fontWeight: 600, cursor: 'pointer', padding: 0 }}
        >
          {mode === 'login' ? 'Sign up here' : 'Login here'}
        </button>
      </div>
    </div>
  );
}
