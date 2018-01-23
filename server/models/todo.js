const mongoose  = require('mongoose');



// create a model
const Todo  = mongoose.model('Todo',
							{
								text: {
									type: String,
									required: true,
									minlength: 1,
									trim: true // removes white spaces at beginning and end
								},
								completed: {
									type: Boolean,
									default: false
								},
								completedAt: {
									type: Number,
									default: null
								}
							});



module.exports  = { Todo };
