12. EPP
    Crear catálogo de EPP.
    Tipos:
    • Botas
    • Guantes
    • Gafas
    • Casco
    • Protección auditiva
    • Protección respiratoria
    • Arnés
    • Eslinga
    • Impermeable
    • Vaqueta
    • Otros
    Entrega
    Campos:
    • Trabajador
    • EPP
    • Cantidad
    • Talla
    • Fecha de entrega
    • Vida útil
    • Próxima reposición
    • Responsable
    • Evidencia
    • Observaciones
    Dashboard EPP
    Mostrar:
    • Entregas del mes
    • EPP pendientes
    • Próximas reposiciones
    • EPP más entregados
    • EPP más repuestos
    • Consumo por empresa
    • Consumo por centro de trabajo
    Esto debe servir también para planificación presupuestal.

---

13. INSPECCIONES
    Crear módulo de inspecciones.
    Tipos:
    • Locativas
    • EPP
    • Botiquines
    • Extintores
    • Equipos
    • Herramientas
    • Vehículos
    • Tractor
    • Trabajo en alturas
    • Emergencias
    • Orden y aseo
    • Químicos
    • Puestos de trabajo
    Campos:
    • Tipo de inspección
    • Responsable
    • Centro de trabajo
    • Fecha programada
    • Fecha realizada
    • Estado
    • Hallazgos
    • Número de hallazgos
    • Evidencia
    • Acción generada
    • Fecha próxima inspección
    Estados:
    • Programada
    • Realizada
    • Pendiente
    • Vencida
    Crear calendario de inspecciones.
    Mostrar:
    Esta semana deben realizarse:
    Responsable → lugar → tipo de inspección → fecha.

<!DOCTYPE html>

<html lang="es"><head><meta charset="utf-8"/><meta content="width=device-width, initial-scale=1.0" name="viewport"/><style>@layer base{html,body{margin:0;padding:0;}body{overscroll-behavior:none;}main>:first-child{margin-top:0!important;}main>:last-child{margin-bottom:0!important;}}::-webkit-scrollbar{display:none;}</style><script src="https://cdn.tailwindcss.com"></script><script id="tailwind-config">tailwind.config={theme:{extend:{"colors":{"on-secondary-fixed":"#07006c","inverse-primary":"#bcc3ff","error-container":"#ffdad6","secondary-fixed":"#e1e0ff","primary-fixed-dim":"#bcc3ff","surface":"#f8f9ff","primary-container":"#2e3a8c","tertiary":"#2a2d2f","on-primary-fixed":"#000d60","surface-variant":"#d5e3fc","outline":"#767682","secondary-fixed-dim":"#c0c1ff","on-surface":"#0d1c2e","surface-container-low":"#eff4ff","on-error":"#ffffff","surface-container-lowest":"#ffffff","on-secondary":"#ffffff","surface-container":"#e6eeff","on-primary":"#ffffff","tertiary-fixed-dim":"#c4c7c9","on-secondary-container":"#fffbff","on-tertiary":"#ffffff","surface-tint":"#4b57aa","secondary":"#4648d4","tertiary-container":"#404345","on-surface-variant":"#454651","on-primary-container":"#9ea9ff","on-tertiary-fixed-variant":"#444749","surface-bright":"#f8f9ff","primary":"#142175","surface-container-highest":"#d5e3fc","surface-dim":"#ccdbf3","on-secondary-fixed-variant":"#2f2ebe","on-tertiary-fixed":"#191c1e","surface-container-high":"#dce9ff","inverse-surface":"#233144","background":"#f8f9ff","on-error-container":"#93000a","inverse-on-surface":"#eaf1ff","outline-variant":"#c6c5d3","secondary-container":"#6063ee","on-tertiary-container":"#adb0b2","primary-fixed":"#dfe0ff","error":"#ba1a1a","on-background":"#0d1c2e","tertiary-fixed":"#e0e3e5","on-primary-fixed-variant":"#333f91"},"borderRadius":{"DEFAULT":"0.25rem","lg":"0.5rem","xl":"0.75rem","full":"9999px"},"spacing":{"gutter":"24px","base":"8px","xs":"4px","md":"24px","xl":"80px","container-max":"1280px","lg":"48px","sm":"12px"},"fontFamily":{"headline-md":["Inter"],"label-md":["Inter"],"headline-lg-mobile":["Inter"],"body-lg":["Inter"],"body-md":["Inter"],"label-sm":["Inter"],"display-lg":["Inter"],"body-sm":["Inter"],"headline-lg":["Inter"]},"fontSize":{"headline-md":["24px",{"lineHeight":"32px","fontWeight":"600"}],"label-md":["14px",{"lineHeight":"16px","letterSpacing":"0.01em","fontWeight":"500"}],"headline-lg-mobile":["24px",{"lineHeight":"32px","fontWeight":"600"}],"body-lg":["18px",{"lineHeight":"28px","fontWeight":"400"}],"body-md":["16px",{"lineHeight":"24px","fontWeight":"400"}],"label-sm":["12px",{"lineHeight":"14px","fontWeight":"600"}],"display-lg":["48px",{"lineHeight":"56px","letterSpacing":"-0.02em","fontWeight":"700"}],"body-sm":["14px",{"lineHeight":"20px","fontWeight":"400"}],"headline-lg":["32px",{"lineHeight":"40px","letterSpacing":"-0.01em","fontWeight":"600"}]}}}}</script><link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&amp;display=swap" rel="stylesheet"/><link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0" rel="stylesheet"/>
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet"/></head><body class="bg-background font-body-md text-on-background"><aside class="fixed left-0 top-0 h-full w-72 bg-surface-container-lowest z-50 flex flex-col shadow-[0_4px_20px_rgba(13,28,46,0.06)]"><div class="p-md flex flex-col gap-xs"><div class="flex items-center gap-sm"><div class="w-10 h-10 bg-primary flex items-center justify-center rounded-lg shadow-sm text-on-primary font-headline-md">M</div><div class="flex flex-col"><span class="font-headline-md text-primary tracking-tight text-[18px] leading-tight">Grupo Manzanares</span><span class="font-label-sm text-outline tracking-wider uppercase text-[11px]">S.A.S. • SG-SST</span></div></div><div class="flex items-center gap-xs mt-xs"><span class="inline-flex items-center px-xs py-0.5 rounded bg-surface-container-high text-primary font-label-sm text-[10px]">Dec. 1072</span><span class="inline-flex items-center px-xs py-0.5 rounded bg-surface-container-high text-primary font-label-sm text-[10px]">Res. 0312</span></div></div><div class="px-md py-xs"><button class="w-full flex items-center justify-center gap-xs bg-primary text-on-primary py-xs px-sm rounded-lg font-label-md hover:bg-primary-container transition-all shadow-sm" type="button"><span class="material-symbols-outlined text-[18px]">add_alert</span><span>Reporte Rápido</span></button></div><nav class="flex-1 px-sm py-xs space-y-1 overflow-y-auto" data-active-classes="bg-secondary-container text-on-secondary-container font-semibold"><div class="px-sm pt-xs pb-1 text-[11px] font-label-sm uppercase tracking-wider text-outline">Estratégico</div><a class="block px-md py-xs rounded-lg text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface transition-all font-label-md" data-path="dashboard" href="#">Dashboard General</a><a class="block px-md py-xs rounded-lg text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface transition-all font-label-md" data-path="alertas-sst" href="#">Alertas SST</a><div class="px-sm pt-sm pb-1 text-[11px] font-label-sm uppercase tracking-wider text-outline">Operaciones Críticas</div><a class="block px-md py-xs rounded-lg text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface transition-all font-label-md" data-path="inspecciones-seguridad" href="#">Inspecciones de Seguridad</a><a aria-current="page" class="block px-md py-xs rounded-lg transition-all bg-secondary-container text-on-secondary-container font-semibold" data-path="epp" href="#">Equipos de Protección (EPP)</a><a class="block px-md py-xs rounded-lg text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface transition-all font-label-md" data-path="trabajo-en-alturas" href="#">Trabajo en Alturas</a><a class="block px-md py-xs rounded-lg text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface transition-all font-label-md" data-path="tractoristas-operadores" href="#">Tractoristas y Operadores</a><a class="block px-md py-xs rounded-lg text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface transition-all font-label-md" data-path="pesv-seguridad-vial" href="#">PESV Seguridad Vial</a><div class="px-sm pt-sm pb-1 text-[11px] font-label-sm uppercase tracking-wider text-outline">Gestión Humana &amp; Salud</div><a class="block px-md py-xs rounded-lg text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface transition-all font-label-md" data-path="trabajadores" href="#">Censo de Trabajadores</a><a class="block px-md py-xs rounded-lg text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface transition-all font-label-md" data-path="examenes-medicos" href="#">Exámenes Médicos</a></nav><div class="mt-auto p-md border-t border-outline-variant/30 bg-surface-container-lowest"><div class="flex items-center justify-between"><div class="leading-tight"><div class="font-label-md text-on-surface text-[12px]">Sede Agroindustrial</div><div class="font-body-sm text-[11px] text-outline">Versión SG-SST 3.2</div></div><span class="inline-block w-2 h-2 rounded-full bg-secondary"></span></div></div></aside><div class="pl-72"><header class="fixed top-0 left-72 right-0 h-20 bg-surface/85 backdrop-blur-xl shadow-[0_1px_8px_rgba(0,0,0,0.04)] z-40 flex items-center justify-between px-md"><div class="flex items-center gap-md bg-surface-container-low px-md py-xs rounded-full w-96"><span class="material-symbols-outlined text-outline text-[20px]">search</span><input class="bg-transparent border-none focus:ring-0 text-body-sm w-full outline-none text-on-surface placeholder:text-outline" placeholder="Buscar inspecciones, cédula, actas o EPP..." type="text"/></div><div class="flex items-center gap-md"><div class="flex items-center gap-sm px-sm py-xs bg-surface-container-low rounded-full transition-colors"><div class="w-9 h-9 rounded-full bg-primary-container text-on-primary flex items-center justify-center font-label-md text-sm">AV</div><div class="hidden lg:block leading-tight text-left pr-xs"><div class="font-label-md text-on-surface">Ing. Andrés Valencia</div><div class="font-label-sm text-outline text-[11px]">Coordinador SG-SST</div></div></div><div class="h-8 w-px bg-outline-variant/30"></div><button class="flex items-center gap-xs px-sm py-xs text-on-surface-variant hover:text-error transition-colors" type="button"><span class="material-symbols-outlined text-[20px]">logout</span><span class="font-label-sm">Cerrar Sesión</span></button></div></header><main class="relative pt-20 bg-surface min-h-screen px-md py-md"><div class="flex flex-col w-full">
<!-- Top Level Metadata & Normative Header -->
<section class="mb-md">
<div class="flex flex-col lg:flex-row lg:items-center justify-between gap-sm">
<div class="space-y-xs max-w-4xl">
<div class="flex items-center gap-xs flex-wrap">
<span class="inline-flex items-center gap-xs px-xs py-0.5 rounded bg-primary-fixed text-on-primary-fixed-variant font-label-sm">
<span class="material-symbols-outlined text-[14px]">verified</span> Res. 2400 de 1979
          </span>
<span class="inline-flex items-center gap-xs px-xs py-0.5 rounded bg-secondary-fixed text-on-secondary-fixed font-label-sm">
<span class="material-symbols-outlined text-[14px]">policy</span> Dec. 1072 de 2015 Art. 2.2.4.6.24
          </span>
<span class="inline-flex items-center gap-xs px-xs py-0.5 rounded bg-surface-container-high text-on-surface-variant font-label-sm">
<span class="material-symbols-outlined text-[14px]">inventory_2</span> Módulo 12 • Dotación Operativa
          </span>
</div>
<h1 class="font-headline-lg text-headline-lg text-primary tracking-tight">
          12. Dotación y Gestión de Equipos de Protección Personal (EPP)
        </h1>
<p class="font-body-md text-body-md text-on-surface-variant">
          Control de ciclo de vida útil, registro biométrico de entrega según base maestra de trabajadores, alertas tempranas de reposición y analítica de consumo presupuestal para Grupo Manzanares S.A.S.
        </p>
</div>
<!-- Action Buttons Toolbar -->
<div class="flex flex-wrap items-center gap-xs">
<button class="inline-flex items-center gap-xs bg-primary text-on-primary px-sm py-xs rounded-lg font-label-md hover:bg-primary-container transition-colors shadow-sm" onclick="document.getElementById('modal-registro').classList.remove('hidden')" type="button">
<span class="material-symbols-outlined text-[18px]">add_circle</span>
<span>Registrar Entrega</span>
</button>
<button class="inline-flex items-center gap-xs bg-surface-container-low text-on-surface px-sm py-xs rounded-lg font-label-md hover:bg-surface-container transition-colors shadow-sm" onclick="document.getElementById('drawer-catalogo').classList.remove('hidden')" type="button">
<span class="material-symbols-outlined text-[18px]">category</span>
<span>Catálogo Paramétrico</span>
</button>
<button class="inline-flex items-center gap-xs bg-surface-container-lowest text-on-surface-variant px-sm py-xs rounded-lg font-label-md hover:bg-surface-container-high transition-colors shadow-sm" type="button">
<span class="material-symbols-outlined text-[18px]">file_download</span>
<span>Informe .XLSX</span>
</button>
<button class="inline-flex items-center gap-xs bg-surface-container-lowest text-on-surface-variant px-sm py-xs rounded-lg font-label-md hover:bg-surface-container-high transition-colors shadow-sm" type="button">
<span class="material-symbols-outlined text-[18px]">draw</span>
<span>Auditoría Digital</span>
</button>
</div>
</div>
</section>
<!-- Macro KPI Summary Strip -->
<section class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-sm mb-md">
<!-- Card 1 -->
<div class="bg-surface-container-lowest p-md rounded-xl shadow-sm flex flex-col justify-between">
<div class="flex items-start justify-between">
<div class="space-y-xs">
<span class="font-label-sm text-label-sm text-outline uppercase tracking-wider">Entregas del Mes</span>
<div class="font-headline-lg text-headline-lg text-on-surface font-semibold">142 <span class="font-body-sm text-body-sm font-normal text-outline">unds</span></div>
</div>
<div class="w-10 h-10 rounded-lg bg-surface-container-low flex items-center justify-center text-primary">
<span class="material-symbols-outlined text-[24px]">front_hand</span>
</div>
</div>
<div class="pt-sm space-y-xs">
<div class="flex items-center justify-between text-body-sm">
<span class="text-on-surface-variant font-body-sm">Ejecutado: $14.850.000 COP</span>
<span class="font-label-sm text-label-sm text-secondary font-semibold">92%</span>
</div>
<div class="w-full h-2 rounded bg-surface-container-high overflow-hidden">
<div class="h-full bg-secondary rounded" style="width: 92%;"></div>
</div>
<span class="font-label-sm text-label-sm text-outline">Conforme al cronograma legal semestral</span>
</div>
</div>
<!-- Card 2 -->
<div class="bg-surface-container-lowest p-md rounded-xl shadow-sm flex flex-col justify-between">
<div class="flex items-start justify-between">
<div class="space-y-xs">
<span class="font-label-sm text-label-sm text-outline uppercase tracking-wider">Pendientes de Entrega</span>
<div class="font-headline-lg text-headline-lg text-error font-semibold">18 <span class="font-body-sm text-body-sm font-normal text-outline">operarios</span></div>
</div>
<div class="w-10 h-10 rounded-lg bg-error-container flex items-center justify-center text-on-error-container">
<span class="material-symbols-outlined text-[24px]">priority_high</span>
</div>
</div>
<div class="pt-sm space-y-1">
<div class="flex items-center justify-between text-body-sm">
<span class="font-body-sm text-on-surface-variant">La Esperanza: 8</span>
<span class="font-body-sm text-on-surface-variant">San José: 6</span>
<span class="font-body-sm text-on-surface-variant">El Paraíso: 4</span>
</div>
<span class="inline-block px-xs py-0.5 rounded bg-error-container text-on-error-container font-label-sm text-label-sm">
          Bloqueo de labores críticas activo
        </span>
</div>
</div>
<!-- Card 3 -->
<div class="bg-surface-container-lowest p-md rounded-xl shadow-sm flex flex-col justify-between">
<div class="flex items-start justify-between">
<div class="space-y-xs">
<span class="font-label-sm text-label-sm text-outline uppercase tracking-wider">Próximas Reposiciones</span>
<div class="font-headline-lg text-headline-lg text-on-surface font-semibold">34 <span class="font-body-sm text-body-sm font-normal text-outline">&lt; 30 días</span></div>
</div>
<div class="w-10 h-10 rounded-lg bg-surface-container-high flex items-center justify-center text-primary-container">
<span class="material-symbols-outlined text-[24px]">update</span>
</div>
</div>
<div class="pt-sm space-y-xs">
<p class="font-body-sm text-body-sm text-on-surface-variant line-clamp-1">
          Filtros vapores, botas dieléctricas, nitrilo
        </p>
<div class="flex items-center gap-xs">
<span class="w-2 h-2 rounded-full bg-secondary"></span>
<span class="font-label-sm text-label-sm text-outline">Reabastecimiento automático en bodega</span>
</div>
</div>
</div>
<!-- Card 4 -->
<div class="bg-surface-container-lowest p-md rounded-xl shadow-sm flex flex-col justify-between">
<div class="flex items-start justify-between">
<div class="space-y-xs">
<span class="font-label-sm text-label-sm text-outline uppercase tracking-wider">Vida Útil Promedio</span>
<div class="font-headline-lg text-headline-lg text-primary font-semibold">94.2%</div>
</div>
<div class="w-10 h-10 rounded-lg bg-surface-container-low flex items-center justify-center text-primary">
<span class="material-symbols-outlined text-[24px]">verified_user</span>
</div>
</div>
<div class="pt-sm space-y-xs">
<div class="w-full h-2 rounded bg-surface-container-high overflow-hidden">
<div class="h-full bg-primary rounded" style="width: 94.2%;"></div>
</div>
<div class="flex items-center justify-between font-label-sm text-label-sm text-outline">
<span>Estándar fabricante 90%</span>
<span class="text-primary font-semibold">+4.2% Superado</span>
</div>
</div>
</div>
</section>
<!-- Analytics & Budget Projection Bento Grid -->
<section class="grid grid-cols-1 lg:grid-cols-12 gap-md mb-md">
<!-- Top Delivered EPPs Bar Visualizer (4 Cols) -->
<div class="lg:col-span-4 bg-surface-container-lowest p-md rounded-xl shadow-sm flex flex-col justify-between">
<div>
<div class="flex items-center justify-between mb-sm">
<div>
<h3 class="font-headline-md text-headline-md text-on-surface">EPP Más Entregados</h3>
<p class="font-body-sm text-body-sm text-outline">Volumen acumulado vigencia 2024</p>
</div>
<span class="material-symbols-outlined text-outline">bar_chart</span>
</div>
<div class="space-y-sm mt-sm">
<!-- Item 1 -->
<div>
<div class="flex justify-between font-label-sm text-label-sm mb-1">
<span class="text-on-surface">Guantes Nitrilo / Vaqueta</span>
<span class="font-semibold text-primary">320 pares (100%)</span>
</div>
<div class="h-2 rounded bg-surface-container-high overflow-hidden">
<div class="h-full bg-primary rounded" style="width: 100%;"></div>
</div>
</div>
<!-- Item 2 -->
<div>
<div class="flex justify-between font-label-sm text-label-sm mb-1">
<span class="text-on-surface">Botas c/ Puntera Seguridad</span>
<span class="font-semibold text-primary">110 pares (34.4%)</span>
</div>
<div class="h-2 rounded bg-surface-container-high overflow-hidden">
<div class="h-full bg-secondary-container rounded" style="width: 34.4%;"></div>
</div>
</div>
<!-- Item 3 -->
<div>
<div class="flex justify-between font-label-sm text-label-sm mb-1">
<span class="text-on-surface">Gafas de Seguridad UV 400</span>
<span class="font-semibold text-primary">95 unds (29.6%)</span>
</div>
<div class="h-2 rounded bg-surface-container-high overflow-hidden">
<div class="h-full bg-secondary rounded" style="width: 29.6%;"></div>
</div>
</div>
<!-- Item 4 -->
<div>
<div class="flex justify-between font-label-sm text-label-sm mb-1">
<span class="text-on-surface">Mascarillas Filtros Mixtos</span>
<span class="font-semibold text-primary">78 unds (24.3%)</span>
</div>
<div class="h-2 rounded bg-surface-container-high overflow-hidden">
<div class="h-full bg-primary-container rounded" style="width: 24.3%;"></div>
</div>
</div>
<!-- Item 5 -->
<div>
<div class="flex justify-between font-label-sm text-label-sm mb-1">
<span class="text-on-surface">Cascos Dieléctricos Tipo II</span>
<span class="font-semibold text-primary">45 unds (14.0%)</span>
</div>
<div class="h-2 rounded bg-surface-container-high overflow-hidden">
<div class="h-full bg-outline rounded" style="width: 14.0%;"></div>
</div>
</div>
</div>
</div>
<div class="p-xs bg-surface-container-low rounded-lg mt-sm flex items-center gap-xs">
<span class="material-symbols-outlined text-primary text-[18px]">inventory</span>
<span class="font-label-sm text-label-sm text-on-surface-variant">Rotación promedio: 22 días en bodega central</span>
</div>
</div>
<!-- Center Budget Spend per Location (4 Cols) -->
<div class="lg:col-span-4 bg-surface-container-lowest p-md rounded-xl shadow-sm flex flex-col justify-between">
<div>
<div class="flex items-center justify-between mb-sm">
<div>
<h3 class="font-headline-md text-headline-md text-on-surface">Consumo por Sede</h3>
<p class="font-body-sm text-body-sm text-outline">Ejecución presupuestal consolidada</p>
</div>
<span class="material-symbols-outlined text-outline">pie_chart</span>
</div>
<div class="flex items-center justify-center my-xs">
<!-- Inline Donut SVG -->
<div class="relative w-36 h-36 flex items-center justify-center">
<svg class="w-full h-full transform -rotate-90" viewbox="0 0 36 36">
<!-- Background Ring -->
<path class="text-surface-container-high" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" stroke-width="4.5"></path>
<!-- Finca La Esperanza 41% -->
<path class="text-primary" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" stroke-dasharray="41, 100" stroke-width="4.5"></path>
<!-- Finca San José 27% -->
<path class="text-secondary" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" stroke-dasharray="27, 100" stroke-dashoffset="-41" stroke-width="4.5"></path>
<!-- Finca El Paraíso 20% -->
<path class="text-secondary-fixed-dim" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" stroke-dasharray="20, 100" stroke-dashoffset="-68" stroke-width="4.5"></path>
<!-- Planta Central 12% -->
<path class="text-surface-container-highest" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" stroke-dasharray="12, 100" stroke-dashoffset="-88" stroke-width="4.5"></path>
</svg>
<div class="absolute inset-0 flex flex-col items-center justify-center">
<span class="font-headline-md text-headline-md text-primary font-bold">$44.9M</span>
<span class="font-label-sm text-label-sm text-outline">Total COP</span>
</div>
</div>
</div>
<div class="space-y-xs mt-sm font-body-sm text-body-sm">
<div class="flex items-center justify-between">
<div class="flex items-center gap-xs">
<span class="w-3 h-3 rounded-full bg-primary"></span>
<span>La Esperanza (Aguacate Hass)</span>
</div>
<span class="font-semibold text-on-surface">$18.420.000 (41%)</span>
</div>
<div class="flex items-center justify-between">
<div class="flex items-center gap-xs">
<span class="w-3 h-3 rounded-full bg-secondary"></span>
<span>San José (Beneficiadero)</span>
</div>
<span class="font-semibold text-on-surface">$12.150.000 (27%)</span>
</div>
<div class="flex items-center justify-between">
<div class="flex items-center gap-xs">
<span class="w-3 h-3 rounded-full bg-secondary-fixed-dim"></span>
<span>El Paraíso (Forestal)</span>
</div>
<span class="font-semibold text-on-surface">$8.900.000 (20%)</span>
</div>
<div class="flex items-center justify-between">
<div class="flex items-center gap-xs">
<span class="w-3 h-3 rounded-full bg-surface-container-highest"></span>
<span>Planta Central &amp; Logística</span>
</div>
<span class="font-semibold text-on-surface">$5.430.000 (12%)</span>
</div>
</div>
</div>
<div class="border-t-0 pt-xs">
<span class="font-label-sm text-label-sm text-outline">Asignación regida por Decreto 1072 Art. 2.2.4.6.17</span>
</div>
</div>
<!-- Right Wear Breakdown & Future Projection (4 Cols) -->
<div class="lg:col-span-4 flex flex-col gap-sm">
<!-- Wear Card -->
<div class="bg-surface-container-lowest p-md rounded-xl shadow-sm flex-1">
<div class="flex items-center justify-between mb-xs">
<h4 class="font-label-md text-label-md text-error font-semibold flex items-center gap-xs">
<span class="material-symbols-outlined text-[18px]">warning</span>
            Desgaste Prematuro Detectado
          </h4>
<span class="font-label-sm text-label-sm bg-error-container text-on-error-container px-xs rounded">Alerta Técnica</span>
</div>
<div class="space-y-xs mt-xs">
<div class="p-xs bg-surface-container-low rounded-lg">
<div class="flex justify-between font-label-md text-label-md text-on-surface">
<span>Guantes Vaqueta (Faena Poda)</span>
<span class="text-error font-semibold">Tasa 2.4x</span>
</div>
<p class="font-body-sm text-body-sm text-on-surface-variant mt-0.5">
              Causa: Alta fricción con espinos de cítricos. Recomendación: migrar a refuerzo de palma en flor de cuero.
            </p>
</div>
<div class="p-xs bg-surface-container-low rounded-lg">
<div class="flex justify-between font-label-md text-label-md text-on-surface">
<span>Filtros Vapores Orgánicos</span>
<span class="text-error font-semibold">28 días vs 45 d</span>
</div>
<p class="font-body-sm text-body-sm text-on-surface-variant mt-0.5">
              Saturación por humedad relativa &gt;85% en fumigación de La Esperanza. Se ajusta ciclo en matriz.
            </p>
</div>
</div>
</div>
<!-- Projection Banner Card -->
<div class="bg-gradient-to-br from-primary to-primary-container text-on-primary p-md rounded-xl shadow-sm flex flex-col justify-between">
<div class="space-y-xs">
<span class="font-label-sm text-label-sm uppercase tracking-wider text-on-primary-container">
            Proyección Q4 2024 / Q1 2025
          </span>
<div class="font-headline-lg text-headline-lg font-bold tracking-tight">
            $44.900.000 <span class="font-body-md text-body-md font-normal text-on-primary-container">COP</span>
</div>
<p class="font-body-sm text-body-sm text-on-primary-container">
            Estimación consolidada para compra por licitación masiva. Ahorro calculado del 14.2% frente a compras fraccionadas por finca.
          </p>
</div>
<div class="pt-sm flex items-center justify-between">
<span class="font-label-sm text-label-sm text-on-primary-fixed bg-primary-fixed px-xs py-0.5 rounded">
            Ahorro Proyectado: $6.370.000 COP
          </span>
<button class="text-on-primary text-body-sm hover:underline inline-flex items-center gap-0.5" type="button">
<span>Ver pliego</span>
<span class="material-symbols-outlined text-[16px]">arrow_forward</span>
</button>
</div>
</div>
</div>
</section>
<!-- Section Tabs Navigation -->
<section class="mb-md">
<div class="flex items-center gap-xs bg-surface-container-low p-1 rounded-xl w-fit">
<button class="px-md py-xs rounded-lg font-label-md text-label-md bg-surface-container-lowest text-primary font-semibold shadow-sm flex items-center gap-xs" type="button">
<span class="material-symbols-outlined text-[18px]">assignment_turned_in</span>
<span>1. Matriz de Entregas &amp; Dotación Activa</span>
<span class="px-xs py-0.5 rounded-full bg-primary text-on-primary text-[10px] font-semibold">142</span>
</button>
<button class="px-md py-xs rounded-lg font-label-md text-label-md text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high transition-all flex items-center gap-xs" onclick="document.getElementById('drawer-catalogo').classList.remove('hidden')" type="button">
<span class="material-symbols-outlined text-[18px]">grid_view</span>
<span>2. Catálogo Paramétrico de EPP (11 Categorías)</span>
</button>
<button class="px-md py-xs rounded-lg font-label-md text-label-md text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high transition-all flex items-center gap-xs" type="button">
<span class="material-symbols-outlined text-[18px]">payments</span>
<span>3. Proyección y Costeo Presupuestal</span>
</button>
</div>
</section>
<!-- Filter & Control Toolbar -->
<section class="bg-surface-container-lowest p-sm rounded-xl shadow-sm mb-md flex flex-wrap items-center justify-between gap-sm">
<div class="flex items-center gap-xs flex-1 min-w-[280px]">
<div class="flex items-center gap-xs bg-surface-container-low px-sm py-xs rounded-lg w-full max-w-md">
<span class="material-symbols-outlined text-outline text-[20px]">search</span>
<input class="bg-transparent text-body-sm text-on-surface outline-none placeholder:text-outline w-full" placeholder="Buscar por Cédula, Nombre o ID (ej. MNZ-0089)..." type="text"/>
</div>
</div>
<div class="flex items-center gap-xs flex-wrap">
<!-- Finca Select -->
<div class="flex items-center gap-xs bg-surface-container-low px-sm py-xs rounded-lg">
<span class="material-symbols-outlined text-outline text-[18px]">location_on</span>
<select class="bg-transparent text-label-md text-on-surface outline-none cursor-pointer">
<option value="all">Todas las Fincas</option>
<option value="esperanza">Finca La Esperanza</option>
<option value="sanjose">Finca San José</option>
<option value="paraiso">Finca El Paraíso</option>
<option value="central">Planta Central</option>
</select>
</div>
<!-- EPP Category Select -->
<div class="flex items-center gap-xs bg-surface-container-low px-sm py-xs rounded-lg">
<span class="material-symbols-outlined text-outline text-[18px]">filter_list</span>
<select class="bg-transparent text-label-md text-on-surface outline-none cursor-pointer">
<option value="all">Todas las Categorías EPP</option>
<option value="botas">Botas</option>
<option value="guantes">Guantes</option>
<option value="gafas">Gafas de Seguridad</option>
<option value="casco">Casco de Seguridad</option>
<option value="auditiva">Protección Auditiva</option>
<option value="respiratoria">Protección Respiratoria</option>
<option value="alturas">Arnés &amp; Alturas</option>
</select>
</div>
<!-- Status Semáforo Select -->
<div class="flex items-center gap-xs bg-surface-container-low px-sm py-xs rounded-lg">
<span class="material-symbols-outlined text-outline text-[18px]">traffic</span>
<select class="bg-transparent text-label-md text-on-surface outline-none cursor-pointer">
<option value="all">Todos los Estados</option>
<option value="green">Al Día / Vigente</option>
<option value="yellow">Próximo a Vencer (&lt; 15 días)</option>
<option value="red">Vencido (Cambio Inmediato)</option>
</select>
</div>
<button class="p-xs text-outline hover:text-on-surface rounded-lg hover:bg-surface-container-low transition-colors" title="Limpiar Filtros" type="button">
<span class="material-symbols-outlined text-[20px]">refresh</span>
</button>
</div>
</section>
<!-- Comprehensive Data Matrix (Table) -->
<section class="bg-surface-container-lowest rounded-xl shadow-sm overflow-hidden mb-md">
<div class="overflow-x-auto">
<table class="w-full text-left border-collapse">
<thead class="bg-surface-container-low">
<tr>
<th class="px-sm py-xs font-label-sm text-label-sm text-outline uppercase tracking-wider">Trabajador &amp; Cédula</th>
<th class="px-sm py-xs font-label-sm text-label-sm text-outline uppercase tracking-wider">EPP Entregado &amp; Especificación</th>
<th class="px-sm py-xs font-label-sm text-label-sm text-outline uppercase tracking-wider">Tipo / Categoría</th>
<th class="px-sm py-xs font-label-sm text-label-sm text-outline uppercase tracking-wider">Cant. / Talla</th>
<th class="px-sm py-xs font-label-sm text-label-sm text-outline uppercase tracking-wider">Entrega</th>
<th class="px-sm py-xs font-label-sm text-label-sm text-outline uppercase tracking-wider">Vida Útil</th>
<th class="px-sm py-xs font-label-sm text-label-sm text-outline uppercase tracking-wider">Próxima Reposición</th>
<th class="px-sm py-xs font-label-sm text-label-sm text-outline uppercase tracking-wider">Responsable</th>
<th class="px-sm py-xs font-label-sm text-label-sm text-outline uppercase tracking-wider">Acta / Evidencia</th>
<th class="px-sm py-xs font-label-sm text-label-sm text-outline uppercase tracking-wider text-right">Acciones</th>
</tr>
</thead>
<tbody class="divide-y-0 text-body-sm font-body-sm">
<!-- Row 1: Vigente -->
<tr class="hover:bg-surface-container-low transition-colors">
<td class="px-sm py-xs">
<div class="font-label-md text-label-md text-on-surface font-semibold">Carlos Arturo Morales</div>
<div class="text-[12px] text-outline">CC 1.054.890.231 • <span class="font-semibold text-primary">MNZ-0089</span></div>
<div class="text-[11px] text-on-surface-variant">Operador Agrícola • Finca La Esperanza</div>
</td>
<td class="px-sm py-xs">
<div class="font-label-md text-label-md text-on-surface">Botas Puntera Croydon Titán</div>
<div class="text-[12px] text-outline">Cuero hidrofugado dieléctrico ASTM F2413</div>
</td>
<td class="px-sm py-xs">
<span class="inline-flex items-center px-xs py-0.5 rounded bg-surface-container-high text-on-surface font-label-sm text-[11px]">
                Botas de Seguridad
              </span>
</td>
<td class="px-sm py-xs text-on-surface">
<span class="font-semibold">1 Par</span> • Talla 41
            </td>
<td class="px-sm py-xs text-on-surface-variant">
              15/08/2024
            </td>
<td class="px-sm py-xs text-on-surface-variant">
              6 meses
            </td>
<td class="px-sm py-xs">
<div class="inline-flex items-center gap-xs px-xs py-0.5 rounded bg-secondary-fixed text-on-secondary-fixed font-label-sm text-[11px]">
<span class="w-1.5 h-1.5 rounded-full bg-secondary"></span>
<span>15/02/2025 • Vigente</span>
</div>
</td>
<td class="px-sm py-xs text-on-surface-variant">
<div class="text-[12px] font-semibold text-on-surface">J. Castaño</div>
<div class="text-[11px] text-outline">Almacenista SST</div>
</td>
<td class="px-sm py-xs">
<span class="inline-flex items-center gap-xs text-[11px] font-label-sm text-primary hover:underline cursor-pointer bg-surface-container-high px-xs py-0.5 rounded">
<span class="material-symbols-outlined text-[14px]">verified</span>
<span>Firma Verificada</span>
<span class="material-symbols-outlined text-[14px]">picture_as_pdf</span>
</span>
</td>
<td class="px-sm py-xs text-right">
<button class="p-xs text-outline hover:text-primary rounded" title="Detalle de ficha" type="button">
<span class="material-symbols-outlined text-[18px]">more_vert</span>
</button>
</td>
</tr>
<!-- Row 2: Vencido (Red Alert) -->
<tr class="bg-error-container/20 hover:bg-error-container/30 transition-colors">
<td class="px-sm py-xs">
<div class="font-label-md text-label-md text-on-surface font-semibold">Hernando Gómez Ruiz</div>
<div class="text-[12px] text-outline">CC 79.432.109 • <span class="font-semibold text-primary">MNZ-0142</span></div>
<div class="text-[11px] text-on-surface-variant">Fumigador Fitosanitario • Finca San José</div>
</td>
<td class="px-sm py-xs">
<div class="font-label-md text-label-md text-on-surface">Cartuchos Vapores Orgánicos 3M 6003</div>
<div class="text-[12px] text-outline">Filtro mixto para plaguicidas NIOSH</div>
</td>
<td class="px-sm py-xs">
<span class="inline-flex items-center px-xs py-0.5 rounded bg-error-container text-on-error-container font-label-sm text-[11px]">
                Protección Respiratoria
              </span>
</td>
<td class="px-sm py-xs text-on-surface">
<span class="font-semibold">1 Par</span> • Talla Única
            </td>
<td class="px-sm py-xs text-on-surface-variant">
              01/09/2024
            </td>
<td class="px-sm py-xs text-on-surface-variant">
              30 días (operativo)
            </td>
<td class="px-sm py-xs">
<div class="inline-flex items-center gap-xs px-xs py-0.5 rounded bg-error-container text-on-error-container font-label-sm text-[11px]">
<span class="w-1.5 h-1.5 rounded-full bg-error"></span>
<span>01/10/2024 • Vencido (Urgente)</span>
</div>
</td>
<td class="px-sm py-xs text-on-surface-variant">
<div class="text-[12px] font-semibold text-on-surface">M. Benítez</div>
<div class="text-[11px] text-outline">Supervisor Fitosanitario</div>
</td>
<td class="px-sm py-xs">
<span class="inline-flex items-center gap-xs text-[11px] font-label-sm text-error hover:underline cursor-pointer bg-error-container px-xs py-0.5 rounded">
<span class="material-symbols-outlined text-[14px]">warning</span>
<span>Reposición Bloqueada</span>
</span>
</td>
<td class="px-sm py-xs text-right">
<button class="px-xs py-0.5 bg-error text-on-error rounded font-label-sm text-[11px] hover:bg-on-error-container transition-colors" type="button">
                Despachar Ya
              </button>
</td>
</tr>
<!-- Row 3: Próximo a vencer (Yellow Alert) -->
<tr class="hover:bg-surface-container-low transition-colors">
<td class="px-sm py-xs">
<div class="font-label-md text-label-md text-on-surface font-semibold">Mauricio Echeverry Posada</div>
<div class="text-[12px] text-outline">CC 1.053.778.910 • <span class="font-semibold text-primary">MNZ-0034</span></div>
<div class="text-[11px] text-on-surface-variant">Motosierrista / Podador • Finca El Paraíso</div>
</td>
<td class="px-sm py-xs">
<div class="font-label-md text-label-md text-on-surface">Guantes de Vaqueta Tipo Ingeniero Reforzados</div>
<div class="text-[12px] text-outline">Refuerzo en palma y nudillos en carnaza de res</div>
</td>
<td class="px-sm py-xs">
<span class="inline-flex items-center px-xs py-0.5 rounded bg-surface-container-high text-on-surface font-label-sm text-[11px]">
                Guantes / Vaqueta
              </span>
</td>
<td class="px-sm py-xs text-on-surface">
<span class="font-semibold">2 Pares</span> • Talla 9
            </td>
<td class="px-sm py-xs text-on-surface-variant">
              10/09/2024
            </td>
<td class="px-sm py-xs text-on-surface-variant">
              2 meses
            </td>
<td class="px-sm py-xs">
<div class="inline-flex items-center gap-xs px-xs py-0.5 rounded bg-surface-container-highest text-on-surface font-label-sm text-[11px]">
<span class="w-1.5 h-1.5 rounded-full bg-secondary"></span>
<span>10/11/2024 • Próximo (12 días)</span>
</div>
</td>
<td class="px-sm py-xs text-on-surface-variant">
<div class="text-[12px] font-semibold text-on-surface">J. Castaño</div>
<div class="text-[11px] text-outline">Almacenista SST</div>
</td>
<td class="px-sm py-xs">
<span class="inline-flex items-center gap-xs text-[11px] font-label-sm text-primary hover:underline cursor-pointer bg-surface-container-high px-xs py-0.5 rounded">
<span class="material-symbols-outlined text-[14px]">verified</span>
<span>Acta #1184-MNZ</span>
</span>
</td>
<td class="px-sm py-xs text-right">
<button class="p-xs text-outline hover:text-primary rounded" title="Programar renovación" type="button">
<span class="material-symbols-outlined text-[18px]">calendar_clock</span>
</button>
</td>
</tr>
<!-- Row 4: Arnés Alturas (Vida útil plurianual) -->
<tr class="hover:bg-surface-container-low transition-colors">
<td class="px-sm py-xs">
<div class="font-label-md text-label-md text-on-surface font-semibold">Gabriel Darío Salazar</div>
<div class="text-[12px] text-outline">CC 9.872.411 • <span class="font-semibold text-primary">MNZ-0012</span></div>
<div class="text-[11px] text-on-surface-variant">Técnico Mantenimiento Silos • Planta Central</div>
</td>
<td class="px-sm py-xs">
<div class="font-label-md text-label-md text-on-surface">Arnés Multipropósito 4 Argollas ANSI Z359.11</div>
<div class="text-[12px] text-outline">Poliéster de alta tenacidad con indicador de impacto</div>
</td>
<td class="px-sm py-xs">
<span class="inline-flex items-center px-xs py-0.5 rounded bg-surface-container-high text-on-surface font-label-sm text-[11px]">
                Trabajo en Alturas
              </span>
</td>
<td class="px-sm py-xs text-on-surface">
<span class="font-semibold">1 Und</span> • Talla L-XL
            </td>
<td class="px-sm py-xs text-on-surface-variant">
              12/01/2023
            </td>
<td class="px-sm py-xs text-on-surface-variant">
              3 años (inspección anual)
            </td>
<td class="px-sm py-xs">
<div class="inline-flex items-center gap-xs px-xs py-0.5 rounded bg-secondary-fixed text-on-secondary-fixed font-label-sm text-[11px]">
<span class="w-1.5 h-1.5 rounded-full bg-secondary"></span>
<span>12/01/2026 • Vigente</span>
</div>
</td>
<td class="px-sm py-xs text-on-surface-variant">
<div class="text-[12px] font-semibold text-on-surface">Ing. A. Valencia</div>
<div class="text-[11px] text-outline">Coordinador SST</div>
</td>
<td class="px-sm py-xs">
<span class="inline-flex items-center gap-xs text-[11px] font-label-sm text-primary hover:underline cursor-pointer bg-surface-container-high px-xs py-0.5 rounded">
<span class="material-symbols-outlined text-[14px]">verified</span>
<span>Hoja de Vida #ALT-09</span>
</span>
</td>
<td class="px-sm py-xs text-right">
<button class="p-xs text-outline hover:text-primary rounded" title="Inspección periódica" type="button">
<span class="material-symbols-outlined text-[18px]">verified_user</span>
</button>
</td>
</tr>
<!-- Row 5: Protección Auditiva -->
<tr class="hover:bg-surface-container-low transition-colors">
<td class="px-sm py-xs">
<div class="font-label-md text-label-md text-on-surface font-semibold">Albeiro de Jesús Cardona</div>
<div class="text-[12px] text-outline">CC 70.198.423 • <span class="font-semibold text-primary">MNZ-0077</span></div>
<div class="text-[11px] text-on-surface-variant">Tractorista Cabina Abierta • Finca San José</div>
</td>
<td class="px-sm py-xs">
<div class="font-label-md text-label-md text-on-surface">Protector Auditivo de Copa Peltor Optime 105</div>
<div class="text-[12px] text-outline">Atenuación NRR 30 dB para ruido agroindustrial severo</div>
</td>
<td class="px-sm py-xs">
<span class="inline-flex items-center px-xs py-0.5 rounded bg-surface-container-high text-on-surface font-label-sm text-[11px]">
                Protección Auditiva
              </span>
</td>
<td class="px-sm py-xs text-on-surface">
<span class="font-semibold">1 Und</span> • Ajustable
            </td>
<td class="px-sm py-xs text-on-surface-variant">
              05/06/2024
            </td>
<td class="px-sm py-xs text-on-surface-variant">
              12 meses
            </td>
<td class="px-sm py-xs">
<div class="inline-flex items-center gap-xs px-xs py-0.5 rounded bg-secondary-fixed text-on-secondary-fixed font-label-sm text-[11px]">
<span class="w-1.5 h-1.5 rounded-full bg-secondary"></span>
<span>05/06/2025 • Vigente</span>
</div>
</td>
<td class="px-sm py-xs text-on-surface-variant">
<div class="text-[12px] font-semibold text-on-surface">J. Castaño</div>
<div class="text-[11px] text-outline">Almacenista SST</div>
</td>
<td class="px-sm py-xs">
<span class="inline-flex items-center gap-xs text-[11px] font-label-sm text-primary hover:underline cursor-pointer bg-surface-container-high px-xs py-0.5 rounded">
<span class="material-symbols-outlined text-[14px]">verified</span>
<span>Acta #0921-MNZ</span>
</span>
</td>
<td class="px-sm py-xs text-right">
<button class="p-xs text-outline hover:text-primary rounded" title="Ver registros" type="button">
<span class="material-symbols-outlined text-[18px]">more_vert</span>
</button>
</td>
</tr>
</tbody>
</table>
</div>
<!-- Table Pagination & Count Strip -->
<div class="p-sm bg-surface-container-low flex flex-col sm:flex-row items-center justify-between gap-xs">
<span class="font-body-sm text-body-sm text-outline">
        Mostrando <strong class="text-on-surface">5</strong> de <strong class="text-on-surface">142</strong> registros de dotación activa en nómina
      </span>
<div class="flex items-center gap-xs">
<button class="p-xs bg-surface-container-lowest text-outline rounded hover:text-on-surface transition-colors" type="button">
<span class="material-symbols-outlined text-[18px]">chevron_left</span>
</button>
<span class="font-label-md text-label-md px-xs py-0.5 bg-primary text-on-primary rounded">1</span>
<button class="font-label-md text-label-md px-xs py-0.5 text-on-surface hover:bg-surface-container-high rounded transition-colors" type="button">2</button>
<button class="font-label-md text-label-md px-xs py-0.5 text-on-surface hover:bg-surface-container-high rounded transition-colors" type="button">3</button>
<button class="p-xs bg-surface-container-lowest text-outline rounded hover:text-on-surface transition-colors" type="button">
<span class="material-symbols-outlined text-[18px]">chevron_right</span>
</button>
</div>
</div>
</section>
<!-- PARAMETRIC CATALOG SECTION (11 Mandatory Categories Showcase) -->
<section class="mb-xl">
<div class="flex items-center justify-between mb-sm">
<div>
<h2 class="font-headline-md text-headline-md text-on-surface">Catálogo Técnico Normativo de EPP (11 Familias)</h2>
<p class="font-body-sm text-body-sm text-outline">Fichas estandarizadas homologadas según matriz de identificación de peligros GTC-45</p>
</div>
<span class="font-label-sm text-label-sm text-primary bg-primary-fixed px-sm py-xs rounded-full font-semibold">
        Resolución 2400 / Icontec
      </span>
</div>
<div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-sm">
<!-- 1. Botas -->
<div class="bg-surface-container-lowest p-sm rounded-xl shadow-sm flex flex-col justify-between hover:-translate-y-0.5 transition-transform">
<div class="space-y-xs">
<div class="w-8 h-8 rounded-lg bg-surface-container-low flex items-center justify-center text-primary mb-xs">
<span class="material-symbols-outlined text-[20px]">hiking</span>
</div>
<span class="font-label-sm text-label-sm text-outline">01. Calzado</span>
<h4 class="font-label-md text-label-md text-on-surface font-semibold">Botas de Seguridad</h4>
<p class="font-body-sm text-[12px] leading-tight text-on-surface-variant">
            Cuero c/ puntera dieléctrica, caña alta de caucho nitrilo y protección para fitosanitarios.
          </p>
</div>
<div class="pt-sm border-t-0 flex items-center justify-between text-[11px] font-label-sm text-outline">
<span>Vida útil: 6 m</span>
<span class="text-primary font-semibold">3 Ref</span>
</div>
</div>
<!-- 2. Guantes -->
<div class="bg-surface-container-lowest p-sm rounded-xl shadow-sm flex flex-col justify-between hover:-translate-y-0.5 transition-transform">
<div class="space-y-xs">
<div class="w-8 h-8 rounded-lg bg-surface-container-low flex items-center justify-center text-primary mb-xs">
<span class="material-symbols-outlined text-[20px]">front_hand</span>
</div>
<span class="font-label-sm text-label-sm text-outline">02. Extremidades Sup.</span>
<h4 class="font-label-md text-label-md text-on-surface font-semibold">Guantes Industriales</h4>
<p class="font-body-sm text-[12px] leading-tight text-on-surface-variant">
            Nitrilo verde largo (químicos), vaqueta para poda, carnaza pesada y anticorte nivel 5.
          </p>
</div>
<div class="pt-sm border-t-0 flex items-center justify-between text-[11px] font-label-sm text-outline">
<span>Vida útil: 1-2 m</span>
<span class="text-primary font-semibold">4 Ref</span>
</div>
</div>
<!-- 3. Gafas -->
<div class="bg-surface-container-lowest p-sm rounded-xl shadow-sm flex flex-col justify-between hover:-translate-y-0.5 transition-transform">
<div class="space-y-xs">
<div class="w-8 h-8 rounded-lg bg-surface-container-low flex items-center justify-center text-primary mb-xs">
<span class="material-symbols-outlined text-[20px]">visibility</span>
</div>
<span class="font-label-sm text-label-sm text-outline">03. Visual</span>
<h4 class="font-label-md text-label-md text-on-surface font-semibold">Gafas y Monogafas</h4>
<p class="font-body-sm text-[12px] leading-tight text-on-surface-variant">
            Policarbonato antiempañante UV 400 y monogafas herméticas de ventilación indirecta.
          </p>
</div>
<div class="pt-sm border-t-0 flex items-center justify-between text-[11px] font-label-sm text-outline">
<span>Vida útil: 4 m</span>
<span class="text-primary font-semibold">2 Ref</span>
</div>
</div>
<!-- 4. Casco -->
<div class="bg-surface-container-lowest p-sm rounded-xl shadow-sm flex flex-col justify-between hover:-translate-y-0.5 transition-transform">
<div class="space-y-xs">
<div class="w-8 h-8 rounded-lg bg-surface-container-low flex items-center justify-center text-primary mb-xs">
<span class="material-symbols-outlined text-[20px]">hardware</span>
</div>
<span class="font-label-sm text-label-sm text-outline">04. Craneana</span>
<h4 class="font-label-md text-label-md text-on-surface font-semibold">Casco de Seguridad</h4>
<p class="font-body-sm text-[12px] leading-tight text-on-surface-variant">
            Dieléctrico Clase E Tipo II con barbuquejo de 3 puntos y suspensión de 6 apoyos.
          </p>
</div>
<div class="pt-sm border-t-0 flex items-center justify-between text-[11px] font-label-sm text-outline">
<span>Vida útil: 24 m</span>
<span class="text-primary font-semibold">1 Ref</span>
</div>
</div>
<!-- 5. Auditiva -->
<div class="bg-surface-container-lowest p-sm rounded-xl shadow-sm flex flex-col justify-between hover:-translate-y-0.5 transition-transform">
<div class="space-y-xs">
<div class="w-8 h-8 rounded-lg bg-surface-container-low flex items-center justify-center text-primary mb-xs">
<span class="material-symbols-outlined text-[20px]">headphones</span>
</div>
<span class="font-label-sm text-label-sm text-outline">05. Auditiva</span>
<h4 class="font-label-md text-label-md text-on-surface font-semibold">Protección Auditiva</h4>
<p class="font-body-sm text-[12px] leading-tight text-on-surface-variant">
            Copas dieléctricas para tractoristas NRR 27-30dB y tapones premoldeados lavables.
          </p>
</div>
<div class="pt-sm border-t-0 flex items-center justify-between text-[11px] font-label-sm text-outline">
<span>Vida útil: 6-12 m</span>
<span class="text-primary font-semibold">2 Ref</span>
</div>
</div>
<!-- 6. Respiratoria -->
<div class="bg-surface-container-lowest p-sm rounded-xl shadow-sm flex flex-col justify-between hover:-translate-y-0.5 transition-transform">
<div class="space-y-xs">
<div class="w-8 h-8 rounded-lg bg-surface-container-low flex items-center justify-center text-primary mb-xs">
<span class="material-symbols-outlined text-[20px]">masks</span>
</div>
<span class="font-label-sm text-label-sm text-outline">06. Respiratoria</span>
<h4 class="font-label-md text-label-md text-on-surface font-semibold">Protección Resp.</h4>
<p class="font-body-sm text-[12px] leading-tight text-on-surface-variant">
            Media cara siliconada con cartuchos químicos mixtos (plaguicidas y gases ácidos).
          </p>
</div>
<div class="pt-sm border-t-0 flex items-center justify-between text-[11px] font-label-sm text-outline">
<span>Cartuchos: 1 m</span>
<span class="text-primary font-semibold">3 Ref</span>
</div>
</div>
<!-- 7. Arnés -->
<div class="bg-surface-container-lowest p-sm rounded-xl shadow-sm flex flex-col justify-between hover:-translate-y-0.5 transition-transform">
<div class="space-y-xs">
<div class="w-8 h-8 rounded-lg bg-surface-container-low flex items-center justify-center text-primary mb-xs">
<span class="material-symbols-outlined text-[20px]">safety_check</span>
</div>
<span class="font-label-sm text-label-sm text-outline">07. Caídas</span>
<h4 class="font-label-md text-label-md text-on-surface font-semibold">Arnés Multipropósito</h4>
<p class="font-body-sm text-[12px] leading-tight text-on-surface-variant">
            Cuerpo entero 4 argollas según ANSI Z359.11 para mantenimiento en silos y techos.
          </p>
</div>
<div class="pt-sm border-t-0 flex items-center justify-between text-[11px] font-label-sm text-outline">
<span>Vida útil: 36 m</span>
<span class="text-primary font-semibold">1 Ref</span>
</div>
</div>
<!-- 8. Eslinga -->
<div class="bg-surface-container-lowest p-sm rounded-xl shadow-sm flex flex-col justify-between hover:-translate-y-0.5 transition-transform">
<div class="space-y-xs">
<div class="w-8 h-8 rounded-lg bg-surface-container-low flex items-center justify-center text-primary mb-xs">
<span class="material-symbols-outlined text-[20px]">cable</span>
</div>
<span class="font-label-sm text-label-sm text-outline">08. Amarre</span>
<h4 class="font-label-md text-label-md text-on-surface font-semibold">Eslingas Técnicas</h4>
<p class="font-body-sm text-[12px] leading-tight text-on-surface-variant">
            Eslinga doble en 'Y' con absorbedor de energía y eslinga de posicionamiento regulable.
          </p>
</div>
<div class="pt-sm border-t-0 flex items-center justify-between text-[11px] font-label-sm text-outline">
<span>Vida útil: 36 m</span>
<span class="text-primary font-semibold">2 Ref</span>
</div>
</div>
<!-- 9. Impermeable -->
<div class="bg-surface-container-lowest p-sm rounded-xl shadow-sm flex flex-col justify-between hover:-translate-y-0.5 transition-transform">
<div class="space-y-xs">
<div class="w-8 h-8 rounded-lg bg-surface-container-low flex items-center justify-center text-primary mb-xs">
<span class="material-symbols-outlined text-[20px]">umbrella</span>
</div>
<span class="font-label-sm text-label-sm text-outline">09. Clima Extremo</span>
<h4 class="font-label-md text-label-md text-on-surface font-semibold">Impermeable Lluvia</h4>
<p class="font-body-sm text-[12px] leading-tight text-on-surface-variant">
            Conjunto dos piezas vulcanizado amarillo de alta visibilidad con bandas reflectivas 3M.
          </p>
</div>
<div class="pt-sm border-t-0 flex items-center justify-between text-[11px] font-label-sm text-outline">
<span>Vida útil: 12 m</span>
<span class="text-primary font-semibold">2 Ref</span>
</div>
</div>
<!-- 10. Vaqueta & Polainas -->
<div class="bg-surface-container-lowest p-sm rounded-xl shadow-sm flex flex-col justify-between hover:-translate-y-0.5 transition-transform">
<div class="space-y-xs">
<div class="w-8 h-8 rounded-lg bg-surface-container-low flex items-center justify-center text-primary mb-xs">
<span class="material-symbols-outlined text-[20px]">shield</span>
</div>
<span class="font-label-sm text-label-sm text-outline">10. Agro-Protección</span>
<h4 class="font-label-md text-label-md text-on-surface font-semibold">Vaqueta / Polainas</h4>
<p class="font-body-sm text-[12px] leading-tight text-on-surface-variant">
            Polainas de carnaza contra mordedura de ofidios y guantes largos de podador de árboles.
          </p>
</div>
<div class="pt-sm border-t-0 flex items-center justify-between text-[11px] font-label-sm text-outline">
<span>Vida útil: 8 m</span>
<span class="text-primary font-semibold">2 Ref</span>
</div>
</div>
<!-- 11. Otros Especiales -->
<div class="bg-surface-container-lowest p-sm rounded-xl shadow-sm flex flex-col justify-between hover:-translate-y-0.5 transition-transform">
<div class="space-y-xs">
<div class="w-8 h-8 rounded-lg bg-surface-container-low flex items-center justify-center text-primary mb-xs">
<span class="material-symbols-outlined text-[20px]">build_circle</span>
</div>
<span class="font-label-sm text-label-sm text-outline">11. Especializados</span>
<h4 class="font-label-md text-label-md text-on-surface font-semibold">Otros EPP Finca</h4>
<p class="font-body-sm text-[12px] leading-tight text-on-surface-variant">
            Delantal PVC calibre pesado para lavado de tractores y careta de malla para guadañadores.
          </p>
</div>
<div class="pt-sm border-t-0 flex items-center justify-between text-[11px] font-label-sm text-outline">
<span>Vida útil: 6 m</span>
<span class="text-primary font-semibold">4 Ref</span>
</div>
</div>
<!-- Quick Add Card -->
<div class="bg-surface-container-low border-dashed p-sm rounded-xl flex flex-col items-center justify-center text-center cursor-pointer hover:bg-surface-container transition-colors group" onclick="document.getElementById('modal-registro').classList.remove('hidden')">
<div class="w-10 h-10 rounded-full bg-surface-container-lowest flex items-center justify-center text-primary shadow-sm mb-xs group-hover:scale-110 transition-transform">
<span class="material-symbols-outlined text-[20px]">add</span>
</div>
<span class="font-label-md text-label-md text-primary font-semibold">Registrar Ítem</span>
<span class="font-body-sm text-[11px] text-outline mt-0.5">Homologar nueva ficha</span>
</div>
</div>
</section>
<!-- MODAL: REGISTRO DE ENTREGA / DOTACIÓN (Biométrico / Digital) -->
<div class="fixed inset-0 z-50 bg-inverse-surface/40 backdrop-blur-sm hidden flex items-center justify-center p-sm" id="modal-registro">
<div class="bg-surface-container-lowest rounded-xl max-w-2xl w-full p-md shadow-xl max-h-[90vh] overflow-y-auto">
<div class="flex items-center justify-between pb-sm mb-sm border-b-0">
<div class="space-y-0.5">
<h3 class="font-headline-md text-headline-md text-primary">Acta de Entrega y Dotación de EPP</h3>
<p class="font-body-sm text-body-sm text-outline">Conexión con Base Maestra de Trabajadores • Grupo Manzanares S.A.S.</p>
</div>
<button class="p-xs text-outline hover:text-on-surface rounded-lg" onclick="document.getElementById('modal-registro').classList.add('hidden')" type="button">
<span class="material-symbols-outlined">close</span>
</button>
</div>
<form class="space-y-sm" onsubmit="event.preventDefault(); alert('Entrega registrada exitosamente y sincronizada con nómina.'); document.getElementById('modal-registro').classList.add('hidden');">
<!-- Worker Auto-select -->
<div>
<label class="block font-label-md text-label-md text-on-surface mb-1">Trabajador Destinatario (Buscar en Base Maestra)</label>
<div class="flex items-center gap-xs bg-surface-container-low p-xs rounded-lg">
<span class="material-symbols-outlined text-outline">badge</span>
<input class="w-full bg-transparent text-body-sm font-semibold text-on-surface outline-none" type="text" value="Carlos Arturo Morales — CC 1.054.890.231 (MNZ-0089)"/>
</div>
<span class="font-label-sm text-[11px] text-outline mt-0.5 block">Sede: Finca La Esperanza • Cargo: Operador Agrícola</span>
</div>
<div class="grid grid-cols-1 md:grid-cols-2 gap-sm">
<!-- Item Category -->
<div>
<label class="block font-label-md text-label-md text-on-surface mb-1">Categoría de EPP</label>
<select class="w-full bg-surface-container-low text-body-sm text-on-surface p-xs rounded-lg outline-none">
<option>01. Calzado de Seguridad</option>
<option selected="">02. Guantes Industriales</option>
<option>03. Gafas y Monogafas</option>
<option>04. Casco Dieléctrico</option>
<option>05. Protección Auditiva</option>
<option>06. Protección Respiratoria</option>
<option>07. Arnés y Alturas</option>
<option>08. Eslingas</option>
<option>09. Impermeables</option>
<option>10. Vaqueta y Cuero</option>
<option>11. Otros Especiales</option>
</select>
</div>
<!-- Product Item Spec -->
<div>
<label class="block font-label-md text-label-md text-on-surface mb-1">Referencia Específica</label>
<input class="w-full bg-surface-container-low text-body-sm text-on-surface p-xs rounded-lg outline-none" type="text" value="Guante Nitrilo Ansell Solvex 37-175"/>
</div>
<!-- Quantity and Size -->
<div>
<label class="block font-label-md text-label-md text-on-surface mb-1">Cantidad y Talla</label>
<div class="flex gap-xs">
<input class="w-20 bg-surface-container-low text-body-sm text-on-surface p-xs rounded-lg outline-none text-center" min="1" type="number" value="2"/>
<input class="flex-1 bg-surface-container-low text-body-sm text-on-surface p-xs rounded-lg outline-none" type="text" value="Talla 9 (L)"/>
</div>
</div>
<!-- Expected Useful Life -->
<div>
<label class="block font-label-md text-label-md text-on-surface mb-1">Vida Útil Paramétrica</label>
<input class="w-full bg-surface-container-low text-body-sm text-on-surface p-xs rounded-lg outline-none" type="text" value="45 Días Calendario"/>
</div>
</div>
<!-- Motivo / Tipo de Dotación -->
<div>
<label class="block font-label-md text-label-md text-on-surface mb-1">Motivo de la Entrega</label>
<div class="grid grid-cols-3 gap-xs">
<label class="flex items-center gap-xs p-xs rounded-lg bg-surface-container-low cursor-pointer font-label-sm text-label-sm text-on-surface">
<input checked="" class="text-primary" name="motivo" type="radio"/>
<span>Dotación Periódica</span>
</label>
<label class="flex items-center gap-xs p-xs rounded-lg bg-surface-container-low cursor-pointer font-label-sm text-label-sm text-on-surface">
<input class="text-primary" name="motivo" type="radio"/>
<span>Reposición Desgaste</span>
</label>
<label class="flex items-center gap-xs p-xs rounded-lg bg-surface-container-low cursor-pointer font-label-sm text-label-sm text-on-surface">
<input class="text-primary" name="motivo" type="radio"/>
<span>Ingreso Nuevo</span>
</label>
</div>
</div>
<!-- Biometric Signature Simulation -->
<div class="bg-surface-container-low p-sm rounded-xl space-y-xs">
<div class="flex items-center justify-between">
<span class="font-label-md text-label-md text-on-surface font-semibold flex items-center gap-xs">
<span class="material-symbols-outlined text-primary text-[18px]">draw</span>
              Captura de Firma Digital del Colaborador
            </span>
<span class="font-label-sm text-[11px] text-outline">Dispositivo Táctil Habilitado</span>
</div>
<div class="h-24 bg-surface-container-lowest rounded-lg border-dashed flex items-center justify-center text-outline font-body-sm text-body-sm cursor-crosshair">
            [ Espacio de firma en pantalla táctil / tableta de bodega ]
          </div>
<div class="flex items-center justify-between text-[11px] text-outline">
<span>Firma vinculada con C.C. 1.054.890.231</span>
<button class="text-primary hover:underline" type="button">Limpiar trazo</button>
</div>
</div>
<!-- Modal Actions -->
<div class="pt-sm flex items-center justify-end gap-xs">
<button class="px-md py-xs rounded-lg font-label-md text-label-md text-on-surface-variant hover:bg-surface-container transition-colors" onclick="document.getElementById('modal-registro').classList.add('hidden')" type="button">
            Cancelar
          </button>
<button class="px-md py-xs rounded-lg font-label-md text-label-md bg-primary text-on-primary hover:bg-primary-container transition-colors shadow-sm flex items-center gap-xs" type="submit">
<span class="material-symbols-outlined text-[18px]">check_circle</span>
<span>Firmar &amp; Emitir Acta Digital</span>
</button>
</div>
</form>
</div>
</div>
<!-- SIDE DRAWER: CATÁLOGO PARAMÉTRICO Y CONFIGURACIÓN -->
<div class="fixed inset-0 z-50 bg-inverse-surface/30 backdrop-blur-sm hidden flex justify-end" id="drawer-catalogo">
<div class="bg-surface-container-lowest w-full max-w-lg h-full p-md shadow-2xl overflow-y-auto flex flex-col justify-between">
<div>
<div class="flex items-center justify-between pb-sm mb-sm">
<div>
<h3 class="font-headline-md text-headline-md text-primary">Catálogo Paramétrico EPP</h3>
<p class="font-body-sm text-body-sm text-outline">Reglas de negocio y vida útil técnica Grupo Manzanares</p>
</div>
<button class="p-xs text-outline hover:text-on-surface rounded-lg" onclick="document.getElementById('drawer-catalogo').classList.add('hidden')" type="button">
<span class="material-symbols-outlined">close</span>
</button>
</div>
<div class="space-y-sm">
<div class="p-xs bg-surface-container-low rounded-lg">
<span class="font-label-sm text-label-sm text-outline uppercase">Parámetro Global de Recambio</span>
<div class="font-body-md text-body-md text-on-surface font-semibold mt-0.5">Semáforo de Alerta Preventiva: 15 Días</div>
<p class="font-body-sm text-body-sm text-on-surface-variant mt-1">
              El sistema notifica al almacenista de cada finca y bloquea la asignación de tareas de alto riesgo si el EPP cumple ciclo sin renovación firmada.
            </p>
</div>
<div class="space-y-xs">
<h4 class="font-label-md text-label-md text-on-surface font-semibold">Tiempos Estándar de Reposición (SLA):</h4>
<ul class="space-y-xs font-body-sm text-body-sm text-on-surface-variant">
<li class="flex items-center justify-between p-xs bg-surface-container-lowest rounded shadow-xs">
<span>Filtros respiratorios agrícolas</span>
<strong class="text-primary font-semibold">30 días</strong>
</li>
<li class="flex items-center justify-between p-xs bg-surface-container-lowest rounded shadow-xs">
<span>Guantes de vaqueta (labores de campo)</span>
<strong class="text-primary font-semibold">45 días</strong>
</li>
<li class="flex items-center justify-between p-xs bg-surface-container-lowest rounded shadow-xs">
<span>Botas de cuero de seguridad</span>
<strong class="text-primary font-semibold">180 días (Semestral)</strong>
</li>
<li class="flex items-center justify-between p-xs bg-surface-container-lowest rounded shadow-xs">
<span>Cascos dieléctricos Tipo II</span>
<strong class="text-primary font-semibold">730 días (2 años)</strong>
</li>
<li class="flex items-center justify-between p-xs bg-surface-container-lowest rounded shadow-xs">
<span>Arneses &amp; Eslingas contra caídas</span>
<strong class="text-primary font-semibold">3 Años (Insp. Anual)</strong>
</li>
</ul>
</div>
</div>
</div>
<div class="pt-md">
<button class="w-full py-xs bg-surface-container text-on-surface rounded-lg font-label-md text-label-md hover:bg-surface-container-high transition-colors" onclick="document.getElementById('drawer-catalogo').classList.add('hidden')" type="button">
          Cerrar Catálogo Paramétrico
        </button>
</div>
</div>
</div>
</div></main></div></body></html>

<!DOCTYPE html>

<html lang="es"><head><meta charset="utf-8"/><meta content="width=device-width, initial-scale=1.0" name="viewport"/><style>@layer base{html,body{margin:0;padding:0;}body{overscroll-behavior:none;}main>:first-child{margin-top:0!important;}main>:last-child{margin-bottom:0!important;}}::-webkit-scrollbar{display:none;}</style><script src="https://cdn.tailwindcss.com"></script><script id="tailwind-config">tailwind.config={theme:{extend:{"colors":{"on-secondary-fixed":"#07006c","inverse-primary":"#bcc3ff","error-container":"#ffdad6","secondary-fixed":"#e1e0ff","primary-fixed-dim":"#bcc3ff","surface":"#f8f9ff","primary-container":"#2e3a8c","tertiary":"#2a2d2f","on-primary-fixed":"#000d60","surface-variant":"#d5e3fc","outline":"#767682","secondary-fixed-dim":"#c0c1ff","on-surface":"#0d1c2e","surface-container-low":"#eff4ff","on-error":"#ffffff","surface-container-lowest":"#ffffff","on-secondary":"#ffffff","surface-container":"#e6eeff","on-primary":"#ffffff","tertiary-fixed-dim":"#c4c7c9","on-secondary-container":"#fffbff","on-tertiary":"#ffffff","surface-tint":"#4b57aa","secondary":"#4648d4","tertiary-container":"#404345","on-surface-variant":"#454651","on-primary-container":"#9ea9ff","on-tertiary-fixed-variant":"#444749","surface-bright":"#f8f9ff","primary":"#142175","surface-container-highest":"#d5e3fc","surface-dim":"#ccdbf3","on-secondary-fixed-variant":"#2f2ebe","on-tertiary-fixed":"#191c1e","surface-container-high":"#dce9ff","inverse-surface":"#233144","background":"#f8f9ff","on-error-container":"#93000a","inverse-on-surface":"#eaf1ff","outline-variant":"#c6c5d3","secondary-container":"#6063ee","on-tertiary-container":"#adb0b2","primary-fixed":"#dfe0ff","error":"#ba1a1a","on-background":"#0d1c2e","tertiary-fixed":"#e0e3e5","on-primary-fixed-variant":"#333f91"},"borderRadius":{"DEFAULT":"0.25rem","lg":"0.5rem","xl":"0.75rem","full":"9999px"},"spacing":{"gutter":"24px","base":"8px","xs":"4px","md":"24px","xl":"80px","container-max":"1280px","lg":"48px","sm":"12px"},"fontFamily":{"headline-md":["Inter"],"label-md":["Inter"],"headline-lg-mobile":["Inter"],"body-lg":["Inter"],"body-md":["Inter"],"label-sm":["Inter"],"display-lg":["Inter"],"body-sm":["Inter"],"headline-lg":["Inter"]},"fontSize":{"headline-md":["24px",{"lineHeight":"32px","fontWeight":"600"}],"label-md":["14px",{"lineHeight":"16px","letterSpacing":"0.01em","fontWeight":"500"}],"headline-lg-mobile":["24px",{"lineHeight":"32px","fontWeight":"600"}],"body-lg":["18px",{"lineHeight":"28px","fontWeight":"400"}],"body-md":["16px",{"lineHeight":"24px","fontWeight":"400"}],"label-sm":["12px",{"lineHeight":"14px","fontWeight":"600"}],"display-lg":["48px",{"lineHeight":"56px","letterSpacing":"-0.02em","fontWeight":"700"}],"body-sm":["14px",{"lineHeight":"20px","fontWeight":"400"}],"headline-lg":["32px",{"lineHeight":"40px","letterSpacing":"-0.01em","fontWeight":"600"}]}}}}</script><link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&amp;display=swap" rel="stylesheet"/><link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0" rel="stylesheet"/>
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet"/></head><body class="bg-background font-body-md text-on-background"><aside class="fixed left-0 top-0 h-full w-72 bg-surface-container-lowest z-50 flex flex-col shadow-[0_4px_20px_rgba(13,28,46,0.06)]"><div class="p-md flex flex-col gap-xs"><div class="flex items-center gap-sm"><div class="w-10 h-10 bg-primary flex items-center justify-center rounded-lg shadow-sm text-on-primary font-headline-md">M</div><div class="flex flex-col"><span class="font-headline-md text-primary tracking-tight text-[18px] leading-tight">Grupo Manzanares</span><span class="font-label-sm text-outline tracking-wider uppercase text-[11px]">S.A.S. • SG-SST</span></div></div><div class="flex items-center gap-xs mt-xs"><span class="inline-flex items-center px-xs py-0.5 rounded bg-surface-container-high text-primary font-label-sm text-[10px]">Dec. 1072</span><span class="inline-flex items-center px-xs py-0.5 rounded bg-surface-container-high text-primary font-label-sm text-[10px]">Res. 0312</span></div></div><div class="px-md py-xs"><button class="w-full flex items-center justify-center gap-xs bg-primary text-on-primary py-xs px-sm rounded-lg font-label-md hover:bg-primary-container transition-all shadow-sm" type="button"><span class="material-symbols-outlined text-[18px]">add_alert</span><span>Reporte Rápido</span></button></div><nav class="flex-1 px-sm py-xs space-y-1 overflow-y-auto" data-active-classes="bg-secondary-container text-on-secondary-container font-semibold"><div class="px-sm pt-xs pb-1 text-[11px] font-label-sm uppercase tracking-wider text-outline">Estratégico</div><a class="block px-md py-xs rounded-lg text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface transition-all font-label-md" data-path="dashboard" href="#">Dashboard General</a><a class="block px-md py-xs rounded-lg text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface transition-all font-label-md" data-path="alertas-sst" href="#">Alertas SST</a><div class="px-sm pt-sm pb-1 text-[11px] font-label-sm uppercase tracking-wider text-outline">Operaciones Críticas</div><a class="block px-md py-xs rounded-lg text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface transition-all font-label-md" data-path="inspecciones-seguridad" href="#">Inspecciones de Seguridad</a><a class="block px-md py-xs rounded-lg text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface transition-all font-label-md" data-path="epp" href="#">Equipos de Protección (EPP)</a><a class="block px-md py-xs rounded-lg text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface transition-all font-label-md" data-path="trabajo-en-alturas" href="#">Trabajo en Alturas</a><a class="block px-md py-xs rounded-lg text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface transition-all font-label-md" data-path="tractoristas-operadores" href="#">Tractoristas y Operadores</a><a class="block px-md py-xs rounded-lg text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface transition-all font-label-md" data-path="pesv-seguridad-vial" href="#">PESV Seguridad Vial</a><div class="px-sm pt-sm pb-1 text-[11px] font-label-sm uppercase tracking-wider text-outline">Gestión Humana &amp; Salud</div><a class="block px-md py-xs rounded-lg text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface transition-all font-label-md" data-path="trabajadores" href="#">Censo de Trabajadores</a><a class="block px-md py-xs rounded-lg text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface transition-all font-label-md" data-path="examenes-medicos" href="#">Exámenes Médicos</a></nav><div class="mt-auto p-md border-t border-outline-variant/30 bg-surface-container-lowest"><div class="flex items-center justify-between"><div class="leading-tight"><div class="font-label-md text-on-surface text-[12px]">Sede Agroindustrial</div><div class="font-body-sm text-[11px] text-outline">Versión SG-SST 3.2</div></div><span class="inline-block w-2 h-2 rounded-full bg-secondary"></span></div></div></aside><div class="pl-72"><header class="fixed top-0 left-72 right-0 h-20 bg-surface/85 backdrop-blur-xl shadow-[0_1px_8px_rgba(0,0,0,0.04)] z-40 flex items-center justify-between px-md"><div class="flex items-center gap-md bg-surface-container-low px-md py-xs rounded-full w-96"><span class="material-symbols-outlined text-outline text-[20px]">search</span><input class="bg-transparent border-none focus:ring-0 text-body-sm w-full outline-none text-on-surface placeholder:text-outline" placeholder="Buscar inspecciones, cédula, actas o EPP..." type="text"/></div><div class="flex items-center gap-md"><div class="flex items-center gap-sm px-sm py-xs bg-surface-container-low rounded-full transition-colors"><div class="w-9 h-9 rounded-full bg-primary-container text-on-primary flex items-center justify-center font-label-md text-sm">AV</div><div class="hidden lg:block leading-tight text-left pr-xs"><div class="font-label-md text-on-surface">Ing. Andrés Valencia</div><div class="font-label-sm text-outline text-[11px]">Coordinador SG-SST</div></div></div><div class="h-8 w-px bg-outline-variant/30"></div><button class="flex items-center gap-xs px-sm py-xs text-on-surface-variant hover:text-error transition-colors" type="button"><span class="material-symbols-outlined text-[20px]">logout</span><span class="font-label-sm">Cerrar Sesión</span></button></div></header><main class="relative pt-20 bg-surface min-h-screen px-md py-md"><div class="flex flex-col w-full gap-md">
<!-- 1. ENCABEZADO Y CONTEXTO NORMATIVO -->
<section class="flex flex-col xl:flex-row xl:items-center justify-between gap-md bg-surface-container-lowest p-md rounded-xl shadow-sm">
<div class="flex flex-col gap-xs">
<div class="flex items-center gap-xs flex-wrap">
<span class="inline-flex items-center gap-1 px-xs py-0.5 rounded bg-primary-container text-on-primary font-label-sm">
<span class="material-symbols-outlined text-[14px]">policy</span>
          Estándar E3.1.2
        </span>
<span class="inline-flex items-center px-xs py-0.5 rounded bg-surface-container text-primary font-label-sm">
          Resolución 0312 de 2019
        </span>
<span class="inline-flex items-center px-xs py-0.5 rounded bg-surface-container text-on-surface-variant font-label-sm">
          Decreto 1072/2015 Art. 2.2.4.6.24
        </span>
</div>
<h1 class="font-headline-lg text-primary tracking-tight">13. Inspecciones Planeadas de Seguridad y Hallazgos SG-SST</h1>
<p class="font-body-sm text-on-surface-variant max-w-4xl">
        Programa sistemático de verificación locativa, equipos, maquinaria agrícola y condiciones de trabajo seguro para fincas cafetaleras, bananeras y planta agroindustrial de <strong class="text-on-surface">Grupo Manzanares S.A.S.</strong> Ciclo continuo de identificación de peligros y control operacional preventivo.
      </p>
</div>
<!-- Action Buttons Group -->
<div class="flex items-center gap-xs flex-wrap xl:justify-end">
<button class="inline-flex items-center gap-xs bg-primary text-on-primary px-sm py-xs rounded-lg font-label-md hover:bg-primary-container transition-all shadow-sm" type="button">
<span class="material-symbols-outlined text-[18px]">add_circle</span>
<span>+ Programar Inspección</span>
</button>
<button class="inline-flex items-center gap-xs bg-surface-container-high text-primary px-sm py-xs rounded-lg font-label-md hover:bg-surface-variant transition-all" type="button">
<span class="material-symbols-outlined text-[18px]">table_view</span>
<span>Cronograma (.XLSX)</span>
</button>
<button class="inline-flex items-center gap-xs bg-surface-container-high text-primary px-sm py-xs rounded-lg font-label-md hover:bg-surface-variant transition-all" type="button">
<span class="material-symbols-outlined text-[18px]">bolt</span>
<span>Plan de Acción</span>
</button>
<button class="inline-flex items-center gap-xs bg-surface-container-lowest text-on-surface-variant px-sm py-xs rounded-lg font-label-md hover:bg-surface-container transition-all shadow-sm" type="button">
<span class="material-symbols-outlined text-[18px]">verified_user</span>
<span>Auditoría</span>
</button>
</div>
</section>
<!-- 2. SECCIÓN DESTACADA: CALENDARIO OPERATIVO SEMANAL -->
<section class="flex flex-col gap-sm bg-gradient-to-r from-primary to-primary-container text-on-primary p-md rounded-xl shadow-md">
<div class="flex flex-col sm:flex-row sm:items-center justify-between gap-xs">
<div class="flex items-center gap-xs">
<span class="material-symbols-outlined text-[24px] text-secondary-fixed">calendar_month</span>
<h2 class="font-headline-md tracking-tight text-on-primary">
          ESTA SEMANA DEBEN REALIZARSE (Lunes 28 Oct - Sábado 02 Nov 2024)
        </h2>
</div>
<div class="flex items-center gap-xs text-secondary-fixed font-label-sm">
<span class="material-symbols-outlined text-[16px]">sync</span>
<span>Sincronización en Campo vía App Móvil Activa</span>
</div>
</div>
<p class="font-body-sm text-on-primary-container">
      Estructura de trazabilidad técnica reglamentaria en campo: Responsable ➔ Centro de Trabajo / Finca ➔ Tipo de Inspección ➔ Ventana Horaria
    </p>
<!-- Visual Flow Cards -->
<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-sm mt-xs">
<!-- Flow Card 1: Lunes -->
<div class="flex flex-col justify-between bg-surface-container-lowest text-on-surface p-sm rounded-lg shadow-sm">
<div class="flex flex-col gap-xs">
<div class="flex items-center justify-between">
<span class="font-label-sm uppercase tracking-wider text-primary">Lun 28 Oct</span>
<span class="inline-flex items-center gap-0.5 px-xs py-0.5 rounded bg-surface-container-high text-primary font-label-sm text-[11px]">
<span class="material-symbols-outlined text-[13px]">check_circle</span> Realizada
            </span>
</div>
<div class="text-[11px] font-label-sm text-outline">07:30 AM</div>
<div class="flex items-center gap-xs mt-0.5">
<div class="w-6 h-6 rounded-full bg-primary-container text-on-primary flex items-center justify-center font-label-sm text-[10px]">AV</div>
<div class="flex flex-col">
<span class="font-label-md text-on-surface leading-tight">Ing. Andrés Valencia</span>
<span class="font-body-sm text-outline text-[11px]">Coord. SG-SST</span>
</div>
</div>
<div class="mt-xs p-xs rounded bg-surface-container-low text-on-surface">
<div class="text-[10px] font-label-sm text-outline uppercase">Lugar / Finca</div>
<div class="font-label-md text-primary truncate">Finca La Esperanza</div>
<div class="font-body-sm text-[11px] text-on-surface-variant">Lote 04 - Alturas</div>
</div>
</div>
<div class="mt-sm pt-xs flex items-center gap-xs text-[11px] font-label-md text-primary">
<span class="material-symbols-outlined text-[16px]">height</span>
<span class="truncate">Alturas y Caída</span>
</div>
</div>
<!-- Flow Card 2: Martes -->
<div class="flex flex-col justify-between bg-surface-container-lowest text-on-surface p-sm rounded-lg shadow-sm">
<div class="flex flex-col gap-xs">
<div class="flex items-center justify-between">
<span class="font-label-sm uppercase tracking-wider text-secondary">Mar 29 Oct</span>
<span class="inline-flex items-center gap-0.5 px-xs py-0.5 rounded bg-secondary-fixed text-on-secondary-fixed font-label-sm text-[11px]">
<span class="material-symbols-outlined text-[13px]">autorenew</span> En Proceso
            </span>
</div>
<div class="text-[11px] font-label-sm text-outline">09:00 AM</div>
<div class="flex items-center gap-xs mt-0.5">
<div class="w-6 h-6 rounded-full bg-secondary text-on-secondary flex items-center justify-center font-label-sm text-[10px]">RV</div>
<div class="flex flex-col">
<span class="font-label-md text-on-surface leading-tight">Sup. Ramón Vélez</span>
<span class="font-body-sm text-outline text-[11px]">Jefe de Cuadrilla</span>
</div>
</div>
<div class="mt-xs p-xs rounded bg-surface-container-low text-on-surface">
<div class="text-[10px] font-label-sm text-outline uppercase">Lugar / Finca</div>
<div class="font-label-md text-secondary truncate">Finca San José</div>
<div class="font-body-sm text-[11px] text-on-surface-variant">Bodega Químicos</div>
</div>
</div>
<div class="mt-sm pt-xs flex items-center gap-xs text-[11px] font-label-md text-secondary">
<span class="material-symbols-outlined text-[16px]">science</span>
<span class="truncate">Fitosanitarios</span>
</div>
</div>
<!-- Flow Card 3: Jueves -->
<div class="flex flex-col justify-between bg-surface-container-lowest text-on-surface p-sm rounded-lg shadow-sm">
<div class="flex flex-col gap-xs">
<div class="flex items-center justify-between">
<span class="font-label-sm uppercase tracking-wider text-on-surface-variant">Jue 31 Oct</span>
<span class="inline-flex items-center gap-0.5 px-xs py-0.5 rounded bg-surface-container text-on-surface-variant font-label-sm text-[11px]">
<span class="material-symbols-outlined text-[13px]">schedule</span> Programada
            </span>
</div>
<div class="text-[11px] font-label-sm text-outline">06:30 AM</div>
<div class="flex items-center gap-xs mt-0.5">
<div class="w-6 h-6 rounded-full bg-tertiary text-on-tertiary flex items-center justify-center font-label-sm text-[10px]">MR</div>
<div class="flex flex-col">
<span class="font-label-md text-on-surface leading-tight">Ing. Marcos Restrepo</span>
<span class="font-body-sm text-outline text-[11px]">Jefe Maquinaria</span>
</div>
</div>
<div class="mt-xs p-xs rounded bg-surface-container-low text-on-surface">
<div class="text-[10px] font-label-sm text-outline uppercase">Lugar / Finca</div>
<div class="font-label-md text-on-surface truncate">Taller Central</div>
<div class="font-body-sm text-[11px] text-on-surface-variant">Patios de Maniobra</div>
</div>
</div>
<div class="mt-sm pt-xs flex items-center gap-xs text-[11px] font-label-md text-on-surface">
<span class="material-symbols-outlined text-[16px]">agriculture</span>
<span class="truncate">Tractores y Maquinaria</span>
</div>
</div>
<!-- Flow Card 4: Viernes -->
<div class="flex flex-col justify-between bg-surface-container-lowest text-on-surface p-sm rounded-lg shadow-sm">
<div class="flex flex-col gap-xs">
<div class="flex items-center justify-between">
<span class="font-label-sm uppercase tracking-wider text-on-surface-variant">Vie 01 Nov</span>
<span class="inline-flex items-center gap-0.5 px-xs py-0.5 rounded bg-surface-container text-on-surface-variant font-label-sm text-[11px]">
<span class="material-symbols-outlined text-[13px]">schedule</span> Programada
            </span>
</div>
<div class="text-[11px] font-label-sm text-outline">10:00 AM</div>
<div class="flex items-center gap-xs mt-0.5">
<div class="w-6 h-6 rounded-full bg-primary text-on-primary flex items-center justify-center font-label-sm text-[10px]">BP</div>
<div class="flex flex-col">
<span class="font-label-md text-on-surface leading-tight">Enf. Beatriz Pineda</span>
<span class="font-body-sm text-outline text-[11px]">SST Salud Ocupacional</span>
</div>
</div>
<div class="mt-xs p-xs rounded bg-surface-container-low text-on-surface">
<div class="text-[10px] font-label-sm text-outline uppercase">Lugar / Finca</div>
<div class="font-label-md text-on-surface truncate">Finca Bella Vista</div>
<div class="font-body-sm text-[11px] text-on-surface-variant">Punto de Primeros Auxilios</div>
</div>
</div>
<div class="mt-sm pt-xs flex items-center gap-xs text-[11px] font-label-md text-on-surface">
<span class="material-symbols-outlined text-[16px]">medical_services</span>
<span class="truncate">Botiquines y Camilla</span>
</div>
</div>
<!-- Flow Card 5: Sábado -->
<div class="flex flex-col justify-between bg-surface-container-lowest text-on-surface p-sm rounded-lg shadow-sm">
<div class="flex flex-col gap-xs">
<div class="flex items-center justify-between">
<span class="font-label-sm uppercase tracking-wider text-on-surface-variant">Sáb 02 Nov</span>
<span class="inline-flex items-center gap-0.5 px-xs py-0.5 rounded bg-surface-container text-on-surface-variant font-label-sm text-[11px]">
<span class="material-symbols-outlined text-[13px]">schedule</span> Programada
            </span>
</div>
<div class="text-[11px] font-label-sm text-outline">08:00 AM</div>
<div class="flex items-center gap-xs mt-0.5">
<div class="w-6 h-6 rounded-full bg-surface-container-high text-primary flex items-center justify-center font-label-sm text-[10px]">CR</div>
<div class="flex flex-col">
<span class="font-label-md text-on-surface leading-tight">Carlos Ramos</span>
<span class="font-body-sm text-outline text-[11px]">Miembro COPASST</span>
</div>
</div>
<div class="mt-xs p-xs rounded bg-surface-container-low text-on-surface">
<div class="text-[10px] font-label-sm text-outline uppercase">Lugar / Finca</div>
<div class="font-label-md text-on-surface truncate">Planta Empacadora</div>
<div class="font-body-sm text-[11px] text-on-surface-variant">Línea de Clasificación</div>
</div>
</div>
<div class="mt-sm pt-xs flex items-center gap-xs text-[11px] font-label-md text-on-surface">
<span class="material-symbols-outlined text-[16px]">cleaning_services</span>
<span class="truncate">Orden y Aseo (5S)</span>
</div>
</div>
</div>
</section>
<!-- 3. DASHBOARD DE CONTROL DE INSPECCIONES Y HALLAZGOS -->
<section class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-sm">
<!-- Métrica 1 -->
<div class="flex flex-col justify-between bg-surface-container-lowest p-md rounded-xl shadow-sm">
<div class="flex items-center justify-between">
<span class="font-label-sm uppercase tracking-wider text-outline">Programadas (Mes)</span>
<span class="material-symbols-outlined text-primary text-[20px]">assignment</span>
</div>
<div class="mt-xs">
<div class="font-display-lg text-primary leading-none">48</div>
<div class="font-body-sm text-outline mt-1">36 ejecutadas (75% avance)</div>
</div>
<div class="w-full bg-surface-container rounded-full h-1.5 mt-sm overflow-hidden">
<div class="bg-primary h-1.5 rounded-full" style="width: 75%"></div>
</div>
</div>
<!-- Métrica 2 -->
<div class="flex flex-col justify-between bg-surface-container-lowest p-md rounded-xl shadow-sm">
<div class="flex items-center justify-between">
<span class="font-label-sm uppercase tracking-wider text-outline">Realizadas</span>
<span class="material-symbols-outlined text-secondary text-[20px]">task_alt</span>
</div>
<div class="mt-xs">
<div class="font-display-lg text-secondary leading-none">36</div>
<div class="font-body-sm text-outline mt-1">Con acta y fotos validadas</div>
</div>
<div class="inline-flex items-center gap-1 text-[11px] font-label-sm text-primary mt-sm">
<span class="material-symbols-outlined text-[14px]">photo_camera</span>
<span>100% georreferenciado</span>
</div>
</div>
<!-- Métrica 3 -->
<div class="flex flex-col justify-between bg-surface-container-lowest p-md rounded-xl shadow-sm">
<div class="flex items-center justify-between">
<span class="font-label-sm uppercase tracking-wider text-outline">Pendientes</span>
<span class="material-symbols-outlined text-outline text-[20px]">pending_actions</span>
</div>
<div class="mt-xs">
<div class="font-display-lg text-on-surface leading-none">9</div>
<div class="font-body-sm text-outline mt-1">Ventana de ejecución &lt; 5 días</div>
</div>
<div class="inline-flex items-center gap-1 text-[11px] font-label-sm text-on-surface-variant mt-sm">
<span class="material-symbols-outlined text-[14px]">calendar_today</span>
<span>En ciclo normal</span>
</div>
</div>
<!-- Métrica 4: Alerta Crítica -->
<div class="flex flex-col justify-between bg-error-container text-on-error-container p-md rounded-xl shadow-sm">
<div class="flex items-center justify-between">
<span class="font-label-sm uppercase tracking-wider text-on-error-container">Vencidas (Crítico)</span>
<span class="material-symbols-outlined text-error text-[20px]">error</span>
</div>
<div class="mt-xs">
<div class="font-display-lg text-error leading-none">3</div>
<div class="font-body-sm text-on-error-container mt-1">Sin reporte técnico en campo</div>
</div>
<div class="inline-flex items-center gap-1 text-[11px] font-label-sm text-error mt-sm font-semibold">
<span class="material-symbols-outlined text-[14px]">notification_important</span>
<span>Disparo automático a Gerencia</span>
</div>
</div>
<!-- Métrica 5 -->
<div class="flex flex-col justify-between bg-surface-container-lowest p-md rounded-xl shadow-sm">
<div class="flex items-center justify-between">
<span class="font-label-sm uppercase tracking-wider text-outline">Hallazgos Abiertos</span>
<span class="material-symbols-outlined text-tertiary text-[20px]">troubleshoot</span>
</div>
<div class="mt-xs">
<div class="font-display-lg text-tertiary leading-none">14</div>
<div class="font-body-sm text-outline mt-1">5 críticos / 9 locativos</div>
</div>
<div class="inline-flex items-center gap-1 text-[11px] font-label-sm text-error mt-sm">
<span class="material-symbols-outlined text-[14px]">warning</span>
<span>5 con intervención obligatoria</span>
</div>
</div>
<!-- Métrica 6 -->
<div class="flex flex-col justify-between bg-surface-container-lowest p-md rounded-xl shadow-sm">
<div class="flex items-center justify-between">
<span class="font-label-sm uppercase tracking-wider text-outline">Tiempo Cierre</span>
<span class="material-symbols-outlined text-primary text-[20px]">timer</span>
</div>
<div class="mt-xs">
<div class="font-display-lg text-primary leading-none">4.2 <span class="text-body-md font-normal text-outline">días</span></div>
<div class="font-body-sm text-outline mt-1">Meta SG-SST: &lt; 6.0 días</div>
</div>
<div class="inline-flex items-center gap-1 text-[11px] font-label-sm text-secondary mt-sm">
<span class="material-symbols-outlined text-[14px]">trending_down</span>
<span>-1.8 días vs. trimestre ant.</span>
</div>
</div>
</section>
<!-- CONTENEDOR PRINCIPAL: MATRIZ OPERATIVA (70%) + MÓDULO LATERAL DE RESOLUCIÓN (30%) -->
<div class="grid grid-cols-1 lg:grid-cols-12 gap-md items-start">
<!-- 4. MATRIZ DE GESTIÓN OPERATIVA DE INSPECCIONES (Col 1-8 en desktop) -->
<section class="lg:col-span-8 flex flex-col gap-sm bg-surface-container-lowest p-md rounded-xl shadow-sm">
<!-- Controles de Filtrado -->
<div class="flex flex-col gap-xs">
<div class="flex flex-col sm:flex-row sm:items-center justify-between gap-xs">
<div>
<h3 class="font-headline-md text-on-surface">Matriz Técnica de Inspecciones</h3>
<p class="font-body-sm text-outline">Seguimiento normativo consolidado de las 13 categorías SG-SST</p>
</div>
<div class="flex items-center gap-xs">
<span class="font-label-sm text-outline">Mostrando 6 de 48 registros</span>
<button class="p-xs rounded hover:bg-surface-container text-outline hover:text-on-surface transition-all" type="button">
<span class="material-symbols-outlined text-[18px]">filter_alt</span>
</button>
</div>
</div>
<!-- Barras de Filtros Especializados -->
<div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-xs mt-xs">
<!-- Selector 13 Categorías -->
<div class="flex flex-col gap-0.5">
<label class="font-label-sm text-[11px] uppercase tracking-wider text-outline">Categoría Normativa</label>
<select class="bg-surface-container-low text-on-surface font-body-sm px-xs py-1 rounded-lg outline-none focus:bg-surface-container">
<option value="todos">Todas las 13 categorías</option>
<option value="1">1. Locativas</option>
<option value="2">2. EPP</option>
<option value="3">3. Botiquines</option>
<option value="4">4. Extintores</option>
<option value="5">5. Equipos</option>
<option value="6">6. Herramientas</option>
<option value="7">7. Vehículos</option>
<option value="8">8. Tractor</option>
<option value="9">9. Trabajo en alturas</option>
<option value="10">10. Emergencias</option>
<option value="11">11. Orden y aseo</option>
<option value="12">12. Químicos</option>
<option value="13">13. Puestos de trabajo</option>
</select>
</div>
<!-- Selector Centro de Trabajo -->
<div class="flex flex-col gap-0.5">
<label class="font-label-sm text-[11px] uppercase tracking-wider text-outline">Centro / Finca</label>
<select class="bg-surface-container-low text-on-surface font-body-sm px-xs py-1 rounded-lg outline-none focus:bg-surface-container">
<option value="todos">Todas las Fincas</option>
<option value="esperanza">Finca La Esperanza</option>
<option value="sanjose">Finca San José</option>
<option value="paraiso">Finca El Paraíso</option>
<option value="bellavista">Finca Bella Vista</option>
<option value="taller">Taller Central Maquinaria</option>
<option value="planta">Planta Empacadora</option>
</select>
</div>
<!-- Selector Inspector -->
<div class="flex flex-col gap-0.5">
<label class="font-label-sm text-[11px] uppercase tracking-wider text-outline">Responsable Técnico</label>
<select class="bg-surface-container-low text-on-surface font-body-sm px-xs py-1 rounded-lg outline-none focus:bg-surface-container">
<option value="todos">Todos los Inspectores</option>
<option value="andres">Ing. Andrés Valencia (Coord)</option>
<option value="ramon">Sup. Ramón Vélez (Jefe)</option>
<option value="marcos">Ing. Marcos Restrepo (Maquinaria)</option>
<option value="beatriz">Enf. Beatriz Pineda (Salud)</option>
<option value="copasst">Delegado COPASST</option>
</select>
</div>
<!-- Selector Estado -->
<div class="flex flex-col gap-0.5">
<label class="font-label-sm text-[11px] uppercase tracking-wider text-outline">Estado Semafórico</label>
<select class="bg-surface-container-low text-on-surface font-body-sm px-xs py-1 rounded-lg outline-none focus:bg-surface-container">
<option value="todos">Todos los Estados</option>
<option value="realizada">🟢 Realizada</option>
<option value="pendiente">🟡 Pendiente</option>
<option value="vencida">🔴 Vencida</option>
<option value="programada">🔵 Programada</option>
</select>
</div>
</div>
</div>
<!-- Tabla Maestra de Inspecciones -->
<div class="overflow-x-auto mt-xs">
<table class="w-full text-left font-body-sm">
<thead>
<tr class="bg-surface-container-high text-on-surface-variant font-label-sm text-[11px] uppercase tracking-wider">
<th class="p-xs">Tipo Inspección</th>
<th class="p-xs">Responsable &amp; Cargo</th>
<th class="p-xs">Finca / Área</th>
<th class="p-xs">Programada / Realizada</th>
<th class="p-xs">Estado</th>
<th class="p-xs">Hallazgos</th>
<th class="p-xs">Evidencia Digital</th>
<th class="p-xs">Acción SG-SST</th>
<th class="p-xs">Próxima</th>
<th class="p-xs text-right">Acción</th>
</tr>
</thead>
<tbody class="text-[13px]">
<!-- Fila 1: Extintores Crítico Vencido -->
<tr class="hover:bg-surface-container-low transition-colors">
<td class="p-xs">
<span class="inline-flex items-center gap-1 font-label-md text-error">
<span class="material-symbols-outlined text-[16px]">fire_extinguisher</span>
                  4. Extintores
                </span>
</td>
<td class="p-xs">
<div class="font-label-md text-on-surface leading-tight">Ing. Andrés Valencia</div>
<div class="font-body-sm text-[11px] text-outline">Coord. SG-SST</div>
</td>
<td class="p-xs">
<div class="font-label-md text-on-surface leading-tight">Finca San José</div>
<div class="font-body-sm text-[11px] text-outline">Isla Combustibles</div>
</td>
<td class="p-xs">
<div class="text-error font-medium">24/10/2024</div>
<div class="text-[11px] text-error font-semibold">24/10 14:10 (Alerta)</div>
</td>
<td class="p-xs">
<span class="inline-flex items-center gap-1 px-xs py-0.5 rounded bg-error-container text-on-error-container font-label-sm text-[11px]">
<span class="w-1.5 h-1.5 rounded-full bg-error"></span> Vencida
                </span>
</td>
<td class="p-xs">
<div class="flex items-center gap-1">
<span class="px-1.5 py-0.5 rounded-full bg-error text-on-error font-label-sm text-[10px]">1</span>
<span class="font-label-sm text-error">Crítico</span>
</div>
<div class="text-[11px] text-outline truncate max-w-[130px]">Satélite Solkaflam</div>
</td>
<td class="p-xs">
<button class="inline-flex items-center gap-1 text-primary hover:text-primary-container font-label-sm text-[11px]" type="button">
<span class="material-symbols-outlined text-[14px]">attach_file</span> 3 Fotos + PDF
                </button>
</td>
<td class="p-xs text-on-surface-variant max-w-[160px] truncate" title="Orden de recarga inmediata PQS-Solkaflam #441">
                Orden recarga urgente #441
              </td>
<td class="p-xs font-label-sm text-outline">24/11/2024</td>
<td class="p-xs text-right">
<button class="p-1 rounded bg-primary text-on-primary hover:bg-primary-container transition-all" type="button">
<span class="material-symbols-outlined text-[15px]">visibility</span>
</button>
</td>
</tr>
<!-- Fila 2: Alturas Realizada -->
<tr class="bg-surface-container-lowest/50 hover:bg-surface-container-low transition-colors">
<td class="p-xs">
<span class="inline-flex items-center gap-1 font-label-md text-primary">
<span class="material-symbols-outlined text-[16px]">height</span>
                  9. Alturas
                </span>
</td>
<td class="p-xs">
<div class="font-label-md text-on-surface leading-tight">Ing. Andrés Valencia</div>
<div class="font-body-sm text-[11px] text-outline">Coord. SG-SST</div>
</td>
<td class="p-xs">
<div class="font-label-md text-on-surface leading-tight">Finca La Esperanza</div>
<div class="font-body-sm text-[11px] text-outline">Lote 04 - Poda Alta</div>
</td>
<td class="p-xs">
<div class="text-on-surface">28/10/2024</div>
<div class="text-[11px] text-outline">28/10 07:30 AM</div>
</td>
<td class="p-xs">
<span class="inline-flex items-center gap-1 px-xs py-0.5 rounded bg-surface-container-high text-primary font-label-sm text-[11px]">
<span class="w-1.5 h-1.5 rounded-full bg-primary"></span> Realizada
                </span>
</td>
<td class="p-xs">
<div class="flex items-center gap-1">
<span class="px-1.5 py-0.5 rounded-full bg-secondary-fixed text-on-secondary-fixed font-label-sm text-[10px]">1</span>
<span class="font-label-sm text-secondary">Menor</span>
</div>
<div class="text-[11px] text-outline truncate max-w-[130px]">Eslinga desgastada</div>
</td>
<td class="p-xs">
<button class="inline-flex items-center gap-1 text-primary hover:text-primary-container font-label-sm text-[11px]" type="button">
<span class="material-symbols-outlined text-[14px]">attach_file</span> 4 Fotos + Acta
                </button>
</td>
<td class="p-xs text-on-surface-variant max-w-[160px] truncate" title="Retiro inmediato de eslinga deshilachada">
                Retiro inmediato de eslinga
              </td>
<td class="p-xs font-label-sm text-outline">28/11/2024</td>
<td class="p-xs text-right">
<button class="p-1 rounded bg-surface-container text-on-surface hover:bg-surface-variant transition-all" type="button">
<span class="material-symbols-outlined text-[15px]">visibility</span>
</button>
</td>
</tr>
<!-- Fila 3: Químicos Pendiente -->
<tr class="hover:bg-surface-container-low transition-colors">
<td class="p-xs">
<span class="inline-flex items-center gap-1 font-label-md text-secondary">
<span class="material-symbols-outlined text-[16px]">science</span>
                  12. Químicos
                </span>
</td>
<td class="p-xs">
<div class="font-label-md text-on-surface leading-tight">Sup. Ramón Vélez</div>
<div class="font-body-sm text-[11px] text-outline">Jefe Cuadrilla</div>
</td>
<td class="p-xs">
<div class="font-label-md text-on-surface leading-tight">Finca San José</div>
<div class="font-body-sm text-[11px] text-outline">Bodega Fitosanitarios</div>
</td>
<td class="p-xs">
<div class="text-on-surface">29/10/2024</div>
<div class="text-[11px] text-outline">En curso de campo</div>
</td>
<td class="p-xs">
<span class="inline-flex items-center gap-1 px-xs py-0.5 rounded bg-secondary-fixed text-on-secondary-fixed font-label-sm text-[11px]">
<span class="w-1.5 h-1.5 rounded-full bg-secondary"></span> Pendiente
                </span>
</td>
<td class="p-xs">
<div class="flex items-center gap-1">
<span class="px-1.5 py-0.5 rounded-full bg-surface-container text-outline font-label-sm text-[10px]">2</span>
<span class="font-label-sm text-on-surface-variant">Preventivo</span>
</div>
<div class="text-[11px] text-outline truncate max-w-[130px]">Hojas FDS vencidas</div>
</td>
<td class="p-xs">
<span class="inline-flex items-center gap-1 text-outline font-label-sm text-[11px]">
<span class="material-symbols-outlined text-[14px]">hourglass_empty</span> En carga
                </span>
</td>
<td class="p-xs text-on-surface-variant max-w-[160px] truncate" title="Reordenamiento estiba fitosanitarios">
                Reordenamiento de estiba
              </td>
<td class="p-xs font-label-sm text-outline">15/11/2024</td>
<td class="p-xs text-right">
<button class="p-1 rounded bg-surface-container text-on-surface hover:bg-surface-variant transition-all" type="button">
<span class="material-symbols-outlined text-[15px]">visibility</span>
</button>
</td>
</tr>
<!-- Fila 4: Maquinaria Tractor Programada -->
<tr class="bg-surface-container-lowest/50 hover:bg-surface-container-low transition-colors">
<td class="p-xs">
<span class="inline-flex items-center gap-1 font-label-md text-tertiary">
<span class="material-symbols-outlined text-[16px]">agriculture</span>
                  8. Tractor
                </span>
</td>
<td class="p-xs">
<div class="font-label-md text-on-surface leading-tight">Ing. Marcos Restrepo</div>
<div class="font-body-sm text-[11px] text-outline">Jefe Maquinaria</div>
</td>
<td class="p-xs">
<div class="font-label-md text-on-surface leading-tight">Taller Central</div>
<div class="font-body-sm text-[11px] text-outline">Flota John Deere 5075</div>
</td>
<td class="p-xs">
<div class="text-on-surface">31/10/2024</div>
<div class="text-[11px] text-outline">06:30 AM (Programada)</div>
</td>
<td class="p-xs">
<span class="inline-flex items-center gap-1 px-xs py-0.5 rounded bg-surface-container text-on-surface font-label-sm text-[11px]">
<span class="w-1.5 h-1.5 rounded-full bg-outline"></span> Programada
                </span>
</td>
<td class="p-xs">
<div class="flex items-center gap-1">
<span class="px-1.5 py-0.5 rounded-full bg-surface-container text-outline font-label-sm text-[10px]">0</span>
<span class="font-label-sm text-outline">Sin iniciar</span>
</div>
</td>
<td class="p-xs">
<span class="text-outline text-[11px]">-</span>
</td>
<td class="p-xs text-outline text-[11px]">Pendiente de inspección</td>
<td class="p-xs font-label-sm text-outline">15/11/2024</td>
<td class="p-xs text-right">
<button class="p-1 rounded bg-surface-container text-on-surface hover:bg-surface-variant transition-all" type="button">
<span class="material-symbols-outlined text-[15px]">edit</span>
</button>
</td>
</tr>
<!-- Fila 5: Botiquines Realizada -->
<tr class="hover:bg-surface-container-low transition-colors">
<td class="p-xs">
<span class="inline-flex items-center gap-1 font-label-md text-primary">
<span class="material-symbols-outlined text-[16px]">medical_services</span>
                  3. Botiquines
                </span>
</td>
<td class="p-xs">
<div class="font-label-md text-on-surface leading-tight">Enf. Beatriz Pineda</div>
<div class="font-body-sm text-[11px] text-outline">SST Salud</div>
</td>
<td class="p-xs">
<div class="font-label-md text-on-surface leading-tight">Finca Bella Vista</div>
<div class="font-body-sm text-[11px] text-outline">Caseta Principal</div>
</td>
<td class="p-xs">
<div class="text-on-surface">25/10/2024</div>
<div class="text-[11px] text-outline">25/10 09:45 AM</div>
</td>
<td class="p-xs">
<span class="inline-flex items-center gap-1 px-xs py-0.5 rounded bg-surface-container-high text-primary font-label-sm text-[11px]">
<span class="w-1.5 h-1.5 rounded-full bg-primary"></span> Realizada
                </span>
</td>
<td class="p-xs">
<div class="flex items-center gap-1">
<span class="px-1.5 py-0.5 rounded-full bg-secondary-fixed text-on-secondary-fixed font-label-sm text-[10px]">1</span>
<span class="font-label-sm text-secondary">Insumos</span>
</div>
<div class="text-[11px] text-outline truncate max-w-[130px]">Yodopovidona vencida</div>
</td>
<td class="p-xs">
<button class="inline-flex items-center gap-1 text-primary hover:text-primary-container font-label-sm text-[11px]" type="button">
<span class="material-symbols-outlined text-[14px]">attach_file</span> 2 Fotos + Acta
                </button>
</td>
<td class="p-xs text-on-surface-variant max-w-[160px] truncate" title="Reposición inmediata de antiséptico">
                Reposición de insumos
              </td>
<td class="p-xs font-label-sm text-outline">25/11/2024</td>
<td class="p-xs text-right">
<button class="p-1 rounded bg-surface-container text-on-surface hover:bg-surface-variant transition-all" type="button">
<span class="material-symbols-outlined text-[15px]">visibility</span>
</button>
</td>
</tr>
<!-- Fila 6: EPP Realizada Sin Novedad -->
<tr class="bg-surface-container-lowest/50 hover:bg-surface-container-low transition-colors">
<td class="p-xs">
<span class="inline-flex items-center gap-1 font-label-md text-primary">
<span class="material-symbols-outlined text-[16px]">security</span>
                  2. EPP
                </span>
</td>
<td class="p-xs">
<div class="font-label-md text-on-surface leading-tight">Carlos Ramos</div>
<div class="font-body-sm text-[11px] text-outline">COPASST</div>
</td>
<td class="p-xs">
<div class="font-label-md text-on-surface leading-tight">Finca El Paraíso</div>
<div class="font-body-sm text-[11px] text-outline">Cuadrilla Cosecha</div>
</td>
<td class="p-xs">
<div class="text-on-surface">22/10/2024</div>
<div class="text-[11px] text-outline">22/10 11:20 AM</div>
</td>
<td class="p-xs">
<span class="inline-flex items-center gap-1 px-xs py-0.5 rounded bg-surface-container-high text-primary font-label-sm text-[11px]">
<span class="w-1.5 h-1.5 rounded-full bg-primary"></span> Realizada
                </span>
</td>
<td class="p-xs">
<div class="flex items-center gap-1">
<span class="px-1.5 py-0.5 rounded-full bg-surface-container text-outline font-label-sm text-[10px]">0</span>
<span class="font-label-sm text-outline">Conforme</span>
</div>
</td>
<td class="p-xs">
<button class="inline-flex items-center gap-1 text-primary hover:text-primary-container font-label-sm text-[11px]" type="button">
<span class="material-symbols-outlined text-[14px]">attach_file</span> 6 Fotos + Firmas
                </button>
</td>
<td class="p-xs text-on-surface-variant max-w-[160px] truncate">
                Sin acciones correctivas
              </td>
<td class="p-xs font-label-sm text-outline">22/11/2024</td>
<td class="p-xs text-right">
<button class="p-1 rounded bg-surface-container text-on-surface hover:bg-surface-variant transition-all" type="button">
<span class="material-symbols-outlined text-[15px]">visibility</span>
</button>
</td>
</tr>
</tbody>
</table>
</div>
<!-- Paginador y Resumen -->
<div class="flex flex-col sm:flex-row sm:items-center justify-between gap-xs pt-xs border-t border-outline-variant/30 text-[12px] font-label-sm text-outline">
<div>Ciclo de Inspección Operativa V3.2 • Grupo Manzanares S.A.S.</div>
<div class="flex items-center gap-xs">
<button class="px-xs py-0.5 rounded bg-surface-container hover:bg-surface-variant text-on-surface" type="button">Anterior</button>
<span class="text-primary font-bold">1 / 8</span>
<button class="px-xs py-0.5 rounded bg-surface-container hover:bg-surface-variant text-on-surface" type="button">Siguiente</button>
</div>
</div>
</section>
<!-- 5. MÓDULO LATERAL DE GESTIÓN Y RESOLUCIÓN DE HALLAZGOS (Col 9-12 en desktop) -->
<aside class="lg:col-span-4 flex flex-col gap-sm">
<!-- Ficha Interactiva de Hallazgo Crítico Urgente -->
<div class="flex flex-col bg-surface-container-lowest p-md rounded-xl shadow-sm">
<div class="flex items-center justify-between pb-xs">
<div class="flex items-center gap-xs">
<span class="w-2.5 h-2.5 rounded-full bg-error animate-pulse"></span>
<span class="font-label-sm uppercase tracking-wider text-error">Hallazgo Crítico Activo #HC-2024-089</span>
</div>
<span class="px-xs py-0.5 rounded bg-error-container text-on-error-container font-label-sm text-[11px]">
            Plazo: 24 Horas
          </span>
</div>
<div class="flex flex-col gap-xs mt-xs">
<div class="font-headline-md text-on-surface text-[18px] leading-tight">
            Extintor Satélite Solkaflam Despresurizado
          </div>
<div class="font-body-sm text-outline text-[12px]">
            Inspección: Extintores y Red Contra Incendios • Área de Alto Riesgo
          </div>
</div>
<!-- Evidencia Fotográfica con Image Placement Prompt -->
<div class="relative w-full h-44 rounded-lg overflow-hidden mt-sm bg-surface-container">
<img class="w-full h-full object-cover" data-alt="A professional industrial safety photograph of an unpressurized 50-pound yellow mobile wheeled fire extinguisher sitting in an agricultural fuel depot station, gauge needle clearly in the red zone, Colombian coffee farm warehouse setting, bright natural overhead daylight, sharp focus on the inspection tag and pressure gauge, photorealistic, documentary SG-SST inspection evidence." src="https://lh3.googleusercontent.com/aida-public/AB6AXuA5yogK6k221bFYuYHKry5DBUxq87Gln8VWrFj6aiPokIrpZbOS6OZmFrviyhcx7EIgATDgz5pKYtIqFvr2AFggFNSEU9Ord7TooRRNlxlCgLlBydGr8OM-FFy8m3hL2OkZ89u_TwLT1dh5Gmy844uKNTbs15YCqycY2GE67pNznUXEU72zNAHLCe08kZ8Bua9EUcKOKV8tVFvGq7DJFVThGwDupkLkRsa4VUQJ5ZkA1m3FXOzoC-Q0"/>
<div class="absolute bottom-2 left-2 px-xs py-0.5 bg-inverse-surface/85 backdrop-blur-sm rounded text-inverse-on-surface font-label-sm text-[10px] flex items-center gap-1">
<span class="material-symbols-outlined text-[12px]">location_on</span>
<span>Finca San José • 4°32'12''N 75°41'20''W</span>
</div>
</div>
<!-- Detalles Técnicos del Hallazgo -->
<div class="flex flex-col gap-xs mt-sm p-sm rounded-lg bg-surface-container-low text-on-surface">
<div class="flex items-center justify-between text-[11px] font-label-sm">
<span class="text-outline">Inspector:</span>
<span class="font-semibold text-primary">Ing. Andrés Valencia</span>
</div>
<div class="flex items-center justify-between text-[11px] font-label-sm">
<span class="text-outline">Ubicación:</span>
<span class="font-semibold">Finca San José - Caseta Combustibles</span>
</div>
<div class="flex items-center justify-between text-[11px] font-label-sm">
<span class="text-outline">Equipo:</span>
<span class="font-semibold">Extintor Satélite Solkaflam 50 lbs (#EXT-SJ-03)</span>
</div>
<div class="flex items-center justify-between text-[11px] font-label-sm">
<span class="text-outline">Severidad:</span>
<span class="font-bold text-error">NIVEL 1 - CRÍTICO INMEDIATO</span>
</div>
<div class="mt-xs pt-xs border-t border-outline-variant/30 text-body-sm text-[12px] text-on-surface-variant">
<strong>Descripción del hallazgo:</strong> Manómetro en sector rojo izquierdo sin presión de trabajo en área de cargue diésel para maquinaria pesada. Alto riesgo de propagación en evento de conflagración.
          </div>
</div>
<!-- Plan de Acción Derivado y Asignación -->
<div class="flex flex-col gap-xs mt-sm">
<div class="font-label-sm uppercase tracking-wider text-on-surface text-[11px]">
            Plan de Acción Derivado SG-SST
          </div>
<div class="flex items-start gap-xs p-xs rounded bg-surface-container text-on-surface">
<span class="material-symbols-outlined text-error text-[18px] mt-0.5">priority_high</span>
<div class="flex flex-col text-[12px]">
<span class="font-semibold">1. Sustitución Provisional Inmediata</span>
<span class="text-outline">Trasladar extintor PQS 30 lbs del taller auxiliar hacia la caseta de diésel (Tiempo estimado: 2 hrs).</span>
</div>
</div>
<div class="flex items-start gap-xs p-xs rounded bg-surface-container text-on-surface">
<span class="material-symbols-outlined text-primary text-[18px] mt-0.5">local_shipping</span>
<div class="flex flex-col text-[12px]">
<span class="font-semibold">2. Recarga y Prueba Hidrostática</span>
<span class="text-outline">Emisión de O.C. #441 con proveedor certificado contra incendios (Fecha límite: 24 horas).</span>
</div>
</div>
<div class="flex items-center justify-between text-[11px] font-label-sm mt-xs">
<span class="text-outline">Responsable Acción:</span>
<span class="text-on-surface font-semibold">Carlos Lozano (Jefe de Compras)</span>
</div>
<div class="flex items-center justify-between text-[11px] font-label-sm">
<span class="text-outline">Límite Resolución:</span>
<span class="text-error font-bold">29 Octubre 2024 - 14:00 PM</span>
</div>
<!-- Countdown Visual Bar -->
<div class="w-full bg-surface-container rounded-full h-1.5 mt-xs overflow-hidden">
<div class="bg-error h-1.5 rounded-full" style="width: 82%"></div>
</div>
<div class="text-right text-[10px] font-label-sm text-error">Quedan 4 horas y 18 minutos</div>
</div>
<!-- Botones de Gestión del Hallazgo -->
<div class="grid grid-cols-2 gap-xs mt-sm">
<button class="bg-primary text-on-primary py-xs px-sm rounded-lg font-label-md hover:bg-primary-container transition-all flex items-center justify-center gap-1 text-[12px]" type="button">
<span class="material-symbols-outlined text-[16px]">check_circle</span>
<span>Validar Cierre</span>
</button>
<button class="bg-surface-container text-on-surface py-xs px-sm rounded-lg font-label-md hover:bg-surface-variant transition-all flex items-center justify-center gap-1 text-[12px]" type="button">
<span class="material-symbols-outlined text-[16px]">history</span>
<span>Ver Trazabilidad</span>
</button>
</div>
</div>
<!-- Resumen de Cumplimiento Normativo Resolución 0312 -->
<div class="flex flex-col bg-surface-container-lowest p-md rounded-xl shadow-sm">
<div class="flex items-center gap-xs">
<span class="material-symbols-outlined text-secondary text-[20px]">verified</span>
<h4 class="font-headline-md text-on-surface text-[16px]">Verificación Estándares Mínimos</h4>
</div>
<p class="font-body-sm text-outline text-[12px] mt-xs">
          Cumplimiento acumulado de inspecciones técnicas obligatorias para empresas de más de 50 trabajadores con Riesgo IV y V en sector agroindustrial.
        </p>
<div class="flex flex-col gap-xs mt-sm text-[12px]">
<div class="flex items-center justify-between">
<span class="text-on-surface-variant font-label-sm">E3.1.2 Inspección de Maquinaria</span>
<span class="text-primary font-bold">92%</span>
</div>
<div class="w-full bg-surface-container rounded-full h-1.5 overflow-hidden">
<div class="bg-primary h-1.5 rounded-full" style="width: 92%"></div>
</div>
<div class="flex items-center justify-between mt-xs">
<span class="text-on-surface-variant font-label-sm">E3.1.4 Inspección de EPP &amp; Alturas</span>
<span class="text-secondary font-bold">88%</span>
</div>
<div class="w-full bg-surface-container rounded-full h-1.5 overflow-hidden">
<div class="bg-secondary h-1.5 rounded-full" style="width: 88%"></div>
</div>
<div class="flex items-center justify-between mt-xs">
<span class="text-on-surface-variant font-label-sm">E3.1.7 Plan de Emergencias y Extintores</span>
<span class="text-error font-bold">71%</span>
</div>
<div class="w-full bg-surface-container rounded-full h-1.5 overflow-hidden">
<div class="bg-error h-1.5 rounded-full" style="width: 71%"></div>
</div>
</div>
<button class="mt-md w-full bg-surface-container-high text-primary py-xs rounded-lg font-label-md hover:bg-surface-variant transition-all flex items-center justify-center gap-1 text-[12px]" type="button">
<span class="material-symbols-outlined text-[16px]">download</span>
<span>Descargar Acta Mensual para ARL</span>
</button>
</div>
</aside>
</div>
</div></main></div></body></html>
