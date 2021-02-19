import { Request, NextFunction, RequestHandler } from 'express';
import User from '../../models/UserModels';
import { UserService } from '../../services/UsersService';
import { HttpError } from '../../middleware';
import { createUserSchema, updateUserSchema } from '../../schema';
import { InternalError } from '../../utils';
import { UserRoles, UserSchema } from '../../interfaces/UserInterfaces';
import { IUser } from '../../interfaces/UserInterfaces';
import bcrypt from 'bcryptjs';

class UserController {
  constructor(private userService: UserService) { }

  GetUsers: RequestHandler = async (req, response, next): Promise<void> => {
    let result;

    try {
      result = await this.userService.GetUsers();
    } catch (err) {
      const error = new HttpError("Fetching users failed, please try again later.", 500);
      return next(error);
    }
    response.json({ users: result.map((user) => user.toObject({ getters: true })) });
  }



  public CreateUser: RequestHandler = async (request, response, next): Promise<void> => {
    await this.IsValidInputs(request, next, UserSchema.CreateUser)
    await this.ExistingEmail(request.body.Email, next)

    let hashedPassword;
    try {
      hashedPassword = await bcrypt.hash(request.body.Password, 12);
    } catch (err) {
      throw InternalError(next, "Could not create user, please try again.", 500)
    }

    try {
      const result = await this.userService.CreateUser({ ...request.body, Password: hashedPassword, Role: UserRoles.User });
      response.status(201).json({ message: `A new account has been created using this email: "${result.Email}"` })
    } catch (error) {
      throw InternalError(next, "Could not create user, please try again.", 500)
    }
  }



  public DeleteUserById: RequestHandler<{ userId: string }> = async (request, response, next) => {

    let userId = request.params.userId;
    try {
      let user = await this.IsUser(next, userId);


      if (user && user.Role === UserRoles.Admin) {
        throw InternalError(next, "You Can't delete this user", 403)
      }

      const result = await this.userService.DeleteUserById(userId);
      if (result) {
        response.status(200).json({ message: 'User deleted' })
      }
    } catch (err) {
      throw InternalError(next, "Fetching users failed, please try again later.", 500);
    }
  }



  public GetUserDetailsById: RequestHandler<{ userId: string }> = async (request, response, next) => {

    let userId = request.params.userId;
    try {
      await this.IsUser(next, userId);

      const result = await this.userService.GetUserDetailsById(userId);
      if (result) {
        response.status(200).json({ user: result.toObject({ getters: true }) })
      }

    } catch (err) {
      throw InternalError(next, "Fetching users failed, please try again later.", 500);
    }
  }



  public UpdateUserById: RequestHandler<{ userId: string }> = async (request, response, next) => {
    let userId = request.params.userId
    const { Email, LastName, FirstName, BirthDate } = request.body;
    try {
      const user = await this.IsUser(next, userId)

      await this.IsValidInputs(request, next, UserSchema.UpdateUser)


      if (user) {
        if (user.Email !== Email) {
          await this.ExistingEmail(request.body.Email, next)
        }

        await this.userService.UpdateUserById(Email, FirstName, LastName, BirthDate, user)
        response.status(200).json({ message: 'Updated user successfully' })
      }
    } catch (err) {
      throw InternalError(next, "Fetching users failed, please try again later.", 500);
    }
  }


  private ExistingEmail = async (Email: string, next: NextFunction): Promise<void> => {
    let existingEmail: IUser | null;
    try {
      existingEmail = await User.findOne({ Email });
    } catch (err) {
      throw InternalError(next, "Signing up failed, please try again later.", 500);
    }
    if (existingEmail) {
      throw InternalError(next, "Email already exists, please try to use other email.", 422);
    }
  }



  private IsValidInputs = async (request: Request, next: NextFunction, userSchema: UserSchema): Promise<void> => {
    let result;

    if (userSchema === UserSchema.CreateUser) {
      result = createUserSchema.validate(request.body)
    } else if (userSchema === UserSchema.UpdateUser) {
      result = updateUserSchema.validate(request.body)
    }

    if (result?.error) {
      throw InternalError(next, result.error.message, 422);
    }
  }

  private IsUser = async (next: NextFunction, userId: string): Promise<void | IUser> => {
    const user = await this.userService.GetUserDetailsById(userId)
    if (!user) {
      throw InternalError(next, "User not found.", 404);
    }
    return user
  }
}

export default new UserController(new UserService);