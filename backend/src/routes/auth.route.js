import Router from 'express';
import {registerValidator, loginValidator} from '../validators/auth.validator.js'
import {register, login, refresh, getMe} from '../controllers/auth.controller.js'
import {authenticate} from '../middlewares/auth.middleware.js'

const router = Router();

/**
 * @POST /api/auth/register
 * @param req Express.Request
 * @param req.body {name,email,password}
 * @response res.status(201) (if succesfull)
 */
router.post('/register',registerValidator,register)

/**
 * @POST /api/auth/login
 * @param req Express.Request
 * @param req.body {email,password}
 * @response res.status(200) (if succesfull)
 */
router.post('/login',loginValidator,login)

/**
 * @POST /api/auth/refresh
 */
router.post('/refresh',refresh)

/**
 * @GET /api/auth/me
 */
router.get('/me', authenticate, getMe)

export default router;