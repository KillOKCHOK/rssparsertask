var express = require('express');
var router = express.Router();
var  logindao = require('../db/logindao');
var  user_roledao = require('../db/user_roledao');
var sha256 = require('sha256');
const logger  = require("../tools/logger");


/* Create new Account */
router.post('/', async function(req, res, next) {
  let email = req.body.email;
  let password  = req.body.password ;
  try {
      let checkIfExists = await logindao.getAccountByLogin(email);
      if(checkIfExists.rows[0]||req.body.email===""||req.body.email==null){
        res.status(409).send("Account already exists, try other login");
      }else{
        let queryResult = await logindao.createAccount(email, sha256(password));
        if(queryResult.rows[0]){
          await user_roledao.addUserRole(queryResult.rows[0].id, 2);
          // next line adds new users admin role for testing purpose, don't use on production
          if(process.env.ADMIN_TO_ALL) await user_roledao.addUserRole(queryResult.rows[0].id, 1);
        }
        res.send(queryResult.rows);
      }
  } catch (error) {
    logger.error(error);
    res.status(500).send("Internal Server Error");
  }
});

module.exports = router;
