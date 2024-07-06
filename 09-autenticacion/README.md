# Autenticacion

Se va a realizar una autenticación basada en JSON Web Token que usaremos para verificar nuestros endpoints.

Se va a generar una BD de usuarios en MongoDB. Vamos a verificar contra esa BD de MongoDB usando Prisma.

Vamos a generar los usuarios, hacer un hash de sus contraseñas y un procedimiento que nos permita verificar un token de nuestro microservicio.

Y luego vamos a hacer que el gateway hable con ese microservicio también, para asegurarnos que el token es válido.

Puntualmente veremos:

- Nuevo microservicio auth-ms
- Inicio de proyecto desde el launcher
- Decoradores personalizados
- MongoDB
- Prisma con MongoDB
- JWTs, firma y generación
- Revalidación
- Guards

## Integración de proyecto Auth-ms

Este proyecto va a nacer directamente en nuestro `products-launcher` para saber como hacerlo.

Creamos en Bitbucket un nuevo repositorio llamado `auth-ms` que contenga un README.md porque necesitamos que el repositorio tenga algo, porque no podemos añadir un submodulo si no hay contenido.

Copiamos el URL que nos da Bitbucket y creamos el submodulo: `git submodule add https://Neimerc@bitbucket.org/neimerc/auth-ms.git auth-ms`. Con esto clonamos el repositorio en `products-launcher` y crearemos ahí nuestro proyecto de Nest.

Accedemos a la carpeta `auth-ms` y escribimos el comando `nest new auth-ms`. Esto crea una carpeta `auth-ms` dentro de la carpeta `auth-ms`. Lo que vamos a hacer es mover de la carpeta interna `auth-ms` a la carpeta de fuera, borrando el `auth-ms` interno.

Ahora solo tenemos que levantar el proyecto,. Para probar si todo está funcionando nos vamos a una nueva terminal, accedemos a la carpeta `auth-ms` y ejecutamos `npm run start:dev`.

En el proyecto he creado una carpeta `postman` con los endpoints de Postman.

## Comunicar Gateway con Auth-ms

**auth-ms**

Este microservice `auth-ms` no va a ser híbrido, sino un simple microservicio. Va a tener tres endpoints.

Hemos borrado, en la carpeta `auth-ms/src`, los fuentes `app.controller.spec`, `app.controller.ts` y `app.service.ts`.

Dentro de la carpeta `auth-ms` nos generamos el siguiente resource: `nest g res auth --no-spec`. Seleccionamos `Microservice (non-HTTP)` y `n` a la pregunta de si queremos generar el CRUD. Esto crea el módulo, el servicio y el controlador que necesito.

Instalamos el paquete `npm i --save @nestjs/microservices` y creamos los tres endpoints en nuestro `auth.controller.ts` recien creado.

Y también instalamos NATS (https://docs.nestjs.com/microservices/nats) `npm i --save nats` y el paquete joi y dotenv `npm i --save joi dotenv`.

Creamos los ficheros `.env` y su clon `.env.template` para variables de entorno, y también el archivo de configuración`config/envs.ts`, el archivo de barril `config/index.ts` y el archivo `services.ts`.

Ahora modificamos nuestro `main.ts` para transformar a microservicio.

Nos creamos en la raiz los archivos `.dockerignore` y `dockerfile`.

**client-gateway**

En la parte de `client-gateway` necesitamos crearnos otro módulo para que todo esté bien agrupado y tenga su responsabilidad única.

Lo primero que he tenido que hacer es instalar las dependencias, porque como no aparecen al clonar `products-launcher` me daba error. `npm i`.

Vamos a la carpeta de `client-gateway` y creamos un nuevo resource: `nest g res auth --no-spec`. Seleccionamos `REST API` y `n` a la pregunta de si queremos generar el CRUD. Esto crea el módulo y el controlador que necesito. Vamos a la nueva carpeta en `client-gateway/src/auth` y borramos `auth.service.ts` porque no lo necesito. Y en `auth.controller.ts` borro la parte de importación del service porque ya no existe y creamos los RESTFul API endpoints que necesitamos.

**products-launcher**
En el archivo `docker-compose.yml` añadimos la parte del `auth-ms`.

## Login y Register DTOs

Vamos a configurar los DTOs para que la información vaya validada.

En proyectos reales, `auth-ms` va a dictar lo que necesita y `client-gateway` se tiene que adaptar a lo que el microservicio pide.

Aunque al final el DTO que va en los dos es el mismo.

**auth-ms**

En `src/auth` creamos la carpeta `dto` y dentro el archivo de barril `index.ts` y los dto `login-user.dto.ts` y `register-user.dto.ts`.

Aunque no vamos a utilizar directamente las respuestas HTTP, igualmente vamos a instalar `class-validator` y `class-transform`.

```
npm i class-validator class-transformer
```

Modificamos `main.ts` para tener la validación de los dto.

Modificamos `auth.controller.ts` para añadir el payload.

**client-gateway**

En la carpeta `src/auth` copiamos la capeta `dto` que creamos en el microservicio `auth-ms`.

Modificamos `auth.controller.ts` ya teniendo en cuenta estos dto.

## Aprovisionar MongoDB

https://www.mongodb.com/es/products/platform/atlas-database

Vamos a grabar en MongoDB nuestros usuarios y encriptar sus contraseñas y lo vamos a usar para validar.

Esta parte de MongoDB NO lo vamos a hacer mediante Docker porque muchos usuarios indican problemas para conectar Prisma con la imagen de Mongo como un contenedor.

Lo que vamos a hacer es aprovisionar la BD de MongoDB usando MongoDB Atlas (url de arriba).

Yo tengo instalado MongoDB Compass, así que me conecto por ahí.

Recordar que hay que tener configurado, en MongoDB Atlas, la parte de Database Access (un usuario con permisos) y Network Access (la ip desde donde nos conectamos usando MongoDB Compass)

**products-launcher**

Lo que si necesitamos es obtener el password de un usuario de acceso a nuestro MongoDB y colocarlo en nuestro `.env` como una variable de entorno y añadir esa variable de entorno a nuestro `docker-compose.yml` en la parte donde configuramos `auth-ms`.

## Conectar Prisma con MongoDB

https://www.prisma.io/docs/orm/overview/databases/mongodb

Vamos a conectar Prisma con MongoDB para hacer las inserciones de BD y demás.

**auth-ms**

Necesitamos instalar Prisma como dependencia de desarrollo.

```
npm i -D prisma
```

Inicializamos Prisma.

```
npx prisma init
```

Este comando crea en la carpeta `auth-ms`, en el archivo `.env`, una variable de entorno con key `DATABASE_URL`. Pero como no queremos conectarnos a una BD PostgreSQL, lo cambiamos por la variable de entorno `AUTH_DATABASE_URL` que tenemos en el archivo `.env` de `products_launcher` pero le cambiamos el nombre de la key por `DATABASE_URL` para que sea como el que Prisma nos creó por defecto y donde apunta `auth-ms/prisma/schema.prisma`.

Esto es solo para que Prisma pueda generar el cliente.

De nuevo, en `auth-ms/prisma/schema.prisma` nos creamos nuestro modelo, que será muy sencillo y cambiamos nuestro provider a `mongodb`.

Si estuviéramos trabajando con una BD relacional tradicional, tendríamos que hacer una migración, pero como estamos trabajando con MongoDB, que nos permite grabar objetos sin una estructura fija (podemos grabar lo que queramos) no hace falta hacer dicha migración.

Lo que sí hace falta es generar el cliente de Prisma basado en el esquema.

```
npx prisma generate
```

Como este comando forma parte del proceso de pruebas, es decir, hay que ejecutarlo para que se pueda levantar, creamos un script nuevo en `package.json` llamado `prisma:docker` y modificamos el script `start:dev` para que lo llame.

Para confirmar que puedo conectarme a Mongo desde mi código, modificamos `auth.service.ts`.

**product-launcher**

Probamos ejecutando `docker compose up --build` que tomará las nuevas dependencias y los cambios realizados en el `package.json`. Va a levantar el client, el servidor de Nats , pero lo que realmente nos interesa es que genere el Prisma Client del lado de nuestro contenedor, en nuestro Linux.

Si nos vamos a Docker, a los logs, deberíamos ver el log `MongoDB connected`.

## Registro de un usuario

Vamos a grabar en BD nuestro primer usuario.

**auth-ms**

Hemos modificado `prisma/schema.prisma` indicando @unique en el campo email de nuestro modelo. Indicar que no está funcionando esta parte de Prisma con MongoDB.

Volvemos a generar el cliente de Prisma: `npx prisma generate`.

Modificamos `auth.controller.ts` y `auth.service.ts`.

**client-gateway**

Modificamos `src/auth/auth.controller.ts` para manejar la excepción si algo ha ido mal y obtener el error que viene de nuestro microservicio `auth-ms`. Sin esto, el error será un status 500 con mensaje Internal Server Error.

**testing**

Probamos el POST para registrar un usuario en Postman (ver el testing abajo del todo para ver el endpoint)

## Encriptar contraseña

**auth-ms**

Dentro de este microservicio hacemos las siguientes instalaciones: `npm i bcrypt`, y su tipado `npm i -D @types/bcrypt`.

Modificamos `auth.service.ts`.

**testing**

Para probar esto, borramos desde MongoDB Compass los usuarios que ya hayamos creado, puesto que su contraseña no estaba encriptada, y volvemos a registrar algún usuario desde Postman, para comprobar que ahora sí que aparece el hash del password.

## Login de usuario

El login es muy similar al registro.

**auth-ms**

Modificamos `auth.service.ts` y `auth.controller.ts`.

**client-gateway**

Modificamos `src/auth/auth.controller.ts` para manejar la excepción si algo ha ido mal y obtener el error que viene de nuestro microservicio `auth-ms`. Sin esto, el error será un status 500 con mensaje Internal Server Error.

**testing**

Probamos el POST para hacer login de un usuario en Postman (ver el testing abajo del todo para ver el endpoint)

## Generar JWT

https://docs.nestjs.com/security/authentication#jwt-token

Vamos a asegurarnos de que en nuestras respuestas, tanto el registro como el login, devuelvan un JWT con la información que nosotros queramos.

**auth-ms**

Dentro de este microservicio hacemos las siguientes instalaciones: `npm i @nestjs/jwt`.

Como en `auth.service.ts` vamos a hacer la inyección del servicio Jwt, necesitamos hacer la importación de un módulo en `auth.module.ts`. En el módulo registramos de forma global el JwtModule.

Necesitamos un Jwt Secret para firmar nuestros tokens. Esto no tiene que salir del servidor y entre menos se mueva de este servidor mejor. Lo vamos a colocar como una variable de entorno en `.env` y nuestro clon `.env.template`. Debemos modificar también `config/envs.ts`.

En nuestro `auth.service` hemos creado un método que recibe un payload. Para darle un tipado estricto a dicho payload, creamos, en `auth`, la carpeta `interfaces` y dentro el archivo `jwt-payload.interface.ts`.

**product-launcher**

En el archivo `.env` y su clon `.env.template` copiamos la variable de entorno JWT_SECRET que creamos en el microservicio `auth-ms`.

También lo indicamos en el archivo `docker-compose.yml` en la parte donde configuramos el lanzamiento de `auth-ms`.

**testing**

Probamos el POST para hacer register y/o login de un usuario en Postman (ver el testing abajo del todo para ver el endpoint)

Con el token que obtengo, voy a la url `jwt.io` y pego ese token para ver la data que contiene.

## Testing

En nuestro proyecto `products-launcher`.

Vamos a levantar el `client-gateway` y el `authService` más el `NATS`.

No nos va a hacer falta levantar todavía la parte de payments, ni de órdenes ni de productos.

Para todo ello, ejecutar: `docker compose up --build`

Para probar la parte de auth-ms ejecutar estos endpoint en Postman

POST: `http://192.168.1.41:3000/api/auth/register`

```
JSON body
{
    "name": "José Manuel",
    "email": "jmmunoz@google.com",
    "password": "Abc123456@"
}
```

POST: `http://192.168.1.41:3000/api/auth/login`

```
JSON body
{
    "email": "jmmunoz@google.com",
    "password": "Abc123456@"
}
```

GET: `http://192.168.1.41:3000/api/auth/verify`

**Importante**
A la hora de subir a Bitbucket primero se suben los submodules y por último el product-launcher.

Es decir, en este caso primero subimos `auth-ms` y `client-gateway` y luego `product-launcher`.
