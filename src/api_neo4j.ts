let neo = require('neo4j-driver').v1;
const passwd ="";
const username =""
const host="obiwan2.univ-brest.fr"
export default class neo4j{
    selectionTousCoursNeo4j() {
        return new Promise(function(resolve, reject) {
            let driver = neo.driver('bolt://'+host+':7687', neo.auth.basic(username, passwd));
            let session = driver.session();
            session.run(
                'MATCH (cours:dbjaap_Cours) RETURN cours;'
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
            let driver = neo.driver('bolt://'+host+':7687', neo.auth.basic(username, passwd));
            let session = driver.session();
            session.run(
                'MATCH (cours:dbjaap_Cours)-[r:COMMENCE_PAR]->(chapitre:dbjaap_Chapitre) WHERE cours.id = {cours_id} RETURN chapitre;',
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
            let driver = neo.driver('bolt://'+host+':7687', neo.auth.basic(username, passwd));
            let session = driver.session();
            session.run(
                'MATCH (cours:dbjaap_Cours)-[r:COMMENCE_PAR]->(chapitre:dbjaap_Chapitre) WHERE cours.id = {cours_id} RETURN chapitre;',
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
            let driver = neo.driver('bolt://'+host+':7687', neo.auth.basic(username, passwd));
            let session = driver.session();
            session.run(
                'MATCH (cours:dbjaap_Cours), (chapitre:dbjaap_Chapitre) WHERE chapitre.id={chapitre_id} MATCH (chapitre)-[a:APPARTIENT_A]-(cours) RETURN cours.id',
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
            let driver = neo.driver('bolt://'+host+':7687', neo.auth.basic(username, passwd));
            let session = driver.session();
            session.run('MATCH (cours:dbjaap_Cours), (chapitre:dbjaap_Chapitre) WHERE cours.id={cours_id} MATCH (chapitre)-[a:APPARTIENT_A]-(cours) RETURN chapitre', {
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
            let driver = neo.driver('bolt://'+host+':7687', neo.auth.basic(username, passwd));
            let session = driver.session();
            session.run(
                'MATCH (chapitre1:dbjaap_Chapitre)-[SUIVI_PAR]->(chapitre2:dbjaap_Chapitre) WHERE chapitre1.id={chapitre_id} RETURN chapitre2',
                {
                    chapitre_id : JSON.stringify(data)
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
    selectionChapitrePrecedantNeo4j(data:any) {
        return new Promise(function(resolve, reject) {
            let driver = neo.driver('bolt://'+host+':7687', neo.auth.basic(username, passwd));
            let session = driver.session();
            session.run(
                'MATCH (chapitre1:dbjaap_Chapitre)-[SUIVI_PAR]->(chapitre2:dbjaap_Chapitre) WHERE chapitre2.id={chapitre_id} RETURN chapitre1',
                {
                    chapitre_id : JSON.stringify(data)
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