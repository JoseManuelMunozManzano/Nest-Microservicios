# products

## Creación de proyecto

Vamos a la carpeta del curso y usamos el comando: `nest new products`.

Luego nos llevamos el proyecto `products` a nuestra carpeta `01-Reforzamiento`.

## Instalación

```bash
$ npm install
```

Renombrar el archivo .env.template a .env

## Ejecutar la app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Rest - Products CRUD

Ejecutar en la terminal el comando: `nest g res products`

A las preguntas, respondemos `REST API` y `Y`

Instalamos los siguientes paquetes para poder realizar validaciones:

```
npm i class-validator class-transformer
```

Instalamos el siguiente paquete (y sus types para Typescript) para poder generar id:

```
npm i uuid
npm i --save-dev @types/uuid
```

## Variables de entorno

Solo vamos a configurar una variable de entorno, el puerto.

Las variables de entorno son fundamentales en los microservicios. Es la manera en la que podemos configurar esos microservicios.

Para trabajar con microservicios, es más cómodo trabajar con las variables de entorno usando el paquete `dotenv` en vez de usar ConfigModule, que es lo que indica el pdf de los atajos de Nest.

Instalamos dicho paquete: `npm i dotenv`.

En la carpeta `src` creamos la carpeta `config` y dentro el archivo `envs.ts`, y en el root de nuestro proyecto creamos los archivos `.env` y `.env.template`, siendo este último el que se guarda en Git.

## Esquema de validación

Sirve para validar nuestras variables de entorno. Si no existen o su valor no es del tipo que queremos debe lanzar un error y no levantarse nuestra aplicación REST o nuestro microservicio.

En este curso vamos a estar trabajando con el paquete Joi.

Instalamos dicho paquete: `npm i joi`.

La ventaja de este montaje es que ahora, a lo largo de toda la app, podemos usar envs de manera síncrona. Evitamos usar async solo para esperar tener nuestros valores de variable de entorno.

## Postman

En la carpeta Postman se encuentran los endpoints probados.

Indicar que como este ejemplo se hace en memoria, lo primero va a ser siempre hacer el POST para crear algunos productos.
