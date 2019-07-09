//  This is a secure route for testing purpose

import User from '../sequelize';
import passport from 'passport';

/**
* @swagger
* /findUser:
*  get:
*    tags:
*      - Users
*    name: Find User
*    summary: Finds a User
*    security:
*      - bearerAuth: []
*    consumes:
*      - application/json
*    produces:
*      - application/json
*    parameteres:
*      - in: query
*        name: username
*        schema:
*          type: string
*        required:
*          - username
*    responses:
*      200:
*        description: A single user Object
*        schema:
*          $ref: "#/definitions/User"
*      401:
*        description: No auth token
* 
 */

module.exports =  app => {
  app.get('/findUser', (req, res, next) => {
    passport.authenticate('jwt', { session: false }, (err, user, info) => {
      if(err){
        console.log(err);
      }
      if(info !== undefined){
        console.log(info.message);
        res.status(401).send(info.message);
      }else {
        User.findOne({
          where: {
            username: req.query.username,
          },
        }).then( user => {
          if(user !== null){
            console.log('user found in db from findUsers');
            const {first_name, last_name, email, username, password } = user; 
            res.status(200).send({
              auth: true,
              first_name, 
              last_name, 
              email, 
              username, 
              password,
              message: 'user found in db'
            });
          }else {
            console.log('no users exists in db with that username');
            res.status(401).send('no user exists in db with that username');
          }
        });
      }
    })(req, res, next);
  });
};