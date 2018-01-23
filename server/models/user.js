const mongoose  = require('mongoose');


const User  = mongoose.model('User',
	{
		name: {
			type: String,
			required: true,
			minlength: 3,
			trim: true
		},
		email: {
			type: String,
			minlength: 7,
			required: true,
			trim: true
		}
	});



module.exports  = { User };
