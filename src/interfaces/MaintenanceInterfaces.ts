import { Document } from 'mongoose';

export interface IMaintenance extends Document {
  DeviceId: string;
  CreatedBy: string;
  Notes: string;
  UpdatedBy: string,
  Status: MaintenanceStatus
}

export enum MaintenanceStatus {
  Pending = "Pending",
  InProgress = "InProgress",
  Done = "Done"
}