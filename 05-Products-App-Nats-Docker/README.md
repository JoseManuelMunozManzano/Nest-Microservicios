# 05-Products-App-Nats-Docker

Nos vamos a enfocar en como poder trabajar todos nuestros microservicios y poder seguir desarrollando nuevas características (o features) de una manera que nos permita tener una única terminal corriendo, y también tener un repositorio que tenga todas las referencias a los proyectos. Esto no significa crear un monorepo, sino que serán links que nos llevarán al repositorio donde está el fuente de esa aplicación. También vamos a crear un archivo de Docker Compose para que, mediante un único comando, levante todo, es decir, la BD, el servidor de NATS, el Gateway y nuestros microservicios.

En esta sección no nos vamos a enfocar mucho en la parte de microservicios, pero si en como manejarlos. Es una forma organizada de trabajar con microservicios.

Por tanto, vamos a tomar todo el código y nos vamos a crear un nuevo repositorio que nos permita, mediante un único comando, clonar todo el proyecto, con un segundo comando, actualizar los repositorios, y con un tercer comando, levantar todo automáticamente.

Recordar que el problema que queremos resolver es:

![alt Objetivo 4](./images/Objetivo_4.png)

## Crear red y levantar todo con un solo comando

En la raiz del proyecto, donde se encuentran las carpetas `orders-ms`, `products-ms` y `client-gateway`, creamos los archivos `docker-compose.yml` y `.dockerignore`, siendo este último similar al fichero .gitignore, y donde informamos todos los archivos que queremos ignorar a la hora de hacer alguna construcción.

En este archivo vamos a configurar todo de manera simultanea.

También, dentro del proyecto `client-gateway` vamos a crear, en su raiz, un archivo `dockerfile`. Este archivo es el eslabón que hace falta para conectar el proceso de construcción de `docker-compose.yml`, service client-gateway. El dockerfile son las instrucciones para crear la aplicación como una imagen que se puede subir a DockerHub.

También copiamos el fichero `.dockerignore` que hemos creado antes, a la raiz de los proyectos `client-gateway`, `orders-ms` y `products-ms`.

## Añadir NATS Server y Products Microservice

Modificamos `docker-compose.yml` para levantar nuestro NATS Server.

Aunque indicamos como `image: nats:latest` para producción debemos indicar etiquetas específicas, porque puede ser que la última versión sea incompatible. Subiremos las versiones manualmente.

De los puertos indicados, solo me interesa el `8222`, porque ese es el puerto que se usa a nivel interno de aplicación. Los otros puertos que aparecen en la documentación se usan para hablar con el mundo exterior, pero yo tengo toda mi aplicación junta en el mismo contenedor, con lo que no me hacen falta.

Indicar que en Docker he eliminado el container y la imagen de NATS que estaba sola.

Ahora ya podemos indicar la siguiente imagen del contenedor, la de productos.

Necesitamos copiar el fichero `dockerfile` que tenemos en `client-gateway` a `products-ms`. Solo hay que modificarlo para añadir `Prisma`.

E, igualmente, modificamos nuestro `docker-compose.yml`. Podemos ver que el puerto podría seguir siendo el 3000. Esto funciona porque cada servicio es como una máquina virtual independiente. Además, el puerto solo se usa para exponer la aplicación como tal al mundo exterior, pero la comunicación entre ellos no sucede por el puerto 3000, sino por Nats. Lo que hacemos, igualmente, es poner el puerto 3001, pero esto es para que alguien desde el mundo exterior se pueda conectar.

IMPORTANTE: En `environment`, en `NATS_SERVER`, hay que indicar correctamente el nombre del host. Cuando estamos trabajando en una red de Docker, se crea un DNS automático. Entonces, ¿cuál es el nombre del servidor de NATS dentro de la red de Docker? Es el nombre del servicio que hemos indicado en nuestro fichero `docker-compose.yml`, en este caso, `nats-server`.

## Docker Compose Build ¿qué pasa?

Si nosotros no tuviéramos la BD ni las migraciones de Prisma en el microservicio `products-ms` tendríamos un problema. Dentro de ese microservicio tenemos el fichero `dockerfile` donde estamos construyendo la imagen, y necesitamos el esquema de Prisma para ejecutarlo. El comando `RUN npx prisma generate` es útil si la BD ya está creada. Podemos añadir antes el comando `RUN npx prisma migrate dev`.

Con la BD de PostgreSQL que tenemos en el microservicio `orders-ms` vamos a tener un problema, y es que no va a estar levantada la BD para el momento de hacer la migración por lo que no podemos añadir el migrate. Tampoco va a funcionar con problemas de la vida real.

Solución:

- En el fichero `dockerfile` del microservicio `products-ms` quitamos la generación de prisma
- En el fichero docker-compose.yml, en el service `products-ms` tenemos que tener creada la BD antes de ejecutar la parte del `command`. Nos vamos a nuestro `package.json` de ese microservicio y creamos un nuevo script `docker:start` donde indicamos los comandos que nos permiten construir la BD basado en nuestro esquema de Prisma. También modificado el script `start:dev` para que ejecute este nuevo script `docker:start`. De esta manera, antes de ejecutar la app siempre generará la BD dentro del contenedor. Esto significa que las altas y actualizaciones no se verán reflejadas en la data, ya que van a afectar al proyecto local, no al contenedor, porque en el fichero `dockerfile` hacemos una copia de todo, usando el comando `COPY . .`, exceptuando lo que está en el bind volume, es decir, tenemos enlazado por el volume que indica el fichero `docker-compose.yml` la carpeta `./client-gateway/src` pero la BD no está ahí

## Configurar Orders Microservice y PostgreSql

Modificamos el fichero `docker-compose.yml`, creándonos dos grupos, `orders-ms` y `orders-db`.

Dentro del microservicio `orders-ms` modificamos el fichero `package.json` y creamos el fichero `dockerfile` copiándolo del microservicio `products-ms`.

## Variables de entorno

En producción no deberíamos poder acceder a la BD de PostgreSQL. Por tanto, para producción vamos a querer modificar docker-compose.yml para comentar el ports del service `Orders DB`. Con esto, desde Squirrel ya no vamos a poder acceder a la BD, pero si desde Postman. Lo que tendremos será una BD con una cadena de conexión que apunte a otro lugar.

Pero en desarrollo si nos viene bien indicar el ports.

Vamos a crear una mini-red encapsulada para que sus servicios puedan comunicarse entre sí, basada en los nombres de los services de docker-compose.yml.

Pero lo que vamos a hacer ahora es lo que indicar el título, que es crear variables de entorno.

En el root, carpeta `05-Products-App-Nats-Docker` creamos un archivo `.env` y su clon `.env.template`. Hay que tener mucho cuidado con el nombre de las variables que se indiquen, para que sean significativas.

Y modificamos `docker-compose.yml`, service `client-gateway` para indicar esa variable en la parte del puerto de mi computadora.

## Testing

1. Clonar el repositorio
2. Crear un .env basado en el .env.template
3. Para levantar, hay dos opciones, manual y don Docker

Para levantar de forma manual:

- Levantar el servidor de NATS: `docker run -d --name nats-server -p 4222:4222 -p 8222:8222 nats`
- Levantar de manera independiente el proyecto client-gateway usando Peacock para diferenciar el espacio de trabajo: `npm run start:dev`
- Levantar de manera independiente el proyecto products-ms usando también Peacock para diferenciar el espacio de trabajo: `npm run start:dev`
- Levantar de manera independiente el proyecto orders-ms usando también Peacock para diferenciar el espacio de trabajo: `npm run start:dev`
  - Levantar la base de datos en Raspberry Pi
    - Ir a la ruta `/home/pi/docker/postgresql/orders-ms` y ejecutar `docker compose up -d`

Para levantar con Docker y ejecutarlo en un host remoto (mi Raspberry Pi) ir a la ruta donde esta el fichero docker-compose.yml y ejecutar: `docker compose up --build`

Usando `--build` porque lo vamos a construir.

Si queremos bajarlo ejecutaremos `docker compose down`.

IMPORTANTE: Estoy usando `docker context` y he añadido a mi context el docker que tengo en mi Raspberry Pi. Pero, como esto no ha funcionado, al final he instalado en VSCode el paquete `Remote Development`, me he llevado el proyecto a la Raspberry Pi y estoy codificando en remoto.
