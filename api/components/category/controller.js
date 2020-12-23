import { model } from 'mongoose'
const categoryModel = model('Category');


class CategoryController {

    async index(req, res, next) {
        try {
            const category = await categoryModel.find({ store: req.query.loja }).select('_id product name code store');
            return res.send({categories: category}).status('200');
        } catch (e) {
            next(e)
        }
    };

    async getAvailability(req, res, next) {
        try {

        } catch (e) {
            next(e)
        }
    };

    async getCategoryByID(req, res, next) {
        try {

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