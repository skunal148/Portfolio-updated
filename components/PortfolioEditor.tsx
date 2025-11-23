
import React, { useState, useRef, useEffect, useMemo } from 'react';
import { Portfolio, Experience, Education, Project, TemplateId, Certification, Language, CustomTheme, SectionConfig } from '../types';
import { enhanceText, generateSummaryFromProfile } from '../services/geminiService';
import { CustomTemplate } from './TemplateRenderers';
import { Save, ArrowLeft, Sparkles, Plus, Trash2, Layout, Globe, Award, Briefcase, BookOpen, User, X, Upload, Image as ImageIcon, Settings, ChevronDown, ChevronUp, Palette, Type, Smartphone, Monitor, Menu, Check } from 'lucide-react';

interface EditorProps {
  portfolio: Portfolio;
  onSave: (portfolio: Portfolio) => void;
  onCancel: () => void;
}

const PortfolioEditor: React.FC<EditorProps> = ({ portfolio, onSave, onCancel }) => {
  
  const [data, setData] = useState<Portfolio>(portfolio);
  const [activeTab, setActiveTab] = useState<'profile' | 'experience' | 'projects' | 'education' | 'certifications' | 'languages' | 'design'>('profile');
  const [loadingAI, setLoadingAI] = useState<string | null>(null);
  const [skillInput, setSkillInput] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [previewDevice, setPreviewDevice] = useState<'desktop' | 'mobile'>('desktop');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Custom Theme State
  const [expandedSection, setExpandedSection] = useState<string | null>('hero');
  

  // Prevent form submission on Enter key in input fields
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Enter' && (e.target as HTMLElement).tagName === 'INPUT' && (e.target as HTMLInputElement).type !== 'checkbox') {
        // Allow Enter for skills input
        if ((e.target as HTMLInputElement).placeholder?.includes('skill')) {
          return;
        }
        e.preventDefault();
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleProfileChange = (field: string, value: string) => {
    setData(prev => ({ ...prev, profile: { ...prev.profile, [field]: value } }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
            handleProfileChange('profilePicture', reader.result as string);
        };
        reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
      handleProfileChange('profilePicture', '');
      if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleAddSkill = (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' && skillInput.trim()) {
          e.preventDefault();
          if (!data.profile.skills.includes(skillInput.trim())) {
            setData(prev => ({ ...prev, profile: { ...prev.profile, skills: [...prev.profile.skills, skillInput.trim()] } }));
          }
          setSkillInput('');
      }
  };

  const removeSkill = (skill: string) => {
    setData(prev => ({ ...prev, profile: { ...prev.profile, skills: prev.profile.skills.filter(s => s !== skill) } }));
  };

  const handleExperienceChange = (index: number, field: keyof Experience, value: any) => {
    const newExp = [...data.experience];
    newExp[index] = { ...newExp[index], [field]: value };
    setData(prev => ({ ...prev, experience: newExp }));
  };

  const addExperience = () => {
    const newExp: Experience = {
        id: Date.now().toString(),
        company: '', role: '', startDate: '', endDate: '', current: false, description: ''
    };
    setData(prev => ({ ...prev, experience: [newExp, ...prev.experience] }));
  };

  const removeExperience = (index: number) => {
      const newExp = [...data.experience];
      newExp.splice(index, 1);
      setData(prev => ({ ...prev, experience: newExp }));
  };

  const handleAIEnhance = async (fieldId: string, text: string, type: 'summary' | 'experience', setter: (val: string) => void) => {
    setLoadingAI(fieldId);
    const improved = await enhanceText(text, type);
    setter(improved);
    setLoadingAI(null);
  };

  const handleAIGenerateSummary = async () => {
      setLoadingAI('summary_gen');
      const summary = await generateSummaryFromProfile(data.profile, data.experience);
      handleProfileChange('summary', summary);
      setLoadingAI(null);
  };

  const updateProject = (index: number, field: keyof Project, value: any) => {
    const list = [...data.projects];
    list[index] = { ...list[index], [field]: value };
    setData(prev => ({ ...prev, projects: list }));
  };
  
  const addProject = () => {
      setData(prev => ({
          ...prev, projects: [...prev.projects, { id: Date.now().toString(), title: '', description: '', technologies: [] }]
      }))
  }

  const updateEducation = (index: number, field: keyof Education, value: string) => {
      const list = [...data.education];
      list[index] = { ...list[index], [field]: value };
      setData(prev => ({ ...prev, education: list }));
  };

  const addEducation = () => {
      setData(prev => ({
          ...prev, education: [...prev.education, { id: Date.now().toString(), institution: '', degree: '', year: '' }]
      }))
  }

  const addCertification = () => {
      setData(prev => ({
          ...prev, certifications: [...(prev.certifications || []), { id: Date.now().toString(), name: '', issuer: '', date: '', link: '' }]
      }));
  };

  const updateCertification = (index: number, field: keyof Certification, value: string) => {
      const list = [...(data.certifications || [])];
      list[index] = { ...list[index], [field]: value };
      setData(prev => ({ ...prev, certifications: list }));
  };

  const addLanguage = () => {
      setData(prev => ({
          ...prev, languages: [...(prev.languages || []), { id: Date.now().toString(), language: '', proficiency: '' }]
      }));
  };

  const updateLanguage = (index: number, field: keyof Language, value: string) => {
      const list = [...(data.languages || [])];
      list[index] = { ...list[index], [field]: value };
      setData(prev => ({ ...prev, languages: list }));
  };

  // Custom Theme Handlers
  const handleThemeChange = (field: keyof CustomTheme, value: any) => {
      if (!data.customTheme) return;
      setData(prev => ({
          ...prev,
          customTheme: { ...prev.customTheme!, [field]: value }
      }));
  };
  
  const applyPalette = (primary: string, accent: string) => {
      if(!data.customTheme) return;
      setData(prev => ({
          ...prev,
          customTheme: { ...prev.customTheme!, primaryColor: primary, accentColor: accent }
      }));
  };

  const handleSectionConfigChange = (section: keyof CustomTheme['sections'], field: keyof SectionConfig, value: any) => {
      if (!data.customTheme) return;
      setData(prev => ({
          ...prev,
          customTheme: {
              ...prev.customTheme!,
              sections: {
                  ...prev.customTheme!.sections,
                  [section]: { ...prev.customTheme!.sections[section], [field]: value }
              }
          }
      }));
  };

  const tabs = [
      { id: 'profile', label: 'Profile', icon: User },
      { id: 'experience', label: 'Experience', icon: Briefcase },
      { id: 'projects', label: 'Projects', icon: Layout },
      { id: 'education', label: 'Education', icon: BookOpen },
      { id: 'certifications', label: 'Certifications', icon: Award },
      { id: 'languages', label: 'Languages', icon: Globe },
      { id: 'design', label: 'Design', icon: Sparkles },
  ];

  const inputClass = "w-full p-3 border-transparent rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all duration-200 text-gray-800 bg-gray-50 hover:bg-white focus:bg-white placeholder-gray-400 font-medium shadow-sm";
  const labelClass = "block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 ml-1";
  
  const fonts = ['Inter', 'Playfair Display', 'Fira Code', 'Montserrat', 'Lato', 'Poppins', 'Oswald', 'Raleway', 'Nunito', 'Roboto'];

  const templates: {id: TemplateId, name: string, desc: string, type: 'Web' | 'PDF' | 'Builder'}[] = [
      { id: 'custom', name: 'Create from Scratch', desc: 'Build your own unique style. Customize every section.', type: 'Builder' },
      { id: 'clean', name: 'Clean Web', desc: 'Minimalist, image-focused website. Great for creatives.', type: 'Web' },
      { id: 'bold', name: 'Bold Portfolio', desc: 'High contrast, split-screen layout. Impactful.', type: 'Web' },
      { id: 'tech', name: 'Tech Portfolio', desc: 'Dark theme, terminal-inspired. Best for software engineers.', type: 'Web' },
      { id: 'modern', name: 'Modern SaaS', desc: 'Clean, professional landing page style. Good for product roles.', type: 'Web' },
      { id: 'creative', name: 'Creative Studio', desc: 'Bold typography and layout. Ideal for designers.', type: 'Web' },
      { id: 'minimal', name: 'Minimalist', desc: 'High whitespace, focus on typography.', type: 'PDF' },
      { id: 'ats', name: 'ATS Friendly', desc: 'Simple formatting optimized for applicant tracking systems.', type: 'PDF' },
      { id: 'classic', name: 'Classic Resume', desc: 'Traditional serif layout for formal industries.', type: 'PDF' }
  ];
  
  const isCustomMode = data.templateId === 'custom';

  const renderTemplatePreview = (id: string) => {
    switch (id) {
      case 'modern':
        return (
          <div className="w-full h-24 bg-white relative overflow-hidden border-b border-gray-100">
            <div className="absolute top-0 right-0 w-16 h-full bg-indigo-50 transform skew-x-12 translate-x-4"></div>
            <div className="p-3 space-y-2">
              <div className="w-8 h-8 rounded-full bg-indigo-100 mb-2"></div>
              <div className="w-20 h-2 bg-gray-800 rounded-full"></div>
              <div className="w-24 h-1.5 bg-gray-200 rounded-full"></div>
              <div className="w-16 h-1.5 bg-gray-200 rounded-full"></div>
            </div>
          </div>
        );
      case 'bold':
        return (
          <div className="w-full h-24 flex border-b border-gray-100">
            <div className="w-1/2 bg-white p-2 flex flex-col justify-center">
              <div className="w-12 h-3 bg-black mb-1"></div>
              <div className="w-8 h-1 bg-gray-400"></div>
            </div>
            <div className="w-1/2 bg-black p-2">
               <div className="w-full h-full bg-zinc-800 rounded-sm opacity-50"></div>
            </div>
          </div>
        );
      case 'tech':
        return (
          <div className="w-full h-24 bg-slate-900 p-3 border-b border-slate-800 font-mono">
            <div className="flex gap-1 mb-2">
              <div className="w-2 h-2 rounded-full bg-red-500"></div>
              <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
              <div className="w-2 h-2 rounded-full bg-green-500"></div>
            </div>
            <div className="space-y-1">
              <div className="w-4 h-1 bg-teal-500 rounded-sm"></div>
              <div className="w-20 h-1.5 bg-slate-600 rounded-sm"></div>
              <div className="w-16 h-1.5 bg-slate-700 rounded-sm"></div>
            </div>
          </div>
        );
      case 'creative':
        return (
          <div className="w-full h-24 bg-stone-50 relative overflow-hidden border-b border-stone-100">
            <div className="absolute -top-4 -right-4 w-16 h-16 bg-rose-300 rounded-full blur-xl opacity-60"></div>
            <div className="absolute top-8 left-8 w-12 h-12 bg-indigo-300 rounded-full blur-xl opacity-60"></div>
            <div className="p-3 relative z-10">
              <div className="w-24 h-3 bg-stone-800 mb-2"></div>
              <div className="w-16 h-1.5 bg-stone-400"></div>
            </div>
          </div>
        );
      case 'clean':
        return (
          <div className="w-full h-24 bg-white flex flex-col items-center justify-center border-b border-gray-100">
            <div className="w-8 h-8 rounded-full border-2 border-gray-100 bg-gray-50 mb-2"></div>
            <div className="w-16 h-1.5 bg-gray-800 rounded-full mb-1"></div>
            <div className="w-10 h-1 bg-gray-300 rounded-full"></div>
          </div>
        );
      case 'custom':
        return (
           <div className="w-full h-24 bg-purple-50 flex items-center justify-center border-b border-purple-100">
              <div className="p-2 bg-white rounded-lg shadow-sm border border-purple-100">
                <Settings className="text-purple-600" size={20} />
              </div>
           </div>
        );
      case 'minimal':
        return (
           <div className="w-full h-24 bg-white p-4 border-b border-gray-100">
             <div className="w-full h-full border-l-2 border-gray-200 pl-2 flex flex-col justify-center gap-1.5">
                <div className="w-20 h-1.5 bg-gray-800"></div>
                <div className="w-24 h-1 bg-gray-300"></div>
                <div className="w-16 h-1 bg-gray-300"></div>
             </div>
           </div>
        );
      case 'ats':
        return (
          <div className="w-full h-24 bg-white p-3 border-b border-gray-100">
            <div className="w-full border-b border-gray-300 pb-1 mb-1 flex justify-between">
               <div className="w-10 h-1 bg-black"></div>
            </div>
            <div className="space-y-1">
               <div className="w-full h-0.5 bg-gray-200"></div>
               <div className="w-full h-0.5 bg-gray-200"></div>
               <div className="w-3/4 h-0.5 bg-gray-200"></div>
            </div>
          </div>
        );
      case 'classic':
        return (
           <div className="w-full h-24 bg-gray-50 p-3 border-b border-gray-200 flex flex-col items-center">
              <div className="w-20 h-1.5 bg-gray-900 mb-1 font-serif"></div>
              <div className="w-32 h-px bg-gray-300 mb-2"></div>
              <div className="w-full space-y-1">
                 <div className="w-full h-1 bg-gray-400"></div>
                 <div className="w-2/3 h-1 bg-gray-400"></div>
              </div>
           </div>
        );
      default:
        return <div className="w-full h-24 bg-gray-100"></div>
    }
  };

  const formContent = useMemo(() => (
    <div className="max-w-4xl mx-auto pb-20">
            
            {activeTab === 'profile' && (
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 md:p-8 animate-fade-in">
                    <h2 className="text-2xl font-bold text-gray-800 mb-8 flex items-center gap-2 border-b border-gray-100 pb-4">
                        <User className="text-indigo-600" /> Personal Profile
                    </h2>

                    <div className="mb-8 flex flex-col md:flex-row items-start gap-6 bg-gray-50 p-6 rounded-2xl border border-gray-100">
                        <div className="shrink-0 mx-auto md:mx-0">
                            <div className="w-24 h-24 rounded-full bg-white border-2 border-gray-200 flex items-center justify-center overflow-hidden relative group shadow-sm">
                                {data.profile.profilePicture ? (
                                    <img src={data.profile.profilePicture} alt="Profile" className="w-full h-full object-cover" />
                                ) : (
                                    <User className="text-gray-300 w-10 h-10" />
                                )}
                                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition flex items-center justify-center cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                                    <div className="text-white text-xs font-medium flex flex-col items-center">
                                        <Upload size={16} className="mb-1" /> Change
                                    </div>
                                </div>
                            </div>
                            {data.profile.profilePicture && (
                                <button type="button" onClick={removeImage} className="text-xs text-red-500 mt-2 w-full text-center hover:underline font-medium">Remove</button>
                            )}
                        </div>
                        <div className="flex-1 text-center md:text-left">
                             <h3 className="font-bold text-gray-800 mb-1">Profile Photo</h3>
                             <p className="text-sm text-gray-500 mb-4">Upload a professional photo. Recommended size: 400x400px.</p>
                             <input 
                                type="file" 
                                ref={fileInputRef} 
                                className="hidden" 
                                accept="image/*" 
                                onChange={handleImageUpload}
                            />
                             <button 
                                type="button"
                                onClick={() => fileInputRef.current?.click()}
                                className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-bold text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition shadow-sm"
                             >
                                 <ImageIcon size={16} className="inline mr-2" />
                                 {data.profile.profilePicture ? 'Change Photo' : 'Upload Photo'}
                             </button>
                        </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                        <InputGroup label="Full Name" value={data.profile.fullName} onChange={(v) => handleProfileChange('fullName', v)} placeholder="e.g. Jane Doe" />
                        <InputGroup label="Job Title" value={data.profile.title} onChange={(v) => handleProfileChange('title', v)} placeholder="e.g. Software Engineer" />
                        <InputGroup label="Email" value={data.profile.email} onChange={(v) => handleProfileChange('email', v)} placeholder="jane@example.com" />
                        <InputGroup label="Phone" value={data.profile.phone || ''} onChange={(v) => handleProfileChange('phone', v)} placeholder="+1 (555) 000-0000" />
                        <InputGroup label="Location" value={data.profile.location || ''} onChange={(v) => handleProfileChange('location', v)} placeholder="City, Country" />
                        <InputGroup label="LinkedIn URL" value={data.profile.linkedin || ''} onChange={(v) => handleProfileChange('linkedin', v)} placeholder="linkedin.com/in/jane" />
                        <InputGroup label="GitHub/Portfolio URL" value={data.profile.github || ''} onChange={(v) => handleProfileChange('github', v)} placeholder="github.com/jane" />
                    </div>

                     <div className="mb-8">
                        <label className={labelClass}>Skills</label>
                        <div className="flex flex-wrap gap-2 mb-3 p-3 border-transparent rounded-xl bg-gray-50 focus-within:ring-2 focus-within:ring-indigo-500/20 focus-within:bg-white transition">
                            {data.profile.skills.map(skill => (
                                <span key={skill} className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-lg text-sm flex items-center gap-1 font-medium">
                                    {skill}
                                    <button type="button" onClick={() => removeSkill(skill)} className="hover:text-indigo-900"><X size={14} /></button>
                                </span>
                            ))}
                            <input 
                                type="text" 
                                value={skillInput}
                                onChange={(e) => setSkillInput(e.target.value)}
                                onKeyDown={handleAddSkill}
                                className="bg-transparent outline-none flex-1 min-w-[120px] text-sm p-1 text-gray-800 placeholder-gray-400"
                                placeholder="Type skill & hit Enter..."
                            />
                        </div>
                    </div>

                    <div>
                        <div className="flex justify-between items-center mb-2">
                            <label className={labelClass}>Professional Summary</label>
                            <div className="flex gap-2">
                                <button 
                                    type="button"
                                    onClick={handleAIGenerateSummary}
                                    disabled={loadingAI === 'summary_gen'}
                                    className="text-xs px-3 py-1.5 rounded-full bg-indigo-50 text-indigo-600 hover:bg-indigo-100 transition flex items-center gap-1 disabled:opacity-50 font-bold"
                                >
                                    <Sparkles size={12} /> {loadingAI === 'summary_gen' ? 'Generating...' : 'Auto-Generate'}
                                </button>
                                <button 
                                    type="button"
                                    onClick={() => handleAIEnhance('summary', data.profile.summary, 'summary', (v) => handleProfileChange('summary', v))}
                                    disabled={loadingAI === 'summary'}
                                    className="text-xs px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-600 hover:bg-emerald-100 transition flex items-center gap-1 disabled:opacity-50 font-bold"
                                >
                                    <Sparkles size={12} /> {loadingAI === 'summary' ? 'Enhancing...' : 'Refine'}
                                </button>
                            </div>
                        </div>
                        <textarea 
                            value={data.profile.summary} 
                            onChange={(e) => handleProfileChange('summary', e.target.value)}
                            rows={5}
                            className={`${inputClass} leading-relaxed`}
                            placeholder="Briefly describe your professional background..."
                        />
                    </div>
                </div>
            )}

            {activeTab === 'experience' && (
                <div className="space-y-6 animate-fade-in">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-2xl font-bold text-gray-800">Work Experience</h2>
                        <button type="button" onClick={addExperience} className="flex items-center gap-2 text-sm bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition shadow-md shadow-indigo-200 font-bold">
                            <Plus size={16} /> Add Position
                        </button>
                    </div>

                    {data.experience.map((exp, idx) => (
                        <div key={exp.id} className="bg-white p-6 md:p-8 rounded-2xl border border-gray-100 shadow-sm relative group hover:shadow-md transition">
                             <button 
                                onClick={() => removeExperience(idx)} 
                                className="absolute top-4 right-4 md:top-6 md:right-6 p-2 rounded-full bg-gray-50 text-gray-400 hover:text-red-500 hover:bg-red-50 transition opacity-0 group-hover:opacity-100"
                                title="Remove Experience"
                            >
                                <Trash2 size={18} />
                            </button>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                <InputGroup label="Job Title" value={exp.role} onChange={(v) => handleExperienceChange(idx, 'role', v)} />
                                <InputGroup label="Company" value={exp.company} onChange={(v) => handleExperienceChange(idx, 'company', v)} />
                            </div>
                             <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                <InputGroup label="Start Date" value={exp.startDate} onChange={(v) => handleExperienceChange(idx, 'startDate', v)} placeholder="e.g. Jan 2020" />
                                <div className="flex flex-col gap-1">
                                    <label className={labelClass}>End Date</label>
                                    <div className="flex items-center gap-3">
                                        <input 
                                            placeholder="e.g. Present"
                                            value={exp.endDate}
                                            disabled={exp.current}
                                            onChange={(e) => handleExperienceChange(idx, 'endDate', e.target.value)}
                                            className={`${inputClass} disabled:bg-gray-100 disabled:text-gray-400`}
                                        />
                                        <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer select-none bg-gray-50 px-4 py-3 rounded-xl border border-transparent hover:bg-gray-100 transition whitespace-nowrap font-medium">
                                            <input 
                                                type="checkbox" 
                                                checked={exp.current} 
                                                onChange={(e) => handleExperienceChange(idx, 'current', e.target.checked)}
                                                className="rounded text-indigo-600 focus:ring-indigo-500 w-4 h-4"
                                            /> Current
                                        </label>
                                    </div>
                                </div>
                            </div>
                            <div>
                                <div className="flex justify-between items-end mb-2">
                                    <label className={labelClass}>Description</label>
                                    <button 
                                        onClick={() => handleAIEnhance(`exp_${idx}`, exp.description, 'experience', (v) => handleExperienceChange(idx, 'description', v))}
                                        disabled={loadingAI === `exp_${idx}`}
                                        className="text-xs flex items-center gap-1 text-emerald-600 hover:text-emerald-700 bg-emerald-50 px-2 py-1 rounded-md transition disabled:opacity-50 font-bold"
                                    >
                                        <Sparkles size={12} /> {loadingAI === `exp_${idx}` ? 'Polishing...' : 'Polish'}
                                    </button>
                                </div>
                                <textarea 
                                    value={exp.description}
                                    onChange={(e) => handleExperienceChange(idx, 'description', e.target.value)}
                                    rows={5}
                                    className={`${inputClass} leading-relaxed`}
                                    placeholder="• Achieved X by doing Y..."
                                />
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {activeTab === 'projects' && (
                <div className="space-y-6 animate-fade-in">
                     <div className="flex justify-between items-center mb-4">
                        <h2 className="text-2xl font-bold text-gray-800">Projects</h2>
                        <button type="button" onClick={addProject} className="flex items-center gap-2 text-sm bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition shadow-md shadow-indigo-200 font-bold">
                            <Plus size={16} /> Add Project
                        </button>
                    </div>
                    {data.projects.map((proj, idx) => (
                        <div key={proj.id} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm relative group hover:shadow-md transition mb-4">
                            <button 
                                onClick={() => {
                                    const list = [...data.projects];
                                    list.splice(idx, 1);
                                    setData(prev => ({...prev, projects: list}));
                                }}
                                className="absolute top-4 right-4 md:top-6 md:right-6 p-2 rounded-full bg-gray-50 text-gray-400 hover:text-red-500 hover:bg-red-50 transition opacity-0 group-hover:opacity-100"
                            >
                                <Trash2 size={18} />
                            </button>
                            
                            <div className="mb-4">
                                <InputGroup 
                                    label="Project Title"
                                    value={proj.title}
                                    onChange={(v) => updateProject(idx, 'title', v)}
                                    placeholder="e.g. E-commerce Dashboard"
                                />
                            </div>
                            
                            <div className="mb-4">
                                <label className={labelClass}>Description</label>
                                <textarea
                                    className={inputClass}
                                    value={proj.description}
                                    onChange={(e) => updateProject(idx, 'description', e.target.value)}
                                    placeholder="What did you build? How did it help?"
                                    rows={3}
                                />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className={labelClass}>Technologies</label>
                                    <input
                                        type="text"
                                        className={inputClass}
                                        value={proj.technologies.join(', ')}
                                        onChange={(e) => updateProject(idx, 'technologies', e.target.value.split(',').map(t => t.trim()))}
                                        placeholder="React, Node.js, AWS"
                                    />
                                </div>
                                <InputGroup 
                                    label="Project Link"
                                    value={proj.link || ''}
                                    onChange={(v) => updateProject(idx, 'link', v)}
                                    placeholder="https://..."
                                />
                            </div>
                        </div>
                    ))}
                </div>
            )}

             {activeTab === 'education' && (
                <div className="space-y-6 animate-fade-in">
                     <div className="flex justify-between items-center mb-4">
                        <h2 className="text-2xl font-bold text-gray-800">Education</h2>
                        <button type="button" onClick={addEducation} className="flex items-center gap-2 text-sm bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition shadow-md shadow-indigo-200 font-bold">
                            <Plus size={16} /> Add Education
                        </button>
                    </div>
                    {data.education.map((edu, idx) => (
                        <div key={edu.id} className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm relative group hover:shadow-md transition">
                             <button 
                                onClick={() => {
                                    const list = [...data.education];
                                    list.splice(idx, 1);
                                    setData(prev => ({...prev, education: list}));
                                }}
                                className="absolute top-4 right-4 p-2 rounded-full bg-gray-50 text-gray-400 hover:text-red-500 hover:bg-red-50 transition opacity-0 group-hover:opacity-100"
                            >
                                <Trash2 size={18} />
                            </button>
                            
                            <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-start">
                                <div className="md:col-span-5">
                                    <InputGroup 
                                        label="Institution"
                                        value={edu.institution}
                                        onChange={(v) => updateEducation(idx, 'institution', v)}
                                        placeholder="School / University"
                                    />
                                </div>
                                <div className="md:col-span-4">
                                    <InputGroup 
                                        label="Degree"
                                        value={edu.degree}
                                        onChange={(v) => updateEducation(idx, 'degree', v)}
                                        placeholder="Degree / Certificate"
                                    />
                                </div>
                                <div className="md:col-span-3">
                                    <InputGroup 
                                        label="Year"
                                        value={edu.year}
                                        onChange={(v) => updateEducation(idx, 'year', v)}
                                        placeholder="e.g. 2018"
                                    />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {activeTab === 'certifications' && (
                <div className="space-y-6 animate-fade-in">
                     <div className="flex justify-between items-center mb-4">
                        <h2 className="text-2xl font-bold text-gray-800">Certifications</h2>
                        <button type="button" onClick={addCertification} className="flex items-center gap-2 text-sm bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition shadow-md shadow-indigo-200 font-bold">
                            <Plus size={16} /> Add Certification
                        </button>
                    </div>
                    {data.certifications?.map((cert, idx) => (
                        <div key={cert.id} className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm relative group hover:shadow-md transition">
                             <button 
                                onClick={() => {
                                    const list = [...(data.certifications || [])];
                                    list.splice(idx, 1);
                                    setData(prev => ({...prev, certifications: list}));
                                }}
                                className="absolute top-4 right-4 p-2 rounded-full bg-gray-50 text-gray-400 hover:text-red-500 hover:bg-red-50 transition opacity-0 group-hover:opacity-100"
                            >
                                <Trash2 size={18} />
                            </button>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <InputGroup label="Certification Name" value={cert.name} onChange={(v) => updateCertification(idx, 'name', v)} />
                                <InputGroup label="Issuing Organization" value={cert.issuer} onChange={(v) => updateCertification(idx, 'issuer', v)} />
                                <InputGroup label="Date" value={cert.date} onChange={(v) => updateCertification(idx, 'date', v)} placeholder="e.g. 2023" />
                                <InputGroup label="Credential URL" value={cert.link || ''} onChange={(v) => updateCertification(idx, 'link', v)} />
                            </div>
                        </div>
                    ))}
                </div>
            )}

             {activeTab === 'languages' && (
                <div className="space-y-6 animate-fade-in">
                     <div className="flex justify-between items-center mb-4">
                        <h2 className="text-2xl font-bold text-gray-800">Languages</h2>
                        <button type="button" onClick={addLanguage} className="flex items-center gap-2 text-sm bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition shadow-md shadow-indigo-200 font-bold">
                            <Plus size={16} /> Add Language
                        </button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {data.languages?.map((lang, idx) => (
                        <div key={lang.id} className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm relative group hover:shadow-md transition">
                             <button 
                                onClick={() => {
                                    const list = [...(data.languages || [])];
                                    list.splice(idx, 1);
                                    setData(prev => ({...prev, languages: list}));
                                }}
                                className="absolute top-4 right-4 p-2 rounded-full bg-gray-50 text-gray-400 hover:text-red-500 hover:bg-red-50 transition opacity-0 group-hover:opacity-100"
                            >
                                <Trash2 size={16} />
                            </button>
                            <div className="space-y-4">
                                <InputGroup 
                                    label="Language"
                                    value={lang.language}
                                    onChange={(v) => updateLanguage(idx, 'language', v)}
                                    placeholder="e.g. English"
                                />
                                <InputGroup 
                                    label="Proficiency"
                                    value={lang.proficiency}
                                    onChange={(v) => updateLanguage(idx, 'proficiency', v)}
                                    placeholder="e.g. Native, Fluent"
                                />
                            </div>
                        </div>
                    ))}
                    </div>
                </div>
            )}

            {activeTab === 'design' && (
                <div className="space-y-8 animate-fade-in">
                    {/* Template Selector */}
                    <div className="bg-white p-4 md:p-8 rounded-2xl shadow-sm border border-gray-100">
                        <h2 className="text-2xl font-bold text-gray-800 mb-6">Choose Template</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {templates.map(temp => (
                                <div 
                                    key={temp.id}
                                    onClick={() => setData(prev => ({...prev, templateId: temp.id}))}
                                    className={`cursor-pointer rounded-xl border-2 transition-all duration-300 flex flex-col relative overflow-hidden group ${
                                        data.templateId === temp.id 
                                        ? 'border-indigo-600 ring-4 ring-indigo-600/10 shadow-lg scale-[1.02] bg-white' 
                                        : 'border-gray-100 hover:border-indigo-300 hover:shadow-md bg-white'
                                    }`}
                                >
                                    {/* Preview Area */}
                                    {renderTemplatePreview(temp.id)}
                                    
                                    <div className="p-4">
                                        <div className="flex items-center justify-between mb-1">
                                            <h3 className={`font-bold ${data.templateId === temp.id ? 'text-indigo-700' : 'text-gray-900'}`}>
                                                {temp.name}
                                            </h3>
                                             {data.templateId === temp.id && (
                                                <div className="w-5 h-5 bg-indigo-600 rounded-full flex items-center justify-center">
                                                    <Check size={12} className="text-white" />
                                                </div>
                                            )}
                                        </div>
                                        <p className="text-xs text-gray-500 leading-relaxed font-medium mb-3">
                                            {temp.desc}
                                        </p>
                                        <div className="flex gap-2">
                                             <span className={`text-[10px] px-2 py-0.5 rounded-full border font-bold uppercase tracking-wider ${temp.type === 'Web' ? 'bg-blue-50 text-blue-600 border-blue-100' : temp.type === 'Builder' ? 'bg-purple-50 text-purple-600 border-purple-100' : 'bg-gray-50 text-gray-600 border-gray-200'}`}>
                                                {temp.type}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    
                    {/* Custom Builder UI - Only shown when 'custom' template is selected */}
                    {data.templateId === 'custom' && data.customTheme && (
                         <div className="bg-white p-4 md:p-8 rounded-2xl shadow-sm border border-purple-100 animate-fade-in ring-2 ring-purple-500/10">
                            <div className="flex items-center gap-3 mb-8 border-b border-gray-100 pb-4">
                                <div className="p-2 bg-purple-100 rounded-lg text-purple-600">
                                    <Settings size={24} />
                                </div>
                                <div>
                                    <h3 className="font-bold text-xl text-gray-900">Custom Builder</h3>
                                    <p className="text-sm text-gray-500">Design your portfolio from scratch.</p>
                                </div>
                            </div>

                            {/* Global Settings */}
                            <div className="mb-8 space-y-8">
                                <div>
                                    <h4 className="font-bold text-sm uppercase text-gray-500 tracking-wider mb-4 border-b border-gray-100 pb-2">Global Typography & Header</h4>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label className={labelClass}><Type className="inline w-4 h-4 mr-1"/> Heading Font</label>
                                            <select 
                                                className={inputClass}
                                                value={data.customTheme.fontHeading}
                                                onChange={(e) => handleThemeChange('fontHeading', e.target.value)}
                                            >
                                                {fonts.map(f => <option key={f} value={f}>{f}</option>)}
                                            </select>
                                        </div>
                                        <div>
                                            <label className={labelClass}><Type className="inline w-4 h-4 mr-1"/> Body Font</label>
                                            <select 
                                                className={inputClass}
                                                value={data.customTheme.fontBody}
                                                onChange={(e) => handleThemeChange('fontBody', e.target.value)}
                                            >
                                                {fonts.map(f => <option key={f} value={f}>{f}</option>)}
                                            </select>
                                        </div>
                                         <div>
                                            <label className={labelClass}>Header/Navigation Style</label>
                                            <div className="flex gap-2">
                                                {['standard', 'centered', 'minimal'].map((style) => (
                                                    <button
                                                        key={style}
                                                        onClick={() => handleThemeChange('headerLayout', style)}
                                                        className={`flex-1 py-2 px-3 text-sm rounded border capitalize ${data.customTheme?.headerLayout === style ? 'bg-purple-600 text-white border-purple-600' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
                                                    >
                                                        {style}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <h4 className="font-bold text-sm uppercase text-gray-500 tracking-wider mb-4 border-b border-gray-100 pb-2">Colors</h4>
                                    
                                    {/* Quick Palettes */}
                                    <div className="mb-4">
                                        <label className={labelClass}>Quick Palettes</label>
                                        <div className="flex gap-3 overflow-x-auto pb-2">
                                            {[
                                                { name: 'Modern', p: '#4F46E5', a: '#10B981' },
                                                { name: 'Elegant', p: '#1E293B', a: '#94A3B8' },
                                                { name: 'Bold', p: '#000000', a: '#EF4444' },
                                                { name: 'Nature', p: '#166534', a: '#A3E635' },
                                                { name: 'Ocean', p: '#0EA5E9', a: '#F472B6' },
                                            ].map((pal) => (
                                                <button 
                                                    key={pal.name}
                                                    onClick={() => applyPalette(pal.p, pal.a)}
                                                    className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-gray-200 hover:shadow-sm bg-white transition min-w-max"
                                                >
                                                    <div className="flex">
                                                        <span className="w-3 h-3 rounded-full" style={{ background: pal.p }}></span>
                                                        <span className="w-3 h-3 rounded-full -ml-1" style={{ background: pal.a }}></span>
                                                    </div>
                                                    <span className="text-xs font-medium text-gray-600">{pal.name}</span>
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label className={labelClass}><Palette className="inline w-4 h-4 mr-1"/> Primary Color</label>
                                            <div className="flex gap-3 items-center">
                                                <input 
                                                    type="color" 
                                                    className="w-12 h-10 rounded-lg border-2 border-white shadow-md cursor-pointer"
                                                    value={data.customTheme.primaryColor}
                                                    onChange={(e) => handleThemeChange('primaryColor', e.target.value)}
                                                />
                                                <input 
                                                    type="text"
                                                    className={inputClass}
                                                    value={data.customTheme.primaryColor}
                                                    onChange={(e) => handleThemeChange('primaryColor', e.target.value)}
                                                />
                                            </div>
                                        </div>
                                        <div>
                                            <label className={labelClass}><Palette className="inline w-4 h-4 mr-1"/> Accent Color</label>
                                            <div className="flex gap-3 items-center">
                                                <input 
                                                    type="color" 
                                                    className="w-12 h-10 rounded-lg border-2 border-white shadow-md cursor-pointer"
                                                    value={data.customTheme.accentColor}
                                                    onChange={(e) => handleThemeChange('accentColor', e.target.value)}
                                                />
                                                <input 
                                                    type="text"
                                                    className={inputClass}
                                                    value={data.customTheme.accentColor}
                                                    onChange={(e) => handleThemeChange('accentColor', e.target.value)}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Section Customization */}
                            <div className="space-y-3">
                                <h4 className="font-bold text-sm uppercase text-gray-500 tracking-wider mb-4 border-b border-gray-100 pb-2">Section Customization</h4>
                                {Object.keys(data.customTheme.sections).map((sectionKey) => {
                                    const section = data.customTheme!.sections[sectionKey as keyof CustomTheme['sections']];
                                    const isExpanded = expandedSection === sectionKey;
                                    
                                    // Define valid layouts per section type
                                    const validLayouts = {
                                        hero: ['standard', 'centered', 'split', 'minimal'],
                                        experience: ['standard', 'split', 'cards', 'minimal'],
                                        projects: ['grid', 'cards', 'standard', 'minimal'],
                                        education: ['standard', 'cards'],
                                        contact: ['centered', 'split', 'minimal'],
                                        about: ['centered', 'standard']
                                    };
                                    
                                    const options = validLayouts[sectionKey as keyof typeof validLayouts] || ['standard'];

                                    return (
                                        <div key={sectionKey} className="border border-gray-200 rounded-xl overflow-hidden bg-gray-50/50">
                                            <button 
                                                onClick={() => setExpandedSection(isExpanded ? null : sectionKey)}
                                                className="w-full flex items-center justify-between p-4 bg-white hover:bg-gray-50 transition"
                                            >
                                                <span className="font-bold capitalize text-gray-700">{sectionKey} Section</span>
                                                <div className="flex items-center gap-3">
                                                    <span className={`text-xs px-2 py-1 rounded font-medium ${section.visible ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-500'}`}>
                                                        {section.visible ? 'Visible' : 'Hidden'}
                                                    </span>
                                                    {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                                                </div>
                                            </button>
                                            
                                            {isExpanded && (
                                                <div className="p-4 border-t border-gray-100 space-y-4 animate-slide-up bg-white">
                                                    <div className="flex items-center gap-2 mb-2">
                                                        <input 
                                                            type="checkbox"
                                                            checked={section.visible}
                                                            onChange={(e) => handleSectionConfigChange(sectionKey as any, 'visible', e.target.checked)}
                                                            className="w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500"
                                                            id={`visible-${sectionKey}`}
                                                        />
                                                        <label htmlFor={`visible-${sectionKey}`} className="text-sm text-gray-700 font-medium">Show this section</label>
                                                    </div>
                                                    
                                                    {section.visible && (
                                                        <>
                                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                                <div>
                                                                    <label className={labelClass}>Background Color</label>
                                                                    <div className="flex gap-2">
                                                                        <input type="color" value={section.bgColor} onChange={(e) => handleSectionConfigChange(sectionKey as any, 'bgColor', e.target.value)} className="h-10 w-12 cursor-pointer rounded border border-gray-300 shadow-sm"/>
                                                                        <input type="text" value={section.bgColor} onChange={(e) => handleSectionConfigChange(sectionKey as any, 'bgColor', e.target.value)} className={inputClass} />
                                                                    </div>
                                                                </div>
                                                                <div>
                                                                    <label className={labelClass}>Text Color</label>
                                                                    <div className="flex gap-2">
                                                                        <input type="color" value={section.textColor} onChange={(e) => handleSectionConfigChange(sectionKey as any, 'textColor', e.target.value)} className="h-10 w-12 cursor-pointer rounded border border-gray-300 shadow-sm"/>
                                                                        <input type="text" value={section.textColor} onChange={(e) => handleSectionConfigChange(sectionKey as any, 'textColor', e.target.value)} className={inputClass} />
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div>
                                                                <label className={labelClass}>Layout Style</label>
                                                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                                                                    {options.map(layout => (
                                                                        <button 
                                                                            key={layout}
                                                                            onClick={() => handleSectionConfigChange(sectionKey as any, 'layout', layout)}
                                                                            className={`px-3 py-2 text-xs font-medium rounded border capitalize transition ${section.layout === layout ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'}`}
                                                                        >
                                                                            {layout}
                                                                        </button>
                                                                    ))}
                                                                </div>
                                                            </div>
                                                        </>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                         </div>
                    )}

                    <div className="bg-white p-4 md:p-8 rounded-2xl shadow-sm border border-gray-100">
                         <h3 className="font-bold text-lg text-gray-800 mb-4">Portfolio Settings</h3>
                         <InputGroup 
                            label="Internal Portfolio Name" 
                            value={data.name} 
                            onChange={(v) => setData(prev => ({...prev, name: v}))} 
                        />
                    </div>
                </div>
            )}

        </div>
  ), [activeTab, data, loadingAI, skillInput, expandedSection]);

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden font-sans text-gray-900 relative">
      {/* Mobile Header */}
      <div className="lg:hidden absolute top-0 left-0 right-0 h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 z-20 shadow-sm">
             <div className="flex items-center gap-3">
                 <button onClick={() => setIsMobileMenuOpen(true)} className="p-2 -ml-2 text-gray-600 hover:bg-gray-100 rounded-lg">
                     <Menu size={24} />
                 </button>
                 <span className="font-extrabold text-lg bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">FolioForge</span>
             </div>
             <button 
                type="button"
                onClick={() => onSave({...data, lastModified: Date.now()})} 
                className="bg-gray-900 text-white px-4 py-2 rounded-lg text-sm font-bold shadow-md active:scale-95 transition"
             >
                 Save
             </button>
      </div>

      {/* Sidebar Overlay */}
      {isMobileMenuOpen && (
            <div 
                className="fixed inset-0 bg-black/50 backdrop-blur-sm z-30 lg:hidden"
                onClick={() => setIsMobileMenuOpen(false)}
            />
      )}

      {/* Sidebar */}
      <div className={`
            fixed inset-y-0 left-0 z-40 w-72 bg-white border-r border-gray-200 flex flex-col shadow-2xl transform transition-transform duration-300 ease-in-out
            lg:relative lg:translate-x-0 lg:shadow-xl lg:z-20
            ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="p-6 border-b border-gray-100 flex justify-between items-center">
            <h2 className="font-extrabold text-2xl flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent tracking-tight">
                <Layout className="w-6 h-6 text-indigo-600" /> FolioForge
            </h2>
            <button onClick={() => setIsMobileMenuOpen(false)} className="lg:hidden text-gray-400 hover:text-gray-600">
                <X size={24} />
            </button>
        </div>
        <div className="hidden lg:block px-6 pb-2 pt-2 text-xs text-gray-400 font-medium">Editor v2.5</div>
        <nav className="flex-1 overflow-y-auto p-4 space-y-1.5">
            {tabs.map(tab => {
                const Icon = tab.icon;
                return (
                    <button
                        key={tab.id}
                        onClick={() => {
                            setActiveTab(tab.id as any);
                            setIsMobileMenuOpen(false);
                        }}
                        className={`w-full text-left px-4 py-3.5 rounded-xl font-bold transition-all duration-200 flex items-center gap-3 text-sm ${
                            activeTab === tab.id 
                            ? 'bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-lg shadow-indigo-200 scale-[1.02]' 
                            : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
                        }`}
                    >
                        <Icon size={18} className={activeTab === tab.id ? 'text-white' : 'text-gray-400 group-hover:text-gray-600'} />
                        {tab.label}
                    </button>
                );
            })}
        </nav>
        <div className="p-6 border-t border-gray-100 space-y-3 bg-gray-50/50">
            <button 
                type="button"
                onClick={() => onSave({...data, lastModified: Date.now()})} 
                className="w-full flex items-center justify-center gap-2 bg-gray-900 text-white py-3 rounded-xl hover:bg-black transition shadow-lg shadow-gray-300 font-bold"
            >
                <Save size={18} /> Save Portfolio
            </button>
            <button 
                type="button"
                onClick={onCancel} 
                className="w-full flex items-center justify-center gap-2 text-gray-600 py-3 rounded-xl hover:bg-white hover:shadow-md transition border border-transparent hover:border-gray-200 font-bold"
            >
                <ArrowLeft size={18} /> Back to Dashboard
            </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col h-full overflow-hidden pt-16 lg:pt-0 relative w-full">
            {isCustomMode ? (
                <div className="flex-1 flex overflow-hidden w-full">
                    {/* Left: Inputs */}
                    <div className="w-full lg:w-5/12 border-r border-gray-200 overflow-y-auto bg-gray-50/50 p-4 md:p-8 custom-scrollbar">
                        {formContent}
                    </div>
                    
                    {/* Right: Live Preview (Hidden on mobile) */}
                    <div className="hidden lg:flex flex-1 bg-gray-100 flex-col relative">
                        {/* Toolbar */}
                        <div className="bg-white border-b border-gray-200 p-3 flex justify-between items-center shadow-sm z-10 px-6">
                                <span className="text-sm font-bold text-gray-700 flex items-center gap-2">
                                    <span className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse"></span> Live Preview
                                </span>
                                <div className="bg-gray-100 p-1 rounded-lg flex border border-gray-200">
                                    <button 
                                        onClick={() => setPreviewDevice('desktop')}
                                        className={`p-2 rounded transition ${previewDevice === 'desktop' ? 'bg-white shadow-sm text-indigo-600' : 'text-gray-500 hover:text-gray-800'}`}
                                        title="Desktop View"
                                    >
                                        <Monitor size={18} />
                                    </button>
                                    <button 
                                        onClick={() => setPreviewDevice('mobile')}
                                        className={`p-2 rounded transition ${previewDevice === 'mobile' ? 'bg-white shadow-sm text-indigo-600' : 'text-gray-500 hover:text-gray-800'}`}
                                        title="Mobile View"
                                    >
                                        <Smartphone size={18} />
                                    </button>
                                </div>
                        </div>

                        {/* Preview Canvas */}
                        <div className="flex-1 overflow-hidden flex items-center justify-center p-8 relative bg-gray-100/50">
                                <div className={`bg-white shadow-2xl transition-all duration-500 ease-in-out overflow-hidden border-8 border-gray-800 rounded-[24px] relative flex flex-col ring-8 ring-black/5 ${
                                    previewDevice === 'mobile' ? 'w-[375px] h-[812px]' : 'w-full h-full rounded-xl border-[0px] ring-0 shadow-none'
                                }`}>
                                    {previewDevice === 'mobile' && (
                                        <div className="absolute top-0 w-full h-7 bg-gray-800 z-50 flex justify-center items-center">
                                            <div className="w-24 h-4 bg-black rounded-b-xl"></div>
                                        </div>
                                    )}
                                    <div className="flex-1 w-full h-full overflow-y-auto bg-white scrollbar-hide">
                                        <CustomTemplate data={data} isPreview={true} />
                                    </div>
                                </div>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="flex-1 overflow-y-auto bg-gray-50/50 p-4 md:p-8 custom-scrollbar w-full">
                    {formContent}
                </div>
            )}
      </div>
    </div>
  );
};

const InputGroup = ({ label, value, onChange, placeholder }: { label: string, value: string, onChange: (val: string) => void, placeholder?: string }) => (
    <div className="flex-1">
        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 ml-1">{label}</label>
        <input 
            type="text" 
            value={value} 
            onChange={(e) => onChange(e.target.value)}
            className="w-full p-3 border-transparent rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all duration-200 text-gray-800 bg-gray-50 hover:bg-white focus:bg-white placeholder-gray-400 font-medium shadow-sm"
            placeholder={placeholder}
        />
    </div>
);

const TagInput = ({ tags, onAdd, onRemove, placeholder }: { tags: string[], onAdd: (tag: string) => void, onRemove: (tag: string) => void, placeholder: string }) => {
    const [val, setVal] = useState('');

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            if (val.trim()) {
                if (!tags.includes(val.trim())) {
                    onAdd(val.trim());
                }
                setVal('');
            }
        }
    };

    return (
        <div className="w-full">
             <div className="flex flex-wrap gap-2 p-3 border-transparent rounded-xl bg-gray-50 focus-within:ring-2 focus-within:ring-indigo-500/20 focus-within:bg-white transition shadow-sm hover:bg-white min-h-[50px]">
                {tags.map(tag => (
                    <span key={tag} className="bg-indigo-100 text-indigo-700 px-2.5 py-1 rounded-lg text-sm flex items-center gap-1.5 font-medium animate-fade-in">
                        {tag}
                        <button 
                            onClick={() => onRemove(tag)} 
                            type="button"
                            className="hover:text-indigo-900 hover:bg-indigo-200 rounded-full p-0.5 transition"
                        >
                            <X size={12} />
                        </button>
                    </span>
                ))}
                <input 
                    type="text" 
                    value={val}
                    onChange={(e) => setVal(e.target.value)}
                    onKeyDown={handleKeyDown}
                    className="bg-transparent outline-none flex-1 min-w-[100px] text-sm text-gray-800 placeholder-gray-400 py-1"
                    placeholder={placeholder}
                />
            </div>
        </div>
    );
};

export default PortfolioEditor;
