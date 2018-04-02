/**
 * Created by v-navray on 12/23/17.
 */
require('./config/config');
const express = require('express');
const bodyParser = require('body-parser');
const {ObjectID} = require('mongodb');
const _ = require('lodash');

const mongoose = require('./db/mongoose');
const {toDoModel} = require('./models/todo');
const {UserModel} = require('./models/user');
const {authenticate} = require('./middleware/middleware');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const app = express();
const port = process.env.PORT;

app.use(bodyParser.json());


app.get('/todos', (req, res)=>{
    toDoModel.find({})
        .then((todos)=>{
            res.send({todos})
        })
        .catch(err =>{
            res.status(400).send(err);
        });
});


app.get('/todos/:id', function(req, res) {
    const {id} = req.params;
    if(!ObjectID.isValid(id)){
        res.status(404).send();
        return;
    };

    toDoModel.findById(id)
        .then(todo =>{
            if(todo){
                res.send({'todo':todo});
            }else{
                res.status(404).send();
            }
        })
        .catch(e=>{
            res.status(404).send();
        });

})


app.post('/todos',(req, res)=>{
    var todo = new toDoModel({
        text: req.body.text
    });

    todo.save()
        .then((doc)=>{
            res.send(doc);
        })
        .catch((err)=>{
            res.status(400).send(err);
        })

});


app.patch('/todos/:id', (req, res) => {
    const {id} = req.params;

    if(!ObjectID.isValid(id)){
        return res.status(404).send();
    };

    let body = _.pick(req.body, ['text', 'completed']);

    if(_.isBoolean(body.completed) && body.completed){
        body.completedAt = (new Date()).getTime();
    }else{
        body.completedAt = null;
        body.completed = false;
    }

    toDoModel.findByIdAndUpdate(id, {$set:body}, {new:true})
        .then(todo =>{
            if(todo)
                return res.send({todo});

            return res.status(404).send();
        })
        .catch((e)=>{
            return res.status(404).send();
        })

});

app.delete('/todos/:id', (req, res)=>{
   const {id} = req.params;

   if(!ObjectID.isValid(id)){
       return res.status(404).send();
   };

   toDoModel.findByIdAndRemove(id)
       .then(todo =>{
           if(todo){
               return res.send(todo);
           };
           return res.status(404).send();
       })
       .catch(e=>{
           return res.status(404).send();
       })
});

app.post('/users', (req, res) =>{


    var user = _.pick(req.body.user, ["email", "password"]);
    var userModel = new UserModel(user);


    userModel.save()
        .then(()=>{
            return userModel.generateAuthToken()
        })
        .then((token)=>{
            res.header('x-auth',token).send(userModel.toJSON())
        })
        .catch(e=>{
            res.status(400).send(e);
        })

});


app.get('/users/me', authenticate, (req, res)=>{
    return res.send(req.user);
});


app.post('/users/login', (req, res)=>{

    const {email} = req.body.user;
    const {password} = req.body.user;

    UserModel.findByCredentials(email, password)
        .then((user)=>{
            user.generateAuthToken()
                .then(token =>{
                    res.header('x-auth',token).send(user.toJSON())
                })
        })
        .catch(e=>{
            console.log(e);
            res.status(400).send(e);
        })

})

app.listen(port, ()=>{
    console.log(`Started on port ${port}`);
});

module.exports = {app};




