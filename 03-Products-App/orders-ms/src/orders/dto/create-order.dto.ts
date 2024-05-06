import { OrderStatus } from '@prisma/client';
import {
  IsBoolean,
  IsEnum,
  IsNumber,
  IsOptional,
  IsPositive,
} from 'class-validator';
import { OrderStatusList } from './enum/order.enum';

// La data que vamos a aceptar y validar para que venga como requerimos.
export class CreateOrderDto {
  @IsNumber()
  @IsPositive()
  totalAmount: number;

  @IsNumber()
  @IsPositive()
  totalItems: number;

  // Este OrderStatus viene de la migración de Prisma. Se crea el cliente, el cual tiene
  // to-do el tipado estricto de como manejamos la BD.
  // La validación se basa en mi enumeración.
  @IsEnum(OrderStatusList, {
    message: `Possible status values are ${OrderStatusList}`,
  })
  @IsOptional()
  status: OrderStatus = OrderStatus.PENDING;

  // Aunque todas las órdenes deberían crearse con valor paid a false (en el schema.prisma),
  // esto queda así por motivos didácticos, para que se vea como se haría.
  @IsBoolean()
  @IsOptional()
  paid: boolean = false;
}
