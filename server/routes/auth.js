import express from 'express';
import jwt from 'jsonwebtoken';
import validator from 'validator';

import users from '../models/users';
import errorHandler from '../components/error-handler';
import auth from '../components/auth';

let router = express.Router();

router.route('/authenticate')
.post((req,res)=>{
  let email = req.body.email;
  if(!email || !validator.isEmail(email)){
     errorHandler.handleError(res, "Invalid email", "Must provide a valid email address", 400);
  }

  users.findByEmail(email, (error, user)=>{
      if(error){
          errorHandler.handleError(res, error.message, "Problem retrieving users");
      }else if (user) {
          if(!auth.isValidPassword(user.password, req.body.password)){
            res.json({ success: false, message: 'Authentication failed. Wrong password.' });
          }else{
            let token = jwt.sign(user, app.get('secret'), {
                expiresInMinutes: 1440 // expires in 24 hours
            });
            res.json({
              success: true,
              token: token
            });
          }
      }else{
          errorHandler.handleError(res, "User not found", "Please provide a valid username", 404);
      }
  });
});

export default router;
