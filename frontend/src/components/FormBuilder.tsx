import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface FormField {
  name: string;
  type: string;
  label: string;
  required: boolean;
  placeholder?: string;
  options?: string[];
  helpText?: string;
}

interface FormDefinition {
  id: string;
  type: string;
  title: string;
  description: string;
  sections: string[];
  fields: FormField[];
}

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

interface FormBuilderProps {
  formType: string;
  onSubmit?: (data: any) => void;
  readOnly?: boolean;
}

export default function FormBuilder({ formType, onSubmit, readOnly = false }: FormBuilderProps) {
  const [form, setForm] = useState<FormDefinition | null>(null);
  const [formData, setFormData] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchForm = async () => {
      try {
        const token = localStorage.getItem('accessToken');
        const response = await axios.get(`${API_URL}/forms/definition/${formType}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setForm(response.data.data.form);

        // Initialize form data
        const initialData: any = {};
        response.data.data.form.fields.forEach((field: FormField) => {
          initialData[field.name] = field.type === 'checkbox' ? false : '';
        });
        setFormData(initialData);
      } catch (err) {
        setError('Failed to load form');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchForm();
  }, [formType]);

  const handleFieldChange = (fieldName: string, value: any) => {
    setFormData((prev: any) => ({
      ...prev,
      [fieldName]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      const token = localStorage.getItem('accessToken');
      const response = await axios.post(
        `${API_URL}/forms/submit`,
        {
          formType,
          data: formData,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (onSubmit) {
        onSubmit(response.data.data.form);
      } else {
        alert('Form submitted successfully!');
      }
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to submit form');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div style={{ padding: '2rem', textAlign: 'center' }}>Loading form...</div>;
  }

  if (!form) {
    return <div style={{ padding: '2rem', color: 'red' }}>Form not found</div>;
  }

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: '700px' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h2 style={{ margin: '0 0 0.5rem 0', color: '#82181b' }}>{form.title}</h2>
        <p style={{ margin: '0', color: '#999', fontSize: '14px' }}>{form.description}</p>
      </div>

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

      {form.sections.map((section) => (
        <div key={section} style={{ marginBottom: '2rem' }}>
          <h3 style={{ color: '#82181b', fontSize: '16px', marginBottom: '1rem' }}>
            {section}
          </h3>

          {form.fields
            .filter((field) => {
              const sectionFields: any = {
                'Position Details': ['position', 'department', 'description', 'employmentType'],
                'Budget Approval': ['salary', 'approvedBy'],
                'Timeline': ['startDate'],
              };
              return sectionFields[section]?.includes(field.name) || !sectionFields[section];
            })
            .map((field) => (
              <div key={field.name} style={{ marginBottom: '1.5rem' }}>
                <label
                  style={{
                    display: 'block',
                    fontWeight: '600',
                    color: '#82181b',
                    marginBottom: '0.5rem',
                    fontSize: '14px',
                  }}
                >
                  {field.label}
                  {field.required && <span style={{ color: '#ed2d29' }}>*</span>}
                </label>

                {field.type === 'text' && (
                  <input
                    type="text"
                    name={field.name}
                    value={formData[field.name] || ''}
                    onChange={(e) => handleFieldChange(field.name, e.target.value)}
                    placeholder={field.placeholder}
                    disabled={readOnly}
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      border: '1px solid #ddd',
                      borderRadius: '6px',
                      fontSize: '14px',
                      boxSizing: 'border-box',
                      opacity: readOnly ? 0.5 : 1,
                    }}
                  />
                )}

                {field.type === 'email' && (
                  <input
                    type="email"
                    name={field.name}
                    value={formData[field.name] || ''}
                    onChange={(e) => handleFieldChange(field.name, e.target.value)}
                    placeholder={field.placeholder}
                    disabled={readOnly}
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      border: '1px solid #ddd',
                      borderRadius: '6px',
                      fontSize: '14px',
                      boxSizing: 'border-box',
                      opacity: readOnly ? 0.5 : 1,
                    }}
                  />
                )}

                {field.type === 'number' && (
                  <input
                    type="number"
                    name={field.name}
                    value={formData[field.name] || ''}
                    onChange={(e) => handleFieldChange(field.name, e.target.value)}
                    placeholder={field.placeholder}
                    disabled={readOnly}
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      border: '1px solid #ddd',
                      borderRadius: '6px',
                      fontSize: '14px',
                      boxSizing: 'border-box',
                      opacity: readOnly ? 0.5 : 1,
                    }}
                  />
                )}

                {field.type === 'date' && (
                  <input
                    type="date"
                    name={field.name}
                    value={formData[field.name] || ''}
                    onChange={(e) => handleFieldChange(field.name, e.target.value)}
                    disabled={readOnly}
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      border: '1px solid #ddd',
                      borderRadius: '6px',
                      fontSize: '14px',
                      boxSizing: 'border-box',
                      opacity: readOnly ? 0.5 : 1,
                    }}
                  />
                )}

                {field.type === 'textarea' && (
                  <textarea
                    name={field.name}
                    value={formData[field.name] || ''}
                    onChange={(e) => handleFieldChange(field.name, e.target.value)}
                    placeholder={field.placeholder}
                    disabled={readOnly}
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      border: '1px solid #ddd',
                      borderRadius: '6px',
                      fontSize: '14px',
                      boxSizing: 'border-box',
                      minHeight: '100px',
                      fontFamily: 'inherit',
                      opacity: readOnly ? 0.5 : 1,
                    }}
                  />
                )}

                {field.type === 'select' && (
                  <select
                    name={field.name}
                    value={formData[field.name] || ''}
                    onChange={(e) => handleFieldChange(field.name, e.target.value)}
                    disabled={readOnly}
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      border: '1px solid #ddd',
                      borderRadius: '6px',
                      fontSize: '14px',
                      boxSizing: 'border-box',
                      fontFamily: 'inherit',
                      opacity: readOnly ? 0.5 : 1,
                    }}
                  >
                    <option value="">Select...</option>
                    {field.options?.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                )}

                {field.type === 'checkbox' && (
                  <label style={{ display: 'flex', alignItems: 'center', opacity: readOnly ? 0.5 : 1 }}>
                    <input
                      type="checkbox"
                      name={field.name}
                      checked={formData[field.name] || false}
                      onChange={(e) => handleFieldChange(field.name, e.target.checked)}
                      disabled={readOnly}
                      style={{ marginRight: '8px' }}
                    />
                    <span style={{ fontSize: '14px' }}>Confirmed</span>
                  </label>
                )}

                {field.helpText && (
                  <div style={{ fontSize: '12px', color: '#999', marginTop: '4px' }}>
                    {field.helpText}
                  </div>
                )}
              </div>
            ))}
        </div>
      ))}

      {!readOnly && (
        <button
          type="submit"
          disabled={submitting}
          style={{
            width: '100%',
            padding: '12px',
            background: '#82181b',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            fontSize: '14px',
            fontWeight: '600',
            cursor: submitting ? 'not-allowed' : 'pointer',
            opacity: submitting ? 0.6 : 1,
          }}
        >
          {submitting ? 'Submitting...' : 'Submit Form'}
        </button>
      )}
    </form>
  );
}
