# Products App

En esta carpeta es donde vamos a tener toda nuestra aplicación completa, todos nuestros microservicios y el gateway.

Lo primero es actualizar el `Nest CLI` a la última versión: `npm install -g @nestjs/cli`

El orden de creación de los microservicios es el siguiente:

- products-ms
- client-gateway
- orders-ms

Nuestro objetivo es hacer esto:

![alt Objetivo](./images/Objetivo.png)

Como evolución de nuestro proyecto, el objetivo evoluciona a:

![alt Objetivo_2](./images/Objetivo_2.png)

Donde vemos que las órdenes y el detalle van a estar en el mismo microservicio, porque están altamente acoplados entre sí. Una orden no va a existir sin un detalle, y, si una orden cambia, afecta a su detalle.

Además la órdenes van a hablar con el microservicio de productos para validar dichos productos.

NOTA: Este sigue sin ser el esquema final, solo vemos como va evolucionando el proyecto.

## Testing

En cada proyecto aparece un apartado de testing, pero si es importante tener siempre levantado, como mínimo, el proyecto `client-gateway`, que es el que se comunica con los microservicios, y al menos un microservicio, para poder probar algo.
