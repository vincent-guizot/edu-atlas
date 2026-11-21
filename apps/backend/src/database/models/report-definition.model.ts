import { Table, Column, Model, DataType, PrimaryKey, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { Snapshot } from './snapshot.model';

@Table({ schema: 'analytics', tableName: 'report_definitions', timestamps: true })
export class ReportDefinition extends Model {
  @PrimaryKey
  @Column({ type: DataType.STRING })
  declare id: string;

  @Column({ type: DataType.STRING, allowNull: false })
  declare name: string;

  @Column({ type: DataType.STRING, allowNull: false })
  declare category: string;

  @Column({ type: DataType.TEXT, allowNull: true })
  declare description: string;

  @Column({ type: DataType.STRING, allowNull: false })
  declare defaultFormat: string;

  @ForeignKey(() => Snapshot)
  @Column({ type: DataType.STRING, allowNull: true })
  declare snapshotId: string;

  @Column({ type: DataType.BOOLEAN, allowNull: false, defaultValue: true })
  declare isActive: boolean;

  @Column({ type: DataType.BOOLEAN, allowNull: false, defaultValue: true })
  declare isDemoData: boolean;

  @BelongsTo(() => Snapshot)
  declare snapshot: Snapshot;
}
