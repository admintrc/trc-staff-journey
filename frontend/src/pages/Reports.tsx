import React, { useState } from 'react';

const Reports = () => {
  const [selectedReport, setSelectedReport] = useState<string>('overview');

  const metrics = {
    totalStaff: 47,
    activeStaff: 45,
    onProbation: 2,
    reviews: { completed: 35, pending: 12, overdue: 0 },
    training: { compliant: 42, expiring: 3, overdue: 2 },
    turnover: 8.5,
  };

  const reportOptions = [
    { id: 'overview', name: 'Dashboard Overview', icon: '📊' },
    { id: 'compliance', name: 'Compliance Status', icon: '✓' },
    { id: 'turnover', name: 'Staff Turnover', icon: '👥' },
    { id: 'training', name: 'Training Compliance', icon: '🎓' },
    { id: 'performance', name: 'Performance Reviews', icon: '⭐' },
    { id: 'monthly', name: 'Monthly HR Report', icon: '📋' },
  ];

  return (
    <div style={{ padding: '2rem' }}>
      <h2 style={{ color: '#82181b', marginBottom: '2rem' }}>Reports & Analytics</h2>

      <div style={{ display: 'grid', gridTemplateColumns: '200px 1fr', gap: '2rem' }}>
        {/* Sidebar */}
        <div>
          {reportOptions.map((report) => (
            <button
              key={report.id}
              onClick={() => setSelectedReport(report.id)}
              style={{
                display: 'block',
                width: '100%',
                padding: '12px',
                margin: '0 0 0.5rem 0',
                border: selectedReport === report.id ? '2px solid #82181b' : '1px solid #ddd',
                background: selectedReport === report.id ? '#f5f1eb' : 'white',
                color: '#333',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '13px',
                fontWeight: '500',
                textAlign: 'left',
              }}
            >
              {report.icon} {report.name}
            </button>
          ))}
        </div>

        {/* Content */}
        <div>
          {selectedReport === 'overview' && (
            <div>
              <h3 style={{ color: '#82181b', marginTop: '0' }}>Dashboard Overview</h3>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                  gap: '1rem',
                  marginBottom: '2rem',
                }}
              >
                {[
                  { label: 'Total Staff', value: metrics.totalStaff, color: '#82181b' },
                  { label: 'Active Staff', value: metrics.activeStaff, color: '#ed2d29' },
                  { label: 'On Probation', value: metrics.onProbation, color: '#999' },
                  { label: 'Turnover Rate', value: `${metrics.turnover}%`, color: '#82181b' },
                ].map((metric) => (
                  <div
                    key={metric.label}
                    style={{
                      background: 'white',
                      border: '1px solid #e0dcd5',
                      borderRadius: '8px',
                      padding: '1.5rem',
                    }}
                  >
                    <p style={{ margin: '0 0 0.5rem 0', fontSize: '12px', color: '#999' }}>
                      {metric.label}
                    </p>
                    <p style={{ margin: '0', fontSize: '32px', fontWeight: '700', color: metric.color }}>
                      {metric.value}
                    </p>
                  </div>
                ))}
              </div>

              <h4 style={{ color: '#82181b' }}>Performance Reviews</h4>
              <div style={{ background: 'white', border: '1px solid #e0dcd5', borderRadius: '6px', padding: '1rem' }}>
                <p style={{ margin: '0.5rem 0' }}>✓ Completed: {metrics.reviews.completed}</p>
                <p style={{ margin: '0.5rem 0' }}>⏳ Pending: {metrics.reviews.pending}</p>
                <p style={{ margin: '0.5rem 0' }}>⚠️ Overdue: {metrics.reviews.overdue}</p>
              </div>
            </div>
          )}

          {selectedReport === 'compliance' && (
            <div>
              <h3 style={{ color: '#82181b', marginTop: '0' }}>Compliance Status</h3>
              <div style={{ background: 'white', border: '1px solid #e0dcd5', borderRadius: '6px', padding: '1.5rem' }}>
                <p style={{ margin: '1rem 0' }}>
                  <strong>Overall Compliance:</strong> 94% ✓
                </p>
                <p style={{ margin: '1rem 0' }}>
                  <strong>Training Compliance:</strong> {metrics.training.compliant}/{47} staff compliant
                </p>
                <p style={{ margin: '1rem 0', color: '#ed2d29' }}>
                  <strong>⚠️ Expiring Soon:</strong> {metrics.training.expiring} trainings
                </p>
                <p style={{ margin: '1rem 0', color: '#ed2d29' }}>
                  <strong>⚠️ Overdue:</strong> {metrics.training.overdue} trainings
                </p>
              </div>
            </div>
          )}

          {selectedReport === 'training' && (
            <div>
              <h3 style={{ color: '#82181b', marginTop: '0' }}>Training Compliance</h3>
              <div style={{ background: 'white', border: '1px solid #e0dcd5', borderRadius: '6px', padding: '1.5rem' }}>
                <div style={{ marginBottom: '1rem' }}>
                  <p style={{ fontSize: '12px', color: '#666' }}>Compliant</p>
                  <div
                    style={{
                      height: '24px',
                      background: '#E0DCD5',
                      borderRadius: '4px',
                      overflow: 'hidden',
                    }}
                  >
                    <div
                      style={{
                        height: '100%',
                        background: '#82181b',
                        width: `${(metrics.training.compliant / 47) * 100}%`,
                        transition: 'width 0.3s',
                      }}
                    />
                  </div>
                  <p style={{ fontSize: '12px', color: '#666', marginTop: '4px' }}>
                    {metrics.training.compliant} of 47 staff
                  </p>
                </div>
              </div>
            </div>
          )}

          {selectedReport === 'monthly' && (
            <div>
              <h3 style={{ color: '#82181b', marginTop: '0' }}>Monthly HR Report</h3>
              <div style={{ background: 'white', border: '1px solid #e0dcd5', borderRadius: '6px', padding: '1.5rem' }}>
                <p>
                  <strong>Report Date:</strong> September 2026
                </p>
                <p>
                  <strong>Total Staff:</strong> {metrics.totalStaff}
                </p>
                <p>
                  <strong>New Hires:</strong> 2
                </p>
                <p>
                  <strong>Departures:</strong> 1
                </p>
                <p style={{ marginTop: '1rem' }}>
                  <strong>Key Highlights:</strong>
                </p>
                <ul style={{ fontSize: '14px' }}>
                  <li>95% training compliance achieved</li>
                  <li>All probation reviews on schedule</li>
                  <li>No compliance issues recorded</li>
                </ul>
              </div>
            </div>
          )}

          {!['overview', 'compliance', 'training', 'monthly'].includes(selectedReport) && (
            <div style={{ background: 'white', border: '1px solid #e0dcd5', borderRadius: '6px', padding: '2rem', textAlign: 'center', color: '#999' }}>
              Report details coming in Phase 6 expansion
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Reports;
