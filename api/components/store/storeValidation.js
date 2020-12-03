import { model } from 'mongoose';

const userModel = model('User');
const storeModel = model('Store');

const storeValidation = (id, store) => {
    if( !id || !store ) {
        return true;
    }
}

const userValidation = (user, store) => {
    if (!user || !user.store || !user.role.includes('admin')) {
        return true;
    }
}

const storeFieldsValidation = () => {

}

module.exports = (req, res, next) => {
    const { loja } = req.query;
    const { _id } = req.payload;
    if (!storeValidation(_id, loja)) return res.sendStatus(401);
    userModel.findById(_id).then((user) => {
        if (!userValidation(user, loja)) return res.sendStatus(401);
        next();
    }).catch(next)

};
