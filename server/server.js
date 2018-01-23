const express       = require('express');
const bodyParser    = require('body-parser');

const { mongoose }  = require('./db/mongoose');
const { Todo }      = require('./models/todo');
const { User }      = require('./models/user');
// mongodb://user:pass@localhost:port/database

const app   = express();

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

app.listen(7000,
			() => {
				console.log(`Server started and listening on port 7000`);
			});


// instances
// let newTodo = new Todo({
// 	text: 'SW Design',
// 	completedAt: 10
// });
//
// let newUser = new User({
// 	name: 'OR73',
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
module.exports  = { app }
