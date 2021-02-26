import { Router } from 'express';
import MaintenanceController from '../controllers/maintenance/MaintenanceController';
import { UserRoles, InputSchema } from '../interfaces';
import { CheckAuth, CheckRole, CheckInputs } from '../middleware';
const router = Router();

router.post('/maintenance/:deviceId', [CheckAuth,
  CheckRole([UserRoles.Admin, UserRoles.Maintainer]), CheckInputs(InputSchema.Maintenance)],
  MaintenanceController.CreateMaintenance);


router.get('/maintenance/general/:maintenanceId', [CheckAuth], MaintenanceController.GetDeviceMaintenanceDetailsById);

router.put('/maintenance/status/:maintenanceId',
  [CheckAuth, CheckRole([UserRoles.Admin, UserRoles.Maintainer]), CheckInputs(InputSchema.MaintenanceStatus)],
  MaintenanceController.UpdateMaintenanceStatus)


router.put('/maintenance/:maintenanceId', [CheckAuth,
  CheckRole([UserRoles.Admin, UserRoles.Maintainer]), CheckInputs(InputSchema.Maintenance)],
  MaintenanceController.UpdateMaintenanceById);

router.delete('/maintenance/:maintenanceId', [CheckAuth, CheckRole([UserRoles.Admin, UserRoles.Maintainer])], MaintenanceController.DeleteMaintenanceById);


router.get('/maintenance/:deviceId', [CheckAuth], MaintenanceController.GetDeviceMaintenanceDetailsByDeviceId)
export default router