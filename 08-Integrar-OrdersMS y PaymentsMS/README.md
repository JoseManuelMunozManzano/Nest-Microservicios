# Integraciones con microservicios - EventPattern

Vamos a integrar payments-ms a nuestra red de microservicios para que tenga la comunicación con Nats.

Lo que queremos hacer es, cuando desde el client-gateway entre la creación de una orden, ese microservicio order-ms va a hablar con payments-ms. Este creará la sesión a Stripe que nos acabará devolviendo una URL y que volverá a nuestro microservicio orders-ms, y de ahí al usuario que mandó llamar la creación de una orden de pago.

Ese usuario irá entonces a pagar a Stripe. Una vez paga responderemos al usuario. Será nuestro Webhook que va a esperar la comunicación de Stripe y el Webhook hablará entonces con nuestro orders-ms para que este marque la orden como pagada.

Vamos a aprovechar para ver la otra forma de comunicarnos con microservicios.

Hasta ahora hemos visto el `MessagePattern`, que es que emitimos una solicitud y esperamos una respuesta.

Ahora vamos a usar `EventPattern` que consiste en preguntar, pero no esperamos ninguna respuesta, sino que seguimos con lo que estemos haciendo.

Con BBDD vamos a hacer dos cosas:

- Vamos a modificar dos columnas en nuestra tabla de órdenes
- Vamos a crear una nueva tabla para hacer una relación uno a uno para aprender a hacerlas en Prisma, donde vamos a guardar los recibos de nuestros pagos. Evitaremos null en fecha de pago, ya que solo habrá un registro si se paga la orden

Objetivo:

![alt Objetivo](./images/Objetivo.png)

Por tanto, en esta sección trabajaremos conectando el Payments Microservice con nuestros otros microservicios.

Puntualmente veremos:

- EventPattern
- Payments hacia Orders
  - Webhook
- DeckHook
- Modificaciones a la estructura de la base de datos

## Agregar repositorio al Products Launcher

Recordar que siempre que hablemos de Products Launcher, estamos hablando sobre todo del repositorio en Bitbucket: `https://bitbucket.org/neimerc/products-launcher/src/main/`

Vamos a unir el repositorio de payments-ms con nuestro products-launcher.

## Microservicio Híbrido - REST - Nats

Queremos que nuestro `payments-ms` sea híbrido.

Por ahora, `payments-ms` está dentro de nuestra red.

Lo vamos a comunicar con NATS para que pueda hablar con los demás microservicios (es la única forma de llegar a ellos)

Nosotros tenemos también que habilitar un puerto, el de nuestra aplicación REST, para que Stripe, mediante el Webhook, hable con `payments-ms`. Esto se puede hacer de varias maneras:

- No híbrido: En este caso Stripe se conecta por nuestro gateway, o podríamos crear otro gateway nuevo. No lo vamos a hacer así porque no queremos que se sepa todo lo que está expuesto en el gateway. Queremos que sea medio anónimo, aunque eso no es una medida de seguridad per se. Recordar que como medidas de seguridad con Stripe tenemos una verificación de la firma (stripe-signature), tenemos un endpointSecret y nuestra variable de entorno stripeSecret
- Híbrido: va a soportar tanto NATS como HTTP

De nuevo, en Bitbucket (https://bitbucket.org/neimerc/products-launcher/src/main/), trabajando con los submodulos, tenemos que entrar en `payments-ms` y ejecutar `npm i` para instalar las dependencias.

Ahora instalamos dos paquetes dentro de la carpeta de `payments-ms`. Vamos a la documentación de Nest (https://docs.nestjs.com/microservices/basics#installation) e instalamos

```
npm i --save @nestjs/microservices
```

Y también instalamos NATS (https://docs.nestjs.com/microservices/nats)

```
npm i --save nats
```

Ahora modificamos nuestro `main.ts` para levantar la parte de los microservicios. También modificamos nuestro fichero `.env` y `.env.template`, y también `config/envs.ts`.

Volvemos a bajar y a levantar nuestro `docker-compose` y, para saber que es correcto, me voy a Portainer, a los containers, y pulso click sobre el puerto 8222 de NATS. Se abre la web y cambio al URL a `http://192.168.1.41:8222/connz`. Debo ver tres conexiones.

Ahora tenemos que modificar `payments.controller.ts` para que podamos recibir el payload y no el body. Esto lo podemos manejar de las dos formas, con un POST o con un MessagePattern.

### Testing

- Para ello agregaremos un nuevo submódulo (leer el README.md del proyecto 06-Products-Launcher para saber como hacerlo)
  - En concreto hemos ejecutado: `git submodule add https://bitbucket.org/neimerc/payments-ms.git payments-ms`
- Modificamos `docker-compose.yml` para incluir el nuevo servicio para que se levante
- Copiamos de uno de los submodulos ya existentes los ficheros `.dockerignore` y `dockerfile` y los pegamos en `payments-ms`. Del nuevo fichero `dockerfile` cambiamos el puerto que exponemos al 3003 (aunque esto da igual)
- Definimos las variables de entorno nuevas en el fichero `.env` y `.env.template` y las definimos en `docker-compose.yml`
- Podemos ya ejecutar el comando `docker compose up --build` en la carpeta de `products-launcher`
  - Recordar que yo tengo docker context apuntando a mi Raspberry Pi
- Ya podemos probar en Postman el endpoint de los payments
  - Recordar que mi endpoint será algo así: `http://192.168.1.41:3003//payments/create-payment-session`
- Ir a mi RaspberryPi, a Portainer, y ver si está todo arriba. Si vemos que orders-ms no se arranca, arrancarlo manualmente