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
        DB.connect(DB.MODE_TST, done);
    });

    beforeEach((done)=> {
        DB.drop((err)=> {
            if (err) return done(err);
            DB.load(mock_data, done);
        })
    });

    describe("/api/recipes", ()=> {
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
              assert.isArray(res.body);
              assert.lengthOf(res.body,2);
              done();
          });
        });
    });


});
