import chai from 'chai';
import superTest from 'supertest';

import recipes from '../models/users';
import * as DB from '../components/db';
import server from '../server';

let assert = chai.assert;
let request = superTest(server);

describe("users-router", ()=> {

    before((done)=> {
        DB.connect(DB.MODE_TST, ()=>{
            DB.drop((err)=> {
                if (err){
                  return done(err);
                }
                done();
            });
        });
    });

    describe('POST /api/users', ()=>{
        it('should create a new user', (done)=>{
            let user = {
                'email': 'oscar1_@hotmail.com',
                'display_name': 'Oscar E. Manriquez',
                'display_image': '/users/12345/oemanriquez.jpeg',
                'password': '1q2w3e4r5t'
            };

            request
            .post('/api/users')
            .send(user)
            .expect(201)
            .expect('Location',/users/)
            .end((error, res) =>{
                if(error){
                  throw error;
                }
                assert.isNotNull(res.body.id);
                done();
            });
        });
    });


    describe("GET /api/users/:email", ()=> {
        it('should return a user by email', (done)=> {
            let user = {
                'email': 'oemanriquez@gmail.com',
                'display_name': 'OEMV',
                'display_image': '/users/12345/oemanriquez.jpeg',
                'password': 'secret'
            };

            request
            .post('/api/users')
            .send(user)
            .expect(201)
            .expect('Location',/users/)
            .end((error, res) =>{
                if(error){
                  throw error;
                }

                request
                .get('/api/users/'+user.email)
                .expect(200)
                .end((error, res)=>{
                    if(error){
                      throw error;
                    }
                    assert.strictEqual(user.email, res.body.email);
                    assert.strictEqual(user.display_name, res.body.display_name);
                    done();
                });
            });
        });
    });

});
