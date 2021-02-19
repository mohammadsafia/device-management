import Joi from 'joi';


export const createUserSchema = Joi.object().keys({
  FirstName: Joi.string().min(3).required(),
  LastName: Joi.string().min(3).required(),
  Email: Joi.string().email().required(),
  Password: Joi.string().min(6).required().pattern(new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})")).message(`
    1- You should set at least 8 char,
    2- You should have special  char like (*#$($)),
    3- You should set Capital letter,
  `),
  BirthDate: Joi.date().max('1-1-2010'),
});

export const updateUserSchema = Joi.object().keys({
  FirstName: Joi.string().min(3).required(),
  LastName: Joi.string().min(3).required(),
  Email: Joi.string().email().required(),
  BirthDate: Joi.date().max('1-1-2010'),
})

export const loginUserSchema = Joi.object().keys({
  Password: Joi.string().required(),
  Email: Joi.string().email().required(),
})

export const deviceSchema = Joi.object().keys({
  DeviceNumber: Joi.string().required(),
  Manufacture: Joi.string().required(),
  Model: Joi.string().required(),
  Screen: Joi.string().required(),
  Processor: Joi.string().required(),
  RAM: Joi.string().required(),
  PrimaryDriveType: Joi.string().required(),
  PrimaryDriveCapacity: Joi.string().required(),
  SecondaryDriveCapacity: Joi.string().required(),
  OS: Joi.string().required(),
  OSVersion: Joi.string().required(),
  Notes: Joi.string().optional(),
})