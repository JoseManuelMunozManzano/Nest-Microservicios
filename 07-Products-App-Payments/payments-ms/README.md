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

## Configuración de Stripe

https://stripe.com/es

La idea es configurar y obtener nuestro Stripe Secret Key.

- Entramos en nuestra cuenta de Stripe
- Pulsamos en el botón `Desarrolladores`
- Pulsamos la tab `Claves de API`
- Cogemos la `clave de prueba` con la que vamos a identificar a mi backend
- Creo una nueva variable de entorno en mi fichero `.env` y `.env.template` e indico la API KEY
- En la página principal, pulsamos en el botón `Empezar a usar los pagos`, nos vamos a la tab `Herramientas para desarrolladores` y pulsamos en el cuadro `SDK y componentes de interfaz de usuario`
  - https://docs.stripe.com/libraries
  - Ahí tenemos el paquete que tenemos que instalar `npm install stripe` Lo instalamos
- La documentación de la API de Stripe está en el icono de interrogación, arriba en la parte derecha (Developer docs)
  - Ver, por ejemplo: https://docs.stripe.com/terminal/references/api/js-sdk

Vamos a nuestra configuración `src/config/envs.ts` y añadimos nuestra nueva variable de entorno `STRIPE_SECRET`.

Luego nos vamos al service `src/payments/payments.service.ts` y hacemos la configuración usando el SDK de Stripe.

## Crear sesión de pago

Desde nuestro controlador `src/payments/payments.controller.ts` método `createPaymentSession()` vamos a llamar a nuestro service con un método nuevo `createPaymentSession()`.

Para probar, desde Postman ejecutamos el endpoint `Create Payment Session`.

Al final de la respuesta veremos una url. Pulsamos `Cmd` y con el ratón hacemos click a esa URL. Se abrirá este tipo de ventana:

![alt Ventana Pago Stripe](../images/Pago_Stripe.png)

Yo he informado esos valores, pero cualquiera vale. Pulsamos `Pagar`.

Veremos que redirecciona a la ruta `http://localhost:3003/payments/success`, indicada en `payments.service.ts`.

Si ahora vuelvo al Dashboard de Stripe y pulso en Saldos y luego en Toda la actividad, veo:

![alt Saldos Toda Actividad](../images/Saldos_Toda_Actividad.png)

Y ya hemos hecho el cobro a esa persona con esa tarjeta de crédito.

Recordar que todo esto es `FICTICIO`.

## Testing

- Ejecutar con el comando: `npm run start:dev`
- En la carpeta `postman` se ha dejado un ejemplo de llamada desde Postman
