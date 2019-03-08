"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
let mongo = require('mongodb').MongoClient;
const base = 'projet_DBJAAP';
const host = 'obiwan2.univ-brest.fr';
class Mongodb {
    selectChapter(chapter_id) {
        return new Promise(function (resolve, reject) {
            mongo.connect('mongodb://' + host + ':27017', { "useNewUrlParser": true }, function (err, db) {
                if (err)
                    throw err;
                let maBase = db.db(base);
                maBase.collection('Chapitre').find({ id: chapter_id }, { projection: { _id: 0 } }).toArray(function (err, result) {
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
    selectAdvancement(user_id, subject_id) {
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
    insertDocument(myDocument, collection) {
        return new Promise(function (resolve, reject) {
            mongo.connect('mongodb://' + host + ':27017', { "useNewUrlParser": true }, function (err, db) {
                if (err)
                    throw err;
                let maBase = db.db(base);
                maBase.collection(collection).insertOne(myDocument, function (err, result) {
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
    deleteDocument(mySelection, collection) {
        return new Promise(function (resolve, reject) {
            mongo.connect('mongodb://' + host + ':27017', { "useNewUrlParser": true }, function (err, db) {
                if (err)
                    throw err;
                let maBase = db.db(base);
                maBase.collection(collection).removeOne(mySelection, function (err, result) {
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
    modifyDocument(mySelection, myChanges, collection) {
        return new Promise(function (resolve, reject) {
            mongo.connect('mongodb://' + host + ':27017', { "useNewUrlParser": true }, function (err, db) {
                if (err)
                    throw err;
                let maBase = db.db(base);
                maBase.collection(collection).updateOne(mySelection, myChanges, function (err, result) {
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
}
exports.default = Mongodb;
