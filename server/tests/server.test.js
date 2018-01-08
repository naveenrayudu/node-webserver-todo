/**
 * Created by v-navray on 12/24/17.
 */
const expect = require('expect');
const request = require('supertest');
const {ObjectID} = require('mongodb');

const {toDoModel} = require('../models/todo');
const {app} = require('../server');

const todosCreate = [
    {
        _id:new ObjectID(),
        text:'first todo'
    },
    {
        _id:new ObjectID(),
        text:'second todo'
    }
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


describe('GET /todos/:id', ()=>{
    it('should return a todo doc', (done)=>{
        request(app)
            .get(`/todos/${todosCreate[0]._id.toHexString()}`)
            .expect(200)
            .expect((res)=>{
                expect(res.body.todo.text).toBe(todosCreate[0].text);
            })
            .end(done);
    });

    it('should return 404 if Id not found', (done)=>{
       const id = (new ObjectID()).toHexString();
       request(app)
           .get(`/todos/${id}`)
           .expect(404)
           .end(done);
    });

    it('should return 404 if invalid id is sent', (done)=>{
        request(app)
            .get(`/todos/123`)
            .expect(404)
            .end(done);
    });
});


describe ('DELETE /todos/:id', ()=>{
    it('should remove a todo', (done)=>{
        const id = todosCreate[0]._id.toHexString();
        request(app)
            .delete(`/todos/${id}`)
            .expect(200)
            .expect(res =>{
                expect(res.body._id).toBe(id);
            })
            .end((err, res)=>{
                if(err)
                    return done(err);

                toDoModel.findById(id)
                    .then(todo =>{
                        expect(todo).toNotExist();
                    })
                done();
            });
    });

    it('should return 404 if Id not found', (done)=>{
        const id = (new ObjectID()).toHexString();
        request(app)
            .delete(`/todos/${id}`)
            .expect(404)
            .end(done);
    });

    it('should return 404 if invalid id is sent', (done)=>{
        request(app)
            .delete(`/todos/123`)
            .expect(404)
            .end(done);
    });

});

