import { Document } from 'mongoose';

export interface IAssignment extends Document {
  DeviceId: string;
  UpdatedBy: string;
  AssignTo: string;
}


export enum AssignmentType {
  Assign = "Assign",
  UnAssign = "UnAssign"
}