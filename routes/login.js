var express = require('express');
var router = express.Router();
var  logindao = require('../db/logindao');
var  user_roledao = require('../db/user_roledao');
var sha256 = require('sha256');
const logger  = require("../tools/logger");
const jwt = require("jsonwebtoken");

/* Create new Account */
router.post('/', async function(req, res, next) {
  let login = req.body.login;
  let password  = req.body.password ;
  let user = {};
  try {
      let checkIfExists = await logindao.getAccountByLogin(login);
      if(checkIfExists.rows[0]){
        user = checkIfExists.rows[0];
        if(sha256(password)==user.password){
            let userRolesResult = await user_roledao.getRolesByUserId(user.id);
            let roles = [];
            for (const element of userRolesResult.rows) {
                let role = await user_roledao.getRolesById(element.role_id);
                if(role.rows) await roles.push(role.rows[0].role);
            }
            res.status(200)
            .json({
                success: true,
                data: {
                  userId: user.id,
                  email: user.login,
                  token: jwt.sign(
                    { 
                      userId: user.id,
                      email: user.login,
                      roles: roles,
                    },
                    process.env.TOKEN_SECRET,
                    { expiresIn: "10h" }
                  ),
                  expiresInSeconds: 10*60*60
                }
            })
        }else{
            res.status(403).send("Forbidden");
          }
      }else{
        res.status(404).send("User not found");
      }
  } catch (error) {
    logger.error(error);
    res.status(500).send("Internal Server Error");
  }
});

module.exports = router;
