# Script para agregar isBusinessFolioCode en búsquedas de folios existentes

$modules = @(
  "restricciones",
  "casos-salud",
  "pesv",
  "copasst",
  "ccl",
  "emergencias",
  "incapacidades",
  "operadores",
  "acciones",
  "inspecciones"
)

$root = "C:\Users\LUIS MIGUEL\Documents\app-cur\plat_course"

foreach ($module in $modules) {
  $actionsPath = Join-Path $root "lib\sg-sst\$module\actions.ts"
  if (-Not (Test-Path $actionsPath)) {
    Write-Host "⏭️  Skipping $module (file not found)"
    continue
  }
  
  $content = Get-Content -Path $actionsPath -Raw
  
  # Patrón: const existing = row.folio ? await find...ByFolio(row.folio) : null;
  $pattern = '(\s+)(const existing = row\.folio \? await (find\w+ByFolio)\(row\.folio\) : null;)'
  $replacement = '$1const existing =$1  row.folio && isBusinessFolioCode(row.folio)$1    ? await $3(row.folio)$1    : null;'
  
  $newContent = $content -replace $pattern, $replacement
  
  if ($content -ne $newContent) {
    Set-Content -Path $actionsPath -Value $newContent -NoNewline
    Write-Host "✅ Fixed folio lookup: $actionsPath"
  } else {
    Write-Host "⏭️  No changes needed: $actionsPath"
  }
}

Write-Host "`n✅ Folio lookup fixes aplicados."
