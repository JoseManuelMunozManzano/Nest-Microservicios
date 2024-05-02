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

## Testing

- Clonar el repositorio
- Instalar dependencias
- Ejecutar `npm run start:dev`
