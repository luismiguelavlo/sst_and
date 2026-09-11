import { MaterialIcon } from "@/components/icons/MaterialIcon";

type SgsstModulePlaceholderProps = {
  title: string;
  description: string;
  icon: string;
};

export function SgsstModulePlaceholder({
  title,
  description,
  icon,
}: Readonly<SgsstModulePlaceholderProps>) {
  return (
    <div className="px-gutter py-md">
      <div className="mb-md">
        <div className="mb-xs flex items-center gap-xs font-label-sm text-label-sm tracking-wider text-primary uppercase">
          <MaterialIcon name="shield" className="text-[16px]" />
          <span>Módulo SG-SST</span>
        </div>
        <h1 className="font-headline-lg text-headline-lg tracking-tight text-primary">{title}</h1>
        <p className="mt-xs max-w-3xl font-body-md text-body-md text-on-surface-variant">
          {description}
        </p>
      </div>
      <div className="flex flex-col items-center justify-center gap-md rounded-xl bg-surface-container-lowest px-md py-xl text-center shadow-sm">
        <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-surface-container text-primary">
          <MaterialIcon name={icon} className="text-[36px]" />
        </div>
        <div className="max-w-lg space-y-xs">
          <h2 className="font-headline-md text-headline-md text-on-surface">Módulo en preparación</h2>
          <p className="font-body-sm text-body-sm text-on-surface-variant">
            Esta sección ya forma parte del sistema operativo SG-SST. El panel de control está
            disponible; la gestión detallada de este módulo se habilitará en una próxima iteración.
          </p>
        </div>
      </div>
    </div>
  );
}
