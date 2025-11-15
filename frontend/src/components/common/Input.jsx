import clsx from 'clsx';

export default function Input({
  label,
  error,
  required,
  className,
  ...props
}) {
  return (
    <label className="flex flex-col gap-2 text-sm text-text-secondary w-full">
      {label && (
        <span className="text-text-primary font-medium">
          {label}
          {required && <span className="text-primary ml-1">*</span>}
        </span>
      )}
      <input
        className={clsx(
          'bg-bg-tertiary border border-border rounded-lg px-4 py-3 text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent',
          error && 'border-red-500',
          className
        )}
        {...props}
      />
      {error && <span className="text-red-400 text-xs">{error}</span>}
    </label>
  );
}
