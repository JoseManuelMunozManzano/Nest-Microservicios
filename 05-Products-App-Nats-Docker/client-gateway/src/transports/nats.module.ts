import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { NATS_SERVICE, envs } from 'src/config';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: NATS_SERVICE,
        transport: Transport.NATS,
        options: {
          servers: envs.natsServers,
        },
      },
    ]),
  ],
  // Para que otros módulos puedan utilizar la configuración indicada en los imports, lo exportamos.
  // Podemos duplicar el código de arriba o indicar solo [ClientsModule]
  exports: [ClientsModule],
})
export class NatsModule {}
