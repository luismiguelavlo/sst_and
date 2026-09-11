14. ACCIDENTES E INCIDENTES
    Crear módulo de registro.
    Campos:
    • Número de evento
    • Fecha
    • Hora
    • Trabajador
    • Empresa
    • Cargo
    • Área
    • Centro de trabajo
    • Finca
    • Tipo de evento
    • Descripción
    • Tipo de accidente
    • Mecanismo
    • Agente
    • Parte del cuerpo
    • Tipo de lesión
    • Días perdidos
    • Origen
    • Investigación
    • Acción correctiva
    • Estado
    Tipos:
    • Accidente de trabajo
    • Incidente
    • Accidente vial
    • Evento peligroso
    • Otros
    Dashboard:
    • Accidentes por mes
    • Accidentes por empresa
    • Accidentes por finca
    • Accidentes por área
    • Accidentes por cargo
    • Accidentes por mecanismo
    • Accidentes por parte del cuerpo
    • Días perdidos
    • Tendencia mensual

---

15. CAUSAS DE ACCIDENTES
    Relacionar cada accidente con:
    Causa inmediata
    • Acto subestándar
    • Condición subestándar
    Causa básica
    • Factor personal
    • Factor de trabajo
    Además:
    • Causa principal
    • Agente
    • Mecanismo
    • Acción correctiva
    Crear gráfico:
    PRINCIPALES CAUSAS
    Mostrar porcentajes y ranking.

---

16. INVESTIGACIONES
    Crear módulo para controlar investigaciones.
    Campos:
    • Accidente relacionado
    • Fecha del accidente
    • Fecha límite
    • Responsable
    • Estado
    • Fecha investigación
    • Equipo investigador
    • Metodología
    • Causas
    • Plan de acción
    • Evidencia
    • Fecha cierre
    Crear alerta para investigaciones pendientes y próximas a vencerse.s

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
  }</script></head><body class="bg-background font-body-md text-body-md text-on-surface antialiased"><aside class="fixed left-0 top-0 h-full w-72 bg-surface-container-lowest shadow-[0_1px_8px_rgba(0,0,0,0.04)] z-50 flex flex-col justify-between overflow-y-auto"><div class="p-gutter pb-0"><div class="flex items-center gap-base mb-xs"><div class="w-8 h-8 rounded bg-primary-container flex items-center justify-center text-on-primary font-headline-md text-headline-md">M</div><div class="flex flex-col"><span class="font-label-md text-label-md text-primary leading-tight font-semibold">Grupo Manzanares S.A.S.</span><span class="font-label-sm text-label-sm text-on-surface-variant">SG-SST Operativo</span></div></div><div class="flex items-center gap-xs mt-base mb-md"><span class="bg-surface-container-high text-on-surface font-label-sm text-label-sm px-xs py-0.5 rounded">Dec. 1072</span><span class="bg-surface-container-high text-on-surface font-label-sm text-label-sm px-xs py-0.5 rounded">Res. 0312</span></div></div><nav class="flex-1 px-sm pb-gutter flex flex-col gap-base" data-active-classes="bg-primary-container text-on-primary font-medium rounded-lg"><div class="flex flex-col gap-xs"><span class="px-xs font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">Gestión Operativa</span><a class="flex items-center gap-base px-sm py-xs rounded-lg text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-colors font-label-md text-label-md" data-path="dashboard" href="#"><span class="material-symbols-outlined text-[20px]">dashboard</span>Inicio / Dashboard</a><a class="flex items-center gap-base px-sm py-xs rounded-lg text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-colors font-label-md text-label-md" data-path="trabajadores" href="#"><span class="material-symbols-outlined text-[20px]">badge</span>Trabajadores</a><a class="flex items-center gap-base px-sm py-xs rounded-lg text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-colors font-label-md text-label-md" data-path="examenes-medicos" href="#"><span class="material-symbols-outlined text-[20px]">medical_services</span>Exámenes Médicos (EMOS)</a><a class="flex items-center gap-base px-sm py-xs rounded-lg text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-colors font-label-md text-label-md" data-path="casos-de-salud" href="#"><span class="material-symbols-outlined text-[20px]">health_and_safety</span>Casos de Salud</a><a class="flex items-center gap-base px-sm py-xs rounded-lg text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-colors font-label-md text-label-md" data-path="incapacidades-y-reintegros" href="#"><span class="material-symbols-outlined text-[20px]">assignment_return</span>Incapacidades y Reintegros</a></div><div class="flex flex-col gap-xs"><span class="px-xs font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">Riesgos Críticos &amp; Viales</span><a class="flex items-center gap-base px-sm py-xs rounded-lg text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-colors font-label-md text-label-md" data-path="trabajo-en-alturas" href="#"><span class="material-symbols-outlined text-[20px]">height</span>Trabajo en Alturas</a><a class="flex items-center gap-base px-sm py-xs rounded-lg text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-colors font-label-md text-label-md" data-path="tractoristas-operadores" href="#"><span class="material-symbols-outlined text-[20px]">agriculture</span>Tractoristas / Operadores</a><a class="flex items-center gap-base px-sm py-xs rounded-lg text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-colors font-label-md text-label-md" data-path="pesv-seguridad-vial" href="#"><span class="material-symbols-outlined text-[20px]">traffic</span>PESV (Seguridad Vial)</a><a class="flex items-center gap-base px-sm py-xs rounded-lg text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-colors font-label-md text-label-md" data-path="epp" href="#"><span class="material-symbols-outlined text-[20px]">security</span>EPP</a></div><div class="flex flex-col gap-xs"><span class="px-xs font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">Inspección &amp; Eventos</span><a class="flex items-center gap-base px-sm py-xs rounded-lg text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-colors font-label-md text-label-md" data-path="inspecciones" href="#"><span class="material-symbols-outlined text-[20px]">fact_check</span>Inspecciones</a><a aria-current="page" class="flex items-center justify-between px-sm py-xs transition-colors bg-primary-container text-on-primary font-medium rounded-lg" data-path="accidentes-e-incidentes" href="#"><div class="flex items-center gap-base"><span class="material-symbols-outlined text-[20px]">warning</span>Accidentes e Incidentes</div><span class="bg-error text-on-error font-label-sm text-label-sm px-xs py-0.5 rounded-full">2</span></a><a class="flex items-center gap-base px-sm py-xs rounded-lg text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-colors font-label-md text-label-md" data-path="investigaciones" href="#"><span class="material-symbols-outlined text-[20px]">manage_search</span>Investigaciones</a><a class="flex items-center gap-base px-sm py-xs rounded-lg text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-colors font-label-md text-label-md" data-path="acciones-correctivas" href="#"><span class="material-symbols-outlined text-[20px]">check_circle</span>Acciones Correctivas</a></div><div class="flex flex-col gap-xs"><span class="px-xs font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">Comités &amp; Cultura</span><a class="flex items-center gap-base px-sm py-xs rounded-lg text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-colors font-label-md text-label-md" data-path="capacitaciones" href="#"><span class="material-symbols-outlined text-[20px]">school</span>Capacitaciones</a><a class="flex items-center gap-base px-sm py-xs rounded-lg text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-colors font-label-md text-label-md" data-path="documentos-sg-sst" href="#"><span class="material-symbols-outlined text-[20px]">folder_open</span>Documentos SG-SST</a><a class="flex items-center gap-base px-sm py-xs rounded-lg text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-colors font-label-md text-label-md" data-path="copasst" href="#"><span class="material-symbols-outlined text-[20px]">groups</span>COPASST</a><a class="flex items-center gap-base px-sm py-xs rounded-lg text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-colors font-label-md text-label-md" data-path="ccl" href="#"><span class="material-symbols-outlined text-[20px]">handshake</span>CCL</a><a class="flex items-center gap-base px-sm py-xs rounded-lg text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-colors font-label-md text-label-md" data-path="emergencias" href="#"><span class="material-symbols-outlined text-[20px]">emergency</span>Emergencias</a><a class="flex items-center gap-base px-sm py-xs rounded-lg text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-colors font-label-md text-label-md" data-path="quimicos" href="#"><span class="material-symbols-outlined text-[20px]">science</span>Químicos</a></div></nav></aside><div class="pl-72"><header class="fixed top-0 left-72 right-0 h-16 bg-surface-container-lowest/90 backdrop-blur-xl shadow-[0_1px_8px_rgba(0,0,0,0.04)] z-40 flex items-center justify-between px-gutter"><div class="flex items-center gap-md flex-1 max-w-xl"><div class="relative w-full"><span class="material-symbols-outlined absolute left-sm top-1/2 -translate-y-1/2 text-on-surface-variant text-[20px]">search</span><input class="w-full bg-surface-container-low text-on-surface placeholder:text-on-surface-variant pl-10 pr-sm py-xs rounded-lg font-body-sm text-body-sm focus:outline-none focus:ring-2 focus:ring-secondary-container transition-all" placeholder="Buscar trabajadores, incidentes, normativas..." type="search"/></div><div class="flex items-center bg-surface-container-low px-sm py-xs rounded-lg gap-xs shrink-0"><span class="material-symbols-outlined text-[18px] text-on-surface-variant">gavel</span><span class="font-label-sm text-label-sm text-on-surface">Estándares 2024</span><span class="material-symbols-outlined text-[16px] text-on-surface-variant">expand_more</span></div></div><div class="flex items-center gap-base"><button class="flex items-center gap-xs bg-primary-container text-on-primary px-sm py-xs rounded-lg font-label-md text-label-md hover:bg-primary transition-colors" type="button"><span class="material-symbols-outlined text-[18px]">add_alert</span><span>Reporte Rápido / Notificación</span></button><button class="relative w-10 h-10 flex items-center justify-center rounded-lg hover:bg-surface-container-high transition-colors text-on-surface-variant" type="button"><span class="material-symbols-outlined text-[22px]">notifications</span><span class="absolute top-2 right-2 w-2 h-2 rounded-full bg-error"></span></button><div class="flex items-center gap-sm pl-xs"><div class="text-right hidden xl:block"><div class="font-label-md text-label-md text-on-surface font-medium">Ing. Andrés Valencia</div><div class="font-label-sm text-label-sm text-on-surface-variant">Coordinador SG-SST</div></div><div class="w-8 h-8 rounded-full bg-primary flex items-center justify-center"><span class="material-symbols-outlined text-on-primary text-[18px]">person</span></div></div></div></header><main class="w-full px-gutter pt-16 bg-surface min-h-screen"><div class="flex flex-col w-full pb-xl">
<!-- ENCABEZADO NORMATIVO Y ACCIONES EJECUTIVAS -->
<header class="py-md flex flex-col xl:flex-row xl:items-end justify-between gap-base">
<div class="flex flex-col gap-xs">
<div class="flex flex-wrap items-center gap-xs">
<span class="bg-primary text-on-primary font-label-sm text-label-sm px-xs py-0.5 rounded tracking-wide font-semibold">MÓDULO 14</span>
<span class="bg-surface-container-high text-on-surface-variant font-label-sm text-label-sm px-xs py-0.5 rounded font-medium">Resolución 0312 de 2019</span>
<span class="bg-surface-container-high text-on-surface-variant font-label-sm text-label-sm px-xs py-0.5 rounded font-medium">Decreto 1072 de 2015</span>
<span class="bg-secondary text-on-secondary font-label-sm text-label-sm px-xs py-0.5 rounded font-medium">Resolución 1401 de 2007 (Investigaciones)</span>
<span class="bg-surface-container-highest text-primary font-label-sm text-label-sm px-xs py-0.5 rounded font-semibold flex items-center gap-1">
<span class="material-symbols-outlined text-[14px]">verified</span> Registro FURAT / FUI Integrado
        </span>
</div>
<h1 class="font-display-lg text-display-lg text-on-background font-bold tracking-tight">
        14. Registro y Gestión de Accidentes e Incidentes de Trabajo
      </h1>
<p class="font-body-md text-body-md text-on-surface-variant max-w-4xl">
        Consolidación de eventos no deseados, reporte formal FURAT (ARL Sura / Positiva), seguimiento de términos perentorios de 15 días calendario para investigación multidisciplinaria y cálculo de severidad y frecuencia.
      </p>
</div>
<!-- Botones de Acción Primaria -->
<div class="flex flex-wrap items-center gap-xs shrink-0 pt-xs xl:pt-0">
<button class="flex items-center gap-xs bg-surface-container-lowest hover:bg-surface-container-high text-on-surface font-label-md text-label-md px-sm py-base rounded-lg shadow-sm transition-all duration-200" type="button">
<span class="material-symbols-outlined text-[18px] text-secondary">file_download</span>
<span>Exportar Matriz (.XLSX)</span>
</button>
<button class="flex items-center gap-xs bg-surface-container-lowest hover:bg-surface-container-high text-on-surface font-label-md text-label-md px-sm py-base rounded-lg shadow-sm transition-all duration-200" type="button">
<span class="material-symbols-outlined text-[18px] text-primary">monitoring</span>
<span>Generar Indicadores Mensuales</span>
</button>
<button class="flex items-center gap-xs bg-primary hover:bg-primary-container text-on-primary font-label-md text-label-md px-md py-base rounded-lg shadow-md transition-all duration-200" type="button">
<span class="material-symbols-outlined text-[18px]">add_task</span>
<span>+ Reportar Nuevo Evento (FURAT/FUI)</span>
</button>
</div>
</header>
<!-- RESUMEN MÉTRICO CONSOLIDADO (KPI CARDS) -->
<section class="mt-base grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-base">
<!-- Card 1: Total Eventos -->
<div class="bg-surface-container-lowest p-md rounded-xl shadow-sm flex flex-col justify-between">
<div class="flex items-center justify-between mb-xs">
<span class="font-label-sm text-label-sm text-on-surface-variant uppercase font-semibold">Total Eventos del Año</span>
<div class="w-8 h-8 rounded-lg bg-surface-container-high flex items-center justify-center text-primary">
<span class="material-symbols-outlined text-[20px]">notification_important</span>
</div>
</div>
<div class="flex items-baseline gap-base my-xs">
<span class="font-display-lg text-display-lg font-bold text-on-surface leading-none">18</span>
<span class="font-label-sm text-label-sm px-xs py-0.5 rounded bg-surface-container-highest text-primary font-medium">Año en Curso 2024</span>
</div>
<div class="grid grid-cols-3 gap-xs pt-xs mt-xs">
<div class="flex flex-col bg-surface-container-low p-xs rounded">
<span class="font-label-sm text-label-sm text-error font-semibold">12 AT</span>
<span class="font-label-sm text-label-sm text-on-surface-variant text-[11px] leading-tight">Acc. Trabajo</span>
</div>
<div class="flex flex-col bg-surface-container-low p-xs rounded">
<span class="font-label-sm text-label-sm text-secondary font-semibold">4 INC</span>
<span class="font-label-sm text-label-sm text-on-surface-variant text-[11px] leading-tight">Sin Lesión</span>
</div>
<div class="flex flex-col bg-surface-container-low p-xs rounded">
<span class="font-label-sm text-label-sm text-primary font-semibold">2 PESV</span>
<span class="font-label-sm text-label-sm text-on-surface-variant text-[11px] leading-tight">Acc. Viales</span>
</div>
</div>
</div>
<!-- Card 2: Días Perdidos -->
<div class="bg-surface-container-lowest p-md rounded-xl shadow-sm flex flex-col justify-between">
<div class="flex items-center justify-between mb-xs">
<span class="font-label-sm text-label-sm text-on-surface-variant uppercase font-semibold">Días Perdidos Totales</span>
<div class="w-8 h-8 rounded-lg bg-error-container flex items-center justify-center text-on-error-container">
<span class="material-symbols-outlined text-[20px]">personal_injury</span>
</div>
</div>
<div class="flex items-baseline gap-base my-xs">
<span class="font-display-lg text-display-lg font-bold text-on-surface leading-none">142</span>
<span class="font-label-md text-label-md text-error font-semibold">días de incapacidad</span>
</div>
<div class="flex items-center justify-between bg-surface-container-low px-sm py-xs rounded">
<span class="font-body-sm text-body-sm text-on-surface-variant">Índice Severidad:</span>
<span class="font-label-md text-label-md font-bold text-on-surface">11.8 días / evento</span>
</div>
</div>
<!-- Card 3: Índice de Frecuencia -->
<div class="bg-surface-container-lowest p-md rounded-xl shadow-sm flex flex-col justify-between">
<div class="flex items-center justify-between mb-xs">
<span class="font-label-sm text-label-sm text-on-surface-variant uppercase font-semibold">Índice de Frecuencia (I.F.)</span>
<div class="w-8 h-8 rounded-lg bg-secondary-fixed flex items-center justify-center text-secondary">
<span class="material-symbols-outlined text-[20px]">speed</span>
</div>
</div>
<div class="flex items-baseline gap-base my-xs">
<span class="font-display-lg text-display-lg font-bold text-on-surface leading-none">2.4</span>
<span class="font-label-sm text-label-sm text-on-surface-variant">eventos / 100 trab.</span>
</div>
<div class="w-full bg-surface-container-high h-2 rounded-full overflow-hidden mt-xs">
<div class="bg-secondary h-full rounded-full" style="width: 48%;"></div>
</div>
<div class="flex justify-between items-center text-[11px] font-label-sm text-on-surface-variant mt-1">
<span>Límite alerta: 3.5</span>
<span class="text-secondary font-semibold">En zona de control</span>
</div>
</div>
<!-- Card 4: Tasa de Accidentalidad -->
<div class="bg-surface-container-lowest p-md rounded-xl shadow-sm flex flex-col justify-between">
<div class="flex items-center justify-between mb-xs">
<span class="font-label-sm text-label-sm text-on-surface-variant uppercase font-semibold">Tasa de Accidentalidad</span>
<div class="w-8 h-8 rounded-lg bg-surface-container-highest flex items-center justify-center text-primary">
<span class="material-symbols-outlined text-[20px]">percent</span>
</div>
</div>
<div class="flex items-baseline gap-base my-xs">
<span class="font-display-lg text-display-lg font-bold text-on-surface leading-none">3.4%</span>
<span class="font-label-sm text-label-sm px-xs py-0.5 rounded bg-surface-container-high text-on-surface font-semibold">Meta anual &lt; 4.0%</span>
</div>
<div class="flex items-center gap-xs text-on-surface-variant font-label-sm text-label-sm">
<span class="material-symbols-outlined text-[16px] text-secondary">check_circle</span>
<span>Cumplimiento conforme a Dec. 1072</span>
</div>
</div>
</section>
<!-- DASHBOARD DE ANALÍTICA VISUAL (BENTO GRID MULTIDIMENSIONAL) -->
<section class="mt-gutter grid grid-cols-1 lg:grid-cols-12 gap-base">
<!-- 1. Gráfico Histórico: Tendencia Mensual & Accidentes por Mes (7 Cols) -->
<div class="lg:col-span-7 bg-surface-container-lowest p-md rounded-xl shadow-sm flex flex-col justify-between">
<div class="flex flex-col sm:flex-row sm:items-center justify-between gap-xs mb-sm">
<div>
<h2 class="font-headline-md text-headline-md text-on-surface">Tendencia Mensual &amp; Accidentes por Mes</h2>
<p class="font-body-sm text-body-sm text-on-surface-variant">Comportamiento cronológico de eventos registrados (Enero - Octubre 2024)</p>
</div>
<div class="flex items-center gap-xs">
<span class="inline-flex items-center gap-1 font-label-sm text-label-sm text-on-surface-variant">
<span class="w-2.5 h-2.5 rounded bg-primary"></span> Accidentes
          </span>
<span class="inline-flex items-center gap-1 font-label-sm text-label-sm text-on-surface-variant">
<span class="w-2.5 h-2.5 rounded bg-secondary"></span> Tendencia
          </span>
</div>
</div>
<!-- Visualización SVG Interactiva -->
<div class="w-full h-56 pt-base flex items-end">
<svg class="w-full h-full overflow-visible" preserveaspectratio="none" viewbox="0 0 700 200">
<!-- Guías de fondo horizontales -->
<line class="text-surface-container-highest" stroke="currentColor" stroke-dasharray="3,3" stroke-width="1" x1="0" x2="700" y1="40" y2="40"></line>
<line class="text-surface-container-highest" stroke="currentColor" stroke-dasharray="3,3" stroke-width="1" x1="0" x2="700" y1="90" y2="90"></line>
<line class="text-surface-container-highest" stroke="currentColor" stroke-dasharray="3,3" stroke-width="1" x1="0" x2="700" y1="140" y2="140"></line>
<line class="text-outline-variant" stroke="currentColor" stroke-width="1.5" x1="0" x2="700" y1="180" y2="180"></line>
<!-- Ene: 1 (h: 30) -->
<rect class="fill-primary hover:fill-primary-container transition-colors duration-150" height="30" rx="4" width="30" x="25" y="150"></rect>
<text class="fill-on-surface-variant font-label-sm" font-size="11" text-anchor="middle" x="40" y="142">1</text>
<text class="fill-on-surface-variant font-label-sm" font-size="11" text-anchor="middle" x="40" y="196">Ene</text>
<!-- Feb: 2 (h: 60) -->
<rect class="fill-primary hover:fill-primary-container transition-colors duration-150" height="60" rx="4" width="30" x="95" y="120"></rect>
<text class="fill-on-surface-variant font-label-sm" font-size="11" text-anchor="middle" x="110" y="112">2</text>
<text class="fill-on-surface-variant font-label-sm" font-size="11" text-anchor="middle" x="110" y="196">Feb</text>
<!-- Mar: 0 -->
<rect class="fill-surface-container-high" height="4" rx="2" width="30" x="165" y="176"></rect>
<text class="fill-on-surface-variant font-label-sm" font-size="11" text-anchor="middle" x="180" y="170">0</text>
<text class="fill-on-surface-variant font-label-sm" font-size="11" text-anchor="middle" x="180" y="196">Mar</text>
<!-- Abr: 3 (h: 90) -->
<rect class="fill-primary hover:fill-primary-container transition-colors duration-150" height="90" rx="4" width="30" x="235" y="90"></rect>
<text class="fill-on-surface-variant font-label-sm" font-size="11" text-anchor="middle" x="250" y="82">3</text>
<text class="fill-on-surface-variant font-label-sm" font-size="11" text-anchor="middle" x="250" y="196">Abr</text>
<!-- May: 1 (h: 30) -->
<rect class="fill-primary hover:fill-primary-container transition-colors duration-150" height="30" rx="4" width="30" x="305" y="150"></rect>
<text class="fill-on-surface-variant font-label-sm" font-size="11" text-anchor="middle" x="320" y="142">1</text>
<text class="fill-on-surface-variant font-label-sm" font-size="11" text-anchor="middle" x="320" y="196">May</text>
<!-- Jun: 2 (h: 60) -->
<rect class="fill-primary hover:fill-primary-container transition-colors duration-150" height="60" rx="4" width="30" x="375" y="120"></rect>
<text class="fill-on-surface-variant font-label-sm" font-size="11" text-anchor="middle" x="390" y="112">2</text>
<text class="fill-on-surface-variant font-label-sm" font-size="11" text-anchor="middle" x="390" y="196">Jun</text>
<!-- Jul: 1 (h: 30) -->
<rect class="fill-primary hover:fill-primary-container transition-colors duration-150" height="30" rx="4" width="30" x="445" y="150"></rect>
<text class="fill-on-surface-variant font-label-sm" font-size="11" text-anchor="middle" x="460" y="142">1</text>
<text class="fill-on-surface-variant font-label-sm" font-size="11" text-anchor="middle" x="460" y="196">Jul</text>
<!-- Ago: 3 (h: 90) -->
<rect class="fill-primary hover:fill-primary-container transition-colors duration-150" height="90" rx="4" width="30" x="515" y="90"></rect>
<text class="fill-on-surface-variant font-label-sm" font-size="11" text-anchor="middle" x="530" y="82">3</text>
<text class="fill-on-surface-variant font-label-sm" font-size="11" text-anchor="middle" x="530" y="196">Ago</text>
<!-- Sep: 4 (h: 120) -->
<rect class="fill-error hover:opacity-90 transition-opacity duration-150" height="120" rx="4" width="30" x="585" y="60"></rect>
<text class="fill-error font-label-sm font-bold" font-size="11" text-anchor="middle" x="600" y="52">4 (Pico)</text>
<text class="fill-on-surface-variant font-label-sm" font-size="11" text-anchor="middle" x="600" y="196">Sep</text>
<!-- Oct: 1 (h: 30) -->
<rect class="fill-primary hover:fill-primary-container transition-colors duration-150" height="30" rx="4" width="30" x="655" y="150"></rect>
<text class="fill-on-surface-variant font-label-sm" font-size="11" text-anchor="middle" x="670" y="142">1</text>
<text class="fill-on-surface-variant font-label-sm" font-size="11" text-anchor="middle" x="670" y="196">Oct</text>
<!-- Línea curva de tendencia suavizada -->
<path class="text-secondary" d="M 40 150 Q 110 120 180 176 T 250 90 T 320 150 T 390 120 T 460 150 T 530 90 T 600 60 T 670 150" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5"></path>
</svg>
</div>
<div class="mt-xs pt-xs flex items-center justify-between text-on-surface-variant font-label-sm text-label-sm bg-surface-container-low px-sm py-xs rounded-lg">
<span class="flex items-center gap-1"><span class="material-symbols-outlined text-[16px] text-error">trending_down</span> Cierre preliminar Octubre muestra disminución del 75% respecto a Septiembre</span>
<span class="font-semibold text-on-surface">Promedio: 1.8 ev/mes</span>
</div>
</div>
<!-- 2. Comparativo: Accidentes por Finca / Centro de Trabajo (5 Cols) -->
<div class="lg:col-span-5 bg-surface-container-lowest p-md rounded-xl shadow-sm flex flex-col justify-between">
<div>
<div class="flex items-center justify-between mb-xs">
<h2 class="font-headline-md text-headline-md text-on-surface">Accidentes por Finca / Centro</h2>
<span class="material-symbols-outlined text-on-surface-variant text-[20px]">location_on</span>
</div>
<p class="font-body-sm text-body-sm text-on-surface-variant mb-md">Distribución geográfica del riesgo operacional</p>
<!-- Barras de Distribución -->
<div class="flex flex-col gap-sm">
<!-- Finca La Esperanza: 7 -->
<div class="flex flex-col gap-xs">
<div class="flex justify-between items-center font-label-md text-label-md">
<span class="font-medium text-on-surface flex items-center gap-1">
<span class="w-2 h-2 rounded-full bg-error"></span> Finca La Esperanza (Alta Cosecha)
              </span>
<span class="font-bold text-on-surface">7 eventos <span class="text-on-surface-variant font-normal">(38.9%)</span></span>
</div>
<div class="w-full bg-surface-container-high h-2.5 rounded-full overflow-hidden">
<div class="bg-error h-full rounded-full" style="width: 38.9%;"></div>
</div>
</div>
<!-- Finca San José: 4 -->
<div class="flex flex-col gap-xs">
<div class="flex justify-between items-center font-label-md text-label-md">
<span class="font-medium text-on-surface flex items-center gap-1">
<span class="w-2 h-2 rounded-full bg-secondary"></span> Finca San José (Frutales &amp; Café)
              </span>
<span class="font-bold text-on-surface">4 eventos <span class="text-on-surface-variant font-normal">(22.2%)</span></span>
</div>
<div class="w-full bg-surface-container-high h-2.5 rounded-full overflow-hidden">
<div class="bg-secondary h-full rounded-full" style="width: 22.2%;"></div>
</div>
</div>
<!-- Finca El Paraíso: 4 -->
<div class="flex flex-col gap-xs">
<div class="flex justify-between items-center font-label-md text-label-md">
<span class="font-medium text-on-surface flex items-center gap-1">
<span class="w-2 h-2 rounded-full bg-primary-container"></span> Finca El Paraíso (Aguacate Hass)
              </span>
<span class="font-bold text-on-surface">4 eventos <span class="text-on-surface-variant font-normal">(22.2%)</span></span>
</div>
<div class="w-full bg-surface-container-high h-2.5 rounded-full overflow-hidden">
<div class="bg-primary-container h-full rounded-full" style="width: 22.2%;"></div>
</div>
</div>
<!-- Planta Central & Empacadora: 3 -->
<div class="flex flex-col gap-xs">
<div class="flex justify-between items-center font-label-md text-label-md">
<span class="font-medium text-on-surface flex items-center gap-1">
<span class="w-2 h-2 rounded-full bg-surface-tint"></span> Planta Central &amp; Empacadora
              </span>
<span class="font-bold text-on-surface">3 eventos <span class="text-on-surface-variant font-normal">(16.7%)</span></span>
</div>
<div class="w-full bg-surface-container-high h-2.5 rounded-full overflow-hidden">
<div class="bg-surface-tint h-full rounded-full" style="width: 16.7%;"></div>
</div>
</div>
</div>
</div>
<div class="mt-base pt-xs bg-surface-container-low p-sm rounded-lg flex items-center gap-sm">
<span class="material-symbols-outlined text-primary text-[20px]">flag</span>
<span class="font-body-sm text-body-sm text-on-surface-variant leading-tight">
          Finca La Esperanza concentra el mayor índice de severidad (62 días acumulados). Se ordenó auditoría focal de senderos y escaleras.
        </span>
</div>
</div>
<!-- 3. Accidentes por Área y Cargo (4 Cols) -->
<div class="lg:col-span-4 bg-surface-container-lowest p-md rounded-xl shadow-sm flex flex-col justify-between">
<div>
<div class="flex items-center justify-between mb-xs">
<h2 class="font-headline-md text-headline-md text-on-surface">Área y Cargo</h2>
<span class="material-symbols-outlined text-on-surface-variant text-[20px]">badge</span>
</div>
<p class="font-body-sm text-body-sm text-on-surface-variant mb-base">Concentración ocupacional</p>
<div class="flex flex-col gap-sm">
<div class="flex flex-col gap-xs">
<div class="flex justify-between text-label-md font-medium">
<span class="text-on-surface">Cosecha / Recolectores</span>
<span class="text-primary font-bold">38%</span>
</div>
<div class="w-full bg-surface-container-high h-2 rounded-full overflow-hidden">
<div class="bg-primary h-full rounded-full" style="width: 38%;"></div>
</div>
</div>
<div class="flex flex-col gap-xs">
<div class="flex justify-between text-label-md font-medium">
<span class="text-on-surface">Operación Maquinaria / Tractor</span>
<span class="text-secondary font-bold">28%</span>
</div>
<div class="w-full bg-surface-container-high h-2 rounded-full overflow-hidden">
<div class="bg-secondary h-full rounded-full" style="width: 28%;"></div>
</div>
</div>
<div class="flex flex-col gap-xs">
<div class="flex justify-between text-label-md font-medium">
<span class="text-on-surface">Sanidad Vegetal / Fumigadores</span>
<span class="text-on-surface-variant font-bold">18%</span>
</div>
<div class="w-full bg-surface-container-high h-2 rounded-full overflow-hidden">
<div class="bg-primary-container h-full rounded-full" style="width: 18%;"></div>
</div>
</div>
<div class="flex flex-col gap-xs">
<div class="flex justify-between text-label-md font-medium">
<span class="text-on-surface">Mantenimiento e Infraestructura</span>
<span class="text-on-surface-variant font-bold">16%</span>
</div>
<div class="w-full bg-surface-container-high h-2 rounded-full overflow-hidden">
<div class="bg-surface-tint h-full rounded-full" style="width: 16%;"></div>
</div>
</div>
</div>
</div>
<div class="pt-base mt-xs flex items-center justify-between text-label-sm font-label-sm text-on-surface-variant">
<span>Población más expuesta: Operarios de campo</span>
</div>
</div>
<!-- 4. Accidentes por Mecanismo del Evento (4 Cols) -->
<div class="lg:col-span-4 bg-surface-container-lowest p-md rounded-xl shadow-sm flex flex-col justify-between">
<div>
<div class="flex items-center justify-between mb-xs">
<h2 class="font-headline-md text-headline-md text-on-surface">Mecanismo del Evento</h2>
<span class="material-symbols-outlined text-on-surface-variant text-[20px]">construction</span>
</div>
<p class="font-body-sm text-body-sm text-on-surface-variant mb-base">Tipificación de la causal física directa</p>
<div class="flex flex-col gap-sm">
<div class="flex flex-col gap-xs">
<div class="flex justify-between text-label-md font-medium">
<span class="text-on-surface">Caída a diferente nivel</span>
<span class="text-error font-bold">33%</span>
</div>
<div class="w-full bg-surface-container-high h-2 rounded-full overflow-hidden">
<div class="bg-error h-full rounded-full" style="width: 33%;"></div>
</div>
</div>
<div class="flex flex-col gap-xs">
<div class="flex justify-between text-label-md font-medium">
<span class="text-on-surface">Contacto hta. cortopunzante</span>
<span class="text-secondary font-bold">28%</span>
</div>
<div class="w-full bg-surface-container-high h-2 rounded-full overflow-hidden">
<div class="bg-secondary h-full rounded-full" style="width: 28%;"></div>
</div>
</div>
<div class="flex flex-col gap-xs">
<div class="flex justify-between text-label-md font-medium">
<span class="text-on-surface">Atrapamiento / Golpe objeto móvil</span>
<span class="text-primary font-bold">22%</span>
</div>
<div class="w-full bg-surface-container-high h-2 rounded-full overflow-hidden">
<div class="bg-primary h-full rounded-full" style="width: 22%;"></div>
</div>
</div>
<div class="flex flex-col gap-xs">
<div class="flex justify-between text-label-md font-medium">
<span class="text-on-surface">Sobreesfuerzo osteomuscular</span>
<span class="text-on-surface-variant font-bold">17%</span>
</div>
<div class="w-full bg-surface-container-high h-2 rounded-full overflow-hidden">
<div class="bg-surface-tint h-full rounded-full" style="width: 17%;"></div>
</div>
</div>
</div>
</div>
<div class="pt-base mt-xs flex items-center justify-between text-label-sm font-label-sm text-on-surface-variant">
<span>Foco: Control de escaleras y tijeras de poda</span>
</div>
</div>
<!-- 5. Accidentes por Parte del Cuerpo Lesionada (4 Cols) -->
<div class="lg:col-span-4 bg-surface-container-lowest p-md rounded-xl shadow-sm flex flex-col justify-between">
<div>
<div class="flex items-center justify-between mb-xs">
<h2 class="font-headline-md text-headline-md text-on-surface">Parte del Cuerpo</h2>
<span class="material-symbols-outlined text-on-surface-variant text-[20px]">accessibility_new</span>
</div>
<p class="font-body-sm text-body-sm text-on-surface-variant mb-base">Anatomía topográfica del traumatismo</p>
<div class="flex flex-col gap-sm">
<div class="flex flex-col gap-xs">
<div class="flex justify-between text-label-md font-medium">
<span class="text-on-surface">Miembros sup. (Manos / Dedos)</span>
<span class="text-error font-bold">44%</span>
</div>
<div class="w-full bg-surface-container-high h-2 rounded-full overflow-hidden">
<div class="bg-error h-full rounded-full" style="width: 44%;"></div>
</div>
</div>
<div class="flex flex-col gap-xs">
<div class="flex justify-between text-label-md font-medium">
<span class="text-on-surface">Miembros inf. (Tobillo / Pierna)</span>
<span class="text-secondary font-bold">28%</span>
</div>
<div class="w-full bg-surface-container-high h-2 rounded-full overflow-hidden">
<div class="bg-secondary h-full rounded-full" style="width: 28%;"></div>
</div>
</div>
<div class="flex flex-col gap-xs">
<div class="flex justify-between text-label-md font-medium">
<span class="text-on-surface">Región Lumbar / Espalda</span>
<span class="text-primary font-bold">17%</span>
</div>
<div class="w-full bg-surface-container-high h-2 rounded-full overflow-hidden">
<div class="bg-primary h-full rounded-full" style="width: 17%;"></div>
</div>
</div>
<div class="flex flex-col gap-xs">
<div class="flex justify-between text-label-md font-medium">
<span class="text-on-surface">Ocular / Rostro</span>
<span class="text-on-surface-variant font-bold">11%</span>
</div>
<div class="w-full bg-surface-container-high h-2 rounded-full overflow-hidden">
<div class="bg-surface-tint h-full rounded-full" style="width: 11%;"></div>
</div>
</div>
</div>
</div>
<div class="pt-base mt-xs flex items-center justify-between text-label-sm font-label-sm text-on-surface-variant">
<span>Prioridad EPP: Guantes anticorte Nivel 5</span>
</div>
</div>
</section>
<!-- MATRIZ DE REGISTRO PARAMÉTRICO DE ACCIDENTES E INCIDENTES (TABLA REGLAMENTARIA) -->
<section class="mt-gutter flex flex-col gap-base">
<!-- Barra de Filtros Paramétricos -->
<div class="bg-surface-container-lowest p-md rounded-xl shadow-sm flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-base">
<div class="flex-1 flex flex-col md:flex-row items-center gap-base">
<!-- Input de Búsqueda -->
<div class="relative w-full md:w-80">
<span class="material-symbols-outlined absolute left-sm top-1/2 -translate-y-1/2 text-on-surface-variant text-[20px]">search</span>
<input class="w-full bg-surface-container-low text-on-surface placeholder:text-on-surface-variant pl-10 pr-sm py-xs rounded-lg font-body-sm text-body-sm focus:outline-none focus:bg-surface-container-lowest focus:ring-2 focus:ring-secondary transition-all" placeholder="N° Evento, Cédula o Nombre..." type="search"/>
</div>
<!-- Selector Tipo de Evento -->
<div class="w-full md:w-56">
<select class="w-full bg-surface-container-low text-on-surface py-xs px-sm rounded-lg font-body-sm text-body-sm focus:outline-none focus:ring-2 focus:ring-secondary cursor-pointer">
<option value="">Tipo: Todos los eventos</option>
<option value="at">Accidente de Trabajo (AT)</option>
<option value="inc">Incidente Sin Lesión</option>
<option value="pesv">Accidente Vial (PESV)</option>
<option value="peligroso">Evento Peligroso Mayor</option>
</select>
</div>
<!-- Selector Finca -->
<div class="w-full md:w-52">
<select class="w-full bg-surface-container-low text-on-surface py-xs px-sm rounded-lg font-body-sm text-body-sm focus:outline-none focus:ring-2 focus:ring-secondary cursor-pointer">
<option value="">Finca: Todas las sedes</option>
<option value="esperanza">Finca La Esperanza</option>
<option value="sanjose">Finca San José</option>
<option value="paraiso">Finca El Paraíso</option>
<option value="central">Planta Central / Empacadora</option>
</select>
</div>
<!-- Selector Estado -->
<div class="w-full md:w-48">
<select class="w-full bg-surface-container-low text-on-surface py-xs px-sm rounded-lg font-body-sm text-body-sm focus:outline-none focus:ring-2 focus:ring-secondary cursor-pointer">
<option value="">Estado: Todos</option>
<option value="investigacion">En Investigación</option>
<option value="seguimiento">En Seguimiento</option>
<option value="cerrado">Cerrado / Concluido</option>
</select>
</div>
</div>
<div class="flex items-center gap-xs shrink-0 self-end lg:self-center">
<span class="font-label-sm text-label-sm text-on-surface-variant font-medium">Mostrando 4 de 18 registros</span>
<button class="p-xs rounded bg-surface-container-high hover:bg-surface-container text-on-surface" title="Reiniciar Filtros" type="button">
<span class="material-symbols-outlined text-[18px]">restart_alt</span>
</button>
</div>
</div>
<!-- Contenedor Tabla de Datos Operativa -->
<div class="bg-surface-container-lowest rounded-xl shadow-sm overflow-hidden flex flex-col">
<div class="overflow-x-auto">
<table class="w-full text-left border-collapse min-w-[1200px]">
<thead>
<tr class="bg-surface-container-high text-on-surface-variant font-label-sm text-label-sm uppercase tracking-wider select-none">
<th class="py-sm px-base font-semibold">N° Evento / Código</th>
<th class="py-sm px-base font-semibold">Fecha y Hora</th>
<th class="py-sm px-base font-semibold">Trabajador Afectado</th>
<th class="py-sm px-base font-semibold">Cargo / Centro</th>
<th class="py-sm px-base font-semibold">Tipo</th>
<th class="py-sm px-base font-semibold">Descripción del Hecho</th>
<th class="py-sm px-base font-semibold">Mecanismo / Agente</th>
<th class="py-sm px-base font-semibold">Parte / Lesión</th>
<th class="py-sm px-base font-semibold text-center">Días</th>
<th class="py-sm px-base font-semibold">Investigación (1401)</th>
<th class="py-sm px-base font-semibold">Estado</th>
<th class="py-sm px-base font-semibold text-right">Acciones</th>
</tr>
</thead>
<tbody class="divide-y divide-surface-container">
<!-- Registro 1: Accidente Severo en Cosecha -->
<tr class="hover:bg-surface-container-low transition-colors duration-150">
<td class="py-sm px-base align-top">
<div class="flex flex-col">
<span class="font-label-md text-label-md font-bold text-primary">AT-2024-018</span>
<span class="font-label-sm text-label-sm text-on-surface-variant">FURAT #998241</span>
</div>
</td>
<td class="py-sm px-base align-top whitespace-nowrap">
<div class="flex flex-col">
<span class="font-label-md text-label-md text-on-surface font-medium">24/10/2024</span>
<span class="font-label-sm text-label-sm text-on-surface-variant">09:15 AM</span>
</div>
</td>
<td class="py-sm px-base align-top">
<div class="flex items-center gap-xs">
<div class="w-8 h-8 rounded-full bg-primary-container flex items-center justify-center text-on-primary font-bold text-label-sm shrink-0">
                    CR
                  </div>
<div class="flex flex-col min-w-0">
<span class="font-label-md text-label-md font-semibold text-on-surface truncate">Carlos Restrepo</span>
<span class="font-label-sm text-label-sm text-on-surface-variant">C.C. 1.053.821.904</span>
<span class="text-[11px] text-primary font-mono font-medium">MNZ-0089</span>
</div>
</div>
</td>
<td class="py-sm px-base align-top">
<div class="flex flex-col">
<span class="font-label-md text-label-md text-on-surface">Recolector Cosecha</span>
<span class="font-label-sm text-label-sm text-on-surface-variant">Finca La Esperanza</span>
</div>
</td>
<td class="py-sm px-base align-top">
<span class="bg-error-container text-on-error-container font-label-sm text-label-sm px-xs py-0.5 rounded-full font-semibold inline-block">
                  Accidente Trabajo
                </span>
</td>
<td class="py-sm px-base align-top max-w-xs">
<p class="font-body-sm text-body-sm text-on-surface line-clamp-2 leading-relaxed">
                  Caída desde escalera de tijera (2.10 m) al ceder rama durante recolección de aguacate hass en lote 4.
                </p>
</td>
<td class="py-sm px-base align-top whitespace-nowrap">
<div class="flex flex-col">
<span class="font-label-sm text-label-sm font-medium text-on-surface">Caída diferente nivel</span>
<span class="font-label-sm text-label-sm text-on-surface-variant">Escalera de aluminio</span>
</div>
</td>
<td class="py-sm px-base align-top">
<div class="flex flex-col">
<span class="font-label-sm text-label-sm font-medium text-on-surface">Miembro inf. derecho</span>
<span class="font-label-sm text-label-sm text-error font-medium">Fractura cerrada tibia</span>
</div>
</td>
<td class="py-sm px-base align-top text-center">
<span class="font-label-md text-label-md font-bold text-error bg-error-container px-xs py-0.5 rounded">
                  30 días
                </span>
</td>
<td class="py-sm px-base align-top">
<div class="flex flex-col gap-0.5">
<span class="bg-surface-container-high text-primary font-label-sm text-label-sm px-xs py-0.5 rounded font-semibold inline-flex items-center gap-1">
<span class="material-symbols-outlined text-[14px]">hourglass_top</span> En curso (Día 3/15)
                  </span>
<span class="text-[11px] text-on-surface-variant">Comité COPASST citado</span>
</div>
</td>
<td class="py-sm px-base align-top whitespace-nowrap">
<span class="bg-surface-container-highest text-primary font-label-sm text-label-sm px-xs py-0.5 rounded font-medium inline-block">
                  En Investigación
                </span>
</td>
<td class="py-sm px-base align-top text-right whitespace-nowrap">
<div class="flex items-center justify-end gap-1">
<button class="w-8 h-8 rounded hover:bg-surface-container flex items-center justify-center text-primary" title="Ver Formulario FURAT Radicado" type="button">
<span class="material-symbols-outlined text-[18px]">description</span>
</button>
<button class="w-8 h-8 rounded hover:bg-surface-container flex items-center justify-center text-secondary" title="Árbol de Causas (Res. 1401)" type="button">
<span class="material-symbols-outlined text-[18px]">account_tree</span>
</button>
<button class="w-8 h-8 rounded hover:bg-surface-container flex items-center justify-center text-on-surface-variant" title="Editar Evento" type="button">
<span class="material-symbols-outlined text-[18px]">edit</span>
</button>
</div>
</td>
</tr>
<!-- Registro 2: Incidente Sin Lesión -->
<tr class="hover:bg-surface-container-low transition-colors duration-150">
<td class="py-sm px-base align-top">
<div class="flex flex-col">
<span class="font-label-md text-label-md font-bold text-secondary">INC-2024-006</span>
<span class="font-label-sm text-label-sm text-on-surface-variant">FUI Interno</span>
</div>
</td>
<td class="py-sm px-base align-top whitespace-nowrap">
<div class="flex flex-col">
<span class="font-label-md text-label-md text-on-surface font-medium">19/10/2024</span>
<span class="font-label-sm text-label-sm text-on-surface-variant">03:40 PM</span>
</div>
</td>
<td class="py-sm px-base align-top">
<div class="flex items-center gap-xs">
<div class="w-8 h-8 rounded-full bg-secondary-fixed flex items-center justify-center text-secondary font-bold text-label-sm shrink-0">
                    MA
                  </div>
<div class="flex flex-col min-w-0">
<span class="font-label-md text-label-md font-semibold text-on-surface truncate">Marcos Aguirre</span>
<span class="font-label-sm text-label-sm text-on-surface-variant">C.C. 75.092.441</span>
<span class="text-[11px] text-primary font-mono font-medium">MNZ-0142</span>
</div>
</div>
</td>
<td class="py-sm px-base align-top">
<div class="flex flex-col">
<span class="font-label-md text-label-md text-on-surface">Operador Agrícola</span>
<span class="font-label-sm text-label-sm text-on-surface-variant">Finca San José</span>
</div>
</td>
<td class="py-sm px-base align-top">
<span class="bg-secondary-fixed text-on-secondary-fixed font-label-sm text-label-sm px-xs py-0.5 rounded-full font-semibold inline-block">
                  Incidente (Casi-acc)
                </span>
</td>
<td class="py-sm px-base align-top max-w-xs">
<p class="font-body-sm text-body-sm text-on-surface line-clamp-2 leading-relaxed">
                  Ruptura de manguera hidráulica de toma de fuerza durante acople de desbrozadora. No impactó al trabajador por resguardo.
                </p>
</td>
<td class="py-sm px-base align-top whitespace-nowrap">
<div class="flex flex-col">
<span class="font-label-sm text-label-sm font-medium text-on-surface">Proyección fluidos/presión</span>
<span class="font-label-sm text-label-sm text-on-surface-variant">Tractor John Deere 5075</span>
</div>
</td>
<td class="py-sm px-base align-top">
<div class="flex flex-col">
<span class="font-label-sm text-label-sm font-medium text-on-surface-variant">Sin lesión física</span>
<span class="font-label-sm text-label-sm text-on-surface-variant">Daño material menor</span>
</div>
</td>
<td class="py-sm px-base align-top text-center">
<span class="font-label-md text-label-md font-semibold text-on-surface-variant bg-surface-container px-xs py-0.5 rounded">
                  0 días
                </span>
</td>
<td class="py-sm px-base align-top">
<div class="flex flex-col gap-0.5">
<span class="bg-surface-container-high text-on-surface font-label-sm text-label-sm px-xs py-0.5 rounded font-medium inline-flex items-center gap-1">
<span class="material-symbols-outlined text-[14px]">check_circle</span> Concluida (5 Porqués)
                  </span>
<span class="text-[11px] text-on-surface-variant">Cambio mangueras preventivo</span>
</div>
</td>
<td class="py-sm px-base align-top whitespace-nowrap">
<span class="bg-surface-container text-on-surface-variant font-label-sm text-label-sm px-xs py-0.5 rounded font-medium inline-block">
                  Cerrado
                </span>
</td>
<td class="py-sm px-base align-top text-right whitespace-nowrap">
<div class="flex items-center justify-end gap-1">
<button class="w-8 h-8 rounded hover:bg-surface-container flex items-center justify-center text-primary" title="Ver Acta FUI" type="button">
<span class="material-symbols-outlined text-[18px]">description</span>
</button>
<button class="w-8 h-8 rounded hover:bg-surface-container flex items-center justify-center text-secondary" title="Ver Causalidad" type="button">
<span class="material-symbols-outlined text-[18px]">account_tree</span>
</button>
<button class="w-8 h-8 rounded hover:bg-surface-container flex items-center justify-center text-on-surface-variant" title="Editar" type="button">
<span class="material-symbols-outlined text-[18px]">edit</span>
</button>
</div>
</td>
</tr>
<!-- Registro 3: Accidente Vial PESV -->
<tr class="hover:bg-surface-container-low transition-colors duration-150">
<td class="py-sm px-base align-top">
<div class="flex flex-col">
<span class="font-label-md text-label-md font-bold text-primary">AV-2024-002</span>
<span class="font-label-sm text-label-sm text-on-surface-variant">FURAT #987114</span>
</div>
</td>
<td class="py-sm px-base align-top whitespace-nowrap">
<div class="flex flex-col">
<span class="font-label-md text-label-md text-on-surface font-medium">08/10/2024</span>
<span class="font-label-sm text-label-sm text-on-surface-variant">07:20 AM</span>
</div>
</td>
<td class="py-sm px-base align-top">
<div class="flex items-center gap-xs">
<div class="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-on-primary font-bold text-label-sm shrink-0">
                    JM
                  </div>
<div class="flex flex-col min-w-0">
<span class="font-label-md text-label-md font-semibold text-on-surface truncate">Jorge Morales</span>
<span class="font-label-sm text-label-sm text-on-surface-variant">C.C. 1.114.730.012</span>
<span class="text-[11px] text-primary font-mono font-medium">MNZ-0033</span>
</div>
</div>
</td>
<td class="py-sm px-base align-top">
<div class="flex flex-col">
<span class="font-label-md text-label-md text-on-surface">Conductor Camión</span>
<span class="font-label-sm text-label-sm text-on-surface-variant">Ruta Fincas - Planta</span>
</div>
</td>
<td class="py-sm px-base align-top">
<span class="bg-primary-container text-on-primary font-label-sm text-label-sm px-xs py-0.5 rounded-full font-semibold inline-block">
                  Accidente Vial PESV
                </span>
</td>
<td class="py-sm px-base align-top max-w-xs">
<p class="font-body-sm text-body-sm text-on-surface line-clamp-2 leading-relaxed">
                  Colisión por alcance contra vehículo particular en cruce veredal La Cabaña por calzada húmeda. Activación SOAT y ARL.
                </p>
</td>
<td class="py-sm px-base align-top whitespace-nowrap">
<div class="flex flex-col">
<span class="font-label-sm text-label-sm font-medium text-on-surface">Choque vehicular</span>
<span class="font-label-sm text-label-sm text-on-surface-variant">Vehículo NHR Placa WFH-421</span>
</div>
</td>
<td class="py-sm px-base align-top">
<div class="flex flex-col">
<span class="font-label-sm text-label-sm font-medium text-on-surface">Columna cervical</span>
<span class="font-label-sm text-label-sm text-error font-medium">Esguince grado II (Latigazo)</span>
</div>
</td>
<td class="py-sm px-base align-top text-center">
<span class="font-label-md text-label-md font-bold text-error bg-error-container px-xs py-0.5 rounded">
                  15 días
                </span>
</td>
<td class="py-sm px-base align-top">
<div class="flex flex-col gap-0.5">
<span class="bg-surface-container-high text-on-surface font-label-sm text-label-sm px-xs py-0.5 rounded font-semibold inline-flex items-center gap-1">
<span class="material-symbols-outlined text-[14px]">done_all</span> Radicado ARL Sura
                  </span>
<span class="text-[11px] text-on-surface-variant">Capacitación manejo defensivo</span>
</div>
</td>
<td class="py-sm px-base align-top whitespace-nowrap">
<span class="bg-surface-container-highest text-secondary font-label-sm text-label-sm px-xs py-0.5 rounded font-medium inline-block">
                  En Seguimiento
                </span>
</td>
<td class="py-sm px-base align-top text-right whitespace-nowrap">
<div class="flex items-center justify-end gap-1">
<button class="w-8 h-8 rounded hover:bg-surface-container flex items-center justify-center text-primary" title="Ver FURAT" type="button">
<span class="material-symbols-outlined text-[18px]">description</span>
</button>
<button class="w-8 h-8 rounded hover:bg-surface-container flex items-center justify-center text-secondary" title="Informe PESV" type="button">
<span class="material-symbols-outlined text-[18px]">traffic</span>
</button>
<button class="w-8 h-8 rounded hover:bg-surface-container flex items-center justify-center text-on-surface-variant" title="Editar" type="button">
<span class="material-symbols-outlined text-[18px]">edit</span>
</button>
</div>
</td>
</tr>
<!-- Registro 4: Accidente con Herramienta Cortopunzante -->
<tr class="hover:bg-surface-container-low transition-colors duration-150">
<td class="py-sm px-base align-top">
<div class="flex flex-col">
<span class="font-label-md text-label-md font-bold text-primary">AT-2024-017</span>
<span class="font-label-sm text-label-sm text-on-surface-variant">FURAT #976503</span>
</div>
</td>
<td class="py-sm px-base align-top whitespace-nowrap">
<div class="flex flex-col">
<span class="font-label-md text-label-md text-on-surface font-medium">29/09/2024</span>
<span class="font-label-sm text-label-sm text-on-surface-variant">11:05 AM</span>
</div>
</td>
<td class="py-sm px-base align-top">
<div class="flex items-center gap-xs">
<div class="w-8 h-8 rounded-full bg-surface-container-high flex items-center justify-center text-primary font-bold text-label-sm shrink-0">
                    LG
                  </div>
<div class="flex flex-col min-w-0">
<span class="font-label-md text-label-md font-semibold text-on-surface truncate">Luis Gabriel Gómez</span>
<span class="font-label-sm text-label-sm text-on-surface-variant">C.C. 9.870.211</span>
<span class="text-[11px] text-primary font-mono font-medium">MNZ-0205</span>
</div>
</div>
</td>
<td class="py-sm px-base align-top">
<div class="flex flex-col">
<span class="font-label-md text-label-md text-on-surface">Operario de Poda</span>
<span class="font-label-sm text-label-sm text-on-surface-variant">Finca El Paraíso</span>
</div>
</td>
<td class="py-sm px-base align-top">
<span class="bg-error-container text-on-error-container font-label-sm text-label-sm px-xs py-0.5 rounded-full font-semibold inline-block">
                  Accidente Trabajo
                </span>
</td>
<td class="py-sm px-base align-top max-w-xs">
<p class="font-body-sm text-body-sm text-on-surface line-clamp-2 leading-relaxed">
                  Corte superficial en eminencia tenar de mano izquierda con serrucho curvo de poda por resbalón de agarre sin guante anticorte.
                </p>
</td>
<td class="py-sm px-base align-top whitespace-nowrap">
<div class="flex flex-col">
<span class="font-label-sm text-label-sm font-medium text-on-surface">Contacto herramienta</span>
<span class="font-label-sm text-label-sm text-on-surface-variant">Serrucho manual Felco</span>
</div>
</td>
<td class="py-sm px-base align-top">
<div class="flex flex-col">
<span class="font-label-sm text-label-sm font-medium text-on-surface">Mano izquierda</span>
<span class="font-label-sm text-label-sm text-error font-medium">Herida incisa (4 puntos)</span>
</div>
</td>
<td class="py-sm px-base align-top text-center">
<span class="font-label-md text-label-md font-bold text-error bg-error-container px-xs py-0.5 rounded">
                  8 días
                </span>
</td>
<td class="py-sm px-base align-top">
<div class="flex flex-col gap-0.5">
<span class="bg-surface-container-high text-on-surface font-label-sm text-label-sm px-xs py-0.5 rounded font-medium inline-flex items-center gap-1">
<span class="material-symbols-outlined text-[14px]">verified</span> Investigación Cerrada
                  </span>
<span class="text-[11px] text-on-surface-variant">Inspección EPP cumplida</span>
</div>
</td>
<td class="py-sm px-base align-top whitespace-nowrap">
<span class="bg-surface-container text-on-surface-variant font-label-sm text-label-sm px-xs py-0.5 rounded font-medium inline-block">
                  Cerrado
                </span>
</td>
<td class="py-sm px-base align-top text-right whitespace-nowrap">
<div class="flex items-center justify-end gap-1">
<button class="w-8 h-8 rounded hover:bg-surface-container flex items-center justify-center text-primary" title="Ver FURAT" type="button">
<span class="material-symbols-outlined text-[18px]">description</span>
</button>
<button class="w-8 h-8 rounded hover:bg-surface-container flex items-center justify-center text-secondary" title="Ver Árbol" type="button">
<span class="material-symbols-outlined text-[18px]">account_tree</span>
</button>
<button class="w-8 h-8 rounded hover:bg-surface-container flex items-center justify-center text-on-surface-variant" title="Editar" type="button">
<span class="material-symbols-outlined text-[18px]">edit</span>
</button>
</div>
</td>
</tr>
</tbody>
</table>
</div>
<!-- Paginación y Resumen Operacional de la Matriz -->
<div class="p-sm bg-surface-container-low flex flex-col sm:flex-row sm:items-center justify-between gap-base">
<div class="flex items-center gap-xs text-on-surface-variant font-label-sm text-label-sm">
<span class="material-symbols-outlined text-[16px] text-primary">security_update_good</span>
<span>Obligación legal Res. 1401/2007: Toda investigación de accidente grave debe remitirse a ARL Positiva/Sura dentro de los 15 días siguientes.</span>
</div>
<div class="flex items-center gap-xs self-end sm:self-auto">
<button class="px-sm py-xs rounded bg-surface-container-lowest hover:bg-surface-container text-on-surface font-label-sm text-label-sm shadow-sm" disabled="" type="button">
            Anterior
          </button>
<span class="font-label-sm text-label-sm font-semibold text-primary px-xs">Pág. 1 de 5</span>
<button class="px-sm py-xs rounded bg-surface-container-lowest hover:bg-surface-container text-on-surface font-label-sm text-label-sm shadow-sm" type="button">
            Siguiente
          </button>
</div>
</div>
</div>
</section>
<!-- PANEL INFERIOR DE CUMPLIMIENTO LEGAL & AUDITORÍA SG-SST -->
<footer class="mt-gutter grid grid-cols-1 md:grid-cols-3 gap-base">
<div class="bg-surface-container-lowest p-md rounded-xl shadow-sm flex items-start gap-sm">
<div class="w-10 h-10 rounded-lg bg-surface-container-high flex items-center justify-center text-primary shrink-0">
<span class="material-symbols-outlined text-[24px]">gavel</span>
</div>
<div>
<h3 class="font-headline-md text-headline-md text-on-surface leading-tight">Auditoría de Términos Legales</h3>
<p class="font-body-sm text-body-sm text-on-surface-variant mt-xs">
          0 investigaciones extemporáneas en 2024. Los informes con concepto técnico han sido avalados por la presidencia y secretaría del COPASST en tiempo récord.
        </p>
</div>
</div>
<div class="bg-surface-container-lowest p-md rounded-xl shadow-sm flex items-start gap-sm">
<div class="w-10 h-10 rounded-lg bg-secondary-fixed flex items-center justify-center text-secondary shrink-0">
<span class="material-symbols-outlined text-[24px]">sync_alt</span>
</div>
<div>
<h3 class="font-headline-md text-headline-md text-on-surface leading-tight">Interoperabilidad ARL</h3>
<p class="font-body-sm text-body-sm text-on-surface-variant mt-xs">
          Sincronización API habilitada. 100% de los radicados FURAT cuentan con acuse de recibo y código único de radicación asignado por la aseguradora.
        </p>
</div>
</div>
<div class="bg-surface-container-lowest p-md rounded-xl shadow-sm flex items-start gap-sm">
<div class="w-10 h-10 rounded-lg bg-surface-container-highest flex items-center justify-center text-primary shrink-0">
<span class="material-symbols-outlined text-[24px]">fact_check</span>
</div>
<div>
<h3 class="font-headline-md text-headline-md text-on-surface leading-tight">Acciones Correctivas (Planes)</h3>
<p class="font-body-sm text-body-sm text-on-surface-variant mt-xs">
          14 acciones generadas: 11 cerradas con verificación de eficacia y 3 en curso de ejecución (adecuación de barandas y sustitución de arneses).
        </p>
</div>
</div>
</footer>
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
  }</script></head><body class="bg-background font-body-md text-body-md text-on-surface antialiased"><aside class="fixed left-0 top-0 h-full w-72 bg-surface-container-lowest shadow-[0_1px_8px_rgba(0,0,0,0.04)] z-50 flex flex-col justify-between overflow-y-auto"><div class="p-gutter pb-0"><div class="flex items-center gap-base mb-xs"><div class="w-8 h-8 rounded bg-primary-container flex items-center justify-center text-on-primary font-headline-md text-headline-md">M</div><div class="flex flex-col"><span class="font-label-md text-label-md text-primary leading-tight font-semibold">Grupo Manzanares S.A.S.</span><span class="font-label-sm text-label-sm text-on-surface-variant">SG-SST Operativo</span></div></div><div class="flex items-center gap-xs mt-base mb-md"><span class="bg-surface-container-high text-on-surface font-label-sm text-label-sm px-xs py-0.5 rounded">Dec. 1072</span><span class="bg-surface-container-high text-on-surface font-label-sm text-label-sm px-xs py-0.5 rounded">Res. 0312</span></div></div><nav class="flex-1 px-sm pb-gutter flex flex-col gap-base" data-active-classes="bg-primary-container text-on-primary font-medium rounded-lg"><div class="flex flex-col gap-xs"><span class="px-xs font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">Gestión Operativa</span><a class="flex items-center gap-base px-sm py-xs rounded-lg text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-colors font-label-md text-label-md" data-path="dashboard" href="#"><span class="material-symbols-outlined text-[20px]">dashboard</span>Inicio / Dashboard</a><a class="flex items-center gap-base px-sm py-xs rounded-lg text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-colors font-label-md text-label-md" data-path="trabajadores" href="#"><span class="material-symbols-outlined text-[20px]">badge</span>Trabajadores</a><a class="flex items-center gap-base px-sm py-xs rounded-lg text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-colors font-label-md text-label-md" data-path="examenes-medicos" href="#"><span class="material-symbols-outlined text-[20px]">medical_services</span>Exámenes Médicos (EMOS)</a><a class="flex items-center gap-base px-sm py-xs rounded-lg text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-colors font-label-md text-label-md" data-path="casos-de-salud" href="#"><span class="material-symbols-outlined text-[20px]">health_and_safety</span>Casos de Salud</a><a class="flex items-center gap-base px-sm py-xs rounded-lg text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-colors font-label-md text-label-md" data-path="incapacidades-y-reintegros" href="#"><span class="material-symbols-outlined text-[20px]">assignment_return</span>Incapacidades y Reintegros</a></div><div class="flex flex-col gap-xs"><span class="px-xs font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">Riesgos Críticos &amp; Viales</span><a class="flex items-center gap-base px-sm py-xs rounded-lg text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-colors font-label-md text-label-md" data-path="trabajo-en-alturas" href="#"><span class="material-symbols-outlined text-[20px]">height</span>Trabajo en Alturas</a><a class="flex items-center gap-base px-sm py-xs rounded-lg text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-colors font-label-md text-label-md" data-path="tractoristas-operadores" href="#"><span class="material-symbols-outlined text-[20px]">agriculture</span>Tractoristas / Operadores</a><a class="flex items-center gap-base px-sm py-xs rounded-lg text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-colors font-label-md text-label-md" data-path="pesv-seguridad-vial" href="#"><span class="material-symbols-outlined text-[20px]">traffic</span>PESV (Seguridad Vial)</a><a class="flex items-center gap-base px-sm py-xs rounded-lg text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-colors font-label-md text-label-md" data-path="epp" href="#"><span class="material-symbols-outlined text-[20px]">security</span>EPP</a></div><div class="flex flex-col gap-xs"><span class="px-xs font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">Inspección &amp; Eventos</span><a class="flex items-center gap-base px-sm py-xs rounded-lg text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-colors font-label-md text-label-md" data-path="inspecciones" href="#"><span class="material-symbols-outlined text-[20px]">fact_check</span>Inspecciones</a><a aria-current="page" class="flex items-center justify-between px-sm py-xs transition-colors bg-primary-container text-on-primary font-medium rounded-lg" data-path="accidentes-e-incidentes" href="#"><div class="flex items-center gap-base"><span class="material-symbols-outlined text-[20px]">warning</span>Accidentes e Incidentes</div><span class="bg-error text-on-error font-label-sm text-label-sm px-xs py-0.5 rounded-full">2</span></a><a class="flex items-center gap-base px-sm py-xs rounded-lg text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-colors font-label-md text-label-md" data-path="investigaciones" href="#"><span class="material-symbols-outlined text-[20px]">manage_search</span>Investigaciones</a><a class="flex items-center gap-base px-sm py-xs rounded-lg text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-colors font-label-md text-label-md" data-path="acciones-correctivas" href="#"><span class="material-symbols-outlined text-[20px]">check_circle</span>Acciones Correctivas</a></div><div class="flex flex-col gap-xs"><span class="px-xs font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">Comités &amp; Cultura</span><a class="flex items-center gap-base px-sm py-xs rounded-lg text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-colors font-label-md text-label-md" data-path="capacitaciones" href="#"><span class="material-symbols-outlined text-[20px]">school</span>Capacitaciones</a><a class="flex items-center gap-base px-sm py-xs rounded-lg text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-colors font-label-md text-label-md" data-path="documentos-sg-sst" href="#"><span class="material-symbols-outlined text-[20px]">folder_open</span>Documentos SG-SST</a><a class="flex items-center gap-base px-sm py-xs rounded-lg text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-colors font-label-md text-label-md" data-path="copasst" href="#"><span class="material-symbols-outlined text-[20px]">groups</span>COPASST</a><a class="flex items-center gap-base px-sm py-xs rounded-lg text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-colors font-label-md text-label-md" data-path="ccl" href="#"><span class="material-symbols-outlined text-[20px]">handshake</span>CCL</a><a class="flex items-center gap-base px-sm py-xs rounded-lg text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-colors font-label-md text-label-md" data-path="emergencias" href="#"><span class="material-symbols-outlined text-[20px]">emergency</span>Emergencias</a><a class="flex items-center gap-base px-sm py-xs rounded-lg text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-colors font-label-md text-label-md" data-path="quimicos" href="#"><span class="material-symbols-outlined text-[20px]">science</span>Químicos</a></div></nav></aside><div class="pl-72"><header class="fixed top-0 left-72 right-0 h-16 bg-surface-container-lowest/90 backdrop-blur-xl shadow-[0_1px_8px_rgba(0,0,0,0.04)] z-40 flex items-center justify-between px-gutter"><div class="flex items-center gap-md flex-1 max-w-xl"><div class="relative w-full"><span class="material-symbols-outlined absolute left-sm top-1/2 -translate-y-1/2 text-on-surface-variant text-[20px]">search</span><input class="w-full bg-surface-container-low text-on-surface placeholder:text-on-surface-variant pl-10 pr-sm py-xs rounded-lg font-body-sm text-body-sm focus:outline-none focus:ring-2 focus:ring-secondary-container transition-all" placeholder="Buscar trabajadores, incidentes, normativas..." type="search"/></div><div class="flex items-center bg-surface-container-low px-sm py-xs rounded-lg gap-xs shrink-0"><span class="material-symbols-outlined text-[18px] text-on-surface-variant">gavel</span><span class="font-label-sm text-label-sm text-on-surface">Estándares 2024</span><span class="material-symbols-outlined text-[16px] text-on-surface-variant">expand_more</span></div></div><div class="flex items-center gap-base"><button class="flex items-center gap-xs bg-primary-container text-on-primary px-sm py-xs rounded-lg font-label-md text-label-md hover:bg-primary transition-colors" type="button"><span class="material-symbols-outlined text-[18px]">add_alert</span><span>Reporte Rápido / Notificación</span></button><button class="relative w-10 h-10 flex items-center justify-center rounded-lg hover:bg-surface-container-high transition-colors text-on-surface-variant" type="button"><span class="material-symbols-outlined text-[22px]">notifications</span><span class="absolute top-2 right-2 w-2 h-2 rounded-full bg-error"></span></button><div class="flex items-center gap-sm pl-xs"><div class="text-right hidden xl:block"><div class="font-label-md text-label-md text-on-surface font-medium">Ing. Andrés Valencia</div><div class="font-label-sm text-label-sm text-on-surface-variant">Coordinador SG-SST</div></div><div class="w-8 h-8 rounded-full bg-primary flex items-center justify-center"><span class="material-symbols-outlined text-on-primary text-[18px]">person</span></div></div></div></header><main class="w-full px-gutter pt-16 bg-surface min-h-screen"><div class="flex flex-col w-full">
<div class="flex flex-col gap-base pb-md">
<div class="flex flex-wrap items-center justify-between gap-base">
<div class="flex flex-col gap-xs min-w-0">
<div class="flex items-center gap-xs flex-wrap">
<span class="bg-primary-fixed text-on-primary-fixed font-label-sm text-label-sm px-xs py-0.5 rounded flex items-center gap-1 font-semibold">
<span class="material-symbols-outlined text-[14px]">account_tree</span>
            Metodología Árbol de Causas / ILCI Frank Bird
          </span>
<span class="bg-surface-container-high text-on-surface-variant font-label-sm text-label-sm px-xs py-0.5 rounded flex items-center gap-1">
<span class="material-symbols-outlined text-[14px]">verified</span>
            Resolución 1401 de 2007 MinTrabajo
          </span>
<span class="bg-secondary-fixed text-on-secondary-fixed font-label-sm text-label-sm px-xs py-0.5 rounded font-semibold">
            Período Agroindustrial 2024
          </span>
</div>
<h1 class="font-headline-lg text-headline-lg text-on-surface tracking-tight">
          15. Análisis y Matriz de Causas de Accidentes de Trabajo
        </h1>
<p class="font-body-sm text-body-sm text-on-surface-variant">
          Modelo secuencial de pérdidas ILCI de Frank Bird, causalidad multinivel y control de factores operacionales en Grupo Manzanares S.A.S.
        </p>
</div>
<div class="flex items-center gap-xs flex-wrap">
<button class="flex items-center gap-xs bg-surface-container-highest text-on-surface px-sm py-xs rounded-lg font-label-md text-label-md hover:bg-surface-container hover:shadow-sm transition-all" type="button">
<span class="material-symbols-outlined text-[18px]">table_view</span>
<span>Matriz IPEC Relacionada</span>
</button>
<button class="flex items-center gap-xs bg-surface-container-lowest text-primary px-sm py-xs rounded-lg font-label-md text-label-md shadow-sm hover:shadow-md transition-all" type="button">
<span class="material-symbols-outlined text-[18px]">download</span>
<span>Exportar Diagnóstico Causal (.XLSX)</span>
</button>
<button class="flex items-center gap-xs bg-primary text-on-primary px-sm py-xs rounded-lg font-label-md text-label-md shadow-sm hover:bg-primary-container transition-all" type="button">
<span class="material-symbols-outlined text-[18px]">add_circle</span>
<span>+ Asociar Causas a Evento</span>
</button>
</div>
</div>
</div>
<div class="grid grid-cols-1 xl:grid-cols-12 gap-md items-start">
<div class="xl:col-span-8 flex flex-col gap-md">
<div class="bg-surface-container-lowest p-gutter rounded-xl shadow-sm flex flex-col gap-md">
<div class="flex flex-wrap items-center justify-between gap-base">
<div class="flex items-center gap-base">
<div class="w-10 h-10 rounded-lg bg-primary flex items-center justify-center text-on-primary">
<span class="material-symbols-outlined text-[24px]">query_stats</span>
</div>
<div class="flex flex-col">
<span class="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">Métricas Agrupadas ILCI</span>
<h2 class="font-headline-md text-headline-md text-on-surface">GRÁFICO: PRINCIPALES CAUSAS DE ACCIDENTALIDAD</h2>
</div>
</div>
<div class="flex items-center gap-xs bg-surface-container-low px-sm py-xs rounded-lg text-on-surface-variant font-label-sm text-label-sm">
<span class="material-symbols-outlined text-[16px] text-primary">filter_alt</span>
<span>Universo: 25 Accidentes (Lotes 1-9 &amp; Plantas)</span>
</div>
</div>
<div class="grid grid-cols-1 lg:grid-cols-2 gap-md">
<div class="bg-surface-container-low p-md rounded-xl flex flex-col gap-base">
<div class="flex items-center justify-between">
<div class="flex items-center gap-xs">
<span class="w-2.5 h-2.5 rounded-full bg-error"></span>
<h3 class="font-label-md text-label-md text-on-surface font-semibold">Causas Inmediatas: Actos Subestándares</h3>
</div>
<span class="font-label-sm text-label-sm bg-error-container text-on-error-container px-xs py-0.5 rounded font-semibold">25 Eventos Base</span>
</div>
<div class="flex flex-col gap-sm">
<div class="flex flex-col gap-xs">
<div class="flex justify-between font-label-sm text-label-sm">
<span class="text-on-surface font-medium truncate max-w-[240px]">1. Operar equipo sin autorización o exceso velocidad</span>
<span class="text-error font-semibold shrink-0">32% (8 evt)</span>
</div>
<div class="w-full h-2 rounded bg-surface-container-high overflow-hidden">
<div class="h-full bg-error rounded" style="width: 32%;"></div>
</div>
</div>
<div class="flex flex-col gap-xs">
<div class="flex justify-between font-label-sm text-label-sm">
<span class="text-on-surface font-medium truncate max-w-[240px]">2. No usar / uso incorrecto del EPP</span>
<span class="text-error font-semibold shrink-0">28% (7 evt)</span>
</div>
<div class="w-full h-2 rounded bg-surface-container-high overflow-hidden">
<div class="h-full bg-error rounded" style="width: 28%;"></div>
</div>
</div>
<div class="flex flex-col gap-xs">
<div class="flex justify-between font-label-sm text-label-sm">
<span class="text-on-surface font-medium truncate max-w-[240px]">3. Posturas corporales inadecuadas / sobrepeso</span>
<span class="text-secondary font-semibold shrink-0">20% (5 evt)</span>
</div>
<div class="w-full h-2 rounded bg-surface-container-high overflow-hidden">
<div class="h-full bg-secondary rounded" style="width: 20%;"></div>
</div>
</div>
<div class="flex flex-col gap-xs">
<div class="flex justify-between font-label-sm text-label-sm">
<span class="text-on-surface font-medium truncate max-w-[240px]">4. Anular dispositivos o guardas protectoras</span>
<span class="text-on-surface-variant font-semibold shrink-0">12% (3 evt)</span>
</div>
<div class="w-full h-2 rounded bg-surface-container-high overflow-hidden">
<div class="h-full bg-outline rounded" style="width: 12%;"></div>
</div>
</div>
<div class="flex flex-col gap-xs">
<div class="flex justify-between font-label-sm text-label-sm">
<span class="text-on-surface font-medium truncate max-w-[240px]">5. Desatención al terreno o suelo húmedo</span>
<span class="text-on-surface-variant font-semibold shrink-0">8% (2 evt)</span>
</div>
<div class="w-full h-2 rounded bg-surface-container-high overflow-hidden">
<div class="h-full bg-outline-variant rounded" style="width: 8%;"></div>
</div>
</div>
</div>
</div>
<div class="bg-surface-container-low p-md rounded-xl flex flex-col gap-base">
<div class="flex items-center justify-between">
<div class="flex items-center gap-xs">
<span class="w-2.5 h-2.5 rounded-full bg-secondary-container"></span>
<h3 class="font-label-md text-label-md text-on-surface font-semibold">Causas Inmediatas: Condiciones Subestándares</h3>
</div>
<span class="font-label-sm text-label-sm bg-secondary-fixed text-on-secondary-fixed px-xs py-0.5 rounded font-semibold">Matriz Física</span>
</div>
<div class="flex flex-col gap-sm">
<div class="flex flex-col gap-xs">
<div class="flex justify-between font-label-sm text-label-sm">
<span class="text-on-surface font-medium truncate max-w-[240px]">1. Herramientas corte / escaleras defectuosas</span>
<span class="text-secondary font-semibold shrink-0">36% (9 evt)</span>
</div>
<div class="w-full h-2 rounded bg-surface-container-high overflow-hidden">
<div class="h-full bg-secondary rounded" style="width: 36%;"></div>
</div>
</div>
<div class="flex flex-col gap-xs">
<div class="flex justify-between font-label-sm text-label-sm">
<span class="text-on-surface font-medium truncate max-w-[240px]">2. Superficies resbalosas / pendientes sin pasamanos</span>
<span class="text-secondary font-semibold shrink-0">28% (7 evt)</span>
</div>
<div class="w-full h-2 rounded bg-surface-container-high overflow-hidden">
<div class="h-full bg-secondary-container rounded" style="width: 28%;"></div>
</div>
</div>
<div class="flex flex-col gap-xs">
<div class="flex justify-between font-label-sm text-label-sm">
<span class="text-on-surface font-medium truncate max-w-[240px]">3. Iluminación deficiente en bodegas o casetas</span>
<span class="text-primary font-semibold shrink-0">16% (4 evt)</span>
</div>
<div class="w-full h-2 rounded bg-surface-container-high overflow-hidden">
<div class="h-full bg-primary rounded" style="width: 16%;"></div>
</div>
</div>
<div class="flex flex-col gap-xs">
<div class="flex justify-between font-label-sm text-label-sm">
<span class="text-on-surface font-medium truncate max-w-[240px]">4. Falta señalización en zonas de riesgo caída</span>
<span class="text-on-surface-variant font-semibold shrink-0">12% (3 evt)</span>
</div>
<div class="w-full h-2 rounded bg-surface-container-high overflow-hidden">
<div class="h-full bg-outline rounded" style="width: 12%;"></div>
</div>
</div>
<div class="flex flex-col gap-xs">
<div class="flex justify-between font-label-sm text-label-sm">
<span class="text-on-surface font-medium truncate max-w-[240px]">5. Guardas inadecuadas en toma fuerza tractores</span>
<span class="text-on-surface-variant font-semibold shrink-0">8% (2 evt)</span>
</div>
<div class="w-full h-2 rounded bg-surface-container-high overflow-hidden">
<div class="h-full bg-outline-variant rounded" style="width: 8%;"></div>
</div>
</div>
</div>
</div>
</div>
<div class="bg-surface-container p-md rounded-xl flex flex-col gap-base">
<div class="flex flex-wrap items-center justify-between gap-xs">
<div class="flex items-center gap-xs">
<span class="material-symbols-outlined text-[20px] text-primary">balance</span>
<h3 class="font-label-md text-label-md text-on-surface font-semibold">Causas Básicas: Factores Personales (55%) vs. Factores de Trabajo (45%)</h3>
</div>
<span class="font-label-sm text-label-sm text-on-surface-variant">Índice de Control ILCI Frank Bird</span>
</div>
<div class="w-full h-3 rounded-full bg-surface-container-highest overflow-hidden flex">
<div class="h-full bg-primary" style="width: 55%;" title="Factores Personales: 55%"></div>
<div class="h-full bg-secondary-container" style="width: 45%;" title="Factores de Trabajo: 45%"></div>
</div>
<div class="grid grid-cols-1 md:grid-cols-2 gap-md pt-xs">
<div class="bg-surface-container-lowest p-sm rounded-lg flex flex-col gap-xs">
<div class="flex items-center justify-between border-b pb-xs">
<span class="font-label-sm text-label-sm text-primary font-semibold flex items-center gap-1">
<span class="material-symbols-outlined text-[16px]">person</span>
                  Factores Personales (55%)
                </span>
<span class="font-label-sm text-label-sm text-on-surface-variant">14 Casos</span>
</div>
<ul class="flex flex-col gap-xs font-body-sm text-body-sm text-on-surface">
<li class="flex items-center justify-between py-0.5">
<span class="text-on-surface-variant">Falta conocimiento / habilidad técnica:</span>
<span class="font-semibold text-primary">22%</span>
</li>
<li class="flex items-center justify-between py-0.5">
<span class="text-on-surface-variant">Capacidad física / fisiológica inadecuada:</span>
<span class="font-semibold text-primary">18%</span>
</li>
<li class="flex items-center justify-between py-0.5">
<span class="text-on-surface-variant">Tensión física o fatiga acumulada en jornada:</span>
<span class="font-semibold text-primary">15%</span>
</li>
</ul>
</div>
<div class="bg-surface-container-lowest p-sm rounded-lg flex flex-col gap-xs">
<div class="flex items-center justify-between border-b pb-xs">
<span class="font-label-sm text-label-sm text-secondary font-semibold flex items-center gap-1">
<span class="material-symbols-outlined text-[16px]">engineering</span>
                  Factores de Trabajo (45%)
                </span>
<span class="font-label-sm text-label-sm text-on-surface-variant">11 Casos</span>
</div>
<ul class="flex flex-col gap-xs font-body-sm text-body-sm text-on-surface">
<li class="flex items-center justify-between py-0.5">
<span class="text-on-surface-variant">Estándares de trabajo deficientes/desactualizados:</span>
<span class="font-semibold text-secondary">20%</span>
</li>
<li class="flex items-center justify-between py-0.5">
<span class="text-on-surface-variant">Mantenimiento inadecuado de herramientas:</span>
<span class="font-semibold text-secondary">15%</span>
</li>
<li class="flex items-center justify-between py-0.5">
<span class="text-on-surface-variant">Supervisión o liderazgo con fallas de control:</span>
<span class="font-semibold text-secondary">10%</span>
</li>
</ul>
</div>
</div>
</div>
</div>
</div>
<div class="xl:col-span-4 flex flex-col gap-md">
<div class="bg-surface-container-lowest p-gutter rounded-xl shadow-sm flex flex-col gap-base">
<div class="flex items-center justify-between">
<div class="flex items-center gap-xs">
<span class="material-symbols-outlined text-primary text-[22px]">account_tree</span>
<h3 class="font-label-md text-label-md text-on-surface font-semibold">Modelo de Dominó - Frank Bird</h3>
</div>
<span class="font-label-sm text-label-sm text-on-surface-variant">ILCI Sequence</span>
</div>
<div class="flex flex-col gap-xs text-on-surface font-body-sm text-body-sm">
<div class="bg-surface-container-low p-sm rounded-lg flex items-center gap-base">
<div class="w-7 h-7 rounded bg-primary text-on-primary flex items-center justify-center font-label-sm text-label-sm font-semibold shrink-0">1</div>
<div class="flex flex-col min-w-0">
<span class="font-label-sm text-label-sm font-semibold text-primary">Falta de Control</span>
<span class="text-on-surface-variant text-[12px] truncate">Programas inadecuados / Normas insuficientes</span>
</div>
</div>
<div class="bg-surface-container-low p-sm rounded-lg flex items-center gap-base">
<div class="w-7 h-7 rounded bg-secondary text-on-secondary flex items-center justify-center font-label-sm text-label-sm font-semibold shrink-0">2</div>
<div class="flex flex-col min-w-0">
<span class="font-label-sm text-label-sm font-semibold text-secondary">Causas Básicas</span>
<span class="text-on-surface-variant text-[12px] truncate">Factores Personales &amp; Factores de Trabajo</span>
</div>
</div>
<div class="bg-surface-container-low p-sm rounded-lg flex items-center gap-base">
<div class="w-7 h-7 rounded bg-secondary-container text-on-secondary-container flex items-center justify-center font-label-sm text-label-sm font-semibold shrink-0">3</div>
<div class="flex flex-col min-w-0">
<span class="font-label-sm text-label-sm font-semibold text-secondary-container">Causas Inmediatas</span>
<span class="text-on-surface-variant text-[12px] truncate">Actos &amp; Condiciones Subestándares</span>
</div>
</div>
<div class="bg-surface-container-low p-sm rounded-lg flex items-center gap-base">
<div class="w-7 h-7 rounded bg-error text-on-error flex items-center justify-center font-label-sm text-label-sm font-semibold shrink-0">4</div>
<div class="flex flex-col min-w-0">
<span class="font-label-sm text-label-sm font-semibold text-error">Incidente / Accidente</span>
<span class="text-on-surface-variant text-[12px] truncate">Contacto de energía / Caída de altura</span>
</div>
</div>
<div class="bg-surface-container-low p-sm rounded-lg flex items-center gap-base">
<div class="w-7 h-7 rounded bg-inverse-surface text-inverse-on-surface flex items-center justify-center font-label-sm text-label-sm font-semibold shrink-0">5</div>
<div class="flex flex-col min-w-0">
<span class="font-label-sm text-label-sm font-semibold text-inverse-surface">Pérdida Resultante</span>
<span class="text-on-surface-variant text-[12px] truncate">Lesiones personales, daños a equipos y lucro cesante</span>
</div>
</div>
</div>
<div class="p-sm bg-surface-container rounded-lg flex items-start gap-xs">
<span class="material-symbols-outlined text-[20px] text-primary shrink-0">info</span>
<p class="font-label-sm text-label-sm text-on-surface-variant leading-relaxed">
            La <strong>Res. 1401 de 2007</strong> exige desglosar la pérdida hasta identificar la falla en el sistema de gestión y los factores determinantes para evitar repetición en frentes agrícolas.
          </p>
</div>
</div>
<div class="bg-surface-container-lowest p-gutter rounded-xl shadow-sm flex flex-col gap-base">
<div class="flex items-center justify-between">
<h3 class="font-label-md text-label-md text-on-surface font-semibold">Registro Fotográfico de Evidencias</h3>
<span class="font-label-sm text-label-sm text-primary font-medium">Lote 4 - Poda</span>
</div>
<div class="relative overflow-hidden rounded-lg shadow-sm">
<img class="w-full h-40 object-cover" data-alt="Close-up forensic safety inspection photo of a broken wooden stepladder with severe crack on the upper rung and worn anti-slip rubber pads, resting against an apple orchard tree, natural morning overcast daylight, technical agricultural safety audit aesthetic." src="https://lh3.googleusercontent.com/aida-public/AB6AXuCIuyfYFOMpecRZZol-t5zaSHEASeAl-ASdfgbtCUL7aGwZbbotmV-lyE4Hn0r802EcvNd28hOshJhSXIl2zzQA9cbpgsb6z0oUkvvXav9NHYHuPeapEJjioctY5d0Zk0zb5W6qfTuUBK4OwibCaEhVmgqkpsHhM_VWjxQ5OI-txwOFd-YPAJRc9Am24Apb0Y1fofLwUQ31Vhvb_fnzVConurhKdWXPypMGPkQAI2g4Dl509nB6PNJJ"/>
<div class="absolute bottom-0 inset-x-0 bg-inverse-surface/85 backdrop-blur-sm p-xs text-center">
<span class="font-label-sm text-label-sm text-inverse-on-surface font-medium">Escalera rústica no homologada con peldaño fisurado (Lote 4)</span>
</div>
</div>
</div>
</div>
</div>
<div class="mt-md bg-surface-container-lowest p-gutter rounded-xl shadow-sm flex flex-col gap-base">
<div class="flex flex-wrap items-center justify-between gap-base border-b pb-sm">
<div class="flex items-center gap-sm">
<div class="w-8 h-8 rounded-full bg-primary-container text-on-primary flex items-center justify-center font-bold">
<span class="material-symbols-outlined text-[18px]">schema</span>
</div>
<div class="flex flex-col">
<span class="font-label-sm text-label-sm text-on-surface-variant">Módulo de Causalidad Específica</span>
<h2 class="font-headline-md text-headline-md text-on-surface">Diagrama Visual: Árbol Causal y Espina de Pescado (Ishikawa)</h2>
</div>
</div>
<div class="flex items-center gap-xs">
<label class="font-label-sm text-label-sm text-on-surface-variant font-medium" for="accidente-select">Accidente Analizado:</label>
<div class="relative min-w-[320px]">
<select class="w-full appearance-none bg-surface-container-low text-on-surface pl-sm pr-8 py-xs rounded-lg font-label-md text-label-md focus:outline-none focus:ring-2 focus:ring-secondary transition-all" id="accidente-select">
<option selected="">Caso AT-2024-018: Carlos Restrepo - Caída de escalera (Lote 4)</option>
<option>Caso AT-2024-015: Julián Gómez - Atrapamiento toma fuerza tractor (Lote 2)</option>
<option>Caso AT-2024-011: Sandra Pineda - Resbalón y caída a nivel en bodega despacho</option>
</select>
<span class="material-symbols-outlined absolute right-sm top-1/2 -translate-y-1/2 pointer-events-none text-on-surface-variant text-[18px]">expand_more</span>
</div>
</div>
</div>
<div class="w-full bg-surface p-md rounded-xl overflow-x-auto">
<div class="min-w-[940px] flex flex-col gap-base">
<div class="flex items-center justify-between bg-surface-container px-sm py-xs rounded-lg">
<span class="font-label-sm text-label-sm font-semibold text-primary uppercase">Estructura Ishikawa Adaptada al Modelo ILCI - Evento AT-2024-018</span>
<span class="font-label-sm text-label-sm text-on-surface-variant">Efecto: Fractura en antebrazo derecho por impacto contra superficie irregular</span>
</div>
<div class="grid grid-cols-4 gap-sm relative">
<div class="flex flex-col gap-xs bg-surface-container-low p-sm rounded-lg shadow-sm">
<div class="flex items-center gap-xs font-label-sm text-label-sm text-primary font-bold uppercase border-b pb-xs">
<span class="material-symbols-outlined text-[16px]">person</span>
              1. Mano de Obra (Persona)
            </div>
<div class="flex flex-col gap-xs font-body-sm text-body-sm text-on-surface">
<div class="bg-surface-container-lowest p-xs rounded text-[13px] leading-tight">
<strong>Exceso de confianza:</strong> 10 años en labores de poda sin incidentes previos reportados.
              </div>
<div class="bg-surface-container-lowest p-xs rounded text-[13px] leading-tight">
<strong>Desatención de 3 puntos:</strong> Sujetaba podadora manual con ambas manos sin punto de anclaje.
              </div>
</div>
</div>
<div class="flex flex-col gap-xs bg-surface-container-low p-sm rounded-lg shadow-sm">
<div class="flex items-center gap-xs font-label-sm text-label-sm text-secondary font-bold uppercase border-b pb-xs">
<span class="material-symbols-outlined text-[16px]">construction</span>
              2. Máquinas y Equipos
            </div>
<div class="flex flex-col gap-xs font-body-sm text-body-sm text-on-surface">
<div class="bg-surface-container-lowest p-xs rounded text-[13px] leading-tight">
<strong>Escalera rústica no certificada:</strong> Fabricación artesanal en madera sin zapatas basculantes.
              </div>
<div class="bg-surface-container-lowest p-xs rounded text-[13px] leading-tight">
<strong>Falla estructural previa:</strong> Fisura transversal oculta por barro en tercer peldaño.
              </div>
</div>
</div>
<div class="flex flex-col gap-xs bg-surface-container-low p-sm rounded-lg shadow-sm">
<div class="flex items-center gap-xs font-label-sm text-label-sm text-on-surface font-bold uppercase border-b pb-xs">
<span class="material-symbols-outlined text-[16px]">landscape</span>
              3. Entorno y Método
            </div>
<div class="flex flex-col gap-xs font-body-sm text-body-sm text-on-surface">
<div class="bg-surface-container-lowest p-xs rounded text-[13px] leading-tight">
<strong>Terreno irregular y húmedo:</strong> Pendiente de 12° con hojarasca resbaladiza tras lluvia.
              </div>
<div class="bg-surface-container-lowest p-xs rounded text-[13px] leading-tight">
<strong>Procedimiento no divulgado:</strong> Estándar de trabajo seguro en alturas para poda rural sin socializar.
              </div>
</div>
</div>
<div class="flex flex-col gap-xs bg-surface-container-low p-sm rounded-lg shadow-sm">
<div class="flex items-center gap-xs font-label-sm text-label-sm text-error font-bold uppercase border-b pb-xs">
<span class="material-symbols-outlined text-[16px]">manage_history</span>
              4. Medida y Gestión (SG-SST)
            </div>
<div class="flex flex-col gap-xs font-body-sm text-body-sm text-on-surface">
<div class="bg-surface-container-lowest p-xs rounded text-[13px] leading-tight">
<strong>Preoperacional deficiente:</strong> Lista de chequeo preoperacional no diligenciada antes del turno.
              </div>
<div class="bg-surface-container-lowest p-xs rounded text-[13px] leading-tight">
<strong>Causa Raíz Sistémica:</strong> Ausencia de protocolo de descarte o baja definitiva de equipos artesanales.
              </div>
</div>
</div>
</div>
<div class="relative w-full flex items-center justify-center py-xs">
<div class="w-full h-1 bg-primary-container rounded"></div>
<div class="absolute right-0 bg-primary text-on-primary px-sm py-xs rounded-lg font-label-md text-label-md flex items-center gap-xs shadow-md">
<span class="material-symbols-outlined text-[18px]">warning</span>
<span>EFECTO FINAL: Pérdida por Caída de Altura (1.80 m)</span>
</div>
</div>
</div>
</div>
</div>
<div class="mt-md bg-surface-container-lowest p-gutter rounded-xl shadow-sm flex flex-col gap-base mb-lg">
<div class="flex flex-wrap items-center justify-between gap-base">
<div class="flex flex-col">
<span class="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">Matriz de Relación Integral</span>
<h2 class="font-headline-md text-headline-md text-on-surface">Desglose Relacional por Accidente (Resolución 1401 de 2007)</h2>
</div>
<div class="flex items-center gap-xs">
<span class="font-label-sm text-label-sm text-on-surface-variant">Total Registros Vinculados:</span>
<span class="font-label-md text-label-md bg-primary-fixed text-on-primary-fixed px-sm py-0.5 rounded-full font-bold">1 Caso Focalizado</span>
</div>
</div>
<div class="overflow-x-auto w-full">
<table class="w-full text-left font-body-sm text-body-sm border-collapse">
<thead>
<tr class="bg-surface-container-low text-on-surface-variant font-label-sm text-label-sm uppercase tracking-wider">
<th class="py-sm px-sm font-semibold">Evento / N° FURAT</th>
<th class="py-sm px-sm font-semibold">Causas Inmediatas (Acto y Condición)</th>
<th class="py-sm px-sm font-semibold">Causas Básicas (Personal y Trabajo)</th>
<th class="py-sm px-sm font-semibold">Causa Raíz / Principal</th>
<th class="py-sm px-sm font-semibold">Agente &amp; Mecanismo</th>
<th class="py-sm px-sm font-semibold">Acción Correctiva Derivada</th>
<th class="py-sm px-sm font-semibold">Responsable &amp; Verificación</th>
</tr>
</thead>
<tbody class="divide-y divide-surface-container">
<tr class="hover:bg-surface-container-low/60 transition-colors">
<td class="py-md px-sm align-top">
<div class="flex flex-col gap-0.5">
<span class="font-label-md text-label-md font-semibold text-primary">FURAT-2024-0018</span>
<span class="text-on-surface font-medium">Carlos Restrepo</span>
<span class="font-label-sm text-label-sm text-on-surface-variant">Cargo: Podador Agrícola</span>
<span class="font-label-sm text-label-sm text-on-surface-variant">Fecha: 14/08/2024</span>
<span class="inline-flex items-center gap-1 font-label-sm text-label-sm bg-error-container text-on-error-container px-xs py-0.5 rounded w-max mt-xs font-semibold">
                  Severo (32 Días Incap.)
                </span>
</div>
</td>
<td class="py-md px-sm align-top max-w-xs">
<div class="flex flex-col gap-xs">
<div class="bg-surface-container-low p-xs rounded">
<span class="font-label-sm text-label-sm text-error font-semibold block">Acto Subestándar:</span>
<p class="text-on-surface leading-tight">Desatención de punto de anclaje de escalera y uso de ambas manos sin sujeción simultánea.</p>
</div>
<div class="bg-surface-container-low p-xs rounded">
<span class="font-label-sm text-label-sm text-secondary font-semibold block">Condición Subestándar:</span>
<p class="text-on-surface leading-tight">Peldaño con fisura longitudinal no reportada en preoperacional; suelo con hojarasca húmeda.</p>
</div>
</div>
</td>
<td class="py-md px-sm align-top max-w-xs">
<div class="flex flex-col gap-xs">
<div class="bg-surface-container-low p-xs rounded">
<span class="font-label-sm text-label-sm text-primary font-semibold block">Factor Personal:</span>
<p class="text-on-surface leading-tight">Exceso de confianza tras 10 años en el cargo y subestimación del riesgo de caída inferior a 2 m.</p>
</div>
<div class="bg-surface-container-low p-xs rounded">
<span class="font-label-sm text-label-sm text-on-surface-variant font-semibold block">Factor de Trabajo:</span>
<p class="text-on-surface leading-tight">Inspección de herramientas sin seguimiento oportuno en pañol de Lote 4; falta de rotación técnica.</p>
</div>
</div>
</td>
<td class="py-md px-sm align-top max-w-xs">
<div class="p-xs rounded bg-surface-container">
<span class="font-label-sm text-label-sm text-on-surface font-semibold block">Falla del Sistema:</span>
<p class="text-on-surface leading-tight font-medium">
                  Falla en el sistema de gestión para descarte inmediato y destrucción de escaleras de madera no homologadas en frentes de campo.
                </p>
</div>
</td>
<td class="py-md px-sm align-top">
<div class="flex flex-col gap-0.5">
<span class="font-semibold text-on-surface">Escalera tijera madera 2.4 m</span>
<span class="text-on-surface-variant text-[13px]">Mecanismo: Caída de diferente nivel a 1.80 metros</span>
<span class="text-on-surface-variant text-[13px]">Lugar: Hilera 14, Lote 4 Manzanares</span>
</div>
</td>
<td class="py-md px-sm align-top max-w-sm">
<div class="flex flex-col gap-xs">
<div class="p-xs rounded bg-surface-container-low">
<span class="font-label-sm text-label-sm text-primary font-semibold block">Plan Correctivo:</span>
<p class="text-on-surface text-[13px] leading-snug">
                    Sustitución total de 18 escaleras de madera por escaleras de aluminio dieléctricas Tipo IA (ANSI A14.2) con zapatas antideslizantes.
                  </p>
</div>
<div class="p-xs rounded bg-surface-container-low">
<span class="font-label-sm text-label-sm text-primary font-semibold block">Acción Preventiva:</span>
<p class="text-on-surface text-[13px] leading-snug">
                    Capacitación específica certificada en la regla de 3 puntos de apoyo y lista de chequeo digital preoperacional obligatoria.
                  </p>
</div>
</div>
</td>
<td class="py-md px-sm align-top">
<div class="flex flex-col gap-xs">
<div class="flex flex-col">
<span class="font-label-sm text-label-sm font-semibold text-on-surface">Ing. Andrés Valencia</span>
<span class="font-label-sm text-label-sm text-on-surface-variant">Coord. SG-SST</span>
</div>
<div class="flex flex-col">
<span class="font-label-sm text-label-sm font-semibold text-on-surface">Verificación de Eficacia:</span>
<span class="text-primary font-semibold font-label-sm text-label-sm">30 de Septiembre 2024</span>
</div>
<span class="inline-flex items-center gap-1 font-label-sm text-label-sm bg-surface-container-high text-on-surface px-xs py-0.5 rounded font-medium">
<span class="material-symbols-outlined text-[14px] text-secondary">pending_actions</span>
                  En Seguimiento (85%)
                </span>
</div>
</td>
</tr>
</tbody>
</table>
</div>
<div class="flex flex-wrap items-center justify-between gap-base pt-sm border-t font-label-sm text-label-sm text-on-surface-variant">
<div class="flex items-center gap-base">
<span class="flex items-center gap-1">
<span class="w-2 h-2 rounded-full bg-error"></span> Acto Inseguro Crítico
        </span>
<span class="flex items-center gap-1">
<span class="w-2 h-2 rounded-full bg-secondary"></span> Condición Ambiental Peligrosa
        </span>
<span class="flex items-center gap-1">
<span class="w-2 h-2 rounded-full bg-primary"></span> Falla de Control del Sistema
        </span>
</div>
<div class="flex items-center gap-xs">
<button class="p-xs hover:bg-surface-container rounded transition-colors text-on-surface-variant" type="button">
<span class="material-symbols-outlined text-[18px]">first_page</span>
</button>
<span class="font-semibold text-on-surface">Página 1 de 1</span>
<button class="p-xs hover:bg-surface-container rounded transition-colors text-on-surface-variant" type="button">
<span class="material-symbols-outlined text-[18px]">last_page</span>
</button>
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
  }</script></head><body class="bg-background font-body-md text-body-md text-on-surface antialiased"><aside class="fixed left-0 top-0 h-full w-72 bg-surface-container-lowest shadow-[0_1px_8px_rgba(0,0,0,0.04)] z-50 flex flex-col justify-between overflow-y-auto"><div class="p-gutter pb-0"><div class="flex items-center gap-base mb-xs"><div class="w-8 h-8 rounded bg-primary-container flex items-center justify-center text-on-primary font-headline-md text-headline-md">M</div><div class="flex flex-col"><span class="font-label-md text-label-md text-primary leading-tight font-semibold">Grupo Manzanares S.A.S.</span><span class="font-label-sm text-label-sm text-on-surface-variant">SG-SST Operativo</span></div></div><div class="flex items-center gap-xs mt-base mb-md"><span class="bg-surface-container-high text-on-surface font-label-sm text-label-sm px-xs py-0.5 rounded">Dec. 1072</span><span class="bg-surface-container-high text-on-surface font-label-sm text-label-sm px-xs py-0.5 rounded">Res. 0312</span></div></div><nav class="flex-1 px-sm pb-gutter flex flex-col gap-base" data-active-classes="bg-primary-container text-on-primary font-medium rounded-lg"><div class="flex flex-col gap-xs"><span class="px-xs font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">Gestión Operativa</span><a class="flex items-center gap-base px-sm py-xs rounded-lg text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-colors font-label-md text-label-md" data-path="dashboard" href="#"><span class="material-symbols-outlined text-[20px]">dashboard</span>Inicio / Dashboard</a><a class="flex items-center gap-base px-sm py-xs rounded-lg text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-colors font-label-md text-label-md" data-path="trabajadores" href="#"><span class="material-symbols-outlined text-[20px]">badge</span>Trabajadores</a><a class="flex items-center gap-base px-sm py-xs rounded-lg text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-colors font-label-md text-label-md" data-path="examenes-medicos" href="#"><span class="material-symbols-outlined text-[20px]">medical_services</span>Exámenes Médicos (EMOS)</a><a class="flex items-center gap-base px-sm py-xs rounded-lg text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-colors font-label-md text-label-md" data-path="casos-de-salud" href="#"><span class="material-symbols-outlined text-[20px]">health_and_safety</span>Casos de Salud</a><a class="flex items-center gap-base px-sm py-xs rounded-lg text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-colors font-label-md text-label-md" data-path="incapacidades-y-reintegros" href="#"><span class="material-symbols-outlined text-[20px]">assignment_return</span>Incapacidades y Reintegros</a></div><div class="flex flex-col gap-xs"><span class="px-xs font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">Riesgos Críticos &amp; Viales</span><a class="flex items-center gap-base px-sm py-xs rounded-lg text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-colors font-label-md text-label-md" data-path="trabajo-en-alturas" href="#"><span class="material-symbols-outlined text-[20px]">height</span>Trabajo en Alturas</a><a class="flex items-center gap-base px-sm py-xs rounded-lg text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-colors font-label-md text-label-md" data-path="tractoristas-operadores" href="#"><span class="material-symbols-outlined text-[20px]">agriculture</span>Tractoristas / Operadores</a><a class="flex items-center gap-base px-sm py-xs rounded-lg text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-colors font-label-md text-label-md" data-path="pesv-seguridad-vial" href="#"><span class="material-symbols-outlined text-[20px]">traffic</span>PESV (Seguridad Vial)</a><a class="flex items-center gap-base px-sm py-xs rounded-lg text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-colors font-label-md text-label-md" data-path="epp" href="#"><span class="material-symbols-outlined text-[20px]">security</span>EPP</a></div><div class="flex flex-col gap-xs"><span class="px-xs font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">Inspección &amp; Eventos</span><a class="flex items-center gap-base px-sm py-xs rounded-lg text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-colors font-label-md text-label-md" data-path="inspecciones" href="#"><span class="material-symbols-outlined text-[20px]">fact_check</span>Inspecciones</a><a class="flex items-center justify-between px-sm py-xs rounded-lg text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-colors font-label-md text-label-md" data-path="accidentes-e-incidentes" href="#"><div class="flex items-center gap-base"><span class="material-symbols-outlined text-[20px]">warning</span>Accidentes e Incidentes</div><span class="bg-error text-on-error font-label-sm text-label-sm px-xs py-0.5 rounded-full">2</span></a><a aria-current="page" class="flex items-center gap-base px-sm py-xs transition-colors bg-primary-container text-on-primary font-medium rounded-lg" data-path="investigaciones" href="#"><span class="material-symbols-outlined text-[20px]">manage_search</span>Investigaciones</a><a class="flex items-center gap-base px-sm py-xs rounded-lg text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-colors font-label-md text-label-md" data-path="acciones-correctivas" href="#"><span class="material-symbols-outlined text-[20px]">check_circle</span>Acciones Correctivas</a></div><div class="flex flex-col gap-xs"><span class="px-xs font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">Comités &amp; Cultura</span><a class="flex items-center gap-base px-sm py-xs rounded-lg text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-colors font-label-md text-label-md" data-path="capacitaciones" href="#"><span class="material-symbols-outlined text-[20px]">school</span>Capacitaciones</a><a class="flex items-center gap-base px-sm py-xs rounded-lg text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-colors font-label-md text-label-md" data-path="documentos-sg-sst" href="#"><span class="material-symbols-outlined text-[20px]">folder_open</span>Documentos SG-SST</a><a class="flex items-center gap-base px-sm py-xs rounded-lg text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-colors font-label-md text-label-md" data-path="copasst" href="#"><span class="material-symbols-outlined text-[20px]">groups</span>COPASST</a><a class="flex items-center gap-base px-sm py-xs rounded-lg text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-colors font-label-md text-label-md" data-path="ccl" href="#"><span class="material-symbols-outlined text-[20px]">handshake</span>CCL</a><a class="flex items-center gap-base px-sm py-xs rounded-lg text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-colors font-label-md text-label-md" data-path="emergencias" href="#"><span class="material-symbols-outlined text-[20px]">emergency</span>Emergencias</a><a class="flex items-center gap-base px-sm py-xs rounded-lg text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-colors font-label-md text-label-md" data-path="quimicos" href="#"><span class="material-symbols-outlined text-[20px]">science</span>Químicos</a></div></nav></aside><div class="pl-72"><header class="fixed top-0 left-72 right-0 h-16 bg-surface-container-lowest/90 backdrop-blur-xl shadow-[0_1px_8px_rgba(0,0,0,0.04)] z-40 flex items-center justify-between px-gutter"><div class="flex items-center gap-md flex-1 max-w-xl"><div class="relative w-full"><span class="material-symbols-outlined absolute left-sm top-1/2 -translate-y-1/2 text-on-surface-variant text-[20px]">search</span><input class="w-full bg-surface-container-low text-on-surface placeholder:text-on-surface-variant pl-10 pr-sm py-xs rounded-lg font-body-sm text-body-sm focus:outline-none focus:ring-2 focus:ring-secondary-container transition-all" placeholder="Buscar trabajadores, incidentes, normativas..." type="search"/></div><div class="flex items-center bg-surface-container-low px-sm py-xs rounded-lg gap-xs shrink-0"><span class="material-symbols-outlined text-[18px] text-on-surface-variant">gavel</span><span class="font-label-sm text-label-sm text-on-surface">Estándares 2024</span><span class="material-symbols-outlined text-[16px] text-on-surface-variant">expand_more</span></div></div><div class="flex items-center gap-base"><button class="flex items-center gap-xs bg-primary-container text-on-primary px-sm py-xs rounded-lg font-label-md text-label-md hover:bg-primary transition-colors" type="button"><span class="material-symbols-outlined text-[18px]">add_alert</span><span>Reporte Rápido / Notificación</span></button><button class="relative w-10 h-10 flex items-center justify-center rounded-lg hover:bg-surface-container-high transition-colors text-on-surface-variant" type="button"><span class="material-symbols-outlined text-[22px]">notifications</span><span class="absolute top-2 right-2 w-2 h-2 rounded-full bg-error"></span></button><div class="flex items-center gap-sm pl-xs"><div class="text-right hidden xl:block"><div class="font-label-md text-label-md text-on-surface font-medium">Ing. Andrés Valencia</div><div class="font-label-sm text-label-sm text-on-surface-variant">Coordinador SG-SST</div></div><div class="w-8 h-8 rounded-full bg-primary flex items-center justify-center"><span class="material-symbols-outlined text-on-primary text-[18px]">person</span></div></div></div></header><main class="w-full px-gutter pt-16 bg-surface min-h-screen"><div class="flex flex-col w-full pb-16">
<!-- ENCABEZADO NORMATIVO Y ACCIONES -->
<header class="flex flex-col gap-base pb-md pt-base">
<div class="flex flex-wrap items-center justify-between gap-base">
<div class="flex flex-col gap-xs">
<div class="flex items-center gap-xs">
<span class="font-label-sm text-label-sm text-primary uppercase tracking-wider font-semibold">Módulo Técnico &amp; Jurídico SG-SST</span>
<span class="w-1 h-1 rounded-full bg-outline-variant"></span>
<span class="font-label-sm text-label-sm text-on-surface-variant">Código: MNZ-SST-INV-2024</span>
</div>
<h1 class="font-headline-lg text-headline-lg text-on-surface tracking-tight">16. Control y Seguimiento a Investigaciones de Accidentes e Incidentes</h1>
</div>
<div class="flex items-center flex-wrap gap-xs">
<button class="flex items-center gap-xs px-sm py-xs bg-surface-container-highest text-on-surface rounded-lg font-label-md text-label-md hover:bg-surface-container-high transition-colors shadow-sm" type="button">
<span class="material-symbols-outlined text-[18px] text-primary">download</span>
<span>Descargar Formato Res. 1401 (.PDF)</span>
</button>
<button class="flex items-center gap-xs px-sm py-xs bg-surface-container-highest text-on-surface rounded-lg font-label-md text-label-md hover:bg-surface-container-high transition-colors shadow-sm" type="button">
<span class="material-symbols-outlined text-[18px] text-primary">groups_3</span>
<span>Comité de Investigaciones</span>
</button>
<button class="flex items-center gap-xs px-md py-xs bg-primary text-on-primary rounded-lg font-label-md text-label-md hover:bg-primary-container transition-colors shadow-md" onclick="document.getElementById('drawer-investigacion').classList.remove('translate-x-full')" type="button">
<span class="material-symbols-outlined text-[18px]">add_circle</span>
<span>+ Iniciar Nueva Investigación</span>
</button>
</div>
</div>
<!-- Insignias Normativas -->
<div class="flex flex-wrap items-center gap-xs">
<div class="flex items-center gap-xs bg-surface-container-low px-sm py-xs rounded-lg">
<span class="material-symbols-outlined text-[18px] text-secondary">gavel</span>
<span class="font-label-sm text-label-sm text-on-surface font-medium">Resolución 1401 de 2007 (Término Legal 15 Días Calendario)</span>
</div>
<div class="flex items-center gap-xs bg-error-container text-on-error-container px-sm py-xs rounded-lg">
<span class="material-symbols-outlined text-[18px]">report_problem</span>
<span class="font-label-sm text-label-sm font-semibold">Reporte Obligatorio ARL Sura y MinTrabajo en Eventos Graves / Mortales</span>
</div>
<div class="flex items-center gap-xs bg-surface-container-high px-sm py-xs rounded-lg text-on-surface-variant">
<span class="material-symbols-outlined text-[18px]">domain_verification</span>
<span class="font-label-sm text-label-sm">Frecuencia de Cierre: 91.2% Oportuno</span>
</div>
</div>
</header>
<!-- SECCIÓN 2: SISTEMA DE ALERTAS TEMPRANAS PARA INVESTIGACIONES (SEMÁFORO DE PLAZOS LEGALES) -->
<section class="grid grid-cols-1 xl:grid-cols-12 gap-base mt-xs mb-md">
<!-- Métricas Semafóricas -->
<div class="xl:col-span-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-base">
<!-- 🔴 Vencidas -->
<div class="flex flex-col justify-between p-sm rounded-xl bg-surface-container-lowest shadow-sm relative overflow-hidden">
<div class="absolute top-0 left-0 right-0 h-1 bg-error"></div>
<div class="flex items-center justify-between">
<span class="font-label-sm text-label-sm text-error font-semibold uppercase tracking-wider">Vencidas Legalmente</span>
<span class="material-symbols-outlined text-error text-[22px]" style="font-variation-settings: 'FILL' 1;">error</span>
</div>
<div class="my-xs">
<span class="font-display-lg text-display-lg text-error leading-none font-bold">02</span>
<span class="font-label-sm text-label-sm text-error block mt-xs font-medium">&gt; 15 Días sin remisión</span>
</div>
<div class="flex items-center gap-xs bg-error-container px-xs py-1 rounded">
<span class="material-symbols-outlined text-[14px] text-on-error-container">warning</span>
<span class="font-label-sm text-label-sm text-on-error-container leading-tight">Riesgo sanción MinTrabajo</span>
</div>
</div>
<!-- 🟠 Próximas a vencer -->
<div class="flex flex-col justify-between p-sm rounded-xl bg-surface-container-lowest shadow-sm relative overflow-hidden">
<div class="absolute top-0 left-0 right-0 h-1 bg-secondary-container"></div>
<div class="flex items-center justify-between">
<span class="font-label-sm text-label-sm text-secondary-container font-semibold uppercase tracking-wider">Próximas a Vencer</span>
<span class="material-symbols-outlined text-secondary-container text-[22px]">alarm</span>
</div>
<div class="my-xs">
<span class="font-display-lg text-display-lg text-on-surface leading-none font-bold">03</span>
<span class="font-label-sm text-label-sm text-on-surface-variant block mt-xs font-medium">Ventana 1 a 4 días restantes</span>
</div>
<div class="flex items-center gap-xs bg-surface-container px-xs py-1 rounded">
<span class="material-symbols-outlined text-[14px] text-secondary">priority_high</span>
<span class="font-label-sm text-label-sm text-secondary font-medium">Requiere firma expedita</span>
</div>
</div>
<!-- 🟡 En Curso Normal -->
<div class="flex flex-col justify-between p-sm rounded-xl bg-surface-container-lowest shadow-sm relative overflow-hidden">
<div class="absolute top-0 left-0 right-0 h-1 bg-surface-tint"></div>
<div class="flex items-center justify-between">
<span class="font-label-sm text-label-sm text-on-surface-variant font-semibold uppercase tracking-wider">En Curso Normal</span>
<span class="material-symbols-outlined text-primary text-[22px]">pending_actions</span>
</div>
<div class="my-xs">
<span class="font-display-lg text-display-lg text-on-surface leading-none font-bold">04</span>
<span class="font-label-sm text-label-sm text-on-surface-variant block mt-xs font-medium">5 a 10 días restantes</span>
</div>
<div class="flex items-center gap-xs bg-surface-container-low px-xs py-1 rounded">
<span class="material-symbols-outlined text-[14px] text-on-surface-variant">schedule</span>
<span class="font-label-sm text-label-sm text-on-surface-variant">Trabajo de campo activo</span>
</div>
</div>
<!-- 🟢 Concluidas & ARL -->
<div class="flex flex-col justify-between p-sm rounded-xl bg-surface-container-lowest shadow-sm relative overflow-hidden">
<div class="absolute top-0 left-0 right-0 h-1 bg-primary"></div>
<div class="flex items-center justify-between">
<span class="font-label-sm text-label-sm text-primary font-semibold uppercase tracking-wider">Aprobadas por ARL</span>
<span class="material-symbols-outlined text-primary text-[22px]" style="font-variation-settings: 'FILL' 1;">verified</span>
</div>
<div class="my-xs">
<span class="font-display-lg text-display-lg text-on-surface leading-none font-bold">09</span>
<span class="font-label-sm text-label-sm text-on-surface-variant block mt-xs font-medium">Cierre legal satisfactorio</span>
</div>
<div class="flex items-center gap-xs bg-surface-container-high px-xs py-1 rounded">
<span class="material-symbols-outlined text-[14px] text-primary">task_alt</span>
<span class="font-label-sm text-label-sm text-primary font-semibold">100% Medidas acordadas</span>
</div>
</div>
</div>
<!-- Tarjeta de Alerta Crítica en Tiempo Real con Cuenta Regresiva -->
<div class="xl:col-span-4 flex flex-col justify-between p-md rounded-xl bg-surface-container-lowest shadow-md relative overflow-hidden">
<div class="absolute -right-8 -top-8 w-28 h-28 bg-error-container rounded-full opacity-40 blur-xl pointer-events-none"></div>
<div class="flex items-center justify-between relative">
<div class="flex items-center gap-xs">
<span class="relative flex h-3 w-3">
<span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-error opacity-75"></span>
<span class="relative inline-flex rounded-full h-3 w-3 bg-error"></span>
</span>
<span class="font-label-sm text-label-sm text-error font-bold tracking-wide">ALERTA CRÍTICA EN TIEMPO REAL</span>
</div>
<span class="bg-error-container text-on-error-container font-label-sm text-label-sm px-xs py-0.5 rounded font-bold">CASO AT-2024-017</span>
</div>
<div class="my-xs flex flex-col gap-1 relative">
<div class="flex items-baseline justify-between">
<span class="font-headline-md text-headline-md text-error font-bold">Vence en 48 horas</span>
<span class="font-label-sm text-label-sm text-on-surface-variant font-medium">Límite: 26/Oct/2024</span>
</div>
<p class="font-body-sm text-body-sm text-on-surface leading-snug">
          Pendiente firma del Especialista con Licencia SST y Miembros COPASST. El incumplimiento del radicado en ARL Sura generará reporte directo de no conformidad legal.
        </p>
</div>
<!-- Barra de progreso de término (13/15 días consumidos) -->
<div class="flex flex-col gap-1 pt-xs">
<div class="flex justify-between font-label-sm text-label-sm text-on-surface-variant">
<span>Día 13 de 15 legales</span>
<span class="font-semibold text-error">86% plazo transcurrido</span>
</div>
<div class="w-full bg-surface-container h-2 rounded-full overflow-hidden">
<div class="bg-error h-full rounded-full transition-all" style="width: 86%;"></div>
</div>
</div>
<div class="mt-xs pt-xs flex items-center justify-between gap-base">
<button class="w-full bg-error text-on-error px-sm py-xs rounded-lg font-label-md text-label-md flex items-center justify-center gap-xs hover:bg-on-error-container transition-colors shadow-sm" onclick="document.getElementById('drawer-investigacion').classList.remove('translate-x-full')" type="button">
<span class="material-symbols-outlined text-[16px]">assignment_turned_in</span>
<span>Gestionar Firmas Inmediatas</span>
</button>
</div>
</div>
</section>
<!-- SECCIÓN 3: FILTROS DE CONTROL OPERACIONAL -->
<div class="flex flex-col gap-sm bg-surface-container-lowest p-sm rounded-xl shadow-sm mb-base">
<div class="flex flex-wrap items-center justify-between gap-sm">
<!-- Filtros por Estado -->
<div class="flex items-center flex-wrap gap-xs">
<span class="font-label-sm text-label-sm text-on-surface-variant mr-xs">Filtro Estado:</span>
<button class="px-sm py-1 rounded-full bg-primary text-on-primary font-label-sm text-label-sm font-medium shadow-sm" type="button">Todos (18)</button>
<button class="px-sm py-1 rounded-full bg-surface-container text-on-surface-variant hover:bg-surface-container-high font-label-sm text-label-sm transition-colors" type="button">Pendiente de Inicio (2)</button>
<button class="px-sm py-1 rounded-full bg-surface-container text-on-surface-variant hover:bg-surface-container-high font-label-sm text-label-sm transition-colors" type="button">En Campo (4)</button>
<button class="px-sm py-1 rounded-full bg-surface-container text-on-surface-variant hover:bg-surface-container-high font-label-sm text-label-sm transition-colors" type="button">Revisión COPASST (3)</button>
<button class="px-sm py-1 rounded-full bg-surface-container text-on-surface-variant hover:bg-surface-container-high font-label-sm text-label-sm transition-colors" type="button">Radicada ARL (2)</button>
<button class="px-sm py-1 rounded-full bg-surface-container text-on-surface-variant hover:bg-surface-container-high font-label-sm text-label-sm transition-colors" type="button">Cerrada (7)</button>
</div>
<!-- Selectores de Metodología, Finca y Responsable -->
<div class="flex items-center flex-wrap gap-xs">
<div class="flex items-center bg-surface-container-low px-sm py-1 rounded-lg gap-xs">
<span class="material-symbols-outlined text-[16px] text-on-surface-variant">account_tree</span>
<select class="bg-transparent font-label-sm text-label-sm text-on-surface focus:outline-none cursor-pointer">
<option>Todas las Metodologías</option>
<option>Diagrama Ishikawa (Causa-Efecto)</option>
<option>Árbol de Causas</option>
<option>5 Porqués</option>
<option>SCRA (Síntoma-Causa-Remedio)</option>
</select>
</div>
<div class="flex items-center bg-surface-container-low px-sm py-1 rounded-lg gap-xs">
<span class="material-symbols-outlined text-[16px] text-on-surface-variant">pin_drop</span>
<select class="bg-transparent font-label-sm text-label-sm text-on-surface focus:outline-none cursor-pointer">
<option>Todas las Fincas</option>
<option>Finca La Esperanza</option>
<option>Finca El Mirador</option>
<option>Finca Los Naranjos</option>
<option>Planta de Beneficio</option>
</select>
</div>
<div class="flex items-center bg-surface-container-low px-sm py-1 rounded-lg gap-xs">
<span class="material-symbols-outlined text-[16px] text-on-surface-variant">manage_accounts</span>
<select class="bg-transparent font-label-sm text-label-sm text-on-surface focus:outline-none cursor-pointer">
<option>Responsable Líder</option>
<option>Ing. Andrés Valencia</option>
<option>Dra. Mariana Gómez</option>
<option>Tec. Roberto Salazar</option>
</select>
</div>
</div>
</div>
</div>
<!-- SECCIÓN 4: MATRIZ DE CONTROL Y MONITOREO DE INVESTIGACIONES -->
<div class="bg-surface-container-lowest rounded-xl shadow-sm overflow-hidden flex flex-col">
<div class="overflow-x-auto">
<table class="w-full text-left border-collapse">
<thead>
<tr class="bg-surface-container-low text-on-surface-variant font-label-sm text-label-sm uppercase tracking-wider">
<th class="p-sm font-semibold">Accidente &amp; Trabajador</th>
<th class="p-sm font-semibold">Fechas Legales</th>
<th class="p-sm font-semibold">Término &amp; Semáforo</th>
<th class="p-sm font-semibold">Equipo Investigador (Res. 1401)</th>
<th class="p-sm font-semibold">Metodología</th>
<th class="p-sm font-semibold">Síntesis de Causas</th>
<th class="p-sm font-semibold">Plan de Acción</th>
<th class="p-sm font-semibold">Evidencias</th>
<th class="p-sm font-semibold text-right">Gestión</th>
</tr>
</thead>
<tbody class="divide-y-0 font-body-sm text-body-sm text-on-surface">
<!-- REGISTRO 1: Vencida -->
<tr class="bg-surface-container-lowest hover:bg-surface-container-low transition-colors">
<td class="p-sm">
<div class="flex flex-col">
<div class="flex items-center gap-xs">
<span class="font-label-md text-label-md font-semibold text-primary">AT-2024-015</span>
<span class="bg-error-container text-on-error-container text-[10px] font-bold px-1.5 py-0.5 rounded">Grave</span>
</div>
<span class="font-label-md text-label-md text-on-surface font-medium mt-0.5">Julián Camilo Pérez</span>
<span class="font-label-sm text-label-sm text-on-surface-variant">Finca La Esperanza • Cosechador</span>
</div>
</td>
<td class="p-sm">
<div class="flex flex-col">
<span class="text-on-surface font-medium">Acc: 06/Oct/2024</span>
<span class="text-error font-semibold">Límite: 21/Oct/2024</span>
<span class="text-on-surface-variant text-[11px]">15 días calendarios</span>
</div>
</td>
<td class="p-sm">
<span class="inline-flex items-center gap-xs px-sm py-0.5 rounded-full bg-error text-on-error font-label-sm text-label-sm font-bold shadow-sm">
<span class="material-symbols-outlined text-[14px]">error</span>
                Vencida hace 4 días
              </span>
</td>
<td class="p-sm">
<div class="flex flex-col gap-0.5 text-[12px] leading-tight">
<span class="text-on-surface"><strong>Líder:</strong> Ing. Andrés Valencia (SST)</span>
<span class="text-on-surface-variant"><strong>Jefe:</strong> Sup. Ramón Vélez</span>
<span class="text-on-surface-variant"><strong>COPASST:</strong> Carlos Ramos</span>
<span class="text-error font-medium"><strong>Licencia SST:</strong> Pendiente Firma</span>
</div>
</td>
<td class="p-sm">
<span class="px-xs py-0.5 rounded bg-surface-container-high text-on-surface font-label-sm text-label-sm font-medium">
                Árbol de Causas
              </span>
</td>
<td class="p-sm max-w-[220px]">
<div class="flex flex-col text-[12px] leading-tight">
<span class="text-on-surface"><strong>Inmediatas:</strong> Pérdida de equilibrio en escalera sin traba.</span>
<span class="text-on-surface-variant mt-0.5"><strong>Básicas:</strong> Falta de inspección preoperacional y calzado húmedo.</span>
</div>
</td>
<td class="p-sm">
<div class="flex flex-col gap-0.5">
<span class="font-label-sm text-label-sm font-semibold text-primary">3 Medidas Formadas</span>
<span class="text-on-surface-variant text-[11px]">Técnica: Amarre de base</span>
<span class="text-on-surface-variant text-[11px]">Formativa: Taller de 3 puntos</span>
</div>
</td>
<td class="p-sm">
<div class="flex items-center gap-1 text-on-surface-variant">
<span class="material-symbols-outlined text-[18px] text-primary" title="Registro Fotográfico">photo_camera</span>
<span class="material-symbols-outlined text-[18px] text-primary" title="Actas Testimoniales">description</span>
<span class="material-symbols-outlined text-[18px] text-outline" title="Falta Acta de Cierre">cancel</span>
</div>
</td>
<td class="p-sm text-right">
<button class="px-sm py-1 bg-primary-container text-on-primary rounded font-label-sm text-label-sm font-semibold hover:bg-primary transition-colors" onclick="document.getElementById('drawer-investigacion').classList.remove('translate-x-full')" type="button">
                Regularizar
              </button>
</td>
</tr>
<!-- REGISTRO 2: Próxima a vencer (48 horas) -->
<tr class="bg-surface-container-low hover:bg-surface-container transition-colors">
<td class="p-sm">
<div class="flex flex-col">
<div class="flex items-center gap-xs">
<span class="font-label-md text-label-md font-semibold text-primary">AT-2024-017</span>
<span class="bg-secondary-container text-on-secondary-container text-[10px] font-bold px-1.5 py-0.5 rounded">Moderado</span>
</div>
<span class="font-label-md text-label-md text-on-surface font-medium mt-0.5">Darío Arismendi Ruiz</span>
<span class="font-label-sm text-label-sm text-on-surface-variant">Finca El Mirador • Operador Tractor</span>
</div>
</td>
<td class="p-sm">
<div class="flex flex-col">
<span class="text-on-surface font-medium">Acc: 11/Oct/2024</span>
<span class="text-secondary-container font-semibold">Límite: 26/Oct/2024</span>
<span class="text-on-surface-variant text-[11px]">15 días calendarios</span>
</div>
</td>
<td class="p-sm">
<span class="inline-flex items-center gap-xs px-sm py-0.5 rounded-full bg-secondary-container text-on-secondary font-label-sm text-label-sm font-bold shadow-sm">
<span class="material-symbols-outlined text-[14px]">timer</span>
                ⚠️ 48 Horas Restantes
              </span>
</td>
<td class="p-sm">
<div class="flex flex-col gap-0.5 text-[12px] leading-tight">
<span class="text-on-surface"><strong>Líder:</strong> Dra. Mariana Gómez (SST)</span>
<span class="text-on-surface-variant"><strong>Jefe:</strong> Ing. Hernán Toro</span>
<span class="text-on-surface-variant"><strong>COPASST:</strong> Lucía Herrera</span>
<span class="text-primary font-medium"><strong>Firmas:</strong> 75% recolectadas</span>
</div>
</td>
<td class="p-sm">
<span class="px-xs py-0.5 rounded bg-surface-container-high text-on-surface font-label-sm text-label-sm font-medium">
                Diagrama Ishikawa
              </span>
</td>
<td class="p-sm max-w-[220px]">
<div class="flex flex-col text-[12px] leading-tight">
<span class="text-on-surface"><strong>Inmediatas:</strong> Atrapamiento de extremidad al acoplar toma de fuerza.</span>
<span class="text-on-surface-variant mt-0.5"><strong>Básicas:</strong> Guarda protectora retirada para mantenimiento previo.</span>
</div>
</td>
<td class="p-sm">
<div class="flex flex-col gap-0.5">
<span class="font-label-sm text-label-sm font-semibold text-secondary">3 Medidas Definidas</span>
<span class="text-on-surface-variant text-[11px]">Técnica: Sensor de paro automático</span>
<span class="text-on-surface-variant text-[11px]">Admin: Protocolo LOTO</span>
</div>
</td>
<td class="p-sm">
<div class="flex items-center gap-1 text-on-surface-variant">
<span class="material-symbols-outlined text-[18px] text-primary">photo_camera</span>
<span class="material-symbols-outlined text-[18px] text-primary">description</span>
<span class="material-symbols-outlined text-[18px] text-primary">draw</span>
</div>
</td>
<td class="p-sm text-right">
<button class="px-sm py-1 bg-secondary text-on-secondary rounded font-label-sm text-label-sm font-semibold hover:bg-secondary-container transition-colors" onclick="document.getElementById('drawer-investigacion').classList.remove('translate-x-full')" type="button">
                Revisar y Radicar
              </button>
</td>
</tr>
<!-- REGISTRO 3: En Plazo Normal -->
<tr class="bg-surface-container-lowest hover:bg-surface-container-low transition-colors">
<td class="p-sm">
<div class="flex flex-col">
<div class="flex items-center gap-xs">
<span class="font-label-md text-label-md font-semibold text-primary">AT-2024-018</span>
<span class="bg-surface-container-high text-on-surface text-[10px] font-bold px-1.5 py-0.5 rounded">Leve</span>
</div>
<span class="font-label-md text-label-md text-on-surface font-medium mt-0.5">Carlos Restrepo</span>
<span class="font-label-sm text-label-sm text-on-surface-variant">Finca La Esperanza • Cuadrillero</span>
</div>
</td>
<td class="p-sm">
<div class="flex flex-col">
<span class="text-on-surface font-medium">Acc: 14/Oct/2024</span>
<span class="text-on-surface-variant font-medium">Límite: 29/Oct/2024</span>
<span class="text-on-surface-variant text-[11px]">15 días calendarios</span>
</div>
</td>
<td class="p-sm">
<span class="inline-flex items-center gap-xs px-sm py-0.5 rounded-full bg-surface-container-high text-on-surface font-label-sm text-label-sm font-medium">
<span class="material-symbols-outlined text-[14px] text-secondary">update</span>
                5 Días Restantes
              </span>
</td>
<td class="p-sm">
<div class="flex flex-col gap-0.5 text-[12px] leading-tight">
<span class="text-on-surface"><strong>Líder:</strong> Ing. Andrés Valencia</span>
<span class="text-on-surface-variant"><strong>Jefe:</strong> Sup. Ramón Vélez</span>
<span class="text-on-surface-variant"><strong>COPASST:</strong> Carlos Ramos</span>
</div>
</td>
<td class="p-sm">
<span class="px-xs py-0.5 rounded bg-surface-container text-on-surface font-label-sm text-label-sm">
                5 Porqués
              </span>
</td>
<td class="p-sm max-w-[220px]">
<div class="flex flex-col text-[12px] leading-tight">
<span class="text-on-surface"><strong>Inmediatas:</strong> Salpicadura ocular durante aspersión manual.</span>
<span class="text-on-surface-variant mt-0.5"><strong>Básicas:</strong> Gafas empañadas no adecuadas para clima cálido.</span>
</div>
</td>
<td class="p-sm">
<div class="flex flex-col gap-0.5">
<span class="font-label-sm text-label-sm font-semibold text-on-surface">2 Medidas en curso</span>
<span class="text-on-surface-variant text-[11px]">Dotación: Gafas antiempañantes</span>
</div>
</td>
<td class="p-sm">
<div class="flex items-center gap-1 text-on-surface-variant">
<span class="material-symbols-outlined text-[18px] text-primary">photo_camera</span>
<span class="material-symbols-outlined text-[18px] text-outline">description</span>
</div>
</td>
<td class="p-sm text-right">
<button class="px-sm py-1 bg-surface-container text-on-surface rounded font-label-sm text-label-sm font-medium hover:bg-surface-container-high transition-colors" type="button">
                Editar
              </button>
</td>
</tr>
<!-- REGISTRO 4: Concluida y Radicada en ARL -->
<tr class="bg-surface-container-lowest hover:bg-surface-container-low transition-colors">
<td class="p-sm">
<div class="flex flex-col">
<div class="flex items-center gap-xs">
<span class="font-label-md text-label-md font-semibold text-primary">AT-2024-014</span>
<span class="bg-surface-container-high text-on-surface text-[10px] font-bold px-1.5 py-0.5 rounded">Grave</span>
</div>
<span class="font-label-md text-label-md text-on-surface font-medium mt-0.5">Marta Salazar Gómez</span>
<span class="font-label-sm text-label-sm text-on-surface-variant">Planta de Beneficio • Clasificadora</span>
</div>
</td>
<td class="p-sm">
<div class="flex flex-col">
<span class="text-on-surface font-medium">Acc: 28/Sep/2024</span>
<span class="text-on-surface-variant font-medium">Cierre: 08/Oct/2024</span>
<span class="text-primary font-semibold text-[11px]">Radicado S Premium: #883921</span>
</div>
</td>
<td class="p-sm">
<span class="inline-flex items-center gap-xs px-sm py-0.5 rounded-full bg-primary-container text-on-primary font-label-sm text-label-sm font-semibold">
<span class="material-symbols-outlined text-[14px]">check_circle</span>
                Concluida &amp; Aprobada
              </span>
</td>
<td class="p-sm">
<div class="flex flex-col gap-0.5 text-[12px] leading-tight">
<span class="text-on-surface"><strong>Comité Completo</strong> (4 firmas)</span>
<span class="text-on-surface-variant">Especialista Licenciado Avaló</span>
<span class="text-on-surface-variant">ARL Sura: Sin objeciones</span>
</div>
</td>
<td class="p-sm">
<span class="px-xs py-0.5 rounded bg-surface-container-high text-on-surface font-label-sm text-label-sm font-medium">
                SCRA Metodología
              </span>
</td>
<td class="p-sm max-w-[220px]">
<div class="flex flex-col text-[12px] leading-tight">
<span class="text-on-surface"><strong>Causa Raíz:</strong> Desajuste en banda transportadora y ausencia de paro.</span>
<span class="text-on-surface-variant mt-0.5"><strong>Remedio:</strong> Guarda integral instalada y mantenimiento preventivo.</span>
</div>
</td>
<td class="p-sm">
<div class="flex flex-col gap-0.5">
<span class="font-label-sm text-label-sm font-semibold text-primary">Cierre 100% Verificado</span>
<span class="text-on-surface-variant text-[11px]">Seguimiento a 30 días OK</span>
</div>
</td>
<td class="p-sm">
<div class="flex items-center gap-1 text-primary">
<span class="material-symbols-outlined text-[18px]">verified_user</span>
<span class="material-symbols-outlined text-[18px]">attachment</span>
</div>
</td>
<td class="p-sm text-right">
<button class="px-sm py-1 bg-surface-container-low text-primary rounded font-label-sm text-label-sm font-medium hover:bg-surface-container-high transition-colors" type="button">
                Ver Acta Radicada
              </button>
</td>
</tr>
</tbody>
</table>
</div>
<!-- Paginador y Pie de Matriz -->
<div class="flex flex-wrap items-center justify-between p-sm bg-surface-container-lowest">
<span class="font-label-sm text-label-sm text-on-surface-variant">Mostrando 4 de 18 investigaciones registradas en vigencia 2024</span>
<div class="flex items-center gap-xs">
<button class="px-sm py-1 rounded bg-surface-container-low text-on-surface font-label-sm text-label-sm hover:bg-surface-container disabled:opacity-50" type="button">Anterior</button>
<span class="px-sm py-1 rounded bg-primary text-on-primary font-label-sm text-label-sm font-semibold">1</span>
<button class="px-sm py-1 rounded bg-surface-container-low text-on-surface font-label-sm text-label-sm hover:bg-surface-container" type="button">2</button>
<button class="px-sm py-1 rounded bg-surface-container-low text-on-surface font-label-sm text-label-sm hover:bg-surface-container" type="button">Siguiente</button>
</div>
</div>
</div>
<!-- SECCIÓN VISUAL ADICIONAL: DIAGRAMA METODOLÓGICO Y CONTROL DE CAUSAS BENTOGRID -->
<section class="grid grid-cols-1 lg:grid-cols-3 gap-base mt-md">
<!-- Componente Metodologías Aplicadas -->
<div class="flex flex-col justify-between p-base rounded-xl bg-surface-container-lowest shadow-sm">
<div>
<div class="flex items-center justify-between mb-xs">
<span class="font-label-md text-label-md text-primary font-semibold uppercase tracking-wider">Distribución por Metodología</span>
<span class="material-symbols-outlined text-[20px] text-on-surface-variant">schema</span>
</div>
<p class="font-body-sm text-body-sm text-on-surface-variant mb-base">Estandarización de herramientas diagnósticas según gravedad y tipología del evento.</p>
<!-- SVG Chart: Proporción de Metodologías -->
<div class="flex items-center justify-center my-base">
<svg class="w-36 h-36" viewbox="0 0 160 160">
<circle class="text-surface-container-high" cx="80" cy="80" fill="transparent" r="60" stroke="currentColor" stroke-width="18"></circle>
<!-- Diagrama Ishikawa 45% -->
<circle class="text-primary" cx="80" cy="80" fill="transparent" r="60" stroke="currentColor" stroke-dasharray="376.99" stroke-dashoffset="207.3" stroke-linecap="round" stroke-width="18" transform="rotate(-90 80 80)"></circle>
<!-- Árbol de causas 30% -->
<circle class="text-secondary" cx="80" cy="80" fill="transparent" r="60" stroke="currentColor" stroke-dasharray="376.99" stroke-dashoffset="263.8" stroke-linecap="round" stroke-width="18" transform="rotate(72 80 80)"></circle>
<!-- 5 Porqués 25% -->
<circle class="text-secondary-container" cx="80" cy="80" fill="transparent" r="60" stroke="currentColor" stroke-dasharray="376.99" stroke-dashoffset="282.7" stroke-linecap="round" stroke-width="18" transform="rotate(180 80 80)"></circle>
</svg>
</div>
<div class="flex flex-col gap-xs pt-xs">
<div class="flex items-center justify-between text-on-surface">
<span class="flex items-center gap-xs font-label-sm text-label-sm">
<span class="w-2.5 h-2.5 rounded-full bg-primary"></span>
              Diagrama Ishikawa (45%)
            </span>
<span class="font-label-sm text-label-sm font-semibold">8 casos</span>
</div>
<div class="flex items-center justify-between text-on-surface">
<span class="flex items-center gap-xs font-label-sm text-label-sm">
<span class="w-2.5 h-2.5 rounded-full bg-secondary"></span>
              Árbol de Causas (30%)
            </span>
<span class="font-label-sm text-label-sm font-semibold">5 casos</span>
</div>
<div class="flex items-center justify-between text-on-surface">
<span class="flex items-center gap-xs font-label-sm text-label-sm">
<span class="w-2.5 h-2.5 rounded-full bg-secondary-container"></span>
              5 Porqués / SCRA (25%)
            </span>
<span class="font-label-sm text-label-sm font-semibold">5 casos</span>
</div>
</div>
</div>
<div class="pt-sm mt-xs">
<span class="font-label-sm text-label-sm text-on-surface-variant flex items-center gap-1">
<span class="material-symbols-outlined text-[16px] text-primary">info</span>
          Art. 3 Res 1401: Metodología a elección técnica justificada.
        </span>
</div>
</div>
<!-- Fotodocumentación y Trabajo de Campo -->
<div class="flex flex-col justify-between p-base rounded-xl bg-surface-container-lowest shadow-sm">
<div>
<div class="flex items-center justify-between mb-xs">
<span class="font-label-md text-label-md text-primary font-semibold uppercase tracking-wider">Evidencias Fotográficas en Campo</span>
<span class="material-symbols-outlined text-[20px] text-on-surface-variant">photo_library</span>
</div>
<p class="font-body-sm text-body-sm text-on-surface-variant mb-sm">Levantamiento in situ dentro de las primeras 24 horas del suceso operacional.</p>
<div class="grid grid-cols-2 gap-xs my-xs">
<div class="flex flex-col gap-1">
<div class="h-28 rounded-lg overflow-hidden relative">
<img class="w-full h-full object-cover" data-alt="Agricultural farm machinery tractor power take off mechanism detailed inspection for safety investigation in Colombia farm sunny daylight" src="https://lh3.googleusercontent.com/aida-public/AB6AXuD1tLW61X8TO7AjZDbQ8ol22ZulBxcV3LRmmAyg1jpQ0oMeilecwfqRnPAg2E_KG9F_gSVszCYSLqeGs-83JCdHbghWdexdg1oeBtHjRoDVDa_mOa-o6-4BOD9msO5zL1OWEg14d7y67vyrWitK1JDkCM5iv4C1Vm3UkaFBhgS6C49_2a5LsByPvbYpOQ80WTyySgqgjWlJHQ_FgcHoClJHl-pHNEMatcc6M0jusmlqOJF5DhTMnAl2"/>
<span class="absolute bottom-1 left-1 bg-inverse-surface/80 text-on-primary px-1 py-0.5 rounded text-[10px] font-medium">AT-2024-017</span>
</div>
<span class="font-label-sm text-label-sm text-on-surface font-medium truncate">Mecanismo toma de fuerza</span>
</div>
<div class="flex flex-col gap-1">
<div class="h-28 rounded-lg overflow-hidden relative">
<img class="w-full h-full object-cover" data-alt="Wood ladder leaning against high crop trees coffee plantation harvest safety audit with measurement tools in bright natural light" src="https://lh3.googleusercontent.com/aida-public/AB6AXuD5WPLcZKhDzyweUmUwGHO3ubk0L-gUJ0N1RvQm03izFt7o4Yf47KvmxYXwubmvEnrCRX6--3MDwOEPH71IIiEaLZls-qNPl-jekaAGsJ7Hd6L6eU4EOV1zlJ88TRB8WVoItKujnaRTJ_en71MaFIYGYG83POcrVrj0O14TQ10JzMESafO1QGoPUtemHG6hbPMyKUJYx2i6swptpQn5Y6SyRwowpG4Df7toZLNeh1HbYdeeV-ZsNINj"/>
<span class="absolute bottom-1 left-1 bg-inverse-surface/80 text-on-primary px-1 py-0.5 rounded text-[10px] font-medium">AT-2024-015</span>
</div>
<span class="font-label-sm text-label-sm text-on-surface font-medium truncate">Escalera sin zapatas</span>
</div>
</div>
</div>
<div class="pt-sm">
<button class="w-full py-xs rounded-lg bg-surface-container text-on-surface font-label-md text-label-md flex items-center justify-center gap-xs hover:bg-surface-container-high transition-colors" type="button">
<span class="material-symbols-outlined text-[18px]">add_a_photo</span>
<span>Adjuntar Registro de Campo</span>
</button>
</div>
</div>
<!-- Monitoreo de Planes de Acción -->
<div class="flex flex-col justify-between p-base rounded-xl bg-surface-container-lowest shadow-sm">
<div>
<div class="flex items-center justify-between mb-xs">
<span class="font-label-md text-label-md text-primary font-semibold uppercase tracking-wider">Eficacia de Planes de Acción</span>
<span class="material-symbols-outlined text-[20px] text-primary">published_with_changes</span>
</div>
<p class="font-body-sm text-body-sm text-on-surface-variant mb-sm">Jerarquía de controles según Dec. 1072/2015 implementados post-evento.</p>
<div class="flex flex-col gap-sm my-xs">
<div class="flex flex-col gap-1">
<div class="flex justify-between font-label-sm text-label-sm">
<span class="text-on-surface font-medium">Controles de Ingeniería / Técnicos</span>
<span class="text-primary font-bold">88% Ejecutado</span>
</div>
<div class="w-full bg-surface-container h-2 rounded-full overflow-hidden">
<div class="bg-primary h-full rounded-full" style="width: 88%;"></div>
</div>
</div>
<div class="flex flex-col gap-1">
<div class="flex justify-between font-label-sm text-label-sm">
<span class="text-on-surface font-medium">Controles Administrativos / Procedimentales</span>
<span class="text-secondary font-bold">94% Ejecutado</span>
</div>
<div class="w-full bg-surface-container h-2 rounded-full overflow-hidden">
<div class="bg-secondary h-full rounded-full" style="width: 94%;"></div>
</div>
</div>
<div class="flex flex-col gap-1">
<div class="flex justify-between font-label-sm text-label-sm">
<span class="text-on-surface font-medium">Capacitación y Comportamiento</span>
<span class="text-secondary-container font-bold">75% Ejecutado</span>
</div>
<div class="w-full bg-surface-container h-2 rounded-full overflow-hidden">
<div class="bg-secondary-container h-full rounded-full" style="width: 75%;"></div>
</div>
</div>
</div>
</div>
<div class="pt-sm flex items-center justify-between">
<span class="font-label-sm text-label-sm text-on-surface-variant">Reinspecciones Programadas: <strong>3 esta semana</strong></span>
<span class="material-symbols-outlined text-primary text-[20px]">verified</span>
</div>
</div>
</section>
<!-- DRAWER O PANEL LATERAL DE GESTIÓN RÁPIDA (RES. 1401 ART. 7) -->
<aside class="fixed right-0 top-0 bottom-0 w-full max-w-xl bg-surface-container-lowest shadow-2xl z-50 transform translate-x-full transition-transform duration-300 ease-in-out flex flex-col justify-between overflow-y-auto" id="drawer-investigacion">
<!-- Header del Drawer -->
<div class="p-gutter bg-surface-container-low flex flex-col gap-xs sticky top-0 z-10 shadow-sm">
<div class="flex items-center justify-between">
<div class="flex items-center gap-xs">
<span class="bg-primary text-on-primary font-label-sm text-label-sm px-xs py-0.5 rounded font-semibold">Res. 1401 Art. 7</span>
<span class="font-headline-md text-headline-md text-on-surface font-bold">Investigación AT-2024-017</span>
</div>
<button class="w-8 h-8 rounded-full bg-surface-container-highest flex items-center justify-center text-on-surface hover:bg-surface-container transition-colors" onclick="document.getElementById('drawer-investigacion').classList.add('translate-x-full')" type="button">
<span class="material-symbols-outlined text-[20px]">close</span>
</button>
</div>
<p class="font-body-sm text-body-sm text-on-surface-variant">
        Trabajador: <strong>Darío Arismendi Ruiz</strong> • Cargo: Tractorista • Finca El Mirador
      </p>
<div class="flex items-center gap-xs text-error font-label-sm text-label-sm font-semibold">
<span class="material-symbols-outlined text-[16px]">timer</span>
<span>Tiempo límite legal restante: 48 horas (Vence 26/Octubre/2024)</span>
</div>
</div>
<!-- Contenido del Drawer -->
<div class="p-gutter flex flex-col gap-base flex-1">
<!-- 1. Checklist de Conformación Obligatoria del Equipo Investigador -->
<div class="flex flex-col gap-xs">
<div class="flex items-center justify-between">
<span class="font-label-md text-label-md text-primary font-semibold uppercase tracking-wider">Equipo Investigador Legal (Art. 7)</span>
<span class="font-label-sm text-label-sm text-on-surface-variant">4 Integrantes requeridos</span>
</div>
<p class="font-body-sm text-body-sm text-on-surface-variant">Verificación de quórum y firmas obligatorias para validez ante ARL Sura y MinTrabajo:</p>
<div class="flex flex-col gap-xs mt-xs">
<!-- Jefe Inmediato -->
<div class="flex items-center justify-between p-sm rounded-lg bg-surface-container-low">
<div class="flex items-center gap-sm">
<span class="material-symbols-outlined text-[22px] text-primary">check_box</span>
<div class="flex flex-col">
<span class="font-label-md text-label-md text-on-surface font-medium">Jefe Inmediato o Supervisor del Área</span>
<span class="font-label-sm text-label-sm text-on-surface-variant">Ing. Hernán Toro (Superintendente Agronómico)</span>
</div>
</div>
<span class="bg-surface-container-high text-primary font-label-sm text-label-sm px-xs py-0.5 rounded font-semibold">Firmado Digital</span>
</div>
<!-- Representante COPASST -->
<div class="flex items-center justify-between p-sm rounded-lg bg-surface-container-low">
<div class="flex items-center gap-sm">
<span class="material-symbols-outlined text-[22px] text-primary">check_box</span>
<div class="flex flex-col">
<span class="font-label-md text-label-md text-on-surface font-medium">Representante del COPASST</span>
<span class="font-label-sm text-label-sm text-on-surface-variant">Lucía Herrera (Delegada de los Trabajadores)</span>
</div>
</div>
<span class="bg-surface-container-high text-primary font-label-sm text-label-sm px-xs py-0.5 rounded font-semibold">Firmado Digital</span>
</div>
<!-- Responsable SST -->
<div class="flex items-center justify-between p-sm rounded-lg bg-surface-container-low">
<div class="flex items-center gap-sm">
<span class="material-symbols-outlined text-[22px] text-primary">check_box</span>
<div class="flex flex-col">
<span class="font-label-md text-label-md text-on-surface font-medium">Responsable del SG-SST</span>
<span class="font-label-sm text-label-sm text-on-surface-variant">Ing. Andrés Valencia (Licencia SST Vigente)</span>
</div>
</div>
<span class="bg-surface-container-high text-primary font-label-sm text-label-sm px-xs py-0.5 rounded font-semibold">Firmado Digital</span>
</div>
<!-- Especialista con Licencia SST (Obligatorio en eventos graves) -->
<div class="flex items-center justify-between p-sm rounded-lg bg-error-container/30">
<div class="flex items-center gap-sm">
<span class="material-symbols-outlined text-[22px] text-error">check_box_outline_blank</span>
<div class="flex flex-col">
<span class="font-label-md text-label-md text-error font-medium">Profesional Licenciado en SST (Evento Grave)</span>
<span class="font-label-sm text-label-sm text-on-surface-variant">Dra. Mariana Gómez (Lic. 10492-2021)</span>
</div>
</div>
<button class="bg-error text-on-error font-label-sm text-label-sm px-sm py-1 rounded font-semibold hover:bg-on-error-container transition-colors shadow-sm" type="button">
              Solicitar Firma
            </button>
</div>
</div>
</div>
<!-- 2. Cronograma de Entrevistas a Testigos -->
<div class="flex flex-col gap-xs pt-xs">
<div class="flex items-center justify-between">
<span class="font-label-md text-label-md text-primary font-semibold uppercase tracking-wider">Cronograma de Versiones &amp; Testigos</span>
<span class="font-label-sm text-label-sm text-on-surface-variant">2/2 Completadas</span>
</div>
<div class="flex flex-col gap-xs">
<div class="flex items-center justify-between p-xs px-sm rounded bg-surface-container-lowest shadow-sm">
<div class="flex items-center gap-xs">
<span class="material-symbols-outlined text-[18px] text-primary">record_voice_over</span>
<span class="font-label-sm text-label-sm font-medium">Testigo 1: Fabio Morales (Ayudante Agrícola)</span>
</div>
<span class="font-label-sm text-label-sm text-primary font-semibold">Acta #01 Adjunta</span>
</div>
<div class="flex items-center justify-between p-xs px-sm rounded bg-surface-container-lowest shadow-sm">
<div class="flex items-center gap-xs">
<span class="material-symbols-outlined text-[18px] text-primary">record_voice_over</span>
<span class="font-label-sm text-label-sm font-medium">Testigo 2: Santiago Duque (Mecánico de Finca)</span>
</div>
<span class="font-label-sm text-label-sm text-primary font-semibold">Acta #02 Adjunta</span>
</div>
</div>
</div>
<!-- 3. Plan de Medidas de Intervención -->
<div class="flex flex-col gap-xs pt-xs">
<span class="font-label-md text-label-md text-primary font-semibold uppercase tracking-wider">Medidas Correctivas Propuestas</span>
<div class="p-sm rounded-lg bg-surface-container-low flex flex-col gap-xs">
<div class="flex items-start gap-xs">
<span class="font-label-sm text-label-sm bg-primary text-on-primary px-1.5 py-0.5 rounded font-bold mt-0.5">Técnica</span>
<span class="font-body-sm text-body-sm text-on-surface">Instalación de guarda con enclave electromecánico en tomafuerza. Plazo: 48h.</span>
</div>
<div class="flex items-start gap-xs">
<span class="font-label-sm text-label-sm bg-secondary text-on-secondary px-1.5 py-0.5 rounded font-bold mt-0.5">Admin</span>
<span class="font-body-sm text-body-sm text-on-surface">Actualización del Estándar Seguro de Operación y Mantenimiento de Maquinaria.</span>
</div>
<div class="flex items-start gap-xs">
<span class="font-label-sm text-label-sm bg-tertiary text-on-tertiary px-1.5 py-0.5 rounded font-bold mt-0.5">Formativa</span>
<span class="font-body-sm text-body-sm text-on-surface">Reentrenamiento a 14 operadores de tractor en la Finca El Mirador.</span>
</div>
</div>
</div>
</div>
<!-- Footer Acciones de Radicación -->
<div class="p-gutter bg-surface-container-low sticky bottom-0 z-10 flex flex-col gap-xs shadow-md">
<div class="flex items-center justify-between text-[12px] text-on-surface-variant mb-xs">
<span>Canal Oficial de Radicación:</span>
<span class="font-semibold text-primary">Portal ARL Sura / FURAT Web</span>
</div>
<button class="w-full py-sm bg-primary text-on-primary rounded-lg font-label-md text-label-md font-semibold flex items-center justify-center gap-xs hover:bg-primary-container transition-colors shadow-md" type="button">
<span class="material-symbols-outlined text-[20px]">send_time_extension</span>
<span>Radicar Informe Oficial ante ARL Sura</span>
</button>
<button class="w-full py-xs bg-transparent text-on-surface-variant rounded-lg font-label-md text-label-md text-center hover:text-on-surface transition-colors" onclick="document.getElementById('drawer-investigacion').classList.add('translate-x-full')" type="button">
        Guardar Avance Temporal
      </button>
</div>
</aside>
</div></main></div></body></html>
