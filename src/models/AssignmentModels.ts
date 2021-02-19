import mongoose, { Schema } from 'mongoose';
import { IAssignment } from './../interfaces';

const AssignmentSchema: Schema = new Schema({
  DeviceId: { type: Schema.Types.ObjectId, ref: "Device" },
  UpdatedBy: { type: Schema.Types.ObjectId, ref: "User" },
  AssignmentTo: { type: Schema.Types.ObjectId, ref: "User" },
  AssignmentFrom: { type: Schema.Types.ObjectId, ref: "User" },
}, { timestamps: { createdAt: 'CreatedDate', updatedAt: 'UpdatedDate' } });

export default mongoose.model<IAssignment>('Assignment', AssignmentSchema);