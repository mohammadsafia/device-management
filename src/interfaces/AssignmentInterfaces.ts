import { Document } from 'mongoose';

export interface IAssignment extends Document {
  DeviceId: string;
  UpdatedBy: string;
  AssignmentTo: string;
  AssignmentFrom: string;
}


export enum AssignmentType {
  Assign = "Assign",
  UnAssign = "UnAssign"
}