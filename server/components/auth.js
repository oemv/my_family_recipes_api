import passport from "passport";
import passportLocal from "passport-local";
import passportBasic from "passport-http";
import bCrypt from "bcrypt-nodejs";
import multer from "multer"
import * as users from '../models/users';

let LocalStrategy = passportLocal.Strategy;
let BasicStrategy = passportBasic.BasicStrategy;


export function init() {
    passport.serializeUser((_id, done)=> {
        done(null, _id);
    });
    passport.deserializeUser((_id, done) => {
        users.findById(_id, (error, user)=> {
            done(error, user);
        });
    });

    //BASIC STRATEGY (Simple username and password)
    passport.use(new BasicStrategy({}, (username, password, done)=> {
        process.nextTick(()=> {
            if (!username || username !== process.env.USERNAME) {
                return done(null, false);
            }
            if (password !== process.env.PASSWORD) {
                return done(null, false);
            }
            return done(null, username);
        });
    }));

    //LOCAL STRATEGY - Login
    passport.use('login', new LocalStrategy({passReqToCallback: true}, (req, username, password, done)=> {
        users.findByEmail(username, (error, user)=> {
            if (error) {
                return done(error);
            }
            if (!user) {
                console.log("User not found with username: " + username);
                return done(null, false, req.flash('message', 'User Not found.'));
            }
            if (!isValidPassword(user, password)) {
                console.log("Invalid password");
                return done(null, false, req.flash('message', 'Invalid password!'));
            }
            return done(null, user);
        });
    }));

    //LOCAL STRATEGY - Signup
    passport.use('signup', new LocalStrategy({passReqToCallback: true}, (req, username, password, done)=> {
        let findOrCreateUser = ()=> {
            users.findByEmail(username, (error, user)=> {
                if (error) {
                    console.log("Error in signup: " + error);
                    return done(error);
                }

                //Already exists
                if (user) {
                    console.log('User already exists with username: ' + username);
                    return done(null, false, req.flash('message', "User '"+ username + "' already exists."));
                } else {
                    user = {};
                    user.email = username;
                    user.password = createHash(password);
                    user.display_image = req.param('display_image');
                    user.display_name = req.param('display_name');
                    users.add(user, (addErr, _id) => {
                        if (addErr) {
                            console.log("Error while saving the new user: " + addErr);
                            throw addErr;
                        }
                        console.log('User registration was successful. User id: ' + _id);
                        return done(null, _id);
                    });
                }
            });
        };
        process.nextTick(findOrCreateUser);
    }));
}

export function authorize(request, response, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/sessions/sign_in')
}

export function isAuthenticated(req, res, next){
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/');
}

let isValidPassword = (user, password) => {
    return bCrypt.compareSync(password, user.password);
}

let createHash = (password) => {
    return bCrypt.hashSync(password, bCrypt.genSaltSync(10), null);
}

