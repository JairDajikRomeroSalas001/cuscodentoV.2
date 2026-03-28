# 📊 COMPARATIVA DE DECISIONES: Por Qué MySQL + Next.js API Routes

Documento que justifica cada decisión tomada en la arquitectura.

---

## 1️⃣ BASE DE DATOS: MySQL vs PostgreSQL vs MongoDB

### Comparativa Técnica

| Criterio | MySQL 8.0+ | PostgreSQL 14+ | MongoDB 6+ |
|----------|-----------|----------------|-----------|
| **ACID Transacciones** | ✅ Sí (InnoDB) | ✅ Excelente | ⚠️ Limitado |
| **Foreign Keys** | ✅ Sí | ✅ Sí | ❌ No |
| **Multitenant Seguridad** | ✅ Excelente (row-level) | ✅ Bueno | ❌ Débil |
| **Curva aprendizaje** | ✅ Baja | 🟡 Media | 🟡 Media |
| **Costo inicial** | ✅ $0-20/mes | 🟡 $10-50/mes | 🟡 $10-50/mes |
| **Escalabilidad** | 🟡 Buena hasta 100M rows | ✅ Excelente | ✅ Excelente |
| **JSON support** | ✅ Bueno | ✅ Excelente | ✅ Nativo |
| **Rate limiting integrado** | ❌ No | ❌ No | ⚠️ Débil |
| **Herramientas admin** | ✅ MySQL Workbench, Sequel | 🟡 pgAdmin | ✅ MongoDB Compass |
| **Community** | ✅ Enorme | ✅ Grande | ✅ Grande |

### Conclusión: **MYSQL ELEGIDA** ✅

**Razones:**
1. **Ultra rápido para empezar** - Menos configuración que PostgreSQL
2. **Multitenant nativo** - Aislamiento fila a fila más simple
3. **Hosting económico** - Muchas opciones baratas (PlanetScale $10, Supabase gratis)
4. **Para clínicas: suficiente** - No necesitas features avanzadas de PostgreSQL
5. **Migración futura a PostgreSQL viable** - Si creces, puedes migrar
6. **Transacciones ACID robustas** - El banco de datos de facto para pagos

**Riesgo:** Si escalas a 500M+ registros muy densos, PostgreSQL es mejor. **Pero:** Ese problema es "$$$-problem" (feliz de tener), se resuelve después.

---

## 2️⃣ ORM: Prisma vs TypeORM vs Raw SQL vs Sequelize

### Comparativa por Caso de Uso

| Criterio | Prisma | TypeORM | Sequelize | Raw SQL |
|----------|--------|---------|-----------|---------|
| **Typesafety** | ✅✅✅ Excelente | ✅ Muy bueno | 🟡 Requiere plugins | ❌ Manual |
| **Migraciones** | ✅ Fácil integrado | ✅ Muy bueno | ✅ Bueno | ❌ Manual |
| **DX (Developer Experience)** | ✅✅✅ Mejor | ✅ Muy bueno | 🟡 Verbose | ❌ Tedioso |
| **Performance** | ✅ Optimizado | ✅ Muy bueno | 🟡 Overhead | ✅ Mejor |
| **Curva aprendizaje** | ✅ Muy baja | 🟡 Media | 🟡 Media | ⚠️ Larga |
| **Transacciones** | ✅ Soporta bien | ✅ Excelente | ✅ Bueno | ✅ Total control |
| **Debugging** | ✅ Prisma Studio UI | 🟡 Logs | 🟡 Logs | ✅ SQL directo |
| **Comunidad Next.js** | ✅✅✅ Estándar | 🟡 Menos común | ❌ Raro | 🟡 Algunos |

### Conclusión: **PRISMA ELEGIDA** ✅

**Razones:**
1. **Best-in-class typesafety** - Zero runtime errors si compila TypeScript
2. **Migrations versionadas** - Git-friendly, reproducible, rollback fácil
3. **Prisma Studio** - UI visual para explorar datos in development
4. **DX increíble** - Autocompletion, inline docs, instant generation
5. **Estándar Next.js** - Used by 80% of Next.js projects
6. **Transacciones explícitas** - `prisma.$transaction(async (tx) => { ... })`

**Comparativa con Raw SQL:**
```typescript
// Prisma (Type-safe) ✅
const patients = await prisma.patient.findMany({
  where: { clinic_id: clinicId },
  include: { appointments: true }
});
// TypeScript sabe: patients[0].clinicId, appointments, etc.

// Raw SQL (Error-prone) ❌
const patients = await db.query(
  'SELECT * FROM patients WHERE clinic_id = ?',
  [clinicId]
);
// db.query retorna any[]... ¿qué campos tiene?
```

---

## 3️⃣ BACKEND: Next.js API Routes vs Express vs NestJS vs Hono

### Arquitectura de Decisión

```
¿Necesitas escalar a 1M+ requests/día?    → Express / NestJS
┌─ Sí:  Backend separado (monorepo)       → NestJS (enterprise-grade)
└─ No:  Next.js API Routes (monolitho)    → ✅ ELEGIDA

¿Necesitas inyección de dependencias?
└─ No: Next.js API Routes o Express
└─ Sí: NestJS

¿Necesitas un único codebase?
└─ Sí:  Next.js API Routes                 → ✅ ELEGIDA
└─ No:  Backend separado

¿Tienes 1 developer o 10+?
├─ 1-3:   Next.js (menos DevOps)           → ✅ ELEGIDA
└─ 10+:   NestJS (mejor DX a escala)
```

### Comparativa Técnica

| Aspecto | Next.js Routes | Express | NestJS | Hono |
|---------|----------------|---------|--------|------|
| **Setup time** | 0 min (ya tienes Next) | 10 min | 30 min | 10 min |
| **Typesafety** | ✅ TypeScript nativo | 🟡 Manual | ✅ Excelente | ✅ Bueno |
| **Routing** | ✅ Automático | 🟡 Manual | ✅ Decorators | ✅ Simple |
| **Middleware** | ✅ Web standards | ✅ Fácil | ✅ Integrado | ✅ Simple |
| **Auth** | 🟡 Manual | 🟡 Manual | ✓ Integrado | 🟡 Manual |
| **Testing** | ✅ Fácil | ✅ Fácil | ✅ Excelente | ✅ Fácil |
| **DevOps complexity** | ✅ Vercel 1-click | 🟡 Docker + PM2 | 🟡 Docker + Kubernetes | 🟡 Docker + PM2 |
| **Production scale** | 🟡 Bueno hasta 10k RPS | ✅ Excelente | ✅ Excelente | ✅ Muy rápido |
| **1 Codebase?** | ✅ Sí | ❌ No | ❌ No | ❌ No |

### Conclusión: **NEXT.JS API ROUTES ELEGIDA** ✅

**Razones:**
1. **Zero setup** - Ya tienes Next.js, solo agregar carpeta `/api`
2. **Menor DevOps** - Deploy a Vercel = 1 click
3. **Una sola codebase** - Maintainability
4. **Suficiente escalabilidad** - 10k+ RPS con Vercel Serverless
5. **Easy to migrate** - Si creces a NestJS, la lógica está en `services/`

**Cuándo cambiar a Express/NestJS:**
- Necesitas >100k RPS sostenido
- Requieres WebSockets nativos (real-time)
- Equipo > 10 devs (mejor structure con NestJS)

**Plan futuro:**
```
Ahora:        Express/NestJS como backend externo
              ← Cuando escalables a 100k RPS
              
Ahora:        Next.js API Routes (monolitic)
              ← (Actual, elegida)
```

---

## 4️⃣ MULTITENANT: Row-Level vs Database-per-Tenant vs Schema-per-Tenant

### Diagrama Conceptual

```
┌─────────────────────────────────────────────────────────┐
│                3 MODELOS MULTITENANT                     │
├─────────────────────────────────────────────────────────┤

1. ROW-LEVEL ISOLATION (ELEGIDA)
   ┌──────────────────────────┐
   │  SINGLE BD + clinic_id   │
   ├──────────────────────────┤
   │ clinic_id = "clinic1"    │
   │ clinic_id = "clinic2"    │
   │ clinic_id = "clinic3"    │
   └──────────────────────────┘
   Ventajas: Simple, cheap, fácil backup por tenant
   Riesgos:  Query bug → leak cross-tenant data

2. SCHEMA-PER-TENANT
   ┌──────────────────────────────────────────┐
   │  SINGLE DB, schemas separados            │
   ├──────────────────────────────────────────┤
   │ schema "clinic1": tables...               │
   │ schema "clinic2": tables...               │
   │ schema "clinic3": tables...               │
   └──────────────────────────────────────────┘
   Ventajas: Mejor aislamiento que row-level
   Riesgos:  Migraciones complejas, overhead

3. DATABASE-PER-TENANT
   ┌──────────────────────────────────────────┐
   │ clinic1.db    clinic2.db    clinic3.db   │
   ├──────────────────────────────────────────┤
   │ BaseDatos      BaseDatos      BaseDatos   │
   │ separadas      separadas      separadas   │
   └──────────────────────────────────────────┘
   Ventajas: Máxima seguridad, fácil scale-out
   Riesgos:  $$$ cost, complex operations, N connections
```

### Comparativa Detallada

| Métrica | Row-Level | Schema-per | DB-per |
|---------|-----------|-----------|--------|
| **Costo inicial** | 💰 $10 | 💰💰 $20 | 💰💰💰 $100+ |
| **Complejidad** | ⭐ Baja | ⭐⭐ Media | ⭐⭐⭐ Alta |
| **Aislamiento seguridad** | ✅ Bueno | ✅✅ Muy bueno | ✅✅✅ Excelente |
| **Migraciones** | ✅ Simple | 🟡 Complejo | ❌ Muy complejo |
| **Backup por tenant** | ✅ Easy | ✅ Easy | ✅ Native |
| **Riesgo query bug** | ⚠️ Alto | 🟡 Medio | ✅ Bajo |
| **Performance query** | ✅ Most fast | 🟡 Slightly slower | ✅ Fast |
| **Agregar clinic nueva** | ✅ 1 INSERT | 🟡 CREATE schema | ❌ Create DB + cert |

### Conclusión: **ROW-LEVEL ISOLATION ELEGIDA** ✅

**Razones:**
1. **Para clinicas: costo $$ importa** - No $100/mes por DB extra
2. **Migraciones simple** - Agregar clinic = INSERT fila
3. **Backup simple** - Un dump MySQL = todas las clinicas
4. **Risk mitigation:** Usar middleware para inyectar clinic_id en TODOS los queries
   ```typescript
   // ✅ Impossível olvidar clinic_id
   const patients = await prisma.patient.findMany({
     where: { clinic_id }, // Middleware lo adjunta
   });
   ```

**Mitigación de riesgos:**
- Middleware **obligatorio** en ALL /api routes
- Tests **explícitos** de multitenant aislamiento
- Code review **checklist** (clinic_id presente?)
- Audit logs **completos** (quién accedió qué)

**Migración futura:**
Si escalas a 1000+ clinicas y necesitas aislamiento geográfico:
- Switch a Schema-per-Tenant (viable después)
- O Database-per-Tenant (si escalabilidad demanda)

---

## 5️⃣ AUTENTICACIÓN: JWT vs Sessions vs OAuth

### Comparativa

| Aspecto | JWT (HttpOnly) | Session (Redis) | OAuth 2.0 |
|---------|-----------------|-----------------|-----------|
| **Seguridad** | ✅ Muy buena | ✅✅ Excelente | ✅ Depende Provider |
| **Stateless?** | ✅ Sí | ❌ No (requiere Redis) | ❌ Requiere provider |
| **Complejidad** | ✅ Simple | 🟡 Media (Redis) | ❌ Complejo (Oauth flow) |
| **Token revoke** | 🟡 Difícil | ✅ Inmediato | ✅ Bueno |
| **Performance** | ✅ Rápido | 🟡 Network Redis | 🟡 External call |
| **Para monolytic app?** | ✅ Ideal | ✅ Perfecta | 🟡 Overkill |
| **UX logout** | 🟡 Con refresh token | ✅ Inmediato | ✅ Inmediato |
| **Costo** | 💰 $0 | 💰 Redis $5/mes | 💰 Gratis (Google/GitHub) |

### Conclusión: **JWT + HTTPONLYCOOKIES ELEGIDA** ✅

**Razones:**
1. **Stateless** - No requires Redis en startup
2. **Secure by default** - HttpOnly + Secure + SameSite flags
3. **Escalable** - No need to share session store across servers
4. **Vercel-friendly** - Serverless = sin persistent connections

**Implementación detallada:**
```typescript
// 1. Login
const token = signJWT({ sub: userId, clinic_id, role });

// 2. Response con HttpOnly cookie
response.cookies.set("auth_token", token, {
  httpOnly: true,      // No accesible desde JS (XSS protection)
  secure: true,        // Solo HTTPS (MITM protection)
  sameSite: "lax",     // CSRF protection
  maxAge: 7*24*60*60,  // 7 días
});

// 3. Middleware valida en CADA request
const token = request.cookies.get("auth_token");
const payload = verifyJWT(token);
// Inject clinic_id, user_id en headers
```

**Con Refresh Token (bonus):**
```typescript
// Token corta duración = 1 hora (access token)
// Token larga duración = 7 días (refresh token)

// Si access token expira, cliente usa refresh token para obtener nuevo
POST /api/auth/refresh
  body: { refresh_token }
  response: { access_token, refresh_token (nuevo) }
```

---

## 6️⃣ API VALIDATION: Zod vs Joi vs Yup vs CLass-Validator

### Código Comparativo

```typescript
// Zod (ELEGIDA) ✅
const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

const data = LoginSchema.parse(input); // Throws si inválido
// typeof data === { email: string, password: string }

// Yup (alternativa)
const schema = yup.object({
  email: yup.string().email().required(),
  password: yup.string().min(8).required(),
});

// Joi (Enterprise)
const schema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(8).required(),
});

// Class-Validator (OOP)
class LoginDTO {
  @IsEmail() email: string;
  @MinLength(8) password: string;
}
```

### Conclusión: **ZOD ELEGIDA** ✅

**Razones:**
1. **TypeScript-first** - Inferencia automática de tipos
2. **Smallest bundle** - Solo Zod, sin dependencias
3. **Composable** - `.extend()`, reutilizar schemas
4. **Best errors** - Mensajes claros qué falló
5. **Trend** - Estándar en Next.js 2024+

```typescript
// El poder de Zod:
const CreatePatientSchema = z.object({
  dni: z.string().min(5),
  email: z.string().email().optional(),
  phone: z.string(),
});

// Reutilizar (DRY):
const UpdatePatientSchema = CreatePatientSchema.partial();

// Extraer tipo automático:
type CreatePatient = z.infer<typeof CreatePatientSchema>;
```

---

## 7️⃣ FRONTEND STATE MANAGEMENT: useApi Hook vs Zustand vs TanStack Query

### Comparativa

| Caso | Solución | Razón |
|------|----------|-------|
| **Fetch + cache simple** | `useApi()` hook custom | Conocido, minimal |
| **Complex async state** | TanStack Query | Caching inteligente |
| **Global state (user, theme)** | React Context | Builtin, no deps |
| **Heavy state computations** | Zustand | Lightweight + fast |

### Conclusión: **HOOK CUSTOM + React Context ELEGIDA** ✅

**Razones:**
1. **Empezar simple** - `useApi()` hook cubre 80% de casos
2. **Menos dependencias** - Cada dep es $$
3. **Fácil evolucionar** - → TanStack Query después si necesita
4. **DevDX** - Conocemosotros, no black-magic

```typescript
// Nuestro hook (simple, clara)
const { data, loading, error } = useApi('/api/patients');

// vs TanStack Query (overkill para este proyecto)
const { data, isLoading, error } = useQuery({
  queryKey: ['patients'],
  queryFn: () => fetch('/api/patients'),
});
```

---

## 🎯 RESUMEN: La Pila Elegida

```
┌─────────────────────────────────────────────────────────┐
│            TECH STACK FINAL KUSKO DENTO                 │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  FRONTEND                BACKEND         DATABASE        │
│  ─────────                ─────────      ────────        │
│  Next.js 15      →    Next.js API    →   MySQL 8.0+   │
│  React 19                Routes            InnoDB        │
│  TypeScript               Node 20      Prisma ORM        │
│  Tailwind CSS        JWT + HttpOnly       13 tables      │
│  Radix UI           Zod Validation        multitenant    │
│                     services/             row-level      │
│                     middleware                           │
│                                                          │
│  HOSTING                 CI/CD        MONITORING        │
│  ──────────              ─────        ──────────        │
│  Vercel           →   GitHub Actions   Datadog          │
│  (Next.js native)      (push → deploy)  (alerts)        │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

---

## 💰 COSTO ESTIMADO MENSUAL

| Componente | Precio | Notas |
|-----------|--------|-------|
| **Vercel (Next.js)** | $0-20 | Muy generoso free tier |
| **MySQL (PlanetScale)** | $10-50 | Gratis tier suficiente para startup |
| **Supabase (alt)** | $0-25 | PostgreSQL pero gratis para MySQL compat |
| **S3 (Radiografías)** | $1-5 | Muy barato, escalable |
| **Datadog (monitoring)** | $0-15 | Free tier + pay as you go |
| **GitHub (repo)** | $0 | Gratis (private unlimited) |
| **CloudFlare (DNS)** | $0 | Gratis (DNS + edge) |

**TOTAL:** $11-100/mes dependiendo escala.

Para 100 clinicas activas: ~$50/mes (ultra económico).

---

## ✅ CHECKLIST: Decisiones Confirmadas

Antes de empezar, confirma:

```
Backend API
☐ Usar Next.js API Routes (no Express separado)
☐ Usar servicio/domain-driven structure
☐ Usar middleware para multitenant enforcement

Database
☐ Usar MySQL 8.0+ con InnoDB
☐ Usar Prisma ORM (no raw SQL)
☐ Usar Row-level isolation con clinic_id obligatorio

Authentication
☐ Usar JWT + HttpOnly cookies
☐ Usar Zod para validación inputs
☐ Implementar refresh tokens

Frontend
☐ Usar custom useApi() hook
☐ Usar React Context para estado global
☐ Usar Tailwind + Radix UI (ya tienes)

Deployment
☐ Deploy a Vercel (1-click)
☐ MySQLhosting en PlanetScale o Supabase
☐ Environment secrets en Vercel UI (no .env.local)

Monitoring
☐ Configurar Datadog alerts
☐ Configurar logs de error
☐ Healthcheck endpoint: GET /api/health
```

---

**Documento actualizado:** 24 de marzo de 2026  
**Estado:** Decisiones finalizadas y justificadas  
**Próximo paso:** Iniciar Fase 0 con confianza
