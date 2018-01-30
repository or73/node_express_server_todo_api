const mongoose  = require('mongoose');
const validator = require('validator');
const jwt       = require('jsonwebtoken');
const _         = require('lodash');
const bcrypt    = require('bcryptjs');



const UserSchema    = new mongoose.Schema({
	name: {
		type: String,
		required: true,
		minlength: 3,
		trim: true
	},email: {
		type: String,
		minlength: 7,   //x@x.com
		required: true,
		trim: true,
		unique: true,
		validate: {
			validator: validator.isEmail,
			message: '{VALUE} is not a valid email'
		}
	}, password: {
		type: String,
		required: true,
		minlength: 6
	}, tokens: [{
		access: {
			type: String,
			required: true
		},
		token: {
			type: String,
			required: true
		}
	}]
});



UserSchema.methods.toJSON   = function () {
	let user        = this;
	let userObject  = user.toObject();
	
	return _.pick(userObject, [ '_id', 'email' ]);
};



UserSchema.methods.generateAuthToken    = function () {
	let user    = this;
	let access  = 'auth';
	let token   = jwt.sign({ _id: user._id.toHexString(), access }, 'abc123').toString();
	
	user.tokens.push({ access, token });
	
	return user.save().then(() => token);
};

UserSchema.statics.findByToken  = function (token) {
	let User    = this;
	let decoded;
	
	try {
		decoded = jwt.verify(token,  'abc123');
	} catch (e) {
		return Promise.reject();
	}
	
	return User.findOne({
		'_id': decoded._id,
		'tokens.token': token,
		'tokens.access': 'auth'
	});
};

UserSchema.statics.findByCredentials    = function (email, password) {
	let User    = this;
	
	return User.findOne({ email })// find the user owner of the email
		.then((user) => {
			if (!user) {    // user not found or does not exist
				return Promise.reject();
			}
			
			return new Promise((resolve, reject) => {
				// use bcrypt.compare to compare password and user.password
				bcrypt.compare(password,
								user.password,
								(err, res) => {
									if (res) {
										resolve(user);
									} else {
										reject();
									}
								}) ;
			});
		})
	
};


UserSchema.pre('save',
				function (next) {
					let user    = this;
					
					// validate if password has been modified
					if (user.isModified('password')) {
						bcrypt.genSalt(10,
										(err, salt) => {
														bcrypt.hash(user.password,
																	salt,
																	(err, hash) => {
																		user.password   = hash;
																		next();
																	})
										}               );
					} else {
						next();
					}
				});

const User  = mongoose.model('User', UserSchema);

module.exports  = { User };
