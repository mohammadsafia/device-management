import { ICreateUser, IUser } from './../interfaces/UserInterfaces';
import User from '../models/UserModels';
import moment from 'moment'
export class UserService {

  public CreateUser = async (userDetails: ICreateUser): Promise<IUser> => {
    const BirthDate = moment.utc(userDetails.BirthDate, "YYYY/MM/DD").toDate()
    let user = await User.create({ ...userDetails, BirthDate })
    return await user.save();
  }

  public GetUsers = async (): Promise<IUser[]> => {
    return await User.find({}, "-Password -Role")
  }

  public GetUserDetailsById = async (userId: string): Promise<IUser | null> => {
    return await User.findById(userId, "-Password -Role")
  }

  public DeleteUserById = async (userId: string): Promise<IUser | null> => {
    return await User.findByIdAndDelete(userId)
  }

  public UpdateUserById = async (Email: IUser['Email'], FirstName: IUser['FirstName'], LastName: IUser['LastName'], BirthDate: IUser['BirthDate'], user: IUser) => {
    user.Email = Email;
    user.FirstName = FirstName;
    user.LastName = LastName;
    user.BirthDate = BirthDate;
    return await user.save();
  }
}