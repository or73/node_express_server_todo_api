const { SHA256 }    = require('crypto-js');
const jwt           = require('jsonwebtoken');
const bcrypt        = require('bcryptjs');


// SHA256
let message = 'I am user number 3';
let hash    = SHA256(message).toString();

console.log(`Message: ${ message }`);
console.log(`Hash: ${ hash }`);

let data    = {
	id: 4
};

let token   = {
	data,
	hash: SHA256(JSON.stringify(data) + 'somesecret').toString()
};

// validate token
let resultHash  = SHA256(JSON.stringify(token.data) + 'somesecret').toString();

if (resultHash === token.hash) {
	console.log(`Data was not change...`);
} else {
	console.log(`Data was changed.  Do not trust!`);
}

// JWT
let dataJWT = {
	id: 10
};

let tokenJWT   = jwt.sign(dataJWT,  '123abc');
console.log(`token: ${ tokenJWT }`);

let decodedJWT = jwt.verify(tokenJWT,  '123abc');
console.log(`decoded: ${  JSON.stringify(decodedJWT, undefined, 2) }`);

// bcrypt
let password    = '123abc!';

bcrypt.genSalt(10,
				(err, salt) => {
					bcrypt.hash(password,
								salt,
								(err, hash) => {
									console.log(`hash: ${ hash }`);
								})
				});

let hashPassword    = '$2a$10$JdSSuungkhIhSvvDA8bgK.HyT.fHnb.4K2uBZZAXOlvjwImER8fi2';

bcrypt.compare(password,
				hashPassword,
				(err, res) => {
					console.log(`res: ${ res }`);
				});
