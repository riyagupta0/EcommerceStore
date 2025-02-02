import express from "express"
import formidable from "express-formidable"
const router= express.Router();

//import controllers
import { addProduct , updateProductDetails, removeProduct, fetchProducts, fetchProductsById, fetchAllProduct, addProductReview, fetchTopProducts, fetchNewProducts, filterProducts} from "../controllers/productController.js";

import {authenticate , authorizeAdmin} from "../middlewares/authMiddleware.js"
import checkId from "../middlewares/checkId.js";


router.route('/')
.get(fetchProducts)
.post(authenticate, authorizeAdmin, formidable(), addProduct);

router.route('/allproducts').get(fetchAllProduct);
router.route('/:id/reviews').post(authenticate, checkId, addProductReview);

router.get('/top', fetchTopProducts);
router.get('/new', fetchNewProducts);
router.route('/:id')
.get(fetchProductsById)
.put(authenticate, authorizeAdmin, formidable(), updateProductDetails)
.delete(authenticate, authorizeAdmin , removeProduct);

router.route('/filtered-products').post(filterProducts);


export default router