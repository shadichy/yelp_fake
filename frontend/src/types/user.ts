
import { UserType } from '../schemas/enums';

export interface User {
  id: number;
  email: string;
  user_type: UserType;
  is_active: boolean;
}
