import Database from 'better-sqlite3';
import { readFileSync } from 'fs';
import path from 'path';

export default class SQLiteHandler {
    private db: Database.Database;

    constructor(dbPath: string) {
        if (typeof dbPath !== 'string') {
            throw new Error(`DB Path for SQLite database is invalid !`);
        }

        this.db = new Database(dbPath);
    }

    init(): void {
        const sqlScript = readFileSync(path.join(__dirname, 'base.sql'), 'utf8');
        const initSql = this.db.prepare(sqlScript);
        initSql.run();
    }

    run(query: string, params: any[] = []): void {
        const stmt = this.db.prepare(query);
        stmt.run(...params);
    }

    get(query: string, params: any[] = []): unknown {
        const stmt = this.db.prepare(query);
        return stmt.get(...params);
    }

    all(query: string, params: any[] = []): unknown[] {
        const stmt = this.db.prepare(query);
        return stmt.all(...params);
    }

    close(): void {
        this.db.close();
    }
}
