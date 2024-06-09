import { Controller, Get, Post, Req, Res } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { PaymentSessionDto } from './dto/payment-session.dto';
import { Request, Response } from 'express';
import { MessagePattern, Payload } from '@nestjs/microservices';

@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post('create-payment-session')
  // Con NATS, en vez de separar con guiones, es mejor separar con puntos porque
  // permite wildcards para poder notificar a personas, a subgrupos y a otros topics.
  @MessagePattern('create.payment.session')
  createPaymentSession(@Payload() paymentSessionDto: PaymentSessionDto) {
    // Cuando trabajamos con aplicaciones híbridas, tenemos que tener en cuenta una
    // cosa muy interesante.
    // Por la parte de NATS no se hereda el comportamiento de nuestro class-validator y
    // class-transformer.
    // Esto puede probarse mandando cualquier cosa desde el método createPaymentSession de orders-ms.
    // Ver https://docs.nestjs.com/faq/hybrid-application#sharing-configuration
    // Ahí puede verse que para que se hereden las validaciones y transformaciones hay que
    // colocar la bandera {inheritAppConfig: true} en main.ts
    // Tras colocar esto y volver a hacer la petición sale ya un Internal server error.
    return this.paymentsService.createPaymentSession(paymentSessionDto);
  }

  // Se hace el pago.
  @Get('success')
  success() {
    return {
      ok: true,
      message: 'Payment successful',
    };
  }

  // Se cancela el pago.
  @Get('cancel')
  cancel() {
    return {
      ok: false,
      message: 'Payment cancelled',
    };
  }

  // El webhook para manejar los pagos.
  // Indicamos req y res directamente porque Stripe pide el raw body.
  // Si se hace algún tipo de procesamiento sobre ese body Stripe dará error.
  @Post('webhook')
  async stringWebhook(@Req() req: Request, @Res() res: Response) {
    return this.paymentsService.stripeWebhook(req, res);
  }
}
