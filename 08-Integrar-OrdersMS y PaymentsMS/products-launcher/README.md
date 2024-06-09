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

## Importante

Si se trabaja en el repositorio que tiene los sub-módulos, **primero actualizar y hacer push** en el sub-módulo y **después** en el repositorio principal.

Si se hace al revés, se perderán las referencias de los sub-módulos en el repositorio principal y tendremos que resolver conflictos.

## Puesta en marcha

- Clonamos el proyecto
- Abrimos el proyecto en VSCode
- Crear un .env basasado en el .env.template
- Si vemos las referencias de los repositorios, `client-gateway`, `orders-ms` y `products-ms`, veremos que están vacíos
- Reconstruimos los submódulos con el comando `git submodule update --init --recursive`
  - Este comando descarga el código fuente de cada uno de los submódulos
- Ejecutar el comando `docker compose up --build`
