import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import { initializeDatabase } from './config/database';
// import { errorHandler } from './middleware/errorHandler';
// import authRoutes from './routes/auth';
// import azureADRoutes from './auth/azureAD';
// import staffRoutes from './routes/staff';
// import formsRoutes from './routes/forms';
// import reportsRoutes from './routes/reports';
// import handbookRoutes from './routes/handbook';
// import User from './models/User';
// import Staff from './models/Staff';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(helmet());
app.use(morgan('combined'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// app.use('/api/auth', authRoutes);
// app.use('/api/auth', azureADRoutes);
// app.use('/api/staff', staffRoutes);
// app.use('/api/forms', formsRoutes);
// app.use('/api/reports', reportsRoutes);
// app.use('/api/handbook', handbookRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// app.use(errorHandler);

const startServer = async () => {
  try {
    console.log('Starting server...');

    // Try to init database but don't crash if it fails
    try {
      await initializeDatabase();
      console.log('✓ Database connected');
    } catch (dbError: any) {
      console.warn('⚠ Database connection warning:', dbError?.message || dbError);
      console.warn('Continuing without database for now...');
    }

    app.listen(PORT, () => {
      console.log(`✓ Server running on port ${PORT}`);
      console.log(`✓ Environment: ${process.env.NODE_ENV || 'development'}`);
    });
  } catch (error: any) {
    console.error('✗ Failed to start server:', error?.message || error);
    console.error('Full error:', error);
    process.exit(1);
  }
};

startServer();
