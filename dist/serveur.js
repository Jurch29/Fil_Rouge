"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
}
Object.defineProperty(exports, "__esModule", { value: true });
const express = require('express');
let fs = require('fs');
let body_parser = require('body-parser');
var utf8 = require('utf8');
var path = require('path');
var _ = require('underscore');
const cors = require('cors');
const api_mariadb_1 = __importDefault(require("./api_mariadb"));
const api_mongodb_1 = __importDefault(require("./api_mongodb"));
const api_neo4j_1 = __importDefault(require("./api_neo4j"));
class Server {
    constructor(port) {
        this.port = port;
    }
    start() {
        const app = express();
        var username = null;
        let mariadinstance = new api_mariadb_1.default();
        let mongodbinstance = new api_mongodb_1.default();
        let neo4jinstance = new api_neo4j_1.default();
        app.use(body_parser.urlencoded({
            extended: true
        }));
        app.use(body_parser.json());
        app.use(express.static(path.join(__dirname, 'public'))); //pour le css
        // Add headers
        var corsOptions = {
            origin: '*',
            optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204 
        };
        app.use(cors(corsOptions));
        app.post('/auth', function (req, res) {
            return __awaiter(this, void 0, void 0, function* () {
                res.setHeader('Content-Type', 'text/plain');
                let result = "success";
                let mail = req.body.login;
                let mdp = req.body.mdp;
                let reqdb = 'SELECT COUNT(*) AS count,username FROM Utilisateur WHERE mail=' + "'" + mail + "'" + ' AND passwd=' + "md5('" + mdp + "')" + ';';
                console.log("requete lance : " + reqdb);
                let data = yield mariadinstance.execquery(reqdb).catch((err) => console.log('Error : ' + err));
                let auth = data[0].count;
                if (auth === 0) {
                    result = 'failed';
                    res.send(result);
                }
                else {
                    username = mail;
                    res.send(data[0].username);
                }
            });
        });
        app.post('/register', function (req, res) {
            return __awaiter(this, void 0, void 0, function* () {
                res.setHeader('Content-Type', 'text/plain');
                let result = "success";
                let mail = req.body.login;
                let mdp = req.body.mdp;
                let login = req.body.prenom;
                let reqdb = 'INSERT Utilisateur VALUES(NULL,' + "'" + login + "',md5('" + mdp + "'),'" + mail + "');";
                console.log("requete lance : " + reqdb);
                let data = yield mariadinstance.execquery(reqdb).catch((err) => console.log('Error : ' + err));
                res.send(result);
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
        app.listen(this.port, function () {
            console.log('Serveur démarré (4000)');
        });
    }
}
exports.default = Server;
