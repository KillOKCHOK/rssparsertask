var db = require('./pgconnection');

// DAO method to store new post (return new post id)
exports.addPost =  function ( title, description, link, author, published, created, category) {
    try {
        return db.query('INSERT INTO public.posts ( title, description, link, author, published, created, category) VALUES($1,$2,$3,$4,$5,$6,$7) RETURNING id',[title, description, link, author, published, created, category]);
    } catch (error) {
        return error;
    }
};

exports.addPostFromRSS =  function (id, title, description, link, author, published, created, category) {
    try {
        return db.query('INSERT INTO public.posts ( id,title, description, link, author, published, created, category) VALUES($1,$2,$3,$4,$5,$6,$7,$8) RETURNING id',[id, title, description, link, author, published, created, category]);
    } catch (error) {
        return error;
    }
};

// DAO method to check posts by post id hronously
exports.getPostById =  function (id) {
    try {
        return db.query('SELECT * FROM public.posts WHERE id = $1', [id]);
    } catch (error) {
        return error;
    }
};

exports.getAllPosts  =  function (title='', page=1, orderBy="created") {
    if(page<1)page=1;
    if(orderBy!=="title")orderBy="created";
    try {
        return db.query('SELECT * from public.posts WHERE title like \'%'+title+`%\'
        ORDER BY
        ${orderBy} 
        ${orderBy=="created"?"DESC":"ASC"}
        OFFSET ${(page-1)*10} ROWS 
        FETCH FIRST 10 ROW ONLY
        `);
    } catch (error) {
        return error;
    }
};
exports.countAllPosts  =  function (title='') {
    try {
        return db.query(`
        SELECT 
        COUNT(*) 
        FROM 
        public.posts
        WHERE title like \'%`+title+`%\'`);
    } catch (error) {
        return error;
    }
};

exports.updatePost =  function (id, title, description, link, author, published, created, category) {
    try {
        return db.query('UPDATE public.posts SET title=$2, description=$3, link=$4, author=$5, published=$6, created=$7, category=$8 WHERE id=$1 RETURNING id',[id, title, description, link, author, published, created, category]);
    } catch (error) {
        return error;
    }
};

// DAO method to delete posts by post id hronously
exports.removePost =  function (id) {
    try {
        return db.query("DELETE FROM public.posts WHERE id=$1 RETURNING id",[id]);
    } catch (error) {
        return error;
    }
};



