# Script para actualizar excelDateToIso en todos los módulos Excel

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
  "inspecciones",
  "documentos",
  "investigaciones",
  "quimicos"
)

$root = "C:\Users\LUIS MIGUEL\Documents\app-cur\plat_course"

foreach ($module in $modules) {
  $excelPath = Join-Path $root "lib\sg-sst\$module\excel.ts"
  if (-Not (Test-Path $excelPath)) {
    Write-Host "⏭️  Skipping $module (excel.ts not found)"
    continue
  }
  
  $content = Get-Content -Path $excelPath -Raw
  
  # 1. Agregar import si no existe
  if ($content -notmatch 'from "@/lib/sg-sst/excel-utils"') {
    $draftImport = $content -match 'from "@/lib/sg-sst/draft-mode"'
    if ($draftImport) {
      $content = $content -replace '(from "@/lib/sg-sst/draft-mode";)', '$1' + "`nimport { excelDateToIso as excelDateToIsoUtil } from `"@/lib/sg-sst/excel-utils`";"
      Write-Host "  ➕ Added excel-utils import to $module"
    }
  }
  
  # 2. Reemplazar función excelDateToIso
  # Versión con todayIsoDate() fallback
  $pattern1 = '(?s)function excelDateToIso\(raw: string\): string \{[^}]+if \(!raw\) return todayIsoDate\(\);[^}]+return todayIsoDate\(\);[^}]+\}'
  $replacement1 = 'function excelDateToIso(raw: string): string {' + "`n" + '  return excelDateToIsoUtil(raw, true);' + "`n" + '}'
  
  # Versión con "" fallback
  $pattern2 = '(?s)function excelDateToIso\(raw: string\): string \{[^}]+if \(!raw\) return "";[^}]+return "";[^}]+\}'
  $replacement2 = 'function excelDateToIso(raw: string): string {' + "`n" + '  return excelDateToIsoUtil(raw, false);' + "`n" + '}'
  
  # Versión con raw fallback
  $pattern3 = '(?s)function excelDateToIso\(raw: string\): string \{[^}]+if \(!raw\) return "";[^}]+return raw;[^}]+\}'
  $replacement3 = 'function excelDateToIso(raw: string): string {' + "`n" + '  return excelDateToIsoUtil(raw, false);' + "`n" + '}'
  
  $newContent = $content
  if ($newContent -match $pattern1) {
    $newContent = $newContent -replace $pattern1, $replacement1
    Write-Host "  🔧 Fixed excelDateToIso (todayIsoDate fallback) in $module"
  } elseif ($newContent -match $pattern2) {
    $newContent = $newContent -replace $pattern2, $replacement2
    Write-Host "  🔧 Fixed excelDateToIso (empty fallback) in $module"
  } elseif ($newContent -match $pattern3) {
    $newContent = $newContent -replace $pattern3, $replacement3
    Write-Host "  🔧 Fixed excelDateToIso (raw fallback) in $module"
  }
  
  # 3. Reemplazar parseDate si existe (quimicos, workers)
  $pattern4 = '(?s)function parseDate\(value: string\): string \{[^}]+if \(!value\) return "";[^}]+return "";[^}]+\}'
  $replacement4 = 'function parseDate(value: string): string {' + "`n" + '  return excelDateToIsoUtil(value, false);' + "`n" + '}'
  
  if ($newContent -match $pattern4) {
    $newContent = $newContent -replace $pattern4, $replacement4
    Write-Host "  🔧 Fixed parseDate in $module"
  }
  
  if ($content -ne $newContent) {
    Set-Content -Path $excelPath -Value $newContent -NoNewline
    Write-Host "✅ Updated: $excelPath"
  } else {
    Write-Host "⏭️  No changes needed: $module"
  }
}

Write-Host "`n✅ Excel date parsing fixes aplicados."
