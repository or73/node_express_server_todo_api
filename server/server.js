require('./config/config');

const _                 = require('lodash');
const express           = require('express');
const bodyParser        = require('body-parser');
const { ObjectID }      = require('mongodb');
const jwt               = require('jsonwebtoken');

const { mongoose }      = require('./db/mongoose');
const { Todo }          = require('./models/todo');
const { User }          = require('./models/user');
const { authenticate }  = require('./middleware/authenticate');
// mongodb://user:pass@localhost:port/database

const app   = express();
const port  = process.env.PORT || 7000;

// middleware
app.use(bodyParser.json());

app.post('/todos',
		authenticate,
		(req, res) => {
			//console.log(`request: ${ JSON.stringify(req.body) }`);
			let todo    = new Todo({
				text: req.body.text,
				_creator: req.user._id
			});
			todo.save()
				.then((doc) => {
						res.send(doc);
					}, (err) => {
						res.status(400).send(err);
					});
		});

app.get('/todos',
		authenticate,
		(req, res) => {
			Todo.find({
				_creator: req.user._id
				})
				.then(  (todos) => {
							res.send({ todos });
						},
						(error) => {
							res.status(400).send(error);
						});
		});

// GET /todos/123456
app.get('/todos/:id',
		authenticate,
		(req, res) => {
			let id  = req.params.id;
			
			if (!ObjectID.isValid(id)) {    // validating id using valid id
				return res.status(400).send('Id not valid');  // 404 - send back empty send
			}
			
			Todo.findOne({
					_id: id,
					_creator: req.user._id
				})   // find ById
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
app.delete('/todos/:id', authenticate, (req, res) => {
				// get the id
				let id  = req.params.id;
				// validate the id -> not valid? return 404
				if (!ObjectID.isValid(id)) {
					return res.status(404).send();
				}
				
				Todo.findOneAndRemove({ // remove todo by id
						_id: id,
						_creator: req.user._id
					}).then( (todo) => {
						if (!todo) {    // if no doc, send 404
							return res.status(404).send();
						}
						
						res.send({ todo }); // id doc, send 200
					}).catch((e) => {   // error
						res.status(400).send(); // 400 with empty body
				});
			});

// UPDATE
app.patch('/todos/:id', authenticate, (req, res) => {
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
				
				Todo.findOneAndUpdate({ _id: id,  _creator: req.user._id },
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
			let body    = _.pick(req.body, [ 'name', 'email', 'password' ]);
			let user    = new User(body);
			
			user.save()
				.then(() => {
							return user.generateAuthToken();
						})
				.then((token) => {
						res.header('x-auth', token).send(user);
					})
				.catch((e) => res.status(400).send(e));
		});

app.get('/users/me',
		authenticate,
		(req, res) => {
			res.send(req.user);
		});

// POST /users/login    { email, password }
app.post('/users/login',
		(req, res) => {
			let body    = _.pick(req.body,  [ 'name', 'email', 'password' ]);
			
			// validate if a user exist with that email
			User.findByCredentials(body.email, body.password)
				.then((user) => {
					//res.send(user);
					return user.generateAuthToken()
								.then((token) => {
									res.header('x-auth', token).send(user);
								});
				}).catch((e) => {
					res.status(400).send();
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



app.delete('/users/me/token',
			authenticate,
			(req, res) => {
							req.user
								.removeToken(req.token)
								.then(() => {
										res.status(200).send();
									}, () => {
										res.status(400).send();
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
