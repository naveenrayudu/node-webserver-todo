/**
 * Created by v-navray on 12/20/17.
 */
const {MongoClient, ObjectID} = require('mongodb');


MongoClient.connect('mongodb://localhost/TodoApp',(err, db)=>{
    if(err){
        return console.log('Unable to connect to Mongodb Server.')
    }
    console.log('Connected to MongoDB Server.');

    //delete many
    // db.collection('Todos').deleteMany({text:'Added new document'})
    //     .then(result=>{
    //         console.log(result);
    //     });

    // db.collection('Todos').deleteOne({text:'added to do1'})
    //     .then(result =>{
    //         console.log(result);
    //     });
    //
    // const id = new ObjectID("5a3a215289d0be430e70ba5c");
    // db.collection('Todos').findOneAndDelete({_id:id})
    //     .then(result =>{
    //         console.log(result);
    //     })


    //
    // db.collection('Users').deleteMany({name:'Naveen Rayudu'})
    //     .then(result=>{
    //         console.log(result);
    //     });

    const id = new ObjectID('5a376bdc89d0be430e7065e9');
    db.collection('Users').findOneAndDelete({_id:id})
        .then(result=>{
            console.log(result);
        })


    db.close();
})