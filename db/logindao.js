var db = require('./pgconnection');

// DAO method to store new user (return new post id)
exports.createAccount =  function (login, password) {
    try {
        return db.query('INSERT INTO public.users (login, password) VALUES($1,$2) RETURNING id',[login, password]);
    } catch (error) {
        return error;
    }
};

exports.updatePassword =  function (login, password) {
    try {
        return db.query('UPDATE public.users SET password=$2 WHERE login=$1 RETURNING id',[login, password]);
    } catch (error) {
        return error;
    }
};

exports.getAccountByLogin = function (login) {
    try {
        return db.query('SELECT * from public.users WHERE login=$1',[login],);
    } catch (error) {
        return error;
    }
}

exports.getAllAccounts = function () {
    try {
        return db.query('SELECT * from public.users ');
    } catch (error) {
        return error;
    }
}