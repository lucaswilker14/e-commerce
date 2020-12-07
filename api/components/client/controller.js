import { model } from 'mongoose';
const clientModel = model('Client');
const userModel = model('User');


class ClientController {


    // admin methods
    async index(req, res, next) {
        try {
            const offset = Number(req.query.offset) || 0;
            const limit = Number(req.query.limit) || 30;
            const clients = await clientModel.paginate({ store: req.query.loja }, {offset, limit, populate: "User"});
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
            const clients = await clientModel.paginate({ store: req.query.loja, name: { $regex: search } }, {offset, limit, populate: "User"});
            return res.send({ clients });
        }catch (e) {
            next(e);
        }
    }

    async getAdmin(req, res, next) {
        try {
            const client = await clientModel.findOne({ _id: req.params.id, store: req.query.loja }).populate("user");
            if (!client) return res.send({message: "Cliente não encontrado!"});
            return res.send({ admin: client });
        }catch (e) {
            next(e)
        }
    };

    async getAllOrderClients() {

    };

    async updateAdmin(req, res, next) {
        try {
            const { name, CPF, email, phones, address, dateOfBirth } = req.body
            const client = clientModel.findOne(req.params.id).populate('User');
            await this.__updateInfoClient(name, client, email, CPF, phones, address, dateOfBirth);
            return res.send({client, message: 'Admin Atualizado!'});
        } catch (e) {
            next(e);
        }
    };


    // client methods
    async getClient(req, res, next) {
        try {
            const client = await clientModel.findOne({ user: req.payload.id, store: req.query.loja }).populate('User');
            return res.send(client);
        }catch (e) {
            next(e);
        }
    };

    async createInStore(req, res, next) {
        try {
            const { name, email, CPF, phones, address, dateOfBirth, password } = req.body;
            const new_user = new userModel({ name, email, password, store: req.query });
            await new_user.save();
            const new_client = new clientModel({ name, dateOfBirth, CPF, phones, address,
                user: new_user._id, store: req.query });
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
            const client = await clientModel.findById(req.payload.id).populate({path: 'User', select: '+password'});

            if (password) client.user.password  = password;
            await this.__updateInfoClient(name, client, email, CPF, phones, address, dateOfBirth);
            client.user.password = undefined;
            return res.send({client, message: "Cliente Atualizado com Sucesso!"});
        }catch (e) {
            next(e);
        }
    };

    async removeClient(req, res, next) {
        try {
            const client = await clientModel.findById({ user: req.payload.id }).populate({path: 'user', select: '+password'});
            await client.user.remove();
            client.deleted = true;
            await client.user.save();
            await client.save();
            return res.send({message: 'Cliente excluido com sucesso!'})
        }catch (e) {
            next(e);
        }
    }

    async __updateInfoClient(name, client, email, CPF, phones, address, dateOfBirth) {
        if (name) {
            client.user.name = name;
            client.name = name;
        }
        if (email) client.user.email = email;
        if (CPF) client.CPF = CPF;
        if (phones) client.phones = phones;
        if (address) client.address = address;
        if (dateOfBirth) client.dateOfBirth = dateOfBirth;

        await client.user.save();
        await client.save();
    }

}

module.exports = ClientController;