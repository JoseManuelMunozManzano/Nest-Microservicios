# Introducción a los Microservicios

Esta sección es teórica, y se enfoca en explicar el por qué de los microservicios y también sus puntos favorables y puntos en contra.

Puntualmente veremos:

- Buenas prácticas sobre microservicios
- Arquitectura monolítica
  - Pros y Cons
- Microservicios
  - Pros y Cons
- Cómo crear múltiples apps en NestJS
- Conceptos como
  - Gateways
  - TCP
  - Protocolos de transferencia

La idea en general es que tengamos una base de teoría para entrar de lleno a codificar en las próximas secciones.

Esta documentación se puede ver en la carpeta `Documentacion`, archivo `microservicios.pdf`.

NOTAS:

- Vamos a usar en VSCode un plugin llamado `Peacock` para identificar por colores cada uno de los proyectos abiertos
- Vamos a crear una carpeta por microservicio, con apps independientes, en vez de tener alojados en un único proyecto todas nuestras apps de microservicios, cosa que también es muy normal ver y tiene el beneficio de poder compartir módulos en común entre todas las apps. El problema es que el repositorio acaba siendo muy grande, es más difícil de ejecutar (mismo puerto) y de probar y es más lioso de programar porque a veces no se sabe ni en qué app estamos
- Por tanto, vamos a tener una aplicación de autenticación, otra de cliente que será nuestro client-gateway, otra de detalles, otra de órdenes y otra de productos. Como punto en contra de esta forma de trabajar es que tendremos que duplicar en cada app ciertas funcionalidades, como la paginación por ejemplo, o algún dto... Pero no olvidemos que cada microservicio debe ser independiente entre sí, por lo que no es tan malo
