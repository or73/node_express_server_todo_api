require('./config/config');

const _             = require('lodash');
const express       = require('express');
const bodyParser    = require('body-parser');
const { ObjectID }  = require('mongodb');

const { mongoose }  = require('./db/mongoose');
const { Todo }      = require('./models/todo');
const { User }      = require('./models/user');
// mongodb://user:pass@localhost:port/database

const app   = express();
const port  = process.env.PORT || 7000;

// middleware
app.use(bodyParser.json());

app.post('/todos',
		(req, res) => {
			//console.log(`request: ${ JSON.stringify(req.body) }`);
			let todo    = new Todo({
				text: req.body.text
			});
			todo.save()
				.then((doc) => {
						res.send(doc);
					},
					(err) => {
						res.status(400).send(err);
					});
		});

app.get('/todos',
		(req, res) => {
			Todo.find()
				.then(  (todos) => {
							res.send({ todos });
						},
						(error) => {
							res.status(400).send(error);
						});
		});

// GET /todos/123456
app.get('/todos/:id',
		(req, res) => {
			let id  = req.params.id;
			
			if (!ObjectID.isValid(id)) {    // validating id using valid id
				return res.status(400).send('Id not valid');  // 404 - send back empty send
			}
			
			Todo.findById(id)   // find ById
				.then(  (todo) => { // success
									if (!todo) { // if !todo - send back 404 with empty body
										return res.status(404).send('Id has not been found');
									}
									
									res.send({ todo }); // if todo - send it back
								},
						(error) => { // error
										res.status(400).send(`Id not found: ${ error }`);  // 404 - send back empty send
									});
				// error
					// 400 - and send empty body back
		});

// DELETE
app.delete('/todos/:id',
			(req, res) => {
				// get the id
				let id  = req.params.id;
				// validate the id -> not valid? return 404
				if (!ObjectID.isValid(id)) {
					return res.status(404).send('Id not valid');
				}
				
				Todo.findByIdAndRemove(id)   // remove todo by id
					.then( (todo) => {
						if (!todo) {    // if no doc, send 404
							return res.status(404).send('Id has hot been found');
						}
						
						res.status(200).send({ todo }); // id doc, send 200
						// error
						// 400 with empty body
					}, (error) => {
						return res.status(400).send(`ERROR: id could not has been deleted: ${ error }`);
					});
			});

// UPDATE
app.patch('/todos/:id',
			(req, res) => {
				let id      = req.params.id;
				let body    = _.pick(req.body,  ['text', 'completed']);
				
				if (!ObjectID(id)) {
					return res.status(404).send('Id not valid');
				}
				
				if (_.isBoolean(body.completed) && body.completed) {
					body.completedAt    = new Date().getTime();
				} else {
					body.completed      = false;
					body.completedAt    = null;
				}
				
				Todo.findByIdAndUpdate(id,
										{ $set: body },
										{ new: true })
					.then((todo) => {
						if (!todo) {
							return res.status(404).send(`todo does not exist`);
						}
						
						res.send({ todo });
					}, (error) => {
						res.status(400).send(`ERROR1: todo could not been updated: ${ error }`);
					}).catch((error) => {
						res.status(400).send(`ERROR2: todo could not been updated: ${ error }`);
					});
			});

app.post('/users',
		(req, res) => {
			//console.log(`request: ${ JSON.stringify(req.body) }`);
			let user    = new User({
				name: req.body.name,
				email: req.body.email
			});
			user.save()
				.then((doc) => {
						res.send(doc);
					},
					(err) => {
						res.status(400).send(err);
					});
		});

app.get('/users',
		(req, res) => {
			User.find()
				.then(  (users) => {
						res.send({ users });
					},
					(error) => {
						res.status(400).send(error);
					});
		});


app.listen(port,
			() => {
				console.log(`Server started and listening on port ${ port }`);
			});


// instances
// let newTodo = new Todo({
// 	text: 'SW Design',
// 	completedAt: 10
// });
//
//  let newUser = new User({
//  	name: 'OR73',
// 	email: 'oreyesc@gmail.com'
// });
//
// newTodo.save()
// 	.then(  (doc) => {
// 						console.log(`Saved todo ${ JSON.stringify(doc,  undefined, 2) }`);
// 					},
// 			(error) => {
// 							console.log(`ERROR: Unable to save todo: ${ error }`)
// 						}
// 		);
//
// newUser.save()
// 	.then(  (doc) => {
// 						console.log(`Saved user ${ JSON.stringify(doc,  undefined, 2) }`);
// 					},
// 			(error) => {
// 							console.log(`ERROR: Unable to save user: ${ error }`);
// 						});
module.exports  = { app };
