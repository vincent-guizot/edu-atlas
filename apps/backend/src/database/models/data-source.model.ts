import { Table, Column, Model, DataType, PrimaryKey } from 'sequelize-typescript';

@Table({ schema: 'system', tableName: 'data_sources', timestamps: true })
export class DataSource extends Model {
  @PrimaryKey
  @Column({ type: DataType.STRING })
  declare id: string;

  @Column({ type: DataType.STRING, allowNull: false, unique: true })
  declare name: string;

  @Column({ type: DataType.STRING, allowNull: false })
  declare provider: string;

  @Column({ type: DataType.STRING, allowNull: false })
  declare sourceType: string;

  @Column({ type: DataType.TEXT, allowNull: true })
  declare url: string;

  @Column({ type: DataType.BOOLEAN, allowNull: false, defaultValue: true })
  declare isEnabled: boolean;

  @Column({ type: DataType.BOOLEAN, allowNull: false, defaultValue: true })
  declare isDemoData: boolean;
}
