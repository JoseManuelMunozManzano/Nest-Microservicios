import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { catchError } from 'rxjs';

import { PaginationDto, ProductTCP } from 'src/common';
import { PRODUCT_SERVICE } from 'src/config';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Controller('products')
export class ProductsController {
  constructor(
    @Inject(PRODUCT_SERVICE) private readonly productsClient: ClientProxy,
  ) {}

  @Post()
  createProduct(@Body() createProductDto: CreateProductDto) {
    return this.productsClient.send(
      { cmd: ProductTCP.CREATE },
      createProductDto,
    );
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

  // Forma 1 de obtener los errores del microservicio con try...catch (promesas)
  // Es muy fácil de leer y muy buena opción.
  //
  // @Get(':id')
  // async findOne(@Param('id') id: string) {
  //   // Para obtener el error del microservicio.
  //   //
  //   // El send() devuelve un observable y, para escucharlo, tenemos que subscribirnos donde tendremos el error.
  //   // Lo vamos a hacer primero de manera empírica con un try...catch
  //   // NOTA: rxjs viene por defecto instalado en Nest.
  //   // firstValueFrom permite trabajar como si fuera una promesa y recibe un observable como argumento, que dispara
  //   // el subscribe.
  //   try {
  //     const product = await firstValueFrom(
  //       // Siempre se manda entre llaves, como objeto (salvo que ya sea objeto como paginationDto arriba)
  //       this.productsClient.send({ cmd: ProductTCP.FIND_ONE }, { id }),
  //     );

  //     return product;
  //   } catch (error) {
  //     // Y si hay error, lo indicamos como un BadRequest.
  //     //
  //     // throw new BadRequestException(error);
  //     //
  //     // Una vez añadido el RpcCustomExceptionFilter, ahora la excepción viene como un objeto, es decir,
  //     // no viene una instancia de RpcException (mandado desde el microservicio products-ms)
  //     // Para atrapar el error en nuestro useGlobalFilters (en main.ts), se indica:
  //     throw new RpcException(error);
  //   }
  // }

  // Forma 2 de obtener los errores del microservicio, con observables (pipe) y rxjs (catchError)
  // Menos código y muy fácil de leer.
  //
  @Get(':id')
  async findOne(@Param('id') id: string) {
    // Para obtener el error del microservicio.
    //
    // El send() devuelve un observable y, para escucharlo, tenemos que subscribirnos donde tendremos el error.
    return this.productsClient.send({ cmd: ProductTCP.FIND_ONE }, { id }).pipe(
      catchError((err) => {
        throw new RpcException(err);
      }),
    );
  }

  @Delete(':id')
  deleteProduct(@Param('id') id: string) {
    // Siempre es más fácil mandar un objeto {id} que un string id, ya que si el día de mañana
    // tengo que enviar otra property es más fácil exapndir un objeto que transformar de string a objeto.
    return this.productsClient.send({ cmd: ProductTCP.DELETE }, { id }).pipe(
      catchError((err) => {
        throw new RpcException(err);
      }),
    );
  }

  @Patch(':id')
  patchProduct(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateProductDto: UpdateProductDto,
  ) {
    return this.productsClient
      .send({ cmd: ProductTCP.UPDATE }, { id, ...updateProductDto })
      .pipe(
        catchError((err) => {
          throw new RpcException(err);
        }),
      );
  }
}
