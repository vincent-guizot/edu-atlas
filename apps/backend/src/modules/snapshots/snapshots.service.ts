import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Snapshot } from '../../database/models/snapshot.model';

@Injectable()
export class SnapshotsService {
  constructor(
    @InjectModel(Snapshot) private snapshotModel: typeof Snapshot,
  ) {}

  async findAll() {
    return this.snapshotModel.findAll({ order: [['snapshotDate', 'DESC']] });
  }

  async getLatest() {
    const latest = await this.snapshotModel.findOne({
      order: [['snapshotDate', 'DESC']],
    });
    if (!latest) {
      throw new NotFoundException('No snapshots available');
    }
    return latest;
  }

  async findById(id: string) {
    const snapshot = await this.snapshotModel.findByPk(id);
    if (!snapshot) {
      throw new NotFoundException(`Snapshot with ID ${id} not found`);
    }
    return snapshot;
  }
}
