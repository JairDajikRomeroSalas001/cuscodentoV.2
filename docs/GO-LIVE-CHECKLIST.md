# ✅ GO-LIVE CHECKLIST - KuskoDento

**Fecha Planeada:** 26 de marzo de 2026  
**Responsable:** DevOps/Tech Lead  
**Duración:** ~2-3 horas

---

## 📋 PRE-LAUNCH (24 horas antes)

### Code & Build
- [ ] Todos los tests pasando: `npm run test:smoke`
- [ ] TypeCheck limpio: `npm run typecheck`
- [ ] Build exitoso: `npm run build`
- [ ] Lint warnings resueltos: `npm run lint`
- [ ] Dependencias actualizadas: `npm audit fix`
- [ ] No hay console.error en producción
- [ ] Variables env configuradas (no hardcoded)

### Database
- [ ] Migraciones Prisma aplicadas: `npx prisma migrate deploy`
- [ ] Backup de producción realizado y testeado
- [ ] Script de restore verificado
- [ ] Índices de performance en:
  - [ ] clinic_id en todas las tablas
  - [ ] created_at en pagos/citas
  - [ ] status en pagos/citas
  - [ ] email en usuarios

### Documentación
- [ ] API Reference actualizada ([docs/API-REFERENCE.md](../docs/API-REFERENCE.md))
- [ ] Architecture diagrams actualizados
- [ ] Runbook de incidentes documentado
- [ ] Credentials guardadas en vault (NO en git)
- [ ] Endpoints críticos documentados

### Testing Completo
- [ ] ✅ Smoke tests pasando
  ```bash
  npm run test:smoke
  ```
- [ ] Auth:
  - [ ] Login exitoso
  - [ ] Logout exitoso
  - [ ] Token refresh funciona
  - [ ] Credenciales inválidas rechazan
  - [ ] Cambio de clínica no permite acceso cruzado

- [ ] Patients:
  - [ ] Crear paciente
  - [ ] Editar paciente
  - [ ] Buscar paciente
  - [ ] DNI único por clínica

- [ ] Appointments:
  - [ ] Crear cita
  - [ ] Cambiar status
  - [ ] Eliminar cita

- [ ] Payments:
  - [ ] Crear pago
  - [ ] Registrar abono
  - [ ] Historial visible
  - [ ] Balance actualizado

- [ ] Multi-tenant:
  - [ ] Clínica A NO ve pacientes de Clínica B
  - [ ] Clínica B NO ve pagos de Clínica A
  - [ ] Filtros clinic_id funcionan en todas queries

### Monitoring & Logging
- [ ] Error tracking configurado (Sentry/similar)
- [ ] Logs centralizados configurados
- [ ] Alertas para errores 500+ configuradas
- [ ] Dashboard de métricas visible
- [ ] Response times monitoreados

### Performance
- [ ] API response time < 200ms (p95)
- [ ] GET /api/patients < 100ms
- [ ] POST /api/payments < 150ms
- [ ] Carga de 10 usuarios simultáneos sin timeouts

### Security
- [ ] HTTPS habilitado en producción
- [ ] JWT_SECRET rotado (no default)
- [ ] Database password rotado
- [ ] CORS configurado correctamente
- [ ] Rate limiting activo
- [ ] SQL injection checks pasados
- [ ] XSS prevention validado

---

## 🚀 LAUNCH DAY (2-3 horas)

### T-30 minutos
- [ ] Equipo reunido en Slack/Teams
- [ ] Logs abiertos en terminal
- [ ] Backup reciente realizado
- [ ] Rollback plan confirmado por todos
- [ ] Responsable de rollback identificado

### T-0 (Go-live)
- [ ] DNS apunta a nuevo servidor
- [ ] Load balancer actualizado (si aplica)
- [ ] Smoke tests pasando en producción:
  ```bash
  npm run test:smoke -- --env production
  ```

### T+15 minutos
- [ ] Login de admin funciona
- [ ] Dashboard carga sin errores
- [ ] Pacientes se cargan correctamente
- [ ] Crear paciente funciona
- [ ] Monitoreo de errores limpio

### T+45 minutos
- [ ] Usuarios reales probando
- [ ] Sin errores 500
- [ ] Response times normales
- [ ] Database queries optimizadas

### T+2 horas
- [ ] 100% del tráfico en producción
- [ ] KPIs dentro de rango:
  - [ ] Error rate < 0.1%
  - [ ] P95 latency < 200ms
  - [ ] Uptime 99.9%

---

## 📊 POST-LAUNCH (próximas 24 horas)

### Monitoring
- [ ] Monitoreo activado
- [ ] Alertas funcionando
- [ ] On-call engineers alertas reciben

### User Feedback
- [ ] Reportes de bugs revisados
- [ ] Performance feedback recopilado
- [ ] Issues críticos identificados

### Documentation
- [ ] Postmortem starter (si hubo issues)
- [ ] Lecciones aprendidas documentadas
- [ ] Runbook actualizado

### Rollback Plan
- [ ] README con instrucciones de rollback
- [ ] Código de rollback testeado
- [ ] Resposable de rollback en standby

---

## 🔄 ROLLBACK PROCEDURE (si es necesario)

### Decisión de Rollback
- [ ] Criterio: Más de 1% de error rate
- [ ] Criterio: P95 latency > 500ms
- [ ] Criterio: Database corrupted
- [ ] Criterio: Security breach

### Ejecutar Rollback
```bash
# 1. Detener nuevas requests
./scripts/disable-traffic.sh

# 2. Restaurar base de datos
gunzip backups/backup_TIMESTAMP.sql.gz
mysql -u kusko_user -p kusko_dento_prod < backups/backup_TIMESTAMP.sql

# 3. Revertir código
git checkout v1.0-deployable
npm ci
npm run build

# 4. Reiniciar servicios
systemctl restart kuskodento

# 5. Re-habilitar tráfico
./scripts/enable-traffic.sh

# 6. Verificar health
curl https://app.kuskodento.com/api/health
```

**Tiempo esperado de rollback:** < 15 minutos

---

## 📞 EMERGENCY CONTACTS

| Rol | Nombre | Teléfono | Slack |
|-----|--------|----------|-------|
| Tech Lead | [Nombre] | [Tel] | @tech-lead |
| DevOps | [Nombre] | [Tel] | @devops |
| Database | [Nombre] | [Tel] | @dba |
| On-Call | [Nombre] | [Tel] | @oncall |

---

## 📝 Sign-Off

- [ ] **Tech Lead:** ___________________  Fecha: ___________
- [ ] **Product Manager:** ___________________  Fecha: ___________
- [ ] **DevOps/SRE:** ___________________  Fecha: ___________
- [ ] **CEO/Stakeholder:** ___________________  Fecha: ___________

---

## 📊 LAUNCH METRICS

Completar después del launch:

| Métrica | Target | Actual | Status |
|---------|--------|--------|--------|
| Uptime (24h) | 99.9% | ___ | ☐ |
| Error Rate | < 0.1% | ___ | ☐ |
| P95 Latency | < 200ms | ___ | ☐ |
| Active Users | 10+ | ___ | ☐ |
| Bugs Críticos | 0 | ___ | ☐ |

---

**Última actualización:** 25 de marzo de 2026  
**Versión:** 1.0  
**Status:** Ready for Launch ✅
