import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  return (
    <div className="min-h-screen bg-bg-primary flex flex-col items-center justify-center text-center gap-4">
      <p className="text-primary text-sm tracking-[0.5em]">404</p>
      <h1 className="text-4xl font-semibold">This timeline doesn’t exist.</h1>
      <p className="text-text-secondary max-w-md">
        The page you are looking for might have been removed or you mistyped the URL. Return to the dashboard to continue your analysis.
      </p>
      <Link to="/dashboard" className="text-primary underline">
        Back to Dashboard
      </Link>
    </div>
  );
}
