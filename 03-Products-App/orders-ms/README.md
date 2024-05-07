# orders-ms

Es un microservicio que se va a encargar del encabezado de las órdenes de productos. Se va a indicar el total de items de esa orden, el monto total, cuando se creó, cuando se actualizó, el status de la orden (pendiente, cancelada, entregada) Vamos a crear filtros de órdenes, vamos a paginarlas, vamos a buscarlas, vamos a tratar su estado (no borrado físico) Vamos a utilizar la BD PostgreSQL para guardarlas.

Puntualmente veremos:

- PostgreSQL
- Prisma + PostgreSQL
- Nest resource para microservicios
- Paginaciones y extensiones de DTOs
- Creación y cambio de estado de la orden.

No haremos un CRUD completo porque las órdenes no se actualizarán más que para cambiar su estado de CANCELADA, ENTREGADA y PENDIENTE.

SIGUIENTE SECCION - OBJETIVO 2

El objetivo macro es realizar un detalle de órdenes dentro del microservicio de órdenes (orders-ms). Vamos a tener también una comunicación directa entre el microservicio de productos (product-ms) con este microservicio de órdenes (orders-ms), para verificar que dichos productos existen antes de crear dichas órdenes.

Recordar que, como son BD separadas, no tenemos una manera directa de verificar si, en nuestra BD de órdenes, existe el producto en estado alta. Tendremos que validar que existe el producto antes de insertarlo en una orden.

Vamos a tener que cambiar el dto de una creación de una orden para que aceptemos los items. En nuestro microservicio orders-ms también tendremos que realizar esa modificación para aceptar esa orden. Y, en el microservicio products-ms también tendremos que crear un método en el que recibamos los ids de los productos y verificar que existen. Si no existen, tendremos que lanzar una excepción.

Este ejemplo de microservicio nos va a dar la pauta de por qué es conveniente introducir algún tipo de middleman como Nats o RabbitMQ, algún sistema que nos sirva para mantener el orden cuando existen tantos microservicios.

Por tanto, en esta sección estaremos trabajando con los 3 proyectos creados hasta el momento, puntualmente haremos:

- Gateway - Validación de orden con su detalle de orden
- OrdersMicroservice - Creación de la orden y su detalle
- ProductsMicroservice - Verificación de que cada producto existe en la base de datos.

Haremos validación de DTOs compuestos, comunicación entre microservicios y validación y retorno de la data esperada.

El objetivo dos es este, y nos concentramos en elevar nuestro microservicio de órdenes para que maneje el detalle y la comunicación con el microservicio de productos.

![alt Objetivo_2](../images/Objetivo_2.png)

## Creación de proyecto

En la carpeta `03-Products-App` se ha creado el microservicio, de la siguiente forma:

```
nest new orders-ms
```

## Ejecución del proyecto

```
npm run start:dev
```

## Configurar variables de entorno

Vamos a poner como variable de entorno:

- Puerto: porque cuando transformemos a un microservicio, tenemos que definir en qué puerto y host va a estar corriendo

Estas variables de entorno siempre las vamos a necesitar.

En la carpeta `src` creamos la carpeta `config` y dentro creamos los archivos `envs.ts` y `index.ts`.

También, en el root de la aplicación creamos el archivo `.env` y su copia `.env.template` que es la que llevamos a git.

Instalamos los siguientes paquetes:

```
npm i dotenv joi
```

Siendo `joi` el validador del esquema

## Configurar OrdersMicroservice

Documentación: https://docs.nestjs.com/microservices/basics

Realizamos la instalación del siguiente paquete:

```
npm i --save @nestjs/microservices
```

En el fichero `main.ts`, en vez de hacer la creación tradicional, se usa `createMicroservice` donde se especifica el tipo de transporte que queremos.

Vamos a usar Nest CLI para que nos cree un resource pero de microservicios (el --no-spec es para que no cree el archivo de pruebas):

```
nest g res orders --no-spec
```

Seleccionamos la opción `Microservice (non-HTTP)` y a la pregunta de si queremos generar el CRUD respondemos `Y`.

De lo generado, borramos la carpeta `entities` porque vamos a seguir trabajando con `Prisma`.

De los métodos generados en el controller `orders.controller.ts` eliminamos `update()` y `remove()` porque no los vamos a usar, y vamos a crear un método `changeOrderStatus()` para hacer borrados lógicos.

De los métodos generados en el service `orders.service.ts` eliminamos `update()` y `remove()` porque no los vamos a usar, y vamos a crear un método `changeStatus()` para hacer borrados lógicos.

## Docker - Levantar PostgreSQL

En el root de nuestra aplicación nos creamos el archivo `docker-compose.yml` y lo configuramos.

Este archivo yo lo voy a ejecutar en mi Raspberry Pi porque es ahí donde quiero tener mi contenedor, de la siguiente forma:

`docker compose up -d`

En Squirrel me he generado la siguiente conexión:

```
Nombre: PostgreSQL_RaspberryPi
Driver: PostgreSQL
URL: jdbc:postgresql://192.168.1.41:5432/ordersdb
Nombre de usuario: postgres
Contraseña: 123456
```

## Prisma - Modelo y conexión

https://docs.nestjs.com/recipes/prisma

Vamos a conectar nuestro `orders-ms` con la BD PostgreSQL.

Instalamos el paquete Prisma: `npm install prisma -D`

Inicializamos la configuración inicial de Prisma: `npx prisma init`. Esto crea la carpeta `prisma` y dentro el archivo `schema.prisma`. También, en nuestro archivo `.env` crea la cadena de conexión a nuestro PostgreSQL, que habrá que modificar a:

```
DATABASE_URL="postgresql://postgres:123456@192.168.1.41:5432/ordersdb?schema=public"
```

Copiamos esa cadena de conexión a nuestro archivo `.env.template`.

Abrimos nuestro archivo `schema.prisma` y configuramos como luce nuestro modelo y toda la relación que vamos a tener con nuestra BD.

Una vez hecho, ejecutamos la migración: `npx prisma migrate dev --name init`. Esto crea la carpeta `prisma/migrations` y ciertos archivos que no hay que tocar.

Instalamos y generamos el Prisma Client: `npm install @prisma/client`.

Si nos vamos a nuestra conexión de Squirrel podemos ejecutar: `SELECT * FROM "Order"` y ver la tabla ya creada.

Por último, en nuestro service `orders.service.ts` tenemos que añadir esta parte de extends y el método `onModuleInit()`. Esto es para realizar la inicialización/conexión de nuestra BD.

```
export class OrdersService extends PrismaClient implements OnModuleInit {
  async onModuleInit() {
    await this.$connect();
  }

  ....
}
```

## Crear una nueva orden

Añadimos la información que esperamos en nuestro dto `create-order.dto.ts`.

Instalamos los siguientes paquetes:

```
npm i class-validator class-transformer
```

Configuramos los global pipes en nuestro fichero `main.ts`.

```
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );
```

Decoramos nuestro dto `create-order.dto.ts` con las validaciones que tiene que cumplir la data que nos envían.

Para controlar la validación de la enumeración, creamos en la carpeta `dto`, la carpeta `enum` y dentro la enumeración `order.enum.ts`. Realmente es un arreglo que hace referencia a los distintos valores posibles de la enumeración `OrderStatus` de mi `schema.prisma`.

Como podemos tener varios dtos, en la carpeta `dto` nos creamos un archivo de barril `index.ts`.

Con todo esto ya configurado, podemos ir a nuestro controller `orders.controller.ts` y nuestro service `orders.service.ts` y empezar a codificar para poder crear una nueva orden.

## Paginación y filtro

Una vez hecha la parte de nuestro `client-gateway` cogemos su fuente `orders/dto/order-pagination.dto.ts` y lo copiamos en nuestro microservicio `orders-ms` en la ruta `orders/dto`.

Esto nos da ciertos errores. Para solucionarlos, copiamos también de nuestro `client-gateway` la carpeta `common` a nuestro microservicio `orders-ms` en la carpeta `src`.

Y el único cambio que hacemos en el fuente `order-pagination.dto.ts` es que OrderStatus lo cogemos de Prisma.

## Cambiar status de la orden

Una vez creado el método `changeStatus()` en nuestro Gateway `client-gateway`, tenemos que ver qué vamos a recibir en nuestro microservicio `orders-ms`, controller `orders.controller.ts`, método `changeOrderStatus()`.

Tenemos que crear otro dto.

En la carpeta `orders/dto` creamos el dto `change-order-status.dto.ts`.

## Objetivo 2

### OrderItems - Detalles de la orden

Para facilitar el manejo del estado, modificamos nuestro `schema.prisma` indicando que, cuando se crea una orden, el status tendrá el valor por defecto PENDING.

Además, en `schema.prisma` vamos a crear otro modelo, `OrderItem`, que es el detalle de nuestro modelo ya existente `Order`.

Una vez codificado, tenemos que impactar en la BD. Para ello migramos: `npx prisma migrate dev --name order-item`

Si nos vamos a nuestra conexión de Squirrel podemos ejecutar:

- `SELECT * FROM "Order"`
- `SELECT * FROM "OrderItem"`

### DTOs de creación de orden

Vamos a cambiar la forma de hacer el POST de una orden.

No tiene sentido pedir que me manden `totalAmount` ni `totalItems`, ya que esto depende del detalle de la orden.

Lo vamos a cambiar a este tipo de json:

```
  {
    "items": [
      {
        "productId": 1,
        "price": 100,
        "quantity": 2
      }
    ]
  }
```

Tenemos que cambiar nuestro DTO, situado en `orders/dto/create-order.dto.ts`.

Y tenemos que crear un DTO de items. En `orders/dto` creamos el nuevo dto `order-item.dto.ts`.

### Comunicar order-ms con products-ms

La configuración para comunicarnos con products-ms se hace en nuestro microservicio `orders-ms`, en `orders.module.ts`.

Los pasos son:

- Archivo .env y .env.template

```
PRODUCTS_MICROSERVICE_HOST=localhost
PRODUCTS_MICROSERVICE_PORT=3001
```

- Archivo envs.ts. Configuramos y acabamos exportando

```
  productsMicroserviceHost: envVars.PRODUCTS_MICROSERVICE_HOST,
  productsMicroservicePort: envVars.PRODUCTS_MICROSERVICE_PORT,
```

- Nos creamos en la carpeta `config` el archivo `services.ts`

```
export const PRODUCT_SERVICE = 'PRODUCT_SERVICE';
```

- En el módulo `orders.module.ts` importamos PRODUCT_SERVICE

```
  imports: [
    // Es un arreglo porque podemos indicar cualquier número de microservicios
    // con los que queramos comunicarnos.
    //
    // El PRODUCT_SERVICE es lo que vamos a usar para inyectar el microservicio en los
    // controladores u otros lugares como services...
    //
    // El valor indicado en transport tiene que ser el mismo canal de comunicación que
    // indicamos en el archivo main.ts de nuestro proyecto product-ms
    //
    // También tenemos que indicar el host y el puerto del host.
    // Esto lo hacemos en variables de entorno.
    ClientsModule.register([
      {
        name: PRODUCT_SERVICE,
        transport: Transport.TCP,
        options: {
          host: envs.productsMicroserviceHost,
          port: envs.productsMicroservicePort,
        },
      },
    ]),
  ],
```

Para confirmar que todo esto funciona, es nuestro service `orders.service.ts` añadimos un constructor y modificamos el método `create()`

## Testing

- Clonar el repositorio
- Instalar dependencias
- Crear un archivo `.env` basado en `env.template`
- Levantar la base de datos en Raspberry Pi
  - Ir a la ruta `/home/pi/docker/postgresql/orders-ms` y ejecutar `docker compose up -d`
- Ejecutar migración de Prisma `npx prisma migrate dev`
- Ejecutar `npm run start:dev`
