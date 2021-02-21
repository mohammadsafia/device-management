import { RequestHandler } from 'express';
import Maintenance from '../../models/MaintenanceModels';
import { InternalError } from '../../utils';

class MaintenanceController {
  public CreateMaintenance: RequestHandler<{ deviceId: string }> = async (request: any, response, next): Promise<void> => {
    const DeviceId: string = request.params.deviceId;
    const CreatedBy = request.userData.userId;

    try {
      const maintenance = new Maintenance({ DeviceId, CreatedBy, Notes: request.body.Notes });
      await maintenance.save();

      response.status(201).json({ message: 'Add maintenance successfully' })
    } catch (err) {
      throw InternalError(next, "Fetching assignment failed, please try again later.", 500)
    }
  }
  public GetDeviceMaintenanceDetails: RequestHandler<{ deviceId: string }> = async (request: any, response, next): Promise<void> => {
    const DeviceId: string = request.params.deviceId;
    try {
      const maintenance = await Maintenance.find({ DeviceId }).populate("CreatedBy", "FirstName LastName").exec();

      response.status(200).json({ maintenance })
    } catch (err) {
      throw InternalError(next, "Fetching assignment failed, please try again later.", 500)
    }
  }
}

export default new MaintenanceController();