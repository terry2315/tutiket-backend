# Tutiket Backend

Backend de **Tutiket**, plataforma de venta de entradas, eventos e inscripciones.

## Estado

✅ Pre-entrega 1 — Arquitectura base  
✅ Pre-entrega 2 — Registro seguro  
✅ Pre-entrega 3 — JWT, cookies y sesión  
✅ Pre-entrega 4 — Passport.js  
✅ Pre-entrega 5 — Roles y autorización  
✅ Pre-entrega 6 — Events y lógica de negocio  
✅ Pre-entrega 7 — Tickets, inscripciones y control de cupos  
✅ Pre-entrega 8 — Arquitectura con DAO, Repository y DTO  
✅ Entrega Final — API integrada y validada

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
Middleware → autenticación, autorización y errores
```

Los modelos Mongoose solo son importados por los DAO.

Los services consumen repositories y los controllers consumen services.

## Instalación

```bash
git clone https://github.com/terry2315/tutiket-backend.git
cd tutiket-backend
npm install
```

Crear un archivo `.env` basado en `.env.example`.

## Variables de entorno

```env
PORT=8080
NODE_ENV=development

MONGO_URI=tu_url_de_mongodb

JWT_SECRET=tu_clave_secreta
JWT_EXPIRES_IN=1h

MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USER=tu_correo
MAIL_PASS=tu_password_de_aplicacion
MAIL_FROM="Tutiket <tu_correo>"
```

`.env` no se versiona.

## Ejecución

```bash
npm run dev
```

Servidor:

```text
http://localhost:8080
```

## Roles

```text
user
organizer
admin
```

El registro público siempre crea usuarios con:

```text
role = user
```

El cliente no puede asignarse `organizer` o `admin` desde el body.

## Crear usuario de prueba

```http
POST /api/sessions/register
```

```json
{
  "first_name": "Test",
  "last_name": "User",
  "email": "test@mail.com",
  "password": "Password123"
}
```

Respuesta esperada:

```text
201 Created
```

Para probar permisos de `organizer` y `admin`, el rol debe configurarse de forma controlada en la base de datos.

## Autenticación

```text
POST /api/sessions/register
POST /api/sessions/login
GET  /api/sessions/current
POST /api/sessions/logout
```

Flujo:

```text
register
→ login
→ JWT
→ cookie currentUser HttpOnly
→ current
→ logout
```

Sin sesión válida:

```text
401 Unauthorized
```

Con sesión válida pero sin permisos:

```text
403 Forbidden
```

`/current` nunca devuelve `password`.

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
draft
published
cancelled
finished
```

Validaciones principales:

```text
fecha futura
capacity > 0
price >= 0
evento cancelado no puede modificarse
solo dueño o admin puede modificar
```

### Filtros y paginación

Ejemplo:

```http
GET /api/events?status=published&page=2&limit=5
```

Respuesta:

```json
{
  "status": "success",
  "data": [],
  "page": 2,
  "limit": 5,
  "total": 3,
  "totalPages": 1
}
```

También permite filtros por:

```text
status
category
location
dateFrom
dateTo
```

y ordenamiento.

## Tickets

Modelo:

```text
user
event
status
quantity
reservationCode
createdAt
cancelledAt
```

`user` y `event` son referencias `ObjectId`.

Estados:

```text
confirmed
pending
cancelled
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
usuario autenticado
→ evento existe
→ status = published
→ quantity > 0
→ comprobar inscripción activa
→ calcular cupos
→ crear ticket confirmed
→ generar reservationCode
→ enviar email
```

Ejemplo:

```http
POST /api/events/:eid/tickets
```

```json
{
  "quantity": 1
}
```

Respuesta exitosa:

```text
201 Created
```

Inscripción duplicada:

```text
409 Conflict
```

Cupos insuficientes:

```text
409 Conflict
```

## Regla de cupos

```text
disponibles =
event.capacity -
SUM(quantity de confirmed + pending)
```

Los tickets `cancelled` no ocupan cupo.

Al cancelar un ticket, el cupo vuelve a estar disponible automáticamente.

## Cancelación

```text
status = cancelled
cancelledAt = fecha actual
```

El ticket no se elimina físicamente.

## Mis tickets

```http
GET /api/tickets/my-tickets
```

Utiliza `populate` para incluir únicamente:

```text
event._id
event.title
event.date
event.location
```

Los DTO evitan exponer información sensible.

## DTO

La API utiliza DTO para:

```text
User
Event
Ticket
```

`password` nunca se devuelve en las respuestas.

## Email

Nodemailer envía un correo cuando una inscripción es confirmada.

El email contiene:

```text
evento
fecha
lugar
cantidad
reservationCode
```

Las credenciales se leen exclusivamente desde variables de entorno.

## Manejo de errores

```text
400 → datos o regla inválida
401 → no autenticado
403 → sin permisos
404 → recurso no encontrado
409 → conflicto
500 → error interno
```

Flujo:

```text
Service
→ error
→ Controller
→ next(error)
→ errorHandler
→ Response
```

## Seguridad

```text
✅ passwords hasheadas con bcrypt
✅ JWT en cookie HttpOnly
✅ password oculto en respuestas
✅ registro público fuerza role=user
✅ autorización por rol
✅ autorización por propiedad
✅ DTO para respuestas sensibles
✅ credenciales fuera del repositorio
✅ .env no versionado
✅ node_modules no versionado
```

## Validación de Entrega Final

```text
✅ registro → login → current → logout → 401
✅ user intenta crear evento → 403
✅ organizer crea evento
✅ evento draft → published
✅ user se inscribe → 201
✅ email de confirmación recibido
✅ cupos descontados correctamente
✅ inscripción duplicada → 409
✅ cupos insuficientes → 409
✅ cancelación libera cupo
✅ nueva inscripción después de cancelar → 201
✅ organizer modifica evento ajeno → 403
✅ admin modifica evento ajeno → 200
✅ respuestas sin password
✅ filtros y paginación funcionando
✅ modelos Mongoose importados solo por DAO
✅ repositories consumen DAO
✅ services consumen repositories
✅ controllers consumen services
✅ middleware centralizado de errores
```

## Repositorio

https://github.com/terry2315/tutiket-backend

## Autor

**Terry Guzman**