20. COPASST
    Crear módulo:
    • Integrantes
    • Empresa
    • Cargo
    • Rol
    • Periodo
    • Fecha inicio
    • Fecha final
    • Reuniones
    • Actas
    • Compromisos
    • Capacitaciones
    • Seguimientos
    Dashboard:
    • Vigencia
    • Próxima reunión
    • Reuniones realizadas
    • Compromisos abiertos
    • Compromisos vencidos

---

21. CCL
    Crear módulo:
    • Integrantes
    • Rol
    • Periodo
    • Reuniones
    • Actas
    • Actividades
    • Casos abiertos
    • Seguimientos
    • Compromisos
    • Estado
    No mostrar información sensible de casos en el dashboard general.

---

22. EMERGENCIAS
    Crear módulo:
    Brigada
    • Trabajador
    • Tipo de brigadista
    • Formación
    • Fecha
    • Vencimiento
    • Estado
    Tipos:
    • Primeros auxilios
    • Evacuación
    • Incendios
    • Rescate
    Equipos
    • Extintores
    • Botiquines
    • Camillas
    • Señalización
    • Linternas
    • Otros
    Campos:
    • Elemento
    • Ubicación
    • Fecha inspección
    • Próxima inspección
    • Responsable
    • Estado
    • Hallazgos
    Simulacros
    • Fecha
    • Lugar
    • Tipo
    • Participantes
    • Resultado
    • Hallazgos
    • Acciones

<!DOCTYPE html>

<html lang="es"><head><meta charset="utf-8"/><meta content="width=device-width, initial-scale=1.0" name="viewport"/><link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0" rel="stylesheet"/>
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet"/><style>@layer base{html,body{margin:0;padding:0;}body{overscroll-behavior:none;}main>:first-child{margin-top:0!important;}main>:last-child{margin-bottom:0!important;}}::-webkit-scrollbar{display:none;}</style><script src="https://cdn.tailwindcss.com"></script><script id="tailwind-config">tailwind.config = {
    darkMode: "class",
    theme: {
      extend: {
        "colors": {
          "inverse-surface": "#233144",
          "on-primary": "#ffffff",
          "on-primary-container": "#9ea9ff",
          "secondary-container": "#6063ee",
          "on-tertiary-fixed": "#191c1e",
          "error-container": "#ffdad6",
          "surface-container-low": "#eff4ff",
          "surface-container-highest": "#d5e3fc",
          "on-primary-fixed-variant": "#333f91",
          "secondary-fixed-dim": "#c0c1ff",
          "on-secondary-fixed": "#07006c",
          "surface": "#f8f9ff",
          "primary-fixed": "#dfe0ff",
          "error": "#ba1a1a",
          "tertiary-container": "#404345",
          "on-surface-variant": "#454651",
          "surface-bright": "#f8f9ff",
          "secondary-fixed": "#e1e0ff",
          "surface-container-high": "#dce9ff",
          "tertiary-fixed-dim": "#c4c7c9",
          "surface-container": "#e6eeff",
          "inverse-primary": "#bcc3ff",
          "on-secondary": "#ffffff",
          "outline-variant": "#c6c5d3",
          "primary-fixed-dim": "#bcc3ff",
          "on-tertiary": "#ffffff",
          "surface-dim": "#ccdbf3",
          "on-error": "#ffffff",
          "primary-container": "#2e3a8c",
          "on-primary-fixed": "#000d60",
          "on-background": "#0d1c2e",
          "on-secondary-fixed-variant": "#2f2ebe",
          "secondary": "#4648d4",
          "on-surface": "#0d1c2e",
          "tertiary-fixed": "#e0e3e5",
          "surface-container-lowest": "#ffffff",
          "on-secondary-container": "#fffbff",
          "surface-variant": "#d5e3fc",
          "primary": "#142175",
          "surface-tint": "#4b57aa",
          "background": "#f8f9ff",
          "on-error-container": "#93000a",
          "on-tertiary-fixed-variant": "#444749",
          "inverse-on-surface": "#eaf1ff",
          "tertiary": "#2a2d2f",
          "on-tertiary-container": "#adb0b2",
          "outline": "#767682"
        },
        "borderRadius": {
          "DEFAULT": "0.25rem",
          "lg": "0.5rem",
          "xl": "0.75rem",
          "full": "9999px"
        },
        "spacing": {
          "xs": "4px",
          "xl": "80px",
          "lg": "48px",
          "md": "24px",
          "gutter": "24px",
          "base": "8px",
          "sm": "12px",
          "container-max": "1280px"
        },
        "fontFamily": {
          "body-lg": [
            "Inter"
          ],
          "headline-lg-mobile": [
            "Inter"
          ],
          "label-md": [
            "Inter"
          ],
          "label-sm": [
            "Inter"
          ],
          "body-md": [
            "Inter"
          ],
          "headline-lg": [
            "Inter"
          ],
          "headline-md": [
            "Inter"
          ],
          "display-lg": [
            "Inter"
          ],
          "body-sm": [
            "Inter"
          ]
        },
        "fontSize": {
          "body-lg": [
            "18px",
            {
              "lineHeight": "28px",
              "fontWeight": "400"
            }
          ],
          "headline-lg-mobile": [
            "24px",
            {
              "lineHeight": "32px",
              "fontWeight": "600"
            }
          ],
          "label-md": [
            "14px",
            {
              "lineHeight": "16px",
              "letterSpacing": "0.01em",
              "fontWeight": "500"
            }
          ],
          "label-sm": [
            "12px",
            {
              "lineHeight": "14px",
              "fontWeight": "600"
            }
          ],
          "body-md": [
            "16px",
            {
              "lineHeight": "24px",
              "fontWeight": "400"
            }
          ],
          "headline-lg": [
            "32px",
            {
              "lineHeight": "40px",
              "letterSpacing": "-0.01em",
              "fontWeight": "600"
            }
          ],
          "headline-md": [
            "24px",
            {
              "lineHeight": "32px",
              "fontWeight": "600"
            }
          ],
          "display-lg": [
            "48px",
            {
              "lineHeight": "56px",
              "letterSpacing": "-0.02em",
              "fontWeight": "700"
            }
          ],
          "body-sm": [
            "14px",
            {
              "lineHeight": "20px",
              "fontWeight": "400"
            }
          ]
        }
      },
    },
  }</script></head><body class="bg-background font-body-md text-body-md text-on-surface antialiased"><aside class="fixed left-0 top-0 h-full w-72 bg-surface-container-lowest shadow-[0_1px_8px_rgba(0,0,0,0.04)] z-50 flex flex-col justify-between overflow-y-auto"><div class="p-gutter pb-0"><div class="flex items-center gap-base mb-xs"><div class="w-8 h-8 rounded bg-primary-container flex items-center justify-center text-on-primary font-headline-md text-headline-md">M</div><div class="flex flex-col"><span class="font-label-md text-label-md text-primary leading-tight font-semibold">Grupo Manzanares S.A.S.</span><span class="font-label-sm text-label-sm text-on-surface-variant">SG-SST Operativo</span></div></div><div class="flex items-center gap-xs mt-base mb-md"><span class="bg-surface-container-high text-on-surface font-label-sm text-label-sm px-xs py-0.5 rounded">Dec. 1072</span><span class="bg-surface-container-high text-on-surface font-label-sm text-label-sm px-xs py-0.5 rounded">Res. 0312</span></div></div><nav class="flex-1 px-sm pb-gutter flex flex-col gap-base" data-active-classes="bg-primary-container text-on-primary font-medium rounded-lg"><div class="flex flex-col gap-xs"><span class="px-xs font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">Gestión Operativa</span><a class="px-sm py-xs rounded-lg text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-colors font-label-md text-label-md" data-path="dashboard" href="#">Inicio / Dashboard</a><a class="px-sm py-xs rounded-lg text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-colors font-label-md text-label-md" data-path="trabajadores" href="#">Trabajadores</a><a class="px-sm py-xs rounded-lg text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-colors font-label-md text-label-md" data-path="examenes-medicos" href="#">Exámenes Médicos (EMOS)</a><a class="px-sm py-xs rounded-lg text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-colors font-label-md text-label-md" data-path="casos-de-salud" href="#">Casos de Salud</a><a class="px-sm py-xs rounded-lg text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-colors font-label-md text-label-md" data-path="incapacidades-y-reintegros" href="#">Incapacidades y Reintegros</a></div><div class="flex flex-col gap-xs"><span class="px-xs font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">Riesgos Críticos &amp; Viales</span><a class="px-sm py-xs rounded-lg text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-colors font-label-md text-label-md" data-path="trabajo-en-alturas" href="#">Trabajo en Alturas</a><a class="px-sm py-xs rounded-lg text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-colors font-label-md text-label-md" data-path="tractoristas-operadores" href="#">Tractoristas / Operadores</a><a class="px-sm py-xs rounded-lg text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-colors font-label-md text-label-md" data-path="pesv-seguridad-vial" href="#">PESV (Seguridad Vial)</a><a class="px-sm py-xs rounded-lg text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-colors font-label-md text-label-md" data-path="epp" href="#">EPP</a></div><div class="flex flex-col gap-xs"><span class="px-xs font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">Inspección &amp; Eventos</span><a class="px-sm py-xs rounded-lg text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-colors font-label-md text-label-md" data-path="inspecciones" href="#">Inspecciones</a><a class="px-sm py-xs rounded-lg text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-colors font-label-md text-label-md" data-path="accidentes-e-incidentes" href="#">Accidentes e Incidentes</a><a class="px-sm py-xs rounded-lg text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-colors font-label-md text-label-md" data-path="investigaciones" href="#">Investigaciones</a><a class="px-sm py-xs rounded-lg text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-colors font-label-md text-label-md" data-path="acciones-correctivas" href="#">Acciones Correctivas</a></div><div class="flex flex-col gap-xs"><span class="px-xs font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">Comités &amp; Cultura</span><a class="px-sm py-xs rounded-lg text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-colors font-label-md text-label-md" data-path="capacitaciones" href="#">Capacitaciones</a><a class="px-sm py-xs rounded-lg text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-colors font-label-md text-label-md" data-path="documentos-sg-sst" href="#">Documentos SG-SST</a><a class="px-sm py-xs rounded-lg text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-colors font-label-md text-label-md" data-path="20-copasst" href="#">20. COPASST</a><a class="px-sm py-xs rounded-lg text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-colors font-label-md text-label-md" data-path="21-ccl-convivencia-laboral" href="#">21. CCL (Convivencia Laboral)</a><a class="px-sm py-xs rounded-lg text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-colors font-label-md text-label-md" data-path="22-plan-de-emergencias-y-brigada" href="#">22. Plan de Emergencias y Brigada</a><a class="px-sm py-xs rounded-lg text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-colors font-label-md text-label-md" data-path="quimicos" href="#">Químicos</a></div></nav></aside><div class="pl-72"><header class="fixed top-0 left-72 right-0 h-16 bg-surface-container-lowest/90 backdrop-blur-xl shadow-[0_1px_8px_rgba(0,0,0,0.04)] z-40 flex items-center justify-between px-gutter"><div class="flex items-center gap-md flex-1 max-w-xl"><div class="relative w-full"><span class="material-symbols-outlined absolute left-sm top-1/2 -translate-y-1/2 text-on-surface-variant text-[20px]">search</span><input class="w-full bg-surface-container-low text-on-surface placeholder:text-on-surface-variant pl-10 pr-sm py-xs rounded-lg font-body-sm text-body-sm focus:outline-none focus:ring-2 focus:ring-secondary-container transition-all" placeholder="Buscar trabajadores, incidentes, normativas..." type="search"/></div><div class="flex items-center bg-surface-container-low px-sm py-xs rounded-lg gap-xs shrink-0"><span class="material-symbols-outlined text-[18px] text-on-surface-variant">gavel</span><span class="font-label-sm text-label-sm text-on-surface">Estándares 2024</span><span class="material-symbols-outlined text-[16px] text-on-surface-variant">expand_more</span></div></div><div class="flex items-center gap-base"><button class="flex items-center gap-xs bg-primary-container text-on-primary px-sm py-xs rounded-lg font-label-md text-label-md hover:bg-primary transition-colors" type="button"><span class="material-symbols-outlined text-[18px]">add_alert</span><span>Reporte Rápido / Notificación</span></button><button class="relative w-10 h-10 flex items-center justify-center rounded-lg hover:bg-surface-container-high transition-colors text-on-surface-variant" type="button"><span class="material-symbols-outlined text-[22px]">notifications</span><span class="absolute top-2 right-2 w-2 h-2 rounded-full bg-error"></span></button><div class="flex items-center gap-sm pl-xs"><div class="text-right hidden xl:block"><div class="font-label-md text-label-md text-on-surface font-medium">Ing. Andrés Valencia</div><div class="font-label-sm text-label-sm text-on-surface-variant">Coordinador SG-SST</div></div><div class="w-8 h-8 rounded-full bg-primary flex items-center justify-center"><span class="material-symbols-outlined text-on-primary text-[18px]">person</span></div></div></div></header><main class="w-full px-gutter pt-16 bg-surface min-h-screen"><div class="flex flex-col w-full pb-xl">
<!-- Top Ambient Banner & Header Information -->
<div class="relative bg-surface-container-lowest rounded-xl p-md shadow-sm mb-md overflow-hidden">
<div class="absolute -right-16 -top-16 w-80 h-80 rounded-full bg-secondary/5 blur-3xl pointer-events-none"></div>
<div class="relative z-10 flex flex-col xl:flex-row xl:items-center justify-between gap-md">
<div class="flex flex-col gap-xs max-w-3xl">
<div class="flex items-center gap-xs flex-wrap">
<span class="inline-flex items-center gap-1 bg-surface-container-high text-primary font-label-sm text-label-sm px-2.5 py-1 rounded">
<span class="material-symbols-outlined text-[15px]">verified_user</span>
            Res. 2013/1986 Art. 7
          </span>
<span class="inline-flex items-center gap-1 bg-surface-container-high text-primary font-label-sm text-label-sm px-2.5 py-1 rounded">
<span class="material-symbols-outlined text-[15px]">policy</span>
            Dec. 1072/2015 Art. 2.2.4.6.32
          </span>
<span class="inline-flex items-center gap-1 bg-secondary-fixed text-on-secondary-fixed font-label-sm text-label-sm px-2.5 py-1 rounded font-semibold">
<span class="material-symbols-outlined text-[15px]">event_repeat</span>
            Vigencia Legal: 2023 - 2025
          </span>
<span class="inline-flex items-center gap-1 bg-surface-container text-on-surface-variant font-label-sm text-label-sm px-2.5 py-1 rounded">
            Res. 0312/2019 Estándar 1.1.1
          </span>
</div>
<h1 class="font-headline-lg text-headline-lg text-primary tracking-tight mt-1">
          20. Comité Paritario de Seguridad y Salud en el Trabajo (COPASST)
        </h1>
<p class="font-body-md text-body-md text-on-surface-variant leading-relaxed">
          Control de periodo de vigencia legal (2 años), paridad empleador-trabajador, sesiones mensuales obligatorias, libro de actas foliadas y seguimiento a compromisos concertados en sedes agrícolas y plantas agroindustriales.
        </p>
</div>
<!-- Action Buttons -->
<div class="flex items-center gap-xs flex-wrap shrink-0">
<button class="inline-flex items-center gap-xs bg-surface-container-high hover:bg-surface-container-highest text-primary font-label-md text-label-md px-base py-2.5 rounded-lg shadow-sm transition-all duration-150" type="button">
<span class="material-symbols-outlined text-[18px]">menu_book</span>
<span>Descargar Libro de Actas (.PDF)</span>
</button>
<button class="inline-flex items-center gap-xs bg-surface-container-high hover:bg-surface-container-highest text-on-surface font-label-md text-label-md px-base py-2.5 rounded-lg shadow-sm transition-all duration-150" type="button">
<span class="material-symbols-outlined text-[18px]">calendar_add_on</span>
<span>Programar Sesión Ordinaria</span>
</button>
<button class="inline-flex items-center gap-xs bg-primary-container text-on-primary hover:bg-primary font-label-md text-label-md px-base py-2.5 rounded-lg shadow-md transition-all duration-150" type="button">
<span class="material-symbols-outlined text-[18px]">note_add</span>
<span>+ Registrar Acta / Compromiso</span>
</button>
</div>
</div>
</div>
<!-- Metric Stat Cards (Grid of 5) -->
<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-sm mb-md">
<!-- Card 1: Vigencia Legal -->
<div class="bg-surface-container-lowest rounded-xl p-md shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
<div class="flex items-start justify-between">
<span class="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">Vigencia Legal</span>
<div class="w-8 h-8 rounded-lg bg-surface-container-high flex items-center justify-center text-primary">
<span class="material-symbols-outlined text-[20px]">calendar_month</span>
</div>
</div>
<div class="mt-base">
<div class="font-headline-md text-headline-md text-on-surface font-bold">2023 - 2025</div>
<div class="font-body-sm text-body-sm text-on-surface-variant mt-0.5">Restan 142 días para elecciones</div>
</div>
<div class="mt-base">
<div class="flex items-center justify-between font-label-sm text-label-sm mb-1">
<span class="text-on-surface-variant">Progreso de mandato</span>
<span class="font-semibold text-primary">76%</span>
</div>
<div class="w-full h-2 rounded-full bg-surface-container-highest overflow-hidden">
<div class="h-full bg-secondary-container rounded-full" style="width: 76%"></div>
</div>
</div>
</div>
<!-- Card 2: Próxima Reunión -->
<div class="bg-surface-container-lowest rounded-xl p-md shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
<div class="flex items-start justify-between">
<span class="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">Próxima Reunión</span>
<span class="inline-flex items-center font-label-sm text-label-sm font-semibold px-2 py-0.5 rounded bg-secondary-fixed text-on-secondary-fixed">
          Faltan 6 días
        </span>
</div>
<div class="mt-base">
<div class="font-headline-md text-headline-md text-primary font-bold">14 Nov, 2024</div>
<div class="font-label-md text-label-md text-on-surface font-medium mt-0.5">09:00 AM • Sesión Ordinaria #11</div>
</div>
<div class="mt-base pt-2 border-none">
<div class="flex items-center gap-1 font-body-sm text-body-sm text-on-surface-variant">
<span class="material-symbols-outlined text-[16px] text-secondary">domain</span>
<span>Sala Juntas &amp; Remoto Fincas</span>
</div>
<div class="font-label-sm text-label-sm text-secondary font-medium mt-0.5 flex items-center gap-1">
<span class="material-symbols-outlined text-[14px]">check_circle</span>
<span>Orden del día enviado</span>
</div>
</div>
</div>
<!-- Card 3: Sesiones Ordinarias Realizadas -->
<div class="bg-surface-container-lowest rounded-xl p-md shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
<div class="flex items-start justify-between">
<span class="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">Sesiones Mensuales</span>
<div class="w-8 h-8 rounded-lg bg-surface-container-high flex items-center justify-center text-primary">
<span class="material-symbols-outlined text-[20px]">fact_check</span>
</div>
</div>
<div class="mt-base">
<div class="flex items-baseline gap-1">
<span class="font-headline-md text-headline-md text-on-surface font-bold">10</span>
<span class="font-body-lg text-body-lg text-on-surface-variant">/ 12 año 2024</span>
</div>
<div class="font-body-sm text-body-sm text-on-surface-variant mt-0.5">100% efectividad reglamentaria</div>
</div>
<div class="mt-base">
<div class="inline-flex items-center gap-1.5 font-label-sm text-label-sm text-primary bg-surface-container-high px-2 py-1 rounded">
<span class="material-symbols-outlined text-[15px]">verified</span>
<span>Sin meses omitidos</span>
</div>
</div>
</div>
<!-- Card 4: Compromisos Abiertos -->
<div class="bg-surface-container-lowest rounded-xl p-md shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
<div class="flex items-start justify-between">
<span class="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">Compromisos Abiertos</span>
<div class="w-8 h-8 rounded-lg bg-surface-container-high flex items-center justify-center text-secondary">
<span class="material-symbols-outlined text-[20px]">pending_actions</span>
</div>
</div>
<div class="mt-base">
<div class="flex items-baseline gap-1">
<span class="font-headline-md text-headline-md text-secondary font-bold">05</span>
<span class="font-body-sm text-body-sm text-on-surface-variant">En curso</span>
</div>
<div class="font-body-sm text-body-sm text-on-surface-variant mt-0.5">Asignados a Gerencia, Mtto &amp; SST</div>
</div>
<div class="mt-base flex items-center gap-1 text-on-surface-variant font-label-sm text-label-sm">
<span class="w-2 h-2 rounded-full bg-secondary"></span>
<span>4 con avance &gt; 60%</span>
</div>
</div>
<!-- Card 5: Compromisos Vencidos -->
<div class="bg-surface-container-lowest rounded-xl p-md shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
<div class="flex items-start justify-between">
<span class="font-label-sm text-label-sm text-error uppercase tracking-wider font-semibold">Compromisos Vencidos</span>
<div class="w-8 h-8 rounded-lg bg-error-container flex items-center justify-center text-error">
<span class="material-symbols-outlined text-[20px]">warning</span>
</div>
</div>
<div class="mt-base">
<div class="flex items-baseline gap-1">
<span class="font-headline-md text-headline-md text-error font-bold">01</span>
<span class="font-body-sm text-body-sm text-error font-semibold">Crítico</span>
</div>
<div class="font-body-sm text-body-sm text-on-surface-variant mt-0.5">Ergonomía Tijeras Poda</div>
</div>
<div class="mt-base">
<span class="inline-flex items-center gap-1 bg-error-container text-on-error-container font-label-sm text-label-sm px-2 py-0.5 rounded font-medium">
          Intervención Presidencia COPASST
        </span>
</div>
</div>
</div>
<!-- Directorio Paritario Oficial -->
<div class="bg-surface-container-lowest rounded-xl p-md shadow-sm mb-md">
<div class="flex flex-col lg:flex-row lg:items-center justify-between gap-base pb-base">
<div class="flex items-center gap-base">
<div class="w-10 h-10 rounded-lg bg-surface-container-high flex items-center justify-center text-primary">
<span class="material-symbols-outlined text-[24px]">diversity_3</span>
</div>
<div>
<h2 class="font-headline-md text-headline-md text-on-surface">Composición Paritaria Oficial (2023 - 2025)</h2>
<p class="font-body-sm text-body-sm text-on-surface-variant">
            Representación 50/50 empleador y trabajadores acorde a nómina &gt; 50 colaboradores directos en campo y empaque.
          </p>
</div>
</div>
<div class="flex items-center gap-xs flex-wrap">
<span class="bg-surface-container-low text-primary font-label-sm text-label-sm px-base py-1 rounded-full font-medium">
          6 Integrantes Registrados
        </span>
<span class="bg-secondary-fixed text-on-secondary-fixed font-label-sm text-label-sm px-base py-1 rounded-full font-medium">
          Dedicación: 4h/semana mín. legal
        </span>
<button class="p-1.5 rounded-lg text-on-surface-variant hover:bg-surface-container-high transition-colors" title="Exportar directorio" type="button">
<span class="material-symbols-outlined text-[20px]">download</span>
</button>
</div>
</div>
<!-- Table Directory -->
<div class="overflow-x-auto mt-xs">
<table class="w-full text-left border-collapse">
<thead>
<tr class="bg-surface-container-low text-on-surface-variant font-label-sm text-label-sm uppercase tracking-wider">
<th class="py-sm px-base rounded-l-lg">Miembro &amp; Cédula</th>
<th class="py-sm px-base">Cargo en Empresa</th>
<th class="py-sm px-base">Rol COPASST</th>
<th class="py-sm px-base">Representación</th>
<th class="py-sm px-base">Dedicación Sem.</th>
<th class="py-sm px-base">Curso 50h / 20h SST</th>
<th class="py-sm px-base">Asistencia</th>
<th class="py-sm px-base text-right rounded-r-lg">Acción</th>
</tr>
</thead>
<tbody class="font-body-sm text-body-sm text-on-surface">
<!-- Row 1: Presidente -->
<tr class="hover:bg-surface-container-low/60 transition-colors">
<td class="py-base px-base">
<div class="flex items-center gap-sm">
<div class="w-9 h-9 rounded-full bg-primary-container text-on-primary font-semibold flex items-center justify-center shrink-0">
                  HT
                </div>
<div>
<div class="font-label-md text-label-md font-semibold text-on-surface">Ing. Hernán Toro</div>
<div class="font-label-sm text-label-sm text-on-surface-variant">C.C. 71.392.104 • Grupo Manzanares S.A.S.</div>
</div>
</div>
</td>
<td class="py-base px-base">
<span class="font-medium text-on-surface">Superintendente Agronómico</span>
<div class="font-label-sm text-label-sm text-on-surface-variant">Sede Operativa Fincas</div>
</td>
<td class="py-base px-base">
<span class="inline-flex items-center gap-1 bg-primary text-on-primary font-label-sm text-label-sm px-2.5 py-0.5 rounded-full font-semibold">
<span class="material-symbols-outlined text-[13px]">gavel</span>
                Presidente
              </span>
</td>
<td class="py-base px-base">
<span class="inline-flex items-center gap-1 font-label-sm text-label-sm font-semibold text-primary bg-surface-container-high px-2 py-0.5 rounded">
                Principal Empleador
              </span>
</td>
<td class="py-base px-base font-medium">4.5 h / sem</td>
<td class="py-base px-base">
<span class="inline-flex items-center gap-1 text-primary font-label-sm text-label-sm font-medium">
<span class="material-symbols-outlined text-[16px] text-secondary">verified</span>
                Vigente (Exp. 2026)
              </span>
</td>
<td class="py-base px-base">
<div class="flex items-center gap-base">
<span class="font-semibold text-primary">100%</span>
<span class="font-label-sm text-label-sm text-on-surface-variant">(10/10)</span>
</div>
</td>
<td class="py-base px-base text-right">
<button class="p-1 text-on-surface-variant hover:text-primary transition-colors">
<span class="material-symbols-outlined text-[18px]">contact_page</span>
</button>
</td>
</tr>
<!-- Row 2: Secretario -->
<tr class="bg-surface-container-low/30 hover:bg-surface-container-low/60 transition-colors">
<td class="py-base px-base">
<div class="flex items-center gap-sm">
<div class="w-9 h-9 rounded-full bg-secondary text-on-secondary font-semibold flex items-center justify-center shrink-0">
                  CR
                </div>
<div>
<div class="font-label-md text-label-md font-semibold text-on-surface">Carlos Ramos</div>
<div class="font-label-sm text-label-sm text-on-surface-variant">C.C. 1.037.481.922 • Grupo Manzanares S.A.S.</div>
</div>
</div>
</td>
<td class="py-base px-base">
<span class="font-medium text-on-surface">Técnico de Campo &amp; Riego</span>
<div class="font-label-sm text-label-sm text-on-surface-variant">Finca La Primavera</div>
</td>
<td class="py-base px-base">
<span class="inline-flex items-center gap-1 bg-secondary text-on-secondary font-label-sm text-label-sm px-2.5 py-0.5 rounded-full font-semibold">
<span class="material-symbols-outlined text-[13px]">edit_note</span>
                Secretario
              </span>
</td>
<td class="py-base px-base">
<span class="inline-flex items-center gap-1 font-label-sm text-label-sm font-semibold text-secondary bg-surface-container px-2 py-0.5 rounded">
                Principal Trabajadores
              </span>
</td>
<td class="py-base px-base font-medium">4.0 h / sem</td>
<td class="py-base px-base">
<span class="inline-flex items-center gap-1 text-primary font-label-sm text-label-sm font-medium">
<span class="material-symbols-outlined text-[16px] text-secondary">verified</span>
                Vigente (Exp. 2025)
              </span>
</td>
<td class="py-base px-base">
<div class="flex items-center gap-base">
<span class="font-semibold text-primary">100%</span>
<span class="font-label-sm text-label-sm text-on-surface-variant">(10/10)</span>
</div>
</td>
<td class="py-base px-base text-right">
<button class="p-1 text-on-surface-variant hover:text-primary transition-colors">
<span class="material-symbols-outlined text-[18px]">contact_page</span>
</button>
</td>
</tr>
<!-- Row 3: Vocal 1 -->
<tr class="hover:bg-surface-container-low/60 transition-colors">
<td class="py-base px-base">
<div class="flex items-center gap-sm">
<div class="w-9 h-9 rounded-full bg-surface-container-highest text-primary font-semibold flex items-center justify-center shrink-0">
                  CO
                </div>
<div>
<div class="font-label-md text-label-md font-semibold text-on-surface">Dra. Claudia Ortiz</div>
<div class="font-label-sm text-label-sm text-on-surface-variant">C.C. 43.882.115 • Grupo Manzanares S.A.S.</div>
</div>
</div>
</td>
<td class="py-base px-base">
<span class="font-medium text-on-surface">Médica Laboral / SST</span>
<div class="font-label-sm text-label-sm text-on-surface-variant">Sede Administrativa Central</div>
</td>
<td class="py-base px-base">
<span class="inline-flex items-center gap-1 bg-surface-container-highest text-on-surface font-label-sm text-label-sm px-2.5 py-0.5 rounded-full font-medium">
                Vocal Principal
              </span>
</td>
<td class="py-base px-base">
<span class="inline-flex items-center gap-1 font-label-sm text-label-sm font-semibold text-primary bg-surface-container-high px-2 py-0.5 rounded">
                Principal Empleador
              </span>
</td>
<td class="py-base px-base font-medium">5.0 h / sem</td>
<td class="py-base px-base">
<span class="inline-flex items-center gap-1 text-primary font-label-sm text-label-sm font-medium">
<span class="material-symbols-outlined text-[16px] text-secondary">verified</span>
                Vigente (Especialista)
              </span>
</td>
<td class="py-base px-base">
<div class="flex items-center gap-base">
<span class="font-semibold text-primary">90%</span>
<span class="font-label-sm text-label-sm text-on-surface-variant">(9/10)</span>
</div>
</td>
<td class="py-base px-base text-right">
<button class="p-1 text-on-surface-variant hover:text-primary transition-colors">
<span class="material-symbols-outlined text-[18px]">contact_page</span>
</button>
</td>
</tr>
<!-- Row 4: Vocal 2 -->
<tr class="bg-surface-container-low/30 hover:bg-surface-container-low/60 transition-colors">
<td class="py-base px-base">
<div class="flex items-center gap-sm">
<div class="w-9 h-9 rounded-full bg-surface-container-highest text-primary font-semibold flex items-center justify-center shrink-0">
                  JR
                </div>
<div>
<div class="font-label-md text-label-md font-semibold text-on-surface">Julián Restrepo</div>
<div class="font-label-sm text-label-sm text-on-surface-variant">C.C. 98.621.004 • Grupo Manzanares S.A.S.</div>
</div>
</div>
</td>
<td class="py-base px-base">
<span class="font-medium text-on-surface">Líder Cuadrilla Cosecha</span>
<div class="font-label-sm text-label-sm text-on-surface-variant">Finca El Paraíso</div>
</td>
<td class="py-base px-base">
<span class="inline-flex items-center gap-1 bg-surface-container-highest text-on-surface font-label-sm text-label-sm px-2.5 py-0.5 rounded-full font-medium">
                Vocal Principal
              </span>
</td>
<td class="py-base px-base">
<span class="inline-flex items-center gap-1 font-label-sm text-label-sm font-semibold text-secondary bg-surface-container px-2 py-0.5 rounded">
                Principal Trabajadores
              </span>
</td>
<td class="py-base px-base font-medium">4.0 h / sem</td>
<td class="py-base px-base">
<span class="inline-flex items-center gap-1 text-primary font-label-sm text-label-sm font-medium">
<span class="material-symbols-outlined text-[16px] text-secondary">verified</span>
                Vigente (Exp. 2026)
              </span>
</td>
<td class="py-base px-base">
<div class="flex items-center gap-base">
<span class="font-semibold text-primary">100%</span>
<span class="font-label-sm text-label-sm text-on-surface-variant">(10/10)</span>
</div>
</td>
<td class="py-base px-base text-right">
<button class="p-1 text-on-surface-variant hover:text-primary transition-colors">
<span class="material-symbols-outlined text-[18px]">contact_page</span>
</button>
</td>
</tr>
<!-- Row 5: Suplente Empleador -->
<tr class="hover:bg-surface-container-low/60 transition-colors">
<td class="py-base px-base">
<div class="flex items-center gap-sm">
<div class="w-9 h-9 rounded-full bg-surface-container-high text-on-surface-variant font-semibold flex items-center justify-center shrink-0">
                  SL
                </div>
<div>
<div class="font-label-md text-label-md font-semibold text-on-surface">Sofía Londoño</div>
<div class="font-label-sm text-label-sm text-on-surface-variant">C.C. 32.744.910 • Grupo Manzanares S.A.S.</div>
</div>
</div>
</td>
<td class="py-base px-base">
<span class="font-medium text-on-surface">Jefe Administrativa &amp; Compras</span>
<div class="font-label-sm text-label-sm text-on-surface-variant">Sede Administrativa</div>
</td>
<td class="py-base px-base">
<span class="inline-flex items-center gap-1 bg-surface-container-high text-on-surface-variant font-label-sm text-label-sm px-2.5 py-0.5 rounded-full">
                Vocal Suplente
              </span>
</td>
<td class="py-base px-base">
<span class="inline-flex items-center gap-1 font-label-sm text-label-sm font-medium text-primary bg-surface-container-low px-2 py-0.5 rounded">
                Suplente Empleador
              </span>
</td>
<td class="py-base px-base font-medium">4.0 h / sem</td>
<td class="py-base px-base">
<span class="inline-flex items-center gap-1 text-primary font-label-sm text-label-sm font-medium">
<span class="material-symbols-outlined text-[16px] text-secondary">verified</span>
                Vigente (Exp. 2025)
              </span>
</td>
<td class="py-base px-base">
<div class="flex items-center gap-base">
<span class="font-semibold text-primary">90%</span>
<span class="font-label-sm text-label-sm text-on-surface-variant">(9/10)</span>
</div>
</td>
<td class="py-base px-base text-right">
<button class="p-1 text-on-surface-variant hover:text-primary transition-colors">
<span class="material-symbols-outlined text-[18px]">contact_page</span>
</button>
</td>
</tr>
<!-- Row 6: Suplente Trabajador -->
<tr class="bg-surface-container-low/30 hover:bg-surface-container-low/60 transition-colors">
<td class="py-base px-base">
<div class="flex items-center gap-sm">
<div class="w-9 h-9 rounded-full bg-surface-container-high text-on-surface-variant font-semibold flex items-center justify-center shrink-0">
                  MA
                </div>
<div>
<div class="font-label-md text-label-md font-semibold text-on-surface">Marlon Arias</div>
<div class="font-label-sm text-label-sm text-on-surface-variant">C.C. 1.020.394.881 • Grupo Manzanares S.A.S.</div>
</div>
</div>
</td>
<td class="py-base px-base">
<span class="font-medium text-on-surface">Operador de Maquinaria Pesada</span>
<div class="font-label-sm text-label-sm text-on-surface-variant">Taller y Maquinaria Agrícola</div>
</td>
<td class="py-base px-base">
<span class="inline-flex items-center gap-1 bg-surface-container-high text-on-surface-variant font-label-sm text-label-sm px-2.5 py-0.5 rounded-full">
                Vocal Suplente
              </span>
</td>
<td class="py-base px-base">
<span class="inline-flex items-center gap-1 font-label-sm text-label-sm font-medium text-secondary bg-surface-container-low px-2 py-0.5 rounded">
                Suplente Trabajadores
              </span>
</td>
<td class="py-base px-base font-medium">4.0 h / sem</td>
<td class="py-base px-base">
<span class="inline-flex items-center gap-1 text-primary font-label-sm text-label-sm font-medium">
<span class="material-symbols-outlined text-[16px] text-secondary">verified</span>
                Vigente (Exp. 2026)
              </span>
</td>
<td class="py-base px-base">
<div class="flex items-center gap-base">
<span class="font-semibold text-primary">100%</span>
<span class="font-label-sm text-label-sm text-on-surface-variant">(10/10)</span>
</div>
</td>
<td class="py-base px-base text-right">
<button class="p-1 text-on-surface-variant hover:text-primary transition-colors">
<span class="material-symbols-outlined text-[18px]">contact_page</span>
</button>
</td>
</tr>
</tbody>
</table>
</div>
</div>
<!-- Two Columns: Actas Mensuales vs Matriz de Compromisos -->
<div class="grid grid-cols-1 lg:grid-cols-12 gap-md mb-md">
<!-- Columna Izquierda: Actas de Sesión 2024 (5 cols) -->
<div class="lg:col-span-5 bg-surface-container-lowest rounded-xl p-md shadow-sm flex flex-col justify-between">
<div>
<div class="flex items-center justify-between pb-sm">
<div class="flex items-center gap-xs">
<span class="material-symbols-outlined text-primary text-[22px]">description</span>
<h3 class="font-headline-md text-headline-md text-on-surface">Libro de Actas (2024)</h3>
</div>
<span class="font-label-sm text-label-sm bg-surface-container-high text-primary px-2.5 py-0.5 rounded font-semibold">
            10 Actas Foliadas
          </span>
</div>
<p class="font-body-sm text-body-sm text-on-surface-variant mb-base">
          Registro legal con validez jurídica, firmas digitales OTP certificadas y custodia de evidencia fotográfica.
        </p>
<!-- Chronological List of Minutes -->
<div class="flex flex-col gap-sm mt-xs">
<!-- Acta 10 -->
<div class="p-sm rounded-lg bg-surface-container-low hover:bg-surface-container transition-colors">
<div class="flex items-start justify-between gap-xs mb-1">
<div>
<div class="flex items-center gap-xs">
<span class="font-label-md text-label-md font-bold text-primary">Acta Ordinaria #10</span>
<span class="font-label-sm text-label-sm bg-surface-container-highest text-primary px-2 py-0.2 rounded font-medium">
                    17/Oct/2024
                  </span>
</div>
<div class="font-body-sm text-body-sm text-on-surface mt-0.5 font-medium">
                  Investigación AT-2024-018 y EPP Poda en Altura
                </div>
</div>
<span class="inline-flex items-center gap-1 font-label-sm text-label-sm bg-surface-container-highest text-primary px-2 py-0.5 rounded-full font-semibold">
<span class="material-symbols-outlined text-[13px] text-secondary">done_all</span>
                4/4 Firmas OTP
              </span>
</div>
<p class="font-body-sm text-body-sm text-on-surface-variant line-clamp-2">
              Se analizó el evento acaecido en el Lote 4 con motosierra de poda y se aprobaron los nuevos protectores auditivos de copa con arnés dieléctrico.
            </p>
<div class="flex items-center justify-between mt-sm pt-xs">
<span class="font-label-sm text-label-sm text-on-surface-variant">Folio: GM-COP-2024-010</span>
<button class="inline-flex items-center gap-1 font-label-sm text-label-sm text-secondary font-semibold hover:underline">
<span class="material-symbols-outlined text-[16px]">picture_as_pdf</span>
<span>Ver y Descargar PDF</span>
</button>
</div>
</div>
<!-- Acta 09 -->
<div class="p-sm rounded-lg bg-surface-container-low hover:bg-surface-container transition-colors">
<div class="flex items-start justify-between gap-xs mb-1">
<div>
<div class="flex items-center gap-xs">
<span class="font-label-md text-label-md font-bold text-primary">Acta Ordinaria #09</span>
<span class="font-label-sm text-label-sm bg-surface-container-highest text-primary px-2 py-0.2 rounded font-medium">
                    19/Sep/2024
                  </span>
</div>
<div class="font-body-sm text-body-sm text-on-surface mt-0.5 font-medium">
                  Semana de la Salud y Recarga de Extintores
                </div>
</div>
<span class="inline-flex items-center gap-1 font-label-sm text-label-sm bg-surface-container-highest text-primary px-2 py-0.5 rounded-full font-semibold">
<span class="material-symbols-outlined text-[13px] text-secondary">done_all</span>
                4/4 Firmas OTP
              </span>
</div>
<p class="font-body-sm text-body-sm text-on-surface-variant line-clamp-2">
              Coordinación de jornadas de tamizaje visual con EPS Sura y verificación del 100% de extintores Solkaflam y PQS en talleres y empaque.
            </p>
<div class="flex items-center justify-between mt-sm pt-xs">
<span class="font-label-sm text-label-sm text-on-surface-variant">Folio: GM-COP-2024-009</span>
<button class="inline-flex items-center gap-1 font-label-sm text-label-sm text-secondary font-semibold hover:underline">
<span class="material-symbols-outlined text-[16px]">picture_as_pdf</span>
<span>Ver y Descargar PDF</span>
</button>
</div>
</div>
<!-- Acta 08 -->
<div class="p-sm rounded-lg bg-surface-container-low hover:bg-surface-container transition-colors">
<div class="flex items-start justify-between gap-xs mb-1">
<div>
<div class="flex items-center gap-xs">
<span class="font-label-md text-label-md font-bold text-primary">Acta Ordinaria #08</span>
<span class="font-label-sm text-label-sm bg-surface-container-highest text-primary px-2 py-0.2 rounded font-medium">
                    15/Ago/2024
                  </span>
</div>
<div class="font-body-sm text-body-sm text-on-surface mt-0.5 font-medium">
                  Plan de Emergencias y Simulacro Distrital
                </div>
</div>
<span class="inline-flex items-center gap-1 font-label-sm text-label-sm bg-surface-container-highest text-primary px-2 py-0.5 rounded-full font-semibold">
<span class="material-symbols-outlined text-[13px] text-secondary">done_all</span>
                4/4 Firmas OTP
              </span>
</div>
<p class="font-body-sm text-body-sm text-on-surface-variant line-clamp-2">
              Evaluación de rutas de evacuación ante conato en bodega de combustibles y sincronización con Brigada Integral.
            </p>
<div class="flex items-center justify-between mt-sm pt-xs">
<span class="font-label-sm text-label-sm text-on-surface-variant">Folio: GM-COP-2024-008</span>
<button class="inline-flex items-center gap-1 font-label-sm text-label-sm text-secondary font-semibold hover:underline">
<span class="material-symbols-outlined text-[16px]">picture_as_pdf</span>
<span>Ver y Descargar PDF</span>
</button>
</div>
</div>
</div>
</div>
<div class="mt-base pt-sm flex items-center justify-between">
<span class="font-label-sm text-label-sm text-on-surface-variant">Mostrando últimas 3 de 10 actas</span>
<button class="font-label-md text-label-md text-secondary font-semibold hover:text-primary transition-colors flex items-center gap-1" type="button">
<span>Ver histórico 2023 - 2024</span>
<span class="material-symbols-outlined text-[18px]">chevron_right</span>
</button>
</div>
</div>
<!-- Columna Derecha: Matriz de Compromisos y Tareas COPASST (7 cols) -->
<div class="lg:col-span-7 bg-surface-container-lowest rounded-xl p-md shadow-sm flex flex-col justify-between">
<div>
<div class="flex items-center justify-between pb-sm">
<div class="flex items-center gap-xs">
<span class="material-symbols-outlined text-primary text-[22px]">assignment_turned_in</span>
<h3 class="font-headline-md text-headline-md text-on-surface">Matriz de Compromisos &amp; Acuerdos Concertados</h3>
</div>
<span class="font-label-sm text-label-sm bg-surface-container-high text-primary px-2.5 py-0.5 rounded font-semibold">
            Trazabilidad Art. 2.2.4.6.32
          </span>
</div>
<p class="font-body-sm text-body-sm text-on-surface-variant mb-base">
          Seguimiento estricto a las tareas asignadas por el comité a las diferentes dependencias con semaforización de cumplimiento.
        </p>
<!-- List of Agreements -->
<div class="flex flex-col gap-sm">
<!-- Item 1: En Ejecución 80% -->
<div class="p-sm rounded-lg bg-surface-container-low flex flex-col gap-xs">
<div class="flex items-start justify-between gap-base">
<div class="flex items-center gap-2">
<span class="w-2.5 h-2.5 rounded-full bg-secondary shrink-0"></span>
<span class="font-label-md text-label-md font-semibold text-on-surface">
                  Instalación de pasamanos en rampa de empaque Finca El Paraíso
                </span>
</div>
<span class="inline-flex items-center font-label-sm text-label-sm font-semibold px-2 py-0.5 rounded bg-surface-container-high text-primary shrink-0">
                En ejecución (80%)
              </span>
</div>
<div class="flex items-center justify-between text-on-surface-variant font-label-sm text-label-sm mt-1">
<div class="flex items-center gap-md">
<span class="flex items-center gap-1">
<span class="material-symbols-outlined text-[15px]">person</span>
                  Resp: Ing. Marcos Restrepo (Mtto)
                </span>
<span class="flex items-center gap-1">
<span class="material-symbols-outlined text-[15px]">event</span>
                  Límite: 20/Nov/2024
                </span>
</div>
<span class="font-medium text-primary">Derivado de: Acta #09</span>
</div>
<div class="w-full h-1.5 rounded-full bg-surface-container-highest mt-1 overflow-hidden">
<div class="h-full bg-secondary rounded-full" style="width: 80%"></div>
</div>
</div>
<!-- Item 2: Vencido Crítico 🔴 -->
<div class="p-sm rounded-lg bg-error-container/20 flex flex-col gap-xs">
<div class="flex items-start justify-between gap-base">
<div class="flex items-center gap-2">
<span class="w-2.5 h-2.5 rounded-full bg-error shrink-0"></span>
<span class="font-label-md text-label-md font-bold text-on-surface">
                  Revisión ergonómica y cambio de tijeras de poda (Cuadrilla 3)
                </span>
</div>
<span class="inline-flex items-center gap-1 font-label-sm text-label-sm font-bold px-2 py-0.5 rounded bg-error text-on-error shrink-0">
<span class="material-symbols-outlined text-[12px]">schedule</span>
                Vencido (05/Nov)
              </span>
</div>
<div class="flex items-center justify-between text-on-surface-variant font-label-sm text-label-sm mt-1">
<div class="flex items-center gap-md">
<span class="flex items-center gap-1 text-on-surface">
<span class="material-symbols-outlined text-[15px] text-error">person</span>
                  Resp: Dra. Claudia Ortiz &amp; Compras
                </span>
<span class="flex items-center gap-1 text-error font-semibold">
<span class="material-symbols-outlined text-[15px]">event_busy</span>
                  Venció hace 5 días
                </span>
</div>
<span class="font-medium text-error">Derivado de: Acta #08</span>
</div>
<div class="bg-surface-container-lowest p-2 rounded text-body-sm font-body-sm text-error flex items-center justify-between mt-1">
<span>Nota: Pendiente aprobación de cotización por Gerencia Administrativa.</span>
<button class="font-label-sm text-label-sm bg-error text-on-error px-2 py-1 rounded font-semibold hover:bg-on-error-container">
                Escalar a Presidencia
              </button>
</div>
</div>
<!-- Item 3: En Ejecución Normal -->
<div class="p-sm rounded-lg bg-surface-container-low flex flex-col gap-xs">
<div class="flex items-start justify-between gap-base">
<div class="flex items-center gap-2">
<span class="w-2.5 h-2.5 rounded-full bg-secondary-container shrink-0"></span>
<span class="font-label-md text-label-md font-semibold text-on-surface">
                  Actualización de señalización SGA en bodega central de agroquímicos
                </span>
</div>
<span class="inline-flex items-center font-label-sm text-label-sm font-semibold px-2 py-0.5 rounded bg-surface-container-high text-primary shrink-0">
                En ejecución (40%)
              </span>
</div>
<div class="flex items-center justify-between text-on-surface-variant font-label-sm text-label-sm mt-1">
<div class="flex items-center gap-md">
<span class="flex items-center gap-1">
<span class="material-symbols-outlined text-[15px]">person</span>
                  Resp: Sup. Ramón Vélez
                </span>
<span class="flex items-center gap-1">
<span class="material-symbols-outlined text-[15px]">event</span>
                  Límite: 28/Nov/2024
                </span>
</div>
<span class="font-medium text-primary">Derivado de: Inspección #42</span>
</div>
<div class="w-full h-1.5 rounded-full bg-surface-container-highest mt-1 overflow-hidden">
<div class="h-full bg-secondary-container rounded-full" style="width: 40%"></div>
</div>
</div>
<!-- Item 4: Cerrado Exitoso 🟢 -->
<div class="p-sm rounded-lg bg-surface-container-low/60 flex flex-col gap-xs opacity-90">
<div class="flex items-start justify-between gap-base">
<div class="flex items-center gap-2">
<span class="material-symbols-outlined text-primary text-[18px]">check_circle</span>
<span class="font-label-md text-label-md font-medium text-on-surface line-through">
                  Capacitación al comité en metodología de investigación AT Res. 1401
                </span>
</div>
<span class="inline-flex items-center gap-1 font-label-sm text-label-sm font-semibold px-2 py-0.5 rounded bg-surface-container-highest text-primary shrink-0">
                Cerrado con Éxito
              </span>
</div>
<div class="flex items-center justify-between text-on-surface-variant font-label-sm text-label-sm mt-1">
<div class="flex items-center gap-md">
<span class="flex items-center gap-1">
<span class="material-symbols-outlined text-[15px]">business</span>
                  Facilitador: ARL Sura
                </span>
<span class="flex items-center gap-1 text-primary">
<span class="material-symbols-outlined text-[15px]">event_available</span>
                  Ejecutado: 12/Oct/2024
                </span>
</div>
<span class="font-medium text-on-surface-variant">Evidencias cargadas</span>
</div>
</div>
</div>
</div>
<div class="mt-base pt-sm flex items-center justify-between">
<span class="font-label-sm text-label-sm text-on-surface-variant">4 de 5 acuerdos mostrados</span>
<button class="font-label-md text-label-md text-secondary font-semibold hover:text-primary transition-colors flex items-center gap-1" type="button">
<span>Abrir Plan de Acción Completo</span>
<span class="material-symbols-outlined text-[18px]">open_in_new</span>
</button>
</div>
</div>
</div>
<!-- Bottom Section: Capacitaciones COPASST & Vínculo CAPA con Módulo 17 -->
<div class="grid grid-cols-1 lg:grid-cols-3 gap-md">
<!-- Talleres y Competencias del Comité (2 cols) -->
<div class="lg:col-span-2 bg-surface-container-lowest rounded-xl p-md shadow-sm">
<div class="flex items-center justify-between pb-sm mb-base">
<div class="flex items-center gap-xs">
<div class="w-8 h-8 rounded-lg bg-surface-container-high flex items-center justify-center text-primary">
<span class="material-symbols-outlined text-[20px]">school</span>
</div>
<div>
<h3 class="font-headline-md text-headline-md text-on-surface">Plan de Capacitación Exclusivo COPASST</h3>
<span class="font-label-sm text-label-sm text-on-surface-variant">Cumplimiento del Programa Anual de Capacitación Dec. 1072 Art. 2.2.4.6.11</span>
</div>
</div>
<button class="font-label-sm text-label-sm bg-surface-container-high text-primary px-3 py-1.5 rounded-lg font-semibold hover:bg-surface-container-highest transition-colors">
          + Programar Taller
        </button>
</div>
<!-- Workshop Cards Grid -->
<div class="grid grid-cols-1 sm:grid-cols-2 gap-sm">
<div class="p-sm rounded-lg bg-surface-container-low flex flex-col justify-between">
<div>
<div class="flex items-center justify-between mb-1">
<span class="font-label-sm text-label-sm bg-surface-container-high text-primary px-2 py-0.5 rounded font-semibold">Taller Obligatorio</span>
<span class="font-label-sm text-label-sm text-primary font-bold">100% Asistencia</span>
</div>
<h4 class="font-label-md text-label-md font-bold text-on-surface mt-1">
              Responsabilidad Civil, Penal y Laboral en Accidentes de Trabajo
            </h4>
<p class="font-body-sm text-body-sm text-on-surface-variant mt-1">
              Enfoque en culpa patronal (Art. 216 CST) y rol de la vigilancia preventiva del COPASST.
            </p>
</div>
<div class="mt-base pt-xs flex items-center justify-between font-label-sm text-label-sm text-on-surface-variant">
<span>Impartido por: Asesoría Legal ARL</span>
<span class="font-semibold text-on-surface">08 Horas</span>
</div>
</div>
<div class="p-sm rounded-lg bg-surface-container-low flex flex-col justify-between">
<div>
<div class="flex items-center justify-between mb-1">
<span class="font-label-sm text-label-sm bg-surface-container-high text-primary px-2 py-0.5 rounded font-semibold">Inspecciones</span>
<span class="font-label-sm text-label-sm text-primary font-bold">100% Asistencia</span>
</div>
<h4 class="font-label-md text-label-md font-bold text-on-surface mt-1">
              Técnicas de Inspección Planeada en Fincas y Maquinaria Agrícola
            </h4>
<p class="font-body-sm text-body-sm text-on-surface-variant mt-1">
              Detección de condiciones subestándar en tractores, tomas de fuerza y silos de secado.
            </p>
</div>
<div class="mt-base pt-xs flex items-center justify-between font-label-sm text-label-sm text-on-surface-variant">
<span>Impartido por: Coord. SST Manzanares</span>
<span class="font-semibold text-on-surface">06 Horas</span>
</div>
</div>
<div class="p-sm rounded-lg bg-surface-container-low flex flex-col justify-between">
<div>
<div class="flex items-center justify-between mb-1">
<span class="font-label-sm text-label-sm bg-surface-container-high text-primary px-2 py-0.5 rounded font-semibold">Investigación</span>
<span class="font-label-sm text-label-sm text-primary font-bold">100% Asistencia</span>
</div>
<h4 class="font-label-md text-label-md font-bold text-on-surface mt-1">
              Metodología Árbol de Causas e ILCI (Res. 1401 de 2007)
            </h4>
<p class="font-body-sm text-body-sm text-on-surface-variant mt-1">
              Elaboración rigurosa de investigaciones dentro de los 15 días calendario posteriores al suceso.
            </p>
</div>
<div class="mt-base pt-xs flex items-center justify-between font-label-sm text-label-sm text-on-surface-variant">
<span>Impartido por: Especialista SST ARL</span>
<span class="font-semibold text-on-surface">08 Horas</span>
</div>
</div>
<div class="p-sm rounded-lg bg-surface-container-low flex flex-col justify-between">
<div>
<div class="flex items-center justify-between mb-1">
<span class="font-label-sm text-label-sm bg-secondary-fixed text-on-secondary-fixed px-2 py-0.5 rounded font-semibold">Próximo Taller</span>
<span class="font-label-sm text-label-sm text-secondary font-bold">29/Nov/2024</span>
</div>
<h4 class="font-label-md text-label-md font-bold text-on-surface mt-1">
              Primeros Auxilios Básicos &amp; Manejo de Intoxicación por Plaguicidas
            </h4>
<p class="font-body-sm text-body-sm text-on-surface-variant mt-1">
              Protocolo de estabilización rápida y cadena de llamadas ante emergencias en campo.
            </p>
</div>
<div class="mt-base pt-xs flex items-center justify-between font-label-sm text-label-sm text-on-surface-variant">
<span>Convocados: 6/6 Miembros</span>
<span class="font-semibold text-secondary">Cupos confirmados</span>
</div>
</div>
</div>
</div>
<!-- Vínculo CAPA / Acciones Correctivas (1 col) -->
<div class="bg-surface-container-lowest rounded-xl p-md shadow-sm flex flex-col justify-between">
<div>
<div class="flex items-center gap-xs pb-sm mb-base">
<div class="w-8 h-8 rounded-lg bg-surface-container-high flex items-center justify-center text-primary">
<span class="material-symbols-outlined text-[20px]">sync_alt</span>
</div>
<div>
<h3 class="font-headline-md text-headline-md text-on-surface">Articulación CAPA</h3>
<span class="font-label-sm text-label-sm text-on-surface-variant">Módulo 17 • Acciones Correctivas</span>
</div>
</div>
<p class="font-body-sm text-body-sm text-on-surface-variant mb-base">
          El COPASST supervisa y valida la efectividad de las medidas preventivas emanadas de incidentes y hallazgos.
        </p>
<!-- CAPA summary box -->
<div class="p-base rounded-lg bg-surface-container-low flex flex-col gap-sm">
<div class="flex items-center justify-between">
<span class="font-label-md text-label-md font-semibold text-on-surface">CAPAs asignadas a COPASST</span>
<span class="font-headline-md text-headline-md font-bold text-primary">07</span>
</div>
<div class="flex flex-col gap-xs font-label-sm text-label-sm">
<div class="flex justify-between text-on-surface-variant">
<span>Cerradas con verificación de eficacia:</span>
<span class="font-bold text-primary">05</span>
</div>
<div class="flex justify-between text-on-surface-variant">
<span>En seguimiento durante sesiones mensuales:</span>
<span class="font-bold text-secondary">02</span>
</div>
<div class="flex justify-between text-error font-medium">
<span>Requiere revisión inmediata en Acta 11:</span>
<span class="font-bold">01</span>
</div>
</div>
</div>
<div class="mt-base p-base rounded-lg bg-surface-container-high text-primary font-body-sm text-body-sm flex items-start gap-2">
<span class="material-symbols-outlined text-[20px] text-secondary shrink-0">info</span>
<span>Recordatorio: Las recomendaciones del COPASST son vinculantes para la Alta Dirección de acuerdo al Art. 2.2.4.6.32 del Dec. 1072.</span>
</div>
</div>
<div class="mt-base pt-sm">
<a class="w-full inline-flex items-center justify-center gap-xs bg-surface-container-high hover:bg-surface-container-highest text-primary font-label-md text-label-md py-2.5 rounded-lg transition-colors font-semibold" data-path="acciones-correctivas" href="#">
<span>Ir a Módulo 17 (Acciones Correctivas)</span>
<span class="material-symbols-outlined text-[18px]">arrow_forward</span>
</a>
</div>
</div>
</div>
</div></main></div></body></html>

<!DOCTYPE html>

<html lang="es"><head><meta charset="utf-8"/><meta content="width=device-width, initial-scale=1.0" name="viewport"/><link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0" rel="stylesheet"/>
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet"/><style>@layer base{html,body{margin:0;padding:0;}body{overscroll-behavior:none;}main>:first-child{margin-top:0!important;}main>:last-child{margin-bottom:0!important;}}::-webkit-scrollbar{display:none;}</style><script src="https://cdn.tailwindcss.com"></script><script id="tailwind-config">tailwind.config = {
    darkMode: "class",
    theme: {
      extend: {
        "colors": {
          "inverse-surface": "#233144",
          "on-primary": "#ffffff",
          "on-primary-container": "#9ea9ff",
          "secondary-container": "#6063ee",
          "on-tertiary-fixed": "#191c1e",
          "error-container": "#ffdad6",
          "surface-container-low": "#eff4ff",
          "surface-container-highest": "#d5e3fc",
          "on-primary-fixed-variant": "#333f91",
          "secondary-fixed-dim": "#c0c1ff",
          "on-secondary-fixed": "#07006c",
          "surface": "#f8f9ff",
          "primary-fixed": "#dfe0ff",
          "error": "#ba1a1a",
          "tertiary-container": "#404345",
          "on-surface-variant": "#454651",
          "surface-bright": "#f8f9ff",
          "secondary-fixed": "#e1e0ff",
          "surface-container-high": "#dce9ff",
          "tertiary-fixed-dim": "#c4c7c9",
          "surface-container": "#e6eeff",
          "inverse-primary": "#bcc3ff",
          "on-secondary": "#ffffff",
          "outline-variant": "#c6c5d3",
          "primary-fixed-dim": "#bcc3ff",
          "on-tertiary": "#ffffff",
          "surface-dim": "#ccdbf3",
          "on-error": "#ffffff",
          "primary-container": "#2e3a8c",
          "on-primary-fixed": "#000d60",
          "on-background": "#0d1c2e",
          "on-secondary-fixed-variant": "#2f2ebe",
          "secondary": "#4648d4",
          "on-surface": "#0d1c2e",
          "tertiary-fixed": "#e0e3e5",
          "surface-container-lowest": "#ffffff",
          "on-secondary-container": "#fffbff",
          "surface-variant": "#d5e3fc",
          "primary": "#142175",
          "surface-tint": "#4b57aa",
          "background": "#f8f9ff",
          "on-error-container": "#93000a",
          "on-tertiary-fixed-variant": "#444749",
          "inverse-on-surface": "#eaf1ff",
          "tertiary": "#2a2d2f",
          "on-tertiary-container": "#adb0b2",
          "outline": "#767682"
        },
        "borderRadius": {
          "DEFAULT": "0.25rem",
          "lg": "0.5rem",
          "xl": "0.75rem",
          "full": "9999px"
        },
        "spacing": {
          "xs": "4px",
          "xl": "80px",
          "lg": "48px",
          "md": "24px",
          "gutter": "24px",
          "base": "8px",
          "sm": "12px",
          "container-max": "1280px"
        },
        "fontFamily": {
          "body-lg": [
            "Inter"
          ],
          "headline-lg-mobile": [
            "Inter"
          ],
          "label-md": [
            "Inter"
          ],
          "label-sm": [
            "Inter"
          ],
          "body-md": [
            "Inter"
          ],
          "headline-lg": [
            "Inter"
          ],
          "headline-md": [
            "Inter"
          ],
          "display-lg": [
            "Inter"
          ],
          "body-sm": [
            "Inter"
          ]
        },
        "fontSize": {
          "body-lg": [
            "18px",
            {
              "lineHeight": "28px",
              "fontWeight": "400"
            }
          ],
          "headline-lg-mobile": [
            "24px",
            {
              "lineHeight": "32px",
              "fontWeight": "600"
            }
          ],
          "label-md": [
            "14px",
            {
              "lineHeight": "16px",
              "letterSpacing": "0.01em",
              "fontWeight": "500"
            }
          ],
          "label-sm": [
            "12px",
            {
              "lineHeight": "14px",
              "fontWeight": "600"
            }
          ],
          "body-md": [
            "16px",
            {
              "lineHeight": "24px",
              "fontWeight": "400"
            }
          ],
          "headline-lg": [
            "32px",
            {
              "lineHeight": "40px",
              "letterSpacing": "-0.01em",
              "fontWeight": "600"
            }
          ],
          "headline-md": [
            "24px",
            {
              "lineHeight": "32px",
              "fontWeight": "600"
            }
          ],
          "display-lg": [
            "48px",
            {
              "lineHeight": "56px",
              "letterSpacing": "-0.02em",
              "fontWeight": "700"
            }
          ],
          "body-sm": [
            "14px",
            {
              "lineHeight": "20px",
              "fontWeight": "400"
            }
          ]
        }
      },
    },
  }</script></head><body class="bg-background font-body-md text-body-md text-on-surface antialiased"><aside class="fixed left-0 top-0 h-full w-72 bg-surface-container-lowest shadow-[0_1px_8px_rgba(0,0,0,0.04)] z-50 flex flex-col justify-between overflow-y-auto"><div class="p-gutter pb-0"><div class="flex items-center gap-base mb-xs"><div class="w-8 h-8 rounded bg-primary-container flex items-center justify-center text-on-primary font-headline-md text-headline-md">M</div><div class="flex flex-col"><span class="font-label-md text-label-md text-primary leading-tight font-semibold">Grupo Manzanares S.A.S.</span><span class="font-label-sm text-label-sm text-on-surface-variant">SG-SST Operativo</span></div></div><div class="flex items-center gap-xs mt-base mb-md"><span class="bg-surface-container-high text-on-surface font-label-sm text-label-sm px-xs py-0.5 rounded">Dec. 1072</span><span class="bg-surface-container-high text-on-surface font-label-sm text-label-sm px-xs py-0.5 rounded">Res. 0312</span></div></div><nav class="flex-1 px-sm pb-gutter flex flex-col gap-base" data-active-classes="bg-primary-container text-on-primary font-medium rounded-lg"><div class="flex flex-col gap-xs"><span class="px-xs font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">Gestión Operativa</span><a class="px-sm py-xs rounded-lg text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-colors font-label-md text-label-md" data-path="dashboard" href="#">Inicio / Dashboard</a><a class="px-sm py-xs rounded-lg text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-colors font-label-md text-label-md" data-path="trabajadores" href="#">Trabajadores</a><a class="px-sm py-xs rounded-lg text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-colors font-label-md text-label-md" data-path="examenes-medicos" href="#">Exámenes Médicos (EMOS)</a><a class="px-sm py-xs rounded-lg text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-colors font-label-md text-label-md" data-path="casos-de-salud" href="#">Casos de Salud</a><a class="px-sm py-xs rounded-lg text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-colors font-label-md text-label-md" data-path="incapacidades-y-reintegros" href="#">Incapacidades y Reintegros</a></div><div class="flex flex-col gap-xs"><span class="px-xs font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">Riesgos Críticos &amp; Viales</span><a class="px-sm py-xs rounded-lg text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-colors font-label-md text-label-md" data-path="trabajo-en-alturas" href="#">Trabajo en Alturas</a><a class="px-sm py-xs rounded-lg text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-colors font-label-md text-label-md" data-path="tractoristas-operadores" href="#">Tractoristas / Operadores</a><a class="px-sm py-xs rounded-lg text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-colors font-label-md text-label-md" data-path="pesv-seguridad-vial" href="#">PESV (Seguridad Vial)</a><a class="px-sm py-xs rounded-lg text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-colors font-label-md text-label-md" data-path="epp" href="#">EPP</a></div><div class="flex flex-col gap-xs"><span class="px-xs font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">Inspección &amp; Eventos</span><a class="px-sm py-xs rounded-lg text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-colors font-label-md text-label-md" data-path="inspecciones" href="#">Inspecciones</a><a class="px-sm py-xs rounded-lg text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-colors font-label-md text-label-md" data-path="accidentes-e-incidentes" href="#">Accidentes e Incidentes</a><a class="px-sm py-xs rounded-lg text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-colors font-label-md text-label-md" data-path="investigaciones" href="#">Investigaciones</a><a class="px-sm py-xs rounded-lg text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-colors font-label-md text-label-md" data-path="acciones-correctivas" href="#">Acciones Correctivas</a></div><div class="flex flex-col gap-xs"><span class="px-xs font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">Comités &amp; Cultura</span><a class="px-sm py-xs rounded-lg text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-colors font-label-md text-label-md" data-path="capacitaciones" href="#">Capacitaciones</a><a class="px-sm py-xs rounded-lg text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-colors font-label-md text-label-md" data-path="documentos-sg-sst" href="#">Documentos SG-SST</a><a class="px-sm py-xs rounded-lg text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-colors font-label-md text-label-md" data-path="20-copasst" href="#">20. COPASST</a><a class="px-sm py-xs rounded-lg text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-colors font-label-md text-label-md" data-path="21-ccl-convivencia-laboral" href="#">21. CCL (Convivencia Laboral)</a><a class="px-sm py-xs rounded-lg text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-colors font-label-md text-label-md" data-path="22-plan-de-emergencias-y-brigada" href="#">22. Plan de Emergencias y Brigada</a><a class="px-sm py-xs rounded-lg text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-colors font-label-md text-label-md" data-path="quimicos" href="#">Químicos</a></div></nav></aside><div class="pl-72"><header class="fixed top-0 left-72 right-0 h-16 bg-surface-container-lowest/90 backdrop-blur-xl shadow-[0_1px_8px_rgba(0,0,0,0.04)] z-40 flex items-center justify-between px-gutter"><div class="flex items-center gap-md flex-1 max-w-xl"><div class="relative w-full"><span class="material-symbols-outlined absolute left-sm top-1/2 -translate-y-1/2 text-on-surface-variant text-[20px]">search</span><input class="w-full bg-surface-container-low text-on-surface placeholder:text-on-surface-variant pl-10 pr-sm py-xs rounded-lg font-body-sm text-body-sm focus:outline-none focus:ring-2 focus:ring-secondary-container transition-all" placeholder="Buscar trabajadores, incidentes, normativas..." type="search"/></div><div class="flex items-center bg-surface-container-low px-sm py-xs rounded-lg gap-xs shrink-0"><span class="material-symbols-outlined text-[18px] text-on-surface-variant">gavel</span><span class="font-label-sm text-label-sm text-on-surface">Estándares 2024</span><span class="material-symbols-outlined text-[16px] text-on-surface-variant">expand_more</span></div></div><div class="flex items-center gap-base"><button class="flex items-center gap-xs bg-primary-container text-on-primary px-sm py-xs rounded-lg font-label-md text-label-md hover:bg-primary transition-colors" type="button"><span class="material-symbols-outlined text-[18px]">add_alert</span><span>Reporte Rápido / Notificación</span></button><button class="relative w-10 h-10 flex items-center justify-center rounded-lg hover:bg-surface-container-high transition-colors text-on-surface-variant" type="button"><span class="material-symbols-outlined text-[22px]">notifications</span><span class="absolute top-2 right-2 w-2 h-2 rounded-full bg-error"></span></button><div class="flex items-center gap-sm pl-xs"><div class="text-right hidden xl:block"><div class="font-label-md text-label-md text-on-surface font-medium">Ing. Andrés Valencia</div><div class="font-label-sm text-label-sm text-on-surface-variant">Coordinador SG-SST</div></div><div class="w-8 h-8 rounded-full bg-primary flex items-center justify-center"><span class="material-symbols-outlined text-on-primary text-[18px]">person</span></div></div></div></header><main class="w-full px-gutter pt-16 bg-surface min-h-screen"><div class="flex flex-col w-full gap-md pb-xl">
<!-- 1. Encabezado de módulo -->
<section class="flex flex-col gap-base">
<div class="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-base">
<div class="flex flex-col gap-xs max-w-3xl">
<div class="flex items-center gap-xs flex-wrap">
<span class="px-sm py-0.5 rounded-full bg-primary-container text-on-primary font-label-sm text-label-sm">Ley 1010 de 2006</span>
<span class="px-sm py-0.5 rounded-full bg-surface-container-highest text-primary font-label-sm text-label-sm">Res. 652 y 1356 de 2012</span>
<span class="px-sm py-0.5 rounded-full bg-surface-container-high text-on-surface-variant font-label-sm text-label-sm">Res. 2764 de 2022 (Batería Psicosocial)</span>
<span class="px-sm py-0.5 rounded-full bg-secondary-fixed text-on-secondary-fixed font-label-sm text-label-sm">Vigencia 2024 - 2026</span>
</div>
<h1 class="font-headline-lg text-headline-lg text-primary tracking-tight">21. Comité de Convivencia Laboral (CCL)</h1>
<p class="font-body-md text-body-md text-on-surface-variant">
          Mecanismo de prevención y solución preventiva del acoso laboral, promoción de ambientes de trabajo saludables y garantía estricta del debido proceso y confidencialidad.
        </p>
</div>
<div class="flex items-center gap-xs flex-wrap shrink-0">
<button class="flex items-center gap-xs px-sm py-base bg-surface-container-lowest text-primary rounded-lg shadow-sm hover:bg-surface-container transition-colors font-label-md text-label-md" type="button">
<span class="material-symbols-outlined text-[18px]">calendar_month</span>
<span>Sesiones Trimestrales</span>
</button>
<button class="flex items-center gap-xs px-sm py-base bg-surface-container-lowest text-on-surface rounded-lg shadow-sm hover:bg-surface-container transition-colors font-label-md text-label-md" type="button">
<span class="material-symbols-outlined text-[18px]">download</span>
<span>Informe Semestral</span>
</button>
<button class="flex items-center gap-xs px-sm py-base bg-primary text-on-primary rounded-lg shadow-md hover:bg-primary-container hover:text-on-primary transition-all font-label-md text-label-md" type="button">
<span class="material-symbols-outlined text-[18px]">lock</span>
<span>+ Registrar Solicitud Preventiva</span>
</button>
</div>
</div>
</section>
<!-- 2. REQUISITO CRÍTICO DE CONFIDENCIALIDAD -->
<section class="relative overflow-hidden rounded-xl bg-gradient-to-r from-primary via-primary-container to-secondary-container text-on-primary p-md shadow-md">
<div class="relative z-10 flex flex-col md:flex-row items-start md:items-center gap-md">
<div class="w-12 h-12 rounded-lg bg-surface-container-lowest/10 backdrop-blur-md flex items-center justify-center shrink-0">
<span class="material-symbols-outlined text-[30px] text-primary-fixed">security</span>
</div>
<div class="flex flex-col gap-xs flex-1">
<div class="flex items-center gap-xs">
<span class="font-label-sm text-label-sm uppercase tracking-wider text-on-primary-container font-semibold">Reserva Legal Art. 6 Res. 652/2012</span>
<span class="px-xs py-0.5 rounded bg-surface-container-lowest/20 font-label-sm text-label-sm">Custodia Blindada</span>
</div>
<p class="font-body-sm text-body-sm text-inverse-on-surface leading-relaxed">
<strong>PROTOCOLO DE PRIVACIDAD Y SECRETO PROFESIONAL:</strong> Los miembros del CCL mantendrán estricta reserva de la información conocida en las quejas. Este tablero presenta únicamente estadísticas consolidadas, trazabilidad paramétrica de términos y planes de convivencia sin exponer identidades, testimonios ni detalles sensibles de los casos.
        </p>
</div>
<div class="shrink-0 flex items-center gap-xs bg-surface-container-lowest/10 px-sm py-xs rounded-lg backdrop-blur-sm">
<span class="material-symbols-outlined text-[18px] text-secondary-fixed">vpn_key</span>
<span class="font-label-sm text-label-sm text-secondary-fixed">Cifrado AES-256</span>
</div>
</div>
</section>
<!-- 3. Dashboard Superior de Métricas Preventivas -->
<section class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-base">
<!-- Tarjeta 1 -->
<div class="flex flex-col justify-between p-md rounded-xl bg-surface-container-lowest shadow-sm hover:shadow-md transition-shadow">
<div class="flex items-center justify-between">
<span class="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">Vigencia CCL</span>
<span class="w-8 h-8 rounded-lg bg-surface-container-low flex items-center justify-center text-primary">
<span class="material-symbols-outlined text-[18px]">event_available</span>
</span>
</div>
<div class="flex flex-col gap-xs mt-base">
<span class="font-headline-md text-headline-md text-primary">2024 - 2026</span>
<span class="font-label-sm text-label-sm text-on-surface-variant">Elegido 15/Ene/2024 • 24 Meses</span>
</div>
<div class="w-full bg-surface-container rounded-full h-1.5 mt-sm">
<div class="bg-secondary-container h-1.5 rounded-full" style="width: 42%;"></div>
</div>
</div>
<!-- Tarjeta 2 -->
<div class="flex flex-col justify-between p-md rounded-xl bg-surface-container-lowest shadow-sm hover:shadow-md transition-shadow">
<div class="flex items-center justify-between">
<span class="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">Sesiones Ordinarias</span>
<span class="w-8 h-8 rounded-lg bg-surface-container-low flex items-center justify-center text-primary">
<span class="material-symbols-outlined text-[18px]">groups</span>
</span>
</div>
<div class="flex flex-col gap-xs mt-base">
<div class="flex items-baseline gap-xs">
<span class="font-headline-md text-headline-md text-on-surface font-semibold">4 / 4</span>
<span class="font-label-sm text-label-sm text-secondary-container font-medium">100% Cumplido</span>
</div>
<span class="font-label-sm text-label-sm text-on-surface-variant">Q1, Q2, Q3 + Extraordinaria</span>
</div>
<div class="flex gap-1 mt-sm">
<span class="h-1.5 flex-1 rounded-full bg-secondary-container"></span>
<span class="h-1.5 flex-1 rounded-full bg-secondary-container"></span>
<span class="h-1.5 flex-1 rounded-full bg-secondary-container"></span>
<span class="h-1.5 flex-1 rounded-full bg-secondary-container"></span>
</div>
</div>
<!-- Tarjeta 3 -->
<div class="flex flex-col justify-between p-md rounded-xl bg-surface-container-lowest shadow-sm hover:shadow-md transition-shadow">
<div class="flex items-center justify-between">
<span class="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">Casos Activos</span>
<span class="w-8 h-8 rounded-lg bg-surface-container-high flex items-center justify-center text-secondary">
<span class="material-symbols-outlined text-[18px]">folder_open</span>
</span>
</div>
<div class="flex flex-col gap-xs mt-base">
<div class="flex items-baseline gap-xs">
<span class="font-headline-md text-headline-md text-primary">02</span>
<span class="font-label-sm text-label-sm text-on-surface-variant">En gestión temprana</span>
</div>
<span class="font-label-sm text-label-sm text-on-surface-variant">01 Diálogo • 01 Verificación</span>
</div>
<span class="font-label-sm text-label-sm text-on-surface-variant mt-sm">06 archivados/resueltos año</span>
</div>
<!-- Tarjeta 4 -->
<div class="flex flex-col justify-between p-md rounded-xl bg-surface-container-lowest shadow-sm hover:shadow-md transition-shadow">
<div class="flex items-center justify-between">
<span class="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">Eficacia Acuerdos</span>
<span class="w-8 h-8 rounded-lg bg-surface-container-low flex items-center justify-center text-primary">
<span class="material-symbols-outlined text-[18px]">handshake</span>
</span>
</div>
<div class="flex flex-col gap-xs mt-base">
<span class="font-headline-md text-headline-md text-primary">92%</span>
<span class="font-label-sm text-label-sm text-on-surface-variant">Sin escalamiento a MinTrabajo</span>
</div>
<div class="w-full bg-surface-container rounded-full h-1.5 mt-sm">
<div class="bg-primary h-1.5 rounded-full" style="width: 92%;"></div>
</div>
</div>
<!-- Tarjeta 5 -->
<div class="flex flex-col justify-between p-md rounded-xl bg-surface-container-lowest shadow-sm hover:shadow-md transition-shadow">
<div class="flex items-center justify-between">
<span class="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">Plan Clima Laboral</span>
<span class="w-8 h-8 rounded-lg bg-surface-container-low flex items-center justify-center text-secondary">
<span class="material-symbols-outlined text-[18px]">psychology</span>
</span>
</div>
<div class="flex flex-col gap-xs mt-base">
<span class="font-headline-md text-headline-md text-on-surface font-semibold">8 Talleres</span>
<span class="font-label-sm text-label-sm text-on-surface-variant">Asertividad y Manejo Estrés</span>
</div>
<span class="font-label-sm text-label-sm text-primary font-medium mt-sm">Meta Anual: 10 Ejecuciones</span>
</div>
</section>
<!-- 4. Matriz de Integrantes Paritarios del CCL -->
<section class="flex flex-col gap-sm rounded-xl bg-surface-container-lowest p-md shadow-sm">
<div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-xs">
<div>
<h2 class="font-headline-md text-headline-md text-primary">Conformación Paritaria del CCL (2024 - 2026)</h2>
<p class="font-body-sm text-body-sm text-on-surface-variant">Elegidos conforme al procedimiento de votación secreta y designación formal de gerencia (Res. 652/2012)</p>
</div>
<span class="inline-flex items-center gap-xs px-sm py-xs rounded-lg bg-surface-container-high text-on-surface font-label-sm text-label-sm self-start sm:self-auto">
<span class="w-2 h-2 rounded-full bg-secondary-container"></span>
        100% Acuerdos de Confidencialidad Firmados
      </span>
</div>
<div class="overflow-x-auto">
<table class="w-full text-left">
<thead>
<tr class="bg-surface-container-low text-on-surface-variant font-label-sm text-label-sm uppercase tracking-wider">
<th class="p-sm">Miembro / Trabajador</th>
<th class="p-sm">Rol en el CCL</th>
<th class="p-sm">Representación</th>
<th class="p-sm">Sede / Área</th>
<th class="p-sm">Pacto Confidencialidad</th>
<th class="p-sm">Capacitación Mediación</th>
<th class="p-sm text-right">Contacto Seguro</th>
</tr>
</thead>
<tbody class="divide-y divide-surface-container font-body-sm text-body-sm text-on-surface">
<!-- Presidente -->
<tr class="hover:bg-surface-container-low transition-colors">
<td class="p-sm">
<div class="flex items-center gap-sm">
<div class="w-8 h-8 rounded-full bg-primary-container text-on-primary flex items-center justify-center font-label-sm text-label-sm font-semibold">MG</div>
<div>
<div class="font-label-md text-label-md font-semibold text-primary">Lic. Mariana Gómez</div>
<div class="font-label-sm text-label-sm text-on-surface-variant">Jefe de Gestión Humana</div>
</div>
</div>
</td>
<td class="p-sm">
<span class="px-xs py-0.5 rounded bg-primary text-on-primary font-label-sm text-label-sm">Presidenta CCL</span>
</td>
<td class="p-sm">Designada Empleador</td>
<td class="p-sm">Sede Central - Manizales</td>
<td class="p-sm">
<span class="inline-flex items-center gap-1 font-label-sm text-label-sm text-primary font-medium">
<span class="material-symbols-outlined text-[16px] text-secondary-container">verified</span> Radicado 2024-C01
              </span>
</td>
<td class="p-sm">
<span class="px-xs py-0.5 rounded bg-surface-container font-label-sm text-label-sm">Certificada 40h (SENA)</span>
</td>
<td class="p-sm text-right">
<button class="p-xs hover:bg-surface-container-high rounded text-on-surface-variant" title="Buzón directo institucional" type="button">
<span class="material-symbols-outlined text-[18px]">mail</span>
</button>
</td>
</tr>
<!-- Secretaria -->
<tr class="hover:bg-surface-container-low transition-colors">
<td class="p-sm">
<div class="flex items-center gap-sm">
<div class="w-8 h-8 rounded-full bg-secondary-container text-on-secondary-container flex items-center justify-center font-label-sm text-label-sm font-semibold">EV</div>
<div>
<div class="font-label-md text-label-md font-semibold text-on-surface">Elena Valencia</div>
<div class="font-label-sm text-label-sm text-on-surface-variant">Asistente Operativa Fincas</div>
</div>
</div>
</td>
<td class="p-sm">
<span class="px-xs py-0.5 rounded bg-secondary text-on-secondary font-label-sm text-label-sm">Secretaria CCL</span>
</td>
<td class="p-sm">Elegida por Trabajadores</td>
<td class="p-sm">Finca La Esperanza</td>
<td class="p-sm">
<span class="inline-flex items-center gap-1 font-label-sm text-label-sm text-primary font-medium">
<span class="material-symbols-outlined text-[16px] text-secondary-container">verified</span> Radicado 2024-C02
              </span>
</td>
<td class="p-sm">
<span class="px-xs py-0.5 rounded bg-surface-container font-label-sm text-label-sm">Certificada ARL Sura</span>
</td>
<td class="p-sm text-right">
<button class="p-xs hover:bg-surface-container-high rounded text-on-surface-variant" title="Buzón directo institucional" type="button">
<span class="material-symbols-outlined text-[18px]">mail</span>
</button>
</td>
</tr>
<!-- Principal 1 -->
<tr class="hover:bg-surface-container-low transition-colors">
<td class="p-sm">
<div class="flex items-center gap-sm">
<div class="w-8 h-8 rounded-full bg-surface-container-highest text-primary flex items-center justify-center font-label-sm text-label-sm font-semibold">MR</div>
<div>
<div class="font-label-md text-label-md font-medium text-on-surface">Ing. Marcos Restrepo</div>
<div class="font-label-sm text-label-sm text-on-surface-variant">Coordinador Mantenimiento</div>
</div>
</div>
</td>
<td class="p-sm">Principal Empleador</td>
<td class="p-sm">Designado Empleador</td>
<td class="p-sm">Talleres y Maquinaria</td>
<td class="p-sm">
<span class="inline-flex items-center gap-1 font-label-sm text-label-sm text-primary font-medium">
<span class="material-symbols-outlined text-[16px] text-secondary-container">verified</span> Radicado 2024-C03
              </span>
</td>
<td class="p-sm">
<span class="px-xs py-0.5 rounded bg-surface-container font-label-sm text-label-sm">Manejo de Conflictos (20h)</span>
</td>
<td class="p-sm text-right">
<button class="p-xs hover:bg-surface-container-high rounded text-on-surface-variant" title="Buzón directo institucional" type="button">
<span class="material-symbols-outlined text-[18px]">mail</span>
</button>
</td>
</tr>
<!-- Principal 2 -->
<tr class="hover:bg-surface-container-low transition-colors">
<td class="p-sm">
<div class="flex items-center gap-sm">
<div class="w-8 h-8 rounded-full bg-surface-container-highest text-primary flex items-center justify-center font-label-sm text-label-sm font-semibold">LG</div>
<div>
<div class="font-label-md text-label-md font-medium text-on-surface">Luis Gabriel Gómez</div>
<div class="font-label-sm text-label-sm text-on-surface-variant">Operario de Cosecha</div>
</div>
</div>
</td>
<td class="p-sm">Principal Trabajadores</td>
<td class="p-sm">Elegido por Votación</td>
<td class="p-sm">Finca El Paraíso</td>
<td class="p-sm">
<span class="inline-flex items-center gap-1 font-label-sm text-label-sm text-primary font-medium">
<span class="material-symbols-outlined text-[16px] text-secondary-container">verified</span> Radicado 2024-C04
              </span>
</td>
<td class="p-sm">
<span class="px-xs py-0.5 rounded bg-surface-container font-label-sm text-label-sm">Diálogo Asertivo (20h)</span>
</td>
<td class="p-sm text-right">
<button class="p-xs hover:bg-surface-container-high rounded text-on-surface-variant" title="Buzón directo institucional" type="button">
<span class="material-symbols-outlined text-[18px]">mail</span>
</button>
</td>
</tr>
<!-- Suplentes -->
<tr class="hover:bg-surface-container-low transition-colors">
<td class="p-sm">
<div class="flex items-center gap-sm">
<div class="w-8 h-8 rounded-full bg-surface-container text-on-surface-variant flex items-center justify-center font-label-sm text-label-sm font-semibold">SP</div>
<div>
<div class="font-label-md text-label-md font-medium text-on-surface">Jorge Alarcón / Beatriz Pineda</div>
<div class="font-label-sm text-label-sm text-on-surface-variant">Suplentes Paritarios</div>
</div>
</div>
</td>
<td class="p-sm">Suplentes Numéricos</td>
<td class="p-sm">Empleador / Trabajadores</td>
<td class="p-sm">Planta de Beneficio / Fincas</td>
<td class="p-sm">
<span class="inline-flex items-center gap-1 font-label-sm text-label-sm text-primary font-medium">
<span class="material-symbols-outlined text-[16px] text-secondary-container">verified</span> Firmados
              </span>
</td>
<td class="p-sm">
<span class="px-xs py-0.5 rounded bg-surface-container font-label-sm text-label-sm">En Formación Continua</span>
</td>
<td class="p-sm text-right">
<button class="p-xs hover:bg-surface-container-high rounded text-on-surface-variant" title="Buzón directo institucional" type="button">
<span class="material-symbols-outlined text-[18px]">mail</span>
</button>
</td>
</tr>
</tbody>
</table>
</div>
</section>
<!-- 5. Dos Secciones Principales: Solicitudes vs Plan de Prevención -->
<div class="grid grid-cols-1 lg:grid-cols-12 gap-base">
<!-- Panel Izquierdo: Gestión de Solicitudes Preventivas Anonimizadas (7 cols) -->
<div class="lg:col-span-7 flex flex-col gap-base rounded-xl bg-surface-container-lowest p-md shadow-sm">
<div class="flex items-center justify-between">
<div>
<h2 class="font-headline-md text-headline-md text-primary">Trazabilidad de Solicitudes y Términos</h2>
<p class="font-body-sm text-body-sm text-on-surface-variant">Monitoreo confidencial de términos del debido proceso preventivo</p>
</div>
<div class="flex items-center gap-xs">
<span class="material-symbols-outlined text-on-surface-variant text-[20px]">lock_clock</span>
<span class="font-label-sm text-label-sm text-on-surface-variant">Término Máx: 60 Días</span>
</div>
</div>
<!-- Alerta metodológica -->
<div class="p-sm rounded-lg bg-surface-container-low flex items-start gap-sm">
<span class="material-symbols-outlined text-secondary-container text-[20px] shrink-0">info</span>
<p class="font-label-sm text-label-sm text-on-surface-variant">
          Nota de Custodia: Los relatos, nombres de quejosos e implicados y actas de descargos reposan bajo custodia física en sobre sellado foliado y en el repositorio criptográfico asignado únicamente a Presidencia y Secretaría.
        </p>
</div>
<!-- Listado de Casos Anonimizados -->
<div class="flex flex-col gap-sm">
<!-- Caso 1 -->
<div class="p-sm rounded-lg bg-surface-container hover:bg-surface-container-high transition-colors flex flex-col gap-xs">
<div class="flex items-center justify-between flex-wrap gap-xs">
<div class="flex items-center gap-xs">
<span class="px-xs py-0.5 rounded bg-primary text-on-primary font-label-sm text-label-sm font-mono">CCL-2024-EXP-007</span>
<span class="font-label-sm text-label-sm text-on-surface-variant">Radicado: 18/Oct/2024</span>
</div>
<span class="px-sm py-0.5 rounded-full bg-secondary-fixed text-on-secondary-fixed font-label-sm text-label-sm">Fase 2: Diálogo Concertado</span>
</div>
<!-- Stepper de proceso -->
<div class="grid grid-cols-4 gap-xs my-xs text-center">
<div class="flex flex-col gap-1 items-center">
<div class="w-full bg-secondary-container h-1 rounded-full"></div>
<span class="font-label-sm text-[10px] text-secondary-container font-semibold">1. Escucha Indiv.</span>
</div>
<div class="flex flex-col gap-1 items-center">
<div class="w-full bg-secondary-container h-1 rounded-full"></div>
<span class="font-label-sm text-[10px] text-secondary-container font-semibold">2. Mesa Acuerdos</span>
</div>
<div class="flex flex-col gap-1 items-center">
<div class="w-full bg-surface-container-highest h-1 rounded-full"></div>
<span class="font-label-sm text-[10px] text-on-surface-variant">3. Seguimiento 30d</span>
</div>
<div class="flex flex-col gap-1 items-center">
<div class="w-full bg-surface-container-highest h-1 rounded-full"></div>
<span class="font-label-sm text-[10px] text-on-surface-variant">4. Cierre Amistoso</span>
</div>
</div>
<div class="flex items-center justify-between text-on-surface-variant font-label-sm text-label-sm pt-xs border-t-0">
<div class="flex items-center gap-xs">
<span class="material-symbols-outlined text-[16px] text-primary">schedule</span>
<span>Término restante: <strong>14 días hábiles</strong></span>
</div>
<button class="text-primary hover:underline font-medium flex items-center gap-0.5" type="button">
<span>Bitácora Paramétrica</span>
<span class="material-symbols-outlined text-[14px]">arrow_forward</span>
</button>
</div>
</div>
<!-- Caso 2 -->
<div class="p-sm rounded-lg bg-surface-container hover:bg-surface-container-high transition-colors flex flex-col gap-xs">
<div class="flex items-center justify-between flex-wrap gap-xs">
<div class="flex items-center gap-xs">
<span class="px-xs py-0.5 rounded bg-primary text-on-primary font-label-sm text-label-sm font-mono">CCL-2024-EXP-008</span>
<span class="font-label-sm text-label-sm text-on-surface-variant">Radicado: 03/Nov/2024</span>
</div>
<span class="px-sm py-0.5 rounded-full bg-surface-container-highest text-primary font-label-sm text-label-sm">Fase 3: Verificación 30 Días</span>
</div>
<div class="grid grid-cols-4 gap-xs my-xs text-center">
<div class="flex flex-col gap-1 items-center">
<div class="w-full bg-secondary-container h-1 rounded-full"></div>
<span class="font-label-sm text-[10px] text-secondary-container font-semibold">1. Escucha Indiv.</span>
</div>
<div class="flex flex-col gap-1 items-center">
<div class="w-full bg-secondary-container h-1 rounded-full"></div>
<span class="font-label-sm text-[10px] text-secondary-container font-semibold">2. Mesa Acuerdos</span>
</div>
<div class="flex flex-col gap-1 items-center">
<div class="w-full bg-secondary-container h-1 rounded-full"></div>
<span class="font-label-sm text-[10px] text-secondary-container font-semibold">3. Seguimiento 30d</span>
</div>
<div class="flex flex-col gap-1 items-center">
<div class="w-full bg-surface-container-highest h-1 rounded-full"></div>
<span class="font-label-sm text-[10px] text-on-surface-variant">4. Cierre Amistoso</span>
</div>
</div>
<div class="flex items-center justify-between text-on-surface-variant font-label-sm text-label-sm pt-xs border-t-0">
<div class="flex items-center gap-xs">
<span class="material-symbols-outlined text-[16px] text-secondary-container">task_alt</span>
<span>Compromisos de trato firmados • Monitoreo activo</span>
</div>
<button class="text-primary hover:underline font-medium flex items-center gap-0.5" type="button">
<span>Bitácora Paramétrica</span>
<span class="material-symbols-outlined text-[14px]">arrow_forward</span>
</button>
</div>
</div>
<!-- Caso Cerrado Reciente -->
<div class="p-sm rounded-lg bg-surface-container-low flex items-center justify-between opacity-80 hover:opacity-100 transition-opacity">
<div class="flex items-center gap-sm">
<span class="material-symbols-outlined text-[20px] text-primary">check_circle</span>
<div>
<div class="font-label-md text-label-md font-semibold text-on-surface font-mono">CCL-2024-EXP-006</div>
<div class="font-label-sm text-label-sm text-on-surface-variant">Cerrado con acuerdo conciliatorio exitoso el 24/Sep/2024</div>
</div>
</div>
<span class="px-sm py-xs rounded bg-surface-container font-label-sm text-label-sm text-on-surface-variant">Archivado Cumplido</span>
</div>
</div>
<!-- Resumen estadístico anual -->
<div class="grid grid-cols-3 gap-xs p-sm bg-surface-container-low rounded-lg text-center mt-xs">
<div class="flex flex-col">
<span class="font-headline-md text-headline-md text-primary font-bold">08</span>
<span class="font-label-sm text-label-sm text-on-surface-variant">Total Recibidos</span>
</div>
<div class="flex flex-col">
<span class="font-headline-md text-headline-md text-secondary-container font-bold">06</span>
<span class="font-label-sm text-label-sm text-on-surface-variant">Cierres Amistosos</span>
</div>
<div class="flex flex-col">
<span class="font-headline-md text-headline-md text-on-surface font-bold">00</span>
<span class="font-label-sm text-label-sm text-on-surface-variant">Quejas Desestimadas</span>
</div>
</div>
</div>
<!-- Panel Derecho: Plan Anual de Actividades Preventivas y Clima (5 cols) -->
<div class="lg:col-span-5 flex flex-col gap-base rounded-xl bg-surface-container-lowest p-md shadow-sm">
<div>
<h2 class="font-headline-md text-headline-md text-primary">Plan de Clima y Riesgo Psicosocial</h2>
<p class="font-body-sm text-body-sm text-on-surface-variant">Campañas activas bajo Resolución 2764 de 2022</p>
</div>
<!-- Campaña Destacada -->
<div class="p-sm rounded-lg bg-surface-container-low flex flex-col gap-xs">
<div class="flex items-center gap-xs text-primary">
<span class="material-symbols-outlined text-[20px]">campaign</span>
<span class="font-label-md text-label-md font-semibold">Campaña 'En Manzanares Tratamos con Respeto'</span>
</div>
<p class="font-body-sm text-body-sm text-on-surface-variant">
          Sensibilización de campo sobre comunicación no violenta, prevención de bromas denigrantes y desescalamiento verbal en cuadrillas de cosecha.
        </p>
<div class="flex items-center justify-between text-on-surface-variant font-label-sm text-label-sm mt-xs">
<span>Cobertura: 142 / 160 trabajadores</span>
<span class="font-semibold text-primary">88.7%</span>
</div>
<div class="w-full bg-surface-container-high rounded-full h-1.5">
<div class="bg-primary h-1.5 rounded-full" style="width: 88.7%;"></div>
</div>
</div>
<!-- Semáforo Batería de Riesgo Psicosocial -->
<div class="flex flex-col gap-xs p-sm rounded-lg bg-surface-container">
<div class="flex items-center justify-between">
<span class="font-label-md text-label-md font-semibold text-primary">Batería de Riesgo Psicosocial 2024</span>
<span class="font-label-sm text-label-sm text-on-surface-variant">Sep 2024</span>
</div>
<div class="grid grid-cols-2 gap-xs mt-xs">
<!-- Intralaboral -->
<div class="p-xs rounded bg-surface-container-lowest flex flex-col gap-1">
<span class="font-label-sm text-label-sm text-on-surface-variant">Dominio Intralaboral</span>
<div class="flex items-center gap-xs">
<span class="w-2.5 h-2.5 rounded-full bg-secondary-container"></span>
<span class="font-label-md text-label-md font-medium text-on-surface">Riesgo Bajo / Medio</span>
</div>
<span class="font-label-sm text-[11px] text-on-surface-variant">Liderazgo y Relaciones</span>
</div>
<!-- Extralaboral -->
<div class="p-xs rounded bg-surface-container-lowest flex flex-col gap-1">
<span class="font-label-sm text-label-sm text-on-surface-variant">Dominio Extralaboral</span>
<div class="flex items-center gap-xs">
<span class="w-2.5 h-2.5 rounded-full bg-primary"></span>
<span class="font-label-md text-label-md font-medium text-on-surface">Riesgo Bajo</span>
</div>
<span class="font-label-sm text-[11px] text-on-surface-variant">Tiempo fuera y vivienda</span>
</div>
</div>
</div>
<!-- Cronograma de Liderazgo Empático -->
<div class="flex flex-col gap-xs">
<span class="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider font-semibold">Talleres de Liderazgo Positivo (Capataces)</span>
<div class="flex items-center justify-between p-xs rounded bg-surface-container-low">
<div class="flex items-center gap-xs">
<span class="material-symbols-outlined text-secondary-container text-[18px]">school</span>
<span class="font-label-sm text-label-sm text-on-surface">Manejo de órdenes claras y asertivas</span>
</div>
<span class="px-xs py-0.5 rounded bg-surface-container font-label-sm text-[11px] text-on-surface-variant">12/Dic/2024</span>
</div>
<div class="flex items-center justify-between p-xs rounded bg-surface-container-low">
<div class="flex items-center gap-xs">
<span class="material-symbols-outlined text-secondary-container text-[18px]">school</span>
<span class="font-label-sm text-label-sm text-on-surface">Pautas de retroalimentación sin descalificación</span>
</div>
<span class="px-xs py-0.5 rounded bg-surface-container font-label-sm text-[11px] text-on-surface-variant">22/Ene/2025</span>
</div>
</div>
<!-- Canal seguro alterno -->
<div class="p-sm rounded-lg bg-surface-container-highest flex items-center justify-between">
<div class="flex items-center gap-sm">
<span class="material-symbols-outlined text-primary text-[22px]">mark_email_read</span>
<div>
<div class="font-label-md text-label-md font-semibold text-primary">Buzón Físico Sellado</div>
<div class="font-label-sm text-label-sm text-on-surface-variant">Finca La Esperanza y Central Manizales</div>
</div>
</div>
<span class="material-symbols-outlined text-on-surface-variant text-[18px]">lock</span>
</div>
</div>
</div>
<!-- 6. Repositorio de Actas y Archivo Custodiado -->
<section class="flex flex-col gap-sm rounded-xl bg-surface-container-lowest p-md shadow-sm">
<div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-xs">
<div>
<h2 class="font-headline-md text-headline-md text-primary">Archivo y Custodia de Actas Trimestrales CCL</h2>
<p class="font-body-sm text-body-sm text-on-surface-variant">Registro inmutable según directriz de MinTrabajo con doble custodia física y hash digital</p>
</div>
<div class="flex items-center gap-xs">
<button class="flex items-center gap-xs px-sm py-xs bg-surface-container text-primary rounded-lg hover:bg-surface-container-high transition-colors font-label-md text-label-md" type="button">
<span class="material-symbols-outlined text-[16px]">verified_user</span>
<span>Verificar Hashes SHA-256</span>
</button>
</div>
</div>
<div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-base">
<!-- Acta Q1 -->
<div class="p-sm rounded-lg bg-surface-container-low flex flex-col justify-between gap-sm">
<div class="flex items-start justify-between">
<div class="flex items-center gap-xs">
<span class="material-symbols-outlined text-primary text-[22px]">description</span>
<span class="font-label-md text-label-md font-semibold text-on-surface">Acta Ordinaria Q1</span>
</div>
<span class="px-xs py-0.5 rounded bg-surface-container font-label-sm text-[11px] text-on-surface-variant">Folios: 001-008</span>
</div>
<p class="font-label-sm text-label-sm text-on-surface-variant">Instalación del período paritario 2024-2026 y cronograma de sesiones ordinarias.</p>
<div class="flex items-center justify-between pt-xs border-t-0 font-label-sm text-label-sm">
<span class="text-on-surface-variant">Fecha: 15/Feb/2024</span>
<span class="text-primary font-medium flex items-center gap-0.5">
<span class="material-symbols-outlined text-[16px]">download</span> Custodiada
          </span>
</div>
</div>
<!-- Acta Q2 -->
<div class="p-sm rounded-lg bg-surface-container-low flex flex-col justify-between gap-sm">
<div class="flex items-start justify-between">
<div class="flex items-center gap-xs">
<span class="material-symbols-outlined text-primary text-[22px]">description</span>
<span class="font-label-md text-label-md font-semibold text-on-surface">Acta Ordinaria Q2</span>
</div>
<span class="px-xs py-0.5 rounded bg-surface-container font-label-sm text-[11px] text-on-surface-variant">Folios: 009-017</span>
</div>
<p class="font-label-sm text-label-sm text-on-surface-variant">Seguimiento semestral a solicitudes recibidas y coordinación de talleres con ARL.</p>
<div class="flex items-center justify-between pt-xs border-t-0 font-label-sm text-label-sm">
<span class="text-on-surface-variant">Fecha: 18/May/2024</span>
<span class="text-primary font-medium flex items-center gap-0.5">
<span class="material-symbols-outlined text-[16px]">download</span> Custodiada
          </span>
</div>
</div>
<!-- Acta Extraordinaria #1 -->
<div class="p-sm rounded-lg bg-surface-container-low flex flex-col justify-between gap-sm">
<div class="flex items-start justify-between">
<div class="flex items-center gap-xs">
<span class="material-symbols-outlined text-secondary-container text-[22px]">priority_high</span>
<span class="font-label-md text-label-md font-semibold text-on-surface">Acta Extraordinaria #1</span>
</div>
<span class="px-xs py-0.5 rounded bg-surface-container font-label-sm text-[11px] text-on-surface-variant">Folios: 018-024</span>
</div>
<p class="font-label-sm text-label-sm text-on-surface-variant">Atención inmediata a solicitud preventiva de fricción interpersonal en Cosecha.</p>
<div class="flex items-center justify-between pt-xs border-t-0 font-label-sm text-label-sm">
<span class="text-on-surface-variant">Fecha: 22/Jul/2024</span>
<span class="text-primary font-medium flex items-center gap-0.5">
<span class="material-symbols-outlined text-[16px]">download</span> Custodiada
          </span>
</div>
</div>
<!-- Acta Q3 -->
<div class="p-sm rounded-lg bg-surface-container-low flex flex-col justify-between gap-sm">
<div class="flex items-start justify-between">
<div class="flex items-center gap-xs">
<span class="material-symbols-outlined text-primary text-[22px]">description</span>
<span class="font-label-md text-label-md font-semibold text-on-surface">Acta Ordinaria Q3</span>
</div>
<span class="px-xs py-0.5 rounded bg-surface-container font-label-sm text-[11px] text-on-surface-variant">Folios: 025-033</span>
</div>
<p class="font-label-sm text-label-sm text-on-surface-variant">Revisión preliminar de Batería de Riesgo Psicosocial y compromisos preventivos.</p>
<div class="flex items-center justify-between pt-xs border-t-0 font-label-sm text-label-sm">
<span class="text-on-surface-variant">Fecha: 20/Oct/2024</span>
<span class="text-primary font-medium flex items-center gap-0.5">
<span class="material-symbols-outlined text-[16px]">download</span> Custodiada
          </span>
</div>
</div>
</div>
</section>
</div></main></div></body></html>

<!DOCTYPE html>

<html lang="es"><head><meta charset="utf-8"/><meta content="width=device-width, initial-scale=1.0" name="viewport"/><link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0" rel="stylesheet"/>
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet"/><style>@layer base{html,body{margin:0;padding:0;}body{overscroll-behavior:none;}main>:first-child{margin-top:0!important;}main>:last-child{margin-bottom:0!important;}}::-webkit-scrollbar{display:none;}</style><script src="https://cdn.tailwindcss.com"></script><script id="tailwind-config">tailwind.config = {
    darkMode: "class",
    theme: {
      extend: {
        "colors": {
          "inverse-surface": "#233144",
          "on-primary": "#ffffff",
          "on-primary-container": "#9ea9ff",
          "secondary-container": "#6063ee",
          "on-tertiary-fixed": "#191c1e",
          "error-container": "#ffdad6",
          "surface-container-low": "#eff4ff",
          "surface-container-highest": "#d5e3fc",
          "on-primary-fixed-variant": "#333f91",
          "secondary-fixed-dim": "#c0c1ff",
          "on-secondary-fixed": "#07006c",
          "surface": "#f8f9ff",
          "primary-fixed": "#dfe0ff",
          "error": "#ba1a1a",
          "tertiary-container": "#404345",
          "on-surface-variant": "#454651",
          "surface-bright": "#f8f9ff",
          "secondary-fixed": "#e1e0ff",
          "surface-container-high": "#dce9ff",
          "tertiary-fixed-dim": "#c4c7c9",
          "surface-container": "#e6eeff",
          "inverse-primary": "#bcc3ff",
          "on-secondary": "#ffffff",
          "outline-variant": "#c6c5d3",
          "primary-fixed-dim": "#bcc3ff",
          "on-tertiary": "#ffffff",
          "surface-dim": "#ccdbf3",
          "on-error": "#ffffff",
          "primary-container": "#2e3a8c",
          "on-primary-fixed": "#000d60",
          "on-background": "#0d1c2e",
          "on-secondary-fixed-variant": "#2f2ebe",
          "secondary": "#4648d4",
          "on-surface": "#0d1c2e",
          "tertiary-fixed": "#e0e3e5",
          "surface-container-lowest": "#ffffff",
          "on-secondary-container": "#fffbff",
          "surface-variant": "#d5e3fc",
          "primary": "#142175",
          "surface-tint": "#4b57aa",
          "background": "#f8f9ff",
          "on-error-container": "#93000a",
          "on-tertiary-fixed-variant": "#444749",
          "inverse-on-surface": "#eaf1ff",
          "tertiary": "#2a2d2f",
          "on-tertiary-container": "#adb0b2",
          "outline": "#767682"
        },
        "borderRadius": {
          "DEFAULT": "0.25rem",
          "lg": "0.5rem",
          "xl": "0.75rem",
          "full": "9999px"
        },
        "spacing": {
          "xs": "4px",
          "xl": "80px",
          "lg": "48px",
          "md": "24px",
          "gutter": "24px",
          "base": "8px",
          "sm": "12px",
          "container-max": "1280px"
        },
        "fontFamily": {
          "body-lg": [
            "Inter"
          ],
          "headline-lg-mobile": [
            "Inter"
          ],
          "label-md": [
            "Inter"
          ],
          "label-sm": [
            "Inter"
          ],
          "body-md": [
            "Inter"
          ],
          "headline-lg": [
            "Inter"
          ],
          "headline-md": [
            "Inter"
          ],
          "display-lg": [
            "Inter"
          ],
          "body-sm": [
            "Inter"
          ]
        },
        "fontSize": {
          "body-lg": [
            "18px",
            {
              "lineHeight": "28px",
              "fontWeight": "400"
            }
          ],
          "headline-lg-mobile": [
            "24px",
            {
              "lineHeight": "32px",
              "fontWeight": "600"
            }
          ],
          "label-md": [
            "14px",
            {
              "lineHeight": "16px",
              "letterSpacing": "0.01em",
              "fontWeight": "500"
            }
          ],
          "label-sm": [
            "12px",
            {
              "lineHeight": "14px",
              "fontWeight": "600"
            }
          ],
          "body-md": [
            "16px",
            {
              "lineHeight": "24px",
              "fontWeight": "400"
            }
          ],
          "headline-lg": [
            "32px",
            {
              "lineHeight": "40px",
              "letterSpacing": "-0.01em",
              "fontWeight": "600"
            }
          ],
          "headline-md": [
            "24px",
            {
              "lineHeight": "32px",
              "fontWeight": "600"
            }
          ],
          "display-lg": [
            "48px",
            {
              "lineHeight": "56px",
              "letterSpacing": "-0.02em",
              "fontWeight": "700"
            }
          ],
          "body-sm": [
            "14px",
            {
              "lineHeight": "20px",
              "fontWeight": "400"
            }
          ]
        }
      },
    },
  }</script></head><body class="bg-background font-body-md text-body-md text-on-surface antialiased"><aside class="fixed left-0 top-0 h-full w-72 bg-surface-container-lowest shadow-[0_1px_8px_rgba(0,0,0,0.04)] z-50 flex flex-col justify-between overflow-y-auto"><div class="p-gutter pb-0"><div class="flex items-center gap-base mb-xs"><div class="w-8 h-8 rounded bg-primary-container flex items-center justify-center text-on-primary font-headline-md text-headline-md">M</div><div class="flex flex-col"><span class="font-label-md text-label-md text-primary leading-tight font-semibold">Grupo Manzanares S.A.S.</span><span class="font-label-sm text-label-sm text-on-surface-variant">SG-SST Operativo</span></div></div><div class="flex items-center gap-xs mt-base mb-md"><span class="bg-surface-container-high text-on-surface font-label-sm text-label-sm px-xs py-0.5 rounded">Dec. 1072</span><span class="bg-surface-container-high text-on-surface font-label-sm text-label-sm px-xs py-0.5 rounded">Res. 0312</span></div></div><nav class="flex-1 px-sm pb-gutter flex flex-col gap-base" data-active-classes="bg-primary-container text-on-primary font-medium rounded-lg"><div class="flex flex-col gap-xs"><span class="px-xs font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">Gestión Operativa</span><a class="px-sm py-xs rounded-lg text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-colors font-label-md text-label-md" data-path="dashboard" href="#">Inicio / Dashboard</a><a class="px-sm py-xs rounded-lg text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-colors font-label-md text-label-md" data-path="trabajadores" href="#">Trabajadores</a><a class="px-sm py-xs rounded-lg text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-colors font-label-md text-label-md" data-path="examenes-medicos" href="#">Exámenes Médicos (EMOS)</a><a class="px-sm py-xs rounded-lg text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-colors font-label-md text-label-md" data-path="casos-de-salud" href="#">Casos de Salud</a><a class="px-sm py-xs rounded-lg text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-colors font-label-md text-label-md" data-path="incapacidades-y-reintegros" href="#">Incapacidades y Reintegros</a></div><div class="flex flex-col gap-xs"><span class="px-xs font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">Riesgos Críticos &amp; Viales</span><a class="px-sm py-xs rounded-lg text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-colors font-label-md text-label-md" data-path="trabajo-en-alturas" href="#">Trabajo en Alturas</a><a class="px-sm py-xs rounded-lg text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-colors font-label-md text-label-md" data-path="tractoristas-operadores" href="#">Tractoristas / Operadores</a><a class="px-sm py-xs rounded-lg text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-colors font-label-md text-label-md" data-path="pesv-seguridad-vial" href="#">PESV (Seguridad Vial)</a><a class="px-sm py-xs rounded-lg text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-colors font-label-md text-label-md" data-path="epp" href="#">EPP</a></div><div class="flex flex-col gap-xs"><span class="px-xs font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">Inspección &amp; Eventos</span><a class="px-sm py-xs rounded-lg text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-colors font-label-md text-label-md" data-path="inspecciones" href="#">Inspecciones</a><a class="px-sm py-xs rounded-lg text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-colors font-label-md text-label-md" data-path="accidentes-e-incidentes" href="#">Accidentes e Incidentes</a><a class="px-sm py-xs rounded-lg text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-colors font-label-md text-label-md" data-path="investigaciones" href="#">Investigaciones</a><a class="px-sm py-xs rounded-lg text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-colors font-label-md text-label-md" data-path="acciones-correctivas" href="#">Acciones Correctivas</a></div><div class="flex flex-col gap-xs"><span class="px-xs font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">Comités &amp; Cultura</span><a class="px-sm py-xs rounded-lg text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-colors font-label-md text-label-md" data-path="capacitaciones" href="#">Capacitaciones</a><a class="px-sm py-xs rounded-lg text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-colors font-label-md text-label-md" data-path="documentos-sg-sst" href="#">Documentos SG-SST</a><a class="px-sm py-xs rounded-lg text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-colors font-label-md text-label-md" data-path="20-copasst" href="#">20. COPASST</a><a class="px-sm py-xs rounded-lg text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-colors font-label-md text-label-md" data-path="21-ccl-convivencia-laboral" href="#">21. CCL (Convivencia Laboral)</a><a class="px-sm py-xs rounded-lg text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-colors font-label-md text-label-md" data-path="22-plan-de-emergencias-y-brigada" href="#">22. Plan de Emergencias y Brigada</a><a class="px-sm py-xs rounded-lg text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-colors font-label-md text-label-md" data-path="quimicos" href="#">Químicos</a></div></nav></aside><div class="pl-72"><header class="fixed top-0 left-72 right-0 h-16 bg-surface-container-lowest/90 backdrop-blur-xl shadow-[0_1px_8px_rgba(0,0,0,0.04)] z-40 flex items-center justify-between px-gutter"><div class="flex items-center gap-md flex-1 max-w-xl"><div class="relative w-full"><span class="material-symbols-outlined absolute left-sm top-1/2 -translate-y-1/2 text-on-surface-variant text-[20px]">search</span><input class="w-full bg-surface-container-low text-on-surface placeholder:text-on-surface-variant pl-10 pr-sm py-xs rounded-lg font-body-sm text-body-sm focus:outline-none focus:ring-2 focus:ring-secondary-container transition-all" placeholder="Buscar trabajadores, incidentes, normativas..." type="search"/></div><div class="flex items-center bg-surface-container-low px-sm py-xs rounded-lg gap-xs shrink-0"><span class="material-symbols-outlined text-[18px] text-on-surface-variant">gavel</span><span class="font-label-sm text-label-sm text-on-surface">Estándares 2024</span><span class="material-symbols-outlined text-[16px] text-on-surface-variant">expand_more</span></div></div><div class="flex items-center gap-base"><button class="flex items-center gap-xs bg-primary-container text-on-primary px-sm py-xs rounded-lg font-label-md text-label-md hover:bg-primary transition-colors" type="button"><span class="material-symbols-outlined text-[18px]">add_alert</span><span>Reporte Rápido / Notificación</span></button><button class="relative w-10 h-10 flex items-center justify-center rounded-lg hover:bg-surface-container-high transition-colors text-on-surface-variant" type="button"><span class="material-symbols-outlined text-[22px]">notifications</span><span class="absolute top-2 right-2 w-2 h-2 rounded-full bg-error"></span></button><div class="flex items-center gap-sm pl-xs"><div class="text-right hidden xl:block"><div class="font-label-md text-label-md text-on-surface font-medium">Ing. Andrés Valencia</div><div class="font-label-sm text-label-sm text-on-surface-variant">Coordinador SG-SST</div></div><div class="w-8 h-8 rounded-full bg-primary flex items-center justify-center"><span class="material-symbols-outlined text-on-primary text-[18px]">person</span></div></div></div></header><main class="w-full px-gutter pt-16 bg-surface min-h-screen"><div class="flex flex-col w-full pb-xl">
<!-- ENCABEZADO DE MÓDULO -->
<header class="flex flex-col gap-base pb-md pt-sm">
<div class="flex flex-wrap items-center gap-xs">
<span class="bg-primary-container text-on-primary font-label-sm text-label-sm px-xs py-0.5 rounded uppercase tracking-wider font-semibold">Dec. 1072/2015 Art. 2.2.4.6.25</span>
<span class="bg-surface-container-high text-on-surface font-label-sm text-label-sm px-xs py-0.5 rounded font-medium">Ley 1523 de 2012 (Gestión del Riesgo)</span>
<span class="bg-secondary-fixed text-on-secondary-fixed font-label-sm text-label-sm px-xs py-0.5 rounded font-medium">NFPA 10 / 600 • Cruz Roja • Bomberos</span>
<span class="inline-flex items-center gap-1 bg-surface-container-low text-primary px-xs py-0.5 rounded font-label-sm text-label-sm ml-auto">
<span class="w-2 h-2 rounded-full bg-secondary-container animate-pulse"></span>
        Nivel de Preparación Operativa: <strong class="text-on-surface font-semibold">ÓPTIMO 94%</strong>
</span>
</div>
<div class="flex flex-col xl:flex-row xl:items-end justify-between gap-md">
<div class="flex flex-col gap-1 max-w-4xl min-w-0">
<span class="text-primary font-label-sm text-label-sm tracking-widest uppercase font-semibold">Módulo Técnico Operativo • SG-SST</span>
<h1 class="text-headline-lg font-headline-lg text-primary tracking-tight">22. Plan de Prevención, Preparación y Respuesta ante Emergencias</h1>
<p class="text-body-md font-body-md text-on-surface-variant leading-relaxed">
          Estructura operativa para atención de contingencias: Brigada de Emergencia Agroindustrial multi-sede, inspección y trazabilidad de recursos críticos y cronograma anual de simulacros evaluados bajo lineamientos de la Unidad Nacional para la Gestión del Riesgo de Desastres.
        </p>
</div>
<div class="flex flex-wrap items-center gap-xs shrink-0">
<button class="flex items-center gap-xs bg-surface-container-lowest text-primary px-sm py-xs rounded-lg font-label-md text-label-md hover:bg-surface-container-high transition-colors shadow-sm" type="button">
<span class="material-symbols-outlined text-[18px]">picture_as_pdf</span>
<span>Descargar PPRE Completo (.PDF)</span>
</button>
<button class="flex items-center gap-xs bg-surface-container-lowest text-primary px-sm py-xs rounded-lg font-label-md text-label-md hover:bg-surface-container-high transition-colors shadow-sm" type="button">
<span class="material-symbols-outlined text-[18px]">map</span>
<span>Plano de Evacuación y Puntos</span>
</button>
<button class="flex items-center gap-xs bg-primary-container text-on-primary px-sm py-xs rounded-lg font-label-md text-label-md hover:bg-primary transition-colors shadow-sm" type="button">
<span class="material-symbols-outlined text-[18px]">add_task</span>
<span>+ Programar Simulacro / Registrar Equipo</span>
</button>
</div>
</div>
</header>
<!-- DASHBOARD SUPERIOR DE MÉTRICAS -->
<section class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-base mb-lg">
<!-- Métrica 1 -->
<div class="bg-surface-container-lowest p-md rounded-xl shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
<div class="flex items-center justify-between">
<span class="text-on-surface-variant font-label-sm text-label-sm uppercase tracking-wider font-semibold">Brigadistas Activos</span>
<div class="w-8 h-8 rounded-lg bg-surface-container-low flex items-center justify-center text-primary">
<span class="material-symbols-outlined text-[20px]">groups</span>
</div>
</div>
<div class="mt-base">
<div class="flex items-baseline gap-1">
<span class="text-headline-lg font-headline-lg text-primary font-bold">28</span>
<span class="text-label-md font-label-md text-on-surface font-medium">Trabajadores</span>
</div>
<p class="text-body-sm font-body-sm text-on-surface-variant mt-xs">100% con aptitud médica y carnet bomberil/cruz roja.</p>
</div>
<div class="mt-base pt-xs flex items-center gap-1 text-primary">
<span class="material-symbols-outlined text-[16px]">verified</span>
<span class="text-label-sm font-label-sm font-semibold">4 Ramas Operativas Cubiertas</span>
</div>
</div>
<!-- Métrica 2 -->
<div class="bg-surface-container-lowest p-md rounded-xl shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
<div class="flex items-center justify-between">
<span class="text-on-surface-variant font-label-sm text-label-sm uppercase tracking-wider font-semibold">Equipos en Campo</span>
<div class="w-8 h-8 rounded-lg bg-surface-container-low flex items-center justify-center text-secondary">
<span class="material-symbols-outlined text-[20px]">fire_extinguisher</span>
</div>
</div>
<div class="mt-base">
<div class="flex items-baseline gap-1">
<span class="text-headline-lg font-headline-lg text-on-surface font-bold">146</span>
<span class="text-label-md font-label-md text-on-surface-variant">Unidades</span>
</div>
<p class="text-body-sm font-body-sm text-on-surface-variant mt-xs">98% operativos en campo (3 en taller de recarga).</p>
</div>
<div class="mt-base pt-xs flex items-center gap-1 text-secondary">
<span class="material-symbols-outlined text-[16px]">check_circle</span>
<span class="text-label-sm font-label-sm font-semibold">Semáforo Global: Conforme</span>
</div>
</div>
<!-- Métrica 3 -->
<div class="bg-surface-container-lowest p-md rounded-xl shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
<div class="flex items-center justify-between">
<span class="text-on-surface-variant font-label-sm text-label-sm uppercase tracking-wider font-semibold">Última Inspección</span>
<div class="w-8 h-8 rounded-lg bg-surface-container-low flex items-center justify-center text-primary-container">
<span class="material-symbols-outlined text-[20px]">event_repeat</span>
</div>
</div>
<div class="mt-base">
<div class="flex items-baseline gap-1">
<span class="text-headline-lg font-headline-lg text-on-surface font-bold">Hace 5</span>
<span class="text-label-md font-label-md text-on-surface-variant">Días</span>
</div>
<p class="text-body-sm font-body-sm text-on-surface-variant mt-xs">Ciclo mensual riguroso en 4 fincas y Planta Central.</p>
</div>
<div class="mt-base pt-xs flex items-center gap-1 text-on-surface-variant">
<span class="material-symbols-outlined text-[16px]">schedule</span>
<span class="text-label-sm font-label-sm font-medium">Próximo corte: 24/Nov/2024</span>
</div>
</div>
<!-- Métrica 4 -->
<div class="bg-surface-container-lowest p-md rounded-xl shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
<div class="flex items-center justify-between">
<span class="text-on-surface-variant font-label-sm text-label-sm uppercase tracking-wider font-semibold">Simulacros Anuales</span>
<div class="w-8 h-8 rounded-lg bg-surface-container-low flex items-center justify-center text-primary">
<span class="material-symbols-outlined text-[20px]">notifications_active</span>
</div>
</div>
<div class="mt-base">
<div class="flex items-baseline gap-1">
<span class="text-headline-lg font-headline-lg text-primary font-bold">2 / 2</span>
<span class="text-label-md font-label-md text-on-surface font-medium">Ejecutados</span>
</div>
<p class="text-body-sm font-body-sm text-on-surface-variant mt-xs">Simulacro Nacional + Derrame y conato de agroquímicos.</p>
</div>
<div class="mt-base pt-xs flex items-center gap-1 text-primary">
<span class="material-symbols-outlined text-[16px]">task_alt</span>
<span class="text-label-sm font-label-sm font-semibold">Cumplimiento PPRE 100%</span>
</div>
</div>
<!-- Métrica 5 -->
<div class="bg-surface-container-lowest p-md rounded-xl shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
<div class="flex items-center justify-between">
<span class="text-on-surface-variant font-label-sm text-label-sm uppercase tracking-wider font-semibold">Tiempo Evacuación</span>
<div class="w-8 h-8 rounded-lg bg-surface-container-low flex items-center justify-center text-secondary">
<span class="material-symbols-outlined text-[20px]">timer</span>
</div>
</div>
<div class="mt-base">
<div class="flex items-baseline gap-1">
<span class="text-headline-lg font-headline-lg text-primary font-bold">3m 12s</span>
</div>
<p class="text-body-sm font-body-sm text-on-surface-variant mt-xs">Meta interna: &lt; 4m en beneficio, tolvas y bodegas.</p>
</div>
<div class="mt-base pt-xs flex items-center gap-1 text-primary">
<span class="material-symbols-outlined text-[16px]">speed</span>
<span class="text-label-sm font-label-sm font-semibold">48s por debajo del estándar</span>
</div>
</div>
</section>
<!-- PANELES DE NAVEGACIÓN POR PESTAÑAS (Interactivas sin border) -->
<div class="w-full bg-surface-container-low p-xs rounded-xl mb-md flex flex-wrap gap-xs">
<button class="tab-button flex items-center gap-xs px-md py-xs rounded-lg font-label-md text-label-md bg-primary-container text-on-primary font-medium transition-all shadow-sm" id="tab-btn-brigada" onclick="switchSection('brigada')" type="button">
<span class="material-symbols-outlined text-[18px]">badge</span>
<span>1. Brigada de Emergencia (28)</span>
</button>
<button class="tab-button flex items-center gap-xs px-md py-xs rounded-lg font-label-md text-label-md text-on-surface-variant hover:bg-surface-container-high transition-all" id="tab-btn-equipos" onclick="switchSection('equipos')" type="button">
<span class="material-symbols-outlined text-[18px]">medical_services</span>
<span>2. Matriz y Control de Equipos (146)</span>
</button>
<button class="tab-button flex items-center gap-xs px-md py-xs rounded-lg font-label-md text-label-md text-on-surface-variant hover:bg-surface-container-high transition-all" id="tab-btn-simulacros" onclick="switchSection('simulacros')" type="button">
<span class="material-symbols-outlined text-[18px]">crisis_alert</span>
<span>3. Control de Simulacros y Evaluaciones</span>
</button>
</div>
<!-- SECCIÓN 1: BRIGADA DE EMERGENCIA -->
<div class="tab-content flex flex-col gap-md" id="section-brigada">
<!-- RAMAS OPERATIVAS (CARDS DE ESTRUCTURA) -->
<div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-base">
<!-- Rama 1: Primeros Auxilios -->
<div class="bg-surface-container-lowest p-md rounded-xl shadow-sm flex flex-col justify-between relative overflow-hidden">
<div class="w-full flex items-center justify-between pb-xs">
<span class="text-label-sm font-label-sm bg-error-container text-on-error-container px-xs py-0.5 rounded font-bold uppercase tracking-wide flex items-center gap-1">
<span class="material-symbols-outlined text-[14px]">local_hospital</span> Primeros Auxilios
          </span>
<span class="font-headline-md text-headline-md font-bold text-primary">10</span>
</div>
<div class="mt-base flex flex-col gap-1">
<span class="text-label-sm font-label-sm text-on-surface-variant">Líder Asignado:</span>
<span class="text-body-md font-body-md font-semibold text-on-surface">Enf. Beatriz Pineda</span>
<span class="text-body-sm font-body-sm text-on-surface-variant">Coordinadora Salud Ocupacional</span>
</div>
<div class="mt-base pt-base bg-surface-container-low p-sm rounded-lg flex flex-col gap-1 text-body-sm font-body-sm text-on-surface-variant">
<span class="font-semibold text-on-surface text-label-sm font-label-sm">Formación Acreditada:</span>
<span class="text-body-sm font-body-sm">Soporte Vital Básico, manejo de trauma, camillaje agreste, botiquines tipo B y A.</span>
<div class="flex items-center gap-1 mt-1 text-primary font-semibold text-label-sm font-label-sm">
<span class="material-symbols-outlined text-[16px]">verified_user</span>
<span>Certifica: Cruz Roja Colombiana</span>
</div>
</div>
</div>
<!-- Rama 2: Evacuación y Rescate -->
<div class="bg-surface-container-lowest p-md rounded-xl shadow-sm flex flex-col justify-between relative overflow-hidden">
<div class="w-full flex items-center justify-between pb-xs">
<span class="text-label-sm font-label-sm bg-primary-fixed text-on-primary-fixed px-xs py-0.5 rounded font-bold uppercase tracking-wide flex items-center gap-1">
<span class="material-symbols-outlined text-[14px]">directions_run</span> Evacuación y Rescate
          </span>
<span class="font-headline-md text-headline-md font-bold text-primary">8</span>
</div>
<div class="mt-base flex flex-col gap-1">
<span class="text-label-sm font-label-sm text-on-surface-variant">Líder Asignado:</span>
<span class="text-body-md font-body-md font-semibold text-on-surface">Julián Restrepo</span>
<span class="text-body-sm font-body-sm text-on-surface-variant">Supervisor de Planta de Beneficio</span>
</div>
<div class="mt-base pt-base bg-surface-container-low p-sm rounded-lg flex flex-col gap-1 text-body-sm font-body-sm text-on-surface-variant">
<span class="font-semibold text-on-surface text-label-sm font-label-sm">Formación Acreditada:</span>
<span class="text-body-sm font-body-sm">Rutas seguras de evacuación, censo en puntos de encuentro, rescate básico en campamentos y silos.</span>
<div class="flex items-center gap-1 mt-1 text-primary font-semibold text-label-sm font-label-sm">
<span class="material-symbols-outlined text-[16px]">verified_user</span>
<span>Certifica: Defensa Civil Seccional</span>
</div>
</div>
</div>
<!-- Rama 3: Control de Incendios -->
<div class="bg-surface-container-lowest p-md rounded-xl shadow-sm flex flex-col justify-between relative overflow-hidden">
<div class="w-full flex items-center justify-between pb-xs">
<span class="text-label-sm font-label-sm bg-secondary-fixed text-on-secondary-fixed px-xs py-0.5 rounded font-bold uppercase tracking-wide flex items-center gap-1">
<span class="material-symbols-outlined text-[14px]">local_fire_department</span> Control de Incendios
          </span>
<span class="font-headline-md text-headline-md font-bold text-primary">6</span>
</div>
<div class="mt-base flex flex-col gap-1">
<span class="text-label-sm font-label-sm text-on-surface-variant">Líder Asignado:</span>
<span class="text-body-md font-body-md font-semibold text-on-surface">Ing. Marcos Restrepo</span>
<span class="text-body-sm font-body-sm text-on-surface-variant">Jefe de Maquinaria y Calderas</span>
</div>
<div class="mt-base pt-base bg-surface-container-low p-sm rounded-lg flex flex-col gap-1 text-body-sm font-body-sm text-on-surface-variant">
<span class="font-semibold text-on-surface text-label-sm font-label-sm">Formación Acreditada:</span>
<span class="text-body-sm font-body-sm">Uso extintores satélites (PQS/Solkaflam), red de hidrantes, fuegos Clase A, B, C y conatos agrícolas.</span>
<div class="flex items-center gap-1 mt-1 text-primary font-semibold text-label-sm font-label-sm">
<span class="material-symbols-outlined text-[16px]">verified_user</span>
<span>Certifica: Cuerpo de Bomberos</span>
</div>
</div>
</div>
<!-- Rama 4: Rescate Alturas / Confinados -->
<div class="bg-surface-container-lowest p-md rounded-xl shadow-sm flex flex-col justify-between relative overflow-hidden">
<div class="w-full flex items-center justify-between pb-xs">
<span class="text-label-sm font-label-sm bg-tertiary-fixed text-on-tertiary-fixed px-xs py-0.5 rounded font-bold uppercase tracking-wide flex items-center gap-1">
<span class="material-symbols-outlined text-[14px]">altitude</span> Alturas y Confinados
          </span>
<span class="font-headline-md text-headline-md font-bold text-primary">4</span>
</div>
<div class="mt-base flex flex-col gap-1">
<span class="text-label-sm font-label-sm text-on-surface-variant">Líder Asignado:</span>
<span class="text-body-md font-body-md font-semibold text-on-surface">Carlos Arturo Mendoza</span>
<span class="text-body-sm font-body-sm text-on-surface-variant">Coordinador Trabajo en Alturas</span>
</div>
<div class="mt-base pt-base bg-surface-container-low p-sm rounded-lg flex flex-col gap-1 text-body-sm font-body-sm text-on-surface-variant">
<span class="font-semibold text-on-surface text-label-sm font-label-sm">Formación Acreditada:</span>
<span class="text-body-sm font-body-sm">Res. 4272/2021, descenso asistido con cuerdas, empaque de lesionados y atmósferas peligrosas.</span>
<div class="flex items-center gap-1 mt-1 text-primary font-semibold text-label-sm font-label-sm">
<span class="material-symbols-outlined text-[16px]">verified_user</span>
<span>Certifica: Centro Entrenamiento SENA</span>
</div>
</div>
</div>
</div>
<!-- TABLA DE BRIGADISTAS CON DOTACIÓN Y VENCIMIENTOS -->
<div class="bg-surface-container-lowest rounded-xl shadow-sm overflow-hidden flex flex-col">
<div class="p-md flex flex-col md:flex-row md:items-center justify-between gap-base bg-surface-container-lowest">
<div class="flex flex-col gap-0.5">
<h2 class="text-headline-md font-headline-md text-primary">Nómina Operativa de Brigadistas de Emergencia</h2>
<p class="text-body-sm font-body-sm text-on-surface-variant">Listado oficial de trabajadores autorizados, aptitud médica, dotación y control de reentrenamiento anual.</p>
</div>
<div class="flex items-center gap-xs">
<span class="bg-surface-container-high px-sm py-xs rounded-lg text-label-sm font-label-sm text-on-surface font-semibold">Total Registrados: 28 Brigadistas</span>
<button class="flex items-center gap-xs bg-surface-container-low text-primary px-sm py-xs rounded-lg text-label-sm font-label-sm hover:bg-surface-container-high transition-colors font-medium" type="button">
<span class="material-symbols-outlined text-[16px]">filter_list</span>
<span>Filtrar por Sede</span>
</button>
</div>
</div>
<div class="overflow-x-auto w-full">
<table class="w-full text-left text-body-sm font-body-sm">
<thead class="bg-surface-container-high text-on-surface-variant font-label-sm text-label-sm uppercase tracking-wider">
<tr>
<th class="py-sm px-md font-semibold">Brigadista &amp; Cédula</th>
<th class="py-sm px-md font-semibold">Sede / Finca</th>
<th class="py-sm px-md font-semibold">Rama Asignada</th>
<th class="py-sm px-md font-semibold">Entidad &amp; Certificación</th>
<th class="py-sm px-md font-semibold">Fecha Curso / Vencimiento</th>
<th class="py-sm px-md font-semibold">Dotación Especial EPP</th>
<th class="py-sm px-md font-semibold">Estado</th>
<th class="py-sm px-md font-semibold text-right">Acciones</th>
</tr>
</thead>
<tbody class="divide-y divide-surface-container-low">
<!-- Registro 1 -->
<tr class="hover:bg-surface-container-low/60 transition-colors">
<td class="py-sm px-md">
<div class="flex items-center gap-base">
<div class="w-9 h-9 rounded-full bg-error-container text-on-error-container font-bold flex items-center justify-center shrink-0">BP</div>
<div class="flex flex-col min-w-0">
<span class="font-semibold text-on-surface">Beatriz Helena Pineda</span>
<span class="text-label-sm font-label-sm text-on-surface-variant">C.C. 32.845.190 • Salud Ocupacional</span>
</div>
</div>
</td>
<td class="py-sm px-md">
<span class="font-medium text-on-surface">Planta Central / F. La Esperanza</span>
</td>
<td class="py-sm px-md">
<span class="bg-error-container text-on-error-container px-xs py-0.5 rounded font-label-sm text-label-sm font-semibold inline-flex items-center gap-1">
<span class="material-symbols-outlined text-[13px]">local_hospital</span> Líder 1ros Auxilios
                </span>
</td>
<td class="py-sm px-md">
<div class="flex flex-col">
<span class="font-medium text-on-surface">Cruz Roja Colombiana</span>
<span class="text-label-sm font-label-sm text-on-surface-variant">Soporte Vital Básico y Trauma (40h)</span>
</div>
</td>
<td class="py-sm px-md">
<div class="flex flex-col">
<span class="text-on-surface">15/Ene/2024</span>
<span class="text-label-sm font-label-sm text-primary font-semibold">Vence: 15/Ene/2025 (62 días)</span>
</div>
</td>
<td class="py-sm px-md">
<span class="text-label-sm font-label-sm text-on-surface-variant" title="Chaleco rojo reflectivo, brazalete, linterna, tijeras de trauma, botiquín riñonera">
                  Chaleco reflectivo, brazalete médico, linterna frontal, riñonera médica.
                </span>
</td>
<td class="py-sm px-md">
<span class="bg-surface-container-high text-primary px-xs py-0.5 rounded font-label-sm text-label-sm font-bold inline-flex items-center gap-1">
<span class="w-1.5 h-1.5 rounded-full bg-secondary-container"></span> Vigente
                </span>
</td>
<td class="py-sm px-md text-right">
<button class="p-1 rounded hover:bg-surface-container text-on-surface-variant hover:text-primary transition-colors" title="Ver Hoja de Vida y Certificado" type="button">
<span class="material-symbols-outlined text-[18px]">visibility</span>
</button>
</td>
</tr>
<!-- Registro 2 -->
<tr class="bg-surface-container-low/30 hover:bg-surface-container-low/60 transition-colors">
<td class="py-sm px-md">
<div class="flex items-center gap-base">
<div class="w-9 h-9 rounded-full bg-primary-fixed text-on-primary-fixed font-bold flex items-center justify-center shrink-0">JR</div>
<div class="flex flex-col min-w-0">
<span class="font-semibold text-on-surface">Julián David Restrepo</span>
<span class="text-label-sm font-label-sm text-on-surface-variant">C.C. 98.654.102 • Sup. Beneficiadero</span>
</div>
</div>
</td>
<td class="py-sm px-md">
<span class="font-medium text-on-surface">Finca San José</span>
</td>
<td class="py-sm px-md">
<span class="bg-primary-fixed text-on-primary-fixed px-xs py-0.5 rounded font-label-sm text-label-sm font-semibold inline-flex items-center gap-1">
<span class="material-symbols-outlined text-[13px]">directions_run</span> Líder Evacuación
                </span>
</td>
<td class="py-sm px-md">
<div class="flex flex-col">
<span class="font-medium text-on-surface">Defensa Civil Colombiana</span>
<span class="text-label-sm font-label-sm text-on-surface-variant">Evacuación Masiva y SCI (32h)</span>
</div>
</td>
<td class="py-sm px-md">
<div class="flex flex-col">
<span class="text-on-surface">10/Feb/2024</span>
<span class="text-label-sm font-label-sm text-primary font-semibold">Vence: 10/Feb/2025</span>
</div>
</td>
<td class="py-sm px-md">
<span class="text-label-sm font-label-sm text-on-surface-variant">
                  Chaleco naranja reflectivo, megáfono asignado, silbato naval, radio VHF.
                </span>
</td>
<td class="py-sm px-md">
<span class="bg-surface-container-high text-primary px-xs py-0.5 rounded font-label-sm text-label-sm font-bold inline-flex items-center gap-1">
<span class="w-1.5 h-1.5 rounded-full bg-secondary-container"></span> Vigente
                </span>
</td>
<td class="py-sm px-md text-right">
<button class="p-1 rounded hover:bg-surface-container text-on-surface-variant hover:text-primary transition-colors" type="button">
<span class="material-symbols-outlined text-[18px]">visibility</span>
</button>
</td>
</tr>
<!-- Registro 3 -->
<tr class="hover:bg-surface-container-low/60 transition-colors">
<td class="py-sm px-md">
<div class="flex items-center gap-base">
<div class="w-9 h-9 rounded-full bg-secondary-fixed text-on-secondary-fixed font-bold flex items-center justify-center shrink-0">MR</div>
<div class="flex flex-col min-w-0">
<span class="font-semibold text-on-surface">Ing. Marcos Restrepo</span>
<span class="text-label-sm font-label-sm text-on-surface-variant">C.C. 71.392.408 • Jefe Maquinaria</span>
</div>
</div>
</td>
<td class="py-sm px-md">
<span class="font-medium text-on-surface">Planta Central y Silos</span>
</td>
<td class="py-sm px-md">
<span class="bg-secondary-fixed text-on-secondary-fixed px-xs py-0.5 rounded font-label-sm text-label-sm font-semibold inline-flex items-center gap-1">
<span class="material-symbols-outlined text-[13px]">local_fire_department</span> Líder Incendios
                </span>
</td>
<td class="py-sm px-md">
<div class="flex flex-col">
<span class="font-medium text-on-surface">Cuerpo de Bomberos Oficiales</span>
<span class="text-label-sm font-label-sm text-on-surface-variant">Combate de Incendios Nivel I (40h)</span>
</div>
</td>
<td class="py-sm px-md">
<div class="flex flex-col">
<span class="text-on-surface">22/Nov/2023</span>
<span class="text-label-sm font-label-sm text-error font-semibold">Vence: 22/Nov/2024 (8 días)</span>
</div>
</td>
<td class="py-sm px-md">
<span class="text-label-sm font-label-sm text-on-surface-variant">
                  Monja ignífuga, guantes de bombero NFPA, chaquetón de penetración, linterna antiexplosión.
                </span>
</td>
<td class="py-sm px-md">
<span class="bg-error-container text-on-error-container px-xs py-0.5 rounded font-label-sm text-label-sm font-bold inline-flex items-center gap-1">
<span class="w-1.5 h-1.5 rounded-full bg-error"></span> Por Vencer
                </span>
</td>
<td class="py-sm px-md text-right">
<button class="p-1 rounded hover:bg-surface-container text-on-surface-variant hover:text-primary transition-colors" type="button">
<span class="material-symbols-outlined text-[18px]">visibility</span>
</button>
</td>
</tr>
<!-- Registro 4 -->
<tr class="bg-surface-container-low/30 hover:bg-surface-container-low/60 transition-colors">
<td class="py-sm px-md">
<div class="flex items-center gap-base">
<div class="w-9 h-9 rounded-full bg-tertiary-fixed text-on-tertiary-fixed font-bold flex items-center justify-center shrink-0">CM</div>
<div class="flex flex-col min-w-0">
<span class="font-semibold text-on-surface">Carlos Arturo Mendoza</span>
<span class="text-label-sm font-label-sm text-on-surface-variant">C.C. 15.420.980 • Coordinador Alturas</span>
</div>
</div>
</td>
<td class="py-sm px-md">
<span class="font-medium text-on-surface">Finca El Paraíso</span>
</td>
<td class="py-sm px-md">
<span class="bg-tertiary-fixed text-on-tertiary-fixed px-xs py-0.5 rounded font-label-sm text-label-sm font-semibold inline-flex items-center gap-1">
<span class="material-symbols-outlined text-[13px]">altitude</span> Líder Rescate Alturas
                </span>
</td>
<td class="py-sm px-md">
<div class="flex flex-col">
<span class="font-medium text-on-surface">SENA Regional Caldas</span>
<span class="text-label-sm font-label-sm text-on-surface-variant">Rescatista en Alturas y Confinados (60h)</span>
</div>
</td>
<td class="py-sm px-md">
<div class="flex flex-col">
<span class="text-on-surface">05/Mar/2024</span>
<span class="text-label-sm font-label-sm text-primary font-semibold">Vence: 05/Mar/2025</span>
</div>
</td>
<td class="py-sm px-md">
<span class="text-label-sm font-label-sm text-on-surface-variant">
                  Arnés integral clase III multipropósito, descensor autoblocante 'I D', casco con barbuquejo 3 puntos.
                </span>
</td>
<td class="py-sm px-md">
<span class="bg-surface-container-high text-primary px-xs py-0.5 rounded font-label-sm text-label-sm font-bold inline-flex items-center gap-1">
<span class="w-1.5 h-1.5 rounded-full bg-secondary-container"></span> Vigente
                </span>
</td>
<td class="py-sm px-md text-right">
<button class="p-1 rounded hover:bg-surface-container text-on-surface-variant hover:text-primary transition-colors" type="button">
<span class="material-symbols-outlined text-[18px]">visibility</span>
</button>
</td>
</tr>
<!-- Registro 5 -->
<tr class="hover:bg-surface-container-low/60 transition-colors">
<td class="py-sm px-md">
<div class="flex items-center gap-base">
<div class="w-9 h-9 rounded-full bg-surface-container-high text-primary font-bold flex items-center justify-center shrink-0">GO</div>
<div class="flex flex-col min-w-0">
<span class="font-semibold text-on-surface">Germán Osorio</span>
<span class="text-label-sm font-label-sm text-on-surface-variant">C.C. 10.284.771 • Operador Maquinaria</span>
</div>
</div>
</td>
<td class="py-sm px-md">
<span class="font-medium text-on-surface">Finca La Esperanza</span>
</td>
<td class="py-sm px-md">
<span class="bg-secondary-fixed text-on-secondary-fixed px-xs py-0.5 rounded font-label-sm text-label-sm font-semibold inline-flex items-center gap-1">
<span class="material-symbols-outlined text-[13px]">local_fire_department</span> Brigadista Incendios
                </span>
</td>
<td class="py-sm px-md">
<div class="flex flex-col">
<span class="font-medium text-on-surface">Cuerpo de Bomberos Manizales</span>
<span class="text-label-sm font-label-sm text-on-surface-variant">Extintores Portátiles y Control Conatos (24h)</span>
</div>
</td>
<td class="py-sm px-md">
<div class="flex flex-col">
<span class="text-on-surface">14/Abr/2024</span>
<span class="text-label-sm font-label-sm text-primary font-semibold">Vence: 14/Abr/2025</span>
</div>
</td>
<td class="py-sm px-md">
<span class="text-label-sm font-label-sm text-on-surface-variant">
                  Chaleco rojo reflectivo, guantes de vaqueta reforzada, linterna y silbato de alerta.
                </span>
</td>
<td class="py-sm px-md">
<span class="bg-surface-container-high text-primary px-xs py-0.5 rounded font-label-sm text-label-sm font-bold inline-flex items-center gap-1">
<span class="w-1.5 h-1.5 rounded-full bg-secondary-container"></span> Vigente
                </span>
</td>
<td class="py-sm px-md text-right">
<button class="p-1 rounded hover:bg-surface-container text-on-surface-variant hover:text-primary transition-colors" type="button">
<span class="material-symbols-outlined text-[18px]">visibility</span>
</button>
</td>
</tr>
</tbody>
</table>
</div>
<div class="p-sm bg-surface-container-low flex flex-col md:flex-row md:items-center justify-between gap-base text-body-sm font-body-sm text-on-surface-variant">
<div class="flex items-center gap-base">
<span class="flex items-center gap-1"><span class="w-2 h-2 rounded-full bg-secondary-container"></span> 27 Vigentes (96%)</span>
<span class="flex items-center gap-1"><span class="w-2 h-2 rounded-full bg-error"></span> 1 Por Vencer en 30 días (4%)</span>
<span class="flex items-center gap-1"><span class="w-2 h-2 rounded-full bg-tertiary"></span> 0 Vencidos</span>
</div>
<div class="flex items-center gap-xs">
<span class="text-label-sm font-label-sm">Mostrando 5 de 28 brigadistas</span>
<button class="px-sm py-xs bg-surface-container-lowest text-primary rounded font-label-sm text-label-sm font-semibold hover:bg-surface-container-high transition-colors" type="button">Ver Nómina Completa (28)</button>
</div>
</div>
</div>
</div>
<!-- SECCIÓN 2: MATRIZ Y CONTROL DE EQUIPOS DE EMERGENCIA -->
<div class="tab-content flex flex-col gap-md hidden" id="section-equipos">
<!-- FILTROS POR TIPO DE ELEMENTO Y ESTADO -->
<div class="bg-surface-container-lowest p-md rounded-xl shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-base">
<div class="flex flex-wrap items-center gap-xs">
<span class="text-label-sm font-label-sm text-on-surface-variant uppercase tracking-wider font-semibold mr-xs">Filtrar Recurso:</span>
<button class="px-sm py-xs rounded-lg font-label-md text-label-md bg-primary-container text-on-primary font-medium" type="button">Todos (146)</button>
<button class="px-sm py-xs rounded-lg font-label-md text-label-md bg-surface-container-low text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-colors" type="button">Extintores (64)</button>
<button class="px-sm py-xs rounded-lg font-label-md text-label-md bg-surface-container-low text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-colors" type="button">Botiquines (18)</button>
<button class="px-sm py-xs rounded-lg font-label-md text-label-md bg-surface-container-low text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-colors" type="button">Camillas Miller (12)</button>
<button class="px-sm py-xs rounded-lg font-label-md text-label-md bg-surface-container-low text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-colors" type="button">Lámparas Autónomas (22)</button>
<button class="px-sm py-xs rounded-lg font-label-md text-label-md bg-surface-container-low text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-colors" type="button">Red Hídrica &amp; Gabinetes (8)</button>
</div>
<div class="flex items-center gap-xs">
<button class="flex items-center gap-xs bg-surface-container-low text-primary px-sm py-xs rounded-lg text-label-md font-label-md hover:bg-surface-container-high transition-colors font-medium" type="button">
<span class="material-symbols-outlined text-[18px]">checklist</span>
<span>Descargar Planilla Inspección Mensual</span>
</button>
</div>
</div>
<!-- TABLA DE EQUIPOS -->
<div class="bg-surface-container-lowest rounded-xl shadow-sm overflow-hidden flex flex-col">
<div class="p-md flex items-center justify-between">
<div class="flex flex-col">
<h2 class="text-headline-md font-headline-md text-primary">Inventario e Inspección Periódica de Recursos</h2>
<p class="text-body-sm font-body-sm text-on-surface-variant">Conforme a NFPA 10 (Extintores) y Resolución 0705 de 2007 (Primeros Auxilios en Centros de Trabajo).</p>
</div>
<span class="text-label-sm font-label-sm bg-surface-container-high text-on-surface px-sm py-xs rounded-lg font-medium">Frecuencia: Cada 30 días calendario</span>
</div>
<div class="overflow-x-auto w-full">
<table class="w-full text-left text-body-sm font-body-sm">
<thead class="bg-surface-container-high text-on-surface-variant font-label-sm text-label-sm uppercase tracking-wider">
<tr>
<th class="py-sm px-md font-semibold">Código &amp; Equipo</th>
<th class="py-sm px-md font-semibold">Ubicación Exacta</th>
<th class="py-sm px-md font-semibold">Última Insp.</th>
<th class="py-sm px-md font-semibold">Próxima Insp.</th>
<th class="py-sm px-md font-semibold">Responsable</th>
<th class="py-sm px-md font-semibold">Condición Técnica / Hallazgos</th>
<th class="py-sm px-md font-semibold">Estado</th>
<th class="py-sm px-md font-semibold text-right">Ficha</th>
</tr>
</thead>
<tbody class="divide-y divide-surface-container-low">
<!-- Equipo 1 -->
<tr class="hover:bg-surface-container-low/60 transition-colors">
<td class="py-sm px-md">
<div class="flex items-center gap-base">
<div class="w-8 h-8 rounded-lg bg-error-container text-on-error-container flex items-center justify-center shrink-0 font-bold">
<span class="material-symbols-outlined text-[18px]">fire_extinguisher</span>
</div>
<div class="flex flex-col">
<span class="font-semibold text-on-surface">Extintor Solkaflam 50 lbs (Satélite)</span>
<span class="text-label-sm font-label-sm text-on-surface-variant">ID: EXT-SJ-004 • Agente Limpio 123</span>
</div>
</div>
</td>
<td class="py-sm px-md">
<div class="flex flex-col">
<span class="font-medium text-on-surface">Caseta de Combustibles y ACPM</span>
<span class="text-label-sm font-label-sm text-on-surface-variant">Finca San José (Zona de Tanques)</span>
</div>
</td>
<td class="py-sm px-md text-on-surface">24/Oct/2024</td>
<td class="py-sm px-md font-medium text-primary">24/Nov/2024</td>
<td class="py-sm px-md text-on-surface">Sup. Ramón Vélez</td>
<td class="py-sm px-md">
<span class="text-label-sm font-label-sm text-on-surface">Manómetro en rango verde óptimo. Manguera, tobera y ruedas de transporte libres de obstrucción.</span>
</td>
<td class="py-sm px-md">
<span class="bg-surface-container-high text-primary px-xs py-0.5 rounded font-label-sm text-label-sm font-bold inline-flex items-center gap-1">
<span class="w-1.5 h-1.5 rounded-full bg-secondary-container"></span> Operativo
                </span>
</td>
<td class="py-sm px-md text-right">
<button class="p-1 rounded hover:bg-surface-container text-on-surface-variant hover:text-primary transition-colors" type="button">
<span class="material-symbols-outlined text-[18px]">qr_code_2</span>
</button>
</td>
</tr>
<!-- Equipo 2 -->
<tr class="bg-surface-container-low/30 hover:bg-surface-container-low/60 transition-colors">
<td class="py-sm px-md">
<div class="flex items-center gap-base">
<div class="w-8 h-8 rounded-lg bg-surface-container-high text-primary flex items-center justify-center shrink-0 font-bold">
<span class="material-symbols-outlined text-[18px]">medical_services</span>
</div>
<div class="flex flex-col">
<span class="font-semibold text-on-surface">Botiquín Reglamentario Tipo B (Portátil)</span>
<span class="text-label-sm font-label-sm text-on-surface-variant">ID: BOT-LE-002 • Maletín Lona Impermeable</span>
</div>
</div>
</td>
<td class="py-sm px-md">
<div class="flex flex-col">
<span class="font-medium text-on-surface">Lote 04 - Campamento de Cosecha</span>
<span class="text-label-sm font-label-sm text-on-surface-variant">Finca La Esperanza</span>
</div>
</td>
<td class="py-sm px-md text-on-surface">28/Oct/2024</td>
<td class="py-sm px-md font-medium text-primary">28/Nov/2024</td>
<td class="py-sm px-md text-on-surface">Beatriz Pineda (Salud)</td>
<td class="py-sm px-md">
<span class="text-label-sm font-label-sm text-on-surface">Insumos 100% completos según Res. 0705/07. Apósitos estériles, suero y férulas en vigencia hasta 2026.</span>
</td>
<td class="py-sm px-md">
<span class="bg-surface-container-high text-primary px-xs py-0.5 rounded font-label-sm text-label-sm font-bold inline-flex items-center gap-1">
<span class="w-1.5 h-1.5 rounded-full bg-secondary-container"></span> Conforme
                </span>
</td>
<td class="py-sm px-md text-right">
<button class="p-1 rounded hover:bg-surface-container text-on-surface-variant hover:text-primary transition-colors" type="button">
<span class="material-symbols-outlined text-[18px]">qr_code_2</span>
</button>
</td>
</tr>
<!-- Equipo 3 -->
<tr class="hover:bg-surface-container-low/60 transition-colors">
<td class="py-sm px-md">
<div class="flex items-center gap-base">
<div class="w-8 h-8 rounded-lg bg-surface-container-high text-on-surface flex items-center justify-center shrink-0 font-bold">
<span class="material-symbols-outlined text-[18px]">accessible_forward</span>
</div>
<div class="flex flex-col">
<span class="font-semibold text-on-surface">Camilla Miller Rígida con Inmovilizador</span>
<span class="text-label-sm font-label-sm text-on-surface-variant">ID: CAM-PC-001 • Polímero de Alta Resistencia</span>
</div>
</div>
</td>
<td class="py-sm px-md">
<div class="flex flex-col">
<span class="font-medium text-on-surface">Pabellón de Empacadora y Criba</span>
<span class="text-label-sm font-label-sm text-on-surface-variant">Planta Central (Punto de Primeros Auxilios)</span>
</div>
</td>
<td class="py-sm px-md text-on-surface">15/Oct/2024</td>
<td class="py-sm px-md font-medium text-primary">15/Nov/2024</td>
<td class="py-sm px-md text-on-surface">Almacén Central</td>
<td class="py-sm px-md">
<span class="text-label-sm font-label-sm text-on-surface">Arnés tipo araña con velcro en perfecto estado. Inmovilizadores laterales de cabeza limpios y sellados.</span>
</td>
<td class="py-sm px-md">
<span class="bg-surface-container-high text-primary px-xs py-0.5 rounded font-label-sm text-label-sm font-bold inline-flex items-center gap-1">
<span class="w-1.5 h-1.5 rounded-full bg-secondary-container"></span> Óptimo
                </span>
</td>
<td class="py-sm px-md text-right">
<button class="p-1 rounded hover:bg-surface-container text-on-surface-variant hover:text-primary transition-colors" type="button">
<span class="material-symbols-outlined text-[18px]">qr_code_2</span>
</button>
</td>
</tr>
<!-- Equipo 4 -->
<tr class="bg-surface-container-low/30 hover:bg-surface-container-low/60 transition-colors">
<td class="py-sm px-md">
<div class="flex items-center gap-base">
<div class="w-8 h-8 rounded-lg bg-surface-container-high text-primary flex items-center justify-center shrink-0 font-bold">
<span class="material-symbols-outlined text-[18px]">flashlight_on</span>
</div>
<div class="flex flex-col">
<span class="font-semibold text-on-surface">Lámpara Autónoma de Emergencia (LED)</span>
<span class="text-label-sm font-label-sm text-on-surface-variant">ID: ILUM-BQ-003 • Batería de Gel 90 min</span>
</div>
</div>
</td>
<td class="py-sm px-md">
<div class="flex flex-col">
<span class="font-medium text-on-surface">Bodega Central de Plaguicidas</span>
<span class="text-label-sm font-label-sm text-on-surface-variant">Puerta Este de Evacuación</span>
</div>
</td>
<td class="py-sm px-md text-on-surface">20/Oct/2024</td>
<td class="py-sm px-md font-medium text-primary">20/Nov/2024</td>
<td class="py-sm px-md text-on-surface">Javier Soto (Mantenimiento)</td>
<td class="py-sm px-md">
<span class="text-label-sm font-label-sm text-on-surface">Prueba de conmutación sin red eléctrica superada: autonomía sostenida de 94 minutos comprobada.</span>
</td>
<td class="py-sm px-md">
<span class="bg-surface-container-high text-primary px-xs py-0.5 rounded font-label-sm text-label-sm font-bold inline-flex items-center gap-1">
<span class="w-1.5 h-1.5 rounded-full bg-secondary-container"></span> Verificada
                </span>
</td>
<td class="py-sm px-md text-right">
<button class="p-1 rounded hover:bg-surface-container text-on-surface-variant hover:text-primary transition-colors" type="button">
<span class="material-symbols-outlined text-[18px]">qr_code_2</span>
</button>
</td>
</tr>
<!-- Equipo 5 (En recarga / Hallazgo) -->
<tr class="hover:bg-surface-container-low/60 transition-colors">
<td class="py-sm px-md">
<div class="flex items-center gap-base">
<div class="w-8 h-8 rounded-lg bg-error-container text-on-error-container flex items-center justify-center shrink-0 font-bold">
<span class="material-symbols-outlined text-[18px]">build_circle</span>
</div>
<div class="flex flex-col">
<span class="font-semibold text-on-surface">Extintor PQS 20 lbs Multipropósito</span>
<span class="text-label-sm font-label-sm text-on-surface-variant">ID: EXT-TM-012 • Polvo Químico Seco ABC</span>
</div>
</div>
</td>
<td class="py-sm px-md">
<div class="flex flex-col">
<span class="font-medium text-on-surface">Taller Central de Tractores</span>
<span class="text-label-sm font-label-sm text-on-surface-variant">Área de Soldadura y Torno</span>
</div>
</td>
<td class="py-sm px-md text-on-surface">29/Oct/2024</td>
<td class="py-sm px-md font-medium text-error">En Recarga Externa</td>
<td class="py-sm px-md text-on-surface">Ing. Marcos Restrepo</td>
<td class="py-sm px-md">
<span class="text-label-sm font-label-sm text-error font-semibold">Descarga por mantenimiento preventivo anual. Se instaló sustituto provisional PQS 20 lbs ID: EXT-REP-03.</span>
</td>
<td class="py-sm px-md">
<span class="bg-error-container text-on-error-container px-xs py-0.5 rounded font-label-sm text-label-sm font-bold inline-flex items-center gap-1">
<span class="w-1.5 h-1.5 rounded-full bg-error"></span> En Mantenimiento
                </span>
</td>
<td class="py-sm px-md text-right">
<button class="p-1 rounded hover:bg-surface-container text-on-surface-variant hover:text-primary transition-colors" type="button">
<span class="material-symbols-outlined text-[18px]">qr_code_2</span>
</button>
</td>
</tr>
</tbody>
</table>
</div>
</div>
</div>
<!-- SECCIÓN 3: CONTROL Y EVALUACIÓN DE SIMULACROS -->
<div class="tab-content flex flex-col gap-base hidden" id="section-simulacros">
<!-- CRONOGRAMA Y EVENTOS REALIZADOS -->
<div class="grid grid-cols-1 lg:grid-cols-3 gap-base">
<!-- EVENTO 1: SIMULACRO NACIONAL (COMPLETO) -->
<article class="lg:col-span-2 bg-surface-container-lowest p-md rounded-xl shadow-sm flex flex-col justify-between">
<div>
<div class="flex flex-wrap items-center justify-between gap-xs pb-sm">
<div class="flex items-center gap-xs">
<span class="bg-primary-container text-on-primary font-label-sm text-label-sm px-xs py-0.5 rounded font-bold uppercase">Simulacro Evaluado Oficial</span>
<span class="text-label-sm font-label-sm text-on-surface-variant">Radicado UNGRD: #2024-CAL-0981</span>
</div>
<span class="bg-surface-container-high text-primary px-xs py-0.5 rounded font-label-sm text-label-sm font-bold flex items-center gap-1">
<span class="material-symbols-outlined text-[14px]">check_circle</span> Calificación: 96 / 100 (Excelente)
            </span>
</div>
<h3 class="text-headline-md font-headline-md text-primary">Simulacro Nacional de Respuesta a Emergencias 2024</h3>
<p class="text-body-sm font-body-sm text-on-surface-variant mt-1">Escenario de sismo de magnitud 6.8 con hipocentro cercano y colapso parcial ficticio en bodega de secado de café.</p>
<!-- Ficha de Datos del Simulacro -->
<div class="grid grid-cols-2 sm:grid-cols-4 gap-base my-md p-sm bg-surface-container-low rounded-lg">
<div class="flex flex-col">
<span class="text-label-sm font-label-sm text-on-surface-variant">Fecha y Hora</span>
<span class="text-label-md font-label-md font-semibold text-on-surface">02/Oct/2024 • 09:00 AM</span>
</div>
<div class="flex flex-col">
<span class="text-label-sm font-label-sm text-on-surface-variant">Lugar Principal</span>
<span class="text-label-md font-label-md font-semibold text-on-surface">Planta Central + F. La Esperanza</span>
</div>
<div class="flex flex-col">
<span class="text-label-sm font-label-sm text-on-surface-variant">Participantes</span>
<span class="text-label-md font-label-md font-semibold text-primary">124 Evacuados + 12 Brigadistas</span>
</div>
<div class="flex flex-col">
<span class="text-label-sm font-label-sm text-on-surface-variant">Tiempo Evacuación</span>
<span class="text-label-md font-label-md font-semibold text-primary">3 min 12 seg (100% censado)</span>
</div>
</div>
<!-- Hallazgos y Plan de Acción Conforme a Dec. 1072 -->
<div class="flex flex-col gap-base">
<div class="bg-surface-container-lowest p-sm rounded-lg flex flex-col gap-1">
<span class="text-label-sm font-label-sm text-on-surface-variant uppercase tracking-wider font-semibold flex items-center gap-1">
<span class="material-symbols-outlined text-[16px] text-error">warning</span> Oportunidad de Mejora Identificada:
              </span>
<p class="text-body-sm font-body-sm text-on-surface">
                La sirena electromecánica principal no tuvo cobertura auditiva suficiente en el patio posterior de secado de café debido al acople acústico de las tolvas descerezadoras en funcionamiento continuo.
              </p>
</div>
<div class="bg-surface-container-high/60 p-sm rounded-lg flex flex-col md:flex-row md:items-center justify-between gap-base">
<div class="flex flex-col min-w-0">
<span class="text-label-sm font-label-sm text-primary font-bold uppercase tracking-wider">Plan de Acción Correctivo (SG-SST):</span>
<span class="text-body-sm font-body-sm text-on-surface font-medium">Instalación de sirena estroboscópica de 110 dB interconectada al panel de alarma general en patio #2.</span>
<span class="text-label-sm font-label-sm text-on-surface-variant">Responsable: Javier Soto (Mantenimiento) • Fecha Límite: 15/Nov/2024</span>
</div>
<span class="bg-surface-container-lowest text-primary px-xs py-0.5 rounded font-label-sm text-label-sm font-semibold shrink-0">
                Estado: En Ejecución 80%
              </span>
</div>
</div>
</div>
<div class="mt-base pt-base flex items-center justify-between">
<div class="flex items-center gap-1 text-on-surface-variant text-label-sm font-label-sm">
<span class="material-symbols-outlined text-[16px]">attachment</span>
<span>Acta de Evaluación, Listados de Asistencia y Registro Fotográfico Anexos</span>
</div>
<button class="text-primary hover:underline text-label-md font-label-md font-semibold flex items-center gap-0.5" type="button">
<span>Ver Informe y Lecciones Aprendidas</span>
<span class="material-symbols-outlined text-[16px]">arrow_forward</span>
</button>
</div>
</article>
<!-- EVENTO 2 & 3: COLUMNA LATERAL DE SIMULACROS -->
<div class="flex flex-col gap-base">
<!-- Simulacro 2: Fitosanitarios -->
<article class="bg-surface-container-lowest p-md rounded-xl shadow-sm flex flex-col justify-between">
<div class="flex items-center justify-between">
<span class="bg-surface-container-high text-on-surface font-label-sm text-label-sm px-xs py-0.5 rounded font-semibold uppercase">Simulacro Interno Sectorial</span>
<span class="text-label-sm font-label-sm text-primary font-bold">18/May/2024</span>
</div>
<div class="mt-base">
<h4 class="text-headline-md font-headline-md text-on-surface leading-tight">Derrame de Plaguicida con Conato en Bodega</h4>
<p class="text-body-sm font-body-sm text-on-surface-variant mt-1">Bodega Central de Agroquímicos. Participación de 18 operarios y brigadistas de planta.</p>
<div class="mt-base p-xs bg-surface-container-low rounded-lg text-body-sm font-body-sm text-on-surface">
<span class="font-semibold text-primary">Resultado Operativo:</span>
<p class="text-label-sm font-label-sm mt-0.5">Despliegue del kit de control de derrames y sofocación de conato con extintor satélite Solkaflam en 1 min 45 seg. Procedimiento cerrado conforme.</p>
</div>
</div>
<div class="mt-base pt-xs flex items-center justify-between">
<span class="text-label-sm font-label-sm text-on-surface-variant">Evaluador: ARL Sura</span>
<span class="text-label-sm font-label-sm font-bold text-primary">Cumplimiento: 100%</span>
</div>
</article>
<!-- Simulacro 3: PROGRAMADO PRÓXIMO -->
<article class="bg-primary-container text-on-primary p-md rounded-xl shadow-sm flex flex-col justify-between">
<div class="flex items-center justify-between">
<span class="bg-primary text-on-primary font-label-sm text-label-sm px-xs py-0.5 rounded font-bold uppercase tracking-wider">Próximo en Calendario</span>
<span class="text-label-sm font-label-sm bg-surface-container-lowest text-primary px-xs py-0.5 rounded font-bold">06/Dic/2024</span>
</div>
<div class="mt-base">
<div class="flex items-center gap-xs">
<span class="material-symbols-outlined text-[20px] text-on-primary-container">altitude</span>
<h4 class="text-headline-md font-headline-md text-on-primary leading-tight">Rescate en Alturas en Silo de Almacenamiento</h4>
</div>
<p class="text-body-sm font-body-sm text-on-primary-container mt-1">Hipótesis: Trabajador suspendido inconsciente durante mantenimiento electromecánico en cúpula de silo a 14 metros de altura.</p>
<div class="mt-base p-xs bg-primary/40 rounded-lg text-label-sm font-label-sm text-on-primary">
<span>Coordinación: Rama de Alturas + Cuerpo de Bomberos de Chinchiná con trípode de rescate y polipasto 4:1.</span>
</div>
</div>
<div class="mt-base pt-xs flex items-center justify-between">
<span class="text-label-sm font-label-sm text-on-primary-container">Estado: Guion Operativo Aprobado</span>
<button class="text-on-primary text-label-sm font-label-sm font-bold underline hover:text-on-primary-container" type="button">Gestionar Logística</button>
</div>
</article>
</div>
</div>
</div>
<!-- COMPONENTES DE SOPORTE Y PLANO DE EVACUACIÓN -->
<section class="mt-lg grid grid-cols-1 lg:grid-cols-3 gap-base">
<!-- Tarjeta Directorio Telefónico de Emergencias (Art. 2.2.4.6.25 Parágrafo 1) -->
<div class="bg-surface-container-lowest p-md rounded-xl shadow-sm flex flex-col justify-between">
<div class="flex items-center justify-between pb-xs">
<span class="text-on-surface-variant font-label-sm text-label-sm uppercase tracking-wider font-semibold">Cadena de Llamadas &amp; Ayuda Mutua</span>
<span class="material-symbols-outlined text-primary text-[20px]">phone_in_talk</span>
</div>
<div class="flex flex-col gap-xs mt-base">
<div class="flex items-center justify-between p-xs bg-surface-container-low rounded-lg">
<div class="flex flex-col">
<span class="font-semibold text-on-surface text-body-sm font-body-sm">Cuerpo Oficial de Bomberos</span>
<span class="text-label-sm font-label-sm text-on-surface-variant">Estación Central Municipal</span>
</div>
<span class="font-bold text-primary text-label-md font-label-md">119 • (606) 884-1234</span>
</div>
<div class="flex items-center justify-between p-xs bg-surface-container-low rounded-lg">
<div class="flex flex-col">
<span class="font-semibold text-on-surface text-body-sm font-body-sm">Cruz Roja Colombiana</span>
<span class="text-label-sm font-label-sm text-on-surface-variant">Atención Médica y Ambulancias</span>
</div>
<span class="font-bold text-primary text-label-md font-label-md">132 • (606) 886-0900</span>
</div>
<div class="flex items-center justify-between p-xs bg-surface-container-low rounded-lg">
<div class="flex flex-col">
<span class="font-semibold text-on-surface text-body-sm font-body-sm">Línea Asistencial ARL Sura</span>
<span class="text-label-sm font-label-sm text-on-surface-variant">Reporte Inmediato de Accidentes</span>
</div>
<span class="font-bold text-primary text-label-md font-label-md">01 8000 511 414</span>
</div>
<div class="flex items-center justify-between p-xs bg-surface-container-low rounded-lg">
<div class="flex flex-col">
<span class="font-semibold text-on-surface text-body-sm font-body-sm">Comité Ayuda Mutua Cafetera</span>
<span class="text-label-sm font-label-sm text-on-surface-variant">Fincas San José y Manzanares</span>
</div>
<span class="font-bold text-primary text-label-md font-label-md">Radio Canal 4 UHF</span>
</div>
</div>
<div class="mt-base pt-xs flex items-center justify-between">
<span class="text-label-sm font-label-sm text-on-surface-variant">Validado en Planilla de Turnos 24/7</span>
<button class="text-label-sm font-label-sm text-primary font-semibold hover:underline" type="button">Actualizar Contactos</button>
</div>
</div>
<!-- Visor de Puntos de Encuentro e Instalaciones Físicas -->
<div class="lg:col-span-2 bg-surface-container-lowest p-md rounded-xl shadow-sm flex flex-col justify-between">
<div class="flex flex-wrap items-center justify-between gap-base pb-xs">
<div class="flex flex-col">
<span class="text-on-surface-variant font-label-sm text-label-sm uppercase tracking-wider font-semibold">Puntos de Encuentro y Rutas de Desalojo</span>
<h3 class="text-headline-md font-headline-md text-primary font-bold">Distribución Espacial Multi-Predio</h3>
</div>
<div class="flex items-center gap-xs">
<span class="bg-surface-container-high px-xs py-0.5 rounded text-label-sm font-label-sm text-on-surface font-semibold">P.E. Principal: Cancha de Fútbol San José</span>
<span class="bg-surface-container-high px-xs py-0.5 rounded text-label-sm font-label-sm text-on-surface font-semibold">P.E. Secundario: Portería F. La Esperanza</span>
</div>
</div>
<div class="grid grid-cols-1 md:grid-cols-3 gap-base my-base">
<div class="p-sm bg-surface-container-low rounded-xl flex flex-col justify-between">
<div class="flex items-center gap-xs">
<span class="material-symbols-outlined text-primary text-[20px]">pin_drop</span>
<span class="text-label-md font-label-md font-bold text-on-surface">Punto Encuentro #1 (Planta)</span>
</div>
<p class="text-body-sm font-body-sm text-on-surface-variant mt-xs">Ubicado en explanada exterior frente a báscula de pesaje. Libre de cables aéreos y árboles centenarios.</p>
<div class="mt-base flex items-center justify-between text-label-sm font-label-sm text-primary font-semibold">
<span>Capacidad: 180 Personas</span>
<span class="material-symbols-outlined text-[16px]">check</span>
</div>
</div>
<div class="p-sm bg-surface-container-low rounded-xl flex flex-col justify-between">
<div class="flex items-center gap-xs">
<span class="material-symbols-outlined text-primary text-[20px]">pin_drop</span>
<span class="text-label-md font-label-md font-bold text-on-surface">Punto Encuentro #2 (San José)</span>
</div>
<p class="text-body-sm font-body-sm text-on-surface-variant mt-xs">Zona verde contigua al campamento general de recolectores. Incluye toma de red de hidrante auxiliar.</p>
<div class="mt-base flex items-center justify-between text-label-sm font-label-sm text-primary font-semibold">
<span>Capacidad: 120 Personas</span>
<span class="material-symbols-outlined text-[16px]">check</span>
</div>
</div>
<div class="p-sm bg-surface-container-low rounded-xl flex flex-col justify-between">
<div class="flex items-center gap-xs">
<span class="material-symbols-outlined text-primary text-[20px]">pin_drop</span>
<span class="text-label-md font-label-md font-bold text-on-surface">Punto Encuentro #3 (Paraíso)</span>
</div>
<p class="text-body-sm font-body-sm text-on-surface-variant mt-xs">Helipuerto y patio de maniobras de maquinaria pesada. Dotado de camilla rígida de campaña y megáfono.</p>
<div class="mt-base flex items-center justify-between text-label-sm font-label-sm text-primary font-semibold">
<span>Capacidad: 80 Personas</span>
<span class="material-symbols-outlined text-[16px]">check</span>
</div>
</div>
</div>
<div class="flex flex-wrap items-center justify-between gap-base pt-xs bg-surface-container-low p-sm rounded-lg">
<div class="flex items-center gap-xs text-body-sm font-body-sm text-on-surface">
<span class="material-symbols-outlined text-primary text-[18px]">verified</span>
<span>Mapas actualizados y visibles en 14 carteleras estratégicas de acuerdo a la Norma NTC 1461.</span>
</div>
<button class="text-primary font-label-md text-label-md font-semibold hover:underline" type="button">
          Abrir Geovisor Cartográfico Completo
        </button>
</div>
</div>
</section>
<!-- SCRIPT DE MICRO-INTERACCIÓN PARA TABS -->
<script>
    function switchSection(target) {
      // Ocultar todas las secciones
      document.querySelectorAll('.tab-content').forEach(function(content) {
        content.classList.add('hidden');
      });

      // Remover estado activo de botones
      document.querySelectorAll('.tab-button').forEach(function(btn) {
        btn.classList.remove('bg-primary-container', 'text-on-primary', 'font-medium', 'shadow-sm');
        btn.classList.add('text-on-surface-variant');
      });

      // Mostrar la seleccionada
      var targetSection = document.getElementById('section-' + target);
      var targetBtn = document.getElementById('tab-btn-' + target);

      if (targetSection) {
        targetSection.classList.remove('hidden');
      }
      if (targetBtn) {
        targetBtn.classList.add('bg-primary-container', 'text-on-primary', 'font-medium', 'shadow-sm');
        targetBtn.classList.remove('text-on-surface-variant');
      }
    }

  </script>
</div></main></div></body></html>
