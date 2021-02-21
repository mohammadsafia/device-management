import { Router } from 'express';
import MaintenanceController from '../controllers/maintenance/MaintenanceController';
import { UserRoles, InputSchema } from '../interfaces';
import { CheckAuth, CheckRole, CheckInputs } from '../middleware';
const router = Router();

router.post('/maintenance/:deviceId', [CheckAuth, CheckRole([UserRoles.Admin, UserRoles.Maintainer]), CheckInputs(InputSchema.Maintenance)], MaintenanceController.CreateMaintenance);
router.get('/maintenance/:deviceId', [CheckAuth], MaintenanceController.GetDeviceMaintenanceDetails)
export default router