
const mariadb = require('mariadb');

const pool = mariadb.createPool({
    host: 'obiwan2.univ-brest.fr',
    port: '3306',
    user:'zbergnean', 
    password: '1j2fllc6',
    database: 'zfm1-zbergnean',
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