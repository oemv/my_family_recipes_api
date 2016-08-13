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
            recipes.paginate((docs, hasMore, error)=> {
                if (error) throw error;
                assert.lengthOf(docs, 2);
                done();
            });
        });
    });

    describe("create()", ()=> {
        it("should create a new recipe", (done)=> {
            recipes.create(createMockRecipe("Enchiladas Michoacanas"), ( error, slug ) => {
                if (error) throw error;
                assert.typeOf(slug, 'string');
                assert.isOk(slug);
                done();
            });
        });
    });

    describe("findBySlug()", ()=> {
        it("should find a recipe by slug", (done)=> {
            let slug = 'tacos-al-pastor-aaabbb';
            recipes.findBySlug(slug, (error, doc) => {
                if (error) throw error;
                assert.strictEqual(doc.slug, slug);
                assert.strictEqual(doc.name, "Tacos al pastor");
                done();
            });
        });
    });

    describe("findById()", ()=> {
        it("should find a recipe by id", (done)=> {
            let slug = 'tacos-al-pastor-aaabbb';
            recipes.findBySlug(slug, (error, doc) => {
                if (error) throw error;
                  let _id = doc._id.toString();
                  recipes.findById(_id, (error, recipe)=>{
                    if(error) throw error;
                    assert.isOk(recipe);
                    assert.strictEqual(recipe.name,"Tacos al pastor");
                    done();
                  });
            });
        });
    });

    describe("remove()", ()=> {
        it("should remove a recipe", (done)=> {
            let slug = 'tacos-al-pastor-aaabbb';
            recipes.findBySlug(slug, (error, doc) => {
                if (error) throw error;
                let _id = doc._id.toString();
                recipes.remove(_id, (deleteError, results)=>{
                    if(deleteError) throw deleteError;
                    assert.isNull(deleteError);
                    done();
                });
            });
        });
    });

    describe("addComment()", ()=> {
        it("should add a comment to a recipe", (done)=> {
            let slug = 'tacos-al-pastor-aaabbb';
            let body = 'Deliciosos con una coca';

            let user = {
                "uid": "5747bc291deeed5011d291eb",
                "display_name": "Oscar E. Manriquez",
                "image": "1q2w3e/profile_picture.jpeg"
            };

            let comment = {
                slug,
                body
            };

            recipes.addComment(comment, user, (doc, error)=> {
                assert.isArray(doc.value.comments);
                assert.strictEqual(doc.value.comments[0].comment, comment.body);
                done();
            });
        });
    });

    describe("editComment()", ()=> {
        it("should edit a comment in a recipe", (done)=> {
            let slug = 'tacos-al-pastor-aaabbb';
            let body = 'Comment before edit';

            let user = {
                "uid": "5747bc291deeed5011d291eb",
                "display_name": "Oscar E. Manriquez",
                "image": "1q2w3e/profile_picture.jpeg"
            };

            let comment = {
                slug,
                body
            };

            recipes.addComment(comment, user, (doc, error)=> {
                if(error) throw error;
                let id = doc.value.comments[0].id;
                let edited_comment = {
                     id,
                    body: "Edited comment"
                };
                recipes.editComment(edited_comment, user, (editedDoc, editError)=>{
                    if(editError) throw editError;
                    assert.isArray(editedDoc.value.comments);
                    assert.strictEqual(editedDoc.value.comments[0].comment, "Edited comment");
                    done();
                });
            });
        });
    });

    describe("deleteComment()", ()=>{
       it("should delete a comment", (done)=>{
           let slug = 'tacos-al-pastor-aaabbb';
           let body = 'Temporal comment';

           let user = {
               "uid": "5747bc291deeed5011d291eb",
               "display_name": "Oscar E. Manriquez",
               "image": "1q2w3e/profile_picture.jpeg"
           };

           let comment = {
               slug,
               body
           };

           recipes.addComment(comment, user, (doc, error)=> {
               if(error) throw error;
               let commentId =  '' + doc.value.comments[0].id;

               let args = {
                   commentId,
                   userId: user.uid
               };

               recipes.deleteComment(args, (error)=>{
                   if(error) throw error;
                   recipes.findBySlug(slug, (error, doc) => {
                       if (error) throw error;
                       assert.strictEqual(doc.comments.length, 0);
                       done();
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
