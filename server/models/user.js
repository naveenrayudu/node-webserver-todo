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

    user.tokens.push({access, token});

    return user.save().then(()=>{
        return token;
    })

};

UserSchema.methods.removeToken = function (token) {
    var user = this;

   return user.update({
        $pull:{
            tokens:{token}
        }
    })
}

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


UserSchema.statics.findByCredentials = function (email, password) {
    let User = this;
    return User.findOne({email}).then((user)=>{
        if(user){
            return new Promise((resolve, reject)=>{
                bcrypt.compare(password, user.password, function (err, res) {
                    if(res){
                        resolve(user);
                    }
                    reject();
                })
            });
        }else{
            return Promise.reject();
        }
    }).catch(e=>{
        return Promise.reject();
    })
}

const UserModel = mongoose.model('user',UserSchema);
module.exports = {UserModel};