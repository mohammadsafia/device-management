import { Document } from 'mongoose';

export interface IMaintenance extends Document {
  DeviceId: string;
  CreatedBy: string;
  Notes: string;
}