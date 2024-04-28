# products

## Creación de proyecto

Vamos a la carpeta del curso y usamos el comando: `nest new products`.

Luego nos llevamos el proyecto `products` a nuestra carpeta `01-Reforzamiento`.

## Instalación

```bash
$ npm install
```

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

## Postman

En la carpeta Postman se encuentran los endpoints probados.

Indicar que como este ejemplo se hace en memoria, lo primero va a ser siempre hacer el POST para crear algunos productos.
