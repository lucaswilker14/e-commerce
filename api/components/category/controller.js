import { model } from 'mongoose'
const categoryModel = model('Category');


class CategoryController {

    async index(req, res, next) {
        try {
            const all_categories_by_store = await categoryModel.find({ store: req.query.loja })
                .select('_id products name code store');
            if (!all_categories_by_store) return res.send({error: 'Não possui categorias para esse produto!'})
                .status('404');
            return res.send({ categories: all_categories_by_store }).status('200');
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
            const { name, code }    = req.body;
            const { store }         = req.query;
            const category          = new categoryModel({ name, code, store, available:true });
            await category.save();
            return res.send({ message: 'Nova Categoria Criada', new_category: category }).status('201')
        } catch (e) {
            next(e)
        }
    };

    async update(req, res, next) {
        try {
            const { name, code, available, products } = req.body;
            const category = await categoryModel.findById(req.params.id);
            if (name) category.name = name;
            if (code) category.code = code;
            if (available !== undefined) category.available = available;
            if (products) category.products = products;
            await category.save();
            return res.send({message: 'Categoria Atualizada', category: category});

        } catch (e) {
            next(e)
        }
    };

    async remove(req, res, next) {
        try {
            const category = await categoryModel.findById(req.params.id);
            await category.remove();
            return res.send({message: 'Categoria Excluída com Sucesso!', delete: true, available: false});
        } catch (e) {
            next(e)
        }
    };
}

module.exports = CategoryController;