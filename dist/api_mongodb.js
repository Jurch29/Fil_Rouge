"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
let mongo = require('mongodb').MongoClient;
const base = "projet_DBJAAP";
const host = "obiwan2.univ-brest.fr";
class Mongodb {
    selectionChapitre(chapitre) {
        return new Promise(function (resolve, reject) {
            mongo.connect('mongodb://' + host + ':27017', { "useNewUrlParser": true }, function (err, db) {
                if (err)
                    throw err;
                let maBase = db.db(base);
                maBase.collection('Chapitre').find({ id: chapitre }, { projection: { _id: 0 } }).toArray(function (err, result) {
                    if (err) {
                        reject(err);
                        db.close();
                    }
                    else {
                        resolve(result);
                        db.close();
                    }
                });
            });
        });
    }
    selectionAvancement(user_id, subject_id) {
        return new Promise(function (resolve, reject) {
            mongo.connect('mongodb://' + host + ':27017', { "useNewUrlParser": true }, function (err, db) {
                if (err)
                    throw err;
                let maBase = db.db(base);
                maBase.collection('Utilisateur').aggregate([{ $unwind: "$cours" }, { $match: { id: user_id, "cours.idcours": parseInt(subject_id) } }]).toArray(function (err, result) {
                    if (err) {
                        reject(err);
                    }
                    else {
                        reject(result);
                    }
                });
            });
        });
    }
    inserer(monDocument, collection) {
        return new Promise(function (resolve, reject) {
            mongo.connect('mongodb://' + host + ':27017', { "useNewUrlParser": true }, function (err, db) {
                if (err)
                    throw err;
                let maBase = db.db(base);
                maBase.collection(collection).insertOne(monDocument, function (err, result) {
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
    supprimer(maSelection, collection) {
        return new Promise(function (resolve, reject) {
            mongo.connect('mongodb://' + host + ':27017', { "useNewUrlParser": true }, function (err, db) {
                if (err)
                    throw err;
                let maBase = db.db(base);
                maBase.collection(collection).removeOne(maSelection, function (err, result) {
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
    modifier(maSelection, mesChangements, collection) {
        return new Promise(function (resolve, reject) {
            mongo.connect('mongodb://' + host + ':27017', { "useNewUrlParser": true }, function (err, db) {
                if (err)
                    throw err;
                let maBase = db.db(base);
                maBase.collection(collection).updateOne(maSelection, mesChangements, function (err, result) {
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
    selectionner(maSelection, collection) {
        return new Promise(function (resolve, reject) {
            mongo.connect('mongodb://' + host + ':27017', { "useNewUrlParser": true }, function (err, db) {
                if (err)
                    throw err;
                let maBase = db.db(base);
                maBase.collection(collection).find(maSelection).toArray(function (err, result) {
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
