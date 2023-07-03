var db = require('./pgconnection');

exports.addUserRole = async function (user_id, role_id) {
    try {
        return db.query('INSERT INTO public.user_role ( user_id, role_id) VALUES($1,$2) RETURNING id',[user_id, role_id]);
    } catch (error) {
        return error;
    }
}
exports.removeUserRole = async function (user_id, role_id) {
    try {
        return db.query("DELETE FROM public.user_role WHERE user_id=$1 and role_id=$2",[user_id, role_id]);
    } catch (error) {
        return error;
    }
}
exports.getRolesByUserId = async function (user_id) {
    try {
        return db.query('SELECT * from public.user_role WHERE user_id=$1',[user_id]);
    } catch (error) {
        return error;
    }
}
exports.getRolesById = async function (id) {
    try {
        return db.query('SELECT * from public.roles WHERE id=$1',[id]);
    } catch (error) {
        return error;
    }
}