import {
  Injectable,
  Logger,
  NotFoundException,
  OnModuleInit,
} from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PrismaClient } from '@prisma/client';
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

  async findAll(paginationDto: PaginationDto) {
    const { page, limit } = paginationDto;

    const totalPages = await this.product.count();
    const lastPage = Math.ceil(totalPages / limit);

    return {
      data: await this.product.findMany({
        // skip empieza desde el 0 y hay que multiplicarlo por el límite.
        skip: (page - 1) * limit,
        take: limit,
      }),
      meta: {
        total: totalPages,
        page: page,
        lastPage: lastPage,
      },
    };
  }

  async findOne(id: number) {
    const product = await this.product.findFirst({
      where: { id },
    });

    if (!product) {
      throw new NotFoundException(`Product with id #${id} not found`);
    }

    return product;
  }

  // La razón por la que no se usa el await en el update es porque no necesitamos esperar a que
  // se resuelva la promesa antes de devolverla, en este caso estamos devolviendo la promesa
  // directamente y Nest se encarga de esperar a que se resuelva antes de enviar la respuesta al
  // cliente, es por esto que no es necesario hacer el await si devolvemos la promesa directamente.
  async update(id: number, updateProductDto: UpdateProductDto) {
    await this.findOne(id);

    return this.product.update({
      where: { id },
      data: updateProductDto,
    });
  }

  // BORRADOS FÍSICOS NO RECOMENDADOS EN MICROSERVICIOS!!!!
  // Como se ha indicado en el update, podemos regresar promesas a los controladores y Nest
  // espera a la respuesta del observable o la promesa para que el usuario reciba la respuesta
  // síncrona.
  // De todas formas, indicamos el async porque usamos un await para buscar si el id existe
  // antes de eliminarlo.
  async remove(id: number) {
    await this.findOne(id);

    return this.product.delete({
      where: { id },
    });
  }
}
