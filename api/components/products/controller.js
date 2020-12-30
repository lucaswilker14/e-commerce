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

}

module.exports = ProductController;