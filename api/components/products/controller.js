import { model } from 'mongoose';

const productModel = model('Product');
const categoryModel = model('Category');

class ProductController {

    //admin routes
    async newProduct(req, res, next) {
        try {
            const { title, description, price, promotion, sku, category: categoryId } = req.body;
            const { loja } = req.query;
            const new_product = new productModel({  title
                                                    , description
                                                    , price
                                                    , promotion
                                                    , sku
                                                    , category: categoryId
                                                    , store: loja
            });

            const category = await categoryModel.findById(categoryId);
            if (!category || category.lenght === 0) return res.send({error: 'Categoria não Existe!'}).status('400');
            category.products.push(new_product._id);

            await new_product.save();
            await category.save();
            return res.send({ message: "Produto Criado com Sucesso!", product: new_product }).status('201');
        } catch (e) {
            next(e)
        }
    };

    async update(req, res, next) {
        // const { title, available, description, price, promotion, sku, category: categoryId } = req.body;
        try {
            const product = await productModel.findById(req.params.id);
            if (!product) return res.send({ error: 'Produto não encontrado!' }).status('400');
            await ProductController._updateProduct(product, req.body);
        } catch (e) {
            next(e)
        }
    };

    async uploadImages(req, res, next) {
        try {
            const { loja } = req.query;
            const product = await productModel.findOne({ _id: req.params.id, store: loja });
            if (!product) return res.send({ error: 'Produto não encontrado!' }).status('400');

            const new_images = req.files.map(item => item.filename);
            product.images = product.images.filter(item => item).concat(new_images);
            await product.save();
            return res.send({ message: 'Upload Concluído', product: product });

        } catch (e) {
            next(e)
        }
    };

    async remove(req, res, next) {
        try {
            const product = await productModel.findById(req.params.id);
            if (!product) return res.send({ error: 'Produto não encontrado!' }).status('400');

            const category = await categoryModel.findById(product.category);
            if (!category) return res.send({ error: 'Categoria não encontrada!' }).status('400');
            else {
                category.products = category.products.filter(item => item !== product._id);
                await category.save();
            }
            await product.remove();
            return res.send({ message: "Produto deletado!"})
        } catch (e) {
            next(e)
        }
    };


    //client/visitors routes
    async index(req, res, next) {
        try {

        } catch (e) {
            next(e)
        }
    };

    async getAvailables(req, res, next) {
        try {

        } catch (e) {
            next(e)
        }
    };

    async getSearch(req, res, next) {
        try {

        } catch (e) {
            next(e)
        }
    };

    async getAvailableByID(req, res, next) {
        try {

        } catch (e) {
            next(e)
        }
    };

    static async _updateProduct(product, req_body) {
        const { title, available, description, price, promotion, sku, category: categoryId } = req_body;
        if (title) product.title                        = title
        if (available !== undefined) product.available  = available
        if (description) product.description            = description
        if (price) product.price                        = price
        if (promotion) product.promotion                = promotion
        if (sku) product.sku                            = sku

        if (product.category.toString() !== categoryId.toString()) {
            const oldCategory = await categoryModel.findById(product.category);
            const newCategory = await categoryModel.findById(categoryId);

            if (oldCategory && newCategory) {
                oldCategory.products = newCategory.products.filter(item => item !== product._id);
                newCategory.products.push(product._id);
                product.category = categoryId;
                await oldCategory.save();
                await newCategory.save();
            }else if (newCategory) {
                newCategory.products.push(product._id);
                product.category = categoryId;
                await newCategory.save();
            }
        }
        await product.save();
        return res.send({ message: 'Produto Atualizado com Sucesso!', product: product });
    };
}

module.exports = ProductController;