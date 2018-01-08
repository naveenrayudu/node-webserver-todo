/**
 * Created by v-navray on 12/24/17.
 */
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

mongoose.Promise = global.Promise;
const mongooseURL = process.env.MONGODB_URL || 'mongodb://localhost:27017/ToDoApp';
mongoose.connect(mongooseURL,{
    useMongoClient:true
});

module.exports = {mongoose};