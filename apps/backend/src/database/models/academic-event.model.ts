import { Table, Column, Model, DataType, PrimaryKey } from 'sequelize-typescript';

@Table({ schema: 'academic', tableName: 'academic_events', timestamps: true })
export class AcademicEvent extends Model {
  @PrimaryKey
  @Column({ type: DataType.STRING })
  declare id: string;

  @Column({ type: DataType.STRING, allowNull: false })
  declare title: string;

  @Column({ type: DataType.TEXT, allowNull: true })
  declare description: string;

  @Column({ type: DataType.STRING, allowNull: false })
  declare startDate: string;

  @Column({ type: DataType.STRING, allowNull: false })
  declare endDate: string;

  @Column({ type: DataType.ENUM('Akademik', 'Ujian', 'Libur', 'Pendaftaran', 'Milestone'), allowNull: false })
  declare category: string;

  @Column({ type: DataType.ENUM('Upcoming', 'Ongoing', 'Completed'), defaultValue: 'Upcoming' })
  declare status: string;

  @Column({ type: DataType.STRING, defaultValue: 'Semua' })
  declare targetAudience: string;

  @Column({ type: DataType.STRING, allowNull: true })
  declare color: string;
}
