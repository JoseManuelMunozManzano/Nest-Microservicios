import {
  HttpStatus,
  Inject,
  Injectable,
  Logger,
  OnModuleInit,
} from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import {
  ChangeOrderStatusDto,
  CreateOrderDto,
  OrderPaginationDto,
} from './dto';
import { PRODUCT_SERVICE } from 'src/config';
import { firstValueFrom, map } from 'rxjs';
import { SourceTextModule } from 'vm';

@Injectable()
export class OrdersService extends PrismaClient implements OnModuleInit {
  private readonly logger = new Logger('OrdersService');

  constructor(
    @Inject(PRODUCT_SERVICE) private readonly productsClient: ClientProxy,
  ) {
    super();
  }

  async onModuleInit() {
    await this.$connect();
    this.logger.log('Database connected');
  }

  async create(createOrderDto: CreateOrderDto) {
    try {
      // 1. Confirmar los ids de los productos
      const productIds = createOrderDto.items.map((item) => item.productId);

      // Para transformar este Observable en una promesa usamos firstValueFrom
      const products: any[] = await firstValueFrom(
        this.productsClient.send({ cmd: 'VALIDATE_PRODUCTS' }, productIds),
      );

      // 2. Cálculos de los valores
      const totalAmount = createOrderDto.items.reduce((acum, orderItem) => {
        // Yo no confío en el precio que me está mandando el cliente/gateway. Yo lo cojo de mi tabla de productos.
        const price = products.find(
          (product) => product.id === orderItem.productId,
        ).price;

        return price * orderItem.quantity + acum;
      }, 0);

      const totalItems = createOrderDto.items.reduce((acum, orderItem) => {
        return acum + orderItem.quantity;
      }, 0);

      // 3. Crear una transacción de BD
      //    Necesitamos crear la orden y sus items, y ambas deben ser exitosas. Si una falla hay que
      //    hacer un rollback.
      //    Una forma de hacerlo sería usando this.$transaction()
      //    Pero en este caso no hace falta porque podemos hacer todo en una sola sentencia create.
      const order = await this.order.create({
        data: {
          totalAmount: totalAmount,
          totalItems: totalItems,
          // Parte del detalle
          OrderItem: {
            createMany: {
              data: createOrderDto.items.map((orderItem) => ({
                price: products.find(
                  (product) => product.id === orderItem.productId,
                ).price,
                productId: orderItem.productId,
                quantity: orderItem.quantity,
              })),
            },
          },
        },

        // Para que regrese todos los valores de OrderItem.
        include: {
          // Esto sería para que regrese todo.
          // OrderItem: true,
          //
          // Y esto para que regrese los campos que realmente quiero.
          OrderItem: {
            select: {
              price: true,
              quantity: true,
              productId: true,
            },
          },
        },
      });

      // Vamos a devolver también el nombre del producto.
      return {
        ...order,
        OrderItem: order.OrderItem.map((orderItem) => ({
          ...orderItem,
          name: products.find((product) => product.id === orderItem.productId)
            .name,
        })),
      };
    } catch (error) {
      throw new RpcException({
        status: HttpStatus.BAD_REQUEST,
        message: 'Check logs',
      });
    }
  }

  async findAll(orderPaginationDto: OrderPaginationDto) {
    const totalPages = await this.order.count({
      where: {
        // Si no viene el status, entonces es undefined y regresa todos.
        status: orderPaginationDto.status,
      },
    });

    const currentPage = orderPaginationDto.page;
    const perPage = orderPaginationDto.limit;

    return {
      data: await this.order.findMany({
        skip: (currentPage - 1) * perPage,
        take: perPage,
        where: {
          status: orderPaginationDto.status,
        },
      }),
      meta: {
        total: totalPages,
        page: currentPage,
        lastPage: Math.ceil(totalPages / perPage),
      },
    };
  }

  async findOne(id: string) {
    const order = await this.order.findFirst({
      where: { id },
      // Para que incluya las relaciones
      include: {
        OrderItem: {
          select: {
            price: true,
            quantity: true,
            productId: true,
          },
        },
      },
    });

    if (!order) {
      throw new RpcException({
        message: `Order with id ${id} not found`,
        status: HttpStatus.NOT_FOUND,
      });
    }

    const productIds = order.OrderItem.map((orderItem) => orderItem.productId);

    const products: any[] = await firstValueFrom(
      this.productsClient.send({ cmd: 'VALIDATE_PRODUCTS' }, productIds),
    );

    // De esa orden, cogemos todos los ids de los productos y traemos la
    // información que queramos del microservicio products-ms
    return {
      ...order,
      OrderItem: order.OrderItem.map((orderItem) => ({
        ...orderItem,
        name: products.find((product) => product.id === orderItem.productId)
          .name,
      })),
    };
  }

  async changeStatus(changeOrderStatusDto: ChangeOrderStatusDto) {
    const { id, status } = changeOrderStatusDto;

    const order = await this.findOne(id);

    // Pequeña optimización para no impactar la BD si no cambia el status
    if (order.status === status) return order;

    return this.order.update({
      where: { id: id },
      data: { status: status },
    });
  }
}
