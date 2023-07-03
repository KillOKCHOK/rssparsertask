var express = require('express');
var router = express.Router();
var postsdao = require('../db/postsdao');
const logger  = require("../tools/logger");
const authenticateToken = require('../security/jwtmiddleware');
const jwt = require('jsonwebtoken');


/* Get users listing. */
router.get('/', async function(req, res, next) {
  let parsed = parseInt(req.query.page, 10);
  if(isNaN(parsed)) parsed = 1;
  let orderBy = req.query.orderBy;
  try{
    let result = await postsdao.getAllPosts(req.query.title, parsed, orderBy);
    let numOfRows = await postsdao.countAllPosts(req.query.title);
    res.send({
      posts:result.rows,
      numOfRows:numOfRows.rows[0].count,
      page:parsed
    });
  } catch (error) {
    logger.error(error);
    res.status(500).send("Internal Server Error");
  }
});

/* Get users by id. */
router.get('/:id', async function(req, res, next) {
  try{
    let result = await postsdao.getPostById(req.params.id);
    res.send(result.rows);
  } catch (error) {
    logger.error(error);
    res.status(500).send("Internal Server Error");
  }
});

/* Post users listing. */
router.post('/', async function(req, res, next) {
  try {
    let result = await postsdao.addPost(req.body.title, req.body.description, req.body.link, req.body.author, req.body.published, req.body.created, req.body.category);
    res.send(result.rows);
  } catch (error) {
    logger.error(error);
    res.status(500).send("Internal Server Error");
  }
});

/* Put users listing. */
router.put('/', authenticateToken, async function(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.substring(7,authHeader.length);
    let payload = jwt.decode(token);
    if(payload){
      if(payload.roles.includes("ADMIN")){
        try {
          let result = await postsdao.updatePost(req.body.id, req.body.title, req.body.description, req.body.link, req.body.author, req.body.published, req.body.created, req.body.category);
          res.send(result.rows);
        } catch (error) {
          logger.error(error);
          res.status(500).send("Internal Server Error");
        }
      }
      else{
        res.status(403).send("Access denied");
      };
    }else{
      res.status(403).send("Access denied");
    }
});

/* Delete users listing. */
router.delete('/:id', authenticateToken, async function(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.substring(7,authHeader.length);
    let payload = jwt.decode(token);
    if(payload){
      if(payload.roles.includes("ADMIN")){
        try{
          let result = await postsdao.removePost(req.params.id);
          res.send(result.rows);
        } catch (error) {
          logger.error(error);
          res.status(500).send("Internal Server Error");
        }
      }
      else{
        res.status(403).send("Access denied");
      };
    }else{
      res.status(403).send("Access denied");
    }
});

module.exports = router;
