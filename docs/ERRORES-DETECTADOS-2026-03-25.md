# Reporte de Errores Detectados

Fecha: 25-03-2026
Proyecto: KuskoDentoV.2

## Resumen Ejecutivo

- Estado general inicial (25-03-2026): NO APTO para salida a produccion.
- Estado final (26-03-2026): APTO para salida a produccion controlada.
- TypeScript typecheck: OK (0 errores).
- Smoke tests API: OK (12/12).
- Health endpoint local: OK (200 + JSON valido).

## Evidencia Generada

- Log de typecheck: docs/errores/typecheck.txt
- Log de smoke tests: docs/errores/smoke-tests.txt
- Log de health endpoint: docs/errores/health.txt

## 1) Errores de TypeScript (npm run typecheck)

Comando ejecutado:
- npm run typecheck

Resultado:
- Exit code: 1
- Errores detectados: multiples en modulos admin/legacy y pantallas clinicas.

Listado completo de errores reportados por tsc:

- src/app/admin/billing/page.tsx(71,11): error TS2741: Property 'status' is missing in type '{ id: string; clinicId: string | undefined; clinicName: string; amount: number; date: string; concept: string; processedByAdminId: string | undefined; }' but required in type 'SubscriptionPayment'.
- src/app/admin/billing/page.tsx(81,43): error TS2554: Expected 1 arguments, but got 2.
- src/app/admin/billing/page.tsx(88,27): error TS2554: Expected 1 arguments, but got 2.
- src/app/admin/billing/page.tsx(103,27): error TS2554: Expected 1 arguments, but got 2.
- src/app/admin/billing/page.tsx(223,176): error TS2345: Argument of type 'string | undefined' is not assignable to parameter of type 'string'.
- src/app/admin/billing/page.tsx(227,174): error TS2345: Argument of type 'string | undefined' is not assignable to parameter of type 'string'.
- src/app/admin/billing/page.tsx(232,168): error TS2345: Argument of type 'string | undefined' is not assignable to parameter of type 'string'.
- src/app/admin/users/page.tsx(135,7): error TS2353: Object literal may only specify known properties, and 'address' does not exist in type 'User'.
- src/app/admin/users/page.tsx(149,27): error TS2554: Expected 1 arguments, but got 2.
- src/app/admin/users/page.tsx(155,45): error TS2554: Expected 1 arguments, but got 2.
- src/app/admin/users/page.tsx(201,18): error TS2345: Argument of type 'string | undefined' is not assignable to parameter of type 'SetStateAction<string | null>'.
- src/app/admin/users/page.tsx(207,18): error TS2339: Property 'address' does not exist on type 'User'.
- src/app/admin/users/page.tsx(208,22): error TS2339: Property 'colegiatura' does not exist on type 'User'.
- src/app/admin/users/page.tsx(215,7): error TS2322: Type '"active" | "suspended" | "blocked" | undefined' is not assignable to type '"active" | "suspended" | "blocked"'.
- src/app/admin/users/page.tsx(217,23): error TS2339: Property 'photo' does not exist on type 'User'.
- src/app/admin/users/page.tsx(443,40): error TS2339: Property 'photo' does not exist on type 'User'.
- src/app/admin/users/page.tsx(484,144): error TS2339: Property 'address' does not exist on type 'User'.
- src/app/admin/users/page.tsx(485,24): error TS2339: Property 'colegiatura' does not exist on type 'User'.
- src/app/admin/users/page.tsx(485,151): error TS2339: Property 'colegiatura' does not exist on type 'User'.
- src/app/admin/users/page.tsx(491,84): error TS2345: Argument of type 'string | undefined' is not assignable to parameter of type 'string'.
- src/app/backups/page.tsx(57,29): error TS2339: Property 'exportData' does not exist on type '{ getAll<T = unknown>(table: string): Promise<T[]>; getAllUsers(): Promise<User[]>; getAllPatients(): Promise<Patient[]>; getAllAppointments(): Promise<...>; getAllPayments(): Promise<...>; put: (data: unknown) => Promise<...>; delete: (table: string, id: string) => Promise<...>; }'.
- src/app/backups/page.tsx(79,18): error TS2339: Property 'importData' does not exist on type '{ getAll<T = unknown>(table: string): Promise<T[]>; getAllUsers(): Promise<User[]>; getAllPatients(): Promise<Patient[]>; getAllAppointments(): Promise<...>; getAllPayments(): Promise<...>; put: (data: unknown) => Promise<...>; delete: (table: string, id: string) => Promise<...>; }'.
- src/app/inventory/page.tsx(55,7): error TS2353: Object literal may only specify known properties, and 'category' does not exist in type 'InventoryItem'.
- src/app/inventory/page.tsx(63,31): error TS2554: Expected 1 arguments, but got 2.
- src/app/inventory/page.tsx(85,22): error TS2339: Property 'category' does not exist on type 'InventoryItem'.
- src/app/inventory/page.tsx(87,20): error TS18048: 'item.minQuantity' is possibly 'undefined'.
- src/app/inventory/page.tsx(88,18): error TS2339: Property 'unit' does not exist on type 'InventoryItem'.
- src/app/inventory/page.tsx(103,7): error TS2339: Property 'category' does not exist on type 'InventoryItem'.
- src/app/inventory/page.tsx(198,97): error TS18048: 'i.minQuantity' is possibly 'undefined'.
- src/app/inventory/page.tsx(236,55): error TS18048: 'item.minQuantity' is possibly 'undefined'.
- src/app/inventory/page.tsx(241,124): error TS2339: Property 'lastUpdated' does not exist on type 'InventoryItem'.
- src/app/inventory/page.tsx(244,102): error TS2339: Property 'category' does not exist on type 'InventoryItem'.
- src/app/inventory/page.tsx(250,84): error TS2339: Property 'unit' does not exist on type 'InventoryItem'.
- src/app/inventory/page.tsx(268,144): error TS2345: Argument of type 'string | undefined' is not assignable to parameter of type 'string'.
- src/app/patients/[id]/odontogram/page.tsx(123,26): error TS2339: Property 'getById' does not exist on type '{ getAll<T = unknown>(table: string): Promise<T[]>; getAllUsers(): Promise<User[]>; getAllPatients(): Promise<Patient[]>; getAllAppointments(): Promise<...>; getAllPayments(): Promise<...>; put: (data: unknown) => Promise<...>; delete: (table: string, id: string) => Promise<...>; }'.
- src/app/patients/[id]/odontogram/page.tsx(127,96): error TS2339: Property 'date' does not exist on type 'Odontogram'.
- src/app/patients/[id]/odontogram/page.tsx(127,125): error TS2339: Property 'date' does not exist on type 'Odontogram'.
- src/app/patients/[id]/odontogram/page.tsx(129,44): error TS2339: Property 'data' does not exist on type 'Odontogram'.
- src/app/patients/[id]/odontogram/page.tsx(130,45): error TS2339: Property 'diagnostic' does not exist on type 'Odontogram'.
- src/app/patients/[id]/odontogram/page.tsx(153,7): error TS2353: Object literal may only specify known properties, and 'data' does not exist in type 'Odontogram'.
- src/app/patients/[id]/odontogram/page.tsx(157,33): error TS2554: Expected 1 arguments, but got 2.
- src/app/patients/[id]/page.tsx(34,24): error TS2339: Property 'getById' does not exist on type '{ getAll<T = unknown>(table: string): Promise<T[]>; getAllUsers(): Promise<User[]>; getAllPatients(): Promise<Patient[]>; getAllAppointments(): Promise<...>; getAllPayments(): Promise<...>; put: (data: unknown) => Promise<...>; delete: (table: string, id: string) => Promise<...>; }'.
- src/app/patients/[id]/page.tsx(39,99): error TS2339: Property 'date' does not exist on type 'Payment'.
- src/app/patients/[id]/page.tsx(39,128): error TS2339: Property 'date' does not exist on type 'Payment'.
- src/app/patients/[id]/page.tsx(42,93): error TS2339: Property 'date' does not exist on type 'Radiograph'.
- src/app/patients/[id]/page.tsx(42,122): error TS2339: Property 'date' does not exist on type 'Radiograph'.
- src/app/patients/[id]/page.tsx(51,93): error TS2339: Property 'date' does not exist on type 'Odontogram'.
- src/app/patients/[id]/page.tsx(51,122): error TS2339: Property 'date' does not exist on type 'Odontogram'.
- src/app/patients/[id]/page.tsx(68,25): error TS2554: Expected 1 arguments, but got 2.
- src/app/patients/[id]/page.tsx(110,92): error TS2339: Property 'registrationDate' does not exist on type 'Patient'.
- src/app/patients/[id]/page.tsx(153,68): error TS2339: Property 'attendedBy' does not exist on type 'Patient'.
- src/app/patients/[id]/page.tsx(162,95): error TS2339: Property 'underTreatment' does not exist on type 'Patient'.
- src/app/patients/[id]/page.tsx(164,53): error TS2339: Property 'underTreatment' does not exist on type 'Patient'.
- src/app/patients/[id]/page.tsx(164,108): error TS2339: Property 'underTreatment' does not exist on type 'Patient'.
- src/app/patients/[id]/page.tsx(166,95): error TS2339: Property 'proneToBleeding' does not exist on type 'Patient'.
- src/app/patients/[id]/page.tsx(168,53): error TS2339: Property 'proneToBleeding' does not exist on type 'Patient'.
- src/app/patients/[id]/page.tsx(168,109): error TS2339: Property 'proneToBleeding' does not exist on type 'Patient'.
- src/app/patients/[id]/page.tsx(170,95): error TS2339: Property 'allergicToMeds' does not exist on type 'Patient'.
- src/app/patients/[id]/page.tsx(172,53): error TS2339: Property 'allergicToMeds' does not exist on type 'Patient'.
- src/app/patients/[id]/page.tsx(172,108): error TS2339: Property 'allergicToMeds' does not exist on type 'Patient'.
- src/app/patients/[id]/page.tsx(179,72): error TS2339: Property 'consultationReason' does not exist on type 'Patient'.
- src/app/patients/[id]/page.tsx(183,60): error TS2339: Property 'diagnostic' does not exist on type 'Patient'.
- src/app/patients/[id]/page.tsx(210,161): error TS2339: Property 'fileBlob' does not exist on type 'Radiograph'.
- src/app/patients/[id]/page.tsx(210,173): error TS2339: Property 'fileType' does not exist on type 'Radiograph'.
- src/app/patients/[id]/page.tsx(212,56): error TS2339: Property 'fileBlob' does not exist on type 'Radiograph'.
- src/app/patients/[id]/page.tsx(214,36): error TS2339: Property 'fileName' does not exist on type 'Radiograph'.
- src/app/patients/[id]/page.tsx(222,86): error TS2339: Property 'fileName' does not exist on type 'Radiograph'.
- src/app/patients/[id]/page.tsx(223,78): error TS2339: Property 'date' does not exist on type 'Radiograph'.
- src/app/patients/[id]/page.tsx(226,116): error TS2339: Property 'fileBlob' does not exist on type 'Radiograph'.
- src/app/patients/[id]/page.tsx(226,128): error TS2339: Property 'fileName' does not exist on type 'Radiograph'.
- src/app/patients/[id]/page.tsx(259,32): error TS2339: Property 'fileType' does not exist on type 'Consent'.
- src/app/patients/[id]/page.tsx(262,89): error TS2339: Property 'fileName' does not exist on type 'Consent'.
- src/app/patients/[id]/page.tsx(267,90): error TS2339: Property 'fileBlob' does not exist on type 'Consent'.
- src/app/patients/[id]/page.tsx(267,102): error TS2339: Property 'fileType' does not exist on type 'Consent'.
- src/app/patients/[id]/page.tsx(293,77): error TS2339: Property 'date' does not exist on type 'Odontogram'.
- src/app/patients/[id]/page.tsx(298,102): error TS2339: Property 'diagnostic' does not exist on type 'Odontogram'.
- src/app/patients/[id]/page.tsx(333,72): error TS2339: Property 'date' does not exist on type 'Payment'.
- src/app/patients/[id]/page.tsx(335,44): error TS2339: Property 'totalCost' does not exist on type 'Payment'.
- src/app/patients/[id]/page.tsx(345,33): error TS2339: Property 'history' does not exist on type 'Payment'.
- src/app/patients/[id]/page.tsx(345,46): error TS2339: Property 'history' does not exist on type 'Payment'.
- src/app/patients/[id]/page.tsx(345,69): error TS2339: Property 'history' does not exist on type 'Payment'.
- src/app/patients/[id]/page.tsx(345,82): error TS7006: Parameter 'h' implicitly has an 'any' type.
- src/app/patients/[id]/page.tsx(345,85): error TS7006: Parameter 'i' implicitly has an 'any' type.
- src/app/patients/[id]/page.tsx(352,43): error TS2339: Property 'date' does not exist on type 'Payment'.
- src/app/patients/[id]/page.tsx(386,68): error TS2339: Property 'observations' does not exist on type 'Appointment'.
- src/app/profile/page.tsx(37,72): error TS2322: Type '"bank"' is not assignable to type '"cash" | "card" | "check" | "transfer" | undefined'.
- src/app/profile/page.tsx(104,7): error TS2322: Type '"bank" | "qr"' is not assignable to type '"cash" | "card" | "check" | "transfer"'.
- src/app/profile/page.tsx(105,24): error TS2339: Property 'label' does not exist on type 'Partial<PaymentMethod>'.
- src/app/profile/page.tsx(106,24): error TS2339: Property 'value' does not exist on type 'Partial<PaymentMethod>'.
- src/app/profile/page.tsx(107,26): error TS2339: Property 'qrImage' does not exist on type 'Partial<PaymentMethod>'.
- src/app/profile/page.tsx(109,37): error TS2554: Expected 1 arguments, but got 2.
- src/app/profile/page.tsx(111,20): error TS2322: Type '"bank"' is not assignable to type '"cash" | "card" | "check" | "transfer" | undefined'.
- src/app/profile/page.tsx(299,125): error TS2339: Property 'label' does not exist on type 'PaymentMethod'.
- src/app/profile/page.tsx(300,123): error TS2339: Property 'value' does not exist on type 'PaymentMethod'.
- src/app/profile/page.tsx(303,91): error TS2345: Argument of type 'string | undefined' is not assignable to parameter of type 'string'.
- src/app/profile/page.tsx(328,152): error TS2339: Property 'label' does not exist on type 'Partial<PaymentMethod>'.
- src/app/profile/page.tsx(328,202): error TS2353: Object literal may only specify known properties, and 'label' does not exist in type 'SetStateAction<Partial<PaymentMethod>>'.
- src/app/profile/page.tsx(329,150): error TS2339: Property 'value' does not exist on type 'Partial<PaymentMethod>'.
- src/app/profile/page.tsx(329,200): error TS2353: Object literal may only specify known properties, and 'value' does not exist in type 'SetStateAction<Partial<PaymentMethod>>'.
- src/app/profile/page.tsx(330,16): error TS2367: This comparison appears to be unintentional because the types '"cash" | "card" | "check" | "transfer" | undefined' and '"qr"' have no overlap.
- src/app/treatments/page.tsx(46,32): error TS2554: Expected 1 arguments, but got 2.
- src/app/treatments/page.tsx(111,83): error TS2345: Argument of type 'string | undefined' is not assignable to parameter of type 'string'.

## 2) Errores de Smoke Tests (npm run test:smoke)

Comando ejecutado:
- npm run test:smoke

Resultado:
- Exit code: 1
- 11 de 11 pruebas fallidas

Errores reportados:

- GET /api/health: Unexpected token 'I', "Internal S"... is not valid JSON
- POST /api/auth/login (valid): Unexpected token 'I', "Internal S"... is not valid JSON
- POST /api/auth/login (invalid): Unexpected token 'I', "Internal S"... is not valid JSON
- GET /api/auth/me (no auth): Unexpected token 'I', "Internal S"... is not valid JSON
- GET /api/patients (no auth): Unexpected token 'I', "Internal S"... is not valid JSON
- GET /api/patients (valid): Unexpected token 'I', "Internal S"... is not valid JSON
- POST /api/patients (create): Unexpected token 'I', "Internal S"... is not valid JSON
- GET /api/treatments: Unexpected token 'I', "Internal S"... is not valid JSON
- GET /api/payments: Unexpected token 'I', "Internal S"... is not valid JSON
- POST /api/auth/logout: Unexpected token 'I', "Internal S"... is not valid JSON
- POST /api/auth/logout verification: Unexpected token 'I', "Internal S"... is not valid JSON

## 3) Error HTTP del Endpoint de Salud

Comando ejecutado:
- curl -i http://localhost:9002/api/health

Resultado:
- HTTP/1.1 500 Internal Server Error
- Body: Internal Server Error

## 4) Observaciones Tecnicas

- Los errores de tipos reflejan desalineacion entre interfaces legacy y modelos actuales.
- Los smoke tests fallan al parsear JSON porque el backend esta devolviendo un body de error no JSON (texto plano).
- Mientras exista 500 en /api/health, no es posible validar correctamente el resto del circuito de pruebas API.

## 5) Acciones Prioritarias Recomendadas

1. Corregir primero el 500 de /api/health (conexion a DB y manejo de errores).
2. Resolver incompatibilidades de tipos en modulos legacy/admin.
3. Repetir typecheck hasta exit code 0.
4. Ajustar smoke tests para tolerar respuestas no JSON al diagnosticar fallas.
5. Re-ejecutar smoke tests y registrar evidencia de pase.

## 6) Estado Final de Cierre (26-03-2026)

### Criterios de Aceptacion

- typecheck en 0 errores: CUMPLIDO.
- smoke tests pasando: CUMPLIDO (12 de 12).
- /api/health responde 200 con JSON valido: CUMPLIDO.
- build exitoso: CUMPLIDO.
- sin regresiones detectables en auth, pacientes, citas y pagos: CUMPLIDO por validacion smoke final.

### Validaciones Ejecutadas (evidencia)

- `npm run typecheck` -> Exit code: 0
- `npm run lint` -> Exit code: 0 (con warnings no bloqueantes)
- `npm run build` -> Exit code: 0
- `curl -i http://localhost:9002/api/health` -> Exit code: 0, HTTP 200, `{"status":"ok", ...}`
- `npm run test:smoke` -> Exit code: 0, 12/12 pruebas OK

### Ajustes de Cierre Aplicados

- Se corrigieron incompatibilidades de tipos legacy mediante adaptadores conservadores en `src/lib/db.ts` para no romper contratos de paginas existentes.
- Se robustecio `scripts/smoke-tests.ts` para diagnosticar cuerpos no JSON sin ocultar errores reales.
- Se agrego validacion de citas (`GET /api/appointments`) al smoke test para cubrir flujo core.
- Se endurecio build de produccion removiendo ignores en `next.config.ts`:
	- `typescript.ignoreBuildErrors`
	- `eslint.ignoreDuringBuilds`

### Nota de Riesgo Residual

- Existen warnings de lint legacy (hooks, `img`, imports no usados). No bloquean build ni runtime actual, pero se recomienda plan de limpieza incremental post-release.
