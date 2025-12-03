import { Link, useLocation } from 'react-router-dom';
import { UserButton } from '@clerk/clerk-react';
import { LayoutDashboard, PlusCircle, Settings } from 'lucide-react'; // Kept Settings import

export default function Navbar() {
  const location = useLocation();
  const isActive = (path: string) => location.pathname === path ? "text-primary" : "text-gray-400 hover:text-white";

  return (
    <nav className="h-16 border-b border-gray-800 bg-surface/50 backdrop-blur-md sticky top-0 z-50">
      <div className="container mx-auto h-full flex items-center justify-between px-4">
        <Link to="/dashboard" className="text-2xl font-serif font-bold tracking-tight">
          Cast<span className="text-primary">OS</span>
        </Link>
        
        <div className="flex items-center gap-8">
          <Link to="/dashboard" className={`flex items-center gap-2 transition ${isActive('/dashboard')}`}>
            <LayoutDashboard size={18} />
            <span className="font-medium">Projects</span>
          </Link>
          
          <Link to="/new" className={`flex items-center gap-2 transition ${isActive('/new')}`}>
            <PlusCircle size={18} />
            <span className="font-medium">Studio</span>
          </Link>

          {/* Added Settings Link */}
          <Link to="/settings" className={`flex items-center gap-2 transition ${isActive('/settings')}`}>
            <Settings size={18} />
            <span className="font-medium">Settings</span>
          </Link>

          <div className="h-6 w-px bg-gray-800" />
          
          <UserButton 
            afterSignOutUrl="/" 
            appearance={{
              elements: {
                avatarBox: "w-8 h-8 ring-2 ring-primary/20"
              }
            }}
          />
        </div>
      </div>
    </nav>
  );
}