# Tutiket Backend

Backend de **Tutiket**, plataforma de venta de entradas para eventos.

## Estado

- ✅ Pre-entrega 1 — Arquitectura base
- ✅ Pre-entrega 2 — Registro seguro
- ✅ Pre-entrega 3 — JWT, cookies y sesión
- ✅ Pre-entrega 4 — Passport.js
- ✅ Pre-entrega 5 — Roles y autorización
- ✅ Pre-entrega 6 — Events y lógica de negocio

## Stack

Node.js · Express · MongoDB Atlas · Mongoose · Passport.js · JWT · bcrypt · cookie-parser

## Arquitectura

```text
Route → Middleware → Controller → Service → Repository → DAO → MongoDB
```

La lógica de negocio de eventos vive en `services`; el acceso a datos en `repositories` y `dao`.

## Roles y permisos

| Acción | user | organizer | admin |
|---|---:|---:|---:|
| Consultar eventos | ✅ | ✅ | ✅ |
| Crear eventos | ❌ | ✅ | ✅ |
| Modificar evento propio | ❌ | ✅ | ✅ |
| Modificar evento ajeno | ❌ | ❌ | ✅ |
| Ver usuarios | ❌ | ❌ | ✅ |

El registro público siempre crea `role: "user"`.

## Rutas

```text
POST  /api/sessions/register
POST  /api/sessions/login
GET   /api/sessions/current
POST  /api/sessions/logout

POST  /api/events              → organizer | admin
GET   /api/events              → público
GET   /api/events/:id          → público
PUT   /api/events/:id          → dueño | admin
PATCH /api/events/:id/status   → dueño | admin

GET   /api/admin/users         → admin
```

## Eventos

Campos principales:

```text
title · description · category · date · location
capacity · price · status · organizer
```

`organizer` es un `ObjectId` con referencia a `User` y se asigna desde `req.user.id`.

Estados válidos:

```text
draft · published · cancelled · finished
```

Reglas principales:

- fecha futura al crear;
- `capacity > 0`;
- `price >= 0`;
- `organizer` no puede venir del body;
- `organizer` solo modifica eventos propios;
- `admin` puede modificar cualquiera;
- `cancelled` no puede modificarse ni cambiar nuevamente de estado;
- `finished` no puede volver a `published`;
- cancelar no elimina el evento: cambia `status` a `cancelled`.

## Filtros y paginación

`GET /api/events` soporta:

```text
status · category · location · dateFrom · dateTo · page · limit · sort
```

Ejemplo:

```http
GET /api/events?status=published&category=workshop&page=1&limit=5&sort=date
```

Respuesta:

```json
{
  "data": [],
  "page": 1,
  "limit": 5,
  "total": 0,
  "totalPages": 0
}
```

## Autenticación y autorización

```text
sin sesión válida → 401
sesión válida sin permiso → 403
```

JWT se almacena en la cookie HttpOnly `currentUser`.

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

Servidor: `http://localhost:8080`

## Pre-entrega 6 — pruebas

```text
✅ fecha pasada → 400
✅ capacity: 0 → 400
✅ price < 0 → 400
✅ creación válida → 201
✅ paginación + sort → 200
✅ filtros → 200
✅ detalle por id → 200
✅ evento inexistente → 404
✅ organizer modifica propio → 200
✅ organizer modifica ajeno → 403
✅ admin modifica ajeno → 200
✅ draft → published → 200
✅ published → cancelled → 200
✅ cancelled cambia estado → 400
✅ cancelled se modifica → 400
```

## Repositorio

https://github.com/terry2315/tutiket-backend

## Autor

**Terry Guzman**
