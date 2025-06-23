import express from 'express';
import { validateBody } from '../middlewares/validateBody.js';
import { createAuthSchema, loginSchema, resetEmailSchema, resetPasswordSchema } from '../validation/auth.js';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import { loginController, registerController, logoutController , refreshController, resetPasswordController,resetEmailController} from '../controllers/authController.js';
const router = express.Router();


const parseExpres = express.json();

router.post('/register', parseExpres, validateBody(createAuthSchema), ctrlWrapper(registerController));

router.post('/login', parseExpres, validateBody(loginSchema), ctrlWrapper(loginController));

router.post('/logout', ctrlWrapper(logoutController));

router.post('/refresh', ctrlWrapper(refreshController));

router.post('/send-reset-email', parseExpres, validateBody(resetEmailSchema), ctrlWrapper(resetEmailController));

router.post('/reset-pwd',parseExpres,validateBody(resetPasswordSchema),ctrlWrapper(resetPasswordController) )


export default router;








