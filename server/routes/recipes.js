import express from 'express';
import errorHandler from '../components/error-handler';
import recipes from '../models/recipes';
import recipesValidator from './recipes-validator';

let router = express.Router();
router.route('/recipes')
.get((req, res)=>{
    recipes.paginate((docs, hasMore, error)=>{
        if(error){
          errorHandler.handleError(res, error.message, "Failed to retrieve recipes from database")
        }else{
          res.status(200).json(docs);
        }
    });
})
.post(recipesValidator.validateNew, (req, res)=>{
    recipes.create(req.body, (error, slug)=>{
        if(error){
            errorHandler.handleError(res, error.message, "Error saving new recipe");
        }else{
            res.status(201).json({'slug':slug});
        }
    });
});

router.route('/recipes/:id')
.get(recipesValidator.validateId, (req, res)=>{
    recipes.findById(id, (error, recipe)=>{
        if(error){
          errorHandler.handleError(res, error.message, "Failed to retrieve recipe");
        }else{
          res.status(200).json(recipe);
        }
    });
})
.put((req,res)=>{

})
.delete(recipesValidator.validateId, (req, res)=>{
    recipes.remove(id, (error, results)=>{
        if(error){
          errorHandler.handleError(res, error.message, "Failed to delete recipe.");
        }else{
          res.status(200).end();
        }
    });
});

export default router;
