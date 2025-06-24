import { DBConnectionDetails } from '@types';
import Config from '../config';
import DBHandler from './handler';

import Logger from '../logger';
const logger = new Logger('DatabaseHandler');

const connectionDetails: DBConnectionDetails = {
    SQLITE_PATH: Config.SQLITE_PATH,
    SQL_HOST: Config.SQL_HOST,
    SQL_PORT: Config.SQL_PORT,
    SQL_USER: Config.SQL_USER,
    SQL_DATABASE: Config.SQL_DATABASE,
    SQL_PASSWORD: Config.SQL_PASSWORD,
};

const isDatabaseConfigInvalid = Object.values(connectionDetails).every(
    value => value === null || typeof value === 'undefined'
);

let Database: DBHandler | null;

if (isDatabaseConfigInvalid) {
    logger.warn('All database connection details are null or undefined. Database handler will not be initialized.');
    Database = null;
} else {
    Database = new DBHandler(connectionDetails);
}

export default Database;
