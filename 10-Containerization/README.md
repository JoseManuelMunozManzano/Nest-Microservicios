# Containerization - Construcción de imágenes - PROD

En esta sección aprenderemos:

- Generar build de distribución de aplicaciones de Nest
- Construir imágenes para producción
- Crear dockerfiles para producción
- Docker-Compose para producción
- Aplicar migraciones en tiempo de construcción
- Generar cliente de Prisma
- Multi-Stage builds

Es una sección que nos ayudará mucho a comprender cómo poder crear nuestras imágenes para que estén listas para ejecutarse con un único comando.

## Continuación de proyecto

Cogiendo nuestro proyecto de Bitbucket, en `https://bitbucket.org/neimerc/products-launcher/src/main/`, la idea es crear contenedores de nuestros microservicios y del gateway, que no deja de ser otro microservicio.

Cada uno de esos directorios se va a convertir en una imagen de Docker que podamos levantar rápidamente, usando el comando `docker run <imagen>`.

El objetivo de hacer todo esto es que sea fácil poder crear réplicas y ejecutarlas, y se comunicarán mediante el NATS server que será otro contenedor.

Vamos a tener que crear nuestras imágenes basadas en la arquitectura de procesador en el que se va a ejecutar. Para evitar problemas deberíamos hacer una construcción de múltiples arquitecturas, pero lo vamos a evitar porque vamos a integrar mediante un CI/CD que nos va a permitir a nosotros poder construir la imagen en la nube (nuestra máquina NO va a construir la imagen) y se van a desplegar automáticamente.

Todo esto lo vamos a hacer también mediante Kubernetes.

Por ahora, lo que vamos a hacer es ejecutar el proyecto en modo de desarrollo.

Para ello levantamos Docker, y configuramos las variables de entorno a nivel de `products-launcher`, ya que las variables de entorno de cada microservicio son para ese microservicio. Una vez hecho todo esto, solo tenemos que ejecutar:

```
docker compose up --build
```
