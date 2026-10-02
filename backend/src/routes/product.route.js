import Router from 'express'
import {createProductValidator} from '../validators/product.validator.js'
import {authenticate, authorizeSeller} from '../middlewares/auth.middleware.js'
import {createProduct, listAllProducts} from '../controllers/product.controller.js'
import upload from '../configs/multer.config.js'
import {parsePriceToJson, parseSizesToJson} from '../middlewares/product.middleware.js'

const router = Router()

/**
 * @method POST
 * @route /api/product
 * @description Create a new product and save it to the database
 * req.body = {title, description, price:{amount, currency},sizes:[{size, stock}], images:[image1,image2,...], seller}
 */
router.post('/', authenticate, authorizeSeller(), upload.array("images"),parsePriceToJson, parseSizesToJson, createProductValidator, createProduct)

/**
 * @method GET
 * @route /api/product/
 * @description Get all products from the database
 * @access public
 */
router.get('/', authenticate, listAllProducts)


export default router;