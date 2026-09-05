Tutiket Backend

Backend de Tutiket, plataforma de venta de entradas para eventos.

Estado

✅ Pre-entrega 1 — Arquitectura base

✅ Pre-entrega 2 — Registro seguro

✅ Pre-entrega 3 — JWT, cookies y sesión

✅ Pre-entrega 4 — Passport.js

✅ Pre-entrega 5 — Roles y autorización

✅ Pre-entrega 6 — Events y lógica de negocio

✅ Pre-entrega 7 — Tickets, inscripciones y control de cupos

Stack

Node.js · Express · MongoDB Atlas · Mongoose · Passport.js · JWT · bcrypt · cookie-parser · Nodemailer

Arquitectura

Route → Middleware → Controller → Service → Repository → DAO → MongoDB

La lógica de negocio vive en services; el acceso a datos en repositories y dao.

Roles

user · organizer · admin

Eventos

POST  /api/events              → organizer | admin
GET   /api/events              → público
GET   /api/events/:id          → público
PUT   /api/events/:id          → dueño | admin
PATCH /api/events/:id/status   → dueño | admin

Estados:

draft · published · cancelled · finished

Tickets

Modelo:

user · event · status · quantity · reservationCode · cancelledAt

user y event son referencias ObjectId.

Estados:

confirmed · pending · cancelled

Rutas:

POST  /api/events/:eid/tickets → autenticado
GET   /api/tickets/my-tickets  → autenticado
GET   /api/events/:eid/tickets → organizer dueño | admin
PATCH /api/tickets/:tid/cancel → dueño del ticket | admin

Flujo de inscripción

evento existe
→ status = published
→ quantity > 0
→ sin ticket activo duplicado
→ calcular cupos
→ crear ticket confirmed
→ generar reservationCode
→ enviar email

Regla de cupos:

disponibles = event.capacity - SUM(quantity de confirmed + pending)

Los tickets cancelled no ocupan cupo.

Cancelación

status = cancelled
cancelledAt = fecha actual

El ticket no se elimina. Al quedar cancelled, el cupo se libera automáticamente.

Mis tickets

GET /api/tickets/my-tickets

Incluye mediante populate:

event.title
event.date
event.location

Autenticación y autorización

sin sesión válida → 401
sesión válida sin permiso → 403

Email

Nodemailer envía confirmación al crear una inscripción.

Variables:

MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USER=tu_correo
MAIL_PASS=tu_password_de_aplicacion
MAIL_FROM="Tutiket <tu_correo>"

También:

PORT=8080
NODE_ENV=development
MONGO_URI=tu_url_de_mongodb
JWT_SECRET=tu_clave_secreta
JWT_EXPIRES_IN=1h

.env no se versiona.

Ejecución

npm install
npm run dev

Servidor: http://localhost:8080

Pre-entrega 7 — pruebas

✅ inscripción exitosa + email
✅ duplicado activo → 409
✅ sin sesión → 401
✅ evento inexistente → 404
✅ evento cancelado → 400
✅ sin cupos → 400
✅ cancelación propia → 200
✅ cancelación libera cupo → nueva inscripción 201
✅ cancelar ticket ajeno → 403
✅ user consulta tickets de evento → 403
✅ organizer ajeno consulta tickets → 403
✅ organizer dueño consulta tickets → 200
✅ my-tickets + populate → 200
✅ quantity 0 → 400
✅ admin consulta tickets → 200

Repositorio

https://github.com/terry2315/tutiket-backend

Autor

Terry Guzman