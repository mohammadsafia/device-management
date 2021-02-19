import { Router } from 'express';
import UserController from '../controllers/users/UserController';
import { UserRoles } from '../interfaces';
import { CheckAuth, CheckRole } from '../middleware';
const router = Router();


router.get('/users', [CheckAuth], UserController.GetUsers);
router.get('/user/:userId', [CheckAuth], UserController.GetUserDetailsById);
router.post('/users', [CheckAuth, CheckRole([UserRoles.Admin])], UserController.CreateUser);
router.put('/user/:userId', [CheckAuth, CheckRole([UserRoles.Admin])], UserController.UpdateUserById)
router.delete('/user/:userId', [CheckAuth, CheckRole([UserRoles.Admin])], UserController.DeleteUserById);

export default router