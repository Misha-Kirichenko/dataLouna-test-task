import { Request } from 'express';
import { ITokenPayload } from 'src/auth/intefaces';

export interface IAuthorizedRequest extends Request {
  readonly user: ITokenPayload;
}
