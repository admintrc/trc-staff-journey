import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'staff' | 'manager' | 'director';
}

interface DashboardMetrics {
  totalStaff: number;
  activeReviews: number;
  trainingCompliance: number;
  pendingTasks: number;
}

export default function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [metrics] = useState<DashboardMetrics>({
    totalStaff: 47,
    activeReviews: 6,
    trainingCompliance: 89,
    pendingTasks: 3,
  });

  useEffect(() => {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      setUser(JSON.parse(userStr));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    navigate('/login');
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  const roleTitle =
    user.role === 'director'
      ? 'Director'
      : user.role === 'manager'
        ? 'Manager'
        : 'Staff';

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#f5f1eb' }}>
      {/* Sidebar */}
      <aside
        style={{
          width: '250px',
          background: '#82181b',
          color: 'white',
          padding: '2rem 1rem',
          boxShadow: '2px 0 8px rgba(0,0,0,0.1)',
        }}
      >
        <div style={{ marginBottom: '2rem' }}>
          <div
            style={{
              width: '50px',
              height: '50px',
              background: '#ed2d29',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontSize: '24px',
              fontWeight: 'bold',
              margin: '0 auto 1rem',
            }}
          >
            TRC
          </div>
          <h2
            style={{
              margin: '0',
              fontSize: '18px',
              fontWeight: '600',
              textAlign: 'center',
            }}
          >
            Staff Journey
          </h2>
        </div>

        <nav>
          {[
            { tab: 'overview', label: 'Overview', path: '/dashboard' },
            { tab: 'staff', label: 'Staff', path: '/staff' },
            { tab: 'forms', label: 'Forms', path: '/forms' },
            { tab: 'handbook', label: 'Handbook', path: '/handbook' },
            { tab: 'reports', label: 'Reports', path: '#' },
          ].map((item) => (
            <button
              key={item.tab}
              onClick={() => {
                if (item.path.startsWith('/')) {
                  navigate(item.path);
                } else {
                  setActiveTab(item.tab);
                }
              }}
              style={{
                width: '100%',
                padding: '12px',
                border: 'none',
                background:
                  activeTab === item.tab ? 'rgba(255,255,255,0.2)' : 'transparent',
                color: 'white',
                cursor: item.path === '#' ? 'not-allowed' : 'pointer',
                textAlign: 'left',
                marginBottom: '0.5rem',
                borderRadius: '6px',
                fontSize: '14px',
                fontWeight: '500',
                transition: 'all 0.2s',
                opacity: item.path === '#' ? 0.5 : 1,
              }}
            >
              {item.label}
            </button>
          ))}
        </nav>

        <button
          onClick={handleLogout}
          style={{
            width: '100%',
            padding: '12px',
            border: 'none',
            background: 'rgba(255,255,255,0.1)',
            color: 'white',
            cursor: 'pointer',
            marginTop: '2rem',
            borderRadius: '6px',
            fontSize: '14px',
            fontWeight: '500',
          }}
        >
          Logout
        </button>
      </aside>

      {/* Main Content */}
      <main style={{ flex: 1 }}>
        {/* Header */}
        <header
          style={{
            background: 'white',
            borderBottom: '1px solid #e0dcd5',
            padding: '1.5rem 2rem',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
          }}
        >
          <div>
            <h1 style={{ margin: '0 0 0.25rem 0', fontSize: '24px', color: '#82181b' }}>
              Welcome, {user.firstName}
            </h1>
            <p style={{ margin: '0', fontSize: '14px', color: '#999' }}>
              {roleTitle} • {user.email}
            </p>
          </div>
          <div
            style={{
              width: '44px',
              height: '44px',
              background: 'linear-gradient(135deg, #82181b, #ed2d29)',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontWeight: '600',
              fontSize: '16px',
            }}
          >
            {user.firstName[0]}
            {user.lastName[0]}
          </div>
        </header>

        {/* Content */}
        <div style={{ padding: '2rem' }}>
          {activeTab === 'overview' && (
            <div>
              <h2 style={{ color: '#82181b', marginBottom: '1.5rem' }}>
                Dashboard Overview
              </h2>

              {/* Metrics Grid */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                  gap: '16px',
                  marginBottom: '2rem',
                }}
              >
                {[
                  { label: 'Active Staff', value: metrics.totalStaff, color: '#82181b' },
                  {
                    label: 'Pending Reviews',
                    value: metrics.activeReviews,
                    color: '#ed2d29',
                  },
                  {
                    label: 'Training Compliance',
                    value: `${metrics.trainingCompliance}%`,
                    color: '#82181b',
                  },
                  {
                    label: 'Pending Tasks',
                    value: metrics.pendingTasks,
                    color: '#ed2d29',
                  },
                ].map((metric, idx) => (
                  <div
                    key={idx}
                    style={{
                      background: 'white',
                      border: '1px solid #e0dcd5',
                      borderRadius: '8px',
                      padding: '1.5rem',
                      boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
                    }}
                  >
                    <p
                      style={{
                        margin: '0 0 0.5rem 0',
                        fontSize: '14px',
                        color: '#999',
                        fontWeight: '600',
                      }}
                    >
                      {metric.label}
                    </p>
                    <p
                      style={{
                        margin: '0',
                        fontSize: '32px',
                        fontWeight: '700',
                        color: metric.color,
                      }}
                    >
                      {metric.value}
                    </p>
                  </div>
                ))}
              </div>

              {/* Role-Based Content */}
              <div
                style={{
                  background: 'white',
                  border: '1px solid #e0dcd5',
                  borderRadius: '8px',
                  padding: '2rem',
                }}
              >
                {user.role === 'director' && (
                  <div>
                    <h3 style={{ color: '#82181b', marginTop: '0' }}>
                      Director Tools
                    </h3>
                    <ul style={{ marginBottom: '0' }}>
                      <li>Monthly HR reports</li>
                      <li>Organization-wide compliance tracking</li>
                      <li>Staff performance analytics</li>
                      <li>Budget & staffing forecasts</li>
                    </ul>
                  </div>
                )}

                {user.role === 'manager' && (
                  <div>
                    <h3 style={{ color: '#82181b', marginTop: '0' }}>
                      Manager Tools
                    </h3>
                    <ul style={{ marginBottom: '0' }}>
                      <li>Manage team members</li>
                      <li>Track probation & reviews</li>
                      <li>Create & approve forms</li>
                      <li>Monitor training compliance</li>
                    </ul>
                  </div>
                )}

                {user.role === 'staff' && (
                  <div>
                    <h3 style={{ color: '#82181b', marginTop: '0' }}>
                      Your Staff Journey
                    </h3>
                    <ul style={{ marginBottom: '0' }}>
                      <li>View your profile & employment details</li>
                      <li>Check upcoming reviews & milestones</li>
                      <li>Access training records</li>
                      <li>View organizational handbook</li>
                    </ul>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'staff' && (
            <div>
              <h2 style={{ color: '#82181b', marginBottom: '1.5rem' }}>
                Staff Directory
              </h2>
              <div style={{ background: 'white', padding: '2rem', borderRadius: '8px' }}>
                <p style={{ color: '#999' }}>Staff management coming in Phase 3...</p>
              </div>
            </div>
          )}

          {activeTab === 'forms' && (
            <div>
              <h2 style={{ color: '#82181b', marginBottom: '1.5rem' }}>
                Forms & Checklists
              </h2>
              <div style={{ background: 'white', padding: '2rem', borderRadius: '8px' }}>
                <p style={{ color: '#999' }}>
                  Digital forms (C1-C17) coming in Phase 4-5...
                </p>
              </div>
            </div>
          )}

          {activeTab === 'handbook' && (
            <div>
              <h2 style={{ color: '#82181b', marginBottom: '1.5rem' }}>
                Staff Journey Handbook
              </h2>
              <div style={{ background: 'white', padding: '2rem', borderRadius: '8px' }}>
                <p style={{ color: '#999' }}>
                  Handbook & search coming in Phase 3...
                </p>
              </div>
            </div>
          )}

          {activeTab === 'reports' && (
            <div>
              <h2 style={{ color: '#82181b', marginBottom: '1.5rem' }}>
                Reports & Analytics
              </h2>
              <div style={{ background: 'white', padding: '2rem', borderRadius: '8px' }}>
                <p style={{ color: '#999' }}>
                  Analytics dashboard coming in Phase 6...
                </p>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
