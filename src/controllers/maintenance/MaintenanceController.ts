import { RequestHandler, NextFunction } from 'express';
import { MaintenanceStatus, IMaintenance } from '../../interfaces';
import DeviceModels from '../../models/DeviceModels';
import Maintenance from '../../models/MaintenanceModels';
import { InternalError } from '../../utils';

class MaintenanceController {

  private static instance:MaintenanceController;

  private constructor(){}

  public static getInstance=():MaintenanceController => {
    if (!MaintenanceController.instance) MaintenanceController.instance = new MaintenanceController();

    return MaintenanceController.instance;
  }

  public CreateMaintenance: RequestHandler<{ deviceId: string }> = async (request: any, response, next): Promise<void> => {
    const DeviceId: string = request.params.deviceId;
    const CreatedBy = request.userData.userId;
    await this.IsDevice(next, DeviceId);

    try {
      const maintenance = new Maintenance({ DeviceId, UpdatedBy: CreatedBy, CreatedBy, Notes: request.body.Notes, Status: MaintenanceStatus.Pending });
      await maintenance.save();
      response.status(201).json({ message: 'Add maintenance successfully' })
    } catch (err) {
      throw InternalError(next, "Fetching maintenance failed, please try again later.", 500)
    }
  }


  public GetDeviceMaintenanceDetailsById: RequestHandler<{ maintenanceId: string }> = async (request, response, next): Promise<void> => {
    const maintenanceId: string = request.params.maintenanceId;

    await this.IsMaintenance(next, maintenanceId);
    try {
      const maintenance = await Maintenance.find({ _id: maintenanceId }).populate("CreatedBy UpdatedBy", "FirstName LastName").exec();

      response.status(200).json({ Maintenance: maintenance })
    } catch (err) {
      throw InternalError(next, "Fetching maintenance failed, please try again later.", 500)
    }
  }

  public GetDeviceMaintenanceDetailsByDeviceId: RequestHandler<{ deviceId: string }> = async (request, response, next): Promise<void> => {
    const deviceId: string = request.params.deviceId;

    await this.IsDevice(next, deviceId);
    try {
      const maintenance = await Maintenance.find({ DeviceId: deviceId }).populate("CreatedBy UpdatedBy", "FirstName LastName").exec();

      response.status(200).json({ Maintenance: maintenance })
    } catch (err) {
      throw InternalError(next, "Fetching maintenance failed, please try again later.", 500)
    }
  }

  public UpdateMaintenanceStatus: RequestHandler<{ maintenanceId: string }> = async (request: any, response, next): Promise<void> => {
    const maintenanceId: string = request.params.maintenanceId;
    const UpdatedBy = request.userData.userId;

    await this.IsMaintenance(next, maintenanceId);
    try {
      const maintenance: IMaintenance | null = await Maintenance.findOneAndUpdate({ _id: maintenanceId }, { $set: { Status: request.body.Status, UpdatedBy } });

      await maintenance?.save()
      response.status(200).json({ message: "Status Updated SuccessFully", status: request.body.Status })

    } catch (err) {
      throw InternalError(next, "Fetching maintenance failed, please try again later.", 500)
    }
  }


  public UpdateMaintenanceById: RequestHandler<{ maintenanceId: string }> = async (request: any, response, next): Promise<void> => {
    const maintenanceId: string = request.params.maintenanceId;
    const UpdatedBy = request.userData.userId;
    await this.IsMaintenance(next, maintenanceId)
    try {
      const maintenance: IMaintenance | null = await Maintenance.findOneAndUpdate({ _id: maintenanceId },
        { $set: { UpdatedBy, Notes: request.body.Notes } });

      await maintenance?.save()
      response.status(200).json({ message: "Updated SuccessFully" })
    } catch (err) {
      throw InternalError(next, "Fetching maintenance failed, please try again later.", 500)
    }
  }

  public DeleteMaintenanceById: RequestHandler<{ maintenanceId: string }> = async (request: any, response, next): Promise<void> => {
    const maintenanceId: string = request.params.maintenanceId;
    await this.IsMaintenance(next, maintenanceId)
    try {
      await Maintenance.findByIdAndDelete(maintenanceId);
      response.status(200).json({ message: "Deleted SuccessFully" })
    } catch (err) {
      throw InternalError(next, "Fetching maintenance failed, please try again later.", 500)
    }
  }


  private IsMaintenance = async (next: NextFunction, maintenanceId: string): Promise<void> => {
    const maintenance = await Maintenance.findById(maintenanceId)
    if (!maintenance) {
      throw InternalError(next, "Maintenance not found.", 404);
    }
  }

  private IsDevice = async (next: NextFunction, deviceId: string): Promise<void> => {
    const device = await DeviceModels.findById(deviceId);
    if (!device) {
      throw InternalError(next, "Device not found.", 404);
    }
  }

}

export default MaintenanceController.getInstance()