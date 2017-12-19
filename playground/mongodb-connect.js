const {MongoClient, ObjectID} = require('mongodb');


MongoClient.connect('mongodb://localhost/TodoApp',(err, db)=>{
    if(err){
        return console.log('Unable to connect to Mongodb Server.')
    }
    console.log('Connected to MongoDB Server.');

    db.collection('Todos').insertOne({
        text:'Something to do',
        completed:false
    },(err, result)=>{
        if(err){
            return console.log('Unable to insert todo')
        }
        console.log(JSON.stringify(result.ops, undefined,2));
    });

    db.collection('Users').insertOne({
        name:'Naveen Rayudu',
        age:26,
        location:'Redmond'
    },(err, result)=>{
        if(err){
            return console.log('Unable to insert todo')
        }
        console.log(JSON.stringify(result.ops, undefined,2));
    });

    db.close();
})