import { Body, Controller, Get, Post } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { PaymentSessionDto } from './dto/payment-session.dto';

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
  // Esto lo dejamos para el final.
  @Post('webhook')
  async stringWebhook() {
    return 'stripe Webhook';
  }
}
