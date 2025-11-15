import { useState } from 'react';

export default function Tooltip({ label, children }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <span className="relative inline-flex" onMouseEnter={() => setIsOpen(true)} onMouseLeave={() => setIsOpen(false)}>
      {children}
      {isOpen && (
        <span className="absolute bottom-full mb-2 px-3 py-2 text-xs rounded bg-bg-tertiary border border-border text-text-secondary whitespace-nowrap">
          {label}
        </span>
      )}
    </span>
  );
}
