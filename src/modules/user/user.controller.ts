import { Controller, Get, UseGuards, UseInterceptors } from '@nestjs/common';
import { User } from '@prisma/client';

import {
  AuthGuard,
  AuthorizedUser,
  ExcludeUserPasswordInterceptor,
} from '../../common';

@Controller('users')
@UseGuards(AuthGuard)
export class UserController {
  @Get('me')
  @UseInterceptors(ExcludeUserPasswordInterceptor)
  async getMe(@AuthorizedUser() user: User) {
    return user;
  }
}
