import React, { useState, useEffect } from 'react';
import axios from 'axios';
import FormBuilder from '../components/FormBuilder';

interface FormSummary {
  id: string;
  type: string;
  title: string;
  description: string;
  accessLevel: string;
}

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

export default function Forms() {
  const [forms, setForms] = useState<FormSummary[]>([]);
  const [selectedForm, setSelectedForm] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchForms = async () => {
      try {
        const token = localStorage.getItem('accessToken');
        const response = await axios.get(`${API_URL}/forms`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setForms(response.data.data.forms);
      } catch (error) {
        console.error('Failed to fetch forms:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchForms();
  }, []);

  return (
    <div style={{ padding: '2rem', display: 'grid', gridTemplateColumns: '250px 1fr', gap: '2rem' }}>
      {/* Sidebar */}
      <div>
        <h3 style={{ color: '#82181b', marginTop: '0', marginBottom: '1rem' }}>
          Available Forms
        </h3>

        {loading ? (
          <div style={{ color: '#999', fontSize: '14px' }}>Loading...</div>
        ) : (
          <div
            style={{
              border: '1px solid #e0dcd5',
              borderRadius: '6px',
              overflow: 'hidden',
              maxHeight: '600px',
              overflowY: 'auto',
            }}
          >
            {forms.map((form) => (
              <button
                key={form.type}
                onClick={() => setSelectedForm(form.type)}
                style={{
                  display: 'block',
                  width: '100%',
                  padding: '12px',
                  border: 'none',
                  background: selectedForm === form.type ? '#f5f1eb' : 'white',
                  textAlign: 'left',
                  borderBottom: '1px solid #e0dcd5',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
                onMouseOver={(e) => (e.currentTarget.style.background = '#f5f1eb')}
                onMouseOut={(e) =>
                  (e.currentTarget.style.background =
                    selectedForm === form.type ? '#f5f1eb' : 'white')
                }
              >
                <div
                  style={{
                    fontWeight: '600',
                    color: '#82181b',
                    fontSize: '13px',
                  }}
                >
                  {form.id}
                </div>
                <div style={{ fontSize: '12px', color: '#666', marginTop: '4px' }}>
                  {form.title.split(':')[1]}
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Main Content */}
      <div
        style={{
          background: 'white',
          border: '1px solid #e0dcd5',
          borderRadius: '8px',
          padding: '2rem',
        }}
      >
        {selectedForm ? (
          <FormBuilder formType={selectedForm} />
        ) : (
          <div style={{ textAlign: 'center', color: '#999', padding: '2rem' }}>
            <p style={{ marginTop: '0' }}>Select a form from the list to get started</p>
            <p style={{ fontSize: '12px' }}>
              C1-C8 forms for hiring and onboarding are available
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
