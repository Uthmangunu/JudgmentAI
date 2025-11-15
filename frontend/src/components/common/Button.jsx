import clsx from 'clsx';

const variantClasses = {
  primary: 'bg-primary text-black hover:bg-primary-dark shadow-green-glow',
  secondary: 'bg-secondary text-white hover:bg-secondary-light',
  danger: 'bg-red-600 text-white hover:bg-red-700',
  ghost: 'bg-transparent text-primary border border-primary hover:bg-primary/10',
};

const sizeClasses = {
  sm: 'text-sm px-3 py-1.5',
  md: 'text-base px-4 py-2',
  lg: 'text-lg px-6 py-3',
};

export default function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled,
  fullWidth,
  children,
  className,
  ...props
}) {
  return (
    <button
      type="button"
      className={clsx(
        'rounded-lg font-semibold transition-all duration-200 flex items-center justify-center gap-2',
        variantClasses[variant],
        sizeClasses[size],
        fullWidth && 'w-full',
        (disabled || loading) && 'opacity-60 cursor-not-allowed',
        className
      )}
      disabled={disabled || loading}
      {...props}
    >
      {loading && (
        <span
          className="h-4 w-4 animate-spin rounded-full border-2 border-black/20 border-t-black"
          role="status"
          aria-label="Loading"
        />
      )}
      {children}
    </button>
  );
}
