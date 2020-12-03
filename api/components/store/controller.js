import { model } from 'mongoose';
const storeModel = model('Store');

class StoreController {

    index(req, res, next) {
        storeModel.find({}).select('_id name CNPJ email phones address')
            .then(stores => res.send({stores}))
            .catch(next);
    };

    getStoreById(req, res, next) {
        storeModel.findById(req.params.id)
            .select('_id name CNPJ email phones address')
            .then(store => res.send({store}))
            .catch(next);
    };

    registerStore(req, res, next) {
        const { name, CNPJ, email, phones, address } = req.body;
        const new_store = new storeModel ({name, CNPJ, email, phones, address});
        new_store.save()
            .then(() =>  res.send({new_store}))
            .catch(next);
    };

    update(req, res, next) {
        const { name, CNPJ, email, phones, address } = req.body;
        storeModel.findById(req.params.id)
            .then(store => {
                store.name = name;
                store.email = email;
                store.save()
                    .then(() =>  res.send({store}))
                    .catch(next);
            })
            .catch(next)
    };

    remove(req, res, next) {
        storeModel.findById(req.params.id)
            .then(store => {
               store.remove()
                   .then(() => res.send({message: 'Sua Loja foi excluída com sucesso!'}))
                   .catch(next)
            })
            .catch(next);
    };
}

module.exports = StoreController;