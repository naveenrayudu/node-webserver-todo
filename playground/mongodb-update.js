/**
 * Created by v-navray on 12/20/17.
 */
const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost/TodoApp',(err, db)=>{
    if(err){
        return console.log('Unable to connect to Mongodb Server.')
    }
console.log('Connected to MongoDB Server.');

// db.collection('Todos').findOneAndUpdate({
//     _id: new ObjectID('5a376b5e89d0be430e706597')
//     },{
//         $set:{
//             completed:false
//         }
//     },{
//         returnOriginal:false
//     }).then(result=>{
//         console.log(result);
// });


    db.collection('Users').findOneAndUpdate({
        _id: new ObjectID('5a376bcc89d0be430e7065dd')
    },{
        $set:{
            name:'Raju Raju1'
        },
        $inc:{
            age:1
        }
    },{
        returnOriginal:false
    }).then(result=>{
        console.log(result);
    });




db.close();
})