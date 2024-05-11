import { Module } from '@nestjs/common';
import { ProductsController } from './products.controller';
import { NatsModule } from 'src/transports/nats.module';

@Module({
  controllers: [ProductsController],
  providers: [],
  // Ahora, cuando querramos cambiar nuestro canal de comunicación, solo hay que cambiar este import.
  imports: [NatsModule],
})
export class ProductsModule {}
