# products-ms

En esta sección crearemos nuestro primer microservicio para manejar productos, pero nacerá como un servicio REST que luego transformaremos en un microservicio para que mentalmente podamos hacer las conexiones de las similitudes.

Puntualmente veremos:

- CRUD
- MessagePattern
- SQLite
- Prisma con Nest
- Migraciones
- Transformar REST a Microservicio
- Aplicaciones Híbridas Rest + Microservicios (esto se verá a profundidad en la sección de Auth)
- GitHub - Organizaciones

Una vez creado nuestro microservicio de productos, empezaremos a construir las otras piezas de este rompecabezas poco a poco.

## Creación de proyecto

En la carpeta `03-Products-App` se ha creado el microservicio, que, como se ha dicho, nace como un servicio REST, de la siguiente forma:

```
nest new products-ms
```

## Ejecución del proyecto

```
npm run start:dev
```

## Creación del RESTFul API endpoint

Lo hacemos como lo haríamos usualmente, es decir, con un `resource`.

```
nest g res products --no-spec
```

Seleccionamos `REST API` y a la pregunta sobre generar un CRUD respondemos con `Y`.

## Archivo .eslintrc.js

Se añade el siguiente código en el objeto `rules` del fuente `.eslintrc.js`

```
    'prettier/prettier': [
      'error',
      {
        endOfLine: 'auto',
      },
    ],
```

## Validaciones

Instalamos Los siguientes paquetes para poder hacer uso de las validaciones:

```
npm i class-validator class-transformer
```

No olvidar añadir la configuración global de pipes para que las validaciones surtan efecto, esto en el fuente `main.ts`.

```
app.useGlobalPipes(
  new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,

    // Esto es un extra
    // En el formato de respuesta de los errores en NestJS estos vendrán agrupados por la key del body.
    exceptionFactory: (errors) => {
      const result = errors.map((error) => ({
        [error.property]: {
          errors: Object.values(error.constraints),
        },
      }));

      return new BadRequestException(result);
    },

  })
);
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

## Prisma - SQLite

Documentación: https://docs.nestjs.com/recipes/prisma

Otra documentación para aplicar patrón repository:

- https://www.linkedin.com/pulse/implementing-repository-pattern-nestjs-nadeera-sampath/
- https://www.tomray.dev/nestjs-prisma

Prisma es similar a TypeORM y a Sequelize.

Tenemos que instalar los siguientes paquetes:

```
npm i -D prisma
```

Lo que hace Prisma es crearnos un cliente, y nosotros trabajamos con ese cliente. El cliente está personalizado a nuestra base de datos.

Una vez instalado, ejecutamos para ejecutar la inicialización:

```
npx prisma init
```

Esta ejecución modifica nuestro fuente `.env`, donde añade una cadena de conexión para PostgreSQL. Como nosotros vamos a trabajar con SQLite tenemos que cambiarlo a:

```
DATABASE_URL="file:./dev.db"
```

SQLite es una BBDD que crea un archivo físico.

La inicialización también creó un directorio `prisma` y un archivo `schema.prisma`.

En dicho archivo, cambiamos el provider del datasource a `sqlite`.

Y nos creamos, también en dicho archivo, el modelo de nuestra tabla `Product`.

Ahora ejecutamos la migración. Lo que hace es preparar nuestra BBDD para que luzca exactamente como tenemos definido el esquema.

```
npx prisma migrate dev --name init
```

Esto crea en la carpeta `prisma` la carpeta `migrations`, también la BD `dev.db` y un journal `dev.db-journal`.

Por último, hacemos la instalación del Prisma client.

```
npm i @prisma/client
```

Este Prisma client es creado basado en nuestro esquema y también se va a relacionar con nuestros servicios. De ahí que ahora tocamos el fuente `src/products/products.service.ts`.

En la otra documentación se habla de como trabajar con el patrón repository en vez de con el service.
