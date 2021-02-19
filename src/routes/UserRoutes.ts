import { Router } from 'express';
import UserController from '../controllers/users/UserController';
import { CheckAuth, CheckRole } from '../middleware';
const router = Router();


router.get('/users', [CheckAuth], UserController.GetUsers);
router.get('/user/:userId', [CheckAuth], UserController.GetUserDetailsById);
router.post('/users', [CheckAuth, CheckRole], UserController.CreateUser);
router.put('/user/:userId', [CheckAuth, CheckRole], UserController.UpdateUserById)
router.delete('/user/:userId', [CheckAuth, CheckRole], UserController.DeleteUserById);

export default router