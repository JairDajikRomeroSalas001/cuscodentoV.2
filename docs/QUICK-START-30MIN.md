# 🚀 GUÍA RÁPIDA: Primeros Pasos en 30 Minutos

Sigue esta guía si quieres **empezar YA la Fase 0** sin leer documentación larga.

---

## Prerequisitos (5 minutos)

Verifica que tienes:
```bash
# Node.js 18+
node --version

# npm
npm --version

# Git
git --version
```

Si falta algo, instala desde [nodejs.org](https://nodejs.org).

---

## Paso 1: Instalar Dependencias (5 minutos)

En la terminal, desde tu carpeta del proyecto:

```bash
cd "d:\Asistencia program\KuskoDentoV.2"

npm install \
  @prisma/client \
  prisma \
  bcryptjs \
  jsonwebtoken \
  zod \
  redis
```

Espera a que termine (puede tardar 2-3 minutos).

---

## Paso 2: Set Up Base de Datos MySQL (5 minutos)

### Opción A: Local (si tienes MySQL instalado)

```bash
# Conectar a MySQL
mysql -u root -p

# Crear base de datos
CREATE DATABASE kusko_dento_prod;
CREATE USER 'kusko_user'@'localhost' IDENTIFIED BY 'StrongPassword123!';
GRANT ALL PRIVILEGES ON kusko_dento_prod.* TO 'kusko_user'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

### Opción B: Cloud GRATIS (recomendado para empezar)

1. Ir a [PlanetScale.com](https://planetscale.com) o [Supabase.com](https://supabase.com)
2. Crear cuenta gratis
3. Crear nueva base de datos `kusko_dento_prod`
4. Copiar credenciales (URL de conexión)

---

## Paso 3: Configurar Prisma (5 minutos)

```bash
# Inicializar Prisma
npx prisma init

# Esto crea:
# - prisma/schema.prisma
# - .env.local
```

### Edita `.env.local`

Reemplaza todo el contenido con:

```env
DATABASE_URL="mysql://kusko_user:StrongPassword123!@localhost:3306/kusko_dento_prod"
NEXTAUTH_SECRET="generated-secret-key-here"
JWT_SECRET="generated-jwt-secret-here"
API_BASE_URL="http://localhost:3000"
NODE_ENV="development"
```

**Si usas PlanetScale/Supabase**, reemplaza `DATABASE_URL` con la que te dieron.

### Edita `prisma/schema.prisma`

Borra todo y copia el contenido de [ANALISIS-ARQUITECTURA-MULTITENANT-MYSQL.md](ANALISIS-ARQUITECTURA-MULTITENANT-MYSQL.md) (busca la sección "SQL Schema (Prisma Schema Language)").

---

## Paso 4: Crear Base de Datos (5 minutos)

```bash
# Generatesecrets
npx prisma generate

# Crear migraciones
npx prisma migrate dev --name init

# Te pedirá nombre para la migración, responde:
# "init"
```

Espera a que termine. Deberías ver:

```
✓ Generated Prisma Client
✓ Created migration in ./prisma/migrations/[timestamp]_init
```

---

## Paso 5: Validar (5 minutos)

```bash
# Abrir Studio (UI visual de BD)
npx prisma studio

# Esto abre en http://localhost:5555
# Deberías ver todas tus tablas (Clinic, User, Patient, etc.)

# Si ves las tablas = ¡FUNCIONA! ✅
```

En terminal separada:

```bash
# Compilar
npm run build

# Validar tipos
npm run typecheck
```

Ambos deberían terminar sin errores.

---

## 🎉 Fase 0 Completada!

Acabas de:
- ✅ Instalar dependencias
- ✅ Crear base de datos MySQL
- ✅ Configurar Prisma ORM
- ✅ Crear tablas multitenant
- ✅ Validar que todo compila

---

## 🔄 Próximo Paso: Fase 1

Ahora implementa el backend API. Ver: [ANALISIS-ARQUITECTURA-MULTITENANT-MYSQL.md#fase-1](ANALISIS-ARQUITECTURA-MULTITENANT-MYSQL.md#fase-1)

### Resumen Fase 1 (que harás después):
1. Crear `src/services/auth.service.ts`
2. Crear `src/app/api/auth/login/route.ts`
3. Crear middleware de autenticación
4. Testar endpoints con Postman

---

## 🆘 Si Hay Problemas

### "DATABASE_URL inválida"
```bash
# Verifica credenciales
mysql -u kusko_user -p -h localhost
# Ingresa password: StrongPassword123!
# Si funciona: ✅
```

### "Prisma genera pero tipo de BD incompatibles"
```bash
# Asegúrate que DATABASE_URL comience con "mysql://"
# NO "postgresql://"
cat .env.local | grep DATABASE_URL
```

### "npm install muy lento"
```bash
# Usa npm caché
npm cache clean --force
npm install
```

### "Puerto 5555 en uso (Prisma Studio)"
```bash
# Usa otro puerto
npx prisma studio --port 5556
```

---

## 📚 Recursos

- [Docs de Prisma](https://www.prisma.io/docs)
- [Instalación MySQL](https://dev.mysql.com/doc/mysql-installation-excerpt/en/)
- [PlanetScale Docs](https://planetscale.com/docs)

---

**Tiempo estimado: 30-45 minutos**  
**Próximo hito:** Acabada Fase 1 en ~2 semanas
