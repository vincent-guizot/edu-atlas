import { Table, Column, Model, DataType, PrimaryKey, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { University } from './university.model';

@Table({ schema: 'academic', tableName: 'academic_programs', timestamps: true })
export class AcademicProgram extends Model {
  @PrimaryKey
  @Column({ type: DataType.STRING })
  declare id: string;

  @ForeignKey(() => University)
  @Column({ type: DataType.STRING, allowNull: false })
  declare universityId: string;

  @BelongsTo(() => University)
  declare university: University;

  @Column({ type: DataType.STRING, allowNull: false })
  declare universityName: string;

  @Column({ type: DataType.STRING, allowNull: false })
  declare name: string;

  @Column({ type: DataType.STRING, allowNull: false })
  declare degree: string;

  @Column({ type: DataType.STRING, allowNull: false })
  declare faculty: string;

  @Column({ type: DataType.INTEGER, defaultValue: 0 })
  declare studentCount: number;

  @Column({ type: DataType.FLOAT, defaultValue: 85.0 })
  declare graduationRate: number;

  @Column({ type: DataType.FLOAT, defaultValue: 4.0 })
  declare avgStudyDuration: number;
}
