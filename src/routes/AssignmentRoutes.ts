import { Router } from 'express';
import AssignmentController from '../controllers/assignment/AssignmentController';
import { UserRoles } from '../interfaces';
import { CheckAuth, CheckRole } from '../middleware';
const router = Router();

router.post('/assign/:deviceId', [CheckAuth, CheckRole([UserRoles.Admin])], AssignmentController.AssignDevice);

export default router