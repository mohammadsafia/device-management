
import { Document } from 'mongoose';
export interface IUser extends Document {
  Email: string;
  FirstName: string;
  LastName: string;
  Password: string;
  Role: UserRoles;
  BirthDate: Date
}

export interface ICreateUser {
  Email: IUser['Email'];
  FirstName: IUser['FirstName'];
  LastName: IUser['LastName'];
  Password: IUser['Password'];
  Role: IUser['Role'];
  BirthDate: IUser['BirthDate']
}


export enum UserSchema {
  CreateUser = "createUserSchema",
  UpdateUser = "updateUserSchema"
}

export enum AuthUserSchema {
  SignIn = "loginUserSchema",
  SignUp = "createUserSchema"
}

export enum UserRoles {
  Admin = 0,
  Maintainer = 1,
  User = 2
}