var express = require('express');
var router = express.Router();
var  logindao = require('../db/logindao');
var sha256 = require('sha256');
const logger  = require("../tools/logger");
const jwt = require("jsonwebtoken");

router.post('/', async function(req, res, next) {
    let login = req.body.login;
    let password  = req.body.password ;
    const authHeader = req.headers['authorization'];
    let token = authHeader && authHeader.substring(7,authHeader.length);
    var decoded = jwt.decode(token, {complete: true}).payload;
    let admin = false;
    let userRoles = decoded.roles;
    try{
        for (const element of userRoles) {
            if(element==="ADMIN"){
                admin = true;
            }
        }
        if(admin || req.user.email==login){
            result = await logindao.updatePassword(login, sha256(password));
            res.sendStatus(200);
        }else{
            res.sendStatus(403);
        }
    } catch (error) {
        logger.error(error);
        res.status(500).send("Internal Server Error");
    }
});

module.exports = router;
