import {Router} from 'express'
import {authenticate} from '../middlewares/auth.middleware.js'
import {addToCartValidator} from '../validators/cart.validator.js'
import {addToCart, getCart} from '../controllers/cart.controller.js'

const router = Router()

/**
 * @method POST
 * @route /api/cart
 * @description Add a product to the users's cart
 * req.body = {productId, quantity, size}
 * @access protected
 */
router.post('/', authenticate, addToCartValidator, addToCart)

/**
 * @method GET
 * @route /api/cart
 * @description Get the user's cart
 * @access protected
 */
router.get('/', authenticate, getCart)
export default router