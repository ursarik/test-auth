import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';

import { AppModule } from './app.module';
import { EnvVars } from './config/configuration';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService<EnvVars>);
  const port = configService.getOrThrow('port', { infer: true });

  await app.listen(port);
}

bootstrap();
