import chai from 'chai';
import superTest from 'supertest';

import recipes from '../models/recipes';
import * as DB from '../components/db';
import server from '../server';

let assert = chai.assert;
let mock_data = require('../../mock_data/data');
let request = superTest(server);

describe("recipes-router", ()=> {

    before((done)=> {
        DB.connect(DB.MODE_TST, ()=>{
            DB.drop((err)=> {
                if (err){
                  return done(err);
                }
                DB.load(mock_data, done);
            });
        });
    });

    describe("GET /api/recipes", ()=> {
        it('should return a list of recipes', (done)=> {
            request
            .get('/api/recipes')
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(200)
            .end((error, res)=>{
                if(error){
                  throw error;
                }
                assert.isNotNull(res.body);
                assert.isArray(res.body.recipes);
                assert.lengthOf(res.body.recipes, 2);
                assert.isFalse(res.body.hasMore);
                done();
            });
        });
    });


    describe('POST /api/recipes', ()=>{
        it('should create a new recipe', (done)=>{
            let recipe = {
                  name:'Atun con chipotle',
                  prep_time:'15 min',
                  servings: '2',
                  ingredients: [
                                {amount: '1 lata'           ,name:'Atun en agua'},
                                {amount: '1/2'              ,name: 'Cebolla'},
                                {amount: '1 cucharada'      ,name: 'Mayonesa'},
                                {amount: '1/2 lata'         ,name: 'granos de elote'},
                                {amount: '1/2 lata pequena' ,name: 'chiles chipotle la morena'}
                              ],
                  directions: [
                              "Se pica la media cebolla",
                              "Se pica los chiles chipotle",
                              "Se mezcla todo y se le agrega la mayonesa"
                            ],
                  keywords: [
                              "Atun", "Ensalada de atun", "Healthy"
                            ]
            };
            request
            .post('/api/recipes')
            .send(recipe)
            .expect(201)
            .expect('Location',/recipes/)
            .end((error, res) =>{
                if(error){
                  throw error;
                }
                assert.isNotNull(res.body.id);
                done();
            })
        });
    });


    describe("GET /api/recipes/:id", ()=> {
        it('should return a recipe by id', (done)=> {
            request
            .get('/api/recipes')
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(200)
            .end((error, res)=>{
                  if(error){
                    throw error;
                  }

                  let first_recipe = res.body.recipes.pop();
                  request
                  .get('/api/recipes/'+first_recipe._id)
                  .set('Accept', 'application/json')
                  .expect('Content-Type', /json/)
                  .expect(200)
                  .end((error, res)=>{
                      if(error){
                        throw error;
                      }
                      assert.isNotNull(res.body);
                      assert.strictEqual(first_recipe._id, res.body._id);
                      done();
                  });
            });
        });
    });

    describe("DELETE /api/recipes/:id", ()=> {
        it('should delete a recipe by id', (done)=> {
            request
            .get('/api/recipes')
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(200)
            .end((error, res)=>{
                  if(error){
                    throw error;
                  }

                  let first_recipe = res.body.recipes.pop();
                  request
                  .delete('/api/recipes/'+first_recipe._id)
                  .expect(200, done);
            });
        });
    });


});
