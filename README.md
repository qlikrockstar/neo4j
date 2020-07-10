# neo4j
This is a fully functional REST webservice to pull data out of a NoSQL Neo4j database, e.g. in tools like Qlik Sense, PowerBI, Tableau and others.

# How to use
Download both files index.js and package.json and install the needed dependencies with 
-- npm install --
In index.js you have to provide the address of your Neo4j server as well as username and password.
Then you can run the webservice with
-- node index.js --

# Writing cyphers / get the data
Submit a GET request to http://localhost:1337/database/:id for pre defined cypher and CSV output (e.g.  http://localhost:1337/database/neo4j)

or

Submit a GET request to http://localhost:1337/generic/neo4j?cypher=XXX where XXX is your cypher for JSON output (e.g. http://localhost:1337/generic/neo4j?cypher=MATCH (n) RETURN count(n) as count), and yes, you can use the blankspaces in the URL as they will get encoded correctly.

# Optional
You can install the REST service as a windows service using tools like NSSM (https://nssm.cc/).

# Disclaimer
This is not tested whatsoever. Use it on your own risk.

# Licence
Do whatever you want, but obey licences from used packages.
