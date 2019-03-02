
const mariadb = require('mariadb');

const pool = mariadb.createPool({
    host: '127.0.0.1',
    port: '3306',
    user:'ju', 
    password: 'ju',
    database: 'ju1',
    connectionLimit: 50
});

export default class Mariadb {

    constructor(){
    }

    async execquery( query : String) {
        let conn;
        let data;
        try {
            conn = await pool.getConnection();
            data = await conn.query(query);
        } catch (err) {
            throw err;
        }

        return data;
    }

}