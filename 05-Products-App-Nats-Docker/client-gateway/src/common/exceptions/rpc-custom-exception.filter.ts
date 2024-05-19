// Empezamos copiando todo el código que hay en https://docs.nestjs.com/microservices/exception-filters
// Pero se cambia para acomodarlo a nuestras necesidades.
import { Catch, ArgumentsHost, ExceptionFilter } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';

// Este ExceptionFilter atrapa todos los errores del tipo RpcException
@Catch(RpcException)
export class RpcCustomExceptionFilter implements ExceptionFilter {
  catch(exception: RpcException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();

    // Personalizamos la respuesta que enviamos al front basado en la excepción.
    const rpcError = exception.getError();

    // Lo hemos puesto para ver que tipo de error obtenemos cuando se cae un servicio (no el gateway)
    // Vemos que es un EmptyResponseException
    console.log(rpcError);

    // Como no podemos tomar la instancia de ese tipo de Excepción, hacemos lo siguiente.
    // Esto es porque el mensaje de error del console.log(rpcError) nos devuelve: EmptyResponseException [Error]: Empty response.
    // No devolvemos al usuario información que no le compete, en este caso no devolvemos el nombre ("findAllOrders")
    if (rpcError.toString().includes('Empty response')) {
      return response.status(500).json({
        status: 500,
        message: rpcError
          .toString()
          .substring(0, rpcError.toString().indexOf('(') - 1),
      });
    }

    // La excepción debe ser un objeto y esperamos que vengan ciertas propiedades, status y message.
    if (
      typeof rpcError === 'object' &&
      'status' in rpcError &&
      'message' in rpcError
    ) {
      const status = isNaN(+rpcError.status) ? 400 : +rpcError.status;
      return response.status(status).json(rpcError);
    }

    // Y si no se cumple el if de arriba, devolvemos este error genérico.
    response.status(400).json({
      status: 400,
      message: rpcError,
    });
  }
}
