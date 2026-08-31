export type BulkImportInputRow = {
  rowNumber: number;
  name: string;
  email: string;
  cedula: string;
  jobTitle: string;
};

export type BulkImportResultRow = BulkImportInputRow & {
  password: string;
  invitationLink: string;
  status: string;
};

const HEADER_ALIASES: Record<keyof Omit<BulkImportInputRow, "rowNumber">, readonly string[]> = {
  name: ["nombre", "nombres", "name", "empleado", "colaborador"],
  email: ["correo", "email", "e-mail", "mail"],
  cedula: ["cedula", "cédula", "documento", "identificacion", "identificación", "id"],
  jobTitle: ["cargo", "puesto", "job_title", "jobtitle", "rol"],
};

function normalizeHeader(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{M}/gu, "");
}

function mapHeaders(headers: readonly string[]): Partial<Record<keyof BulkImportInputRow, number>> {
  const map: Partial<Record<keyof BulkImportInputRow, number>> = {};
  headers.forEach((header, index) => {
    const normalized = normalizeHeader(header);
    for (const [field, aliases] of Object.entries(HEADER_ALIASES) as [
      keyof Omit<BulkImportInputRow, "rowNumber">,
      readonly string[],
    ][]) {
      if (aliases.includes(normalized)) {
        map[field] = index;
      }
    }
  });
  return map;
}

function cellValue(row: readonly string[], index: number | undefined): string {
  if (index === undefined) {
    return "";
  }
  return (row[index] ?? "").trim();
}

export function rowsFromMatrix(matrix: readonly (readonly string[])[]): BulkImportInputRow[] {
  if (matrix.length === 0) {
    return [];
  }
  const headerRow = matrix[0] ?? [];
  const headerMap = mapHeaders(headerRow);
  if (headerMap.name === undefined || headerMap.email === undefined || headerMap.cedula === undefined) {
    throw new Error(
      "El archivo debe incluir columnas de nombre, correo y cédula (ej.: nombre, correo, cedula).",
    );
  }

  const rows: BulkImportInputRow[] = [];
  for (let index = 1; index < matrix.length; index += 1) {
    const raw = matrix[index] ?? [];
    const name = cellValue(raw, headerMap.name);
    const email = cellValue(raw, headerMap.email);
    const cedula = cellValue(raw, headerMap.cedula);
    const jobTitle = cellValue(raw, headerMap.jobTitle) || "Empleado";
    if (name.length === 0 && email.length === 0 && cedula.length === 0) {
      continue;
    }
    rows.push({
      rowNumber: index + 1,
      name,
      email,
      cedula,
      jobTitle,
    });
  }
  return rows;
}

export function parseCsvText(text: string): BulkImportInputRow[] {
  const lines = text.replace(/^\uFEFF/, "").split(/\r?\n/).filter((line) => line.trim().length > 0);
  const matrix = lines.map(parseCsvLine);
  return rowsFromMatrix(matrix);
}

function parseCsvLine(line: string): string[] {
  const cells: string[] = [];
  let current = "";
  let inQuotes = false;
  for (let index = 0; index < line.length; index += 1) {
    const char = line[index];
    if (char === '"') {
      if (inQuotes && line[index + 1] === '"') {
        current += '"';
        index += 1;
      } else {
        inQuotes = !inQuotes;
      }
      continue;
    }
    if (char === "," && !inQuotes) {
      cells.push(current);
      current = "";
      continue;
    }
    current += char;
  }
  cells.push(current);
  return cells;
}

function csvCell(value: string): string {
  return `"${value.replaceAll('"', '""')}"`;
}

export function resultsToCsv(rows: readonly BulkImportResultRow[]): string {
  const header = [
    "fila",
    "nombre",
    "correo",
    "cedula",
    "cargo",
    "contraseña",
    "enlace_invitacion",
    "estado",
  ];
  const lines = [
    header.join(","),
    ...rows.map((row) =>
      [
        String(row.rowNumber),
        csvCell(row.name),
        csvCell(row.email),
        csvCell(row.cedula),
        csvCell(row.jobTitle),
        csvCell(row.password),
        csvCell(row.invitationLink),
        csvCell(row.status),
      ].join(","),
    ),
  ];
  return `\uFEFF${lines.join("\n")}`;
}

export const BULK_IMPORT_TEMPLATE_CSV = `\uFEFFnombre,correo,cedula,cargo
Juan Pérez,juan.perez@empresa.com,1234567890,Operario
María López,maria.lopez@empresa.com,0987654321,Supervisor
`;


export function validateBulkImportRow(row: BulkImportInputRow): string | null {
  if (row.name.trim().length < 3) {
    return "El nombre debe tener al menos 3 caracteres.";
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(row.email.trim())) {
    return "Correo inválido.";
  }
  if (row.cedula.trim().length === 0) {
    return "La cédula es obligatoria.";
  }
  return null;
}
