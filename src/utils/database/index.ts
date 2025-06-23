import Config from '../config';
import DBHandler from './handler';

const Database = new DBHandler({
    SQLITE_PATH: Config.SQLITE_PATH,
});

export default Database;
