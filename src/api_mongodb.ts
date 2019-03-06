import { json } from "body-parser";

let mongo = require('mongodb').MongoClient;
const base ="fil_rouge";
export default class Mongodb {
    selectionChapitre(Chapitre: any): any {
        return new Promise(function(resolve, reject) { 
            mongo.connect('mongodb://localhost:27017', { "useNewUrlParser" : true }, function(err:any, db:any) {
                if(err) throw err;
                let maBase = db.db(base);
                maBase.collection('Chapitre').find({id:Chapitre},{projection : {_id:0}}).toArray(function(err:any, result:any) {
                    if(err) {
                        reject(err);
                        db.close();
                    } else { 
                        console.log(result);
                        resolve(result);
                        db.close();
                    }
                });
            })
        });
    }

    selectionAvancement(subject_id: any, userid: any): any {
        return new Promise(function(resolve, reject) {
            new Promise(function(resolve1, reject1) {
                
                mongo.connect('mongodb://localhost:27017', { "useNewUrlParser" : true }, function(err:any, db:any) {
                    if(err) throw err;
                    let maBase = db.db(base);
                    maBase.collection('Utilisateur').aggregate([{$unwind:"$cours"},{$match:{id:userid,"cours.idcours":subject_id}}]).toArray(function(err:any, result:any) {
                        if(err) {
                            reject1(err);
                        } else { 
                            console.log(result);
                            resolve1(result);
                            db.close();
                        }
                    });
                })
            });
            mongo.connect('mongodb://localhost:27017', { "useNewUrlParser" : true }, function(err:any, db:any) {
                if(err) throw err;
                let maBase = db.db(base);
                maBase.collection('Chapitre').find({id:subject_id},{projection : {_id:0}}).toArray(function(err2:any, result2:any) {
                    if(err2) {
                        reject(err2);
                    } else { 
                        resolve(result2);
                    }
                });   
                db.close();
            })
        });
    }

    inserer(monDocument: any,collection:any) {
        return new Promise(function(resolve, reject) {
            mongo.connect('mongodb://localhost:27017', { "useNewUrlParser" : true }, function(err: any, db: any) {
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
            mongo.connect('mongodb://localhost:27017', { "useNewUrlParser" : true }, function(err: any, db: any) {
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
            mongo.connect('mongodb://localhost:27017', { "useNewUrlParser" : true }, function(err: any, db: any) {
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
            mongo.connect('mongodb://localhost:27017', { "useNewUrlParser" : true }, function(err:any, db:any) {
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