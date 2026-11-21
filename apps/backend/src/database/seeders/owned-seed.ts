import { Sequelize } from 'sequelize-typescript';
import { CreationAttributes, Model, Op, QueryTypes } from 'sequelize';
import { isDeepStrictEqual } from 'util';
type Manifest = { model: string; records: Record<string, any>[] }[];

export type SeedDatasets = [string, CreationAttributes<Model>[]][];

export async function seedOwnedData(
  sequelize: Sequelize, seedName: string, datasets: () => SeedDatasets, undo = false,
) {
  return sequelize.transaction(async transaction => {
    // Share the migration lock so schema changes cannot race seed writes.
    await sequelize.query('SELECT pg_advisory_xact_lock(20261121, 1)', { transaction });
    const runs = await sequelize.query<{ manifest: Manifest }>(
      'SELECT manifest FROM system.seed_runs WHERE name = $1 FOR UPDATE',
      { bind: [seedName], type: QueryTypes.SELECT, transaction },
    );
    if (undo) {
      if (!runs.length) return;
      const manifest = runs[0].manifest;
      // A university delete cascades programs. Reject unowned children first.
      const universityIds = (manifest.find(group => group.model === 'University')?.records ?? []).map(row => row.id);
      const programIds = new Set((manifest.find(group => group.model === 'AcademicProgram')?.records ?? []).map(row => row.id));
      await sequelize.model('University').findAll({
        where: { id: { [Op.in]: universityIds } }, transaction, lock: transaction.LOCK.UPDATE,
      });
      const programs = await sequelize.model('AcademicProgram').findAll({
        where: { universityId: { [Op.in]: universityIds } }, transaction, lock: transaction.LOCK.UPDATE,
      });
      if (programs.some(row => !programIds.has(row.get('id')))) {
        throw new Error('Seed undo would delete a program not owned by this seed.');
      }
      for (const group of [...manifest].reverse()) {
        const model = sequelize.model(group.model);
        const records = new Map(group.records.map(row => [row.id, row]));
        const current = await model.findAll({
          where: { id: { [Op.in]: [...records.keys()] } },
          transaction, lock: transaction.LOCK.UPDATE,
        });
        for (const row of current) {
          const actual = JSON.parse(JSON.stringify(row.toJSON()));
          if (!isDeepStrictEqual(actual, records.get(actual.id))) {
            throw new Error(`Seed undo refused: ${group.model} ${actual.id} has been edited.`);
          }
        }
        await model.destroy({ where: { id: { [Op.in]: [...records.keys()] } }, transaction });
      }
      await sequelize.query('DELETE FROM system.seed_runs WHERE name = $1', {
        bind: [seedName], transaction,
      });
      return;
    }
    // Completed versions are skipped with one lookup; partial runs roll back atomically.
    if (runs.length) return;
    const manifest: Manifest = [];
    for (const [name, rows] of datasets()) {
      const model = sequelize.model(name);
      const timestamp = new Date();
      const instances = rows.map(row => model.build({ ...row, createdAt: timestamp, updatedAt: timestamp }));
      await Promise.all(instances.map(row => row.validate()));
      // QueryInterface exposes the actual RETURNING rows. bulkCreate can also
      // return input instances skipped by ON CONFLICT, which must not be owned.
      const insertOptions = { transaction, ignoreDuplicates: true, returning: true };
      const inserted = await sequelize.getQueryInterface().bulkInsert(
        model.getTableName(), instances.map(row => row.get({ plain: true })),
        insertOptions, model.getAttributes(),
      ) as unknown as Record<string, any>[];
      manifest.push({ model: name, records: inserted });
    }
    await sequelize.query('INSERT INTO system.seed_runs (name, manifest) VALUES ($1, $2::jsonb)', {
      bind: [seedName, JSON.stringify(manifest)], transaction,
    });
  });
}
