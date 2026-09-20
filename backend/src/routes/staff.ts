import express from 'express';
import { authenticate, authorize } from '../middleware/auth';
import StaffController from '../controllers/staffController';

const router = express.Router();

router.get('/', authenticate, StaffController.getAllStaff);
router.get('/stats', authenticate, StaffController.getDashboardStats);
router.get('/:id', authenticate, StaffController.getStaffById);
router.post('/', authenticate, authorize(['director', 'manager']), StaffController.createStaff);

export default router;
