// const MongoClient   = require('mongodb').MongoClient;
const { MongoClient, ObjectID }   = require('mongodb');

// How create Object Id
// let objId = new ObjectID();
// console.log(`objId: ${ objId }`);



const portDB        = 27017;        // DB port
const dbName        = `TodoApp`;    // DB Name
const url           = `mongodb://localhost:${ portDB }`;  // Connection URL



// Connect using MongoClient
MongoClient.connect(url,
					(err, database) => {
						if (err) {
							return console.log(`Unable to connect to MongoDB Server`);
						}
						console.log(`Connected to MongoDB Server, on port: ${ portDB }`);
						
						const todosCollection  = database.db(dbName).collection('todos');    // Create a collection we want to drop later
						
						todosCollection.insertOne({
							text: 'Something to do',
							completed: false
						}, (err, result) => {
							if (err) {
								return console.log(`Unable to insert to do: ${ err }`)
							}
							console.log(JSON.stringify(result.ops,  undefined, 2));
						});
						
						const usersCollection   = database.db(dbName).collection('users');
						
						usersCollection.insertOne({
							name: 'OR',
							age: 44,
							location: 'Bogota D.C.'
						}, (err, result) => {
							if (err) {
								return console.log(`Unable to insert user: ${ err }`);
							}
							console.log(JSON.stringify(result.ops,  undefined, 2));
						});
						database.close();
					});

