const { ObjectId }  = require('mongodb');


const { mongoose }  = require('./../server/db/mongoose');
const { Todo }      = require('./../server/models/todo');
const { User }      = require('./../server/models/user');


// Todo.remove({})
// Todo.remove({})
// 	.then((result) => {
// 		console.log(`Result: ${ JSON.stringify(result,  undefined, 2) }`);
// 	});

// Todo.findOneAndRemove({ _id: '5a6e3e2442dcb432493b0f82'})
// 						.then((todo) => {
// 							console.log(`Todo: ${ JSON.stringify(todo,  undefined, 2) }`);
// 						});

Todo.findByIdAndRemove('5a6e3eea42dcb432493b0f83')
						.then((todo) => {
							console.log(`Todo: ${ JSON.stringify(todo,  undefined, 2) }`);
						});
