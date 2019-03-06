"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
let neo = require('neo4j-driver').v1;
const passwd = "ubo";
const username = "neo4j";
class neo4j {
    insererNoeud(data) {
        return new Promise(function (resolve, reject) {
            let driver = neo.driver('bolt://localhost:7687', neo.auth.basic(username, passwd));
            let session = driver.session();
            session.run('CREATE (n:Cours {data}) RETURN n.id', { data: data })
                .then(function (result) {
                resolve(result.records[0]);
                driver.close();
            })
                .catch(function (error) {
                reject(error);
                driver.close();
            });
        });
    }
    selectionnerNoeud(data) {
        return new Promise(function (resolve, reject) {
            let driver = neo.driver('bolt://localhost:7687', neo.auth.basic(username, passwd));
            let session = driver.session();
            session.run('MATCH (n:Cours) WHERE n.name = {name} RETURN n', { name: data.name })
                .then(function (result) {
                resolve(result.records);
                driver.close();
            })
                .catch(function (error) {
                reject(error);
                driver.close();
            });
        });
    }
    insererRelationChapitreCours(maSelection, maRelation) {
        return new Promise(function (resolve, reject) {
            let driver = neo.driver('bolt://localhost:7687', neo.auth.basic(username, passwd));
            let session = driver.session();
            session.run('MATCH (n1), (n2) WHERE n1.id = {id1} AND n2.id = {id2} CREATE (n1)-[r:RELATION{relation}]->(n2) RETURN n1, n2, r', {
                id1: maSelection.id1,
                id2: maSelection.id2,
                relation: maRelation
            })
                .then(function (result) {
                resolve(result.records);
                driver.close();
            })
                .catch(function (error) {
                reject(error);
                driver.close();
            });
        });
    }
    selectionChapitreCoursNeo4j(data) {
        return new Promise(function (resolve, reject) {
            let driver = neo.driver('bolt://localhost:7687', neo.auth.basic(username, passwd));
            let session = driver.session();
            session.run('MATCH (n1)-[r:RELATION]->(n2) WHERE r.name = {relationName} AND n2.name = {coursName} RETURN n1;', {
                coursName: data.coursName,
                relationName: data.relationName
            })
                .then(function (result) {
                resolve(result.records);
                driver.close();
            })
                .catch(function (error) {
                reject(error);
                driver.close();
            });
        });
    }
    selectionTousCoursNeo4j() {
        return new Promise(function (resolve, reject) {
            let driver = neo.driver('bolt://localhost:7687', neo.auth.basic(username, passwd));
            let session = driver.session();
            session.run('MATCH (cours:Cours) RETURN cours;')
                .then(function (result) {
                let donnees = [];
                for (let i = 0; i < result.records.length; i++) {
                    donnees.push(result.records[i]._fields[0].properties);
                }
                resolve(donnees);
                driver.close();
            })
                .catch(function (error) {
                reject(error);
                driver.close();
            });
        });
    }
    selectionCoursCommenceParNeo4j(data) {
        return new Promise(function (resolve, reject) {
            let driver = neo.driver('bolt://localhost:7687', neo.auth.basic(username, passwd));
            let session = driver.session();
            session.run('MATCH (cours:Cours)-[r:COMMENCE_PAR]->(chapitre:Chapitre) WHERE cours.id = {cours_id} RETURN chapitre;', {
                cours_id: data
            })
                .then(function (result) {
                if (result.records[0] == null) {
                    resolve({});
                }
                else {
                    resolve(result.records[0]._fields[0].properties);
                }
                driver.close();
            })
                .catch(function (error) {
                reject(error);
                driver.close();
            });
        });
    }
}
exports.default = neo4j;
