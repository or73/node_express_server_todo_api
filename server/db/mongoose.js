const mongoose  = require('mongoose');


mongoose.Promise    = global.Promise;       // add a Promise
mongoose.connect(process.env.MONGODB_URI);  // connect to DB



module.exports  = { mongoose };
