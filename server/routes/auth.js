import express from 'express';
import jwt from 'jsonwebtoken';
import validator from 'validator';

import users from '../models/users';
import errorHandler from '../components/error-handler';
import auth from '../components/auth';
import { MFR_SECRET } from '../constants';

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
            let access_token = jwt.sign(user, MFR_SECRET, {
                expiresIn: (24 * 60 * 60) // expires in 24 hours
            });
            res.json({
              success: true,
              access_token
            });
          }
      }else{
          errorHandler.handleError(res, "User not found", "Please provide a valid username", 404);
      }
  });
});

export default router;
