import express from 'express';
let router = express.Router();
import * as users from '../models/users';
import errorHandler from '../components/error-handler';
import validator from '../components/validator';

router.route('/authenticate')
.post((req,res)=>{
  let email = req.params.email;
  if(!email || !validate.isValidEmail(email)){
     errorHandler.handleError(res, "Invalid email", "Must provide a valid email address", 400);
  }

  users.findByEmail(emaail, (error, user)=>{
      if(error){
        errorHandler.handleError(res, error.message, "User not found");
      }
  })

});

export default router;
