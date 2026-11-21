import { Table, Column, Model, DataType, PrimaryKey, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { University } from './university.model';

@Table({ schema: 'directory', tableName: 'institution_links', timestamps: true })
export class InstitutionLink extends Model {
  @PrimaryKey
  @Column({ type: DataType.STRING })
  declare id: string;

  @ForeignKey(() => University)
  @Column({ type: DataType.STRING, allowNull: false })
  declare universityId: string;

  @Column({ type: DataType.STRING, allowNull: false })
  declare partnerName: string;

  @Column({ type: DataType.STRING, allowNull: false })
  declare partnerType: string;

  @Column({ type: DataType.STRING, allowNull: false })
  declare status: string;

  @Column({ type: DataType.DATEONLY, allowNull: false })
  declare startDate: string;

  @Column({ type: DataType.DATEONLY, allowNull: true })
  declare endDate: string;

  @Column({ type: DataType.INTEGER, allowNull: false, defaultValue: 0 })
  declare projectCount: number;

  @Column({ type: DataType.BOOLEAN, allowNull: false, defaultValue: true })
  declare isDemoData: boolean;

  @BelongsTo(() => University)
  declare university: University;
}
