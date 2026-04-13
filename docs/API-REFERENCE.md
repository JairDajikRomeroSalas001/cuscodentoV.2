# 📚 API Reference - KuskoDento

**Base URL:** `http://localhost:9002/api` (desarrollo) | `https://app.kuskodento.com/api` (producción)

**Authentication:** JWT en cookie HttpOnly `auth_token` + header `x-clinic-id`

---

## 🔐 Authentication Endpoints

### POST /api/auth/login
Inicia sesión y obtiene token JWT.

**Request:**
```json
{
  "email": "user@clinic.com",
  "password": "SecurePassword123!",
  "clinic_id": "clnXXXXXXXXXXXX"
}
```

**Response (200):**
```json
{
  "user": {
    "id": "user_id",
    "email": "user@clinic.com",
    "full_name": "Dr. Juan Pérez",
    "role": "doctor",
    "clinic_id": "clinic_id"
  },
  "clinic": {
    "id": "clinic_id",
    "name": "Demo Clinic",
    "domain": "demo.local",
    "subscription_status": "active"
  }
}
```

**Errors:**
- `401 Unauthorized`: Credenciales inválidas
- `400 Bad Request`: Validación fallida

---

### GET /api/auth/me
Obtiene información del usuario actual.

**Headers:**
- `Cookie: auth_token=<token>`

**Response (200):**
```json
{
  "user": { ... },
  "clinic": { ... }
}
```

**Errors:**
- `401 Unauthorized`: Token inválido o expirado

---

### POST /api/auth/logout
Cierra sesión del usuario.

**Headers:**
- `Cookie: auth_token=<token>`

**Response (200):**
```json
{
  "message": "logged out"
}
```

---

### POST /api/auth/refresh
Refresca el token JWT.

**Response (200):**
```json
{
  "refreshed": true
}
```

---

## 👥 Patients Endpoints

### GET /api/patients
Lista pacientes de la clínica actual.

**Query Parameters:**
- `page`: int (default: 1)
- `limit`: int (default: 20)
- `search`: string - busca por DNI o nombre

**Response (200):**
```json
{
  "items": [
    {
      "id": "patient_id",
      "dni": "12345678",
      "full_name": "Carlos López",
      "phone": "555-1234",
      "email": "carlos@example.com",
      "address": "Calle 123",
      "city": "Madrid",
      "gender": "M",
      "created_at": "2026-03-25T10:00:00Z"
    }
  ],
  "total": 45,
  "page": 1,
  "limit": 20
}
```

---

### POST /api/patients
Crea un nuevo paciente.

**Request:**
```json
{
  "dni": "12345678",
  "full_name": "Carlos López Martínez",
  "phone": "555-1234",
  "address": "Calle Principal 123",
  "email": "carlos@example.com",
  "city": "Madrid",
  "gender": "M"
}
```

**Response (201):**
```json
{
  "id": "patient_id",
  "dni": "12345678",
  "full_name": "Carlos López Martínez",
  ...
}
```

**Errors:**
- `400 Bad Request`: DNI duplicado o validación fallida
- `401 Unauthorized`: Sin autenticación

---

### GET /api/patients/[id]
Obtiene detalles de un paciente específico.

**Response (200):**
```json
{
  "id": "patient_id",
  "dni": "12345678",
  "full_name": "Carlos López",
  ...
}
```

**Errors:**
- `404 Not Found`: Paciente no existe

---

### PUT /api/patients/[id]
Actualiza información del paciente.

**Request:**
```json
{
  "phone": "555-9999",
  "address": "Nueva dirección"
}
```

**Response (200):** Paciente actualizado

---

## 📅 Appointments Endpoints

### GET /api/appointments
Lista citas de la clínica.

**Query Parameters:**
- `date`: YYYY-MM-DD (filtrar por fecha)
- `status`: scheduled|completed|cancelled
- `page`: int
- `limit`: int

**Response (200):**
```json
{
  "items": [
    {
      "id": "appointment_id",
      "patient": { "id": "...", "full_name": "..." },
      "doctor": { "id": "...", "full_name": "..." },
      "treatment": { "id": "...", "name": "..." },
      "date": "2026-03-25T09:00:00Z",
      "time": "09:00",
      "cost": 100,
      "status": "scheduled",
      "created_at": "2026-03-20T10:00:00Z"
    }
  ],
  "total": 15,
  "page": 1,
  "limit": 20
}
```

---

### POST /api/appointments
Crea una nueva cita.

**Request:**
```json
{
  "patient_id": "patient_id",
  "doctor_id": "doctor_id",
  "treatment_id": "treatment_id",
  "date": "2026-03-30",
  "time": "14:30",
  "cost": 100
}
```

**Response (201):** Cita creada

---

### GET /api/appointments/[id]
Obtiene detalles de una cita.

**Response (200):** Cita con relaciones completas

---

## 💊 Treatments Endpoints

### GET /api/treatments
Lista tratamientos disponibles.

**Response (200):**
```json
{
  "items": [
    {
      "id": "treatment_id",
      "name": "Limpieza dental",
      "price": 50,
      "created_at": "2026-03-20T10:00:00Z"
    }
  ]
}
```

---

## 💳 Payments Endpoints

### GET /api/payments
Lista pagos de la clínica.

**Query Parameters:**
- `patient_id`: Filtrar por paciente
- `status`: pending|paid

**Response (200):**
```json
{
  "items": [
    {
      "id": "payment_id",
      "patient_id": "patient_id",
      "appointment_id": "appointment_id",
      "amount": 100,
      "total_cost": 100,
      "total_paid": 50,
      "balance": 50,
      "payment_status": "pending",
      "created_at": "2026-03-25T10:00:00Z"
    }
  ]
}
```

---

### POST /api/payments
Crea un nuevo registro de pago.

**Request:**
```json
{
  "patient_id": "patient_id",
  "appointment_id": "appointment_id",
  "amount": 100,
  "payment_method": "cash",
  "notes": "Pago inicial"
}
```

**Response (201):** Pago creado

---

### GET /api/payments/[id]/history
Obtiene historial de abonos de un pago.

**Response (200):**
```json
{
  "items": [
    {
      "id": "history_id",
      "amount_paid": 50,
      "payment_date": "2026-03-25T11:00:00Z",
      "payment_method": "cash",
      "reference": "Abono parcial"
    }
  ],
  "payment": { ... }
}
```

---

### POST /api/payments/[id]/history
Registra un abono a un pago.

**Request:**
```json
{
  "amount_paid": 50,
  "payment_method": "card",
  "reference": "Ref: 123456"
}
```

**Response (200):** Abono registrado

---

## ✨ Health Check

### GET /api/health
Verifica estado del servidor y base de datos.

**Response (200):**
```json
{
  "status": "ok",
  "timestamp": "2026-03-25T21:04:41.935Z",
  "database": "connected"
}
```

---

## 🔒 Security Headers

Todas las respuestas incluyen:
```
Content-Security-Policy: default-src 'self'
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
X-XSS-Protection: 1; mode=block
```

---

## 📊 Response Format

**Success (2xx):**
```json
{
  "id": "...",
  "name": "...",
  ...
}
```

**Error (4xx/5xx):**
```json
{
  "error": "Mensaje de error descriptivo",
  "status": 400
}
```

---

## 🔄 Rate Limiting

- **Pagos:** Máx 10 por minuto por usuario, 100 por hora por clínica
- **Generales:** Máx 100 requests por minuto

Errores de rate limit retornan `429 Too Many Requests`

---

## 🎯 Notas Importantes

1. **Multi-tenancy:** Todos los requests validan `clinic_id` automáticamente
2. **Autenticación:** Token expira en 7 días
3. **Decimals:** Montos siempre en Decimal(10, 2)
4. **Timestamps:** Todos en ISO 8601 UTC
5. **CORS:** Configurado para dominio de clínica únicamente

---

**Última actualización:** 25 de marzo de 2026  
**Versión API:** 1.0  
**Status:** ✅ Production Ready
