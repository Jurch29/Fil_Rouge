let neo = require('neo4j-driver').v1;

const passwd = '';
const username = '';
const host = 'obiwan2.univ-brest.fr';

export default class neo4j{
    selectSubjects() {
        return new Promise(function(resolve, reject) {
            let driver = neo.driver('bolt://'+host+':7687', neo.auth.basic(username, passwd));
            let session = driver.session();
            session.run(
                'MATCH (cours:dbjaap_Cours) RETURN cours;'
            )
            .then(function(result:any) {
                let data = [];
                for(let i = 0; i < result.records.length; i++) {
                    data.push(result.records[i]._fields[0].properties);
                }
                resolve(data);
                driver.close();
            })
            .catch(function(error:any) {
                reject(error);
                driver.close();
            });
        });
    }
    selectSubjectStartBy (data:any) {
        return new Promise(function(resolve, reject) {
            let driver = neo.driver('bolt://'+host+':7687', neo.auth.basic(username, passwd));
            let session = driver.session();
            session.run(
                'MATCH (cours:dbjaap_Cours)-[r:COMMENCE_PAR]->(chapitre:dbjaap_Chapitre) WHERE cours.id = {subject_id} RETURN chapitre;',
                {
                    subject_id : data
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
    selectSubjectChapters(data:any) {
        return new Promise(function (resolve, reject) {
            let driver = neo.driver('bolt://'+host+':7687', neo.auth.basic(username, passwd));
            let session = driver.session();
            session.run('MATCH (cours:dbjaap_Cours), (chapitre:dbjaap_Chapitre) WHERE cours.id={subject_id} MATCH (chapitre)-[a:APPARTIENT_A]-(cours) RETURN chapitre', {
                subject_id: data
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
    selectNextChapter(data:any) {
        return new Promise(function(resolve, reject) {
            let driver = neo.driver('bolt://'+host+':7687', neo.auth.basic(username, passwd));
            let session = driver.session();
            session.run(
                'MATCH (chapitre1:dbjaap_Chapitre)-[SUIVI_PAR]->(chapitre2:dbjaap_Chapitre) WHERE chapitre1.id={chapter_id} RETURN chapitre2',
                {
                    chapter_id : JSON.stringify(data)
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
    selectPreviousChapter(data:any) {
        return new Promise(function(resolve, reject) {
            let driver = neo.driver('bolt://'+host+':7687', neo.auth.basic(username, passwd));
            let session = driver.session();
            session.run(
                'MATCH (chapitre1:dbjaap_Chapitre)-[SUIVI_PAR]->(chapitre2:dbjaap_Chapitre) WHERE chapitre2.id={chapter_id} RETURN chapitre1',
                {
                    chapter_id : JSON.stringify(data)
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