import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ORDER_SERVICE, envs } from 'src/config';
import { OrdersController } from './orders.controller';

@Module({
  controllers: [OrdersController],
  imports: [
    // Es un arreglo porque podemos indicar cualquier número de microservicios
    // con los que queramos comunicarnos.
    //
    // El ORDER_SERVICE es lo que vamos a usar para inyectar el microservicio en los
    // controladores u otros lugares como services...
    //
    // El valor indicado en transport tiene que ser el mismo canal de comunicación que
    // indicamos en el archivo main.ts de nuestro proyecto orders-ms
    //
    // También tenemos que indicar el host y el puerto del host.
    // Esto lo hacemos en variables de entorno.
    ClientsModule.register([
      {
        name: ORDER_SERVICE,
        transport: Transport.TCP,
        options: {
          host: envs.ordersMicroserviceHost,
          port: envs.ordersMicroservicePort,
        },
      },
    ]),
  ],
})
export class OrdersModule {}
