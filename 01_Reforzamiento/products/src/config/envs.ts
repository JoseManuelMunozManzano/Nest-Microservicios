// Para que tome la configuración por defecto de nuestras variables de entorno.
import 'dotenv/config';

import * as joi from 'joi';

// Para tener el tipado de TypeScript en las variables de entorno.
interface EnvVars {
  PORT: number;
}

const envsSchema = joi
  .object({
    PORT: joi.number().required(),
  })
  .unknown(true); // Para poder indicar más variables de entorno que no estén aquí validadas.

const { error, value } = envsSchema.validate(process.env);

// console.log({ error });
// console.log({ envVars });

// Para lanzar un error y que la aplicación no se levante.
if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

const envVars: EnvVars = value;

// En vez de tomar los valores de process.env los tomamos de envVars definido arriba.
// Así nos aseguramos que los valores se transfoman al tipo de dato requerido.
//
// La ventaja de este montaje es que ahora, a lo largo de toda la app, podemos usar envs de manera síncrona.
// Evitamos usar async solo para esperar tener nuestros valores de variable de entorno.
export const envs = {
  port: envVars.PORT,
};
