import mysql, { Connection, RowDataPacket } from 'mysql2/promise';
import { readFileSync, existsSync } from 'fs';
import path from 'path';
import { DBConnectionDetails } from '@types';

import Logger from '../logger';
const logger = new Logger('MySQLHandler');

export default class MySQLHandler {
    private pool: mysql.Pool;

    constructor({ SQL_HOST, SQL_USER, SQL_PASSWORD, SQL_DATABASE, SQL_PORT }: DBConnectionDetails) {
        if (
                typeof SQL_HOST !== 'string'
            || typeof SQL_USER !== 'string'
            || typeof SQL_PASSWORD !== 'string'
            || typeof SQL_DATABASE !== 'string'
        ) {
            throw new Error(`Invalid MySQL connection details provided!`);
        }

        this.pool = mysql.createPool({
            host: SQL_HOST,
            user: SQL_USER,
            password: SQL_PASSWORD,
            database: SQL_DATABASE,
            port: SQL_PORT || 3306,
            waitForConnections: true,
            connectionLimit: 10,
            queueLimit: 0
        });
    }

    async init(): Promise<void> {
        const scriptPath = path.join(__dirname, '..', 'mysql-base.sql');
        let sqlScript: string;

        if (existsSync(scriptPath)) {
            sqlScript = readFileSync(scriptPath, 'utf8');
        } else {
            logger.warn(`MySQL/Mariadb base script not found at ${scriptPath}. Skipping database initialization.`);
            return;
        }

        let connection: Connection | undefined;
        
        try {
            connection = await this.pool.getConnection();

            const statements = sqlScript.split(';')
                .map(s => s.trim())
                .filter(s => s.length > 0);

            for (const stmt of statements) {
                if (stmt) {
                    await connection.query(stmt);
                }
            }
        } catch (error) {
            logger.error('Error initializing MySQL database:', error);
            throw error;
        } finally {
            if (connection) {
                connection.end();
            }
        }
    }

    /**
     * Executes a SQL query that does not return any result (e.g., INSERT, UPDATE, DELETE).
     *
     * @param query - The SQL query string to be executed.
     * @param params - An optional array of parameters to bind to the query placeholders.
     * Defaults to an empty array if not provided.
     *
     * @throws {Error} If the query execution fails.
     */
    async run(query: string, params: unknown[] = []): Promise<void> {
        let connection: Connection | undefined;
        try {
            connection = await this.pool.getConnection();
            await connection.execute(query, params);
        } catch (error) {
            logger.error('Error executing MySQL run query:', error);
            throw error;
        } finally {
            if (connection) {
                connection.end();
            }
        }
    }

    /**
     * Executes a SQL query to retrieve a single row from the database.
     *
     * @param query - The SQL query string to be executed.
     * @param params - An optional array of parameters to bind to the query.
     * @returns The first row of the result set as an object, or `undefined` if no rows are found.
     */
    async get<T = unknown>(query: string, params: unknown[] = []): Promise<T | undefined> {
        let connection: Connection | undefined;
        try {
            connection = await this.pool.getConnection();
            const [rows] = await connection.execute<RowDataPacket[]>(query, params);
            return (rows && rows.length > 0) ? (rows[0] as T) : undefined;
        } catch (error) {
            logger.error('Error executing MySQL get query:', error);
            throw error;
        } finally {
            if (connection) {
                connection.end();
            }
        }
    }

    /**
     * Executes a SQL query and retrieves all matching rows from the database.
     *
     * @param query - The SQL query string to execute.
     * @param params - An optional array of parameters to bind to the query. Defaults to an empty array.
     * @returns An array of objects representing the rows returned by the query.
     */
    async all<T = unknown>(query: string, params: unknown[] = []): Promise<T[]> {
        let connection: Connection | undefined;
        try {
            connection = await this.pool.getConnection();
            const [rows] = await connection.execute<RowDataPacket[]>(query, params);
            return rows as T[];
        } catch (error) {
            logger.error('Error executing MySQL all query:', error);
            throw error;
        } finally {
            if (connection) {
                connection.end();
            }
        }
    }
}
