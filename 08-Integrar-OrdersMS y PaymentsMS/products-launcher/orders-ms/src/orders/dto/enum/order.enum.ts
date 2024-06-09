import { OrderStatus } from '@prisma/client';

// Notar que este arreglo no lo creamos desde cero, sino teniendo en cuenta los valores
// posibles de la enumeración OrderStatus de mi schema.prisma
export const OrderStatusList = [
  OrderStatus.PENDING,
  OrderStatus.PAID,
  OrderStatus.DELIVERED,
  OrderStatus.CANCELLED,
];
