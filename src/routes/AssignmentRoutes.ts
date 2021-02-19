import { Router } from 'express';
import AssignmentController from '../controllers/assignment/AssignmentController';
import { UserRoles } from '../interfaces';
import { CheckAuth, CheckRole } from '../middleware';
const router = Router();

router.post('/assign/:deviceId/user/:userId', [CheckAuth, CheckRole([UserRoles.Admin])], AssignmentController.AssignDevice);
router.post('/unassign/:deviceId', [CheckAuth, CheckRole([UserRoles.Admin])], AssignmentController.UnAssignDevice);
router.get('/assign/history/:deviceId',[CheckAuth], AssignmentController.AssignHistory)
export default router