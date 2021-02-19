import { Router } from 'express';
import AuthController from '../controllers/auth/AuthController';
const router = Router();

router.post('/sign-up', AuthController.SignUp);
router.post('/sign-in', AuthController.SignIn)
export default router