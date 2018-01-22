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
						
						todosCollection.find({ completed: true }).toArray().then((docs) => {
							console.log(`Todos1`);
							console.log(JSON.stringify(docs, undefined, 2));
						}, (err) => {
							console.log(`Unable to fetch todos: ${ err }`)
						});
						
						todosCollection.find().count().then((count) => {
							console.log(`Todos2 count: ${ count }`);
						}, (err) => {
							console.log(`Unable to fetch todos: ${ err }`)
						});
						
						const usersCollection  = database.db(dbName).collection('users');    // Create a collection we want to drop later
						
						usersCollection.find().toArray().then((docs) => {
							console.log(`USERS 1`);
							console.log(JSON.stringify(docs, undefined, 2));
						}, (err) => {
							console.log(`Unable to fetch users: ${ err }`)
						});
						
						
						usersCollection.find({ _id: new ObjectID('5a666fe4d48846c3791f3822') }).toArray().then((docs) => {
							console.log(`USERS 2`);
							console.log(JSON.stringify(docs, undefined, 2));
						}, (err) => {
							console.log(`Unable to fetch users: ${ err }`)
						});
						
						//database.close();
					});

