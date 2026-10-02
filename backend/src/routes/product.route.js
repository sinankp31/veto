import Router from 'express'
import {createProductValidator, unlistProductValidator, listProductValidator} from '../validators/product.validator.js'
import {authenticate, authorizeSeller} from '../middlewares/auth.middleware.js'
import {createProduct, listAllProducts, unlistProduct, listProduct, listAllProductsToSeller} from '../controllers/product.controller.js'
import upload from '../configs/multer.config.js'
import {parsePriceToJson, parseSizesToJson} from '../middlewares/product.middleware.js'

const router = Router()

/**
 * @method POST
 * @route /api/product
 * @description Create a new product and save it to the database
 * @access protected
 * req.body = {title, description, price:{amount, currency},sizes:[{size, stock}], images:[image1,image2,...], seller}
 */
router.post('/', authenticate, authorizeSeller(), upload.array("images"),parsePriceToJson, parseSizesToJson, createProductValidator, createProduct)

/**
 * @method GET
 * @route /api/product/
 * @description Get all the published products from the database
 * @access public
 */
router.get('/', authenticate, listAllProducts)

/**
 * @method GET
 * @route /api/product/seller
 * @description Get all the products of the logged in seller from the database
 * @access protected
 */
router.get('/seller', authenticate, authorizeSeller(), listAllProductsToSeller)

/**
 * @method PATCH
 * @route /api/product/unlist/:id
 * @description Unlist a product from the database
 * @access protected
 */
router.patch('/unlist/:id', authenticate, authorizeSeller(), unlistProductValidator, unlistProduct)

/**
 * @method PATCH
 * @route /api/product/list/:id
 * @description List a product from the database
 * @access protected
 */
router.patch('/list/:id', authenticate, authorizeSeller(), listProductValidator, listProduct)


export default router;