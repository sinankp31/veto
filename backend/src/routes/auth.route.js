import Router from 'express';
import {registerValidator} from '../validators/auth.validator.js'
import {register} from '../controllers/auth.controller.js'

const router = Router();

/**
 * @POST /api/auth/register
 * @param req Express.Request
 * @param req.body {name,email,password}
 * @response res.status(201) (if succesfull)
 */
router.post('/register',registerValidator,register)


export default router;