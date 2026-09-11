17. ACCIONES CORRECTIVAS
    Este módulo debe estar relacionado con:
    • Accidentes
    • Incidentes
    • Inspecciones
    • Auditorías
    • Hallazgos
    • COPASST
    • CCL
    • PESV
    • SG-SST
    Campos:
    • ID acción
    • Fuente
    • Hallazgo
    • Acción
    • Responsable
    • Fecha compromiso
    • Fecha cierre
    • Estado
    • Evidencia
    • Verificación de eficacia
    • Observaciones
    Estados:
    🔴 Vencida
    🟠 Próxima a vencer
    🟡 En ejecución
    🟢 Cerrada
    Dashboard:
    • Acciones abiertas
    • Vencidas
    • Próximas a vencer
    • Cerradas
    • % cumplimiento

---

18. CAPACITACIONES
    Crear base maestra de capacitaciones.
    Campos:
    • Trabajador
    • Tema
    • Fecha
    • Horas
    • Instructor
    • Modalidad
    • Evidencia
    • Certificado
    • Fecha próxima capacitación
    • Estado
    Temas:
    • Inducción
    • Reinducción
    • Alturas
    • Tractor
    • PESV
    • Emergencias
    • Primeros auxilios
    • EPP
    • Químicos
    • Biomecánico
    • Psicosocial
    • Salud mental
    • SST
    • Brigada
    • COPASST
    • CCL
    Mostrar:
    • Capacitaciones realizadas
    • Pendientes
    • Próximas
    • Vencidas
    • Cumplimiento del plan anual

---

19. DOCUMENTOS SG-SST
    Crear control documental.
    Campos:
    • Documento
    • Tipo
    • Empresa
    • Responsable
    • Fecha elaboración
    • Fecha última revisión
    • Próxima revisión
    • Versión
    • Estado
    • Evidencia/documento
    • Observaciones
    Documentos:
    • Política SST
    • Objetivos
    • Plan anual
    • Matriz de peligros
    • Profesiograma
    • Plan de emergencias
    • PESV
    • Procedimientos
    • Protocolos
    • Programas
    • Cronogramas
    • Reglamento de higiene
    • COPASST
    • CCL
    • Brigada
    IMPORTANTE:
    No asumir que todos los documentos tienen vencimiento.
    Utilizar:
    Fecha de elaboración → revisión → versión → responsable → estado.

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
  }</script></head><body class="bg-background font-body-md text-body-md text-on-surface antialiased"><aside class="fixed left-0 top-0 h-full w-72 bg-surface-container-lowest shadow-[0_1px_8px_rgba(0,0,0,0.04)] z-50 flex flex-col justify-between overflow-y-auto"><div class="p-gutter pb-0"><div class="flex items-center gap-base mb-xs"><div class="w-8 h-8 rounded bg-primary-container flex items-center justify-center text-on-primary font-headline-md text-headline-md">M</div><div class="flex flex-col"><span class="font-label-md text-label-md text-primary leading-tight font-semibold">Grupo Manzanares S.A.S.</span><span class="font-label-sm text-label-sm text-on-surface-variant">SG-SST Operativo</span></div></div><div class="flex items-center gap-xs mt-base mb-md"><span class="bg-surface-container-high text-on-surface font-label-sm text-label-sm px-xs py-0.5 rounded">Dec. 1072</span><span class="bg-surface-container-high text-on-surface font-label-sm text-label-sm px-xs py-0.5 rounded">Res. 0312</span></div></div><nav class="flex-1 px-sm pb-gutter flex flex-col gap-base" data-active-classes="bg-primary-container text-on-primary font-medium rounded-lg"><div class="flex flex-col gap-xs"><span class="px-xs font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">Gestión Operativa</span><a class="flex items-center gap-base px-sm py-xs rounded-lg text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-colors font-label-md text-label-md" data-path="dashboard" href="#"><span class="material-symbols-outlined text-[20px]">dashboard</span>Inicio / Dashboard</a><a class="flex items-center gap-base px-sm py-xs rounded-lg text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-colors font-label-md text-label-md" data-path="trabajadores" href="#"><span class="material-symbols-outlined text-[20px]">badge</span>Trabajadores</a><a class="flex items-center gap-base px-sm py-xs rounded-lg text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-colors font-label-md text-label-md" data-path="examenes-medicos" href="#"><span class="material-symbols-outlined text-[20px]">medical_services</span>Exámenes Médicos (EMOS)</a><a class="flex items-center gap-base px-sm py-xs rounded-lg text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-colors font-label-md text-label-md" data-path="casos-de-salud" href="#"><span class="material-symbols-outlined text-[20px]">health_and_safety</span>Casos de Salud</a><a class="flex items-center gap-base px-sm py-xs rounded-lg text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-colors font-label-md text-label-md" data-path="incapacidades-y-reintegros" href="#"><span class="material-symbols-outlined text-[20px]">assignment_return</span>Incapacidades y Reintegros</a></div><div class="flex flex-col gap-xs"><span class="px-xs font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">Riesgos Críticos &amp; Viales</span><a class="flex items-center gap-base px-sm py-xs rounded-lg text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-colors font-label-md text-label-md" data-path="trabajo-en-alturas" href="#"><span class="material-symbols-outlined text-[20px]">height</span>Trabajo en Alturas</a><a class="flex items-center gap-base px-sm py-xs rounded-lg text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-colors font-label-md text-label-md" data-path="tractoristas-operadores" href="#"><span class="material-symbols-outlined text-[20px]">agriculture</span>Tractoristas / Operadores</a><a class="flex items-center gap-base px-sm py-xs rounded-lg text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-colors font-label-md text-label-md" data-path="pesv-seguridad-vial" href="#"><span class="material-symbols-outlined text-[20px]">traffic</span>PESV (Seguridad Vial)</a><a class="flex items-center gap-base px-sm py-xs rounded-lg text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-colors font-label-md text-label-md" data-path="epp" href="#"><span class="material-symbols-outlined text-[20px]">security</span>EPP</a></div><div class="flex flex-col gap-xs"><span class="px-xs font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">Inspección &amp; Eventos</span><a class="flex items-center gap-base px-sm py-xs rounded-lg text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-colors font-label-md text-label-md" data-path="inspecciones" href="#"><span class="material-symbols-outlined text-[20px]">fact_check</span>Inspecciones</a><a class="flex items-center justify-between px-sm py-xs rounded-lg text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-colors font-label-md text-label-md" data-path="accidentes-e-incidentes" href="#"><div class="flex items-center gap-base"><span class="material-symbols-outlined text-[20px]">warning</span>Accidentes e Incidentes</div><span class="bg-error text-on-error font-label-sm text-label-sm px-xs py-0.5 rounded-full">2</span></a><a aria-current="page" class="flex items-center gap-base px-sm py-xs transition-colors bg-primary-container text-on-primary font-medium rounded-lg" data-path="investigaciones" href="#"><span class="material-symbols-outlined text-[20px]">manage_search</span>Investigaciones</a><a class="flex items-center gap-base px-sm py-xs rounded-lg text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-colors font-label-md text-label-md" data-path="acciones-correctivas" href="#"><span class="material-symbols-outlined text-[20px]">check_circle</span>Acciones Correctivas</a></div><div class="flex flex-col gap-xs"><span class="px-xs font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">Comités &amp; Cultura</span><a class="flex items-center gap-base px-sm py-xs rounded-lg text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-colors font-label-md text-label-md" data-path="capacitaciones" href="#"><span class="material-symbols-outlined text-[20px]">school</span>Capacitaciones</a><a class="flex items-center gap-base px-sm py-xs rounded-lg text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-colors font-label-md text-label-md" data-path="documentos-sg-sst" href="#"><span class="material-symbols-outlined text-[20px]">folder_open</span>Documentos SG-SST</a><a class="flex items-center gap-base px-sm py-xs rounded-lg text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-colors font-label-md text-label-md" data-path="copasst" href="#"><span class="material-symbols-outlined text-[20px]">groups</span>COPASST</a><a class="flex items-center gap-base px-sm py-xs rounded-lg text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-colors font-label-md text-label-md" data-path="ccl" href="#"><span class="material-symbols-outlined text-[20px]">handshake</span>CCL</a><a class="flex items-center gap-base px-sm py-xs rounded-lg text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-colors font-label-md text-label-md" data-path="emergencias" href="#"><span class="material-symbols-outlined text-[20px]">emergency</span>Emergencias</a><a class="flex items-center gap-base px-sm py-xs rounded-lg text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-colors font-label-md text-label-md" data-path="quimicos" href="#"><span class="material-symbols-outlined text-[20px]">science</span>Químicos</a></div></nav></aside><div class="pl-72"><header class="fixed top-0 left-72 right-0 h-16 bg-surface-container-lowest/90 backdrop-blur-xl shadow-[0_1px_8px_rgba(0,0,0,0.04)] z-40 flex items-center justify-between px-gutter"><div class="flex items-center gap-md flex-1 max-w-xl"><div class="relative w-full"><span class="material-symbols-outlined absolute left-sm top-1/2 -translate-y-1/2 text-on-surface-variant text-[20px]">search</span><input class="w-full bg-surface-container-low text-on-surface placeholder:text-on-surface-variant pl-10 pr-sm py-xs rounded-lg font-body-sm text-body-sm focus:outline-none focus:ring-2 focus:ring-secondary-container transition-all" placeholder="Buscar trabajadores, incidentes, normativas..." type="search"/></div><div class="flex items-center bg-surface-container-low px-sm py-xs rounded-lg gap-xs shrink-0"><span class="material-symbols-outlined text-[18px] text-on-surface-variant">gavel</span><span class="font-label-sm text-label-sm text-on-surface">Estándares 2024</span><span class="material-symbols-outlined text-[16px] text-on-surface-variant">expand_more</span></div></div><div class="flex items-center gap-base"><button class="flex items-center gap-xs bg-primary-container text-on-primary px-sm py-xs rounded-lg font-label-md text-label-md hover:bg-primary transition-colors" type="button"><span class="material-symbols-outlined text-[18px]">add_alert</span><span>Reporte Rápido / Notificación</span></button><button class="relative w-10 h-10 flex items-center justify-center rounded-lg hover:bg-surface-container-high transition-colors text-on-surface-variant" type="button"><span class="material-symbols-outlined text-[22px]">notifications</span><span class="absolute top-2 right-2 w-2 h-2 rounded-full bg-error"></span></button><div class="flex items-center gap-sm pl-xs"><div class="text-right hidden xl:block"><div class="font-label-md text-label-md text-on-surface font-medium">Ing. Andrés Valencia</div><div class="font-label-sm text-label-sm text-on-surface-variant">Coordinador SG-SST</div></div><div class="w-8 h-8 rounded-full bg-primary flex items-center justify-center"><span class="material-symbols-outlined text-on-primary text-[18px]">person</span></div></div></div></header><main class="w-full px-gutter pt-16 bg-surface min-h-screen"><div class="flex flex-col w-full pb-xl">
<!-- SCRIPT: Mark sidebar active link accurately -->
<script>
    (function() {
      const activePath = 'acciones-correctivas';
      const asideLinks = document.querySelectorAll('aside a[data-path]');
      asideLinks.forEach(link => {
        if (link.getAttribute('data-path') === activePath) {
          link.className = 'flex items-center gap-base px-sm py-xs rounded-lg bg-primary-container text-on-primary font-medium transition-colors font-label-md text-label-md shadow-sm';
          const icon = link.querySelector('.material-symbols-outlined');
          if (icon) icon.style.fontVariationSettings = "'FILL' 1";
        }
      });
    })();
  </script>
<!-- TOP CONTEXT BANNER / REGULATORY HEADER -->
<header class="w-full flex flex-col md:flex-row md:items-center justify-between gap-md pt-base pb-md">
<div class="flex flex-col gap-xs max-w-4xl">
<div class="flex items-center gap-xs text-on-surface-variant font-label-sm text-label-sm">
<span class="bg-surface-container-high text-primary px-xs py-0.5 rounded font-medium">Capítulo 17</span>
<span>•</span>
<span>Ciclo de Mejora Continua PHVA</span>
<span>•</span>
<span class="font-mono text-on-surface-variant/80">ISO 45001: 10.2</span>
</div>
<h1 class="font-headline-lg text-headline-lg text-primary tracking-tight">
        17. Gestión de Acciones Correctivas, Preventivas y de Mejora (CAPA)
      </h1>
<p class="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
        Cierre sistemático de hallazgos y planes de acción derivados de accidentes, incidentes, inspecciones, auditorías, COPASST, CCL, PESV y revisión por la dirección según 
        <strong class="font-semibold text-on-surface">Dec. 1072/2015 Art. 2.2.4.6.33</strong> y <strong class="font-semibold text-on-surface">Res. 0312/2019</strong>.
      </p>
</div>
<!-- Top Action Toolbar -->
<div class="flex items-center gap-xs shrink-0 flex-wrap">
<button class="flex items-center gap-xs px-sm py-xs bg-surface-container-lowest text-primary rounded-lg font-label-md text-label-md shadow-sm hover:bg-surface-container-low transition-all" type="button">
<span class="material-symbols-outlined text-[18px]">table_view</span>
<span>Exportar Matriz (.XLSX)</span>
</button>
<button class="flex items-center gap-xs px-sm py-xs bg-secondary-fixed text-on-secondary-fixed rounded-lg font-label-md text-label-md shadow-sm hover:bg-secondary-fixed-dim transition-all" type="button">
<span class="material-symbols-outlined text-[18px]">verified_user</span>
<span>Verificar Eficacias (6)</span>
</button>
<button class="flex items-center gap-xs px-sm py-xs bg-primary text-on-primary rounded-lg font-label-md text-label-md shadow-sm hover:bg-primary-container transition-all" type="button">
<span class="material-symbols-outlined text-[18px]">add_circle</span>
<span>+ Nueva Acción Correctiva</span>
</button>
</div>
</header>
<!-- DASHBOARD DE INDICADORES (KPIs PHVA) -->
<section aria-label="Métricas clave de acciones correctivas" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-sm my-base">
<!-- KPI 1: Acciones Abiertas -->
<div class="bg-surface-container-lowest rounded-xl p-md shadow-sm flex flex-col justify-between relative overflow-hidden">
<div class="flex items-center justify-between">
<span class="font-label-sm text-label-sm uppercase tracking-wider text-on-surface-variant font-semibold">Total Abiertas</span>
<span class="w-8 h-8 rounded-lg bg-surface-container-high flex items-center justify-center text-primary">
<span class="material-symbols-outlined text-[18px]">pending_actions</span>
</span>
</div>
<div class="mt-sm">
<div class="flex items-baseline gap-xs">
<span class="font-display-lg text-display-lg text-primary leading-none">24</span>
<span class="font-label-sm text-label-sm text-on-surface-variant">en gestión</span>
</div>
<p class="font-body-sm text-body-sm text-on-surface-variant/80 mt-xs">Planes activos en ciclo</p>
</div>
<div class="mt-xs pt-xs flex items-center gap-xs text-[11px] font-label-sm text-on-surface-variant">
<span class="inline-block w-2 h-2 rounded-full bg-secondary"></span>
<span>Ciclo de control operativo</span>
</div>
</div>
<!-- KPI 2: Vencidas (Rojo) -->
<div class="bg-surface-container-lowest rounded-xl p-md shadow-sm flex flex-col justify-between relative overflow-hidden">
<div class="flex items-center justify-between">
<span class="font-label-sm text-label-sm uppercase tracking-wider text-error font-semibold">Vencidas</span>
<span class="w-8 h-8 rounded-lg bg-error-container flex items-center justify-center text-on-error-container">
<span class="material-symbols-outlined text-[18px]">error</span>
</span>
</div>
<div class="mt-sm">
<div class="flex items-baseline gap-xs">
<span class="font-display-lg text-display-lg text-error leading-none">03</span>
<span class="font-label-sm text-label-sm text-error font-medium">críticas</span>
</div>
<p class="font-body-sm text-body-sm text-error/90 mt-xs">Compromiso superado</p>
</div>
<div class="mt-xs pt-xs flex items-center gap-xs text-[11px] font-label-sm text-error">
<span class="material-symbols-outlined text-[14px]">flag</span>
<span>Exige escalamiento a Gerencia</span>
</div>
</div>
<!-- KPI 3: Próximas a Vencer (Ámbar / Alerta) -->
<div class="bg-surface-container-lowest rounded-xl p-md shadow-sm flex flex-col justify-between relative overflow-hidden">
<div class="flex items-center justify-between">
<span class="font-label-sm text-label-sm uppercase tracking-wider text-amber-800 font-semibold">Próx. a Vencer</span>
<span class="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center text-amber-900">
<span class="material-symbols-outlined text-[18px]">schedule</span>
</span>
</div>
<div class="mt-sm">
<div class="flex items-baseline gap-xs">
<span class="font-display-lg text-display-lg text-amber-900 leading-none">05</span>
<span class="font-label-sm text-label-sm text-amber-800 font-medium">alertas</span>
</div>
<p class="font-body-sm text-body-sm text-on-surface-variant/80 mt-xs">&lt; 7 días para límite</p>
</div>
<div class="mt-xs pt-xs flex items-center gap-xs text-[11px] font-label-sm text-amber-800">
<span class="material-symbols-outlined text-[14px]">notification_important</span>
<span>Recordatorio automático ARL</span>
</div>
</div>
<!-- KPI 4: En Ejecución Normal -->
<div class="bg-surface-container-lowest rounded-xl p-md shadow-sm flex flex-col justify-between relative overflow-hidden">
<div class="flex items-center justify-between">
<span class="font-label-sm text-label-sm uppercase tracking-wider text-on-surface-variant font-semibold">En Ejecución</span>
<span class="w-8 h-8 rounded-lg bg-surface-container-high flex items-center justify-center text-secondary">
<span class="material-symbols-outlined text-[18px]">hourglass_top</span>
</span>
</div>
<div class="mt-sm">
<div class="flex items-baseline gap-xs">
<span class="font-display-lg text-display-lg text-primary leading-none">16</span>
<span class="font-label-sm text-label-sm text-on-surface-variant">normales</span>
</div>
<p class="font-body-sm text-body-sm text-on-surface-variant/80 mt-xs">Dentro de cronograma</p>
</div>
<div class="mt-xs pt-xs flex items-center gap-xs text-[11px] font-label-sm text-on-surface-variant">
<span class="material-symbols-outlined text-[14px]">assignment_turned_in</span>
<span>Con responsable y recurso</span>
</div>
</div>
<!-- KPI 5: Cerradas y Eficaces -->
<div class="bg-surface-container-lowest rounded-xl p-md shadow-sm flex flex-col justify-between relative overflow-hidden">
<div class="flex items-center justify-between">
<span class="font-label-sm text-label-sm uppercase tracking-wider text-emerald-800 font-semibold">Cerradas</span>
<span class="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-800">
<span class="material-symbols-outlined text-[18px]">check_circle</span>
</span>
</div>
<div class="mt-sm">
<div class="flex items-baseline gap-xs">
<span class="font-display-lg text-display-lg text-emerald-900 leading-none">82</span>
<span class="font-label-sm text-label-sm text-emerald-800 font-medium">concluidas</span>
</div>
<p class="font-body-sm text-body-sm text-on-surface-variant/80 mt-xs">100% validadas COPASST</p>
</div>
<div class="mt-xs pt-xs flex items-center gap-xs text-[11px] font-label-sm text-emerald-800">
<span class="material-symbols-outlined text-[14px]">verified</span>
<span>Cierre técnico auditado</span>
</div>
</div>
<!-- KPI 6: % Cumplimiento Global (Radial / Gauge SVG) -->
<div class="bg-surface-container-lowest rounded-xl p-md shadow-sm flex flex-col justify-between relative overflow-hidden">
<div class="flex items-center justify-between">
<span class="font-label-sm text-label-sm uppercase tracking-wider text-on-surface-variant font-semibold">Cumplimiento</span>
<span class="font-label-sm text-label-sm text-primary font-bold">Meta 90%</span>
</div>
<div class="flex items-center justify-between mt-xs">
<div>
<span class="font-display-lg text-display-lg text-primary leading-none">88.5<span class="text-headline-md font-normal text-on-surface-variant">%</span></span>
<p class="font-body-sm text-body-sm text-on-surface-variant mt-xs">Efectividad Global</p>
</div>
<!-- Compact SVG Radial Ring Chart -->
<div class="relative w-14 h-14 shrink-0 flex items-center justify-center">
<svg aria-hidden="true" class="w-14 h-14 -rotate-90" viewbox="0 0 48 48">
<circle cx="24" cy="24" fill="none" r="18" stroke="#dce9ff" stroke-width="4.5"></circle>
<!-- 88.5% of 113.1 = ~100 offset -->
<circle cx="24" cy="24" fill="none" r="18" stroke="#4648d4" stroke-dasharray="113.1" stroke-dashoffset="13" stroke-linecap="round" stroke-width="4.5"></circle>
</svg>
<span class="material-symbols-outlined absolute text-[16px] text-primary">trending_up</span>
</div>
</div>
<div class="w-full bg-surface-container-high rounded-full h-1.5 mt-xs overflow-hidden">
<div class="bg-secondary h-1.5 rounded-full" style="width: 88.5%"></div>
</div>
</div>
</section>
<!-- CONTENEDOR PRINCIPAL ASIMÉTRICO (GRID: TABLA DE DATOS + PANEL LATERAL PHVA) -->
<div class="grid grid-cols-1 xl:grid-cols-12 gap-md mt-sm">
<!-- COLUMNA IZQUIERDA (8 DE 12): FILTROS + TABLA MAESTRA CAPA -->
<div class="xl:col-span-9 flex flex-col gap-sm">
<!-- BARRA DE BÚSQUEDA Y FILTROS MULTIDIMENSIONALES -->
<div class="bg-surface-container-lowest rounded-xl p-md shadow-sm flex flex-col gap-sm">
<div class="flex flex-col lg:flex-row items-stretch lg:items-center gap-sm">
<!-- Input Búsqueda libre -->
<div class="relative flex-1">
<span class="material-symbols-outlined absolute left-sm top-1/2 -translate-y-1/2 text-on-surface-variant text-[20px]">search</span>
<input class="w-full bg-surface-container-low text-on-surface placeholder:text-on-surface-variant pl-10 pr-sm py-xs rounded-lg font-body-sm text-body-sm focus:outline-none focus:bg-surface-container-lowest focus:ring-2 focus:ring-secondary-container transition-all" placeholder="Buscar por ID (AC-2024-xxx), no conformidad, responsable o causa raíz..." type="text"/>
</div>
<!-- Filtros Rápidos Semafóricos -->
<div class="flex items-center gap-xs shrink-0 flex-wrap">
<span class="font-label-sm text-label-sm text-on-surface-variant mr-xs">Semáforo:</span>
<button class="px-xs py-1 rounded bg-error-container text-on-error-container font-label-sm text-label-sm font-semibold flex items-center gap-xs" type="button">
<span class="w-2 h-2 rounded-full bg-error"></span> Vencidas (3)
            </button>
<button class="px-xs py-1 rounded bg-amber-100 text-amber-900 font-label-sm text-label-sm font-semibold flex items-center gap-xs" type="button">
<span class="w-2 h-2 rounded-full bg-amber-600"></span> Próximas (5)
            </button>
<button class="px-xs py-1 rounded bg-surface-container-high text-on-surface font-label-sm text-label-sm flex items-center gap-xs" type="button">
<span class="w-2 h-2 rounded-full bg-secondary"></span> Ejecución (16)
            </button>
<button class="px-xs py-1 rounded bg-surface-container-high text-on-surface font-label-sm text-label-sm flex items-center gap-xs" type="button">
<span class="w-2 h-2 rounded-full bg-emerald-600"></span> Cerradas
            </button>
</div>
</div>
<!-- Fila de selectores específicos -->
<div class="grid grid-cols-2 md:grid-cols-4 gap-xs pt-xs border-t-0">
<!-- Filtro Fuente -->
<div class="flex flex-col gap-xs">
<label class="font-label-sm text-label-sm text-on-surface-variant font-medium">Origen / Fuente</label>
<select class="w-full bg-surface-container-low text-on-surface rounded-lg px-xs py-1.5 font-body-sm text-body-sm focus:outline-none focus:ring-1 focus:ring-secondary">
<option>Todas las Fuentes (106)</option>
<option>Accidentes de Trabajo (AT)</option>
<option>Incidentes / Cuasi-accidentes</option>
<option>Inspecciones de Seguridad</option>
<option>Auditorías Internas / ARL Sura</option>
<option>Seguridad Vial (PESV)</option>
<option>COPASST / Reportes de Paritarios</option>
<option>Comité de Convivencia Laboral (CCL)</option>
<option>Revisión por la Dirección</option>
</select>
</div>
<!-- Filtro Responsable -->
<div class="flex flex-col gap-xs">
<label class="font-label-sm text-label-sm text-on-surface-variant font-medium">Líder Asignado</label>
<select class="w-full bg-surface-container-low text-on-surface rounded-lg px-xs py-1.5 font-body-sm text-body-sm focus:outline-none focus:ring-1 focus:ring-secondary">
<option>Todos los Responsables</option>
<option>Ing. Andrés Valencia (Coord. SG-SST)</option>
<option>Sup. Ramón Vélez (Jefe Operaciones)</option>
<option>Ing. Marcos Restrepo (Mantenimiento)</option>
<option>Dra. Elena Ruiz (Médica Laboral)</option>
<option>Carlos Duque (Líder PESV / Flota)</option>
</select>
</div>
<!-- Filtro Centro de Trabajo / Finca -->
<div class="flex flex-col gap-xs">
<label class="font-label-sm text-label-sm text-on-surface-variant font-medium">Sede / Finca</label>
<select class="w-full bg-surface-container-low text-on-surface rounded-lg px-xs py-1.5 font-body-sm text-body-sm focus:outline-none focus:ring-1 focus:ring-secondary">
<option>Todas las Sedes (Agro &amp; Logística)</option>
<option>Finca La Manzanares - Lote 1 &amp; 2</option>
<option>Finca Santa Helena - Cosecha</option>
<option>Planta Empacadora &amp; Beneficiadero</option>
<option>Taller Central de Maquinaria</option>
<option>Oficina Administrativa Central</option>
</select>
</div>
<!-- Filtro Eficacia -->
<div class="flex flex-col gap-xs">
<label class="font-label-sm text-label-sm text-on-surface-variant font-medium">Control de Eficacia</label>
<select class="w-full bg-surface-container-low text-on-surface rounded-lg px-xs py-1.5 font-body-sm text-body-sm focus:outline-none focus:ring-1 focus:ring-secondary">
<option>Todos los Estados</option>
<option>Pendiente de Verificación (&gt;30 días)</option>
<option>En período de seguimiento</option>
<option>Eficaz comprobada (Cerrada)</option>
<option>No eficaz (Requiere reapertura)</option>
</select>
</div>
</div>
</div>
<!-- MATRIZ MAESTRA DE ACCIONES (DATA TABLE DENSIDAD INDUSTRIAL) -->
<div class="bg-surface-container-lowest rounded-xl shadow-sm overflow-hidden">
<!-- Table Header Meta -->
<div class="px-md py-sm flex items-center justify-between bg-surface-container-low/60">
<div class="flex items-center gap-xs">
<span class="material-symbols-outlined text-[20px] text-primary">analytics</span>
<span class="font-label-md text-label-md text-primary font-semibold">Registro Maestro de Hallazgos y Cierres (CAPA 2024)</span>
<span class="bg-surface-container-high text-on-surface font-mono text-[11px] px-xs py-0.5 rounded">Total 106 registros</span>
</div>
<div class="flex items-center gap-xs font-label-sm text-label-sm text-on-surface-variant">
<span>Visualizando 5 casos críticos prioritarios</span>
<button class="text-secondary font-medium hover:underline flex items-center gap-0.5" type="button">
<span>Configurar columnas</span>
<span class="material-symbols-outlined text-[16px]">view_column</span>
</button>
</div>
</div>
<!-- Contenedor scroll horizontal responsive -->
<div class="overflow-x-auto w-full">
<table class="w-full text-left font-body-sm text-body-sm">
<thead>
<tr class="bg-surface-container-high/70 text-on-surface-variant font-label-sm text-label-sm uppercase tracking-wider">
<th class="py-sm px-sm font-semibold">ID / Tipo</th>
<th class="py-sm px-sm font-semibold">Fuente &amp; Hallazgo</th>
<th class="py-sm px-sm font-semibold">Acción Planteada (PHVA)</th>
<th class="py-sm px-sm font-semibold">Responsable &amp; Sede</th>
<th class="py-sm px-sm font-semibold">Plazos</th>
<th class="py-sm px-sm font-semibold">Semáforo</th>
<th class="py-sm px-sm font-semibold">Evidencia</th>
<th class="py-sm px-sm font-semibold">Eficacia</th>
<th class="py-sm px-sm font-semibold text-right">Acción</th>
</tr>
</thead>
<tbody class="divide-y-0">
<!-- ROW 1: VENCIDA CRÍTICA (Accidente de Trabajo) -->
<tr class="hover:bg-error-container/20 transition-colors bg-surface-container-lowest">
<td class="py-sm px-sm align-top">
<div class="flex flex-col">
<span class="font-mono font-semibold text-error text-label-md">AC-2024-041</span>
<span class="text-[11px] font-label-sm text-on-surface-variant">Correctiva</span>
<span class="mt-xs inline-flex items-center px-1 rounded bg-error/10 text-error text-[10px] font-bold">ALTA PRIORIDAD</span>
</div>
</td>
<td class="py-sm px-sm align-top max-w-xs">
<div class="flex flex-col gap-0.5">
<div class="flex items-center gap-xs">
<span class="px-1.5 py-0.5 rounded bg-surface-container-high text-primary font-mono text-[11px] font-semibold">AT-2024-017</span>
<span class="text-[11px] text-on-surface-variant">Inv. Accidente</span>
</div>
<p class="font-body-sm text-body-sm text-on-surface font-medium leading-snug mt-1">
                      Atrapamiento de extremidad superior en desgranadora por guarda rota sin sensor inductivo.
                    </p>
<span class="text-[11px] text-on-surface-variant">Causa raíz: Falla en barrera física y ausencia de LOTO.</span>
</div>
</td>
<td class="py-sm px-sm align-top max-w-xs">
<div class="flex flex-col">
<span class="text-on-surface font-medium leading-snug">
                      Ingeniería: Reemplazo total de guarda de acople mecánico e instalación de microswitch de corte de energía homologado.
                    </span>
<span class="text-[11px] text-on-surface-variant mt-1">Jerarquía: Barrera de Ingeniería</span>
</div>
</td>
<td class="py-sm px-sm align-top">
<div class="flex flex-col">
<span class="font-medium text-on-surface">Ing. Marcos Restrepo</span>
<span class="text-[12px] text-on-surface-variant">Jefe de Mantenimiento</span>
<span class="text-[11px] text-on-surface-variant/70 mt-1 flex items-center gap-0.5">
<span class="material-symbols-outlined text-[14px]">location_on</span> Finca Santa Helena
                    </span>
</div>
</td>
<td class="py-sm px-sm align-top whitespace-nowrap">
<div class="flex flex-col">
<span class="text-on-surface-variant text-[12px]">Límite: <strong class="text-error font-mono">15/Oct/2024</strong></span>
<span class="text-error font-semibold text-[11px] flex items-center gap-0.5 mt-0.5">
<span class="material-symbols-outlined text-[14px]">warning</span> Vencida hace 12 días
                    </span>
</div>
</td>
<td class="py-sm px-sm align-top whitespace-nowrap">
<span class="inline-flex items-center gap-xs px-2 py-1 rounded-full bg-error text-on-error font-label-sm text-label-sm font-semibold shadow-xs">
<span class="w-1.5 h-1.5 rounded-full bg-white animate-ping"></span> Vencida 🔴
                  </span>
</td>
<td class="py-sm px-sm align-top whitespace-nowrap">
<button class="flex items-center gap-xs text-primary hover:text-secondary font-label-sm text-label-sm" title="Ver orden de compra y cotización" type="button">
<span class="material-symbols-outlined text-[18px]">attachment</span>
<span>2 Docs</span>
</button>
</td>
<td class="py-sm px-sm align-top">
<span class="inline-flex items-center px-1.5 py-0.5 rounded bg-surface-container-high text-on-surface-variant text-[11px] font-medium">
                    No Verificable
                  </span>
</td>
<td class="py-sm px-sm align-top text-right whitespace-nowrap">
<div class="flex items-center justify-end gap-1">
<button class="w-8 h-8 rounded-lg bg-surface-container hover:bg-primary hover:text-on-primary text-primary flex items-center justify-center transition-colors" title="Escalar a Gerencia" type="button">
<span class="material-symbols-outlined text-[18px]">campaign</span>
</button>
<button class="w-8 h-8 rounded-lg bg-surface-container hover:bg-secondary hover:text-on-primary text-secondary flex items-center justify-center transition-colors" title="Gestionar Cierre" type="button">
<span class="material-symbols-outlined text-[18px]">edit_square</span>
</button>
</div>
</td>
</tr>
<!-- ROW 2: PRÓXIMA A VENCER (Seguridad Vial PESV) -->
<tr class="hover:bg-amber-50 transition-colors bg-surface-container-low/40">
<td class="py-sm px-sm align-top">
<div class="flex flex-col">
<span class="font-mono font-semibold text-amber-900 text-label-md">AP-2024-019</span>
<span class="text-[11px] font-label-sm text-on-surface-variant">Preventiva</span>
<span class="mt-xs inline-flex items-center px-1 rounded bg-amber-200 text-amber-900 text-[10px] font-bold">PESV CRÍTICO</span>
</div>
</td>
<td class="py-sm px-sm align-top max-w-xs">
<div class="flex flex-col gap-0.5">
<div class="flex items-center gap-xs">
<span class="px-1.5 py-0.5 rounded bg-surface-container-high text-primary font-mono text-[11px] font-semibold">PESV-AUD-03</span>
<span class="text-[11px] text-on-surface-variant">Ruta Transporte</span>
</div>
<p class="font-body-sm text-body-sm text-on-surface font-medium leading-snug mt-1">
                      Desgaste irregular en llantas directrices del bus de cuadrilla #04 e inoperancia del freno de emergencia secundario.
                    </p>
<span class="text-[11px] text-on-surface-variant">Causa raíz: Deficiencia en checklist preoperacional diario.</span>
</div>
</td>
<td class="py-sm px-sm align-top max-w-xs">
<div class="flex flex-col">
<span class="text-on-surface font-medium leading-snug">
                      Sustitución de neumáticos directrices, purga de circuito de frenos y re-inducción obligatoria al conductor.
                    </span>
<span class="text-[11px] text-on-surface-variant mt-1">Jerarquía: Control Administrativo y Mantenimiento</span>
</div>
</td>
<td class="py-sm px-sm align-top">
<div class="flex flex-col">
<span class="font-medium text-on-surface">Carlos Duque</span>
<span class="text-[12px] text-on-surface-variant">Coordinador de Flota PESV</span>
<span class="text-[11px] text-on-surface-variant/70 mt-1 flex items-center gap-0.5">
<span class="material-symbols-outlined text-[14px]">location_on</span> Taller Central
                    </span>
</div>
</td>
<td class="py-sm px-sm align-top whitespace-nowrap">
<div class="flex flex-col">
<span class="text-on-surface-variant text-[12px]">Límite: <strong class="text-amber-900 font-mono">31/Oct/2024</strong></span>
<span class="text-amber-800 font-semibold text-[11px] flex items-center gap-0.5 mt-0.5">
<span class="material-symbols-outlined text-[14px]">timer</span> Restan 4 días
                    </span>
</div>
</td>
<td class="py-sm px-sm align-top whitespace-nowrap">
<span class="inline-flex items-center gap-xs px-2 py-1 rounded-full bg-amber-100 text-amber-900 font-label-sm text-label-sm font-semibold">
<span class="w-2 h-2 rounded-full bg-amber-500"></span> Por Vencer 🟠
                  </span>
</td>
<td class="py-sm px-sm align-top whitespace-nowrap">
<button class="flex items-center gap-xs text-primary hover:text-secondary font-label-sm text-label-sm" title="Ver orden de taller" type="button">
<span class="material-symbols-outlined text-[18px]">verified</span>
<span>1 OT Taller</span>
</button>
</td>
<td class="py-sm px-sm align-top">
<span class="inline-flex items-center px-1.5 py-0.5 rounded bg-surface-container text-on-surface-variant text-[11px] font-medium">
                    Programada
                  </span>
</td>
<td class="py-sm px-sm align-top text-right whitespace-nowrap">
<div class="flex items-center justify-end gap-1">
<button class="w-8 h-8 rounded-lg bg-surface-container hover:bg-secondary hover:text-on-primary text-secondary flex items-center justify-center transition-colors" title="Adjuntar Evidencia Cierre" type="button">
<span class="material-symbols-outlined text-[18px]">upload_file</span>
</button>
<button class="w-8 h-8 rounded-lg bg-surface-container hover:bg-primary hover:text-on-primary text-primary flex items-center justify-center transition-colors" title="Ver detalle" type="button">
<span class="material-symbols-outlined text-[18px]">visibility</span>
</button>
</div>
</td>
</tr>
<!-- ROW 3: EN EJECUCIÓN (Inspección Operativa Finca) -->
<tr class="hover:bg-surface-container-low transition-colors bg-surface-container-lowest">
<td class="py-sm px-sm align-top">
<div class="flex flex-col">
<span class="font-mono font-semibold text-primary text-label-md">AC-2024-038</span>
<span class="text-[11px] font-label-sm text-on-surface-variant">Correctiva</span>
<span class="mt-xs inline-flex items-center px-1 rounded bg-secondary-fixed text-on-secondary-fixed text-[10px] font-bold">OPERACIONAL</span>
</div>
</td>
<td class="py-sm px-sm align-top max-w-xs">
<div class="flex flex-col gap-0.5">
<div class="flex items-center gap-xs">
<span class="px-1.5 py-0.5 rounded bg-surface-container-high text-primary font-mono text-[11px] font-semibold">INSP-AGR-08</span>
<span class="text-[11px] text-on-surface-variant">Inspección Campo</span>
</div>
<p class="font-body-sm text-body-sm text-on-surface font-medium leading-snug mt-1">
                      Almacenamiento inadecuado de agroquímicos categoría toxicológica II sin dique de contención secundario.
                    </p>
<span class="text-[11px] text-on-surface-variant">Causa raíz: Capacidad de bodega desbordada en zafra.</span>
</div>
</td>
<td class="py-sm px-sm align-top max-w-xs">
<div class="flex flex-col">
<span class="text-on-surface font-medium leading-snug">
                      Construcción de bordillo impermeable de retención de derrames de 110% volumen mayor envase y kit químico absorbente.
                    </span>
<span class="text-[11px] text-on-surface-variant mt-1">Jerarquía: Contención y Control de Ingeniería</span>
</div>
</td>
<td class="py-sm px-sm align-top">
<div class="flex flex-col">
<span class="font-medium text-on-surface">Sup. Ramón Vélez</span>
<span class="text-[12px] text-on-surface-variant">Jefe de Campo y Cosecha</span>
<span class="text-[11px] text-on-surface-variant/70 mt-1 flex items-center gap-0.5">
<span class="material-symbols-outlined text-[14px]">location_on</span> Finca La Manzanares
                    </span>
</div>
</td>
<td class="py-sm px-sm align-top whitespace-nowrap">
<div class="flex flex-col">
<span class="text-on-surface-variant text-[12px]">Límite: <strong class="text-on-surface font-mono">15/Nov/2024</strong></span>
<span class="text-secondary font-semibold text-[11px] flex items-center gap-0.5 mt-0.5">
<span class="material-symbols-outlined text-[14px]">event_available</span> 18 días hábiles
                    </span>
</div>
</td>
<td class="py-sm px-sm align-top whitespace-nowrap">
<span class="inline-flex items-center gap-xs px-2 py-1 rounded-full bg-surface-container-high text-on-surface font-label-sm text-label-sm font-semibold">
<span class="w-2 h-2 rounded-full bg-secondary"></span> En Ejecución 🟡
                  </span>
</td>
<td class="py-sm px-sm align-top whitespace-nowrap">
<span class="text-[12px] text-on-surface-variant font-mono">Avance 60%</span>
</td>
<td class="py-sm px-sm align-top">
<span class="inline-flex items-center px-1.5 py-0.5 rounded bg-surface-container text-on-surface-variant text-[11px] font-medium">
                    Pendiente cierre
                  </span>
</td>
<td class="py-sm px-sm align-top text-right whitespace-nowrap">
<div class="flex items-center justify-end gap-1">
<button class="w-8 h-8 rounded-lg bg-surface-container hover:bg-secondary hover:text-on-primary text-secondary flex items-center justify-center transition-colors" title="Ver avance fotográfico" type="button">
<span class="material-symbols-outlined text-[18px]">photo_camera</span>
</button>
<button class="w-8 h-8 rounded-lg bg-surface-container hover:bg-primary hover:text-on-primary text-primary flex items-center justify-center transition-colors" title="Detalles" type="button">
<span class="material-symbols-outlined text-[18px]">visibility</span>
</button>
</div>
</td>
</tr>
<!-- ROW 4: EN PERÍODO DE EFICACIA (Auditoría Externa ARL Sura) -->
<tr class="hover:bg-surface-container-low transition-colors bg-surface-container-low/40">
<td class="py-sm px-sm align-top">
<div class="flex flex-col">
<span class="font-mono font-semibold text-primary text-label-md">AM-2024-007</span>
<span class="text-[11px] font-label-sm text-on-surface-variant">Mejora</span>
<span class="mt-xs inline-flex items-center px-1 rounded bg-secondary-fixed text-primary font-bold text-[10px]">AUDITORÍA ARL</span>
</div>
</td>
<td class="py-sm px-sm align-top max-w-xs">
<div class="flex flex-col gap-0.5">
<div class="flex items-center gap-xs">
<span class="px-1.5 py-0.5 rounded bg-surface-container-high text-primary font-mono text-[11px] font-semibold">AUD-ARL-2024</span>
<span class="text-[11px] text-on-surface-variant">Estándares 0312</span>
</div>
<p class="font-body-sm text-body-sm text-on-surface font-medium leading-snug mt-1">
                      Falta de protocolo estandarizado para rescate en alturas en torres de telecomunicación y silos de acopio.
                    </p>
<span class="text-[11px] text-on-surface-variant">Causa raíz: Procedimiento generalista no adaptado a silos.</span>
</div>
</td>
<td class="py-sm px-sm align-top max-w-xs">
<div class="flex flex-col">
<span class="text-on-surface font-medium leading-snug">
                      Elaboración de ficha técnica operativa de rescate en silos, dotación de kit de rescate descensor Gotcha y práctica real.
                    </span>
<span class="text-[11px] text-on-surface-variant mt-1">Jerarquía: Procedimiento + Equipamiento</span>
</div>
</td>
<td class="py-sm px-sm align-top">
<div class="flex flex-col">
<span class="font-medium text-on-surface">Ing. Andrés Valencia</span>
<span class="text-[12px] text-on-surface-variant">Coordinador SG-SST</span>
<span class="text-[11px] text-on-surface-variant/70 mt-1 flex items-center gap-0.5">
<span class="material-symbols-outlined text-[14px]">location_on</span> Planta Central Silos
                    </span>
</div>
</td>
<td class="py-sm px-sm align-top whitespace-nowrap">
<div class="flex flex-col">
<span class="text-on-surface-variant text-[12px]">Ejecutada: <strong class="text-on-surface font-mono">02/Oct/2024</strong></span>
<span class="text-emerald-700 font-semibold text-[11px] flex items-center gap-0.5 mt-0.5">
<span class="material-symbols-outlined text-[14px]">check</span> Implementada
                    </span>
</div>
</td>
<td class="py-sm px-sm align-top whitespace-nowrap">
<span class="inline-flex items-center gap-xs px-2 py-1 rounded-full bg-emerald-100 text-emerald-900 font-label-sm text-label-sm font-semibold">
<span class="w-2 h-2 rounded-full bg-emerald-600"></span> Implementada
                  </span>
</td>
<td class="py-sm px-sm align-top whitespace-nowrap">
<button class="flex items-center gap-xs text-primary hover:text-secondary font-label-sm text-label-sm" title="Ver acta de simulacro y certificado" type="button">
<span class="material-symbols-outlined text-[18px]">picture_as_pdf</span>
<span>Acta + Video</span>
</button>
</td>
<td class="py-sm px-sm align-top">
<span class="inline-flex items-center px-1.5 py-0.5 rounded bg-amber-100 text-amber-900 text-[11px] font-semibold">
                    Prueba 30 días (Día 22)
                  </span>
</td>
<td class="py-sm px-sm align-top text-right whitespace-nowrap">
<div class="flex items-center justify-end gap-1">
<button class="w-8 h-8 rounded-lg bg-emerald-100 hover:bg-emerald-600 hover:text-white text-emerald-800 flex items-center justify-center transition-colors" title="Certificar Eficacia Definitiva" type="button">
<span class="material-symbols-outlined text-[18px]">thumb_up</span>
</button>
</div>
</td>
</tr>
<!-- ROW 5: CERRADA Y TOTALMENTE EFICAZ (COPASST / Comité de Convivencia) -->
<tr class="hover:bg-surface-container-low transition-colors bg-surface-container-lowest">
<td class="py-sm px-sm align-top">
<div class="flex flex-col">
<span class="font-mono font-semibold text-emerald-800 text-label-md">AC-2024-029</span>
<span class="text-[11px] font-label-sm text-on-surface-variant">Correctiva</span>
<span class="mt-xs inline-flex items-center px-1 rounded bg-emerald-50 text-emerald-800 text-[10px] font-bold">COPASST</span>
</div>
</td>
<td class="py-sm px-sm align-top max-w-xs">
<div class="flex flex-col gap-0.5">
<div class="flex items-center gap-xs">
<span class="px-1.5 py-0.5 rounded bg-surface-container-high text-primary font-mono text-[11px] font-semibold">ACTA-COP-09</span>
<span class="text-[11px] text-on-surface-variant">Sesión Mensual</span>
</div>
<p class="font-body-sm text-body-sm text-on-surface font-medium leading-snug mt-1">
                      Falta de iluminación reglamentaria (&lt; 150 Lux) en el área de selección nocturna de frutas, provocando fatiga visual.
                    </p>
<span class="text-[11px] text-on-surface-variant">Causa raíz: Luminarias halógenas obsoletas sin recambio programado.</span>
</div>
</td>
<td class="py-sm px-sm align-top max-w-xs">
<div class="flex flex-col">
<span class="text-on-surface font-medium leading-snug">
                      Reemplazo a paneles LED industriales estancos IP65 garantizando 350 Lux continuos en mesas de clasificación.
                    </span>
<span class="text-[11px] text-on-surface-variant mt-1">Jerarquía: Ingeniería y Ergonomía</span>
</div>
</td>
<td class="py-sm px-sm align-top">
<div class="flex flex-col">
<span class="font-medium text-on-surface">Ing. Marcos Restrepo</span>
<span class="text-[12px] text-on-surface-variant">Mantenimiento Eléctrico</span>
<span class="text-[11px] text-on-surface-variant/70 mt-1 flex items-center gap-0.5">
<span class="material-symbols-outlined text-[14px]">location_on</span> Empacadora Central
                    </span>
</div>
</td>
<td class="py-sm px-sm align-top whitespace-nowrap">
<div class="flex flex-col">
<span class="text-on-surface-variant text-[12px]">Cerrada: <strong class="text-on-surface font-mono">10/Sep/2024</strong></span>
<span class="text-emerald-800 font-semibold text-[11px] flex items-center gap-0.5 mt-0.5">
<span class="material-symbols-outlined text-[14px]">done_all</span> Cumplido a tiempo
                    </span>
</div>
</td>
<td class="py-sm px-sm align-top whitespace-nowrap">
<span class="inline-flex items-center gap-xs px-2 py-1 rounded-full bg-emerald-100 text-emerald-900 font-label-sm text-label-sm font-semibold">
<span class="w-2 h-2 rounded-full bg-emerald-600"></span> Cerrada 🟢
                  </span>
</td>
<td class="py-sm px-sm align-top whitespace-nowrap">
<button class="flex items-center gap-xs text-primary hover:text-secondary font-label-sm text-label-sm" title="Ver estudio de luxometría" type="button">
<span class="material-symbols-outlined text-[18px]">verified</span>
<span>Luxometría OK</span>
</button>
</td>
<td class="py-sm px-sm align-top">
<span class="inline-flex items-center px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-900 text-[11px] font-semibold">
                    Eficaz Comprobada
                  </span>
</td>
<td class="py-sm px-sm align-top text-right whitespace-nowrap">
<div class="flex items-center justify-end gap-1">
<button class="w-8 h-8 rounded-lg bg-surface-container hover:bg-primary hover:text-on-primary text-primary flex items-center justify-center transition-colors" title="Descargar Certificado Cierre PHVA" type="button">
<span class="material-symbols-outlined text-[18px]">download_for_offline</span>
</button>
</div>
</td>
</tr>
</tbody>
</table>
</div>
<!-- Pagination and Master Table Footer -->
<div class="px-md py-sm flex flex-col sm:flex-row items-center justify-between gap-sm bg-surface-container-lowest border-t-0">
<div class="flex items-center gap-xs font-label-sm text-label-sm text-on-surface-variant">
<span>Mostrando 1 - 5 de 106 acciones registradas</span>
<span class="mx-xs">•</span>
<span>Filas por página:</span>
<select class="bg-surface-container-low text-on-surface rounded px-xs py-0.5 text-[12px] focus:outline-none">
<option>5</option>
<option>10</option>
<option>25</option>
<option>50</option>
</select>
</div>
<div class="flex items-center gap-xs">
<button class="w-8 h-8 rounded bg-surface-container-low text-on-surface-variant flex items-center justify-center hover:bg-surface-container" disabled="" type="button">
<span class="material-symbols-outlined text-[18px]">chevron_left</span>
</button>
<span class="w-8 h-8 rounded bg-primary text-on-primary flex items-center justify-center font-label-sm text-label-sm font-semibold">1</span>
<button class="w-8 h-8 rounded bg-surface-container-low text-on-surface hover:bg-surface-container flex items-center justify-center font-label-sm text-label-sm" type="button">2</button>
<button class="w-8 h-8 rounded bg-surface-container-low text-on-surface hover:bg-surface-container flex items-center justify-center font-label-sm text-label-sm" type="button">3</button>
<span class="text-on-surface-variant px-1 font-mono">...</span>
<button class="w-8 h-8 rounded bg-surface-container-low text-on-surface hover:bg-surface-container flex items-center justify-center font-label-sm text-label-sm" type="button">22</button>
<button class="w-8 h-8 rounded bg-surface-container-low text-on-surface-variant flex items-center justify-center hover:bg-surface-container" type="button">
<span class="material-symbols-outlined text-[18px]">chevron_right</span>
</button>
</div>
</div>
</div>
<!-- BANNER DE HALLAZGOS Y EVIDENCIAS FOTOGRÁFICAS EN CAMPO -->
<div class="bg-surface-container-lowest rounded-xl p-md shadow-sm">
<div class="flex items-center justify-between mb-sm">
<div>
<h3 class="font-headline-md text-headline-md text-primary">Trazabilidad de Evidencias en Terreno</h3>
<p class="font-body-sm text-body-sm text-on-surface-variant">Soporte antes / después de intervenciones en Fincas de Grupo Manzanares</p>
</div>
<a class="font-label-md text-label-md text-secondary hover:underline flex items-center gap-xs" href="#">
<span>Repositorio de Evidencias Multimedia</span>
<span class="material-symbols-outlined text-[18px]">open_in_new</span>
</a>
</div>
<div class="grid grid-cols-1 md:grid-cols-3 gap-md">
<!-- Card 1: Caso AC-2024-041 -->
<div class="bg-surface-container-low rounded-lg overflow-hidden flex flex-col">
<div class="h-36 w-full relative overflow-hidden">
<img class="w-full h-full object-cover" data-alt="An industrial agro-processing machine in a banana and fruit packaging plant in Colombia with a yellow safety interlocking physical guard installed, ambient clean industrial daylight, ISO 45001 safety compliant" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDxi0Y8RMmYMftd2n8BGUhQNKUJZD_8j53e1zT4cK3avfDyDwbJs5ye_9eDW2cvq_-85DI9sYfVaRz6empJGFcjPLayf9__mRScb6keaJoxDjajsN0ILh1RYHSYfo8aCsmB5HFYt1pJ4tv5WEdH7H3R9Xxkz478Y3p4AJbTBHTzVjkm7WVdsN3kiEjiVidwSSOT35FMQ2711fMXfCSUkuU7fN81wNXBhSH174McEq6V1OKqwOJC2F5r"/>
<span class="absolute top-2 left-2 bg-error text-on-error font-mono text-[10px] font-bold px-1.5 py-0.5 rounded">HALLAZGO CRÍTICO</span>
</div>
<div class="p-sm flex flex-col flex-1 justify-between">
<div>
<span class="font-mono text-label-sm text-primary font-semibold">AC-2024-041 • En proceso</span>
<p class="font-body-sm text-body-sm text-on-surface mt-1 line-clamp-2">Adecuación de guardas y sensores en desgranadora principal.</p>
</div>
<div class="flex items-center justify-between text-[11px] text-on-surface-variant pt-2 mt-2 border-t border-surface-container-high/60">
<span>Finca Santa Helena</span>
<span class="font-semibold text-error">Vencida (+12d)</span>
</div>
</div>
</div>
<!-- Card 2: Caso AP-2024-019 -->
<div class="bg-surface-container-low rounded-lg overflow-hidden flex flex-col">
<div class="h-36 w-full relative overflow-hidden">
<img class="w-full h-full object-cover" data-alt="A rural fleet inspection workshop with agricultural transport bus tires being calibrated and verified with digital depth gauges by a certified safety mechanic, natural outdoor sunlight, clean automotive tools" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBMfQjd3HOVmUO9t-Ss_gT_nFu3BVNF2IOhofXfPV3PUuM4ud9OLI9WlGiUnxB851xeef0z0NcfhfZIB_3Hy79NO1PG-C3ztQ6aGzgxBuXBgf20B0-mckeE4EkUDn2ttOEe4s99CTf3PMHtFgiOxaz7y6HRJxj2mIfxjtIcCNWkKYw_wCZq50-12DP78Un1hpItqklsn4NpqeiLoM-oDtuFJcJkrAjQOehlHFZSnO8OCWMjBZfp7G28"/>
<span class="absolute top-2 left-2 bg-amber-500 text-on-primary font-mono text-[10px] font-bold px-1.5 py-0.5 rounded">PESV INSPECCIÓN</span>
</div>
<div class="p-sm flex flex-col flex-1 justify-between">
<div>
<span class="font-mono text-label-sm text-amber-900 font-semibold">AP-2024-019 • Preventiva</span>
<p class="font-body-sm text-body-sm text-on-surface mt-1 line-clamp-2">Revisión técnico-mecánica de frenos y llantas flota agrícola.</p>
</div>
<div class="flex items-center justify-between text-[11px] text-on-surface-variant pt-2 mt-2 border-t border-surface-container-high/60">
<span>Taller Central Manzanares</span>
<span class="font-semibold text-amber-800">4 días restantes</span>
</div>
</div>
</div>
<!-- Card 3: Caso AC-2024-029 -->
<div class="bg-surface-container-low rounded-lg overflow-hidden flex flex-col">
<div class="h-36 w-full relative overflow-hidden">
<img class="w-full h-full object-cover" data-alt="Bright high-efficiency industrial LED ceiling lighting fixtures illuminating clean sorting fruit tables in a Latin American modern agricultural packing facility, professional sharp photography" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCsW18XMBzS6vUDXHdD12ffjqeqaudFZPfjSdc7Y-AhKsXHN-hvNh7j6pMEKT_cVyOsIcfA9xgxuFqOTxQ7YuPVWEhhf5GSXxYpl2AcRzbHfmy_curPwVQnEhjj2QqaexZzSIhW8XQ2lRqFOX4QsbD4BpggK0cjmrtvECSlLzhKZVTrv_Fe_etBdHDNo0cW1gRXiwxyTvjbi-PAaoFcCSfakL-TVwtNxrfn4Vl1os7Wgg1eko1a0cu9"/>
<span class="absolute top-2 left-2 bg-emerald-600 text-on-primary font-mono text-[10px] font-bold px-1.5 py-0.5 rounded">100% CERRADA &amp; EFICAZ</span>
</div>
<div class="p-sm flex flex-col flex-1 justify-between">
<div>
<span class="font-mono text-label-sm text-emerald-900 font-semibold">AC-2024-029 • Concluida</span>
<p class="font-body-sm text-body-sm text-on-surface mt-1 line-clamp-2">Luminarias LED estancas instaladas y luxometría verificada.</p>
</div>
<div class="flex items-center justify-between text-[11px] text-on-surface-variant pt-2 mt-2 border-t border-surface-container-high/60">
<span>Empacadora Manzanares</span>
<span class="font-semibold text-emerald-800">Cierre Certificado</span>
</div>
</div>
</div>
</div>
</div>
</div>
<!-- COLUMNA DERECHA (3 DE 12): CICLO PHVA, CONTROL DE EFICACIA Y DISTRIBUCIÓN -->
<div class="xl:col-span-3 flex flex-col gap-sm">
<!-- WIDGET 1: PROTOCOLO DE VERIFICACIÓN DE EFICACIA (Dec. 1072 Art. 2.2.4.6.33) -->
<div class="bg-surface-container-lowest rounded-xl p-md shadow-sm flex flex-col gap-sm">
<div class="flex items-center justify-between">
<div class="flex items-center gap-xs">
<span class="material-symbols-outlined text-primary text-[22px]">verified</span>
<h2 class="font-headline-md text-headline-md text-primary">Ciclo de Eficacia</h2>
</div>
<span class="px-xs py-0.5 rounded bg-primary-container text-on-primary text-[10px] font-semibold">Dec. 1072</span>
</div>
<p class="font-body-sm text-body-sm text-on-surface-variant leading-normal">
          Para dar cierre definitivo a una No Conformidad, el SG-SST evalúa que las causas raíces no reincidan durante 30 a 60 días posteriores a la implementación.
        </p>
<!-- Pipeline visual de 4 pasos PHVA -->
<div class="relative pl-6 space-y-4 my-xs">
<!-- Línea vertical de conexión continua -->
<div class="absolute left-2.5 top-2 bottom-2 w-0.5 bg-surface-container-highest"></div>
<!-- Step 1: P (Planear) -->
<div class="relative flex items-start gap-sm">
<div class="absolute -left-6 top-0.5 w-5 h-5 rounded-full bg-primary flex items-center justify-center text-white text-[10px] font-bold ring-4 ring-surface-container-lowest">
              P
            </div>
<div>
<span class="font-label-md text-label-md text-primary font-semibold">1. Análisis Causa Raíz</span>
<p class="font-body-sm text-body-sm text-on-surface-variant text-[13px]">Diagrama de Ishikawa o 5 Porqués aprobado por SST.</p>
</div>
</div>
<!-- Step 2: H (Hacer) -->
<div class="relative flex items-start gap-sm">
<div class="absolute -left-6 top-0.5 w-5 h-5 rounded-full bg-secondary flex items-center justify-center text-white text-[10px] font-bold ring-4 ring-surface-container-lowest">
              H
            </div>
<div>
<span class="font-label-md text-label-md text-primary font-semibold">2. Ejecución de Acción</span>
<p class="font-body-sm text-body-sm text-on-surface-variant text-[13px]">Entrega de evidencias documentales, fotos y firma.</p>
</div>
</div>
<!-- Step 3: V (Verificar) -->
<div class="relative flex items-start gap-sm">
<div class="absolute -left-6 top-0.5 w-5 h-5 rounded-full bg-amber-500 flex items-center justify-center text-white text-[10px] font-bold ring-4 ring-surface-container-lowest">
              V
            </div>
<div>
<span class="font-label-md text-label-md text-amber-900 font-semibold">3. Período de Observación</span>
<p class="font-body-sm text-body-sm text-on-surface-variant text-[13px]">30 días sin incidentes similares ni desvíos estándar.</p>
</div>
</div>
<!-- Step 4: A (Actuar) -->
<div class="relative flex items-start gap-sm">
<div class="absolute -left-6 top-0.5 w-5 h-5 rounded-full bg-emerald-600 flex items-center justify-center text-white text-[10px] font-bold ring-4 ring-surface-container-lowest">
              A
            </div>
<div>
<span class="font-label-md text-label-md text-emerald-900 font-semibold">4. Cierre &amp; Estandarización</span>
<p class="font-body-sm text-body-sm text-on-surface-variant text-[13px]">Actualización de Matriz de Riesgos IPEVR y COPASST.</p>
</div>
</div>
</div>
<!-- Acciones en período de observación actual -->
<div class="p-sm bg-surface-container-low rounded-lg">
<div class="flex items-center justify-between text-label-sm">
<span class="font-semibold text-on-surface">Eficacias por Validar Este Mes:</span>
<span class="font-bold text-secondary">6 Casos</span>
</div>
<div class="mt-xs w-full bg-surface-container-highest rounded-full h-1.5 overflow-hidden">
<div class="bg-secondary h-1.5 rounded-full" style="width: 75%"></div>
</div>
<span class="text-[11px] text-on-surface-variant mt-1 block">Próxima auditoría paritaria COPASST: Viernes 08 Nov</span>
</div>
</div>
<!-- WIDGET 2: DISTRIBUCIÓN POR FUENTES DE ORIGEN (GRÁFICO BARRAS PROPORCIONALES) -->
<div class="bg-surface-container-lowest rounded-xl p-md shadow-sm flex flex-col gap-sm">
<div class="flex items-center justify-between">
<h2 class="font-headline-md text-headline-md text-primary">Origen de Hallazgos</h2>
<span class="font-mono text-[11px] text-on-surface-variant">Año 2024</span>
</div>
<p class="font-body-sm text-body-sm text-on-surface-variant">
          Distribución porcentual de las no conformidades identificadas en Grupo Manzanares.
        </p>
<div class="space-y-3 mt-xs">
<!-- Item 1: Inspecciones (35%) -->
<div>
<div class="flex justify-between font-label-sm text-label-sm mb-1">
<span class="text-on-surface font-medium">Inspecciones de Seguridad</span>
<span class="font-bold text-primary">35% <span class="font-normal text-on-surface-variant text-[11px]">(37)</span></span>
</div>
<div class="w-full bg-surface-container-high rounded-full h-2 overflow-hidden">
<div class="bg-primary h-2 rounded-full" style="width: 35%"></div>
</div>
</div>
<!-- Item 2: Accidentes / Incidentes (25%) -->
<div>
<div class="flex justify-between font-label-sm text-label-sm mb-1">
<span class="text-on-surface font-medium">Accidentes e Incidentes</span>
<span class="font-bold text-error">25% <span class="font-normal text-on-surface-variant text-[11px]">(27)</span></span>
</div>
<div class="w-full bg-surface-container-high rounded-full h-2 overflow-hidden">
<div class="bg-error h-2 rounded-full" style="width: 25%"></div>
</div>
</div>
<!-- Item 3: Auditorías Internas y ARL (15%) -->
<div>
<div class="flex justify-between font-label-sm text-label-sm mb-1">
<span class="text-on-surface font-medium">Auditorías Internas / ARL</span>
<span class="font-bold text-secondary">15% <span class="font-normal text-on-surface-variant text-[11px]">(16)</span></span>
</div>
<div class="w-full bg-surface-container-high rounded-full h-2 overflow-hidden">
<div class="bg-secondary h-2 rounded-full" style="width: 15%"></div>
</div>
</div>
<!-- Item 4: Seguridad Vial PESV (15%) -->
<div>
<div class="flex justify-between font-label-sm text-label-sm mb-1">
<span class="text-on-surface font-medium">Seguridad Vial PESV</span>
<span class="font-bold text-amber-700">15% <span class="font-normal text-on-surface-variant text-[11px]">(16)</span></span>
</div>
<div class="w-full bg-surface-container-high rounded-full h-2 overflow-hidden">
<div class="bg-amber-600 h-2 rounded-full" style="width: 15%"></div>
</div>
</div>
<!-- Item 5: Comités COPASST / CCL (10%) -->
<div>
<div class="flex justify-between font-label-sm text-label-sm mb-1">
<span class="text-on-surface font-medium">COPASST, CCL &amp; Dirección</span>
<span class="font-bold text-on-surface-variant">10% <span class="font-normal text-on-surface-variant text-[11px]">(10)</span></span>
</div>
<div class="w-full bg-surface-container-high rounded-full h-2 overflow-hidden">
<div class="bg-tertiary-container h-2 rounded-full" style="width: 10%"></div>
</div>
</div>
</div>
<!-- Mini SVG Donut Chart for Quick Visual Balance -->
<div class="mt-sm p-sm bg-surface-container-low rounded-lg flex items-center gap-md">
<svg class="w-16 h-16 shrink-0 -rotate-90" viewbox="0 0 36 36">
<!-- 35% Primary -->
<circle cx="18" cy="18" fill="transparent" r="15.915" stroke="#142175" stroke-dasharray="35 65" stroke-dashoffset="0" stroke-width="4.5"></circle>
<!-- 25% Error -->
<circle cx="18" cy="18" fill="transparent" r="15.915" stroke="#ba1a1a" stroke-dasharray="25 75" stroke-dashoffset="-35" stroke-width="4.5"></circle>
<!-- 15% Secondary -->
<circle cx="18" cy="18" fill="transparent" r="15.915" stroke="#4648d4" stroke-dasharray="15 85" stroke-dashoffset="-60" stroke-width="4.5"></circle>
<!-- 15% Amber -->
<circle cx="18" cy="18" fill="transparent" r="15.915" stroke="#d97706" stroke-dasharray="15 85" stroke-dashoffset="-75" stroke-width="4.5"></circle>
<!-- 10% Tertiary -->
<circle cx="18" cy="18" fill="transparent" r="15.915" stroke="#404345" stroke-dasharray="10 90" stroke-dashoffset="-90" stroke-width="4.5"></circle>
</svg>
<div class="flex flex-col text-on-surface-variant text-[11px] leading-tight">
<span class="font-semibold text-on-surface">Proactividad del Sistema</span>
<span>El 65% de las CAPA provienen de prevención (Inspecciones y Auditorías), no de siniestralidad.</span>
</div>
</div>
</div>
<!-- WIDGET 3: ALERTA CRÍTICA Y NOTIFICACIÓN A ALTA DIRECCIÓN -->
<div class="bg-primary text-on-primary rounded-xl p-md shadow-md flex flex-col justify-between relative overflow-hidden">
<!-- Background subtle decorative pattern -->
<div class="absolute -right-4 -bottom-4 w-28 h-28 bg-white/5 rounded-full blur-xl pointer-events-none"></div>
<div>
<div class="flex items-center gap-xs text-secondary-fixed">
<span class="material-symbols-outlined text-[20px]">notifications_active</span>
<span class="font-label-sm text-label-sm font-semibold uppercase tracking-wider">Protocolo de Escalación</span>
</div>
<h3 class="font-headline-md text-headline-md text-white mt-xs">Comité Extraordinario CAPA</h3>
<p class="font-body-sm text-body-sm text-on-primary/80 mt-1 leading-relaxed">
            Existen 3 acciones con vencimiento mayor a 10 días. Según el procedimiento interno SG-SST-PR-17, se requiere citación a la Gerencia General.
          </p>
</div>
<div class="mt-md flex items-center gap-xs">
<button class="w-full bg-secondary text-on-secondary hover:bg-secondary-container transition-colors py-xs px-sm rounded-lg font-label-md text-label-md font-medium text-center" type="button">
            Convocar Comité
          </button>
<button class="bg-white/10 hover:bg-white/20 text-white p-xs rounded-lg transition-colors" title="Descargar Informe Ejecutivo PDF" type="button">
<span class="material-symbols-outlined text-[20px]">download</span>
</button>
</div>
</div>
</div>
</div>
<!-- MODAL FLOTANTE / DRAWER COMPONENTE DE NUEVA ACCIÓN (DISPARABLE MEDIANTE INTERACCIÓN) -->
<div class="fixed inset-0 bg-on-surface/40 backdrop-blur-sm z-50 hidden flex items-center justify-center p-md" id="new-action-modal">
<div class="bg-surface-container-lowest rounded-xl max-w-2xl w-full shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
<div class="p-md bg-primary text-on-primary flex items-center justify-between">
<div class="flex items-center gap-xs">
<span class="material-symbols-outlined text-[22px]">playlist_add_check</span>
<h3 class="font-headline-md text-headline-md text-on-primary">Registro de Nueva Acción CAPA</h3>
</div>
<button class="w-8 h-8 rounded-lg hover:bg-white/20 flex items-center justify-center text-on-primary transition-colors" id="close-modal-btn" type="button">
<span class="material-symbols-outlined text-[20px]">close</span>
</button>
</div>
<div class="p-md overflow-y-auto space-y-md">
<div class="grid grid-cols-1 md:grid-cols-2 gap-sm">
<div class="flex flex-col gap-xs">
<label class="font-label-sm text-label-sm font-semibold text-on-surface">Tipo de Acción</label>
<select class="bg-surface-container-low text-on-surface p-xs rounded-lg text-body-sm focus:ring-2 focus:ring-secondary">
<option>Correctiva (Elimina causa raíz de evento ocurrido)</option>
<option>Preventiva (Mitiga riesgo potencial detectado)</option>
<option>Mejora (Optimización de estándar existente)</option>
</select>
</div>
<div class="flex flex-col gap-xs">
<label class="font-label-sm text-label-sm font-semibold text-on-surface">Fuente u Origen</label>
<select class="bg-surface-container-low text-on-surface p-xs rounded-lg text-body-sm focus:ring-2 focus:ring-secondary">
<option>Investigación de Accidente de Trabajo (AT)</option>
<option>Inspección de Seguridad Planeada</option>
<option>Auditoría de Cumplimiento Res. 0312</option>
<option>Seguridad Vial PESV</option>
<option>Hallazgo COPASST</option>
</select>
</div>
</div>
<div class="flex flex-col gap-xs">
<label class="font-label-sm text-label-sm font-semibold text-on-surface">Descripción de la No Conformidad / Hallazgo</label>
<textarea class="w-full bg-surface-container-low text-on-surface p-xs rounded-lg text-body-sm focus:ring-2 focus:ring-secondary" placeholder="Detalle qué ocurrió, condición insegura o desviación estándar..." rows="3"></textarea>
</div>
<div class="grid grid-cols-1 md:grid-cols-3 gap-sm">
<div class="flex flex-col gap-xs">
<label class="font-label-sm text-label-sm font-semibold text-on-surface">Líder Responsable</label>
<input class="bg-surface-container-low text-on-surface p-xs rounded-lg text-body-sm focus:ring-2 focus:ring-secondary" placeholder="Ej. Ing. Andrés Valencia" type="text"/>
</div>
<div class="flex flex-col gap-xs">
<label class="font-label-sm text-label-sm font-semibold text-on-surface">Fecha Compromiso</label>
<input class="bg-surface-container-low text-on-surface p-xs rounded-lg text-body-sm focus:ring-2 focus:ring-secondary" type="date"/>
</div>
<div class="flex flex-col gap-xs">
<label class="font-label-sm text-label-sm font-semibold text-on-surface">Jerarquía de Control</label>
<select class="bg-surface-container-low text-on-surface p-xs rounded-lg text-body-sm focus:ring-2 focus:ring-secondary">
<option>1. Eliminación</option>
<option>2. Sustitución</option>
<option selected="">3. Control de Ingeniería</option>
<option>4. Control Administrativo</option>
<option>5. Dotación EPP</option>
</select>
</div>
</div>
</div>
<div class="p-md bg-surface-container-low flex items-center justify-end gap-xs">
<button class="px-sm py-xs rounded-lg bg-surface-container text-on-surface font-label-md text-label-md hover:bg-surface-container-high transition-colors" id="cancel-modal-btn" type="button">
          Cancelar
        </button>
<button class="px-sm py-xs rounded-lg bg-primary text-on-primary font-label-md text-label-md hover:bg-primary-container transition-colors shadow-sm" type="button">
          Guardar y Generar Código CAPA
        </button>
</div>
</div>
</div>
<!-- SCRIPT: Modal toggle behavior for quick interactions -->
<script>
    (function() {
      const modal = document.getElementById('new-action-modal');
      const closeBtn = document.getElementById('close-modal-btn');
      const cancelBtn = document.getElementById('cancel-modal-btn');
      
      document.querySelectorAll('button').forEach(btn => {
        if (btn.textContent.includes('+ Nueva Acción Correctiva')) {
          btn.addEventListener('click', () => {
            modal.classList.remove('hidden');
          });
        }
      });

      if (closeBtn) closeBtn.addEventListener('click', () => modal.classList.add('hidden'));
      if (cancelBtn) cancelBtn.addEventListener('click', () => modal.classList.add('hidden'));
    })();

  </script>
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
  }</script></head><body class="bg-background font-body-md text-body-md text-on-surface antialiased"><aside class="fixed left-0 top-0 h-full w-72 bg-surface-container-lowest shadow-[0_1px_8px_rgba(0,0,0,0.04)] z-50 flex flex-col justify-between overflow-y-auto"><div class="p-gutter pb-0"><div class="flex items-center gap-base mb-xs"><div class="w-8 h-8 rounded bg-primary-container flex items-center justify-center text-on-primary font-headline-md text-headline-md">M</div><div class="flex flex-col"><span class="font-label-md text-label-md text-primary leading-tight font-semibold">Grupo Manzanares S.A.S.</span><span class="font-label-sm text-label-sm text-on-surface-variant">SG-SST Operativo</span></div></div><div class="flex items-center gap-xs mt-base mb-md"><span class="bg-surface-container-high text-on-surface font-label-sm text-label-sm px-xs py-0.5 rounded">Dec. 1072</span><span class="bg-surface-container-high text-on-surface font-label-sm text-label-sm px-xs py-0.5 rounded">Res. 0312</span></div></div><nav class="flex-1 px-sm pb-gutter flex flex-col gap-base" data-active-classes="bg-primary-container text-on-primary font-medium rounded-lg"><div class="flex flex-col gap-xs"><span class="px-xs font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">Gestión Operativa</span><a class="flex items-center gap-base px-sm py-xs rounded-lg text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-colors font-label-md text-label-md" data-path="dashboard" href="#"><span class="material-symbols-outlined text-[20px]">dashboard</span>Inicio / Dashboard</a><a class="flex items-center gap-base px-sm py-xs rounded-lg text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-colors font-label-md text-label-md" data-path="trabajadores" href="#"><span class="material-symbols-outlined text-[20px]">badge</span>Trabajadores</a><a class="flex items-center gap-base px-sm py-xs rounded-lg text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-colors font-label-md text-label-md" data-path="examenes-medicos" href="#"><span class="material-symbols-outlined text-[20px]">medical_services</span>Exámenes Médicos (EMOS)</a><a class="flex items-center gap-base px-sm py-xs rounded-lg text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-colors font-label-md text-label-md" data-path="casos-de-salud" href="#"><span class="material-symbols-outlined text-[20px]">health_and_safety</span>Casos de Salud</a><a class="flex items-center gap-base px-sm py-xs rounded-lg text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-colors font-label-md text-label-md" data-path="incapacidades-y-reintegros" href="#"><span class="material-symbols-outlined text-[20px]">assignment_return</span>Incapacidades y Reintegros</a></div><div class="flex flex-col gap-xs"><span class="px-xs font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">Riesgos Críticos &amp; Viales</span><a class="flex items-center gap-base px-sm py-xs rounded-lg text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-colors font-label-md text-label-md" data-path="trabajo-en-alturas" href="#"><span class="material-symbols-outlined text-[20px]">height</span>Trabajo en Alturas</a><a class="flex items-center gap-base px-sm py-xs rounded-lg text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-colors font-label-md text-label-md" data-path="tractoristas-operadores" href="#"><span class="material-symbols-outlined text-[20px]">agriculture</span>Tractoristas / Operadores</a><a class="flex items-center gap-base px-sm py-xs rounded-lg text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-colors font-label-md text-label-md" data-path="pesv-seguridad-vial" href="#"><span class="material-symbols-outlined text-[20px]">traffic</span>PESV (Seguridad Vial)</a><a class="flex items-center gap-base px-sm py-xs rounded-lg text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-colors font-label-md text-label-md" data-path="epp" href="#"><span class="material-symbols-outlined text-[20px]">security</span>EPP</a></div><div class="flex flex-col gap-xs"><span class="px-xs font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">Inspección &amp; Eventos</span><a class="flex items-center gap-base px-sm py-xs rounded-lg text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-colors font-label-md text-label-md" data-path="inspecciones" href="#"><span class="material-symbols-outlined text-[20px]">fact_check</span>Inspecciones</a><a class="flex items-center justify-between px-sm py-xs rounded-lg text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-colors font-label-md text-label-md" data-path="accidentes-e-incidentes" href="#"><div class="flex items-center gap-base"><span class="material-symbols-outlined text-[20px]">warning</span>Accidentes e Incidentes</div><span class="bg-error text-on-error font-label-sm text-label-sm px-xs py-0.5 rounded-full">2</span></a><a aria-current="page" class="flex items-center gap-base px-sm py-xs transition-colors bg-primary-container text-on-primary font-medium rounded-lg" data-path="investigaciones" href="#"><span class="material-symbols-outlined text-[20px]">manage_search</span>Investigaciones</a><a class="flex items-center gap-base px-sm py-xs rounded-lg text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-colors font-label-md text-label-md" data-path="acciones-correctivas" href="#"><span class="material-symbols-outlined text-[20px]">check_circle</span>Acciones Correctivas</a></div><div class="flex flex-col gap-xs"><span class="px-xs font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">Comités &amp; Cultura</span><a class="flex items-center gap-base px-sm py-xs rounded-lg text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-colors font-label-md text-label-md" data-path="capacitaciones" href="#"><span class="material-symbols-outlined text-[20px]">school</span>Capacitaciones</a><a class="flex items-center gap-base px-sm py-xs rounded-lg text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-colors font-label-md text-label-md" data-path="documentos-sg-sst" href="#"><span class="material-symbols-outlined text-[20px]">folder_open</span>Documentos SG-SST</a><a class="flex items-center gap-base px-sm py-xs rounded-lg text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-colors font-label-md text-label-md" data-path="copasst" href="#"><span class="material-symbols-outlined text-[20px]">groups</span>COPASST</a><a class="flex items-center gap-base px-sm py-xs rounded-lg text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-colors font-label-md text-label-md" data-path="ccl" href="#"><span class="material-symbols-outlined text-[20px]">handshake</span>CCL</a><a class="flex items-center gap-base px-sm py-xs rounded-lg text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-colors font-label-md text-label-md" data-path="emergencias" href="#"><span class="material-symbols-outlined text-[20px]">emergency</span>Emergencias</a><a class="flex items-center gap-base px-sm py-xs rounded-lg text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-colors font-label-md text-label-md" data-path="quimicos" href="#"><span class="material-symbols-outlined text-[20px]">science</span>Químicos</a></div></nav></aside><div class="pl-72"><header class="fixed top-0 left-72 right-0 h-16 bg-surface-container-lowest/90 backdrop-blur-xl shadow-[0_1px_8px_rgba(0,0,0,0.04)] z-40 flex items-center justify-between px-gutter"><div class="flex items-center gap-md flex-1 max-w-xl"><div class="relative w-full"><span class="material-symbols-outlined absolute left-sm top-1/2 -translate-y-1/2 text-on-surface-variant text-[20px]">search</span><input class="w-full bg-surface-container-low text-on-surface placeholder:text-on-surface-variant pl-10 pr-sm py-xs rounded-lg font-body-sm text-body-sm focus:outline-none focus:ring-2 focus:ring-secondary-container transition-all" placeholder="Buscar trabajadores, incidentes, normativas..." type="search"/></div><div class="flex items-center bg-surface-container-low px-sm py-xs rounded-lg gap-xs shrink-0"><span class="material-symbols-outlined text-[18px] text-on-surface-variant">gavel</span><span class="font-label-sm text-label-sm text-on-surface">Estándares 2024</span><span class="material-symbols-outlined text-[16px] text-on-surface-variant">expand_more</span></div></div><div class="flex items-center gap-base"><button class="flex items-center gap-xs bg-primary-container text-on-primary px-sm py-xs rounded-lg font-label-md text-label-md hover:bg-primary transition-colors" type="button"><span class="material-symbols-outlined text-[18px]">add_alert</span><span>Reporte Rápido / Notificación</span></button><button class="relative w-10 h-10 flex items-center justify-center rounded-lg hover:bg-surface-container-high transition-colors text-on-surface-variant" type="button"><span class="material-symbols-outlined text-[22px]">notifications</span><span class="absolute top-2 right-2 w-2 h-2 rounded-full bg-error"></span></button><div class="flex items-center gap-sm pl-xs"><div class="text-right hidden xl:block"><div class="font-label-md text-label-md text-on-surface font-medium">Ing. Andrés Valencia</div><div class="font-label-sm text-label-sm text-on-surface-variant">Coordinador SG-SST</div></div><div class="w-8 h-8 rounded-full bg-primary flex items-center justify-center"><span class="material-symbols-outlined text-on-primary text-[18px]">person</span></div></div></div></header><main class="w-full px-gutter pt-16 bg-surface min-h-screen"><div class="flex flex-col w-full">
<!-- SCRIPT: Activar enlace de Capacitaciones en Sidebar existente -->
<script>
    (function highlightNav() {
      const links = document.querySelectorAll('aside nav a[data-path="capacitaciones"]');
      links.forEach(el => {
        el.className = "flex items-center gap-base px-sm py-xs rounded-lg bg-primary-container text-on-primary font-label-md text-label-md transition-colors shadow-sm";
      });
    })();
  </script>
<!-- ENCABEZADO NORMATIVO Y ACCIONES EJECUTIVAS -->
<header class="mb-md pb-base">
<div class="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-base">
<div class="space-y-xs max-w-4xl">
<div class="flex items-center gap-xs">
<span class="bg-primary-fixed text-on-primary-fixed font-label-sm text-label-sm px-xs py-0.5 rounded font-semibold tracking-wide">MÓDULO 18</span>
<span class="text-on-surface-variant font-label-sm text-label-sm">•</span>
<span class="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">Cultura &amp; Comités SG-SST</span>
<span class="text-on-surface-variant font-label-sm text-label-sm">•</span>
<span class="bg-surface-container-high text-primary font-label-sm text-label-sm px-xs py-0.5 rounded font-medium">Dec. 1072/15 Art. 2.2.4.6.11</span>
</div>
<h1 class="font-headline-lg text-headline-lg text-primary tracking-tight">
          18. Plan Maestro de Capacitaciones, Inducción y Entrenamiento SST
        </h1>
<p class="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
          Control del programa anual de capacitación obligatoria, inducciones de ingreso, certificaciones de alto riesgo y competencias agroindustriales conforme al Decreto 1072 de 2015 Art. 2.2.4.6.11 y Res. 0312/2019.
        </p>
</div>
<!-- Botones Operativos con jerarquía clara -->
<div class="flex items-center flex-wrap gap-xs shrink-0 pt-xs xl:pt-0">
<button class="flex items-center gap-xs bg-surface-container-lowest text-primary shadow-sm hover:bg-surface-container-low px-sm py-base rounded-lg font-label-md text-label-md transition-all" type="button">
<span class="material-symbols-outlined text-[18px]">picture_as_pdf</span>
<span>Plan Anual (.PDF)</span>
</button>
<button class="flex items-center gap-xs bg-surface-container-lowest text-primary shadow-sm hover:bg-surface-container-low px-sm py-base rounded-lg font-label-md text-label-md transition-all" type="button">
<span class="material-symbols-outlined text-[18px]">table_view</span>
<span>Matriz Asistencias (.XLSX)</span>
</button>
<button class="flex items-center gap-xs bg-primary text-on-primary shadow-md hover:bg-primary-container px-sm py-base rounded-lg font-label-md text-label-md transition-all" type="button">
<span class="material-symbols-outlined text-[20px]">add_circle</span>
<span class="font-medium">+ Registrar Capacitación</span>
</button>
</div>
</div>
</header>
<!-- DASHBOARD ANALÍTICO DEL PLAN ANUAL: 6 MÉTRICAS CLAVE -->
<section class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-sm mb-md">
<!-- Card 1: Realizadas -->
<div class="bg-surface-container-lowest p-sm rounded-xl shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
<div class="flex items-center justify-between">
<span class="font-label-sm text-label-sm text-on-surface-variant font-medium">Realizadas (YTD)</span>
<div class="w-8 h-8 rounded-lg bg-surface-container-low flex items-center justify-center text-primary">
<span class="material-symbols-outlined text-[20px]">check_circle</span>
</div>
</div>
<div class="mt-base">
<div class="flex items-baseline gap-xs">
<span class="font-headline-lg text-headline-lg text-on-surface font-semibold">38</span>
<span class="font-label-sm text-label-sm text-on-surface-variant">eventos</span>
</div>
<p class="font-label-sm text-label-sm text-on-surface-variant mt-xs flex items-center gap-xs">
<span class="text-secondary font-semibold">100%</span> firmas foliadas
        </p>
</div>
</div>
<!-- Card 2: Pendientes en Calendario -->
<div class="bg-surface-container-lowest p-sm rounded-xl shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
<div class="flex items-center justify-between">
<span class="font-label-sm text-label-sm text-on-surface-variant font-medium">Programadas</span>
<div class="w-8 h-8 rounded-lg bg-surface-container-low flex items-center justify-center text-secondary">
<span class="material-symbols-outlined text-[20px]">calendar_month</span>
</div>
</div>
<div class="mt-base">
<div class="flex items-baseline gap-xs">
<span class="font-headline-lg text-headline-lg text-on-surface font-semibold">06</span>
<span class="font-label-sm text-label-sm text-on-surface-variant">programadas</span>
</div>
<p class="font-label-sm text-label-sm text-on-surface-variant mt-xs">
          Cronograma cuatrimestre 2
        </p>
</div>
</div>
<!-- Card 3: Próximas <15 días -->
<div class="bg-surface-container-lowest p-sm rounded-xl shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
<div class="flex items-center justify-between">
<span class="font-label-sm text-label-sm text-on-surface-variant font-medium">Próximos 15 días</span>
<div class="w-8 h-8 rounded-lg bg-surface-container-high flex items-center justify-center text-primary-container">
<span class="material-symbols-outlined text-[20px]">notifications_active</span>
</div>
</div>
<div class="mt-base">
<div class="flex items-baseline gap-xs">
<span class="font-headline-lg text-headline-lg text-primary font-semibold">04</span>
<span class="font-label-sm text-label-sm text-on-surface-variant">en agenda</span>
</div>
<div class="w-full bg-surface-container-high h-1.5 rounded-full mt-base overflow-hidden">
<div class="bg-secondary h-full rounded-full w-2/3"></div>
</div>
</div>
</div>
<!-- Card 4: Vencidas / Retrasadas -->
<div class="bg-surface-container-lowest p-sm rounded-xl shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
<div class="flex items-center justify-between">
<span class="font-label-sm text-label-sm text-error font-medium">Vencidas / Retraso</span>
<div class="w-8 h-8 rounded-lg bg-error-container flex items-center justify-center text-error">
<span class="material-symbols-outlined text-[20px]">warning</span>
</div>
</div>
<div class="mt-base">
<div class="flex items-baseline gap-xs">
<span class="font-headline-lg text-headline-lg text-error font-semibold">02</span>
<span class="font-label-sm text-label-sm text-error">con retraso</span>
</div>
<p class="font-label-sm text-label-sm text-on-error-container mt-xs">
          Requiere reprogramar COPASST
        </p>
</div>
</div>
<!-- Card 5: Cumplimiento & Cobertura -->
<div class="bg-surface-container-lowest p-sm rounded-xl shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
<div class="flex items-center justify-between">
<span class="font-label-sm text-label-sm text-on-surface-variant font-medium">Cumplimiento Plan</span>
<span class="font-label-sm text-label-sm font-semibold text-secondary">84.2%</span>
</div>
<div class="mt-base">
<div class="flex items-baseline gap-xs">
<span class="font-headline-lg text-headline-lg text-on-surface font-semibold">91.5%</span>
<span class="font-label-sm text-label-sm text-on-surface-variant">cobertura</span>
</div>
<div class="w-full bg-surface-container h-1.5 rounded-full mt-base overflow-hidden">
<div class="bg-secondary-container h-full rounded-full" style="width: 84.2%;"></div>
</div>
</div>
</div>
<!-- Card 6: HHC Horas Hombre Capacitadas -->
<div class="bg-surface-container-lowest p-sm rounded-xl shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
<div class="flex items-center justify-between">
<span class="font-label-sm text-label-sm text-on-surface-variant font-medium">Horas Hombre (HHC)</span>
<div class="w-8 h-8 rounded-lg bg-surface-container-low flex items-center justify-center text-primary">
<span class="material-symbols-outlined text-[20px]">timer</span>
</div>
</div>
<div class="mt-base">
<div class="flex items-baseline gap-xs">
<span class="font-headline-lg text-headline-lg text-on-surface font-semibold">1.240</span>
<span class="font-label-sm text-label-sm text-on-surface-variant">hrs</span>
</div>
<p class="font-label-sm text-label-sm text-on-surface-variant mt-xs">
          Promedio 8.8 hrs / trabajador
        </p>
</div>
</div>
</section>
<!-- BENTO SECTION: ALERTA TEMPRANA & RADAR OPERATIVO -->
<section class="grid grid-cols-1 lg:grid-cols-12 gap-gutter mb-md">
<!-- Próximas Sesiones de la Semana -->
<div class="lg:col-span-7 bg-surface-container-lowest p-md rounded-xl shadow-sm flex flex-col justify-between">
<div>
<div class="flex items-center justify-between mb-base">
<div class="flex items-center gap-base">
<span class="w-2.5 h-2.5 rounded-full bg-secondary"></span>
<h2 class="font-headline-md text-headline-md text-on-surface">Sesiones Agendadas de la Semana</h2>
</div>
<span class="font-label-sm text-label-sm text-on-surface-variant bg-surface-container-low px-xs py-0.5 rounded">Semana 42 • Octubre 2024</span>
</div>
<p class="font-body-sm text-body-sm text-on-surface-variant mb-md">
          Citación formal enviada vía nómina y supervisores de cuadrilla para cumplimiento de estándares mínimos.
        </p>
<!-- Timeline Grid de Sesiones -->
<div class="space-y-sm">
<!-- Sesión 1 -->
<div class="bg-surface-container-low p-sm rounded-lg flex flex-col sm:flex-row sm:items-center justify-between gap-base hover:bg-surface-container transition-colors">
<div class="flex items-start gap-sm">
<div class="bg-surface-container-lowest text-primary font-headline-md text-headline-md w-12 h-12 rounded-lg flex flex-col items-center justify-center shrink-0 shadow-sm leading-none">
<span class="text-label-sm font-label-sm text-on-surface-variant uppercase">Jue</span>
<span class="font-semibold text-[18px]">17</span>
</div>
<div>
<div class="flex items-center gap-xs flex-wrap">
<span class="bg-primary-container text-on-primary font-label-sm text-label-sm px-xs py-0.5 rounded">Res. 4272/21</span>
<span class="font-label-md text-label-md font-semibold text-on-surface">Reentrenamiento Trabajo Seguro en Alturas</span>
</div>
<div class="flex items-center gap-base text-on-surface-variant font-label-sm text-label-sm mt-xs">
<span class="flex items-center gap-0.5"><span class="material-symbols-outlined text-[15px]">location_on</span> Finca La Virginia - Taller</span>
<span class="flex items-center gap-0.5"><span class="material-symbols-outlined text-[15px]">schedule</span> 07:00 - 15:00 (8 hrs)</span>
<span class="flex items-center gap-0.5 text-secondary font-medium"><span class="material-symbols-outlined text-[15px]">school</span> SENA Caldas</span>
</div>
</div>
</div>
<div class="flex sm:flex-col items-center sm:items-end justify-between shrink-0 gap-xs">
<span class="bg-secondary-fixed text-on-secondary-fixed font-label-sm text-label-sm px-xs py-0.5 rounded font-semibold">14 / 16 citados</span>
<button class="text-primary hover:text-secondary-container font-label-sm text-label-sm font-semibold flex items-center" type="button">
                Ver lista <span class="material-symbols-outlined text-[16px]">chevron_right</span>
</button>
</div>
</div>
<!-- Sesión 2 -->
<div class="bg-surface-container-low p-sm rounded-lg flex flex-col sm:flex-row sm:items-center justify-between gap-base hover:bg-surface-container transition-colors">
<div class="flex items-start gap-sm">
<div class="bg-surface-container-lowest text-primary font-headline-md text-headline-md w-12 h-12 rounded-lg flex flex-col items-center justify-center shrink-0 shadow-sm leading-none">
<span class="text-label-sm font-label-sm text-on-surface-variant uppercase">Vie</span>
<span class="font-semibold text-[18px]">18</span>
</div>
<div>
<div class="flex items-center gap-xs flex-wrap">
<span class="bg-surface-container-highest text-on-surface font-label-sm text-label-sm px-xs py-0.5 rounded">Riesgo Químico</span>
<span class="font-label-md text-label-md font-semibold text-on-surface">Manejo Seguro de Plaguicidas y SGA (Sistemas Globalmente Armonizado)</span>
</div>
<div class="flex items-center gap-base text-on-surface-variant font-label-sm text-label-sm mt-xs">
<span class="flex items-center gap-0.5"><span class="material-symbols-outlined text-[15px]">location_on</span> Finca Bellavista - Bodega Fitosanitarios</span>
<span class="flex items-center gap-0.5"><span class="material-symbols-outlined text-[15px]">schedule</span> 14:00 - 17:00 (3 hrs)</span>
<span class="flex items-center gap-0.5 text-secondary font-medium"><span class="material-symbols-outlined text-[15px]">badge</span> Ing. Qco. Carlos Méndez</span>
</div>
</div>
</div>
<div class="flex sm:flex-col items-center sm:items-end justify-between shrink-0 gap-xs">
<span class="bg-secondary-fixed text-on-secondary-fixed font-label-sm text-label-sm px-xs py-0.5 rounded font-semibold">22 / 25 citados</span>
<button class="text-primary hover:text-secondary-container font-label-sm text-label-sm font-semibold flex items-center" type="button">
                Ver lista <span class="material-symbols-outlined text-[16px]">chevron_right</span>
</button>
</div>
</div>
</div>
</div>
<!-- Quick Status Footer -->
<div class="pt-base mt-base flex items-center justify-between text-on-surface-variant font-label-sm text-label-sm">
<span>Próxima actualización con biométrico de campo: 16:30 COT</span>
<a class="text-secondary font-semibold hover:underline flex items-center gap-0.5" href="#">
          Ver cronograma mensual completo <span class="material-symbols-outlined text-[16px]">arrow_forward</span>
</a>
</div>
</div>
<!-- Radar de Personal Crítico: Bloqueo Operativo por Inducción / Certificación -->
<div class="lg:col-span-5 bg-surface-container-lowest p-md rounded-xl shadow-sm flex flex-col justify-between">
<div>
<div class="flex items-center justify-between mb-xs">
<div class="flex items-center gap-xs">
<span class="material-symbols-outlined text-error text-[22px]">gpp_maybe</span>
<h2 class="font-headline-md text-headline-md text-on-surface">Radar de Bloqueo Operativo</h2>
</div>
<span class="bg-error-container text-on-error-container font-label-sm text-label-sm px-xs py-0.5 rounded-full font-bold">3 Trabajadores</span>
</div>
<p class="font-body-sm text-body-sm text-on-surface-variant mb-base">
          Personal con restricción de ingreso a labores agroindustriales por inducción incompleta o certificación de alto riesgo caducada.
        </p>
<div class="space-y-xs">
<!-- Item 1: Vencimiento Alturas -->
<div class="p-sm rounded-lg bg-surface-container-low flex items-center justify-between gap-base">
<div class="flex items-center gap-sm">
<div class="w-9 h-9 rounded-full bg-error-container text-on-error-container flex items-center justify-center font-bold text-label-md shrink-0">
                JR
              </div>
<div class="min-w-0">
<div class="flex items-center gap-xs">
<span class="font-label-md text-label-md text-on-surface font-semibold truncate">Julián Restrepo Cano</span>
<span class="text-on-surface-variant font-label-sm text-label-sm font-mono">(MNZ-0418)</span>
</div>
<div class="font-label-sm text-label-sm text-error flex items-center gap-0.5 font-medium">
<span class="material-symbols-outlined text-[14px]">event_busy</span> Venció Alturas (Res. 4272): Hace 4 días
                </div>
</div>
</div>
<button class="bg-surface-container-lowest text-primary hover:bg-primary hover:text-on-primary font-label-sm text-label-sm px-xs py-1 rounded shadow-sm shrink-0 font-medium transition-colors" type="button">
              Agendar Cupo
            </button>
</div>
<!-- Item 2: Inducción ingreso pendiente -->
<div class="p-sm rounded-lg bg-surface-container-low flex items-center justify-between gap-base">
<div class="flex items-center gap-sm">
<div class="w-9 h-9 rounded-full bg-surface-container-high text-primary flex items-center justify-center font-bold text-label-md shrink-0">
                MA
              </div>
<div class="min-w-0">
<div class="flex items-center gap-xs">
<span class="font-label-md text-label-md text-on-surface font-semibold truncate">Marlon Arias Quintero</span>
<span class="text-on-surface-variant font-label-sm text-label-sm font-mono">(MNZ-0592)</span>
</div>
<div class="font-label-sm text-label-sm text-on-surface-variant flex items-center gap-0.5">
<span class="material-symbols-outlined text-[14px]">pending_actions</span> Ingreso 15/Oct • Inducción SG-SST pendiente
                </div>
</div>
</div>
<button class="bg-surface-container-lowest text-primary hover:bg-primary hover:text-on-primary font-label-sm text-label-sm px-xs py-1 rounded shadow-sm shrink-0 font-medium transition-colors" type="button">
              Iniciar Inducción
            </button>
</div>
<!-- Item 3: Tractorista Reentrenamiento anual -->
<div class="p-sm rounded-lg bg-surface-container-low flex items-center justify-between gap-base">
<div class="flex items-center gap-sm">
<div class="w-9 h-9 rounded-full bg-secondary-fixed text-on-secondary-fixed flex items-center justify-center font-bold text-label-md shrink-0">
                OG
              </div>
<div class="min-w-0">
<div class="flex items-center gap-xs">
<span class="font-label-md text-label-md text-on-surface font-semibold truncate">Oscar Gil Henao</span>
<span class="text-on-surface-variant font-label-sm text-label-sm font-mono">(MNZ-0129)</span>
</div>
<div class="font-label-sm text-label-sm text-secondary flex items-center gap-0.5 font-medium">
<span class="material-symbols-outlined text-[14px]">alarm</span> Reentrenamiento Tractorista vence en 6 días
                </div>
</div>
</div>
<button class="bg-surface-container-lowest text-primary hover:bg-primary hover:text-on-primary font-label-sm text-label-sm px-xs py-1 rounded shadow-sm shrink-0 font-medium transition-colors" type="button">
              Notificar
            </button>
</div>
</div>
</div>
<div class="pt-base mt-base flex items-center justify-between font-label-sm text-label-sm text-on-surface-variant">
<span class="flex items-center gap-xs text-error font-medium">
<span class="material-symbols-outlined text-[16px]">lock</span> Ingreso a campo restringido por SIS-BIO
        </span>
<button class="text-primary font-semibold hover:underline" type="button">Ver protocolo</button>
</div>
</div>
</section>
<!-- SELECTOR DE TEMAS NORMATIVOS & FILTROS OPERATIVOS -->
<section class="bg-surface-container-lowest p-md rounded-xl shadow-sm mb-md">
<!-- Pestañas horizontales scrolleables de Temas Requeridos -->
<div class="flex items-center justify-between gap-base pb-base">
<span class="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider font-semibold">
        Módulos Temáticos de Capacitación Obligatoria
      </span>
<span class="font-label-sm text-label-sm text-secondary font-medium">17 Módulos Parametrizados</span>
</div>
<!-- Pills selector -->
<div class="flex items-center gap-xs overflow-x-auto pb-xs mb-md -mx-xs px-xs" style="scrollbar-width: none;">
<button class="bg-primary text-on-primary px-sm py-1.5 rounded-full font-label-sm text-label-sm whitespace-nowrap shadow-sm font-medium" type="button">
        Todos los temas (128)
      </button>
<button class="bg-surface-container-low hover:bg-surface-container text-on-surface px-sm py-1.5 rounded-full font-label-sm text-label-sm whitespace-nowrap transition-colors" type="button">
        Inducción (12)
      </button>
<button class="bg-surface-container-low hover:bg-surface-container text-on-surface px-sm py-1.5 rounded-full font-label-sm text-label-sm whitespace-nowrap transition-colors" type="button">
        Reinducción (24)
      </button>
<button class="bg-surface-container-low hover:bg-surface-container text-on-surface px-sm py-1.5 rounded-full font-label-sm text-label-sm whitespace-nowrap transition-colors" type="button">
        Alturas (Res. 4272)
      </button>
<button class="bg-surface-container-low hover:bg-surface-container text-on-surface px-sm py-1.5 rounded-full font-label-sm text-label-sm whitespace-nowrap transition-colors" type="button">
        Tractor / Operadores
      </button>
<button class="bg-surface-container-low hover:bg-surface-container text-on-surface px-sm py-1.5 rounded-full font-label-sm text-label-sm whitespace-nowrap transition-colors" type="button">
        PESV (Seguridad Vial)
      </button>
<button class="bg-surface-container-low hover:bg-surface-container text-on-surface px-sm py-1.5 rounded-full font-label-sm text-label-sm whitespace-nowrap transition-colors" type="button">
        Emergencias
      </button>
<button class="bg-surface-container-low hover:bg-surface-container text-on-surface px-sm py-1.5 rounded-full font-label-sm text-label-sm whitespace-nowrap transition-colors" type="button">
        Primeros Auxilios
      </button>
<button class="bg-surface-container-low hover:bg-surface-container text-on-surface px-sm py-1.5 rounded-full font-label-sm text-label-sm whitespace-nowrap transition-colors" type="button">
        EPP
      </button>
<button class="bg-surface-container-low hover:bg-surface-container text-on-surface px-sm py-1.5 rounded-full font-label-sm text-label-sm whitespace-nowrap transition-colors" type="button">
        Químicos (SGA)
      </button>
<button class="bg-surface-container-low hover:bg-surface-container text-on-surface px-sm py-1.5 rounded-full font-label-sm text-label-sm whitespace-nowrap transition-colors" type="button">
        Biomecánico &amp; Ergonomía
      </button>
<button class="bg-surface-container-low hover:bg-surface-container text-on-surface px-sm py-1.5 rounded-full font-label-sm text-label-sm whitespace-nowrap transition-colors" type="button">
        Psicosocial &amp; Salud Mental
      </button>
<button class="bg-surface-container-low hover:bg-surface-container text-on-surface px-sm py-1.5 rounded-full font-label-sm text-label-sm whitespace-nowrap transition-colors" type="button">
        SST General
      </button>
<button class="bg-surface-container-low hover:bg-surface-container text-on-surface px-sm py-1.5 rounded-full font-label-sm text-label-sm whitespace-nowrap transition-colors" type="button">
        Brigada de Emergencia
      </button>
<button class="bg-surface-container-low hover:bg-surface-container text-on-surface px-sm py-1.5 rounded-full font-label-sm text-label-sm whitespace-nowrap transition-colors" type="button">
        COPASST
      </button>
<button class="bg-surface-container-low hover:bg-surface-container text-on-surface px-sm py-1.5 rounded-full font-label-sm text-label-sm whitespace-nowrap transition-colors" type="button">
        CCL (Convivencia)
      </button>
</div>
<!-- Filtros Secundarios Paramétricos -->
<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-sm pt-base bg-surface-container-low/50 p-sm rounded-lg">
<!-- Filtro Finca / Sede -->
<div class="flex flex-col gap-xs">
<label class="font-label-sm text-label-sm text-on-surface-variant font-medium">Sede / Finca Agroindustrial</label>
<div class="relative">
<select class="w-full bg-surface-container-lowest text-on-surface font-body-sm text-body-sm px-sm py-2 rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-secondary cursor-pointer shadow-sm">
<option>Todas las Sedes (Fincas La Virginia, Bellavista, El Prado, Central)</option>
<option>Finca La Virginia (Sector Palma)</option>
<option>Finca Bellavista (Sector Banano &amp; Cítricos)</option>
<option>Finca El Prado (Área Maquinaria)</option>
<option>Oficina Administrativa / Central</option>
</select>
<span class="material-symbols-outlined absolute right-sm top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none text-[18px]">expand_more</span>
</div>
</div>
<!-- Filtro Modalidad -->
<div class="flex flex-col gap-xs">
<label class="font-label-sm text-label-sm text-on-surface-variant font-medium">Modalidad Formativa</label>
<div class="relative">
<select class="w-full bg-surface-container-lowest text-on-surface font-body-sm text-body-sm px-sm py-2 rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-secondary cursor-pointer shadow-sm">
<option>Todas las modalidades</option>
<option>Práctica en Campo</option>
<option>Presencial / Taller Aula</option>
<option>Teórico - Virtual / E-Learning</option>
<option>Simulacro en Vivo</option>
</select>
<span class="material-symbols-outlined absolute right-sm top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none text-[18px]">expand_more</span>
</div>
</div>
<!-- Filtro Estado Formativo -->
<div class="flex flex-col gap-xs">
<label class="font-label-sm text-label-sm text-on-surface-variant font-medium">Estado de Capacitación</label>
<div class="relative">
<select class="w-full bg-surface-container-lowest text-on-surface font-body-sm text-body-sm px-sm py-2 rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-secondary cursor-pointer shadow-sm">
<option>Todos los estados</option>
<option>Vigente / Realizada (&gt; 60 días)</option>
<option>Por vencer (30 a 60 días)</option>
<option>Alerta crítica (&lt; 30 días)</option>
<option>Vencida / Requerida urgente</option>
<option>Pendiente de ejecución</option>
</select>
<span class="material-symbols-outlined absolute right-sm top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none text-[18px]">expand_more</span>
</div>
</div>
<!-- Búsqueda por Colaborador -->
<div class="flex flex-col gap-xs">
<label class="font-label-sm text-label-sm text-on-surface-variant font-medium">Colaborador / Cédula / Cargo</label>
<div class="relative">
<span class="material-symbols-outlined absolute left-sm top-1/2 -translate-y-1/2 text-on-surface-variant text-[18px]">person_search</span>
<input class="w-full bg-surface-container-lowest text-on-surface font-body-sm text-body-sm pl-9 pr-sm py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary shadow-sm" placeholder="Ej. Carlos Mendoza, MNZ-0231..." type="text"/>
</div>
</div>
</div>
</section>
<!-- BASE MAESTRA DE CAPACITACIONES Y TRAZABILIDAD POR TRABAJADOR -->
<section class="bg-surface-container-lowest rounded-xl shadow-sm overflow-hidden mb-xl">
<div class="p-md pb-base flex flex-col sm:flex-row sm:items-center justify-between gap-base">
<div>
<h2 class="font-headline-md text-headline-md text-primary">
          Base Maestra de Capacitaciones &amp; Matriz Individual
        </h2>
<p class="font-body-sm text-body-sm text-on-surface-variant">
          Registro auditable con soporte probatorio de asistencia F-SST-004 y certificación con validez legal.
        </p>
</div>
<div class="flex items-center gap-xs">
<span class="font-label-sm text-label-sm text-on-surface-variant">Mostrando <strong>6</strong> de <strong>142</strong> registros</span>
<button class="p-xs text-on-surface-variant hover:text-primary rounded-lg bg-surface-container-low transition-colors" type="button">
<span class="material-symbols-outlined text-[20px]">refresh</span>
</button>
</div>
</div>
<!-- TABLA PARAMÉTRICA CON DENSIDAD ACADÉMICA -->
<div class="overflow-x-auto">
<table class="w-full text-left font-body-sm text-body-sm">
<thead class="bg-surface-container-low text-on-surface-variant font-label-sm text-label-sm uppercase tracking-wider">
<tr>
<th class="py-sm px-md font-semibold">Trabajador &amp; Finca</th>
<th class="py-sm px-sm font-semibold">Tema / Módulo Normativo</th>
<th class="py-sm px-sm font-semibold">Ejecución &amp; HHC</th>
<th class="py-sm px-sm font-semibold">Instructor / Entidad</th>
<th class="py-sm px-sm font-semibold">Modalidad</th>
<th class="py-sm px-sm font-semibold text-center">Evidencia</th>
<th class="py-sm px-sm font-semibold text-center">Certificado</th>
<th class="py-sm px-sm font-semibold">Vigencia / Reentrenamiento</th>
<th class="py-sm px-md font-semibold text-right">Estado</th>
</tr>
</thead>
<tbody class="text-on-surface">
<!-- REGISTRO 1: Alturas Avanzado / Vigente Verde -->
<tr class="hover:bg-surface-container-low/40 transition-colors">
<td class="py-base px-md">
<div class="flex items-center gap-sm">
<div class="w-8 h-8 rounded-full bg-primary text-on-primary flex items-center justify-center font-label-md text-label-md font-semibold shrink-0">
                  CM
                </div>
<div class="flex flex-col min-w-0">
<span class="font-label-md text-label-md font-semibold text-on-surface truncate">Carlos Arturo Mendoza</span>
<div class="flex items-center gap-xs text-on-surface-variant font-label-sm text-label-sm">
<span class="font-mono text-secondary font-medium">MNZ-0231</span>
<span>•</span>
<span>Podador de Altura</span>
</div>
<span class="text-[11px] text-on-surface-variant">Finca La Virginia</span>
</div>
</div>
</td>
<td class="py-base px-sm">
<span class="inline-block bg-primary-fixed text-on-primary-fixed font-label-sm text-label-sm px-xs py-0.5 rounded font-medium mb-0.5">
                Res. 4272/21 Alturas
              </span>
<div class="font-label-sm text-label-sm text-on-surface">Trabajo Seguro en Alturas - Avanzado</div>
</td>
<td class="py-base px-sm">
<div class="font-label-md text-label-md font-medium text-on-surface">14/Oct/2024</div>
<div class="font-label-sm text-label-sm text-secondary font-semibold">8 Horas Formación</div>
</td>
<td class="py-base px-sm">
<div class="font-label-sm text-label-sm font-semibold text-on-surface">Ing. Maritza Valdés</div>
<div class="font-label-sm text-label-sm text-on-surface-variant">Lic. SST 4589-21 (ARL Sura)</div>
</td>
<td class="py-base px-sm">
<span class="inline-flex items-center gap-xs bg-surface-container-high text-on-surface font-label-sm text-label-sm px-xs py-0.5 rounded">
<span class="material-symbols-outlined text-[14px]">landscape</span> Práctica en Campo
              </span>
</td>
<td class="py-base px-sm text-center">
<button class="p-1 rounded-lg bg-surface-container-low hover:bg-surface-container text-primary transition-colors inline-flex items-center" title="Ver Planilla Foliada F-004" type="button">
<span class="material-symbols-outlined text-[18px]">assignment_turned_in</span>
</button>
</td>
<td class="py-base px-sm text-center">
<button class="inline-flex items-center gap-xs bg-surface-container-low hover:bg-primary hover:text-on-primary text-primary px-xs py-1 rounded font-label-sm text-label-sm font-medium transition-colors shadow-sm" title="Descargar Certificado Verificado" type="button">
<span class="material-symbols-outlined text-[16px]">verified</span>
<span>ID-8921</span>
</button>
</td>
<td class="py-base px-sm">
<div class="flex items-center gap-xs">
<span class="w-2.5 h-2.5 rounded-full bg-secondary"></span>
<span class="font-label-sm text-label-sm font-semibold text-on-surface">14/Oct/2025</span>
</div>
<div class="font-label-sm text-label-sm text-on-surface-variant pl-base">360 días restantes</div>
</td>
<td class="py-base px-md text-right">
<span class="inline-block bg-surface-container-high text-primary font-label-sm text-label-sm px-sm py-1 rounded-full font-semibold">
                Realizada / Vigente
              </span>
</td>
</tr>
<!-- REGISTRO 2: Riesgo Químico SGA / Alerta Amarilla (Vence en 45 días) -->
<tr class="bg-surface-container-low/20 hover:bg-surface-container-low/50 transition-colors">
<td class="py-base px-md">
<div class="flex items-center gap-sm">
<div class="w-8 h-8 rounded-full bg-secondary-container text-on-secondary-container flex items-center justify-center font-label-md text-label-md font-semibold shrink-0">
                  DR
                </div>
<div class="flex flex-col min-w-0">
<span class="font-label-md text-label-md font-semibold text-on-surface truncate">Darío Rincón Pineda</span>
<div class="flex items-center gap-xs text-on-surface-variant font-label-sm text-label-sm">
<span class="font-mono text-secondary font-medium">MNZ-0114</span>
<span>•</span>
<span>Fumigador / Aplicador</span>
</div>
<span class="text-[11px] text-on-surface-variant">Finca Bellavista</span>
</div>
</div>
</td>
<td class="py-base px-sm">
<span class="inline-block bg-surface-container-highest text-on-surface font-label-sm text-label-sm px-xs py-0.5 rounded font-medium mb-0.5">
                Químicos (SGA)
              </span>
<div class="font-label-sm text-label-sm text-on-surface">Manejo de Fitosanitarios &amp; FDS</div>
</td>
<td class="py-base px-sm">
<div class="font-label-md text-label-md font-medium text-on-surface">28/Nov/2023</div>
<div class="font-label-sm text-label-sm text-secondary font-semibold">4 Horas Formación</div>
</td>
<td class="py-base px-sm">
<div class="font-label-sm text-label-sm font-semibold text-on-surface">Ing. Agr. Jaime Osorio</div>
<div class="font-label-sm text-label-sm text-on-surface-variant">Esp. Toxicología Laboral</div>
</td>
<td class="py-base px-sm">
<span class="inline-flex items-center gap-xs bg-surface-container-high text-on-surface font-label-sm text-label-sm px-xs py-0.5 rounded">
<span class="material-symbols-outlined text-[14px]">groups</span> Taller Presencial
              </span>
</td>
<td class="py-base px-sm text-center">
<button class="p-1 rounded-lg bg-surface-container-low hover:bg-surface-container text-primary transition-colors inline-flex items-center" title="Ver Planilla Foliada F-004" type="button">
<span class="material-symbols-outlined text-[18px]">assignment_turned_in</span>
</button>
</td>
<td class="py-base px-sm text-center">
<button class="inline-flex items-center gap-xs bg-surface-container-low hover:bg-primary hover:text-on-primary text-primary px-xs py-1 rounded font-label-sm text-label-sm font-medium transition-colors shadow-sm" title="Descargar Certificado Verificado" type="button">
<span class="material-symbols-outlined text-[16px]">verified</span>
<span>ID-7740</span>
</button>
</td>
<td class="py-base px-sm">
<div class="flex items-center gap-xs">
<span class="w-2.5 h-2.5 rounded-full bg-secondary-container"></span>
<span class="font-label-sm text-label-sm font-semibold text-on-surface">28/Nov/2024</span>
</div>
<div class="font-label-sm text-label-sm text-secondary-container pl-base font-medium">42 días restantes</div>
</td>
<td class="py-base px-md text-right">
<span class="inline-block bg-secondary-fixed text-on-secondary-fixed font-label-sm text-label-sm px-sm py-1 rounded-full font-semibold">
                Próxima a Reentrenar
              </span>
</td>
</tr>
<!-- REGISTRO 3: Tractoristas / Alerta Naranja (<30 días) -->
<tr class="hover:bg-surface-container-low/40 transition-colors">
<td class="py-base px-md">
<div class="flex items-center gap-sm">
<div class="w-8 h-8 rounded-full bg-surface-container-highest text-primary flex items-center justify-center font-label-md text-label-md font-semibold shrink-0">
                  OG
                </div>
<div class="flex flex-col min-w-0">
<span class="font-label-md text-label-md font-semibold text-on-surface truncate">Oscar Gil Henao</span>
<div class="flex items-center gap-xs text-on-surface-variant font-label-sm text-label-sm">
<span class="font-mono text-secondary font-medium">MNZ-0129</span>
<span>•</span>
<span>Operador de Tractor</span>
</div>
<span class="text-[11px] text-on-surface-variant">Finca El Prado</span>
</div>
</div>
</td>
<td class="py-base px-sm">
<span class="inline-block bg-surface-container-highest text-on-surface font-label-sm text-label-sm px-xs py-0.5 rounded font-medium mb-0.5">
                Tractor / PESV
              </span>
<div class="font-label-sm text-label-sm text-on-surface">Vuelco, Toma de Fuerza y Maniobra</div>
</td>
<td class="py-base px-sm">
<div class="font-label-md text-label-md font-medium text-on-surface">22/Oct/2023</div>
<div class="font-label-sm text-label-sm text-secondary font-semibold">6 Horas Formación</div>
</td>
<td class="py-base px-sm">
<div class="font-label-sm text-label-sm font-semibold text-on-surface">SENA Regional Caldas</div>
<div class="font-label-sm text-label-sm text-on-surface-variant">Convenio Agroindustrial</div>
</td>
<td class="py-base px-sm">
<span class="inline-flex items-center gap-xs bg-surface-container-high text-on-surface font-label-sm text-label-sm px-xs py-0.5 rounded">
<span class="material-symbols-outlined text-[14px]">agriculture</span> Práctica en Maquinaria
              </span>
</td>
<td class="py-base px-sm text-center">
<button class="p-1 rounded-lg bg-surface-container-low hover:bg-surface-container text-primary transition-colors inline-flex items-center" title="Ver Planilla Foliada F-004" type="button">
<span class="material-symbols-outlined text-[18px]">assignment_turned_in</span>
</button>
</td>
<td class="py-base px-sm text-center">
<button class="inline-flex items-center gap-xs bg-surface-container-low hover:bg-primary hover:text-on-primary text-primary px-xs py-1 rounded font-label-sm text-label-sm font-medium transition-colors shadow-sm" title="Descargar Certificado Verificado" type="button">
<span class="material-symbols-outlined text-[16px]">verified</span>
<span>ID-6311</span>
</button>
</td>
<td class="py-base px-sm">
<div class="flex items-center gap-xs">
<span class="w-2.5 h-2.5 rounded-full bg-error"></span>
<span class="font-label-sm text-label-sm font-semibold text-error">22/Oct/2024</span>
</div>
<div class="font-label-sm text-label-sm text-error pl-base font-semibold">6 días restantes</div>
</td>
<td class="py-base px-md text-right">
<span class="inline-block bg-error-container text-on-error-container font-label-sm text-label-sm px-sm py-1 rounded-full font-bold">
                Alerta Crítica
              </span>
</td>
</tr>
<!-- REGISTRO 4: Alturas Vencido Rojo -->
<tr class="bg-error-container/20 hover:bg-error-container/30 transition-colors">
<td class="py-base px-md">
<div class="flex items-center gap-sm">
<div class="w-8 h-8 rounded-full bg-error text-on-error flex items-center justify-center font-label-md text-label-md font-semibold shrink-0">
                  JR
                </div>
<div class="flex flex-col min-w-0">
<span class="font-label-md text-label-md font-semibold text-on-surface truncate">Julián Restrepo Cano</span>
<div class="flex items-center gap-xs text-on-surface-variant font-label-sm text-label-sm">
<span class="font-mono text-error font-bold">MNZ-0418</span>
<span>•</span>
<span>Operario Cosecha Alturas</span>
</div>
<span class="text-[11px] text-error font-medium">Finca La Virginia (Bloqueado)</span>
</div>
</div>
</td>
<td class="py-base px-sm">
<span class="inline-block bg-error text-on-error font-label-sm text-label-sm px-xs py-0.5 rounded font-medium mb-0.5">
                Res. 4272/21 Alturas
              </span>
<div class="font-label-sm text-label-sm text-on-surface">Reentrenamiento Anual Obligatorio</div>
</td>
<td class="py-base px-sm">
<div class="font-label-md text-label-md font-medium text-error">12/Oct/2023</div>
<div class="font-label-sm text-label-sm text-on-surface-variant">8 Horas Formación</div>
</td>
<td class="py-base px-sm">
<div class="font-label-sm text-label-sm font-semibold text-on-surface">Centro Entrenamiento Cafetero</div>
<div class="font-label-sm text-label-sm text-on-surface-variant">Certificación MinTrabajo</div>
</td>
<td class="py-base px-sm">
<span class="inline-flex items-center gap-xs bg-surface-container-high text-on-surface font-label-sm text-label-sm px-xs py-0.5 rounded">
<span class="material-symbols-outlined text-[14px]">landscape</span> Práctica en Torre
              </span>
</td>
<td class="py-base px-sm text-center">
<button class="p-1 rounded-lg bg-surface-container-low hover:bg-surface-container text-on-surface-variant inline-flex items-center" title="Planilla Anterior" type="button">
<span class="material-symbols-outlined text-[18px]">receipt_long</span>
</button>
</td>
<td class="py-base px-sm text-center">
<span class="font-label-sm text-label-sm text-error font-bold flex items-center justify-center gap-0.5">
<span class="material-symbols-outlined text-[16px]">block</span> Caducado
              </span>
</td>
<td class="py-base px-sm">
<div class="flex items-center gap-xs">
<span class="w-2.5 h-2.5 rounded-full bg-error"></span>
<span class="font-label-sm text-label-sm font-semibold text-error">12/Oct/2024</span>
</div>
<div class="font-label-sm text-label-sm text-error pl-base font-bold">Venció hace 4 días</div>
</td>
<td class="py-base px-md text-right">
<span class="inline-block bg-error text-on-error font-label-sm text-label-sm px-sm py-1 rounded-full font-bold shadow-sm">
                Vencida • Bloqueo
              </span>
</td>
</tr>
<!-- REGISTRO 5: Biomecánico & Ergonomía / Realizada -->
<tr class="hover:bg-surface-container-low/40 transition-colors">
<td class="py-base px-md">
<div class="flex items-center gap-sm">
<div class="w-8 h-8 rounded-full bg-primary-container text-on-primary flex items-center justify-center font-label-md text-label-md font-semibold shrink-0">
                  SL
                </div>
<div class="flex flex-col min-w-0">
<span class="font-label-md text-label-md font-semibold text-on-surface truncate">Sandra Liliana Morales</span>
<div class="flex items-center gap-xs text-on-surface-variant font-label-sm text-label-sm">
<span class="font-mono text-secondary font-medium">MNZ-0388</span>
<span>•</span>
<span>Clasificadora Pos-cosecha</span>
</div>
<span class="text-[11px] text-on-surface-variant">Planta Central Empaque</span>
</div>
</div>
</td>
<td class="py-base px-sm">
<span class="inline-block bg-surface-container-highest text-on-surface font-label-sm text-label-sm px-xs py-0.5 rounded font-medium mb-0.5">
                Biomecánico
              </span>
<div class="font-label-sm text-label-sm text-on-surface">Ergonomía, Pausas Activas &amp; Cargas</div>
</td>
<td class="py-base px-sm">
<div class="font-label-md text-label-md font-medium text-on-surface">02/Oct/2024</div>
<div class="font-label-sm text-label-sm text-secondary font-semibold">2 Horas Taller</div>
</td>
<td class="py-base px-sm">
<div class="font-label-sm text-label-sm font-semibold text-on-surface">Ft. Diana Ospina</div>
<div class="font-label-sm text-label-sm text-on-surface-variant">Fisioterapeuta Ocupacional ARL</div>
</td>
<td class="py-base px-sm">
<span class="inline-flex items-center gap-xs bg-surface-container-high text-on-surface font-label-sm text-label-sm px-xs py-0.5 rounded">
<span class="material-symbols-outlined text-[14px]">sports_gymnastics</span> Taller en Puesto
              </span>
</td>
<td class="py-base px-sm text-center">
<button class="p-1 rounded-lg bg-surface-container-low hover:bg-surface-container text-primary transition-colors inline-flex items-center" title="Ver Firma Digital Biométrica" type="button">
<span class="material-symbols-outlined text-[18px]">qr_code_2</span>
</button>
</td>
<td class="py-base px-sm text-center">
<button class="inline-flex items-center gap-xs bg-surface-container-low hover:bg-primary hover:text-on-primary text-primary px-xs py-1 rounded font-label-sm text-label-sm font-medium transition-colors shadow-sm" title="Descargar Certificado Verificado" type="button">
<span class="material-symbols-outlined text-[16px]">verified</span>
<span>ID-9042</span>
</button>
</td>
<td class="py-base px-sm">
<div class="flex items-center gap-xs">
<span class="w-2.5 h-2.5 rounded-full bg-secondary"></span>
<span class="font-label-sm text-label-sm font-semibold text-on-surface">02/Oct/2025</span>
</div>
<div class="font-label-sm text-label-sm text-on-surface-variant pl-base">348 días restantes</div>
</td>
<td class="py-base px-md text-right">
<span class="inline-block bg-surface-container-high text-primary font-label-sm text-label-sm px-sm py-1 rounded-full font-semibold">
                Realizada / Vigente
              </span>
</td>
</tr>
<!-- REGISTRO 6: Inducción Ingreso / Pendiente de Ejecución -->
<tr class="bg-surface-container-low/20 hover:bg-surface-container-low/50 transition-colors">
<td class="py-base px-md">
<div class="flex items-center gap-sm">
<div class="w-8 h-8 rounded-full bg-surface-container-highest text-on-surface font-semibold flex items-center justify-center font-label-md text-label-md shrink-0">
                  MA
                </div>
<div class="flex flex-col min-w-0">
<span class="font-label-md text-label-md font-semibold text-on-surface truncate">Marlon Arias Quintero</span>
<div class="flex items-center gap-xs text-on-surface-variant font-label-sm text-label-sm">
<span class="font-mono text-secondary font-medium">MNZ-0592</span>
<span>•</span>
<span>Recolector Cosecha</span>
</div>
<span class="text-[11px] text-on-surface-variant">Finca La Virginia (Ingreso Reciente)</span>
</div>
</div>
</td>
<td class="py-base px-sm">
<span class="inline-block bg-surface-container-high text-primary font-label-sm text-label-sm px-xs py-0.5 rounded font-semibold mb-0.5">
                Inducción General
              </span>
<div class="font-label-sm text-label-sm text-on-surface">Política SST, Riesgos y Emergencias</div>
</td>
<td class="py-base px-sm">
<div class="font-label-md text-label-md font-medium text-on-surface">Programada 17/Oct</div>
<div class="font-label-sm text-label-sm text-on-surface-variant">4 Horas Programadas</div>
</td>
<td class="py-base px-sm">
<div class="font-label-sm text-label-sm font-semibold text-on-surface">Ing. Andrés Valencia</div>
<div class="font-label-sm text-label-sm text-on-surface-variant">Coordinador SST Manzanares</div>
</td>
<td class="py-base px-sm">
<span class="inline-flex items-center gap-xs bg-surface-container-high text-on-surface font-label-sm text-label-sm px-xs py-0.5 rounded">
<span class="material-symbols-outlined text-[14px]">school</span> Teórico-Práctico
              </span>
</td>
<td class="py-base px-sm text-center">
<span class="text-on-surface-variant font-label-sm text-label-sm">—</span>
</td>
<td class="py-base px-sm text-center">
<span class="text-on-surface-variant font-label-sm text-label-sm">—</span>
</td>
<td class="py-base px-sm">
<div class="flex items-center gap-xs">
<span class="w-2.5 h-2.5 rounded-full bg-surface-container-highest"></span>
<span class="font-label-sm text-label-sm text-on-surface-variant">Pendiente Sesión</span>
</div>
<div class="font-label-sm text-label-sm text-secondary pl-base font-semibold">Citado Jueves 07:00</div>
</td>
<td class="py-base px-md text-right">
<span class="inline-block bg-surface-container text-on-surface-variant font-label-sm text-label-sm px-sm py-1 rounded-full font-semibold">
                Pendiente Ingreso
              </span>
</td>
</tr>
</tbody>
</table>
</div>
<!-- Paginación y Control de Lote -->
<div class="p-md pt-base flex flex-col sm:flex-row sm:items-center justify-between gap-base bg-surface-container-low/30">
<div class="flex items-center gap-sm">
<span class="font-label-sm text-label-sm text-on-surface-variant">Registros por página:</span>
<select class="bg-surface-container-lowest text-on-surface font-label-sm text-label-sm px-xs py-1 rounded-lg focus:outline-none focus:ring-1 focus:ring-secondary cursor-pointer shadow-sm">
<option>25</option>
<option>50</option>
<option>100</option>
</select>
<span class="font-label-sm text-label-sm text-on-surface-variant">Total: 142 trabajadores en nómina</span>
</div>
<div class="flex items-center gap-xs">
<button class="p-xs rounded-lg bg-surface-container-lowest text-on-surface-variant hover:text-primary shadow-sm disabled:opacity-40" disabled="" type="button">
<span class="material-symbols-outlined text-[18px]">first_page</span>
</button>
<button class="p-xs rounded-lg bg-surface-container-lowest text-on-surface-variant hover:text-primary shadow-sm disabled:opacity-40" disabled="" type="button">
<span class="material-symbols-outlined text-[18px]">chevron_left</span>
</button>
<span class="font-label-sm text-label-sm px-sm py-1 rounded-lg bg-primary text-on-primary font-medium">1</span>
<span class="font-label-sm text-label-sm px-sm py-1 rounded-lg bg-surface-container-lowest text-on-surface hover:bg-surface-container-high cursor-pointer shadow-sm">2</span>
<span class="font-label-sm text-label-sm px-sm py-1 rounded-lg bg-surface-container-lowest text-on-surface hover:bg-surface-container-high cursor-pointer shadow-sm">3</span>
<span class="font-label-sm text-label-sm text-on-surface-variant">...</span>
<span class="font-label-sm text-label-sm px-sm py-1 rounded-lg bg-surface-container-lowest text-on-surface hover:bg-surface-container-high cursor-pointer shadow-sm">6</span>
<button class="p-xs rounded-lg bg-surface-container-lowest text-on-surface-variant hover:text-primary shadow-sm" type="button">
<span class="material-symbols-outlined text-[18px]">chevron_right</span>
</button>
<button class="p-xs rounded-lg bg-surface-container-lowest text-on-surface-variant hover:text-primary shadow-sm" type="button">
<span class="material-symbols-outlined text-[18px]">last_page</span>
</button>
</div>
</div>
</section>
<!-- MODAL / DRAWER PROTOTIPO RÁPIDO PARA "+ REGISTRAR CAPACITACIÓN" (INTERACCIÓN CLIENTE) -->
<div class="fixed inset-0 bg-inverse-surface/40 backdrop-blur-sm z-50 flex items-center justify-center p-gutter hidden" id="modal-registro">
<div class="bg-surface-container-lowest rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-md space-y-md">
<div class="flex items-center justify-between pb-xs border-b-0">
<div>
<h3 class="font-headline-md text-headline-md text-primary">Registrar Nueva Sesión de Capacitación</h3>
<p class="font-body-sm text-body-sm text-on-surface-variant">Fomulario de captura del plan anual con trazabilidad MinTrabajo.</p>
</div>
<button class="text-on-surface-variant hover:text-on-surface p-xs rounded-lg" id="close-modal" type="button">
<span class="material-symbols-outlined">close</span>
</button>
</div>
<div class="grid grid-cols-1 sm:grid-cols-2 gap-base font-body-sm text-body-sm">
<div class="flex flex-col gap-xs">
<label class="font-label-sm text-label-sm font-semibold text-on-surface">Módulo / Tema Obligatorio</label>
<select class="bg-surface-container-low p-2 rounded-lg text-on-surface focus:outline-none focus:ring-2 focus:ring-secondary">
<option>Trabajo en Alturas (Res. 4272/2021)</option>
<option>Operación Segura de Maquinaria y Tractor</option>
<option>Seguridad Vial PESV</option>
<option>Manejo Seguro de Químicos (SGA)</option>
<option>Inducción SG-SST Ingreso</option>
<option>Brigada de Emergencias y Rescate</option>
</select>
</div>
<div class="flex flex-col gap-xs">
<label class="font-label-sm text-label-sm font-semibold text-on-surface">Finca / Locación</label>
<select class="bg-surface-container-low p-2 rounded-lg text-on-surface focus:outline-none focus:ring-2 focus:ring-secondary">
<option>Finca La Virginia (Sector Palma)</option>
<option>Finca Bellavista (Banano)</option>
<option>Finca El Prado (Taller Maquinaria)</option>
<option>Oficina Administrativa / Auditorio</option>
</select>
</div>
<div class="flex flex-col gap-xs">
<label class="font-label-sm text-label-sm font-semibold text-on-surface">Fecha Programada</label>
<input class="bg-surface-container-low p-2 rounded-lg text-on-surface focus:outline-none focus:ring-2 focus:ring-secondary" type="date" value="2024-10-25"/>
</div>
<div class="flex flex-col gap-xs">
<label class="font-label-sm text-label-sm font-semibold text-on-surface">Intensidad Horaria</label>
<input class="bg-surface-container-low p-2 rounded-lg text-on-surface focus:outline-none focus:ring-2 focus:ring-secondary" placeholder="Ej. 4 horas" type="number" value="4"/>
</div>
<div class="sm:col-span-2 flex flex-col gap-xs">
<label class="font-label-sm text-label-sm font-semibold text-on-surface">Instructor / Facilitador &amp; Licencia SST</label>
<input class="bg-surface-container-low p-2 rounded-lg text-on-surface focus:outline-none focus:ring-2 focus:ring-secondary" placeholder="Nombre completo del instructor y número de licencia SST o entidad (SENA, ARL)" type="text"/>
</div>
</div>
<div class="flex items-center justify-end gap-xs pt-base">
<button class="px-sm py-base rounded-lg bg-surface-container-low text-on-surface font-label-md text-label-md hover:bg-surface-container" id="cancel-modal" type="button">
          Cancelar
        </button>
<button class="px-sm py-base rounded-lg bg-primary text-on-primary font-label-md text-label-md hover:bg-primary-container shadow-sm font-medium" onclick="alert('Capacitación registrada satisfactoriamente en el cronograma anual.'); document.getElementById('modal-registro').classList.add('hidden');" type="button">
          Guardar y Generar Convocatoria
        </button>
</div>
</div>
</div>
<script>
    // Microinteracción para abrir/cerrar modal de registro
    document.addEventListener('DOMContentLoaded', () => {
      const regBtn = document.querySelector('button:has(span:contains("+ Registrar Capacitación")), button:contains("+ Registrar Capacitación")') || 
                     Array.from(document.querySelectorAll('button')).find(el => el.textContent.includes('Registrar Capacitación'));
      const modal = document.getElementById('modal-registro');
      const closeBtn = document.getElementById('close-modal');
      const cancelBtn = document.getElementById('cancel-modal');

      if (regBtn && modal) {
        regBtn.addEventListener('click', () => modal.classList.remove('hidden'));
      }
      if (closeBtn && modal) {
        closeBtn.addEventListener('click', () => modal.classList.add('hidden'));
      }
      if (cancelBtn && modal) {
        cancelBtn.addEventListener('click', () => modal.classList.add('hidden'));
      }
    });

  </script>
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
  }</script></head><body class="bg-background font-body-md text-body-md text-on-surface antialiased"><aside class="fixed left-0 top-0 h-full w-72 bg-surface-container-lowest shadow-[0_1px_8px_rgba(0,0,0,0.04)] z-50 flex flex-col justify-between overflow-y-auto"><div class="p-gutter pb-0"><div class="flex items-center gap-base mb-xs"><div class="w-8 h-8 rounded bg-primary-container flex items-center justify-center text-on-primary font-headline-md text-headline-md">M</div><div class="flex flex-col"><span class="font-label-md text-label-md text-primary leading-tight font-semibold">Grupo Manzanares S.A.S.</span><span class="font-label-sm text-label-sm text-on-surface-variant">SG-SST Operativo</span></div></div><div class="flex items-center gap-xs mt-base mb-md"><span class="bg-surface-container-high text-on-surface font-label-sm text-label-sm px-xs py-0.5 rounded">Dec. 1072</span><span class="bg-surface-container-high text-on-surface font-label-sm text-label-sm px-xs py-0.5 rounded">Res. 0312</span></div></div><nav class="flex-1 px-sm pb-gutter flex flex-col gap-base" data-active-classes="bg-primary-container text-on-primary font-medium rounded-lg"><div class="flex flex-col gap-xs"><span class="px-xs font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">Gestión Operativa</span><a class="flex items-center gap-base px-sm py-xs rounded-lg text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-colors font-label-md text-label-md" data-path="dashboard" href="#"><span class="material-symbols-outlined text-[20px]">dashboard</span>Inicio / Dashboard</a><a class="flex items-center gap-base px-sm py-xs rounded-lg text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-colors font-label-md text-label-md" data-path="trabajadores" href="#"><span class="material-symbols-outlined text-[20px]">badge</span>Trabajadores</a><a class="flex items-center gap-base px-sm py-xs rounded-lg text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-colors font-label-md text-label-md" data-path="examenes-medicos" href="#"><span class="material-symbols-outlined text-[20px]">medical_services</span>Exámenes Médicos (EMOS)</a><a class="flex items-center gap-base px-sm py-xs rounded-lg text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-colors font-label-md text-label-md" data-path="casos-de-salud" href="#"><span class="material-symbols-outlined text-[20px]">health_and_safety</span>Casos de Salud</a><a class="flex items-center gap-base px-sm py-xs rounded-lg text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-colors font-label-md text-label-md" data-path="incapacidades-y-reintegros" href="#"><span class="material-symbols-outlined text-[20px]">assignment_return</span>Incapacidades y Reintegros</a></div><div class="flex flex-col gap-xs"><span class="px-xs font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">Riesgos Críticos &amp; Viales</span><a class="flex items-center gap-base px-sm py-xs rounded-lg text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-colors font-label-md text-label-md" data-path="trabajo-en-alturas" href="#"><span class="material-symbols-outlined text-[20px]">height</span>Trabajo en Alturas</a><a class="flex items-center gap-base px-sm py-xs rounded-lg text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-colors font-label-md text-label-md" data-path="tractoristas-operadores" href="#"><span class="material-symbols-outlined text-[20px]">agriculture</span>Tractoristas / Operadores</a><a class="flex items-center gap-base px-sm py-xs rounded-lg text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-colors font-label-md text-label-md" data-path="pesv-seguridad-vial" href="#"><span class="material-symbols-outlined text-[20px]">traffic</span>PESV (Seguridad Vial)</a><a class="flex items-center gap-base px-sm py-xs rounded-lg text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-colors font-label-md text-label-md" data-path="epp" href="#"><span class="material-symbols-outlined text-[20px]">security</span>EPP</a></div><div class="flex flex-col gap-xs"><span class="px-xs font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">Inspección &amp; Eventos</span><a class="flex items-center gap-base px-sm py-xs rounded-lg text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-colors font-label-md text-label-md" data-path="inspecciones" href="#"><span class="material-symbols-outlined text-[20px]">fact_check</span>Inspecciones</a><a class="flex items-center justify-between px-sm py-xs rounded-lg text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-colors font-label-md text-label-md" data-path="accidentes-e-incidentes" href="#"><div class="flex items-center gap-base"><span class="material-symbols-outlined text-[20px]">warning</span>Accidentes e Incidentes</div><span class="bg-error text-on-error font-label-sm text-label-sm px-xs py-0.5 rounded-full">2</span></a><a aria-current="page" class="flex items-center gap-base px-sm py-xs transition-colors bg-primary-container text-on-primary font-medium rounded-lg" data-path="investigaciones" href="#"><span class="material-symbols-outlined text-[20px]">manage_search</span>Investigaciones</a><a class="flex items-center gap-base px-sm py-xs rounded-lg text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-colors font-label-md text-label-md" data-path="acciones-correctivas" href="#"><span class="material-symbols-outlined text-[20px]">check_circle</span>Acciones Correctivas</a></div><div class="flex flex-col gap-xs"><span class="px-xs font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">Comités &amp; Cultura</span><a class="flex items-center gap-base px-sm py-xs rounded-lg text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-colors font-label-md text-label-md" data-path="capacitaciones" href="#"><span class="material-symbols-outlined text-[20px]">school</span>Capacitaciones</a><a class="flex items-center gap-base px-sm py-xs rounded-lg text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-colors font-label-md text-label-md" data-path="documentos-sg-sst" href="#"><span class="material-symbols-outlined text-[20px]">folder_open</span>Documentos SG-SST</a><a class="flex items-center gap-base px-sm py-xs rounded-lg text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-colors font-label-md text-label-md" data-path="copasst" href="#"><span class="material-symbols-outlined text-[20px]">groups</span>COPASST</a><a class="flex items-center gap-base px-sm py-xs rounded-lg text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-colors font-label-md text-label-md" data-path="ccl" href="#"><span class="material-symbols-outlined text-[20px]">handshake</span>CCL</a><a class="flex items-center gap-base px-sm py-xs rounded-lg text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-colors font-label-md text-label-md" data-path="emergencias" href="#"><span class="material-symbols-outlined text-[20px]">emergency</span>Emergencias</a><a class="flex items-center gap-base px-sm py-xs rounded-lg text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-colors font-label-md text-label-md" data-path="quimicos" href="#"><span class="material-symbols-outlined text-[20px]">science</span>Químicos</a></div></nav></aside><div class="pl-72"><header class="fixed top-0 left-72 right-0 h-16 bg-surface-container-lowest/90 backdrop-blur-xl shadow-[0_1px_8px_rgba(0,0,0,0.04)] z-40 flex items-center justify-between px-gutter"><div class="flex items-center gap-md flex-1 max-w-xl"><div class="relative w-full"><span class="material-symbols-outlined absolute left-sm top-1/2 -translate-y-1/2 text-on-surface-variant text-[20px]">search</span><input class="w-full bg-surface-container-low text-on-surface placeholder:text-on-surface-variant pl-10 pr-sm py-xs rounded-lg font-body-sm text-body-sm focus:outline-none focus:ring-2 focus:ring-secondary-container transition-all" placeholder="Buscar trabajadores, incidentes, normativas..." type="search"/></div><div class="flex items-center bg-surface-container-low px-sm py-xs rounded-lg gap-xs shrink-0"><span class="material-symbols-outlined text-[18px] text-on-surface-variant">gavel</span><span class="font-label-sm text-label-sm text-on-surface">Estándares 2024</span><span class="material-symbols-outlined text-[16px] text-on-surface-variant">expand_more</span></div></div><div class="flex items-center gap-base"><button class="flex items-center gap-xs bg-primary-container text-on-primary px-sm py-xs rounded-lg font-label-md text-label-md hover:bg-primary transition-colors" type="button"><span class="material-symbols-outlined text-[18px]">add_alert</span><span>Reporte Rápido / Notificación</span></button><button class="relative w-10 h-10 flex items-center justify-center rounded-lg hover:bg-surface-container-high transition-colors text-on-surface-variant" type="button"><span class="material-symbols-outlined text-[22px]">notifications</span><span class="absolute top-2 right-2 w-2 h-2 rounded-full bg-error"></span></button><div class="flex items-center gap-sm pl-xs"><div class="text-right hidden xl:block"><div class="font-label-md text-label-md text-on-surface font-medium">Ing. Andrés Valencia</div><div class="font-label-sm text-label-sm text-on-surface-variant">Coordinador SG-SST</div></div><div class="w-8 h-8 rounded-full bg-primary flex items-center justify-center"><span class="material-symbols-outlined text-on-primary text-[18px]">person</span></div></div></div></header><main class="w-full px-gutter pt-16 bg-surface min-h-screen"><div class="flex flex-col w-full">
<!-- Script para activar ítem de navegación "Documentos SG-SST" en el App Shell existente -->
<script>
    document.addEventListener('DOMContentLoaded', () => {
      const links = document.querySelectorAll('aside nav a');
      links.forEach(link => {
        if (link.getAttribute('data-path') === 'documentos-sg-sst') {
          link.classList.remove('text-on-surface-variant', 'hover:bg-surface-container');
          link.classList.add('bg-primary-container', 'text-on-primary', 'font-medium', 'rounded-lg');
          const icon = link.querySelector('.material-symbols-outlined');
          if (icon) {
            icon.style.fontVariationSettings = "'FILL' 1";
          }
        }
      });
    });
  </script>
<!-- ENCABEZADO NORMATIVO & PRINCIPIO DOCUMENTAL -->
<header class="mb-gutter">
<div class="flex flex-col xl:flex-row xl:items-start justify-between gap-md pb-md">
<div class="flex flex-col gap-xs max-w-4xl">
<div class="flex items-center gap-xs">
<span class="bg-primary/10 text-primary px-xs py-0.5 rounded font-label-sm text-label-sm uppercase tracking-wider font-semibold">Módulo 19</span>
<span class="text-on-surface-variant font-label-sm text-label-sm">•</span>
<span class="text-on-surface-variant font-label-sm text-label-sm">Auditoría ARL &amp; MinTrabajo</span>
<span class="text-on-surface-variant font-label-sm text-label-sm">•</span>
<span class="bg-surface-container-high text-on-surface px-xs py-0.5 rounded font-label-sm text-label-sm">ISO 45001:2018 Cl. 7.5</span>
</div>
<h1 class="font-headline-lg text-headline-lg text-primary tracking-tight">19. Control Documental y Archivo Maestro del SG-SST</h1>
<p class="font-body-md text-body-md text-on-surface-variant">
          Estructura formal de documentación, conservación y archivo del sistema de gestión conforme al <strong class="text-on-surface font-semibold">Decreto 1072 de 2015</strong> (Art. 2.2.4.6.12 y 2.2.4.6.13 - Conservación obligatoria de 20 años) y <strong class="text-on-surface font-semibold">Resolución 0312 de 2019</strong>.
        </p>
</div>
<!-- Botones de Acción Globales -->
<div class="flex items-center flex-wrap gap-xs shrink-0 pt-xs">
<button class="flex items-center gap-xs bg-surface-container-lowest text-primary px-sm py-xs rounded-lg font-label-md text-label-md hover:bg-surface-container shadow-sm transition-all" onclick="openDrawer('MAT-PEL-2024')" type="button">
<span class="material-symbols-outlined text-[18px]">history_edu</span>
<span>Auditoría de Versiones</span>
</button>
<button class="flex items-center gap-xs bg-surface-container-lowest text-primary px-sm py-xs rounded-lg font-label-md text-label-md hover:bg-surface-container shadow-sm transition-all" type="button">
<span class="material-symbols-outlined text-[18px]">download_for_offline</span>
<span>Descargar Listado Maestro (.PDF)</span>
</button>
<button class="flex items-center gap-xs bg-primary-container text-on-primary px-sm py-xs rounded-lg font-label-md text-label-md hover:bg-primary shadow-sm transition-all" type="button">
<span class="material-symbols-outlined text-[18px]">upload_file</span>
<span>+ Subir / Actualizar Documento</span>
</button>
</div>
</div>
<!-- Banner de Regla Documental Crítica -->
<div class="bg-surface-container-lowest rounded-xl p-md shadow-sm relative overflow-hidden">
<div class="absolute left-0 top-0 bottom-0 w-1.5 bg-secondary-container"></div>
<div class="flex flex-col md:flex-row md:items-center justify-between gap-base pl-xs">
<div class="flex items-start gap-base">
<div class="w-10 h-10 rounded-lg bg-surface-container-high flex items-center justify-center text-primary shrink-0">
<span class="material-symbols-outlined text-[24px]">verified</span>
</div>
<div class="flex flex-col gap-xs">
<div class="flex items-center gap-xs flex-wrap">
<span class="font-label-sm text-label-sm text-secondary font-semibold uppercase tracking-wider">Principio de Gestión y Ciclo de Vida Documental</span>
<span class="bg-surface-container text-on-surface-variant text-[11px] px-xs py-0.5 rounded font-mono">D.1072 / Art. 2.2.4.6.13</span>
</div>
<p class="font-body-sm text-body-sm text-on-surface">
              Los documentos técnicos y normativos se rigen por: <span class="font-semibold text-primary">Fecha de Elaboración ➔ Revisión ➔ Versión ➔ Responsable ➔ Estado de Aprobación</span>. No todos los documentos poseen fecha fija de vencimiento caduca, sino ciclo de mejora y actualización continua (revisión anual obligatoria por gerencia y SST).
            </p>
</div>
</div>
<div class="hidden lg:flex items-center gap-md shrink-0 bg-surface-container-low px-md py-xs rounded-lg">
<div class="flex flex-col text-right">
<span class="font-label-sm text-label-sm text-on-surface-variant">Retención Mínima Legal</span>
<span class="font-label-md text-label-md text-primary font-bold">20 Años Certificados</span>
</div>
<span class="material-symbols-outlined text-[28px] text-primary">lock_clock</span>
</div>
</div>
</div>
</header>
<!-- DASHBOARD & RESUMEN DEL ARCHIVO MAESTRO -->
<section class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-base mb-gutter">
<!-- Card 1: Total -->
<div class="bg-surface-container-lowest rounded-xl p-md shadow-sm flex flex-col justify-between">
<div class="flex items-center justify-between mb-base">
<span class="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">Total Documentos</span>
<div class="w-7 h-7 rounded-lg bg-surface-container flex items-center justify-center text-primary">
<span class="material-symbols-outlined text-[18px]">folder_copy</span>
</div>
</div>
<div>
<div class="font-display-lg text-display-lg text-on-surface tracking-tight leading-none">48</div>
<div class="font-label-sm text-label-sm text-on-surface-variant mt-xs">Documentos controlados codificados</div>
</div>
<div class="mt-base pt-xs flex items-center gap-xs font-label-sm text-label-sm text-on-surface-variant">
<span class="inline-block w-2 h-2 rounded-full bg-primary"></span>
<span>100% inventariados</span>
</div>
</div>
<!-- Card 2: Vigentes -->
<div class="bg-surface-container-lowest rounded-xl p-md shadow-sm flex flex-col justify-between">
<div class="flex items-center justify-between mb-base">
<span class="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">Versiones Vigentes</span>
<div class="w-7 h-7 rounded-lg bg-surface-container-low flex items-center justify-center text-secondary">
<span class="material-symbols-outlined text-[18px]">check_circle</span>
</div>
</div>
<div>
<div class="font-display-lg text-display-lg text-on-surface tracking-tight leading-none">42</div>
<div class="font-label-sm text-label-sm text-on-surface-variant mt-xs">En plena vigencia y validez</div>
</div>
<div class="mt-base pt-xs flex items-center gap-xs font-label-sm text-label-sm text-secondary font-medium">
<span class="inline-block w-2 h-2 rounded-full bg-secondary"></span>
<span>Firma gerencial y SST activa</span>
</div>
</div>
<!-- Card 3: En Revisión Anual -->
<div class="bg-surface-container-lowest rounded-xl p-md shadow-sm flex flex-col justify-between">
<div class="flex items-center justify-between mb-base">
<span class="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">En Revisión Anual</span>
<div class="w-7 h-7 rounded-lg bg-surface-container flex items-center justify-center text-on-surface">
<span class="material-symbols-outlined text-[18px]">edit_note</span>
</div>
</div>
<div>
<div class="font-display-lg text-display-lg text-on-surface tracking-tight leading-none">04</div>
<div class="font-label-sm text-label-sm text-on-surface-variant mt-xs">En mesa técnica o borrador</div>
</div>
<div class="mt-base pt-xs flex items-center gap-xs font-label-sm text-label-sm text-on-surface-variant">
<span class="inline-block w-2 h-2 rounded-full bg-surface-container-highest"></span>
<span>Ciclo de mejora ordinario</span>
</div>
</div>
<!-- Card 4: Observados -->
<div class="bg-surface-container-lowest rounded-xl p-md shadow-sm flex flex-col justify-between">
<div class="flex items-center justify-between mb-base">
<span class="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">Requieren Ajuste</span>
<div class="w-7 h-7 rounded-lg bg-error-container flex items-center justify-center text-error">
<span class="material-symbols-outlined text-[18px]">warning</span>
</div>
</div>
<div>
<div class="font-display-lg text-display-lg text-error tracking-tight leading-none">02</div>
<div class="font-label-sm text-label-sm text-on-surface-variant mt-xs">Documentos observados</div>
</div>
<div class="mt-base pt-xs flex items-center gap-xs font-label-sm text-label-sm text-error font-medium">
<span class="inline-block w-2 h-2 rounded-full bg-error"></span>
<span>Pendiente firma Representante Legal</span>
</div>
</div>
<!-- Card 5: Custodia Legal 20 Años -->
<div class="bg-primary text-on-primary rounded-xl p-md shadow-sm flex flex-col justify-between">
<div class="flex items-center justify-between mb-base">
<span class="font-label-sm text-label-sm text-primary-fixed uppercase tracking-wider font-semibold">Custodia Digital</span>
<div class="w-7 h-7 rounded-lg bg-primary-container flex items-center justify-center text-on-primary">
<span class="material-symbols-outlined text-[18px]">cloud_done</span>
</div>
</div>
<div>
<div class="font-display-lg text-display-lg text-on-primary tracking-tight leading-none">100%</div>
<div class="font-label-sm text-label-sm text-primary-fixed mt-xs">Respaldo criptográfico en nube</div>
</div>
<div class="mt-base pt-xs flex items-center justify-between font-label-sm text-label-sm text-primary-fixed-dim">
<span>Art. 2.2.4.6.13 Dec. 1072</span>
<span class="material-symbols-outlined text-[16px]">verified_user</span>
</div>
</div>
</section>
<!-- FILTROS Y CLASIFICACIÓN POR TIPOLOGÍAS -->
<section class="bg-surface-container-lowest rounded-xl p-md shadow-sm mb-gutter flex flex-col gap-md">
<!-- Barra Superior de Búsqueda y Filtros de Metadatos -->
<div class="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-base">
<div class="flex-1 flex items-center gap-base">
<div class="relative w-full max-w-md">
<span class="material-symbols-outlined absolute left-sm top-1/2 -translate-y-1/2 text-on-surface-variant text-[18px]">search</span>
<input class="w-full bg-surface-container-low text-on-surface placeholder:text-on-surface-variant pl-9 pr-sm py-xs rounded-lg font-body-sm text-body-sm focus:outline-none focus:ring-2 focus:ring-secondary-container transition-all" id="filterSearch" placeholder="Buscar por código (ej. POL-SST), nombre o responsable..." type="search"/>
</div>
</div>
<div class="flex items-center flex-wrap gap-xs">
<!-- Filtro Empresa -->
<div class="flex items-center bg-surface-container-low px-sm py-xs rounded-lg gap-xs">
<span class="material-symbols-outlined text-[16px] text-on-surface-variant">corporate_fare</span>
<select class="bg-transparent text-on-surface font-label-sm text-label-sm focus:outline-none cursor-pointer">
<option>Grupo Manzanares S.A.S. (Principal)</option>
<option>Consorcio AgroManzanares</option>
</select>
</div>
<!-- Filtro Responsable -->
<div class="flex items-center bg-surface-container-low px-sm py-xs rounded-lg gap-xs">
<span class="material-symbols-outlined text-[16px] text-on-surface-variant">person</span>
<select class="bg-transparent text-on-surface font-label-sm text-label-sm focus:outline-none cursor-pointer">
<option value="">Todos los Responsables</option>
<option>Ing. Andrés Valencia (SST)</option>
<option>Dra. Claudia Ortiz (Médica)</option>
<option>Representante Legal</option>
<option>Presidente COPASST</option>
</select>
</div>
<!-- Filtro Estado -->
<div class="flex items-center bg-surface-container-low px-sm py-xs rounded-lg gap-xs">
<span class="material-symbols-outlined text-[16px] text-on-surface-variant">filter_list</span>
<select class="bg-transparent text-on-surface font-label-sm text-label-sm focus:outline-none cursor-pointer">
<option value="">Todos los Estados</option>
<option>Aprobado y Vigente</option>
<option>En Revisión Técnica</option>
<option>Requiere Ajuste / Observado</option>
<option>Obsoleto / Histórico</option>
</select>
</div>
<!-- Filtro Año Ciclo -->
<div class="flex items-center bg-surface-container-low px-sm py-xs rounded-lg gap-xs">
<span class="material-symbols-outlined text-[16px] text-on-surface-variant">calendar_today</span>
<select class="bg-transparent text-on-surface font-label-sm text-label-sm focus:outline-none cursor-pointer">
<option>Ciclo 2024</option>
<option>Ciclo 2023</option>
<option>Histórico 2019-2022</option>
</select>
</div>
</div>
</div>
<!-- Tags de las 15 Tipologías Normativas -->
<div class="flex flex-col gap-xs pt-xs">
<div class="flex items-center justify-between">
<span class="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider font-semibold">Tipologías Documentales SG-SST (15 Categorías Específicas)</span>
<span class="font-label-sm text-label-sm text-secondary font-medium cursor-pointer hover:underline" onclick="selectTypeFilter('all')">Restablecer filtros</span>
</div>
<div class="flex items-center gap-xs overflow-x-auto pb-xs" id="typePills">
<button class="type-pill active bg-primary text-on-primary px-sm py-xs rounded-full font-label-sm text-label-sm whitespace-nowrap transition-all shadow-sm" onclick="filterByType('all', this)" type="button">Todos los documentos (48)</button>
<button class="type-pill bg-surface-container text-on-surface hover:bg-surface-container-high px-sm py-xs rounded-full font-label-sm text-label-sm whitespace-nowrap transition-all" onclick="filterByType('Politica', this)" type="button">Política SST (2)</button>
<button class="type-pill bg-surface-container text-on-surface hover:bg-surface-container-high px-sm py-xs rounded-full font-label-sm text-label-sm whitespace-nowrap transition-all" onclick="filterByType('Objetivos', this)" type="button">Objetivos (1)</button>
<button class="type-pill bg-surface-container text-on-surface hover:bg-surface-container-high px-sm py-xs rounded-full font-label-sm text-label-sm whitespace-nowrap transition-all" onclick="filterByType('Plan Anual', this)" type="button">Plan anual (2)</button>
<button class="type-pill bg-surface-container text-on-surface hover:bg-surface-container-high px-sm py-xs rounded-full font-label-sm text-label-sm whitespace-nowrap transition-all" onclick="filterByType('Matriz de Peligros', this)" type="button">Matriz de peligros (3)</button>
<button class="type-pill bg-surface-container text-on-surface hover:bg-surface-container-high px-sm py-xs rounded-full font-label-sm text-label-sm whitespace-nowrap transition-all" onclick="filterByType('Profesiograma', this)" type="button">Profesiograma (2)</button>
<button class="type-pill bg-surface-container text-on-surface hover:bg-surface-container-high px-sm py-xs rounded-full font-label-sm text-label-sm whitespace-nowrap transition-all" onclick="filterByType('Plan de Emergencias', this)" type="button">Plan de emergencias (2)</button>
<button class="type-pill bg-surface-container text-on-surface hover:bg-surface-container-high px-sm py-xs rounded-full font-label-sm text-label-sm whitespace-nowrap transition-all" onclick="filterByType('PESV', this)" type="button">PESV (4)</button>
<button class="type-pill bg-surface-container text-on-surface hover:bg-surface-container-high px-sm py-xs rounded-full font-label-sm text-label-sm whitespace-nowrap transition-all" onclick="filterByType('Procedimientos', this)" type="button">Procedimientos (8)</button>
<button class="type-pill bg-surface-container text-on-surface hover:bg-surface-container-high px-sm py-xs rounded-full font-label-sm text-label-sm whitespace-nowrap transition-all" onclick="filterByType('Protocolos', this)" type="button">Protocolos (5)</button>
<button class="type-pill bg-surface-container text-on-surface hover:bg-surface-container-high px-sm py-xs rounded-full font-label-sm text-label-sm whitespace-nowrap transition-all" onclick="filterByType('Programas', this)" type="button">Programas (6)</button>
<button class="type-pill bg-surface-container text-on-surface hover:bg-surface-container-high px-sm py-xs rounded-full font-label-sm text-label-sm whitespace-nowrap transition-all" onclick="filterByType('Cronogramas', this)" type="button">Cronogramas (3)</button>
<button class="type-pill bg-surface-container text-on-surface hover:bg-surface-container-high px-sm py-xs rounded-full font-label-sm text-label-sm whitespace-nowrap transition-all" onclick="filterByType('Reglamento de Higiene', this)" type="button">Reglamento de higiene (1)</button>
<button class="type-pill bg-surface-container text-on-surface hover:bg-surface-container-high px-sm py-xs rounded-full font-label-sm text-label-sm whitespace-nowrap transition-all" onclick="filterByType('COPASST', this)" type="button">COPASST (4)</button>
<button class="type-pill bg-surface-container text-on-surface hover:bg-surface-container-high px-sm py-xs rounded-full font-label-sm text-label-sm whitespace-nowrap transition-all" onclick="filterByType('CCL', this)" type="button">CCL (3)</button>
<button class="type-pill bg-surface-container text-on-surface hover:bg-surface-container-high px-sm py-xs rounded-full font-label-sm text-label-sm whitespace-nowrap transition-all" onclick="filterByType('Brigada', this)" type="button">Brigada (2)</button>
</div>
</div>
</section>
<!-- CONTENEDOR PRINCIPAL: MATRIZ MAESTRA & DRAWER LATERAL -->
<div class="flex flex-col xl:flex-row gap-gutter items-start relative mb-xl">
<!-- MATRIZ MAESTRA DE CONTROL DOCUMENTAL -->
<div class="flex-1 w-full bg-surface-container-lowest rounded-xl shadow-sm overflow-hidden">
<div class="p-md flex items-center justify-between bg-surface-container-low/50">
<div class="flex items-center gap-xs">
<span class="font-label-md text-label-md text-primary font-semibold">Listado Maestro de Documentos Internos y Externos</span>
<span class="bg-surface-container-high text-on-surface-variant font-mono text-[11px] px-xs py-0.5 rounded font-medium">REV. 08 - 2024</span>
</div>
<div class="flex items-center gap-base text-on-surface-variant font-label-sm text-label-sm">
<span>Mostrando <strong class="text-on-surface">8</strong> de <strong class="text-on-surface">48</strong> registros</span>
<button class="text-primary hover:text-secondary flex items-center gap-xs" type="button">
<span class="material-symbols-outlined text-[16px]">tune</span>
<span>Columnas</span>
</button>
</div>
</div>
<!-- Tabla Responsive -->
<div class="overflow-x-auto">
<table class="w-full text-left border-collapse">
<thead>
<tr class="bg-surface-container text-on-surface-variant font-label-sm text-label-sm uppercase tracking-wider">
<th class="py-sm px-md font-semibold">Documento &amp; Código</th>
<th class="py-sm px-sm font-semibold">Tipo</th>
<th class="py-sm px-sm font-semibold">Responsable</th>
<th class="py-sm px-sm font-semibold">Elaboración / Revisión</th>
<th class="py-sm px-sm font-semibold">Próx. Revisión</th>
<th class="py-sm px-xs font-semibold text-center">Versión</th>
<th class="py-sm px-sm font-semibold">Estado</th>
<th class="py-sm px-sm font-semibold">Control de Cambios</th>
<th class="py-sm px-md font-semibold text-right">Acción / Evidencia</th>
</tr>
</thead>
<tbody class="divide-none font-body-sm text-body-sm text-on-surface" id="documentTableBody">
<!-- Fila 1: POL-SST-001 -->
<tr class="hover:bg-surface-container-low/60 transition-colors cursor-pointer group" onclick="openDrawer('POL-SST-001')">
<td class="py-sm px-md">
<div class="flex items-start gap-xs">
<span class="material-symbols-outlined text-[20px] text-primary mt-0.5">policy</span>
<div class="flex flex-col">
<span class="font-label-md text-label-md text-primary font-semibold group-hover:text-secondary">Política Integral de SST, Ambiente y No Consumo</span>
<span class="font-mono text-[11px] text-on-surface-variant">POL-SST-001 • Grupo Manzanares S.A.S.</span>
</div>
</div>
</td>
<td class="py-sm px-sm">
<span class="bg-primary/10 text-primary font-label-sm text-label-sm px-xs py-0.5 rounded font-medium">Política SST</span>
</td>
<td class="py-sm px-sm">
<div class="flex flex-col">
<span class="font-medium">Ing. Andrés Valencia</span>
<span class="text-[11px] text-on-surface-variant">Visto Bueno Gerencia</span>
</div>
</td>
<td class="py-sm px-sm">
<div class="flex flex-col">
<span class="text-[11px] text-on-surface-variant">Elab: 15/Ene/2021</span>
<span class="font-medium text-primary">Rev: 18/Ene/2024</span>
</div>
</td>
<td class="py-sm px-sm">
<span class="text-on-surface">Ene / 2025</span>
<span class="block text-[11px] text-on-surface-variant">Ciclo Anual</span>
</td>
<td class="py-sm px-xs text-center">
<span class="bg-surface-container-high px-xs py-0.5 rounded font-mono font-bold text-label-sm text-primary">v4.0</span>
</td>
<td class="py-sm px-sm">
<div class="inline-flex items-center gap-xs bg-surface-container-low px-xs py-0.5 rounded-full font-label-sm text-label-sm text-secondary font-semibold">
<span class="w-1.5 h-1.5 rounded-full bg-secondary"></span>
<span>Aprobado y Vigente</span>
</div>
</td>
<td class="py-sm px-sm max-w-[200px]">
<p class="text-[12px] text-on-surface-variant truncate" title="Inclusión de política de desconexión laboral y actualización de directrices de alcohol y drogas.">
                  Inclusión de directrices de desconexión y actualización alcohol/drogas.
                </p>
</td>
<td class="py-sm px-md text-right">
<div class="flex items-center justify-end gap-xs" onclick="event.stopPropagation()">
<button class="p-xs rounded hover:bg-surface-container text-primary" title="Previsualizar PDF oficial con QR">
<span class="material-symbols-outlined text-[18px]">visibility</span>
</button>
<button class="p-xs rounded hover:bg-surface-container text-primary" title="Descargar original sellado">
<span class="material-symbols-outlined text-[18px]">download</span>
</button>
<button class="p-xs rounded hover:bg-surface-container text-secondary" onclick="openDrawer('POL-SST-001')" title="Ver Historial">
<span class="material-symbols-outlined text-[18px]">history</span>
</button>
</div>
</td>
</tr>
<!-- Fila 2: MAT-PEL-2024 (Activa por defecto para el drawer) -->
<tr class="bg-surface-container-low/40 hover:bg-surface-container-low transition-colors cursor-pointer group" onclick="openDrawer('MAT-PEL-2024')">
<td class="py-sm px-md">
<div class="flex items-start gap-xs">
<span class="material-symbols-outlined text-[20px] text-secondary mt-0.5">grid_view</span>
<div class="flex flex-col">
<div class="flex items-center gap-xs">
<span class="font-label-md text-label-md text-primary font-semibold group-hover:text-secondary">Matriz de Identificación de Peligros y Valoración GTC-45</span>
<span class="bg-secondary/15 text-secondary text-[10px] font-bold px-1 rounded">DRAWER ACTIVO</span>
</div>
<span class="font-mono text-[11px] text-on-surface-variant">MAT-PEL-2024 • Grupo Manzanares S.A.S.</span>
</div>
</div>
</td>
<td class="py-sm px-sm">
<span class="bg-secondary/10 text-secondary font-label-sm text-label-sm px-xs py-0.5 rounded font-medium">Matriz de Peligros</span>
</td>
<td class="py-sm px-sm">
<div class="flex flex-col">
<span class="font-medium">Ing. Andrés Valencia</span>
<span class="text-[11px] text-on-surface-variant">COPASST Aprobador</span>
</div>
</td>
<td class="py-sm px-sm">
<div class="flex flex-col">
<span class="text-[11px] text-on-surface-variant">Elab: 02/Feb/2020</span>
<span class="font-medium text-primary">Rev: 04/Mar/2024</span>
</div>
</td>
<td class="py-sm px-sm">
<span class="text-on-surface">Mar / 2025</span>
<span class="block text-[11px] text-on-surface-variant">Revisión Continua</span>
</td>
<td class="py-sm px-xs text-center">
<span class="bg-surface-container-high px-xs py-0.5 rounded font-mono font-bold text-label-sm text-primary">v5.2</span>
</td>
<td class="py-sm px-sm">
<div class="inline-flex items-center gap-xs bg-surface-container-low px-xs py-0.5 rounded-full font-label-sm text-label-sm text-secondary font-semibold">
<span class="w-1.5 h-1.5 rounded-full bg-secondary"></span>
<span>Aprobado y Vigente</span>
</div>
</td>
<td class="py-sm px-sm max-w-[200px]">
<p class="text-[12px] text-on-surface-variant truncate" title="Incorporación de nuevo tractor New Holland T6 y evaluación de vibraciones de cuerpo entero.">
                  Incorporación tractor New Holland T6 y vibración cuerpo entero.
                </p>
</td>
<td class="py-sm px-md text-right">
<div class="flex items-center justify-end gap-xs" onclick="event.stopPropagation()">
<button class="p-xs rounded hover:bg-surface-container text-primary" title="Previsualizar PDF oficial con QR">
<span class="material-symbols-outlined text-[18px]">visibility</span>
</button>
<button class="p-xs rounded hover:bg-surface-container text-primary" title="Descargar original sellado">
<span class="material-symbols-outlined text-[18px]">download</span>
</button>
<button class="p-xs rounded hover:bg-surface-container text-secondary" onclick="openDrawer('MAT-PEL-2024')" title="Ver Historial">
<span class="material-symbols-outlined text-[18px]">history</span>
</button>
</div>
</td>
</tr>
<!-- Fila 3: PRO-ALT-003 -->
<tr class="hover:bg-surface-container-low/60 transition-colors cursor-pointer group" onclick="openDrawer('PRO-ALT-003')">
<td class="py-sm px-md">
<div class="flex items-start gap-xs">
<span class="material-symbols-outlined text-[20px] text-primary mt-0.5">height</span>
<div class="flex flex-col">
<span class="font-label-md text-label-md text-primary font-semibold group-hover:text-secondary">Procedimiento de Trabajo Seguro en Alturas y Permiso Crítico</span>
<span class="font-mono text-[11px] text-on-surface-variant">PRO-ALT-003 • Grupo Manzanares S.A.S.</span>
</div>
</div>
</td>
<td class="py-sm px-sm">
<span class="bg-primary/10 text-primary font-label-sm text-label-sm px-xs py-0.5 rounded font-medium">Procedimientos</span>
</td>
<td class="py-sm px-sm">
<div class="flex flex-col">
<span class="font-medium">Ing. Andrés Valencia</span>
<span class="text-[11px] text-on-surface-variant">Entrenador Alturas Lic.</span>
</div>
</td>
<td class="py-sm px-sm">
<div class="flex flex-col">
<span class="text-[11px] text-on-surface-variant">Elab: 10/Jul/2022</span>
<span class="font-medium text-primary">Rev: 12/Feb/2024</span>
</div>
</td>
<td class="py-sm px-sm">
<span class="text-on-surface">Feb / 2025</span>
<span class="block text-[11px] text-on-surface-variant">Ciclo Anual</span>
</td>
<td class="py-sm px-xs text-center">
<span class="bg-surface-container-high px-xs py-0.5 rounded font-mono font-bold text-label-sm text-primary">v3.0</span>
</td>
<td class="py-sm px-sm">
<div class="inline-flex items-center gap-xs bg-surface-container-low px-xs py-0.5 rounded-full font-label-sm text-label-sm text-secondary font-semibold">
<span class="w-1.5 h-1.5 rounded-full bg-secondary"></span>
<span>Aprobado y Vigente</span>
</div>
</td>
<td class="py-sm px-sm max-w-[200px]">
<p class="text-[12px] text-on-surface-variant truncate" title="Ajuste estricto conforme a la Resolución 4272 de 2021 y roles de rescatista.">
                  Ajuste estricto conforme a la Resolución 4272 de 2021.
                </p>
</td>
<td class="py-sm px-md text-right">
<div class="flex items-center justify-end gap-xs" onclick="event.stopPropagation()">
<button class="p-xs rounded hover:bg-surface-container text-primary" title="Previsualizar PDF oficial con QR">
<span class="material-symbols-outlined text-[18px]">visibility</span>
</button>
<button class="p-xs rounded hover:bg-surface-container text-primary" title="Descargar original sellado">
<span class="material-symbols-outlined text-[18px]">download</span>
</button>
<button class="p-xs rounded hover:bg-surface-container text-secondary" onclick="openDrawer('PRO-ALT-003')" title="Ver Historial">
<span class="material-symbols-outlined text-[18px]">history</span>
</button>
</div>
</td>
</tr>
<!-- Fila 4: PLAN-EMERG-V4 -->
<tr class="hover:bg-surface-container-low/60 transition-colors cursor-pointer group" onclick="openDrawer('PLAN-EMERG-V4')">
<td class="py-sm px-md">
<div class="flex items-start gap-xs">
<span class="material-symbols-outlined text-[20px] text-primary mt-0.5">crisis_alert</span>
<div class="flex flex-col">
<span class="font-label-md text-label-md text-primary font-semibold group-hover:text-secondary">Plan de Prevención, Preparación y Respuesta ante Emergencias (PPRE)</span>
<span class="font-mono text-[11px] text-on-surface-variant">PLAN-EMERG-V4 • Fincas y Planta Central</span>
</div>
</div>
</td>
<td class="py-sm px-sm">
<span class="bg-primary/10 text-primary font-label-sm text-label-sm px-xs py-0.5 rounded font-medium">Plan de Emergencias</span>
</td>
<td class="py-sm px-sm">
<div class="flex flex-col">
<span class="font-medium">Comandante Brigada / SST</span>
<span class="text-[11px] text-on-surface-variant">Validado Bomberos</span>
</div>
</td>
<td class="py-sm px-sm">
<div class="flex flex-col">
<span class="text-[11px] text-on-surface-variant">Elab: 05/Nov/2019</span>
<span class="font-medium text-primary">Rev: 14/May/2024</span>
</div>
</td>
<td class="py-sm px-sm">
<span class="text-on-surface">May / 2025</span>
<span class="block text-[11px] text-on-surface-variant">Población Dinámica</span>
</td>
<td class="py-sm px-xs text-center">
<span class="bg-surface-container-high px-xs py-0.5 rounded font-mono font-bold text-label-sm text-primary">v4.1</span>
</td>
<td class="py-sm px-sm">
<div class="inline-flex items-center gap-xs bg-surface-container-low px-xs py-0.5 rounded-full font-label-sm text-label-sm text-secondary font-semibold">
<span class="w-1.5 h-1.5 rounded-full bg-secondary"></span>
<span>Aprobado y Vigente</span>
</div>
</td>
<td class="py-sm px-sm max-w-[200px]">
<p class="text-[12px] text-on-surface-variant truncate" title="Actualización de inventario de botiquines y plano de evacuación campamento oeste.">
                  Inventario botiquines y plano evacuación campamento oeste.
                </p>
</td>
<td class="py-sm px-md text-right">
<div class="flex items-center justify-end gap-xs" onclick="event.stopPropagation()">
<button class="p-xs rounded hover:bg-surface-container text-primary" title="Previsualizar PDF oficial con QR">
<span class="material-symbols-outlined text-[18px]">visibility</span>
</button>
<button class="p-xs rounded hover:bg-surface-container text-primary" title="Descargar original sellado">
<span class="material-symbols-outlined text-[18px]">download</span>
</button>
<button class="p-xs rounded hover:bg-surface-container text-secondary" onclick="openDrawer('PLAN-EMERG-V4')" title="Ver Historial">
<span class="material-symbols-outlined text-[18px]">history</span>
</button>
</div>
</td>
</tr>
<!-- Fila 5: PESV-DOC-002 -->
<tr class="hover:bg-surface-container-low/60 transition-colors cursor-pointer group" onclick="openDrawer('PESV-DOC-002')">
<td class="py-sm px-md">
<div class="flex items-start gap-xs">
<span class="material-symbols-outlined text-[20px] text-primary mt-0.5">traffic</span>
<div class="flex flex-col">
<span class="font-label-md text-label-md text-primary font-semibold group-hover:text-secondary">Plan Estratégico de Seguridad Vial - PESV Nivel Estándar</span>
<span class="font-mono text-[11px] text-on-surface-variant">PESV-DOC-002 • Grupo Manzanares S.A.S.</span>
</div>
</div>
</td>
<td class="py-sm px-sm">
<span class="bg-primary/10 text-primary font-label-sm text-label-sm px-xs py-0.5 rounded font-medium">PESV</span>
</td>
<td class="py-sm px-sm">
<div class="flex flex-col">
<span class="font-medium">Comité de Seguridad Vial</span>
<span class="text-[11px] text-on-surface-variant">Líder Flota &amp; Tractores</span>
</div>
</td>
<td class="py-sm px-sm">
<div class="flex flex-col">
<span class="text-[11px] text-on-surface-variant">Elab: 15/Mar/2022</span>
<span class="font-medium text-primary">Rev: 20/Jul/2023</span>
</div>
</td>
<td class="py-sm px-sm">
<span class="text-on-surface">Jul / 2024</span>
<span class="block text-[11px] text-on-surface-variant">En Mesa Técnica</span>
</td>
<td class="py-sm px-xs text-center">
<span class="bg-surface-container px-xs py-0.5 rounded font-mono text-label-sm text-on-surface">v2.1</span>
</td>
<td class="py-sm px-sm">
<div class="inline-flex items-center gap-xs bg-surface-container px-xs py-0.5 rounded-full font-label-sm text-label-sm text-on-surface-variant font-medium">
<span class="w-1.5 h-1.5 rounded-full bg-on-surface-variant"></span>
<span>En Revisión Técnica</span>
</div>
</td>
<td class="py-sm px-sm max-w-[200px]">
<p class="text-[12px] text-on-surface-variant truncate" title="Reestructuración conforme a la Resolución 40595 de 2022 del MinTransporte.">
                  Alineación 24 pasos Res. 40595 de 2022 (Fase implementación).
                </p>
</td>
<td class="py-sm px-md text-right">
<div class="flex items-center justify-end gap-xs" onclick="event.stopPropagation()">
<button class="p-xs rounded hover:bg-surface-container text-primary" title="Previsualizar PDF oficial con QR">
<span class="material-symbols-outlined text-[18px]">visibility</span>
</button>
<button class="p-xs rounded hover:bg-surface-container text-primary" title="Descargar original sellado">
<span class="material-symbols-outlined text-[18px]">download</span>
</button>
<button class="p-xs rounded hover:bg-surface-container text-secondary" onclick="openDrawer('PESV-DOC-002')" title="Ver Historial">
<span class="material-symbols-outlined text-[18px]">history</span>
</button>
</div>
</td>
</tr>
<!-- Fila 6: PROF-MED-2024 -->
<tr class="hover:bg-surface-container-low/60 transition-colors cursor-pointer group" onclick="openDrawer('PROF-MED-2024')">
<td class="py-sm px-md">
<div class="flex items-start gap-xs">
<span class="material-symbols-outlined text-[20px] text-primary mt-0.5">medical_services</span>
<div class="flex flex-col">
<span class="font-label-md text-label-md text-primary font-semibold group-hover:text-secondary">Profesiograma Operativo y Perfiles Psicofísicos de Cargo</span>
<span class="font-mono text-[11px] text-on-surface-variant">PROF-MED-2024 • Médico Laboral Especialista</span>
</div>
</div>
</td>
<td class="py-sm px-sm">
<span class="bg-primary/10 text-primary font-label-sm text-label-sm px-xs py-0.5 rounded font-medium">Profesiograma</span>
</td>
<td class="py-sm px-sm">
<div class="flex flex-col">
<span class="font-medium">Dra. Claudia Ortiz</span>
<span class="text-[11px] text-on-surface-variant">Lic. Médica SST 4491</span>
</div>
</td>
<td class="py-sm px-sm">
<div class="flex flex-col">
<span class="text-[11px] text-on-surface-variant">Elab: 12/Jun/2021</span>
<span class="font-medium text-primary">Rev: 10/Ene/2024</span>
</div>
</td>
<td class="py-sm px-sm">
<span class="text-on-surface">Ene / 2025</span>
<span class="block text-[11px] text-on-surface-variant">Ciclo Anual</span>
</td>
<td class="py-sm px-xs text-center">
<span class="bg-surface-container-high px-xs py-0.5 rounded font-mono font-bold text-label-sm text-primary">v3.0</span>
</td>
<td class="py-sm px-sm">
<div class="inline-flex items-center gap-xs bg-surface-container-low px-xs py-0.5 rounded-full font-label-sm text-label-sm text-secondary font-semibold">
<span class="w-1.5 h-1.5 rounded-full bg-secondary"></span>
<span>Aprobado y Vigente</span>
</div>
</td>
<td class="py-sm px-sm max-w-[200px]">
<p class="text-[12px] text-on-surface-variant truncate" title="Inclusión de pruebas osteomusculares para cosechadores y espirometrías fumigación.">
                  Inclusión osteomusculares cosechadores y espirometría.
                </p>
</td>
<td class="py-sm px-md text-right">
<div class="flex items-center justify-end gap-xs" onclick="event.stopPropagation()">
<button class="p-xs rounded hover:bg-surface-container text-primary" title="Previsualizar PDF oficial con QR">
<span class="material-symbols-outlined text-[18px]">visibility</span>
</button>
<button class="p-xs rounded hover:bg-surface-container text-primary" title="Descargar original sellado">
<span class="material-symbols-outlined text-[18px]">download</span>
</button>
<button class="p-xs rounded hover:bg-surface-container text-secondary" onclick="openDrawer('PROF-MED-2024')" title="Ver Historial">
<span class="material-symbols-outlined text-[18px]">history</span>
</button>
</div>
</td>
</tr>
<!-- Fila 7: REG-HIG-001 (Observado / Requiere Ajuste) -->
<tr class="bg-error-container/15 hover:bg-error-container/25 transition-colors cursor-pointer group" onclick="openDrawer('REG-HIG-001')">
<td class="py-sm px-md">
<div class="flex items-start gap-xs">
<span class="material-symbols-outlined text-[20px] text-error mt-0.5">gavel</span>
<div class="flex flex-col">
<span class="font-label-md text-label-md text-error font-semibold group-hover:underline">Reglamento de Higiene y Seguridad Industrial</span>
<span class="font-mono text-[11px] text-on-surface-variant">REG-HIG-001 • Grupo Manzanares S.A.S.</span>
</div>
</div>
</td>
<td class="py-sm px-sm">
<span class="bg-error-container text-on-error-container font-label-sm text-label-sm px-xs py-0.5 rounded font-medium">Reglamento</span>
</td>
<td class="py-sm px-sm">
<div class="flex flex-col">
<span class="font-medium">Representante Legal</span>
<span class="text-[11px] text-on-surface-variant">Revisión Jurídica</span>
</div>
</td>
<td class="py-sm px-sm">
<div class="flex flex-col">
<span class="text-[11px] text-on-surface-variant">Elab: 10/Ago/2018</span>
<span class="font-medium text-error">Rev: 01/Ago/2023</span>
</div>
</td>
<td class="py-sm px-sm">
<span class="text-error font-semibold">Pendiente Firma</span>
<span class="block text-[11px] text-error">Observado ARL</span>
</td>
<td class="py-sm px-xs text-center">
<span class="bg-error-container text-error px-xs py-0.5 rounded font-mono font-bold text-label-sm">v2.0</span>
</td>
<td class="py-sm px-sm">
<div class="inline-flex items-center gap-xs bg-error-container px-xs py-0.5 rounded-full font-label-sm text-label-sm text-error font-semibold">
<span class="w-1.5 h-1.5 rounded-full bg-error"></span>
<span>Requiere Ajuste</span>
</div>
</td>
<td class="py-sm px-sm max-w-[200px]">
<p class="text-[12px] text-error truncate" title="Observación ARL Sura: actualizar tabla de factores de riesgo con fitosanitarios categoría II.">
                  Observación ARL: actualizar fitosanitarios categoría II.
                </p>
</td>
<td class="py-sm px-md text-right">
<div class="flex items-center justify-end gap-xs" onclick="event.stopPropagation()">
<button class="p-xs rounded hover:bg-surface-container text-primary" title="Previsualizar PDF oficial con QR">
<span class="material-symbols-outlined text-[18px]">visibility</span>
</button>
<button class="p-xs rounded hover:bg-surface-container text-primary" title="Descargar original sellado">
<span class="material-symbols-outlined text-[18px]">download</span>
</button>
<button class="p-xs rounded hover:bg-surface-container text-secondary" onclick="openDrawer('REG-HIG-001')" title="Ver Historial">
<span class="material-symbols-outlined text-[18px]">history</span>
</button>
</div>
</td>
</tr>
<!-- Fila 8: ACTA-COP-2024-05 -->
<tr class="hover:bg-surface-container-low/60 transition-colors cursor-pointer group" onclick="openDrawer('ACTA-COP-2024-05')">
<td class="py-sm px-md">
<div class="flex items-start gap-xs">
<span class="material-symbols-outlined text-[20px] text-primary mt-0.5">groups</span>
<div class="flex flex-col">
<span class="font-label-md text-label-md text-primary font-semibold group-hover:text-secondary">Acta Mensual Ordinaria de COPASST - Mayo 2024</span>
<span class="font-mono text-[11px] text-on-surface-variant">ACTA-COP-2024-05 • Grupo Manzanares S.A.S.</span>
</div>
</div>
</td>
<td class="py-sm px-sm">
<span class="bg-primary/10 text-primary font-label-sm text-label-sm px-xs py-0.5 rounded font-medium">COPASST</span>
</td>
<td class="py-sm px-sm">
<div class="flex flex-col">
<span class="font-medium">Secretario COPASST</span>
<span class="text-[11px] text-on-surface-variant">Firma 4 Miembros</span>
</div>
</td>
<td class="py-sm px-sm">
<div class="flex flex-col">
<span class="text-[11px] text-on-surface-variant">Elab: 28/May/2024</span>
<span class="font-medium text-primary">Rev: 29/May/2024</span>
</div>
</td>
<td class="py-sm px-sm">
<span class="text-on-surface">Jun / 2024</span>
<span class="block text-[11px] text-on-surface-variant">Mensual</span>
</td>
<td class="py-sm px-xs text-center">
<span class="bg-surface-container-high px-xs py-0.5 rounded font-mono font-bold text-label-sm text-primary">v1.0</span>
</td>
<td class="py-sm px-sm">
<div class="inline-flex items-center gap-xs bg-surface-container-low px-xs py-0.5 rounded-full font-label-sm text-label-sm text-secondary font-semibold">
<span class="w-1.5 h-1.5 rounded-full bg-secondary"></span>
<span>Aprobado y Vigente</span>
</div>
</td>
<td class="py-sm px-sm max-w-[200px]">
<p class="text-[12px] text-on-surface-variant truncate" title="Revisión de inspección de EPP de bodega de agroquímicos y plan de poda segura.">
                  Revisión inspección EPP y poda segura en fincas.
                </p>
</td>
<td class="py-sm px-md text-right">
<div class="flex items-center justify-end gap-xs" onclick="event.stopPropagation()">
<button class="p-xs rounded hover:bg-surface-container text-primary" title="Previsualizar PDF oficial con QR">
<span class="material-symbols-outlined text-[18px]">visibility</span>
</button>
<button class="p-xs rounded hover:bg-surface-container text-primary" title="Descargar original sellado">
<span class="material-symbols-outlined text-[18px]">download</span>
</button>
<button class="p-xs rounded hover:bg-surface-container text-secondary" onclick="openDrawer('ACTA-COP-2024-05')" title="Ver Historial">
<span class="material-symbols-outlined text-[18px]">history</span>
</button>
</div>
</td>
</tr>
</tbody>
</table>
</div>
<!-- Paginación y Resumen -->
<div class="p-md flex flex-col sm:flex-row items-center justify-between gap-base bg-surface-container-low/30">
<div class="flex items-center gap-xs font-label-sm text-label-sm text-on-surface-variant">
<span>Registros por página:</span>
<select class="bg-surface-container-lowest px-xs py-0.5 rounded font-medium text-on-surface focus:outline-none">
<option>10</option>
<option selected="">25</option>
<option>50</option>
</select>
<span class="ml-base">Mostrando 1–8 de 48 documentos</span>
</div>
<div class="flex items-center gap-xs">
<button class="p-xs rounded bg-surface-container text-on-surface-variant disabled:opacity-40" disabled="">
<span class="material-symbols-outlined text-[18px]">chevron_left</span>
</button>
<button class="w-8 h-8 rounded bg-primary text-on-primary font-label-sm text-label-sm font-semibold">1</button>
<button class="w-8 h-8 rounded bg-surface-container hover:bg-surface-container-high text-on-surface font-label-sm text-label-sm font-semibold">2</button>
<button class="p-xs rounded bg-surface-container hover:bg-surface-container-high text-on-surface">
<span class="material-symbols-outlined text-[18px]">chevron_right</span>
</button>
</div>
</div>
</div>
<!-- SECCIÓN LATERAL / DRAWER DE CONTROL DE VERSIONES E HISTORIAL DE CAMBIOS -->
<aside class="w-full xl:w-96 bg-surface-container-lowest rounded-xl shadow-md p-md shrink-0 flex flex-col gap-base transition-all duration-300" id="versionDrawer">
<!-- Encabezado del Drawer -->
<div class="flex items-start justify-between pb-xs">
<div class="flex flex-col">
<div class="flex items-center gap-xs">
<span class="material-symbols-outlined text-secondary text-[20px]">history_edu</span>
<span class="font-label-md text-label-md text-primary font-semibold uppercase tracking-wider">Historial de Trazabilidad</span>
</div>
<span class="font-mono text-[11px] text-on-surface-variant" id="drawerDocCode">MAT-PEL-2024</span>
</div>
<div class="flex items-center gap-xs">
<span class="bg-surface-container text-on-surface-variant font-mono text-[10px] px-1.5 py-0.5 rounded">ISO 7.5.3</span>
<button class="text-on-surface-variant hover:text-on-surface p-0.5" onclick="closeDrawer()" type="button">
<span class="material-symbols-outlined text-[18px]">close</span>
</button>
</div>
</div>
<!-- Ficha Resumen del Documento Seleccionado -->
<div class="bg-surface-container-low rounded-lg p-sm flex flex-col gap-xs">
<h3 class="font-label-md text-label-md text-primary font-bold leading-tight" id="drawerDocTitle">Matriz de Identificación de Peligros, Evaluación y Valoración de Riesgos (GTC-45)</h3>
<p class="font-body-sm text-body-sm text-on-surface-variant">
          Custodia digital obligatoria hasta el año <strong>2044</strong> (20 años según Decreto 1072/2015 Art. 2.2.4.6.13).
        </p>
<div class="flex items-center justify-between pt-xs font-label-sm text-label-sm text-on-surface-variant">
<span>Ubicación Servidor:</span>
<span class="font-mono text-primary font-medium">/SG-SST/MATRICES/2024/</span>
</div>
<div class="flex items-center justify-between font-label-sm text-label-sm text-on-surface-variant">
<span>Hash Criptográfico SHA-256:</span>
<span class="font-mono text-[10px] text-secondary">a8f9c4...71b0</span>
</div>
</div>
<!-- Línea de Tiempo de Versiones Históricas (Auditoría ARL / MinTrabajo) -->
<div class="flex flex-col gap-base mt-xs">
<span class="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider font-semibold">Trazabilidad de Versiones (No se elimina historial)</span>
<!-- Versión Actual: v5.2 -->
<div class="relative pl-6 pb-md">
<div class="absolute left-2 top-2 bottom-0 w-0.5 bg-secondary"></div>
<div class="absolute left-0 top-1.5 w-4 h-4 rounded-full bg-secondary text-on-secondary flex items-center justify-center text-[9px] font-bold">✓</div>
<div class="bg-surface-container-lowest p-sm rounded-lg shadow-sm flex flex-col gap-xs">
<div class="flex items-center justify-between">
<span class="font-mono font-bold text-label-md text-secondary">Versión 5.2 (Vigente Oficial)</span>
<span class="bg-surface-container-high text-primary px-xs py-0.5 rounded font-label-sm text-label-sm">04/Mar/2024</span>
</div>
<p class="text-[13px] text-on-surface">
<strong>Motivo de Cambio:</strong> Inclusión formal del lote 4 y maquinaria pesada tractor New Holland T6 con vibración de cuerpo entero.
            </p>
<div class="flex items-center justify-between text-[11px] text-on-surface-variant pt-xs">
<span>Aprobado: COPASST &amp; Ing. Andrés</span>
<a class="text-primary font-semibold hover:underline flex items-center gap-0.5" href="#">
<span class="material-symbols-outlined text-[14px]">download</span> PDF (3.8 MB)
              </a>
</div>
</div>
</div>
<!-- Versión Histórica: v5.0 -->
<div class="relative pl-6 pb-md">
<div class="absolute left-2 top-2 bottom-0 w-0.5 bg-outline-variant"></div>
<div class="absolute left-0 top-1.5 w-4 h-4 rounded-full bg-surface-container-highest text-on-surface flex items-center justify-center text-[9px] font-bold">5</div>
<div class="bg-surface-container-low/50 p-sm rounded-lg flex flex-col gap-xs">
<div class="flex items-center justify-between">
<span class="font-mono font-bold text-label-md text-on-surface">Versión 5.0 (Histórico)</span>
<span class="text-on-surface-variant font-label-sm text-label-sm">18/Ene/2023</span>
</div>
<p class="text-[13px] text-on-surface-variant">
<strong>Motivo de Cambio:</strong> Revisión anual ordinaria y reevaluación de riesgo biológico y fitosanitarios.
            </p>
<div class="flex items-center justify-between text-[11px] text-on-surface-variant pt-xs">
<span>Estado: Archivado Digital</span>
<a class="text-primary font-medium hover:underline flex items-center gap-0.5" href="#">
<span class="material-symbols-outlined text-[14px]">download</span> PDF (3.2 MB)
              </a>
</div>
</div>
</div>
<!-- Versión Histórica: v4.1 -->
<div class="relative pl-6 pb-md">
<div class="absolute left-2 top-2 bottom-0 w-0.5 bg-outline-variant"></div>
<div class="absolute left-0 top-1.5 w-4 h-4 rounded-full bg-surface-container-highest text-on-surface flex items-center justify-center text-[9px] font-bold">4</div>
<div class="bg-surface-container-low/50 p-sm rounded-lg flex flex-col gap-xs">
<div class="flex items-center justify-between">
<span class="font-mono font-bold text-label-md text-on-surface">Versión 4.1 (Histórico)</span>
<span class="text-on-surface-variant font-label-sm text-label-sm">10/Feb/2022</span>
</div>
<p class="text-[13px] text-on-surface-variant">
<strong>Motivo de Cambio:</strong> Adaptación por reactivación post-emergencia sanitaria y trabajo en campo abierto.
            </p>
<div class="flex items-center justify-between text-[11px] text-on-surface-variant pt-xs">
<span>Estado: Archivado Digital</span>
<a class="text-primary font-medium hover:underline flex items-center gap-0.5" href="#">
<span class="material-symbols-outlined text-[14px]">download</span> PDF (2.9 MB)
              </a>
</div>
</div>
</div>
<!-- Versión Histórica Base: v1.0 -->
<div class="relative pl-6">
<div class="absolute left-0 top-1.5 w-4 h-4 rounded-full bg-surface-container-highest text-on-surface flex items-center justify-center text-[9px] font-bold">1</div>
<div class="bg-surface-container-low/50 p-sm rounded-lg flex flex-col gap-xs">
<div class="flex items-center justify-between">
<span class="font-mono font-bold text-label-md text-on-surface">Versión 1.0 (Creación Formal)</span>
<span class="text-on-surface-variant font-label-sm text-label-sm">02/Feb/2020</span>
</div>
<p class="text-[13px] text-on-surface-variant">
<strong>Motivo de Cambio:</strong> Levantamiento inicial de matriz GTC-45 para Grupo Manzanares S.A.S.
            </p>
<div class="flex items-center justify-between text-[11px] text-on-surface-variant pt-xs">
<span>Elaboró: Consultor Licenciado</span>
<a class="text-primary font-medium hover:underline flex items-center gap-0.5" href="#">
<span class="material-symbols-outlined text-[14px]">download</span> PDF (2.1 MB)
              </a>
</div>
</div>
</div>
</div>
<!-- Botón de Acción en Drawer -->
<div class="pt-base flex flex-col gap-xs">
<button class="w-full flex items-center justify-center gap-xs bg-primary text-on-primary py-xs rounded-lg font-label-md text-label-md hover:bg-primary-container transition-all" type="button">
<span class="material-symbols-outlined text-[18px]">publish</span>
<span>Publicar Nueva Versión (v5.3)</span>
</button>
<button class="w-full flex items-center justify-center gap-xs bg-surface-container hover:bg-surface-container-high text-on-surface py-xs rounded-lg font-label-sm text-label-sm transition-all" type="button">
<span class="material-symbols-outlined text-[16px]">qr_code_2</span>
<span>Ver Ficha Técnica con Sello QR</span>
</button>
</div>
</aside>
</div>
<!-- SECCIÓN INFORMATIVA DE CUSTODIA LEGAL Y AUDITORÍA MINTRABAJO -->
<section class="bg-surface-container-lowest rounded-xl p-md shadow-sm mb-gutter flex flex-col lg:flex-row items-start lg:items-center justify-between gap-md">
<div class="flex items-start gap-md max-w-3xl">
<div class="w-12 h-12 rounded-xl bg-surface-container-low flex items-center justify-center text-primary shrink-0">
<span class="material-symbols-outlined text-[28px]">shield_person</span>
</div>
<div class="flex flex-col gap-xs">
<h3 class="font-headline-md text-headline-md text-primary">Garantía de Intangibilidad y Conservación Digital</h3>
<p class="font-body-sm text-body-sm text-on-surface-variant">
          Conforme al Decreto 1072 de 2015, los registros de exámenes ocupacionales, mediciones ambientales, matrices de peligros y capacitaciones de Grupo Manzanares S.A.S. se encuentran cifrados y garantizan su disponibilidad ininterrumpida por 20 años desde el retiro del último trabajador involucrado.
        </p>
</div>
</div>
<div class="flex items-center gap-base shrink-0">
<div class="flex flex-col text-right">
<span class="font-label-sm text-label-sm text-on-surface-variant">Próxima Auditoría Interna</span>
<span class="font-label-md text-label-md text-primary font-bold">15 de Noviembre 2024</span>
</div>
<button class="bg-surface-container text-primary hover:bg-surface-container-high px-md py-xs rounded-lg font-label-md text-label-md flex items-center gap-xs transition-colors" type="button">
<span class="material-symbols-outlined text-[18px]">rule</span>
<span>Plan de Auditoría</span>
</button>
</div>
</section>
<!-- MICRO-INTERACCIONES EN JAVASCRIPT -->
<script>
    // Filtrado interactivo por tipología
    function filterByType(category, element) {
      // Actualizar estilo visual de los tags
      const pills = document.querySelectorAll('.type-pill');
      pills.forEach(pill => {
        pill.classList.remove('bg-primary', 'text-on-primary', 'active');
        pill.classList.add('bg-surface-container', 'text-on-surface');
      });

      if (element) {
        element.classList.remove('bg-surface-container', 'text-on-surface');
        element.classList.add('bg-primary', 'text-on-primary', 'active');
      }

      // Filtrar filas de la tabla
      const rows = document.querySelectorAll('#documentTableBody tr');
      rows.forEach(row => {
        if (category === 'all') {
          row.style.display = '';
        } else {
          const typeBadge = row.querySelector('td:nth-child(2)');
          if (typeBadge && typeBadge.textContent.toLowerCase().includes(category.toLowerCase())) {
            row.style.display = '';
          } else {
            row.style.display = 'none';
          }
        }
      });
    }

    function selectTypeFilter(cat) {
      const firstPill = document.querySelector('.type-pill');
      filterByType(cat, firstPill);
    }

    // Apertura y cambio dinámico del Drawer de versiones
    const docData = {
      'POL-SST-001': {
        code: 'POL-SST-001',
        title: 'Política Integral de SST, Ambiente y No Consumo de Tabaco, Alcohol y Drogas',
        currentVer: 'v4.0'
      },
      'MAT-PEL-2024': {
        code: 'MAT-PEL-2024',
        title: 'Matriz de Identificación de Peligros, Evaluación y Valoración de Riesgos (GTC-45)',
        currentVer: 'v5.2'
      },
      'PRO-ALT-003': {
        code: 'PRO-ALT-003',
        title: 'Procedimiento Seguro para Trabajo en Alturas (Res. 4272/2021) y Permisos',
        currentVer: 'v3.0'
      },
      'PLAN-EMERG-V4': {
        code: 'PLAN-EMERG-V4',
        title: 'Plan de Prevención, Preparación y Respuesta ante Emergencias (PPRE)',
        currentVer: 'v4.1'
      },
      'PESV-DOC-002': {
        code: 'PESV-DOC-002',
        title: 'Plan Estratégico de Seguridad Vial - PESV Nivel Estándar (Res. 40595/2022)',
        currentVer: 'v2.1'
      },
      'PROF-MED-2024': {
        code: 'PROF-MED-2024',
        title: 'Profesiograma Ocupacional y Matriz de Evaluaciones Médicas (EMOS)',
        currentVer: 'v3.0'
      },
      'REG-HIG-001': {
        code: 'REG-HIG-001',
        title: 'Reglamento de Higiene y Seguridad Industrial de Grupo Manzanares S.A.S.',
        currentVer: 'v2.0'
      },
      'ACTA-COP-2024-05': {
        code: 'ACTA-COP-2024-05',
        title: 'Acta Mensual Ordinaria de COPASST - Periodo Mayo 2024',
        currentVer: 'v1.0'
      }
    };

    function openDrawer(docCode) {
      const drawer = document.getElementById('versionDrawer');
      const codeEl = document.getElementById('drawerDocCode');
      const titleEl = document.getElementById('drawerDocTitle');

      if (drawer && docData[docCode]) {
        drawer.classList.remove('hidden');
        codeEl.textContent = docData[docCode].code;
        titleEl.textContent = docData[docCode].title;
        // Efecto scroll suave si está en dispositivos reducidos
        if (window.innerWidth < 1280) {
          drawer.scrollIntoView({ behavior: 'smooth' });
        }
      }
    }

    function closeDrawer() {
      const drawer = document.getElementById('versionDrawer');
      if (drawer) {
        drawer.classList.add('hidden');
      }
    }

    // Buscador en tiempo real
    document.getElementById('filterSearch').addEventListener('input', function(e) {
      const term = e.target.value.toLowerCase();
      const rows = document.querySelectorAll('#documentTableBody tr');
      rows.forEach(row => {
        const text = row.textContent.toLowerCase();
        if (text.includes(term)) {
          row.style.display = '';
        } else {
          row.style.display = 'none';
        }
      });
    });

  </script>
</div></main></div></body></html>
