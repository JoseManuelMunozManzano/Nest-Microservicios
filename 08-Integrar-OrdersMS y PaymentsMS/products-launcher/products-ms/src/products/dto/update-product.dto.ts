import { PartialType } from '@nestjs/mapped-types';
import { CreateProductDto } from './create-product.dto';
import { IsNumber, IsPositive } from 'class-validator';

// PartialType coge todas las properties de CreateProductDto y las hace opcionales.
export class UpdateProductDto extends PartialType(CreateProductDto) {
  // Para el @Payload del método update del controller, añadimos aquí el id.
  @IsNumber()
  @IsPositive()
  id: number;
}
