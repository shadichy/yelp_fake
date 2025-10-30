
import { UserType } from '../schemas/enums';

export interface DecodedToken {
  user_type: UserType;
  exp: number;
  iat: number;
  sub: string;
  id: number;
}
