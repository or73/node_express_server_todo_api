const env   = process.env.NODE_ENV || 'development';
console.log(`env ***** ${ env }`);

// configure app environment
if (env === 'development') {
	process.env.PORT    = 7000;
	process.env.MONGODB_URI  = 'mongodb://localhost:27017/TodoApp';
} else if (env === 'test') {
	process.env.PORT    = 7000;
	process.env.MONGODB_URI = 'mongodb://localhost:27017/TodoAppTest';
}
