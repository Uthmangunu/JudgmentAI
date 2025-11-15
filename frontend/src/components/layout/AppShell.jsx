import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import Footer from './Footer';

export default function AppShell() {
  return (
    <div className="min-h-screen bg-bg-primary text-text-primary flex flex-col">
      <Navbar />
      <div className="flex flex-1 w-full">
        <Sidebar />
        <main className="flex-1 px-4 py-8 sm:px-8 lg:px-12 relative overflow-hidden">
          <div className="pointer-events-none absolute inset-0 opacity-30 bg-[radial-gradient(circle_at_center,_rgba(0,255,65,0.15),_transparent_60%)]" />
          <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(120deg,rgba(0,255,65,0.08)_0%,transparent_50%)]" />
          <div className="mx-auto max-w-6xl relative z-10">
            <Outlet />
          </div>
        </main>
      </div>
      <Footer />
    </div>
  );
}
