const {MongoClient, ObjectID} = require('mongodb');


MongoClient.connect('mongodb://localhost/TodoApp',(err, db)=>{
    if(err){
        return console.log('Unable to connect to Mongodb Server.')
    }
    console.log('Connected to MongoDB Server.');

    db.collection('Todos').find({
        _id: new ObjectID('5a376b5e89d0be430e706597')
        })
        .toArray()
        .then(result=>{
            console.log(JSON.stringify(result, undefined, 2));
        })
        .catch(err=>{
            console.log(err);
        });

    db.collection('Todos').find()
        .count()
        .then(count=>{
            console.log(count);
        })
        .catch(err=>{
            console.log(err);
        });

    db.collection('Users').find({
            name:'Naveen Rayudu'
        }).toArray()
        .then(results =>{
            console.log(JSON.stringify(results, undefined, 2));
        })
        .catch(err =>{
            console.log(err);
        });

    db.collection('Users').count()
        .then(count=>{
            console.log(count)
        })
        .catch(err =>{
            console.log(err);
        })

    db.close();
})