import * as users from '../models/users';
import * as DB from '../components/db';
import chai from 'chai';

let assert = chai.assert;
let COLLECTION = "users";


describe("users", ()=> {

    before((done)=> {
        DB.connect(DB.MODE_TST, ()=> {
            DB.drop((err)=> {
                if (err) return done(err);
                let collection = DB.getDB().collection(COLLECTION);
                collection.createIndex({'email': 1}, {unique: true}, done);
            });
        });
    });


    describe("add()", ()=> {
        it("should add a new user", (done)=> {
                let user = {
                    'email': 'oscar1_@hotmail.com',
                    'display_name': 'Oscar E. Manriquez',
                    'display_image': '/users/12345/oemanriquez.jpeg',
                    'password': '12345qwert'
                };

                users.add(user, (error, doc) => {
                   if(error) throw error;
                    assert.isOk(doc);
                    done();
                });
        });
    });

    describe("findByEmail()", ()=> {
        it("should find a user by email id", (done)=> {
            let user = {
                'email': 'oemanriquez@gmail.com',
                'display_name': 'Oscar E. Manriquez',
                'display_image': '/users/12344/oemanriquez.jpeg',
                'password': '12345qwert'
            };

            users.add(user, (error, doc) => {
                if(error) throw error;
                users.findByEmail(user.email, (error, doc)=>{
                    if(error) throw error;
                    assert.strictEqual(doc.email, user.email);
                    done();
                });
            });
        });
    });

    describe("findById()", ()=> {
        it("should find a user by id", (done)=> {
            let user = {
                'email': 'thebluebull4@outlook.com',
                'display_name': 'Blue Bull',
                'display_image': '/users/12346/bluebull.jpeg',
                'password': '12345qwert'
            };

            users.add(user, (error, _id) => {
                if(error) throw error;
                users.findById(_id, (error, foundUser)=>{
                    if(error) throw error;
                    assert.isOk(foundUser);
                    assert.strictEqual(foundUser.email, user.email);
                    //console.dir(foundUser);
                    done();
                });
            });
        });
    });
});