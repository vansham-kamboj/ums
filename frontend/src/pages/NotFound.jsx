import { Link } from 'react-router-dom';
import { Home, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-bg px-4">
      <div className="text-center animate-fade-in">
        <div className="relative mb-8">
          <h1 className="text-[160px] font-black text-gray-100 leading-none select-none">404</h1>
          <div className="absolute inset-0 flex items-center justify-center">
            <p className="text-2xl font-bold text-text-primary">Page Not Found</p>
          </div>
        </div>
        <p className="text-text-secondary mb-8 max-w-md mx-auto">
          The page you're looking for doesn't exist or has been moved. Check the URL or navigate back to the dashboard.
        </p>
        <div className="flex items-center justify-center gap-4">
          <Link to="/" className="inline-flex items-center gap-2 px-5 py-2.5 bg-brand-600 hover:bg-brand-500 text-white font-medium rounded-md shadow-sm transition-colors text-sm">
            <Home className="w-4 h-4" /> Dashboard
          </Link>
          <button onClick={() => window.history.back()} className="inline-flex items-center gap-2 px-5 py-2.5 border border-border text-text-secondary font-medium rounded-md hover:bg-bg transition-colors text-sm">
            <ArrowLeft className="w-4 h-4" /> Go Back
          </button>
        </div>
      </div>
    </div>
  );
}
