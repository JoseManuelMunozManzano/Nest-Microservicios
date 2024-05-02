import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

import { PaginationDto, ProductTCP } from 'src/common';
import { PRODUCT_SERVICE } from 'src/config';

@Controller('products')
export class ProductsController {
  constructor(
    @Inject(PRODUCT_SERVICE) private readonly productsClient: ClientProxy,
  ) {}

  @Post()
  createProduct() {
    return 'Crea un producto';
  }

  @Get()
  findAllProducts(@Query() paginationDto: PaginationDto) {
    // Si esperamos una respuesta usaremos send(). Si no esperamos una respuesta usaremos emit().
    // Tenemos que indicar el pattern y el payload validado.
    return this.productsClient.send(
      { cmd: ProductTCP.FIND_ALL },
      paginationDto,
    );
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    // Para obtener el error del microservicio.
    //
    // El send() devuelve un observable y, para escucharlo, tenemos que subscribirnos donde tendremos el error.
    // Lo vamos a hacer primero de manera empírica con un try...catch
    // NOTA: rxjs viene por defecto instalado en Nest.
    // firstValueFrom permite trabajar como si fuera una promesa y recibe un observable como argumento, que dispara
    // el subscribe.
    try {
      const product = await firstValueFrom(
        // Siempre se manda entre llaves, como objeto (salvo que ya sea objeto como paginationDto arriba)
        this.productsClient.send({ cmd: ProductTCP.FIND_ONE }, { id }),
      );

      return product;
    } catch (error) {
      // Y si hay error, lo indicamos como un BadRequest
      throw new BadRequestException(error);
    }
  }

  @Delete(':id')
  deleteProduct(@Param('id') id: string) {
    return 'Esta función elimina el producto ' + id;
  }

  @Patch(':id')
  patchProduct(@Param('id') id: string, @Body() body: any) {
    return 'Esta función actualiza el producto ' + id;
  }
}
