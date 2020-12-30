import { model } from 'mongoose';

const productModel = model('Product');
const categoryModel = model('Category');

class ProductController {

    //admin routes
    async newProduct(req, res, next) {
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

    async uploadImages(req, res, next) {
        try {

        } catch (e) {
            next(e)
        }
    };

    async remove(req, res, next) {
        try {

        } catch (e) {
            next(e)
        }
    };

}

module.exports = ProductController;