import { IsNumber, IsPositive } from 'class-validator';

// Como va a lucir cada uno de los items
export class OrderItemDto {
  @IsNumber()
  @IsPositive()
  productId: number;

  @IsNumber()
  @IsPositive()
  quantity: number;

  @IsNumber()
  @IsPositive()
  price: number;
}
