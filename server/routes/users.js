import express from 'express';
import users from '../models/users';

let router = express.Router();

router.route('/users')
.post((req, res)=>{

});

router.route('users/:id')
.get((req, res)=>{

})
.put((req,res)=>{

})
.delete((req,res)=>{

});

export default router;
