let neo = require('neo4j-driver').v1;

export default class neo4j{

    insererNoeud(data:any) {
        return new Promise(function(resolve, reject) {
            let driver = neo.driver('bolt://localhost:7687', neo.auth.basic('neo4j', 'ju'));
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
            let driver = neo.driver('bolt://localhost:7687', neo.auth.basic('neo4j', 'ju'));
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
            let driver = neo.driver('bolt://localhost:7687', neo.auth.basic('neo4j', 'ju'));
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
            let driver = neo.driver('bolt://localhost:7687', neo.auth.basic('neo4j', 'ju'));
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
}