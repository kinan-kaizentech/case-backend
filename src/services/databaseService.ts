import Database from 'better-sqlite3';
import path from 'path';

export class DatabaseService {
  private static instance: DatabaseService;
  private db: Database.Database;

  private constructor() {
    // Use /tmp directory for Vercel serverless environment
    // Note: Data will be lost on each deployment and may not persist between function invocations
    const isProduction = process.env.NODE_ENV === 'production' || process.env.VERCEL;
    const dbPath = isProduction 
      ? '/tmp/database.sqlite'  // Vercel's writable temp directory
      : path.join(__dirname, '../../database.sqlite');  // Local development
    
    this.db = new Database(dbPath);
    this.initializeTables();
    console.log(`Database initialized at: ${dbPath}`);
  }

  public static getInstance(): DatabaseService {
    if (!DatabaseService.instance) {
      DatabaseService.instance = new DatabaseService();
    }
    return DatabaseService.instance;
  }

  private initializeTables(): void {
    // Create users table if it doesn't exist
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        name TEXT NOT NULL,
        birthday TEXT,
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL
      )
    `);

    // Create index on email for faster lookups
    this.db.exec(`
      CREATE INDEX IF NOT EXISTS idx_users_email ON users(email)
    `);

    console.log('Database tables initialized successfully');
  }

  public getDatabase(): Database.Database {
    return this.db;
  }

  public close(): void {
    this.db.close();
  }
}
