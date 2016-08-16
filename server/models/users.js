import mongo from 'mongodb';
import auth from '../components/auth';
import * as DB from '../components/db';

let objectId = mongo.ObjectID;
let COLLECTION = "users";

let users = {
  findById(id, callback) {
      let collection = DB.getDB().collection(COLLECTION);
      let query = {'_id': new objectId(id)};
      collection.find(query).limit(1).next((error, user)=> {
          callback(error, user);
      });
  },
  findByEmail(email, callback) {
      let collection = DB.getDB().collection(COLLECTION);
      collection.find({email}).limit(1).next((error, user)=> {
          callback(error, user);
      });
  },
  add(user, callback) {
      let collection = DB.getDB().collection(COLLECTION),
      doc = {
        email: user.email,
        password: auth.createHash(user.password),
        display_name: user.display_name,
        display_image: user.display_image,
        created_on: new Date(),
        updated_on: new Date()
      };
      collection.insertOne(doc, (error, result) => {
          callback(error, result.ops[0]._id.toString());
      });
  },
  remove(email, callback) {
      let collection = DB.getDB().collection(COLLECTION);
      let query = {'email': email};
      collection.deleteOne( query, (error, results)=>{
        if(typeof callback === "function"){
            callback(error, results);
        }
      });
  }
}

export default users;
