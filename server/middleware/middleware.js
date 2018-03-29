/**
 * Created by v-navray on 03/28/18.
 */

const {UserModel} = require('../models/user');


let authenticate = (req, res, next) =>{
    let token = req.header('x-auth');
    UserModel.verifyToken(token)
        .then(user =>{
            if(user){
                req.user =user.toJSON();
                req.token = token;
                next();
            }
            return Promise.reject();
        }).catch(e =>{
        res.status(401).send();
    });
}

module.exports ={authenticate};




