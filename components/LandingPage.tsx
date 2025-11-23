import React from 'react';
import Background3D from './Background3D';
import { Layout, Sparkles, Zap, Globe, Shield, CheckCircle } from 'lucide-react';

interface LandingPageProps {
  onLogin: () => void;
  onSignup: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onLogin, onSignup }) => {
  return (
    <div className="min-h-screen relative overflow-hidden font-sans text-white selection:bg-indigo-500 selection:text-white">
      <Background3D />
      
      {/* Navbar */}
      <nav className="relative z-10 px-6 py-6">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="bg-gradient-to-tr from-indigo-600 to-purple-600 p-2 rounded-lg">
              <Layout size={24} className="text-white" />
            </div>
            <span className="text-2xl font-extrabold tracking-tight">FolioForge AI</span>
          </div>
          <div className="flex gap-4">
            <button 
              onClick={onLogin}
              className="hidden md:block px-6 py-2.5 rounded-full text-sm font-bold text-gray-200 hover:text-white hover:bg-white/10 transition"
            >
              Log In
            </button>
            <button 
              onClick={onSignup}
              className="px-6 py-2.5 bg-white text-gray-900 rounded-full text-sm font-bold hover:bg-indigo-50 transition shadow-lg shadow-white/10"
            >
              Get Started
            </button>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <div className="relative z-10 container mx-auto px-6 pt-20 pb-32 flex flex-col items-center text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-500/10 border border-indigo-400/20 text-indigo-300 text-sm font-medium mb-8 animate-fade-in">
          <Sparkles size={16} />
          <span>Powered by Gemini 2.5 AI</span>
        </div>
        
        <h1 className="text-5xl md:text-7xl font-extrabold leading-tight mb-8 max-w-4xl animate-slide-up">
          Craft your professional story <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400">in minutes, not hours.</span>
        </h1>
        
        <p className="text-xl text-gray-400 mb-12 max-w-2xl leading-relaxed animate-slide-up" style={{ animationDelay: '100ms' }}>
          The AI-powered portfolio builder that helps you generate content, design stunning websites, and export ATS-friendly resumes instantly.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 animate-slide-up" style={{ animationDelay: '200ms' }}>
          <button 
            onClick={onSignup}
            className="px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white rounded-full text-lg font-bold transition shadow-xl shadow-indigo-500/25 hover:scale-105 active:scale-95"
          >
            Build Your Portfolio
          </button>
          <button 
            onClick={onLogin}
            className="px-8 py-4 bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-full text-lg font-bold transition backdrop-blur-md"
          >
            View Demo
          </button>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-32 w-full max-w-6xl animate-slide-up" style={{ animationDelay: '300ms' }}>
          <FeatureCard 
            icon={Zap} 
            title="AI Content Generation" 
            desc="Generate professional summaries and polish your experience bullets with advanced AI." 
          />
          <FeatureCard 
            icon={Globe} 
            title="Instant Websites" 
            desc="Choose from modern, responsive templates and publish your personal site in one click." 
          />
          <FeatureCard 
            icon={Shield} 
            title="Secure & Private" 
            desc="Your data is yours. Securely authenticated and stored with enterprise-grade protection." 
          />
        </div>
      </div>
    </div>
  );
};

const FeatureCard = ({ icon: Icon, title, desc }: { icon: any, title: string, desc: string }) => (
  <div className="p-8 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-lg hover:bg-white/10 transition hover:-translate-y-1">
    <div className="w-12 h-12 rounded-xl bg-indigo-500/20 flex items-center justify-center text-indigo-300 mb-6">
      <Icon size={24} />
    </div>
    <h3 className="text-xl font-bold mb-3">{title}</h3>
    <p className="text-gray-400 leading-relaxed">{desc}</p>
  </div>
);

export default LandingPage;