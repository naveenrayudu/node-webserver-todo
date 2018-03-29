/**
 * Created by v-navray on 12/24/17.
 */
const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const Schema = mongoose.Schema;
const _ = require('lodash');
const bcrypt = require('bcryptjs');

const UserSchema = new Schema({
    email:{
        type:String,
        required:true,
        minlength:1,
        trim:true,
        unique:true,
        validate:{
            validator:validator.isEmail,
            message:`{VALUE} is not a valid email.`
        }
    },
    password:{
        type:String,
        required:true,
        minlength:6
    },
    tokens:[
        {
            access:{
                type:String,
                required:true
            },
            token:{
                type:String,
                required:true
            }
        }
    ]
});


UserSchema.methods.toJSON = function () {
    var user = this;
    var userObject = user.toObject();

    return _.pick(userObject, ['_id', 'email']);
}


UserSchema.pre('save', function (next) {
    var user = this;
    if(user.isModified('password')){
        bcrypt.genSalt(10,function (err, salt) {
            bcrypt.hash(user.password,salt,function (err, hash) {
                user.password = hash;
                next();
            })
        })
    }else{
        next();
    }
})

UserSchema.methods.generateAuthToken = function () {
    var user = this;
    var access = "auth";

    var token = jwt.sign({_id:user._id.toHexString(), access}, "abc123");
    console.log(token);
    user.tokens.push({access, token});

    return user.save().then(()=>{
        return token;
    })

};

UserSchema.statics.verifyToken = function (token) {
    let User = this;
    let decoded;

    try{
        decoded = jwt.verify(token, 'abc123');
    }catch(e){
        return Promise.reject();
    }

    return User.findOne({
        _id:decoded._id,
        'tokens.token':token,
        'tokens.access':'auth'
    });
}

const UserModel = mongoose.model('user',UserSchema);
module.exports = {UserModel};