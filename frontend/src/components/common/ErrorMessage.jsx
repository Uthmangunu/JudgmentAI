export default function ErrorMessage({ children }) {
  if (!children) return null;
  return <p className="text-red-400 text-sm bg-red-500/10 border border-red-500/40 rounded-lg px-4 py-2">{children}</p>;
}
