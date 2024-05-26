# Payments Microservice

En este proyecto que ya contiene todos los microservicios, Nats y Docker, vamos a crear el microservicio de Payments.

Para crear el proyecto, que todavía no es un microservicio, sino un proyecto RESTFul tradicional:

- `nest new payments-ms` y seleccionamos npm
- Hacemos la configuración de las variables de entorno
  - Dentro de `src` creamos la carpeta `config` y dentro el archivo `envs.ts` y el archivo de barril `index.ts`
  - Uso el snippet que me creé `microenvs`
  - Instalamos los paquetes: `npm i dotenv joi`
- Hacemos uso del archivo de variable de entorno en `main.ts`
- Creamos en la raiz los archivos `.env` y `.env.template`
- Añadimos al fichero `.gitignore` el texto `.env` para que no lo pase a GitHub

## Creación de RESTFul API Endpoints

En la terminal ejecutamos: `nest g res payments --no-spec`

Seleccionamos `REST API` y a la pregunta sobre si crea los CRUD entry points seleccinamos `n`. Esto crea los fuentes:

- payments.controller.ts
- payments.module.ts
- payments.service.ts

En `payments.controller.ts` nos definimos los endpoints.

## Testing

- Ejecutar con el comando: `npm run start:dev`
- En la carpeta `postman` se ha dejado un ejemplo de llamada desde Postman
