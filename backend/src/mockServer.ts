import express from 'express';
import cors from 'cors';
import jwt from 'jsonwebtoken';

const app = express();
app.use(cors());
app.use(express.json());

const JWT_SECRET = 'test-secret-key';

// Mock data
const mockUsers = {
  'director@trc.com': {
    id: '1',
    email: 'director@trc.com',
    firstName: 'Sarah',
    lastName: 'Johnson',
    role: 'director',
    password: 'Password123!',
  },
  'manager@trc.com': {
    id: '2',
    email: 'manager@trc.com',
    firstName: 'Alex',
    lastName: 'Smith',
    role: 'manager',
    password: 'Password123!',
  },
  'staff@trc.com': {
    id: '3',
    email: 'staff@trc.com',
    firstName: 'Jamie',
    lastName: 'Lee',
    role: 'staff',
    password: 'Password123!',
  },
};

const mockStaff = [
  { id: '1', userId: '1', firstName: 'Sarah', lastName: 'Johnson', email: 'sarah@trc.com', position: 'Director', hireDate: '2015-01-15', status: 'active' },
  { id: '2', userId: '2', firstName: 'Alex', lastName: 'Smith', email: 'alex@trc.com', position: 'Manager', hireDate: '2018-03-20', status: 'active' },
  { id: '3', userId: '3', firstName: 'Jamie', lastName: 'Lee', email: 'jamie@trc.com', position: 'Therapist', hireDate: '2020-06-10', status: 'active' },
];

const mockForms = [
  { id: 'C1', type: 'C1', title: 'C1: Pre-Recruitment Checklist', description: 'Pre-recruitment requirements', accessLevel: 'manager' },
  { id: 'C2', type: 'C2', title: 'C2: Selection Process', description: 'Candidate screening', accessLevel: 'manager' },
  { id: 'C3', type: 'C3', title: 'C3: Offer Letter', description: 'Job offer documentation', accessLevel: 'manager' },
  { id: 'C4', type: 'C4', title: 'C4: Induction Checklist', description: 'New hire onboarding', accessLevel: 'staff' },
  { id: 'C5', type: 'C5', title: 'C5: Probation Review', description: 'Probation period review', accessLevel: 'manager' },
  { id: 'C6', type: 'C6', title: 'C6: Performance Review', description: 'Annual performance review', accessLevel: 'manager' },
  { id: 'C7', type: 'C7', title: 'C7: Training Record', description: 'Training completion tracking', accessLevel: 'staff' },
  { id: 'C8', type: 'C8', title: 'C8: Exit Interview', description: 'Exit interview form', accessLevel: 'manager' },
];

const mockHandbook = {
  partA: {
    title: 'Part A: Introduction & Policies',
    sections: [
      { title: 'Welcome', content: 'Welcome to The Rehab Centre. This handbook outlines our policies and procedures.' },
      { title: 'Company Overview', content: 'Founded in 1995, we provide comprehensive rehabilitation services.' },
      { title: 'Code of Conduct', content: 'All staff must adhere to our professional code of conduct.' },
    ],
  },
  partB: {
    title: 'Part B: Procedures & Benefits',
    sections: [
      { title: 'Leave Policy', content: 'Annual leave: 4 weeks. Sick leave: 5 days per year.' },
      { title: 'Professional Development', content: 'We support ongoing training and professional development.' },
      { title: 'Health & Safety', content: 'All staff complete mandatory health and safety training.' },
    ],
  },
};

// Auth endpoints
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  const user = mockUsers[email];

  if (!user || user.password !== password) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, JWT_SECRET);
  res.json({
    data: {
      user: { id: user.id, email: user.email, firstName: user.firstName, lastName: user.lastName, role: user.role },
      accessToken: token,
      refreshToken: token,
    },
  });
});

app.post('/api/auth/refresh', (req, res) => {
  const token = jwt.sign({ id: '1', email: 'test@trc.com', role: 'staff' }, JWT_SECRET);
  res.json({ data: { accessToken: token } });
});

app.get('/api/auth/current-user', (req, res) => {
  const auth = req.headers.authorization;
  if (!auth) return res.status(401).json({ error: 'Unauthorized' });

  try {
    const decoded = jwt.verify(auth.split(' ')[1], JWT_SECRET);
    const user = Object.values(mockUsers).find(u => u.id === decoded.id);
    res.json({ data: user });
  } catch {
    res.status(401).json({ error: 'Invalid token' });
  }
});

// Staff endpoints
app.get('/api/staff', (req, res) => {
  res.json({ data: { staff: mockStaff, total: mockStaff.length } });
});

app.get('/api/staff/:id', (req, res) => {
  const staff = mockStaff.find(s => s.id === req.params.id);
  if (!staff) return res.status(404).json({ error: 'Not found' });
  res.json({ data: staff });
});

// Forms endpoints
app.get('/api/forms', (req, res) => {
  res.json({ data: { forms: mockForms } });
});

app.post('/api/forms/submit', (req, res) => {
  const { formType, data } = req.body;
  res.json({
    data: {
      id: Math.random().toString(36).substr(2, 9),
      formType,
      data,
      submittedAt: new Date().toISOString(),
      status: 'submitted',
    }
  });
});

// Handbook endpoints
app.get('/api/handbook/partA', (req, res) => {
  res.json({ data: mockHandbook.partA });
});

app.get('/api/handbook/partB', (req, res) => {
  res.json({ data: mockHandbook.partB });
});

app.get('/api/handbook/search', (req, res) => {
  const query = req.query.q || '';
  const results = mockHandbook.partA.sections.filter(s =>
    s.title.toLowerCase().includes(query.toLowerCase()) ||
    s.content.toLowerCase().includes(query.toLowerCase())
  );
  res.json({ data: { results } });
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Mock API server running' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✓ Mock API Server running on http://localhost:${PORT}`);
  console.log('Demo Credentials:');
  console.log('  Director: director@trc.com / Password123!');
  console.log('  Manager: manager@trc.com / Password123!');
  console.log('  Staff: staff@trc.com / Password123!');
});
