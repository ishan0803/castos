import { ReactNode } from 'react';
import Navbar from './Navbar';

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-8">
        {children}
      </main>
      <footer className="border-t border-gray-800 py-6 text-center text-gray-500 text-sm">
        <p>CastOS v1.0 • Built for Modern Production</p>
      </footer>
    </div>
  );
}