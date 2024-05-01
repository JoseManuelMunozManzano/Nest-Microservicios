import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { BadRequestException, Logger, ValidationPipe } from '@nestjs/common';
import { envs } from './config';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const logger = new Logger('Main');

  // Transformación a Microservicio
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.TCP,
      options: {
        port: envs.port, // Mandamos el puerto en las opciones
      },
    },
  );

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

  // Ya no mandamos el puerto por aquí
  await app.listen();
  logger.log(`Products Microservice running on port ${envs.port}`);
}
bootstrap();
