import { Table, Column, Model, DataType, PrimaryKey, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { DataSource } from './data-source.model';

@Table({ schema: 'system', tableName: 'data_imports', timestamps: true })
export class DataImport extends Model {
  @PrimaryKey
  @Column({ type: DataType.STRING })
  declare id: string;

  @ForeignKey(() => DataSource)
  @Column({ type: DataType.STRING, allowNull: false })
  declare sourceId: string;

  @Column({ type: DataType.STRING, allowNull: false })
  declare status: string;

  @Column({ type: DataType.DATE, allowNull: false })
  declare startedAt: Date;

  @Column({ type: DataType.DATE, allowNull: true })
  declare finishedAt: Date;

  @Column({ type: DataType.INTEGER, allowNull: false, defaultValue: 0 })
  declare rowsRead: number;

  @Column({ type: DataType.INTEGER, allowNull: false, defaultValue: 0 })
  declare rowsAccepted: number;

  @Column({ type: DataType.INTEGER, allowNull: false, defaultValue: 0 })
  declare rowsRejected: number;

  @Column({ type: DataType.TEXT, allowNull: true })
  declare errorMessage: string;

  @Column({ type: DataType.BOOLEAN, allowNull: false, defaultValue: true })
  declare isDemoData: boolean;

  @BelongsTo(() => DataSource)
  declare source: DataSource;
}
