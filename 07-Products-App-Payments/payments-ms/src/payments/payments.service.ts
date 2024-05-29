import { Injectable } from '@nestjs/common';
import { envs } from 'src/config';
import Stripe from 'stripe';
import { PaymentSessionDto } from './dto/payment-session.dto';
import { Request, Response } from 'express';

@Injectable()
export class PaymentsService {
  private readonly stripe = new Stripe(envs.stripeSecret);

  async createPaymentSession(paymentSessionDto: PaymentSessionDto) {
    // El currency será siempre el mismo para todas las líneas del pedido.
    const { currency, items, orderId } = paymentSessionDto;

    const lineItems = items.map((item) => {
      return {
        price_data: {
          currency: currency,
          // Para crear el product en el momento en que estamos ejecutando esto
          product_data: {
            name: item.name,
          },
          // Va en céntimos porque Stripe no espera decimales
          unit_amount: Math.round(item.price * 100),
        },
        quantity: item.quantity,
      };
    });

    // Creamos una sesión, que a su vez crea un URL, y mandamos la información de lo que queremos cobrar.
    const session = await this.stripe.checkout.sessions.create({
      // Colocar aquí el ID de mi orden
      payment_intent_data: {
        metadata: {
          orderId: orderId,
        },
      },
      // Los items que los usuarios están comprando
      line_items: lineItems,
      mode: 'payment',
      // Donde quiero que regrese el usuario si todo ha ido bien
      success_url: envs.stripeSuccessUrl,
      // Donde quiero que regrese el usuario si algo sale mal
      cancel_url: envs.stripeCancelUrl,
    });

    return session;
  }

  async stripeWebhook(req: Request, res: Response) {
    // Este código viene de aquí: https://dashboard.stripe.com/test/webhooks/create?endpoint_location=hosted
    const sig = req.headers['stripe-signature'];

    let event: Stripe.Event;

    // Real
    const endpointSecret = envs.stripeEndpointSecret;

    try {
      event = this.stripe.webhooks.constructEvent(
        req['rawBody'],
        sig,
        endpointSecret,
      );
    } catch (err) {
      res.status(400).send(`Webhook Error: ${err.message}`);
      return;
    }

    // console.log({ event });
    switch (event.type) {
      case 'charge.succeeded':
        const chargeSucceeded = event.data.object;
        // TODO: Llamar nuestro microservicio
        console.log({
          metadata: chargeSucceeded.metadata,
          orderId: chargeSucceeded.metadata.orderId,
        });
        break;

      default:
        console.log(`Event ${event.type} not handled`);
    }

    return res.status(200).json({ sig });
  }
}
