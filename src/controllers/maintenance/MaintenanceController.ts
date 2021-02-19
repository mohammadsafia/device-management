import { NextFunction, RequestHandler } from 'express';
import Maintenance from '../../models/MaintenanceModels';
import { InternalError } from '../../utils';

class MaintenanceController {
  public CreateMaintenance: RequestHandler<{ deviceId: string, userId: string }> = async (request: any, response, next): Promise<void> => {
    const DeviceId: string = request.params.deviceId;
    const CreatedBy = request.userData.userId;


    try {
      const maintenance = new Maintenance({DeviceId,CreatedBy})
      response.status(201).json({ message: 'Device Assigned Successfully' })
    } catch (err) {
      throw InternalError(next, "Fetching assignment failed, please try again later.", 500)
    }
  }
}

export default new MaintenanceController();