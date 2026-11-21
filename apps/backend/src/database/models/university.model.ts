import { Table, Column, Model, DataType, PrimaryKey, ForeignKey, BelongsTo, HasMany } from 'sequelize-typescript';
import { Region } from './region.model';
import { AcademicProgram } from './academic-program.model';

@Table({ schema: 'directory', tableName: 'universities', timestamps: true })
export class University extends Model {
  @PrimaryKey
  @Column({ type: DataType.STRING })
  declare id: string;

  @Column({ type: DataType.STRING, allowNull: false })
  declare name: string;

  @Column({ type: DataType.STRING, allowNull: false })
  declare code: string;

  @Column({ type: DataType.ENUM('PTN', 'PTS', 'PTKIN', 'Politeknik'), allowNull: false })
  declare type: string;

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

  @Column({ type: DataType.INTEGER, defaultValue: 1 })
  declare facultyCount: number;

  @Column({ type: DataType.INTEGER, defaultValue: 1 })
  declare programCount: number;

  @Column({ type: DataType.INTEGER, defaultValue: 0 })
  declare studentCount: number;

  @Column({ type: DataType.INTEGER, defaultValue: 0 })
  declare lecturerCount: number;

  @Column({ type: DataType.STRING, defaultValue: 'Unggul' })
  declare accreditation: string;

  @Column({ type: DataType.INTEGER, allowNull: true })
  declare nationalRank: number;

  @Column({ type: DataType.BOOLEAN, defaultValue: true })
  declare isDemoData: boolean;

  @HasMany(() => AcademicProgram)
  declare programs: AcademicProgram[];
}
