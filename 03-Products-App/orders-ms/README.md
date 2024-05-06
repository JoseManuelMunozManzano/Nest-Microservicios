# orders-ms

Es un microservicio que se va a encargar del encabezado de las órdenes de productos. Se va a indicar el total de items de esa orden, el monto total, cuando se creó, cuando se actualizó, el status de la orden (pendiente, cancelada, entregada) Vamos a crear filtros de órdenes, vamos a paginarlas, vamos a buscarlas, vamos a tratar su estado (no borrado físico) Vamos a utilizar la BD PostgreSQL para guardarlas.

Puntualmente veremos:

- PostgreSQL
- Prisma + PostgreSQL
- Nest resource para microservicios
- Paginaciones y extensiones de DTOs
- Creación y cambio de estado de la orden.

No haremos un CRUD completo porque las órdenes no se actualizarán más que para cambiar su estado de CANCELADA, ENTREGADA y PENDIENTE.

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

## Testing

- Clonar el repositorio
- Instalar dependencias
- Crear un archivo `.env` basado en `env.template`
- Ejecutar `npm run start:dev`
