import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';

import { PrismaService } from '../../modules/prisma/prisma.service';
import { EnvVars } from '../../config/configuration';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly configService: ConfigService<EnvVars>,
    private readonly prismaService: PrismaService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const { sessionId } = request.signedCookies || {};
    if (!sessionId) return false;

    const session = await this.prismaService.session.findFirst({
      where: { id: sessionId },
      include: { user: true },
    });
    if (!session) return false;

    if (session.expiresAt < new Date()) {
      await this.prismaService.session.delete({ where: { id: sessionId } });

      return false;
    }

    const sessionTtl = this.configService.getOrThrow('sessionTtl', {
      infer: true,
    });
    const expiresAt = new Date();
    expiresAt.setTime(expiresAt.getTime() + sessionTtl);

    await this.prismaService.session.update({
      where: { id: session.id },
      data: { expiresAt },
    });

    request.user = session.user;

    return true;
  }
}
