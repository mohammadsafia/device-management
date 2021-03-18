import { NextFunction, RequestHandler } from 'express';
import { InternalError } from '../../utils';
import Device from '../../models/DeviceModels';
import { HttpError } from './../../middleware';
class AssignmentController {
  private static instance:AssignmentController;

  private constructor(){}

  public static getInstance=():AssignmentController => {
    if (!AssignmentController.instance) AssignmentController.instance = new AssignmentController();

    return AssignmentController.instance;
  }
  
  public AssignDevice: RequestHandler<{ deviceId: string, userId: string }> = async (request: any, response, next): Promise<void> => {
    const DeviceId: string = request.params.deviceId;
    const UserId: string = request.params.userId;
    const UpdatedBy: string = request.userData.userId;

    await this.IsDeviceExist(DeviceId, next);

    let device = await Device.findOne({ _id: DeviceId });

    await this.IsDeviceAssigned(DeviceId, next);
    try {
      if (device) {
        device.AssignmentHistory.push({ UpdatedBy, AssignTo: UserId })
        device.save();
      }
      response.status(201).json({ message: 'Device Assigned Successfully' })
    } catch (err) {
      throw InternalError(next, "Fetching assignment failed, please try again later.", 500)
    }
  }

  public UnAssignDevice: RequestHandler<{ deviceId: string }> = async (request: any, response, next): Promise<void> => {
    const DeviceId: string = request.params.deviceId;
    const UpdatedBy = request.userData.userId;

    await this.IsDeviceExist(DeviceId, next);

    let device = await Device.findOne({ _id: DeviceId });

    await this.IsDeviceUnAssigned(DeviceId, next)
    try {
      if (device) {
        device.AssignmentHistory.push({ UpdatedBy, AssignTo: null })
        device.save();
      }
      response.status(200).json({ message: 'Device Un Assigned Successfully', deviceId: DeviceId })
    } catch (err) {
      throw InternalError(next, "Fetching assignment failed, please try again later.", 500)
    }
  }

  public AssignHistory: RequestHandler<{ deviceId: string }> = async (request: any, response, next): Promise<void> => {
    const DeviceId: string = request.params.deviceId;
    try {
      let history = await Device.findOne({ _id: DeviceId }, { _id: 0, AssignmentHistory: 1 },)
        .populate('AssignmentHistory.AssignTo AssignmentHistory.UpdatedBy', { _id: 0, FirstName: 1, LastName: 1 }).exec();

      response.status(200).json({ history })
    } catch (err) {
      throw InternalError(next, "Fetching assignment failed, please try again later.", 500)
    }
  }

  private IsDeviceAssigned = async (DeviceId: string, next: NextFunction) => {
    let device = await Device.findOne({ _id: DeviceId });
    if (device) {
      let AssignmentHistory = device?.AssignmentHistory.slice(-1)[0];
      if (AssignmentHistory.AssignTo !== null)
        throw InternalError(next, "You can't assign this device before unassign it", 400)
    }
  }

  private IsDeviceUnAssigned = async (DeviceId: string, next: NextFunction) => {
    let device = await Device.findOne({ _id: DeviceId });
    if (device) {
      let AssignmentHistory = device?.AssignmentHistory.slice(-1)[0];
      if (AssignmentHistory.AssignTo === null)
        throw InternalError(next, "This Device already unassigned", 400)
    }
  }

  private IsDeviceExist = async (DeviceId: string, next: NextFunction) => {
    let existingDevice;
    try {
      existingDevice = await Device.findOne({ _id: DeviceId });
    } catch (err) {
      const error = new HttpError("Something wrong, please try again later.", 500);
      throw next(error)
    }

    if (!existingDevice) {
      const error = new HttpError("We can't find this device, please try again later.", 404);
      throw next(error)
    }
  }
}


export default AssignmentController.getInstance()