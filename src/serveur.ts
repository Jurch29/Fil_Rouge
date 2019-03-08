import { Request, Response } from 'express';
const express = require('express');
let fs = require('fs');
let body_parser = require('body-parser');
var utf8 = require('utf8');
var path = require('path');
var _ = require('underscore');
const cors = require('cors');
import mariadb from './api_mariadb';
import mongodb from './api_mongodb';
import neo4j from './api_neo4j';

export default class Server {

    readonly port : number;

    constructor (port : number){
        this.port = port
    }

    start() {

        const app = express();
        let mariadb_instance = new mariadb();
        let mongodb_instance = new mongodb();
        let neo4j_instance = new neo4j();

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
            let passwd = req.body.passwd;
            let request = 'SELECT COUNT(*) AS count, id, username FROM Utilisateur WHERE mail='+"'"+mail+"'"+' AND passwd='+"md5('"+passwd+"')"+';';
        
            let data =  await mariadb_instance.execquery(request).catch((err) => console.log('Error : '+err));
            
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
            let passwd = req.body.passwd;
            let login = req.body.firstname;

            let request_1 = 'INSERT Utilisateur VALUES(NULL, '+"'"+login+"', md5('"+passwd+"'), '"+mail+"');";
            
            console.log("request : "+request_1);
            
            let data_1 =  await mariadb_instance.execquery(request_1).catch((err) => console.log('Error : '+err));
           
            let request_2 = 'SELECT COUNT(*) AS count, id, username FROM Utilisateur WHERE mail='+"'"+mail+"'"+' AND passwd='+"md5('"+passwd+"')"+';';
            let data_2 =  await mariadb_instance.execquery(request_2).catch((err) => console.log('Error : '+err));
            console.log(data_2[0]);
            
            let document = {
                id:data_2[0].id,
                cours:[]
            };
            mongodb_instance.insertDocument(document, 'Utilisateur')
            .then(function(result:any) {
            })
            .catch(function(err:any) {
                res.send(err);
            });
            res.send(result);
        });

        app.post('/advancement', function(req : any, res : any) {
            res.setHeader('Content-Type', 'application/json');
            let selection = {
                utilisateur_id : parseInt(req.body.user_id),
                "cours.idcours" : parseInt(req.body.subject_id)
            };
            let changes = {
                $set : {
                    "cours.$.idChapitre" : parseInt(req.body.chapter_id)
                }
            };
            console.log(changes);

            mongodb_instance.modifyDocument(selection, changes, 'Utilisateur').
            then(function(result:any) {
                res.send(result);
            })
            .catch(function(err:any) {    
                let selection = {
                    utilisateur_id : parseInt(req.body.user_id)
                };
                let changes = {
                    $push : {
                        cours : {
                            cours_id : parseInt(req.body.subject_id),
                            chapitre_id : parseInt(req.body.chapter_id)
                        }
                    }
                };
                mongodb_instance.modifyDocument(selection, changes, 'Utilisateur')
                .then(function(result:any) {
                    res.send(result);
                }).catch(function(err:any) {
                    res.send(err);
                });
            }); 
        });
        app.post('/subjects', function(req : any, res : any) {
            res.setHeader('Content-Type', 'application/json');
            neo4j_instance.selectSubjects()
            .then(function(result:any) {
                res.send(result);
            })
            .catch(function(err:any) {
                res.send(err);
            });
        });

        app.post('/subjectStartBy', function(req : any, res : any) {
            res.setHeader('Content-Type', 'application/json');
            neo4j_instance.selectSubjectStartBy(req.body.subject_id)
            .then(function(result:any) {
                res.send(result);
            })
            .catch(function(err:any) {
                res.send(err);
            });
        });

        app.post('/selectAdvancement', function(req : any, res : any) {
            res.setHeader('Content-Type', 'application/json');
            mongodb_instance.selectAdvancement(req.body.user_id, req.body.subject_id)
            .then(function(result:any) {
                res.send(result);
            })
            .catch(function(err:any) {
                res.send(err);
            });
        });
        
        app.post('/selectChapter', function(req : any, res : any) {
            res.setHeader('Content-Type', 'application/json');
            if(!req.body.start){
                mongodb_instance.selectChapter(req.body.chapter_id)
                .then(function(result:any) {
                    res.send(result);
                })
                .catch(function(err:any) {
                    res.send(err);
                });
            }else{
                neo4j_instance.selectSubjectStartBy(req.body.subject_id)
                .then(function(result:any) {
                    mongodb_instance.selectChapter(parseInt(result.id))
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

        app.post('/getSubjectChaptersList', function(req : any, res : any) {
            res.setHeader('Content-Type', 'application/json');
            let data: any[] | never[] = [];
            neo4j_instance.selectSubjectChapters(req.body.subject_id)
            .then(async function(result_1:any) {
                console.log(result_1);
                let index=0;
                for(;index < result_1.length;index++){
                    let result_2 = result_1[index]._fields[0].properties
                    await mongodb_instance.selectChapter(parseInt(result_2.id))
                    .then(function(result_3:any) {
                        console.log(result_3);
                        data[index]=result_3;
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

        app.post('/getPreviousChapter', function(req : any, res : any) {
            res.setHeader('Content-Type', 'application/json');
            neo4j_instance.selectPreviousChapter(req.body.chapter_id)
            .then(async function(result_1:any) {
                if(result_1.id != null) {
                    await mongodb_instance.selectChapter(parseInt(result_1.id))
                    .then(function(result_2:any) {
                        res.send(result_2);
                    })
                    .catch(function(err:any) {
                        res.send(err);
                    });
                } else {
                    res.send(null);
                }
            })
            .catch(function(err:any) {
                res.send(err);
            });
        });

        app.post('/getNextChapter', function(req : any, res : any) {
            res.setHeader('Content-Type', 'application/json');
            neo4j_instance.selectNextChapter(req.body.chapter_id)
            .then(async function(result_1:any) {
                if(result_1.id != null) {
                    await mongodb_instance.selectChapter(parseInt(result_1.id))
                    .then(function(result_2:any) {
                        res.send(result_2);
                    })
                    .catch(function(err:any) {
                        res.send(err);
                    });
                } else {
                    res.send(null);
                }
            })
            .catch(function(err:any) {
                res.send(err);
            });
        });
        
        app.listen(this.port, function() {
            console.log('Serveur démarré (4000)');
        })
    }
}