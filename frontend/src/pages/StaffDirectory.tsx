import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

interface StaffMember {
  id: string;
  position: string;
  department: string;
  hireDate: string;
  employmentStatus: string;
  user: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    role: string;
  };
}

interface PaginationData {
  total: number;
  page: number;
  limit: number;
  pages: number;
}

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

export default function StaffDirectory() {
  const [staff, setStaff] = useState<StaffMember[]>([]);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('all');
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState<PaginationData | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchStaff = useCallback(async (pageNum: number = 1) => {
    setLoading(true);
    try {
      const token = localStorage.getItem('accessToken');
      const response = await axios.get(`${API_URL}/staff`, {
        params: {
          page: pageNum,
          limit: 20,
          search,
          status: status !== 'all' ? status : undefined,
        },
        headers: { Authorization: `Bearer ${token}` },
      });

      setStaff(response.data.data.staff);
      setPagination(response.data.data.pagination);
      setPage(pageNum);
    } catch (error) {
      console.error('Failed to fetch staff:', error);
    } finally {
      setLoading(false);
    }
  }, [search, status]);

  useEffect(() => {
    fetchStaff(1);
  }, [fetchStaff]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setStatus(e.target.value);
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h2 style={{ color: '#82181b', marginBottom: '1.5rem' }}>
        Staff Directory
      </h2>

      {/* Search and Filter */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '1rem',
          marginBottom: '2rem',
        }}
      >
        <div>
          <label
            style={{
              display: 'block',
              fontWeight: '600',
              color: '#82181b',
              marginBottom: '0.5rem',
              fontSize: '14px',
            }}
          >
            Search by name or email
          </label>
          <input
            type="text"
            value={search}
            onChange={handleSearch}
            placeholder="Type name or email..."
            style={{
              width: '100%',
              padding: '10px 12px',
              border: '1px solid #ddd',
              borderRadius: '6px',
              fontSize: '14px',
              boxSizing: 'border-box',
            }}
          />
        </div>

        <div>
          <label
            style={{
              display: 'block',
              fontWeight: '600',
              color: '#82181b',
              marginBottom: '0.5rem',
              fontSize: '14px',
            }}
          >
            Filter by status
          </label>
          <select
            value={status}
            onChange={handleStatusChange}
            style={{
              width: '100%',
              padding: '10px 12px',
              border: '1px solid #ddd',
              borderRadius: '6px',
              fontSize: '14px',
              boxSizing: 'border-box',
              fontFamily: 'inherit',
            }}
          >
            <option value="all">All Staff</option>
            <option value="active">Active</option>
            <option value="probation">Probation</option>
            <option value="on-leave">On Leave</option>
            <option value="left">Left</option>
          </select>
        </div>
      </div>

      {/* Results Table */}
      <div
        style={{
          background: 'white',
          border: '1px solid #e0dcd5',
          borderRadius: '8px',
          overflow: 'hidden',
        }}
      >
        {loading ? (
          <div style={{ padding: '2rem', textAlign: 'center', color: '#999' }}>
            Loading staff...
          </div>
        ) : staff.length === 0 ? (
          <div style={{ padding: '2rem', textAlign: 'center', color: '#999' }}>
            No staff members found
          </div>
        ) : (
          <table
            style={{
              width: '100%',
              borderCollapse: 'collapse',
              fontSize: '14px',
            }}
          >
            <thead>
              <tr style={{ background: '#f5f1eb', borderBottom: '2px solid #ed2d29' }}>
                <th style={{ padding: '12px', textAlign: 'left', color: '#82181b', fontWeight: '600' }}>
                  Name
                </th>
                <th style={{ padding: '12px', textAlign: 'left', color: '#82181b', fontWeight: '600' }}>
                  Position
                </th>
                <th style={{ padding: '12px', textAlign: 'left', color: '#82181b', fontWeight: '600' }}>
                  Department
                </th>
                <th style={{ padding: '12px', textAlign: 'left', color: '#82181b', fontWeight: '600' }}>
                  Status
                </th>
                <th style={{ padding: '12px', textAlign: 'left', color: '#82181b', fontWeight: '600' }}>
                  Start Date
                </th>
              </tr>
            </thead>
            <tbody>
              {staff.map((member) => (
                <tr
                  key={member.id}
                  style={{
                    borderBottom: '1px solid #e0dcd5',
                  }}
                  onMouseOver={(e) => (e.currentTarget.style.background = '#f5f1eb')}
                  onMouseOut={(e) => (e.currentTarget.style.background = 'white')}
                >
                  <td style={{ padding: '12px' }}>
                    <div style={{ fontWeight: '600', color: '#82181b' }}>
                      {member.user.firstName} {member.user.lastName}
                    </div>
                    <div style={{ fontSize: '12px', color: '#999', marginTop: '4px' }}>
                      {member.user.email}
                    </div>
                  </td>
                  <td style={{ padding: '12px' }}>{member.position}</td>
                  <td style={{ padding: '12px' }}>{member.department || '—'}</td>
                  <td style={{ padding: '12px' }}>
                    <span
                      style={{
                        background:
                          member.employmentStatus === 'active'
                            ? '#D4EDDA'
                            : member.employmentStatus === 'probation'
                              ? '#FFF3CD'
                              : '#E2E3E5',
                        color:
                          member.employmentStatus === 'active'
                            ? '#155724'
                            : member.employmentStatus === 'probation'
                              ? '#856404'
                              : '#383D41',
                        padding: '4px 12px',
                        borderRadius: '20px',
                        fontSize: '12px',
                        fontWeight: '500',
                      }}
                    >
                      {member.employmentStatus.charAt(0).toUpperCase() +
                        member.employmentStatus.slice(1)}
                    </span>
                  </td>
                  <td style={{ padding: '12px' }}>
                    {new Date(member.hireDate).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Pagination */}
      {pagination && pagination.pages > 1 && (
        <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginTop: '1.5rem' }}>
          {Array.from({ length: pagination.pages }, (_, i) => i + 1).map((pageNum) => (
            <button
              key={pageNum}
              onClick={() => fetchStaff(pageNum)}
              style={{
                padding: '8px 12px',
                border:
                  pageNum === page
                    ? '2px solid #82181b'
                    : '1px solid #ddd',
                background: pageNum === page ? '#82181b' : 'white',
                color: pageNum === page ? 'white' : '#82181b',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '12px',
                fontWeight: '600',
              }}
            >
              {pageNum}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
