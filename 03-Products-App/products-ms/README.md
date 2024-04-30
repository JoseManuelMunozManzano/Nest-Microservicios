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
