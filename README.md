
# Verificador de Teléfonos vía Vonage (SMS y Verify)

Este proyecto es una API REST construida con Node.js que permite verificar números telefónicos mediante SMS o llamada usando **Vonage APIs**. 
Incluye validación, hash de códigos, protección contra abuso, seguridad con middlewares, logging avanzado y despliegue vía Docker.

---

## 📦 Requisitos

- Node.js v18+
- npm v9+
- Docker v20+
- Docker Compose v2+

---

## 🧩 Estructura del Proyecto

```
.
├── src/
│   ├── app.js
│   ├── controllers/
│   │   ├── smsController.js
│   │   └── verifyController.js
│   ├── helpers/
│   │   └── smsVerificationHelper.js
│   ├── services/
│   │   ├── vonageSmsService.js
│   │   └── vonageService.js
│   ├── models/
│   │   └── VerificationCode.js
│   ├── routes/
│   │   ├── smsRoutes.js
│   │   └── verifyRoutes.js
│   ├── utils/
│   │   ├── codeGenerator.js
│   │   ├── logger.js
│   │   ├── parseError.js
│   │   ├── phoneSanitizer.js
│   │   └── sendResponse.js
│   └── middlewares/
│       ├── authMiddleware.js
│       ├── corsMiddlewares.js
│       ├── rateLimitMiddleware.js
│       └── requestLoggerMiddleware.js
├── .dockerignore
├── .env.example
├── .gitignore
├── docker-compose.yml
├── Dockerfile
├── index.js
├── package.json
├── README.md
├── restart.sh
├── run.sh
├── scan.sh
└── stop.sh

```

---

## ⚙️ Configuración de Variables de Entorno

Copia `.env.example` a `.env` y personaliza:

```bash
cp .env.example .env
```

Campos importantes:

```env
PORT=5000
VONAGE_API_KEY=tu_clave
VONAGE_API_SECRET=tu_secreto
MONGO_URI=mongodb://mongo:27017/verifications
CORS_ORIGINS=https://tuapp.com,capacitor://localhost
BASIC_AUTH_USER=admin
BASIC_AUTH_PASS=admin123
```

---

## 🚀 Ejecución

### Con Node.js local

```bash
npm install
npm run dev
```

### Con Docker

```bash
docker compose up -d --build
```

---

## 🧪 Endpoints

### SMS personalizado

- `POST /api/sms/send-code` – Envía SMS con código personalizado
- `POST /api/sms/verify-code` – Verifica el código

### Vonage Verify API

- `POST /api/verify/start` – Inicia proceso de verificación con llamada/SMS
- `POST /api/verify/check` – Verifica el código enviado

---

## 📬 Ejemplos HTTP

### Enviar SMS (código propio)
```http
POST /api/sms/send-code
Authorization: Basic base64(user:pass)
Content-Type: application/json

{
  "phone": "5545062592"
}
```

### Verificar código
```http
POST /api/sms/verify-code

{
  "phone": "5545062592",
  "code": "123456"
}
```

### Usar Verify API
```http
POST /api/verify/start

{
  "phone": "5545062592"
}
```

---

## 🗂️ ¿Cómo consultar los logs?

Los logs se guardan en la carpeta `logs/` con rotación diaria.

```bash
cat logs/app-2025-07-01.log
```

También puedes verlos desde Docker:

```bash
docker logs -f vonage-verify
```

---

## 🛠️ ¿Cómo dar mantenimiento (VPS)?

```bash
# VPS
cd /ruta/al/repositorio
git pull origin main
docker compose down
docker compose up -d --build
```

---

## 🛡️ Seguridad

- Sanitización de números
- Hash de códigos con bcrypt
- Rate limiting por IP/teléfono
- Validación con zod
- Basic Auth por variables de entorno
- Mongo sin exponer al exterior
- Helmet + CORS configurado

---

## ✅ Recomendaciones

- No subas tu archivo `.env` a GitHub
- Cambia el puerto 5000 por uno interno como 7002
- Usa autenticación en tu servidor y en tu base de datos
- Restringe el acceso a la API por IP si es posible
- Usa dominios HTTPS con certificados Let’s Encrypt
- Revisa tus logs diariamente

---

## 👤 Autor

Marco Aspeitia – [@cideapps](https://github.com/cideapps)

---

## 📄 Licencia

[MIT License](LICENSE)
