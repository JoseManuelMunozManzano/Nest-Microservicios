export enum OrderStatus {
  PENDING = 'PENDING',
  DELIVERED = 'DELIVERED',
  CANCELLED = 'CANCELLED',
}

// Notar que este arreglo no lo creamos desde cero, sino teniendo en cuenta los valores
// posibles de la enumeración OrderStatus de mi schema.prisma
export const OrderStatusList = [
  OrderStatus.PENDING,
  OrderStatus.DELIVERED,
  OrderStatus.CANCELLED,
];
