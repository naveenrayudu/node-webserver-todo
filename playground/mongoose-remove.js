/**
 * Created by v-navray on 01/07/18.
 */
const {ObjectID} = require('mongodb');

const {mongoose} = require('../server/db/mongoose');
const {toDoModel} = require('../server/models/todo');
const {UserModel} = require('../server/models/user');

// toDoModel.remove({})
//     .then(todos =>{
//         console.log(JSON.stringify(todos,undefined,2));
//     });

// toDoModel.findOneAndRemove({_id:'5a52c0887253d07e54ed243e'})
//     .then(todo =>{
//         console.log(JSON.stringify(todo,undefined,2));
//     });

toDoModel.findByIdAndRemove('5a52c0d17253d07e54ed244c')
    .then(todo =>{
        console.log(JSON.stringify(todo,undefined,2));
    });