import React, { useState, useEffect } from 'react';
import { Portfolio, AppView, Profile, CustomTheme } from './types';
import Dashboard from './components/Dashboard';
import PortfolioEditor from './components/PortfolioEditor';
import { ModernTemplate, ClassicTemplate, CreativeTemplate, ATSTemplate, MinimalTemplate, TechTemplate, BoldTemplate, CleanWebTemplate, CustomTemplate } from './components/TemplateRenderers';
import { Layout, ArrowLeft, Share2, Edit3 } from 'lucide-react';
import LandingPage from './components/LandingPage';
import AuthModal from './components/AuthModal';
import { auth, db } from './firebaseConfig';
import { onAuthStateChanged, signOut, User } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { getUserPortfolios, createPortfolio, updatePortfolio, deletePortfolio, migrateLocalStorageToFirestore } from './services/portfolioService';

// Initial Dummy Data
const initialProfile: Profile = {
  fullName: 'Alex Morgan',
  title: 'Full Stack Developer',
  email: 'alex.morgan@example.com',
  phone: '+1 (555) 123-4567',
  location: 'San Francisco, CA',
  summary: 'Passionate developer with 5+ years of experience building scalable web applications. Expert in React and Node.js.',
  skills: ['React', 'TypeScript', 'Node.js', 'Tailwind CSS', 'AWS'],
  linkedin: 'https://linkedin.com/in/alexmorgan',
  github: 'https://github.com/alexmorgan',
  profilePicture: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
};

const defaultCustomTheme: CustomTheme = {
    fontHeading: 'Inter',
    fontBody: 'Inter',
    primaryColor: '#4F46E5',
    accentColor: '#10B981',
    headerLayout: 'standard',
    sections: {
        hero: { visible: true, bgColor: '#ffffff', textColor: '#111827', layout: 'split' },
        about: { visible: true, bgColor: '#f9fafb', textColor: '#374151', layout: 'centered' },
        experience: { visible: true, bgColor: '#ffffff', textColor: '#111827', layout: 'standard' },
        projects: { visible: true, bgColor: '#f9fafb', textColor: '#111827', layout: 'grid' },
        education: { visible: true, bgColor: '#ffffff', textColor: '#111827', layout: 'standard' },
        contact: { visible: true, bgColor: '#111827', textColor: '#ffffff', layout: 'centered' }
    }
};

const initialPortfolio: Portfolio = {
  id: '1',
  name: 'Software Engineer Resume',
  lastModified: Date.now(),
  templateId: 'modern',
  profile: initialProfile,
  experience: [
    {
      id: '101',
      company: 'TechFlow Solutions',
      role: 'Senior Frontend Engineer',
      startDate: '2021',
      endDate: '',
      current: true,
      description: '• Led the migration of legacy codebase to React 18.\n• Improved site performance by 40%.'
    }
  ],
  education: [
      { id: '201', institution: 'University of California', degree: 'B.S. Computer Science', year: '2018' }
  ],
  projects: [
      { id: '301', title: 'E-commerce Dashboard', description: 'A real-time analytics dashboard for merchants.', technologies: ['React', 'D3.js'], link: '#' }
  ],
  certifications: [
      { id: '401', name: 'AWS Certified Solutions Architect', issuer: 'Amazon Web Services', date: '2022', link: '#' }
  ],
  languages: [
      { id: '501', language: 'English', proficiency: 'Native' },
      { id: '502', language: 'Spanish', proficiency: 'Intermediate' }
  ],
  customTheme: defaultCustomTheme
};

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [userName, setUserName] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');

  const [view, setView] = useState<AppView>(AppView.DASHBOARD);
  const [portfolios, setPortfolios] = useState<Portfolio[]>([]);
  const [currentPortfolioId, setCurrentPortfolioId] = useState<string | null>(null);
  const [editingPortfolio, setEditingPortfolio] = useState<Portfolio | null>(null);

  // Auth Listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      
      // Fetch user's name from Firestore
      if (currentUser) {
        try {
          const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
          if (userDoc.exists()) {
            const userData = userDoc.data();
            setUserName(`${userData.firstName} ${userData.lastName}`);
          } else {
            // Fallback to displayName or email
            setUserName(currentUser.displayName || currentUser.email || 'User');
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
          setUserName(currentUser.displayName || currentUser.email || 'User');
        }
      } else {
        setUserName('');
      }
      
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // Load Portfolios when User changes
  useEffect(() => {
    const loadPortfolios = async () => {
      if (user) {
        try {
          // Check if there's localStorage data to migrate
          const localData = localStorage.getItem(`folios_v2_${user.uid}`);
          
          // Fetch portfolios from Firestore
          const firestorePortfolios = await getUserPortfolios(user.uid);
          
          // If Firestore is empty but localStorage has data, migrate it
          if (firestorePortfolios.length === 0 && localData) {
            console.log('Migrating localStorage data to Firestore...');
            await migrateLocalStorageToFirestore(user.uid);
            // Fetch again after migration
            const migratedPortfolios = await getUserPortfolios(user.uid);
            setPortfolios(migratedPortfolios);
          } else if (firestorePortfolios.length === 0) {
            // New user with no portfolios - just show empty state
            // Don't create demo portfolio automatically
            setPortfolios([]);
          } else {
            // Load existing portfolios from Firestore
            setPortfolios(firestorePortfolios);
          }
        } catch (error) {
          console.error('Error loading portfolios:', error);
          setPortfolios([]);
        }
      } else {
        setPortfolios([]);
      }
    };
    
    loadPortfolios();
  }, [user]);

  // No longer need to auto-save to localStorage
  // Portfolios are now saved individually to Firestore on each action

  const currentPortfolio = portfolios.find(p => p.id === currentPortfolioId);

  const handleCreate = async () => {
    if (!user) return;
    
    const newId = Date.now().toString();
    const newPortfolio: Portfolio = {
        ...initialPortfolio,
        id: newId,
        name: 'New Portfolio',
        lastModified: Date.now(),
        templateId: 'modern', // default
        profile: { ...initialProfile, fullName: 'Your Name', title: 'Your Job Title', summary: '', email: user?.email || '', skills: [], phone: '', profilePicture: '' },
        experience: [{
            id: Date.now().toString(),
            company: '',
            role: '',
            startDate: '',
            endDate: '',
            current: false,
            description: ''
        }],
        projects: [{
             id: (Date.now() + 1).toString(),
             title: '',
             description: '',
             technologies: [],
             link: ''
        }],
        education: [{
             id: (Date.now() + 2).toString(),
             institution: '',
             degree: '',
             year: ''
        }],
        certifications: [{
             id: (Date.now() + 3).toString(),
             name: '',
             issuer: '',
             date: '',
             link: ''
        }],
        languages: [{
             id: (Date.now() + 4).toString(),
             language: '',
             proficiency: ''
        }],
        customTheme: defaultCustomTheme
    };
    
    // Don't save to Firestore yet - only set as editing portfolio
    // It will be saved when user clicks "Save" button
    setEditingPortfolio(newPortfolio);
    setCurrentPortfolioId(newId);
    setView(AppView.EDITOR);
  };

  const handleEdit = (id: string) => {
      const portfolio = portfolios.find(p => p.id === id);
      if (portfolio) {
        setEditingPortfolio(JSON.parse(JSON.stringify(portfolio))); // Deep clone
        setCurrentPortfolioId(id);
        setView(AppView.EDITOR);
      }
  };

  const handleView = (id: string) => {
      setCurrentPortfolioId(id);
      setView(AppView.PREVIEW);
  };

  const handleDelete = async (id: string) => {
      if (confirm('Are you sure you want to delete this portfolio?')) {
          try {
              await deletePortfolio(id);
              setPortfolios(prev => prev.filter(p => p.id !== id));
              if (currentPortfolioId === id) {
                  setView(AppView.DASHBOARD);
                  setCurrentPortfolioId(null);
              }
          } catch (error) {
              console.error('Error deleting portfolio:', error);
              alert('Failed to delete portfolio. Please try again.');
          }
      }
  };

  const handleSave = async (updatedPortfolio: Portfolio) => {
      if (!user) return;
      
      try {
          // Check if this is a new portfolio (not in portfolios array) or an existing one
          const isNewPortfolio = !portfolios.find(p => p.id === updatedPortfolio.id);
          
          if (isNewPortfolio) {
              // Create new portfolio in Firestore
              await createPortfolio(user.uid, updatedPortfolio);
              setPortfolios(prev => [updatedPortfolio, ...prev]);
          } else {
              // Update existing portfolio in Firestore
              await updatePortfolio(user.uid, updatedPortfolio);
              setPortfolios(prev => prev.map(p => p.id === updatedPortfolio.id ? updatedPortfolio : p));
          }
          
          setEditingPortfolio(null); // Clear editing state
          setView(AppView.DASHBOARD);
          setCurrentPortfolioId(null);
      } catch (error) {
          console.error('Error saving portfolio:', error);
          alert('Failed to save portfolio. Please try again.');
      }
  };

  const handleCancel = () => {
      setView(AppView.DASHBOARD);
      setCurrentPortfolioId(null);
      setEditingPortfolio(null);
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center text-white">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <>
        <LandingPage 
          onLogin={() => { setAuthMode('login'); setAuthModalOpen(true); }}
          onSignup={() => { setAuthMode('signup'); setAuthModalOpen(true); }}
        />
        <AuthModal 
          isOpen={authModalOpen} 
          onClose={() => setAuthModalOpen(false)} 
          initialMode={authMode} 
        />
      </>
    );
  }

  const renderContent = () => {
    switch (view) {
      case AppView.DASHBOARD:
        return (
          <Dashboard 
            portfolios={portfolios} 
            onCreate={handleCreate} 
            onEdit={handleEdit} 
            onDelete={handleDelete} 
            onView={handleView}
            onLogout={handleLogout}
            userEmail={user.email}
            userName={userName}
          />
        );
      
      case AppView.EDITOR:
        if (!editingPortfolio) return <div>Portfolio not found</div>;
        return (
          <PortfolioEditor 
            key={editingPortfolio.id}
            portfolio={editingPortfolio} 
            onSave={handleSave} 
            onCancel={handleCancel} 
          />
        );

      case AppView.PREVIEW:
        if (!currentPortfolio) return <div>Portfolio not found</div>;
        
        const Renderer = 
            currentPortfolio.templateId === 'classic' ? ClassicTemplate :
            currentPortfolio.templateId === 'creative' ? CreativeTemplate : 
            currentPortfolio.templateId === 'ats' ? ATSTemplate :
            currentPortfolio.templateId === 'minimal' ? MinimalTemplate :
            currentPortfolio.templateId === 'tech' ? TechTemplate :
            currentPortfolio.templateId === 'bold' ? BoldTemplate :
            currentPortfolio.templateId === 'clean' ? CleanWebTemplate :
            currentPortfolio.templateId === 'custom' ? CustomTemplate :
            ModernTemplate;

        return (
            <div className="relative bg-white min-h-screen">
                {/* Floating Action Button - Bottom Right */}
                <button 
                    onClick={() => setView(AppView.DASHBOARD)}
                    className="fixed bottom-8 right-8 z-50 bg-white/90 backdrop-blur-xl shadow-xl px-6 py-3 rounded-full text-gray-800 hover:bg-indigo-50 hover:text-indigo-600 transition border border-gray-200 font-bold flex items-center gap-2 group transform hover:scale-105 print:hidden"
                    title="Back to Dashboard"
                >
                    <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" /> Dashboard
                </button>
                <Renderer data={currentPortfolio} />
            </div>
        );
    }
  };

  return (
    <div className="min-h-screen text-gray-900 font-sans" style={{ background: view === AppView.DASHBOARD ? 'transparent' : '#f9fafb' }}>
       {renderContent()}
    </div>
  );
};

export default App;