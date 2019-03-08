import { json } from 'body-parser';

let mongo = require('mongodb').MongoClient;
const base ='projet_DBJAAP';
const host='obiwan2.univ-brest.fr';

export default class Mongodb {
    selectChapter(chapter_id:any) {
        return new Promise(function(resolve, reject) { 
            mongo.connect('mongodb://'+host+':27017', { "useNewUrlParser" : true }, function(err:any, db:any) {
                if(err) throw err;
                let maBase = db.db(base);
                maBase.collection('Chapitre').find({id:chapter_id},{projection : {_id:0}}).toArray(function(err:any, result:any) {
                    if(err) {
                        reject(err);
                        db.close();
                    } else {
                        resolve(result);
                        db.close();
                    }
                });
            })
        });
    }

    selectAdvancement(user_id:any, subject_id:any) {
        return new Promise(function(resolve, reject) {
            mongo.connect('mongodb://'+host+':27017', { "useNewUrlParser" : true }, function(err:any, db:any) {
                if(err) throw err;
                let maBase = db.db(base);
                maBase.collection('Utilisateur').aggregate([{$unwind:"$cours"},{$match:{id:user_id,"cours.idcours":parseInt(subject_id)}}]).toArray(function(err:any, result:any) {
                    if(err) {
                        reject(err);
                    } else {
                        reject(result);
                    }
                });
            });
        });
    }

    insertDocument(myDocument:any, collection:any) {
        return new Promise(function(resolve, reject) {
            mongo.connect('mongodb://'+host+':27017', { "useNewUrlParser" : true }, function(err:any, db:any) {
            if(err) throw err;
            let maBase = db.db(base);
            maBase.collection(collection).insertOne(myDocument, function(err:any, result:any) {
                if(result.result.n == 0) {
                    reject(false);
                } else {
                    resolve(true);
                }
            });
            db.close();
        });
    });
    }

    deleteDocument(mySelection:any, collection:any) {
        return new Promise(function(resolve, reject) {
            mongo.connect('mongodb://'+host+':27017', { "useNewUrlParser" : true }, function(err:any, db:any) {
                if(err) throw err;
                let maBase = db.db(base);
                maBase.collection(collection).removeOne(mySelection, function(err:any, result:any) {
                    if(result.result.n == 0) {
                        reject(false);
                    } else {
                        resolve(true);
                    }
                });
                db.close();
            });
        });
    }

    modifyDocument(mySelection:any, myChanges:any, collection:any) {
        return new Promise(function(resolve, reject) {
            mongo.connect('mongodb://'+host+':27017', { "useNewUrlParser" : true }, function(err:any, db:any) {
                if(err) throw err;
                let maBase = db.db(base);
                maBase.collection(collection).updateOne(mySelection, myChanges, function(err:any, result:any) {
                    if(result.result.n == 0) {
                        reject(false);
                    } else {
                        resolve(true);
                    }
                });
                db.close();
            });
        });
    }
}