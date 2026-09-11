6. RESTRICCIONES Y RECOMENDACIONES
   Crear base independiente relacionada con trabajador.
   Campos:
   • Trabajador
   • Tipo
   • Fecha de emisión
   • Fecha inicio
   • Fecha vencimiento
   • Restricción/recomendación
   • Responsable de implementación
   • Medida implementada
   • Fecha de implementación
   • Estado
   • Evidencia
   • Próximo seguimiento
   • Observaciones
   Estados:
   • Vigente
   • Próxima a vencer
   • Vencida
   • Pendiente implementación
   • Cerrada

---

7. CASOS DE SALUD ABIERTOS
   Crear módulo para seguimiento administrativo SST.
   No almacenar historia clínica detallada.
   Categorías:
   • Accidente laboral
   • Enfermedad laboral
   • Enfermedad común con impacto laboral
   • Restricción
   • Recomendación médica
   • Reintegro
   • Reubicación
   • Seguimiento EPS
   • Seguimiento ARL
   Campos:
   • Trabajador
   • Tipo de caso
   • Fecha de apertura
   • Estado
   • Responsable
   • Próximo seguimiento
   • Fecha de cierre
   • Observaciones administrativas
   • Evidencia
   Dashboard:
   • Casos abiertos
   • Casos en seguimiento
   • Casos pendientes
   • Casos cerrados
   • Próximos seguimientos

---

8. INCAPACIDADES Y REINTEGROS
Crear módulo para registrar incapacidades.
Campos:
• Trabajador
• Empresa
• Fecha inicio
• Fecha final
• Número de días
• Origen: Común / Laboral
• Prórroga: Sí/No
• Días acumulados
• Estado
• Seguimiento SST
• Reintegro requerido
• Fecha reintegro
• Observaciones administrativas
Alertas:
🔴 Incapacidad vencida sin cierre
🟠 Termina en 3 días
🟠 Termina en 7 días
🔴 Prórroga registrada
🔴 Reintegro pendiente
Crear gráfico:
Trabajadores con mayor número de días de incapacidad.
<!DOCTYPE html>

<html lang="es"><head><meta charset="utf-8"/><meta content="width=device-width, initial-scale=1.0" name="viewport"/><link href="https://fonts.googleapis.com" rel="preconnect"/><link crossorigin="" href="https://fonts.gstatic.com" rel="preconnect"/><link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&amp;display=swap" rel="stylesheet"/><link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" rel="stylesheet"/>
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet"/><style>@layer base{html,body{margin:0;padding:0;}body{overscroll-behavior:none;}main>:first-child{margin-top:0!important;}main>:last-child{margin-bottom:0!important;}}::-webkit-scrollbar{display:none;}</style><script src="https://cdn.tailwindcss.com"></script><script id="tailwind-config">tailwind.config = {"darkMode":"class","theme":{"extend":{"colors":{"on-tertiary-container":"#adb0b2","on-error-container":"#93000a","surface-tint":"#4b57aa","tertiary-container":"#404345","inverse-on-surface":"#eaf1ff","on-primary-fixed":"#000d60","surface-variant":"#d5e3fc","on-secondary-fixed-variant":"#2f2ebe","surface-container-high":"#dce9ff","inverse-surface":"#233144","on-primary-fixed-variant":"#333f91","on-primary":"#ffffff","surface-container-lowest":"#ffffff","surface-container-low":"#eff4ff","surface":"#f8f9ff","on-tertiary-fixed-variant":"#444749","inverse-primary":"#bcc3ff","error":"#ba1a1a","tertiary":"#2a2d2f","on-secondary":"#ffffff","secondary-fixed-dim":"#c0c1ff","outline-variant":"#c6c5d3","secondary":"#4648d4","on-error":"#ffffff","outline":"#767682","on-secondary-fixed":"#07006c","error-container":"#ffdad6","surface-dim":"#ccdbf3","surface-container-highest":"#d5e3fc","surface-container":"#e6eeff","on-tertiary-fixed":"#191c1e","tertiary-fixed":"#e0e3e5","on-background":"#0d1c2e","primary-container":"#2e3a8c","secondary-fixed":"#e1e0ff","primary":"#142175","primary-fixed":"#dfe0ff","on-primary-container":"#9ea9ff","on-surface-variant":"#454651","tertiary-fixed-dim":"#c4c7c9","surface-bright":"#f8f9ff","on-tertiary":"#ffffff","secondary-container":"#6063ee","background":"#f8f9ff","primary-fixed-dim":"#bcc3ff","on-secondary-container":"#fffbff","on-surface":"#0d1c2e"},"borderRadius":{"DEFAULT":"0.25rem","lg":"0.5rem","xl":"0.75rem","full":"9999px"},"spacing":{"xl":"80px","container-max":"1280px","xs":"4px","base":"8px","gutter":"24px","md":"24px","lg":"48px","sm":"12px"},"fontFamily":{"display-lg":["Inter"],"body-sm":["Inter"],"headline-lg":["Inter"],"headline-md":["Inter"],"body-md":["Inter"],"body-lg":["Inter"],"label-md":["Inter"],"headline-lg-mobile":["Inter"],"label-sm":["Inter"]},"fontSize":{"display-lg":["48px",{"lineHeight":"56px","letterSpacing":"-0.02em","fontWeight":"700"}],"body-sm":["14px",{"lineHeight":"20px","fontWeight":"400"}],"headline-lg":["32px",{"lineHeight":"40px","letterSpacing":"-0.01em","fontWeight":"600"}],"headline-md":["24px",{"lineHeight":"32px","fontWeight":"600"}],"body-md":["16px",{"lineHeight":"24px","fontWeight":"400"}],"body-lg":["18px",{"lineHeight":"28px","fontWeight":"400"}],"label-md":["14px",{"lineHeight":"16px","letterSpacing":"0.01em","fontWeight":"500"}],"headline-lg-mobile":["24px",{"lineHeight":"32px","fontWeight":"600"}],"label-sm":["12px",{"lineHeight":"14px","fontWeight":"600"}]}}}};</script></head><body class="bg-background font-body-md text-on-surface antialiased"><aside class="fixed left-0 top-0 h-full w-72 bg-surface-container-low z-50 flex flex-col shadow-[0_1px_8px_rgba(0,0,0,0.04)]"><div class="h-16 px-md flex items-center gap-sm bg-surface-container-low"><div class="w-9 h-9 rounded-lg bg-primary flex items-center justify-center text-on-primary font-headline-md text-headline-md">M</div><div class="flex flex-col"><span class="font-label-md text-label-md text-primary font-bold leading-tight">Grupo Manzanares</span><span class="font-label-sm text-label-sm text-on-surface-variant">SG-SST Operativo</span></div></div><div class="flex-1 overflow-y-auto px-sm py-base space-y-md"><nav class="space-y-base" data-active-classes="bg-primary text-on-primary rounded-lg font-label-md"><div><div class="px-sm pb-xs font-label-sm text-label-sm uppercase tracking-wider text-on-surface-variant opacity-75">Gestión Operativa</div><div class="space-y-1"><a class="flex items-center gap-sm px-sm py-2 rounded-lg text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-colors font-body-sm text-body-sm" data-path="dashboard" href="#"><span class="material-symbols-outlined text-[20px]">home</span><span>Inicio / Dashboard</span></a><a aria-current="page" class="flex items-center justify-between px-sm py-2 transition-colors bg-primary text-on-primary rounded-lg font-label-md" data-path="trabajadores" href="#"><div class="flex items-center gap-sm"><span class="material-symbols-outlined text-[20px]">engineering</span><span>Trabajadores</span></div><span class="bg-secondary-fixed text-on-secondary-fixed font-label-sm text-[11px] px-2 py-0.5 rounded-full">342</span></a><a class="flex items-center gap-sm px-sm py-2 rounded-lg text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-colors font-body-sm text-body-sm" data-path="examenes-medicos" href="#"><span class="material-symbols-outlined text-[20px]">stethoscope</span><span>Exámenes Médicos</span></a><a class="flex items-center gap-sm px-sm py-2 rounded-lg text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-colors font-body-sm text-body-sm" data-path="casos-de-salud" href="#"><span class="material-symbols-outlined text-[20px]">local_hospital</span><span>Casos de Salud</span></a><a class="flex items-center gap-sm px-sm py-2 rounded-lg text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-colors font-body-sm text-body-sm" data-path="incapacidades-y-reintegros" href="#"><span class="material-symbols-outlined text-[20px]">event_busy</span><span>Incapacidades y Reintegros</span></a></div></div><div><div class="px-sm pb-xs font-label-sm text-label-sm uppercase tracking-wider text-on-surface-variant opacity-75">Riesgos Críticos &amp; Viales</div><div class="space-y-1"><a class="flex items-center gap-sm px-sm py-2 rounded-lg text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-colors font-body-sm text-body-sm" data-path="trabajo-en-alturas" href="#"><span class="material-symbols-outlined text-[20px]">stairs</span><span>Trabajo en Alturas</span></a><a class="flex items-center gap-sm px-sm py-2 rounded-lg text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-colors font-body-sm text-body-sm" data-path="tractoristas-operadores" href="#"><span class="material-symbols-outlined text-[20px]">agriculture</span><span>Tractoristas / Operadores</span></a><a class="flex items-center gap-sm px-sm py-2 rounded-lg text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-colors font-body-sm text-body-sm" data-path="pesv-seguridad-vial" href="#"><span class="material-symbols-outlined text-[20px]">directions_car</span><span>PESV (Seguridad Vial)</span></a><a class="flex items-center gap-sm px-sm py-2 rounded-lg text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-colors font-body-sm text-body-sm" data-path="epp" href="#"><span class="material-symbols-outlined text-[20px]">arrow_left</span><span>EPP</span></a></div></div><div><div class="px-sm pb-xs font-label-sm text-label-sm uppercase tracking-wider text-on-surface-variant opacity-75">Inspección &amp; Eventos</div><div class="space-y-1"><a class="flex items-center gap-sm px-sm py-2 rounded-lg text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-colors font-body-sm text-body-sm" data-path="inspecciones" href="#"><span class="material-symbols-outlined text-[20px]">search_check</span><span>Inspecciones</span></a><a class="flex items-center justify-between px-sm py-2 rounded-lg text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-colors font-body-sm text-body-sm" data-path="accidentes-e-incidentes" href="#"><div class="flex items-center gap-sm"><span class="material-symbols-outlined text-[20px]">e911_emergency</span><span>Accidentes e Incidentes</span></div><span class="bg-error-container text-on-error-container font-label-sm text-[11px] px-1.5 py-0.5 rounded font-bold">2</span></a><a class="flex items-center gap-sm px-sm py-2 rounded-lg text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-colors font-body-sm text-body-sm" data-path="investigaciones" href="#"><span class="material-symbols-outlined text-[20px]">assignment</span><span>Investigaciones</span></a><a class="flex items-center gap-sm px-sm py-2 rounded-lg text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-colors font-body-sm text-body-sm" data-path="acciones-correctivas" href="#"><span class="material-symbols-outlined text-[20px]">build</span><span>Acciones Correctivas</span></a></div></div><div><div class="px-sm pb-xs font-label-sm text-label-sm uppercase tracking-wider text-on-surface-variant opacity-75">Comités &amp; Cultura</div><div class="space-y-1"><a class="flex items-center gap-sm px-sm py-2 rounded-lg text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-colors font-body-sm text-body-sm" data-path="capacitaciones" href="#"><span class="material-symbols-outlined text-[20px]">school</span><span>Capacitaciones</span></a><a class="flex items-center gap-sm px-sm py-2 rounded-lg text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-colors font-body-sm text-body-sm" data-path="documentos-sg-sst" href="#"><span class="material-symbols-outlined text-[20px]">description</span><span>Documentos SG-SST</span></a><a class="flex items-center gap-sm px-sm py-2 rounded-lg text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-colors font-body-sm text-body-sm" data-path="copasst" href="#"><span class="material-symbols-outlined text-[20px]">groups</span><span>COPASST</span></a><a class="flex items-center gap-sm px-sm py-2 rounded-lg text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-colors font-body-sm text-body-sm" data-path="ccl" href="#"><span class="material-symbols-outlined text-[20px]">handshake</span><span>CCL</span></a><a class="flex items-center gap-sm px-sm py-2 rounded-lg text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-colors font-body-sm text-body-sm" data-path="emergencias" href="#"><span class="material-symbols-outlined text-[20px]">fire_extinguisher</span><span>Emergencias</span></a><a class="flex items-center gap-sm px-sm py-2 rounded-lg text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-colors font-body-sm text-body-sm" data-path="quimicos" href="#"><span class="material-symbols-outlined text-[20px]">science</span><span>Químicos</span></a></div></div><div><div class="px-sm pb-xs font-label-sm text-label-sm uppercase tracking-wider text-on-surface-variant opacity-75">Estrategia &amp; Control</div><div class="space-y-1"><a class="flex items-center gap-sm px-sm py-2 rounded-lg text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-colors font-body-sm text-body-sm" data-path="analisis-sst" href="#"><span class="material-symbols-outlined text-[20px]">insights</span><span>Análisis SST</span></a><a class="flex items-center gap-sm px-sm py-2 rounded-lg text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-colors font-body-sm text-body-sm" data-path="configuracion" href="#"><span class="material-symbols-outlined text-[20px]">settings</span><span>Configuración</span></a></div></div></nav></div><div class="p-sm bg-surface-container m-sm rounded-lg flex items-center justify-between"><div class="flex items-center gap-2"><span class="w-2.5 h-2.5 rounded-full bg-secondary"></span><span class="font-label-sm text-label-sm text-on-surface">Riesgo Operativo V2</span></div><span class="font-label-sm text-label-sm text-primary font-bold">98.4%</span></div></aside><div class="pl-72"><header class="fixed top-0 left-72 right-0 h-16 bg-surface/90 backdrop-blur-xl shadow-[0_1px_8px_rgba(0,0,0,0.04)] z-40 px-md flex items-center justify-between"><div class="flex items-center gap-sm"><div class="hidden xl:flex items-center gap-2"><span class="px-2 py-1 rounded bg-surface-container text-on-surface-variant font-label-sm text-[11px] font-medium">Dec. 1072/2015</span><span class="px-2 py-1 rounded bg-surface-container text-on-surface-variant font-label-sm text-[11px] font-medium">Res. 0312</span><span class="px-2 py-1 rounded bg-surface-container text-on-surface-variant font-label-sm text-[11px] font-medium">Res. 4272 Alturas</span></div><div class="flex items-center gap-2 px-2.5 py-1 rounded-full bg-surface-container-low text-on-surface font-label-sm text-[12px]"><span class="w-2 h-2 rounded-full bg-secondary animate-pulse"></span><span>En línea / Sincronizado</span></div></div><div class="flex items-center gap-md"><button class="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-primary-container text-on-primary-container hover:bg-primary hover:text-on-primary transition-colors font-label-md text-label-md" type="button"><span class="material-symbols-outlined text-[18px]">notification_important</span><span>Reporte Rápido / Notificación</span></button><div class="h-6 w-px bg-outline-variant"></div><div class="flex items-center gap-3"><div class="text-right hidden md:block"><div class="font-label-md text-label-md text-on-surface leading-tight">Ing. Andrés Valencia</div><div class="font-label-sm text-label-sm text-on-surface-variant">Coordinador SG-SST</div></div><div class="w-8 h-8 rounded-full bg-primary flex items-center justify-center"><span class="material-symbols-outlined text-on-primary text-[18px]">person</span></div></div></div></header><main class="w-full pt-16 bg-background min-h-screen px-gutter py-md"><div class="flex flex-col w-full">
<!-- Cabecera de Módulo y Breadcrumbs -->
<div class="w-full flex flex-col xl:flex-row xl:items-center justify-between gap-md mb-md">
<div class="flex flex-col gap-xs">
<div class="flex items-center gap-2 text-on-surface-variant font-label-sm text-label-sm">
<span class="hover:text-primary cursor-pointer transition-colors">Gestión de Personal &amp; Salud</span>
<span class="material-symbols-outlined text-[16px] text-outline">chevron_right</span>
<span class="text-primary font-bold">Casos de Salud Abiertos</span>
<span class="bg-surface-container px-2 py-0.5 rounded text-on-surface-variant text-[11px] font-medium ml-2">SG-SST Operativo</span>
</div>
<h1 class="font-headline-lg text-headline-lg text-primary tracking-tight">
        7. CASOS DE SALUD ABIERTOS - Sistema de Gestión y Vigilancia Administrativa SST
      </h1>
<p class="font-body-md text-body-md text-on-surface-variant max-w-4xl">
        Seguimiento corporativo, acompañamiento ARL/EPS, planes de reubicación y trazabilidad de eventos de salud sin almacenamiento de diagnósticos clínicos confidenciales.
      </p>
</div>
<!-- Botones de Acción Global -->
<div class="flex items-center flex-wrap gap-sm shrink-0">
<button class="flex items-center gap-2 px-3 py-2 rounded-lg bg-surface-container-lowest shadow-sm hover:bg-surface-container text-on-surface font-label-md text-label-md transition-colors" type="button">
<span class="material-symbols-outlined text-[18px] text-primary">download</span>
<span>Exportar Matriz (.XLSX)</span>
</button>
<button class="flex items-center gap-2 px-3 py-2 rounded-lg bg-surface-container-lowest shadow-sm hover:bg-surface-container text-on-surface font-label-md text-label-md transition-colors" type="button">
<span class="material-symbols-outlined text-[18px] text-secondary">verified</span>
<span>Informes MinTrabajo / ARL</span>
</button>
<button class="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-on-primary hover:bg-primary-container shadow-md transition-all font-label-md text-label-md" onclick="document.getElementById('modal-apertura').classList.toggle('hidden')" type="button">
<span class="material-symbols-outlined text-[18px]">add_circle</span>
<span>+ Aperturar Nuevo Caso</span>
</button>
</div>
</div>
<!-- Banner Normativo de Reserva Legal (Res. 2346/2007) -->
<div class="w-full bg-surface-container-low p-sm rounded-lg mb-md flex items-start gap-3">
<span class="material-symbols-outlined text-primary text-[22px] shrink-0 mt-0.5">verified_user</span>
<div class="flex flex-col md:flex-row md:items-center justify-between w-full gap-2">
<div class="font-body-sm text-body-sm text-on-surface-variant">
<strong class="text-on-surface font-label-md">Protocolo de Confidencialidad Ocupacional:</strong> 
        En cumplimiento estricto del Art. 16 de la Res. 2346/2007 y Dec. 1072/2015, este módulo documenta únicamente conceptos ocupacionales de aptitud, recomendaciones laborales y trazabilidad técnico-administrativa. <span class="text-error font-medium">Queda prohibido el ingreso de historia clínica o diagnósticos CIE-10.</span>
</div>
<span class="px-2.5 py-1 rounded bg-surface-container text-primary font-label-sm text-[11px] whitespace-nowrap self-start md:self-auto font-bold">
        Auditoría R-0312 Activa
      </span>
</div>
</div>
<!-- Dashboard de KPIs y Métricas de Salud -->
<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-sm mb-md">
<!-- KPI 1 -->
<div class="bg-surface-container-lowest p-md rounded-xl shadow-sm flex flex-col justify-between">
<div class="flex items-center justify-between mb-2">
<span class="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">Casos Abiertos</span>
<span class="w-8 h-8 rounded-lg bg-primary-fixed text-primary flex items-center justify-center">
<span class="material-symbols-outlined text-[18px]">folder_open</span>
</span>
</div>
<div class="flex items-baseline gap-2">
<span class="font-display-lg text-[36px] leading-tight font-bold text-on-surface">14</span>
<span class="font-label-sm text-label-sm text-primary font-medium">Activos hoy</span>
</div>
<div class="w-full bg-surface-container h-1.5 rounded-full mt-3 overflow-hidden">
<div class="bg-primary h-full rounded-full" style="width: 48%"></div>
</div>
</div>
<!-- KPI 2 -->
<div class="bg-surface-container-lowest p-md rounded-xl shadow-sm flex flex-col justify-between">
<div class="flex items-center justify-between mb-2">
<span class="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">En Seguimiento</span>
<span class="w-8 h-8 rounded-lg bg-secondary-fixed text-secondary flex items-center justify-center">
<span class="material-symbols-outlined text-[18px]">sync</span>
</span>
</div>
<div class="flex items-baseline gap-2">
<span class="font-display-lg text-[36px] leading-tight font-bold text-on-surface">28</span>
<span class="font-label-sm text-label-sm text-secondary font-medium">Bimensual</span>
</div>
<div class="w-full bg-surface-container h-1.5 rounded-full mt-3 overflow-hidden">
<div class="bg-secondary h-full rounded-full" style="width: 72%"></div>
</div>
</div>
<!-- KPI 3 -->
<div class="bg-surface-container-lowest p-md rounded-xl shadow-sm flex flex-col justify-between">
<div class="flex items-center justify-between mb-2">
<span class="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">Pendientes Dictamen</span>
<span class="w-8 h-8 rounded-lg bg-error-container text-on-error-container flex items-center justify-center">
<span class="material-symbols-outlined text-[18px]">hourglass_top</span>
</span>
</div>
<div class="flex items-baseline gap-2">
<span class="font-display-lg text-[36px] leading-tight font-bold text-error">5</span>
<span class="font-label-sm text-label-sm text-error font-medium">ARL / PCL</span>
</div>
<div class="w-full bg-surface-container h-1.5 rounded-full mt-3 overflow-hidden">
<div class="bg-error h-full rounded-full" style="width: 25%"></div>
</div>
</div>
<!-- KPI 4 -->
<div class="bg-surface-container-lowest p-md rounded-xl shadow-sm flex flex-col justify-between">
<div class="flex items-center justify-between mb-2">
<span class="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">Próx. Seguimientos</span>
<span class="w-8 h-8 rounded-lg bg-surface-container text-on-surface flex items-center justify-center">
<span class="material-symbols-outlined text-[18px]">event</span>
</span>
</div>
<div class="flex items-baseline gap-2">
<span class="font-display-lg text-[36px] leading-tight font-bold text-on-surface">8</span>
<span class="font-label-sm text-label-sm text-on-surface-variant font-medium">&lt; 15 días</span>
</div>
<div class="w-full bg-surface-container h-1.5 rounded-full mt-3 overflow-hidden">
<div class="bg-surface-tint h-full rounded-full" style="width: 60%"></div>
</div>
</div>
<!-- KPI 5 -->
<div class="bg-surface-container-lowest p-md rounded-xl shadow-sm flex flex-col justify-between">
<div class="flex items-center justify-between mb-2">
<span class="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">Casos Cerrados (2024)</span>
<span class="w-8 h-8 rounded-lg bg-surface-container-low text-primary flex items-center justify-center">
<span class="material-symbols-outlined text-[18px]">task_alt</span>
</span>
</div>
<div class="flex items-baseline gap-2">
<span class="font-display-lg text-[36px] leading-tight font-bold text-on-surface">42</span>
<span class="font-label-sm text-label-sm text-on-surface-variant font-medium">Alta definitiva</span>
</div>
<div class="w-full bg-surface-container h-1.5 rounded-full mt-3 overflow-hidden">
<div class="bg-primary-container h-full rounded-full" style="width: 100%"></div>
</div>
</div>
</div>
<!-- Barra de Filtros Normativos y Categorías -->
<div class="w-full bg-surface-container-lowest p-sm rounded-xl shadow-sm mb-md flex flex-col gap-sm">
<div class="flex items-center justify-between">
<div class="flex items-center gap-2">
<span class="material-symbols-outlined text-[18px] text-primary">filter_alt</span>
<span class="font-label-sm text-label-sm text-on-surface uppercase tracking-wider font-bold">Clasificación por Categorías Normativas</span>
</div>
<span class="font-label-sm text-label-sm text-on-surface-variant">Filtrando 45 casos totales</span>
</div>
<!-- Badges de Filtros Dinámicos -->
<div class="flex items-center gap-2 overflow-x-auto pb-1 text-label-sm font-label-sm">
<button class="px-3 py-1.5 rounded-lg bg-primary text-on-primary flex items-center gap-1.5 whitespace-nowrap shadow-sm" type="button">
<span>Todos los Casos</span>
<span class="bg-primary-container text-on-primary-container text-[11px] px-1.5 py-0.2 rounded-full">47</span>
</button>
<button class="px-3 py-1.5 rounded-lg bg-surface-container-low text-on-surface hover:bg-surface-container flex items-center gap-1.5 whitespace-nowrap transition-colors" type="button">
<span class="w-2 h-2 rounded-full bg-error"></span>
<span>Accidente Laboral</span>
<span class="bg-error-container text-on-error-container text-[11px] px-1.5 py-0.2 rounded-full font-bold">4</span>
</button>
<button class="px-3 py-1.5 rounded-lg bg-surface-container-low text-on-surface hover:bg-surface-container flex items-center gap-1.5 whitespace-nowrap transition-colors" type="button">
<span class="w-2 h-2 rounded-full bg-primary"></span>
<span>Enfermedad Laboral</span>
<span class="bg-surface-container text-primary text-[11px] px-1.5 py-0.2 rounded-full font-bold">3</span>
</button>
<button class="px-3 py-1.5 rounded-lg bg-surface-container-low text-on-surface hover:bg-surface-container flex items-center gap-1.5 whitespace-nowrap transition-colors" type="button">
<span class="w-2 h-2 rounded-full bg-outline"></span>
<span>Enfermedad Común</span>
<span class="bg-surface-container text-on-surface-variant text-[11px] px-1.5 py-0.2 rounded-full font-bold">5</span>
</button>
<button class="px-3 py-1.5 rounded-lg bg-surface-container-low text-on-surface hover:bg-surface-container flex items-center gap-1.5 whitespace-nowrap transition-colors" type="button">
<span class="w-2 h-2 rounded-full bg-secondary"></span>
<span>Restricción Médica</span>
<span class="bg-secondary-fixed text-on-secondary-fixed text-[11px] px-1.5 py-0.2 rounded-full font-bold">12</span>
</button>
<button class="px-3 py-1.5 rounded-lg bg-surface-container-low text-on-surface hover:bg-surface-container flex items-center gap-1.5 whitespace-nowrap transition-colors" type="button">
<span class="w-2 h-2 rounded-full bg-surface-tint"></span>
<span>Recomendación Médica</span>
<span class="bg-surface-container text-on-surface text-[11px] px-1.5 py-0.2 rounded-full font-bold">8</span>
</button>
<button class="px-3 py-1.5 rounded-lg bg-surface-container-low text-on-surface hover:bg-surface-container flex items-center gap-1.5 whitespace-nowrap transition-colors" type="button">
<span class="w-2 h-2 rounded-full bg-primary-container"></span>
<span>Reintegro Laboral</span>
<span class="bg-surface-container text-on-surface text-[11px] px-1.5 py-0.2 rounded-full font-bold">3</span>
</button>
<button class="px-3 py-1.5 rounded-lg bg-surface-container-low text-on-surface hover:bg-surface-container flex items-center gap-1.5 whitespace-nowrap transition-colors" type="button">
<span class="w-2 h-2 rounded-full bg-secondary-container"></span>
<span>Reubicación Puesto</span>
<span class="bg-secondary-fixed text-on-secondary-fixed text-[11px] px-1.5 py-0.2 rounded-full font-bold">2</span>
</button>
<button class="px-3 py-1.5 rounded-lg bg-surface-container-low text-on-surface hover:bg-surface-container flex items-center gap-1.5 whitespace-nowrap transition-colors" type="button">
<span class="w-2 h-2 rounded-full bg-outline-variant"></span>
<span>Seguimiento EPS</span>
<span class="bg-surface-container text-on-surface text-[11px] px-1.5 py-0.2 rounded-full font-bold">6</span>
</button>
<button class="px-3 py-1.5 rounded-lg bg-surface-container-low text-on-surface hover:bg-surface-container flex items-center gap-1.5 whitespace-nowrap transition-colors" type="button">
<span class="w-2 h-2 rounded-full bg-primary"></span>
<span>Seguimiento ARL Sura</span>
<span class="bg-primary-fixed text-primary text-[11px] px-1.5 py-0.2 rounded-full font-bold">7</span>
</button>
</div>
</div>
<!-- Layout Principal en Grid 12 Columnas -->
<div class="grid grid-cols-1 xl:grid-cols-12 gap-md items-start">
<!-- Columna Izquierda / Central: Matriz de Seguimiento (8 columnas en desktop extendido) -->
<div class="xl:col-span-8 flex flex-col gap-md">
<!-- Tabla / Matriz Principal -->
<div class="bg-surface-container-lowest rounded-xl shadow-sm overflow-hidden">
<!-- Header de Tabla con Buscador -->
<div class="p-sm bg-surface-container-low flex flex-col sm:flex-row items-center justify-between gap-sm">
<div class="flex items-center gap-2 w-full sm:w-80 bg-surface-container-lowest px-3 py-1.5 rounded-lg shadow-sm">
<span class="material-symbols-outlined text-[18px] text-outline">search</span>
<input class="w-full bg-transparent font-body-sm text-body-sm text-on-surface focus:outline-none placeholder:text-outline" placeholder="Buscar por Folio, Cédula o Nombre..." type="text"/>
</div>
<div class="flex items-center gap-2 self-end sm:self-auto">
<span class="font-label-sm text-label-sm text-on-surface-variant">Sede/Finca:</span>
<select class="bg-surface-container-lowest text-on-surface font-body-sm text-body-sm px-2.5 py-1.5 rounded-lg shadow-sm focus:outline-none">
<option>Todas las fincas (Aguacate &amp; Cítricos)</option>
<option>Finca La Esperanza - Rionegro</option>
<option>Finca Los Naranjos - Sonsón</option>
<option>Planta Empacadora Central</option>
</select>
</div>
</div>
<!-- Contenedor Responsive Scroll -->
<div class="overflow-x-auto">
<table class="w-full text-left font-body-sm text-body-sm border-collapse">
<thead>
<tr class="bg-surface-container text-on-surface-variant font-label-sm text-label-sm uppercase tracking-wider">
<th class="py-3 px-sm">ID / Folio</th>
<th class="py-3 px-sm">Trabajador &amp; Finca</th>
<th class="py-3 px-sm">Categoría</th>
<th class="py-3 px-sm">Apertura / Tiempo</th>
<th class="py-3 px-sm">Estado</th>
<th class="py-3 px-sm">Próx. Seguimiento</th>
<th class="py-3 px-sm">Acciones Administrativas</th>
<th class="py-3 px-sm">Evidencia</th>
<th class="py-3 px-sm text-center">Gestión</th>
</tr>
</thead>
<tbody class="divide-y divide-transparent">
<!-- Registro 1: Caso Crítico / Reubicación -->
<tr class="hover:bg-surface-container-low transition-colors bg-surface-container-lowest">
<td class="py-3 px-sm whitespace-nowrap">
<span class="font-label-md text-label-md font-bold text-primary">#CS-2024-041</span>
<div class="text-[11px] text-on-surface-variant">Vig. Biomecánica</div>
</td>
<td class="py-3 px-sm">
<div class="font-label-md text-label-md font-bold text-on-surface">Julián Restrepo Morales</div>
<div class="text-[12px] text-on-surface-variant">CC 1.037.492.110 • Operador de Tractor</div>
<div class="text-[11px] text-secondary font-medium">Finca La Esperanza (Bloque 4)</div>
</td>
<td class="py-3 px-sm">
<span class="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-secondary-fixed text-on-secondary-fixed font-label-sm text-[11px] font-bold">
<span class="material-symbols-outlined text-[14px]">swap_horiz</span> Reubicación
                  </span>
</td>
<td class="py-3 px-sm whitespace-nowrap">
<div class="font-body-sm text-body-sm text-on-surface">12 Feb 2024</div>
<div class="text-[11px] text-error font-medium">78 días activo</div>
</td>
<td class="py-3 px-sm">
<span class="inline-flex items-center px-2 py-0.5 rounded bg-error-container text-on-error-container font-label-sm text-[11px] font-bold">
                    Pendiente Dictamen
                  </span>
</td>
<td class="py-3 px-sm whitespace-nowrap">
<div class="flex items-center gap-1.5">
<span class="w-2.5 h-2.5 rounded-full bg-error animate-pulse"></span>
<span class="font-label-sm text-label-sm text-error font-bold">04 May 2024</span>
</div>
<div class="text-[11px] text-on-surface-variant">En 2 días (ARL Sura)</div>
</td>
<td class="py-3 px-sm max-w-xs">
<p class="truncate text-on-surface" title="Reubicación temporal formalizada en bodega de empaque. Prohibida vibración de cuerpo entero. Pendiente mesa técnica con ergonomista de ARL Sura.">
                    Reubicado temporalmente en bodega de empaque. Prohibida vibración en tractor. Pendiente mesa técnica ARL.
                  </p>
<span class="text-[11px] text-on-surface-variant font-medium">Resp: Dra. Claudia Ortiz (SST)</span>
</td>
<td class="py-3 px-sm whitespace-nowrap">
<div class="flex items-center gap-1 text-primary">
<span class="material-symbols-outlined text-[18px] cursor-pointer hover:text-secondary" title="Concepto Aptitud PDF">description</span>
<span class="material-symbols-outlined text-[18px] cursor-pointer hover:text-secondary" title="Acta de Reubicación">verified</span>
</div>
</td>
<td class="py-3 px-sm text-center whitespace-nowrap">
<button class="p-1 rounded hover:bg-surface-container text-primary transition-colors" title="Ver Detalle y Trazabilidad" type="button">
<span class="material-symbols-outlined text-[20px]">visibility</span>
</button>
</td>
</tr>
<!-- Registro 2: Accidente Laboral / En Seguimiento -->
<tr class="hover:bg-surface-container-low transition-colors bg-surface-container-low/40">
<td class="py-3 px-sm whitespace-nowrap">
<span class="font-label-md text-label-md font-bold text-primary">#CS-2024-039</span>
<div class="text-[11px] text-on-surface-variant">FURAT 892110</div>
</td>
<td class="py-3 px-sm">
<div class="font-label-md text-label-md font-bold text-on-surface">Marta Lucía Gómez</div>
<div class="text-[12px] text-on-surface-variant">CC 43.892.401 • Cosechadora Alturas</div>
<div class="text-[11px] text-secondary font-medium">Finca Los Naranjos</div>
</td>
<td class="py-3 px-sm">
<span class="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-error-container text-on-error-container font-label-sm text-[11px] font-bold">
<span class="material-symbols-outlined text-[14px]">emergency</span> Acc. Laboral
                  </span>
</td>
<td class="py-3 px-sm whitespace-nowrap">
<div class="font-body-sm text-body-sm text-on-surface">28 Feb 2024</div>
<div class="text-[11px] text-on-surface-variant">62 días activo</div>
</td>
<td class="py-3 px-sm">
<span class="inline-flex items-center px-2 py-0.5 rounded bg-secondary-fixed text-on-secondary-fixed font-label-sm text-[11px] font-bold">
                    En Seguimiento
                  </span>
</td>
<td class="py-3 px-sm whitespace-nowrap">
<div class="flex items-center gap-1.5">
<span class="w-2.5 h-2.5 rounded-full bg-secondary"></span>
<span class="font-label-sm text-label-sm text-on-surface font-medium">15 May 2024</span>
</div>
<div class="text-[11px] text-on-surface-variant">En 13 días (Fisioterapia)</div>
</td>
<td class="py-3 px-sm max-w-xs">
<p class="truncate text-on-surface" title="Reintegro progresivo con restricción para cargas &gt; 5 kg y trabajo en alturas mayores a 1.5m. Acompañamiento en taller de poda en suelo.">
                    Reintegro progresivo. Restricción carga &gt; 5kg y alturas. Asignada a labores de vivero bajo sombra.
                  </p>
<span class="text-[11px] text-on-surface-variant font-medium">Resp: Ing. Andrés Valencia</span>
</td>
<td class="py-3 px-sm whitespace-nowrap">
<div class="flex items-center gap-1 text-primary">
<span class="material-symbols-outlined text-[18px] cursor-pointer hover:text-secondary" title="FURAT Encriptado">lock</span>
<span class="material-symbols-outlined text-[18px] cursor-pointer hover:text-secondary" title="Acta de Reintegro">assignment_turned_in</span>
</div>
</td>
<td class="py-3 px-sm text-center whitespace-nowrap">
<button class="p-1 rounded hover:bg-surface-container text-primary transition-colors" title="Ver Detalle" type="button">
<span class="material-symbols-outlined text-[20px]">visibility</span>
</button>
</td>
</tr>
<!-- Registro 3: Restricción Médica Común -->
<tr class="hover:bg-surface-container-low transition-colors bg-surface-container-lowest">
<td class="py-3 px-sm whitespace-nowrap">
<span class="font-label-md text-label-md font-bold text-primary">#CS-2024-035</span>
<div class="text-[11px] text-on-surface-variant">SURA EPS</div>
</td>
<td class="py-3 px-sm">
<div class="font-label-md text-label-md font-bold text-on-surface">Carlos Alberto Henao</div>
<div class="text-[12px] text-on-surface-variant">CC 71.302.991 • Fumigador Agrícola</div>
<div class="text-[11px] text-secondary font-medium">Finca La Esperanza</div>
</td>
<td class="py-3 px-sm">
<span class="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-surface-container text-on-surface font-label-sm text-[11px] font-bold">
<span class="material-symbols-outlined text-[14px]">warning</span> Restricción
                  </span>
</td>
<td class="py-3 px-sm whitespace-nowrap">
<div class="font-body-sm text-body-sm text-on-surface">10 Ene 2024</div>
<div class="text-[11px] text-on-surface-variant">112 días activo</div>
</td>
<td class="py-3 px-sm">
<span class="inline-flex items-center px-2 py-0.5 rounded bg-primary-fixed text-primary font-label-sm text-[11px] font-bold">
                    Abierto
                  </span>
</td>
<td class="py-3 px-sm whitespace-nowrap">
<div class="flex items-center gap-1.5">
<span class="w-2.5 h-2.5 rounded-full bg-outline"></span>
<span class="font-label-sm text-label-sm text-on-surface font-medium">28 May 2024</span>
</div>
<div class="text-[11px] text-on-surface-variant">Seguimiento Trimestral</div>
</td>
<td class="py-3 px-sm max-w-xs">
<p class="truncate text-on-surface" title="Restricción estricta de exposición a agentes organofosforados y solventes. Traslado temporal al área de mantenimiento de infraestructura.">
                    Restricción de agroquímicos organofosforados. Reubicado a cuadrilla de carpintería y cerramientos.
                  </p>
<span class="text-[11px] text-on-surface-variant font-medium">Resp: Dra. Claudia Ortiz (SST)</span>
</td>
<td class="py-3 px-sm whitespace-nowrap">
<div class="flex items-center gap-1 text-primary">
<span class="material-symbols-outlined text-[18px] cursor-pointer hover:text-secondary" title="Certificado Médico">fact_check</span>
</div>
</td>
<td class="py-3 px-sm text-center whitespace-nowrap">
<button class="p-1 rounded hover:bg-surface-container text-primary transition-colors" title="Ver Detalle" type="button">
<span class="material-symbols-outlined text-[20px]">visibility</span>
</button>
</td>
</tr>
<!-- Registro 4: Recomendación Médica Activa -->
<tr class="hover:bg-surface-container-low transition-colors bg-surface-container-low/40">
<td class="py-3 px-sm whitespace-nowrap">
<span class="font-label-md text-label-md font-bold text-primary">#CS-2024-028</span>
<div class="text-[11px] text-on-surface-variant">Post-incapacidad</div>
</td>
<td class="py-3 px-sm">
<div class="font-label-md text-label-md font-bold text-on-surface">Esperanza Cano Duque</div>
<div class="text-[12px] text-on-surface-variant">CC 32.109.840 • Clasificadora Planta</div>
<div class="text-[11px] text-secondary font-medium">Planta Empacadora Central</div>
</td>
<td class="py-3 px-sm">
<span class="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-surface-container-high text-on-surface-variant font-label-sm text-[11px] font-bold">
<span class="material-symbols-outlined text-[14px]">lightbulb</span> Recomendación
                  </span>
</td>
<td class="py-3 px-sm whitespace-nowrap">
<div class="font-body-sm text-body-sm text-on-surface">05 Mar 2024</div>
<div class="text-[11px] text-on-surface-variant">57 días activo</div>
</td>
<td class="py-3 px-sm">
<span class="inline-flex items-center px-2 py-0.5 rounded bg-secondary-fixed text-on-secondary-fixed font-label-sm text-[11px] font-bold">
                    En Seguimiento
                  </span>
</td>
<td class="py-3 px-sm whitespace-nowrap">
<div class="flex items-center gap-1.5">
<span class="w-2.5 h-2.5 rounded-full bg-secondary"></span>
<span class="font-label-sm text-label-sm text-on-surface font-medium">10 Jun 2024</span>
</div>
<div class="text-[11px] text-on-surface-variant">Revisión Silla Ergonómica</div>
</td>
<td class="py-3 px-sm max-w-xs">
<p class="truncate text-on-surface" title="Pausas activas dirigidas de 5 min cada 2 horas por molestia en túnel carpiano. Adecuación de plano de trabajo en banda transportadora.">
                    Pausas activas de 5 min c/2h. Adecuación de apoyo en banda. Evaluada sin novedad en puesto.
                  </p>
<span class="text-[11px] text-on-surface-variant font-medium">Resp: Fisioterapeuta Convenio</span>
</td>
<td class="py-3 px-sm whitespace-nowrap">
<div class="flex items-center gap-1 text-primary">
<span class="material-symbols-outlined text-[18px] cursor-pointer hover:text-secondary" title="Acta de Entrega Puesto">folder</span>
</div>
</td>
<td class="py-3 px-sm text-center whitespace-nowrap">
<button class="p-1 rounded hover:bg-surface-container text-primary transition-colors" title="Ver Detalle" type="button">
<span class="material-symbols-outlined text-[20px]">visibility</span>
</button>
</td>
</tr>
<!-- Registro 5: Caso Cerrado (Conforme a historia de éxito) -->
<tr class="hover:bg-surface-container-low transition-colors bg-surface-container-lowest opacity-85">
<td class="py-3 px-sm whitespace-nowrap">
<span class="font-label-md text-label-md font-bold text-outline">#CS-2023-118</span>
<div class="text-[11px] text-on-surface-variant">Cierre Definitivo</div>
</td>
<td class="py-3 px-sm">
<div class="font-label-md text-label-md font-bold text-on-surface">Rodrigo Peláez Quintero</div>
<div class="text-[12px] text-on-surface-variant">CC 98.431.112 • Podador / Deshierbe</div>
<div class="text-[11px] text-on-surface-variant">Finca Los Naranjos</div>
</td>
<td class="py-3 px-sm">
<span class="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-surface-container text-on-surface-variant font-label-sm text-[11px] font-bold">
<span class="material-symbols-outlined text-[14px]">task_alt</span> Reintegro Total
                  </span>
</td>
<td class="py-3 px-sm whitespace-nowrap">
<div class="font-body-sm text-body-sm text-on-surface">15 Nov 2023</div>
<div class="text-[11px] text-on-surface-variant">Cerrado: 10 Abr 2024</div>
</td>
<td class="py-3 px-sm">
<span class="inline-flex items-center px-2 py-0.5 rounded bg-surface-container-high text-on-surface-variant font-label-sm text-[11px] font-bold">
                    Cerrado
                  </span>
</td>
<td class="py-3 px-sm whitespace-nowrap">
<span class="font-label-sm text-label-sm text-on-surface-variant">Alta Ocupacional</span>
<div class="text-[11px] text-on-surface-variant">Sin restricciones</div>
</td>
<td class="py-3 px-sm max-w-xs">
<p class="truncate text-on-surface-variant" title="Cumplió 6 meses de adaptación ergonómica tras fractura de radio. Examen post-incapacidad emite concepto de Apto sin restricciones.">
                    Cumplió período de adaptación post-fractura. Concepto médico de Apto sin restricciones emitido.
                  </p>
<span class="text-[11px] text-on-surface-variant font-medium">Resp: Dra. Claudia Ortiz</span>
</td>
<td class="py-3 px-sm whitespace-nowrap">
<div class="flex items-center gap-1 text-on-surface-variant">
<span class="material-symbols-outlined text-[18px] cursor-pointer hover:text-primary" title="Acta de Cierre Formal">task</span>
</div>
</td>
<td class="py-3 px-sm text-center whitespace-nowrap">
<button class="p-1 rounded hover:bg-surface-container text-on-surface-variant transition-colors" title="Ver Historial" type="button">
<span class="material-symbols-outlined text-[20px]">history</span>
</button>
</td>
</tr>
</tbody>
</table>
</div>
<!-- Paginador y Resumen -->
<div class="p-sm bg-surface-container-low flex flex-col sm:flex-row items-center justify-between gap-2 font-label-sm text-label-sm text-on-surface-variant">
<span>Mostrando 5 de 14 casos activos (Total histórico: 89)</span>
<div class="flex items-center gap-1">
<button class="px-2.5 py-1 rounded bg-surface-container hover:bg-surface text-on-surface disabled:opacity-40">Anterior</button>
<button class="px-2.5 py-1 rounded bg-primary text-on-primary font-bold">1</button>
<button class="px-2.5 py-1 rounded bg-surface-container hover:bg-surface text-on-surface">2</button>
<button class="px-2.5 py-1 rounded bg-surface-container hover:bg-surface text-on-surface">3</button>
<button class="px-2.5 py-1 rounded bg-surface-container hover:bg-surface text-on-surface">Siguiente</button>
</div>
</div>
</div>
<!-- Métricas Gráficas Auxiliares (Inline SVG Chart) -->
<div class="grid grid-cols-1 md:grid-cols-2 gap-md">
<!-- Tarjeta de Distribución de Eventos -->
<div class="bg-surface-container-lowest p-md rounded-xl shadow-sm flex flex-col justify-between">
<div class="flex items-center justify-between mb-3">
<h3 class="font-label-md text-label-md font-bold text-on-surface">Distribución por Origen del Evento</h3>
<span class="material-symbols-outlined text-outline text-[18px]">pie_chart</span>
</div>
<div class="flex items-center gap-md">
<!-- Inline Mini Donut SVG -->
<div class="relative w-28 h-28 shrink-0">
<svg class="w-full h-full transform -rotate-90" viewbox="0 0 36 36">
<!-- Fondo del donut -->
<circle cx="18" cy="18" fill="transparent" r="15.915" stroke="#e6eeff" stroke-width="4"></circle>
<!-- Accidente Laboral (28%) -->
<circle cx="18" cy="18" fill="transparent" r="15.915" stroke="#ba1a1a" stroke-dasharray="28 72" stroke-dashoffset="0" stroke-width="4"></circle>
<!-- Restricción Médica Común (45%) -->
<circle cx="18" cy="18" fill="transparent" r="15.915" stroke="#4648d4" stroke-dasharray="45 55" stroke-dashoffset="-28" stroke-width="4"></circle>
<!-- Recomendaciones / Reintegro (27%) -->
<circle cx="18" cy="18" fill="transparent" r="15.915" stroke="#142175" stroke-dasharray="27 73" stroke-dashoffset="-73" stroke-width="4"></circle>
</svg>
<div class="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
<span class="font-headline-md text-[18px] font-bold text-on-surface leading-none">45</span>
<span class="text-[10px] text-on-surface-variant font-medium">Casos</span>
</div>
</div>
<!-- Leyenda de Datos -->
<div class="flex flex-col gap-1.5 w-full text-[12px] font-body-sm">
<div class="flex items-center justify-between">
<div class="flex items-center gap-1.5">
<span class="w-2.5 h-2.5 rounded-full bg-error shrink-0"></span>
<span class="text-on-surface">Accidente Laboral</span>
</div>
<span class="font-bold text-on-surface">28%</span>
</div>
<div class="flex items-center justify-between">
<div class="flex items-center gap-1.5">
<span class="w-2.5 h-2.5 rounded-full bg-secondary shrink-0"></span>
<span class="text-on-surface">Restricciones / Común</span>
</div>
<span class="font-bold text-on-surface">45%</span>
</div>
<div class="flex items-center justify-between">
<div class="flex items-center gap-1.5">
<span class="w-2.5 h-2.5 rounded-full bg-primary shrink-0"></span>
<span class="text-on-surface">Recomendación / Reintegro</span>
</div>
<span class="font-bold text-on-surface">27%</span>
</div>
</div>
</div>
<div class="mt-3 pt-2 text-[11px] text-on-surface-variant border-t border-surface-container">
            Vigilancia epidemiológica activa en biomecánica agroindustrial.
          </div>
</div>
<!-- Tarjeta de Siniestralidad & Acompañamiento ARL Sura -->
<div class="bg-surface-container-lowest p-md rounded-xl shadow-sm flex flex-col justify-between">
<div class="flex items-center justify-between mb-2">
<h3 class="font-label-md text-label-md font-bold text-on-surface">Mesa Laboral con ARL Sura</h3>
<span class="bg-primary-fixed text-primary px-2 py-0.5 rounded font-label-sm text-[11px] font-bold">Mensual</span>
</div>
<div class="flex flex-col gap-2 my-auto">
<div class="flex items-center justify-between text-body-sm">
<span class="text-on-surface-variant">Próxima sesión técnica:</span>
<strong class="text-on-surface font-label-md">08 Mayo 2024 - 09:00 AM</strong>
</div>
<div class="flex items-center justify-between text-body-sm">
<span class="text-on-surface-variant">Casos en agenda para valoración:</span>
<strong class="text-primary font-label-md">4 expedientes PCL</strong>
</div>
<div class="flex items-center justify-between text-body-sm">
<span class="text-on-surface-variant">Profesional asignado ARL:</span>
<span class="text-on-surface">Dr. Fernando Calle (Médico Laboral)</span>
</div>
</div>
<div class="mt-2 bg-surface-container-low p-2 rounded-lg flex items-center justify-between">
<span class="text-[11px] text-on-surface-variant">Acta previa radicado ARL #2024-9981</span>
<button class="text-secondary font-label-sm text-[11px] hover:underline font-bold flex items-center gap-1">
<span>Ver Acta Sura</span>
<span class="material-symbols-outlined text-[14px]">arrow_forward</span>
</button>
</div>
</div>
</div>
</div>
<!-- Columna Derecha: Panel Lateral de Detalle de Caso Activo / Trazabilidad Administrativa (4 columnas) -->
<div class="xl:col-span-4 flex flex-col gap-md">
<!-- Ficha de Trazabilidad del Caso Destacado -->
<div class="bg-surface-container-lowest rounded-xl shadow-sm p-md flex flex-col gap-md">
<!-- Header Ficha -->
<div class="flex items-start justify-between">
<div>
<div class="flex items-center gap-2">
<span class="bg-primary text-on-primary font-label-sm text-[11px] px-2 py-0.5 rounded font-bold">CASO EN SEGUIMIENTO</span>
<span class="font-label-sm text-label-sm text-outline">Folio: #CS-2024-041</span>
</div>
<h2 class="font-headline-md text-[20px] font-bold text-on-surface mt-1">Julián Restrepo Morales</h2>
<p class="font-body-sm text-body-sm text-on-surface-variant">CC 1.037.492.110 • Tractorista Agrícola</p>
</div>
<button class="text-on-surface-variant hover:text-primary p-1" type="button">
<span class="material-symbols-outlined text-[20px]">edit</span>
</button>
</div>
<!-- Finca y Puesto de Trabajo Asignado -->
<div class="bg-surface-container-low p-sm rounded-lg flex flex-col gap-1 text-[13px]">
<div class="flex justify-between">
<span class="text-on-surface-variant">Finca Asignada:</span>
<span class="font-bold text-on-surface">La Esperanza (Sonsón)</span>
</div>
<div class="flex justify-between">
<span class="text-on-surface-variant">Puesto Original:</span>
<span class="text-on-surface">Operador Tractor Kubota M7040</span>
</div>
<div class="flex justify-between">
<span class="text-on-surface-variant">Puesto Reubicado:</span>
<span class="text-secondary font-bold">Bodega Empaque (Alistamiento)</span>
</div>
<div class="flex justify-between">
<span class="text-on-surface-variant">Responsable SST:</span>
<span class="text-on-surface">Dra. Claudia Ortiz (Médica Ocup.)</span>
</div>
</div>
<!-- Flujo de Vida del Caso (Stepper Vertical Funcional) -->
<div class="flex flex-col gap-1">
<span class="font-label-sm text-label-sm text-on-surface uppercase tracking-wider font-bold mb-1">
            Flujo de Vida y Ciclo Administrativo
          </span>
<div class="relative pl-6 space-y-4 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-surface-container">
<!-- Hito 1: Completado -->
<div class="relative">
<span class="absolute -left-6 top-0.5 w-4 h-4 rounded-full bg-primary text-on-primary flex items-center justify-center text-[10px]">
                ✓
              </span>
<div class="font-label-sm text-label-sm font-bold text-on-surface">1. Apertura Administrativa</div>
<div class="text-[12px] text-on-surface-variant">12 Feb 2024 • Notificación de limitación osteomuscular tras valoración periódica.</div>
</div>
<!-- Hito 2: Completado -->
<div class="relative">
<span class="absolute -left-6 top-0.5 w-4 h-4 rounded-full bg-primary text-on-primary flex items-center justify-center text-[10px]">
                ✓
              </span>
<div class="font-label-sm text-label-sm font-bold text-on-surface">2. Valoración de Puesto de Trabajo</div>
<div class="text-[12px] text-on-surface-variant">25 Feb 2024 • Inspección ergonómica del tractor. Se restringe manejo por vibración.</div>
</div>
<!-- Hito 3: En Proceso -->
<div class="relative">
<span class="absolute -left-6 top-0.5 w-4 h-4 rounded-full bg-secondary text-on-secondary flex items-center justify-center text-[10px] animate-pulse">
                •
              </span>
<div class="font-label-sm text-label-sm font-bold text-secondary">3. Plan de Reubicación / Adaptación</div>
<div class="text-[12px] text-on-surface">Activo desde 01 Mar 2024 • Reubicado en Bodega sin bipedestación sostenida. Firma de acta de compromiso.</div>
</div>
<!-- Hito 4: Pendiente -->
<div class="relative opacity-60">
<span class="absolute -left-6 top-0.5 w-4 h-4 rounded-full bg-surface-container text-on-surface-variant flex items-center justify-center text-[10px]">
                4
              </span>
<div class="font-label-sm text-label-sm font-medium text-on-surface">4. Mesa Laboral &amp; Junta de Calificación</div>
<div class="text-[12px] text-on-surface-variant">Programada para 04 May 2024 • Emisión de concepto de PCL por ARL.</div>
</div>
<!-- Hito 5: Futuro -->
<div class="relative opacity-40">
<span class="absolute -left-6 top-0.5 w-4 h-4 rounded-full bg-surface-container text-on-surface-variant flex items-center justify-center text-[10px]">
                5
              </span>
<div class="font-label-sm text-label-sm font-medium text-on-surface">5. Cierre Formal / Reintegro Definitivo</div>
<div class="text-[12px] text-on-surface-variant">Estimado Agosto 2024 previa evaluación de aptitud laboral.</div>
</div>
</div>
</div>
<!-- Evidencias & Documentos Vinculados -->
<div class="flex flex-col gap-2">
<span class="font-label-sm text-label-sm text-on-surface uppercase tracking-wider font-bold">
            Soportes Administrativos Encriptados
          </span>
<div class="flex flex-col gap-1.5">
<div class="flex items-center justify-between p-2 rounded bg-surface-container-low hover:bg-surface-container transition-colors">
<div class="flex items-center gap-2">
<span class="material-symbols-outlined text-primary text-[18px]">picture_as_pdf</span>
<span class="text-[12px] font-medium text-on-surface">Concepto_Aptitud_Laboral_Feb2024.pdf</span>
</div>
<span class="material-symbols-outlined text-[16px] text-outline cursor-pointer hover:text-primary">download</span>
</div>
<div class="flex items-center justify-between p-2 rounded bg-surface-container-low hover:bg-surface-container transition-colors">
<div class="flex items-center gap-2">
<span class="material-symbols-outlined text-secondary text-[18px]">assignment_turned_in</span>
<span class="text-[12px] font-medium text-on-surface">Acta_Acuerdo_Reubicacion_Firmada.pdf</span>
</div>
<span class="material-symbols-outlined text-[16px] text-outline cursor-pointer hover:text-primary">download</span>
</div>
<div class="flex items-center justify-between p-2 rounded bg-surface-container-low hover:bg-surface-container transition-colors">
<div class="flex items-center gap-2">
<span class="material-symbols-outlined text-primary text-[18px]">analytics</span>
<span class="text-[12px] font-medium text-on-surface">Estudio_Puesto_Trabajo_Tractor.pdf</span>
</div>
<span class="material-symbols-outlined text-[16px] text-outline cursor-pointer hover:text-primary">download</span>
</div>
</div>
</div>
<!-- Botones de Acción del Expediente -->
<div class="flex flex-col gap-2 pt-2 border-t border-surface-container">
<button class="w-full py-2 px-3 rounded-lg bg-secondary text-on-secondary font-label-md text-label-md flex items-center justify-center gap-2 hover:bg-secondary-container transition-colors shadow-sm" type="button">
<span class="material-symbols-outlined text-[18px]">post_add</span>
<span>+ Registrar Acta de Seguimiento</span>
</button>
<button class="w-full py-2 px-3 rounded-lg bg-surface-container-low text-on-surface font-label-md text-label-md flex items-center justify-center gap-2 hover:bg-surface-container transition-colors" type="button">
<span class="material-symbols-outlined text-[18px]">upload_file</span>
<span>Adjuntar Concepto Médico Ocupacional</span>
</button>
</div>
</div>
<!-- Protocolos de Buenas Prácticas SG-SST -->
<div class="bg-surface-container-lowest rounded-xl p-md shadow-sm flex flex-col gap-2">
<div class="flex items-center gap-2 text-primary font-label-md text-label-md font-bold">
<span class="material-symbols-outlined text-[18px]">help</span>
<span>Recordatorio de Gestión Humana</span>
</div>
<p class="text-[12px] font-body-sm text-on-surface-variant leading-relaxed">
          Los trabajadores con recomendaciones médico-laborales no podrán ser despedidos sin autorización previa del Ministerio de Trabajo (Estabilidad Laboral Reforzada - Ley 361 de 1997, Art. 26). Las reubicaciones deben contar con acta suscrita por el jefe directo y SST.
        </p>
</div>
</div>
</div>
<!-- Modal / Formulario Flotante de Apertura de Nuevo Caso (Oculto por defecto, alternable) -->
<div class="hidden fixed inset-0 z-50 flex items-center justify-center bg-inverse-surface/40 backdrop-blur-sm p-4" id="modal-apertura">
<div class="bg-surface-container-lowest w-full max-w-2xl rounded-xl shadow-xl overflow-hidden flex flex-col max-h-[90vh]">
<!-- Modal Header -->
<div class="bg-primary p-md text-on-primary flex items-center justify-between">
<div class="flex items-center gap-2">
<span class="material-symbols-outlined text-[24px]">add_moderator</span>
<div>
<h3 class="font-headline-md text-[18px] font-bold">Apertura Administrativa de Caso de Salud</h3>
<p class="text-[12px] text-primary-fixed">Registro exclusivo de gestión laboral - No clínico</p>
</div>
</div>
<button class="p-1 rounded hover:bg-primary-container text-on-primary" onclick="document.getElementById('modal-apertura').classList.add('hidden')" type="button">
<span class="material-symbols-outlined text-[20px]">close</span>
</button>
</div>
<!-- Modal Body (Formulario) -->
<div class="p-md overflow-y-auto space-y-md">
<!-- Alerta de Protección de Datos -->
<div class="p-sm rounded bg-surface-container-low text-on-surface-variant text-[12px] flex items-center gap-2">
<span class="material-symbols-outlined text-primary text-[18px]">lock</span>
<span>Recuerde: No registre diagnósticos médicos, pruebas de laboratorio ni notas de evolución clínica.</span>
</div>
<div class="grid grid-cols-1 md:grid-cols-2 gap-sm">
<!-- Colaborador -->
<div>
<label class="block font-label-sm text-label-sm text-on-surface font-bold mb-1">Trabajador (Cédula o Nombre)</label>
<input class="w-full bg-surface-container-low px-3 py-2 rounded-lg text-body-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-primary" placeholder="Buscar trabajador activo..." type="text"/>
</div>
<!-- Tipo de Evento -->
<div>
<label class="block font-label-sm text-label-sm text-on-surface font-bold mb-1">Categoría Normativa</label>
<select class="w-full bg-surface-container-low px-3 py-2 rounded-lg text-body-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-primary">
<option>Restricción Médica Ocupacional</option>
<option>Recomendación Médica Preventiva</option>
<option>Accidente Laboral (FURAT Radicado)</option>
<option>Enfermedad Laboral Calificada</option>
<option>Enfermedad Común con Afectación</option>
<option>Reubicación Transitoria</option>
</select>
</div>
<!-- Finca / Centro de Costos -->
<div>
<label class="block font-label-sm text-label-sm text-on-surface font-bold mb-1">Finca / Frente Agrícola</label>
<select class="w-full bg-surface-container-low px-3 py-2 rounded-lg text-body-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-primary">
<option>Finca La Esperanza (Aguacate Hass)</option>
<option>Finca Los Naranjos (Cítricos)</option>
<option>Planta Empacadora Central</option>
<option>Cuadrilla de Riego &amp; Infraestructura</option>
</select>
</div>
<!-- Fecha de Emisión del Concepto -->
<div>
<label class="block font-label-sm text-label-sm text-on-surface font-bold mb-1">Fecha Emisión Recomendaciones</label>
<input class="w-full bg-surface-container-low px-3 py-2 rounded-lg text-body-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-primary" type="date"/>
</div>
<!-- Entidad Emisora -->
<div>
<label class="block font-label-sm text-label-sm text-on-surface font-bold mb-1">Entidad que Emite Recomendación</label>
<select class="w-full bg-surface-container-low px-3 py-2 rounded-lg text-body-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-primary">
<option>ARL Sura (Medicina Laboral)</option>
<option>EPS Sura / Sanitas / Nueva EPS</option>
<option>Médico Especialista Ocupacional Externo</option>
<option>Junta Regional de Calificación</option>
</select>
</div>
<!-- Responsable SST -->
<div>
<label class="block font-label-sm text-label-sm text-on-surface font-bold mb-1">Responsable del Caso (SST)</label>
<select class="w-full bg-surface-container-low px-3 py-2 rounded-lg text-body-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-primary">
<option>Dra. Claudia Ortiz (Médica Ocupacional)</option>
<option>Ing. Andrés Valencia (Coord. SG-SST)</option>
<option>Lic. Mariana Vélez (Fisioterapeuta)</option>
</select>
</div>
</div>
<!-- Descripción Administrativa de Recomendaciones -->
<div>
<label class="block font-label-sm text-label-sm text-on-surface font-bold mb-1">Resumen Administrativo de Recomendaciones y Restricciones Laborales</label>
<textarea class="w-full bg-surface-container-low px-3 py-2 rounded-lg text-body-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-primary" placeholder="Ej: No realizar esfuerzos de levantamiento mayores a 10 kg. Evitar posturas prolongadas en cuclillas. Requiere pausas de estiramiento cada 90 minutos..." rows="3"></textarea>
</div>
<!-- Adjunto de Certificado -->
<div>
<label class="block font-label-sm text-label-sm text-on-surface font-bold mb-1">Adjuntar Concepto Médico de Aptitud Laboral (PDF)</label>
<div class="border-2 border-dashed border-outline-variant rounded-lg p-3 text-center cursor-pointer hover:bg-surface-container-low transition-colors">
<span class="material-symbols-outlined text-primary text-[28px]">cloud_upload</span>
<p class="font-label-sm text-label-sm text-on-surface">Haga clic o arrastre el archivo de concepto de aptitud</p>
<span class="text-[11px] text-on-surface-variant">Archivos PDF hasta 10MB</span>
</div>
</div>
</div>
<!-- Modal Footer -->
<div class="p-md bg-surface-container-low flex items-center justify-end gap-sm">
<button class="px-4 py-2 rounded-lg bg-surface-container hover:bg-surface text-on-surface font-label-md text-label-md transition-colors" onclick="document.getElementById('modal-apertura').classList.add('hidden')" type="button">
          Cancelar
        </button>
<button class="px-5 py-2 rounded-lg bg-primary text-on-primary hover:bg-primary-container font-label-md text-label-md transition-colors shadow-md" onclick="document.getElementById('modal-apertura').classList.add('hidden')" type="button">
          Crear Folio y Notificar
        </button>
</div>
</div>
</div>
</div></main></div></body></html>

<!DOCTYPE html>

<html lang="es"><head><meta charset="utf-8"/><meta content="width=device-width, initial-scale=1.0" name="viewport"/><link href="https://fonts.googleapis.com" rel="preconnect"/><link crossorigin="" href="https://fonts.gstatic.com" rel="preconnect"/><link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&amp;display=swap" rel="stylesheet"/><link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" rel="stylesheet"/>
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet"/><style>@layer base{html,body{margin:0;padding:0;}body{overscroll-behavior:none;}main>:first-child{margin-top:0!important;}main>:last-child{margin-bottom:0!important;}}::-webkit-scrollbar{display:none;}</style><script src="https://cdn.tailwindcss.com"></script><script id="tailwind-config">tailwind.config = {"darkMode":"class","theme":{"extend":{"colors":{"on-tertiary-container":"#adb0b2","on-error-container":"#93000a","surface-tint":"#4b57aa","tertiary-container":"#404345","inverse-on-surface":"#eaf1ff","on-primary-fixed":"#000d60","surface-variant":"#d5e3fc","on-secondary-fixed-variant":"#2f2ebe","surface-container-high":"#dce9ff","inverse-surface":"#233144","on-primary-fixed-variant":"#333f91","on-primary":"#ffffff","surface-container-lowest":"#ffffff","surface-container-low":"#eff4ff","surface":"#f8f9ff","on-tertiary-fixed-variant":"#444749","inverse-primary":"#bcc3ff","error":"#ba1a1a","tertiary":"#2a2d2f","on-secondary":"#ffffff","secondary-fixed-dim":"#c0c1ff","outline-variant":"#c6c5d3","secondary":"#4648d4","on-error":"#ffffff","outline":"#767682","on-secondary-fixed":"#07006c","error-container":"#ffdad6","surface-dim":"#ccdbf3","surface-container-highest":"#d5e3fc","surface-container":"#e6eeff","on-tertiary-fixed":"#191c1e","tertiary-fixed":"#e0e3e5","on-background":"#0d1c2e","primary-container":"#2e3a8c","secondary-fixed":"#e1e0ff","primary":"#142175","primary-fixed":"#dfe0ff","on-primary-container":"#9ea9ff","on-surface-variant":"#454651","tertiary-fixed-dim":"#c4c7c9","surface-bright":"#f8f9ff","on-tertiary":"#ffffff","secondary-container":"#6063ee","background":"#f8f9ff","primary-fixed-dim":"#bcc3ff","on-secondary-container":"#fffbff","on-surface":"#0d1c2e"},"borderRadius":{"DEFAULT":"0.25rem","lg":"0.5rem","xl":"0.75rem","full":"9999px"},"spacing":{"xl":"80px","container-max":"1280px","xs":"4px","base":"8px","gutter":"24px","md":"24px","lg":"48px","sm":"12px"},"fontFamily":{"display-lg":["Inter"],"body-sm":["Inter"],"headline-lg":["Inter"],"headline-md":["Inter"],"body-md":["Inter"],"body-lg":["Inter"],"label-md":["Inter"],"headline-lg-mobile":["Inter"],"label-sm":["Inter"]},"fontSize":{"display-lg":["48px",{"lineHeight":"56px","letterSpacing":"-0.02em","fontWeight":"700"}],"body-sm":["14px",{"lineHeight":"20px","fontWeight":"400"}],"headline-lg":["32px",{"lineHeight":"40px","letterSpacing":"-0.01em","fontWeight":"600"}],"headline-md":["24px",{"lineHeight":"32px","fontWeight":"600"}],"body-md":["16px",{"lineHeight":"24px","fontWeight":"400"}],"body-lg":["18px",{"lineHeight":"28px","fontWeight":"400"}],"label-md":["14px",{"lineHeight":"16px","letterSpacing":"0.01em","fontWeight":"500"}],"headline-lg-mobile":["24px",{"lineHeight":"32px","fontWeight":"600"}],"label-sm":["12px",{"lineHeight":"14px","fontWeight":"600"}]}}}};</script></head><body class="bg-background font-body-md text-on-surface antialiased"><aside class="fixed left-0 top-0 h-full w-72 bg-surface-container-low z-50 flex flex-col shadow-[0_1px_8px_rgba(0,0,0,0.04)]"><div class="h-16 px-md flex items-center gap-sm bg-surface-container-low"><div class="w-9 h-9 rounded-lg bg-primary flex items-center justify-center text-on-primary font-headline-md text-headline-md">M</div><div class="flex flex-col"><span class="font-label-md text-label-md text-primary font-bold leading-tight">Grupo Manzanares</span><span class="font-label-sm text-label-sm text-on-surface-variant">SG-SST Operativo</span></div></div><div class="flex-1 overflow-y-auto px-sm py-base space-y-md"><nav class="space-y-base" data-active-classes="bg-primary text-on-primary rounded-lg font-label-md"><div><div class="px-sm pb-xs font-label-sm text-label-sm uppercase tracking-wider text-on-surface-variant opacity-75">Gestión Operativa</div><div class="space-y-1"><a class="flex items-center gap-sm px-sm py-2 rounded-lg text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-colors font-body-sm text-body-sm" data-path="dashboard" href="#"><span class="material-symbols-outlined text-[20px]">home</span><span>Inicio / Dashboard</span></a><a aria-current="page" class="flex items-center justify-between px-sm py-2 transition-colors bg-primary text-on-primary rounded-lg font-label-md" data-path="trabajadores" href="#"><div class="flex items-center gap-sm"><span class="material-symbols-outlined text-[20px]">engineering</span><span>Trabajadores</span></div><span class="bg-secondary-fixed text-on-secondary-fixed font-label-sm text-[11px] px-2 py-0.5 rounded-full">342</span></a><a class="flex items-center gap-sm px-sm py-2 rounded-lg text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-colors font-body-sm text-body-sm" data-path="examenes-medicos" href="#"><span class="material-symbols-outlined text-[20px]">stethoscope</span><span>Exámenes Médicos</span></a><a class="flex items-center gap-sm px-sm py-2 rounded-lg text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-colors font-body-sm text-body-sm" data-path="casos-de-salud" href="#"><span class="material-symbols-outlined text-[20px]">local_hospital</span><span>Casos de Salud</span></a><a class="flex items-center gap-sm px-sm py-2 rounded-lg text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-colors font-body-sm text-body-sm" data-path="incapacidades-y-reintegros" href="#"><span class="material-symbols-outlined text-[20px]">event_busy</span><span>Incapacidades y Reintegros</span></a></div></div><div><div class="px-sm pb-xs font-label-sm text-label-sm uppercase tracking-wider text-on-surface-variant opacity-75">Riesgos Críticos &amp; Viales</div><div class="space-y-1"><a class="flex items-center gap-sm px-sm py-2 rounded-lg text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-colors font-body-sm text-body-sm" data-path="trabajo-en-alturas" href="#"><span class="material-symbols-outlined text-[20px]">stairs</span><span>Trabajo en Alturas</span></a><a class="flex items-center gap-sm px-sm py-2 rounded-lg text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-colors font-body-sm text-body-sm" data-path="tractoristas-operadores" href="#"><span class="material-symbols-outlined text-[20px]">agriculture</span><span>Tractoristas / Operadores</span></a><a class="flex items-center gap-sm px-sm py-2 rounded-lg text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-colors font-body-sm text-body-sm" data-path="pesv-seguridad-vial" href="#"><span class="material-symbols-outlined text-[20px]">directions_car</span><span>PESV (Seguridad Vial)</span></a><a class="flex items-center gap-sm px-sm py-2 rounded-lg text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-colors font-body-sm text-body-sm" data-path="epp" href="#"><span class="material-symbols-outlined text-[20px]">arrow_left</span><span>EPP</span></a></div></div><div><div class="px-sm pb-xs font-label-sm text-label-sm uppercase tracking-wider text-on-surface-variant opacity-75">Inspección &amp; Eventos</div><div class="space-y-1"><a class="flex items-center gap-sm px-sm py-2 rounded-lg text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-colors font-body-sm text-body-sm" data-path="inspecciones" href="#"><span class="material-symbols-outlined text-[20px]">search_check</span><span>Inspecciones</span></a><a class="flex items-center justify-between px-sm py-2 rounded-lg text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-colors font-body-sm text-body-sm" data-path="accidentes-e-incidentes" href="#"><div class="flex items-center gap-sm"><span class="material-symbols-outlined text-[20px]">e911_emergency</span><span>Accidentes e Incidentes</span></div><span class="bg-error-container text-on-error-container font-label-sm text-[11px] px-1.5 py-0.5 rounded font-bold">2</span></a><a class="flex items-center gap-sm px-sm py-2 rounded-lg text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-colors font-body-sm text-body-sm" data-path="investigaciones" href="#"><span class="material-symbols-outlined text-[20px]">assignment</span><span>Investigaciones</span></a><a class="flex items-center gap-sm px-sm py-2 rounded-lg text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-colors font-body-sm text-body-sm" data-path="acciones-correctivas" href="#"><span class="material-symbols-outlined text-[20px]">build</span><span>Acciones Correctivas</span></a></div></div><div><div class="px-sm pb-xs font-label-sm text-label-sm uppercase tracking-wider text-on-surface-variant opacity-75">Comités &amp; Cultura</div><div class="space-y-1"><a class="flex items-center gap-sm px-sm py-2 rounded-lg text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-colors font-body-sm text-body-sm" data-path="capacitaciones" href="#"><span class="material-symbols-outlined text-[20px]">school</span><span>Capacitaciones</span></a><a class="flex items-center gap-sm px-sm py-2 rounded-lg text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-colors font-body-sm text-body-sm" data-path="documentos-sg-sst" href="#"><span class="material-symbols-outlined text-[20px]">description</span><span>Documentos SG-SST</span></a><a class="flex items-center gap-sm px-sm py-2 rounded-lg text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-colors font-body-sm text-body-sm" data-path="copasst" href="#"><span class="material-symbols-outlined text-[20px]">groups</span><span>COPASST</span></a><a class="flex items-center gap-sm px-sm py-2 rounded-lg text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-colors font-body-sm text-body-sm" data-path="ccl" href="#"><span class="material-symbols-outlined text-[20px]">handshake</span><span>CCL</span></a><a class="flex items-center gap-sm px-sm py-2 rounded-lg text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-colors font-body-sm text-body-sm" data-path="emergencias" href="#"><span class="material-symbols-outlined text-[20px]">fire_extinguisher</span><span>Emergencias</span></a><a class="flex items-center gap-sm px-sm py-2 rounded-lg text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-colors font-body-sm text-body-sm" data-path="quimicos" href="#"><span class="material-symbols-outlined text-[20px]">science</span><span>Químicos</span></a></div></div><div><div class="px-sm pb-xs font-label-sm text-label-sm uppercase tracking-wider text-on-surface-variant opacity-75">Estrategia &amp; Control</div><div class="space-y-1"><a class="flex items-center gap-sm px-sm py-2 rounded-lg text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-colors font-body-sm text-body-sm" data-path="analisis-sst" href="#"><span class="material-symbols-outlined text-[20px]">insights</span><span>Análisis SST</span></a><a class="flex items-center gap-sm px-sm py-2 rounded-lg text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-colors font-body-sm text-body-sm" data-path="configuracion" href="#"><span class="material-symbols-outlined text-[20px]">settings</span><span>Configuración</span></a></div></div></nav></div><div class="p-sm bg-surface-container m-sm rounded-lg flex items-center justify-between"><div class="flex items-center gap-2"><span class="w-2.5 h-2.5 rounded-full bg-secondary"></span><span class="font-label-sm text-label-sm text-on-surface">Riesgo Operativo V2</span></div><span class="font-label-sm text-label-sm text-primary font-bold">98.4%</span></div></aside><div class="pl-72"><header class="fixed top-0 left-72 right-0 h-16 bg-surface/90 backdrop-blur-xl shadow-[0_1px_8px_rgba(0,0,0,0.04)] z-40 px-md flex items-center justify-between"><div class="flex items-center gap-sm"><div class="hidden xl:flex items-center gap-2"><span class="px-2 py-1 rounded bg-surface-container text-on-surface-variant font-label-sm text-[11px] font-medium">Dec. 1072/2015</span><span class="px-2 py-1 rounded bg-surface-container text-on-surface-variant font-label-sm text-[11px] font-medium">Res. 0312</span><span class="px-2 py-1 rounded bg-surface-container text-on-surface-variant font-label-sm text-[11px] font-medium">Res. 4272 Alturas</span></div><div class="flex items-center gap-2 px-2.5 py-1 rounded-full bg-surface-container-low text-on-surface font-label-sm text-[12px]"><span class="w-2 h-2 rounded-full bg-secondary animate-pulse"></span><span>En línea / Sincronizado</span></div></div><div class="flex items-center gap-md"><button class="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-primary-container text-on-primary-container hover:bg-primary hover:text-on-primary transition-colors font-label-md text-label-md" type="button"><span class="material-symbols-outlined text-[18px]">notification_important</span><span>Reporte Rápido / Notificación</span></button><div class="h-6 w-px bg-outline-variant"></div><div class="flex items-center gap-3"><div class="text-right hidden md:block"><div class="font-label-md text-label-md text-on-surface leading-tight">Ing. Andrés Valencia</div><div class="font-label-sm text-label-sm text-on-surface-variant">Coordinador SG-SST</div></div><div class="w-8 h-8 rounded-full bg-primary flex items-center justify-center"><span class="material-symbols-outlined text-on-primary text-[18px]">person</span></div></div></div></header><main class="w-full pt-16 bg-background min-h-screen px-gutter py-md"><div class="flex flex-col w-full space-y-md">
<!-- Top Context Navigation & Meta Bar -->
<div class="flex flex-col md:flex-row md:items-center justify-between gap-base bg-surface-container-lowest p-base rounded-xl shadow-sm">
<div class="flex items-center flex-wrap gap-2 text-on-surface-variant">
<div class="flex items-center gap-1.5 font-label-sm text-label-sm">
<span class="material-symbols-outlined text-[18px] text-primary">health_and_safety</span>
<span class="hover:text-primary cursor-pointer transition-colors">Gestión de Personal &amp; Salud</span>
</div>
<span class="material-symbols-outlined text-[16px] text-outline">chevron_right</span>
<span class="font-label-sm text-label-sm text-primary font-bold">Restricciones y Recomendaciones</span>
<span class="hidden sm:inline-block w-1 h-1 rounded-full bg-outline-variant"></span>
<div class="hidden lg:flex items-center gap-1 text-[11px] font-label-sm bg-surface-container px-2 py-0.5 rounded-full text-on-surface-variant">
<span class="material-symbols-outlined text-[14px] text-secondary">gavel</span>
<span>Marco: Res. 2346/2007 • Dec. 1072/2015 • D.L. 1295/1994</span>
</div>
</div>
<!-- Quick Actions -->
<div class="flex items-center flex-wrap gap-2">
<button class="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary text-on-primary hover:bg-primary-container transition-all font-label-md text-label-md shadow-sm" onclick="document.getElementById('drawer-registro').classList.remove('translate-x-full')" type="button">
<span class="material-symbols-outlined text-[18px]">add_circle</span>
<span>+ Registrar Restricción / Recomendación</span>
</button>
<button class="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface transition-colors font-label-md text-label-md" type="button">
<span class="material-symbols-outlined text-[18px] text-secondary">table_view</span>
<span>Exportar (.XLSX)</span>
</button>
<button class="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface-container-low hover:bg-surface-container text-primary font-label-md text-label-md transition-colors" onclick="alert('Notificaciones PUSH y correos de campo despachados a 12 Líderes de Cuadrilla.')" type="button">
<span class="material-symbols-outlined text-[18px]">campaign</span>
<span>Notificar Cuadrillas</span>
</button>
</div>
</div>
<!-- Section Hero Banner & Institutional Header -->
<div class="bg-surface-container-lowest p-md rounded-xl shadow-sm relative overflow-hidden flex flex-col md:flex-row items-start justify-between gap-base">
<div class="space-y-1.5 max-w-3xl z-10">
<div class="flex items-center gap-2">
<span class="px-2 py-0.5 rounded bg-primary-container text-on-primary-container font-label-sm text-label-sm font-semibold uppercase tracking-wider">Módulo 06 • SG-SST</span>
<span class="text-on-surface-variant font-label-sm text-label-sm flex items-center gap-1">
<span class="w-2 h-2 rounded-full bg-secondary"></span> Sincronizado con Fichas de Campo Agroindustrial
        </span>
</div>
<h1 class="font-headline-lg text-headline-lg text-primary tracking-tight">6. Base Maestra de Restricciones y Recomendaciones</h1>
<p class="font-body-md text-body-md text-on-surface-variant leading-relaxed">
        Administración, seguimiento e implementación de adaptaciones ergonómicas, limitaciones físicas y recomendaciones emitidas por medicina laboral para salvaguardar la integridad de operarios, tractoristas y recolectores en Grupo Manzanares S.A.S.
      </p>
</div>
<div class="flex items-center gap-3 self-end md:self-center z-10 bg-surface-container-low p-2.5 rounded-xl">
<div class="text-right">
<div class="font-label-sm text-label-sm text-on-surface-variant">Conformidad Operativa</div>
<div class="font-headline-md text-headline-md text-primary font-bold leading-tight">92.8%</div>
</div>
<div class="w-12 h-12 flex items-center justify-center rounded-lg bg-primary text-on-primary">
<span class="material-symbols-outlined text-[26px]">verified_user</span>
</div>
</div>
<!-- Ambient decorative mark -->
<div class="absolute right-0 top-0 bottom-0 w-96 bg-gradient-to-l from-primary/5 via-transparent to-transparent pointer-events-none"></div>
</div>
<!-- KPI Metric Cards (Status Traffic Lights) -->
<div class="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-sm">
<!-- Total Registros -->
<div class="bg-surface-container-lowest p-sm rounded-xl shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
<div class="flex items-center justify-between text-on-surface-variant">
<span class="font-label-sm text-label-sm uppercase tracking-wide">Total Activos</span>
<span class="material-symbols-outlined text-[20px] text-primary">clinical_notes</span>
</div>
<div class="mt-2">
<div class="font-headline-md text-headline-md text-on-surface font-bold">28</div>
<div class="font-label-sm text-label-sm text-on-surface-variant flex items-center gap-1 mt-1">
<span class="w-1.5 h-1.5 rounded-full bg-primary"></span>
<span>Casos en monitoreo</span>
</div>
</div>
</div>
<!-- Vigentes -->
<div class="bg-surface-container-lowest p-sm rounded-xl shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
<div class="flex items-center justify-between text-on-surface-variant">
<span class="font-label-sm text-label-sm uppercase tracking-wide">Vigentes</span>
<span class="w-2.5 h-2.5 rounded-full bg-secondary"></span>
</div>
<div class="mt-2">
<div class="font-headline-md text-headline-md text-primary font-bold">15</div>
<div class="font-label-sm text-label-sm text-on-surface-variant line-clamp-1 mt-1">
          Medidas verificadas
        </div>
</div>
</div>
<!-- Próximas a vencer -->
<div class="bg-surface-container-lowest p-sm rounded-xl shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
<div class="flex items-center justify-between text-on-surface-variant">
<span class="font-label-sm text-label-sm uppercase tracking-wide">Por Vencer</span>
<span class="w-2.5 h-2.5 rounded-full bg-tertiary-container"></span>
</div>
<div class="mt-2">
<div class="font-headline-md text-headline-md text-on-surface font-bold">6</div>
<div class="font-label-sm text-label-sm text-on-surface-variant line-clamp-1 mt-1">
          En revaloración IPS (1-30d)
        </div>
</div>
</div>
<!-- Vencidas -->
<div class="bg-surface-container-lowest p-sm rounded-xl shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
<div class="flex items-center justify-between text-on-surface-variant">
<span class="font-label-sm text-label-sm uppercase tracking-wide">Vencidas</span>
<span class="w-2.5 h-2.5 rounded-full bg-error"></span>
</div>
<div class="mt-2">
<div class="font-headline-md text-headline-md text-error font-bold">3</div>
<div class="font-label-sm text-label-sm text-on-surface-variant line-clamp-1 mt-1">
          Cita médica urgente
        </div>
</div>
</div>
<!-- Pendiente Implementación -->
<div class="bg-surface-container-lowest p-sm rounded-xl shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
<div class="flex items-center justify-between text-on-surface-variant">
<span class="font-label-sm text-label-sm uppercase tracking-wide">Pendientes</span>
<span class="material-symbols-outlined text-[20px] text-secondary">pending_actions</span>
</div>
<div class="mt-2">
<div class="font-headline-md text-headline-md text-secondary font-bold">4</div>
<div class="font-label-sm text-label-sm text-on-surface-variant line-clamp-1 mt-1">
          En adaptación de puesto
        </div>
</div>
</div>
<!-- Cerradas / Resueltas -->
<div class="bg-surface-container-lowest p-sm rounded-xl shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
<div class="flex items-center justify-between text-on-surface-variant">
<span class="font-label-sm text-label-sm uppercase tracking-wide">Resueltas '24</span>
<span class="material-symbols-outlined text-[20px] text-outline">task_alt</span>
</div>
<div class="mt-2">
<div class="font-headline-md text-headline-md text-on-surface-variant font-bold">39</div>
<div class="font-label-sm text-label-sm text-on-surface-variant line-clamp-1 mt-1">
          Alta / Levantadas
        </div>
</div>
</div>
</div>
<!-- Filters & Multidimensional Search Bar -->
<div class="bg-surface-container-lowest p-base rounded-xl shadow-sm space-y-base">
<div class="grid grid-cols-1 md:grid-cols-12 gap-base items-center">
<!-- Search input -->
<div class="md:col-span-4 relative">
<span class="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-[20px]">search</span>
<input class="w-full bg-surface-container-low text-on-surface placeholder:text-on-surface-variant/60 font-body-sm text-body-sm pl-10 pr-3 py-2 rounded-lg focus:outline-none focus:bg-surface-container transition-all" id="filter-search" placeholder="Cédula, nombre, cargo o N° folio (ej: RST-2024)..." type="text"/>
</div>
<!-- Type Filter -->
<div class="md:col-span-2">
<select class="w-full bg-surface-container-low text-on-surface font-label-md text-label-md px-3 py-2 rounded-lg focus:outline-none focus:bg-surface-container transition-all cursor-pointer">
<option value="">Tipo: Todos</option>
<option value="restriccion">Restricción (Limitación Funcional)</option>
<option value="recomendacion">Recomendación (Preventiva / Higiene)</option>
</select>
</div>
<!-- Status Filter -->
<div class="md:col-span-2">
<select class="w-full bg-surface-container-low text-on-surface font-label-md text-label-md px-3 py-2 rounded-lg focus:outline-none focus:bg-surface-container transition-all cursor-pointer">
<option value="">Estado: Todos</option>
<option value="vigente">🟢 Vigente</option>
<option value="proxima">🟠 Próxima a vencer</option>
<option value="vencida">🔴 Vencida</option>
<option value="pendiente">⚠️ Pendiente Implementación</option>
<option value="cerrada">⚪ Cerrada</option>
</select>
</div>
<!-- Farm / Sede Filter -->
<div class="md:col-span-2">
<select class="w-full bg-surface-container-low text-on-surface font-label-md text-label-md px-3 py-2 rounded-lg focus:outline-none focus:bg-surface-container transition-all cursor-pointer">
<option value="">Sede: Todas</option>
<option value="esperanza">Finca La Esperanza</option>
<option value="paraiso">Finca El Paraíso</option>
<option value="sanjose">Finca San José</option>
<option value="bellavista">Finca Bella Vista</option>
<option value="planta">Planta de Beneficio Central</option>
</select>
</div>
<!-- Responsible Filter -->
<div class="md:col-span-2">
<select class="w-full bg-surface-container-low text-on-surface font-label-md text-label-md px-3 py-2 rounded-lg focus:outline-none focus:bg-surface-container transition-all cursor-pointer">
<option value="">Responsable: Todos</option>
<option value="cuadrilla">Líderes de Cuadrilla</option>
<option value="mantenimiento">Mantenimiento</option>
<option value="sst">Coordinación SST</option>
<option value="fisioterapia">Fisioterapia Laboral</option>
<option value="rrhh">Talento Humano</option>
</select>
</div>
</div>
<!-- Active filter chips -->
<div class="flex items-center justify-between flex-wrap gap-2 pt-1 font-label-sm text-label-sm text-on-surface-variant">
<div class="flex items-center gap-2 flex-wrap">
<span class="text-[11px] uppercase tracking-wider text-outline font-semibold">Filtros aplicados:</span>
<span class="inline-flex items-center gap-1 bg-surface-container px-2 py-0.5 rounded-md text-primary font-medium">
          Estado: En seguimiento activo
          <span class="material-symbols-outlined text-[14px] cursor-pointer hover:text-error">close</span>
</span>
<span class="inline-flex items-center gap-1 bg-surface-container px-2 py-0.5 rounded-md text-primary font-medium">
          Cosecha &amp; Postcosecha
          <span class="material-symbols-outlined text-[14px] cursor-pointer hover:text-error">close</span>
</span>
<button class="text-secondary hover:underline font-label-sm text-label-sm">Restablecer filtros</button>
</div>
<div class="font-body-sm text-body-sm text-on-surface-variant">
        Mostrando <span class="font-bold text-on-surface">5</span> de <span class="font-bold text-on-surface">28</span> registros prioritarios
      </div>
</div>
</div>
<!-- Operational Master Control Matrix (High-Density Table) -->
<div class="bg-surface-container-lowest rounded-xl shadow-sm overflow-hidden">
<div class="overflow-x-auto">
<table class="w-full text-left font-body-sm text-body-sm">
<thead class="bg-surface-container-low text-on-surface-variant font-label-sm text-label-sm uppercase tracking-wider">
<tr>
<th class="py-3 px-sm">Trabajador &amp; Finca</th>
<th class="py-3 px-sm">Tipo &amp; Folio</th>
<th class="py-3 px-sm">Cronograma Clave</th>
<th class="py-3 px-sm min-w-[220px]">Detalle de Restricción</th>
<th class="py-3 px-sm">Responsable &amp; Área</th>
<th class="py-3 px-sm min-w-[200px]">Medida Implementada</th>
<th class="py-3 px-sm text-center">Estado</th>
<th class="py-3 px-sm">Próx. Seguimiento</th>
<th class="py-3 px-sm text-center">Evidencia &amp; Acciones</th>
</tr>
</thead>
<tbody class="divide-y-0">
<!-- Row 1: Vigente Ergonómica -->
<tr class="hover:bg-surface-container-low/70 transition-colors">
<td class="py-3 px-sm align-top">
<div class="flex items-start gap-2">
<div class="w-8 h-8 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center font-bold text-[12px] flex-shrink-0 mt-0.5">
                  CR
                </div>
<div class="min-w-0">
<div class="font-label-md text-label-md text-primary font-bold truncate">Carlos Ramos Morales</div>
<div class="text-[12px] text-on-surface-variant">CC: 1.054.892.311</div>
<div class="text-[11px] font-semibold text-secondary">Recolector Fruta • Finca La Esperanza</div>
</div>
</div>
</td>
<td class="py-3 px-sm align-top">
<span class="inline-block px-2 py-0.5 rounded-full bg-secondary-fixed text-on-secondary-fixed font-label-sm text-[11px] font-bold">
                Restricción Ergonómica
              </span>
<div class="font-mono text-[11px] text-on-surface-variant mt-1">#RST-2024-089</div>
</td>
<td class="py-3 px-sm align-top space-y-0.5 text-[12px]">
<div><span class="text-outline">Emisión:</span> 12/08/2024</div>
<div><span class="text-outline">Inicio:</span> 15/08/2024</div>
<div class="flex items-center gap-1 font-semibold text-secondary">
<span>Vence: 15/12/2024</span>
</div>
<span class="inline-block px-1.5 py-0.2 text-[10px] rounded bg-secondary-fixed/70 text-on-secondary-fixed">
                Faltan 48 días
              </span>
</td>
<td class="py-3 px-sm align-top">
<p class="font-body-sm text-body-sm text-on-surface leading-snug line-clamp-3">
                No levantar cargas superiores a 10 kg. Prohibida flexión lumbar repetitiva &gt; 30°. Realizar pausas activas osteomusculares de 5 minutos cada 2 horas.
              </p>
<span class="text-[11px] text-on-surface-variant italic mt-1 block">Diagnóstico: Lumbalgia Mecánica Crónica (M54.5)</span>
</td>
<td class="py-3 px-sm align-top">
<div class="font-label-md text-label-md text-on-surface font-semibold">Sup. Ramón Vélez</div>
<div class="text-[11px] text-on-surface-variant">Líder Cuadrilla Cosecha II</div>
<span class="inline-flex items-center gap-1 text-[10px] text-primary bg-primary-fixed/50 px-1.5 py-0.5 rounded mt-1">
<span class="material-symbols-outlined text-[12px]">group</span> Cuadrilla Operativa
              </span>
</td>
<td class="py-3 px-sm align-top">
<div class="text-on-surface font-body-sm text-body-sm leading-tight">
                Reubicación a labores de mesa de clasificación y pesaje. Se dotó con faja de soporte ergonómico y canastilla rodante baja.
              </div>
<div class="text-[11px] text-secondary font-semibold mt-1">
                Implementado: 18/08/2024
              </div>
</td>
<td class="py-3 px-sm align-top text-center">
<span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-secondary text-on-secondary font-label-sm text-[11px] font-semibold">
<span class="w-1.5 h-1.5 rounded-full bg-white animate-pulse"></span>
                Vigente
              </span>
</td>
<td class="py-3 px-sm align-top">
<div class="font-label-md text-label-md text-on-surface font-semibold">05 Nov 2024</div>
<div class="text-[11px] text-secondary font-medium">En 12 días</div>
<div class="text-[10px] text-outline">Fisioterapia en Finca</div>
</td>
<td class="py-3 px-sm align-top text-center space-y-1">
<div class="flex items-center justify-center gap-1">
<button class="p-1.5 rounded-lg bg-surface-container hover:bg-surface-container-high text-primary transition-colors" title="Ver Acta de Puesto Firmada (PDF)" type="button">
<span class="material-symbols-outlined text-[18px]">picture_as_pdf</span>
</button>
<button class="p-1.5 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface-variant hover:text-primary transition-colors" onclick="openDetails('Carlos Ramos Morales', '#RST-2024-089')" title="Registrar Inspección o Evolución" type="button">
<span class="material-symbols-outlined text-[18px]">edit_note</span>
</button>
</div>
<span class="text-[10px] text-on-surface-variant block">Acta #441-24</span>
</td>
</tr>
<!-- Row 2: Pendiente Implementación / Alturas -->
<tr class="bg-surface-container-low/40 hover:bg-surface-container-low transition-colors">
<td class="py-3 px-sm align-top">
<div class="flex items-start gap-2">
<div class="w-8 h-8 rounded-full bg-secondary text-on-secondary flex items-center justify-center font-bold text-[12px] flex-shrink-0 mt-0.5">
                  JM
                </div>
<div class="min-w-0">
<div class="font-label-md text-label-md text-primary font-bold truncate">José Manuel Quintero</div>
<div class="text-[12px] text-on-surface-variant">CC: 71.340.119</div>
<div class="text-[11px] font-semibold text-secondary">Podador Especialista • El Paraíso</div>
</div>
</div>
</td>
<td class="py-3 px-sm align-top">
<span class="inline-block px-2 py-0.5 rounded-full bg-error-container text-on-error-container font-label-sm text-[11px] font-bold">
                Restricción Alturas
              </span>
<div class="font-mono text-[11px] text-on-surface-variant mt-1">#RST-2024-104</div>
</td>
<td class="py-3 px-sm align-top space-y-0.5 text-[12px]">
<div><span class="text-outline">Emisión:</span> 18/10/2024</div>
<div><span class="text-outline">Inicio:</span> 20/10/2024</div>
<div class="flex items-center gap-1 font-semibold text-primary">
<span>Vence: 20/01/2025</span>
</div>
<span class="inline-block px-1.5 py-0.2 text-[10px] rounded bg-surface-container text-on-surface-variant">
                90 días restantes
              </span>
</td>
<td class="py-3 px-sm align-top">
<p class="font-body-sm text-body-sm text-on-surface leading-snug line-clamp-3 font-medium">
                PROHIBICIÓN TOTAL de trabajo en alturas (&gt; 1.50 m) y operación de escaleras telescópicas de cosecha. No maniobrar herramientas oscilantes de poda en ramas superiores.
              </p>
<span class="text-[11px] text-on-surface-variant italic mt-1 block">Diagnóstico: Episodio Vertiginoso Periférico (H81.3)</span>
</td>
<td class="py-3 px-sm align-top">
<div class="font-label-md text-label-md text-on-surface font-semibold">Ing. Jairo Soto</div>
<div class="text-[11px] text-on-surface-variant">Jefe de Operaciones Agrícolas</div>
<span class="inline-flex items-center gap-1 text-[10px] text-secondary bg-secondary-fixed/50 px-1.5 py-0.5 rounded mt-1">
<span class="material-symbols-outlined text-[12px]">engineering</span> Mantenimiento &amp; Poda
              </span>
</td>
<td class="py-3 px-sm align-top">
<div class="text-error font-body-sm text-body-sm leading-tight font-medium">
                ⚠️ Pendiente entrega de tijera hidráulica de piso y reasignación definitiva a cuadrilla de desyerbe rasante.
              </div>
<div class="text-[11px] text-outline mt-1">
                Plazo máx: 26/10/2024
              </div>
</td>
<td class="py-3 px-sm align-top text-center">
<span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-surface-container-high text-on-surface font-label-sm text-[11px] font-bold">
<span class="material-symbols-outlined text-[13px] text-secondary">hourglass_top</span>
                Pendiente
              </span>
</td>
<td class="py-3 px-sm align-top">
<div class="font-label-md text-label-md text-error font-bold">25 Oct 2024</div>
<div class="text-[11px] text-error font-semibold">Mañana (Urgente)</div>
<div class="text-[10px] text-outline">Verif. Puesto SST</div>
</td>
<td class="py-3 px-sm align-top text-center space-y-1">
<div class="flex items-center justify-center gap-1">
<button class="p-1.5 rounded-lg bg-error-container text-on-error-container" title="Falta Acta de Puesto" type="button">
<span class="material-symbols-outlined text-[18px]">upload_file</span>
</button>
<button class="p-1.5 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface-variant hover:text-primary transition-colors" onclick="openDetails('José Manuel Quintero', '#RST-2024-104')" title="Gestionar Reubicación" type="button">
<span class="material-symbols-outlined text-[18px]">rule</span>
</button>
</div>
<span class="text-[10px] text-error font-semibold block">Acta Pendiente</span>
</td>
</tr>
<!-- Row 3: Próxima a Vencer / Tractorista Vibración -->
<tr class="hover:bg-surface-container-low/70 transition-colors">
<td class="py-3 px-sm align-top">
<div class="flex items-start gap-2">
<div class="w-8 h-8 rounded-full bg-tertiary-container text-on-tertiary-container flex items-center justify-center font-bold text-[12px] flex-shrink-0 mt-0.5">
                  HE
                </div>
<div class="min-w-0">
<div class="font-label-md text-label-md text-primary font-bold truncate">Hernando Echeverry</div>
<div class="text-[12px] text-on-surface-variant">CC: 16.290.443</div>
<div class="text-[11px] font-semibold text-secondary">Tractorista Operador • San José</div>
</div>
</div>
</td>
<td class="py-3 px-sm align-top">
<span class="inline-block px-2 py-0.5 rounded-full bg-surface-container-highest text-on-surface font-label-sm text-[11px] font-bold">
                Restr. Vibración de Cuerpo
              </span>
<div class="font-mono text-[11px] text-on-surface-variant mt-1">#RST-2024-055</div>
</td>
<td class="py-3 px-sm align-top space-y-0.5 text-[12px]">
<div><span class="text-outline">Emisión:</span> 30/05/2024</div>
<div><span class="text-outline">Inicio:</span> 01/06/2024</div>
<div class="flex items-center gap-1 font-bold text-on-surface">
<span>Vence: 31/10/2024</span>
</div>
<span class="inline-block px-1.5 py-0.2 text-[10px] rounded bg-surface-container-highest text-on-surface font-bold">
                ⚠️ Vence en 7 días
              </span>
</td>
<td class="py-3 px-sm align-top">
<p class="font-body-sm text-body-sm text-on-surface leading-snug line-clamp-3">
                Limitar conducción de maquinaria pesada a máx 4 horas diarias continuas sobre terreno irregular. Requiere asiento neumático con suspensión regulada al peso corporal.
              </p>
<span class="text-[11px] text-on-surface-variant italic mt-1 block">Diagnóstico: Radiculopatía Lumbar L4-L5 (M54.1)</span>
</td>
<td class="py-3 px-sm align-top">
<div class="font-label-md text-label-md text-on-surface font-semibold">Ing. Marcos Restrepo</div>
<div class="text-[11px] text-on-surface-variant">Jefe de Taller y Maquinaria</div>
<span class="inline-flex items-center gap-1 text-[10px] text-primary bg-primary-fixed/50 px-1.5 py-0.5 rounded mt-1">
<span class="material-symbols-outlined text-[12px]">precision_manufacturing</span> Flota de Tractores
              </span>
</td>
<td class="py-3 px-sm align-top">
<div class="text-on-surface font-body-sm text-body-sm leading-tight">
                Instalación de sillín grammer amortiguado en Tractor John Deere #04. Turnos alternados de 3.5 hrs de arado con labores en patio.
              </div>
<div class="text-[11px] text-secondary font-semibold mt-1">
                Implementado: 04/06/2024
              </div>
</td>
<td class="py-3 px-sm align-top text-center">
<span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-surface-container-highest text-on-surface font-label-sm text-[11px] font-bold">
<span class="w-1.5 h-1.5 rounded-full bg-secondary"></span>
                Por Vencer
              </span>
</td>
<td class="py-3 px-sm align-top">
<div class="font-label-md text-label-md text-primary font-bold">29 Oct 2024</div>
<div class="text-[11px] text-secondary font-semibold">Cita IPS Asignada</div>
<div class="text-[10px] text-outline">Revaloración Ocupacional</div>
</td>
<td class="py-3 px-sm align-top text-center space-y-1">
<div class="flex items-center justify-center gap-1">
<button class="p-1.5 rounded-lg bg-surface-container hover:bg-surface-container-high text-primary transition-colors" title="Ver Acta de Puesto Firmada (PDF)" type="button">
<span class="material-symbols-outlined text-[18px]">picture_as_pdf</span>
</button>
<button class="p-1.5 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface-variant hover:text-primary transition-colors" onclick="openDetails('Hernando Echeverry', '#RST-2024-055')" title="Programar Revaloración" type="button">
<span class="material-symbols-outlined text-[18px]">calendar_clock</span>
</button>
</div>
<span class="text-[10px] text-on-surface-variant block">Acta #312-24</span>
</td>
</tr>
<!-- Row 4: Vencida Prioritaria / Químicos -->
<tr class="bg-error-container/20 hover:bg-error-container/30 transition-colors">
<td class="py-3 px-sm align-top">
<div class="flex items-start gap-2">
<div class="w-8 h-8 rounded-full bg-error text-on-error flex items-center justify-center font-bold text-[12px] flex-shrink-0 mt-0.5">
                  MG
                </div>
<div class="min-w-0">
<div class="font-label-md text-label-md text-error font-bold truncate">Marta Lucía Gómez</div>
<div class="text-[12px] text-on-surface-variant">CC: 43.882.012</div>
<div class="text-[11px] font-semibold text-secondary">Fumigadora / Asperjadora • Bella Vista</div>
</div>
</div>
</td>
<td class="py-3 px-sm align-top">
<span class="inline-block px-2 py-0.5 rounded-full bg-error text-on-error font-label-sm text-[11px] font-bold">
                Restricción Química / Resp.
              </span>
<div class="font-mono text-[11px] text-on-surface-variant mt-1">#RST-2024-031</div>
</td>
<td class="py-3 px-sm align-top space-y-0.5 text-[12px]">
<div><span class="text-outline">Emisión:</span> 10/04/2024</div>
<div><span class="text-outline">Inicio:</span> 12/04/2024</div>
<div class="flex items-center gap-1 font-bold text-error">
<span>Venció: 12/10/2024</span>
</div>
<span class="inline-block px-1.5 py-0.2 text-[10px] rounded bg-error text-on-error font-bold">
                Vencida hace 12 días
              </span>
</td>
<td class="py-3 px-sm align-top">
<p class="font-body-sm text-body-sm text-on-surface leading-snug line-clamp-3">
                Restricción absoluta a la exposición directa con plaguicidas de categoría toxicológica I, II y solventes orgánicos. Mantener en áreas abiertas y ventiladas.
              </p>
<span class="text-[11px] text-on-surface-variant italic mt-1 block">Diagnóstico: Dermatitis de Contacto / Reactividad Bronquial (L23.9)</span>
</td>
<td class="py-3 px-sm align-top">
<div class="font-label-md text-label-md text-on-surface font-semibold">Dra. Claudia Hoyos</div>
<div class="text-[11px] text-on-surface-variant">Médica Laboral SG-SST</div>
<span class="inline-flex items-center gap-1 text-[10px] text-error bg-error-container px-1.5 py-0.5 rounded mt-1">
<span class="material-symbols-outlined text-[12px]">medical_services</span> Salud Ocupacional
              </span>
</td>
<td class="py-3 px-sm align-top">
<div class="text-on-surface font-body-sm text-body-sm leading-tight">
                Reubicación temporal a labores de inventario de bodega y despacho de herramientas. Cero contacto con agroquímicos.
              </div>
<div class="text-[11px] text-secondary font-semibold mt-1">
                Implementado: 14/04/2024
              </div>
</td>
<td class="py-3 px-sm align-top text-center">
<span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-error text-on-error font-label-sm text-[11px] font-bold">
<span class="material-symbols-outlined text-[13px]">warning</span>
                Vencida
              </span>
</td>
<td class="py-3 px-sm align-top">
<div class="font-label-md text-label-md text-error font-bold">Inmediato</div>
<div class="text-[11px] text-error font-semibold">Esperando cupo EPS</div>
<div class="text-[10px] text-outline">Revaloración de Egreso</div>
</td>
<td class="py-3 px-sm align-top text-center space-y-1">
<div class="flex items-center justify-center gap-1">
<button class="p-1.5 rounded-lg bg-surface-container hover:bg-surface-container-high text-primary transition-colors" title="Ver Historial Clínico Ocupacional" type="button">
<span class="material-symbols-outlined text-[18px]">history_edu</span>
</button>
<button class="p-1.5 rounded-lg bg-error text-on-error transition-colors" onclick="openDetails('Marta Lucía Gómez', '#RST-2024-031')" title="Reagendar Cita con IPS" type="button">
<span class="material-symbols-outlined text-[18px]">priority_high</span>
</button>
</div>
<span class="text-[10px] text-error font-bold block">Alerta Médica</span>
</td>
</tr>
<!-- Row 5: Recomendación Preventiva / Protección UV -->
<tr class="hover:bg-surface-container-low/70 transition-colors">
<td class="py-3 px-sm align-top">
<div class="flex items-start gap-2">
<div class="w-8 h-8 rounded-full bg-primary-fixed text-on-primary-fixed flex items-center justify-center font-bold text-[12px] flex-shrink-0 mt-0.5">
                  GA
                </div>
<div class="min-w-0">
<div class="font-label-md text-label-md text-primary font-bold truncate">Gabriel Arango Ruiz</div>
<div class="text-[12px] text-on-surface-variant">CC: 98.675.201</div>
<div class="text-[11px] font-semibold text-secondary">Canalero de Riego • Planta Central</div>
</div>
</div>
</td>
<td class="py-3 px-sm align-top">
<span class="inline-block px-2 py-0.5 rounded-full bg-surface-container text-on-surface-variant font-label-sm text-[11px] font-semibold">
                Recomendación Preventiva
              </span>
<div class="font-mono text-[11px] text-on-surface-variant mt-1">#REC-2024-072</div>
</td>
<td class="py-3 px-sm align-top space-y-0.5 text-[12px]">
<div><span class="text-outline">Emisión:</span> 05/09/2024</div>
<div><span class="text-outline">Inicio:</span> 06/09/2024</div>
<div class="flex items-center gap-1 font-semibold text-on-surface">
<span>Vence: 06/09/2025</span>
</div>
<span class="inline-block px-1.5 py-0.2 text-[10px] rounded bg-secondary-fixed/50 text-on-secondary-fixed">
                Vigencia Anual
              </span>
</td>
<td class="py-3 px-sm align-top">
<p class="font-body-sm text-body-sm text-on-surface leading-snug line-clamp-3">
                Uso estricto de protector solar FPS 50+ cada 3 horas, sombrero tipo pescador con cubrenuca y gafas con filtro UV 400. Hidratación programada con suero oral (2L/jornada).
              </p>
<span class="text-[11px] text-on-surface-variant italic mt-1 block">Hallazgo: Pterigión Bilateral Grado I (H11.0)</span>
</td>
<td class="py-3 px-sm align-top">
<div class="font-label-md text-label-md text-on-surface font-semibold">Enf. Beatriz Pineda</div>
<div class="text-[11px] text-on-surface-variant">Enfermería Ocupacional Planta</div>
<span class="inline-flex items-center gap-1 text-[10px] text-secondary bg-secondary-fixed/50 px-1.5 py-0.5 rounded mt-1">
<span class="material-symbols-outlined text-[12px]">local_hospital</span> Salud Preventiva
              </span>
</td>
<td class="py-3 px-sm align-top">
<div class="text-on-surface font-body-sm text-body-sm leading-tight">
                Dotación de kit dermoprotector especial entregado y verificado en planilla de entrega EPP. Horario de campo ajustado para evitar pico 11:30 am - 1:30 pm.
              </div>
<div class="text-[11px] text-secondary font-semibold mt-1">
                Implementado: 08/09/2024
              </div>
</td>
<td class="py-3 px-sm align-top text-center">
<span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-secondary text-on-secondary font-label-sm text-[11px] font-semibold">
<span class="w-1.5 h-1.5 rounded-full bg-white"></span>
                Vigente
              </span>
</td>
<td class="py-3 px-sm align-top">
<div class="font-label-md text-label-md text-on-surface font-semibold">15 Dic 2024</div>
<div class="text-[11px] text-on-surface-variant">Control Trimestral</div>
<div class="text-[10px] text-outline">Examen Visual</div>
</td>
<td class="py-3 px-sm align-top text-center space-y-1">
<div class="flex items-center justify-center gap-1">
<button class="p-1.5 rounded-lg bg-surface-container hover:bg-surface-container-high text-primary transition-colors" title="Ver Acta de Entrega de Kit" type="button">
<span class="material-symbols-outlined text-[18px]">picture_as_pdf</span>
</button>
<button class="p-1.5 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface-variant hover:text-primary transition-colors" onclick="openDetails('Gabriel Arango Ruiz', '#REC-2024-072')" title="Ver Detalles" type="button">
<span class="material-symbols-outlined text-[18px]">visibility</span>
</button>
</div>
<span class="text-[10px] text-on-surface-variant block">Acta #512-24</span>
</td>
</tr>
</tbody>
</table>
</div>
<!-- Table Pagination and Density Footer -->
<div class="p-base bg-surface-container-low flex flex-col sm:flex-row items-center justify-between gap-base text-on-surface-variant font-label-sm text-label-sm">
<div class="flex items-center gap-3">
<span>Filas por página:</span>
<select class="bg-surface-container-lowest text-on-surface px-2 py-1 rounded text-label-sm focus:outline-none">
<option>5</option>
<option selected="">10</option>
<option>25</option>
<option>50</option>
</select>
<span>Página 1 de 6 (28 registros totales)</span>
</div>
<div class="flex items-center gap-1">
<button class="p-1 rounded bg-surface-container hover:bg-surface-container-high disabled:opacity-40 text-on-surface" disabled="">
<span class="material-symbols-outlined text-[18px]">first_page</span>
</button>
<button class="p-1 rounded bg-surface-container hover:bg-surface-container-high disabled:opacity-40 text-on-surface" disabled="">
<span class="material-symbols-outlined text-[18px]">chevron_left</span>
</button>
<button class="w-7 h-7 rounded bg-primary text-on-primary font-bold text-center flex items-center justify-center">1</button>
<button class="w-7 h-7 rounded bg-surface-container hover:bg-surface-container-high text-on-surface font-medium text-center flex items-center justify-center">2</button>
<button class="w-7 h-7 rounded bg-surface-container hover:bg-surface-container-high text-on-surface font-medium text-center flex items-center justify-center">3</button>
<button class="p-1 rounded bg-surface-container hover:bg-surface-container-high text-on-surface">
<span class="material-symbols-outlined text-[18px]">chevron_right</span>
</button>
<button class="p-1 rounded bg-surface-container hover:bg-surface-container-high text-on-surface">
<span class="material-symbols-outlined text-[18px]">last_page</span>
</button>
</div>
</div>
</div>
<!-- Operational Field Adaptation & Compliance Widgets Section -->
<div class="grid grid-cols-1 lg:grid-cols-12 gap-md">
<!-- Field Protocol Sync Alert -->
<div class="lg:col-span-4 bg-primary text-on-primary p-md rounded-xl shadow-sm flex flex-col justify-between relative overflow-hidden">
<div class="space-y-base z-10">
<div class="flex items-center gap-2">
<span class="p-2 rounded-lg bg-white/10 text-on-primary">
<span class="material-symbols-outlined text-[24px]">sync_alt</span>
</span>
<div>
<h3 class="font-headline-md text-headline-md leading-tight">Sincronización de Campo</h3>
<p class="font-label-sm text-label-sm opacity-80">App Móvil para Capataces y Mayordomos</p>
</div>
</div>
<p class="font-body-sm text-body-sm opacity-90 leading-relaxed">
          Las restricciones activas se transmiten automáticamente a las <strong>Planillas de Asignación Diaria de Labores</strong>. Cuando un capataz intente asignar una labor incompatible (ej: alturas o fumigación a un operario con restricción), el sistema bloqueará la tarea emitiendo una alarma de desacato SG-SST.
        </p>
</div>
<div class="pt-md mt-sm z-10 space-y-2">
<div class="flex items-center justify-between text-xs bg-white/10 px-3 py-2 rounded-lg font-mono">
<span>Último sync: Hoy 06:15 AM</span>
<span class="text-secondary-fixed font-bold">100% Cobertura</span>
</div>
<button class="w-full py-2 bg-surface-container-lowest text-primary hover:bg-surface-container font-label-md text-label-md rounded-lg font-bold transition-colors" type="button">
          Gestionar Permisos &amp; Notificaciones
        </button>
</div>
<!-- Subtle background circles -->
<div class="absolute -right-8 -bottom-8 w-40 h-40 rounded-full bg-white/5 pointer-events-none"></div>
</div>
<!-- Breakdown of Medical Diagnostic Categories (SVG Chart) -->
<div class="lg:col-span-4 bg-surface-container-lowest p-md rounded-xl shadow-sm space-y-base">
<div class="flex items-center justify-between">
<div>
<h3 class="font-headline-md text-headline-md text-primary">Causas Frecuentes</h3>
<p class="font-label-sm text-label-sm text-on-surface-variant">Distribución de restricciones activas por patología</p>
</div>
<span class="material-symbols-outlined text-outline">pie_chart</span>
</div>
<!-- Visual Distribution Bars -->
<div class="space-y-3 pt-1">
<div>
<div class="flex justify-between text-[12px] font-label-md text-label-md mb-1">
<span class="text-on-surface font-medium">Osteomuscular (Columna / Hombro / Rodilla)</span>
<span class="text-primary font-bold">14 casos (50%)</span>
</div>
<div class="h-2 w-full bg-surface-container rounded-full overflow-hidden">
<div class="h-full bg-primary rounded-full" style="width: 50%"></div>
</div>
</div>
<div>
<div class="flex justify-between text-[12px] font-label-md text-label-md mb-1">
<span class="text-on-surface font-medium">Cardiovascular &amp; Metabólico (Hipertensión / DM)</span>
<span class="text-secondary font-bold">5 casos (18%)</span>
</div>
<div class="h-2 w-full bg-surface-container rounded-full overflow-hidden">
<div class="h-full bg-secondary rounded-full" style="width: 18%"></div>
</div>
</div>
<div>
<div class="flex justify-between text-[12px] font-label-md text-label-md mb-1">
<span class="text-on-surface font-medium">Riesgo Alturas / Vestibular (Vértigo)</span>
<span class="text-error font-bold">4 casos (14%)</span>
</div>
<div class="h-2 w-full bg-surface-container rounded-full overflow-hidden">
<div class="h-full bg-error rounded-full" style="width: 14%"></div>
</div>
</div>
<div>
<div class="flex justify-between text-[12px] font-label-md text-label-md mb-1">
<span class="text-on-surface font-medium">Dermatológico / Alergológico (Químicos)</span>
<span class="text-tertiary-container font-bold">3 casos (11%)</span>
</div>
<div class="h-2 w-full bg-surface-container rounded-full overflow-hidden">
<div class="h-full bg-tertiary-container rounded-full" style="width: 11%"></div>
</div>
</div>
<div>
<div class="flex justify-between text-[12px] font-label-md text-label-md mb-1">
<span class="text-on-surface font-medium">Visual &amp; Exposición Solar (Pterigión/UV)</span>
<span class="text-outline font-bold">2 casos (7%)</span>
</div>
<div class="h-2 w-full bg-surface-container rounded-full overflow-hidden">
<div class="h-full bg-outline rounded-full" style="width: 7%"></div>
</div>
</div>
</div>
</div>
<!-- Quick Inspection / Field Audit Mini-Checklist -->
<div class="lg:col-span-4 bg-surface-container-lowest p-md rounded-xl shadow-sm flex flex-col justify-between space-y-base">
<div class="space-y-base">
<div class="flex items-center justify-between">
<div>
<h3 class="font-headline-md text-headline-md text-primary">Auditoría en Finca</h3>
<p class="font-label-sm text-label-sm text-on-surface-variant">Ruta de verificación de adaptaciones activas</p>
</div>
<span class="material-symbols-outlined text-secondary">checklist_rtl</span>
</div>
<div class="space-y-2">
<div class="p-2.5 rounded-lg bg-surface-container-low flex items-start gap-2.5">
<input checked="" class="mt-1 accent-primary rounded" type="checkbox"/>
<div>
<div class="font-label-md text-label-md text-on-surface font-medium">Inspección de Asiento Ergonómico en Tractor 04</div>
<div class="text-[11px] text-on-surface-variant">Finca San José • Operador: Hernando Echeverry</div>
</div>
</div>
<div class="p-2.5 rounded-lg bg-surface-container-low flex items-start gap-2.5">
<input checked="" class="mt-1 accent-primary rounded" type="checkbox"/>
<div>
<div class="font-label-md text-label-md text-on-surface font-medium">Verificación de Carga Máx (10kg) en Selección</div>
<div class="text-[11px] text-on-surface-variant">La Esperanza • Operario: Carlos Ramos</div>
</div>
</div>
<div class="p-2.5 rounded-lg bg-error-container/20 flex items-start gap-2.5">
<input class="mt-1 accent-error rounded" type="checkbox"/>
<div>
<div class="font-label-md text-label-md text-error font-medium">Entrega de Tijera Rasante (Pendiente de compra)</div>
<div class="text-[11px] text-error">El Paraíso • Operario: José Manuel Quintero</div>
</div>
</div>
</div>
</div>
<div class="pt-base">
<button class="w-full py-2 bg-surface-container hover:bg-surface-container-high text-on-surface font-label-md text-label-md rounded-lg font-medium transition-colors flex items-center justify-center gap-2" type="button">
<span class="material-symbols-outlined text-[18px]">add_task</span>
<span>Programar Ronda con Fisioterapia</span>
</button>
</div>
</div>
</div>
<!-- SLIDE-OVER DRAWER (FORMULARIO DE REGISTRO RÁPIDO Y DETALLE DE CASO) -->
<div class="fixed inset-y-0 right-0 w-full max-w-2xl bg-surface-container-lowest shadow-2xl z-50 transform translate-x-full transition-transform duration-300 ease-in-out flex flex-col" id="drawer-registro">
<!-- Drawer Header -->
<div class="p-md bg-primary text-on-primary flex items-center justify-between">
<div class="flex items-center gap-2">
<span class="material-symbols-outlined text-[24px]">assignment_add</span>
<div>
<h2 class="font-headline-md text-headline-md" id="drawer-title">Registrar Restricción / Recomendación</h2>
<p class="font-label-sm text-label-sm opacity-80">Cumplimiento Resolución 2346 de 2007 (Art. 10 - 15)</p>
</div>
</div>
<button class="p-1 rounded-lg hover:bg-white/10 text-on-primary transition-colors" onclick="document.getElementById('drawer-registro').classList.add('translate-x-full')" type="button">
<span class="material-symbols-outlined text-[24px]">close</span>
</button>
</div>
<!-- Drawer Body (Form) -->
<div class="flex-1 overflow-y-auto p-md space-y-md">
<!-- Worker Picker -->
<div class="space-y-1">
<label class="font-label-sm text-label-sm uppercase tracking-wide text-on-surface-variant font-bold">1. Seleccionar Trabajador (Base Maestra Manzanares)</label>
<select class="w-full bg-surface-container-low text-on-surface font-body-sm text-body-sm px-3 py-2 rounded-lg focus:outline-none focus:bg-surface-container">
<option value="">Seleccione por Cédula o Nombre...</option>
<option value="1">1.054.892.311 - Carlos Ramos Morales (Recolector • La Esperanza)</option>
<option value="2">71.340.119 - José Manuel Quintero (Podador • El Paraíso)</option>
<option value="3">16.290.443 - Hernando Echeverry (Tractorista • San José)</option>
<option value="4">43.882.012 - Marta Lucía Gómez (Fumigadora • Bella Vista)</option>
<option value="5">98.675.201 - Gabriel Arango Ruiz (Canalero • Planta Central)</option>
</select>
<p class="text-[11px] text-outline">El cargo, sede y líder de cuadrilla se cargarán automáticamente.</p>
</div>
<!-- Type and Origin -->
<div class="grid grid-cols-1 md:grid-cols-2 gap-base">
<div class="space-y-1">
<label class="font-label-sm text-label-sm uppercase tracking-wide text-on-surface-variant font-bold">2. Tipo de Dictamen</label>
<select class="w-full bg-surface-container-low text-on-surface font-body-sm text-body-sm px-3 py-2 rounded-lg focus:outline-none focus:bg-surface-container">
<option>Restricción Médica (Limitación Funcional)</option>
<option>Recomendación Preventiva Ocupacional</option>
<option>Recomendación Temporal Post-Incapacidad</option>
<option>Restricción Definitiva con Reubicación</option>
</select>
</div>
<div class="space-y-1">
<label class="font-label-sm text-label-sm uppercase tracking-wide text-on-surface-variant font-bold">3. Entidad Emisora / Origen</label>
<select class="w-full bg-surface-container-low text-on-surface font-body-sm text-body-sm px-3 py-2 rounded-lg focus:outline-none focus:bg-surface-container">
<option>IPS Ocupacional Manzanares</option>
<option>ARL Positiva / Sura</option>
<option>EPS Sanitas / Nueva EPS</option>
<option>Junta Regional de Calificación</option>
<option>Médico Especialista Particular</option>
</select>
</div>
</div>
<!-- Key Dates -->
<div class="grid grid-cols-1 md:grid-cols-3 gap-base">
<div class="space-y-1">
<label class="font-label-sm text-label-sm text-on-surface-variant font-semibold">Fecha Emisión</label>
<input class="w-full bg-surface-container-low text-on-surface font-body-sm text-body-sm px-3 py-2 rounded-lg focus:outline-none focus:bg-surface-container" type="date" value="2024-10-24"/>
</div>
<div class="space-y-1">
<label class="font-label-sm text-label-sm text-on-surface-variant font-semibold">Fecha Inicio</label>
<input class="w-full bg-surface-container-low text-on-surface font-body-sm text-body-sm px-3 py-2 rounded-lg focus:outline-none focus:bg-surface-container" type="date" value="2024-10-24"/>
</div>
<div class="space-y-1">
<label class="font-label-sm text-label-sm text-on-surface-variant font-semibold">Fecha Vencimiento</label>
<input class="w-full bg-surface-container-low text-on-surface font-body-sm text-body-sm px-3 py-2 rounded-lg focus:outline-none focus:bg-surface-container" type="date"/>
</div>
</div>
<!-- Detail text area -->
<div class="space-y-1">
<label class="font-label-sm text-label-sm uppercase tracking-wide text-on-surface-variant font-bold">4. Detalle Textual de la Restricción o Recomendación</label>
<textarea class="w-full bg-surface-container-low text-on-surface font-body-sm text-body-sm p-3 rounded-lg focus:outline-none focus:bg-surface-container" placeholder="Transcriba o detalle textualmente las limitaciones emitidas en el certificado de aptitud médico laboral..." rows="3"></textarea>
</div>
<!-- Implementation and Responsible -->
<div class="grid grid-cols-1 md:grid-cols-2 gap-base">
<div class="space-y-1">
<label class="font-label-sm text-label-sm text-on-surface-variant font-semibold">Responsable de Implementar</label>
<input class="w-full bg-surface-container-low text-on-surface font-body-sm text-body-sm px-3 py-2 rounded-lg focus:outline-none focus:bg-surface-container" placeholder="Ej: Sup. Ramón Vélez / Jefe Mantenimiento" type="text"/>
</div>
<div class="space-y-1">
<label class="font-label-sm text-label-sm text-on-surface-variant font-semibold">Estado de Implementación</label>
<select class="w-full bg-surface-container-low text-on-surface font-body-sm text-body-sm px-3 py-2 rounded-lg focus:outline-none focus:bg-surface-container">
<option>🟢 Implementada y Verificada</option>
<option>⚠️ Pendiente de Adaptación / Compra</option>
<option>🟠 En Transición de Labores</option>
<option>🔴 No Viable (Requiere Comité SST)</option>
</select>
</div>
</div>
<!-- Adaptation details -->
<div class="space-y-1">
<label class="font-label-sm text-label-sm text-on-surface-variant font-semibold">Medida Operativa Concreta Adoptada en Finca</label>
<textarea class="w-full bg-surface-container-low text-on-surface font-body-sm text-body-sm p-3 rounded-lg focus:outline-none focus:bg-surface-container" placeholder="Describa el cambio de puesto, ajuste de jornada, dotación entregada o reasignación de cuadrilla..." rows="2"></textarea>
</div>
<!-- Attachment & Signature Document -->
<div class="space-y-1">
<label class="font-label-sm text-label-sm uppercase tracking-wide text-on-surface-variant font-bold">5. Evidencia Documental (Acta de Puesto / Concepto IPS)</label>
<div class="border-0 bg-surface-container-low p-base rounded-xl text-center cursor-pointer hover:bg-surface-container transition-colors">
<span class="material-symbols-outlined text-[32px] text-primary">cloud_upload</span>
<div class="font-label-md text-label-md text-on-surface mt-1">Haga clic o arrastre el Acta de Reubicación Firmada (.PDF o .JPG)</div>
<p class="text-[11px] text-outline">Incluir firma del trabajador, líder de cuadrilla y médico ocupacional (Máx 15MB)</p>
</div>
</div>
<!-- Next follow-up -->
<div class="grid grid-cols-1 md:grid-cols-2 gap-base">
<div class="space-y-1">
<label class="font-label-sm text-label-sm text-on-surface-variant font-semibold">Próximo Seguimiento en Puesto</label>
<input class="w-full bg-surface-container-low text-on-surface font-body-sm text-body-sm px-3 py-2 rounded-lg focus:outline-none focus:bg-surface-container" type="date"/>
</div>
<div class="space-y-1">
<label class="font-label-sm text-label-sm text-on-surface-variant font-semibold">Notificar Inmediatamente a</label>
<div class="flex items-center gap-2 pt-2">
<label class="inline-flex items-center gap-1 font-label-sm text-label-sm text-on-surface">
<input checked="" class="accent-primary rounded" type="checkbox"/> Capataz
            </label>
<label class="inline-flex items-center gap-1 font-label-sm text-label-sm text-on-surface">
<input checked="" class="accent-primary rounded" type="checkbox"/> RRHH
            </label>
<label class="inline-flex items-center gap-1 font-label-sm text-label-sm text-on-surface">
<input checked="" class="accent-primary rounded" type="checkbox"/> Trabajador (SMS)
            </label>
</div>
</div>
</div>
</div>
<!-- Drawer Footer Actions -->
<div class="p-md bg-surface-container-low flex items-center justify-between gap-base">
<button class="px-4 py-2 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface font-label-md text-label-md transition-colors" onclick="document.getElementById('drawer-registro').classList.add('translate-x-full')" type="button">
        Cancelar
      </button>
<div class="flex items-center gap-2">
<button class="px-5 py-2 rounded-lg bg-primary text-on-primary hover:bg-primary-container font-label-md text-label-md font-bold transition-colors flex items-center gap-2 shadow-sm" onclick="alert('Registro guardado con éxito. Se ha emitido la notificación digital al carné y a la cuadrilla correspondiente.'); document.getElementById('drawer-registro').classList.add('translate-x-full')" type="button">
<span class="material-symbols-outlined text-[18px]">save</span>
<span>Guardar &amp; Sincronizar Finca</span>
</button>
</div>
</div>
</div>
<!-- Interactive script for opening drawer for edit -->
<script>
    function openDetails(name, folio) {
      const drawer = document.getElementById('drawer-registro');
      document.getElementById('drawer-title').innerText = 'Inspección & Seguimiento: ' + folio;
      drawer.classList.remove('translate-x-full');
    }

    // Simple search filter simulation
    const searchInput = document.getElementById('filter-search');
    if (searchInput) {
      searchInput.addEventListener('input', function(e) {
        const query = e.target.value.toLowerCase();
        const rows = document.querySelectorAll('tbody tr');
        rows.forEach(row => {
          const text = row.innerText.toLowerCase();
          if (text.includes(query)) {
            row.style.display = '';
          } else {
            row.style.display = 'none';
          }
        });
      });
    }

  </script>
</div></main></div></body></html>

<!DOCTYPE html>

<html lang="es"><head><meta charset="utf-8"/><meta content="width=device-width, initial-scale=1.0" name="viewport"/><link href="https://fonts.googleapis.com" rel="preconnect"/><link crossorigin="" href="https://fonts.gstatic.com" rel="preconnect"/><link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&amp;display=swap" rel="stylesheet"/><link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" rel="stylesheet"/>
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet"/><style>@layer base{html,body{margin:0;padding:0;}body{overscroll-behavior:none;}main>:first-child{margin-top:0!important;}main>:last-child{margin-bottom:0!important;}}::-webkit-scrollbar{display:none;}</style><script src="https://cdn.tailwindcss.com"></script><script id="tailwind-config">tailwind.config = {"darkMode":"class","theme":{"extend":{"colors":{"on-tertiary-container":"#adb0b2","on-error-container":"#93000a","surface-tint":"#4b57aa","tertiary-container":"#404345","inverse-on-surface":"#eaf1ff","on-primary-fixed":"#000d60","surface-variant":"#d5e3fc","on-secondary-fixed-variant":"#2f2ebe","surface-container-high":"#dce9ff","inverse-surface":"#233144","on-primary-fixed-variant":"#333f91","on-primary":"#ffffff","surface-container-lowest":"#ffffff","surface-container-low":"#eff4ff","surface":"#f8f9ff","on-tertiary-fixed-variant":"#444749","inverse-primary":"#bcc3ff","error":"#ba1a1a","tertiary":"#2a2d2f","on-secondary":"#ffffff","secondary-fixed-dim":"#c0c1ff","outline-variant":"#c6c5d3","secondary":"#4648d4","on-error":"#ffffff","outline":"#767682","on-secondary-fixed":"#07006c","error-container":"#ffdad6","surface-dim":"#ccdbf3","surface-container-highest":"#d5e3fc","surface-container":"#e6eeff","on-tertiary-fixed":"#191c1e","tertiary-fixed":"#e0e3e5","on-background":"#0d1c2e","primary-container":"#2e3a8c","secondary-fixed":"#e1e0ff","primary":"#142175","primary-fixed":"#dfe0ff","on-primary-container":"#9ea9ff","on-surface-variant":"#454651","tertiary-fixed-dim":"#c4c7c9","surface-bright":"#f8f9ff","on-tertiary":"#ffffff","secondary-container":"#6063ee","background":"#f8f9ff","primary-fixed-dim":"#bcc3ff","on-secondary-container":"#fffbff","on-surface":"#0d1c2e"},"borderRadius":{"DEFAULT":"0.25rem","lg":"0.5rem","xl":"0.75rem","full":"9999px"},"spacing":{"xl":"80px","container-max":"1280px","xs":"4px","base":"8px","gutter":"24px","md":"24px","lg":"48px","sm":"12px"},"fontFamily":{"display-lg":["Inter"],"body-sm":["Inter"],"headline-lg":["Inter"],"headline-md":["Inter"],"body-md":["Inter"],"body-lg":["Inter"],"label-md":["Inter"],"headline-lg-mobile":["Inter"],"label-sm":["Inter"]},"fontSize":{"display-lg":["48px",{"lineHeight":"56px","letterSpacing":"-0.02em","fontWeight":"700"}],"body-sm":["14px",{"lineHeight":"20px","fontWeight":"400"}],"headline-lg":["32px",{"lineHeight":"40px","letterSpacing":"-0.01em","fontWeight":"600"}],"headline-md":["24px",{"lineHeight":"32px","fontWeight":"600"}],"body-md":["16px",{"lineHeight":"24px","fontWeight":"400"}],"body-lg":["18px",{"lineHeight":"28px","fontWeight":"400"}],"label-md":["14px",{"lineHeight":"16px","letterSpacing":"0.01em","fontWeight":"500"}],"headline-lg-mobile":["24px",{"lineHeight":"32px","fontWeight":"600"}],"label-sm":["12px",{"lineHeight":"14px","fontWeight":"600"}]}}}};</script></head><body class="bg-background font-body-md text-on-surface antialiased"><aside class="fixed left-0 top-0 h-full w-72 bg-surface-container-low z-50 flex flex-col shadow-[0_1px_8px_rgba(0,0,0,0.04)]"><div class="h-16 px-md flex items-center gap-sm bg-surface-container-low"><div class="w-9 h-9 rounded-lg bg-primary flex items-center justify-center text-on-primary font-headline-md text-headline-md">M</div><div class="flex flex-col"><span class="font-label-md text-label-md text-primary font-bold leading-tight">Grupo Manzanares</span><span class="font-label-sm text-label-sm text-on-surface-variant">SG-SST Operativo</span></div></div><div class="flex-1 overflow-y-auto px-sm py-base space-y-md"><nav class="space-y-base" data-active-classes="bg-primary text-on-primary rounded-lg font-label-md"><div><div class="px-sm pb-xs font-label-sm text-label-sm uppercase tracking-wider text-on-surface-variant opacity-75">Gestión Operativa</div><div class="space-y-1"><a class="flex items-center gap-sm px-sm py-2 rounded-lg text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-colors font-body-sm text-body-sm" data-path="dashboard" href="#"><span class="material-symbols-outlined text-[20px]">home</span><span>Inicio / Dashboard</span></a><a aria-current="page" class="flex items-center justify-between px-sm py-2 transition-colors bg-primary text-on-primary rounded-lg font-label-md" data-path="trabajadores" href="#"><div class="flex items-center gap-sm"><span class="material-symbols-outlined text-[20px]">engineering</span><span>Trabajadores</span></div><span class="bg-secondary-fixed text-on-secondary-fixed font-label-sm text-[11px] px-2 py-0.5 rounded-full">342</span></a><a class="flex items-center gap-sm px-sm py-2 rounded-lg text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-colors font-body-sm text-body-sm" data-path="examenes-medicos" href="#"><span class="material-symbols-outlined text-[20px]">stethoscope</span><span>Exámenes Médicos</span></a><a class="flex items-center gap-sm px-sm py-2 rounded-lg text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-colors font-body-sm text-body-sm" data-path="casos-de-salud" href="#"><span class="material-symbols-outlined text-[20px]">local_hospital</span><span>Casos de Salud</span></a><a class="flex items-center gap-sm px-sm py-2 rounded-lg text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-colors font-body-sm text-body-sm" data-path="incapacidades-y-reintegros" href="#"><span class="material-symbols-outlined text-[20px]">event_busy</span><span>Incapacidades y Reintegros</span></a></div></div><div><div class="px-sm pb-xs font-label-sm text-label-sm uppercase tracking-wider text-on-surface-variant opacity-75">Riesgos Críticos &amp; Viales</div><div class="space-y-1"><a class="flex items-center gap-sm px-sm py-2 rounded-lg text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-colors font-body-sm text-body-sm" data-path="trabajo-en-alturas" href="#"><span class="material-symbols-outlined text-[20px]">stairs</span><span>Trabajo en Alturas</span></a><a class="flex items-center gap-sm px-sm py-2 rounded-lg text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-colors font-body-sm text-body-sm" data-path="tractoristas-operadores" href="#"><span class="material-symbols-outlined text-[20px]">agriculture</span><span>Tractoristas / Operadores</span></a><a class="flex items-center gap-sm px-sm py-2 rounded-lg text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-colors font-body-sm text-body-sm" data-path="pesv-seguridad-vial" href="#"><span class="material-symbols-outlined text-[20px]">directions_car</span><span>PESV (Seguridad Vial)</span></a><a class="flex items-center gap-sm px-sm py-2 rounded-lg text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-colors font-body-sm text-body-sm" data-path="epp" href="#"><span class="material-symbols-outlined text-[20px]">arrow_left</span><span>EPP</span></a></div></div><div><div class="px-sm pb-xs font-label-sm text-label-sm uppercase tracking-wider text-on-surface-variant opacity-75">Inspección &amp; Eventos</div><div class="space-y-1"><a class="flex items-center gap-sm px-sm py-2 rounded-lg text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-colors font-body-sm text-body-sm" data-path="inspecciones" href="#"><span class="material-symbols-outlined text-[20px]">search_check</span><span>Inspecciones</span></a><a class="flex items-center justify-between px-sm py-2 rounded-lg text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-colors font-body-sm text-body-sm" data-path="accidentes-e-incidentes" href="#"><div class="flex items-center gap-sm"><span class="material-symbols-outlined text-[20px]">e911_emergency</span><span>Accidentes e Incidentes</span></div><span class="bg-error-container text-on-error-container font-label-sm text-[11px] px-1.5 py-0.5 rounded font-bold">2</span></a><a class="flex items-center gap-sm px-sm py-2 rounded-lg text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-colors font-body-sm text-body-sm" data-path="investigaciones" href="#"><span class="material-symbols-outlined text-[20px]">assignment</span><span>Investigaciones</span></a><a class="flex items-center gap-sm px-sm py-2 rounded-lg text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-colors font-body-sm text-body-sm" data-path="acciones-correctivas" href="#"><span class="material-symbols-outlined text-[20px]">build</span><span>Acciones Correctivas</span></a></div></div><div><div class="px-sm pb-xs font-label-sm text-label-sm uppercase tracking-wider text-on-surface-variant opacity-75">Comités &amp; Cultura</div><div class="space-y-1"><a class="flex items-center gap-sm px-sm py-2 rounded-lg text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-colors font-body-sm text-body-sm" data-path="capacitaciones" href="#"><span class="material-symbols-outlined text-[20px]">school</span><span>Capacitaciones</span></a><a class="flex items-center gap-sm px-sm py-2 rounded-lg text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-colors font-body-sm text-body-sm" data-path="documentos-sg-sst" href="#"><span class="material-symbols-outlined text-[20px]">description</span><span>Documentos SG-SST</span></a><a class="flex items-center gap-sm px-sm py-2 rounded-lg text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-colors font-body-sm text-body-sm" data-path="copasst" href="#"><span class="material-symbols-outlined text-[20px]">groups</span><span>COPASST</span></a><a class="flex items-center gap-sm px-sm py-2 rounded-lg text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-colors font-body-sm text-body-sm" data-path="ccl" href="#"><span class="material-symbols-outlined text-[20px]">handshake</span><span>CCL</span></a><a class="flex items-center gap-sm px-sm py-2 rounded-lg text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-colors font-body-sm text-body-sm" data-path="emergencias" href="#"><span class="material-symbols-outlined text-[20px]">fire_extinguisher</span><span>Emergencias</span></a><a class="flex items-center gap-sm px-sm py-2 rounded-lg text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-colors font-body-sm text-body-sm" data-path="quimicos" href="#"><span class="material-symbols-outlined text-[20px]">science</span><span>Químicos</span></a></div></div><div><div class="px-sm pb-xs font-label-sm text-label-sm uppercase tracking-wider text-on-surface-variant opacity-75">Estrategia &amp; Control</div><div class="space-y-1"><a class="flex items-center gap-sm px-sm py-2 rounded-lg text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-colors font-body-sm text-body-sm" data-path="analisis-sst" href="#"><span class="material-symbols-outlined text-[20px]">insights</span><span>Análisis SST</span></a><a class="flex items-center gap-sm px-sm py-2 rounded-lg text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-colors font-body-sm text-body-sm" data-path="configuracion" href="#"><span class="material-symbols-outlined text-[20px]">settings</span><span>Configuración</span></a></div></div></nav></div><div class="p-sm bg-surface-container m-sm rounded-lg flex items-center justify-between"><div class="flex items-center gap-2"><span class="w-2.5 h-2.5 rounded-full bg-secondary"></span><span class="font-label-sm text-label-sm text-on-surface">Riesgo Operativo V2</span></div><span class="font-label-sm text-label-sm text-primary font-bold">98.4%</span></div></aside><div class="pl-72"><header class="fixed top-0 left-72 right-0 h-16 bg-surface/90 backdrop-blur-xl shadow-[0_1px_8px_rgba(0,0,0,0.04)] z-40 px-md flex items-center justify-between"><div class="flex items-center gap-sm"><div class="hidden xl:flex items-center gap-2"><span class="px-2 py-1 rounded bg-surface-container text-on-surface-variant font-label-sm text-[11px] font-medium">Dec. 1072/2015</span><span class="px-2 py-1 rounded bg-surface-container text-on-surface-variant font-label-sm text-[11px] font-medium">Res. 0312</span><span class="px-2 py-1 rounded bg-surface-container text-on-surface-variant font-label-sm text-[11px] font-medium">Res. 4272 Alturas</span></div><div class="flex items-center gap-2 px-2.5 py-1 rounded-full bg-surface-container-low text-on-surface font-label-sm text-[12px]"><span class="w-2 h-2 rounded-full bg-secondary animate-pulse"></span><span>En línea / Sincronizado</span></div></div><div class="flex items-center gap-md"><button class="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-primary-container text-on-primary-container hover:bg-primary hover:text-on-primary transition-colors font-label-md text-label-md" type="button"><span class="material-symbols-outlined text-[18px]">notification_important</span><span>Reporte Rápido / Notificación</span></button><div class="h-6 w-px bg-outline-variant"></div><div class="flex items-center gap-3"><div class="text-right hidden md:block"><div class="font-label-md text-label-md text-on-surface leading-tight">Ing. Andrés Valencia</div><div class="font-label-sm text-label-sm text-on-surface-variant">Coordinador SG-SST</div></div><div class="w-8 h-8 rounded-full bg-primary flex items-center justify-center"><span class="material-symbols-outlined text-on-primary text-[18px]">person</span></div></div></div></header><main class="w-full pt-16 bg-background min-h-screen px-gutter py-md"><div class="flex flex-col w-full space-y-md">
<!-- ENCABEZADO DE PÁGINA & NAVEGACIÓN DE CONTEXTO -->
<header class="flex flex-col xl:flex-row xl:items-end justify-between gap-base bg-surface-container-lowest p-md rounded-xl shadow-sm">
<div class="space-y-xs">
<nav class="flex items-center gap-2 text-on-surface-variant font-label-sm text-label-sm">
<span class="hover:text-primary cursor-pointer transition-colors">Gestión Operativa</span>
<span class="material-symbols-outlined text-[14px]">chevron_right</span>
<span class="text-primary font-bold">8. Incapacidades y Reintegros</span>
<span class="px-2 py-0.5 rounded bg-surface-container text-on-surface-variant text-[11px] font-medium">Decreto 1072 / Res. 0312 / Res. 2346</span>
</nav>
<div class="flex items-baseline gap-3">
<h1 class="font-headline-lg text-headline-lg text-on-surface tracking-tight">8. Registro y Control de Incapacidades, Prórrogas y Reintegros Laborales</h1>
</div>
<p class="font-body-sm text-body-sm text-on-surface-variant max-w-4xl">
        Monitoreo sistemático del ausentismo por causa médica, alertas tempranas de reintegro, gestión ante EPS/ARL Sura y prevención de pérdida de capacidad laboral (PCL) conforme a estándares legales colombianos.
      </p>
</div>
<!-- ACCIONES PRINCIPALES -->
<div class="flex flex-wrap items-center gap-sm mt-2 xl:mt-0">
<button class="flex items-center gap-2 px-3.5 py-2 rounded-lg bg-surface-container text-on-surface hover:bg-surface-variant transition-all font-label-md text-label-md shadow-sm" onclick="document.getElementById('export-modal').classList.toggle('hidden')">
<span class="material-symbols-outlined text-[18px] text-primary">download</span>
<span>Exportar Informe (.XLSX)</span>
</button>
<button class="flex items-center gap-2 px-3.5 py-2 rounded-lg bg-surface-container-high text-primary hover:bg-surface-dim transition-all font-label-md text-label-md shadow-sm" onclick="openPostExamModal()">
<span class="material-symbols-outlined text-[18px]">medical_services</span>
<span>Programar Examen Post-Incapacidad</span>
</button>
<button class="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-on-primary hover:bg-primary-container hover:text-on-primary shadow-md transition-all font-label-md text-label-md" onclick="toggleQuickRegisterDrawer()">
<span class="material-symbols-outlined text-[20px]">add_circle</span>
<span>+ Registrar Incapacidad</span>
</button>
</div>
</header>
<!-- CENTRO DE ALERTAS TEMPRANAS (SEMÁFOROS OBLIGATORIOS) -->
<section class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-sm">
<!-- Alerta 1 -->
<div class="bg-surface-container-lowest p-base rounded-xl shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
<div class="flex items-center justify-between pb-1">
<span class="font-label-sm text-label-sm uppercase tracking-wider text-error font-bold flex items-center gap-1.5">
<span class="w-2 h-2 rounded-full bg-error animate-ping"></span>
          Vencida Sin Cierre
        </span>
<span class="material-symbols-outlined text-error text-[20px]">report_problem</span>
</div>
<div class="flex items-baseline justify-between mt-1">
<div class="font-display-lg text-[32px] leading-tight font-bold text-on-surface">02</div>
<span class="px-2 py-0.5 rounded bg-error-container text-on-error-container font-label-sm text-label-sm font-bold">Crítico</span>
</div>
<p class="font-body-sm text-body-sm text-on-surface-variant text-[12px] leading-tight mt-1">
        Terminó vigencia; sin reintegro legalizado ni prórroga radicada.
      </p>
<div class="mt-2 pt-2 bg-surface-container-low -mx-base -mb-base px-base py-1.5 flex justify-between items-center text-[11px] font-label-sm text-primary">
<span>Finca La Primavera / San Jorge</span>
<span class="material-symbols-outlined text-[14px]">arrow_forward</span>
</div>
</div>
<!-- Alerta 2 -->
<div class="bg-surface-container-lowest p-base rounded-xl shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
<div class="flex items-center justify-between pb-1">
<span class="font-label-sm text-label-sm uppercase tracking-wider text-secondary font-bold flex items-center gap-1.5">
<span class="w-2 h-2 rounded-full bg-secondary"></span>
          Termina en 3 Días
        </span>
<span class="material-symbols-outlined text-secondary text-[20px]">timer</span>
</div>
<div class="flex items-baseline justify-between mt-1">
<div class="font-display-lg text-[32px] leading-tight font-bold text-on-surface">04</div>
<span class="px-2 py-0.5 rounded bg-secondary-fixed text-on-secondary-fixed font-label-sm text-label-sm font-bold">Inminente</span>
</div>
<p class="font-body-sm text-body-sm text-on-surface-variant text-[12px] leading-tight mt-1">
        Fecha límite cercana. Requerido contacto telefónico de confirmación.
      </p>
<div class="mt-2 pt-2 bg-surface-container-low -mx-base -mb-base px-base py-1.5 flex justify-between items-center text-[11px] font-label-sm text-primary">
<span>Verificar citas EPS</span>
<span class="material-symbols-outlined text-[14px]">arrow_forward</span>
</div>
</div>
<!-- Alerta 3 -->
<div class="bg-surface-container-lowest p-base rounded-xl shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
<div class="flex items-center justify-between pb-1">
<span class="font-label-sm text-label-sm uppercase tracking-wider text-on-surface-variant font-bold flex items-center gap-1.5">
<span class="w-2 h-2 rounded-full bg-outline"></span>
          Termina en 7 Días
        </span>
<span class="material-symbols-outlined text-outline text-[20px]">calendar_clock</span>
</div>
<div class="flex items-baseline justify-between mt-1">
<div class="font-display-lg text-[32px] leading-tight font-bold text-on-surface">07</div>
<span class="px-2 py-0.5 rounded bg-surface-container text-on-surface-variant font-label-sm text-label-sm font-semibold">Seguimiento</span>
</div>
<p class="font-body-sm text-body-sm text-on-surface-variant text-[12px] leading-tight mt-1">
        Seguimiento intermedio a evolución clínica ambulatoria.
      </p>
<div class="mt-2 pt-2 bg-surface-container-low -mx-base -mb-base px-base py-1.5 flex justify-between items-center text-[11px] font-label-sm text-primary">
<span>Plan de cobertura operativa</span>
<span class="material-symbols-outlined text-[14px]">arrow_forward</span>
</div>
</div>
<!-- Alerta 4 -->
<div class="bg-surface-container-lowest p-base rounded-xl shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
<div class="flex items-center justify-between pb-1">
<span class="font-label-sm text-label-sm uppercase tracking-wider text-error font-bold flex items-center gap-1.5">
<span class="w-2 h-2 rounded-full bg-error"></span>
          Prórroga Acumulada
        </span>
<span class="material-symbols-outlined text-error text-[20px]">history_toggle_off</span>
</div>
<div class="flex items-baseline justify-between mt-1">
<div class="font-display-lg text-[32px] leading-tight font-bold text-on-surface">05</div>
<span class="px-2 py-0.5 rounded bg-error-container text-on-error-container font-label-sm text-label-sm font-bold">&gt; 30 Días</span>
</div>
<p class="font-body-sm text-body-sm text-on-surface-variant text-[12px] leading-tight mt-1">
        Patologías continuadas. Alerta de reubicación temporal.
      </p>
<div class="mt-2 pt-2 bg-surface-container-low -mx-base -mb-base px-base py-1.5 flex justify-between items-center text-[11px] font-label-sm text-primary">
<span>3 de origen laboral ARL</span>
<span class="material-symbols-outlined text-[14px]">arrow_forward</span>
</div>
</div>
<!-- Alerta 5 -->
<div class="bg-surface-container-lowest p-base rounded-xl shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
<div class="flex items-center justify-between pb-1">
<span class="font-label-sm text-label-sm uppercase tracking-wider text-secondary font-bold flex items-center gap-1.5">
<span class="w-2 h-2 rounded-full bg-secondary"></span>
          Reintegro Pendiente
        </span>
<span class="material-symbols-outlined text-secondary text-[20px]">assignment_turned_in</span>
</div>
<div class="flex items-baseline justify-between mt-1">
<div class="font-display-lg text-[32px] leading-tight font-bold text-on-surface">03</div>
<span class="px-2 py-0.5 rounded bg-secondary-fixed text-on-secondary-fixed font-label-sm text-label-sm font-bold">Post-Examen</span>
</div>
<p class="font-body-sm text-body-sm text-on-surface-variant text-[12px] leading-tight mt-1">
        Examen Ocupacional post-incapacidad obligatorio antes del reingreso.
      </p>
<div class="mt-2 pt-2 bg-surface-container-low -mx-base -mb-base px-base py-1.5 flex justify-between items-center text-[11px] font-label-sm text-primary">
<span>Aptitud con restricciones</span>
<span class="material-symbols-outlined text-[14px]">arrow_forward</span>
</div>
</div>
</section>
<!-- SECCIÓN INTERMEDIA: KPIS DE AUSENTISMO & RANKING ACUMULADO (BENTO GRID) -->
<div class="grid grid-cols-1 xl:grid-cols-12 gap-md">
<!-- KPIS MÉTRICOS (4 COLUMNAS) -->
<div class="xl:col-span-4 flex flex-col gap-sm">
<div class="bg-surface-container-lowest p-md rounded-xl shadow-sm flex flex-col justify-between flex-1">
<div class="flex items-center justify-between">
<span class="font-label-sm text-label-sm uppercase text-on-surface-variant tracking-wider font-semibold">Indicadores Clave del Mes</span>
<span class="font-label-sm text-label-sm text-primary font-bold bg-surface-container px-2 py-0.5 rounded">Corte: Septiembre 2024</span>
</div>
<div class="grid grid-cols-2 gap-sm my-md">
<div class="p-base bg-surface-container-low rounded-lg">
<span class="font-label-sm text-label-sm text-on-surface-variant block">Días Totales Perdidos</span>
<div class="font-display-lg text-[34px] leading-none font-bold text-primary mt-1">142 <span class="font-label-md text-label-md font-normal text-on-surface-variant">días</span></div>
<span class="text-error font-label-sm text-[11px] flex items-center gap-0.5 mt-1 font-semibold">
<span class="material-symbols-outlined text-[14px]">trending_up</span> +8% vs mes ant.
            </span>
</div>
<div class="p-base bg-surface-container-low rounded-lg">
<span class="font-label-sm text-label-sm text-on-surface-variant block">Tasa de Ausentismo</span>
<div class="font-display-lg text-[34px] leading-none font-bold text-on-surface mt-1">2.1%</div>
<span class="text-on-surface-variant font-label-sm text-[11px] flex items-center gap-0.5 mt-1">
              Meta Manzanares: ≤ 2.5%
            </span>
</div>
</div>
<!-- Distribución Común vs Laboral -->
<div class="p-base bg-surface rounded-lg space-y-2">
<div class="flex items-center justify-between font-label-sm text-label-sm">
<span class="font-semibold text-on-surface">Distribución por Origen Médico</span>
<span class="text-on-surface-variant">142 días consolidados</span>
</div>
<div class="w-full h-3 bg-surface-container-high rounded-full overflow-hidden flex">
<div class="h-full bg-primary" style="width: 68%;" title="Enfermedad Común (EPS): 68%"></div>
<div class="h-full bg-secondary-container" style="width: 32%;" title="Accidente/Enfermedad Laboral (ARL): 32%"></div>
</div>
<div class="flex items-center justify-between text-[12px] font-label-sm pt-1">
<div class="flex items-center gap-1.5 text-on-surface">
<span class="w-2.5 h-2.5 rounded-full bg-primary"></span>
<span>Común (EPS): <strong class="text-primary">68% (96 d)</strong></span>
</div>
<div class="flex items-center gap-1.5 text-on-surface">
<span class="w-2.5 h-2.5 rounded-full bg-secondary-container"></span>
<span>Laboral (ARL): <strong class="text-secondary">32% (46 d)</strong></span>
</div>
</div>
</div>
<!-- Alerta > 120 días -->
<div class="mt-sm p-base rounded-lg bg-error-container/40 flex items-center justify-between">
<div class="flex items-center gap-2">
<span class="material-symbols-outlined text-error text-[24px]">gavel</span>
<div>
<span class="font-label-md text-label-md font-bold text-on-error-container block">Alerta Crítica &gt; 120 Días</span>
<span class="font-body-sm text-body-sm text-[12px] text-on-surface-variant">Concepto de rehabilitación favorable/desfavorable AFP</span>
</div>
</div>
<span class="px-2.5 py-1 rounded bg-error text-on-error font-label-md text-label-md font-bold">2 Casos</span>
</div>
</div>
</div>
<!-- GRÁFICO OBLIGATORIO: RANKING TRABAJADORES CON MAYOR AUSENTISMO ACUMULADO (8 COLUMNAS) -->
<div class="xl:col-span-8 bg-surface-container-lowest p-md rounded-xl shadow-sm flex flex-col justify-between">
<div class="flex flex-col sm:flex-row sm:items-center justify-between gap-base pb-base">
<div>
<div class="flex items-center gap-2">
<span class="w-1.5 h-4 rounded-full bg-primary"></span>
<h2 class="font-headline-md text-headline-md text-on-surface">Ranking: Trabajadores con Mayor Número de Días de Incapacidad Acumulados</h2>
</div>
<p class="font-body-sm text-body-sm text-on-surface-variant text-[13px] mt-0.5">
            Días continuos e intermitentes por patología activa. Parámetro de vigilancia epidemiológica osteomuscular y trauma laboral.
          </p>
</div>
<div class="flex items-center gap-2 font-label-sm text-label-sm">
<span class="flex items-center gap-1 text-on-surface-variant"><span class="w-3 h-3 rounded bg-secondary-container"></span> Laboral (ARL)</span>
<span class="flex items-center gap-1 text-on-surface-variant ml-2"><span class="w-3 h-3 rounded bg-primary"></span> Común (EPS)</span>
</div>
</div>
<!-- BARRAS HORIZONTALES CON DESGLOSE -->
<div class="space-y-base my-auto pt-2">
<!-- Item 1: Hernando Zuluaga -->
<div class="group p-base rounded-lg hover:bg-surface-container-low transition-all">
<div class="flex items-center justify-between text-body-sm mb-1.5">
<div class="flex items-center gap-2">
<span class="font-label-md text-label-md font-bold text-on-surface">1. Hernando Zuluaga</span>
<span class="text-on-surface-variant font-label-sm text-[12px]">(Operador Tractor - Finca El Manantial)</span>
<span class="px-1.5 py-0.5 rounded bg-secondary-fixed text-on-secondary-fixed font-label-sm text-[11px] font-bold">Laboral / Prórroga 3</span>
<span class="text-[12px] text-on-surface-variant italic">Accidente PESV - Fractura de tibia</span>
</div>
<div class="flex items-center gap-2">
<span class="font-headline-md text-headline-md font-bold text-secondary">68 <span class="text-body-sm font-normal text-on-surface-variant">días</span></span>
<button class="text-primary hover:text-primary-container p-1" onclick="viewRecord('EMP-0142')" title="Ver Expediente SST">
<span class="material-symbols-outlined text-[18px]">open_in_new</span>
</button>
</div>
</div>
<div class="w-full h-3.5 bg-surface-container rounded-full overflow-hidden flex">
<div class="h-full bg-secondary-container transition-all duration-700 ease-out" style="width: 85%;"></div>
</div>
<div class="flex items-center justify-between text-[11px] text-on-surface-variant font-label-sm mt-1">
<span>Inició: 12/07/2024 • Vence prórroga: 18/09/2024</span>
<span class="text-error font-bold">En valoración ortopedia especializada</span>
</div>
</div>
<!-- Item 2: Martha Gómez -->
<div class="group p-base rounded-lg hover:bg-surface-container-low transition-all">
<div class="flex items-center justify-between text-body-sm mb-1.5">
<div class="flex items-center gap-2">
<span class="font-label-md text-label-md font-bold text-on-surface">2. Martha Gómez</span>
<span class="text-on-surface-variant font-label-sm text-[12px]">(Auxiliar Sanidad - Finca La Palma)</span>
<span class="px-1.5 py-0.5 rounded bg-secondary-fixed text-on-secondary-fixed font-label-sm text-[11px] font-bold">Laboral (ARL)</span>
<span class="text-[12px] text-on-surface-variant italic">Túnel carpiano bilateral severo</span>
</div>
<div class="flex items-center gap-2">
<span class="font-headline-md text-headline-md font-bold text-secondary">45 <span class="text-body-sm font-normal text-on-surface-variant">días</span></span>
<button class="text-primary hover:text-primary-container p-1" onclick="viewRecord('EMP-0209')" title="Ver Expediente SST">
<span class="material-symbols-outlined text-[18px]">open_in_new</span>
</button>
</div>
</div>
<div class="w-full h-3.5 bg-surface-container rounded-full overflow-hidden flex">
<div class="h-full bg-secondary-container transition-all duration-700 ease-out" style="width: 56%;"></div>
</div>
<div class="flex items-center justify-between text-[11px] text-on-surface-variant font-label-sm mt-1">
<span>Inició: 04/08/2024 • Vence prórroga: 17/09/2024</span>
<span class="text-secondary font-bold">Comité de Rehabilitación Integral Sura</span>
</div>
</div>
<!-- Item 3: José Morales -->
<div class="group p-base rounded-lg hover:bg-surface-container-low transition-all">
<div class="flex items-center justify-between text-body-sm mb-1.5">
<div class="flex items-center gap-2">
<span class="font-label-md text-label-md font-bold text-on-surface">3. José Morales</span>
<span class="text-on-surface-variant font-label-sm text-[12px]">(Téc. Mantenimiento - Taller Central)</span>
<span class="px-1.5 py-0.5 rounded bg-surface-container-high text-primary font-label-sm text-[11px] font-bold">Común / Prórroga 2</span>
<span class="text-[12px] text-on-surface-variant italic">Lumbalgia mecánica con discopatía L4-L5</span>
</div>
<div class="flex items-center gap-2">
<span class="font-headline-md text-headline-md font-bold text-primary">32 <span class="text-body-sm font-normal text-on-surface-variant">días</span></span>
<button class="text-primary hover:text-primary-container p-1" onclick="viewRecord('EMP-0087')" title="Ver Expediente SST">
<span class="material-symbols-outlined text-[18px]">open_in_new</span>
</button>
</div>
</div>
<div class="w-full h-3.5 bg-surface-container rounded-full overflow-hidden flex">
<div class="h-full bg-primary transition-all duration-700 ease-out" style="width: 40%;"></div>
</div>
<div class="flex items-center justify-between text-[11px] text-on-surface-variant font-label-sm mt-1">
<span>Inició: 16/08/2024 • Vence prórroga: 16/09/2024</span>
<span class="text-error font-bold">¡Incapacidad Vencida Sin Cierre!</span>
</div>
</div>
<!-- Item 4: Carlos Julio Peña -->
<div class="group p-base rounded-lg hover:bg-surface-container-low transition-all">
<div class="flex items-center justify-between text-body-sm mb-1.5">
<div class="flex items-center gap-2">
<span class="font-label-md text-label-md font-bold text-on-surface">4. Carlos Julio Peña</span>
<span class="text-on-surface-variant font-label-sm text-[12px]">(Cosechador - Finca San Isidro)</span>
<span class="px-1.5 py-0.5 rounded bg-surface-container-high text-primary font-label-sm text-[11px] font-bold">Común (EPS Sanitas)</span>
<span class="text-[12px] text-on-surface-variant italic">Post-quirúrgico corrección pterigio</span>
</div>
<div class="flex items-center gap-2">
<span class="font-headline-md text-headline-md font-bold text-primary">24 <span class="text-body-sm font-normal text-on-surface-variant">días</span></span>
<button class="text-primary hover:text-primary-container p-1" onclick="viewRecord('EMP-0311')" title="Ver Expediente SST">
<span class="material-symbols-outlined text-[18px]">open_in_new</span>
</button>
</div>
</div>
<div class="w-full h-3.5 bg-surface-container rounded-full overflow-hidden flex">
<div class="h-full bg-primary transition-all duration-700 ease-out" style="width: 30%;"></div>
</div>
<div class="flex items-center justify-between text-[11px] text-on-surface-variant font-label-sm mt-1">
<span>Inició: 22/08/2024 • Vence: 14/09/2024</span>
<span class="text-secondary font-bold">Reintegro programado: 16/09/2024</span>
</div>
</div>
<!-- Item 5: Ramón Restrepo -->
<div class="group p-base rounded-lg hover:bg-surface-container-low transition-all">
<div class="flex items-center justify-between text-body-sm mb-1.5">
<div class="flex items-center gap-2">
<span class="font-label-md text-label-md font-bold text-on-surface">5. Ramón Restrepo</span>
<span class="text-on-surface-variant font-label-sm text-[12px]">(Podador Forestal - Finca Las Brisas)</span>
<span class="px-1.5 py-0.5 rounded bg-surface-container-high text-primary font-label-sm text-[11px] font-bold">Común (Sura EPS)</span>
<span class="text-[12px] text-on-surface-variant italic">Esguince de tobillo grado II</span>
</div>
<div class="flex items-center gap-2">
<span class="font-headline-md text-headline-md font-bold text-primary">18 <span class="text-body-sm font-normal text-on-surface-variant">días</span></span>
<button class="text-primary hover:text-primary-container p-1" onclick="viewRecord('EMP-0054')" title="Ver Expediente SST">
<span class="material-symbols-outlined text-[18px]">open_in_new</span>
</button>
</div>
</div>
<div class="w-full h-3.5 bg-surface-container rounded-full overflow-hidden flex">
<div class="h-full bg-primary transition-all duration-700 ease-out" style="width: 22%;"></div>
</div>
<div class="flex items-center justify-between text-[11px] text-on-surface-variant font-label-sm mt-1">
<span>Inició: 28/08/2024 • Vence: 15/09/2024</span>
<span class="text-on-surface-variant">Examen de reintegro confirmado</span>
</div>
</div>
</div>
</div>
</div>
<!-- SECCIÓN: TABLA MAESTRA DE SEGUIMIENTO Y GESTIÓN OPERATIVA -->
<section class="bg-surface-container-lowest rounded-xl shadow-sm flex flex-col overflow-hidden">
<!-- FILTROS Y CONTROLES SUPERIORES -->
<div class="p-md flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-base bg-surface-container-low">
<div class="flex flex-wrap items-center gap-2 flex-1">
<div class="relative min-w-[280px]">
<span class="material-symbols-outlined absolute left-3 top-2.5 text-on-surface-variant text-[20px]">search</span>
<input class="w-full pl-10 pr-3 py-2 rounded-lg bg-surface-container-lowest text-on-surface font-body-sm text-body-sm placeholder:text-outline focus:outline-none focus:ring-2 focus:ring-primary shadow-sm" id="tableSearch" onkeyup="filterTable()" placeholder="Buscar por Cédula, Trabajador, Patología, Finca..." type="text"/>
</div>
<!-- Select Origen -->
<select class="px-3 py-2 rounded-lg bg-surface-container-lowest text-on-surface font-label-md text-label-md focus:outline-none focus:ring-2 focus:ring-primary shadow-sm" id="filterOrigen" onchange="filterTable()">
<option value="">Todos los Orígenes</option>
<option value="Laboral">Laboral (ARL Sura)</option>
<option value="Común">Común (EPS)</option>
</select>
<!-- Select Estado -->
<select class="px-3 py-2 rounded-lg bg-surface-container-lowest text-on-surface font-label-md text-label-md focus:outline-none focus:ring-2 focus:ring-primary shadow-sm" id="filterEstado" onchange="filterTable()">
<option value="">Todos los Estados</option>
<option value="Activa">Activa</option>
<option value="Prorrogada">Prorrogada</option>
<option value="Vencida por Legalizar">Vencida por Legalizar</option>
<option value="Reintegrado">Reintegrado</option>
</select>
<!-- Select Reintegro -->
<select class="px-3 py-2 rounded-lg bg-surface-container-lowest text-on-surface font-label-md text-label-md focus:outline-none focus:ring-2 focus:ring-primary shadow-sm" id="filterReintegro" onchange="filterTable()">
<option value="">Examen Post-Incapacidad</option>
<option value="Obligatorio">Obligatorio (&gt; 15 días)</option>
<option value="No requerido">No Requerido</option>
</select>
</div>
<div class="flex items-center gap-2 self-end lg:self-center">
<span class="font-label-sm text-label-sm text-on-surface-variant font-medium">Mostrando <span class="font-bold text-primary">6 de 18</span> registros activos</span>
<button class="p-2 rounded-lg bg-surface-container text-on-surface-variant hover:bg-surface-variant transition-colors" title="Refrescar datos">
<span class="material-symbols-outlined text-[20px]">refresh</span>
</button>
</div>
</div>
<!-- TABLA DE ALTA DENSIDAD -->
<div class="overflow-x-auto w-full">
<table class="w-full text-left font-body-sm text-body-sm" id="incapacidadesTable">
<thead class="bg-surface-container text-on-surface uppercase font-label-sm text-[11px] tracking-wider sticky top-0">
<tr>
<th class="py-3.5 px-base">Trabajador &amp; Cargo</th>
<th class="py-3.5 px-base">Empresa / Finca</th>
<th class="py-3.5 px-base">Período &amp; Días</th>
<th class="py-3.5 px-base">Origen</th>
<th class="py-3.5 px-base">Prórroga</th>
<th class="py-3.5 px-base">Acumulado</th>
<th class="py-3.5 px-base">Estado</th>
<th class="py-3.5 px-base">Reintegro Ocupacional</th>
<th class="py-3.5 px-base">Seguimiento SST &amp; Observaciones</th>
<th class="py-3.5 px-base text-center">Soporte PDF</th>
<th class="py-3.5 px-base text-right">Acción</th>
</tr>
</thead>
<tbody class="divide-y divide-surface-container text-on-surface">
<!-- REGISTRO 1 -->
<tr class="hover:bg-surface-container-low transition-colors group">
<td class="py-3 px-base min-w-[210px]">
<div class="flex items-center gap-2.5">
<div class="w-9 h-9 rounded-full bg-primary-fixed text-on-primary-fixed flex items-center justify-center font-bold text-[13px] flex-shrink-0">
                  HZ
                </div>
<div class="min-w-0">
<span class="font-label-md text-label-md font-bold block text-on-surface truncate">Hernando Zuluaga</span>
<span class="text-[12px] text-on-surface-variant block truncate">C.C. 71.392.180 • Operador Tractor</span>
</div>
</div>
</td>
<td class="py-3 px-base text-[13px] whitespace-nowrap">
<span class="font-semibold block text-primary">Grupo Manzanares S.A.S.</span>
<span class="text-on-surface-variant text-[12px]">Finca El Manantial</span>
</td>
<td class="py-3 px-base whitespace-nowrap text-[13px]">
<div class="font-medium text-on-surface">19/08/24 → 18/09/24</div>
<span class="font-bold text-secondary text-[12px]">30 días (Orden ARL)</span>
</td>
<td class="py-3 px-base whitespace-nowrap">
<span class="px-2 py-0.5 rounded bg-secondary-fixed text-on-secondary-fixed font-label-sm text-[11px] font-bold inline-flex items-center gap-1">
<span class="w-1.5 h-1.5 rounded-full bg-secondary"></span> Laboral (ARL)
              </span>
</td>
<td class="py-3 px-base whitespace-nowrap">
<span class="px-2 py-0.5 rounded bg-secondary-container/20 text-secondary font-label-sm text-[11px] font-bold">
                Sí (Prórroga #3)
              </span>
</td>
<td class="py-3 px-base whitespace-nowrap">
<span class="font-display-lg text-[18px] font-bold text-secondary">68 d</span>
<span class="text-[11px] text-on-surface-variant block">&gt; 30 días cont.</span>
</td>
<td class="py-3 px-base whitespace-nowrap">
<span class="px-2.5 py-1 rounded bg-secondary-fixed text-on-secondary-fixed font-label-sm text-[12px] font-bold flex items-center gap-1 w-fit">
<span class="material-symbols-outlined text-[14px]">autorenew</span> Prorrogada
              </span>
</td>
<td class="py-3 px-base min-w-[190px]">
<div class="flex items-center gap-1 text-error font-label-sm text-[12px] font-bold">
<span class="material-symbols-outlined text-[16px]">verified</span>
                Obligatorio Post-Inc.
              </div>
<span class="text-[11px] text-on-surface-variant block">Prog: 19/09/24 - IPS SaludLab</span>
</td>
<td class="py-3 px-base min-w-[240px]">
<div class="text-[12px] text-on-surface">
<strong>Contacto SST (12/09):</strong> Paciente asiste a terapia física 14/20. No apto para vibración corporal entera.
              </div>
<span class="text-[11px] text-outline block mt-0.5">Radicado ARL Sura: #993182-2024</span>
</td>
<td class="py-3 px-base text-center whitespace-nowrap">
<button class="p-1.5 rounded bg-surface-container text-primary hover:bg-primary hover:text-on-primary transition-colors" onclick="previewPdf('Incapacidad_HZ_P3.pdf')" title="Descargar Certificado Radicado">
<span class="material-symbols-outlined text-[18px]">picture_as_pdf</span>
</button>
</td>
<td class="py-3 px-base text-right whitespace-nowrap">
<div class="flex items-center justify-end gap-1">
<button class="p-1 text-on-surface-variant hover:text-primary transition-colors" onclick="openEditModal('INC-001')" title="Editar / Agregar Seguimiento">
<span class="material-symbols-outlined text-[18px]">edit_note</span>
</button>
<button class="p-1 text-secondary hover:text-primary transition-colors" onclick="openReintegroModal('INC-001')" title="Legalizar Reintegro">
<span class="material-symbols-outlined text-[18px]">how_to_reg</span>
</button>
</div>
</td>
</tr>
<!-- REGISTRO 2: VENCIDA SIN CIERRE -->
<tr class="hover:bg-surface-container-low transition-colors group bg-error-container/10">
<td class="py-3 px-base min-w-[210px]">
<div class="flex items-center gap-2.5">
<div class="w-9 h-9 rounded-full bg-error-container text-on-error-container flex items-center justify-center font-bold text-[13px] flex-shrink-0">
                  JM
                </div>
<div class="min-w-0">
<span class="font-label-md text-label-md font-bold block text-on-surface truncate">José Morales</span>
<span class="text-[12px] text-on-surface-variant block truncate">C.C. 98.411.022 • Mecánico Taller</span>
</div>
</div>
</td>
<td class="py-3 px-base text-[13px] whitespace-nowrap">
<span class="font-semibold block text-primary">Grupo Manzanares S.A.S.</span>
<span class="text-on-surface-variant text-[12px]">Taller Central Maquinaria</span>
</td>
<td class="py-3 px-base whitespace-nowrap text-[13px]">
<div class="font-medium text-on-surface">18/08/24 → 12/09/24</div>
<span class="font-bold text-error text-[12px]">25 días (EPS Sura)</span>
</td>
<td class="py-3 px-base whitespace-nowrap">
<span class="px-2 py-0.5 rounded bg-surface-container text-on-surface-variant font-label-sm text-[11px] font-bold inline-flex items-center gap-1">
<span class="w-1.5 h-1.5 rounded-full bg-outline"></span> Común (EPS)
              </span>
</td>
<td class="py-3 px-base whitespace-nowrap">
<span class="px-2 py-0.5 rounded bg-surface-container text-on-surface font-label-sm text-[11px] font-medium">
                Sí (Prórroga #2)
              </span>
</td>
<td class="py-3 px-base whitespace-nowrap">
<span class="font-display-lg text-[18px] font-bold text-primary">32 d</span>
<span class="text-[11px] text-on-surface-variant block">Lumbalgia crónica</span>
</td>
<td class="py-3 px-base whitespace-nowrap">
<span class="px-2.5 py-1 rounded bg-error text-on-error font-label-sm text-[12px] font-bold flex items-center gap-1 w-fit animate-pulse">
<span class="material-symbols-outlined text-[14px]">warning</span> Vencida por Legalizar
              </span>
</td>
<td class="py-3 px-base min-w-[190px]">
<div class="flex items-center gap-1 text-error font-label-sm text-[12px] font-bold">
<span class="material-symbols-outlined text-[16px]">error</span>
                Requerido Urgente
              </div>
<span class="text-[11px] text-error block">No ha asistido a valoración médica</span>
</td>
<td class="py-3 px-base min-w-[240px]">
<div class="text-[12px] text-on-surface">
<strong>Alerta Jefe Taller:</strong> No se presentó a laborar el 13/09 ni ha enviado nueva fórmula/prórroga. Se emitió citación formal.
              </div>
<span class="text-[11px] text-error font-semibold block mt-0.5">Pendiente soporte físico EPS</span>
</td>
<td class="py-3 px-base text-center whitespace-nowrap">
<button class="p-1.5 rounded bg-surface-container text-primary hover:bg-primary hover:text-on-primary transition-colors" onclick="previewPdf('Certificado_JM_P2.pdf')" title="Descargar Incapacidad">
<span class="material-symbols-outlined text-[18px]">picture_as_pdf</span>
</button>
</td>
<td class="py-3 px-base text-right whitespace-nowrap">
<div class="flex items-center justify-end gap-1">
<button class="p-1 text-error hover:text-on-error-container transition-colors" onclick="openQuickContact('José Morales', '312-882-9011')" title="Llamada de Contacto / WhatsApp">
<span class="material-symbols-outlined text-[18px]">call</span>
</button>
<button class="p-1 text-secondary hover:text-primary transition-colors" onclick="openReintegroModal('INC-002')" title="Legalizar Reintegro">
<span class="material-symbols-outlined text-[18px]">how_to_reg</span>
</button>
</div>
</td>
</tr>
<!-- REGISTRO 3: ACTIVA TERMINA EN 3 DÍAS -->
<tr class="hover:bg-surface-container-low transition-colors group">
<td class="py-3 px-base min-w-[210px]">
<div class="flex items-center gap-2.5">
<div class="w-9 h-9 rounded-full bg-surface-container-high text-primary flex items-center justify-center font-bold text-[13px] flex-shrink-0">
                  MG
                </div>
<div class="min-w-0">
<span class="font-label-md text-label-md font-bold block text-on-surface truncate">Martha Gómez</span>
<span class="text-[12px] text-on-surface-variant block truncate">C.C. 43.882.901 • Aux. Sanidad Vegetal</span>
</div>
</div>
</td>
<td class="py-3 px-base text-[13px] whitespace-nowrap">
<span class="font-semibold block text-primary">Grupo Manzanares S.A.S.</span>
<span class="text-on-surface-variant text-[12px]">Finca La Palma</span>
</td>
<td class="py-3 px-base whitespace-nowrap text-[13px]">
<div class="font-medium text-on-surface">19/08/24 → 17/09/24</div>
<span class="font-bold text-secondary text-[12px]">30 días (ARL Sura)</span>
</td>
<td class="py-3 px-base whitespace-nowrap">
<span class="px-2 py-0.5 rounded bg-secondary-fixed text-on-secondary-fixed font-label-sm text-[11px] font-bold inline-flex items-center gap-1">
<span class="w-1.5 h-1.5 rounded-full bg-secondary"></span> Laboral (ARL)
              </span>
</td>
<td class="py-3 px-base whitespace-nowrap">
<span class="px-2 py-0.5 rounded bg-secondary-container/20 text-secondary font-label-sm text-[11px] font-bold">
                Sí (Prórroga #1)
              </span>
</td>
<td class="py-3 px-base whitespace-nowrap">
<span class="font-display-lg text-[18px] font-bold text-secondary">45 d</span>
<span class="text-[11px] text-on-surface-variant block">Túnel Carpiano</span>
</td>
<td class="py-3 px-base whitespace-nowrap">
<span class="px-2.5 py-1 rounded bg-secondary text-on-secondary font-label-sm text-[12px] font-bold flex items-center gap-1 w-fit">
<span class="material-symbols-outlined text-[14px]">alarm</span> Termina en 3 días
              </span>
</td>
<td class="py-3 px-base min-w-[190px]">
<div class="flex items-center gap-1 text-secondary font-label-sm text-[12px] font-bold">
<span class="material-symbols-outlined text-[16px]">verified</span>
                Obligatorio Post-Inc.
              </div>
<span class="text-[11px] text-on-surface-variant block">Cita Prog: 17/09/2024</span>
</td>
<td class="py-3 px-base min-w-[240px]">
<div class="text-[12px] text-on-surface">
<strong>Reubicación Recomendada:</strong> Reubicación transitoria sin tareas de prensión repetitiva ni tijera de poda.
              </div>
<span class="text-[11px] text-outline block mt-0.5">Evaluada por Dr. Ricardo Posada</span>
</td>
<td class="py-3 px-base text-center whitespace-nowrap">
<button class="p-1.5 rounded bg-surface-container text-primary hover:bg-primary hover:text-on-primary transition-colors" onclick="previewPdf('Certificado_MG_ARL.pdf')" title="Descargar Soporte Digital">
<span class="material-symbols-outlined text-[18px]">picture_as_pdf</span>
</button>
</td>
<td class="py-3 px-base text-right whitespace-nowrap">
<div class="flex items-center justify-end gap-1">
<button class="p-1 text-on-surface-variant hover:text-primary transition-colors" onclick="openEditModal('INC-003')" title="Editar">
<span class="material-symbols-outlined text-[18px]">edit_note</span>
</button>
<button class="p-1 text-secondary hover:text-primary transition-colors" onclick="openReintegroModal('INC-003')" title="Legalizar Reintegro">
<span class="material-symbols-outlined text-[18px]">how_to_reg</span>
</button>
</div>
</td>
</tr>
<!-- REGISTRO 4: ACTIVA CORTA (NO REQUIERE POST-EXAMEN) -->
<tr class="hover:bg-surface-container-low transition-colors group">
<td class="py-3 px-base min-w-[210px]">
<div class="flex items-center gap-2.5">
<div class="w-9 h-9 rounded-full bg-surface-container text-on-surface font-bold text-[13px] flex-shrink-0 flex items-center justify-center">
                  CP
                </div>
<div class="min-w-0">
<span class="font-label-md text-label-md font-bold block text-on-surface truncate">Carlos Julio Peña</span>
<span class="text-[12px] text-on-surface-variant block truncate">C.C. 15.204.918 • Cosechador</span>
</div>
</div>
</td>
<td class="py-3 px-base text-[13px] whitespace-nowrap">
<span class="font-semibold block text-primary">Grupo Manzanares S.A.S.</span>
<span class="text-on-surface-variant text-[12px]">Finca San Isidro</span>
</td>
<td class="py-3 px-base whitespace-nowrap text-[13px]">
<div class="font-medium text-on-surface">01/09/24 → 14/09/24</div>
<span class="font-bold text-primary text-[12px]">14 días (Sanitas EPS)</span>
</td>
<td class="py-3 px-base whitespace-nowrap">
<span class="px-2 py-0.5 rounded bg-surface-container text-on-surface-variant font-label-sm text-[11px] font-bold inline-flex items-center gap-1">
<span class="w-1.5 h-1.5 rounded-full bg-outline"></span> Común (EPS)
              </span>
</td>
<td class="py-3 px-base whitespace-nowrap">
<span class="px-2 py-0.5 rounded bg-surface-container text-on-surface-variant font-label-sm text-[11px]">
                No (Inicial)
              </span>
</td>
<td class="py-3 px-base whitespace-nowrap">
<span class="font-display-lg text-[18px] font-bold text-on-surface">24 d</span>
<span class="text-[11px] text-on-surface-variant block">Post-oftalmológico</span>
</td>
<td class="py-3 px-base whitespace-nowrap">
<span class="px-2.5 py-1 rounded bg-secondary text-on-secondary font-label-sm text-[12px] font-bold flex items-center gap-1 w-fit">
<span class="material-symbols-outlined text-[14px]">alarm</span> Termina en 3 días
              </span>
</td>
<td class="py-3 px-base min-w-[190px]">
<div class="flex items-center gap-1 text-on-surface-variant font-label-sm text-[12px]">
<span class="material-symbols-outlined text-[16px]">check_circle_outline</span>
                No requerido (≤ 15 días)
              </div>
<span class="text-[11px] text-on-surface-variant block">Reingreso directo con EPP gafas</span>
</td>
<td class="py-3 px-base min-w-[240px]">
<div class="text-[12px] text-on-surface">
<strong>Revisión SST:</strong> Evolución favorable según optometría. Requerido uso obligatorio de monofiltro UV categoría 3.
              </div>
<span class="text-[11px] text-outline block mt-0.5">Certificado original archivado en carpeta</span>
</td>
<td class="py-3 px-base text-center whitespace-nowrap">
<button class="p-1.5 rounded bg-surface-container text-primary hover:bg-primary hover:text-on-primary transition-colors" onclick="previewPdf('Certificado_CP_Sanitas.pdf')" title="Descargar Incapacidad EPS">
<span class="material-symbols-outlined text-[18px]">picture_as_pdf</span>
</button>
</td>
<td class="py-3 px-base text-right whitespace-nowrap">
<div class="flex items-center justify-end gap-1">
<button class="p-1 text-on-surface-variant hover:text-primary transition-colors" onclick="openEditModal('INC-004')" title="Editar">
<span class="material-symbols-outlined text-[18px]">edit_note</span>
</button>
<button class="p-1 text-secondary hover:text-primary transition-colors" onclick="openReintegroModal('INC-004')" title="Legalizar Reintegro">
<span class="material-symbols-outlined text-[18px]">how_to_reg</span>
</button>
</div>
</td>
</tr>
<!-- REGISTRO 5: REINTEGRADO CON RESTRICCIONES -->
<tr class="hover:bg-surface-container-low transition-colors group">
<td class="py-3 px-base min-w-[210px]">
<div class="flex items-center gap-2.5">
<div class="w-9 h-9 rounded-full bg-surface-container-high text-primary flex items-center justify-center font-bold text-[13px] flex-shrink-0">
                  RR
                </div>
<div class="min-w-0">
<span class="font-label-md text-label-md font-bold block text-on-surface truncate">Ramón Restrepo</span>
<span class="text-[12px] text-on-surface-variant block truncate">C.C. 10.149.202 • Podador Forestal</span>
</div>
</div>
</td>
<td class="py-3 px-base text-[13px] whitespace-nowrap">
<span class="font-semibold block text-primary">Grupo Manzanares S.A.S.</span>
<span class="text-on-surface-variant text-[12px]">Finca Las Brisas</span>
</td>
<td class="py-3 px-base whitespace-nowrap text-[13px]">
<div class="font-medium text-on-surface">28/08/24 → 11/09/24</div>
<span class="font-bold text-primary text-[12px]">15 días (Sura EPS)</span>
</td>
<td class="py-3 px-base whitespace-nowrap">
<span class="px-2 py-0.5 rounded bg-surface-container text-on-surface-variant font-label-sm text-[11px] font-bold inline-flex items-center gap-1">
<span class="w-1.5 h-1.5 rounded-full bg-outline"></span> Común (EPS)
              </span>
</td>
<td class="py-3 px-base whitespace-nowrap">
<span class="px-2 py-0.5 rounded bg-surface-container text-on-surface font-label-sm text-[11px] font-medium">
                Sí (Prórroga #1)
              </span>
</td>
<td class="py-3 px-base whitespace-nowrap">
<span class="font-display-lg text-[18px] font-bold text-on-surface">18 d</span>
<span class="text-[11px] text-on-surface-variant block">Trauma Tobillo</span>
</td>
<td class="py-3 px-base whitespace-nowrap">
<span class="px-2.5 py-1 rounded bg-surface-container-high text-primary font-label-sm text-[12px] font-bold flex items-center gap-1 w-fit">
<span class="material-symbols-outlined text-[14px]">done_all</span> Reintegrado
              </span>
</td>
<td class="py-3 px-base min-w-[190px]">
<div class="flex items-center gap-1 text-primary font-label-sm text-[12px] font-bold">
<span class="material-symbols-outlined text-[16px]">task_alt</span>
                Realizado / Apto c/ Restricción
              </div>
<span class="text-[11px] text-on-surface-variant block">Fecha Reintegro: 12/09/2024</span>
</td>
<td class="py-3 px-base min-w-[240px]">
<div class="text-[12px] text-on-surface">
<strong>Acta de Reintegro #084:</strong> Restricción por 30 días: No realizar labores en pendientes &gt; 25° ni carga en hombro &gt; 15 kg.
              </div>
<span class="text-[11px] text-outline block mt-0.5">Firmada por Trabajador y Supervisor</span>
</td>
<td class="py-3 px-base text-center whitespace-nowrap">
<button class="p-1.5 rounded bg-surface-container text-primary hover:bg-primary hover:text-on-primary transition-colors" onclick="previewPdf('Acta_Reintegro_RR.pdf')" title="Ver Acta y Certificados">
<span class="material-symbols-outlined text-[18px]">picture_as_pdf</span>
</button>
</td>
<td class="py-3 px-base text-right whitespace-nowrap">
<div class="flex items-center justify-end gap-1">
<button class="p-1 text-on-surface-variant hover:text-primary transition-colors" onclick="viewRecord('EMP-0054')" title="Consultar Historial">
<span class="material-symbols-outlined text-[18px]">visibility</span>
</button>
</div>
</td>
</tr>
<!-- REGISTRO 6: CASO > 120 DÍAS / PCL -->
<tr class="hover:bg-surface-container-low transition-colors group">
<td class="py-3 px-base min-w-[210px]">
<div class="flex items-center gap-2.5">
<div class="w-9 h-9 rounded-full bg-error-container text-error flex items-center justify-center font-bold text-[13px] flex-shrink-0">
                  DA
                </div>
<div class="min-w-0">
<span class="font-label-md text-label-md font-bold block text-on-surface truncate">Darío Antonio Gómez</span>
<span class="text-[12px] text-on-surface-variant block truncate">C.C. 70.091.554 • Motosierrista</span>
</div>
</div>
</td>
<td class="py-3 px-base text-[13px] whitespace-nowrap">
<span class="font-semibold block text-primary">Grupo Manzanares S.A.S.</span>
<span class="text-on-surface-variant text-[12px]">Finca Los Cedros</span>
</td>
<td class="py-3 px-base whitespace-nowrap text-[13px]">
<div class="font-medium text-on-surface">01/09/24 → 30/09/24</div>
<span class="font-bold text-secondary text-[12px]">30 días (ARL Sura)</span>
</td>
<td class="py-3 px-base whitespace-nowrap">
<span class="px-2 py-0.5 rounded bg-secondary-fixed text-on-secondary-fixed font-label-sm text-[11px] font-bold inline-flex items-center gap-1">
<span class="w-1.5 h-1.5 rounded-full bg-secondary"></span> Laboral (ARL)
              </span>
</td>
<td class="py-3 px-base whitespace-nowrap">
<span class="px-2 py-0.5 rounded bg-error-container text-on-error-container font-label-sm text-[11px] font-bold">
                Sí (Prórroga #5)
              </span>
</td>
<td class="py-3 px-base whitespace-nowrap">
<span class="font-display-lg text-[18px] font-bold text-error">152 d</span>
<span class="text-[11px] text-error font-bold block">&gt; 120 días (PCL)</span>
</td>
<td class="py-3 px-base whitespace-nowrap">
<span class="px-2.5 py-1 rounded bg-secondary-fixed text-on-secondary-fixed font-label-sm text-[12px] font-bold flex items-center gap-1 w-fit">
<span class="material-symbols-outlined text-[14px]">autorenew</span> Prorrogada
              </span>
</td>
<td class="py-3 px-base min-w-[190px]">
<div class="flex items-center gap-1 text-error font-label-sm text-[12px] font-bold">
<span class="material-symbols-outlined text-[16px]">medical_services</span>
                Junta Médica Regional
              </div>
<span class="text-[11px] text-on-surface-variant block">Calificación PCL en trámite</span>
</td>
<td class="py-3 px-base min-w-[240px]">
<div class="text-[12px] text-on-surface">
<strong>Concepto de Rehabilitación:</strong> Desfavorable emitido por EPS y ARL Sura. Expediente remitido a Fondo de Pensiones Porvenir.
              </div>
<span class="text-[11px] text-error font-semibold block mt-0.5">Seguimiento Jurídico Laboral</span>
</td>
<td class="py-3 px-base text-center whitespace-nowrap">
<button class="p-1.5 rounded bg-surface-container text-primary hover:bg-primary hover:text-on-primary transition-colors" onclick="previewPdf('Concepto_PCL_DarioGomez.pdf')" title="Ver Concepto de Rehabilitación">
<span class="material-symbols-outlined text-[18px]">picture_as_pdf</span>
</button>
</td>
<td class="py-3 px-base text-right whitespace-nowrap">
<div class="flex items-center justify-end gap-1">
<button class="p-1 text-on-surface-variant hover:text-primary transition-colors" onclick="openEditModal('INC-006')" title="Editar Expediente">
<span class="material-symbols-outlined text-[18px]">edit_note</span>
</button>
<button class="p-1 text-error hover:text-on-error-container transition-colors" onclick="alert('Caso en trámite de calificación de pérdida de capacidad laboral (PCL). Consulte módulo Jurídico/SST.')" title="Alerta PCL">
<span class="material-symbols-outlined text-[18px]">policy</span>
</button>
</div>
</td>
</tr>
</tbody>
</table>
</div>
<!-- PIE DE TABLA CON ACCIONES EN LOTE Y PAGINACIÓN -->
<div class="p-base bg-surface-container flex flex-col sm:flex-row items-center justify-between gap-base font-label-sm text-label-sm text-on-surface-variant">
<div class="flex items-center gap-base">
<button class="flex items-center gap-1 text-primary hover:underline font-semibold" onclick="alert('Generando citaciones automáticas vía WhatsApp/Correo...')">
<span class="material-symbols-outlined text-[16px]">forward_to_inbox</span> Enviar Recordatorio de Cierre a Pendientes (2)
        </button>
</div>
<div class="flex items-center gap-2">
<span>Filas por página:</span>
<select class="bg-surface-container-lowest px-2 py-1 rounded text-on-surface focus:outline-none">
<option>10</option>
<option>25</option>
<option>50</option>
</select>
<span class="ml-2">Página 1 de 3</span>
<div class="flex items-center gap-1">
<button class="p-1 rounded hover:bg-surface-container-high disabled:opacity-30" disabled=""><span class="material-symbols-outlined text-[18px]">chevron_left</span></button>
<button class="p-1 rounded hover:bg-surface-container-high"><span class="material-symbols-outlined text-[18px]">chevron_right</span></button>
</div>
</div>
</div>
</section>
<!-- DRAWER LATERAL: REGISTRO RÁPIDO PARAMÉTRICO DE INCAPACIDAD -->
<div aria-labelledby="slide-over-title" aria-modal="true" class="fixed inset-0 z-50 overflow-hidden hidden" id="quickRegisterDrawer" role="dialog">
<div class="absolute inset-0 bg-inverse-surface/40 backdrop-blur-sm transition-opacity" onclick="toggleQuickRegisterDrawer()"></div>
<div class="fixed inset-y-0 right-0 max-w-full flex pl-10">
<div class="w-screen max-w-2xl bg-surface-container-lowest shadow-2xl flex flex-col">
<!-- Drawer Header -->
<div class="p-md bg-primary text-on-primary flex items-center justify-between">
<div class="flex items-center gap-2">
<span class="material-symbols-outlined text-[24px]">assignment_add</span>
<div>
<h3 class="font-headline-md text-headline-md font-bold leading-tight" id="slide-over-title">Registrar Nueva Incapacidad Médica</h3>
<p class="font-body-sm text-body-sm text-on-primary-container text-[12px]">SG-SST Operativo • Cumplimiento normativo y trazabilidad</p>
</div>
</div>
<button class="p-1 rounded-full hover:bg-primary-container text-on-primary transition-colors" onclick="toggleQuickRegisterDrawer()">
<span class="material-symbols-outlined text-[22px]">close</span>
</button>
</div>
<!-- Formulario -->
<form class="flex-1 overflow-y-auto p-md space-y-md" id="incapacidadForm" onsubmit="handleFormSubmit(event)">
<!-- 1. Trabajador Relacional -->
<div class="space-y-1">
<label class="font-label-md text-label-md font-bold text-on-surface flex items-center justify-between">
<span>1. Seleccionar Colaborador *</span>
<span class="text-primary text-[11px] font-normal">Base activa: 342 trabajadores</span>
</label>
<div class="relative">
<select class="w-full px-3 py-2 rounded-lg bg-surface-container-low text-on-surface font-body-sm text-body-sm focus:ring-2 focus:ring-primary focus:outline-none" id="workerSelect" onchange="autoFillWorkerData()" required="">
<option value="">-- Seleccione Trabajador (Nombre o C.C.) --</option>
<option data-cargo="Operador Tractor" data-cc="71.392.180" data-dias-acum="38" data-finca="Finca El Manantial" value="1">Hernando Zuluaga — C.C. 71.392.180 (Tractorista)</option>
<option data-cargo="Auxiliar de Sanidad" data-cc="43.882.901" data-dias-acum="15" data-finca="Finca La Palma" value="2">Martha Gómez — C.C. 43.882.901 (Sanidad)</option>
<option data-cargo="Técnico Mantenimiento" data-cc="98.411.022" data-dias-acum="7" data-finca="Taller Central" value="3">José Morales — C.C. 98.411.022 (Taller)</option>
<option data-cargo="Cosechador" data-cc="15.204.918" data-dias-acum="0" data-finca="Finca San Isidro" value="4">Carlos Julio Peña — C.C. 15.204.918 (Cosecha)</option>
<option data-cargo="Podador Forestal" data-cc="10.149.202" data-dias-acum="3" data-finca="Finca Las Brisas" value="5">Ramón Restrepo — C.C. 10.149.202 (Poda)</option>
<option data-cargo="Motosierrista" data-cc="70.091.554" data-dias-acum="122" data-finca="Finca Los Cedros" value="6">Darío Antonio Gómez — C.C. 70.091.554 (Forestal)</option>
</select>
</div>
<!-- Datos autocompletados -->
<div class="hidden p-base bg-surface-container rounded-lg grid grid-cols-3 gap-2 text-[12px] mt-2" id="workerDataCard">
<div>
<span class="text-on-surface-variant block">Empresa:</span>
<span class="font-bold text-on-surface">Grupo Manzanares S.A.S.</span>
</div>
<div>
<span class="text-on-surface-variant block">Cargo / Finca:</span>
<span class="font-bold text-on-surface" id="autoCargoFinca">-</span>
</div>
<div>
<span class="text-on-surface-variant block">Días Previos Patología:</span>
<span class="font-bold text-secondary" id="autoDiasAcum">0 días</span>
</div>
</div>
</div>
<!-- 2. Clasificación Médica -->
<div class="grid grid-cols-2 gap-base">
<div>
<label class="font-label-md text-label-md font-bold text-on-surface block mb-1">Origen del Evento *</label>
<select class="w-full px-3 py-2 rounded-lg bg-surface-container-low text-on-surface font-body-sm text-body-sm focus:ring-2 focus:ring-primary focus:outline-none" id="inputOrigen" required="">
<option value="Comun">Enfermedad Común (EPS)</option>
<option value="Laboral_AT">Accidente de Trabajo (ARL Sura)</option>
<option value="Laboral_EL">Enfermedad Laboral (ARL Sura)</option>
<option value="Maternidad">Licencia de Maternidad / Paternidad</option>
<option value="Transito">Accidente de Tránsito (SOAT / EPS)</option>
</select>
</div>
<div>
<label class="font-label-md text-label-md font-bold text-on-surface block mb-1">Entidad Emisora *</label>
<input class="w-full px-3 py-2 rounded-lg bg-surface-container-low text-on-surface font-body-sm text-body-sm focus:ring-2 focus:ring-primary focus:outline-none" id="inputEntidad" placeholder="Ej: EPS Sura, Sanitas, ARL Sura..." required="" type="text"/>
</div>
</div>
<!-- 3. Fechas y Cálculo Dinámico -->
<div class="p-base bg-surface-container-low rounded-xl space-y-base">
<span class="font-label-md text-label-md font-bold text-on-surface block">Período de Incapacidad</span>
<div class="grid grid-cols-3 gap-base">
<div>
<label class="text-[12px] font-semibold text-on-surface-variant block mb-1">Fecha Inicial *</label>
<input class="w-full px-2 py-1.5 rounded-lg bg-surface-container-lowest text-on-surface font-body-sm text-body-sm focus:outline-none focus:ring-2 focus:ring-primary" id="inputFechaInicio" onchange="calculateDaysAndFlags()" required="" type="date"/>
</div>
<div>
<label class="text-[12px] font-semibold text-on-surface-variant block mb-1">Fecha Final *</label>
<input class="w-full px-2 py-1.5 rounded-lg bg-surface-container-lowest text-on-surface font-body-sm text-body-sm focus:outline-none focus:ring-2 focus:ring-primary" id="inputFechaFin" onchange="calculateDaysAndFlags()" required="" type="date"/>
</div>
<div>
<label class="text-[12px] font-semibold text-on-surface-variant block mb-1">Días Ordenados</label>
<input class="w-full px-2 py-1.5 rounded-lg bg-surface-container text-primary font-bold text-body-sm focus:outline-none text-center" id="inputDiasOrden" readonly="" type="number" value="0"/>
</div>
</div>
<!-- Banderas Paramétricas Automáticas -->
<div class="p-base bg-surface-container-lowest rounded-lg space-y-1.5">
<div class="flex items-center justify-between text-[12px]">
<span class="text-on-surface-variant">¿Es Prórroga de la misma patología?</span>
<span class="px-2 py-0.5 rounded bg-surface-container text-on-surface font-bold text-[11px]" id="badgeProrrogaFlag">Calculando...</span>
</div>
<div class="flex items-center justify-between text-[12px]">
<span class="text-on-surface-variant">Total Días Acumulados Proyectados:</span>
<span class="font-bold text-primary text-[13px]" id="badgeTotalAcumulado">0 días</span>
</div>
<div class="flex items-center justify-between text-[12px]">
<span class="text-on-surface-variant">Examen de Reintegro Médico Requerido:</span>
<span class="px-2 py-0.5 rounded bg-surface-container text-on-surface font-bold text-[11px]" id="badgeReintegroFlag">No Requerido</span>
</div>
</div>
</div>
<!-- 4. Diagnóstico Clínico (CIE-10) -->
<div class="space-y-base">
<div class="grid grid-cols-3 gap-base">
<div>
<label class="font-label-md text-label-md font-bold text-on-surface block mb-1">Código CIE-10 *</label>
<input class="w-full px-3 py-2 rounded-lg bg-surface-container-low text-on-surface font-body-sm text-body-sm uppercase focus:ring-2 focus:ring-primary focus:outline-none" placeholder="Ej: M54.5, S82.2" required="" type="text"/>
</div>
<div class="col-span-2">
<label class="font-label-md text-label-md font-bold text-on-surface block mb-1">Diagnóstico / Patología *</label>
<input class="w-full px-3 py-2 rounded-lg bg-surface-container-low text-on-surface font-body-sm text-body-sm focus:ring-2 focus:ring-primary focus:outline-none" placeholder="Ej: Lumbalgia no especificada / Fractura de tibia" required="" type="text"/>
</div>
</div>
<div>
<label class="font-label-md text-label-md font-bold text-on-surface block mb-1">Médico Tratante &amp; Registro Profesional</label>
<input class="w-full px-3 py-2 rounded-lg bg-surface-container-low text-on-surface font-body-sm text-body-sm focus:ring-2 focus:ring-primary focus:outline-none" placeholder="Nombre completo del médico y No. de Registro Médico EPS" type="text"/>
</div>
<div>
<label class="font-label-md text-label-md font-bold text-on-surface block mb-1">Observaciones Administrativas &amp; Restricciones Anticipadas</label>
<textarea class="w-full px-3 py-2 rounded-lg bg-surface-container-low text-on-surface font-body-sm text-body-sm focus:ring-2 focus:ring-primary focus:outline-none" placeholder="Describa recepción de certificado físico, recomendaciones de no carga, o acuerdos de teletrabajo/reubicación..." rows="2"></textarea>
</div>
</div>
<!-- 5. Carga de Soporte Digital (PDF Escaneado) -->
<div class="p-base bg-surface-container-low rounded-xl space-y-2">
<label class="font-label-md text-label-md font-bold text-on-surface block">Adjuntar Soporte Escaneado (PDF Original EPS/ARL) *</label>
<div class="p-base bg-surface-container-lowest rounded-lg border-2 border-dashed border-outline-variant hover:border-primary transition-all text-center cursor-pointer" onclick="document.getElementById('fileUpload').click()">
<input accept=".pdf" class="hidden" id="fileUpload" onchange="updateFileName(this)" type="file"/>
<span class="material-symbols-outlined text-primary text-[32px]">upload_file</span>
<p class="font-label-md text-label-md text-on-surface font-semibold" id="uploadText">Haga clic para cargar o arrastre el archivo PDF</p>
<span class="text-[11px] text-on-surface-variant block mt-0.5">Formatos permitidos: PDF oficial de EPS o ARL (Máx. 10 MB)</span>
</div>
</div>
<!-- Botones de Acción Formulario -->
<div class="pt-base flex items-center justify-end gap-sm sticky bottom-0 bg-surface-container-lowest py-base">
<button class="px-4 py-2 rounded-lg bg-surface-container text-on-surface font-label-md text-label-md hover:bg-surface-variant transition-colors" onclick="toggleQuickRegisterDrawer()" type="button">
              Cancelar
            </button>
<button class="px-5 py-2 rounded-lg bg-primary text-on-primary font-label-md text-label-md font-bold hover:bg-primary-container shadow-md transition-all flex items-center gap-1.5" type="submit">
<span class="material-symbols-outlined text-[18px]">save</span>
<span>Guardar Incapacidad</span>
</button>
</div>
</form>
</div>
</div>
</div>
<!-- MODAL SECUNDARIO: PROGRAMACIÓN DE EXAMEN POST-INCAPACIDAD -->
<div aria-labelledby="modal-title" aria-modal="true" class="fixed inset-0 z-50 overflow-y-auto hidden" id="postExamModal" role="dialog">
<div class="flex items-center justify-center min-h-screen p-4 text-center sm:p-0">
<div class="fixed inset-0 bg-inverse-surface/40 backdrop-blur-sm transition-opacity" onclick="openPostExamModal()"></div>
<div class="relative bg-surface-container-lowest rounded-2xl text-left overflow-hidden shadow-2xl transform transition-all sm:my-8 sm:max-w-lg sm:w-full p-md space-y-md">
<div class="flex items-center justify-between pb-base border-b border-surface-container">
<div class="flex items-center gap-2">
<div class="w-8 h-8 rounded-lg bg-secondary-fixed text-on-secondary-fixed flex items-center justify-center">
<span class="material-symbols-outlined text-[20px]">medical_services</span>
</div>
<div>
<h3 class="font-headline-md text-[18px] font-bold text-on-surface">Programar Valoración Médica de Reintegro</h3>
<p class="text-[11px] text-on-surface-variant font-label-sm">Resolución 2346 de 2007 - Exámenes Ocupacionales</p>
</div>
</div>
<button class="text-on-surface-variant hover:text-on-surface" onclick="openPostExamModal()">
<span class="material-symbols-outlined text-[20px]">close</span>
</button>
</div>
<form class="space-y-base" onsubmit="handlePostExamSubmit(event)">
<div>
<label class="font-label-md text-label-md font-bold text-on-surface block mb-1">Colaborador en Reintegro</label>
<select class="w-full px-3 py-2 rounded-lg bg-surface-container-low text-on-surface font-body-sm text-body-sm focus:ring-2 focus:ring-primary">
<option>José Morales — C.C. 98.411.022 (Mantenimiento)</option>
<option>Hernando Zuluaga — C.C. 71.392.180 (Operador Tractor)</option>
<option>Martha Gómez — C.C. 43.882.901 (Sanidad)</option>
</select>
</div>
<div class="grid grid-cols-2 gap-base">
<div>
<label class="font-label-md text-label-md font-bold text-on-surface block mb-1">Fecha Sugerida</label>
<input class="w-full px-3 py-2 rounded-lg bg-surface-container-low text-on-surface font-body-sm text-body-sm focus:ring-2 focus:ring-primary" required="" type="date"/>
</div>
<div>
<label class="font-label-md text-label-md font-bold text-on-surface block mb-1">IPS Ocupacional</label>
<select class="w-full px-3 py-2 rounded-lg bg-surface-container-low text-on-surface font-body-sm text-body-sm focus:ring-2 focus:ring-primary">
<option>SaludLab Ocupacional (Sede Rionegro)</option>
<option>IPS Manzanares Central</option>
<option>Red Asistencial Sura</option>
</select>
</div>
</div>
<div>
<label class="font-label-md text-label-md font-bold text-on-surface block mb-1">Énfasis Requerido</label>
<div class="space-y-1 text-[13px]">
<label class="flex items-center gap-2 text-on-surface">
<input checked="" class="rounded text-primary focus:ring-primary" type="checkbox"/> Énfasis Osteomuscular / Columna
              </label>
<label class="flex items-center gap-2 text-on-surface">
<input class="rounded text-primary focus:ring-primary" type="checkbox"/> Prueba Psicosensométrica / Visiometría (PESV)
              </label>
<label class="flex items-center gap-2 text-on-surface">
<input class="rounded text-primary focus:ring-primary" type="checkbox"/> Valoración de Túnel Carpiano / Fuerza Dinamométrica
              </label>
</div>
</div>
<div class="flex items-center justify-end gap-sm pt-base">
<button class="px-4 py-2 rounded-lg bg-surface-container text-on-surface font-label-md text-label-md" onclick="openPostExamModal()" type="button">Cancelar</button>
<button class="px-4 py-2 rounded-lg bg-primary text-on-primary font-label-md text-label-md font-bold" type="submit">Generar Orden y Citar</button>
</div>
</form>
</div>
</div>
</div>
<!-- MODAL / FEEDBACK DE DESCARGA O EXPORTACIÓN -->
<div aria-modal="true" class="fixed inset-0 z-50 overflow-y-auto hidden" id="export-modal">
<div class="flex items-center justify-center min-h-screen p-4 text-center">
<div class="fixed inset-0 bg-inverse-surface/40 backdrop-blur-sm" onclick="document.getElementById('export-modal').classList.add('hidden')"></div>
<div class="relative bg-surface-container-lowest rounded-xl p-md max-w-md w-full text-left shadow-2xl space-y-base">
<div class="flex items-center gap-2 text-primary">
<span class="material-symbols-outlined text-[28px]">table_view</span>
<h4 class="font-headline-md text-headline-md">Exportar Informe Consolidado</h4>
</div>
<p class="font-body-sm text-body-sm text-on-surface-variant">
          Se generará una sábana de datos en Microsoft Excel (.XLSX) con el detalle cronológico de incapacidades, costos directos estimados, prórrogas y cálculo de índices ILI/IF según Circular Unificada 2004.
        </p>
<div class="p-base bg-surface-container-low rounded-lg space-y-1 text-[12px]">
<span class="font-bold text-on-surface block">Campos incluidos en el reporte:</span>
<span class="text-on-surface-variant block">• Cédula, Nombre, Empresa, Centro de Costos / Finca</span>
<span class="text-on-surface-variant block">• Código CIE-10, Diagnóstico y Clasificación Origen</span>
<span class="text-on-surface-variant block">• Días totales, Días cobrados a EPS (&gt; 2 días) y ARL</span>
<span class="text-on-surface-variant block">• Trazabilidad de Exámenes de Reintegro y Restricciones</span>
</div>
<div class="flex items-center justify-end gap-sm pt-2">
<button class="px-3.5 py-1.5 rounded-lg bg-surface-container text-on-surface font-label-md text-label-md" onclick="document.getElementById('export-modal').classList.add('hidden')">Cerrar</button>
<button class="px-4 py-1.5 rounded-lg bg-primary text-on-primary font-label-md text-label-md font-bold flex items-center gap-1.5" onclick="simulateExport()">
<span class="material-symbols-outlined text-[16px]">file_download</span> Descargar Ahora
          </button>
</div>
</div>
</div>
</div>
</div>
<!-- SCRIPTS INTERACTIVOS PARAMÉTRICOS -->
<script>
  function toggleQuickRegisterDrawer() {
    const drawer = document.getElementById('quickRegisterDrawer');
    drawer.classList.toggle('hidden');
  }

function openPostExamModal() {
const modal = document.getElementById('postExamModal');
modal.classList.toggle('hidden');
}

function autoFillWorkerData() {
const select = document.getElementById('workerSelect');
const selectedOption = select.options[select.selectedIndex];
const card = document.getElementById('workerDataCard');

    if (select.value === "") {
      card.classList.add('hidden');
      return;
    }

    card.classList.remove('hidden');
    const cargo = selectedOption.getAttribute('data-cargo');
    const finca = selectedOption.getAttribute('data-finca');
    const dias = selectedOption.getAttribute('data-dias-acum');

    document.getElementById('autoCargoFinca').textContent = cargo + " (" + finca + ")";
    document.getElementById('autoDiasAcum').textContent = dias + " días acumulados";

    calculateDaysAndFlags();

}

function calculateDaysAndFlags() {
const inicioVal = document.getElementById('inputFechaInicio').value;
const finVal = document.getElementById('inputFechaFin').value;
const select = document.getElementById('workerSelect');
const selectedOption = select.options[select.selectedIndex];

    let diasPrevios = 0;
    if (selectedOption && selectedOption.getAttribute('data-dias-acum')) {
      diasPrevios = parseInt(selectedOption.getAttribute('data-dias-acum'), 10) || 0;
    }

    let diasOrden = 0;
    if (inicioVal && finVal) {
      const dInicio = new Date(inicioVal);
      const dFin = new Date(finVal);
      const diffTime = dFin - dInicio;
      if (diffTime >= 0) {
        diasOrden = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
      }
    }

    document.getElementById('inputDiasOrden').value = diasOrden;
    const totalAcum = diasPrevios + diasOrden;
    document.getElementById('badgeTotalAcumulado').textContent = totalAcum + " días";

    // Regla de Prórroga: si hay días previos > 0 y días acumulados > 30 se marca prórroga crítica
    const prorrogaBadge = document.getElementById('badgeProrrogaFlag');
    if (diasPrevios > 0) {
      if (totalAcum > 30) {
        prorrogaBadge.textContent = "SÍ - Continua > 30 Días";
        prorrogaBadge.className = "px-2 py-0.5 rounded bg-error-container text-on-error-container font-bold text-[11px]";
      } else {
        prorrogaBadge.textContent = "SÍ (Prórroga Estándar)";
        prorrogaBadge.className = "px-2 py-0.5 rounded bg-secondary-fixed text-on-secondary-fixed font-bold text-[11px]";
      }
    } else {
      prorrogaBadge.textContent = "NO (Incapacidad Inicial)";
      prorrogaBadge.className = "px-2 py-0.5 rounded bg-surface-container text-on-surface font-semibold text-[11px]";
    }

    // Regla de Reintegro: si la orden o acumulado supera 15 días, marcar Reintegro Requerido como 'SÍ'
    const reintegroBadge = document.getElementById('badgeReintegroFlag');
    if (diasOrden > 15 || totalAcum > 15) {
      reintegroBadge.textContent = "SÍ - Examen Post-Incapacidad Obligatorio";
      reintegroBadge.className = "px-2 py-0.5 rounded bg-error text-on-error font-bold text-[11px]";
    } else {
      reintegroBadge.textContent = "NO Requerido (Retorno Regular)";
      reintegroBadge.className = "px-2 py-0.5 rounded bg-surface-container-high text-primary font-semibold text-[11px]";
    }

}

function updateFileName(input) {
if (input.files && input.files[0]) {
document.getElementById('uploadText').textContent = "Cargado: " + input.files[0].name;
}
}

function handleFormSubmit(event) {
event.preventDefault();
alert('Incapacidad registrada exitosamente con validación de prórroga y trazabilidad médica en Grupo Manzanares S.A.S.');
toggleQuickRegisterDrawer();
}

function handlePostExamSubmit(event) {
event.preventDefault();
alert('Cita médica ocupacional de post-incapacidad solicitada a la IPS. Notificación generada al colaborador.');
openPostExamModal();
}

function previewPdf(filename) {
alert('Visualizando archivo escaneado: ' + filename + '\n(Certificado oficial EPS / ARL Sura debidamente verificado).');
}

function openEditModal(id) {
alert('Abriendo ficha técnica de incapacidad ' + id + ' para actualizar notas de seguimiento telefónico y evolución.');
}

function openReintegroModal(id) {
alert('Abriendo formato de Acta de Reintegro Laboral con verificación de aptitud médica y restricciones para el caso ' + id);
}

function openQuickContact(nombre, telefono) {
alert('Contactando a ' + nombre + ' (' + telefono + ')\nCanal directo SST Manzanares.');
}

function viewRecord(id) {
alert('Consultando expediente integral de SST para el colaborador con ID: ' + id);
}

function simulateExport() {
alert('Descargando: INFORME_AUSENTISMO_MEDICO_MANZANARES_2024.xlsx\nGeneración conforme a Circular Unificada de la Dirección General de Riesgos Laborales.');
document.getElementById('export-modal').classList.add('hidden');
}

function filterTable() {
const searchVal = document.getElementById('tableSearch').value.toLowerCase();
const origenVal = document.getElementById('filterOrigen').value.toLowerCase();
const estadoVal = document.getElementById('filterEstado').value.toLowerCase();
const reintegroVal = document.getElementById('filterReintegro').value.toLowerCase();

    const table = document.getElementById('incapacidadesTable');
    const tr = table.getElementsByTagName('tr');

    for (let i = 1; i < tr.length; i++) {
      const rowText = tr[i].textContent.toLowerCase();
      let matchSearch = rowText.includes(searchVal);
      let matchOrigen = origenVal === "" || rowText.includes(origenVal);
      let matchEstado = estadoVal === "" || rowText.includes(estadoVal);
      let matchReintegro = reintegroVal === "" || rowText.includes(reintegroVal);

      if (matchSearch && matchOrigen && matchEstado && matchReintegro) {
        tr[i].style.display = "";
      } else {
        tr[i].style.display = "none";
      }
    }

}
</script></main></div></body></html>
