/**
 * Created by v-navray on 12/23/17.
 */
const express = require('express');
const bodyParser = require('body-parser');


const mongoose = require('./db/mongoose');
const {toDoModel} = require('./models/todo');
const {UserModel} = require('./models/user');

const app = express();

app.use(bodyParser.json());


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

app.listen(3000, ()=>{
    console.log('Started on port 3000');
});




