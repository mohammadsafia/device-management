import { Router } from 'express';
import DeviceController from '../controllers/device/DeviceController';
import { CheckAuth, CheckRole } from '../middleware';
const router = Router();

router.get('/device', [CheckAuth], DeviceController.GetDevices);
router.post('/device', [CheckAuth, CheckRole], DeviceController.CreateDevice);
router.put('/device/:deviceId', [CheckAuth, CheckRole], DeviceController.UpdateDeviceById);
router.delete('/device/:deviceId', [CheckAuth, CheckRole], DeviceController.DeleteDeviceById);
router.get('/device/:deviceId', [CheckAuth], DeviceController.GetDeviceDetailsById)
export default router