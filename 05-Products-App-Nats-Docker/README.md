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

## Testing

Para levantar de forma manual:

- Levantar el servidor de NATS: `docker run -d --name nats-server -p 4222:4222 -p 8222:8222 nats`
- Levantar de manera independiente el proyecto client-gateway usando Peacock para diferenciar el espacio de trabajo: `npm run start:dev`
- Levantar de manera independiente el proyecto products-ms usando también Peacock para diferenciar el espacio de trabajo: `npm run start:dev`
- Levantar de manera independiente el proyecto orders-ms usando también Peacock para diferenciar el espacio de trabajo: `npm run start:dev`
  - Levantar la base de datos en Raspberry Pi
    - Ir a la ruta `/home/pi/docker/postgresql/orders-ms` y ejecutar `docker compose up -d`

Para levantar con Docker y ejecutarlo en un host remoto (mi Raspberry Pi) ir a la ruta donde esta el fichero docker-compose.yml y ejecutar: `docker compose up --build`

Usando `--build` porque lo vamos a construir.

IMPORTANTE: Estoy usando `docker context` y he añadido a mi context el docker que tengo en mi Raspberry Pi. Pero, como esto no ha funcionado, al final he instalado en VSCode el paquete `Remote Development`, me he llevado el proyecto a la Raspberry Pi y estoy codificando en remoto.
