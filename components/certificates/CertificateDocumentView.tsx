import type { CertificateDocument } from "@/lib/certificates";

type CertificateDocumentViewProps = Readonly<{
  certificate: CertificateDocument;
}>;

export function CertificateDocumentView({ certificate }: CertificateDocumentViewProps) {
  return (
    <article className="certificate-sheet" aria-label={`Certificado ${certificate.code}`}>
      <div className="certificate-frame">
        <div className="certificate-ornament certificate-ornament-tl" aria-hidden />
        <div className="certificate-ornament certificate-ornament-tr" aria-hidden />
        <div className="certificate-ornament certificate-ornament-bl" aria-hidden />
        <div className="certificate-ornament certificate-ornament-br" aria-hidden />

        <header className="certificate-header">
          <p className="certificate-brand">Campus SST</p>
          <p className="certificate-brand-sub">Seguridad y salud en el trabajo</p>
        </header>

        <p className="certificate-kicker">Certificado de competencia</p>
        <h1 className="certificate-title">Se otorga el presente reconocimiento a</h1>

        <p className="certificate-recipient">{certificate.recipientName}</p>
        <p className="certificate-role">{certificate.recipientJobTitle}</p>

        <p className="certificate-body">
          por haber aprobado satisfactoriamente el curso de formación
        </p>
        <p className="certificate-course">{certificate.courseTitle}</p>
        <p className="certificate-meta">
          {certificate.categoryLabel} · Nivel {certificate.levelLabel} · {certificate.hours}{" "}
          {certificate.hours === 1 ? "hora" : "horas"} de formación
        </p>

        <div className="certificate-footer">
          <div className="certificate-seal" aria-hidden>
            <span>SST</span>
          </div>
          <div className="certificate-facts">
            <div>
              <span className="certificate-fact-label">Fecha de emisión</span>
              <span className="certificate-fact-value">{certificate.issuedOnLabel}</span>
            </div>
            <div>
              <span className="certificate-fact-label">Código de verificación</span>
              <span className="certificate-fact-value">{certificate.code}</span>
            </div>
          </div>
          <div className="certificate-sign">
            <div className="certificate-sign-line" />
            <span>Coordinación SST</span>
          </div>
        </div>
      </div>
    </article>
  );
}
