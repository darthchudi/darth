import bcrypt from 'bcrypt';
import generateUUID from 'uuid/v4';
import { SchemaTypes } from 'mongoose';
import { User } from '../../models/user';
import env from '@app/common/config/env';

/**
 * Removes _id field in subdocuments and allows virtual fields to be returned
 */
export const readMapper = {
  toJSON: {
    virtuals: true,
    versionKey: false,
    transform: (doc, ret, options) => {
      delete ret._id;
      if (ret.password) delete ret.password;
      return ret;
    },
  },
};

/**
 * Defines timestamps fields in a schema
 */
export const timestamps = {
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  },
};

/**
 * Replaces the default mongoose id with a uuid string
 */
export const uuid = {
  type: SchemaTypes.String,
  default: generateUUID,
};

/**
 * Defines a schema type with a lowercased trimmed string
 */
export const trimmedLowercaseString = {
  type: SchemaTypes.String,
  trim: true,
  lowercase: true,
};

/**
 * Defines a schema type with a trimmed string
 */
export const trimmedString = {
  type: SchemaTypes.String,
  trim: true,
};

/**
 * Defines a schema type with a lowercased string
 */
export const lowercaseString = {
  type: SchemaTypes.String,
  lowercase: true,
};

/**
 * Mongoose Pre-save hook used to hash passwords on document creation
 * @param next mongoose hook next function
 */
export function hashPassword(next) {
  const user = <User>this;
  if (!user.isNew) return next();

  // Hash password only if user is new
  bcrypt.hash(user.password, env.salt_rounds, (err: Error, hash: string) => {
    if (err) return next(err);
    user.password = hash;
    next();
  });
}

/**
 * Mongoose model instance method used to check if a plain text password
 * matches that of the model
 * @param plainText plain text password to be validated
 */
export const isValidPassword = function(plainText: string) {
  return new Promise<Boolean>((resolve, reject) => {
    bcrypt.compare(plainText, this.password, (err, res) => {
      if (err) reject(err);
      if (!res)
        reject(new Error('Invalid credentails provided. Please try again.'));
      resolve(res);
    });
  });
};
