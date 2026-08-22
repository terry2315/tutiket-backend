# Tutiket Backend

Backend inicial para **Tutiket**, una plataforma de e-commerce orientada a la gestión y venta de entradas para conciertos y eventos musicales.

Esta versión corresponde a la **Pre-entrega 1 de Backend II** y establece la arquitectura base de la API, la configuración inicial del servidor y las entidades principales `User` y `Event`.

---

## Temática del proyecto

Tutiket será una plataforma de venta de entradas para conciertos en la que existirán tres tipos principales de usuarios:

* **User:** comprador de entradas.
* **Organizer:** responsable de crear y administrar eventos.
* **Admin:** administrador general de la plataforma.

En esta primera etapa todavía no se implementan registro, login, compra de entradas ni control de permisos. El objetivo es construir una base arquitectónica sólida y escalable para incorporar esas funcionalidades en las siguientes entregas.

---

## Tecnologías

El proyecto utiliza actualmente:

* **Node.js** — entorno de ejecución para JavaScript.
* **Express** — framework utilizado para construir la API REST.
* **Mongoose** — modelado de las entidades que posteriormente serán persistidas en MongoDB.
* **dotenv** — manejo de variables de entorno.
* **Nodemon** — reinicio automático del servidor durante el desarrollo.
* **ES Modules** — utilización de `import` y `export`.

---

## Instalación

### 1. Clonar el repositorio

```bash
git clone https://github.com/terry2315/tutiket-backend.git
```

### 2. Ingresar a la carpeta del proyecto

```bash
cd tutiket-backend
```

### 3. Instalar las dependencias

```bash
npm install
```

### 4. Crear el archivo de variables de entorno

En la raíz del proyecto crea un archivo:

```text
.env
```

Puedes utilizar `.env.example` como referencia.

---

## Variables de entorno

El archivo `.env.example` contiene las variables necesarias para configurar el proyecto:

```env
PORT=8080
NODE_ENV=development
MONGO_URL=tu_url_de_mongodb
JWT_SECRET=tu_clave_secreta
```

### Variables

| Variable     | Descripción                                                       |
| ------------ | ----------------------------------------------------------------- |
| `PORT`       | Puerto en el que se ejecutará el servidor.                        |
| `NODE_ENV`   | Entorno de ejecución del proyecto.                                |
| `MONGO_URL`  | URI de conexión a MongoDB. Se utilizará en las siguientes etapas. |
| `JWT_SECRET` | Clave para firmar JWT. Se utilizará en las siguientes etapas.     |

> El archivo `.env` contiene valores privados y no debe subirse al repositorio.

---

## Cómo ejecutar

Para iniciar el servidor en modo desarrollo:

```bash
npm run dev
```

Con la configuración proporcionada en `.env.example`, el servidor estará disponible en:

```text
http://localhost:8080
```

El código también posee un puerto alternativo para los casos en los que `PORT` no esté definido.

---

## Arquitectura

El proyecto está organizado por capas para permitir que pueda crecer durante las próximas entregas.

```text
tutiket-backend/
│
├── src/
│   ├── config/
│   │   └── .gitkeep
│   │
│   ├── controllers/
│   │   ├── events.controller.js
│   │   ├── health.controller.js
│   │   └── sessions.controller.js
│   │
│   ├── dao/
│   │   └── .gitkeep
│   │
│   ├── middlewares/
│   │   └── .gitkeep
│   │
│   ├── models/
│   │   ├── Event.js
│   │   └── User.js
│   │
│   ├── repositories/
│   │   └── .gitkeep
│   │
│   ├── routes/
│   │   ├── events.router.js
│   │   ├── health.router.js
│   │   └── sessions.router.js
│   │
│   ├── services/
│   │   └── .gitkeep
│   │
│   ├── utils/
│   │   └── .gitkeep
│   │
│   ├── app.js
│   └── server.js
│
├── .env.example
├── .gitignore
├── package.json
├── package-lock.json
└── README.md
```

### Responsabilidad de las capas

* **routes:** define las rutas disponibles de la API.
* **controllers:** recibe las solicitudes HTTP y genera las respuestas.
* **services:** quedará destinada a la lógica de negocio.
* **repositories:** funcionará como capa intermedia entre los services y el acceso a datos.
* **dao:** contendrá posteriormente el acceso directo a la base de datos.
* **models:** contiene los esquemas principales de Mongoose.
* **middlewares:** contendrá middlewares reutilizables.
* **utils:** contendrá funciones auxiliares reutilizables.
* **config:** contendrá configuraciones como MongoDB y Passport en próximas entregas.

---

## `app.js` y `server.js`

Las responsabilidades del servidor se encuentran separadas.

### `app.js`

Se encarga de:

* Crear la aplicación Express.
* Configurar `express.json()`.
* Montar los routers.
* Exportar la aplicación.

### `server.js`

Se encarga de:

* Cargar las variables de entorno.
* Obtener el puerto configurado.
* Importar la aplicación.
* Levantar el servidor mediante `app.listen()`.

---

## Modelos iniciales

### User

El modelo base de usuario contiene:

```text
first_name
last_name
email
password
role
```

Los roles definidos son:

```text
user
organizer
admin
```

El rol predeterminado es:

```text
user
```

La autenticación y el hash de contraseñas se implementarán en las siguientes etapas.

### Event

El modelo base de evento contiene:

```text
title
description
category
date
location
capacity
price
status
organizer
```

Los estados disponibles son:

```text
draft
published
cancelled
finished
```

`organizer` está definido como una referencia `ObjectId` al modelo `User`.

---

## Rutas disponibles

### Verificar estado del servidor

```http
GET /api/health
```

Respuesta esperada:

```json
{
  "status": "ok",
  "message": "Servidor activo"
}
```

Código HTTP:

```text
200 OK
```

---

### Obtener eventos

```http
GET /api/events
```

En esta primera etapa todavía no existe persistencia en MongoDB, por lo que el endpoint devuelve una lista vacía.

Respuesta esperada:

```json
{
  "status": "success",
  "payload": []
}
```

Código HTTP:

```text
200 OK
```

---

## Sessions

La arquitectura inicial del recurso `sessions` ya se encuentra preparada mediante:

```text
src/routes/sessions.router.js
src/controllers/sessions.controller.js
```

En esta entrega todavía no existen endpoints de autenticación.

En las próximas etapas se incorporarán progresivamente:

```text
POST /api/sessions/register
POST /api/sessions/login
GET /api/sessions/current
POST /api/sessions/logout
```

---

## Estado actual del proyecto

Esta versión corresponde a la **Pre-entrega 1**.

Actualmente se encuentra implementado:

* Servidor Express funcional.
* Puerto configurable mediante variables de entorno.
* Arquitectura organizada por capas.
* Módulos ESM.
* Endpoint de health.
* Endpoint inicial de events.
* Estructura inicial de sessions.
* Modelo base `User`.
* Modelo base `Event`.
* Configuración de variables mediante dotenv.
* Protección de `.env` y `node_modules` mediante `.gitignore`.

Las siguientes entregas incorporarán progresivamente persistencia en MongoDB, registro seguro de usuarios, autenticación, JWT, cookies HTTP Only, Passport.js, roles, autorización, gestión completa de eventos, tickets, control de cupos y notificaciones.
