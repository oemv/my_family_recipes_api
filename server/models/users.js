import mongo from 'mongodb';
import * as DB from '../components/db';

let objectId = mongo.ObjectID;
let COLLECTION = "users";

export function findById(id, callback) {
    let collection = DB.getDB().collection(COLLECTION);
    let query = {'_id': new objectId(id)};
    collection.find(query).limit(1).next((error, user)=> {
        callback(error, user);
    });
}

export function findByEmail(email, callback) {
    let collection = DB.getDB().collection(COLLECTION);
    collection.find({email}).limit(1).next((error, user)=> {
        callback(error, user);
    });
}

export function add(user, callback) {
    let collection = DB.getDB().collection(COLLECTION);
    user.created_on = new Date();
    user.updated_on = new Date();
    collection.insertOne(user, (error, result) => {
        callback(error, result.ops[0]._id.toString());
    });
}


