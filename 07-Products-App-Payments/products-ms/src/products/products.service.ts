/* eslint-disable @typescript-eslint/no-unused-vars */
import { HttpStatus, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { RpcException } from '@nestjs/microservices';

import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PaginationDto } from 'src/common';

// El extends y el implements está explicado en: https://docs.nestjs.com/recipes/prisma
@Injectable()
export class ProductsService extends PrismaClient implements OnModuleInit {
  private readonly logger = new Logger('ProductsService');

  onModuleInit() {
    this.$connect();
    this.logger.log('Database connected');
  }

  create(createProductDto: CreateProductDto) {
    // Crear producto usando Prisma
    return this.product.create({
      data: createProductDto,
    });
  }

  // Tenemos en cuenta que el producto esté disponible.
  async findAll(paginationDto: PaginationDto) {
    const { page, limit } = paginationDto;

    const totalPages = await this.product.count({ where: { available: true } });
    const lastPage = Math.ceil(totalPages / limit);

    return {
      data: await this.product.findMany({
        // skip empieza desde el 0 y hay que multiplicarlo por el límite.
        skip: (page - 1) * limit,
        take: limit,
        where: {
          available: true,
        },
      }),
      meta: {
        total: totalPages,
        page: page,
        lastPage: lastPage,
      },
    };
  }

  // Tenemos en cuenta que el producto esté disponible.
  async findOne(id: number) {
    const product = await this.product.findFirst({
      where: { id, available: true },
    });

    if (!product) {
      // Mandamos una excepción un poco más elaborada, como un objeto.
      throw new RpcException({
        message: `Product with id #${id} not found`,
        status: HttpStatus.BAD_REQUEST,
      });
    }

    return product;
  }

  // La razón por la que no se usa el await en el update es porque no necesitamos esperar a que
  // se resuelva la promesa antes de devolverla, en este caso estamos devolviendo la promesa
  // directamente y Nest se encarga de esperar a que se resuelva antes de enviar la respuesta al
  // cliente, es por esto que no es necesario hacer el await si devolvemos la promesa directamente.
  async update(id: number, updateProductDto: UpdateProductDto) {
    // Como mando el id y en updateProductDto también viene el id, lo quito de este último.
    const { id: _, ...data } = updateProductDto;

    await this.findOne(id);

    return this.product.update({
      where: { id },
      data: data,
    });
  }

  // Como se ha indicado en el update, podemos regresar promesas a los controladores y Nest
  // espera a la respuesta del observable o la promesa para que el usuario reciba la respuesta
  // síncrona.
  // De todas formas, indicamos el async porque usamos un await para buscar si el id existe
  // antes de eliminarlo.
  async remove(id: number) {
    await this.findOne(id);

    return await this.product.update({
      where: { id },
      data: {
        available: false,
      },
    });

    // Borrado físico: No recomendado
    //
    // return this.product.delete({
    //   where: { id },
    // });
  }

  async validateProducts(ids: number[]) {
    // Quitamos elementos duplicados.
    //
    // Lo hacemos porque, aunque en este proyecto no lo tenemos en cuenta, puede que, para ropa
    // tengamos la talla, y que compremos dos veces el mismo id de producto, pero para diferentes
    // tallas. Por tanto, yo solo quiero que exista el id del producto, independientemente de si
    // está o no duplicado.
    ids = Array.from(new Set(ids));

    const products = await this.product.findMany({
      // Si no existe no lo devuelte.
      where: {
        id: {
          in: ids,
        },
      },
    });

    // Si la longitud sigue siendo la misma es porque devolvió todos los ids, luego
    // to-dos existen.
    if (products.length !== ids.length) {
      throw new RpcException({
        message: 'Some products were not found',
        status: HttpStatus.BAD_REQUEST,
      });
    }

    return products;
  }
}
