import users from '../models/users';
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
                    'email': 'johndoe@outlook.com',
                    'display_name': 'John Doe',
                    'display_image': '/users/12345/foobar.jpeg',
                    'password': 'foobar'
                };

                users.add(user, (error, doc) => {
                   if(error){
                      throw error;
                   }
                    assert.isOk(doc);
                    done();
                });
        });
    });

    describe("findByEmail()", ()=> {
        it("should find a user by email id", (done)=> {
            let user = {
                'email': 'janedoe@gmail.com',
                'display_name': 'Jane Doe',
                'display_image': '/users/12344/jdoe.jpeg',
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
                    done();
                });
            });
        });
    });

    //describe.skip("remove()", ()=> {
    describe.skip("remove()", ()=> {
        it("should remove a user by id", (done)=> {
            let user = {
                'email': 'test@outlook.com',
                'display_name': 'Born to die',
                'display_image': '/users/12346/bornToDie.jpeg',
                'password': '12345qwert'
            };

            users.add(user, (error, _id) => {
                if(error) throw error;
                users.remove(user.email, (deleteError, result)=>{
                    if(deleteError) throw deleteError;
                    assert.isNull(deleteError);
                    done();
                });
            });
        });
    });
});
