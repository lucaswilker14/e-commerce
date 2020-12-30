import { Router } from 'express';
import ProductController from '../../components/products/controller';
import { isAdmin } from '../store/storeValidation'

import { createValidator } from "express-joi-validation";
import auth from '../../auth/auth';
import upload from '../../config/multer'

const router            = Router();
const productController = new ProductController();
const validator         = createValidator({passError: true});

//admin
router.post('/', auth.required, isAdmin, ProductController.newProduct);
router.put('/:id', auth.required, isAdmin, ProductController.update);
router.put('/images/:id', auth.required, isAdmin, upload.array('files', 4),
    ProductController.uploadImages)
router.delete('/:id', auth.required, isAdmin, ProductController.remove);


//client/visitors

//variations

//ratings


module.exports = router