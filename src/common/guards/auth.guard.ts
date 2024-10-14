import { Injectable } from '@nestjs/common';
import { BaseAuthGuard } from './baseAuth.guard'; // Импортируйте базовый гард

@Injectable()
export class AuthGuard extends BaseAuthGuard {
  constructor() {
    super(process.env.ACCESS_TOKEN_SECRET);
  }
}
