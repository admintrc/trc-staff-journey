import { Request, Response } from 'express';
import FormService from '../services/formService';

export class FormsController {
  static async getAvailableForms(req: any, res: Response) {
    try {
      const forms = FormService.getFormsByAccessLevel(req.user.role);

      res.status(200).json({
        success: true,
        data: {
          forms: forms.map((f) => ({
            id: f.id,
            type: f.type,
            title: f.title,
            description: f.description,
            accessLevel: f.accessLevel,
          })),
        },
      });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  }

  static async getFormDefinition(req: Request, res: Response) {
    try {
      const { formType } = req.params;
      const form = FormService.getFormDefinition(formType);

      if (!form) {
        return res.status(404).json({ success: false, error: 'Form not found' });
      }

      res.status(200).json({
        success: true,
        data: { form },
      });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  }

  static async getAllForms(req: Request, res: Response) {
    try {
      const forms = FormService.getAllForms();

      res.status(200).json({
        success: true,
        data: { forms },
      });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  }

  static async submitForm(req: any, res: Response) {
    try {
      const { formType, data } = req.body;

      if (!formType || !data) {
        return res.status(400).json({ success: false, error: 'Form type and data required' });
      }

      const formDef = FormService.getFormDefinition(formType);
      if (!formDef) {
        return res.status(404).json({ success: false, error: 'Form type not found' });
      }

      // Validate required fields
      const missingFields = formDef.fields
        .filter((f) => f.required && !data[f.name])
        .map((f) => f.name);

      if (missingFields.length > 0) {
        return res.status(400).json({
          success: false,
          error: `Missing required fields: ${missingFields.join(', ')}`,
        });
      }

      // In production, save to database
      // For now, just acknowledge receipt
      const submittedForm = {
        id: `form_${Date.now()}`,
        type: formType,
        submittedBy: req.user.id,
        submittedAt: new Date(),
        data,
        status: 'submitted',
      };

      res.status(201).json({
        success: true,
        data: { form: submittedForm },
        message: 'Form submitted successfully',
      });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  }
}

export default FormsController;
