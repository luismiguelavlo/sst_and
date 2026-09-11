9. TRABAJO EN ALTURAS
   Crear módulo específico.
   Campos:
   • Trabajador
   • Nivel/formación
   • Fecha de formación
   • Fecha vencimiento
   • Reentrenamiento
   • Certificado
   • Examen médico
   • Fecha examen
   • Vencimiento examen
   • Concepto de aptitud
   • Estado
   • Observaciones
   Dashboard:
   • Trabajadores habilitados
   • Vencidos
   • Próximos a vencer
   • Exámenes pendientes
   • Documentación pendiente
   Mostrar claramente:
   NO AUTORIZADO PARA ALTURAS
   cuando falte algún requisito configurado.

---

10. TRACTORISTAS / OPERADORES
    Crear módulo específico para personal de fincas.
    Campos:
    • Trabajador
    • Finca
    • Equipo
    • Tipo de equipo
    • Capacitación
    • Fecha capacitación
    • Fecha de vencimiento/reentrenamiento
    • Licencia cuando corresponda
    • Examen ocupacional
    • Aptitud
    • Inducción
    • Estado
    • Observaciones
    Crear sección:
    ⚠️ PERSONAL NO AUTORIZADO PARA OPERAR
    Debe identificar automáticamente:
    • Formación vencida
    • Formación pendiente
    • Documentación pendiente
    • Aptitud pendiente
    • Requisitos incompletos

---

11. PESV
    Crear módulo integrado con trabajadores y vehículos.
    Conductores
    • Trabajador
    • Cargo
    • Tipo de vehículo
    • Placa
    • Licencia
    • Categoría
    • Fecha vencimiento licencia
    • Curso seguridad vial
    • Examen médico
    • Autorización para conducir
    • Estado
    Vehículos
    • Placa
    • Tipo
    • Marca
    • Modelo
    • Responsable
    • Centro de trabajo
    • Estado
    Indicadores
    • % preoperacionales realizados
    • Conductores autorizados
    • Vehículos inspeccionados
    • Documentos próximos a vencer
    • Incidentes viales
    • Accidentes viales
    • Kilómetros recorridos
    • Hallazgos

<!DOCTYPE html>

<html lang="es"><head><meta charset="utf-8"/><meta content="width=device-width, initial-scale=1.0" name="viewport"/><link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&amp;display=swap" rel="stylesheet"/><link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" rel="stylesheet"/>
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet"/><style>@layer base{html,body{margin:0;padding:0;}body{overscroll-behavior:none;}main>:first-child{margin-top:0!important;}main>:last-child{margin-bottom:0!important;}}::-webkit-scrollbar{display:none;}</style><script src="https://cdn.tailwindcss.com"></script><script id="tailwind-config">tailwind.config={darkMode:"class",theme:{extend:{"colors":{"secondary-fixed":"#e1e0ff","surface-container":"#e6eeff","tertiary-fixed":"#e0e3e5","on-tertiary-fixed-variant":"#444749","on-primary-fixed":"#000d60","error-container":"#ffdad6","on-background":"#0d1c2e","surface-container-high":"#dce9ff","on-primary":"#ffffff","error":"#ba1a1a","tertiary-container":"#404345","primary":"#142175","secondary-container":"#6063ee","outline":"#767682","surface-bright":"#f8f9ff","primary-container":"#2e3a8c","secondary":"#4648d4","surface-container-low":"#eff4ff","inverse-surface":"#233144","on-tertiary-fixed":"#191c1e","primary-fixed-dim":"#bcc3ff","on-primary-container":"#9ea9ff","tertiary-fixed-dim":"#c4c7c9","on-secondary-container":"#fffbff","on-secondary-fixed-variant":"#2f2ebe","primary-fixed":"#dfe0ff","surface-tint":"#4b57aa","on-surface-variant":"#454651","on-error":"#ffffff","inverse-on-surface":"#eaf1ff","on-tertiary-container":"#adb0b2","surface-container-highest":"#d5e3fc","outline-variant":"#c6c5d3","on-primary-fixed-variant":"#333f91","on-tertiary":"#ffffff","on-secondary-fixed":"#07006c","surface-variant":"#d5e3fc","surface-dim":"#ccdbf3","inverse-primary":"#bcc3ff","tertiary":"#2a2d2f","surface-container-lowest":"#ffffff","on-secondary":"#ffffff","background":"#f8f9ff","secondary-fixed-dim":"#c0c1ff","on-surface":"#0d1c2e","surface":"#f8f9ff","on-error-container":"#93000a"},"borderRadius":{"DEFAULT":"0.25rem","lg":"0.5rem","xl":"0.75rem","full":"9999px"},"spacing":{"base":"8px","gutter":"24px","xs":"4px","xl":"80px","sm":"12px","lg":"48px","container-max":"1280px","md":"24px"},"fontFamily":{"body-md":["Inter"],"display-lg":["Inter"],"label-md":["Inter"],"headline-lg-mobile":["Inter"],"body-sm":["Inter"],"headline-lg":["Inter"],"label-sm":["Inter"],"headline-md":["Inter"],"body-lg":["Inter"]},"fontSize":{"body-md":["16px",{"lineHeight":"24px","fontWeight":"400"}],"display-lg":["48px",{"lineHeight":"56px","letterSpacing":"-0.02em","fontWeight":"700"}],"label-md":["14px",{"lineHeight":"16px","letterSpacing":"0.01em","fontWeight":"500"}],"headline-lg-mobile":["24px",{"lineHeight":"32px","fontWeight":"600"}],"body-sm":["14px",{"lineHeight":"20px","fontWeight":"400"}],"headline-lg":["32px",{"lineHeight":"40px","letterSpacing":"-0.01em","fontWeight":"600"}],"label-sm":["12px",{"lineHeight":"14px","fontWeight":"600"}],"headline-md":["24px",{"lineHeight":"32px","fontWeight":"600"}],"body-lg":["18px",{"lineHeight":"28px","fontWeight":"400"}]}}}}</script></head><body class="bg-surface font-body-md text-body-md text-on-surface antialiased"><aside class="fixed left-0 top-0 h-screen w-72 bg-surface-container-lowest shadow-[0_1px_8px_rgba(0,0,0,0.04)] z-50 flex flex-col"><div class="h-16 px-gutter flex items-center gap-sm bg-surface-container-low"><div class="w-8 h-8 rounded-lg bg-primary flex items-center justify-center"><span class="material-symbols-outlined text-on-primary text-[20px]">verified_user</span></div><div class="flex flex-col"><span class="font-label-md text-label-md text-primary font-bold tracking-tight">GRUPO MANZANARES</span><span class="font-label-sm text-[10px] text-on-surface-variant font-medium tracking-wider uppercase">SG-SST Integral S.A.S.</span></div></div><div class="px-md py-sm bg-surface-container-highest flex items-center justify-between"><span class="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider font-semibold">Estándares Mínimos</span><span class="px-base py-xs rounded-full bg-primary-container text-on-primary-container font-label-sm text-label-sm font-semibold">Res. 0312</span></div><nav class="flex-1 overflow-y-auto px-sm py-sm space-y-md" data-active-classes="bg-primary-container text-on-primary font-semibold"><div class="space-y-xs"><div class="px-base py-xs font-label-sm text-label-sm uppercase tracking-wider text-outline font-semibold">Gestión Operativa</div><a class="flex items-center gap-sm px-base py-xs rounded-lg text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface transition-colors" data-path="inicio-dashboard" href="#"><span class="material-symbols-outlined text-[20px]">home</span><span class="font-label-md text-label-md">Inicio / Dashboard</span></a><a class="flex items-center gap-sm px-base py-xs rounded-lg text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface transition-colors" data-path="trabajadores" href="#"><span class="material-symbols-outlined text-[20px]">engineering</span><span class="font-label-md text-label-md">Trabajadores</span></a><a class="flex items-center gap-sm px-base py-xs rounded-lg text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface transition-colors" data-path="examenes-medicos-emos" href="#"><span class="material-symbols-outlined text-[20px]">stethoscope</span><span class="font-label-md text-label-md">Exámenes Médicos (EMOS)</span></a><a class="flex items-center gap-sm px-base py-xs rounded-lg text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface transition-colors" data-path="casos-de-salud" href="#"><span class="material-symbols-outlined text-[20px]">local_hospital</span><span class="font-label-md text-label-md">Casos de Salud</span></a><a class="flex items-center gap-sm px-base py-xs rounded-lg text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface transition-colors" data-path="incapacidades-y-reintegros" href="#"><span class="material-symbols-outlined text-[20px]">event_available</span><span class="font-label-md text-label-md">Incapacidades y Reintegros</span></a></div><div class="space-y-xs"><div class="px-base py-xs font-label-sm text-label-sm uppercase tracking-wider text-outline font-semibold">Riesgos Críticos &amp; Viales</div><a aria-current="page" class="flex items-center gap-sm px-base py-xs rounded-lg transition-colors bg-primary-container text-on-primary font-semibold" data-path="trabajo-en-alturas" href="#"><span class="material-symbols-outlined text-[20px]">stairs</span><span class="font-label-md text-label-md">Trabajo en Alturas</span></a><a class="flex items-center gap-sm px-base py-xs rounded-lg text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface transition-colors" data-path="tractoristas-operadores" href="#"><span class="material-symbols-outlined text-[20px]">agriculture</span><span class="font-label-md text-label-md">Tractoristas / Operadores</span></a><a class="flex items-center gap-sm px-base py-xs rounded-lg text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface transition-colors" data-path="pesv-seguridad-vial" href="#"><span class="material-symbols-outlined text-[20px]">directions_car</span><span class="font-label-md text-label-md">PESV (Seguridad Vial)</span></a><a class="flex items-center gap-sm px-base py-xs rounded-lg text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface transition-colors" data-path="epp" href="#"><span class="material-symbols-outlined text-[20px]">security</span><span class="font-label-md text-label-md">EPP</span></a></div><div class="space-y-xs"><div class="px-base py-xs font-label-sm text-label-sm uppercase tracking-wider text-outline font-semibold">Inspección &amp; Eventos</div><a class="flex items-center gap-sm px-base py-xs rounded-lg text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface transition-colors" data-path="inspecciones" href="#"><span class="material-symbols-outlined text-[20px]">search</span><span class="font-label-md text-label-md">Inspecciones</span></a><a class="flex items-center gap-sm px-base py-xs rounded-lg text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface transition-colors" data-path="accidentes-e-incidentes" href="#"><span class="material-symbols-outlined text-[20px]">notification_important</span><span class="font-label-md text-label-md">Accidentes e Incidentes</span></a><a class="flex items-center gap-sm px-base py-xs rounded-lg text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface transition-colors" data-path="investigaciones" href="#"><span class="material-symbols-outlined text-[20px]">fact_check</span><span class="font-label-md text-label-md">Investigaciones</span></a><a class="flex items-center gap-sm px-base py-xs rounded-lg text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface transition-colors" data-path="acciones-correctivas" href="#"><span class="material-symbols-outlined text-[20px]">build</span><span class="font-label-md text-label-md">Acciones Correctivas</span></a></div><div class="space-y-xs"><div class="px-base py-xs font-label-sm text-label-sm uppercase tracking-wider text-outline font-semibold">Comités &amp; Cultura</div><a class="flex items-center gap-sm px-base py-xs rounded-lg text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface transition-colors" data-path="capacitaciones" href="#"><span class="material-symbols-outlined text-[20px]">school</span><span class="font-label-md text-label-md">Capacitaciones</span></a><a class="flex items-center gap-sm px-base py-xs rounded-lg text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface transition-colors" data-path="documentos-sg-sst" href="#"><span class="material-symbols-outlined text-[20px]">description</span><span class="font-label-md text-label-md">Documentos SG-SST</span></a><a class="flex items-center gap-sm px-base py-xs rounded-lg text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface transition-colors" data-path="copasst" href="#"><span class="material-symbols-outlined text-[20px]">groups</span><span class="font-label-md text-label-md">COPASST</span></a><a class="flex items-center gap-sm px-base py-xs rounded-lg text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface transition-colors" data-path="ccl" href="#"><span class="material-symbols-outlined text-[20px]">handshake</span><span class="font-label-md text-label-md">CCL</span></a><a class="flex items-center gap-sm px-base py-xs rounded-lg text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface transition-colors" data-path="emergencias" href="#"><span class="material-symbols-outlined text-[20px]">fire_extinguisher</span><span class="font-label-md text-label-md">Emergencias</span></a><a class="flex items-center gap-sm px-base py-xs rounded-lg text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface transition-colors" data-path="quimicos" href="#"><span class="material-symbols-outlined text-[20px]">science</span><span class="font-label-md text-label-md">Químicos</span></a></div><div class="space-y-xs"><div class="px-base py-xs font-label-sm text-label-sm uppercase tracking-wider text-outline font-semibold">Estrategia &amp; Control</div><a class="flex items-center gap-sm px-base py-xs rounded-lg text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface transition-colors" data-path="analisis-sst" href="#"><span class="material-symbols-outlined text-[20px]">monitoring</span><span class="font-label-md text-label-md">Análisis SST</span></a><a class="flex items-center gap-sm px-base py-xs rounded-lg text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface transition-colors" data-path="configuracion" href="#"><span class="material-symbols-outlined text-[20px]">settings</span><span class="font-label-md text-label-md">Configuración</span></a></div></nav><div class="p-md bg-surface-container-low"><div class="flex items-center gap-xs"><span class="w-2 h-2 rounded-full bg-secondary"></span><span class="font-label-sm text-label-sm text-on-surface-variant font-medium">Decreto 1072 / Res 4272</span></div><p class="font-label-sm text-[11px] text-outline mt-xs">Versión Auditada 2024.1</p></div></aside><div class="pl-72 min-h-screen bg-surface flex flex-col"><header class="fixed top-0 left-72 right-0 h-16 bg-surface/90 backdrop-blur-xl shadow-[0_1px_8px_rgba(0,0,0,0.04)] z-40"><div class="h-16 px-gutter flex items-center justify-between"><div class="flex items-center gap-md"><div class="flex items-center gap-xs"><span class="font-label-md text-label-md font-semibold text-primary">Grupo Manzanares S.A.S.</span><span class="text-outline-variant font-body-sm text-body-sm">|</span><span class="font-label-md text-label-md text-on-surface-variant">Sistema Integrado SG-SST</span></div><div class="hidden xl:flex items-center gap-xs px-base py-xs rounded-full bg-surface-container-high"><span class="material-symbols-outlined text-[16px] text-primary">verified</span><span class="font-label-sm text-label-sm text-on-surface">Dec. 1072 / Res. 0312 / PESV Res. 40595</span></div></div><div class="flex items-center gap-md"><div class="flex items-center gap-xs px-base py-xs rounded-full bg-surface-container-low"><span class="w-2 h-2 rounded-full bg-secondary-container animate-pulse"></span><span class="font-label-sm text-label-sm text-on-surface-variant font-medium">Sincronizado</span></div><button class="flex items-center gap-xs px-base py-xs rounded-lg bg-error text-on-error font-label-md text-label-md shadow-sm hover:opacity-90 transition-opacity" type="button"><span class="material-symbols-outlined text-[18px]">warning</span><span>Reporte Rápido</span></button><div class="h-6 w-[1px] bg-outline-variant"></div><div class="flex items-center gap-sm"><div class="flex flex-col text-right hidden sm:flex"><span class="font-label-md text-label-md font-semibold text-on-surface leading-tight">Ing. Andrés Valencia</span><span class="font-label-sm text-label-sm text-outline leading-tight">Coordinador SG-SST</span></div><div class="w-8 h-8 rounded-full bg-primary flex items-center justify-center"><span class="material-symbols-outlined text-on-primary text-[18px]">person</span></div></div></div></div></header><main class="w-full pt-16 flex-1 px-gutter py-md bg-surface"><div class="flex flex-col w-full space-y-gutter">
<!-- 1. ENCABEZADO Y CONTEXTO NORMATIVO -->
<section class="flex flex-col xl:flex-row xl:items-center justify-between gap-md">
<div class="space-y-xs max-w-4xl">
<div class="flex items-center gap-xs">
<span class="px-base py-xs rounded-full bg-primary-container text-on-primary-container font-label-sm text-label-sm uppercase tracking-wider font-semibold">
          Resolución 4272 de 2021 | MinTrabajo Colombia
        </span>
<span class="text-outline font-label-sm text-label-sm">•</span>
<span class="font-label-sm text-label-sm text-primary font-semibold">Estándar Crítico SG-SST</span>
</div>
<h1 class="font-headline-lg text-headline-lg text-on-surface font-bold tracking-tight">
        9. Programa de Prevención y Protección Contra Caídas en Alturas
      </h1>
<p class="font-body-md text-body-md text-on-surface-variant leading-relaxed">
        Control estricto de aptitud médica psicofísica, certificación reglamentaria de formación, reentrenamientos vigentes y bloqueo preventivo para labores con riesgo de caída a más de 2.0 metros en predios e infraestructura de Grupo Manzanares S.A.S.
      </p>
</div>
<!-- Botones de Acción Superior -->
<div class="flex flex-wrap items-center gap-sm shrink-0">
<button class="flex items-center gap-xs px-md py-sm rounded-lg bg-primary text-on-primary font-label-md text-label-md font-semibold shadow-md hover:bg-primary-container transition-all" type="button">
<span class="material-symbols-outlined text-[20px]">add_task</span>
<span>+ Programar Reentrenamiento</span>
</button>
<button class="flex items-center gap-xs px-md py-sm rounded-lg bg-surface-container-highest text-primary font-label-md text-label-md font-semibold hover:bg-surface-container-high transition-colors" type="button">
<span class="material-symbols-outlined text-[20px]">fact_check</span>
<span>Auditar Permisos (PTA)</span>
</button>
<button class="flex items-center gap-xs px-md py-sm rounded-lg bg-surface-container-lowest text-on-surface font-label-md text-label-md font-semibold shadow-sm hover:bg-surface-container-low transition-colors" type="button">
<span class="material-symbols-outlined text-[20px] text-primary">download</span>
<span>Exportar Matriz Alturas (.XLSX)</span>
</button>
</div>
</section>
<!-- 2. DASHBOARD DE INDICADORES CLAVE (5 TARJETAS SUPERIORES) -->
<section class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-md">
<!-- Tarjeta 1: Habilitados -->
<div class="relative overflow-hidden p-md rounded-xl bg-surface-container-lowest shadow-sm flex flex-col justify-between">
<div class="flex items-center justify-between mb-xs">
<span class="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider font-semibold">Trabajadores Habilitados</span>
<div class="w-8 h-8 rounded-full bg-secondary-fixed flex items-center justify-center text-primary">
<span class="material-symbols-outlined text-[20px]">verified</span>
</div>
</div>
<div>
<div class="flex items-baseline gap-xs">
<span class="font-display-lg text-display-lg font-bold text-primary">142</span>
<span class="font-label-sm text-label-sm text-secondary font-semibold">81.1%</span>
</div>
<p class="font-body-sm text-body-sm text-on-surface-variant mt-xs line-clamp-2">
          100% requisitos al día: certificado SENA/Centro avalado y EMO alturas apto.
        </p>
</div>
<div class="w-full bg-surface-container-high h-2 rounded-full mt-sm overflow-hidden">
<div class="bg-secondary h-full rounded-full w-[81%]"></div>
</div>
</div>
<!-- Tarjeta 2: Vencidos (Alerta Roja) -->
<div class="relative overflow-hidden p-md rounded-xl bg-surface-container-lowest shadow-sm flex flex-col justify-between">
<div class="flex items-center justify-between mb-xs">
<span class="font-label-sm text-label-sm text-error uppercase tracking-wider font-semibold">Vencidos (Bloqueo)</span>
<div class="w-8 h-8 rounded-full bg-error-container flex items-center justify-center text-error">
<span class="material-symbols-outlined text-[20px]">block</span>
</div>
</div>
<div>
<div class="flex items-baseline gap-xs">
<span class="font-display-lg text-display-lg font-bold text-error">8</span>
<span class="font-label-sm text-label-sm text-error font-semibold">Inactivos PTA</span>
</div>
<p class="font-body-sm text-body-sm text-on-surface-variant mt-xs line-clamp-2">
          Certificación o EMO caducado. Bloqueo automático sobre 2.0 m.
        </p>
</div>
<div class="w-full bg-surface-container-high h-2 rounded-full mt-sm overflow-hidden">
<div class="bg-error h-full rounded-full w-[100%]"></div>
</div>
</div>
<!-- Tarjeta 3: Próximos a Vencer -->
<div class="relative overflow-hidden p-md rounded-xl bg-surface-container-lowest shadow-sm flex flex-col justify-between">
<div class="flex items-center justify-between mb-xs">
<span class="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider font-semibold">Próx. a Vencer (&lt; 30d)</span>
<div class="w-8 h-8 rounded-full bg-surface-container-high flex items-center justify-center text-primary-container">
<span class="material-symbols-outlined text-[20px]">pending_actions</span>
</div>
</div>
<div>
<div class="flex items-baseline gap-xs">
<span class="font-display-lg text-display-lg font-bold text-on-surface">14</span>
<span class="font-label-sm text-label-sm text-primary font-semibold">Prioritarios</span>
</div>
<p class="font-body-sm text-body-sm text-on-surface-variant mt-xs line-clamp-2">
          Lista prioritaria para cupos de reentrenamiento anual de 8 horas.
        </p>
</div>
<div class="w-full bg-surface-container-high h-2 rounded-full mt-sm overflow-hidden">
<div class="bg-primary-container h-full rounded-full w-[45%]"></div>
</div>
</div>
<!-- Tarjeta 4: Exámenes Pendientes -->
<div class="relative overflow-hidden p-md rounded-xl bg-surface-container-lowest shadow-sm flex flex-col justify-between">
<div class="flex items-center justify-between mb-xs">
<span class="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider font-semibold">Exámenes Pendientes</span>
<div class="w-8 h-8 rounded-full bg-surface-container-high flex items-center justify-center text-on-surface">
<span class="material-symbols-outlined text-[20px]">medical_services</span>
</div>
</div>
<div>
<div class="flex items-baseline gap-xs">
<span class="font-display-lg text-display-lg font-bold text-on-surface">6</span>
<span class="font-label-sm text-label-sm text-outline font-semibold">En Clínica</span>
</div>
<p class="font-body-sm text-body-sm text-on-surface-variant mt-xs line-clamp-2">
          EMO alturas vencido o pendiente concepto acrofobia/osteomuscular.
        </p>
</div>
<div class="w-full bg-surface-container-high h-2 rounded-full mt-sm overflow-hidden">
<div class="bg-outline h-full rounded-full w-[25%]"></div>
</div>
</div>
<!-- Tarjeta 5: Documentación Pendiente -->
<div class="relative overflow-hidden p-md rounded-xl bg-surface-container-lowest shadow-sm flex flex-col justify-between">
<div class="flex items-center justify-between mb-xs">
<span class="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider font-semibold">Docs. Pendientes</span>
<div class="w-8 h-8 rounded-full bg-surface-container-high flex items-center justify-center text-tertiary">
<span class="material-symbols-outlined text-[20px]">folder_special</span>
</div>
</div>
<div>
<div class="flex items-baseline gap-xs">
<span class="font-display-lg text-display-lg font-bold text-on-surface">5</span>
<span class="font-label-sm text-label-sm text-tertiary font-semibold">Por Validar</span>
</div>
<p class="font-body-sm text-body-sm text-on-surface-variant mt-xs line-clamp-2">
          Pendientes de validación QR en plataforma del Ministerio de Trabajo.
        </p>
</div>
<div class="w-full bg-surface-container-high h-2 rounded-full mt-sm overflow-hidden">
<div class="bg-tertiary h-full rounded-full w-[18%]"></div>
</div>
</div>
</section>
<!-- 3. BANNER DE ALERTA LEGAL Y BLOQUEO AUTOMÁTICO -->
<section class="p-md rounded-xl bg-error-container text-on-error-container shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-md relative overflow-hidden">
<div class="flex items-start gap-md">
<div class="p-base rounded-lg bg-error text-on-error shrink-0">
<span class="material-symbols-outlined text-[32px]">gavel</span>
</div>
<div class="space-y-xs">
<div class="flex flex-wrap items-center gap-sm">
<span class="px-base py-xs rounded-full bg-error text-on-error font-label-sm text-label-sm font-bold tracking-wide uppercase">
            ESTATUS OPERATIVO: NO AUTORIZADO PARA ALTURAS
          </span>
<span class="font-label-sm text-label-sm font-bold text-error">
            RIGOR RES. 4272/2021 ART. 11 Y ART. 27
          </span>
</div>
<p class="font-body-md text-body-md text-on-error-container max-w-4xl font-medium">
          Cualquier falta de requisito (Formación vencida, EMO vencido, concepto no apto o documento faltante) activa un <strong>bloqueo informático en tiempo real</strong>. El sistema rechaza la expedición del Permiso de Trabajo en Alturas (PTA) y notifica por SMS/WhatsApp al Capataz de Finca y Coordinador SST ante cualquier intento de asignación a cosecha en altura, mantenimiento de techos o poda mayor a 2.0 m.
        </p>
</div>
</div>
<div class="shrink-0 flex items-center gap-xs">
<button class="px-base py-xs rounded-lg bg-error text-on-error font-label-sm text-label-sm font-semibold hover:opacity-90 transition-opacity" type="button">
        Ver Protocolo Bloqueo
      </button>
</div>
</section>
<!-- 4. FILTROS PARAMÉTRICOS AVANZADOS -->
<section class="p-md rounded-xl bg-surface-container-lowest shadow-sm space-y-md">
<div class="flex flex-col lg:flex-row gap-md items-stretch lg:items-center justify-between">
<!-- Búsqueda rápida -->
<div class="relative flex-1">
<span class="material-symbols-outlined absolute left-base top-1/2 -translate-y-1/2 text-outline text-[20px]">search</span>
<input class="w-full pl-lg pr-base py-sm rounded-lg bg-surface-container-low text-on-surface font-body-sm text-body-sm placeholder:text-outline focus:outline-none focus:bg-surface-container-lowest focus:ring-2 focus:ring-primary transition-all" id="searchWorker" placeholder="Buscar trabajador por nombre, cédula (CC) o código folio..." type="text"/>
</div>
<!-- Selectores de Filtro -->
<div class="grid grid-cols-2 sm:grid-cols-4 gap-sm flex-1 lg:flex-none">
<!-- Finca -->
<select class="px-base py-sm rounded-lg bg-surface-container-low text-on-surface font-label-md text-label-md focus:outline-none focus:ring-2 focus:ring-primary cursor-pointer">
<option value="">Todas las Fincas</option>
<option value="la-esperanza">Finca La Esperanza</option>
<option value="el-paraiso">Finca El Paraíso</option>
<option value="san-jose">Finca San José</option>
<option value="bella-vista">Finca Bella Vista</option>
</select>
<!-- Nivel de Formación -->
<select class="px-base py-sm rounded-lg bg-surface-container-low text-on-surface font-label-md text-label-md focus:outline-none focus:ring-2 focus:ring-primary cursor-pointer">
<option value="">Nivel Formación (Todos)</option>
<option value="autorizado">Trabajador Autorizado (32h)</option>
<option value="reentrenamiento">Reentrenamiento Anual (8h)</option>
<option value="coordinador">Coordinador de Alturas (80h)</option>
<option value="jefe">Jefe de Área para Trabajos</option>
</select>
<!-- Concepto Médico -->
<select class="px-base py-sm rounded-lg bg-surface-container-low text-on-surface font-label-md text-label-md focus:outline-none focus:ring-2 focus:ring-primary cursor-pointer">
<option value="">Concepto Médico</option>
<option value="apto">Apto sin Restricciones</option>
<option value="apto-rec">Apto con Recomendación</option>
<option value="no-apto">No Apto (Vértigo / Limitación)</option>
</select>
<!-- Estado de Habilitación -->
<select class="px-base py-sm rounded-lg bg-surface-container-low text-on-surface font-label-md text-label-md focus:outline-none focus:ring-2 focus:ring-primary cursor-pointer">
<option value="">Estado Habilitación</option>
<option value="habilitado">Habilitado (Verde)</option>
<option value="bloqueado">NO AUTORIZADO (Rojo)</option>
</select>
</div>
</div>
</section>
<!-- 5. MATRIZ MAESTRA DE CONTROL DE ALTURAS -->
<section class="rounded-xl bg-surface-container-lowest shadow-sm overflow-hidden flex flex-col">
<div class="p-md flex items-center justify-between bg-surface-container-low">
<div class="flex items-center gap-xs">
<span class="material-symbols-outlined text-primary text-[22px]">table_rows</span>
<h2 class="font-headline-md text-headline-md text-on-surface font-semibold">
          Registro Maestro de Autorizaciones Operativas de Caídas
        </h2>
</div>
<span class="font-label-sm text-label-sm text-outline font-medium">Mostrando 5 registros prioritarios de 175 totales</span>
</div>
<div class="overflow-x-auto">
<table class="w-full text-left border-collapse">
<thead>
<tr class="bg-surface-container-highest text-on-surface-variant font-label-sm text-label-sm uppercase tracking-wider">
<th class="py-sm px-base">Trabajador</th>
<th class="py-sm px-base">Nivel / Formación</th>
<th class="py-sm px-base">F. Formación</th>
<th class="py-sm px-base">Venc. Formación</th>
<th class="py-sm px-base">Reentrenamiento</th>
<th class="py-sm px-base">Certificado</th>
<th class="py-sm px-base">Examen Médico (EMO)</th>
<th class="py-sm px-base">Concepto Aptitud</th>
<th class="py-sm px-base">Estado Autorización</th>
<th class="py-sm px-base">Observaciones Operativas</th>
</tr>
</thead>
<tbody class="divide-y divide-surface-container text-body-sm font-body-sm text-on-surface">
<!-- Fila 1: Habilitado -->
<tr class="hover:bg-surface-container-low transition-colors">
<td class="py-sm px-base">
<div class="flex items-center gap-sm">
<div class="w-8 h-8 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center font-bold text-[12px]">
                  CR
                </div>
<div class="flex flex-col min-w-0">
<span class="font-semibold text-primary truncate">Carlos Alberto Restrepo</span>
<span class="text-[12px] text-outline">CC 71.284.921 • Folio: MNZ-0089</span>
<span class="text-[11px] text-on-surface-variant">Operario Poda Mayor (Finca La Esperanza)</span>
</div>
</div>
</td>
<td class="py-sm px-base">
<span class="font-medium">Trabajador Autorizado</span>
<span class="block text-[11px] text-outline">32 Horas - Res. 4272</span>
</td>
<td class="py-sm px-base font-label-sm text-label-sm">15/09/2023</td>
<td class="py-sm px-base font-label-sm text-label-sm">
<div class="flex items-center gap-xs text-primary font-semibold">
<span class="material-symbols-outlined text-[16px]">event_upcoming</span>
<span>15/09/2024</span>
</div>
</td>
<td class="py-sm px-base">
<span class="inline-flex items-center gap-xs px-base py-xs rounded-full bg-secondary-fixed text-primary text-[11px] font-semibold">
<span class="w-1.5 h-1.5 rounded-full bg-primary"></span>
                Programado 28/10/2024
              </span>
</td>
<td class="py-sm px-base">
<a class="inline-flex items-center gap-xs text-secondary hover:underline font-label-sm text-label-sm font-semibold" href="#">
<span class="material-symbols-outlined text-[16px]">picture_as_pdf</span>
<span>SENA #938210</span>
</a>
<span class="block text-[10px] text-outline font-mono">MinTrabajo ID: OK</span>
</td>
<td class="py-sm px-base">
<div class="font-label-sm text-label-sm">
<span>10/10/2023</span>
<span class="block text-[11px] text-outline">Vence: 10/10/2024</span>
</div>
</td>
<td class="py-sm px-base">
<span class="px-base py-xs rounded-full bg-surface-container-high text-on-surface font-label-sm text-label-sm font-semibold inline-block">
                Apto sin restricciones
              </span>
</td>
<td class="py-sm px-base">
<span class="inline-flex items-center gap-xs px-base py-xs rounded-full bg-secondary-fixed text-primary font-bold text-label-sm">
<span class="material-symbols-outlined text-[16px]">check_circle</span>
                HABILITADO
              </span>
</td>
<td class="py-sm px-base text-[12px] text-on-surface-variant">
              Apto para podas con línea de vida retráctil y arnés dieléctrico.
            </td>
</tr>
<!-- Fila 2: BLOQUEADO (EMO Vencido) -->
<tr class="bg-error-container/20 hover:bg-error-container/30 transition-colors">
<td class="py-sm px-base">
<div class="flex items-center gap-sm">
<div class="w-8 h-8 rounded-full bg-error text-on-error flex items-center justify-center font-bold text-[12px]">
                  JM
                </div>
<div class="flex flex-col min-w-0">
<span class="font-semibold text-error truncate">Jorge Mario Londoño</span>
<span class="text-[12px] text-outline">CC 10.239.544 • Folio: MNZ-0145</span>
<span class="text-[11px] text-on-surface-variant">Mantenimiento Infraestructura (El Paraíso)</span>
</div>
</div>
</td>
<td class="py-sm px-base">
<span class="font-medium">Reentrenamiento Anual</span>
<span class="block text-[11px] text-outline">8 Horas - Centro Cafetero</span>
</td>
<td class="py-sm px-base font-label-sm text-label-sm">05/04/2023</td>
<td class="py-sm px-base font-label-sm text-label-sm">
<div class="flex items-center gap-xs text-error font-bold">
<span class="material-symbols-outlined text-[16px]">error</span>
<span>05/04/2024 (Vencido)</span>
</div>
</td>
<td class="py-sm px-base">
<span class="inline-flex items-center gap-xs px-base py-xs rounded-full bg-error-container text-error text-[11px] font-bold">
<span class="w-1.5 h-1.5 rounded-full bg-error"></span>
                Vencido
              </span>
</td>
<td class="py-sm px-base">
<a class="inline-flex items-center gap-xs text-error hover:underline font-label-sm text-label-sm" href="#">
<span class="material-symbols-outlined text-[16px]">sim_card_alert</span>
<span>Cert. Caducado</span>
</a>
<span class="block text-[10px] text-outline font-mono">Pendiente renovación</span>
</td>
<td class="py-sm px-base">
<div class="font-label-sm text-label-sm text-error font-semibold">
<span>02/03/2023</span>
<span class="block text-[11px] text-error">Venció: 02/03/2024</span>
</div>
</td>
<td class="py-sm px-base">
<span class="px-base py-xs rounded-full bg-error-container text-error font-label-sm text-label-sm font-semibold inline-block">
                EMO Vencido
              </span>
</td>
<td class="py-sm px-base">
<span class="inline-flex items-center gap-xs px-base py-xs rounded-full bg-error text-on-error font-bold text-label-sm shadow-sm animate-pulse">
<span class="material-symbols-outlined text-[16px]">block</span>
                ⛔ NO AUTORIZADO
              </span>
</td>
<td class="py-sm px-base text-[12px] text-error font-medium">
              Bloqueo automático activado. Prohibido expedir PTA para techos de beneficio.
            </td>
</tr>
<!-- Fila 3: Habilitado con Restricción Visual -->
<tr class="hover:bg-surface-container-low transition-colors">
<td class="py-sm px-base">
<div class="flex items-center gap-sm">
<div class="w-8 h-8 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center font-bold text-[12px]">
                  EA
                </div>
<div class="flex flex-col min-w-0">
<span class="font-semibold text-primary truncate">Elver Antonio Montoya</span>
<span class="text-[12px] text-outline">CC 94.482.019 • Folio: MNZ-0203</span>
<span class="text-[11px] text-on-surface-variant">Tractorista / Elevación (San José)</span>
</div>
</div>
</td>
<td class="py-sm px-base">
<span class="font-medium">Coordinador de Alturas</span>
<span class="block text-[11px] text-outline">80 Horas - Res. 4272</span>
</td>
<td class="py-sm px-base font-label-sm text-label-sm">11/11/2023</td>
<td class="py-sm px-base font-label-sm text-label-sm">
<div class="flex items-center gap-xs text-on-surface">
<span>11/11/2024</span>
</div>
</td>
<td class="py-sm px-base">
<span class="inline-flex items-center gap-xs px-base py-xs rounded-full bg-surface-container-high text-on-surface text-[11px] font-semibold">
<span class="w-1.5 h-1.5 rounded-full bg-secondary"></span>
                Vigente (34 días restantes)
              </span>
</td>
<td class="py-sm px-base">
<a class="inline-flex items-center gap-xs text-secondary hover:underline font-label-sm text-label-sm font-semibold" href="#">
<span class="material-symbols-outlined text-[16px]">verified</span>
<span>SST-COR-0112</span>
</a>
<span class="block text-[10px] text-outline font-mono">MinTrabajo ID: OK</span>
</td>
<td class="py-sm px-base">
<div class="font-label-sm text-label-sm">
<span>15/01/2024</span>
<span class="block text-[11px] text-outline">Vence: 15/01/2025</span>
</div>
</td>
<td class="py-sm px-base">
<span class="px-base py-xs rounded-full bg-surface-container-high text-on-surface font-label-sm text-label-sm font-semibold inline-block">
                Apto con lentes formulados
              </span>
</td>
<td class="py-sm px-base">
<span class="inline-flex items-center gap-xs px-base py-xs rounded-full bg-secondary-fixed text-primary font-bold text-label-sm">
<span class="material-symbols-outlined text-[16px]">check_circle</span>
                HABILITADO
              </span>
</td>
<td class="py-sm px-base text-[12px] text-on-surface-variant">
              Uso obligatorio de barbuquejo con 3 puntos de apoyo y gafas de seguridad formuladas.
            </td>
</tr>
<!-- Fila 4: BLOQUEADO (No Apto por Vértigo) -->
<tr class="bg-error-container/20 hover:bg-error-container/30 transition-colors">
<td class="py-sm px-base">
<div class="flex items-center gap-sm">
<div class="w-8 h-8 rounded-full bg-error text-on-error flex items-center justify-center font-bold text-[12px]">
                  MA
                </div>
<div class="flex flex-col min-w-0">
<span class="font-semibold text-error truncate">Mauricio Alejandro Gómez</span>
<span class="text-[12px] text-outline">CC 1.053.829.110 • Folio: MNZ-0312</span>
<span class="text-[11px] text-on-surface-variant">Auxiliar de Campo (Bella Vista)</span>
</div>
</div>
</td>
<td class="py-sm px-base">
<span class="font-medium">Trabajador Autorizado</span>
<span class="block text-[11px] text-outline">32 Horas - Vigente</span>
</td>
<td class="py-sm px-base font-label-sm text-label-sm">20/02/2024</td>
<td class="py-sm px-base font-label-sm text-label-sm">
<div class="flex items-center gap-xs text-on-surface">
<span>20/02/2025</span>
</div>
</td>
<td class="py-sm px-base">
<span class="inline-flex items-center gap-xs px-base py-xs rounded-full bg-surface-container-high text-on-surface text-[11px] font-semibold">
                Vigente
              </span>
</td>
<td class="py-sm px-base">
<a class="inline-flex items-center gap-xs text-secondary hover:underline font-label-sm text-label-sm" href="#">
<span class="material-symbols-outlined text-[16px]">picture_as_pdf</span>
<span>CEN-ARM-404</span>
</a>
</td>
<td class="py-sm px-base">
<div class="font-label-sm text-label-sm text-error font-semibold">
<span>12/03/2024</span>
<span class="block text-[11px] text-outline">Vence: 12/03/2025</span>
</div>
</td>
<td class="py-sm px-base">
<span class="px-base py-xs rounded-full bg-error-container text-error font-label-sm text-label-sm font-bold inline-block">
                No Apto (Acrofobia / Vértigo)
              </span>
</td>
<td class="py-sm px-base">
<span class="inline-flex items-center gap-xs px-base py-xs rounded-full bg-error text-on-error font-bold text-label-sm shadow-sm animate-pulse">
<span class="material-symbols-outlined text-[16px]">block</span>
                ⛔ NO AUTORIZADO
              </span>
</td>
<td class="py-sm px-base text-[12px] text-error font-medium">
              Concepto médico no apto para trabajo sobre 2.0 m. Reubicado a labores en suelo rasante.
            </td>
</tr>
<!-- Fila 5: Habilitado Operario Bodega -->
<tr class="hover:bg-surface-container-low transition-colors">
<td class="py-sm px-base">
<div class="flex items-center gap-sm">
<div class="w-8 h-8 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center font-bold text-[12px]">
                  DG
                </div>
<div class="flex flex-col min-w-0">
<span class="font-semibold text-primary truncate">Darío de Jesús Gallego</span>
<span class="text-[12px] text-outline">CC 16.392.401 • Folio: MNZ-0054</span>
<span class="text-[11px] text-on-surface-variant">Mantenimiento Silos (La Esperanza)</span>
</div>
</div>
</td>
<td class="py-sm px-base">
<span class="font-medium">Trabajador Autorizado</span>
<span class="block text-[11px] text-outline">32 Horas - Res. 4272</span>
</td>
<td class="py-sm px-base font-label-sm text-label-sm">18/06/2023</td>
<td class="py-sm px-base font-label-sm text-label-sm">
<div class="flex items-center gap-xs text-primary font-semibold">
<span>18/06/2024</span>
</div>
</td>
<td class="py-sm px-base">
<span class="inline-flex items-center gap-xs px-base py-xs rounded-full bg-secondary-fixed text-primary text-[11px] font-semibold">
<span class="w-1.5 h-1.5 rounded-full bg-primary"></span>
                Reentrenado 02/07/2024
              </span>
</td>
<td class="py-sm px-base">
<a class="inline-flex items-center gap-xs text-secondary hover:underline font-label-sm text-label-sm font-semibold" href="#">
<span class="material-symbols-outlined text-[16px]">picture_as_pdf</span>
<span>SENA #109482</span>
</a>
<span class="block text-[10px] text-outline font-mono">MinTrabajo ID: OK</span>
</td>
<td class="py-sm px-base">
<div class="font-label-sm text-label-sm">
<span>05/06/2024</span>
<span class="block text-[11px] text-outline">Vence: 05/06/2025</span>
</div>
</td>
<td class="py-sm px-base">
<span class="px-base py-xs rounded-full bg-surface-container-high text-on-surface font-label-sm text-label-sm font-semibold inline-block">
                Apto sin restricciones
              </span>
</td>
<td class="py-sm px-base">
<span class="inline-flex items-center gap-xs px-base py-xs rounded-full bg-secondary-fixed text-primary font-bold text-label-sm">
<span class="material-symbols-outlined text-[16px]">check_circle</span>
                HABILITADO
              </span>
</td>
<td class="py-sm px-base text-[12px] text-on-surface-variant">
              Requiere uso de línea vertical en cable de acero con freno para acceso a cúpula de silo.
            </td>
</tr>
</tbody>
</table>
</div>
<!-- Paginación y Resumen -->
<div class="p-base bg-surface-container-low flex flex-col sm:flex-row items-center justify-between gap-sm">
<div class="text-label-sm font-label-sm text-on-surface-variant">
        Página 1 de 35 • Control automático de firmas electrónicas de Permiso (PTA)
      </div>
<div class="flex items-center gap-xs">
<button class="px-base py-xs rounded bg-surface-container-highest text-outline font-label-sm text-label-sm cursor-not-allowed" type="button">Anterior</button>
<button class="px-base py-xs rounded bg-primary text-on-primary font-label-sm text-label-sm font-bold" type="button">1</button>
<button class="px-base py-xs rounded bg-surface-container-highest text-on-surface font-label-sm text-label-sm hover:bg-surface-container-high" type="button">2</button>
<button class="px-base py-xs rounded bg-surface-container-highest text-on-surface font-label-sm text-label-sm hover:bg-surface-container-high" type="button">3</button>
<button class="px-base py-xs rounded bg-surface-container-highest text-on-surface font-label-sm text-label-sm hover:bg-surface-container-high" type="button">Siguiente</button>
</div>
</div>
</section>
<!-- 6. PANEL INFERIOR DE PROTOCOLOS DE SEGURIDAD Y LOGÍSTICA -->
<section class="grid grid-cols-1 lg:grid-cols-3 gap-md">
<!-- Módulo 1: Centro de Entrenamiento y Cupos -->
<div class="p-md rounded-xl bg-surface-container-lowest shadow-sm flex flex-col justify-between space-y-md">
<div class="space-y-xs">
<div class="flex items-center justify-between">
<div class="flex items-center gap-xs text-primary font-semibold font-label-md text-label-md">
<span class="material-symbols-outlined text-[20px]">school</span>
<span>Centro de Entrenamiento Autorizado</span>
</div>
<span class="px-base py-xs rounded-full bg-secondary-fixed text-primary font-label-sm text-[11px] font-bold">Convenio Vigente</span>
</div>
<h3 class="font-headline-md text-headline-md text-on-surface font-semibold">Eje Cafetero Safety Center</h3>
<p class="font-body-sm text-body-sm text-on-surface-variant">
          Pista acreditada por MinTrabajo (Licencia SST 4892-2022). Reserva exclusiva de cupos para reentrenamientos obligatorios de 8 horas.
        </p>
</div>
<div class="p-sm rounded-lg bg-surface-container-low space-y-xs">
<div class="flex justify-between text-label-sm font-label-sm text-on-surface font-semibold">
<span>Próxima cohorte: 28 de Octubre</span>
<span class="text-secondary">10 / 15 Cupos Asignados</span>
</div>
<div class="w-full bg-surface-container-highest h-2 rounded-full overflow-hidden">
<div class="bg-secondary h-full rounded-full w-[66%]"></div>
</div>
<p class="text-[11px] text-outline">Incluye práctica de rescate vertical y rescate en estructuras agrícolas.</p>
</div>
<button class="w-full py-sm rounded-lg bg-surface-container-high text-primary font-label-md text-label-md font-semibold hover:bg-surface-container-highest transition-colors flex items-center justify-center gap-xs" type="button">
<span class="material-symbols-outlined text-[18px]">calendar_month</span>
<span>Gestionar Calendario de Formación</span>
</button>
</div>
<!-- Módulo 2: Validación de Permisos y Equipos Críticos -->
<div class="p-md rounded-xl bg-surface-container-lowest shadow-sm flex flex-col justify-between space-y-md">
<div class="space-y-xs">
<div class="flex items-center justify-between">
<div class="flex items-center gap-xs text-primary font-semibold font-label-md text-label-md">
<span class="material-symbols-outlined text-[20px]">checklist_rtl</span>
<span>Permiso de Trabajo Seguro (PTA)</span>
</div>
<span class="px-base py-xs rounded-full bg-surface-container-high text-on-surface font-label-sm text-[11px] font-bold">Inspección Diaria</span>
</div>
<h3 class="font-headline-md text-headline-md text-on-surface font-semibold">Checklist de Equipos de Caída</h3>
<p class="font-body-sm text-body-sm text-on-surface-variant">
          Verificación previa obligatoria en campo antes del ascenso según Art. 18 de la Res. 4272.
        </p>
</div>
<div class="space-y-xs">
<div class="flex items-center justify-between py-xs px-sm rounded bg-surface-container-low">
<div class="flex items-center gap-xs">
<span class="material-symbols-outlined text-secondary text-[18px]">check_circle</span>
<span class="font-label-sm text-label-sm text-on-surface">Arneses cuerpo entero (ANSI Z359.11)</span>
</div>
<span class="font-label-sm text-label-sm font-bold text-primary">32 Auditados</span>
</div>
<div class="flex items-center justify-between py-xs px-sm rounded bg-surface-container-low">
<div class="flex items-center gap-xs">
<span class="material-symbols-outlined text-secondary text-[18px]">check_circle</span>
<span class="font-label-sm text-label-sm text-on-surface">Líneas de vida y conectores (5.000 lbf)</span>
</div>
<span class="font-label-sm text-label-sm font-bold text-primary">28 Certificados</span>
</div>
<div class="flex items-center justify-between py-xs px-sm rounded bg-surface-container-low">
<div class="flex items-center gap-xs">
<span class="material-symbols-outlined text-secondary text-[18px]">check_circle</span>
<span class="font-label-sm text-label-sm text-on-surface">Puntos de anclaje estructural certificados</span>
</div>
<span class="font-label-sm text-label-sm font-bold text-primary">100% Calificados</span>
</div>
</div>
<button class="w-full py-sm rounded-lg bg-surface-container-high text-primary font-label-md text-label-md font-semibold hover:bg-surface-container-highest transition-colors flex items-center justify-center gap-xs" type="button">
<span class="material-symbols-outlined text-[18px]">qr_code_scanner</span>
<span>Abrir Lista de Chequeo Pre-Ascenso</span>
</button>
</div>
<!-- Módulo 3: Acciones Operativas y Supervisión de Campo -->
<div class="p-md rounded-xl bg-surface-container-lowest shadow-sm flex flex-col justify-between space-y-md">
<div class="space-y-xs">
<div class="flex items-center justify-between">
<div class="flex items-center gap-xs text-error font-semibold font-label-md text-label-md">
<span class="material-symbols-outlined text-[20px]">phonelink_ring</span>
<span>Supervisores &amp; Mayordomos</span>
</div>
<span class="px-base py-xs rounded-full bg-error-container text-error font-label-sm text-[11px] font-bold">Urgente</span>
</div>
<h3 class="font-headline-md text-headline-md text-on-surface font-semibold">Control en Frente de Obra</h3>
<p class="font-body-sm text-body-sm text-on-surface-variant">
          Evite sanciones legales y riesgos fatales. Distribuya la relación nominal de colaboradores expresamente inhabilitados para labores en alturas hoy.
        </p>
</div>
<div class="p-sm rounded-lg bg-error-container/30 space-y-xs">
<div class="flex items-center gap-xs text-error font-bold font-label-sm text-label-sm">
<span class="material-symbols-outlined text-[18px]">warning</span>
<span>8 Operarios con Bloqueo Activo</span>
</div>
<p class="text-[12px] text-on-error-container">
          Prohibición terminante de entrega de arnés, escaleras mayores a 2m o elevadores hidráulicos.
        </p>
</div>
<button class="w-full py-sm rounded-lg bg-error text-on-error font-label-md text-label-md font-semibold shadow hover:opacity-90 transition-opacity flex items-center justify-center gap-xs" type="button">
<span class="material-symbols-outlined text-[18px]">download_for_offline</span>
<span>Descargar Listado de Bloqueados para Supervisores</span>
</button>
</div>
</section>
</div>
<script>
  // Micro-interacción: Búsqueda dinámica básica en la tabla
  document.getElementById('searchWorker')?.addEventListener('input', function(e) {
    const term = e.target.value.toLowerCase();
    const rows = document.querySelectorAll('tbody tr');
    rows.forEach(row => {
      const text = row.textContent.toLowerCase();
      if(text.includes(term)) {
        row.style.display = '';
      } else {
        row.style.display = 'none';
      }
    });
  });
</script></main></div></body></html>

<!DOCTYPE html>

<html lang="es"><head><meta charset="utf-8"/><meta content="width=device-width, initial-scale=1.0" name="viewport"/><link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&amp;display=swap" rel="stylesheet"/><link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" rel="stylesheet"/>
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet"/><style>@layer base{html,body{margin:0;padding:0;}body{overscroll-behavior:none;}main>:first-child{margin-top:0!important;}main>:last-child{margin-bottom:0!important;}}::-webkit-scrollbar{display:none;}</style><script src="https://cdn.tailwindcss.com"></script><script id="tailwind-config">tailwind.config={darkMode:"class",theme:{extend:{"colors":{"secondary-fixed":"#e1e0ff","surface-container":"#e6eeff","tertiary-fixed":"#e0e3e5","on-tertiary-fixed-variant":"#444749","on-primary-fixed":"#000d60","error-container":"#ffdad6","on-background":"#0d1c2e","surface-container-high":"#dce9ff","on-primary":"#ffffff","error":"#ba1a1a","tertiary-container":"#404345","primary":"#142175","secondary-container":"#6063ee","outline":"#767682","surface-bright":"#f8f9ff","primary-container":"#2e3a8c","secondary":"#4648d4","surface-container-low":"#eff4ff","inverse-surface":"#233144","on-tertiary-fixed":"#191c1e","primary-fixed-dim":"#bcc3ff","on-primary-container":"#9ea9ff","tertiary-fixed-dim":"#c4c7c9","on-secondary-container":"#fffbff","on-secondary-fixed-variant":"#2f2ebe","primary-fixed":"#dfe0ff","surface-tint":"#4b57aa","on-surface-variant":"#454651","on-error":"#ffffff","inverse-on-surface":"#eaf1ff","on-tertiary-container":"#adb0b2","surface-container-highest":"#d5e3fc","outline-variant":"#c6c5d3","on-primary-fixed-variant":"#333f91","on-tertiary":"#ffffff","on-secondary-fixed":"#07006c","surface-variant":"#d5e3fc","surface-dim":"#ccdbf3","inverse-primary":"#bcc3ff","tertiary":"#2a2d2f","surface-container-lowest":"#ffffff","on-secondary":"#ffffff","background":"#f8f9ff","secondary-fixed-dim":"#c0c1ff","on-surface":"#0d1c2e","surface":"#f8f9ff","on-error-container":"#93000a"},"borderRadius":{"DEFAULT":"0.25rem","lg":"0.5rem","xl":"0.75rem","full":"9999px"},"spacing":{"base":"8px","gutter":"24px","xs":"4px","xl":"80px","sm":"12px","lg":"48px","container-max":"1280px","md":"24px"},"fontFamily":{"body-md":["Inter"],"display-lg":["Inter"],"label-md":["Inter"],"headline-lg-mobile":["Inter"],"body-sm":["Inter"],"headline-lg":["Inter"],"label-sm":["Inter"],"headline-md":["Inter"],"body-lg":["Inter"]},"fontSize":{"body-md":["16px",{"lineHeight":"24px","fontWeight":"400"}],"display-lg":["48px",{"lineHeight":"56px","letterSpacing":"-0.02em","fontWeight":"700"}],"label-md":["14px",{"lineHeight":"16px","letterSpacing":"0.01em","fontWeight":"500"}],"headline-lg-mobile":["24px",{"lineHeight":"32px","fontWeight":"600"}],"body-sm":["14px",{"lineHeight":"20px","fontWeight":"400"}],"headline-lg":["32px",{"lineHeight":"40px","letterSpacing":"-0.01em","fontWeight":"600"}],"label-sm":["12px",{"lineHeight":"14px","fontWeight":"600"}],"headline-md":["24px",{"lineHeight":"32px","fontWeight":"600"}],"body-lg":["18px",{"lineHeight":"28px","fontWeight":"400"}]}}}}</script></head><body class="bg-surface font-body-md text-body-md text-on-surface antialiased"><aside class="fixed left-0 top-0 h-screen w-72 bg-surface-container-lowest shadow-[0_1px_8px_rgba(0,0,0,0.04)] z-50 flex flex-col"><div class="h-16 px-gutter flex items-center gap-sm bg-surface-container-low"><div class="w-8 h-8 rounded-lg bg-primary flex items-center justify-center"><span class="material-symbols-outlined text-on-primary text-[20px]">verified_user</span></div><div class="flex flex-col"><span class="font-label-md text-label-md text-primary font-bold tracking-tight">GRUPO MANZANARES</span><span class="font-label-sm text-[10px] text-on-surface-variant font-medium tracking-wider uppercase">SG-SST Integral S.A.S.</span></div></div><div class="px-md py-sm bg-surface-container-highest flex items-center justify-between"><span class="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider font-semibold">Estándares Mínimos</span><span class="px-base py-xs rounded-full bg-primary-container text-on-primary-container font-label-sm text-label-sm font-semibold">Res. 0312</span></div><nav class="flex-1 overflow-y-auto px-sm py-sm space-y-md" data-active-classes="bg-primary-container text-on-primary font-semibold"><div class="space-y-xs"><div class="px-base py-xs font-label-sm text-label-sm uppercase tracking-wider text-outline font-semibold">Gestión Operativa</div><a class="flex items-center gap-sm px-base py-xs rounded-lg text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface transition-colors" data-path="inicio-dashboard" href="#"><span class="material-symbols-outlined text-[20px]">home</span><span class="font-label-md text-label-md">Inicio / Dashboard</span></a><a class="flex items-center gap-sm px-base py-xs rounded-lg text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface transition-colors" data-path="trabajadores" href="#"><span class="material-symbols-outlined text-[20px]">engineering</span><span class="font-label-md text-label-md">Trabajadores</span></a><a class="flex items-center gap-sm px-base py-xs rounded-lg text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface transition-colors" data-path="examenes-medicos-emos" href="#"><span class="material-symbols-outlined text-[20px]">stethoscope</span><span class="font-label-md text-label-md">Exámenes Médicos (EMOS)</span></a><a class="flex items-center gap-sm px-base py-xs rounded-lg text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface transition-colors" data-path="casos-de-salud" href="#"><span class="material-symbols-outlined text-[20px]">local_hospital</span><span class="font-label-md text-label-md">Casos de Salud</span></a><a class="flex items-center gap-sm px-base py-xs rounded-lg text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface transition-colors" data-path="incapacidades-y-reintegros" href="#"><span class="material-symbols-outlined text-[20px]">event_available</span><span class="font-label-md text-label-md">Incapacidades y Reintegros</span></a></div><div class="space-y-xs"><div class="px-base py-xs font-label-sm text-label-sm uppercase tracking-wider text-outline font-semibold">Riesgos Críticos &amp; Viales</div><a class="flex items-center gap-sm px-base py-xs rounded-lg text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface transition-colors" data-path="trabajo-en-alturas" href="#"><span class="material-symbols-outlined text-[20px]">stairs</span><span class="font-label-md text-label-md">Trabajo en Alturas</span></a><a aria-current="page" class="flex items-center gap-sm px-base py-xs rounded-lg transition-colors bg-primary-container text-on-primary font-semibold" data-path="tractoristas-operadores" href="#"><span class="material-symbols-outlined text-[20px]">agriculture</span><span class="font-label-md text-label-md">Tractoristas / Operadores</span></a><a class="flex items-center gap-sm px-base py-xs rounded-lg text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface transition-colors" data-path="pesv-seguridad-vial" href="#"><span class="material-symbols-outlined text-[20px]">directions_car</span><span class="font-label-md text-label-md">PESV (Seguridad Vial)</span></a><a class="flex items-center gap-sm px-base py-xs rounded-lg text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface transition-colors" data-path="epp" href="#"><span class="material-symbols-outlined text-[20px]">security</span><span class="font-label-md text-label-md">EPP</span></a></div><div class="space-y-xs"><div class="px-base py-xs font-label-sm text-label-sm uppercase tracking-wider text-outline font-semibold">Inspección &amp; Eventos</div><a class="flex items-center gap-sm px-base py-xs rounded-lg text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface transition-colors" data-path="inspecciones" href="#"><span class="material-symbols-outlined text-[20px]">search</span><span class="font-label-md text-label-md">Inspecciones</span></a><a class="flex items-center gap-sm px-base py-xs rounded-lg text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface transition-colors" data-path="accidentes-e-incidentes" href="#"><span class="material-symbols-outlined text-[20px]">notification_important</span><span class="font-label-md text-label-md">Accidentes e Incidentes</span></a><a class="flex items-center gap-sm px-base py-xs rounded-lg text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface transition-colors" data-path="investigaciones" href="#"><span class="material-symbols-outlined text-[20px]">fact_check</span><span class="font-label-md text-label-md">Investigaciones</span></a><a class="flex items-center gap-sm px-base py-xs rounded-lg text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface transition-colors" data-path="acciones-correctivas" href="#"><span class="material-symbols-outlined text-[20px]">build</span><span class="font-label-md text-label-md">Acciones Correctivas</span></a></div><div class="space-y-xs"><div class="px-base py-xs font-label-sm text-label-sm uppercase tracking-wider text-outline font-semibold">Comités &amp; Cultura</div><a class="flex items-center gap-sm px-base py-xs rounded-lg text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface transition-colors" data-path="capacitaciones" href="#"><span class="material-symbols-outlined text-[20px]">school</span><span class="font-label-md text-label-md">Capacitaciones</span></a><a class="flex items-center gap-sm px-base py-xs rounded-lg text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface transition-colors" data-path="documentos-sg-sst" href="#"><span class="material-symbols-outlined text-[20px]">description</span><span class="font-label-md text-label-md">Documentos SG-SST</span></a><a class="flex items-center gap-sm px-base py-xs rounded-lg text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface transition-colors" data-path="copasst" href="#"><span class="material-symbols-outlined text-[20px]">groups</span><span class="font-label-md text-label-md">COPASST</span></a><a class="flex items-center gap-sm px-base py-xs rounded-lg text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface transition-colors" data-path="ccl" href="#"><span class="material-symbols-outlined text-[20px]">handshake</span><span class="font-label-md text-label-md">CCL</span></a><a class="flex items-center gap-sm px-base py-xs rounded-lg text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface transition-colors" data-path="emergencias" href="#"><span class="material-symbols-outlined text-[20px]">fire_extinguisher</span><span class="font-label-md text-label-md">Emergencias</span></a><a class="flex items-center gap-sm px-base py-xs rounded-lg text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface transition-colors" data-path="quimicos" href="#"><span class="material-symbols-outlined text-[20px]">science</span><span class="font-label-md text-label-md">Químicos</span></a></div><div class="space-y-xs"><div class="px-base py-xs font-label-sm text-label-sm uppercase tracking-wider text-outline font-semibold">Estrategia &amp; Control</div><a class="flex items-center gap-sm px-base py-xs rounded-lg text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface transition-colors" data-path="analisis-sst" href="#"><span class="material-symbols-outlined text-[20px]">monitoring</span><span class="font-label-md text-label-md">Análisis SST</span></a><a class="flex items-center gap-sm px-base py-xs rounded-lg text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface transition-colors" data-path="configuracion" href="#"><span class="material-symbols-outlined text-[20px]">settings</span><span class="font-label-md text-label-md">Configuración</span></a></div></nav><div class="p-md bg-surface-container-low"><div class="flex items-center gap-xs"><span class="w-2 h-2 rounded-full bg-secondary"></span><span class="font-label-sm text-label-sm text-on-surface-variant font-medium">Decreto 1072 / Res 4272</span></div><p class="font-label-sm text-[11px] text-outline mt-xs">Versión Auditada 2024.1</p></div></aside><div class="pl-72 min-h-screen bg-surface flex flex-col"><header class="fixed top-0 left-72 right-0 h-16 bg-surface/90 backdrop-blur-xl shadow-[0_1px_8px_rgba(0,0,0,0.04)] z-40"><div class="h-16 px-gutter flex items-center justify-between"><div class="flex items-center gap-md"><div class="flex items-center gap-xs"><span class="font-label-md text-label-md font-semibold text-primary">Grupo Manzanares S.A.S.</span><span class="text-outline-variant font-body-sm text-body-sm">|</span><span class="font-label-md text-label-md text-on-surface-variant">Sistema Integrado SG-SST</span></div><div class="hidden xl:flex items-center gap-xs px-base py-xs rounded-full bg-surface-container-high"><span class="material-symbols-outlined text-[16px] text-primary">verified</span><span class="font-label-sm text-label-sm text-on-surface">Dec. 1072 / Res. 0312 / PESV Res. 40595</span></div></div><div class="flex items-center gap-md"><div class="flex items-center gap-xs px-base py-xs rounded-full bg-surface-container-low"><span class="w-2 h-2 rounded-full bg-secondary-container animate-pulse"></span><span class="font-label-sm text-label-sm text-on-surface-variant font-medium">Sincronizado</span></div><button class="flex items-center gap-xs px-base py-xs rounded-lg bg-error text-on-error font-label-md text-label-md shadow-sm hover:opacity-90 transition-opacity" type="button"><span class="material-symbols-outlined text-[18px]">warning</span><span>Reporte Rápido</span></button><div class="h-6 w-[1px] bg-outline-variant"></div><div class="flex items-center gap-sm"><div class="flex flex-col text-right hidden sm:flex"><span class="font-label-md text-label-md font-semibold text-on-surface leading-tight">Ing. Andrés Valencia</span><span class="font-label-sm text-label-sm text-outline leading-tight">Coordinador SG-SST</span></div><div class="w-8 h-8 rounded-full bg-primary flex items-center justify-center"><span class="material-symbols-outlined text-on-primary text-[18px]">person</span></div></div></div></div></header><main class="w-full pt-16 flex-1 px-gutter py-md bg-surface"><div class="flex flex-col w-full space-y-md">
<!-- Top Bar / Header Section -->
<div class="flex flex-col xl:flex-row xl:items-center justify-between gap-md bg-surface-container-lowest p-gutter rounded-xl shadow-sm relative overflow-hidden">
<div class="absolute -right-16 -top-16 w-64 h-64 bg-primary/5 rounded-full blur-3xl pointer-events-none"></div>
<div class="flex flex-col gap-xs max-w-4xl relative z-10">
<div class="flex items-center gap-sm">
<span class="px-base py-xs rounded-full bg-primary-container text-on-primary-container font-label-sm text-label-sm font-semibold flex items-center gap-xs">
<span class="material-symbols-outlined text-[14px]">agriculture</span> Módulo Técnico 10
        </span>
<span class="px-base py-xs rounded-full bg-surface-container-high text-on-surface-variant font-label-sm text-label-sm font-medium">
          Resolución 0312 / Decreto 1072
        </span>
<span class="flex items-center gap-xs text-secondary font-label-sm text-label-sm font-semibold">
<span class="w-2 h-2 rounded-full bg-secondary"></span> Validación RUNT en Vivo
        </span>
</div>
<h1 class="font-headline-lg text-headline-lg text-primary tracking-tight">
        10. Tractoristas y Operadores de Maquinaria Agrícola
      </h1>
<p class="font-body-md text-body-md text-on-surface-variant leading-relaxed">
        Control operacional de competencias técnicas, aptitud psicosensométrica, licencias de conducción de maquinaria pesada, inducciones de seguridad y bloqueo preventivo estricto de arranque en almacén.
      </p>
</div>
<div class="flex flex-wrap items-center gap-sm relative z-10">
<button class="flex items-center gap-xs px-base py-sm rounded-lg bg-surface-container-high hover:bg-surface-container text-primary font-label-md text-label-md transition-colors shadow-sm" type="button">
<span class="material-symbols-outlined text-[18px]">table_view</span>
<span>Exportar Censo (.XLSX)</span>
</button>
<button class="flex items-center gap-xs px-base py-sm rounded-lg bg-surface-container-high hover:bg-surface-container text-primary font-label-md text-label-md transition-colors shadow-sm" type="button">
<span class="material-symbols-outlined text-[18px]">checklist_rtl</span>
<span>Preoperacional ROPS/FOPS</span>
</button>
<button class="flex items-center gap-xs px-base py-sm rounded-lg bg-primary hover:bg-primary-container text-on-primary font-label-md text-label-md transition-all shadow-md active:scale-95" type="button">
<span class="material-symbols-outlined text-[18px]">person_add</span>
<span>+ Registrar Nuevo Operador</span>
</button>
</div>
</div>
<!-- Critical Banner / Regla de Oro Dispatch -->
<div class="grid grid-cols-1 lg:grid-cols-12 gap-md items-stretch">
<!-- Regla de oro visual card -->
<div class="lg:col-span-8 bg-inverse-surface text-inverse-on-surface rounded-xl p-gutter relative overflow-hidden shadow-lg flex flex-col justify-between">
<div class="absolute right-0 top-0 bottom-0 w-1/3 bg-gradient-to-l from-secondary/15 to-transparent pointer-events-none"></div>
<div class="flex flex-col gap-sm relative z-10">
<div class="flex items-center justify-between">
<div class="flex items-center gap-xs px-base py-xs rounded-md bg-error text-on-error font-label-sm text-label-sm font-bold tracking-wider uppercase">
<span class="material-symbols-outlined text-[16px]">key_off</span> Protocolo Finca Cero Tolerancia
          </div>
<span class="font-label-sm text-label-sm text-inverse-on-surface/70">Código SST: PRT-AGR-08</span>
</div>
<h2 class="font-headline-md text-headline-md text-on-primary">
          Regla de Oro en Bodegas y Patios: Despacho de Llaves
        </h2>
<p class="font-body-md text-body-md text-inverse-on-surface/90 max-w-2xl">
          «Prohibida terminantemente la entrega de llaves o ignición en almacén de maquinaria si el operario figura como <span class="text-error-container font-semibold">BLOQUEADO / NO AUTORIZADO</span> en la matriz central. La entrega indebida acarrea proceso disciplinario de falta grave según el RIT.»
        </p>
</div>
<div class="mt-md pt-sm flex flex-wrap items-center justify-between gap-md relative z-10 bg-inverse-surface/60 backdrop-blur-sm rounded-lg p-base">
<div class="flex items-center gap-md">
<div class="flex items-center gap-xs text-inverse-on-surface">
<span class="material-symbols-outlined text-secondary-fixed text-[20px]">pin_invoke</span>
<span class="font-label-sm text-label-sm">Bloqueo Físico LOTO en Taller</span>
</div>
<div class="flex items-center gap-xs text-inverse-on-surface">
<span class="material-symbols-outlined text-secondary-fixed text-[20px]">badge</span>
<span class="font-label-sm text-label-sm">Validación de Carnet QR</span>
</div>
</div>
<div class="flex items-center gap-xs">
<span class="w-2 h-2 rounded-full bg-error animate-ping"></span>
<span class="font-label-sm text-label-sm text-error-container font-semibold">5 Unidades con Candado Operativo</span>
</div>
</div>
</div>
<!-- Live Quick Status Card with Machine Image -->
<div class="lg:col-span-4 bg-surface-container-lowest rounded-xl shadow-sm overflow-hidden flex flex-col justify-between relative">
<div class="h-36 w-full relative">
<div class="bg-cover bg-center w-full h-full" data-alt="A modern agricultural John Deere green tractor standing in a vast sugarcane and avocado plantation field during bright daylight with clear sky, high detail photography, crisp corporate machinery documentation style" style="background-image: url('https://lh3.googleusercontent.com/aida-public/AB6AXuAW9ndMRvAU6YbnTc5KWtDfECP_6JQAa_9m3G5WJ5U5n4q3zNigMIppenrFSat3qkg12vs5iEUT8MSI6JwexE0zozXw10MlQJdkoGGYtcr9VkvbOwSSK2U5YWs40MmS6d0ShrTOpmUoJlC79mkrcpDevAndkqgNweBsnkFqgUmdh9MdRl9CQh1xTFTmCn6qqz2O88E7gk-3ZK1WiNpdOzXfWGrShBTTTiwO9ByYPaFRZwQkAmMffA4k')"></div>
<div class="absolute inset-0 bg-gradient-to-t from-surface-container-lowest via-surface-container-lowest/30 to-transparent"></div>
<div class="absolute top-xs right-xs bg-surface-container-lowest/90 backdrop-blur-md px-base py-xs rounded-full shadow-sm flex items-center gap-xs">
<span class="w-2 h-2 rounded-full bg-secondary"></span>
<span class="font-label-sm text-label-sm text-primary font-semibold">Patio Central San José</span>
</div>
</div>
<div class="p-gutter flex flex-col gap-xs -mt-6 relative z-10 bg-surface-container-lowest">
<div class="flex items-center justify-between">
<span class="font-label-sm text-label-sm uppercase tracking-wider text-outline font-semibold">Flota Pesada Auditada</span>
<span class="font-label-sm text-label-sm text-primary font-bold">60 Equipos</span>
</div>
<p class="font-body-sm text-body-sm text-on-surface-variant">
          Estructuras antivuelco ROPS y protectores de caída de objetos FOPS certificados para labores en pendientes mayores a 20°.
        </p>
<div class="mt-xs pt-xs flex items-center justify-between">
<span class="font-label-sm text-label-sm text-on-surface font-medium">Toma de Fuerza (TDF) Enmallada</span>
<span class="font-label-sm text-label-sm px-base py-xs rounded-full bg-surface-container-low text-primary font-bold">100% OK</span>
</div>
</div>
</div>
</div>
<!-- KPI Dashboard Cards -->
<div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-md">
<!-- KPI 1 -->
<div class="bg-surface-container-lowest p-gutter rounded-xl shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
<div class="flex items-start justify-between">
<span class="font-label-sm text-label-sm uppercase tracking-wider text-outline font-semibold">Operadores Habilitados</span>
<div class="w-8 h-8 rounded-lg bg-surface-container-low flex items-center justify-center text-primary">
<span class="material-symbols-outlined text-[20px]">verified</span>
</div>
</div>
<div class="mt-sm">
<div class="flex items-baseline gap-xs">
<span class="font-display-lg text-display-lg text-primary font-bold">48</span>
<span class="font-label-sm text-label-sm text-on-surface-variant">/ 60 tot.</span>
</div>
<p class="font-body-sm text-body-sm text-on-surface-variant mt-xs">Activos con aptitud y vigencias al 100%</p>
</div>
<div class="mt-sm w-full bg-surface-container-high h-2 rounded-full overflow-hidden">
<div class="bg-primary h-full rounded-full" style="width: 80%"></div>
</div>
</div>
<!-- KPI 2 -->
<div class="bg-surface-container-lowest p-gutter rounded-xl shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
<div class="flex items-start justify-between">
<span class="font-label-sm text-label-sm uppercase tracking-wider text-outline font-semibold">En Riesgo / Por Vencer</span>
<div class="w-8 h-8 rounded-lg bg-surface-container-high flex items-center justify-center text-secondary">
<span class="material-symbols-outlined text-[20px]">notification_important</span>
</div>
</div>
<div class="mt-sm">
<div class="flex items-baseline gap-xs">
<span class="font-display-lg text-display-lg text-secondary font-bold">07</span>
<span class="font-label-sm text-label-sm text-secondary font-medium">&lt; 30 días</span>
</div>
<p class="font-body-sm text-body-sm text-on-surface-variant mt-xs">Licencia RUNT o EMO en ventana crítica</p>
</div>
<div class="mt-sm w-full bg-surface-container-high h-2 rounded-full overflow-hidden">
<div class="bg-secondary h-full rounded-full" style="width: 25%"></div>
</div>
</div>
<!-- KPI 3: Alert Red -->
<div class="bg-error-container/30 p-gutter rounded-xl shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
<div class="flex items-start justify-between">
<span class="font-label-sm text-label-sm uppercase tracking-wider text-error font-semibold">NO AUTORIZADOS</span>
<div class="w-8 h-8 rounded-lg bg-error text-on-error flex items-center justify-center">
<span class="material-symbols-outlined text-[20px]">lock</span>
</div>
</div>
<div class="mt-sm">
<div class="flex items-baseline gap-xs">
<span class="font-display-lg text-display-lg text-error font-bold">05</span>
<span class="font-label-sm text-label-sm text-error font-semibold">Inhabilitados</span>
</div>
<p class="font-body-sm text-body-sm text-error mt-xs font-medium">Llave bloqueada en almacén / patio</p>
</div>
<div class="mt-sm w-full bg-error-container h-2 rounded-full overflow-hidden">
<div class="bg-error h-full rounded-full" style="width: 100%"></div>
</div>
</div>
<!-- KPI 4 -->
<div class="bg-surface-container-lowest p-gutter rounded-xl shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
<div class="flex items-start justify-between">
<span class="font-label-sm text-label-sm uppercase tracking-wider text-outline font-semibold">Preoperacionales Hoy</span>
<div class="w-8 h-8 rounded-lg bg-surface-container-low flex items-center justify-center text-primary">
<span class="material-symbols-outlined text-[20px]">done_all</span>
</div>
</div>
<div class="mt-sm">
<div class="flex items-baseline gap-xs">
<span class="font-display-lg text-display-lg text-primary font-bold">96.2%</span>
<span class="font-label-sm text-label-sm text-secondary font-semibold">+1.8%</span>
</div>
<p class="font-body-sm text-body-sm text-on-surface-variant mt-xs">52 de 54 despachos matutinos</p>
</div>
<div class="mt-sm w-full bg-surface-container-high h-2 rounded-full overflow-hidden">
<div class="bg-secondary-container h-full rounded-full" style="width: 96%"></div>
</div>
</div>
<!-- KPI 5 -->
<div class="bg-surface-container-lowest p-gutter rounded-xl shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
<div class="flex items-start justify-between">
<span class="font-label-sm text-label-sm uppercase tracking-wider text-outline font-semibold">Horas Sin Incidentes</span>
<div class="w-8 h-8 rounded-lg bg-surface-container-low flex items-center justify-center text-primary">
<span class="material-symbols-outlined text-[20px]">speed</span>
</div>
</div>
<div class="mt-sm">
<div class="flex items-baseline gap-xs">
<span class="font-display-lg text-display-lg text-primary font-bold">18.420</span>
<span class="font-label-sm text-label-sm text-on-surface-variant">H/M</span>
</div>
<p class="font-body-sm text-body-sm text-on-surface-variant mt-xs">Record acumulado año 2024</p>
</div>
<div class="mt-sm flex items-center gap-xs text-primary font-label-sm text-label-sm font-semibold">
<span class="material-symbols-outlined text-[16px]">shield</span> Cero vuelcos graves
      </div>
</div>
</div>
<!-- SECCIÓN CRÍTICA: PERSONAL NO AUTORIZADO PARA OPERAR -->
<div class="bg-surface-container-lowest rounded-xl p-gutter shadow-sm space-y-md">
<div class="flex flex-col md:flex-row md:items-center justify-between gap-sm pb-sm">
<div class="flex items-center gap-sm">
<div class="w-10 h-10 rounded-xl bg-error text-on-error flex items-center justify-center shadow-md">
<span class="material-symbols-outlined text-[24px]">gpp_bad</span>
</div>
<div>
<div class="flex items-center gap-xs">
<h2 class="font-headline-md text-headline-md text-error tracking-tight">
              ⚠️ Personal No Autorizado Para Operar
            </h2>
<span class="px-base py-xs rounded-full bg-error text-on-error font-label-sm text-label-sm font-bold animate-pulse">
              5 Inhabilitados
            </span>
</div>
<p class="font-body-sm text-body-sm text-on-surface-variant">
            Categorización automática por algoritmo de cumplimiento normativo (Resolución 0312 / Res 40595 PESV).
          </p>
</div>
</div>
<div class="flex items-center gap-xs">
<button class="px-base py-xs rounded-lg bg-surface-container-high text-primary font-label-sm text-label-sm font-semibold hover:bg-surface-container" type="button">
          Ver bitácora de bloqueos LOTO
        </button>
</div>
</div>
<!-- Summary of Reasons Badges -->
<div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-sm">
<div class="p-sm rounded-lg bg-surface-container-low flex flex-col gap-xs">
<span class="font-label-sm text-label-sm text-on-surface-variant font-medium flex items-center gap-xs">
<span class="material-symbols-outlined text-[16px] text-error">history_toggle_off</span> Formación Vencida
        </span>
<span class="font-headline-md text-headline-md text-primary font-bold">2 operarios</span>
<span class="font-label-sm text-[11px] text-outline">Operación con Toma de Fuerza</span>
</div>
<div class="p-sm rounded-lg bg-surface-container-low flex flex-col gap-xs">
<span class="font-label-sm text-label-sm text-on-surface-variant font-medium flex items-center gap-xs">
<span class="material-symbols-outlined text-[16px] text-error">pending_actions</span> Formación Pendiente
        </span>
<span class="font-headline-md text-headline-md text-primary font-bold">1 operario</span>
<span class="font-label-sm text-[11px] text-outline">Implementos rastra/remolque</span>
</div>
<div class="p-sm rounded-lg bg-surface-container-low flex flex-col gap-xs">
<span class="font-label-sm text-label-sm text-on-surface-variant font-medium flex items-center gap-xs">
<span class="material-symbols-outlined text-[16px] text-error">badge</span> Doc. Pendiente RUNT
        </span>
<span class="font-headline-md text-headline-md text-primary font-bold">1 operario</span>
<span class="font-label-sm text-[11px] text-outline">Licencia C1/B1 sin soporte</span>
</div>
<div class="p-sm rounded-lg bg-surface-container-low flex flex-col gap-xs">
<span class="font-label-sm text-label-sm text-on-surface-variant font-medium flex items-center gap-xs">
<span class="material-symbols-outlined text-[16px] text-error">medical_services</span> Aptitud Médica
        </span>
<span class="font-headline-md text-headline-md text-primary font-bold">1 operario</span>
<span class="font-label-sm text-[11px] text-outline">No Apto temporal / Psicosens.</span>
</div>
<div class="p-sm rounded-lg bg-surface-container-low flex flex-col gap-xs">
<span class="font-label-sm text-label-sm text-on-surface-variant font-medium flex items-center gap-xs">
<span class="material-symbols-outlined text-[16px] text-error">rule</span> Requisito Incompleto
        </span>
<span class="font-headline-md text-headline-md text-primary font-bold">0 operarios</span>
<span class="font-label-sm text-[11px] text-outline">Inducción y simulacro 2024</span>
</div>
</div>
<!-- Tarjetas de los 3 Colaboradores en Alerta Roja Prioritaria -->
<div class="grid grid-cols-1 md:grid-cols-3 gap-md pt-xs">
<!-- Colaborador 1 -->
<div class="bg-surface rounded-xl p-gutter shadow-sm relative flex flex-col justify-between">
<div class="flex items-start justify-between gap-sm">
<div class="flex items-center gap-sm">
<div class="w-12 h-12 rounded-full bg-error-container text-error font-bold flex items-center justify-center font-headline-md text-headline-md">
              HR
            </div>
<div class="flex flex-col">
<span class="font-label-md text-label-md text-on-surface font-bold leading-tight">Héctor Fabio Ramírez</span>
<span class="font-label-sm text-label-sm text-outline">C.C. 71.394.882</span>
<span class="font-label-sm text-label-sm text-on-surface-variant font-medium mt-xs">Tractorista Titular #04</span>
</div>
</div>
<span class="px-base py-xs rounded-full bg-error text-on-error font-label-sm text-label-sm font-bold">
            BLOQUEADO
          </span>
</div>
<div class="mt-md p-sm rounded-lg bg-error-container/30 space-y-xs">
<div class="flex items-center gap-xs text-error font-label-sm text-label-sm font-bold">
<span class="material-symbols-outlined text-[18px]">emergency_home</span> Causa: Formación Vencida
          </div>
<p class="font-body-sm text-body-sm text-on-error-container">
            Certificación en Operación de Tractor Agrícola con Toma de Fuerza venció hace 12 días (05/11/2024).
          </p>
<div class="font-label-sm text-[11px] text-outline">
            Equipo asignado: John Deere 5075E (Patio San José)
          </div>
</div>
<div class="mt-md flex items-center gap-sm">
<button class="flex-1 py-xs px-base rounded-lg bg-primary hover:bg-primary-container text-on-primary font-label-sm text-label-sm font-semibold transition-colors flex items-center justify-center gap-xs shadow-sm" type="button">
<span class="material-symbols-outlined text-[16px]">school</span> Programar Curso SST
          </button>
<button class="p-xs rounded-lg bg-surface-container hover:bg-surface-container-high text-primary" type="button">
<span class="material-symbols-outlined text-[20px]">visibility</span>
</button>
</div>
</div>
<!-- Colaborador 2 -->
<div class="bg-surface rounded-xl p-gutter shadow-sm relative flex flex-col justify-between">
<div class="flex items-start justify-between gap-sm">
<div class="flex items-center gap-sm">
<div class="w-12 h-12 rounded-full bg-error-container text-error font-bold flex items-center justify-center font-headline-md text-headline-md">
              JG
            </div>
<div class="flex flex-col">
<span class="font-label-md text-label-md text-on-surface font-bold leading-tight">Jairo González Pineda</span>
<span class="font-label-sm text-label-sm text-outline">C.C. 94.218.005</span>
<span class="font-label-sm text-label-sm text-on-surface-variant font-medium mt-xs">Operador Retroexcavadora</span>
</div>
</div>
<span class="px-base py-xs rounded-full bg-error text-on-error font-label-sm text-label-sm font-bold">
            BLOQUEADO
          </span>
</div>
<div class="mt-md p-sm rounded-lg bg-error-container/30 space-y-xs">
<div class="flex items-center gap-xs text-error font-label-sm text-label-sm font-bold">
<span class="material-symbols-outlined text-[18px]">no_crash</span> Causa: Licencia RUNT Vencida
          </div>
<p class="font-body-sm text-body-sm text-on-error-container">
            Licencia Categoría C2 venció el 15/10/2024. No registra refrendación ante MinTransporte.
          </p>
<div class="font-label-sm text-[11px] text-outline">
            Equipo asignado: CAT 416E Retro (Finca El Paraíso)
          </div>
</div>
<div class="mt-md flex items-center gap-sm">
<button class="flex-1 py-xs px-base rounded-lg bg-primary hover:bg-primary-container text-on-primary font-label-sm text-label-sm font-semibold transition-colors flex items-center justify-center gap-xs shadow-sm" type="button">
<span class="material-symbols-outlined text-[16px]">upload_file</span> Cargar Soporte RUNT
          </button>
<button class="p-xs rounded-lg bg-surface-container hover:bg-surface-container-high text-primary" type="button">
<span class="material-symbols-outlined text-[20px]">visibility</span>
</button>
</div>
</div>
<!-- Colaborador 3 -->
<div class="bg-surface rounded-xl p-gutter shadow-sm relative flex flex-col justify-between">
<div class="flex items-start justify-between gap-sm">
<div class="flex items-center gap-sm">
<div class="w-12 h-12 rounded-full bg-error-container text-error font-bold flex items-center justify-center font-headline-md text-headline-md">
              CR
            </div>
<div class="flex flex-col">
<span class="font-label-md text-label-md text-on-surface font-bold leading-tight">Carlos Julio Restrepo</span>
<span class="font-label-sm text-label-sm text-outline">C.C. 10.294.112</span>
<span class="font-label-sm text-label-sm text-on-surface-variant font-medium mt-xs">Tractorista Implementos</span>
</div>
</div>
<span class="px-base py-xs rounded-full bg-error text-on-error font-label-sm text-label-sm font-bold">
            BLOQUEADO
          </span>
</div>
<div class="mt-md p-sm rounded-lg bg-error-container/30 space-y-xs">
<div class="flex items-center gap-xs text-error font-label-sm text-label-sm font-bold">
<span class="material-symbols-outlined text-[18px]">medical_information</span> Causa: No Apto Temporal
          </div>
<p class="font-body-sm text-body-sm text-on-error-container">
            Concepto médico psicosensométrico: Agudeza visual no corregida y déficit de coordinación motriz fina.
          </p>
<div class="font-label-sm text-[11px] text-outline">
            Equipo asignado: Kubota M7040 (Finca La Esperanza)
          </div>
</div>
<div class="mt-md flex items-center gap-sm">
<button class="flex-1 py-xs px-base rounded-lg bg-primary hover:bg-primary-container text-on-primary font-label-sm text-label-sm font-semibold transition-colors flex items-center justify-center gap-xs shadow-sm" type="button">
<span class="material-symbols-outlined text-[16px]">stethoscope</span> Remitir a Optometría
          </button>
<button class="p-xs rounded-lg bg-surface-container hover:bg-surface-container-high text-primary" type="button">
<span class="material-symbols-outlined text-[20px]">visibility</span>
</button>
</div>
</div>
</div>
</div>
<!-- FILTROS PARAMÉTRICOS -->
<div class="bg-surface-container-lowest p-gutter rounded-xl shadow-sm flex flex-col gap-md">
<div class="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-md">
<!-- Búsqueda -->
<div class="flex-1 max-w-lg relative">
<span class="material-symbols-outlined absolute left-base top-1/2 -translate-y-1/2 text-outline text-[20px]">search</span>
<input class="w-full pl-10 pr-base py-xs rounded-lg bg-surface-container-low text-on-surface font-body-sm text-body-sm focus:outline-none focus:bg-surface-container transition-colors placeholder:text-outline" placeholder="Buscar por Nombre, Cédula, Equipo o # Interno..." type="text"/>
</div>
<!-- Selectores de Filtro -->
<div class="flex flex-wrap items-center gap-sm">
<!-- Finca -->
<div class="flex flex-col">
<select class="px-base py-xs rounded-lg bg-surface-container-low text-on-surface font-label-md text-label-md focus:outline-none hover:bg-surface-container transition-colors cursor-pointer">
<option value="all">Todas las Fincas / Sedes</option>
<option value="esperanza">Finca La Esperanza</option>
<option value="paraiso">Finca El Paraíso</option>
<option value="sanjose">Finca San José</option>
<option value="taller">Taller Central / Patios</option>
</select>
</div>
<!-- Tipo de Maquinaria -->
<div class="flex flex-col">
<select class="px-base py-xs rounded-lg bg-surface-container-low text-on-surface font-label-md text-label-md focus:outline-none hover:bg-surface-container transition-colors cursor-pointer">
<option value="all">Todo Tipo de Equipo</option>
<option value="jd">Tractor John Deere 5075E</option>
<option value="kubota">Kubota M7040</option>
<option value="retro">Retroexcavadora CAT</option>
<option value="moto">Motoniveladora</option>
<option value="bomba">Motobomba Estacionaria</option>
</select>
</div>
<!-- Estado de Autorización -->
<div class="flex flex-col">
<select class="px-base py-xs rounded-lg bg-surface-container-low text-on-surface font-label-md text-label-md focus:outline-none hover:bg-surface-container transition-colors cursor-pointer">
<option value="all">Todos los Estados</option>
<option value="autorizado">✅ Habilitado / Autorizado</option>
<option value="bloqueado">⛔ Bloqueado / No Autorizado</option>
<option value="reentrenamiento">⚠️ En Reentrenamiento</option>
</select>
</div>
<button class="p-xs rounded-lg bg-surface-container hover:bg-surface-container-high text-primary flex items-center justify-center transition-colors" title="Restablecer Filtros" type="button">
<span class="material-symbols-outlined text-[20px]">filter_alt_off</span>
</button>
</div>
</div>
<!-- Active Filter Chips -->
<div class="flex items-center gap-xs flex-wrap pt-xs">
<span class="font-label-sm text-label-sm text-outline">Filtros activos:</span>
<span class="px-base py-xs rounded-full bg-surface-container-high text-primary font-label-sm text-label-sm flex items-center gap-xs">
        Finca: Todas <span class="material-symbols-outlined text-[14px] cursor-pointer">close</span>
</span>
<span class="px-base py-xs rounded-full bg-surface-container-high text-primary font-label-sm text-label-sm flex items-center gap-xs">
        Vigencia RUNT: Verificada 2024 <span class="material-symbols-outlined text-[14px] cursor-pointer">close</span>
</span>
<span class="px-base py-xs rounded-full bg-secondary-fixed text-on-secondary-fixed font-label-sm text-label-sm flex items-center gap-xs">
        Total Registrados: 60 Colaboradores
      </span>
</div>
</div>
<!-- MATRIZ DE CONTROL OPERACIONAL: TABLA DE ALTO RENDIMIENTO -->
<div class="bg-surface-container-lowest rounded-xl shadow-sm overflow-hidden flex flex-col">
<div class="p-gutter flex items-center justify-between">
<div>
<h3 class="font-headline-md text-headline-md text-primary">Matriz de Habilitación y Competencia de Operadores</h3>
<p class="font-body-sm text-body-sm text-on-surface-variant">Confrontación en tiempo real de Licencia RUNT + EMO Psicosensométrico + Inducción Técnica.</p>
</div>
<div class="flex items-center gap-sm">
<span class="font-label-sm text-label-sm text-outline">Página 1 de 6 (60 registros)</span>
<div class="flex items-center gap-xs">
<button class="p-xs rounded bg-surface-container hover:bg-surface-container-high disabled:opacity-40" disabled=""><span class="material-symbols-outlined text-[18px]">chevron_left</span></button>
<button class="p-xs rounded bg-surface-container hover:bg-surface-container-high"><span class="material-symbols-outlined text-[18px]">chevron_right</span></button>
</div>
</div>
</div>
<div class="overflow-x-auto">
<table class="w-full text-left font-body-sm text-body-sm text-on-surface">
<thead class="bg-surface-container-low font-label-sm text-label-sm uppercase tracking-wider text-on-surface-variant">
<tr>
<th class="py-sm px-base">Trabajador</th>
<th class="py-sm px-base">Finca Asignada</th>
<th class="py-sm px-base">Equipo / Tipo</th>
<th class="py-sm px-base">Capacitación Técnica</th>
<th class="py-sm px-base">Vigencia / Reentreno</th>
<th class="py-sm px-base">Licencia RUNT</th>
<th class="py-sm px-base">Énfasis EMO &amp; Aptitud</th>
<th class="py-sm px-base">Inducción Maquinaria</th>
<th class="py-sm px-base text-center">Estado Llave</th>
<th class="py-sm px-base">Observaciones Operacionales</th>
<th class="py-sm px-base text-right">Acción</th>
</tr>
</thead>
<tbody class="divide-y-0">
<!-- Fila 1: BLOQUEADO (Héctor Fabio) -->
<tr class="bg-error-container/10 hover:bg-error-container/20 transition-colors">
<td class="py-sm px-base align-top">
<div class="flex flex-col">
<span class="font-label-md text-label-md font-bold text-on-surface">Héctor Fabio Ramírez</span>
<span class="font-label-sm text-label-sm text-outline">C.C. 71.394.882</span>
<span class="font-label-sm text-[11px] text-error font-semibold">Tractorista Titular</span>
</div>
</td>
<td class="py-sm px-base align-top">
<span class="font-label-sm text-label-sm font-medium text-on-surface">Finca San José</span>
<span class="block font-label-sm text-[11px] text-outline">Patio Maquinaria</span>
</td>
<td class="py-sm px-base align-top">
<span class="font-label-sm text-label-sm font-semibold text-primary">Tractor JD-5075E #04</span>
<span class="block font-label-sm text-[11px] text-on-surface-variant">Doble Tracción Frutero</span>
</td>
<td class="py-sm px-base align-top">
<div class="flex flex-col">
<span class="font-label-sm text-label-sm text-on-surface font-medium">Op. Toma Fuerza (TDF)</span>
<span class="font-label-sm text-[11px] text-error font-semibold">Vencida hace 12 días</span>
</div>
</td>
<td class="py-sm px-base align-top">
<div class="flex flex-col">
<span class="font-label-sm text-label-sm text-on-surface">05/11/2024</span>
<span class="px-xs py-0.5 rounded text-[10px] font-bold bg-error text-on-error w-max mt-0.5">VENCIDO (-12d)</span>
</div>
</td>
<td class="py-sm px-base align-top">
<div class="flex flex-col">
<span class="font-label-sm text-label-sm font-semibold text-primary">Cat. C1 #492819</span>
<span class="font-label-sm text-[11px] text-secondary font-medium">Vigente: 12/08/2026</span>
</div>
</td>
<td class="py-sm px-base align-top">
<div class="flex flex-col">
<span class="font-label-sm text-label-sm font-semibold text-primary">Apto con restricción</span>
<span class="font-label-sm text-[11px] text-on-surface-variant">Uso obligatorio lentes ópticos</span>
</div>
</td>
<td class="py-sm px-base align-top">
<span class="px-base py-xs rounded bg-surface-container-high text-primary font-label-sm text-[11px] font-bold">
                Vigente 2024
              </span>
</td>
<td class="py-sm px-base align-top text-center">
<span class="px-base py-xs rounded-full bg-error text-on-error font-label-sm text-label-sm font-bold shadow-sm whitespace-nowrap">
                ⛔ NO AUTORIZADO
              </span>
</td>
<td class="py-sm px-base align-top max-w-xs">
<span class="font-body-sm text-body-sm text-error font-medium">
                Almacén retiene llave #04. Pendiente recertificación de TDF y acople de desbrozadora.
              </span>
</td>
<td class="py-sm px-base align-top text-right whitespace-nowrap">
<button class="p-xs rounded-lg hover:bg-surface-container text-primary" title="Gestionar Ficha">
<span class="material-symbols-outlined text-[20px]">edit_square</span>
</button>
</td>
</tr>
<!-- Fila 2: AUTORIZADO (Mauricio Correa) -->
<tr class="bg-surface-container-lowest hover:bg-surface-container-low transition-colors">
<td class="py-sm px-base align-top">
<div class="flex flex-col">
<span class="font-label-md text-label-md font-bold text-on-surface">Mauricio Correa Vélez</span>
<span class="font-label-sm text-label-sm text-outline">C.C. 98.542.110</span>
<span class="font-label-sm text-[11px] text-secondary font-semibold">Operador Senior</span>
</div>
</td>
<td class="py-sm px-base align-top">
<span class="font-label-sm text-label-sm font-medium text-on-surface">Finca El Paraíso</span>
<span class="block font-label-sm text-[11px] text-outline">Lote Cítricos Norte</span>
</td>
<td class="py-sm px-base align-top">
<span class="font-label-sm text-label-sm font-semibold text-primary">Kubota M7040 #02</span>
<span class="block font-label-sm text-[11px] text-on-surface-variant">Tractor con Pala Frontal</span>
</td>
<td class="py-sm px-base align-top">
<div class="flex flex-col">
<span class="font-label-sm text-label-sm text-on-surface font-medium">Estabilidad en Pendientes</span>
<span class="font-label-sm text-[11px] text-secondary font-semibold">SENA Certificado</span>
</div>
</td>
<td class="py-sm px-base align-top">
<div class="flex flex-col">
<span class="font-label-sm text-label-sm text-on-surface">22/04/2025</span>
<span class="px-xs py-0.5 rounded text-[10px] font-bold bg-surface-container-high text-primary w-max mt-0.5">154 DÍAS REST.</span>
</div>
</td>
<td class="py-sm px-base align-top">
<div class="flex flex-col">
<span class="font-label-sm text-label-sm font-semibold text-primary">Cat. C2 #990142</span>
<span class="font-label-sm text-[11px] text-secondary font-medium">Vigente: 04/11/2027</span>
</div>
</td>
<td class="py-sm px-base align-top">
<div class="flex flex-col">
<span class="font-label-sm text-label-sm font-bold text-primary">Apto Total Maquinaria</span>
<span class="font-label-sm text-[11px] text-outline">Psicosensométrico 100% OK</span>
</div>
</td>
<td class="py-sm px-base align-top">
<span class="px-base py-xs rounded bg-surface-container-high text-primary font-label-sm text-[11px] font-bold">
                Vigente 2024
              </span>
</td>
<td class="py-sm px-base align-top text-center">
<span class="px-base py-xs rounded-full bg-primary text-on-primary font-label-sm text-label-sm font-bold shadow-sm whitespace-nowrap">
                AUTORIZADO
              </span>
</td>
<td class="py-sm px-base align-top max-w-xs">
<span class="font-body-sm text-body-sm text-on-surface-variant">
                Autorizado para operación en pendientes de hasta 25% con contrapesos verificados.
              </span>
</td>
<td class="py-sm px-base align-top text-right whitespace-nowrap">
<button class="p-xs rounded-lg hover:bg-surface-container text-primary" title="Gestionar Ficha">
<span class="material-symbols-outlined text-[20px]">edit_square</span>
</button>
</td>
</tr>
<!-- Fila 3: BLOQUEADO (Jairo González) -->
<tr class="bg-error-container/10 hover:bg-error-container/20 transition-colors">
<td class="py-sm px-base align-top">
<div class="flex flex-col">
<span class="font-label-md text-label-md font-bold text-on-surface">Jairo González Pineda</span>
<span class="font-label-sm text-label-sm text-outline">C.C. 94.218.005</span>
<span class="font-label-sm text-[11px] text-error font-semibold">Maquinista Obras Civiles</span>
</div>
</td>
<td class="py-sm px-base align-top">
<span class="font-label-sm text-label-sm font-medium text-on-surface">Finca El Paraíso</span>
<span class="block font-label-sm text-[11px] text-outline">Vías y Drenajes</span>
</td>
<td class="py-sm px-base align-top">
<span class="font-label-sm text-label-sm font-semibold text-primary">Retro CAT 416E</span>
<span class="block font-label-sm text-[11px] text-on-surface-variant">Maquinaria Amarilla</span>
</td>
<td class="py-sm px-base align-top">
<div class="flex flex-col">
<span class="font-label-sm text-label-sm text-on-surface font-medium">Movimiento de Tierras</span>
<span class="font-label-sm text-[11px] text-secondary font-medium">Vence: 18/06/2025</span>
</div>
</td>
<td class="py-sm px-base align-top">
<div class="flex flex-col">
<span class="font-label-sm text-label-sm text-on-surface">18/06/2025</span>
<span class="px-xs py-0.5 rounded text-[10px] font-bold bg-surface-container-high text-primary w-max mt-0.5">210 DÍAS REST.</span>
</div>
</td>
<td class="py-sm px-base align-top">
<div class="flex flex-col">
<span class="font-label-sm text-label-sm font-bold text-error">Cat. C2 #330198</span>
<span class="px-xs py-0.5 rounded text-[10px] font-bold bg-error text-on-error w-max mt-0.5">RUNT VENCIDO 15/10</span>
</div>
</td>
<td class="py-sm px-base align-top">
<div class="flex flex-col">
<span class="font-label-sm text-label-sm font-semibold text-primary">Apto Maquinaria</span>
<span class="font-label-sm text-[11px] text-outline">Vence: 05/03/2025</span>
</div>
</td>
<td class="py-sm px-base align-top">
<span class="px-base py-xs rounded bg-surface-container-high text-primary font-label-sm text-[11px] font-bold">
                Vigente 2024
              </span>
</td>
<td class="py-sm px-base align-top text-center">
<span class="px-base py-xs rounded-full bg-error text-on-error font-label-sm text-label-sm font-bold shadow-sm whitespace-nowrap">
                ⛔ NO AUTORIZADO
              </span>
</td>
<td class="py-sm px-base align-top max-w-xs">
<span class="font-body-sm text-body-sm text-error font-medium">
                Venció licencia física y electrónica RUNT. En trámite ante CRC y Secretaría de Tránsito.
              </span>
</td>
<td class="py-sm px-base align-top text-right whitespace-nowrap">
<button class="p-xs rounded-lg hover:bg-surface-container text-primary" title="Gestionar Ficha">
<span class="material-symbols-outlined text-[20px]">edit_square</span>
</button>
</td>
</tr>
<!-- Fila 4: AUTORIZADO (Wilson Arboleda) -->
<tr class="bg-surface-container-lowest hover:bg-surface-container-low transition-colors">
<td class="py-sm px-base align-top">
<div class="flex flex-col">
<span class="font-label-md text-label-md font-bold text-on-surface">Wilson Arboleda Marín</span>
<span class="font-label-sm text-label-sm text-outline">C.C. 15.390.840</span>
<span class="font-label-sm text-[11px] text-secondary font-semibold">Tractorista Desbroce</span>
</div>
</td>
<td class="py-sm px-base align-top">
<span class="font-label-sm text-label-sm font-medium text-on-surface">Finca La Esperanza</span>
<span class="block font-label-sm text-[11px] text-outline">Sección Aguacate Hass</span>
</td>
<td class="py-sm px-base align-top">
<span class="font-label-sm text-label-sm font-semibold text-primary">JD-5075E #01</span>
<span class="block font-label-sm text-[11px] text-on-surface-variant">Tractor 75 HP con Rastra</span>
</td>
<td class="py-sm px-base align-top">
<div class="flex flex-col">
<span class="font-label-sm text-label-sm text-on-surface font-medium">Seguridad con Implementos</span>
<span class="font-label-sm text-[11px] text-secondary font-semibold">Certificado Vigente</span>
</div>
</td>
<td class="py-sm px-base align-top">
<div class="flex flex-col">
<span class="font-label-sm text-label-sm text-on-surface">14/01/2025</span>
<span class="px-xs py-0.5 rounded text-[10px] font-bold bg-secondary text-on-secondary w-max mt-0.5">⚠️ 56 DÍAS</span>
</div>
</td>
<td class="py-sm px-base align-top">
<div class="flex flex-col">
<span class="font-label-sm text-label-sm font-semibold text-primary">Cat. B1 #129480</span>
<span class="font-label-sm text-[11px] text-secondary font-medium">Vigente: 09/09/2026</span>
</div>
</td>
<td class="py-sm px-base align-top">
<div class="flex flex-col">
<span class="font-label-sm text-label-sm font-bold text-primary">Apto Sin Restricciones</span>
<span class="font-label-sm text-[11px] text-outline">Agudeza 20/20 bilateral</span>
</div>
</td>
<td class="py-sm px-base align-top">
<span class="px-base py-xs rounded bg-surface-container-high text-primary font-label-sm text-[11px] font-bold">
                Vigente 2024
              </span>
</td>
<td class="py-sm px-base align-top text-center">
<span class="px-base py-xs rounded-full bg-primary text-on-primary font-label-sm text-label-sm font-bold shadow-sm whitespace-nowrap">
                AUTORIZADO
              </span>
</td>
<td class="py-sm px-base align-top max-w-xs">
<span class="font-body-sm text-body-sm text-on-surface-variant">
                En monitoreo preventivo por vencimiento de curso en enero 2025. Preoperacional al día.
              </span>
</td>
<td class="py-sm px-base align-top text-right whitespace-nowrap">
<button class="p-xs rounded-lg hover:bg-surface-container text-primary" title="Gestionar Ficha">
<span class="material-symbols-outlined text-[20px]">edit_square</span>
</button>
</td>
</tr>
<!-- Fila 5: BLOQUEADO (Carlos Julio) -->
<tr class="bg-error-container/10 hover:bg-error-container/20 transition-colors">
<td class="py-sm px-base align-top">
<div class="flex flex-col">
<span class="font-label-md text-label-md font-bold text-on-surface">Carlos Julio Restrepo</span>
<span class="font-label-sm text-label-sm text-outline">C.C. 10.294.112</span>
<span class="font-label-sm text-[11px] text-error font-semibold">Tractorista Polivalente</span>
</div>
</td>
<td class="py-sm px-base align-top">
<span class="font-label-sm text-label-sm font-medium text-on-surface">Finca La Esperanza</span>
<span class="block font-label-sm text-[11px] text-outline">Patio #02</span>
</td>
<td class="py-sm px-base align-top">
<span class="font-label-sm text-label-sm font-semibold text-primary">Kubota M7040 #03</span>
<span class="block font-label-sm text-[11px] text-on-surface-variant">Tractor Estándar</span>
</td>
<td class="py-sm px-base align-top">
<div class="flex flex-col">
<span class="font-label-sm text-label-sm text-on-surface font-medium">Mantenimiento Preventivo</span>
<span class="font-label-sm text-[11px] text-secondary font-medium">Vigente 2025</span>
</div>
</td>
<td class="py-sm px-base align-top">
<div class="flex flex-col">
<span class="font-label-sm text-label-sm text-on-surface">30/08/2025</span>
<span class="px-xs py-0.5 rounded text-[10px] font-bold bg-surface-container-high text-primary w-max mt-0.5">280 DÍAS REST.</span>
</div>
</td>
<td class="py-sm px-base align-top">
<div class="flex flex-col">
<span class="font-label-sm text-label-sm font-semibold text-primary">Cat. C1 #847291</span>
<span class="font-label-sm text-[11px] text-secondary font-medium">Vigente: 11/11/2026</span>
</div>
</td>
<td class="py-sm px-base align-top">
<div class="flex flex-col">
<span class="font-label-sm text-label-sm font-bold text-error">NO APTO TEMPORAL</span>
<span class="font-label-sm text-[11px] text-error">Falla psicosensométrica</span>
</div>
</td>
<td class="py-sm px-base align-top">
<span class="px-base py-xs rounded bg-surface-container-high text-primary font-label-sm text-[11px] font-bold">
                Vigente 2024
              </span>
</td>
<td class="py-sm px-base align-top text-center">
<span class="px-base py-xs rounded-full bg-error text-on-error font-label-sm text-label-sm font-bold shadow-sm whitespace-nowrap">
                ⛔ NO AUTORIZADO
              </span>
</td>
<td class="py-sm px-base align-top max-w-xs">
<span class="font-body-sm text-body-sm text-error font-medium">
                Concepto médico desfavorable en coordinación visomotriz. Reubicado en labores de campo a pie.
              </span>
</td>
<td class="py-sm px-base align-top text-right whitespace-nowrap">
<button class="p-xs rounded-lg hover:bg-surface-container text-primary" title="Gestionar Ficha">
<span class="material-symbols-outlined text-[20px]">edit_square</span>
</button>
</td>
</tr>
<!-- Fila 6: AUTORIZADO (Duván Darío Giraldo) -->
<tr class="bg-surface-container-lowest hover:bg-surface-container-low transition-colors">
<td class="py-sm px-base align-top">
<div class="flex flex-col">
<span class="font-label-md text-label-md font-bold text-on-surface">Duván Darío Giraldo</span>
<span class="font-label-sm text-label-sm text-outline">C.C. 1.053.829.401</span>
<span class="font-label-sm text-[11px] text-secondary font-semibold">Operador Motoniveladora</span>
</div>
</td>
<td class="py-sm px-base align-top">
<span class="font-label-sm text-label-sm font-medium text-on-surface">Taller Central</span>
<span class="block font-label-sm text-[11px] text-outline">Base Operativa</span>
</td>
<td class="py-sm px-base align-top">
<span class="font-label-sm text-label-sm font-semibold text-primary">Motoniveladora CAT 120K</span>
<span class="block font-label-sm text-[11px] text-on-surface-variant">Equipo Pesado Vial</span>
</td>
<td class="py-sm px-base align-top">
<div class="flex flex-col">
<span class="font-label-sm text-label-sm text-on-surface font-medium">Operación Pesada Vías</span>
<span class="font-label-sm text-[11px] text-secondary font-semibold">Certificado Vigente</span>
</div>
</td>
<td class="py-sm px-base align-top">
<div class="flex flex-col">
<span class="font-label-sm text-label-sm text-on-surface">19/09/2025</span>
<span class="px-xs py-0.5 rounded text-[10px] font-bold bg-surface-container-high text-primary w-max mt-0.5">300 DÍAS REST.</span>
</div>
</td>
<td class="py-sm px-base align-top">
<div class="flex flex-col">
<span class="font-label-sm text-label-sm font-semibold text-primary">Cat. C2 #771203</span>
<span class="font-label-sm text-[11px] text-secondary font-medium">Vigente: 01/02/2027</span>
</div>
</td>
<td class="py-sm px-base align-top">
<div class="flex flex-col">
<span class="font-label-sm text-label-sm font-bold text-primary">Apto Sin Restricciones</span>
<span class="font-label-sm text-[11px] text-outline">Audiometría &amp; Visión OK</span>
</div>
</td>
<td class="py-sm px-base align-top">
<span class="px-base py-xs rounded bg-surface-container-high text-primary font-label-sm text-[11px] font-bold">
                Vigente 2024
              </span>
</td>
<td class="py-sm px-base align-top text-center">
<span class="px-base py-xs rounded-full bg-primary text-on-primary font-label-sm text-label-sm font-bold shadow-sm whitespace-nowrap">
                AUTORIZADO
              </span>
</td>
<td class="py-sm px-base align-top max-w-xs">
<span class="font-body-sm text-body-sm text-on-surface-variant">
                Asignado a conformación de carreteables y cunetas inter-fincas. Todo al 100%.
              </span>
</td>
<td class="py-sm px-base align-top text-right whitespace-nowrap">
<button class="p-xs rounded-lg hover:bg-surface-container text-primary" title="Gestionar Ficha">
<span class="material-symbols-outlined text-[20px]">edit_square</span>
</button>
</td>
</tr>
</tbody>
</table>
</div>
<!-- Footer of Table -->
<div class="p-gutter bg-surface-container-low flex flex-col sm:flex-row items-center justify-between gap-sm">
<div class="flex items-center gap-sm">
<span class="font-label-sm text-label-sm text-on-surface-variant">Leyenda de Estado de Llave:</span>
<span class="flex items-center gap-xs font-label-sm text-[11px] text-primary font-semibold">
<span class="w-2.5 h-2.5 rounded-full bg-primary"></span> AUTORIZADO (Entrega Inmediata)
        </span>
<span class="flex items-center gap-xs font-label-sm text-[11px] text-error font-semibold">
<span class="w-2.5 h-2.5 rounded-full bg-error"></span> BLOQUEADO (Retención Física en Almacén)
        </span>
</div>
<div class="flex items-center gap-xs font-label-sm text-label-sm text-outline">
<span class="material-symbols-outlined text-[16px]">verified_user</span> Sistema integrado con módulo PESV y Vigilancia Epidemiológica
      </div>
</div>
</div>
<!-- MODAL / CARD FLOTANTE EXPANDIDO: PROTOCOLO DE LLAVES Y DESPACHO EN FINCA -->
<div class="grid grid-cols-1 lg:grid-cols-3 gap-md">
<!-- Card Checklist Preoperacional ROPS/FOPS -->
<div class="bg-surface-container-lowest p-gutter rounded-xl shadow-sm space-y-sm flex flex-col justify-between">
<div class="space-y-xs">
<div class="flex items-center justify-between">
<span class="px-base py-xs rounded bg-surface-container-high text-primary font-label-sm text-label-sm font-bold">
            Inspección Diaria
          </span>
<span class="material-symbols-outlined text-primary text-[20px]">safety_check</span>
</div>
<h4 class="font-headline-md text-headline-md text-primary">Checklist Preoperacional Crítico</h4>
<p class="font-body-sm text-body-sm text-on-surface-variant">
          Puntos mandatorios que debe reportar el tractorista en tableta antes del encendido:
        </p>
<ul class="space-y-xs pt-xs text-on-surface font-body-sm text-body-sm">
<li class="flex items-center gap-xs">
<span class="material-symbols-outlined text-secondary text-[18px]">check_circle</span>
<span>Estructura ROPS (Arco antivuelco no soldado ni fisurado)</span>
</li>
<li class="flex items-center gap-xs">
<span class="material-symbols-outlined text-secondary text-[18px]">check_circle</span>
<span>Cinturón de seguridad de 2 o 3 puntos operable</span>
</li>
<li class="flex items-center gap-xs">
<span class="material-symbols-outlined text-secondary text-[18px]">check_circle</span>
<span>Protector giratorio de Toma de Fuerza (TDF) íntegro</span>
</li>
<li class="flex items-center gap-xs">
<span class="material-symbols-outlined text-secondary text-[18px]">check_circle</span>
<span>Frenos individuales y acople de traba de pedales</span>
</li>
<li class="flex items-center gap-xs">
<span class="material-symbols-outlined text-secondary text-[18px]">check_circle</span>
<span>Luces de trabajo y baliza estroboscópica ámbar</span>
</li>
</ul>
</div>
<button class="w-full py-xs rounded-lg bg-surface-container-low hover:bg-surface-container text-primary font-label-sm text-label-sm font-semibold transition-colors mt-sm" type="button">
        Ver Reporte de Desperfectos Reportados Hoy (2)
      </button>
</div>
<!-- Card Procedimiento de Custodia de Llaves en Almacén -->
<div class="bg-surface-container-lowest p-gutter rounded-xl shadow-sm space-y-sm flex flex-col justify-between">
<div class="space-y-xs">
<div class="flex items-center justify-between">
<span class="px-base py-xs rounded bg-error-container text-on-error-container font-label-sm text-label-sm font-bold">
            Protocolo Almacenero
          </span>
<span class="material-symbols-outlined text-error text-[20px]">key</span>
</div>
<h4 class="font-headline-md text-headline-md text-primary">Procedimiento de Custodia y Entrega</h4>
<p class="font-body-sm text-body-sm text-on-surface-variant">
          Paso a paso que ejecuta el encargado de pañol/almacén de maquinaria en cada finca:
        </p>
<div class="space-y-xs pt-xs font-body-sm text-body-sm">
<div class="p-xs rounded bg-surface-container-low flex items-start gap-xs">
<span class="font-bold text-primary">1.</span>
<span>Escaneo del código QR del carnet del tractorista en la entrada.</span>
</div>
<div class="p-xs rounded bg-surface-container-low flex items-start gap-xs">
<span class="font-bold text-primary">2.</span>
<span>Verificación de pantalla verde: "AUTORIZADO PARA OPERAR".</span>
</div>
<div class="p-xs rounded bg-surface-container-low flex items-start gap-xs">
<span class="font-bold text-error">3.</span>
<span>Si figura en ROJO, la llave permanece en el tablero con candado LOTO.</span>
</div>
<div class="p-xs rounded bg-surface-container-low flex items-start gap-xs">
<span class="font-bold text-primary">4.</span>
<span>Firma digital de entrega y registro del horómetro inicial.</span>
</div>
</div>
</div>
<button class="w-full py-xs rounded-lg bg-surface-container-low hover:bg-surface-container text-primary font-label-sm text-label-sm font-semibold transition-colors mt-sm" type="button">
        Auditoría de Llaves en Tableros de Finca
      </button>
</div>
<!-- Card Cronograma de Capacitación Técnica Especializada -->
<div class="bg-surface-container-lowest p-gutter rounded-xl shadow-sm space-y-sm flex flex-col justify-between">
<div class="space-y-xs">
<div class="flex items-center justify-between">
<span class="px-base py-xs rounded bg-secondary-fixed text-on-secondary-fixed font-label-sm text-label-sm font-bold">
            Plan Formativo 2024
          </span>
<span class="material-symbols-outlined text-secondary text-[20px]">model_training</span>
</div>
<h4 class="font-headline-md text-headline-md text-primary">Próximas Sesiones de Certificación</h4>
<p class="font-body-sm text-body-sm text-on-surface-variant">
          Reentrenamientos programados para habilitar a personal en riesgo y bloqueado:
        </p>
<div class="space-y-sm pt-xs">
<div class="flex items-center justify-between p-xs rounded bg-surface-container-low">
<div class="flex flex-col">
<span class="font-label-md text-label-md font-bold text-primary">Operación Segura en Terrenos Quebrados</span>
<span class="font-label-sm text-[11px] text-outline">SENA Agropecuario • Finca San José</span>
</div>
<span class="px-base py-xs rounded bg-secondary text-on-secondary font-label-sm text-[11px] font-semibold">28 Nov</span>
</div>
<div class="flex items-center justify-between p-xs rounded bg-surface-container-low">
<div class="flex flex-col">
<span class="font-label-md text-label-md font-bold text-primary">Manejo de Implementos y Toma de Fuerza</span>
<span class="font-label-sm text-[11px] text-outline">Instructor de Fábrica John Deere</span>
</div>
<span class="px-base py-xs rounded bg-secondary text-on-secondary font-label-sm text-[11px] font-semibold">05 Dic</span>
</div>
<div class="flex items-center justify-between p-xs rounded bg-surface-container-low">
<div class="flex flex-col">
<span class="font-label-md text-label-md font-bold text-primary">Jornada de Refrendación RUNT y CRC</span>
<span class="font-label-sm text-[11px] text-outline">Unidad Móvil de Tránsito en Finca</span>
</div>
<span class="px-base py-xs rounded bg-secondary text-on-secondary font-label-sm text-[11px] font-semibold">12 Dic</span>
</div>
</div>
</div>
<button class="w-full py-xs rounded-lg bg-primary hover:bg-primary-container text-on-primary font-label-sm text-label-sm font-semibold transition-colors mt-sm shadow-sm" type="button">
        Inscribir Operadores Bloqueados
      </button>
</div>
</div>
</div></main></div></body></html>

<!DOCTYPE html>

<html lang="es"><head><meta charset="utf-8"/><meta content="width=device-width, initial-scale=1.0" name="viewport"/><link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&amp;display=swap" rel="stylesheet"/><link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" rel="stylesheet"/>
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet"/><style>@layer base{html,body{margin:0;padding:0;}body{overscroll-behavior:none;}main>:first-child{margin-top:0!important;}main>:last-child{margin-bottom:0!important;}}::-webkit-scrollbar{display:none;}</style><script src="https://cdn.tailwindcss.com"></script><script id="tailwind-config">tailwind.config={darkMode:"class",theme:{extend:{"colors":{"secondary-fixed":"#e1e0ff","surface-container":"#e6eeff","tertiary-fixed":"#e0e3e5","on-tertiary-fixed-variant":"#444749","on-primary-fixed":"#000d60","error-container":"#ffdad6","on-background":"#0d1c2e","surface-container-high":"#dce9ff","on-primary":"#ffffff","error":"#ba1a1a","tertiary-container":"#404345","primary":"#142175","secondary-container":"#6063ee","outline":"#767682","surface-bright":"#f8f9ff","primary-container":"#2e3a8c","secondary":"#4648d4","surface-container-low":"#eff4ff","inverse-surface":"#233144","on-tertiary-fixed":"#191c1e","primary-fixed-dim":"#bcc3ff","on-primary-container":"#9ea9ff","tertiary-fixed-dim":"#c4c7c9","on-secondary-container":"#fffbff","on-secondary-fixed-variant":"#2f2ebe","primary-fixed":"#dfe0ff","surface-tint":"#4b57aa","on-surface-variant":"#454651","on-error":"#ffffff","inverse-on-surface":"#eaf1ff","on-tertiary-container":"#adb0b2","surface-container-highest":"#d5e3fc","outline-variant":"#c6c5d3","on-primary-fixed-variant":"#333f91","on-tertiary":"#ffffff","on-secondary-fixed":"#07006c","surface-variant":"#d5e3fc","surface-dim":"#ccdbf3","inverse-primary":"#bcc3ff","tertiary":"#2a2d2f","surface-container-lowest":"#ffffff","on-secondary":"#ffffff","background":"#f8f9ff","secondary-fixed-dim":"#c0c1ff","on-surface":"#0d1c2e","surface":"#f8f9ff","on-error-container":"#93000a"},"borderRadius":{"DEFAULT":"0.25rem","lg":"0.5rem","xl":"0.75rem","full":"9999px"},"spacing":{"base":"8px","gutter":"24px","xs":"4px","xl":"80px","sm":"12px","lg":"48px","container-max":"1280px","md":"24px"},"fontFamily":{"body-md":["Inter"],"display-lg":["Inter"],"label-md":["Inter"],"headline-lg-mobile":["Inter"],"body-sm":["Inter"],"headline-lg":["Inter"],"label-sm":["Inter"],"headline-md":["Inter"],"body-lg":["Inter"]},"fontSize":{"body-md":["16px",{"lineHeight":"24px","fontWeight":"400"}],"display-lg":["48px",{"lineHeight":"56px","letterSpacing":"-0.02em","fontWeight":"700"}],"label-md":["14px",{"lineHeight":"16px","letterSpacing":"0.01em","fontWeight":"500"}],"headline-lg-mobile":["24px",{"lineHeight":"32px","fontWeight":"600"}],"body-sm":["14px",{"lineHeight":"20px","fontWeight":"400"}],"headline-lg":["32px",{"lineHeight":"40px","letterSpacing":"-0.01em","fontWeight":"600"}],"label-sm":["12px",{"lineHeight":"14px","fontWeight":"600"}],"headline-md":["24px",{"lineHeight":"32px","fontWeight":"600"}],"body-lg":["18px",{"lineHeight":"28px","fontWeight":"400"}]}}}}</script></head><body class="bg-surface font-body-md text-body-md text-on-surface antialiased"><aside class="fixed left-0 top-0 h-screen w-72 bg-surface-container-lowest shadow-[0_1px_8px_rgba(0,0,0,0.04)] z-50 flex flex-col"><div class="h-16 px-gutter flex items-center gap-sm bg-surface-container-low"><div class="w-8 h-8 rounded-lg bg-primary flex items-center justify-center"><span class="material-symbols-outlined text-on-primary text-[20px]">verified_user</span></div><div class="flex flex-col"><span class="font-label-md text-label-md text-primary font-bold tracking-tight">GRUPO MANZANARES</span><span class="font-label-sm text-[10px] text-on-surface-variant font-medium tracking-wider uppercase">SG-SST Integral S.A.S.</span></div></div><div class="px-md py-sm bg-surface-container-highest flex items-center justify-between"><span class="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider font-semibold">Estándares Mínimos</span><span class="px-base py-xs rounded-full bg-primary-container text-on-primary-container font-label-sm text-label-sm font-semibold">Res. 0312</span></div><nav class="flex-1 overflow-y-auto px-sm py-sm space-y-md" data-active-classes="bg-primary-container text-on-primary font-semibold"><div class="space-y-xs"><div class="px-base py-xs font-label-sm text-label-sm uppercase tracking-wider text-outline font-semibold">Gestión Operativa</div><a class="flex items-center gap-sm px-base py-xs rounded-lg text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface transition-colors" data-path="inicio-dashboard" href="#"><span class="material-symbols-outlined text-[20px]">home</span><span class="font-label-md text-label-md">Inicio / Dashboard</span></a><a class="flex items-center gap-sm px-base py-xs rounded-lg text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface transition-colors" data-path="trabajadores" href="#"><span class="material-symbols-outlined text-[20px]">engineering</span><span class="font-label-md text-label-md">Trabajadores</span></a><a class="flex items-center gap-sm px-base py-xs rounded-lg text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface transition-colors" data-path="examenes-medicos-emos" href="#"><span class="material-symbols-outlined text-[20px]">stethoscope</span><span class="font-label-md text-label-md">Exámenes Médicos (EMOS)</span></a><a class="flex items-center gap-sm px-base py-xs rounded-lg text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface transition-colors" data-path="casos-de-salud" href="#"><span class="material-symbols-outlined text-[20px]">local_hospital</span><span class="font-label-md text-label-md">Casos de Salud</span></a><a class="flex items-center gap-sm px-base py-xs rounded-lg text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface transition-colors" data-path="incapacidades-y-reintegros" href="#"><span class="material-symbols-outlined text-[20px]">event_available</span><span class="font-label-md text-label-md">Incapacidades y Reintegros</span></a></div><div class="space-y-xs"><div class="px-base py-xs font-label-sm text-label-sm uppercase tracking-wider text-outline font-semibold">Riesgos Críticos &amp; Viales</div><a class="flex items-center gap-sm px-base py-xs rounded-lg text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface transition-colors" data-path="trabajo-en-alturas" href="#"><span class="material-symbols-outlined text-[20px]">stairs</span><span class="font-label-md text-label-md">Trabajo en Alturas</span></a><a class="flex items-center gap-sm px-base py-xs rounded-lg text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface transition-colors" data-path="tractoristas-operadores" href="#"><span class="material-symbols-outlined text-[20px]">agriculture</span><span class="font-label-md text-label-md">Tractoristas / Operadores</span></a><a aria-current="page" class="flex items-center gap-sm px-base py-xs rounded-lg transition-colors bg-primary-container text-on-primary font-semibold" data-path="pesv-seguridad-vial" href="#"><span class="material-symbols-outlined text-[20px]">directions_car</span><span class="font-label-md text-label-md">PESV (Seguridad Vial)</span></a><a class="flex items-center gap-sm px-base py-xs rounded-lg text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface transition-colors" data-path="epp" href="#"><span class="material-symbols-outlined text-[20px]">security</span><span class="font-label-md text-label-md">EPP</span></a></div><div class="space-y-xs"><div class="px-base py-xs font-label-sm text-label-sm uppercase tracking-wider text-outline font-semibold">Inspección &amp; Eventos</div><a class="flex items-center gap-sm px-base py-xs rounded-lg text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface transition-colors" data-path="inspecciones" href="#"><span class="material-symbols-outlined text-[20px]">search</span><span class="font-label-md text-label-md">Inspecciones</span></a><a class="flex items-center gap-sm px-base py-xs rounded-lg text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface transition-colors" data-path="accidentes-e-incidentes" href="#"><span class="material-symbols-outlined text-[20px]">notification_important</span><span class="font-label-md text-label-md">Accidentes e Incidentes</span></a><a class="flex items-center gap-sm px-base py-xs rounded-lg text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface transition-colors" data-path="investigaciones" href="#"><span class="material-symbols-outlined text-[20px]">fact_check</span><span class="font-label-md text-label-md">Investigaciones</span></a><a class="flex items-center gap-sm px-base py-xs rounded-lg text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface transition-colors" data-path="acciones-correctivas" href="#"><span class="material-symbols-outlined text-[20px]">build</span><span class="font-label-md text-label-md">Acciones Correctivas</span></a></div><div class="space-y-xs"><div class="px-base py-xs font-label-sm text-label-sm uppercase tracking-wider text-outline font-semibold">Comités &amp; Cultura</div><a class="flex items-center gap-sm px-base py-xs rounded-lg text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface transition-colors" data-path="capacitaciones" href="#"><span class="material-symbols-outlined text-[20px]">school</span><span class="font-label-md text-label-md">Capacitaciones</span></a><a class="flex items-center gap-sm px-base py-xs rounded-lg text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface transition-colors" data-path="documentos-sg-sst" href="#"><span class="material-symbols-outlined text-[20px]">description</span><span class="font-label-md text-label-md">Documentos SG-SST</span></a><a class="flex items-center gap-sm px-base py-xs rounded-lg text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface transition-colors" data-path="copasst" href="#"><span class="material-symbols-outlined text-[20px]">groups</span><span class="font-label-md text-label-md">COPASST</span></a><a class="flex items-center gap-sm px-base py-xs rounded-lg text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface transition-colors" data-path="ccl" href="#"><span class="material-symbols-outlined text-[20px]">handshake</span><span class="font-label-md text-label-md">CCL</span></a><a class="flex items-center gap-sm px-base py-xs rounded-lg text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface transition-colors" data-path="emergencias" href="#"><span class="material-symbols-outlined text-[20px]">fire_extinguisher</span><span class="font-label-md text-label-md">Emergencias</span></a><a class="flex items-center gap-sm px-base py-xs rounded-lg text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface transition-colors" data-path="quimicos" href="#"><span class="material-symbols-outlined text-[20px]">science</span><span class="font-label-md text-label-md">Químicos</span></a></div><div class="space-y-xs"><div class="px-base py-xs font-label-sm text-label-sm uppercase tracking-wider text-outline font-semibold">Estrategia &amp; Control</div><a class="flex items-center gap-sm px-base py-xs rounded-lg text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface transition-colors" data-path="analisis-sst" href="#"><span class="material-symbols-outlined text-[20px]">monitoring</span><span class="font-label-md text-label-md">Análisis SST</span></a><a class="flex items-center gap-sm px-base py-xs rounded-lg text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface transition-colors" data-path="configuracion" href="#"><span class="material-symbols-outlined text-[20px]">settings</span><span class="font-label-md text-label-md">Configuración</span></a></div></nav><div class="p-md bg-surface-container-low"><div class="flex items-center gap-xs"><span class="w-2 h-2 rounded-full bg-secondary"></span><span class="font-label-sm text-label-sm text-on-surface-variant font-medium">Decreto 1072 / Res 4272</span></div><p class="font-label-sm text-[11px] text-outline mt-xs">Versión Auditada 2024.1</p></div></aside><div class="pl-72 min-h-screen bg-surface flex flex-col"><header class="fixed top-0 left-72 right-0 h-16 bg-surface/90 backdrop-blur-xl shadow-[0_1px_8px_rgba(0,0,0,0.04)] z-40"><div class="h-16 px-gutter flex items-center justify-between"><div class="flex items-center gap-md"><div class="flex items-center gap-xs"><span class="font-label-md text-label-md font-semibold text-primary">Grupo Manzanares S.A.S.</span><span class="text-outline-variant font-body-sm text-body-sm">|</span><span class="font-label-md text-label-md text-on-surface-variant">Sistema Integrado SG-SST</span></div><div class="hidden xl:flex items-center gap-xs px-base py-xs rounded-full bg-surface-container-high"><span class="material-symbols-outlined text-[16px] text-primary">verified</span><span class="font-label-sm text-label-sm text-on-surface">Dec. 1072 / Res. 0312 / PESV Res. 40595</span></div></div><div class="flex items-center gap-md"><div class="flex items-center gap-xs px-base py-xs rounded-full bg-surface-container-low"><span class="w-2 h-2 rounded-full bg-secondary-container animate-pulse"></span><span class="font-label-sm text-label-sm text-on-surface-variant font-medium">Sincronizado</span></div><button class="flex items-center gap-xs px-base py-xs rounded-lg bg-error text-on-error font-label-md text-label-md shadow-sm hover:opacity-90 transition-opacity" type="button"><span class="material-symbols-outlined text-[18px]">warning</span><span>Reporte Rápido</span></button><div class="h-6 w-[1px] bg-outline-variant"></div><div class="flex items-center gap-sm"><div class="flex flex-col text-right hidden sm:flex"><span class="font-label-md text-label-md font-semibold text-on-surface leading-tight">Ing. Andrés Valencia</span><span class="font-label-sm text-label-sm text-outline leading-tight">Coordinador SG-SST</span></div><div class="w-8 h-8 rounded-full bg-primary flex items-center justify-center"><span class="material-symbols-outlined text-on-primary text-[18px]">person</span></div></div></div></div></header><main class="w-full pt-16 flex-1 px-gutter py-md bg-surface"><div class="flex flex-col w-full space-y-md">
<!-- Encabezado Principal de PESV -->
<div class="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-md p-gutter rounded-xl bg-surface-container-low shadow-sm">
<div class="flex flex-col space-y-xs max-w-4xl">
<div class="flex items-center gap-xs flex-wrap">
<span class="px-base py-xs rounded-full bg-primary text-on-primary font-label-sm text-label-sm uppercase tracking-wide">
          Pilar 3: Infraestructura &amp; Vehículos
        </span>
<span class="px-base py-xs rounded-full bg-surface-container-highest text-on-surface-variant font-label-sm text-label-sm">
          Ley 2251 de 2022 (Ley Julián Esteban)
        </span>
<span class="px-base py-xs rounded-full bg-secondary-fixed text-on-secondary-fixed font-label-sm text-label-sm">
          Res. 40595 / 2022 • Nivel Avanzado
        </span>
</div>
<h1 class="font-headline-lg text-headline-lg text-primary tracking-tight">
        11. Plan Estratégico de Seguridad Vial (PESV)
      </h1>
<p class="font-body-md text-body-md text-on-surface-variant">
        Gestión integral de factores de desempeño vial: Conductores asignados, flota vehicular, inspecciones preoperacionales diarias y analítica de siniestralidad para Grupo Manzanares S.A.S.
      </p>
</div>
<!-- Botonera de Acciones Rápidas -->
<div class="flex flex-wrap items-center gap-xs lg:justify-end">
<button class="flex items-center gap-xs px-base py-xs rounded-lg bg-surface-container-lowest text-primary shadow-sm hover:bg-surface-container-high transition-colors font-label-md text-label-md" type="button">
<span class="material-symbols-outlined text-[18px]">file_download</span>
<span>Exportar .XLSX</span>
</button>
<button class="flex items-center gap-xs px-base py-xs rounded-lg bg-surface-container-highest text-on-surface hover:bg-surface-container-high transition-colors font-label-md text-label-md" type="button">
<span class="material-symbols-outlined text-[18px]">smartphone</span>
<span>Preoperacional Móvil</span>
</button>
<button class="flex items-center gap-xs px-base py-xs rounded-lg bg-secondary text-on-secondary shadow-sm hover:opacity-95 transition-opacity font-label-md text-label-md" type="button">
<span class="material-symbols-outlined text-[18px]">rv_hookup</span>
<span>+ Añadir Vehículo</span>
</button>
<button class="flex items-center gap-xs px-base py-xs rounded-lg bg-primary text-on-primary shadow-md hover:bg-primary-container transition-colors font-label-md text-label-md" type="button">
<span class="material-symbols-outlined text-[18px]">person_add</span>
<span>+ Registrar Conductor</span>
</button>
</div>
</div>
<!-- Dashboard de Indicadores Obligatorios (8 Métricas PESV) -->
<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-sm">
<!-- Indicador 1: % Preoperacionales -->
<div class="p-gutter rounded-xl bg-surface-container-lowest shadow-sm flex flex-col justify-between space-y-sm hover:-translate-y-1 transition-transform">
<div class="flex items-center justify-between">
<span class="font-label-sm text-label-sm text-outline uppercase font-semibold">1. Preoperacionales Diarios</span>
<div class="w-8 h-8 rounded-lg bg-surface-container-high flex items-center justify-center text-primary">
<span class="material-symbols-outlined text-[20px]">fact_check</span>
</div>
</div>
<div>
<div class="flex items-baseline gap-xs">
<span class="font-display-lg text-display-lg text-primary">98.4%</span>
<span class="font-label-sm text-label-sm text-secondary font-semibold">Meta &gt;95%</span>
</div>
<p class="font-body-sm text-body-sm text-on-surface-variant mt-xs">46 de 47 inspecciones fotográficas cargadas hoy antes del despacho.</p>
</div>
<div class="w-full bg-surface-container-high h-2 rounded-full overflow-hidden">
<div class="bg-secondary-container h-full rounded-full" style="width: 98.4%;"></div>
</div>
</div>
<!-- Indicador 2: Conductores Autorizados -->
<div class="p-gutter rounded-xl bg-surface-container-lowest shadow-sm flex flex-col justify-between space-y-sm hover:-translate-y-1 transition-transform">
<div class="flex items-center justify-between">
<span class="font-label-sm text-label-sm text-outline uppercase font-semibold">2. Conductores Habilitados</span>
<div class="w-8 h-8 rounded-lg bg-surface-container-high flex items-center justify-center text-primary">
<span class="material-symbols-outlined text-[20px]">badge</span>
</div>
</div>
<div>
<div class="flex items-baseline gap-xs">
<span class="font-display-lg text-display-lg text-on-surface">42</span>
<span class="font-label-md text-label-md text-on-surface-variant font-medium">/ 48 Evaluados</span>
</div>
<p class="font-body-sm text-body-sm text-error mt-xs flex items-center gap-xs">
<span class="material-symbols-outlined text-[16px]">lock</span>
          6 bloqueados (Licencia / Psicosensométrico)
        </p>
</div>
<div class="flex items-center gap-xs">
<span class="w-2 h-2 rounded-full bg-primary"></span>
<span class="font-label-sm text-label-sm text-on-surface-variant">RUNT / SIMIT Auditado al 100%</span>
</div>
</div>
<!-- Indicador 3: Vehículos Inspeccionados -->
<div class="p-gutter rounded-xl bg-surface-container-lowest shadow-sm flex flex-col justify-between space-y-sm hover:-translate-y-1 transition-transform">
<div class="flex items-center justify-between">
<span class="font-label-sm text-label-sm text-outline uppercase font-semibold">3. Flota Operativa Verificada</span>
<div class="w-8 h-8 rounded-lg bg-surface-container-high flex items-center justify-center text-primary">
<span class="material-symbols-outlined text-[20px]">directions_car</span>
</div>
</div>
<div>
<div class="flex items-baseline gap-xs">
<span class="font-display-lg text-display-lg text-on-surface">38</span>
<span class="font-label-md text-label-md text-on-surface-variant font-medium">/ 38 Unidades</span>
</div>
<p class="font-body-sm text-body-sm text-on-surface-variant mt-xs">100% inventario verificado en patios La Esperanza y Manzanares.</p>
</div>
<div class="flex items-center gap-xs text-primary font-label-sm text-label-sm font-semibold">
<span class="material-symbols-outlined text-[16px]">verified</span>
<span>Aptitud mecánica confirmada</span>
</div>
</div>
<!-- Indicador 4: Documentos Próximos a Vencer -->
<div class="p-gutter rounded-xl bg-surface-container-lowest shadow-sm flex flex-col justify-between space-y-sm hover:-translate-y-1 transition-transform">
<div class="flex items-center justify-between">
<span class="font-label-sm text-label-sm text-outline uppercase font-semibold">4. Vencimientos &lt; 30 Días</span>
<div class="w-8 h-8 rounded-lg bg-error-container text-on-error-container flex items-center justify-center">
<span class="material-symbols-outlined text-[20px]">notification_important</span>
</div>
</div>
<div>
<div class="flex items-baseline gap-xs">
<span class="font-display-lg text-display-lg text-error">5</span>
<span class="font-label-sm text-label-sm text-on-surface-variant">Alertas activas</span>
</div>
<p class="font-body-sm text-body-sm text-on-surface-variant mt-xs">2 SOAT, 2 Tecnomecánicas y 1 Póliza contractual.</p>
</div>
<div class="px-base py-xs rounded bg-surface-container-low text-on-surface-variant font-label-sm text-label-sm flex items-center justify-between">
<span>Próximo corte crítico:</span>
<span class="font-semibold text-primary">04/Nov</span>
</div>
</div>
<!-- Indicador 5: Incidentes Viales (Mes / Año) -->
<div class="p-gutter rounded-xl bg-surface-container-lowest shadow-sm flex flex-col justify-between space-y-sm hover:-translate-y-1 transition-transform">
<div class="flex items-center justify-between">
<span class="font-label-sm text-label-sm text-outline uppercase font-semibold">5. Incidentes Viales (Mes)</span>
<div class="w-8 h-8 rounded-lg bg-surface-container-high flex items-center justify-center text-primary">
<span class="material-symbols-outlined text-[20px]">minor_crash</span>
</div>
</div>
<div>
<div class="flex items-baseline gap-xs">
<span class="font-display-lg text-display-lg text-on-surface">1</span>
<span class="font-label-sm text-label-sm text-on-surface-variant">Leve sin lesiones</span>
</div>
<p class="font-body-sm text-body-sm text-on-surface-variant mt-xs">Raspón de espejo retrovisor derecho en trocha veredal Finca Central.</p>
</div>
<div class="flex items-center gap-xs font-label-sm text-label-sm text-secondary">
<span class="material-symbols-outlined text-[16px]">check_circle</span>
<span>Reporte cerrado con ARL</span>
</div>
</div>
<!-- Indicador 6: Accidentes Viales -->
<div class="p-gutter rounded-xl bg-surface-container-lowest shadow-sm flex flex-col justify-between space-y-sm hover:-translate-y-1 transition-transform">
<div class="flex items-center justify-between">
<span class="font-label-sm text-label-sm text-outline uppercase font-semibold">6. Siniestros Con Lesión</span>
<div class="w-8 h-8 rounded-lg bg-secondary-fixed text-on-secondary-fixed flex items-center justify-center">
<span class="material-symbols-outlined text-[20px]">car_crash</span>
</div>
</div>
<div>
<div class="flex items-baseline gap-xs">
<span class="font-display-lg text-display-lg text-primary">0</span>
<span class="font-label-sm text-label-sm text-on-surface-variant">Días con tiempo perdido: 0</span>
</div>
<p class="font-body-sm text-body-sm text-on-surface-variant mt-xs">286 días corridos sin siniestros incapacitantes en rutas agrícolas.</p>
</div>
<div class="flex items-center gap-xs font-label-sm text-label-sm text-on-surface-variant">
<span class="w-2 h-2 rounded-full bg-secondary-container"></span>
<span>Visión Cero Siniestralidad</span>
</div>
</div>
<!-- Indicador 7: Kilómetros Recorridos -->
<div class="p-gutter rounded-xl bg-surface-container-lowest shadow-sm flex flex-col justify-between space-y-sm hover:-translate-y-1 transition-transform">
<div class="flex items-center justify-between">
<span class="font-label-sm text-label-sm text-outline uppercase font-semibold">7. Kilómetros Recorridos</span>
<div class="w-8 h-8 rounded-lg bg-surface-container-high flex items-center justify-center text-primary">
<span class="material-symbols-outlined text-[20px]">speed</span>
</div>
</div>
<div>
<div class="flex items-baseline gap-xs">
<span class="font-display-lg text-display-lg text-on-surface">34.850</span>
<span class="font-label-sm text-label-sm text-on-surface-variant font-medium">km / mes</span>
</div>
<p class="font-body-sm text-body-sm text-on-surface-variant mt-xs">Telemetría GPS activa con control de velocidad &lt; 60 km/h en vías privadas.</p>
</div>
<div class="w-full bg-surface-container-high h-2 rounded-full overflow-hidden">
<div class="bg-primary h-full rounded-full" style="width: 72%;"></div>
</div>
</div>
<!-- Indicador 8: Hallazgos y No Conformidades -->
<div class="p-gutter rounded-xl bg-surface-container-lowest shadow-sm flex flex-col justify-between space-y-sm hover:-translate-y-1 transition-transform">
<div class="flex items-center justify-between">
<span class="font-label-sm text-label-sm text-outline uppercase font-semibold">8. Hallazgos Mecánicos</span>
<div class="w-8 h-8 rounded-lg bg-surface-container-highest text-primary flex items-center justify-center">
<span class="material-symbols-outlined text-[20px]">build_circle</span>
</div>
</div>
<div>
<div class="flex items-baseline gap-xs">
<span class="font-display-lg text-display-lg text-on-surface">4</span>
<span class="font-label-sm text-label-sm text-error font-semibold">Abiertos</span>
</div>
<p class="font-body-sm text-body-sm text-on-surface-variant mt-xs">2 por labrado de llantas (&lt; 2.0mm) y 2 pastillas de freno en ajuste.</p>
</div>
<div class="flex items-center justify-between font-label-sm text-label-sm">
<span class="text-on-surface-variant">Taller preventivo:</span>
<span class="font-semibold text-primary">3 en proceso</span>
</div>
</div>
</div>
<!-- Navegación por Pestañas (Tabs) -->
<div class="flex flex-col space-y-md">
<div class="flex items-center gap-xs p-xs rounded-xl bg-surface-container-low overflow-x-auto">
<button class="flex items-center gap-xs px-gutter py-sm rounded-lg bg-primary text-on-primary font-label-md text-label-md transition-all shadow-sm" id="tab-btn-conductores" onclick="cambiarPestana('conductores')">
<span class="material-symbols-outlined text-[20px]">badge</span>
<span>🚗 Matriz de Conductores Autorizados</span>
<span class="px-xs py-0.5 rounded-full bg-primary-container text-on-primary-container text-label-sm">48</span>
</button>
<button class="flex items-center gap-xs px-gutter py-sm rounded-lg text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface font-label-md text-label-md transition-all" id="tab-btn-flota" onclick="cambiarPestana('flota')">
<span class="material-symbols-outlined text-[20px]">agriculture</span>
<span>🚛 Flota de Vehículos y Maquinaria</span>
<span class="px-xs py-0.5 rounded-full bg-surface-container-highest text-on-surface-variant text-label-sm">38</span>
</button>
<button class="flex items-center gap-xs px-gutter py-sm rounded-lg text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface font-label-md text-label-md transition-all" id="tab-btn-preoperacional" onclick="cambiarPestana('preoperacional')">
<span class="material-symbols-outlined text-[20px]">assignment_turned_in</span>
<span>📋 Registro Preoperacional Diario y Hallazgos</span>
<span class="px-xs py-0.5 rounded-full bg-error-container text-on-error-container text-label-sm">4 Hallazgos</span>
</button>
</div>
<!-- PESTAÑA A: Matriz de Conductores Autorizados -->
<div class="flex flex-col space-y-md" id="seccion-conductores">
<!-- Filtros y Búsqueda -->
<div class="p-gutter rounded-xl bg-surface-container-lowest shadow-sm flex flex-col md:flex-row items-center justify-between gap-md">
<div class="flex flex-1 items-center gap-sm w-full md:w-auto">
<div class="relative flex-1 max-w-md">
<span class="material-symbols-outlined absolute left-base top-1/2 -translate-y-1/2 text-outline text-[20px]">search</span>
<input class="w-full pl-xl pr-base py-xs rounded-lg bg-surface-container-low text-on-surface font-body-sm text-body-sm outline-none focus:bg-surface-container-lowest focus:ring-2 focus:ring-primary transition-all" placeholder="Buscar por nombre, cédula o placa asignada..." type="text"/>
</div>
<select class="px-base py-xs rounded-lg bg-surface-container-low text-on-surface font-body-sm text-body-sm outline-none focus:ring-2 focus:ring-primary">
<option value="">Todas las Categorías</option>
<option value="C1">C1 (Automóviles / Camionetas Servicio Público)</option>
<option value="C2">C2 (Camiones Rígidos)</option>
<option value="B1">B1 (Particular)</option>
<option value="A2">A2 (Motocicletas)</option>
</select>
<select class="px-base py-xs rounded-lg bg-surface-container-low text-on-surface font-body-sm text-body-sm outline-none focus:ring-2 focus:ring-primary">
<option value="">Todos los Estados</option>
<option value="AUTORIZADO">Autorizados</option>
<option value="SUSPENDIDO">Suspendidos / Bloqueados</option>
</select>
</div>
<div class="flex items-center gap-xs font-label-sm text-label-sm text-on-surface-variant">
<span class="w-2 h-2 rounded-full bg-secondary-container"></span>
<span>Interconexión con Maestro Trabajadores &amp; RUNT</span>
</div>
</div>
<!-- Tabla de Conductores -->
<div class="overflow-x-auto rounded-xl bg-surface-container-lowest shadow-sm">
<table class="w-full text-left font-body-sm text-body-sm">
<thead class="bg-surface-container-low text-outline font-label-sm text-label-sm uppercase tracking-wider">
<tr>
<th class="px-gutter py-sm">Conductor / ID Maestro</th>
<th class="px-base py-sm">Cargo &amp; Sede</th>
<th class="px-base py-sm">Vehículo &amp; Placa</th>
<th class="px-base py-sm">Licencia / RUNT</th>
<th class="px-base py-sm">Curso Vial 8h</th>
<th class="px-base py-sm">EMO Psicosensométrico</th>
<th class="px-base py-sm">Estado Autorización</th>
<th class="px-gutter py-sm text-right">Acciones</th>
</tr>
</thead>
<tbody class="divide-y-0">
<!-- Fila 1: Autorizado -->
<tr class="hover:bg-surface-container-low transition-colors">
<td class="px-gutter py-sm">
<div class="flex items-center gap-sm">
<div class="w-10 h-10 rounded-full bg-primary-container text-on-primary font-bold flex items-center justify-center text-[13px]">
                    HR
                  </div>
<div class="flex flex-col">
<span class="font-label-md text-label-md text-on-surface font-semibold">Héctor Fabio Ramírez</span>
<span class="font-label-sm text-label-sm text-outline">CC. 16.789.204 • MNZ-0112</span>
</div>
</div>
</td>
<td class="px-base py-sm">
<div class="flex flex-col">
<span class="font-body-sm text-body-sm text-on-surface font-medium">Tractorista Líder</span>
<span class="font-label-sm text-label-sm text-outline">Finca La Esperanza</span>
</div>
</td>
<td class="px-base py-sm">
<div class="flex flex-col">
<span class="font-label-md text-label-md font-semibold text-primary">OPN-891</span>
<span class="font-label-sm text-label-sm text-outline">Tractor John Deere 5075E</span>
</div>
</td>
<td class="px-base py-sm">
<div class="flex flex-col">
<div class="flex items-center gap-xs">
<span class="px-xs py-0.5 rounded bg-surface-container-high text-primary font-label-sm font-bold">C2</span>
<span class="font-body-sm text-body-sm text-on-surface">RUNT-9928172</span>
</div>
<span class="font-label-sm text-label-sm text-secondary font-medium">Vigente (18/Nov/2026)</span>
</div>
</td>
<td class="px-base py-sm">
<div class="flex flex-col">
<span class="font-body-sm text-body-sm text-on-surface">Manejo Seguro Agrícola</span>
<span class="font-label-sm text-label-sm text-outline">SENA • 24/Mar/2024</span>
</div>
</td>
<td class="px-base py-sm">
<div class="flex flex-col">
<div class="flex items-center gap-xs">
<span class="w-2 h-2 rounded-full bg-secondary-container"></span>
<span class="font-label-sm text-label-sm font-semibold text-on-surface">Apto Sin Restricción</span>
</div>
<span class="font-label-sm text-label-sm text-outline">Visiometría / Audiometría OK</span>
</div>
</td>
<td class="px-base py-sm">
<span class="inline-flex items-center gap-xs px-base py-xs rounded-full bg-surface-container-high text-primary font-label-sm text-label-sm font-bold">
<span class="material-symbols-outlined text-[14px]">check_circle</span>
                  AUTORIZADO
                </span>
</td>
<td class="px-gutter py-sm text-right">
<div class="flex items-center justify-end gap-xs">
<button class="p-xs rounded-lg hover:bg-surface-container-high text-on-surface-variant transition-colors" title="Ver Hoja de Vida Vial" type="button">
<span class="material-symbols-outlined text-[18px]">visibility</span>
</button>
<button class="p-xs rounded-lg hover:bg-surface-container-high text-primary transition-colors" title="Generar Carnet PESV" type="button">
<span class="material-symbols-outlined text-[18px]">badge</span>
</button>
</div>
</td>
</tr>
<!-- Fila 2: Conductor Camioneta -->
<tr class="bg-surface-container-low/30 hover:bg-surface-container-low transition-colors">
<td class="px-gutter py-sm">
<div class="flex items-center gap-sm">
<div class="w-10 h-10 rounded-full bg-secondary-fixed text-on-secondary-fixed font-bold flex items-center justify-center text-[13px]">
                    CG
                  </div>
<div class="flex flex-col">
<span class="font-label-md text-label-md text-on-surface font-semibold">Carlos Gómez Pineda</span>
<span class="font-label-sm text-label-sm text-outline">CC. 94.382.110 • MNZ-0205</span>
</div>
</div>
</td>
<td class="px-base py-sm">
<div class="flex flex-col">
<span class="font-body-sm text-body-sm text-on-surface font-medium">Conductor Cuadrilla</span>
<span class="font-label-sm text-label-sm text-outline">Planta Manzanares</span>
</div>
</td>
<td class="px-base py-sm">
<div class="flex flex-col">
<span class="font-label-md text-label-md font-semibold text-primary">WDF-452</span>
<span class="font-label-sm text-label-sm text-outline">Toyota Hilux 4x4</span>
</div>
</td>
<td class="px-base py-sm">
<div class="flex flex-col">
<div class="flex items-center gap-xs">
<span class="px-xs py-0.5 rounded bg-surface-container-high text-primary font-label-sm font-bold">C1</span>
<span class="font-body-sm text-body-sm text-on-surface">RUNT-1029381</span>
</div>
<span class="font-label-sm text-label-sm text-secondary font-medium">Vigente (12/Ago/2025)</span>
</div>
</td>
<td class="px-base py-sm">
<div class="flex flex-col">
<span class="font-body-sm text-body-sm text-on-surface">Defensivo en 4x4 / Terrenos</span>
<span class="font-label-sm text-label-sm text-outline">ARL Sura • 15/Ene/2024</span>
</div>
</td>
<td class="px-base py-sm">
<div class="flex flex-col">
<div class="flex items-center gap-xs">
<span class="w-2 h-2 rounded-full bg-secondary-container"></span>
<span class="font-label-sm text-label-sm font-semibold text-on-surface">Apto con Lentes</span>
</div>
<span class="font-label-sm text-label-sm text-outline">Uso correctivo permanente</span>
</div>
</td>
<td class="px-base py-sm">
<span class="inline-flex items-center gap-xs px-base py-xs rounded-full bg-surface-container-high text-primary font-label-sm text-label-sm font-bold">
<span class="material-symbols-outlined text-[14px]">check_circle</span>
                  AUTORIZADO
                </span>
</td>
<td class="px-gutter py-sm text-right">
<div class="flex items-center justify-end gap-xs">
<button class="p-xs rounded-lg hover:bg-surface-container-high text-on-surface-variant transition-colors" title="Ver Hoja de Vida Vial" type="button">
<span class="material-symbols-outlined text-[18px]">visibility</span>
</button>
<button class="p-xs rounded-lg hover:bg-surface-container-high text-primary transition-colors" title="Generar Carnet PESV" type="button">
<span class="material-symbols-outlined text-[18px]">badge</span>
</button>
</div>
</td>
</tr>
<!-- Fila 3: SUSPENDIDO / BLOQUEADO POR LICENCIA -->
<tr class="bg-error-container/20 hover:bg-error-container/30 transition-colors">
<td class="px-gutter py-sm">
<div class="flex items-center gap-sm">
<div class="w-10 h-10 rounded-full bg-error-container text-on-error-container font-bold flex items-center justify-center text-[13px]">
                    JA
                  </div>
<div class="flex flex-col">
<span class="font-label-md text-label-md text-on-surface font-semibold">Jorge Alarcón Silva</span>
<span class="font-label-sm text-label-sm text-outline">CC. 80.442.990 • MNZ-0089</span>
</div>
</div>
</td>
<td class="px-base py-sm">
<div class="flex flex-col">
<span class="font-body-sm text-body-sm text-on-surface font-medium">Conductor Distribución</span>
<span class="font-label-sm text-label-sm text-outline">Sede Logística Pereira</span>
</div>
</td>
<td class="px-base py-sm">
<div class="flex flex-col">
<span class="font-label-md text-label-md font-semibold text-on-surface">TLR-310</span>
<span class="font-label-sm text-label-sm text-outline">Isuzu NPR Turbo</span>
</div>
</td>
<td class="px-base py-sm">
<div class="flex flex-col">
<div class="flex items-center gap-xs">
<span class="px-xs py-0.5 rounded bg-error text-on-error font-label-sm font-bold">C2</span>
<span class="font-body-sm text-body-sm text-error font-bold">VENCIDA</span>
</div>
<span class="font-label-sm text-label-sm text-error font-medium">Venció: 15/Oct/2024</span>
</div>
</td>
<td class="px-base py-sm">
<div class="flex flex-col">
<span class="font-body-sm text-body-sm text-on-surface">Manejo Defensivo 8h</span>
<span class="font-label-sm text-label-sm text-error font-semibold">Vencido hace 12 días</span>
</div>
</td>
<td class="px-base py-sm">
<div class="flex flex-col">
<div class="flex items-center gap-xs">
<span class="w-2 h-2 rounded-full bg-error"></span>
<span class="font-label-sm text-label-sm font-semibold text-error">Psicotécnico Vencido</span>
</div>
<span class="font-label-sm text-label-sm text-outline">Cita EMO: 02/Nov</span>
</div>
</td>
<td class="px-base py-sm">
<span class="inline-flex items-center gap-xs px-base py-xs rounded-full bg-error text-on-error font-label-sm text-label-sm font-bold">
<span class="material-symbols-outlined text-[14px]">block</span>
                  SUSPENDIDO
                </span>
</td>
<td class="px-gutter py-sm text-right">
<div class="flex items-center justify-end gap-xs">
<button class="px-base py-xs rounded-lg bg-surface-container-lowest text-error font-label-sm text-label-sm hover:bg-surface-container-high transition-colors" title="Notificar Trabajador y GH" type="button">
                    Gestionar Bloqueo
                  </button>
</div>
</td>
</tr>
<!-- Fila 4: Mensajero / Motocicleta -->
<tr class="hover:bg-surface-container-low transition-colors">
<td class="px-gutter py-sm">
<div class="flex items-center gap-sm">
<div class="w-10 h-10 rounded-full bg-surface-container-high text-primary font-bold flex items-center justify-center text-[13px]">
                    LM
                  </div>
<div class="flex flex-col">
<span class="font-label-md text-label-md text-on-surface font-semibold">Luis Miguel Morales</span>
<span class="font-label-sm text-label-sm text-outline">CC. 1.115.820.301 • MNZ-0311</span>
</div>
</div>
</td>
<td class="px-base py-sm">
<div class="flex flex-col">
<span class="font-body-sm text-body-sm text-on-surface font-medium">Mensajero Administrativo</span>
<span class="font-label-sm text-label-sm text-outline">Sede Corporativa Manzanares</span>
</div>
</td>
<td class="px-base py-sm">
<div class="flex flex-col">
<span class="font-label-md text-label-md font-semibold text-primary">QWE-77F</span>
<span class="font-label-sm text-label-sm text-outline">Yamaha XTZ 150</span>
</div>
</td>
<td class="px-base py-sm">
<div class="flex flex-col">
<div class="flex items-center gap-xs">
<span class="px-xs py-0.5 rounded bg-surface-container-high text-primary font-label-sm font-bold">A2</span>
<span class="font-body-sm text-body-sm text-on-surface">RUNT-4491023</span>
</div>
<span class="font-label-sm text-label-sm text-secondary font-medium">Vigente (05/Ene/2028)</span>
</div>
</td>
<td class="px-base py-sm">
<div class="flex flex-col">
<span class="font-body-sm text-body-sm text-on-surface">Seguridad Vial Motociclistas</span>
<span class="font-label-sm text-label-sm text-outline">Certificado ANSV • 10/Feb/2024</span>
</div>
</td>
<td class="px-base py-sm">
<div class="flex flex-col">
<div class="flex items-center gap-xs">
<span class="w-2 h-2 rounded-full bg-secondary-container"></span>
<span class="font-label-sm text-label-sm font-semibold text-on-surface">Apto Integral</span>
</div>
<span class="font-label-sm text-label-sm text-outline">Reflejos y Campimetría 100%</span>
</div>
</td>
<td class="px-base py-sm">
<span class="inline-flex items-center gap-xs px-base py-xs rounded-full bg-surface-container-high text-primary font-label-sm text-label-sm font-bold">
<span class="material-symbols-outlined text-[14px]">check_circle</span>
                  AUTORIZADO
                </span>
</td>
<td class="px-gutter py-sm text-right">
<div class="flex items-center justify-end gap-xs">
<button class="p-xs rounded-lg hover:bg-surface-container-high text-on-surface-variant transition-colors" title="Ver Hoja de Vida Vial" type="button">
<span class="material-symbols-outlined text-[18px]">visibility</span>
</button>
<button class="p-xs rounded-lg hover:bg-surface-container-high text-primary transition-colors" title="Generar Carnet PESV" type="button">
<span class="material-symbols-outlined text-[18px]">badge</span>
</button>
</div>
</td>
</tr>
</tbody>
</table>
<!-- Paginación de Tabla -->
<div class="px-gutter py-sm bg-surface-container-low flex items-center justify-between">
<span class="font-label-sm text-label-sm text-on-surface-variant">Mostrando 4 de 48 conductores registrados</span>
<div class="flex items-center gap-xs">
<button class="px-base py-xs rounded bg-surface-container-lowest text-outline font-label-sm text-label-sm hover:text-on-surface" type="button">Anterior</button>
<span class="px-base py-xs rounded bg-primary text-on-primary font-label-sm text-label-sm">1</span>
<button class="px-base py-xs rounded bg-surface-container-lowest text-on-surface font-label-sm text-label-sm hover:bg-surface-container-high" type="button">2</button>
<button class="px-base py-xs rounded bg-surface-container-lowest text-on-surface font-label-sm text-label-sm hover:bg-surface-container-high" type="button">3</button>
<button class="px-base py-xs rounded bg-surface-container-lowest text-outline font-label-sm text-label-sm hover:text-on-surface" type="button">Siguiente</button>
</div>
</div>
</div>
</div>
<!-- PESTAÑA B: Flota de Vehículos y Equipos Móviles (Grid Interactivo Ocultable) -->
<div class="hidden flex-col space-y-md" id="seccion-flota">
<!-- Tarjetas Resumen de Tipos de Flota -->
<div class="grid grid-cols-1 md:grid-cols-3 gap-md">
<!-- Tarjeta 1: Camioneta Cuadrilla -->
<div class="p-gutter rounded-xl bg-surface-container-lowest shadow-sm flex flex-col justify-between space-y-md hover:shadow-md transition-shadow">
<div class="flex items-center justify-between">
<div class="flex items-center gap-sm">
<div class="w-12 h-12 rounded-xl bg-surface-container-high flex items-center justify-center text-primary">
<span class="material-symbols-outlined text-[28px]">directions_car</span>
</div>
<div class="flex flex-col">
<span class="font-headline-md text-headline-md text-primary font-bold">WDF-452</span>
<span class="font-label-sm text-label-sm text-outline">Toyota Hilux 4x4 2.8 Diesel (2022)</span>
</div>
</div>
<span class="px-base py-xs rounded-full bg-surface-container-high text-primary font-label-sm text-label-sm font-bold">
              APTO
            </span>
</div>
<div class="space-y-xs font-body-sm text-body-sm">
<div class="flex justify-between py-xs border-none">
<span class="text-outline">Responsable:</span>
<span class="font-medium text-on-surface">Carlos Gómez (Cuadrilla Manzanares)</span>
</div>
<div class="flex justify-between py-xs border-none">
<span class="text-outline">Centro de Trabajo:</span>
<span class="font-medium text-on-surface">Finca Central / Despachos</span>
</div>
<div class="flex justify-between py-xs border-none">
<span class="text-outline">Odómetro:</span>
<span class="font-semibold text-primary">64.210 km</span>
</div>
</div>
<div class="p-sm rounded-lg bg-surface-container-low space-y-xs">
<div class="flex items-center justify-between font-label-sm text-label-sm">
<span class="text-on-surface-variant">SOAT (Seguros del Estado):</span>
<span class="text-secondary font-semibold">18/Nov/2025</span>
</div>
<div class="flex items-center justify-between font-label-sm text-label-sm">
<span class="text-on-surface-variant">RTM (CDA Cafetero):</span>
<span class="text-secondary font-semibold">22/Dic/2025</span>
</div>
<div class="flex items-center justify-between font-label-sm text-label-sm">
<span class="text-on-surface-variant">Póliza Todo Riesgo / RCE:</span>
<span class="text-secondary font-semibold">15/Mar/2026</span>
</div>
</div>
<div class="flex items-center justify-between pt-xs">
<span class="font-label-sm text-label-sm text-outline">Kit Carretera &amp; Extintor OK</span>
<button class="px-base py-xs rounded-lg bg-primary text-on-primary font-label-sm text-label-sm hover:bg-primary-container transition-colors" type="button">
              Ficha Flota
            </button>
</div>
</div>
<!-- Tarjeta 2: Tractor Agrícola -->
<div class="p-gutter rounded-xl bg-surface-container-lowest shadow-sm flex flex-col justify-between space-y-md hover:shadow-md transition-shadow">
<div class="flex items-center justify-between">
<div class="flex items-center gap-sm">
<div class="w-12 h-12 rounded-xl bg-surface-container-high flex items-center justify-center text-primary">
<span class="material-symbols-outlined text-[28px]">agriculture</span>
</div>
<div class="flex flex-col">
<span class="font-headline-md text-headline-md text-primary font-bold">OPN-891</span>
<span class="font-label-sm text-label-sm text-outline">John Deere 5075E 4WD (2020)</span>
</div>
</div>
<span class="px-base py-xs rounded-full bg-surface-container-high text-primary font-label-sm text-label-sm font-bold">
              APTO
            </span>
</div>
<div class="space-y-xs font-body-sm text-body-sm">
<div class="flex justify-between py-xs border-none">
<span class="text-outline">Responsable:</span>
<span class="font-medium text-on-surface">Héctor Fabio Ramírez</span>
</div>
<div class="flex justify-between py-xs border-none">
<span class="text-outline">Centro de Trabajo:</span>
<span class="font-medium text-on-surface">Finca La Esperanza (Cosecha)</span>
</div>
<div class="flex justify-between py-xs border-none">
<span class="text-outline">Horómetro:</span>
<span class="font-semibold text-primary">3.412 Horas</span>
</div>
</div>
<div class="p-sm rounded-lg bg-surface-container-low space-y-xs">
<div class="flex items-center justify-between font-label-sm text-label-sm">
<span class="text-on-surface-variant">SOAT Especial:</span>
<span class="text-secondary font-semibold">14/Oct/2025</span>
</div>
<div class="flex items-center justify-between font-label-sm text-label-sm">
<span class="text-on-surface-variant">RTM (Exención Agrícola):</span>
<span class="text-outline font-semibold">Cert. Taller Oficial</span>
</div>
<div class="flex items-center justify-between font-label-sm text-label-sm">
<span class="text-on-surface-variant">Póliza Maquinaria Amarilla:</span>
<span class="text-secondary font-semibold">05/Feb/2026</span>
</div>
</div>
<div class="flex items-center justify-between pt-xs">
<span class="font-label-sm text-label-sm text-outline">Estructura ROPS / Cinturón OK</span>
<button class="px-base py-xs rounded-lg bg-primary text-on-primary font-label-sm text-label-sm hover:bg-primary-container transition-colors" type="button">
              Ficha Flota
            </button>
</div>
</div>
<!-- Tarjeta 3: Camión Distribución (ALERTA DE SOAT EN 12 DÍAS) -->
<div class="p-gutter rounded-xl bg-surface-container-lowest shadow-sm flex flex-col justify-between space-y-md hover:shadow-md transition-shadow">
<div class="flex items-center justify-between">
<div class="flex items-center gap-sm">
<div class="w-12 h-12 rounded-xl bg-error-container flex items-center justify-center text-on-error-container">
<span class="material-symbols-outlined text-[28px]">local_shipping</span>
</div>
<div class="flex flex-col">
<span class="font-headline-md text-headline-md text-error font-bold">TLR-310</span>
<span class="font-label-sm text-label-sm text-outline">Isuzu NPR Turbo Estacas (2021)</span>
</div>
</div>
<span class="px-base py-xs rounded-full bg-error-container text-on-error-container font-label-sm text-label-sm font-bold">
              EN TALLER / ALERTA
            </span>
</div>
<div class="space-y-xs font-body-sm text-body-sm">
<div class="flex justify-between py-xs border-none">
<span class="text-outline">Responsable Asignado:</span>
<span class="font-medium text-error">Jorge Alarcón (Inhabilitado)</span>
</div>
<div class="flex justify-between py-xs border-none">
<span class="text-outline">Centro de Trabajo:</span>
<span class="font-medium text-on-surface">Bodega Pereira (Distribución)</span>
</div>
<div class="flex justify-between py-xs border-none">
<span class="text-outline">Odómetro:</span>
<span class="font-semibold text-primary">148.900 km</span>
</div>
</div>
<div class="p-sm rounded-lg bg-error-container/20 space-y-xs">
<div class="flex items-center justify-between font-label-sm text-label-sm">
<span class="text-error font-semibold">SOAT VENCE EN 12 DÍAS:</span>
<span class="text-error font-bold">04/Nov/2024</span>
</div>
<div class="flex items-center justify-between font-label-sm text-label-sm">
<span class="text-on-surface-variant">RTM CDA:</span>
<span class="text-secondary font-semibold">19/Nov/2024 (Alerta)</span>
</div>
<div class="flex items-center justify-between font-label-sm text-label-sm">
<span class="text-on-surface-variant">Póliza RCE:</span>
<span class="text-secondary font-semibold">12/Jun/2025</span>
</div>
</div>
<div class="flex items-center justify-between pt-xs">
<span class="font-label-sm text-label-sm text-error font-semibold">Pastillas frenos pendientes</span>
<button class="px-base py-xs rounded-lg bg-error text-on-error font-label-sm text-label-sm hover:opacity-90 transition-opacity" type="button">
              Renovar SOAT
            </button>
</div>
</div>
</div>
</div>
<!-- PESTAÑA C: Registro Preoperacional Diario y Hallazgos -->
<div class="hidden flex-col space-y-md" id="seccion-preoperacional">
<div class="p-gutter rounded-xl bg-surface-container-lowest shadow-sm flex flex-col space-y-md">
<div class="flex flex-col md:flex-row md:items-center justify-between gap-sm">
<div>
<h3 class="font-headline-md text-headline-md text-primary">Inspecciones Preoperacionales del Día</h3>
<p class="font-body-sm text-body-sm text-on-surface-variant">Reporte fotográfico de llantas, fluidos, luces, frenos y kits de emergencia (Res. 40595 Paso 15).</p>
</div>
<div class="flex items-center gap-xs">
<button class="px-base py-xs rounded-lg bg-primary text-on-primary font-label-md text-label-md" type="button">
              Validar 46 Aprobados
            </button>
</div>
</div>
<!-- Grid de Tarjetas de Hallazgos Abiertos -->
<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-md">
<!-- Hallazgo 1 -->
<div class="p-sm rounded-xl bg-surface-container-low space-y-sm">
<div class="flex items-center justify-between">
<span class="px-xs py-0.5 rounded bg-error text-on-error font-label-sm font-bold">FRENOS</span>
<span class="font-label-sm text-label-sm text-outline">Hoy 06:12 AM</span>
</div>
<div>
<p class="font-label-md text-label-md font-semibold text-on-surface">Camión NPR (TLR-310)</p>
<p class="font-body-sm text-body-sm text-on-surface-variant mt-xs">Pedal de freno con recorrido largo. Pastillas delanteras con desgaste excesivo reportado en foto.</p>
</div>
<div class="flex items-center justify-between font-label-sm text-label-sm">
<span class="text-error font-semibold">VEHÍCULO DETENIDO</span>
<span class="text-primary font-semibold">Taller Central</span>
</div>
</div>
<!-- Hallazgo 2 -->
<div class="p-sm rounded-xl bg-surface-container-low space-y-sm">
<div class="flex items-center justify-between">
<span class="px-xs py-0.5 rounded bg-surface-container-highest text-primary font-label-sm font-bold">LLANTAS</span>
<span class="font-label-sm text-label-sm text-outline">Hoy 06:25 AM</span>
</div>
<div>
<p class="font-label-md text-label-md font-semibold text-on-surface">Camioneta Hilux (KLY-109)</p>
<p class="font-body-sm text-body-sm text-on-surface-variant mt-xs">Labrado llanta trasera izquierda en 1.8 mm (mínimo normativo 2.0 mm según RTM).</p>
</div>
<div class="flex items-center justify-between font-label-sm text-label-sm">
<span class="text-secondary font-semibold">Cambio Programado</span>
<span class="text-primary font-semibold">Hoy 02:00 PM</span>
</div>
</div>
<!-- Hallazgo 3 -->
<div class="p-sm rounded-xl bg-surface-container-low space-y-sm">
<div class="flex items-center justify-between">
<span class="px-xs py-0.5 rounded bg-surface-container-highest text-primary font-label-sm font-bold">KIT CARRETERA</span>
<span class="font-label-sm text-label-sm text-outline">Hoy 06:40 AM</span>
</div>
<div>
<p class="font-label-md text-label-md font-semibold text-on-surface">Camión Turbo (WFD-811)</p>
<p class="font-body-sm text-body-sm text-on-surface-variant mt-xs">Extintor 20 lbs con manómetro en zona de recarga (presión baja). Botiquín sin gasas estériles.</p>
</div>
<div class="flex items-center justify-between font-label-sm text-label-sm">
<span class="text-secondary font-semibold">En Reposición</span>
<span class="text-primary font-semibold">Almacén SST</span>
</div>
</div>
<!-- Hallazgo 4 -->
<div class="p-sm rounded-xl bg-surface-container-low space-y-sm">
<div class="flex items-center justify-between">
<span class="px-xs py-0.5 rounded bg-surface-container-highest text-primary font-label-sm font-bold">LUCES</span>
<span class="font-label-sm text-label-sm text-outline">Hoy 07:05 AM</span>
</div>
<div>
<p class="font-label-md text-label-md font-semibold text-on-surface">Tractor Agrícola (OPN-891)</p>
<p class="font-body-sm text-body-sm text-on-surface-variant mt-xs">Faro explorador posterior izquierdo inoperativo por fusible fundido en labor nocturna.</p>
</div>
<div class="flex items-center justify-between font-label-sm text-label-sm">
<span class="text-secondary font-semibold">Ajustado</span>
<span class="text-primary font-semibold">Reemplazo OK</span>
</div>
</div>
</div>
</div>
</div>
</div>
<!-- Radar de Alertas y Monitoreo Normativo (Sección Inferior Asimétrica) -->
<div class="grid grid-cols-1 lg:grid-cols-3 gap-md">
<!-- Panel 1: SIMIT y Comparendos (Interconexión Federación de Municipios) -->
<div class="p-gutter rounded-xl bg-surface-container-lowest shadow-sm flex flex-col justify-between space-y-sm">
<div class="flex items-center justify-between">
<div class="flex items-center gap-xs">
<span class="material-symbols-outlined text-[20px] text-primary">gavel</span>
<h3 class="font-label-md text-label-md text-primary uppercase font-bold">Monitoreo SIMIT / Comparendos</h3>
</div>
<span class="px-xs py-0.5 rounded-full bg-surface-container-high text-primary font-label-sm font-bold">Auditoría 24h</span>
</div>
<p class="font-body-sm text-body-sm text-on-surface-variant">
        Rastreo automático contra el SIMIT para validar que ningún conductor autorizado registre fotodetecciones o comparendos por alcoholemia / exceso de velocidad no saneados.
      </p>
<div class="space-y-xs">
<div class="flex items-center justify-between p-xs rounded-lg bg-surface-container-low">
<div class="flex flex-col">
<span class="font-label-sm text-label-sm font-semibold text-on-surface">Conductores al Día (Sin Multas):</span>
<span class="font-label-sm text-[11px] text-outline">47 conductores limpios</span>
</div>
<span class="font-label-md text-label-md font-bold text-secondary">97.9%</span>
</div>
<div class="flex items-center justify-between p-xs rounded-lg bg-error-container/20 text-error">
<div class="flex flex-col">
<span class="font-label-sm text-label-sm font-semibold">1 Comparendo C02 Pendiente:</span>
<span class="font-label-sm text-[11px]">Estacionamiento indebido (en apelación)</span>
</div>
<span class="font-label-md text-label-md font-bold">Impugnado</span>
</div>
</div>
<button class="w-full py-xs rounded-lg bg-surface-container-low text-primary hover:bg-surface-container-high transition-colors font-label-md text-label-md" type="button">
        Sincronizar RUNT / SIMIT Ahora
      </button>
</div>
<!-- Panel 2: Equipos de Prevención y Seguridad Vial -->
<div class="p-gutter rounded-xl bg-surface-container-lowest shadow-sm flex flex-col justify-between space-y-sm">
<div class="flex items-center justify-between">
<div class="flex items-center gap-xs">
<span class="material-symbols-outlined text-[20px] text-primary">medical_services</span>
<h3 class="font-label-md text-label-md text-primary uppercase font-bold">Kits de Carretera &amp; Extintores</h3>
</div>
<span class="px-xs py-0.5 rounded-full bg-secondary-fixed text-on-secondary-fixed font-label-sm font-bold">Código Nacional</span>
</div>
<p class="font-body-sm text-body-sm text-on-surface-variant">
        Verificación física trimestral obligatoria de conos reflectivos de 50cm, tacos, gata hidráulica, cruceta, extintor tipo BC/ABC vigente y botiquín reglamentario tipo B.
      </p>
<div class="grid grid-cols-2 gap-xs">
<div class="p-xs rounded-lg bg-surface-container-low flex flex-col">
<span class="font-label-sm text-label-sm text-outline">Extintores Vigentes</span>
<span class="font-headline-sm text-[20px] font-bold text-primary">37 / 38</span>
<span class="font-label-sm text-[11px] text-secondary">1 en recarga taller</span>
</div>
<div class="p-xs rounded-lg bg-surface-container-low flex flex-col">
<span class="font-label-sm text-label-sm text-outline">Botiquines Dotados</span>
<span class="font-headline-sm text-[20px] font-bold text-primary">38 / 38</span>
<span class="font-label-sm text-[11px] text-secondary">Insumos sellados</span>
</div>
</div>
<button class="w-full py-xs rounded-lg bg-surface-container-low text-primary hover:bg-surface-container-high transition-colors font-label-md text-label-md" type="button">
        Registrar Inspección de Elementos
      </button>
</div>
<!-- Panel 3: Plan de Formación y Simulador Vial 2024 -->
<div class="p-gutter rounded-xl bg-surface-container-lowest shadow-sm flex flex-col justify-between space-y-sm">
<div class="flex items-center justify-between">
<div class="flex items-center gap-xs">
<span class="material-symbols-outlined text-[20px] text-primary">school</span>
<h3 class="font-label-md text-label-md text-primary uppercase font-bold">Capacitación y Manejo Seguro</h3>
</div>
<span class="px-xs py-0.5 rounded-full bg-surface-container-high text-primary font-label-sm font-bold">Ciclo Anual</span>
</div>
<p class="font-body-sm text-body-sm text-on-surface-variant">
        Cumplimiento del cronograma de 8 horas teórico-prácticas en conducción en pendientes pronunciadas, prevención de volcamientos de maquinaria y primeros auxilios viales.
      </p>
<div class="space-y-xs">
<div class="flex justify-between items-center text-label-sm">
<span class="text-on-surface font-medium">Avance Plan de Formación Vial</span>
<span class="font-bold text-primary">87.5%</span>
</div>
<div class="w-full bg-surface-container-high h-2.5 rounded-full overflow-hidden">
<div class="bg-secondary h-full rounded-full" style="width: 87.5%;"></div>
</div>
<div class="flex items-center justify-between text-outline text-label-sm pt-xs">
<span>Próximo Taller: "Frenado en Terreno Húmedo"</span>
<span class="font-semibold text-primary">26/Nov</span>
</div>
</div>
<button class="w-full py-xs rounded-lg bg-primary text-on-primary hover:bg-primary-container transition-colors font-label-md text-label-md" type="button">
        Programar Sesión con ARL
      </button>
</div>
</div>
</div>
<script>
  function cambiarPestana(tabName) {
    // Secciones
    const seccionConductores = document.getElementById('seccion-conductores');
    const seccionFlota = document.getElementById('seccion-flota');
    const seccionPreoperacional = document.getElementById('seccion-preoperacional');

    // Botones
    const btnConductores = document.getElementById('tab-btn-conductores');
    const btnFlota = document.getElementById('tab-btn-flota');
    const btnPreoperacional = document.getElementById('tab-btn-preoperacional');

    // Ocultar todos
    seccionConductores.classList.add('hidden');
    seccionFlota.classList.add('hidden');
    seccionPreoperacional.classList.add('hidden');

    // Reset estilos botones
    const clasesActivas = ['bg-primary', 'text-on-primary', 'shadow-sm'];
    const clasesInactivas = ['text-on-surface-variant', 'hover:bg-surface-container-high', 'hover:text-on-surface'];

    [btnConductores, btnFlota, btnPreoperacional].forEach(btn => {
      btn.classList.remove(...clasesActivas);
      btn.classList.add(...clasesInactivas);
    });

    if (tabName === 'conductores') {
      seccionConductores.classList.remove('hidden');
      btnConductores.classList.add(...clasesActivas);
      btnConductores.classList.remove(...clasesInactivas);
    } else if (tabName === 'flota') {
      seccionFlota.classList.remove('hidden');
      btnFlota.classList.add(...clasesActivas);
      btnFlota.classList.remove(...clasesInactivas);
    } else if (tabName === 'preoperacional') {
      seccionPreoperacional.classList.remove('hidden');
      btnPreoperacional.classList.add(...clasesActivas);
      btnPreoperacional.classList.remove(...clasesInactivas);
    }

}
</script></main></div></body></html>
