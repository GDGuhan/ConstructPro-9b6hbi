import React from 'react';
import { Link } from 'react-router-dom';
import { HardHat, ArrowLeft } from 'lucide-react';

const NotFoundPage: React.FC = () => (
  <div className="min-h-screen bg-black flex items-center justify-center p-6">
    <div className="text-center">
      <div className="flex justify-center mb-6">
        <div className="bg-yellow-400 p-4 rounded-2xl">
          <HardHat className="w-12 h-12 text-black" />
        </div>
      </div>
      <h1 className="text-8xl font-black text-yellow-400 mb-2">404</h1>
      <h2 className="text-2xl font-bold text-white mb-3">Page Not Found</h2>
      <p className="text-white/40 mb-8 max-w-sm mx-auto">
        This area is still under construction. Let's get you back on solid ground.
      </p>
      <Link
        to="/"
        className="inline-flex items-center gap-2 bg-yellow-400 text-black font-bold px-6 py-3 rounded-2xl hover:bg-yellow-500 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Home
      </Link>
    </div>
  </div>
);

export default NotFoundPage;
