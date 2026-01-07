# Venner Ecommerce Server

Backend para la plataforma de comercio electrónico **Venner**, especializada en la venta de vinos y productos relacionados. Esta aplicación proporciona una API RESTful robusta construida con Node.js, Express y TypeScript.

## Características Principales

- **Autenticación y Seguridad**:
  - Registro e inicio de sesión de usuarios.
  - Gestión de sesiones segura mediante Cookies y JWT (JSON Web Tokens).
  - Middleware de autorización para protección de rutas (Roles: Invitado, Usuario, Administrador).
  - Configuración de CORS para seguridad en peticiones cruzadas.

- **Gestión de Catálogo**:
  - **Productos**: CRUD completo para la gestión de productos generales.
  - **Vinos**: Endpoints especializados para la gestión de vinos como producto principal.
  - **Categorías**: Organización de productos mediante categorías.
  - **Imágenes**: Gestión de recursos visuales asociados a los productos.

- **Utilidades**:
  - Endpoint de "Health Check" para monitoreo del estado del servidor.
  - Logs de peticiones HTTP en modo desarrollo (Morgan).
  - Validación de datos de entrada mediante esquemas (Zod).

## Tecnologías

- **Runtime**: Node.js
- **Framework**: Express
- **Lenguaje**: TypeScript
- **Base de Datos**: PostgreSQL
- **Autenticación**: `cookie-parser`, `jsonwebtoken`
- **Validación**: Zod
- **Logging**: Morgan

## Instalación y Configuración

### 1. Requisitos Previos
- Node.js
- Base de datos PostgreSQL corriendo

### 2. Instalación de Dependencias
```bash
npm install
```

### 3. Variables de Entorno
Crea un archivo `.env` en la raíz del proyecto. Asegúrate de definir las siguientes variables:

```env
PORT=3000
DB_HOST=localhost
DB_USER=tu_usuario
DB_PASSWORD=tu_contraseña
DB_NAME=venner_db
DB_PORT=5432
TOKEN_SECRET=tu_clave_secreta_para_jwt
ADMIN_EMAIL=admin@venner.com
ADMIN_PASSWORD=password_seguro
```

### 4. Inicializacion de la Base de Datos
El proyecto incluye scripts para facilitar la configuracion inicial de la base de datos. Una vez instaladas las dependencias y configurado el archivo `.env`, ejecuta: 

```bash
npm run db:init
```

Este comando realiza la configuracion completa ejecutandose secuencialmente: 
1. `npm run db:setup`: Crea la base de datos

2. `npm run db:migrate`: Ejecuta las migraciones para crear las tablas

3. `npm run db:seed`: Puebla la base de datos con datos de prueba

4. `npm run db:create-admin`: Crea un usuario administrador utilizando las credenciales (`ADMIN_EMAIL`, `ADMIN_PASSWORD`) definidas en el archivo `.env`

>Nota: Tambien dispones del comando `npm run db:drop` para eliminar la base de datos si necesitas reiniciar el entorno desde cero.

### 5. Ejecución
```bash
# Modo desarrollo
npm run dev

# Compilar y ejecutar en producción
npm run build
npm start
```

## Documentación de la API

La API se sirve bajo el prefijo base: `/api/v1`

### Sistema
- `GET /health`: Comprobar el estado del servicio.

### Usuarios (`/users`)
- `POST /register`: Registrar un nuevo usuario (Requiere ser invitado).
- `POST /login`: Iniciar sesión (Requiere ser invitado).
- `POST /logout`: Cerrar sesión.
- `GET /profile`: Obtener perfil del usuario actual (Requiere autenticación).
- `GET /verify-token`: Verificar la validez del token de sesión.

### Catálogo
- **Productos** (`/products`): Gestión general de productos. Incluye filtro para obtener solo vinos (`GET /products/wines`).
- **Vinos** (`/wines`): Gestión específica para la entidad vino.
- **Categorías** (`/categories`): Gestión de categorías.
- **Imágenes** (`/images`): Gestión de imágenes de productos.

> **Nota**: Las operaciones de creación, actualización y eliminación (POST, PUT, DELETE) en el catálogo están protegidas y requieren rol de **Administrador**.

---
