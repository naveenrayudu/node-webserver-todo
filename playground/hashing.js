/**
 * Created by v-navray on 03/26/18.
 */
const {SHA256} = require('crypto-js');
const jwt = require('jsonwebtoken');
let bcrypt = require('bcryptjs');


var data ={
    id:10
}

var token = jwt.sign(data,'123abc');
console.log(token);

var decoded = jwt.verify(token, '123abc');
console.log(decoded);


bcrypt.genSalt(10, function(err, salt) {
    bcrypt.hash("abc123!", salt, function(err, hash) {
        // Store hash in your password DB.
        console.log(hash);
    });
});

const hash ="$2a$10$tW2FYG4fMHXLatRnX4PBY.lZ8s/2.UeYJy8zcuV0C48kOwko5yvvO";

bcrypt.compare("abc123!", hash, function(err, res) {
    // res === true
    console.log(res);
});



// var message ="I am user number 3";
// var hash = SHA256(message);
//
// // console.log(`Message : ${message}`);
// // console.log(`Hash : ${hash}`)
//
//
// var data = {
//     id:4
// }
//
// var token = {
//     data,
//     hash:SHA256(JSON.stringify(data.id) + 'mysecretkey').toString()
// };
//  token.data.id = 6;
// token.hash = SHA256(token.data.id).toString();
//
// if(SHA256(JSON.stringify(token.data.id) + 'mysecretkey').toString() === token.hash.toString()){
//     console.log('Data is perfect');
// }else{
//     console.log('Data is not perfect');
// }

