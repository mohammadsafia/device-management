import mongoose, { Schema } from 'mongoose';
import { IDevice } from './../interfaces';

const DeviceSchema: Schema = new Schema({
  DeviceNumber: { type: String, required: true },
  Manufacture: { type: String, required: true },
  Model: { type: String, required: true },
  Screen: { type: String, required: true },
  Processor: { type: String, required: true },
  RAM: { type: String, required: true },
  PrimaryDriveType: { type: String, required: true },
  PrimaryDriveCapacity: { type: String, required: true },
  SecondaryDriveCapacity: { type: String, required: true },
  OS: { type: String, required: true },
  OSVersion: { type: String, required: true },
  Notes: { type: String, required: false },
  CreatedBy: { type: Schema.Types.ObjectId, ref: "User" }
}, { timestamps: { createdAt: 'CreatedDate', updatedAt: 'UpdatedDate' } });

export default mongoose.model<IDevice>('Device', DeviceSchema);