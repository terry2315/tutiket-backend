# Tutiket Backend

Backend de **Tutiket**, plataforma de venta de entradas para eventos.

## Estado

✅ Pre-entrega 1 — Arquitectura base

✅ Pre-entrega 2 — Registro seguro

✅ Pre-entrega 3 — JWT, cookies y sesión

✅ Pre-entrega 4 — Passport.js

✅ Pre-entrega 5 — Roles y autorización

✅ Pre-entrega 6 — Events y lógica de negocio

✅ Pre-entrega 7 — Tickets, inscripciones y control de cupos

✅ Pre-entrega 8 — Arquitectura con DAO, Repository y DTO

## Stack

Node.js · Express · MongoDB Atlas · Mongoose · Passport.js · JWT · bcrypt · cookie-parser · Nodemailer

## Arquitectura

```text
Route
→ Middleware
→ Controller
→ Service
→ Repository
→ DAO
→ Mongoose Model
→ MongoDB
```

Responsabilidades:

```text
Controller → request / response
Service → lógica de negocio
Repository → operaciones de dominio
DAO → acceso directo a Mongoose
DTO → controla los datos expuestos
```

Los modelos de Mongoose solo son importados por los DAO.

Los services consumen repositories y los controllers consumen services.

## DTO

La API utiliza DTO para controlar las respuestas de:

```text
User
Event
Ticket
```

Esto evita exponer datos internos o sensibles.

`password` nunca se devuelve en las respuestas.

Los tickets con `populate` solo exponen del evento:

```text
event._id
event.title
event.date
event.location
```

## Roles

```text
user · organizer · admin
```

## Eventos

```text
POST  /api/events              → organizer | admin
GET   /api/events              → público
GET   /api/events/:id          → público
PUT   /api/events/:id          → dueño | admin
PATCH /api/events/:id/status   → dueño | admin
```

Estados:

```text
draft · published · cancelled · finished
```

## Tickets

Modelo:

```text
user · event · status · quantity · reservationCode · cancelledAt
```

`user` y `event` son referencias `ObjectId`.

Estados:

```text
confirmed · pending · cancelled
```

Rutas:

```text
POST  /api/events/:eid/tickets → autenticado
GET   /api/tickets/my-tickets  → autenticado
GET   /api/events/:eid/tickets → organizer dueño | admin
PATCH /api/tickets/:tid/cancel → dueño del ticket | admin
```

## Flujo de inscripción

```text
evento existe
→ status = published
→ quantity > 0
→ sin ticket activo duplicado
→ calcular cupos
→ crear ticket confirmed
→ generar reservationCode
→ enviar email
```

Regla de cupos:

```text
disponibles =
event.capacity -
SUM(quantity de confirmed + pending)
```

Los tickets `cancelled` no ocupan cupo.

## Cancelación

```text
status = cancelled
cancelledAt = fecha actual
```

El ticket no se elimina.

Al quedar `cancelled`, el cupo se libera automáticamente.

## Mis tickets

```text
GET /api/tickets/my-tickets
```

Incluye mediante `populate` y DTO:

```text
event._id
event.title
event.date
event.location
```

## Autenticación y autorización

```text
sin sesión válida → 401
sesión válida sin permiso → 403
```

`GET /api/sessions/current` devuelve únicamente:

```text
id
email
role
```

Nunca devuelve `password`.

## Manejo de errores

Los errores de negocio se envían mediante:

```text
Service
→ throw createError()
→ Controller
→ next(error)
→ errorHandler
```

Códigos utilizados:

```text
400 → datos o regla de negocio inválida
401 → no autenticado
403 → sin permisos
404 → recurso no encontrado
409 → conflicto
500 → error interno
```

## Email

Nodemailer envía confirmación al crear una inscripción.

Variables:

```env
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USER=tu_correo
MAIL_PASS=tu_password_de_aplicacion
MAIL_FROM="Tutiket <tu_correo>"
```

También:

```env
PORT=8080
NODE_ENV=development
MONGO_URI=tu_url_de_mongodb
JWT_SECRET=tu_clave_secreta
JWT_EXPIRES_IN=1h
```

`.env` no se versiona.

## Ejecución

```bash
npm install
npm run dev
```

Servidor:

```text
http://localhost:8080
```

## Pre-entrega 8 — pruebas

```text
✅ modelos Mongoose importados solo por DAO
✅ repositories consumen DAO
✅ services consumen repositories
✅ controllers consumen services
✅ User DTO funcionando
✅ Event DTO funcionando
✅ Ticket DTO funcionando
✅ populate filtrado mediante DTO
✅ /current no expone password
✅ middleware centralizado de errores
✅ datos inválidos → 400
✅ sin sesión → 401
✅ sin permisos → 403
✅ recurso inexistente → 404
✅ conflicto → 409
✅ registro → 201
✅ login → 200
✅ current → 200
✅ organizer crea evento → 201
✅ evento draft → published
✅ inscripción → 201
✅ consulta de tickets → 200
✅ cancelación de ticket → 200
✅ flujo completo funciona después del refactor
```

## Repositorio

https://github.com/terry2315/tutiket-backend

## Autor

**Terry Guzman**