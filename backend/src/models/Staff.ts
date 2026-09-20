import { DataTypes, Model, ForeignKey } from 'sequelize';
import sequelize from '../config/database';
import User from './User';

export interface StaffAttributes {
  id: string;
  userId: ForeignKey<User['id']>;
  position: string;
  department?: string;
  managerId?: ForeignKey<Staff['id']>;
  hireDate: Date;
  probationEndDate?: Date;
  employmentType: 'full-time' | 'part-time' | 'casual' | 'contract';
  employmentStatus: 'active' | 'on-leave' | 'probation' | 'left';
  createdAt?: Date;
  updatedAt?: Date;
}

export class Staff extends Model<StaffAttributes> implements StaffAttributes {
  public id!: string;
  public userId!: ForeignKey<User['id']>;
  public position!: string;
  public department?: string;
  public managerId?: ForeignKey<Staff['id']>;
  public hireDate!: Date;
  public probationEndDate?: Date;
  public employmentType!: 'full-time' | 'part-time' | 'casual' | 'contract';
  public employmentStatus!: 'active' | 'on-leave' | 'probation' | 'left';
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Staff.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      unique: true,
      references: { model: 'users', key: 'id' },
    },
    position: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    department: {
      type: DataTypes.STRING(100),
    },
    managerId: {
      type: DataTypes.UUID,
      references: { model: 'staff', key: 'id' },
    },
    hireDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    probationEndDate: {
      type: DataTypes.DATE,
    },
    employmentType: {
      type: DataTypes.ENUM('full-time', 'part-time', 'casual', 'contract'),
      allowNull: false,
    },
    employmentStatus: {
      type: DataTypes.ENUM('active', 'on-leave', 'probation', 'left'),
      allowNull: false,
      defaultValue: 'active',
    },
  },
  {
    sequelize,
    tableName: 'staff',
    timestamps: true,
  }
);

export default Staff;
