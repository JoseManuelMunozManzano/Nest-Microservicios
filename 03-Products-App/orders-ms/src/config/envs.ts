import 'dotenv/config';
import * as joi from 'joi';

// Esto lo hacemos para poder acceder a nuestras variables de entorno de forma síncrona.

interface EnvVars {
  PORT: number;
}

// Validador de esquema
const envsSchema = joi
  .object({
    PORT: joi.number().required(),
  })
  .unknown(true); // Esto se indica porque hay muchas variables de entorno en process.env y no queremos evaluarlas

const { error, value } = envsSchema.validate(process.env);

if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

const envVars: EnvVars = value;

export const envs = {
  port: envVars.PORT,
};
