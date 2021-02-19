import mongoose, { Schema } from 'mongoose';
import { IMaintenance } from './../interfaces';

const MaintenanceSchema: Schema = new Schema({
  DeviceId: { type: Schema.Types.ObjectId, ref: "Device" },
  CreatedBy: { type: Schema.Types.ObjectId, ref: "User" },
  Notes: { type: String, required: true },
}, { timestamps: { createdAt: 'CreatedDate', updatedAt: 'UpdatedDate' } });

export default mongoose.model<IMaintenance>('Maintenance', MaintenanceSchema);