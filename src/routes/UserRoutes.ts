import { Router } from 'express';
import UserController from '../controllers/users/UserController';
import { InputSchema, UserRoles } from '../interfaces';
import { CheckAuth, CheckRole, CheckInputs } from '../middleware';
const router = Router();


router.get('/users', [CheckAuth], UserController.GetUsers);
router.get('/user/:userId', [CheckAuth], UserController.GetUserDetailsById);
router.post('/users', [CheckAuth, CheckRole([UserRoles.Admin]), CheckInputs(InputSchema.CreateUser)], UserController.CreateUser);
router.put('/user/:userId', [CheckAuth, CheckRole([UserRoles.Admin])], CheckInputs(InputSchema.UpdateUser), UserController.UpdateUserById)
router.delete('/user/:userId', [CheckAuth, CheckRole([UserRoles.Admin])], UserController.DeleteUserById);

router.put('/user/roles/:userId', [CheckAuth, CheckRole([UserRoles.Admin])], UserController.UpdateUserRoles)
export default router