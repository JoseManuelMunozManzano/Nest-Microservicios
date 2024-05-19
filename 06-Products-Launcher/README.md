# 06-Products-Launcher

## Pasos para crear los Git Submodules

1. Crear un nuevo repositorio en BitBucket
2. Clonar el repositorio en la máquina local
3. Añadir el submodule, donde `repository_url` es la url del repositorio y `directory_name` es el nombre de la carpeta donde quieres que se guarde el sub-módulo (no debe de existir en el proyecto)

```
git submodule add <repository_url> <directory_name>
```

4. Añadir los cambios al repositorio (git add, git commit, git push)
   Ej:

```
git add .
git commit -m "Add submodule"
git push
```

5. Inicializar y actualizar Sub-módulos, cuando alguien clona el repositorio por primera vez, debe de ejecutar el siguiente comando para inicializar y actualizar los sub-módulos

```
git submodule update --init --recursive
```

6. Para actualizar las referencias de los sub-módulos

```
git submodule update --remote
```

## Probar Launcher

**NOTA: Esto tenemos que hacerlo clonando todos los repositorios de `https://bitbucket.org/neimerc/workspace/projects/PROD` de BitBucket, ya que aquí en Github NO hemos hecho lo de los submódulos.**

Hemos modificado `docker-compose.yml` para comentar todo salvo los services `nats-server` y `client-gateway`.

Para levantar, ejecutamos:

```
docker compose up --build
```

La aplicación se levanta y si vamos a Postman veremos que nos da error, lo que es lógico, porque solo tenemos el gateway levantado, pero vemos por el tipo de error que nuestro gateway está funcionando.

Si hacemos un cambio al proyecto `client-gateway` y hacemos un commit, este llegará a la referencia, porque `client-gateway` no es parte de nuestro proyecto contenedor `06-Products-Launcher`. Por ejemplo, tocamos el archivo `main.ts` de `client-gateway` y al guardar, veremos que los cambios se ven en el momento.

Para que estos cambios (hot reload) funcionen, hay que agregar la siguiente configuración al archivo `tsconfig.json` en los microservicios y el gateway:

```
"watchOptions": {
   "watchFile": "dynamicPriorityPolling",
   "watchDirectory": "dynamicPriorityPolling",
   "excludeDirectories": ["**/node_modules", "dist"]
}
```

Además, comenté el `bind volume` y es también necesario que esté funcionando.

Para subir esto y que sea parte de mi repositorio, en VSCode, si vamos a ver los cambios pendientes, veremos que aparece la referencia a dos repositorios independientes, nuestro `product-launcher` y nuestro `client-gateway`. Hay que tener mucho cuidado a la hora de actualizar el `product-launcher` porque es muy fácil caer en un punto donde tengamos que hacer un `rebase` o resolver conflictos.

Dejamos `docker-compose.yml` descomentado y subimos los otros sub-módulos.

## Importante

Si se trabaja en el repositorio que tiene los sub-módulos, **primero actualizar y hacer push** en el sub-módulo y **después** en el repositorio principal.

Si se hace al revés, se perderán las referencias de los sub-módulos en el repositorio principal y tendremos que resolver conflictos.
