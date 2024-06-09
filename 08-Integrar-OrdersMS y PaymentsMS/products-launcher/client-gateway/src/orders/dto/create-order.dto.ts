import { ArrayMinSize, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { OrderItemDto } from './order-item.dto';

// La data que vamos a aceptar y validar para que venga como requerimos.
export class CreateOrderDto {
  @IsArray()
  @ArrayMinSize(1)
  // Para validar internamente cada uno de los elementos de los items, ya que los items van a ser otro dto.
  @ValidateNested({ each: true })
  // Cada elemento del arreglo es de este tipo
  @Type(() => OrderItemDto)
  items: OrderItemDto[];
}
