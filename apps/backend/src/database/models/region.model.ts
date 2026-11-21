import { Table, Column, Model, DataType, PrimaryKey } from 'sequelize-typescript';

@Table({ schema: 'directory', tableName: 'regions', timestamps: true })
export class Region extends Model {
  @PrimaryKey
  @Column({ type: DataType.STRING })
  declare id: string;

  @Column({ type: DataType.STRING, allowNull: false })
  declare name: string;

  @Column({ type: DataType.STRING, allowNull: false })
  declare island: string;

  @Column({ type: DataType.STRING, allowNull: false })
  declare capital: string;

  @Column({ type: DataType.FLOAT, allowNull: false })
  declare latitude: number;

  @Column({ type: DataType.FLOAT, allowNull: false })
  declare longitude: number;

  @Column({ type: DataType.INTEGER, defaultValue: 0 })
  declare totalSchools: number;

  @Column({ type: DataType.INTEGER, defaultValue: 0 })
  declare totalStudents: number;

  @Column({ type: DataType.INTEGER, defaultValue: 0 })
  declare totalTeachers: number;

  @Column({ type: DataType.INTEGER, defaultValue: 0 })
  declare totalUniversities: number;

  @Column({ type: DataType.FLOAT, defaultValue: 75.0 })
  declare avgPerformanceScore: number;

  @Column({ type: DataType.INTEGER, defaultValue: 0 })
  declare accreditationA: number;

  @Column({ type: DataType.INTEGER, defaultValue: 0 })
  declare accreditationB: number;

  @Column({ type: DataType.INTEGER, defaultValue: 0 })
  declare accreditationC: number;
}
