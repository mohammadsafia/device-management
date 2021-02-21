import { NextFunction, RequestHandler } from 'express';
import User from '../../models/UserModels'
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken'
import config from '../../config/config';
import { HttpError } from './../../middleware';
import { IUser, UserRoles } from '../../interfaces/UserInterfaces';
import { InternalError } from './../../utils';
class AuthController {
  public SignUp: RequestHandler = async (request, response, next): Promise<void> => {
    const { FirstName, Email, Password, LastName, BirthDate } = request.body;
    try {
      await this.ExistingEmail(Email, next);
    } catch (error) {
      throw InternalError(next, "Could not create user, please try again.", 500)
    }


    let hashedPassword;
    try {
      hashedPassword = await bcrypt.hash(Password, 12);
    } catch (err) {
      throw InternalError(next, "Could not create user, please try again.", 500)
    }

    const createdUser = new User({ FirstName, LastName, Password: hashedPassword, Email, BirthDate, Role: UserRoles.User });
    try {
      await createdUser.save();
    } catch (err) {
      throw InternalError(next, "Could not create user, please try again.", 500)
    }

    let token;
    try {
      token = jwt.sign({ userId: createdUser.id, Email: createdUser.Email, Role: createdUser.Role }, config.server.jwt, { expiresIn: "1h" });
    } catch (err) {
      throw InternalError(next, "Could not create user, please try again.", 500)
    }

    try {
      response.status(201).json({ userId: createdUser.id, Email: createdUser.Email, token })
    } catch (error) {
      throw InternalError(next, "Could not create user, please try again.", 500)
    }

  }

  public SignIn: RequestHandler = async (request, response, next): Promise<void> => {
    const { Password, Email } = request.body;

    let existingUser;

    try {
      existingUser = await User.findOne({ Email });
    } catch (err) {
      throw InternalError(next, "Could not sign in, please try again.", 500)
    }

    if (!existingUser) {
      throw InternalError(next, "Invalid credentials, could not log you in.", 403)
    }

    await this.IsValidPassword(Password, existingUser, next);

    let token;
    try {
      token = jwt.sign({ userId: existingUser?.id, Email: existingUser?.Email, Role: existingUser.Role }, config.server.jwt, { expiresIn: "1h" });
    } catch (err) {
      throw InternalError(next, "Could not sign in, please try again.", 500)
    }

    try {
      response.status(200).json({ userId: existingUser?.id, Email: existingUser?.Email, token: token, });
    } catch (error) {
      throw InternalError(next, "Could not sign in, please try again.", 500)
    }
  }

  private ExistingEmail = async (Email: string, next: NextFunction): Promise<void> => {
    let existingEmail;
    try {
      existingEmail = await User.findOne({ Email });
    } catch (err) {
      const error = new HttpError("Signing up failed, please try again later.", 500);
      throw next(error)
    }
    if (existingEmail) {
      const error = new HttpError("Email already exists, please try to use other email.", 422);
      throw next(error)
    }
  }

  private IsValidPassword = async (Password: string, existingUser: IUser | null | undefined, next: NextFunction): Promise<void> => {
    let isValidPassword = false;
    try {
      isValidPassword = await bcrypt.compare(Password, existingUser?.Password || '');
    } catch (err) {
      throw InternalError(next, "Could not sign in, please try again.", 500)
    }

    if (!isValidPassword) {
      throw InternalError(next, "The password or username is wrong. Please check them before trying to log in", 400)
    }
  }
}

export default new AuthController();