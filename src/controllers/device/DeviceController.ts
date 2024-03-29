import { Request, NextFunction, RequestHandler, Response } from 'express';
import Device from '../../models/DeviceModels';
import { InternalError } from '../../utils';
import { IDevice } from '../../interfaces';
class DeviceController {
  private static instance:DeviceController;

  private constructor(){}

  public static getInstance=():DeviceController => {
    if (!DeviceController.instance) DeviceController.instance = new DeviceController();

    return DeviceController.instance;
  }
  
  public GetDevices: RequestHandler = async (request, response, next): Promise<void> => {
    try {
      const devices = await Device.find().populate("CreatedBy", "FirstName LastName").exec();
      response.json({ devices });
    } catch (err) {
      throw InternalError(next, "Fetching devices failed, please try again later.", 500)
    }
  }

  public GetDeviceDetailsById: RequestHandler = async (request, response, next): Promise<void> => {
    let deviceId = request.params.deviceId;
    try {
      await this.IsDevice(next, deviceId);

      const result = await Device.findById(deviceId).populate('CreatedBy', "-Password -Role").exec();
      if (result) {
        response.status(200).json({ device: result.toObject({ getters: true }) })
      }

    } catch (err) {
      throw InternalError(next, "Fetching devices failed, please try again later.", 500);
    }
  }

  public CreateDevice = async (request: Request | any, response: Response, next: NextFunction) => {
    const deviceInformation = { ...request.body };

    try {
      const device = new Device({ ...deviceInformation, CreatedBy: request.userData.userId });
      await device.save();
    } catch (error) {
      throw InternalError(next, "Could not create device, please try again.", 500)
    }

    response.status(201).json({ message: 'Device Created Successfully', status: 201 })
  }

  public UpdateDeviceById: RequestHandler = async (request, response, next): Promise<void> => {
    let deviceId = request.params.deviceId;
    const deviceInformation: IDevice = { ...request.body };
    let device: IDevice | null
    try {
      device = await Device.findById(deviceId)
    } catch (error) {
      throw InternalError(next, "Could not update device, please try again.", 500)
    }
    if (device) {
      device.DeviceNumber = deviceInformation.DeviceNumber;
      device.Manufacture = deviceInformation.Manufacture;
      device.Model = deviceInformation.Model;
      device.Screen = deviceInformation.Screen;
      device.Processor = deviceInformation.Processor;
      device.RAM = deviceInformation.RAM;
      device.PrimaryDriveType = deviceInformation.PrimaryDriveType;
      device.PrimaryDriveCapacity = deviceInformation.PrimaryDriveCapacity;
      device.SecondaryDriveCapacity = deviceInformation.SecondaryDriveCapacity;
      device.OS = deviceInformation.OS;
      device.OSVersion = deviceInformation.OSVersion;
      device.Notes = deviceInformation.Notes;
      await device.save();
      response.status(200).json({ message: 'Device updated successfully', status: 200 })
    } else {
      throw InternalError(next, "Could not find this device, please try again", 404)
    }
  }

  public DeleteDeviceById: RequestHandler = async (request, response, next): Promise<void> => {
    let deviceId = request.params.deviceId;
    try {
      await this.IsDevice(next, deviceId);

      const result = await Device.findByIdAndDelete(deviceId);
      if (result) {
        response.status(200).json({ message: 'Device deleted' })
      }
    } catch (err) {
      throw InternalError(next, "Fetching devices failed, please try again later.", 500);
    }
  }


  private IsDevice = async (next: NextFunction, deviceId: string): Promise<void | IDevice> => {
    const device = await Device.findById(deviceId);
    if (!device) {
      throw InternalError(next, "Device not found.", 404);
    }
    return device
  }
}

export default DeviceController.getInstance()