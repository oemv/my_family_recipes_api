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
            res.status(201).location('/api/users/'+id).json({'id':id});
        }
    });
});

router.route('users/:id')
.get(usersValidator.validateId, (req, res)=>{
    users.findById(id, (error, user)=>{
        if(error){
          errorHandler.handleError(res, error.message, "Failed to retrieve user");
        }else{
          res.status(200).json(user);
        }
    });
})
.put(usersValidator.validateId, (req, res)=>{

})
.delete(usersValidator.validateId, (req,res)=>{
    users.remove(id, (error, results)=>{
        if(error){
          errorHandler.handleError(res, error.message, "Failed to delete user.");
        }else{
          res.status(200).end();
        }
    });
});

export default router;
