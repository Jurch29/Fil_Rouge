let mongo = require('mongodb').MongoClient;

export default class Mongodb {

    inserer(monDocument: any) {
        return new Promise(function(resolve, reject) {
            mongo.connect('mongodb://localhost:27017', { "useNewUrlParser" : true }, function(err: any, db: any) {
            if(err) throw err;
            let maBase = db.db('Assurance');
            maBase.collection('Contrats').insertOne(monDocument, function(err: any, result: any) {
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

    supprimer(maSelection: any) {
        return new Promise(function(resolve, reject) {
            mongo.connect('mongodb://localhost:27017', { "useNewUrlParser" : true }, function(err: any, db: any) {
                if(err) throw err;
                let maBase = db.db('Assurance');
                maBase.collection('Contrats').removeOne(maSelection, function(err: any, result: any) {
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

    modifier(maSelection :any, mesChangements: any) {
        return new Promise(function(resolve, reject) {
            mongo.connect('mongodb://localhost:27017', { "useNewUrlParser" : true }, function(err: any, db: any) {
                if(err) throw err;
                let maBase = db.db('Assurance');
                maBase.collection('Contrats').updateOne(maSelection, mesChangements, function(err :any, result:any) {
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

    selectionner(maSelection:any) {
        return new Promise(function(resolve, reject) {
            mongo.connect('mongodb://localhost:27017', { "useNewUrlParser" : true }, function(err:any, db:any) {
                if(err) throw err;
                let maBase = db.db('Assurance');
                maBase.collection('Contrats').find(maSelection).toArray(function(err:any, result:any) {
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