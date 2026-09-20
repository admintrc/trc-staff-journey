import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

const sequelize = new Sequelize({
  dialect: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  database: process.env.DB_NAME || 'trc_staff_journey',
  username: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  logging: process.env.NODE_ENV === 'development' ? console.log : false,
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
});

export const initializeDatabase = async () => {
  try {
    await sequelize.authenticate();
    console.log('Database connection established');
    await sequelize.sync({ alter: process.env.NODE_ENV === 'development' });
    console.log('Database models synced');
  } catch (error) {
    console.error('Database connection failed:', error);
    throw error;
  }
};

export default sequelize;
