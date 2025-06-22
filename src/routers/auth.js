import express from 'express';
import { validateBody } from '../middlewares/validateBody.js';
import { createAuthSchema, loginSchema } from '../validation/auth.js';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import { loginController, registerController, logoutController , refreshController} from '../controllers/authController.js';
const router = express.Router();


const parseExpres = express.json();

router.post('/register', parseExpres, validateBody(createAuthSchema), ctrlWrapper(registerController));
router.post('/login', parseExpres, validateBody(loginSchema), ctrlWrapper(loginController));
router.post('/logout', ctrlWrapper(logoutController))
router.post('/refresh', ctrlWrapper(refreshController))
export default router;


