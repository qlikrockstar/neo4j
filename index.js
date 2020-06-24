const http = require('http');
const express = require('express');
const restapi = express(); // init express
const neo4j = require('neo4j-driver'); // Require Neo4j

//###############################################################################################################
//#                                          config                                                             #
//###############################################################################################################

const expressServerPort = 1337;
const neo4jServer = 'neo4j://localhost:7687'; // Neo4j Server
const username = 'gerrit'; // Neo4j UserName
const password = 'gerrit'; // Neo4j Password



//#############################################################################################################
//#  read data with a hard wired cypher with response transformation into "CSV" that is simpler for Qlik      #        
//#############################################################################################################
restapi.get('/database/:db', function(req, res){
    // get the database out of URL
    const db = req.params.id;
 
    // Define fixed Cypher query    
    const cypher = 'Match (n)-[r]->(m) Return ID(n),n,ID(r),r,ID(m),m';
    console.log('cypher:');
    console.log(cypher);

    // Create Driver
    const driver = new neo4j.driver(neo4jServer, neo4j.auth.basic(username, password));

    // Create Driver session
    const session = driver.session({
        database: db 
    })

    // Run Cypher query
    session.run(cypher)
    .then(result => {
        var noOfResults = result.records.length; 
        var outputString = '';     

        // transform JSON to CSV-like structure divided with | -> has to match fixed cypher above
        for (i = 0; i < noOfResults; i++) {                 
            outputString =  outputString + JSON.stringify(result.records[i]._fields[1].identity.low)  + '|' + result.records[i]._fields[1].properties.name  + '|' + JSON.stringify(result.records[i]._fields[3].identity.low) + '|' + result.records[i]._fields[3].type + '|' + JSON.stringify(result.records[i]._fields[5].identity.low) + '|' + result.records[i]._fields[5].properties.title + '\n';
        };      
        res.send(outputString);        
    })
    .catch(e => {
        // Output the error
        console.log('error: ' + e);
        res.send(e);
    })
    .then(() => {
        // Close the Session
        return session.close();
    })
    .then(() => {
        // Close the Driver
        return driver.close();
    }); 
}); // restapi.get //database


//###########################################################################
//#  run a generic cypher, send out JSON                                    #
//###########################################################################
restapi.get('/generic/:db', function(req, res){
    // get the database out of URL
    const db = req.params.id;

    console.log('cypher:');
    console.log(req.query.cypher);
 
    // Define Cypher query
    const cypher =  req.query.cypher;
    
    // Create Driver
    const driver = new neo4j.driver(neo4jServer, neo4j.auth.basic(username, password));

    // Create Driver session
    const session = driver.session({
        database: db 
    })

    // Run Cypher query
    session.run(cypher)
    .then(result => {
        res.send(result);
    })
    .catch(e => {
        // Output the error
        console.log('error: ' + e);
        res.send(e);
    })
    .then(() => {
        // Close the Session
        return session.close();
    })
    .then(() => {
        // Close the Driver
        return driver.close();
    }); 
}); // restapi.get //generic




//###########################################################################
//#                  Start NodeJS-Server                                    #
//###########################################################################

// start webservice  
var httpServer = http.createServer(restapi);
httpServer.listen(expressServerPort);


console.log('-----------------------NodeJS-Service started----------------------------');
console.log("Submit GET to http://localhost:1337/database/:id for pre defined cypher and CSV output");
console.log("e.g.  http://localhost:1337/database/neo4j");
console.log('or');
console.log("Submit GET to http://localhost:1337/generic/neo4j?cypher=XXX where XXX is your cypher for JSON output");
console.log("e.g. http://localhost:1337/generic/neo4j?cypher=MATCH (n) RETURN count(n) as count");
console.log('--------------------------------------------------------------------------');

