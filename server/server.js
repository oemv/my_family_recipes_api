import express from 'express';
import bodyParser from 'body-parser';
import morgan from 'morgan';
import path from 'path';
import jwt from 'jsonwebtoken';
import cors from 'cors';
import expressValidator from 'express-validator';


import * as DB from './components/db';
import authRoutes from './routes/auth';
import userRoutes from './routes/users';
import recipeRoutes from './routes/recipes';
import authenticate from './middleware/auth'

import { MFR_SECRET } from './constants';

DB.connect(DB.MODE_DEV,()=>{
    console.log("Connected to database");
});


let app = express();
let port = process.env.PORT || 8080;
//app.set("secret", MFR_SECRET);

app.use(bodyParser.urlencoded({extended:false}));
app.use(expressValidator());
app.use(bodyParser.json());
app.use(morgan('dev'));
app.use(cors());
app.use(authRoutes);
app.use('/api',[authenticate, userRoutes, recipeRoutes]);

let server = app.listen(port, ()=>{
  console.log("My Family Recipes API running on port:"+port);
});

export default server;
