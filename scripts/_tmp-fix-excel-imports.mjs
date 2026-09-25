/**
 * Script temporal para aplicar los mismos fixes de accidentes/alturas
 * a los 12 módulos restantes con importación Excel vulnerable.
 * 
 * Cambios:
 * 1. Reemplazar función local resolveWorkerId con import desde workers/repository
 * 2. Agregar import de isBusinessFolioCode desde draft-mode
 * 3. Agregar validación isBusinessFolioCode() al buscar folios existentes
 * 4. Reemplazar excelDateToIso local con versión mejorada desde excel-utils
 */

import { readFileSync, writeFileSync } from "fs";
import { join } from "path";

const MODULES = [
  "emos",
  "capacitaciones",
  "epp",
  "restricciones",
  "casos-salud",
  "pesv",
  "copasst",
  "ccl",
  "emergencias",
  "incapacidades",
  "operadores",
  "investigaciones",
];

const ROOT = process.cwd();

function fixActionsFile(modulePath) {
  const actionsPath = join(ROOT, "lib", "sg-sst", modulePath, "actions.ts");
  let content = readFileSync(actionsPath, "utf-8");
  
  // 1. Agregar import de isBusinessFolioCode si no existe
  if (!content.includes('from "@/lib/sg-sst/draft-mode"')) {
    const firstImport = content.indexOf("import ");
    if (firstImport >= 0) {
      content = content.slice(0, firstImport) +
        'import { isBusinessFolioCode } from "@/lib/sg-sst/draft-mode";\n' +
        content.slice(firstImport);
    }
  }
  
  // 2. Reemplazar imports de findWorkerByCode/findWorkerByDocumentNumber con resolveWorkerId
  content = content.replace(
    /import\s*\{([^}]*?)findWorkerByCode,\s*findWorkerByDocumentNumber,([^}]*?)\}\s*from\s*"@\/lib\/sg-sst\/workers\/repository";/,
    (match, before, after) => {
      const cleanBefore = before.replace(/\s+/g, " ").trim();
      const cleanAfter = after.replace(/\s+/g, " ").trim();
      const parts = [cleanBefore, "resolveWorkerId", cleanAfter].filter(Boolean);
      return `import {\n  ${parts.join(",\n  ")},\n} from "@/lib/sg-sst/workers/repository";`;
    }
  );
  
  // 3. Reemplazar función local resolveWorkerId con comentario
  content = content.replace(
    /async function resolveWorkerId\(ref: string\): Promise<string \| null> \{\s*const byCode = await findWorkerByCode\(ref\);\s*if \(byCode\) return byCode\.id;\s*const byDoc = await findWorkerByDocumentNumber\(ref\);\s*return byDoc\?\.id \?\? null;\s*\}/,
    "// NOTA: resolveWorkerId movido a workers/repository.ts para evitar duplicación\n// y garantizar orden correcto (documento antes que código para cédulas)."
  );
  
  // 4. Agregar validación isBusinessFolioCode en búsquedas de folio
  // Patrón: const existing = row.folio ? await find...ByFolio(row.folio) : null;
  content = content.replace(
    /const existing = row\.folio \? await (find\w+ByFolio)\(row\.folio\) : null;/g,
    (match, findFunc) => {
      return `const existing =\n          row.folio && isBusinessFolioCode(row.folio)\n            ? await ${findFunc}(row.folio)\n            : null;`;
    }
  );
  
  writeFileSync(actionsPath, content, "utf-8");
  console.log(`✅ Fixed: ${actionsPath}`);
}

function fixExcelFile(modulePath) {
  const excelPath = join(ROOT, "lib", "sg-sst", modulePath, "excel.ts");
  let content = readFileSync(excelPath, "utf-8");
  
  // 1. Agregar import de excel-utils si no existe
  if (!content.includes('from "@/lib/sg-sst/excel-utils"')) {
    const draftModeImport = content.indexOf('from "@/lib/sg-sst/draft-mode"');
    if (draftModeImport >= 0) {
      const lineEnd = content.indexOf("\n", draftModeImport);
      content = content.slice(0, lineEnd + 1) +
        'import { excelDateToIso as excelDateToIsoUtil } from "@/lib/sg-sst/excel-utils";\n' +
        content.slice(lineEnd + 1);
    }
  }
  
  // 2. Reemplazar función excelDateToIso local con wrapper
  // Buscar todas las variantes de excelDateToIso
  const patterns = [
    // Patrón básico con Date.parse
    /function excelDateToIso\(raw: string\): string \{\s*if \(!raw\) return (todayIsoDate\(\)|"");\s*if \(\/\^\d\{4\}-\d\{2\}-\d\{2\}\/\.test\(raw\)\) return raw\.slice\(0, 10\);\s*const parsed = Date\.parse\(raw\);\s*if \(!Number\.isNaN\(parsed\)\) \{\s*return new Date\(parsed\)\.toISOString\(\)\.slice\(0, 10\);\s*\}\s*return (todayIsoDate\(\)|raw|"");\s*\}/,
    // Patrón con parseDate
    /function parseDate\(value: string\): string \{\s*if \(!value\) return "";\s*if \(\/\^\d\{4\}-\d\{2\}-\d\{2\}\/\.test\(value\)\) return value\.slice\(0, 10\);\s*const parsed = Date\.parse\(value\);\s*if \(!Number\.isNaN\(parsed\)\) \{\s*return new Date\(parsed\)\.toISOString\(\)\.slice\(0, 10\);\s*\}\s*return "";\s*\}/,
  ];
  
  for (const pattern of patterns) {
    if (pattern.test(content)) {
      content = content.replace(pattern, (match) => {
        const funcName = match.includes("parseDate") ? "parseDate" : "excelDateToIso";
        const fallback = match.includes('return todayIsoDate()') ? ", true" : ", false";
        return `function ${funcName}(raw: string): string {\n  return excelDateToIsoUtil(raw${fallback});\n}`;
      });
      break;
    }
  }
  
  writeFileSync(excelPath, content, "utf-8");
  console.log(`✅ Fixed: ${excelPath}`);
}

console.log("🔧 Aplicando fixes a módulos Excel...\n");

for (const module of MODULES) {
  try {
    fixActionsFile(module);
    fixExcelFile(module);
  } catch (error) {
    console.error(`❌ Error en módulo ${module}:`, error.message);
  }
}

console.log("\n✅ Proceso completado. Ejecuta `npm run typecheck` para verificar.");
