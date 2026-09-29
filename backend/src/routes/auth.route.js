import Router from 'express';
import {registerValidator, loginValidator} from '../validators/auth.validator.js'
import {register, login} from '../controllers/auth.controller.js'

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


export default router;