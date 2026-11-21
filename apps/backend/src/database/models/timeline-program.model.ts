import { Table, Column, Model, DataType, PrimaryKey, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { Region } from './region.model';

@Table({ schema: 'academic', tableName: 'timeline_programs', timestamps: true })
export class TimelineProgram extends Model {
  @PrimaryKey
  @Column({ type: DataType.STRING })
  declare id: string;

  @Column({ type: DataType.STRING, allowNull: false })
  declare name: string;

  @Column({ type: DataType.STRING, allowNull: false })
  declare category: string;

  @Column({ type: DataType.STRING, allowNull: false })
  declare owner: string;

  @ForeignKey(() => Region)
  @Column({ type: DataType.STRING, allowNull: true })
  declare regionId: string;

  @Column({ type: DataType.DATEONLY, allowNull: false })
  declare startDate: string;

  @Column({ type: DataType.DATEONLY, allowNull: false })
  declare endDate: string;

  @Column({ type: DataType.STRING, allowNull: false })
  declare status: string;

  @Column({ type: DataType.INTEGER, allowNull: false, defaultValue: 0 })
  declare progress: number;

  @Column({ type: DataType.BOOLEAN, allowNull: false, defaultValue: true })
  declare isDemoData: boolean;

  @BelongsTo(() => Region)
  declare region: Region;
}
