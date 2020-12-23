import { model } from 'mongoose'
const categoryModel = model('Category');


class CategoryController {

    async index(req, res, next) {
        try {
            const all_categories_by_store = await categoryModel.find({ store: req.query.loja })
                .select('_id products name code store');
            if (!all_categories_by_store) return res.send({error: 'Não possui categorias para essa loja!'})
                .status('404');
            return res.send({categories: all_categories_by_store}).status('200');
        } catch (e) {
            next(e)
        }
    };

    async getAvailable(req, res, next) {
        try {
            const categories = await categoryModel.find({ store: req.query.loja, available: true})
                .select('_id products name code store');
            if (!categories) return res.send({error: 'Não possui categorias disponíveis!'}).status('404');
            return res.send({available: categories}).status('200');
        } catch (e) {
            next(e)
        }
    };

    async getCategoryByID(req, res, next) {
        try {
            const category = await categoryModel.findOne({ store: req.query.loja, _id: req.params.id })
                .select('_id products name code store')
                .populate(['products']);
            if (!category) return res.send({error: 'Nenhuma categoria encontrada'}).status('404');
            return res.send({ category: category }).status('404');
        } catch (e) {
            next(e)
        }
    };

    async createCategory(req, res, next) {
        try {

        } catch (e) {
            next(e)
        }
    };

    async update(req, res, next) {
        try {

        } catch (e) {
            next(e)
        }
    };

    async delete(req, res, next) {
        try {

        } catch (e) {
            next(e)
        }
    };
}

module.exports = CategoryController;