import { Model } from '.';

export interface Verification extends Model {
  user_id: string;
  token: string;
}
