import { animePanels } from '../../assets/images';

const variantConfigs = {
  hero: {
    wrapper: 'mt-6',
    layout: 'grid gap-4 grid-cols-2 md:grid-cols-4',
    height: 'h-32 sm:h-40',
  },
  analysis: {
    wrapper: 'my-6',
    layout: 'flex flex-wrap gap-4 justify-center',
    height: 'h-32 sm:h-36 md:h-40',
  },
};

const tiltClasses = ['-rotate-2', 'rotate-1', 'rotate-3', '-rotate-1'];

export default function AnimePanelGallery({ variant = 'hero' }) {
  const config = variantConfigs[variant] || variantConfigs.hero;

  return (
    <div className={`relative ${config.wrapper}`}>
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-primary/10 via-transparent to-primary/10 blur-3xl opacity-50" />
      <div className={`relative ${config.layout}`}>
        {animePanels.map((panel, index) => (
          <figure
            key={panel.id}
            className={`flex flex-col gap-2 rounded-3xl border border-border-green/30 bg-bg-tertiary/80 p-3 shadow-green-glow/40 ${tiltClasses[index % tiltClasses.length]}`}
            style={{ maxWidth: variant === 'analysis' ? '240px' : 'auto' }}
          >
            <div className={`overflow-hidden rounded-2xl bg-black/60 border border-border ${config.height}`}>
              <img
                src={panel.src}
                alt={panel.label}
                className="h-full w-full object-cover mix-blend-screen saturate-0 contrast-125"
                loading="lazy"
              />
            </div>
            <figcaption className="text-xs uppercase tracking-widest text-text-secondary">
              <span className="text-text-primary font-semibold block">{panel.label}</span>
              {panel.description}
            </figcaption>
          </figure>
        ))}
      </div>
    </div>
  );
}
