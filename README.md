# Estrella

App movil privada con PIN, sopa de letras interactiva y modulos personales.

## Estructura

```text
estrella/
  frontend/   Expo managed (TypeScript)
  backend/    Node.js + Express + TypeScript
```

## Setup rapido

### Backend

```bash
cd backend
cp .env.example .env
npm install
npm run dev
```

### Frontend

```bash
cd frontend
cp .env.example .env
npm install
npx expo start
```

## Variables de entorno

### Backend

| Variable | Descripcion |
|---|---|
| `PORT` | Puerto del servidor. Default: `3000`. |
| `APP_PIN` | PIN de acceso a la app. |
| `JWT_SECRET` | Secreto para firmar tokens. |
| `FIREBASE_PROJECT_ID` | ID del proyecto Firebase. |
| `FIREBASE_STORAGE_BUCKET` | Bucket de Firebase Storage. |
| `FIREBASE_CLIENT_EMAIL` | Email de la cuenta de servicio. |
| `FIREBASE_PRIVATE_KEY` | Clave privada de la cuenta de servicio. |

### Frontend

| Variable | Descripcion |
|---|---|
| `EXPO_PUBLIC_API_URL` | URL del backend. |

## Modulos

| Modulo | Ruta |
|---|---|
| PIN | `/` |
| Sopa de letras | `/wordsearch` |
| Diario | `/diary` |
| Galeria | `/gallery` |
| Musica | `/music` |
| Juego | `/game` |
