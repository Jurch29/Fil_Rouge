import { Request, Response } from 'express'
const express = require('express')
let fs = require('fs');
let body_parser = require('body-parser');
var utf8 = require('utf8');
var path = require('path');
var _ = require('underscore');
const cors = require('cors');
import Mariadb from './api_mariadb';
import Mongodb from './api_mongodb';
import neo4j from './api_neo4j';

export default class Server {

    readonly port : number;

    constructor (port : number){
        this.port = port
    }

    start() {

        const app = express();
        let mariadinstance = new Mariadb();
        let mongodbinstance = new Mongodb();
        let neo4jinstance = new neo4j();

        app.use(body_parser.urlencoded({    //pour le parsing
            extended : true
        }));
        app.use(body_parser.json());
        app.use(express.static(path.join(__dirname, 'public'))); //pour le css
        // Add headers

        var corsOptions = {
        origin: '*',
        optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204 
        }
        app.use(cors(corsOptions));

        app.post('/auth', async function(req : any, res : any) {
            res.setHeader('Content-Type', 'text/plain');
            
            let result = "success";

            let mail = req.body.login;
            let mdp = req.body.mdp;

            let reqdb = 'SELECT COUNT(*) AS count,id,username FROM Utilisateur WHERE mail='+"'"+mail+"'"+' AND passwd='+"md5('"+mdp+"')"+';';
            
            
            let data =  await mariadinstance.execquery(reqdb).catch((err) => console.log('Error : '+err));

            let auth = data[0].count;
            if (auth === 0){
                result = 'failed';
                res.send(result);
            }else{
                res.send(data[0]);
            }
        });

        app.post('/register', async function(req : any, res : any) {
            res.setHeader('Content-Type', 'text/plain');
            
            let result = "success";

            let mail = req.body.login;
            let mdp = req.body.mdp;
            let login = req.body.prenom;

            let reqdb = 'INSERT Utilisateur VALUES(NULL,'+"'"+login+"',md5('"+mdp+"'),'"+mail+"');";
            
            console.log("requete lance : "+reqdb);
            
            let data =  await mariadinstance.execquery(reqdb).catch((err) => console.log('Error : '+err));

            res.send(result);
        });

        app.post('/subjects', function(req : any, res : any) {
            res.setHeader('Content-Type', 'application/json');
            neo4jinstance.selectionTousCoursNeo4j()
            .then(function(result:any) {
                res.send(result);
            })
            .catch(function(err:any) {
                res.send(err);
            });
        });

        app.post('/subjectStartBy', function(req : any, res : any) {
            res.setHeader('Content-Type', 'application/json');
            neo4jinstance.selectionCoursCommenceParNeo4j(req.body.subject_id)
            .then(function(result:any) {
                res.send(result);
            })
            .catch(function(err:any) {
                res.send(err);
            });
        });

        app.post('/selectAvancement', function(req : any, res : any) {
            res.setHeader('Content-Type', 'application/json');
            mongodbinstance.selectionAvancement(req.body.user_id,req.body.subject_id)
            .then(function(result:any) {
                res.send(result);
            })
            .catch(function(err:any) {
                res.send(err);
            });
        });
        
        app.post('/selectChapitre', function(req : any, res : any) {
            res.setHeader('Content-Type', 'application/json');
            if(!req.body.Commence){
                mongodbinstance.selectionChapitre(req.body.Chapitre)
                .then(function(result:any) {
                    res.send(result);
                })
                .catch(function(err:any) {
                    res.send(err);
                });
            }else{
                neo4jinstance.selectionCoursCommenceParNeo4j(req.body.Cours)
                .then(function(result:any) {
                    mongodbinstance.selectionChapitre(parseInt(result.id))
                    .then(function(result:any) {
                        res.send(result);
                    })
                    .catch(function(err:any) {
                        res.send(err);
                    });
                })
                .catch(function(err:any) {
                    res.send(err);
                });
            }
        });
        app.post('/getmenu', function(req : any, res : any) {
            res.setHeader('Content-Type', 'application/json');
            let data: any[] | never[] = [];
            neo4jinstance.selectionTousChapitresPourIDCours(req.body.Cours)
            .then(async function(result:any) {
                let index=0;
                for(;index < result.length;index++){
                    let retour = result[index]._fields[0].properties
                    await mongodbinstance.selectionChapitre(parseInt(retour.id))
                    .then(function(resultat:any) {
                        data[index]=resultat;
                    })
                    .catch(function(err:any) {
                        res.send(err);
                    });
                }
                res.send(data);
            })
            .catch(function(err:any) {
                res.send(err);
            });
        });
        /*
        app.get('/', function(req: Request, res : Response){
            res.writeHead(200, {
                'Content-Type' : 'text/html'
            });
            fs.readFile('./html/index.html', (err: Error, data: Buffer) => { 
                if (err) { 
                    throw err; 
                } 
                res.write(data);
                res.end(); 
            });
        })

        app.post('/selectionnerMongoDB', function(req:any, res:any) {
            res.setHeader('Content-Type', 'text/plain');
            console.log('Selection mongoDB');
            let resultat:any;
            new Promise(function(resolve, reject) {
                resultat = mongodbinstance.selectionner(JSON.parse(utf8.decode(JSON.stringify(req.body.maSelection))));
            });
            resultat.then(function(result:any) {
                res.send(result);
            })
            .catch(function(err:any, result:any) {
                res.send("Selection erreur : "+err);
            });
        });

        app.post('/insererMongoDB', function(req:any, res:any) {
            res.setHeader('Content-Type', 'text/plain');
            console.log('Insertion mongoDB');
            let resultat:any;
            new Promise(function(resolve, reject) {
                resultat = mongodbinstance.inserer(JSON.parse(utf8.decode(JSON.stringify(req.body.monDocument))));
            });
            resultat.then(function(result:any) {
                res.send("Insertion ok");
            })
            .catch(function(err:any, result:any) {
                res.send("insertion erreur");
            });
        });
        
        app.post('/supprimerMongoDB', function(req:any, res:any) {
            res.setHeader('Content-Type', 'text/plain');
            console.log('Suppression mongoDB');
            let resultat:any;
            new Promise(function(resolve, reject) {
                resultat = mongodbinstance.supprimer(JSON.parse(utf8.decode(JSON.stringify(req.body.maSelection))));
            });
            resultat.then(function(result:any) {
                res.send("supression ok");
            })
            .catch(function(err:any, result:any) {
                res.send("suppresion erreur");
            });
        });
        
        app.post('/modifierMongoDB', function(req:any, res:any) {
            res.setHeader('Content-Type', 'text/plain');
            console.log('Modification mongoDB');
            let resultat:any;
            new Promise(function(resolve, reject) {
                resultat = mongodbinstance.modifier(JSON.parse(utf8.decode(JSON.stringify(req.body.maSelection))), JSON.parse(utf8.decode(JSON.stringify(req.body.mesChangements))));
            });
            resultat.then(function(result:any) {
                res.send("modification ok");
            })
            .catch(function(err:any, result:any) {
                res.send("modification erreur");
            });
        });


        app.post('/insererNoeudNeo4j', function(req:any, res:any) {
            res.setHeader('Content-Type', 'text/plain');
            console.log('Insertion noeud');
            let resultat:any;
            new Promise(function(resolve, reject) {
                resultat = neo4jinstance.insererNoeud(req.body.monNoeud);
            });
            resultat.then(function(result:any) {
                res.send(result);
            })
            .catch(function(err:any, result:any) {
                res.send(err+result);
            });
        });

        app.post('/selectionnerNoeudNeo4j', function(req:any, res:any) {
            res.setHeader('Content-Type', 'text/plain');
            console.log('Selection noeud');
            let resultat:any;
            new Promise(function(resolve, reject) {
                resultat = neo4jinstance.selectionnerNoeud(req.body.maSelection);
            });
            resultat.then(function(result:any) {
                res.send(result);
            })
            .catch(function(err:any, result:any) {
                res.send(err+result);
            });
        });

        app.post('/insererRelationChapitreCoursNeo4j', function(req:any, res:any) {
            res.setHeader('Content-Type', 'text/plain');
            console.log('Insertion relation noeud');
            let resultat:any;
            new Promise(function(resolve, reject) {
                resultat = neo4jinstance.insererRelationChapitreCours(req.body.maSelection, req.body.maRelation);
            });
            resultat.then(function(result:any) {
                res.send(result);
            })
            .catch(function(err:any, result:any) {
                res.send(err+result);
            });
        });

        app.post('/selectionChapitreCoursNeo4j', function(req:any, res:any) {
            res.setHeader('Content-Type', 'text/plain');
            console.log('Selection chapitre noeud');
            let resultat:any;
            new Promise(function(resolve, reject) {
                resultat = neo4jinstance.selectionChapitreCoursNeo4j(req.body.maRelation);
            });
            resultat.then(function(result:any) {
                res.send(result);
            })
            .catch(function(err:any, result:any) {
                res.send(err+result);
            });
        });

        app.post('/actionmariadb', async function(req : any, res : any) {
            let data =  await mariadinstance.execquery(req.body.maSelection)
            console.log("requete lance : "+req.body.maSelection);
            res.send("Resultat : "+ JSON.stringify(data)); //on recoit un json on renvoie un string
        });

        */
        
        app.listen(this.port, function() {
            console.log('Serveur démarré (4000)');
        })
    }
}