import { Request, Response } from 'express';
import { Op } from 'sequelize';
import User from '../models/User';
import Staff from '../models/Staff';

export class StaffController {
  static async getAllStaff(req: any, res: Response) {
    try {
      const { page = 1, limit = 20, search = '', status = '' } = req.query;
      const offset = (parseInt(page) - 1) * parseInt(limit);

      const where: any = {};
      if (status && status !== 'all') {
        where.employmentStatus = status;
      }

      const userWhere: any = {};
      if (search) {
        userWhere[Op.or] = [
          { firstName: { [Op.iLike]: `%${search}%` } },
          { lastName: { [Op.iLike]: `%${search}%` } },
          { email: { [Op.iLike]: `%${search}%` } },
        ];
      }

      const { count, rows } = await Staff.findAndCountAll({
        where,
        include: [
          {
            model: User,
            where: userWhere,
            attributes: ['id', 'firstName', 'lastName', 'email', 'role'],
          },
        ],
        limit: parseInt(limit),
        offset,
        order: [['hireDate', 'DESC']],
      });

      res.status(200).json({
        success: true,
        data: {
          staff: rows,
          pagination: {
            total: count,
            page: parseInt(page),
            limit: parseInt(limit),
            pages: Math.ceil(count / parseInt(limit)),
          },
        },
      });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  }

  static async getStaffById(req: any, res: Response) {
    try {
      const { id } = req.params;

      const staff = await Staff.findByPk(id, {
        include: [
          {
            model: User,
            attributes: ['id', 'firstName', 'lastName', 'email', 'role', 'status'],
          },
        ],
      });

      if (!staff) {
        return res.status(404).json({ success: false, error: 'Staff not found' });
      }

      res.status(200).json({
        success: true,
        data: { staff },
      });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  }

  static async createStaff(req: any, res: Response) {
    try {
      const {
        userId,
        position,
        department,
        hireDate,
        probationEndDate,
        employmentType,
        managerId,
      } = req.body;

      const staff = await Staff.create(
        {
          userId,
          position,
          department,
          hireDate,
          probationEndDate,
          employmentType,
          managerId,
          employmentStatus: 'active',
        } as any
      );

      res.status(201).json({
        success: true,
        data: { staff },
      });
    } catch (error: any) {
      res.status(400).json({ success: false, error: error.message });
    }
  }

  static async getDashboardStats(req: any, res: Response) {
    try {
      const totalStaff = await Staff.count({
        where: { employmentStatus: 'active' },
      });

      const probationStaff = await Staff.count({
        where: { employmentStatus: 'probation' },
      });

      const departmentBreakdown = await Staff.findAll({
        attributes: ['department', [sequelize.fn('COUNT', sequelize.col('id')), 'count']],
        where: { employmentStatus: 'active' },
        group: ['department'],
        raw: true,
      });

      res.status(200).json({
        success: true,
        data: {
          totalStaff,
          probationStaff,
          departmentBreakdown,
        },
      });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  }
}

import sequelize from '../config/database';

export default StaffController;
