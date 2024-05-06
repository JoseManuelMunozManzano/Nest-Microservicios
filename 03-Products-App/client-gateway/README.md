# client-gateway

Habría que entender un Gateway como un cliente RESTFul tradicional, con la diferencia de que en el Gateway no van a haber conexiones a BBDD (puede que si pero no es lo normal), sino que su función principal es escuchar las peticiones de nuestros clientes (web, mobile) y hacer la comunicación con nuestros servicios.

Si sabemos que hay limitaciones a la hora de comunicarnos con nuestros microservicios, por ejemplo, que nuestro product-ms tenga validaciones con respecto a que hay que enviar límite y página, y que sean números..., podemos hacer de antemano esas validaciones en el Gateway para no tener que mandar información basura al microservicio, ya que sabemos que no va a funcionar.

Vamos a aprender a manejar las excepciones u errores, vamos a crear un ExceptionFilter global a todos nuestros microservicios y vamos a aprender dos formas de manejar estas excepciones, con observables y con promesas.

Por tanto, veremos:

- Envío de payload hacia el microservicio
- Enviar mensajes del Gateway al microservicio
- Configuración de excepciones
- Independientes
- Globales
- Trabajar con observables y promesas en los mensajes

## Creación de proyecto

En la carpeta `03-Products-App` se ha creado este proyecto:

```
nest new client-gateway
```

## Ejecución del proyecto

```
npm run start:dev
```

## Variables de entorno

En la carpeta `src` creamos la carpeta `config` y dentro los archivos `envs.ts` e `index.ts`.

Instalamos los paquetes joi y dotenv:

```
npm i joi dotenv
```

En el root creamos el archivo de variables de entorno `.env` y su template que es a lo que hacemos seguimiento `.env.template`.

## Rutas

Creamos la configuración de las rutas para que los endpoints que creamos en el proyecto `products-ms` funcionen.

```
nest g res products
```

En este caso, recordar que nuestro gateway si es un `REST API` endpoint, y a la pregunta de si queremos crear un CRUD entry points indicamos `n` porque no nos hace falta todo lo que el CRUD crea por defecto.

De todo lo que crea nos creamos con el controlador y el module, pero vacíos.

## Levantar Products Microservice y conectarlo al Gateway

Vamos a usar la extensión de VSCode `Peacock` para ayudar a no perderse entre tantos proyectos abiertos. Cambia el color del espacio de trabajo. Ideal cuando se tiene varias instancias de VSCode e identificar rápidamente cuál es cuál.

Levantamos nuestro microservicio products-ms: `npm run start:dev`

Para conectarnos a nuestro product-ms podemos ver la siguiente documentación: https://docs.nestjs.com/microservices/basics#client

Tenemos que instalar el paquete de microservices: `npm i @nestjs/microservices`

Ahora tenemos que registrar un `inyection token` para poder registrar un microservicio en el cliente, e indicamos el tipo de transporte que vamos a realizar. Este código lo vamos a colocar dentro de `products.module.ts`.

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

Como es fácil equivocarse al escribir `PRODUCT_SERVICE` lo que vamos a hacer en la carpeta `config` es crearnos un archivo `services.ts` e indicar ahí una constante con un valor de inyection token. Usaremos esa constante en vez del string.

## Obtener todos los productos

En `products.controller.ts` tenemos que inyectar en el constructor nuestro inyection token creado anteriormente (PRODUCT_SERVICE)

```
  constructor(
    @Inject(PRODUCT_SERVICE) private readonly productsClient: ClientProxy,
  ) {}
```

Con esto ya tenemos acceso a lo que sea que este expuesto en el proyecto `product-ms`. Por ejemplo, en este momento queremos conectarnos a nuestro `ProductTCP.FIND_ALL`

Tenemos que crear en este client gateway, en `src` la carpeta `common`, dentro la carpeta `constants` y dentro el archivo `message_pattern.constants.ts` con la misma información que creamos en el proyecto products-ms. También creamos el archivo de barril `src/common/index.ts`

```
  @Get()
  findAllProducts() {
    // Si esperamos una respuesta usaremos send(). Si no esperamos una respuesta usaremos emit().
    // Tenemos que indicar el pattern y el payload validado.
    return this.productsClient.send({ cmd: ProductTCP.FIND_ALL }, {});
  }
```

## Paginar resultados y enviar payload

Cogemos de nuestro proyecto `products-ms` la carpeta `common/dto` y lo copiamos a nuestro proyecto `client-gateway`.

También instalamos los siguientes paquetes:

```
npm i class-transformer class-validator
```

Y hacemos la configuración de los global pipes en nuestro `main.ts`.

Al final, nuestro método queda:

```
  @Get()
  findAllProducts(@Query() paginationDto: PaginationDto) {
    // Si esperamos una respuesta usaremos send(). Si no esperamos una respuesta usaremos emit().
    // Tenemos que indicar el pattern y el payload validado.
    return this.productsClient.send(
      { cmd: ProductTCP.FIND_ALL },
      paginationDto,
    );
```

## Manejo de excepciones

¿Cómo recupero en mi client-gateway la excepción lanzada desde mi microservicio products-ms, para manejarla?

En nuestro `products-ms` se ha cambiado, en `products.service.ts` la excepción `NotFoundException` por una `RpcException`. Con esto, cuando se lance esta excepción, tendremos en la consola de nuestro client-gateway el log del error con una mejor información.

Trabajando con Rxjs y Observables, y try...catch también tenemos acceso al mensaje erroneo (si falla) y podemos capturarlo y hacer con el lo que queramos.

## Microservice Exception Filter

Aunque lo que hemos hecho en nuestro `products.controller.ts` no es malo, vamos a atrapar los errores en un único lugar para que la respuesta de error siempre sea manejada como si fueran objetos, es decir, vamos a centralizar los errores usando un `rpcExceptionFilter`.

https://docs.nestjs.com/microservices/exception-filters

En esta documentación se indica que el global exception filter no funciona para aplicaciones híbridas (servicio REST y comunicaciones con microservicios)

En nuestra carpeta `common` vamos a crear una carpeta llamada `exceptions` y dentro el archivo `rpc-custom-exception.filter.ts`.

Esta configuración funciona cuando se hace en el microservicio, pero nosotros lo estamos configurando en el cliente.

## Implementar métodos faltantes

Para la creación, actualización y eliminación, lo único que tenemos que hacer en el Gateway es validar los valores que recibimos y llamar de forma correcta teniendo en cuenta el @MessagePattern de nuestros microservicios.

En la carpeta `products` copiamos la carpeta `products/dto` de nuestro micorservicio `products-ms`.

## Conectar Gateway con OrdersMicroservice

Recordar que tenemos que estar ejecutando tanto este `client-gateway` como el microservicio `orders-ms`.

Tenemos que implementar los métodos `create()`, `findAll()` y `findOne()` del proyecto `orders-ms` para obtener las respuestas de dicho microservicio.

Para empezar, generamos los resources:

```
nest g res orders --no-spec
```

Seleccionamos `REST API` y a la pregunta sobre si generar el CRUD, respondemos `Y`, pero vamos a borrar bastantes cosas.

La carpeta `entities` no la vamos a usar y la borramos.

El controller `orders.controller.ts` hace una inyección de un servicio. Como no lo necesitamos, borramos la property del constructor. Borramos también los métodos `update()` y `remove()` porque no los vamos a usar.

Borramos el servicio `orders.service.ts`.

En nuestro módulo `orders.module.ts` eliminamos el provider completo, porque hace referencia al servicio que no usamos.

En la carpeta `config`, archivo `services.ts` incluimos la constante:

```
export const ORDER_SERVICE = 'ORDER_SERVICE';
```

En nuestro fichero de variables de entorno `.env` y su template `.env.template` añadimos:

```
ORDERS_MICROSERVICE_HOST=localhost
ORDERS_MICROSERVICE_PORT=3002
```

Y lo configuramos con `Joi` en el fichero `config/envs.ts`.

En nuestro módulo `orders.module.ts` configuramos en los imports el microservicio con el que queremos comunicarnos:

```
  imports: [
    // Es un arreglo porque podemos indicar cualquier número de microservicios
    // con los que queramos comunicarnos.
    //
    // El ORDER_SERVICE es lo que vamos a usar para inyectar el microservicio en los
    // controladores u otros lugares como services...
    //
    // El valor indicado en transport tiene que ser el mismo canal de comunicación que
    // indicamos en el archivo main.ts de nuestro proyecto orders-ms
    //
    // También tenemos que indicar el host y el puerto del host.
    // Esto lo hacemos en variables de entorno.
    ClientsModule.register([
      {
        name: ORDER_SERVICE,
        transport: Transport.TCP,
        options: {
          host: envs.ordersMicroserviceHost,
          port: envs.ordersMicroservicePort,
        },
      },
    ]),
  ],
```

Por último, en nuestro controller inyectamos el `ORDER_SERVICE` creado y conectamos los métodos `create()`, `findAll()` y `findOne()` al microservicio `orders-ms`.

## Testing

- Clonar el repositorio
- Instalar dependencias
- Ejecutar `npm run start:dev`
- Levantar de manera independiente el proyecto products-ms usando también Peacock para diferenciar el espacio de trabajo: `npm run start:dev`
- Levantar de manera independiente el proyecto orders-ms usando también Peacock para diferenciar el espacio de trabajo: `npm run start:dev`

Postman:

En la carpeta del root `postman` dejo:

- Los ejemplos de rutas a ejecutar para hacer POST, GET, PATCH y DELETE a products.
- Los ejemplos de rutas a ejecutar para hacer POST y GET a orders.
