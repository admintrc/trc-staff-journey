import { Request, Response } from 'express';
import HandbookService from '../services/handbookService';

export class HandbookController {
  static async getAllSections(req: Request, res: Response) {
    try {
      const sections = HandbookService.getAllSections();
      res.status(200).json({
        success: true,
        data: { sections },
      });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  }

  static async getPartSections(req: Request, res: Response) {
    try {
      const { part } = req.params;

      if (!['A', 'B'].includes(part)) {
        return res.status(400).json({ success: false, error: 'Invalid part' });
      }

      const sections = HandbookService.getPartSections(part as 'A' | 'B');

      res.status(200).json({
        success: true,
        data: { part, sections },
      });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  }

  static async searchSections(req: Request, res: Response) {
    try {
      const { q } = req.query;

      if (!q || typeof q !== 'string') {
        return res.status(400).json({ success: false, error: 'Query required' });
      }

      const results = HandbookService.searchSections(q);

      res.status(200).json({
        success: true,
        data: {
          query: q,
          resultCount: results.length,
          results,
        },
      });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  }

  static async getSectionById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const section = HandbookService.getSectionById(id);

      if (!section) {
        return res.status(404).json({ success: false, error: 'Section not found' });
      }

      res.status(200).json({
        success: true,
        data: { section },
      });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  }
}

export default HandbookController;
