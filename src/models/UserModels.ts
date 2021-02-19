import mongoose, { Schema } from 'mongoose';
import { IUser } from './../interfaces/UserInterfaces';
import validator from 'validator';

const UserSchema: Schema = new Schema({
  Email: {
    type: String,
    unique: true,
    required: 'Email address is required',
    validate: [validator.isEmail, 'Please fill a valid email address']
  },
  FirstName: { type: String, required: true },
  LastName: { type: String, required: true },
  Password: { type: String, required: true },
  Role: { type: Number, required: true },
  BirthDate: { type: Date, required: true }
}, { timestamps: { createdAt: 'CreatedDate', updatedAt: 'UpdatedDate' } });

// Export the model and return your IUser interface
export default mongoose.model<IUser>('User', UserSchema);