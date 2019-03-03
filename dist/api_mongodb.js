"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
let mongo = require('mongodb').MongoClient;
class Mongodb {
    inserer(monDocument) {
        return new Promise(function (resolve, reject) {
            mongo.connect('mongodb://localhost:27017', { "useNewUrlParser": true }, function (err, db) {
                if (err)
                    throw err;
                let maBase = db.db('Assurance');
                maBase.collection('Contrats').insertOne(monDocument, function (err, result) {
                    if (result.result.n == 0) {
                        reject(false);
                    }
                    else {
                        resolve(true);
                    }
                });
                db.close();
            });
        });
    }
    supprimer(maSelection) {
        return new Promise(function (resolve, reject) {
            mongo.connect('mongodb://localhost:27017', { "useNewUrlParser": true }, function (err, db) {
                if (err)
                    throw err;
                let maBase = db.db('Assurance');
                maBase.collection('Contrats').removeOne(maSelection, function (err, result) {
                    if (result.result.n == 0) {
                        reject(false);
                    }
                    else {
                        resolve(true);
                    }
                });
                db.close();
            });
        });
    }
    modifier(maSelection, mesChangements) {
        return new Promise(function (resolve, reject) {
            mongo.connect('mongodb://localhost:27017', { "useNewUrlParser": true }, function (err, db) {
                if (err)
                    throw err;
                let maBase = db.db('Assurance');
                maBase.collection('Contrats').updateOne(maSelection, mesChangements, function (err, result) {
                    if (result.result.n == 0) {
                        reject(false);
                    }
                    else {
                        resolve(true);
                    }
                });
                db.close();
            });
        });
    }
    selectionner(maSelection) {
        return new Promise(function (resolve, reject) {
            mongo.connect('mongodb://localhost:27017', { "useNewUrlParser": true }, function (err, db) {
                if (err)
                    throw err;
                let maBase = db.db('Assurance');
                maBase.collection('Contrats').find(maSelection).toArray(function (err, result) {
                    if (err) {
                        reject(err);
                    }
                    else {
                        resolve(result);
                    }
                });
                db.close();
            });
        });
    }
}
exports.default = Mongodb;
