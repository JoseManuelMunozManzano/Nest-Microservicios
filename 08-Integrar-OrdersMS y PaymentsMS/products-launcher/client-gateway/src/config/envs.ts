// Como creamos un snippet con toda esta configuración, solo tenemos que escribir microenvs

import 'dotenv/config';
import * as joi from 'joi';

// Esto lo hacemos para poder acceder a nuestras variables de entorno de forma síncrona.

interface EnvVars {
  PORT: number;
  NATS_SERVERS: string[];
}

// Validador de esquema
const envsSchema = joi
  .object({
    PORT: joi.number().required(),
    NATS_SERVERS: joi.array().items(joi.string()).required(),
  })
  .unknown(true); // Esto se indica porque hay muchas variables de entorno en process.env y no queremos evaluarlas

const { error, value } = envsSchema.validate({
  ...process.env,
  NATS_SERVERS: process.env.NATS_SERVERS?.split(','),
});

if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

const envVars: EnvVars = value;

export const envs = {
  port: envVars.PORT,
  natsServers: envVars.NATS_SERVERS,
};
