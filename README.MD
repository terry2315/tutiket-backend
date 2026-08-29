# Tutiket Backend

Backend de **Tutiket**, plataforma de venta de entradas para eventos.

## Estado

- ✅ Pre-entrega 1 — Arquitectura base
- ✅ Pre-entrega 2 — Registro seguro
- ✅ Pre-entrega 3 — JWT, cookies y sesión
- ✅ Pre-entrega 4 — Passport.js
- ✅ Pre-entrega 5 — Roles y autorización

## Stack

Node.js · Express · MongoDB Atlas · Mongoose · Passport.js · JWT · bcrypt · cookie-parser

## Roles

- `user`
- `organizer`
- `admin`

El registro público siempre crea usuarios con `role: "user"`.

## Matriz de permisos

| Acción | user | organizer | admin |
|---|---:|---:|---:|
| Consultar eventos | ✅ | ✅ | ✅ |
| Crear eventos | ❌ | ✅ | ✅ |
| Modificar evento propio | ❌ | ✅ | ✅ |
| Modificar evento ajeno | ❌ | ❌ | ✅ |
| Ver usuarios | ❌ | ❌ | ✅ |

## Autenticación y autorización

```text
Request
  ↓
auth
  ↓
¿sesión válida?
NO → 401
  ↓
SÍ
  ↓
authorize(...)
  ↓
¿rol permitido?
NO → 403
  ↓
SÍ → Controller
```

- **401**: no existe una sesión válida.
- **403**: existe sesión, pero el usuario no tiene permiso.

## Rutas principales

```text
POST /api/sessions/register
POST /api/sessions/login
GET  /api/sessions/current
POST /api/sessions/logout

GET   /api/events
POST  /api/events
PATCH /api/events/:eid

GET   /api/admin/users
```

### Protección

```text
POST /api/events
→ organizer | admin

PATCH /api/events/:eid
→ organizer propietario | admin

GET /api/admin/users
→ admin
```

## Propiedad de eventos

El backend asigna automáticamente:

```js
organizer: req.user.id
```

Un `organizer` solo puede modificar eventos propios.  
Un `admin` puede modificar cualquier evento.

## Errores esperados

### Sin sesión

```json
{
  "status": "error",
  "message": "No autenticado"
}
```

→ `401 Unauthorized`

### Sin permiso

```json
{
  "status": "error",
  "message": "No tenés permisos para realizar esta acción"
}
```

→ `403 Forbidden`

## Variables de entorno

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

## Seguridad

- password con bcrypt;
- `password` oculto por defecto;
- JWT en cookie `currentUser` HttpOnly;
- roles controlados por backend;
- autorización reutilizable mediante middlewares;
- JWT manipulado o sesión ausente → 401;
- usuario autenticado sin permisos → 403.

## Pre-entrega 5 — pruebas

```text
✅ user crea evento → 403
✅ organizer crea evento → 201
✅ organizer entra a ruta admin → 403
✅ admin entra a ruta admin → 200
✅ organizer modifica evento propio → 200
✅ organizer modifica evento ajeno → 403
✅ admin modifica evento ajeno → 200
✅ ruta privada sin cookie → 401
```

## Repositorio

https://github.com/terry2315/tutiket-backend

## Autor

**Terry Guzman**
