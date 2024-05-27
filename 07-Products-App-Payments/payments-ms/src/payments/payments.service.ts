import { Injectable } from '@nestjs/common';
import { envs } from 'src/config';
import Stripe from 'stripe';

@Injectable()
export class PaymentsService {
  private readonly stripe = new Stripe(envs.stripeSecret);

  async createPaymentSession() {
    // Creamos una sesión, que a su vez crea un URL, y mandamos la información de lo que queremos cobrar.
    const session = await this.stripe.checkout.sessions.create({
      // Colocar aquí el ID de mi orden
      payment_intent_data: {
        metadata: {},
      },

      // Los items que los usuarios están comprando
      line_items: [
        {
          price_data: {
            currency: 'eur',
            // Para crear el product en el momento en que estamos ejecutando esto
            product_data: {
              name: 'T-Shirt',
            },
            unit_amount: 2000, // Son realmente 20 euros porque no hay decimales
          },
          quantity: 2,
        },
      ],
      mode: 'payment',
      // Donde quiero que regrese el usuario si todo ha ido bien
      success_url: 'http://localhost:3003/payments/success',
      // Donde quiero que regrese el usuario si algo sale mal
      cancel_url: 'http://localhost:3003/payments/cancel',
    });

    return session;
  }
}
