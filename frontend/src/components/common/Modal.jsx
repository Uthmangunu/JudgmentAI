import Button from './Button';

export default function Modal({ title, isOpen, onClose, children, actions }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur">
      <div className="bg-bg-secondary border border-border-green rounded-2xl shadow-green-glow max-w-lg w-full p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold text-primary">{title}</h3>
          <button className="text-text-secondary hover:text-primary" onClick={onClose} aria-label="Close">
            ✕
          </button>
        </div>
        <div className="text-text-secondary">{children}</div>
        {actions && (
          <div className="mt-6 flex justify-end gap-3">
            {actions.map((action) => (
              <Button key={action.label} onClick={action.onClick} variant={action.variant || 'ghost'}>
                {action.label}
              </Button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
