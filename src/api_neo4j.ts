let neo = require('neo4j-driver').v1;
const passwd ="ju";
const username ="neo4j"
export default class neo4j{

    insererNoeud(data:any) {
        return new Promise(function(resolve, reject) {
            let driver = neo.driver('bolt://localhost:7687', neo.auth.basic(username, passwd));
            let session = driver.session();
            session.run(
                'CREATE (n:Cours {data}) RETURN n.id',
                {data : data}
            )
            .then(function(result:any) {
                resolve(result.records[0]);
                driver.close();
            })
            .catch(function(error:any) {
                reject(error);
                driver.close();
            });
        });
    }

    selectionnerNoeud(data:any) {
        return new Promise(function(resolve, reject) {
            let driver = neo.driver('bolt://localhost:7687', neo.auth.basic(username, passwd));
            let session = driver.session();
            session.run(
                'MATCH (n:Cours) WHERE n.name = {name} RETURN n',
                {name : data.name}
            )
            .then(function(result:any) {
                resolve(result.records);
                driver.close();
            })
            .catch(function(error:any) {
                reject(error);
                driver.close();
            });
        });
    }

    insererRelationChapitreCours(maSelection:any, maRelation:any) {
        return new Promise(function(resolve, reject) {
            let driver = neo.driver('bolt://localhost:7687', neo.auth.basic(username, passwd));
            let session = driver.session();
            session.run(
                'MATCH (n1), (n2) WHERE n1.id = {id1} AND n2.id = {id2} CREATE (n1)-[r:RELATION{relation}]->(n2) RETURN n1, n2, r',
                {
                    id1 : maSelection.id1,
                    id2 : maSelection.id2,
                    relation : maRelation
                }
            )
            .then(function(result:any) {
                resolve(result.records);
                driver.close();
            })
            .catch(function(error:any) {
                reject(error);
                driver.close();
            });
        });
    }
    selectionChapitreCoursNeo4j(data:any) {
        return new Promise(function(resolve, reject) {
            let driver = neo.driver('bolt://localhost:7687', neo.auth.basic(username, passwd));
            let session = driver.session();
            session.run(
                'MATCH (n1)-[r:RELATION]->(n2) WHERE r.name = {relationName} AND n2.name = {coursName} RETURN n1;',
                {
                    coursName : data.coursName,
                    relationName : data.relationName
                }
            )
            .then(function(result:any) {
                resolve(result.records);
                driver.close();
            })
            .catch(function(error:any) {
                reject(error);
                driver.close();
            });
        });
    }
    selectionTousCoursNeo4j() {
        return new Promise(function(resolve, reject) {
            let driver = neo.driver('bolt://localhost:7687', neo.auth.basic(username, passwd));
            let session = driver.session();
            session.run(
                'MATCH (cours:Cours) RETURN cours;'
            )
            .then(function(result:any) {
                let donnees = [];
                for(let i = 0; i < result.records.length; i++) {
                    donnees.push(result.records[i]._fields[0].properties);
                }
                resolve(donnees);
                driver.close();
            })
            .catch(function(error:any) {
                reject(error);
                driver.close();
            });
        });
    }
    selectionCoursCommenceParNeo4j (data:any) {
        return new Promise(function(resolve, reject) {
            let driver = neo.driver('bolt://localhost:7687', neo.auth.basic(username, passwd));
            let session = driver.session();
            session.run(
                'MATCH (cours:Cours)-[r:COMMENCE_PAR]->(chapitre:Chapitre) WHERE cours.id = {cours_id} RETURN chapitre;',
                {
                    cours_id : data
                }
            )
            .then(function(result:any) {
                if(result.records[0] == null) {
                    resolve({});
                } else {
                    resolve(result.records[0]._fields[0].properties);
                }
                driver.close();
            })
            .catch(function(error:any) {
                reject(error);
                driver.close();
            });
        });
    }
    selectionIdChapitreNeo4j(data:any) {
        return new Promise(function(resolve, reject) {
            let driver = neo.driver('bolt://localhost:7687', neo.auth.basic(username, passwd));
            let session = driver.session();
            session.run(
                'MATCH (cours:Cours)-[r:COMMENCE_PAR]->(chapitre:Chapitre) WHERE cours.id = {cours_id} RETURN chapitre;',
                {
                    cours_id : data
                }
            )
            .then(function(result:any) {
                if(result.records[0] == null) {
                    resolve({});
                } else {
                    resolve(result.records[0]._fields[0].properties);
                }
                driver.close();
            })
            .catch(function(error:any) {
                reject(error);
                driver.close();
            });
        });
    }
    selectionIdCoursNeo4j(data:any) {
        return new Promise(function(resolve, reject) {
            let driver = neo.driver('bolt://localhost:7687', neo.auth.basic(username, passwd));
            let session = driver.session();
            session.run(
                'MATCH (cours:Cours), (chapitre:Chapitre) WHERE chapitre.id={chapitre_id} MATCH (chapitre)-[a:APPARTIENT_A]-(cours) RETURN cours.id',
                {
                    chapitre_id : data
                }
            )
            .then(function(result:any) {
                if(result.records[0] == null) {
                    resolve({});
                } else {
                    resolve(result.records[0]._fields[0].properties);
                }
                driver.close();
            })
            .catch(function(error:any) {
                reject(error);
                driver.close();
            });
        });
    }
    selectionTousChapitresPourIDCours(data:any) {
        return new Promise(function (resolve, reject) {
            let driver = neo.driver('bolt://localhost:7687', neo.auth.basic(username, passwd));
            let session = driver.session();
            session.run('MATCH (cours:Cours), (chapitre:Chapitre) WHERE cours.id={cours_id} MATCH (chapitre)-[a:APPARTIENT_A]-(cours) RETURN chapitre', {
                cours_id: data
            })
                .then(function (result:any) {
                if (result.records[0] == null) {
                    resolve({});
                }
                else {
                    resolve(result.records);
                }
                driver.close();
            })
                .catch(function (error:any) {
                reject(error);
                driver.close();
            });
        });
    }
    selectionChapitreSuivantNeo4j(data:any) {
        return new Promise(function(resolve, reject) {
            let driver = neo.driver('bolt://localhost:7687', neo.auth.basic(username, passwd));
            let session = driver.session();
            session.run(
                'MATCH (chapitre1:Chapitre),(chapitre:Chapitre) Where chapitre.id={chapitre_id} MATCH (chapitre1)-[a:SUIVI_PAR]-(chapitre) RETURN chapitre',
                {
                    chapitre_id : data
                }
            )
            .then(function(result:any) {
                if(result.records[0] == null) {
                    resolve({});
                } else {
                    resolve(result.records[0]._fields[0].properties);
                }
                driver.close();
            })
            .catch(function(error:any) {
                reject(error);
                driver.close();
            });
        });
    }
}