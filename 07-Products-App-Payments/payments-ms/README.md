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

## Testing

- Ejecutar con el comando: `npm run start:dev`
