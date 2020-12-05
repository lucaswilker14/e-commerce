import { model } from 'mongoose';
const storeModel = model('Store');

class StoreController {

    registerStore(req, res, next) {
        const { name, CNPJ, email, phones, address } = req.body;
        const new_store = new storeModel ({name, CNPJ, email, phones, address});
        new_store.save()
            .then(() =>  res.send({store: new_store, message: "Cadastrado com Sucesso!"}))
            .catch(next);
    };

    update(req, res, next) {
        const { name, CNPJ, email, phones, address } = req.body;
        storeModel.findById(req.query.loja)
            .then(store => {
                if (!store) return res.send({error: "Loja não existe"}).status(404);
                if (name)       store.name = name;
                if (CNPJ)       store.CNPJ = CNPJ;
                if (email)      store.email = email;
                if (phones)     store.phones = phones;
                if (address)    store.address = address;
                store.save()
                    .then(() =>  res.send({store: store, message: 'Dados Atualizados!'}))
                    .catch(next);
            })
            .catch(next)
    };

    remove(req, res, next) {
        storeModel.findById(req.query.loja)
            .then(store => {
                store.remove()
                    .then(() => res.send({message: 'Sua Loja foi excluída com sucesso!'}))
                    .catch(next)
            })
            .catch(next);
    };

    index(req, res, next) {
        storeModel.find({}).select('_id name CNPJ email phones address')
            .then(stores => res.send({stores}))
            .catch(next);
    };

    getStoreById(req, res, next) {
        storeModel.findById(req.params.id)
            .select('_id name CNPJ email phones address')
            .then(store => {
                if (!store) return res.send({error: "Loja não Encontrada!"}).status(404);
                return res.send({store}).status(200);
            })
            .catch(next);
    };
}

module.exports = StoreController;