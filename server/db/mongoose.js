/**
 * Created by v-navray on 12/24/17.
 */
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

mongoose.Promise = global.Promise;
let mongooseURL = process.env.MONGODB_URL || 'mongodb://localhost:27017';
mongoose.connect(`${mongooseURL}/ToDoApp`,{
    useMongoClient:true
});

module.exports = {mongoose};