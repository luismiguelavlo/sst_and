/** Política general de tratamiento de datos personales — formularios de asistencia Campus SST. */
export const ATTENDANCE_DATA_POLICY = {
  version: "1.0",
  title: "Autorización de tratamiento de datos personales",
  updatedAtLabel: "Septiembre 2025",
} as const;

export const ATTENDANCE_DATA_POLICY_SECTIONS: readonly {
  heading: string;
  paragraphs: readonly string[];
}[] = [
  {
    heading: "1. Responsable del tratamiento",
    paragraphs: [
      "El responsable del tratamiento de sus datos personales es la empresa u organización que convoca la capacitación o evento de Seguridad y Salud en el Trabajo (SST), a través de la plataforma Campus SST.",
      "Para ejercer sus derechos puede contactar al área de Recursos Humanos o al responsable SST señalado en el formulario de asistencia.",
    ],
  },
  {
    heading: "2. Finalidad del tratamiento",
    paragraphs: [
      "Sus datos serán tratados con las siguientes finalidades: registrar su asistencia a capacitaciones, eventos o actividades de SST; cumplir obligaciones legales en materia de seguridad y salud en el trabajo; elaborar reportes, indicadores y evidencias de formación; y, cuando aplique, gestionar certificados o constancias de participación.",
    ],
  },
  {
    heading: "3. Datos personales recolectados",
    paragraphs: [
      "Podemos solicitar: nombres y apellidos, número de identificación (cédula), cargo, empresa, tema visto, calificación del evento, comentarios, firma digital y respuestas a campos adicionales definidos para el evento.",
    ],
  },
  {
    heading: "4. Base legal y consentimiento",
    paragraphs: [
      "El tratamiento se realiza con su consentimiento expreso, manifestado al marcar la casilla de aceptación antes de enviar el formulario, y en cumplimiento de las obligaciones legales del empleador en materia de SST.",
    ],
  },
  {
    heading: "5. Derechos del titular",
    paragraphs: [
      "Usted tiene derecho a conocer, actualizar, rectificar y suprimir sus datos; revocar la autorización; y presentar quejas ante la autoridad de protección de datos de su país, cuando corresponda.",
      "La revocación no afectará la licitud del tratamiento realizado con anterioridad a su solicitud.",
    ],
  },
  {
    heading: "6. Conservación y seguridad",
    paragraphs: [
      "Los datos se conservarán durante el tiempo necesario para cumplir las finalidades descritas y las obligaciones legales aplicables. Se adoptan medidas técnicas y organizativas razonables para proteger la información contra acceso no autorizado, pérdida o alteración.",
    ],
  },
  {
    heading: "7. Transferencia y encargados",
    paragraphs: [
      "Los datos pueden ser almacenados en la plataforma Campus SST como encargado del tratamiento, exclusivamente para las finalidades indicadas. No se cederán a terceros salvo obligación legal o autorización expresa del titular.",
    ],
  },
];

export const ATTENDANCE_DATA_POLICY_CONSENT_LABEL =
  "Autorizo el tratamiento de mis datos personales conforme a la política descrita, para registrar mi asistencia y las finalidades de SST indicadas.";
