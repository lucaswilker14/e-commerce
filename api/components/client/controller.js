import { model } from 'mongoose';
const clientModel   = model('Client');
const userModel     = model('User');
const storeModel    = model('Store');


class ClientController {


    // admin methods
    async index(req, res, next) {
        try {
            const offset = Number(req.query.offset) || 0;
            const limit = Number(req.query.limit) || 30;
            const clients = await clientModel.paginate({ store: req.query.loja }, {offset, limit, populate: "user"});
            if (!clients) return res.send({message: "Algo estranho aconteceu!"});
            return res.send({ clients });
        }catch (e) {
            next(e);
        }
    };

    async searchOrders() {

    };

    async searchClient(req, res, next) {
        try {
            const offset = Number(req.query.offset) || 0;
            const limit = Number(req.query.limit) || 30;
            const search = new RegExp(req.params.search, 'i');
            const clients = await clientModel.paginate({ store: req.query.loja, name: { $regex: search } }, {offset, limit, populate: "user"});
            return res.send({ clients });
        }catch (e) {
            next(e);
        }
    }

    async getAdmin(req, res, next) {
        const client_id = req.params.id
        try {
            const client = await clientModel.findOne({ user: client_id, store: req.query.loja }).populate("user");
            if (!client) return res.send({message: "Cliente não encontrado!"});
            return res.send({ client: client });
        }catch (e) {
            next(e)
        }
    };

    async getAllOrderClients() {

    };

    async updateAdmin(req, res, next) {
        try {
            const { name, CPF, email, phones, address, dateOfBirth, password } = req.body
            const client = await clientModel.findOne({_id: req.params.id}).populate({path: "user"});
            if (!client) return res.send({error: "Cliente não Cadastrado!"})
            await ClientController.__updateInfoClient(client, name, email, CPF, phones, address, dateOfBirth, password);
            return res.send({client, message: 'Admin Atualizado!'});
        } catch (e) {
            next(e);
        }
    };


    // client methods
    async getClient(req, res, next) {
        try {
            const client = await clientModel
                .findOne({ user: req.payload._id, store: req.query.loja })
                .populate("user")
            if (!client) return res.send('Cliente não encontrado')
            return res.send({client});
        }catch (e) {
            next(e);
        }
    };

    async createInStore(req, res, next) {
        try {
            if (!await ClientController.__hasStore(req.query.loja)) return res.send({message: 'Id da Loja Inválido'})
                .status('401')
            const { name, email, CPF, phones, address, dateOfBirth, password } = req.body;
            const new_user = new userModel({ name, email, password, store: req.query.loja });
            await new_user.save();
            const new_client = new clientModel({ name, dateOfBirth, CPF, phones, address,
                user: new_user._id, store: req.query.loja });
            await new_client.save();
            return res.send({ client: Object.assign({}, new_client._doc, { email: new_user.email }),
                message: "Cliente Cadastrado com Sucesso!"});
        } catch (e) {
            next(e);
        }
    };

    async updateClient(req, res, next) {
        try {
            const { name, email, CPF, phones, address, dateOfBirth, password } = req.body;
            const client = await clientModel.findOne({user: req.payload._id}).populate({path: "user"});
            if (!client) return res.send({error: 'Cliente não encontrado!'});
            await ClientController.__updateInfoClient(client, name, email, CPF, phones, address, dateOfBirth, password);
            return res.send({client, message: "Cliente Atualizado com Sucesso!"});
        }catch (e) {
            next(e);
        }
    };

    async removeClient(req, res, next) {
        try {
            const client = await clientModel.findOne({ user: req.payload._id })
                .populate({path: "user"});
            if (!client) return res.send({error: 'Cliente não encontrado'}).status('404');
            await client.user.remove();
            client.deleted = true;
            await client.save();
            return res.send({message: 'Cliente excluido com sucesso!'})
        }catch (e) {
            next(e);
        }
    }

    static async __updateInfoClient(client, name, email, CPF, phones, address, dateOfBirth, password) {
        if (name) {
            client.user.name = name;
            client.name = name;
        }
        if (email) client.user.email = email;
        if (CPF) client.CPF = CPF;
        if (phones) client.phones = phones;
        if (address) client.address = address;
        if (dateOfBirth) client.dateOfBirth = dateOfBirth;
        if (password) client.user.password = password

        await client.user.save();
        await client.save();
    }

    static async __hasStore(store_id) {
        try {
            return await storeModel.findById(store_id);
        }catch (e) {
            console.log(e);
        }
    };

}

module.exports = ClientController;