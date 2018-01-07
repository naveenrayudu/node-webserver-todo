/**
 * Created by v-navray on 01/07/18.
 */
const {ObjectID} = require('mongodb');

const {mongoose} = require('../server/db/mongoose');
const {toDoModel} = require('../server/models/todo');
const {UserModel} = require('../server/models/user');

const id = "5a3f8d151cc9556390a8abd0";

if(!ObjectID.isValid(id)){
    console.log('Object Invalid')
}

toDoModel.find({_id:id})
    .then((todos)=>{
        console.log(todos);
    });

toDoModel.findOne({_id:id})
    .then((todo)=>{
        console.log(todo);
    });

toDoModel.findById(id)
    .then(todo =>{
        console.log(todo);
    })
    .catch(e =>{
        console.log(e);
    });


UserModel.find({_id:'5a3f6f4e04f2d32564d22825'})
    .then(todos =>{
        console.log(todos);
    });


UserModel.findOne({
        _id:'5a3f6f4e04f2d32564d22825'
    }).then(todo=>{
        console.log(todo);
    });

UserModel.findById('5a3f6f4e04f2d32564d22825')
    .then(user=>{
        console.log(user);
    })
    .catch(e =>{
        console.log(e);
    })

