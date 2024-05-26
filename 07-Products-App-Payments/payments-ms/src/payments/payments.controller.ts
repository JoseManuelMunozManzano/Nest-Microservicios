import { Controller, Get, Post } from '@nestjs/common';
import { PaymentsService } from './payments.service';

@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post('create-payment-session')
  createPaymentSession() {
    return 'createPaymentSession';
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
  // Esto lo dejamos para el final.
  @Post('webhook')
  async stringWebhook() {
    return 'stripe Webhook';
  }
}
