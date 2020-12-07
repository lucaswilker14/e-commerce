import { model } from 'mongoose';
const clientModel = model('Client');
const userModel = model('User');


class ClientController {

    //admin
    async index(req, res, next) {
        try {
            const offset = Number(req.query.offset) || 0;
            const limit = Number(req.query.limit) || 30;
            const clients = await clientModel.paginate({ store: req.query.loja }, {offset, limit, populate: "User"});
            return res.send({ clients });
        }catch(e) {
            next(e);
        }
    };

    async searchOrders() {

    }

    async searchClient(req, res, next) {
        try {
            const offset = Number(req.query.offset) || 0;
            const limit = Number(req.query.limit) || 30;
            const search = new RegExp(req.params.id, 'i');
            const clients = await clientModel.paginate({ store: req.query.loja, name: { $regex: search } }, {offset, limit, populate: "User"});
            return res.send({ clients });
        }catch(e) {
            next(e);
        }
    }

    async getAdmin(req, res, next) {
        try {
            const client = await clientModel.findOne({ _id: req.params.id, loja: req.query.loja }).populate("user");
            return res.send({ admin: client });
        }catch(e) {
            next(e)
        }
    };

    async getAllOrderClients() {

    }

    async update(req, res, next) {
        try {
            const { name, cpf, email, phones, address, dateOfBirth } = req.body
            const client = clientModel.findOnde(req.params.id).populate('User');
            if (name) {
                client.user.name    = name;
                client.name         = name;
            }
            if (email) client.user.email        = email;
            if (phones) client.phones           = phones;
            if (address) client.address         = address;
            if (dateOfBirth) client.dateOfBirth = dateOfBirth;
            await client.user.save();
            await client.save();
            return res.send({client, message: 'Cliente Atualizado!'});

        } catch(e) {
            next(e);
        }
    }

}

module.exports = ClientController;