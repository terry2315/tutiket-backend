# Tutiket Backend

Backend de **Tutiket**, una plataforma de e-commerce orientada a la gestión y venta de entradas para conciertos y eventos musicales.

El proyecto se desarrolla de manera incremental durante las pre-entregas de **Backend II**. Cada nueva etapa evoluciona sobre la arquitectura anterior, manteniendo una separación clara de responsabilidades.

Actualmente se encuentran implementadas:

* ✅ Pre-entrega 1 — Arquitectura base.
* ✅ Pre-entrega 2 — Registro seguro de usuarios.

---

## Temática del proyecto

Tutiket será una plataforma de venta de entradas para conciertos en la que existirán tres roles principales:

* **User:** comprador de entradas.
* **Organizer:** responsable de crear y administrar eventos.
* **Admin:** administrador general de la plataforma.

En el estado actual del proyecto ya existe un flujo seguro de registro de usuarios.

El sistema todavía no implementa login, JWT, cookies, Passport, gestión completa de eventos ni tickets. Estas funcionalidades se incorporarán progresivamente en las siguientes entregas.

---

# Tecnologías

El proyecto utiliza actualmente:

* **Node.js** — entorno de ejecución para JavaScript.
* **Express** — framework para construir la API REST.
* **MongoDB Atlas** — base de datos en la nube.
* **Mongoose** — modelado y persistencia de documentos MongoDB.
* **bcrypt** — generación segura de hashes de contraseñas.
* **dotenv** — manejo de variables de entorno.
* **Nodemon** — reinicio automático del servidor durante desarrollo.
* **ES Modules** — utilización de `import` y `export`.

---

# Instalación

## 1. Clonar el repositorio

```bash
git clone https://github.com/terry2315/tutiket-backend.git
```

## 2. Ingresar al proyecto

```bash
cd tutiket-backend
```

## 3. Instalar las dependencias

```bash
npm install
```

## 4. Crear el archivo de variables de entorno

En la raíz del proyecto crea:

```text
.env
```

Puedes utilizar `.env.example` como referencia.

---

# Variables de entorno

El proyecto utiliza las siguientes variables:

```env
PORT=8080
NODE_ENV=development
MONGO_URL=tu_url_de_mongodb
JWT_SECRET=tu_clave_secreta
```

| Variable     | Descripción                                           |
| ------------ | ----------------------------------------------------- |
| `PORT`       | Puerto en el que se ejecuta el servidor.              |
| `NODE_ENV`   | Entorno de ejecución.                                 |
| `MONGO_URL`  | URI privada de conexión a MongoDB Atlas.              |
| `JWT_SECRET` | Clave preparada para la futura implementación de JWT. |

> `.env` contiene información privada y está excluido del repositorio mediante `.gitignore`.

La aplicación utiliza la base de datos:

```text
tutiket
```

en MongoDB Atlas.

---

# Cómo ejecutar

Para iniciar el servidor en modo desarrollo:

```bash
npm run dev
```

Con la configuración actual:

```text
http://localhost:8080
```

El servidor establece primero la conexión con MongoDB Atlas y posteriormente comienza a escuchar solicitudes HTTP.

Flujo de arranque:

```text
Variables de entorno
        ↓
Conexión MongoDB Atlas
        ↓
Servidor Express
        ↓
Puerto 8080
```

---

# Arquitectura del proyecto

La API está organizada mediante una arquitectura por capas.

```text
Request
   ↓
Route
   ↓
Controller
   ↓
Service
   ↓
Repository
   ↓
DAO
   ↓
Mongoose Model
   ↓
MongoDB Atlas
```

Estructura actual:

```text
tutiket-backend/
│
├── src/
│   │
│   ├── config/
│   │   └── db.js
│   │
│   ├── controllers/
│   │   ├── events.controller.js
│   │   ├── health.controller.js
│   │   └── sessions.controller.js
│   │
│   ├── dao/
│   │   └── users.dao.js
│   │
│   ├── middlewares/
│   │
│   ├── models/
│   │   ├── Event.js
│   │   └── User.js
│   │
│   ├── repositories/
│   │   └── users.repository.js
│   │
│   ├── routes/
│   │   ├── events.router.js
│   │   ├── health.router.js
│   │   └── sessions.router.js
│   │
│   ├── services/
│   │   └── sessions.service.js
│   │
│   ├── utils/
│   │   └── hash.js
│   │
│   ├── app.js
│   └── server.js
│
├── .env.example
├── .gitignore
├── package.json
├── package-lock.json
└── README.MD
```

---

# Responsabilidad de cada capa

## Routes

Define los endpoints HTTP y delega el procesamiento a los controllers.

Ejemplo:

```text
POST /api/sessions/register
        ↓
sessions.controller.js
```

Las rutas no contienen lógica de negocio.

---

## Controllers

Reciben la solicitud HTTP, llaman al Service correspondiente y construyen la respuesta.

El Controller no:

* valida reglas de negocio;
* accede directamente a MongoDB;
* genera hashes;
* consulta modelos Mongoose.

---

## Services

Contienen la lógica de negocio de la aplicación.

Actualmente `sessions.service.js` se encarga de:

* validar campos obligatorios;
* normalizar el email;
* validar formato de email;
* validar longitud mínima de contraseña;
* detectar emails duplicados;
* proteger la contraseña con bcrypt;
* impedir manipulación pública del rol;
* coordinar la creación del usuario;
* construir una respuesta segura.

---

## Repositories

Traducen operaciones del dominio a operaciones de acceso a datos.

Actualmente:

```text
findByEmail(email)
createUser(data)
```

El Repository no importa directamente el modelo Mongoose.

---

## DAO

Es la capa que accede directamente al modelo Mongoose.

Actualmente:

```text
findOne(filter)
create(data)
```

El modelo `User` se importa desde esta capa.

---

## Models

Contienen los esquemas Mongoose de las entidades del sistema.

Actualmente:

```text
User
Event
```

---

## Utils

Contiene herramientas reutilizables.

Actualmente:

```text
hashPassword()
comparePassword()
```

implementadas mediante bcrypt.

---

## Config

Contiene configuraciones de infraestructura.

Actualmente:

```text
db.js
```

administra la conexión de Mongoose con MongoDB Atlas.

---

# Separación entre `app.js` y `server.js`

## `app.js`

Se encarga de:

* crear la aplicación Express;
* configurar `express.json()`;
* montar los routers;
* exportar la aplicación.

## `server.js`

Se encarga de:

* cargar variables de entorno;
* conectar MongoDB Atlas;
* obtener el puerto;
* levantar el servidor mediante `app.listen()`.

---

# Modelo User

El modelo `User` contiene los siguientes campos:

```text
first_name
last_name
email
password
role
```

Roles disponibles:

```text
user
organizer
admin
```

El valor por defecto es:

```text
user
```

El registro público no permite seleccionar `organizer` ni `admin`.

---

# Seguridad de contraseñas

Las contraseñas nunca se almacenan en texto plano.

El proceso es:

```text
Contraseña recibida
        ↓
bcrypt
        ↓
Hash
        ↓
MongoDB Atlas
```

Ejemplo conceptual:

```text
Secreta123
        ↓
$2b$10$...
```

El helper reutilizable se encuentra en:

```text
src/utils/hash.js
```

y contiene:

```text
hashPassword()
comparePassword()
```

`comparePassword()` queda preparado para el flujo de login de una próxima entrega.

---

# Modelo Event

El modelo base de eventos contiene:

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

Estados disponibles:

```text
draft
published
cancelled
finished
```

`organizer` está preparado como referencia `ObjectId` al modelo `User`.

La lógica completa del CRUD de eventos se incorporará en una futura pre-entrega.

---

# Rutas disponibles

## Health

### GET `/api/health`

Verifica que el servidor esté activo.

Respuesta:

```json
{
  "status": "ok",
  "message": "Servidor activo"
}
```

Código:

```text
200 OK
```

---

# Events

### GET `/api/events`

Actualmente devuelve la estructura inicial del listado de eventos.

Respuesta:

```json
{
  "status": "success",
  "payload": []
}
```

Código:

```text
200 OK
```

La persistencia y lógica completa de eventos se implementarán posteriormente.

---

# Sessions

## POST `/api/sessions/register`

Registra un usuario de forma segura.

### Body requerido

```json
{
  "first_name": "Ana",
  "last_name": "Perez",
  "email": "Ana@Mail.com ",
  "password": "Secreta123"
}
```

Campos requeridos:

```text
first_name
last_name
email
password
```

El email es normalizado mediante:

```text
trim + lowercase
```

Por ejemplo:

```text
"Ana@Mail.com "
```

se almacena como:

```text
ana@mail.com
```

---

## Registro exitoso

Respuesta:

```text
201 Created
```

```json
{
  "status": "success",
  "payload": {
    "id": "68...",
    "first_name": "Ana",
    "last_name": "Perez",
    "email": "ana@mail.com",
    "role": "user"
  }
}
```

La respuesta no contiene el campo `password`.

---

## Campos faltantes

Si falta alguno de los campos obligatorios:

```text
400 Bad Request
```

```json
{
  "status": "error",
  "message": "Faltan campos obligatorios"
}
```

---

## Email inválido

Ejemplo:

```json
{
  "first_name": "Carlos",
  "last_name": "Gomez",
  "email": "carlosmail.com",
  "password": "Secreta123"
}
```

Respuesta:

```text
400 Bad Request
```

```json
{
  "status": "error",
  "message": "El email no tiene un formato válido"
}
```

---

## Contraseña demasiado corta

La contraseña debe contener al menos 8 caracteres.

Respuesta:

```text
400 Bad Request
```

```json
{
  "status": "error",
  "message": "La contraseña debe tener al menos 8 caracteres"
}
```

---

## Email duplicado

Si el email ya existe:

```text
409 Conflict
```

```json
{
  "status": "error",
  "message": "El email ya está registrado"
}
```

La búsqueda utiliza el email normalizado, por lo que:

```text
ANA@MAIL.COM
```

y:

```text
ana@mail.com
```

son considerados el mismo email.

---

# Protección del rol

El registro público no permite que el cliente defina su rol.

Por ejemplo, aunque se envíe:

```json
{
  "first_name": "Marco",
  "last_name": "Lopez",
  "email": "marco@mail.com",
  "password": "Secreta123",
  "role": "admin"
}
```

el backend ignora ese valor y crea:

```json
{
  "role": "user"
}
```

Esta regla evita que un usuario pueda escalar privilegios modificando el body de la petición.

---

# Flujo completo del registro

```text
POST /api/sessions/register
        ↓
sessions.router.js
        ↓
sessions.controller.js
        ↓
sessions.service.js
        ↓
Validación
        ↓
Normalización de email
        ↓
Búsqueda de duplicado
        ↓
hashPassword()
        ↓
users.repository.js
        ↓
users.dao.js
        ↓
User.js
        ↓
MongoDB Atlas
        ↓
Respuesta sin password
```

---

# Casos probados

Durante la Pre-entrega 2 fueron verificados:

* ✅ Registro exitoso.
* ✅ Campos obligatorios faltantes.
* ✅ Email con formato inválido.
* ✅ Email duplicado.
* ✅ Normalización del email.
* ✅ Contraseña almacenada mediante bcrypt.
* ✅ Contraseña no expuesta en respuestas.
* ✅ Intento de registrar `role: "admin"` termina guardando `role: "user"`.

---

# Estado actual del proyecto

## Pre-entrega 1

Completada:

* ✅ servidor Express;
* ✅ arquitectura base;
* ✅ health;
* ✅ estructura inicial de events;
* ✅ estructura inicial de sessions;
* ✅ modelos User y Event;
* ✅ variables de entorno;
* ✅ ES Modules;
* ✅ repositorio público GitHub.

## Pre-entrega 2

Completada:

* ✅ conexión MongoDB Atlas;
* ✅ persistencia mediante Mongoose;
* ✅ DAO de usuarios;
* ✅ Repository de usuarios;
* ✅ Service de registro;
* ✅ bcrypt;
* ✅ validaciones;
* ✅ normalización de email;
* ✅ detección de duplicados;
* ✅ registro público seguro;
* ✅ protección del rol;
* ✅ respuesta sin contraseña.

---

# Próximas etapas

Las siguientes entregas incorporarán progresivamente:

```text
Login
JWT
Cookies HTTP Only
/current
Logout
Passport.js
Roles y autorización
CRUD completo de eventos
Tickets
Control de cupos
Notificaciones
DTO
Manejo centralizado de errores
```

El proyecto continuará evolucionando sobre este mismo repositorio sin comenzar nuevamente desde cero.

---

# Repositorio

```text
https://github.com/terry2315/tutiket-backend
```
