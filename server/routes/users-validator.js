import errorHandler from '../components/error-handler';
let usersValidator = {
  validateNew(req, res, next){
      req.checkBody('email', 'Email address must not be empty').notEmpty();
      req.checkBody('email', 'Invalid email address').isEmail();
      req.checkBody('password', 'Password must not be empty').notEmpty();
      req.checkBody('display_image',  'Display name must not be empty').notEmpty();
      errorHandler.checkValidationErrors(req, res);
      return next();
  },
  validateId(req, res, next){
    req.checkParams('id', 'Invalid id').isMongoId();
    errorHandler.checkValidationErrors(req, res);
    return next();
  },
  validateEmail(req, res, next){
    req.checkParams('email', 'Invalid email address').isEmail();
    errorHandler.checkValidationErrors(req, res);
    return next();
  }
}

export default usersValidator;
