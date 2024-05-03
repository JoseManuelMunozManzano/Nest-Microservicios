import { NestFactory } from '@nestjs/core';
import { BadRequestException, Logger, ValidationPipe } from '@nestjs/common';

import { AppModule } from './app.module';
import { envs } from './config';
import { RpcCustomExceptionFilter } from './common';

async function bootstrap() {
  const logger = new Logger('Main-Gateway');

  const app = await NestFactory.create(AppModule);

  // To-dos mis endpoints van a empezar con la palabra api en el URL.
  app.setGlobalPrefix('api');

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,

      // En el formato de respuesta de los errores en NestJS estos vendrán agrupados por la key del body.
      exceptionFactory: (errors) => {
        const result = errors.map((error) => ({
          [error.property]: {
            errors: Object.values(error.constraints),
          },
        }));

        return new BadRequestException(result);
      },
    }),
  );

  // Colocamos de manera global nuestro exception filter
  app.useGlobalFilters(new RpcCustomExceptionFilter());

  await app.listen(envs.port);

  logger.log(`Gateway running on port ${envs.port}`);
}
bootstrap();
