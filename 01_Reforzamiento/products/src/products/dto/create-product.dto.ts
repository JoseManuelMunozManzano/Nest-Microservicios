import { Type } from 'class-transformer';
import { IsNumber, IsOptional, IsString } from 'class-validator';

// El dto es la información que va a fluir entre el body de la petición HTTP y mi backend.
// Para validar que viene la info que espero usamos dos paquetes: class-validator y class-transformer.
export class CreateProductDto {
  @IsString()
  name: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsNumber()
  @Type(() => Number) // Recibimos un String y lo transformamos a un Number
  price: number;
}
