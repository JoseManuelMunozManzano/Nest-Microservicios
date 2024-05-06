import { OrderStatus } from '@prisma/client';
import { IsEnum, IsUUID } from 'class-validator';
import { OrderStatusList } from './enum/order.enum';

export class ChangeOrderStatusDto {
  // El 4 hace referencia a la versión de UUID que estamos usando
  @IsUUID(4)
  id: string;

  @IsEnum(OrderStatusList, {
    message: `Valid status are ${OrderStatusList}`,
  })
  status: OrderStatus;
}
