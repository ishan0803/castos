import { SignIn } from "@clerk/clerk-react";

export default function Login() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center relative overflow-hidden">
       {/* Ambient Background */}
      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-surface via-background to-background z-0" />
      
      <div className="z-10 text-center">
        <h1 className="text-4xl font-serif font-bold mb-8">
          Cast<span className="text-primary">OS</span>
        </h1>
        <SignIn 
          appearance={{
            variables: {
              colorPrimary: '#E0AA3E',
              colorBackground: '#16161A',
              colorText: '#ffffff',
              colorInputBackground: '#0A0A0C',
              colorInputText: '#ffffff'
            },
            elements: {
              card: "shadow-[0_0_50px_rgba(0,0,0,0.5)] border border-gray-800",
              headerTitle: "text-white font-serif",
              headerSubtitle: "text-gray-400",
              formButtonPrimary: "bg-primary text-black hover:bg-yellow-500 font-bold",
              footerActionLink: "text-primary hover:text-white"
            }
          }} 
          redirectUrl="/dashboard"
        />
      </div>
    </div>
  );
}