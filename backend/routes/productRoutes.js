import express from 'express'
import {protect,admin } from '../middleware/authMiddleware.js'
import { getProductById, getProducts, getTopProducts } from '../controllers/productController.js'
import { deleteProduct,updateProduct,createProduct ,createProductReview} from '../controllers/productController.js'
const router=express.Router()


router.route('/')
.get(getProducts)
.post(protect,admin,createProduct)

router.route('/:id/reviews').post(protect,createProductReview)


router.route('/top').get(getTopProducts)

router.route('/:id')
.get(getProductById)
.delete(protect,admin,deleteProduct)
.put(protect,admin,updateProduct)


export default router