import { Router } from 'express';
import AuthController from '../controllers/auth/AuthController';
import { InputSchema } from '../interfaces';
import { CheckInputs } from './../middleware/CheckInputs';
const router = Router();

router.post('/sign-up', [CheckInputs(InputSchema.CreateUser)], AuthController.SignUp);
router.post('/sign-in', [CheckInputs(InputSchema.Login)], AuthController.SignIn)
export default router