import { Client } from 'pg';
import { dbHost, dbPort, dbUser, dbPassword, targetDbName } from './db-config';

export async function createDatabase() {
  console.log(`[Database Setup] Connecting to PostgreSQL at ${dbHost}:${dbPort} as "${dbUser}"...`);

  const client = new Client({
    host: dbHost,
    port: dbPort,
    user: dbUser,
    password: dbPassword,
    database: 'postgres',
  });

  try {
    await client.connect();
    console.log(`[Database Setup] Successfully connected to PostgreSQL maintenance server.`);

    const checkRes = await client.query(
      'SELECT 1 FROM pg_database WHERE datname = $1',
      [targetDbName]
    );

    if (checkRes.rowCount && checkRes.rowCount > 0) {
      console.log(`[Database Setup] Database "${targetDbName}" already exists.`);
    } else {
      const safeDbName = targetDbName.replace(/[^a-zA-Z0-9_]/g, '');
      console.log(`[Database Setup] Database "${safeDbName}" not found. Creating database...`);
      await client.query(`CREATE DATABASE "${safeDbName}"`);
      console.log(`[Database Setup] Database "${safeDbName}" created successfully!`);
    }
  } catch (error: any) {
    console.error(`[Database Setup] Error creating database: ${error.message}`);
    throw error;
  } finally {
    await client.end();
  }
}

if (require.main === module) {
  createDatabase()
    .then(() => {
      console.log('[Database Setup] Completed createDatabase script.');
      process.exit(0);
    })
    .catch((err) => {
      console.error('[Database Setup] createDatabase failed:', err.message);
      process.exit(1);
    });
}
