import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface HandbookSection {
  id: string;
  title: string;
  part: 'A' | 'B';
  chapter: number;
  content: string;
  sections: string[];
}

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

export default function Handbook() {
  const [sections, setSections] = useState<HandbookSection[]>([]);
  const [search, setSearch] = useState('');
  const [selectedPart, setSelectedPart] = useState<'A' | 'B' | 'all'>('all');
  const [selectedSection, setSelectedSection] = useState<HandbookSection | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchSections = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('accessToken');
      let url = `${API_URL}/handbook`;

      if (search) {
        url = `${API_URL}/handbook/search?q=${encodeURIComponent(search)}`;
      } else if (selectedPart !== 'all') {
        url = `${API_URL}/handbook/part/${selectedPart}`;
      }

      const response = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setSections(search ? response.data.data.results : response.data.data.sections);
      setSelectedSection(null);
    } catch (error) {
      console.error('Failed to fetch handbook:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSections();
  }, [search, selectedPart]);

  return (
    <div style={{ padding: '2rem', display: 'grid', gridTemplateColumns: '300px 1fr', gap: '2rem' }}>
      {/* Sidebar */}
      <div>
        <h3 style={{ color: '#82181b', marginTop: '0' }}>Handbook</h3>

        {/* Search */}
        <div style={{ marginBottom: '1.5rem' }}>
          <label
            style={{
              display: 'block',
              fontWeight: '600',
              color: '#82181b',
              marginBottom: '0.5rem',
              fontSize: '12px',
            }}
          >
            Search
          </label>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search..."
            style={{
              width: '100%',
              padding: '8px 10px',
              border: '1px solid #ddd',
              borderRadius: '4px',
              fontSize: '13px',
              boxSizing: 'border-box',
            }}
          />
        </div>

        {/* Part Selection */}
        <div>
          <label style={{ fontWeight: '600', color: '#82181b', fontSize: '12px', display: 'block', marginBottom: '0.5rem' }}>
            Browse by Part
          </label>
          {['all', 'A', 'B'].map((part) => (
            <button
              key={part}
              onClick={() => setSelectedPart(part as any)}
              style={{
                display: 'block',
                width: '100%',
                padding: '10px 12px',
                margin: '0 0 0.5rem 0',
                border: selectedPart === part ? '2px solid #82181b' : '1px solid #ddd',
                background: selectedPart === part ? '#82181b' : 'white',
                color: selectedPart === part ? 'white' : '#333',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '13px',
                fontWeight: '500',
                textAlign: 'left',
              }}
            >
              {part === 'all' ? 'All Sections' : `Part ${part}`}
            </button>
          ))}
        </div>

        {/* Section List */}
        <div style={{ marginTop: '1.5rem' }}>
          <h4 style={{ color: '#82181b', fontSize: '12px', fontWeight: '600', margin: '0 0 0.75rem 0' }}>
            Sections
          </h4>
          <div
            style={{
              maxHeight: '500px',
              overflowY: 'auto',
              border: '1px solid #e0dcd5',
              borderRadius: '4px',
            }}
          >
            {sections.map((section) => (
              <button
                key={section.id}
                onClick={() => setSelectedSection(section)}
                style={{
                  display: 'block',
                  width: '100%',
                  padding: '10px 12px',
                  border: 'none',
                  background: selectedSection?.id === section.id ? '#f5f1eb' : 'white',
                  color: '#333',
                  textAlign: 'left',
                  borderBottom: '1px solid #e0dcd5',
                  cursor: 'pointer',
                  fontSize: '13px',
                  transition: 'all 0.2s',
                }}
                onMouseOver={(e) => (e.currentTarget.style.background = '#f5f1eb')}
                onMouseOut={(e) =>
                  (e.currentTarget.style.background =
                    selectedSection?.id === section.id ? '#f5f1eb' : 'white')
                }
              >
                <strong style={{ color: '#82181b' }}>{section.part}{section.chapter}</strong>
                <div style={{ fontSize: '12px', marginTop: '2px' }}>{section.title}</div>
              </button>
            ))}
          </div>
        </div>
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
        {loading ? (
          <div style={{ textAlign: 'center', color: '#999' }}>Loading...</div>
        ) : selectedSection ? (
          <div>
            <div style={{ marginBottom: '1rem', paddingBottom: '1rem', borderBottom: '2px solid #ed2d29' }}>
              <h2 style={{ margin: '0', color: '#82181b' }}>
                Part {selectedSection.part}.{selectedSection.chapter}: {selectedSection.title}
              </h2>
            </div>

            <div
              style={{
                fontSize: '14px',
                lineHeight: '1.7',
                color: '#333',
              }}
              dangerouslySetInnerHTML={{
                __html: selectedSection.content
                  .split('\n')
                  .map((line, idx) => {
                    if (line.startsWith('# ')) {
                      return `<h3 key=${idx} style="color: #82181b; margin: 1.5rem 0 0.5rem 0; font-size: 18px;">${line.replace('# ', '')}</h3>`;
                    }
                    if (line.startsWith('## ')) {
                      return `<h4 key=${idx} style="color: #ed2d29; margin: 1rem 0 0.5rem 0; font-size: 15px;">${line.replace('## ', '')}</h4>`;
                    }
                    if (line.startsWith('- ')) {
                      return `<li key=${idx}>${line.replace('- ', '')}</li>`;
                    }
                    if (line.trim()) {
                      return `<p key=${idx} style="margin: 0.5rem 0;">${line}</p>`;
                    }
                    return `<br key=${idx} />`;
                  })
                  .join(''),
              }}
            />

            {selectedSection.sections.length > 0 && (
              <div style={{ marginTop: '2rem', paddingTop: '1rem', borderTop: '1px solid #e0dcd5' }}>
                <h4 style={{ color: '#82181b', marginBottom: '0.5rem' }}>Sections:</h4>
                <ul style={{ margin: '0', paddingLeft: '1.5rem' }}>
                  {selectedSection.sections.map((section, idx) => (
                    <li key={idx} style={{ marginBottom: '0.25rem', fontSize: '13px' }}>
                      {section}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ) : (
          <div style={{ textAlign: 'center', color: '#999', padding: '2rem' }}>
            Select a section to view
          </div>
        )}
      </div>
    </div>
  );
}
