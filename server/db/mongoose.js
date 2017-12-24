/**
 * Created by v-navray on 12/24/17.
 */
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/ToDoApp',{
    useMongoClient:true
});

module.exports = {mongoose};