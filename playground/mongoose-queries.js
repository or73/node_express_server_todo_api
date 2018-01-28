const { ObjectId }  = require('mongodb');


const { mongoose }  = require('./../server/db/mongoose');
const { Todo }      = require('./../server/models/todo');
const { User }      = require('./../server/models/user');


// Todo validation
console.log(`\n\n\t\t\tTODO validation`);
let todoId  = '5a6e0196c5c51f34476f9879';

if (!ObjectId.isValid(todoId)) {
	console.log(`Todo id is not valid`);
}else {
	
	Todo.find({
		_id: todoId
	}).then((todos) => {
		if (!todos || todos === null || todos === [] || todos.length < 1) {
			return console.log(`id not found with find`);
		}
		console.log(`find - Todos query - return an array of objects =>\n ${ todos }`);
	}).catch((error) => console.log(`ERROR: not valid data in find: ${ error }`));
	;
	
	Todo.findOne({
			_id: todoId
		})
		.then((todo) => {
			if (!todo) {
				return console.log(`id not found with findOne`);
			}
			console.log(`\n\nSingle findOne - Todo query - return an object =>\n ${ todo }`);
		}).catch((error) => console.log(`ERROR: not valid data in findOne: ${ error }`));
	;
	
	Todo.findById(todoId)
		.then((todo) => {
			if (!todo) {
				return console.log('id not found with findById');
			}
			console.log(`\n\ntodo by Id: ${ todo }`);
		}).catch((error) => console.log(`ERROR: not valid data in findById: ${ error }`));
}


// User validation
let userId  = '5a6e07553eff7f35be2b4913';

if (!ObjectId.isValid(userId)) {
	console.log(`User id is not valid`);
} else {
	User.find({
		_id: userId
	}).then((users) => {
				if (!users || users === null || users === [] || users.length < 1) {
					return console.log(`User id not found with find`);
				}
				console.log(`find - Users query - return an array of objects =>\n ${ users }`);
			}, (error) => console.log(`ERROR: not valid data in find: ${ error }`));
		
	User.findOne({
			_id: userId
		})
		.then((user) => {
					if (!user) {
						return console.log(`User id not found with findOne`);
					}
					//console.log(`\n\nSingle findOne - User query - return an object =>\n ${ user }`);
					console.log(`USER findOne: ${ JSON.stringify(user,  undefined, 2) }`);
				}, (error) => console.log(`ERROR: not valid data in findOne: ${ error }`));
	
	
	User.findById(userId)
		.then((user) => {
					if (!user) {
						return console.log('User id not found with findById');
					}
					//console.log(`\n\nUser by Id: ${ user }`);
					console.log(`USER findById: ${ JSON.stringify(user,  undefined, 2) }`)
				},(error) => console.log(`ERROR: not valid data in findById: ${ error }`));
}
