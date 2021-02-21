import { NextFunction, RequestHandler } from 'express';
import Assignment from '../../models/AssignmentModels';
import { InternalError } from '../../utils';
class AssignmentController {
  public AssignDevice: RequestHandler<{ deviceId: string, userId: string }> = async (request: any, response, next): Promise<void> => {
    const DeviceId: string = request.params.deviceId;
    const UserId: string = request.params.userId;
    const UpdatedBy = request.userData.userId;


    await this.IsDeviceAssigned(DeviceId, next);
    try {
      const assignment = new Assignment({ DeviceId, UpdatedBy, AssignTo: UserId });
      await assignment.save();
      response.status(201).json({ message: 'Device Assigned Successfully' })
    } catch (err) {
      throw InternalError(next, "Fetching assignment failed, please try again later.", 500)
    }
  }

  public UnAssignDevice: RequestHandler<{ deviceId: string }> = async (request: any, response, next): Promise<void> => {
    const DeviceId: string = request.params.deviceId;
    const UpdatedBy = request.userData.userId;

    await this.IsDeviceUnAssigned(DeviceId, next)
    try {
      const assignment = new Assignment({ DeviceId, UpdatedBy, AssignTo: null });
      await assignment.save();
      response.status(201).json({ message: 'Device Assigned Successfully', deviceId: DeviceId })
    } catch (err) {
      throw InternalError(next, "Fetching assignment failed, please try again later.", 500)
    }
  }

  public AssignHistory: RequestHandler<{ deviceId: string }> = async (request: any, response, next): Promise<void> => {
    const DeviceId: string = request.params.deviceId;
    try {
      let assignHistory = await Assignment.find({ DeviceId }).populate("UpdatedBy AssignTo AssignFrom", "FirstName LastName").exec();
      response.status(200).json({ history: assignHistory })
    } catch (err) {
      throw InternalError(next, "Fetching assignment failed, please try again later.", 500)
    }
  }

  private IsDeviceAssigned = async (DeviceId: string, next: NextFunction) => {
    let assignments = await Assignment.find({ DeviceId }).select('AssignTo').slice('array', -1);
    if (assignments && assignments.slice(-1)[0].AssignTo !== null) {
      throw InternalError(next, "You can't assign this device before unassign it", 400)
    }
  }

  private IsDeviceUnAssigned = async (DeviceId: string, next: NextFunction) => {
    let assignments = await Assignment.find({ DeviceId }).select('AssignTo').slice('array', -1);
    if (assignments && assignments.slice(-1)[0]?.AssignTo === null) {
      throw InternalError(next, "This Device already unassigned", 400)
    }
  }
}


export default new AssignmentController();