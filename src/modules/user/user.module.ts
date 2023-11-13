import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { UserController } from './user.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [ConfigModule, PrismaModule],
  controllers: [UserController],
})
export class UserModule {}
