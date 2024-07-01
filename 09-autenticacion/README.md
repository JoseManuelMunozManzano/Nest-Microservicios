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

## Testing

En nuestro proyecto `products-launcher`.

Vamos a levantar el `client-gateway` y el `authService` más el `NATS`.

No nos va a hacer falta levantar todavía la parte de payments, ni de órdenes ni de productos.

Para todo ello, ejecutar: `docker compose up --build`
