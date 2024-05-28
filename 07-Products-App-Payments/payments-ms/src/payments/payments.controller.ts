import { Body, Controller, Get, Post, Req, Res } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { PaymentSessionDto } from './dto/payment-session.dto';
import { Request, Response } from 'express';

@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post('create-payment-session')
  createPaymentSession(@Body() paymentSessionDto: PaymentSessionDto) {
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
