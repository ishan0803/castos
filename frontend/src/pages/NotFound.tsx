import { Link } from 'react-router-dom';
import Button from '../components/ui/Button';

export default function NotFound() {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center text-center">
      <h1 className="text-9xl font-serif font-bold text-gray-800 mb-4">404</h1>
      <h2 className="text-3xl font-bold text-white mb-4">Page Not Found</h2>
      <p className="text-gray-400 mb-8 max-w-md">
        The scene you are looking for has been cut from the final edit.
      </p>
      <Link to="/dashboard">
        <Button>Back to Studio</Button>
      </Link>
    </div>
  );
}