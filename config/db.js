let mongoose = require('mongoose');
mongoose.Promise = require('bluebird');

const DB_CONNECTION = process.env.DB_CONNECTION || 'mongodb://localhost:27017/rentomojo';

mongoose = mongoose.createConnection(DB_CONNECTION,
    {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
        useCreateIndex: true
    }, (err) => {
        if(!err)
            console.log('=============== Database Connected ===============');    
        else
            console.log(err);
    }
);

module.exports = mongoose;