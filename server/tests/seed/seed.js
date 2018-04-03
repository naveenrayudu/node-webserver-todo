/**
 * Created by v-navray on 03/29/18.
 */
const {ObjectID} = require('mongodb');
const {toDoModel} = require('../../models/todo');
const {UserModel} = require('../../models/user');
const jwt = require('jsonwebtoken');

const userIdOne = new ObjectID();
const userIdTwo = new ObjectID();
const todosCreate = [
    {
        _id:new ObjectID(),
        text:'first todo',
        _creator:userIdOne
    },
    {
        _id:new ObjectID(),
        text:'second todo',
        completed:true,
        completedAt:1232,
        _creator:userIdTwo
    }
];




const usersToCreate = [
    {
        _id:userIdOne,
        email:'andrew@example.com',
        password:'userOnePass',
        tokens:[
            {
                access:'auth',
                token:jwt.sign({_id:userIdOne, access:'auth'},process.env.JWT_TOKEN).toString()
            }
        ]
    },
    {
        _id:userIdTwo,
        email:'john@example.com',
        password:'userTwoPass',
        tokens:[
            {
                access:'auth',
                token:jwt.sign({_id:userIdTwo, access:'auth'},process.env.JWT_TOKEN).toString()
            }
        ]
    }
]

const populateToDos = (done)=>{
    toDoModel.remove({})
        .then(()=>
        {
            toDoModel.insertMany(todosCreate)
                .then(()=>{
                    done();
                });
        });
};

const usersToDo = (done) =>{
    UserModel.remove({})
        .then(()=>{
            let userOne = new UserModel(usersToCreate[0]).save();
            let userTwo = new UserModel(usersToCreate[1]).save();

            return Promise.all([userOne, userTwo]);
        }).then(()=>{
        done();
    })
}

module.exports ={
    todosCreate,
    populateToDos,
    usersToDo,
    usersToCreate
}