import { Injectable } from '@nestjs/common';
import { BaseAuthGuard } from 'src/common/guards';

@Injectable()
export class RefreshAuthGuard extends BaseAuthGuard {
  constructor() {
    super(process.env.REFRESH_TOKEN_SECRET);
  }
}
