import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { PRODUCT_SERVICE, envs } from 'src/config';

@Module({
  controllers: [OrdersController],
  providers: [OrdersService],
  imports: [
    // Es un arreglo porque podemos indicar cualquier número de microservicios
    // con los que queramos comunicarnos.
    //
    // El PRODUCT_SERVICE es lo que vamos a usar para inyectar el microservicio en los
    // controladores u otros lugares como services...
    //
    // El valor indicado en transport tiene que ser el mismo canal de comunicación que
    // indicamos en el archivo main.ts de nuestro proyecto product-ms
    //
    // También tenemos que indicar el host y el puerto del host.
    // Esto lo hacemos en variables de entorno.
    ClientsModule.register([
      {
        name: PRODUCT_SERVICE,
        transport: Transport.TCP,
        options: {
          host: envs.productsMicroserviceHost,
          port: envs.productsMicroservicePort,
        },
      },
    ]),
  ],
})
export class OrdersModule {}
