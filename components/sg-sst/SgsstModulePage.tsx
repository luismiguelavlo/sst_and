import Link from "next/link";
import { SgsstModulePlaceholder } from "@/components/sg-sst/SgsstModulePlaceholder";
import { SGSST_MODULES, type SgsstModuleSlug } from "@/lib/sg-sst/modules";

type SgsstModulePageProps = {
  slug: SgsstModuleSlug;
  extraHref?: string;
  extraLabel?: string;
};

export function SgsstModulePage({
  slug,
  extraHref,
  extraLabel,
}: Readonly<SgsstModulePageProps>) {
  const module = SGSST_MODULES[slug];
  return (
    <div>
      <SgsstModulePlaceholder
        title={module.title}
        description={module.description}
        icon={module.icon}
      />
      {extraHref && extraLabel ? (
        <div className="px-gutter pb-md">
          <Link
            href={extraHref}
            className="inline-flex items-center gap-xs rounded-lg bg-primary px-base py-sm font-label-md text-label-md font-semibold text-on-primary"
          >
            {extraLabel}
          </Link>
        </div>
      ) : null}
    </div>
  );
}
