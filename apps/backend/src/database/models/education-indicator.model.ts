import { Table, Column, Model, DataType, PrimaryKey } from 'sequelize-typescript';

@Table({ schema: 'analytics', tableName: 'education_indicators', timestamps: true })
export class EducationIndicator extends Model {
  @PrimaryKey
  @Column({ type: DataType.STRING })
  declare id: string;

  @Column({ type: DataType.INTEGER, allowNull: false })
  declare year: number;

  @Column({ type: DataType.STRING, allowNull: false })
  declare period: string;

  @Column({ type: DataType.STRING, allowNull: false })
  declare metricName: string;

  @Column({ type: DataType.FLOAT, allowNull: false })
  declare value: number;

  @Column({ type: DataType.STRING, allowNull: false })
  declare category: string;

  @Column({ type: DataType.JSONB, allowNull: true })
  declare metadata: any;
}
