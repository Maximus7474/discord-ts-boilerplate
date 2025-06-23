import Config from '../config';
import DBHandler from './sqlite';

const Database = new DBHandler({
    SQLITE_PATH: Config.SQLITE_PATH,
});

export default Database;
