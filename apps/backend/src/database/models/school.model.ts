import { Table, Column, Model, DataType, PrimaryKey, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { Region } from './region.model';

@Table({ schema: 'directory', tableName: 'schools', timestamps: true })
export class School extends Model {
  @PrimaryKey
  @Column({ type: DataType.STRING })
  declare id: string;

  @Column({ type: DataType.STRING, allowNull: false })
  declare name: string;

  @Column({ type: DataType.STRING, allowNull: false, unique: true })
  declare npsn: string;

  @Column({ type: DataType.ENUM('SD', 'SMP', 'SMA', 'SMK'), allowNull: false })
  declare educationLevel: string;

  @Column({ type: DataType.ENUM('Negeri', 'Swasta'), allowNull: false })
  declare ownership: string;

  @ForeignKey(() => Region)
  @Column({ type: DataType.STRING, allowNull: false })
  declare regionId: string;

  @BelongsTo(() => Region)
  declare region: Region;

  @Column({ type: DataType.STRING, allowNull: false })
  declare regionName: string;

  @Column({ type: DataType.STRING, allowNull: false })
  declare city: string;

  @Column({ type: DataType.FLOAT, allowNull: false })
  declare latitude: number;

  @Column({ type: DataType.FLOAT, allowNull: false })
  declare longitude: number;

  @Column({ type: DataType.INTEGER, defaultValue: 0 })
  declare studentCount: number;

  @Column({ type: DataType.INTEGER, defaultValue: 0 })
  declare teacherCount: number;

  @Column({ type: DataType.STRING, defaultValue: 'B' })
  declare accreditation: string;

  @Column({ type: DataType.FLOAT, defaultValue: 80.0 })
  declare facilitiesScore: number;

  @Column({ type: DataType.BOOLEAN, defaultValue: true })
  declare isDemoData: boolean;
}
