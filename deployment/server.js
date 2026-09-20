const express = require('express');
const app = express();
const port = process.env.PORT || 8080;

app.use(express.json());

app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

app.get('/api/auth/login', (req, res) => {
  res.json({ message: 'Login endpoint' });
});

app.get('/', (req, res) => {
  res.json({ app: 'TRC Staff Journey', status: 'running' });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
