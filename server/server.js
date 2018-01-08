/**
 * Created by v-navray on 12/23/17.
 */
const express = require('express');
const bodyParser = require('body-parser');
const {ObjectID} = require('mongodb');

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

app.listen(port, ()=>{
    console.log(`Started on port 3000 ${port}`);
});

module.exports = {app};




