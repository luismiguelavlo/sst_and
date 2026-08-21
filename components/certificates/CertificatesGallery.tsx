"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { MaterialIcon } from "@/components/icons/MaterialIcon";
import {
  certificateCategoryOptions,
  certificateYearOptions,
  type CertificateListItem,
} from "@/lib/certificates";
import type { SstCategory } from "@/lib/sst";

type CertificatesGalleryProps = Readonly<{
  certificates: readonly CertificateListItem[];
}>;

export function CertificatesGallery({ certificates }: CertificatesGalleryProps) {
  const [query, setQuery] = useState("");
  const [year, setYear] = useState("");
  const [category, setCategory] = useState<SstCategory | "">("");

  const years = useMemo(() => certificateYearOptions(certificates), [certificates]);
  const categories = useMemo(() => certificateCategoryOptions(certificates), [certificates]);

  const visible = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return certificates.filter((certificate) => {
      const matchesYear = year.length === 0 || certificate.year === year;
      const matchesCategory = category.length === 0 || certificate.category === category;
      if (!matchesYear || !matchesCategory) {
        return false;
      }
      if (needle.length === 0) {
        return true;
      }
      return (
        certificate.title.toLowerCase().includes(needle) ||
        certificate.code.toLowerCase().includes(needle) ||
        certificate.categoryLabel.toLowerCase().includes(needle)
      );
    });
  }, [category, certificates, query, year]);

  return (
    <div className="flex w-full flex-col font-body-md text-on-surface">
      <div className="mb-lg pt-md">
        <h1 className="mb-xs font-headline-lg text-primary">Mis certificados</h1>
        <p className="max-w-2xl font-body-md text-on-surface-variant">
          Consulta e imprime tus certificados de competencias SST. Se generan automáticamente al
          completar un curso con certificación habilitada.
        </p>
      </div>

      <div className="mb-xl flex flex-col items-start justify-between gap-md md:flex-row md:items-center">
        <div className="relative w-full md:w-96">
          <MaterialIcon
            name="search"
            className="absolute top-1/2 left-sm -translate-y-1/2 text-on-surface-variant"
          />
          <input
            className="w-full rounded-lg border border-outline-variant/30 bg-surface-container-lowest py-sm pr-sm pl-12 text-on-surface transition-shadow placeholder:text-on-surface-variant focus:ring-2 focus:ring-primary focus:outline-none"
            placeholder="Buscar por curso o código..."
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
        </div>
        <div className="flex w-full gap-sm md:w-auto">
          <div className="relative w-full md:w-auto">
            <select
              className="w-full cursor-pointer appearance-none rounded-lg border border-outline-variant/30 bg-surface-container-lowest py-sm pr-12 pl-sm font-label-md text-on-surface transition-shadow focus:ring-2 focus:ring-primary focus:outline-none md:w-48"
              value={year}
              onChange={(event) => setYear(event.target.value)}
            >
              <option value="">Año de finalización</option>
              {years.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
            <MaterialIcon
              name="expand_more"
              className="pointer-events-none absolute top-1/2 right-sm -translate-y-1/2 text-on-surface-variant"
            />
          </div>
          <div className="relative w-full md:w-auto">
            <select
              className="w-full cursor-pointer appearance-none rounded-lg border border-outline-variant/30 bg-surface-container-lowest py-sm pr-12 pl-sm font-label-md text-on-surface transition-shadow focus:ring-2 focus:ring-primary focus:outline-none md:w-48"
              value={category}
              onChange={(event) => setCategory(event.target.value as SstCategory | "")}
            >
              <option value="">Categoría</option>
              {categories.map((item) => (
                <option key={item.value} value={item.value}>
                  {item.label}
                </option>
              ))}
            </select>
            <MaterialIcon
              name="expand_more"
              className="pointer-events-none absolute top-1/2 right-sm -translate-y-1/2 text-on-surface-variant"
            />
          </div>
        </div>
      </div>

      {visible.length === 0 ? (
        <div className="rounded-xl border border-outline-variant/20 bg-surface-container-lowest p-lg text-center shadow-sm">
          <MaterialIcon name="workspace_premium" className="mb-sm text-[40px] text-primary" />
          <p className="font-headline-md text-on-surface">Aún no tienes certificados</p>
          <p className="mt-xs font-body-sm text-on-surface-variant">
            Completa todas las lecciones de un curso con certificación para emitir el tuyo.
          </p>
          <Link
            href="/course-catalog"
            className="mt-md inline-flex items-center gap-xs rounded-lg bg-primary px-md py-sm font-label-md text-on-primary"
          >
            Ir al catálogo
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-gutter md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {visible.map((certificate) => (
            <CertificateCard key={certificate.id} certificate={certificate} />
          ))}
        </div>
      )}
    </div>
  );
}

function CertificateCard({ certificate }: Readonly<{ certificate: CertificateListItem }>) {
  return (
    <article className="group relative flex flex-col overflow-hidden rounded-xl border border-outline-variant/20 bg-surface-container-lowest shadow-sm transition-all duration-300 hover:-translate-y-[2px] hover:shadow-md">
      <div className="relative h-48 w-full">
        <Image
          src={certificate.imageUrl}
          alt={certificate.imageAlt}
          fill
          unoptimized
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 25vw"
        />
        <div className="absolute top-sm right-sm flex items-center gap-xs rounded-full bg-surface-container-lowest/90 px-sm py-xs font-label-sm text-primary shadow-sm backdrop-blur">
          <MaterialIcon name="verified" filled className="text-[16px]" />
          Verificado
        </div>
      </div>
      <div className="flex flex-1 flex-col p-md">
        <div className="mb-sm flex flex-wrap items-center gap-xs">
          <span className="rounded-full bg-surface-container-low px-sm py-xs font-label-sm tracking-wide text-on-surface-variant uppercase">
            {certificate.code}
          </span>
          <span className="font-body-sm text-on-surface-variant">•</span>
          <span className="font-label-sm text-on-surface-variant">
            Horas: {certificate.hours}
          </span>
        </div>
        <h3 className="mb-xs line-clamp-2 font-headline-md text-on-surface transition-colors group-hover:text-primary">
          {certificate.title}
        </h3>
        <p className="mb-md flex-1 font-body-sm text-on-surface-variant">{certificate.completedOn}</p>
        <div className="mt-auto flex flex-col gap-sm">
          <Link
            href={`/certificates/${certificate.id}`}
            className="flex w-full items-center justify-center gap-sm rounded-lg bg-primary px-md py-sm font-label-md text-on-primary shadow-sm transition-colors hover:bg-primary/90"
          >
            <MaterialIcon name="visibility" className="text-[20px]" />
            Ver certificado
          </Link>
          <Link
            href={`/certificates/${certificate.id}?print=1`}
            className="flex w-full items-center justify-center gap-sm rounded-lg border border-outline-variant/30 bg-transparent px-md py-sm font-label-md text-primary transition-colors hover:bg-surface-container-low"
          >
            <MaterialIcon name="print" className="text-[20px]" />
            Imprimir certificado
          </Link>
          <Link
            href={`/courses/${certificate.courseSlug}`}
            className="flex w-full items-center justify-center gap-sm rounded-lg border border-outline-variant/30 bg-transparent px-md py-sm font-label-md text-on-surface-variant transition-colors hover:bg-surface-container-low hover:text-primary"
          >
            <MaterialIcon name="menu_book" className="text-[20px]" />
            Revisar curso
          </Link>
        </div>
      </div>
    </article>
  );
}
