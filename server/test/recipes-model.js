import chai from 'chai';
import recipes from '../models/recipes';
import * as DB from '../components/db';

let assert = chai.assert;
let mock_data = require('../../mock_data/data');

describe("recipes-model", ()=> {

    before((done)=> {
        DB.connect(DB.MODE_TST, done);
    });

    beforeEach((done)=> {
        DB.drop((err)=> {
            if (err) return done(err);
            DB.load(mock_data, done);
        })
    });

    describe("paginate()", ()=> {
        it('should list all recipes', (done)=> {
            recipes.paginate(( error, docs, hasMore )=> {
                if (error){
                  throw error;
                }
                assert.lengthOf(docs, 2);
                done();
            });
        });
    });

    describe("create()", ()=> {
        it("should create a new recipe", (done)=> {
            recipes.create(createMockRecipe("Enchiladas Michoacanas"), ( error, _id ) => {
                if (error){
                  throw error;
                }
                assert.typeOf(_id, 'string');
                assert.isOk(_id);
                done();
            });
        });
    });

    describe("findById()", ()=> {
        it("should find a recipe by id", (done)=> {
            recipes.paginate((error, docs, hasMore) => {
                if (error){
                  throw error;
                }

                let first_recipe = docs.pop();

                recipes.findById(first_recipe._id.toString(), ( findError, recipe )=>{
                    if( findError ){
                      throw findError;
                    }
                    assert.isOk(recipe);
                    assert.strictEqual(first_recipe._id.toString(), recipe._id.toString());
                    done();
                });
            });
        });
    });

    describe("remove()", ()=> {
        it("should remove a recipe", (done)=> {
            recipes.paginate((error, docs, hasMore) => {
                if (error) {
                  throw error;
                }
                let _id = docs.pop()._id.toString();
                recipes.remove(_id, (deleteError, results)=>{
                    if(deleteError){
                        throw deleteError;
                    }
                    assert.isNull(deleteError);
                    done();
                });
            });
        });
    });

    describe("addComment()", ()=> {
        it("should add a comment to a recipe", (done)=> {
            recipes.paginate((error, docs, hasMore)=>{
                if(error){
                  throw error;
                }

                let recipe_id = docs.pop()._id.toString(),
                body = 'Deliciosos con una coca',
                user = {
                    "uid": "5747bc291deeed5011d291eb",
                    "display_name": "Oscar E. Manriquez",
                    "image": "1q2w3e/profile_picture.jpeg"
                },
                comment = {
                    recipe_id,
                    body
                };

                recipes.addComment(comment, user, (doc, error)=> {
                    assert.isArray(doc.value.comments);
                    assert.strictEqual(doc.value.comments[0].comment, comment.body);
                    done();
                });
            });
        });
    });

    describe("editComment()", ()=> {
        it("should edit a comment in a recipe", (done)=> {
            recipes.paginate((error, docs, hasMore)=>{
                if(error){
                    throw error;
                }

                let recipe_id = docs.pop()._id.toString(),
                body = 'Comment before edit',
                user = {
                    "uid": "5747bc291deeed5011d291eb",
                    "display_name": "Oscar E. Manriquez",
                    "image": "1q2w3e/profile_picture.jpeg"
                },
                comment = {
                    recipe_id,
                    body
                };

                recipes.addComment(comment, user, (doc, addError)=> {
                    if( addError ){
                        throw addError;
                    }

                    let id = doc.value.comments[0].id,
                    edited_comment = {
                        id,
                        body: "Edited comment"
                    };

                    recipes.editComment(edited_comment, user, (editedDoc, editError)=>{
                        if( editError ){
                            throw editError;
                        }
                        assert.isArray(editedDoc.value.comments);
                        assert.strictEqual(editedDoc.value.comments[0].comment, "Edited comment");
                        done();
                    });
                });
            });
        });
    });

    describe("deleteComment()", ()=>{
       it("should delete a comment", (done)=>{
          recipes.paginate((error, docs, hasMore)=>{
              if( error ){
                  throw error;
              }

              let recipe_id = docs.pop()._id.toString(),
              body = 'Temporal comment',
              user = {
                  "uid": "5747bc291deeed5011d291eb",
                  "display_name": "Oscar E. Manriquez",
                  "image": "1q2w3e/profile_picture.jpeg"
              },
              comment = {
                  recipe_id,
                  body
              };

              recipes.addComment(comment, user, (doc, addError)=> {
                  if( addError ){
                     throw addError;
                  }

                  let commentId =  '' + doc.value.comments[0].id,
                  args = {
                      commentId,
                      userId: user.uid
                  };

                  recipes.deleteComment(args, (deleteError)=>{
                      if( deleteError ){
                         throw deleteError;
                      }
                      recipes.findById(recipe_id, (findError, doc) => {
                          if ( findError ){
                              throw findError;
                          }
                          assert.strictEqual(doc.comments.length, 0);
                          done();
                       });
                  });
              });
          });
       });
    });
});


let createMockRecipe = function(name){
  let recipe = {
      "name": name,
      "prep_time": "45 minutes",
      "servings": "5",
      "ingredients": [
          {
              "amount": "1",
              "name": "Ingredient 1"
          },
          {
              "amount": "2",
              "name": "Ingredient 2"
          },
          {
              "amount": "3",
              "name": "Ingredient 3"
          }
      ],
      "directions": [
          "Foo",
          "Bar"
      ],
      "keywords": [
            "kw1",
            "kw2",
            "kw3"
      ]
  };

  return recipe;
};
