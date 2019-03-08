import { json } from "body-parser";

let mongo = require('mongodb').MongoClient;
const base ="projet_DBJAAP";
const host="obiwan2.univ-brest.fr"
export default class Mongodb {
    selectionChapitre(chapitre: any): any {
        return new Promise(function(resolve, reject) { 
            mongo.connect('mongodb://'+host+':27017', { "useNewUrlParser" : true }, function(err:any, db:any) {
                if(err) throw err;
                let maBase = db.db(base);
                maBase.collection('Chapitre').find({id:chapitre},{projection : {_id:0}}).toArray(function(err:any, result:any) {
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

    selectionAvancement(user_id: any, subject_id: any): any {
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

    inserer(monDocument: any,collection:any) {
        return new Promise(function(resolve, reject) {
            mongo.connect('mongodb://'+host+':27017', { "useNewUrlParser" : true }, function(err: any, db: any) {
            if(err) throw err;
            let maBase = db.db(base);
            maBase.collection(collection).insertOne(monDocument, function(err: any, result: any) {
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

    supprimer(maSelection: any,collection:any) {
        return new Promise(function(resolve, reject) {
            mongo.connect('mongodb://'+host+':27017', { "useNewUrlParser" : true }, function(err: any, db: any) {
                if(err) throw err;
                let maBase = db.db(base);
                maBase.collection(collection).removeOne(maSelection, function(err: any, result: any) {
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

    modifier(maSelection :any, mesChangements: any,collection:any) {
        return new Promise(function(resolve, reject) {
            mongo.connect('mongodb://'+host+':27017', { "useNewUrlParser" : true }, function(err: any, db: any) {
                if(err) throw err;
                let maBase = db.db(base);
                maBase.collection(collection).updateOne(maSelection, mesChangements, function(err :any, result:any) {
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

    selectionner(maSelection:any,collection:any) {
        return new Promise(function(resolve, reject) {
            mongo.connect('mongodb://'+host+':27017', { "useNewUrlParser" : true }, function(err:any, db:any) {
                if(err) throw err;
                let maBase = db.db(base);
                maBase.collection(collection).find(maSelection).toArray(function(err:any, result:any) {
                    if(err) {
                        reject(err);
                    } else {
                        resolve(result);
                    }
                });
                db.close();
            });
        });
    }
}