import express from 'express';
import users from '../models/users';
import usersValidator from './users-validator'

let router = express.Router();

router.route('/users')
.post(usersValidator.validateNew, (req, res)=>{
    users.add(req.body, (error, id)=>{
        if(error){
            errorHandler.handleError(res, error.message, "Error saving new user");
        }else{
            res.status(201).location('/api/users/'+id).json({id});
        }
    });
});

router.route('/users/:email')
.get(usersValidator.validateEmail, (req, res)=>{
    users.findByEmail(req.params.email, (error, user)=>{
        if(error){
          errorHandler.handleError(res, error.message, "Failed to retrieve user");
        }else{
          delete user.password;
          res.status(200).json(user);
        }
    });
})
.put(usersValidator.validateEmail, (req, res)=>{

})
.delete(usersValidator.validateEmail, (req,res)=>{
    users.remove(id, (error, results)=>{
        if(error){
          errorHandler.handleError(res, error.message, "Failed to delete user.");
        }else{
          res.status(200).end();
        }
    });
});

export default router;
