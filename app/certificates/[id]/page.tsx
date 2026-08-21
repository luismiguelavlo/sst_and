import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Libre_Baskerville, Source_Sans_3 } from "next/font/google";
import { CertificateActions } from "@/components/certificates/CertificateActions";
import { CertificateDocumentView } from "@/components/certificates/CertificateDocumentView";
import { requireAuth } from "@/lib/auth/guards";
import { getCertificateForUser } from "@/lib/certificates/repository";

const display = Libre_Baskerville({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-certificate-display",
});

const body = Source_Sans_3({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  variable: "--font-certificate-body",
});

type CertificatePageProps = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ print?: string }>;
};

export async function generateMetadata({ params }: CertificatePageProps): Promise<Metadata> {
  const { id } = await params;
  return {
    title: `Certificado · Campus SST`,
    description: `Certificado de competencia SST ${id}.`,
  };
}

export default async function CertificateDetailPage({
  params,
  searchParams,
}: Readonly<CertificatePageProps>) {
  const [{ id }, query, user] = await Promise.all([params, searchParams, requireAuth()]);
  const certificate = await getCertificateForUser(id, user.id, {
    allowAdmin: user.role === "admin",
  });
  if (!certificate) {
    notFound();
  }

  const autoPrint = query.print === "1";

  return (
    <div className={`${display.variable} ${body.variable} min-h-screen bg-[#e8eef8] text-[#0d1c2e]`}>
      <div className="certificate-chrome print:hidden mx-auto flex w-full max-w-[1100px] items-center justify-between gap-md px-md py-md">
        <Link href="/certificates" className="font-label-md text-primary hover:underline">
          ← Mis certificados
        </Link>
        <Link
          href={`/courses/${certificate.courseSlug}`}
          className="font-label-md text-on-surface-variant hover:text-primary"
        >
          Ver curso
        </Link>
      </div>

      <div className="mx-auto flex w-full max-w-[1100px] flex-col items-center gap-md px-md pb-xl">
        <CertificateActions autoPrint={autoPrint} code={certificate.code} />
        <CertificateDocumentView certificate={certificate} />
      </div>

      <style>{certificateStyles}</style>
    </div>
  );
}

const certificateStyles = `
  .certificate-actions {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
    text-align: center;
  }

  .certificate-sheet {
    width: 100%;
    max-width: 1000px;
    aspect-ratio: 1.414 / 1;
    background:
      radial-gradient(circle at 12% 18%, rgba(20, 33, 117, 0.06), transparent 42%),
      radial-gradient(circle at 88% 82%, rgba(70, 72, 212, 0.08), transparent 40%),
      linear-gradient(160deg, #f7f9ff 0%, #eef3ff 55%, #f8f9ff 100%);
    border-radius: 8px;
    box-shadow: 0 18px 48px rgba(13, 28, 46, 0.12);
    overflow: hidden;
  }

  .certificate-frame {
    position: relative;
    height: 100%;
    margin: 18px;
    padding: clamp(24px, 4vw, 48px) clamp(28px, 5vw, 64px);
    border: 2px solid #142175;
    outline: 1px solid rgba(20, 33, 117, 0.25);
    outline-offset: 8px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
    box-sizing: border-box;
  }

  .certificate-ornament {
    position: absolute;
    width: 28px;
    height: 28px;
    border: 2px solid #6063ee;
  }
  .certificate-ornament-tl { top: 10px; left: 10px; border-right: 0; border-bottom: 0; }
  .certificate-ornament-tr { top: 10px; right: 10px; border-left: 0; border-bottom: 0; }
  .certificate-ornament-bl { bottom: 10px; left: 10px; border-right: 0; border-top: 0; }
  .certificate-ornament-br { bottom: 10px; right: 10px; border-left: 0; border-top: 0; }

  .certificate-header {
    margin-bottom: clamp(12px, 2vw, 20px);
  }

  .certificate-brand {
    margin: 0;
    font-family: var(--font-certificate-display), Georgia, serif;
    font-size: clamp(28px, 3.4vw, 40px);
    font-weight: 700;
    letter-spacing: 0.04em;
    color: #142175;
    text-transform: uppercase;
  }

  .certificate-brand-sub {
    margin: 4px 0 0;
    font-family: var(--font-certificate-body), system-ui, sans-serif;
    font-size: 13px;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    color: #454651;
  }

  .certificate-kicker {
    margin: 0;
    font-family: var(--font-certificate-body), system-ui, sans-serif;
    font-size: 12px;
    letter-spacing: 0.28em;
    text-transform: uppercase;
    color: #4648d4;
    font-weight: 700;
  }

  .certificate-title {
    margin: 10px 0 0;
    font-family: var(--font-certificate-body), system-ui, sans-serif;
    font-size: clamp(14px, 1.6vw, 18px);
    font-weight: 400;
    color: #454651;
  }

  .certificate-recipient {
    margin: clamp(14px, 2.2vw, 24px) 0 4px;
    font-family: var(--font-certificate-display), Georgia, serif;
    font-size: clamp(28px, 4.2vw, 48px);
    font-weight: 700;
    color: #0d1c2e;
    line-height: 1.15;
  }

  .certificate-role {
    margin: 0 0 clamp(14px, 2vw, 22px);
    font-family: var(--font-certificate-body), system-ui, sans-serif;
    font-size: 15px;
    color: #454651;
  }

  .certificate-body {
    margin: 0;
    max-width: 42rem;
    font-family: var(--font-certificate-body), system-ui, sans-serif;
    font-size: clamp(14px, 1.5vw, 17px);
    color: #454651;
  }

  .certificate-course {
    margin: 10px 0 6px;
    max-width: 44rem;
    font-family: var(--font-certificate-display), Georgia, serif;
    font-size: clamp(20px, 2.6vw, 30px);
    font-weight: 700;
    color: #142175;
    line-height: 1.25;
  }

  .certificate-meta {
    margin: 0;
    font-family: var(--font-certificate-body), system-ui, sans-serif;
    font-size: 14px;
    color: #454651;
  }

  .certificate-footer {
    margin-top: clamp(22px, 3.5vw, 40px);
    width: 100%;
    display: grid;
    grid-template-columns: 1fr 1.4fr 1fr;
    gap: 16px;
    align-items: end;
  }

  .certificate-seal {
    width: 72px;
    height: 72px;
    margin: 0 auto;
    border-radius: 9999px;
    border: 3px double #142175;
    display: grid;
    place-items: center;
    font-family: var(--font-certificate-display), Georgia, serif;
    font-weight: 700;
    color: #142175;
    letter-spacing: 0.08em;
    background: rgba(20, 33, 117, 0.04);
  }

  .certificate-facts {
    display: flex;
    justify-content: center;
    gap: 28px;
    flex-wrap: wrap;
  }

  .certificate-facts > div {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  .certificate-fact-label {
    font-family: var(--font-certificate-body), system-ui, sans-serif;
    font-size: 11px;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: #767682;
  }

  .certificate-fact-value {
    font-family: var(--font-certificate-body), system-ui, sans-serif;
    font-size: 14px;
    font-weight: 600;
    color: #0d1c2e;
  }

  .certificate-sign {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 6px;
    font-family: var(--font-certificate-body), system-ui, sans-serif;
    font-size: 12px;
    color: #454651;
  }

  .certificate-sign-line {
    width: 140px;
    height: 1px;
    background: #142175;
  }

  @media (max-width: 720px) {
    .certificate-sheet {
      aspect-ratio: auto;
      min-height: 640px;
    }
    .certificate-footer {
      grid-template-columns: 1fr;
      justify-items: center;
    }
  }

  @media print {
    @page {
      size: landscape;
      margin: 10mm;
    }
    body {
      background: white !important;
    }
    .certificate-sheet {
      max-width: none;
      width: 100%;
      height: calc(100vh - 20mm);
      box-shadow: none;
      border-radius: 0;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }
    .certificate-frame {
      margin: 8px;
      outline-offset: 4px;
    }
  }
`;
