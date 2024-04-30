import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { BadRequestException, Logger, ValidationPipe } from '@nestjs/common';
import { envs } from './config';

async function bootstrap() {
  const logger = new Logger('Main');

  const app = await NestFactory.create(AppModule);

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

  await app.listen(envs.port);
  logger.log(`App running on port ${envs.port}`);
}
bootstrap();
