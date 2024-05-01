import { PartialType } from '@nestjs/mapped-types';
import { CreateProductDto } from './create-product.dto';

// PartialType coge todas las properties de CreateProductDto y las hace opcionales.
export class UpdateProductDto extends PartialType(CreateProductDto) {}
