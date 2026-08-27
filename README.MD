# Tutiket Backend

Backend de **Tutiket**, una plataforma de e-commerce orientada a la gestión y venta de entradas para conciertos y eventos musicales.

El proyecto se desarrolla de manera incremental durante las pre-entregas de **Backend II**, manteniendo una arquitectura modular y una separación clara de responsabilidades.

Actualmente se encuentran implementadas:

- ✅ **Pre-entrega 1** — Arquitectura base.
- ✅ **Pre-entrega 2** — Registro seguro de usuarios.
- ✅ **Pre-entrega 3** — Login, JWT, cookies y manejo de sesión.
- ✅ **Pre-entrega 4** — Autenticación centralizada con Passport.js.

---

# Temática del proyecto

Tutiket será una plataforma de venta de entradas para conciertos y eventos musicales.

El sistema contempla tres tipos principales de usuarios:

- **User:** comprador de entradas.
- **Organizer:** responsable de crear y administrar eventos.
- **Admin:** administrador general de la plataforma.

Actualmente el sistema permite registrar usuarios, iniciar sesión, generar un JWT, almacenarlo en una cookie `currentUser` HttpOnly, consultar el usuario autenticado y cerrar sesión.

La autorización por roles, la gestión completa de eventos y el sistema de tickets se incorporarán en etapas posteriores.

---

# Pre-entrega 4 — Autenticación centralizada con Passport.js

En esta etapa se refactorizó la autenticación existente para centralizarla mediante estrategias de Passport.js.

El contrato externo de la API se mantiene respecto de la Pre-entrega 3: las rutas y respuestas siguen siendo las mismas. El cambio principal ocurre en la organización interna.

Antes:

```text
Route
   ↓
Middleware / Controller
   ↓
Service de autenticación
   ↓
Repository
   ↓
DAO
   ↓
MongoDB
```

Ahora:

```text
Route
   ↓
Passport Middleware
   ↓
Passport Strategy
   ↓
Repository
   ↓
DAO
   ↓
MongoDB
   ↓
req.user
   ↓
Controller
```

Las estrategias están centralizadas en:

```text
src/config/passport.config.js
```

Actualmente existen tres estrategias:

```text
register
login
current
```

La configuración queda preparada para incorporar en el futuro providers externos como **Google** o **GitHub** sin trasladar la lógica de las estrategias a `app.js`.

> Google OAuth y GitHub OAuth no están implementados actualmente; la arquitectura solamente queda preparada para incorporarlos en etapas futuras.

---

# Tecnologías

El proyecto utiliza actualmente:

- **Node.js** — entorno de ejecución para JavaScript.
- **Express** — framework para la construcción de la API REST.
- **MongoDB Atlas** — base de datos.
- **Mongoose** — modelado y persistencia de documentos MongoDB.
- **dotenv** — manejo de variables de entorno.
- **Nodemon** — reinicio automático del servidor durante desarrollo.
- **bcrypt** — hash y comparación segura de contraseñas.
- **jsonwebtoken** — generación de JWT.
- **cookie-parser** — lectura de cookies desde Express.
- **Passport.js** — centralización de autenticación.
- **passport-local** — estrategias locales de registro y login.
- **passport-jwt** — validación del JWT para el usuario autenticado.
- **ms** — conversión de `JWT_EXPIRES_IN` a milisegundos para sincronizar la expiración de la cookie.
- **ES Modules** — utilización de `import` y `export`.

---

# Arquitectura actual

La arquitectura mantiene una separación clara por responsabilidades.

```text
Request
   ↓
Route
   ↓
Passport Middleware
   ↓
Passport Strategy
   ↓
Repository
   ↓
DAO
   ↓
Mongoose Model
   ↓
MongoDB
```

Cuando la autenticación es exitosa:

```text
Passport Strategy
   ↓
req.user
   ↓
Controller
   ↓
HTTP Response
```

## Config

Contiene configuraciones globales del proyecto.

```text
src/config/
├── db.js
└── passport.config.js
```

`passport.config.js` centraliza las estrategias:

```text
register
login
current
```

`app.js` solamente inicializa Passport:

```js
initializePassport();
app.use(passport.initialize());
```

Las estrategias no viven dentro de `app.js`.

## Routes

Definen los endpoints y delegan la autenticación a middlewares de Passport.

```text
POST /register
   ↓
authenticateRegister
   ↓
register controller

POST /login
   ↓
authenticateLogin
   ↓
login controller

GET /current
   ↓
authenticateCurrent
   ↓
current controller

POST /logout
   ↓
logout controller
```

## Middlewares

`passport.middlewares.js` encapsula `passport.authenticate(...)` y mantiene respuestas JSON consistentes.

Permite controlar:

- errores de registro;
- autenticación inválida;
- ausencia de usuario;
- JWT inválido o ausente;
- asignación de `req.user`.

## Controllers

Los controllers administran la capa HTTP.

Entre sus responsabilidades se encuentran:

- definir códigos de estado;
- construir respuestas JSON;
- generar el JWT después de un login exitoso;
- crear la cookie `currentUser`;
- devolver los datos del usuario actual;
- eliminar la cookie durante logout.

Passport valida las credenciales, pero **el controller de login sigue siendo responsable de generar el JWT y crear la cookie**.

## Repository

Expresa operaciones del dominio relacionadas con usuarios.

Ejemplos:

```text
findByEmail()
findByEmailWithPassword()
createUser()
```

## DAO

Es la capa que interactúa directamente con Mongoose.

El password permanece oculto por defecto gracias a:

```js
select: false
```

Durante el login se recupera excepcionalmente mediante:

```js
.select('+password')
```

## Models

Contienen los esquemas de Mongoose.

Actualmente existen:

```text
User
Event
```

---

# Estructura principal del proyecto

```text
tutiket-backend/
├── src/
│   ├── config/
│   │   ├── db.js
│   │   └── passport.config.js
│   ├── controllers/
│   │   ├── events.controller.js
│   │   ├── health.controller.js
│   │   └── sessions.controller.js
│   ├── dao/
│   │   └── users.dao.js
│   ├── middlewares/
│   │   └── passport.middlewares.js
│   ├── models/
│   │   ├── Event.js
│   │   └── User.js
│   ├── repositories/
│   │   └── users.repository.js
│   ├── routes/
│   │   ├── events.router.js
│   │   ├── health.router.js
│   │   └── sessions.router.js
│   ├── utils/
│   │   ├── hash.js
│   │   └── jwt.js
│   ├── app.js
│   └── server.js
├── .env
├── .env.example
├── .gitignore
├── package.json
├── package-lock.json
└── README.MD
```

> `.env` no debe subirse al repositorio.

---

# Instalación

Clonar el repositorio:

```bash
git clone https://github.com/terry2315/tutiket-backend.git
```

Entrar en el proyecto:

```bash
cd tutiket-backend
```

Instalar dependencias:

```bash
npm install
```

---

# Variables de entorno

Crear un archivo `.env` tomando como referencia `.env.example`.

```env
PORT=8080
NODE_ENV=development
MONGO_URI=tu_url_de_mongodb
JWT_SECRET=tu_clave_secreta
JWT_EXPIRES_IN=1h
```

## Variables

### `PORT`

Puerto utilizado por Express.

### `NODE_ENV`

Entorno de ejecución.

### `MONGO_URI`

URI de conexión con MongoDB Atlas.

### `JWT_SECRET`

Clave privada utilizada para firmar los JWT.

No debe publicarse ni almacenarse directamente en el código.

### `JWT_EXPIRES_IN`

Tiempo de expiración del JWT.

Ejemplo:

```env
JWT_EXPIRES_IN=1h
```

Esta misma configuración se utiliza para calcular dinámicamente el `maxAge` de la cookie `currentUser`.

---

# Ejecución

Modo desarrollo:

```bash
npm run dev
```

El servidor utiliza por defecto:

```text
http://localhost:8080
```

---

# Endpoints

## Health

```http
GET /api/health
```

Permite comprobar que la API está funcionando.

## Events

```http
GET /api/events
```

Endpoint base de eventos implementado durante la arquitectura inicial.

La lógica completa de eventos se desarrollará en una etapa posterior.

---

# Sesiones y autenticación

## Registro

```http
POST /api/sessions/register
```

Ejemplo:

```json
{
  "first_name": "Carlos",
  "last_name": "Perez",
  "email": "carlos@mail.com",
  "password": "Password123"
}
```

La estrategia Passport `register` se encarga de:

```text
validar campos
   ↓
normalizar email
   ↓
validar formato
   ↓
validar password
   ↓
comprobar duplicado
   ↓
bcrypt.hash()
   ↓
forzar role = user
   ↓
crear usuario
```

Respuesta exitosa:

```http
201 Created
```

```json
{
  "status": "success",
  "payload": {
    "id": "...",
    "first_name": "Carlos",
    "last_name": "Perez",
    "email": "carlos@mail.com",
    "role": "user"
  }
}
```

El password nunca se devuelve.

Aunque el cliente intente enviar:

```json
{
  "role": "admin"
}
```

el registro fuerza:

```text
role = user
```

## Login

```http
POST /api/sessions/login
```

Ejemplo:

```json
{
  "email": "carlos@mail.com",
  "password": "Password123"
}
```

La estrategia Passport `login`:

```text
normaliza email
   ↓
busca usuario incluyendo password
   ↓
bcrypt.compare()
   ↓
done(null, user)
   ↓
req.user
```

Después de una autenticación exitosa, el **controller**:

```text
genera JWT
   ↓
crea cookie currentUser
   ↓
HttpOnly
```

Respuesta:

```http
200 OK
```

```json
{
  "status": "success",
  "message": "Login correcto"
}
```

## Credenciales inválidas

Email inexistente y password incorrecto utilizan el mismo mensaje:

```http
401 Unauthorized
```

```json
{
  "status": "error",
  "message": "Credenciales inválidas"
}
```

Esto evita revelar si una cuenta concreta existe.

## Usuario actual

```http
GET /api/sessions/current
```

La estrategia Passport `current`:

```text
lee currentUser
   ↓
passport-jwt
   ↓
valida firma
   ↓
valida expiración
   ↓
req.user
```

Respuesta con JWT válido:

```http
200 OK
```

```json
{
  "status": "success",
  "payload": {
    "id": "...",
    "email": "carlos@mail.com",
    "role": "user"
  }
}
```

No se devuelve `password`.

## Current sin autenticación

Sin cookie, con token vencido o con JWT manipulado:

```http
401 Unauthorized
```

```json
{
  "status": "error",
  "message": "No autenticado"
}
```

## Logout

```http
POST /api/sessions/logout
```

Logout no utiliza Passport.

El controller elimina directamente:

```text
currentUser
```

Respuesta:

```http
200 OK
```

```json
{
  "status": "success",
  "message": "Sesión cerrada"
}
```

Después del logout:

```http
GET /api/sessions/current
```

devuelve:

```http
401 Unauthorized
```

---

# Estrategias de Passport

## `register`

Responsable de:

- validar datos;
- normalizar email;
- comprobar unicidad;
- proteger password con bcrypt;
- forzar el rol inicial `user`;
- crear el usuario.

## `login`

Responsable de:

- normalizar email;
- buscar al usuario;
- recuperar el password de forma controlada;
- comparar contraseña mediante bcrypt;
- proporcionar el usuario autenticado mediante `req.user`.

El JWT no se genera dentro de esta estrategia.

## `current`

Responsable de:

- extraer el JWT desde la cookie `currentUser`;
- validar firma;
- validar expiración;
- proporcionar `{ id, email, role }` mediante `req.user`.

---

# Cookie de autenticación

La cookie utilizada es:

```text
currentUser
```

Configuración principal:

```text
HttpOnly: true
SameSite: lax
Secure: true únicamente en producción
```

Su expiración se calcula dinámicamente a partir de:

```env
JWT_EXPIRES_IN
```

Por ejemplo:

```text
JWT_EXPIRES_IN=1h
   ↓
JWT ≈ 1 hora
Cookie ≈ 1 hora
```

---

# Seguridad

El sistema implementa actualmente:

- passwords protegidos mediante bcrypt;
- `password` con `select: false`;
- recuperación explícita del hash solamente durante login;
- JWT firmado con `JWT_SECRET`;
- expiración configurable;
- cookie HttpOnly;
- cookie Secure en producción;
- SameSite Lax;
- mensajes genéricos para credenciales inválidas;
- rechazo de JWT manipulados;
- ausencia de password en respuestas y payloads;
- rol inicial controlado por el servidor;
- `.env` excluido del repositorio.

---

# Pruebas realizadas — Pre-entrega 4

## Registro

```text
✅ registro exitoso
✅ email duplicado → 409
✅ campos obligatorios → 400
✅ password menor de 8 caracteres → 400
✅ role enviado como admin es ignorado
✅ usuario creado con role=user
```

## Login

```text
✅ login correcto → 200
✅ JWT generado por Controller
✅ currentUser HttpOnly
✅ password incorrecto → 401
✅ email inexistente → 401
✅ mensaje genérico "Credenciales inválidas"
```

## Current

```text
✅ JWT válido → 200
✅ sin cookie → 401
✅ JWT manipulado → 401
✅ datos devueltos: id, email, role
✅ password no expuesto
```

## Logout

```text
✅ logout → 200
✅ cookie eliminada
✅ /current después de logout → 401
```

## Prueba post-refactor

Después de eliminar la implementación de autenticación reemplazada por Passport se verificó nuevamente:

```text
✅ login → 200
✅ /current → 200
```

Esto confirma que el sistema ya depende de las estrategias centralizadas de Passport.

---

# Flujo completo

```text
REGISTER
   ↓
Passport "register"
   ↓
bcrypt
   ↓
MongoDB
   ↓
201

LOGIN
   ↓
Passport "login"
   ↓
bcrypt.compare()
   ↓
req.user
   ↓
Controller
   ↓
JWT
   ↓
currentUser HttpOnly
   ↓
200

CURRENT
   ↓
Passport "current"
   ↓
passport-jwt
   ↓
req.user
   ↓
200

LOGOUT
   ↓
Controller
   ↓
clearCookie()
   ↓
200

CURRENT
   ↓
sin currentUser válido
   ↓
401
```

---

# Preparación para autenticación externa

Las estrategias están centralizadas en:

```text
src/config/passport.config.js
```

Esto permite ampliar el sistema en el futuro con providers como:

```text
Google
GitHub
```

sin introducir las estrategias directamente en `app.js`.

Conceptualmente:

```text
passport.config.js
├── register
├── login
├── current
├── google    ← futuro
└── github    ← futuro
```

Actualmente Google y GitHub **no forman parte de la implementación**.

---

# Estado del proyecto

```text
✅ PRE-ENTREGA 1 — Arquitectura base
✅ PRE-ENTREGA 2 — Registro seguro de usuarios
✅ PRE-ENTREGA 3 — JWT, cookies y manejo de sesión
✅ PRE-ENTREGA 4 — Autenticación centralizada con Passport.js
```

Próximas etapas:

```text
⬜ Roles y autorización
⬜ Gestión completa de eventos
⬜ Tickets e inscripciones
⬜ Consolidación de arquitectura
⬜ Entrega final
```

---

# Repositorio

```text
https://github.com/terry2315/tutiket-backend
```

---

# Autor

**Terry Guzman**
