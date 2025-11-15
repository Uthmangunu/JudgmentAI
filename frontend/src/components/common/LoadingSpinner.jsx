const sizeMap = {
  sm: 'h-4 w-4 border-2',
  md: 'h-8 w-8 border-2',
  lg: 'h-12 w-12 border-4',
};

export default function LoadingSpinner({ size = 'md', message }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 text-text-secondary">
      <span
        className={`${sizeMap[size]} animate-spin rounded-full border-primary border-t-transparent`}
        role="status"
        aria-live="polite"
      />
      {message && <p className="text-center text-sm">{message}</p>}
    </div>
  );
}
