import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { EnvVars } from '../../config/configuration';
import { PrismaService } from '../prisma/prisma.service';
import {
  SignInDto,
  SignUpDto,
  hashPassword,
  verifyPassword,
} from '../../common';

@Injectable()
export class AuthService {
  constructor(
    private readonly configService: ConfigService<EnvVars>,
    private readonly prismaService: PrismaService,
  ) {}

  async signUp(body: SignUpDto) {
    const isEmailTaken = await this.prismaService.user.findFirst({
      where: { email: { equals: body.email, mode: 'insensitive' } },
    });

    if (isEmailTaken) {
      throw new ConflictException('Email is already in use');
    }

    return this.prismaService.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          email: body.email.toLowerCase(),
          password: await hashPassword(body.password),
        },
      });

      const sessionTtl = this.configService.getOrThrow('sessionTtl', {
        infer: true,
      });
      const expiresAt = new Date();
      expiresAt.setTime(expiresAt.getTime() + sessionTtl);

      const session = await tx.session.create({
        data: {
          expiresAt,
          user: { connect: { id: user.id } },
        },
      });

      return { user, session };
    });
  }

  async signIn(body: SignInDto) {
    const user = await this.prismaService.user.findFirst({
      where: {
        email: { equals: body.email, mode: 'insensitive' },
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const isPasswordValid = await verifyPassword(body.password, user.password);

    if (!isPasswordValid) {
      throw new BadRequestException('Invalid password');
    }

    const sessionTtl = this.configService.getOrThrow('sessionTtl', {
      infer: true,
    });
    const expiresAt = new Date();
    expiresAt.setTime(expiresAt.getTime() + sessionTtl);

    const session = await this.prismaService.session.create({
      data: {
        expiresAt,
        user: { connect: { id: user.id } },
      },
    });

    return { user, session };
  }
}
