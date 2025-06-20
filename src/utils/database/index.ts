import Config from '../config';

import DBHandler from './sqlite';

const initDB = () => {
    const Database = new DBHandler({
        SQLITE_PATH: Config.SQLITE_PATH,
    });

    return Database;
};

const Database = initDB();

export default Database;