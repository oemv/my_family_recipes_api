import mongo from 'mongodb';
import * as DB from '../components/db';
import slug from '../components/slug-generator';
import {LATEST_RECIPES_NUMBER} from "../constants";

let objectId = mongo.ObjectID;

const COLLECTION = "recipes";

let recipes = {
  paginate(callback) {
      let collection = DB.getDB().collection(COLLECTION),
          sortBy = {
              created_on: -1
          };
      collection.find().sort(sortBy).limit(LATEST_RECIPES_NUMBER + 1).toArray((error, docs)=> {
          let hasMore = docs.length > LATEST_RECIPES_NUMBER;
          if (hasMore) {
              docs.pop()
          }
          callback(docs, hasMore, error);
      });
  },
  create(recipe, callback) {
      let collection = DB.getDB().collection(COLLECTION),
          doc = {
              name: recipe.name,
              created_on: new Date(),
              updated_on: new Date(),
              slug: slug(recipe.name),
              prep_time: recipe.prep_time,
              servings: recipe.servings,
              ingredients: recipe.ingredients,
              directions: recipe.directions,
              keywords: recipe.keywords,
              images: [],
              videos:[],
              comments:[]
          };
      collection.insertOne(doc, (error, response)=> {
          callback(error, response.ops[0].slug);
      });
  },
  findBySlug(slug, callback) {
      let collection = DB.getDB().collection(COLLECTION);
      let query = {slug};
      collection.find(query).limit(1).next((error, doc)=> {
          callback(error, doc);
      });
  },
  findById(id, callback) {
      let collection = DB.getDB().collection(COLLECTION);
      let query = {'_id': new objectId(id)};
      collection.find(query).next((error, doc)=> {
          callback(error, doc);
      });
  },
  remove(id, callback) {
      let collection = DB.getDB().collection(COLLECTION);
      let query = {'_id': new objectId(id)};
      collection.deleteOne( query, (error, results)=>{
        if(typeof callback === "function"){
            callback(error, results);
        }
      });
  },
  addComment(comment, user, callback) {
      let collection = DB.getDB().collection(COLLECTION),
          findQuery = {
              'slug': comment.slug
          },
          updateQuery = {
              '$push': {
                  'comments': {
                      id: new objectId(),
                      comment: comment.body,
                      created_on: new Date(),
                      user: {
                          id: new objectId(user.uid),
                          display_name: user.display_name,
                          image_url: user.image
                      }
                  }
              }
          },
          options = {
              projection: {
                  comments: {
                      $slice: -1
                  },
                  _id: 1
              },
              returnOriginal: false
          };

      collection.findOneAndUpdate(findQuery, updateQuery, options, (error, doc) => {
          callback( doc , error );
      });
  },
  editComment(comment, user,  callback) {
      let collection = DB.getDB().collection(COLLECTION),
          commentId = new objectId(comment.id),
          currentUserId = new objectId(user.uid),
          findQuery = {
              comments: {
                  $elemMatch: {
                      id: commentId,
                      'user.id': currentUserId
                  }
              }
          },
          options = {
              returnOriginal: false
          },
          updateQuery = {
              $set: {
                  'comments.$.comment': comment.body
              }
          };
      collection.findOneAndUpdate(findQuery, updateQuery, options, (error, doc)=> {
          if (error) {
              callback(error);
          }
          callback( doc, error);
      });
  },
  deleteComment(args, callback) {
      let collection = DB.getDB().collection(COLLECTION),
          commentId = new objectId(args.commentId),
          currentUserId = new objectId(args.userId),
          findQuery = {
              comments: {
                  $elemMatch: {
                      id: commentId,
                      'user.id': currentUserId
                  }
              }
          },
          updateQuery = {
              $pull: {
                  comments: {
                      id: commentId
                  }
              }
          };

      collection.findOneAndUpdate(findQuery, updateQuery, (error)=> {
          callback(error);
      });
  }
}

export default recipes;
