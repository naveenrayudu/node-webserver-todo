/**
 * Created by v-navray on 03/26/18.
 */
const {SHA256} = require('crypto-js');
const jwt = require('jsonwebtoken');


var data ={
    id:10
}

var token = jwt.sign(data,'123abc');
console.log(token);

var decoded = jwt.verify(token, '123abc');
console.log(decoded);

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

