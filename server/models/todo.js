/**
 * Created by v-navray on 12/24/17.
 */
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const toDoSchema = new Schema({
    text:{
        type:String,
        required:true,
        minlength:1,
        trim:true
    },
    completed:{
        type:Boolean,
        default:false
    },
    completedAt:{
        type:Number,
        default:null
    }
});


const toDoModel = mongoose.model('todo',toDoSchema);

module.exports = {toDoModel};
