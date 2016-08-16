import express from 'express';
import errorHandler from '../components/error-handler';
import recipes from '../models/recipes';
import recipesValidator from './recipes-validator';

let router = express.Router();
router.route('/recipes')
.get((req, res)=>{
    recipes.paginate(( error, recipes, hasMore )=>{
        if( error ){
          errorHandler.handleError(res, error.message, "Failed to retrieve recipes from database")
        }else{
          res.status(200).json({ recipes, hasMore });
        }
    });
})
.post(recipesValidator.validateNew, (req, res)=>{
    recipes.create(req.body, (error, id)=>{
        if(error){
            errorHandler.handleError(res, error.message, "Error saving new recipe");
        }else{
            res.status(201).location('/api/recipes/'+id).json({ id });
        }
    });
});

router.route('/recipes/:id')
.get(recipesValidator.validateId, (req, res)=>{
    recipes.findById(req.params.id, (error, recipe)=>{
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
    recipes.remove(req.params.id, (error, results)=>{
        if(error){
          errorHandler.handleError(res, error.message, "Failed to delete recipe.");
        }else{
          res.status(200).end();
        }
    });
});

export default router;
