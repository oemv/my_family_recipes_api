import mongo from 'mongodb';
import async from 'async';
import {DEV_DATABASE_URL, TST_DATABASE_URL, PRD_DATABASE_URL} from "../constants";
let MongoClient = mongo.MongoClient;

let state = {
    db: null,
    mode: null
}

export const MODE_DEV = "MODE_DEV";
export const MODE_TST = "MODE_TST";
export const MODE_PRD = "MODE_PRD";

export function connect( mode , done ){
    if(state.db) return done();
    let uri = null;
    switch (mode){
        case MODE_DEV:
            uri = DEV_DATABASE_URL;
            break;
        case MODE_TST:
            uri = TST_DATABASE_URL;
            break;
        case MODE_PRD:
            uri = process.env.MONGODB_URI;
            break;
        default:
            console.log('Unknown database mode')
    }
    MongoClient.connect(uri, (error, db) => {
        if(error) return done(error);
        state.db = db;
        state.mode = mode;
        done();
    });
}

export function getDB(){
    return state.db;
}

export function drop(done) {
    if (!state.db) return done()
    // This is faster then dropping the database
    state.db.collections((err, collections) => {
        async.each(collections, function(collection, cb) {
            if (collection.collectionName.indexOf('system') === 0) {
                return cb()
            }
            collection.remove(cb)
        }, done)
    })
}

export function load(data, done) {
    let db = state.db
    if (!db) {
        return done(new Error('Missing database connection.'))
    }

    let names = Object.keys(data.collections)
    async.each(names, (name, cb) => {
        db.createCollection(name, function(err, collection) {
            if (err) return cb(err)
            collection.insert(data.collections[name], cb)
        })
    }, done)
}
