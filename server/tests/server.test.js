/**
 * Created by v-navray on 12/24/17.
 */
const expect = require('expect');
const request = require('supertest');

const {toDoModel} = require('../models/todo');
const {app} = require('../server');

const todosCreate = [
    {text:'first todo'},
    {text:'second todo'}
]

beforeEach((done)=>{
    toDoModel.remove({})
        .then(()=>
        {
            toDoModel.insertMany(todosCreate)
                .then(()=>{
                    done();
                });
        });
});

describe('POST /todos',() =>{
   it('should create a new todo',(done)=>{
       const text ='text from test Suite';

       request(app)
           .post('/todos')
           .send({text})
           .expect(200)
           .expect((res)=>{
                expect(res.body.text).toBe(text);
           })
           .end((err, res)=>{
                if(err)
                    return done(err);

                toDoModel.find({text})
                    .then((todos)=>{
                        expect(todos.length).toBe(1);
                        expect(todos[0].text).toBe(text);

                        done();
                    })
                    .catch(err => done(err));
           });
   });


   it('shouldn\'t create a new todo',(done) =>{
       request(app)
           .post('/todos')
           .send()
           .expect(400)
           .end((err, res)=>{
                if(err){
                    return done(err);
                }

               toDoModel.find()
                   .then((todos)=>{
                       expect(todos.length).toBe(2);
                       done();
                   })
                   .catch(err => done(err));
           })
   });

   it('should get all todos',(done)=>{
       request(app)
           .get('/todos')
           .send()
           .expect(200)
           .expect((res)=>{
                expect(res.body.todos.length).toBe(2);
           })
           .end(done);
   })
});