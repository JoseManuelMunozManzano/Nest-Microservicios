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
