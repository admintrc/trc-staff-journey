import express from 'express';
import { authenticate } from '../middleware/auth';
import FormsController from '../controllers/formsController';

const router = express.Router();

router.get('/', authenticate, FormsController.getAvailableForms);
router.get('/definition/:formType', authenticate, FormsController.getFormDefinition);
router.get('/all', authenticate, FormsController.getAllForms);
router.post('/submit', authenticate, FormsController.submitForm);

export default router;
