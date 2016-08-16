import errorHandler from '../components/error-handler';
let recipesValidator = {
  validateNew(req, res, next){
      req.checkBody('name', 'Invalid recipe name').notEmpty();
    //  req.checkBody('name', 'Recipe name must be alphanumeric').isAlphanumeric();
      req.checkBody('ingredients', 'Ingredients list must not be empty').notEmpty();
      req.checkBody('directions',  'Directions list must not be empty').notEmpty();
      errorHandler.checkValidationErrors(req, res);
      return next();
  },
  validateId(req, res, next){
    req.checkParams('id', 'Invalid id').isMongoId();
    errorHandler.checkValidationErrors(req, res);
    return next();
  }
}

export default recipesValidator;
