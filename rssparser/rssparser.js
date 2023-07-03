
const { parse } = require('rss-to-json');
var postsdao = require('../db/postsdao');
const logger  = require("../tools/logger");

let main = async()=>{
    try {
        var rss = await parse('https://lifehacker.com/rss');
        if(rss.items){
            rss.items.forEach(async element => {
            // check if post exists by id
            let result ={};
            try {
                result=await postsdao.getPostById(element.id);
                if(result.rows[0]){
                    logger.info("Post already exists, id:"+element.id)
                }else{
                    // if no insert the post
                    logger.info("Added post: "+element.id)
                    postsdao.addPostFromRSS(element.id, element.title, element.description, element.link, element.author, new Date(element.published).toUTCString(), new Date(element.created).toUTCString(), element.category);
                }
            } catch (error) {
                logger.error(error);
            }
            });
        }
    } catch (error) {
        logger.error(error);
    }
}
main();