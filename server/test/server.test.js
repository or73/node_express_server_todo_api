const expect    = require('expect');
const request   = require('supertest');


const { app }   = require('./../server');
const { Todo }  = require('./../models/todo');

beforeEach((done) => {  // Delete everything form DB
	Todo.remove({})
		.then(() => {
			done();
		});
});

describe('POST /todos',
		() => {
			it('should create a new todo',
				(done) => {
					let text    = 'Test todo text';
					
					request(app)
						.post('/todos')                         // post request
						.send({ text })                         // sending dat
						.expect(200)                            // validate status
						.expect((res) => {                      // compare text sent
							expect(res.body.text).toBe(text);
						})
						.end((err, res) => {
							if (err) {
								return done(err);
							}
							
							Todo.find()                         // DB data validation
								.then((todos) => {
									expect(todos.length).toBe(1);
									expect(todos[0].text).toBe(text);
									done();
								}).catch((error) => done(error))
						});
				});
			
			it ('should not create todo with invalid body data',
				(done) => {
					request(app)
						.post('/todos')
						.send({})
						.expect(400)
						.end((err, res) => {
							if (err) {
								return done(err);
							}
							
							Todo.find()
								.then((todos) => {
									expect(todos.length).toBe(0);
									done();
								}).catch((error) => done(error))
						});
				});
		});
