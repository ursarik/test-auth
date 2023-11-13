import {
  Body,
  Controller,
  Post,
  Req,
  Res,
  UseInterceptors,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { ConfigService } from '@nestjs/config';

import { AuthService } from './auth.service';
import {
  ExcludeUserPasswordInterceptor,
  SignInDto,
  SignUpDto,
} from '../../common';
import { EnvVars } from '../../config/configuration';
import { SESSION_ID_KEY } from '../../common/constants';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly configService: ConfigService<EnvVars>,
    private readonly authService: AuthService,
  ) {}

  @Post('sign-up')
  @UseInterceptors(ExcludeUserPasswordInterceptor)
  async signUp(
    @Body() body: SignUpDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { user, session } = await this.authService.signUp(body);

    const isProdEnv = this.configService.getOrThrow('isProdEnv', {
      infer: true,
    });

    res.cookie(SESSION_ID_KEY, session.id, {
      httpOnly: true,
      sameSite: 'none',
      secure: isProdEnv,
      signed: true,
    });

    return user;
  }

  @Post('sign-in')
  @UseInterceptors(ExcludeUserPasswordInterceptor)
  async signIn(
    @Body() body: SignInDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { user, session } = await this.authService.signIn(body);

    const isProdEnv = this.configService.getOrThrow('isProdEnv', {
      infer: true,
    });

    res.cookie(SESSION_ID_KEY, session.id, {
      httpOnly: true,
      sameSite: 'none',
      secure: isProdEnv,
      signed: true,
    });

    return user;
  }

  @Post('sign-out')
  async signOut(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    if (req.signedCookies[SESSION_ID_KEY]) {
      await this.authService.signOut(req.signedCookies[SESSION_ID_KEY]);
    }

    res.clearCookie('sessionId');
  }
}
