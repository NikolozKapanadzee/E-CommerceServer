import { Role } from 'src/common/enums/roles.enum';

declare global {
  namespace Express {
    interface UserPayload {
      _id: string;
      role: Role;
    }
    interface Request {
      user?: UserPayload;
    }
  }
}
