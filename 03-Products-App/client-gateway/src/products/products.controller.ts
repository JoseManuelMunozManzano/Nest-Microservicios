import {
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
  findOne(@Param('id') id: string) {
    return 'Esta función regresa el producto ' + id;
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
