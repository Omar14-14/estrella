# Estrella

Estrella es una aplicacion movil privada construida con Expo, React Native y un backend en Node.js. La app usa un PIN de acceso, una sopa de letras como pantalla principal y varios modulos personales: diario, galeria, musica y juego.

## Caracteristicas

- Acceso privado mediante PIN.
- Sesion protegida con JWT.
- Sopa de letras interactiva como menu principal.
- Acceso directo a modulos desde las palabras debajo de la sopa.
- Diario con crear, editar, listar y eliminar notas.
- Galeria con subida y eliminacion de imagenes.
- Musica por calendario usando pistas remotas.
- Mini juego tipo runner con puntaje y record local.
- Persistencia en Firebase Firestore.
- Almacenamiento de imagenes en Firebase Storage mediante Firebase Admin desde el backend.

## Arquitectura

```text
estrella/
  backend/     API REST con Express, TypeScript, JWT y Firebase Admin
  frontend/    App Expo / React Native / TypeScript
```

### Backend

El backend expone una API REST bajo `/api`:

| Ruta | Metodo | Descripcion |
|---|---:|---|
| `/health` | `GET` | Verifica que el servidor este activo. |
| `/api/auth/validate-pin` | `POST` | Valida el PIN y devuelve un JWT. |
| `/api/diary` | `GET` | Lista notas del diario. |
| `/api/diary` | `POST` | Crea una nota. |
| `/api/diary/:id` | `PUT` | Actualiza una nota. |
| `/api/diary/:id` | `DELETE` | Elimina una nota. |
| `/api/gallery` | `GET` | Lista imagenes de la galeria. |
| `/api/gallery` | `POST` | Sube una imagen a Storage y guarda su registro. |
| `/api/gallery/:id` | `DELETE` | Elimina una imagen y su archivo en Storage. |

Las rutas de diario y galeria requieren token JWT en:

```http
Authorization: Bearer <token>
```

### Frontend

El frontend usa Expo Router:

| Pantalla | Ruta | Descripcion |
|---|---|---|
| PIN | `/` | Pantalla inicial de acceso. |
| Sopa de letras | `/wordsearch` | Menu interactivo principal. |
| Diario | `/diary` | Lista de notas. |
| Editor de nota | `/diary-detail` | Crear o editar notas. |
| Galeria | `/gallery` | Vista y subida de imagenes. |
| Musica | `/music` | Calendario y reproductor. |
| Juego | `/game` | Mini juego con record local. |

## Tecnologias

### Frontend

- Expo
- React Native
- TypeScript
- Expo Router
- Axios
- Expo Secure Store
- Async Storage
- Expo AV
- Expo Image Picker
- React Native Reanimated
- React Native SVG

### Backend

- Node.js
- Express
- TypeScript
- Firebase Admin
- Firestore
- Firebase Storage
- JSON Web Token
- Helmet
- CORS
- Dotenv

## Requisitos

- Node.js instalado.
- npm instalado.
- Proyecto Firebase con Firestore y Storage habilitados.
- Cuenta de servicio de Firebase Admin.

## Instalacion

Clona o descarga el proyecto y entra a la carpeta:

```bash
cd estrella
```

Instala dependencias del backend:

```bash
cd backend
npm install
```

Instala dependencias del frontend:

```bash
cd ../frontend
npm install
```

## Variables de entorno

Cada carpeta tiene su propio archivo `.env.example`. Copialo a `.env` y completa los valores reales.

### Backend

Archivo:

```text
backend/.env
```

Variables:

| Variable | Descripcion |
|---|---|
| `PORT` | Puerto del servidor. Por defecto `3000`. |
| `APP_PIN` | PIN requerido para entrar a la app. |
| `JWT_SECRET` | Secreto largo para firmar tokens JWT. |
| `FIREBASE_PROJECT_ID` | ID del proyecto Firebase. |
| `FIREBASE_STORAGE_BUCKET` | Bucket de Firebase Storage. |
| `FIREBASE_CLIENT_EMAIL` | Email de la cuenta de servicio. |
| `FIREBASE_PRIVATE_KEY` | Clave privada de la cuenta de servicio. |

Ejemplo:

```env
PORT=3000
APP_PIN=0000
JWT_SECRET=replace_with_a_long_random_secret
FIREBASE_PROJECT_ID=your-firebase-project-id
FIREBASE_STORAGE_BUCKET=your-firebase-storage-bucket
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@your-firebase-project-id.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nreplace_with_private_key\n-----END PRIVATE KEY-----\n"
```

### Frontend

Archivo:

```text
frontend/.env
```

Variables:

| Variable | Descripcion |
|---|---|
| `EXPO_PUBLIC_API_URL` | URL base de la API del backend. |

Ejemplo para web local:

```env
EXPO_PUBLIC_API_URL=http://localhost:3000/api
```

Ejemplo para Expo Go en un celular dentro de la misma red:

```env
EXPO_PUBLIC_API_URL=http://TU_IP_LOCAL:3000/api
```

## Ejecucion en desarrollo

### Backend

```bash
cd backend
npm run dev
```

Servidor esperado:

```text
http://localhost:3000
```

Healthcheck:

```text
http://localhost:3000/health
```

### Frontend

```bash
cd frontend
npx expo start
```

Para web:

```bash
npx expo start --web -c
```

## Scripts

### Backend

| Script | Descripcion |
|---|---|
| `npm run dev` | Inicia el servidor con recarga en desarrollo. |
| `npm run build` | Compila TypeScript a `dist/`. |
| `npm start` | Ejecuta la version compilada. |

### Frontend

| Script | Descripcion |
|---|---|
| `npm start` | Inicia Expo. |
| `npm run web` | Inicia Expo para web. |
| `npm run android` | Inicia Expo para Android. |
| `npm run ios` | Inicia Expo para iOS. |

## Flujo de autenticacion

1. El usuario ingresa el PIN en la app.
2. El frontend llama a `/api/auth/validate-pin`.
3. El backend compara el PIN con `APP_PIN`.
4. Si es correcto, devuelve un token JWT.
5. El frontend guarda el token.
6. Las peticiones protegidas usan `Authorization: Bearer <token>`.

En web, el token se guarda en `localStorage`. En movil, se guarda con `expo-secure-store`.

## Datos y almacenamiento

### Diario

Las notas se guardan en Firestore en la coleccion:

```text
diary
```

Cada nota contiene:

```ts
{
  id: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}
```

### Galeria

Las imagenes se suben desde el frontend al backend. El backend las guarda en Firebase Storage usando Firebase Admin y registra la metadata en Firestore.

Coleccion:

```text
gallery
```

Ruta en Storage:

```text
gallery/<fileName>
```

Cada imagen contiene:

```ts
{
  id: string;
  url: string;
  fileName: string;
  createdAt: string;
}
```

## Seguridad

- No subas archivos `.env` a GitHub.
- No subas llaves privadas de Firebase.
- No subas archivos JSON de service account.
- Usa un `JWT_SECRET` largo y unico.
- Si una llave privada ya fue compartida o subida a un repositorio, revocala y genera una nueva en Google Cloud/Firebase.

El `.gitignore` del proyecto ya excluye:

- `.env`
- `.env.*`
- `node_modules/`
- `.expo/`
- `dist/`
- logs
- credenciales y service accounts

## Notas de desarrollo

- Si cambias variables `EXPO_PUBLIC_*`, reinicia Expo con cache limpia:

```bash
npx expo start --web -c
```

- Si borraste `node_modules`, reinstala dependencias:

```bash
cd backend
npm install

cd ../frontend
npm install
```

- Para validar TypeScript en frontend:

```bash
cd frontend
npx tsc --noEmit
```

- Para validar build del backend:

```bash
cd backend
npm run build
```
