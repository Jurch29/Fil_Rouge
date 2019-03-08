"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const mariadb = require('mariadb');
const pool = mariadb.createPool({
    host: 'obiwan2.univ-brest.fr',
    port: '3306',
    user: 'zbergnean',
    password: '1j2fllc6',
    database: 'zfm1-zbergnean',
    connectionLimit: 50
});
class Mariadb {
    constructor() {
    }
    execquery(query) {
        return __awaiter(this, void 0, void 0, function* () {
            let conn;
            let data;
            try {
                conn = yield pool.getConnection();
                data = yield conn.query(query);
            }
            catch (err) {
                throw err;
            }
            return data;
        });
    }
}
exports.default = Mariadb;
