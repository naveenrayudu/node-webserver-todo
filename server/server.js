/**
 * Created by v-navray on 12/23/17.
 */
const express = require('express');
const bodyParser = require('body-parser');
const {ObjectID} = require('mongodb');
const _ = require('lodash');

const mongoose = require('./db/mongoose');
const {toDoModel} = require('./models/todo');
const {UserModel} = require('./models/user');

const app = express();
const port = process.env.PORT || 3000;

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
    console.log(req.body);
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

app.listen(port, ()=>{
    console.log(`Started on port ${port}`);
});

module.exports = {app};




