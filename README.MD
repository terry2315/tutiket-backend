# Tutiket Backend

Backend de **Tutiket**, una plataforma de e-commerce orientada a la gestión y venta de entradas para conciertos y eventos musicales.

El proyecto se desarrolla de manera incremental durante las pre-entregas de **Backend II**, manteniendo una arquitectura modular y una separación clara de responsabilidades.

Actualmente se encuentran implementadas:

- ✅ **Pre-entrega 1** — Arquitectura base.
- ✅ **Pre-entrega 2** — Registro seguro de usuarios.
- ✅ **Pre-entrega 3** — Login, JWT, cookies y manejo de sesión.

---

# Temática del proyecto

Tutiket será una plataforma de venta de entradas para conciertos y eventos musicales.

El sistema contempla tres tipos principales de usuarios:

- **User:** comprador de entradas.
- **Organizer:** responsable de crear y administrar eventos.
- **Admin:** administrador general de la plataforma.

Actualmente la autenticación local ya permite registrar usuarios, iniciar sesión, consultar la sesión actual y cerrar sesión.

La creación completa de eventos, autorización por roles, Passport y sistema de tickets se incorporarán en las siguientes etapas.

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
- **jsonwebtoken** — generación y verificación de JWT.
- **cookie-parser** — lectura de cookies desde Express.
- **ES Modules** — utilización de `import` y `export`.

---

# Arquitectura

El backend utiliza una separación por responsabilidades:

```text
Request
   ↓
Route
   ↓
Middleware
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
MongoDB