# EcoOutlook — Simulador Educativo de Productividad y Sostenibilidad Digital

[![React](https://img.shields.io/badge/React-18.3-blue.svg)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.5-blue.svg)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-5.4-purple.svg)](https://vitejs.dev/)
[![Vitest](https://img.shields.io/badge/Vitest-2.1-green.svg)](https://vitest.dev/)
[![Tests](https://img.shields.io/badge/Tests-29%20passed-brightgreen.svg)]()
[![License](https://img.shields.io/badge/License-MIT-lightgrey.svg)]()

**EcoOutlook** es una aplicación de escritorio diseñada para dinamizaciones en stands universitarios sobre sostenibilidad y huella digital, pensada para su uso con teclado y ratón en ordenadores portátiles (resolución objetivo desde 1366×768).

No es una maqueta ni una landing page estática: es un simulador completo, interactivo y navegable de un entorno de productividad híbrido (inspirado en Microsoft Outlook y OneDrive), 100 % en español, autocontenido, sin backend ni dependencias de APIs externas, y con datos íntegramente ficticios con dominios `.example`.

El lema pedagógico central de la experiencia es:
> **«No se trata de borrar más, sino de gestionar mejor.»**
> La sostenibilidad digital prioriza la reducción de redundancias, la eliminación de versiones huérfanas, la desactivación de sincronizaciones innecesarias y el uso de enlaces en lugar de adjuntos pesados, evitando la pérdida de información crítica.

---

## 📋 Índice

1. [Puesta en marcha rápida](#-puesta-en-marcha-rápida)
2. [Arquitectura del Sistema](#-arquitectura-del-sistema)
3. [Módulos Funcionales](#-módulos-funcionales)
4. [Búsqueda Avanzada de Correo](#-búsqueda-avanzada-de-correo)
5. [Modelo de Almacenamiento Decimal](#-modelo-de-almacenamiento-decimal)
6. [Mecánica del Reto de 180 Segundos](#-mecánica-del-reto-de-180-segundos)
7. [Sistema de Puntuación, Rachas y Distintivos](#-sistema-de-puntuación-rachas-y-distintivos)
8. [Catálogo de Casos Puntuables (73 Casos)](#-catálogo-de-casos-puntuables-73-casos)
9. [Guía de Dinamización en Stand](#-guía-de-dinamización-en-stand)
10. [Accesibilidad y Atajos de Teclado](#-accesibilidad-y-atajos-de-teclado)
11. [Verificación y Suite de Pruebas](#-verificación-y-suite-de-pruebas)

---

## 🚀 Puesta en marcha rápida

### Requisitos previos
- **Node.js**: v18.0.0 o superior (recomendado v20 LTS).
- **npm**: v9.0.0 o superior.

### 1. Instalación de dependencias
```bash
npm install
```

### 2. Ejecutar en modo desarrollo
```bash
npm run dev
```
La aplicación se servirá localmente en:
👉 `http://localhost:3000`

### 3. Ejecutar pruebas automatizadas
```bash
npm test
```
Ejecuta con **Vitest** los tests unitarios de dominio, el controlador del juego y la suite de pruebas de aceptación e2e.

### 4. Compilación para producción
```bash
npm run build
```
Genera la build empaquetada y optimizada en la carpeta `dist/`.

### 5. Previsualización local del build
```bash
npm run preview
```
Sirve la compilación estática de `dist/` en `http://localhost:4173`.

---

## 🏛 Arquitectura del Sistema

El proyecto implementa una arquitectura desacoplada por capas donde el dominio es puramente funcional, sin acoplamiento a React ni al DOM:

```
c:\Users\Usuario\Desktop\innosoft\
├── dist/                          # Salida de la compilación de producción (Vite)
├── EcoOutlook-Especificacion-v1.0/ # Documentación de especificación oficial (Fuente de verdad)
├── src/
│   ├── app/
│   │   └── App.tsx                # Enrutador de pantallas (WELCOME, ACTIVE, RESULTS)
│   ├── domain/                    # Capa de Dominio Puro
│   │   ├── types.ts               # Tipos TypeScript de todas las entidades
│   │   ├── storage.ts             # Cálculos de almacenamiento en base decimal (1000)
│   │   ├── scoring.ts             # Lógica de puntuación, bonus de racha y distintivos
│   │   └── mailSearch.ts          # Tokenizer y evaluador de operadores de búsqueda
│   ├── data/                      # Repositorios y Generación de Datos
│   │   ├── seed/
│   │   │   ├── generateDataset.ts # Generador determinista de 320 emails, 120 archivos, etc.
│   │   │   └── initialDataset.ts  # Factoría de clonado profundo para partidas aisladas
│   │   └── repositories/
│   │       └── gameRepository.ts  # Persistencia híbrida (IndexedDB/State + localStorage para Top 10)
│   ├── game/                      # Controlador y Estado del Reto
│   │   ├── gameController.ts      # Temporizador absoluto, bloqueo de mutaciones y despacho
│   │   └── GameContext.tsx        # React Context, hooks y orquestación de confirmaciones
│   ├── modules/                   # Vistas Funcionales de los 4 Módulos
│   │   ├── mail/MailView.tsx      # Correo: tabla densa, lectura, adjuntos y composición
│   │   ├── files/FilesView.tsx    # OneDrive: 18 carpetas, versiones, enlaces compartidos
│   │   ├── calendar/CalendarView.tsx # Calendario: Día, Semana, Mes, Agenda y series
│   │   └── contacts/ContactsView.tsx # Contactos: tarjetas, edición y Asistente de Fusión
│   ├── components/                # Componentes Compartidos de Interfaz
│   │   ├── AppShell/              # Barra superior, navegación lateral y panel contextual
│   │   ├── WelcomeView/           # Portada, reglas, alias y administración de ranking
│   │   ├── ResultsView/           # Balance final, métricas ecológicas y Top 10 local
│   │   ├── ConfirmDialog/         # Diálogos accesibles para acciones irreversibles
│   │   └── Toast/                 # Notificaciones flotantes de puntuación en vivo
│   ├── styles/
│   │   ├── tokens.css             # Paleta Fluent/Outlook, elevaciones y tipografía
│   │   └── global.css             # Reset, layout responsivo y scrollbars personalizadas
│   └── tests/                     # Suite de Pruebas Automatizadas
│       ├── domain.test.ts         # Pruebas unitarias de almacenamiento, scoring y búsqueda
│       ├── gameController.test.ts # Pruebas del timer absoluto, racha y mutaciones bloqueadas
│       └── acceptance.test.ts     # Recorrido de los 14 pasos de 07-PLAN-DE-PRUEBAS-Y-ACEPTACION.md
├── index.html                     # Entrypoint HTML de la aplicación
├── package.json                   # Scripts y dependencias
├── tsconfig.json                  # Configuración de TypeScript
└── vite.config.ts                 # Configuración de compilador Vite y Vitest
```

---

## 💻 Módulos Funcionales

### 1. Correo Electrónico (`MailView`)
- **Carpetas funcionales:** Bandeja de entrada (180 correos), Enviados (55), Borradores (12), Archivados (35 en 5 subcarpetas temáticas), No deseados (12) y Papelera (26). Total: **320 correos**.
- **Visualización densa:** Tabla con remitente, asunto, fecha, tamaño legible, indicador de adjuntos y estrella de favoritos.
- **Paginación:** 50 correos por página con navegación accesible.
- **Acciones sobre correos:**
  - Marcar como leído / no leído.
  - Marcar / desmarcar con estrella.
  - Mover a la papelera (reversible).
  - Borrado definitivo con confirmación obligatoria.
  - Vaciado completo de la papelera con diálogo modal de confirmación.
  - Desuscripción de listas de correo (elimina notificaciones masivas).
- **Lectura de correo:** Panel modal detallado con cabeceras completas, cuerpo del mensaje, y panel de archivos adjuntos con opción de **descargar**, **eliminar solo el adjunto** o **convertir en enlace OneDrive**.
- **Compositor de correo:**
  - Autocompletado de destinatarios basado en los contactos del sistema.
  - Soporte de adjuntos locales vs enlaces a OneDrive (puntuables en el caso `MAIL-020`).

### 2. Archivos y OneDrive (`FilesView`)
- **Estructura:** **120 archivos** clasificados en **18 carpetas de usuario**:
  - `Documentos de Gestión`, `Proyectos de Innovación`, `Memoria Anual 2025`, `Facturas y Justificantes`, `Fotografías Evento Bienvenida`, `Grabaciones Sesiones Grabadas`, `Material Multimedia Stand`, `Backups Antiguos`, `Presentaciones Institucionales`, `Planillas de Presupuestos`, `Auditorías Internas`, `Recursos Humanos`, `Actas de Reuniones`, `Plantillas y Modelos`, `Boletines Universitarios`, `Diseño Gráfico y Logos`, `Software y Utilidades`, `Cursos y Seminarios`.
- **Navegación:** Migas de pan (*breadcrumbs*) clicables y barra de carpetas lateral.
- **Vistas:** Alternancia entre vista de **Lista detallada** y vista de **Cuadrícula**.
- **Filtros por categoría:** Todos, Documentos/PDF, Imágenes, Vídeos, Audios, Hojas/Presupuestos, Comprimidos/ZIP.
- **Gestión avanzada de archivos:**
  - **Historial de versiones:** Visualización de versiones anteriores (`v1`, `v2`, etc.) con tamaños físicos y eliminación selectiva de versiones huérfanas (`FILE-001`, `FILE-002`).
  - **Enlaces compartidos:** Inspección de enlaces públicos caducados o abiertos y revocación de permisos (`FILE-004`).
  - **Papelera de reciclaje:** Eliminación lógica y vaciado definitivo con confirmación.

### 3. Calendario (`CalendarView`)
- **Escenario temporal fijo:** Anclado de forma determinista en el **lunes 9 de noviembre de 2026** (`2026-11-09`).
- **4 Vistas interactivas:** **Día**, **Semana**, **Mes** y **Agenda**.
- **48 Eventos de calendario:** Eventos individuales, reuniones convocadas por otros, reuniones organizadas por el usuario, eventos recurrentes con series periódicas, eventos pasados con actas/vídeos adjuntos y eventos cancelados.
- **Acciones de calendario:**
  - Aceptar, rechazar o declinar convocatorias.
  - Cancelación de reuniones organizadas con notificación y liberación de recursos.
  - Borrado de ocurrencias individuales frente al borrado de toda la serie recurrente (`CAL-002`).
  - Limpieza de adjuntos pesados en eventos ya finalizados en el pasado (`CAL-001`).

### 4. Contactos (`ContactsView`)
- **64 Contactos:** Distribuidos con información completa (nombre, email, teléfono, organización, cargo, notas).
- **Filtros rápidos:** Todos, Favoritos, y **Posibles duplicados**.
- **Edición individual:** Modal accesible para modificar detalles y notas.
- **Asistente de Fusión de Contactos:**
  - Identificación automática de duplicados directos o complementarios.
  - Interfaz de unificación que combina campos vacíos.
  - **Resolución manual de conflictos:** Si ambos contactos tienen datos diferentes (ej. dos números de teléfono o cargos distintos), se presentan selectores de tipo *radio* para que el usuario elija explícitamente qué dato sobrevive.

---

## 🔍 Búsqueda Avanzada de Correo

El sistema incorpora un motor de búsqueda y parsing de consultas con atajo global `Ctrl+K`:

| Operador | Ejemplo de Uso | Descripción |
| :--- | :--- | :--- |
| `from:` | `from:notificaciones` | Filtra por nombre o correo del remitente. |
| `to:` | `to:gestion` | Filtra por destinatario. |
| `subject:` | `subject:informe` | Coincidencia en el asunto del correo. |
| `has:attachment` | `has:attachment` | Filtra únicamente correos que contengan archivos adjuntos. |
| `filename:` | `filename:pdf` o `filename:zip` | Busca correos cuyo adjunto contenga dicho texto o extensión. |
| `larger:` | `larger:5MB` o `larger:10MB` | Correos con tamaño superior al especificado (unidades B, KB, MB, GB). |
| `smaller:` | `smaller:500KB` | Correos con tamaño inferior al especificado. |
| `before:` | `before:2026-01-01` | Correos con fecha anterior a `AAAA-MM-DD`. |
| `after:` | `after:2025-06-01` | Correos con fecha posterior a `AAAA-MM-DD`. |
| `is:unread` | `is:unread` | Solo correos no leídos. |
| `is:read` | `is:read` | Solo correos ya leídos. |
| `is:starred` | `is:starred` | Solo correos marcados con estrella/favorito. |
| `in:` | `in:trash` o `in:junk` | Limita la búsqueda a una carpeta concreta (`inbox`, `trash`, `junk`, `archive`, `sent`). |
| `-término` | `-urgente` | Negación: excluye correos que contengan dicho término. |
| `texto libre` | `presupuesto auditoría` | Búsqueda por palabras en asunto, remitente o cuerpo. |

---

## 💾 Modelo de Almacenamiento Decimal

Para garantizar consistencia y rigor técnico:
- **Base Decimal (Base 1000):** $1\text{ kB} = 1.000\text{ bytes}$, $1\text{ MB} = 1.000.000\text{ bytes}$, $1\text{ GB} = 1.000.000.000\text{ bytes}$.
- **Capacidad total:** `50.000.000.000 bytes` (50 GB exactos).
- **Ocupación inicial garantizada:** exactamente `34.000.000.000 bytes` (34 GB exactos, 68 % de ocupación).
- **Unidades de Almacenamiento Físico (`StorageUnit`):**
  - Cada adjunto o archivo apunta a una unidad física identificada (`storageUnitId`).
  - Múltiples referencias al mismo archivo no duplican el espacio físico (deduplicación por referencia).
- **Contabilidad estricta de Papelera:**
  - Mover elementos a la papelera **NO** libera espacio de almacenamiento: `usedBytes = bytes_activos + bytes_papelera`.
  - Solo el **borrado definitivo** o el **vaciado de la papelera** libera espacio físico, siempre y cuando no existan otras referencias activas o en papelera al mismo objeto.
  - La interfaz muestra en todo momento el espacio liberado efectivo frente al espacio pendiente retenido en la papelera.

---

## ⏱ Mecánica del Reto de 180 Segundos

1. **Duración estricta:** 180 segundos exactos (180.000 ms).
2. **Deadline absoluto:** El temporizador calcula el tiempo restante mediante `deadlineAt - Date.now()`.
3. **Resistencia a pausas:** Abrir modales, diálogos de confirmación o cambiar de pestaña en el navegador **no detiene el reloj**.
4. **Bloqueo inmediato de mutaciones:** En el instante en que el tiempo llega a 0, el controlador bloquea cualquier acción de borrado, vaciado o edición, impidiendo peticiones extemporáneas.
5. **Transición a Resultados:** Se presenta inmediatamente la pantalla de resumen con el desglose de decisiones, puntos y distintivo obtenido.
6. **Finalización voluntaria:** El participante puede pulsar «Terminar reto» en la barra superior en cualquier momento previa confirmación (sin penalización ni bonificación por tiempo sobrante).

---

## 🏆 Sistema de Puntuación, Rachas y Distintivos

### Matriz de Puntuación por Calidad de Decisión
| Nivel | Puntos | Criterio Pedagógico |
| :--- | :---: | :--- |
| **Óptima** | `+100` | Limpieza de redundancias masivas, vaciado de basura obsoleta, desuscripción de listas de spam o eliminación de versiones huérfanas sin riesgo. |
| **Buena** | `+60` | Sustitución de adjuntos por enlaces compartidos, fusión limpia de contactos duplicados o eliminación de copias locales innecesarias. |
| **Parcial** | `+30` | Mover a papelera sin vaciar definitivamente (el participante identifica el problema pero no culmina la liberación física). |
| **Neutral** | `0` | Acciones sin impacto ecológico apreciable ni perjuicio funcional. |
| **Perjudicial** | `-100` | Borrado de correos o archivos con utilidad activa o sin revisar sus consecuencias. |
| **Crítica** | `-200` | Eliminación de documentación legal, facturas auditables, contratos vigentes o el archivo maestro del proyecto. |

### Bonus de Racha
- Cada decisión positiva consecutiva suma **+10 puntos** de bonus.
- Límite máximo de bonificación: **+50 puntos** por caso.
- Una acción neutral no rompe la racha; una acción perjudicial o crítica la reinicia a 0.

### Distintivos Finales (*Badges*)
- 🏅 **Gestión ejemplar:** Puntuación $\ge 1.200$ puntos, mínimo 10 casos resueltos y 0 decisiones críticas.
- 🥈 **Gestión responsable:** Puntuación entre $600$ y $1.199$ puntos y 0 decisiones críticas.
- 🥉 **En buen camino:** Puntuación entre $0$ y $599$ puntos y no más de 1 decisión perjudicial.
- ⚠️ **Necesita revisar antes de borrar:** Puntuación $< 0$ o al menos 1 eliminación crítica de información sensible.

---

## 📚 Catálogo de Casos Puntuables (73 Casos)

El motor evalúa automáticamente los 73 casos especificados en `10-CATALOGO-DE-CASOS-PUNTUABLES.md`. Cada caso puntúa **una sola vez**:

- **Correo (`MAIL-001` a `MAIL-030` — 30 casos):**
  - Vaciado de papelera (`MAIL-001`), limpieza de spam publicitario (`MAIL-002`), desuscripción de boletines masivos (`MAIL-003`), borrado de backups obsoletos adjuntos (`MAIL-004`), eliminación de vídeos en borradores (`MAIL-005`), detección de adjuntos duplicados (`MAIL-006` a `010`), sustitución de adjunto por enlace en redacción (`MAIL-020`), y protección ante borrado imprudente de actas oficiales o justificantes fiscales (`MAIL-021` a `030`).
- **Archivos y OneDrive (`FILE-001` a `FILE-025` — 25 casos):**
  - Purgado de versiones intermedias obsoletas de memorias y pliegos (`FILE-001` a `003`), revocación de enlaces compartidos públicos huérfanos (`FILE-004`), vaciado de papelera de OneDrive (`FILE-005`), borrado de grabaciones temporales ya transcritas (`FILE-006` a `015`), y prevención contra el borrado del vídeo maestro o facturas contables (`FILE-021` a `025`).
- **Calendario (`CAL-001` a `CAL-008` — 8 casos):**
  - Eliminación de actas y vídeos pesados adjuntos a eventos finalizados (`CAL-001`), eliminación de series periódicas inactivas frente a ocurrencias pasadas (`CAL-002`), cancelación de reuniones con reserva de sala liberando recursos compartidos (`CAL-003` a `005`), y rechazo de citas duplicadas (`CAL-006` a `008`).
- **Contactos (`CON-001` a `CON-010` — 10 casos):**
  - Fusión de contactos duplicados integrando teléfonos y emails (`CON-001` a `005`), resolución de conflictos en campos no vacíos mediante el Asistente de Fusión (`CON-006` a `008`), y depuración de fichas obsoletas sin datos (`CON-009` a `010`).

---

## 🎪 Guía de Dinamización en Stand

Para garantizar la mejor experiencia durante eventos y ferias universitarias:

1. **Configuración de Pantalla:**
   - Se recomienda abrir el navegador (Google Chrome, Edge o Firefox) y pulsar **F11** para activar el modo a **pantalla completa**, ocultando barras del sistema operativo.
2. **Flujo de Participación (aprox. 3–4 minutos por usuario):**
   - El participante introduce su **Nombre o Alias** en la pantalla de bienvenida.
   - El dinamizador introduce brevemente la misión: «Tienes 3 minutos para gestionar una cuenta saturada; recuerda que no todo se soluciona borrando a lo loco, ¡ojo con la información sensible!».
   - Se pulsa **«Comenzar reto · 03:00»**.
   - El participante interactúa y al expirar el tiempo se muestran sus resultados y posición en el Top 10.
3. **Restablecimiento del Sistema:**
   - Al pulsar **«Jugar otra partida»**, el dataset se reinicia automáticamente al estado prístino de 34 GB sin alterar las mejores marcas registradas en el Top 10.
4. **Mantenimiento del Stand (Fin de Jornada):**
   - En la pantalla de bienvenida, el dinamizador puede pulsar el botón **«Administración»** y seleccionar **«Borrar ranking Top 10»** (con confirmación de seguridad) para iniciar un nuevo día con el marcador limpio.

---

## ⌨️ Accesibilidad y Atajos de Teclado

La interfaz cumple las directrices WCAG 2.1 AA (contraste de color, foco visible y etiquetas ARIA) y ofrece control ágil mediante teclado:

- <kbd>Ctrl</kbd> + <kbd>K</kbd>: Enfocar inmediatamente la barra de búsqueda global.
- <kbd>Esc</kbd>: Cerrar cualquier modal, diálogo de confirmación o previsualizador abierto.
- <kbd>Tab</kbd> / <kbd>Shift</kbd> + <kbd>Tab</kbd>: Navegación secuencial por controles interactivos.
- <kbd>Enter</kbd> / <kbd>Espacio</kbd>: Activar botones, abrir correos, conmutar checks y confirmar acciones.
- Contraste accesible en modo claro con tokens Segoe UI y tipografía del sistema.

---

## 🧪 Verificación y Suite de Pruebas

El proyecto cuenta con una batería completa de **29 pruebas automatizadas** que validan todas las reglas de negocio y los flujos de usuario:

```bash
npm test
```

### Resumen de la Suite de Pruebas:
- **`src/tests/domain.test.ts` (20 tests):**
  - Verificación de volúmenes exactos del dataset inicial (320 correos, 120 archivos, 18 carpetas, 64 contactos, 48 eventos, 73 casos).
  - Comprobación matemática de la suma inicial de ocupación: **exactamente 34.000.000.000 bytes** (34 GB).
  - Reglas de contabilidad `STO-01` a `STO-10`: archivar y mover a papelera no liberan almacenamiento; borrado definitivo de elementos huérfanos sí libera almacenamiento.
  - Evaluación de niveles de puntuación, bonus de racha acumulable hasta +50 y asignación de distintivos según umbrales.
  - Parser de búsqueda: verificación de operadores `from:`, `larger:`, `has:attachment`, `in:trash` y filtros combinados.
- **`src/tests/gameController.test.ts` (8 tests):**
  - Temporizador con deadline absoluto en epoch timestamp y cálculo de tiempo restante.
  - Bloqueo instantáneo de mutaciones tras el vencimiento de los 180 segundos.
  - Racha positiva, corte de racha ante acciones perjudiciales y persistencia de casos resueltos (regla anti-farmeo).
  - Fusión de contactos conservando datos secundarios y campos complementarios.
  - Persistencia del ranking Top 10 tras reinicio completo de partida.
- **`src/tests/acceptance.test.ts` (1 test e2e integrado):**
  - Ejecuta paso a paso el viaje de usuario de 14 pasos especificado en `07-PLAN-DE-PRUEBAS-Y-ACEPTACION.md`.
