import { Schema } from 'mongoose';
import uuidv4 from 'uuid/v4';
import { uuid, trimmedString, readMapper, timestamps } from './utils';

const VerificationSchema = new Schema(
  {
    _id: { ...uuid },
    user_id: { ...trimmedString, required: true },
    token: { ...trimmedString, default: uuidv4 },
  },
  {
    ...readMapper,
    ...timestamps,
  },
);

export default VerificationSchema;
