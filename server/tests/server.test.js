/**
 * Created by v-navray on 12/24/17.
 */
const expect = require('expect');
const request = require('supertest');
const {ObjectID} = require('mongodb');

const {toDoModel} = require('../models/todo');
const {UserModel}= require('../models/user');
const {app} = require('../server');
const {populateToDos, todosCreate, usersToCreate ,usersToDo} = require('./seed/seed');


beforeEach(usersToDo);
beforeEach(populateToDos);

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


describe('PATCH todos/:id', ()=>{
    it('should update the todos', (done)=>{
        request(app)
            .patch(`/todos/${todosCreate[0]._id}`)
            .send({completed:true, text:'updated the text'})
            .expect(200)
            .expect((res) =>{
                expect(res.body.todo.text).toBe('updated the text');
                expect(res.body.todo.completed).toBe(true);
                expect(!isNaN(res.body.todo.completedAt)).toBe(true);
            })
            .end(done);
    });

    it('should clear completedAt when complete is false', (done) =>{
        request(app)
            .patch(`/todos/${todosCreate[1]._id}`)
            .send({completed:false})
            .expect(200)
            .expect(res =>{
                expect(res.body.todo.completed).toBe(false);
                expect(res.body.todo.completedAt).toNotExist();
            })
            .end(done);
    })
});

describe('GET users/me', ()=>{
    it('should return token for valid users', (done) =>{
        request(app)
            .get('/users/me')
            .set('x-auth', usersToCreate[0].tokens[0].token)
            .expect(200)
            .expect((res)=>{
                expect(res.body._id).toBe(usersToCreate[0]._id.toHexString());
                expect(res.body.email).toBe(usersToCreate[0].email)
            })
            .end(done);
    });

    it('should return 401 unauthrized for invalid users', (done)=>{
        request(app)
            .get('/users/me')
            .expect(401)
            .expect((res) =>{
                expect(res.body).toEqual({});
            })
            .end(done);
    })


})


describe('POST /users',()=>{
    it('should create an user', (done)=>{
        const email ='test@test.com';
        const password = 'tespass!'
        request(app)
            .post('/users')
            .send({user:{email, password}})
            .expect(200)
            .expect((res) =>{
                expect(res.header['x-auth']).toExist();
                expect(res.body._id).toExist();
                expect(res.body.email).toBe(email);
            })
            .end((err)=>{
                if(err){
                    return done(err);
                }
                UserModel.findOne({email}).then(user =>{
                    expect(user).toExist();
                    expect(user.email).toBe(email);
                    done();
                })
            });
    })

    it('should return validation errors when request invalid', (done)=>{
        const email ='test1@test.com';
        const password = 'fail';

        request(app)
            .post('/users')
            .send({user:{email, password}})
            .expect(400)
            .end(done);
    });

    it('should return error when same email id is used', (done)=>{
        const email='andrew@example.com';
        const password = 'testpass!';

        request(app)
            .post('/users')
            .send({user:{email, password}})
            .expect(400)
            .end(done);
    })
})