import { Document } from 'mongoose';

export interface IDevice extends Document {
  DeviceNumber: string,
  Manufacture: string,
  Model: string,
  Screen: string,
  Processor: string,
  RAM: string,
  PrimaryDriveType: string,
  PrimaryDriveCapacity: string,
  SecondaryDriveCapacity: string,
  OS: string,
  OSVersion: string,
  Notes: string,
  CreatedBy: string
}