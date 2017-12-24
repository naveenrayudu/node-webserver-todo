/**
 * Created by v-navray on 12/24/17.
 */
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    email:{
        type:String,
        required:true,
        minlength:1,
        trim:true
    }
});

const UserModel = mongoose.model('user',UserSchema);
module.exports = {UserModel};