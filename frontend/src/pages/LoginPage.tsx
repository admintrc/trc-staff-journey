import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

export default function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('director@trc.com');
  const [password, setPassword] = useState('Password123!');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await axios.post(`${API_URL}/auth/login`, {
        email,
        password,
      });

      const { tokens, user } = response.data.data;
      localStorage.setItem('accessToken', tokens.accessToken);
      localStorage.setItem('refreshToken', tokens.refreshToken);
      localStorage.setItem('user', JSON.stringify(user));

      navigate('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #82181b 0%, #A72923 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
      }}
    >
      <div
        style={{
          background: 'white',
          borderRadius: '12px',
          padding: '2rem',
          boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
          maxWidth: '400px',
          width: '90%',
        }}
      >
        {/* Logo */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            marginBottom: '1.5rem',
          }}
        >
          <div
            style={{
              width: '60px',
              height: '60px',
              background: '#ed2d29',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontSize: '28px',
              fontWeight: 'bold',
            }}
          >
            TRC
          </div>
        </div>

        {/* Title */}
        <h1
          style={{
            fontSize: '24px',
            fontWeight: '600',
            color: '#82181b',
            margin: '0 0 0.5rem 0',
            textAlign: 'center',
          }}
        >
          Staff Journey
        </h1>
        <p
          style={{
            fontSize: '14px',
            color: '#999',
            margin: '0 0 2rem 0',
            textAlign: 'center',
          }}
        >
          The Rehab Centre HR Management
        </p>

        {/* Error Message */}
        {error && (
          <div
            style={{
              background: '#fee',
              border: '1px solid #fcc',
              color: '#c33',
              padding: '12px',
              borderRadius: '6px',
              marginBottom: '1rem',
              fontSize: '14px',
            }}
          >
            {error}
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleLogin}>
          <div style={{ marginBottom: '1rem' }}>
            <label
              style={{
                display: 'block',
                fontWeight: '600',
                color: '#82181b',
                marginBottom: '0.5rem',
                fontSize: '14px',
              }}
            >
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              style={{
                width: '100%',
                padding: '10px 12px',
                border: '1px solid #ddd',
                borderRadius: '6px',
                fontSize: '14px',
                boxSizing: 'border-box',
                fontFamily: 'inherit',
                transition: 'all 0.2s',
              }}
              onFocus={(e) => (e.currentTarget.style.borderColor = '#82181b')}
              onBlur={(e) => (e.currentTarget.style.borderColor = '#ddd')}
            />
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <label
              style={{
                display: 'block',
                fontWeight: '600',
                color: '#82181b',
                marginBottom: '0.5rem',
                fontSize: '14px',
              }}
            >
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              style={{
                width: '100%',
                padding: '10px 12px',
                border: '1px solid #ddd',
                borderRadius: '6px',
                fontSize: '14px',
                boxSizing: 'border-box',
                fontFamily: 'inherit',
                transition: 'all 0.2s',
              }}
              onFocus={(e) => (e.currentTarget.style.borderColor = '#82181b')}
              onBlur={(e) => (e.currentTarget.style.borderColor = '#ddd')}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: '12px',
              background: '#82181b',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              fontSize: '14px',
              fontWeight: '600',
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.6 : 1,
              transition: 'all 0.2s',
            }}
            onMouseOver={(e) =>
              !loading && (e.currentTarget.style.background = '#A72923')
            }
            onMouseOut={(e) => (e.currentTarget.style.background = '#82181b')}
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        {/* Demo Credentials */}
        <div
          style={{
            marginTop: '1.5rem',
            padding: '1rem',
            background: '#f5f1eb',
            borderRadius: '6px',
            fontSize: '12px',
            color: '#666',
          }}
        >
          <p style={{ margin: '0 0 0.5rem 0', fontWeight: '600' }}>
            Demo Credentials:
          </p>
          <p style={{ margin: '0.25rem 0' }}>
            <strong>Director:</strong> director@trc.com
          </p>
          <p style={{ margin: '0.25rem 0' }}>
            <strong>Manager:</strong> manager@trc.com
          </p>
          <p style={{ margin: '0.25rem 0' }}>
            <strong>Password:</strong> Password123!
          </p>
        </div>
      </div>
    </div>
  );
}
