import { Table, Column, Model, DataType, PrimaryKey } from 'sequelize-typescript';

@Table({ schema: 'analytics', tableName: 'snapshots', timestamps: true })
export class Snapshot extends Model {
  @PrimaryKey
  @Column({ type: DataType.STRING })
  declare id: string;

  @Column({ type: DataType.DATE, allowNull: false })
  declare snapshotDate: Date;

  @Column({ type: DataType.STRING, allowNull: false })
  declare period: string;

  @Column({ type: DataType.STRING, defaultValue: 'EduAtlas Demo Dataset' })
  declare source: string;

  @Column({ type: DataType.STRING, defaultValue: '1.0.0' })
  declare version: string;

  @Column({ type: DataType.BOOLEAN, defaultValue: true })
  declare isDemoData: boolean;

  @Column({ type: DataType.INTEGER, allowNull: false, defaultValue: 0 })
  declare totalSchools: number;

  @Column({ type: DataType.INTEGER, allowNull: false, defaultValue: 0 })
  declare totalStudents: number;

  @Column({ type: DataType.INTEGER, allowNull: false, defaultValue: 0 })
  declare totalTeachers: number;

  @Column({ type: DataType.INTEGER, allowNull: false, defaultValue: 0 })
  declare totalUniversities: number;

  @Column({ type: DataType.TEXT, allowNull: true })
  declare notes: string;
}
