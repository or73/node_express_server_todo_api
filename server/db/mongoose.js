const mongoose  = require('mongoose');

const   portDB        = 27017,      // DB port
		dbName        = `TodoApp`,  // DB Name
		urlStart      = `mongodb`,
		host          = `localhost`,
		url           = `${ urlStart}://${ host }:${ portDB }/${ dbName }`;  // Connection URL

// mongodb://user:pass@localhost:port/database

mongoose.Promise    = global.Promise;       // add a Promise
mongoose.connect(`${ url }`);  // connect to DB



module.exports  = { mongoose };
