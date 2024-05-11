import 'dotenv/config';
import * as joi from 'joi';

// Esto lo hacemos para poder acceder a nuestras variables de entorno de forma síncrona.

interface EnvVars {
  PORT: number;
  DATABASE_URL: string;

  NATS_SERVERS: string[];
}

// Validador de esquema
const envsSchema = joi
  .object({
    PORT: joi.number().required(),
    DATABASE_URL: joi.string().required(),

    // Indicamos con joi que es un array de strings requerido.
    // Pero nuestra variable de entorno realmente no es un array (no se puede), sino un string
    // separado por comas.
    NATS_SERVERS: joi.array().items(joi.string()).required(),
  })
  .unknown(true); // Esto se indica porque hay muchas variables de entorno en process.env y no queremos evaluarlas

const { error, value } = envsSchema.validate({
  ...process.env,

  // Nos creamos el array a partir de nuestros strings separados por comas.
  // Usamos la interrogación por si no viene esa variable de entorno, no hacer nada y que
  // sea atrapado por el throw new Error de abajo.
  NATS_SERVERS: process.env.NATS_SERVERS?.split(','),
});

if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

const envVars: EnvVars = value;

export const envs = {
  port: envVars.PORT,
  databaseUrl: envVars.DATABASE_URL,

  natsServers: envVars.NATS_SERVERS,
};
