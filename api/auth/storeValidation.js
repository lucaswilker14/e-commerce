import { model } from 'mongoose';

const userModel = model('User');
const storeModel = model('Store');

const storeValidation = (id, store) => {
    if( !id || !store ) {
        return false;
    }
}

const userValidation = (user, store) => {
    if (!user || !user.store || !user.role.includes('admin') || user.store !== store) {
        return false;
    }
}

const storeFieldsValidation = () => {

}

module.exports = (req, res, next) => {
    const { store } = req.query;
    const { _id } = req.payload;
    if (!storeValidation(_id, store)) return res.sendStatus(401);
    userModel.findById(_id).then((user) => {
        if (!userValidation(user, store)) return res.sendStatus(401);
        next();
    }).catch(next)

};
