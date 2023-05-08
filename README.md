# Bootcamp del Master en Full Stack Web Development de ThreePoints.

## Introducción a Node.js, MongoDB y Docker

Este repositorio contiene los archivos necesarios para crear un proyecto Node.js que expone una API sencilla para listar, listar con filtro, crear/actualizar y borrar un registro. Además, un archivo json para iniciar una base de datos en MongoDB y el Dockerfile para contenerizar la API.

## Contenido clave

- `db_sample`: contiene el archivo json para inicializar la base de datos MongoDB
- `server.js`: codificación de la API
- `Dockerfile`: contiene las instrucciones para contenerizar la API

## Crear contenedor con MongoDB

Dado que en la actividad se pide que la app, desplegada en un Docker se comunique con la base de datos, también desplegada en un Docker container, se pueden seguir los siguientes pasos para que la app se comunique con el container de mongo.

```bash
docker network create <nombre-red>
docker run --name <nombre-contenedor> --hostname <nombre-host> -d -p 27017:27017 --network <nombre-red> mongo
```

Cuando el contenedor de MongoDB este en ejecución, se pueden seguir los siguientes pasos para importar los registros del archivo json.

```bash
docker cp <your-path-to-db_sample/users.json> <container-name>:/users.json
docker exec -it <container-name> mongoimport --db <your-database-name> --collection <your-collection-name> --file /users.json --jsonArray
```

## Preparar el proyecto

Luego de descargar el proyecto recuerda descargar las dependencias, para ello debes ejecutar el siguiente comando desde una terminal en el directorio que se encuentra el archivo `package.json`.

```bash
npm install
```

## Contenerizar la API

Lo primero es crear la imagen utilizando el archivo Dockerfile suministrado, utilice el siguiente comando:

```bash
docker build -t <nombre-imagen> .
docker run --name <nombre-contenedor> --hostname <nombre-host> -d -p <puerto-local>:8080 --network <nombre-red> <nombre-imagen>
```

## Uso del API

Puedes consultar la documentación de la API en la siguiente dirección:

https://documenter.getpostman.com/view/22996423/2s93eYUC9F