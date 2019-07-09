// This is a unsecure routes just for testing purpose

import User from "../sequelize";
import jwtSecret from "../config/jwtConfig";
import jwt from "jsonwebtoken";
import passport from "passport";

/**
 * @swagger
 * /loginUser:
 *    post:
 *      tags:
 *        - Users
 *      name: Login
 *      summary: Logs in a user
 *      produces:
 *        - application/json
 *      consumes:
 *        - application/json
 *      parameters:
 *        - name: body
 *          in: body
 *          schema:
 *            $ref: '#/definitions/User'
 *            type: object
 *            properties:
 *              username:
 *                type: string
 *              password:
 *                type: string
 *                format: password
 *           required:
 *              - username
 *              - password
 *        responses:
 *          '200':
 *            description: User found and logged in successfully
 *          '401':
 *            description: Bad username, not found in db
 *           '403':
 *            description: Username and password don't match
 */

module.exports = app => {
  app.post("/loginUser", (req, res, next) => {
    passport.authenticate("login", (err, user, info) => {
      if (err) {
        console.log("error");
        console.log(err);
      }
      if (info !== undefined) {
        console.log(info.message);
        if (info.message === "bad username") {
          res.status(401).send(info.message);
        } else {
          res.status(403).send(info.message);
        }
      } else {
        req.logIn(user, err => {
          User.findOne({
            where: {
              username: req.body.username
            }
          }).then(user => {
            const token = jwt.sign({ id: user.id }, jwtSecret.secret);
            res.status(200).send({
              auth: true,
              token: token,
              message: "user found & logged in"
            });
          });
        });
      }
    })(req, res, next);
  });
};
