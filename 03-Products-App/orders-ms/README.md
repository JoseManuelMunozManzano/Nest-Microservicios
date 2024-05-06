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

## Testing

- Clonar el repositorio
- Instalar dependencias
- Crear un archivo `.env` basado en `env.template`
- Ejecutar `npm run start:dev`
