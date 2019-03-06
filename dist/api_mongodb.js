"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
let mongo = require('mongodb').MongoClient;
const base = "fil_rouge";
class Mongodb {
    selectionChapitre(Chapitre) {
        return new Promise(function (resolve, reject) {
            mongo.connect('mongodb://localhost:27017', { "useNewUrlParser": true }, function (err, db) {
                if (err)
                    throw err;
                let maBase = db.db(base);
                maBase.collection('Chapitre').find({ id: Chapitre }, { projection: { _id: 0 } }).toArray(function (err, result) {
                    if (err) {
                        reject(err);
                        db.close();
                    }
                    else {
                        console.log(result);
                        resolve(result);
                        db.close();
                    }
                });
            });
        });
    }
    selectionAvancement(subject_id, userid) {
        return new Promise(function (resolve, reject) {
            new Promise(function (resolve1, reject1) {
                mongo.connect('mongodb://localhost:27017', { "useNewUrlParser": true }, function (err, db) {
                    if (err)
                        throw err;
                    let maBase = db.db(base);
                    maBase.collection('Utilisateur').aggregate([{ $unwind: "$cours" }, { $match: { id: userid, "cours.idcours": subject_id } }]).toArray(function (err, result) {
                        if (err) {
                            reject1(err);
                        }
                        else {
                            console.log(result);
                            resolve1(result);
                            db.close();
                        }
                    });
                });
            });
            mongo.connect('mongodb://localhost:27017', { "useNewUrlParser": true }, function (err, db) {
                if (err)
                    throw err;
                let maBase = db.db(base);
                maBase.collection('Chapitre').find({ id: subject_id }, { projection: { _id: 0 } }).toArray(function (err2, result2) {
                    if (err2) {
                        reject(err2);
                    }
                    else {
                        resolve(result2);
                    }
                });
                db.close();
            });
        });
    }
    inserer(monDocument, collection) {
        return new Promise(function (resolve, reject) {
            mongo.connect('mongodb://localhost:27017', { "useNewUrlParser": true }, function (err, db) {
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
            mongo.connect('mongodb://localhost:27017', { "useNewUrlParser": true }, function (err, db) {
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
            mongo.connect('mongodb://localhost:27017', { "useNewUrlParser": true }, function (err, db) {
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
            mongo.connect('mongodb://localhost:27017', { "useNewUrlParser": true }, function (err, db) {
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
