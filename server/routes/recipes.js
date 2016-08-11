import express from 'express';
import errorHandler from '../components/error-handler';
import * as recipes from '../models/recipes';

let router = express.Router();
router.route('/recipes')
.get((req, res)=>{
    recipes.paginate((docs, hasMore, error)=>{
        if(error){
          errorHandler(res, error.message, "Failed to retrieve recipes from database")
        }else{
          res.status(200).json(docs);
        }
    });
})
.post((req, res)=>{
    //do some validation
    let newRecipe = req.body;
    //do some validation around the new recipe
    recipes.create(newRecipe, (error, slug)=>{
        if(error){
            errorHandler(res, error.message, "Error saving new recipe");
        }else{
            res.status(201).json({'slug':slug});
        }
    });
});

router.route('recipes/:id')
.get((req, res)=>{
    if(!req.params.id){
       errorHandler(res, "Invalid id", "Must provide a valid id", 400);
    }
    recipes.findById(req.params.id, (error, recipe)=>{
        if(error){
          errorHandler(res, error.message, "Failed to retrieve recipe");
        }else{
          res.status(200).json(recipe);
        }
    });
})
.put((req,res)=>{

})
.delete((req,res)=>{

});

export default router;
