

import React, { useState, useEffect } from 'react';
import { Portfolio, SectionConfig, TemplateProps, HeaderLayout } from '../types';
// Added Layout to imports
import { Mail, MapPin, Linkedin, Github, ExternalLink, Phone, Award, Globe, Menu, X, ChevronRight, Code, Terminal, Cpu, Layout, ArrowRight } from 'lucide-react';

// --- Helper Components ---

interface NavLinkProps {
  href: string;
  children?: React.ReactNode;
  onClick?: () => void;
  className?: string;
}

const NavLink = ({ href, children, onClick, className = "" }: NavLinkProps) => (
  <a 
    href={href} 
    onClick={(e) => {
      e.preventDefault();
      const target = document.querySelector(href);
      if (target) {
          target.scrollIntoView({ behavior: 'smooth' });
      }
      if (onClick) onClick();
    }}
    className={`cursor-pointer hover:opacity-70 transition-opacity ${className}`}
  >
    {children}
  </a>
);

const WebsiteNav = ({ name, dark = false, transparent = false, isPreview = false, layout = 'standard', customStyles }: { name: string, dark?: boolean, transparent?: boolean, isPreview?: boolean, layout?: HeaderLayout, customStyles?: any }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        if (isPreview) {
             setScrolled(true);
             return;
        }
        const handleScroll = () => setScrolled(window.scrollY > 50);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [isPreview]);

    let baseClass = isPreview ? `absolute top-0 w-full z-40 transition-all duration-300 ` : `fixed top-0 w-full z-40 transition-all duration-300 `;
    
    // Style override if custom
    const style = customStyles ? { color: customStyles.color } : {};
    
    // Background Logic
    let bgClass = "";
    if (transparent && !scrolled && !isPreview) {
        bgClass = 'bg-transparent py-6';
    } else if (dark) {
        bgClass = `bg-slate-900/90 backdrop-blur-md shadow-lg py-4`;
    } else if (customStyles) {
        bgClass = `bg-white/90 backdrop-blur-md shadow-sm py-4`; // Default for custom unless overridden
    } else {
        bgClass = `bg-white/90 backdrop-blur-md shadow-sm py-4`;
    }

    const containerClass = `container mx-auto px-6 flex items-center ${layout === 'centered' ? 'flex-col gap-4 justify-center' : 'justify-between'}`;

    return (
        <nav className={`${baseClass} ${bgClass}`} style={style}>
            <div className={containerClass}>
                <a href="#hero" className={`font-bold text-xl tracking-tight ${layout === 'centered' ? 'text-2xl' : ''}`}>
                    {name}
                </a>

                {/* Desktop Menu */}
                <div className={`hidden md:flex gap-8 font-medium text-sm items-center`}>
                     {layout === 'minimal' ? (
                         <button onClick={() => setIsOpen(!isOpen)} className="flex items-center gap-2 hover:opacity-70">
                             <Menu size={20} /> <span className="uppercase tracking-widest text-xs">Menu</span>
                         </button>
                     ) : (
                        <>
                            <NavLink href="#about">About</NavLink>
                            <NavLink href="#experience">Experience</NavLink>
                            <NavLink href="#projects">Work</NavLink>
                            <NavLink href="#contact">Contact</NavLink>
                        </>
                     )}
                </div>

                {/* Mobile Toggle */}
                <button onClick={() => setIsOpen(!isOpen)} className={`md:hidden`}>
                    {isOpen ? <X /> : <Menu />}
                </button>

                {/* Mobile/Minimal Menu Overlay */}
                {isOpen && (
                    <div className={`absolute top-full left-0 w-full p-6 flex flex-col gap-4 shadow-xl ${dark ? 'bg-slate-800 text-slate-300' : 'bg-white text-gray-900'}`}>
                        <NavLink href="#about" onClick={() => setIsOpen(false)}>About</NavLink>
                        <NavLink href="#experience" onClick={() => setIsOpen(false)}>Experience</NavLink>
                        <NavLink href="#projects" onClick={() => setIsOpen(false)}>Work</NavLink>
                        <NavLink href="#contact" onClick={() => setIsOpen(false)}>Contact</NavLink>
                    </div>
                )}
            </div>
        </nav>
    );
};

// --- CUSTOM TEMPLATE RENDERER ---

export const CustomTemplate: React.FC<TemplateProps> = ({ data, isPreview }) => {
    const { profile, experience, education, projects, customTheme } = data;
    
    if (!customTheme) return <div className="p-10">Error: No custom theme configuration found.</div>;

    const style = {
        fontFamily: customTheme.fontBody,
        '--primary-color': customTheme.primaryColor,
        '--accent-color': customTheme.accentColor,
    } as React.CSSProperties;

    const Heading = ({ children, className = "" }: { children: React.ReactNode, className?: string }) => (
        <h1 className={className} style={{ fontFamily: customTheme.fontHeading }}>{children}</h1>
    );

    const Section = ({ id, config, children }: { id: string, config: SectionConfig, children: React.ReactNode }) => {
        if (!config.visible) return null;
        return (
            <section 
                id={id} 
                className="py-24 px-6 md:px-12 transition-colors duration-300"
                style={{ backgroundColor: config.bgColor, color: config.textColor }}
            >
                <div className={`mx-auto ${config.layout === 'split' ? 'max-w-7xl' : 'max-w-6xl'}`}>{children}</div>
            </section>
        );
    };

    // --- Sub-Renderers based on Layout ---

    const renderHero = () => {
        const layout = customTheme.sections.hero.layout;
        const isSplit = layout === 'split';
        const isCentered = layout === 'centered';
        const isMinimal = layout === 'minimal';

        return (
            <div className={`flex flex-col gap-12 ${isSplit ? 'md:flex-row items-center' : 'items-center text-center'}`}>
                <div className={`flex-1 ${isSplit ? 'text-left' : ''} ${isMinimal ? 'max-w-4xl' : ''}`}>
                        <p className="font-bold text-[var(--primary-color)] mb-4 tracking-widest uppercase text-sm">
                            {profile.title}
                        </p>
                        <Heading className={`${isMinimal ? 'text-6xl md:text-9xl' : 'text-5xl md:text-7xl'} font-bold mb-6 leading-tight`}>
                            {profile.fullName}
                        </Heading>
                        <p className={`text-xl opacity-80 leading-relaxed mb-8 ${isCentered ? 'mx-auto' : ''} max-w-2xl`}>
                            {profile.summary}
                        </p>
                        <div className={`flex flex-wrap gap-4 ${isCentered ? 'justify-center' : ''} items-center`}>
                            <a href="#contact" className="px-8 py-3 bg-[var(--primary-color)] text-white rounded font-medium hover:opacity-90 transition shadow-lg shadow-[var(--primary-color)]/30">
                                Contact Me
                            </a>
                            <a href="#projects" className="px-8 py-3 border-2 border-[var(--primary-color)] text-[var(--primary-color)] rounded font-medium hover:bg-[var(--primary-color)] hover:text-white transition">
                                View Work
                            </a>
                            <div className="flex gap-4 ml-2 pl-4 border-l border-current/20">
                                {profile.github && <a href={profile.github} target="_blank" rel="noreferrer" className="opacity-70 hover:opacity-100 hover:text-[var(--primary-color)] transition"><Github size={24} /></a>}
                                {profile.linkedin && <a href={profile.linkedin} target="_blank" rel="noreferrer" className="opacity-70 hover:opacity-100 hover:text-[var(--primary-color)] transition"><Linkedin size={24} /></a>}
                            </div>
                        </div>
                </div>
                {profile.profilePicture && !isMinimal && (
                    <div className={`flex-1 ${isSplit ? 'flex justify-end' : 'mt-8'}`}>
                        <img 
                            src={profile.profilePicture} 
                            alt={profile.fullName} 
                            className={`object-cover shadow-2xl ${
                                isSplit 
                                ? 'w-full max-w-md aspect-[3/4] rounded-2xl' 
                                : 'w-64 h-64 rounded-full border-8 border-white/10'
                            }`}
                        />
                    </div>
                )}
            </div>
        );
    };

    const renderExperience = () => {
        const layout = customTheme.sections.experience.layout;
        
        return (
            <>
                <div className={`mb-16 ${layout === 'split' ? 'text-left' : 'text-center'}`}>
                    <Heading className="text-3xl font-bold">Experience</Heading>
                    {layout !== 'minimal' && <div className={`w-16 h-1 bg-[var(--accent-color)] mt-4 ${layout === 'split' ? '' : 'mx-auto'}`}></div>}
                </div>
                
                <div className={`grid gap-8 ${layout === 'cards' ? 'md:grid-cols-2' : 'grid-cols-1'}`}>
                    {experience.map(exp => (
                        <div key={exp.id} className={`
                            ${layout === 'cards' ? 'p-8 rounded-2xl border border-current/10 bg-white/5 hover:border-[var(--primary-color)] transition' : ''}
                            ${layout === 'minimal' ? 'border-b border-current/10 py-6 last:border-0' : ''}
                            ${layout === 'split' ? 'grid md:grid-cols-4 gap-4' : ''}
                            ${layout === 'standard' ? 'border-l-2 border-[var(--primary-color)] pl-6 py-2' : ''}
                        `}>
                            {layout === 'split' ? (
                                <>
                                    <div className="md:col-span-1 opacity-60 font-mono text-sm pt-1">{exp.startDate} - {exp.current ? 'Now' : exp.endDate}</div>
                                    <div className="md:col-span-3">
                                        <h3 className="text-xl font-bold">{exp.role}</h3>
                                        <div className="text-[var(--accent-color)] font-medium mb-2">{exp.company}</div>
                                        <p className="opacity-80 leading-relaxed">{exp.description}</p>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <div className="flex justify-between items-start mb-2">
                                        <div>
                                            <h3 className="text-xl font-bold">{exp.role}</h3>
                                            <div className="text-[var(--primary-color)] font-medium">{exp.company}</div>
                                        </div>
                                        <div className="text-sm opacity-60 font-mono text-right">{exp.startDate} <br/> {exp.current ? 'Present' : exp.endDate}</div>
                                    </div>
                                    {layout !== 'minimal' && <p className="opacity-80 leading-relaxed mt-2">{exp.description}</p>}
                                </>
                            )}
                        </div>
                    ))}
                </div>
            </>
        );
    };

    const renderProjects = () => {
        const layout = customTheme.sections.projects.layout;
        
        return (
            <>
                <div className="mb-16 text-center">
                    <Heading className="text-3xl font-bold">Selected Works</Heading>
                    {layout !== 'minimal' && <div className="w-16 h-1 bg-[var(--accent-color)] mx-auto mt-4"></div>}
                </div>
                
                <div className={`grid gap-8 ${
                    layout === 'grid' ? 'md:grid-cols-3' : 
                    layout === 'cards' ? 'md:grid-cols-2' : 
                    'grid-cols-1'
                }`}>
                    {projects.map(proj => (
                        <div key={proj.id} className={`
                            group flex flex-col
                            ${layout === 'cards' || layout === 'grid' ? 'rounded-xl overflow-hidden border border-current/10 bg-white/5 hover:-translate-y-1 transition duration-300 shadow-sm' : ''}
                            ${layout === 'standard' ? 'flex-row gap-8 items-center border-b border-current/10 pb-8 last:border-0' : ''}
                            ${layout === 'minimal' ? 'flex-row justify-between items-baseline border-b border-current/10 py-4 last:border-0 hover:text-[var(--primary-color)]' : ''}
                        `}>
                             {/* Thumbnail logic for grid/cards/standard */}
                             {(layout === 'cards' || layout === 'grid') && (
                                <div className="h-48 bg-current/5 flex items-center justify-center text-[var(--primary-color)] opacity-50 group-hover:opacity-100 transition">
                                    <Layout size={40} />
                                </div>
                             )}
                             {(layout === 'standard') && (
                                 <div className="hidden md:flex w-48 h-32 shrink-0 bg-current/5 rounded-lg items-center justify-center text-[var(--primary-color)]">
                                     <Layout size={32} />
                                 </div>
                             )}

                             {/* Content */}
                             <div className={`${layout === 'cards' || layout === 'grid' ? 'p-6 flex-1' : 'flex-1'}`}>
                                 <div className="flex justify-between items-start">
                                    <h3 className={`font-bold ${layout === 'minimal' ? 'text-xl' : 'text-xl mb-2'} group-hover:text-[var(--primary-color)] transition`}>{proj.title}</h3>
                                    {layout === 'minimal' && proj.link && <ArrowRight size={18} className="-rotate-45" />}
                                 </div>
                                 
                                 {layout !== 'minimal' && (
                                     <>
                                        <p className="opacity-70 mb-4 line-clamp-3">{proj.description}</p>
                                        <div className="flex flex-wrap gap-2 mb-4">
                                            {proj.technologies.slice(0, layout === 'grid' ? 2 : 4).map(t => (
                                                <span key={t} className="text-xs px-2 py-1 rounded bg-[var(--primary-color)] bg-opacity-10 text-[var(--primary-color)] font-medium">{t}</span>
                                            ))}
                                        </div>
                                        {proj.link && (
                                            <a href={proj.link} className="inline-flex items-center gap-2 text-sm font-bold text-[var(--primary-color)] hover:underline">
                                                View Project <ExternalLink size={14}/>
                                            </a>
                                        )}
                                     </>
                                 )}
                             </div>
                        </div>
                    ))}
                </div>
            </>
        );
    };

    return (
        <div style={style} className={`min-h-screen w-full selection:bg-[var(--accent-color)] selection:text-white relative ${isPreview ? 'overflow-y-auto h-full' : ''}`}>
            <WebsiteNav 
                name={profile.fullName} 
                isPreview={isPreview} 
                layout={customTheme.headerLayout} 
                customStyles={{ color: customTheme.sections.hero.textColor }} // Adapt nav text to hero
            />

            <Section id="hero" config={customTheme.sections.hero}>
                {renderHero()}
            </Section>

            <Section id="experience" config={customTheme.sections.experience}>
                {renderExperience()}
            </Section>

            <Section id="projects" config={customTheme.sections.projects}>
                {renderProjects()}
            </Section>

            {/* Reuse Experience logic for Education simplified */}
             <Section id="education" config={customTheme.sections.education}>
                <div className="mb-12 text-center">
                    <Heading className="text-3xl font-bold">Education</Heading>
                    <div className="w-16 h-1 bg-[var(--accent-color)] mx-auto mt-4"></div>
                </div>
                <div className={`max-w-3xl mx-auto grid gap-6 ${customTheme.sections.education.layout === 'cards' ? 'md:grid-cols-2' : ''}`}>
                    {education.map(edu => (
                        <div key={edu.id} className="flex items-center gap-6 p-6 rounded-xl border border-current/10 hover:border-[var(--primary-color)] transition bg-white/5">
                             <div className="w-12 h-12 rounded-full bg-[var(--primary-color)] bg-opacity-10 text-[var(--primary-color)] flex items-center justify-center shrink-0">
                                 <Award size={24} />
                             </div>
                             <div>
                                 <h3 className="text-xl font-bold">{edu.institution}</h3>
                                 <div className="text-[var(--accent-color)]">{edu.degree}</div>
                                 <div className="text-sm opacity-60 mt-1">{edu.year}</div>
                             </div>
                        </div>
                    ))}
                </div>
             </Section>

             {/* Contact */}
             <Section id="contact" config={customTheme.sections.contact}>
                 <div className={`${customTheme.sections.contact.layout === 'split' ? 'grid md:grid-cols-2 gap-12 items-center' : 'text-center max-w-2xl mx-auto'}`}>
                     <div>
                        <Heading className="text-4xl font-bold mb-6">Get In Touch</Heading>
                        <p className="text-xl opacity-80 mb-10">
                            I'm currently open to new opportunities. Let's build something great together.
                        </p>
                        {customTheme.sections.contact.layout !== 'split' && (
                             <a href={`mailto:${profile.email}`} className="inline-block px-10 py-4 bg-[var(--primary-color)] text-white rounded-full font-bold hover:scale-105 transition shadow-lg mb-12">
                                Say Hello
                            </a>
                        )}
                        <div className={`flex gap-8 opacity-70 ${customTheme.sections.contact.layout === 'split' ? '' : 'justify-center'}`}>
                            {profile.linkedin && <a href={profile.linkedin} className="hover:text-[var(--primary-color)] hover:scale-110 transition"><Linkedin size={24} /></a>}
                            {profile.github && <a href={profile.github} className="hover:text-[var(--primary-color)] hover:scale-110 transition"><Github size={24} /></a>}
                            {profile.email && <a href={`mailto:${profile.email}`} className="hover:text-[var(--primary-color)] hover:scale-110 transition"><Mail size={24} /></a>}
                        </div>
                     </div>
                     {customTheme.sections.contact.layout === 'split' && (
                         <div className="bg-white/5 p-8 rounded-2xl border border-current/10">
                              <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
                                  <input placeholder="Name" className="w-full bg-current/5 border-0 rounded p-3 placeholder-current/50 outline-none focus:ring-2 focus:ring-[var(--primary-color)]" />
                                  <input placeholder="Email" className="w-full bg-current/5 border-0 rounded p-3 placeholder-current/50 outline-none focus:ring-2 focus:ring-[var(--primary-color)]" />
                                  <textarea placeholder="Message" rows={4} className="w-full bg-current/5 border-0 rounded p-3 placeholder-current/50 outline-none focus:ring-2 focus:ring-[var(--primary-color)]" />
                                  <button className="w-full py-3 bg-[var(--primary-color)] text-white rounded font-bold hover:opacity-90">Send Message</button>
                              </form>
                         </div>
                     )}
                 </div>
             </Section>
        </div>
    );
};


// --- Pre-made Templates ---

export const CleanWebTemplate: React.FC<TemplateProps> = ({ data, isPreview }) => {
    const { profile, experience, education, projects } = data;
    return (
        <div className={`bg-white text-gray-900 font-sans min-h-screen selection:bg-teal-100 selection:text-teal-900 relative ${isPreview ? 'overflow-y-auto h-full' : ''}`}>
            <WebsiteNav name={profile.fullName} isPreview={isPreview} />
            
            <section id="hero" className="pt-32 pb-20 px-6 text-center">
                <div className="max-w-3xl mx-auto">
                    {profile.profilePicture && (
                        <div className="w-40 h-40 mx-auto mb-8 rounded-full overflow-hidden border-4 border-gray-50 shadow-xl">
                            <img src={profile.profilePicture} alt={profile.fullName} className="w-full h-full object-cover" />
                        </div>
                    )}
                    <h1 className="text-5xl md:text-6xl font-bold mb-4 tracking-tight text-gray-900">{profile.fullName}</h1>
                    <p className="text-xl md:text-2xl text-gray-500 mb-8 font-light">{profile.title}</p>
                    <p className="text-lg text-gray-600 leading-relaxed mb-10 max-w-2xl mx-auto">{profile.summary}</p>
                    <div className="flex justify-center gap-4">
                        {profile.linkedin && <a href={profile.linkedin} className="text-gray-400 hover:text-teal-600 transition"><Linkedin /></a>}
                        {profile.github && <a href={profile.github} className="text-gray-400 hover:text-teal-600 transition"><Github /></a>}
                        {profile.email && <a href={`mailto:${profile.email}`} className="text-gray-400 hover:text-teal-600 transition"><Mail /></a>}
                    </div>
                </div>
            </section>

            <section id="projects" className="py-20 px-6 bg-gray-50">
                <div className="max-w-5xl mx-auto">
                     <h2 className="text-sm font-bold uppercase tracking-widest text-gray-400 mb-12 text-center">Selected Works</h2>
                     <div className="grid gap-12">
                         {projects.map((proj, idx) => (
                             <div key={proj.id} className="bg-white rounded-3xl p-8 md:p-12 shadow-sm hover:shadow-xl transition duration-300 flex flex-col md:flex-row gap-8 items-start">
                                 <div className="flex-1 order-2 md:order-1">
                                     <h3 className="text-2xl font-bold mb-3">{proj.title}</h3>
                                     <p className="text-gray-600 leading-relaxed mb-6">{proj.description}</p>
                                     <div className="flex flex-wrap gap-2 mb-6">
                                         {proj.technologies.map(t => (
                                             <span key={t} className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-bold">{t}</span>
                                         ))}
                                     </div>
                                     {proj.link && (
                                         <a href={proj.link} className="inline-flex items-center gap-2 text-teal-600 font-bold hover:underline">
                                             View Project <ExternalLink size={16} />
                                         </a>
                                     )}
                                 </div>
                                 <div className="w-full md:w-1/3 order-1 md:order-2 bg-gray-100 rounded-2xl aspect-video flex items-center justify-center text-gray-300">
                                    <Layout size={48} />
                                 </div>
                             </div>
                         ))}
                     </div>
                </div>
            </section>
            
            <section id="experience" className="py-20 px-6">
                 <div className="max-w-3xl mx-auto">
                    <h2 className="text-sm font-bold uppercase tracking-widest text-gray-400 mb-12 text-center">Experience</h2>
                    <div className="space-y-12">
                        {experience.map(exp => (
                            <div key={exp.id} className="flex gap-6 md:gap-12">
                                <div className="w-24 md:w-32 shrink-0 text-sm text-gray-400 text-right pt-1">
                                    {exp.startDate} - {exp.current ? 'Now' : exp.endDate}
                                </div>
                                <div className="flex-1 pb-12 border-b border-gray-100 last:border-0">
                                    <h3 className="text-xl font-bold text-gray-900">{exp.role}</h3>
                                    <div className="text-teal-600 font-medium mb-4">{exp.company}</div>
                                    <p className="text-gray-600 leading-relaxed">{exp.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                 </div>
            </section>
        </div>
    );
};

export const BoldTemplate: React.FC<TemplateProps> = ({ data, isPreview }) => {
    const { profile, experience, education, projects } = data;
    return (
        <div className={`bg-black text-white min-h-screen font-sans selection:bg-white selection:text-black relative ${isPreview ? 'overflow-y-auto h-full' : ''}`}>
            <div className={`${isPreview ? 'absolute' : 'fixed'} top-0 left-0 w-full p-6 z-50 mix-blend-difference text-white flex justify-between items-center`}>
                 <span className="font-bold text-xl tracking-tighter">{profile.fullName.toUpperCase()}</span>
                 <a href={`mailto:${profile.email}`} className="border border-white px-4 py-2 rounded-full text-sm hover:bg-white hover:text-black transition">HIRE ME</a>
            </div>

            <div className="flex flex-col md:flex-row min-h-screen">
                <div className={`w-full md:w-1/2 pt-32 px-6 md:px-12 lg:px-20 pb-20 flex flex-col justify-center ${isPreview ? '' : 'md:sticky md:top-0 md:h-screen'}`}>
                    <h1 className="text-6xl md:text-8xl font-black leading-[0.9] mb-8 uppercase tracking-tighter">
                        {profile.title.split(' ').map((word, i) => (
                            <span key={i} className="block">{word}</span>
                        ))}
                    </h1>
                    <p className="text-xl text-gray-400 max-w-md leading-relaxed mb-8">
                        {profile.summary}
                    </p>
                    <div className="flex gap-4">
                        {profile.linkedin && <a href={profile.linkedin} className="text-white hover:text-gray-400"><Linkedin size={28} /></a>}
                        {profile.github && <a href={profile.github} className="text-white hover:text-gray-400"><Github size={28} /></a>}
                    </div>
                </div>
                
                <div className="w-full md:w-1/2 bg-zinc-900 min-h-screen px-6 md:px-12 lg:px-20 py-32">
                     {profile.profilePicture && (
                        <div className="mb-20 w-full aspect-square bg-zinc-800 rounded-lg overflow-hidden filter grayscale hover:grayscale-0 transition duration-500">
                             <img src={profile.profilePicture} alt="Profile" className="w-full h-full object-cover" />
                        </div>
                     )}

                     <div className="mb-20">
                        <h2 className="text-4xl font-bold mb-8 border-b border-zinc-700 pb-4">Work.</h2>
                        <div className="space-y-16">
                            {projects.map((proj, idx) => (
                                <div key={proj.id} className="group">
                                    <div className="flex items-baseline justify-between mb-2">
                                        <h3 className="text-2xl font-bold group-hover:text-zinc-400 transition">{proj.title}</h3>
                                        {proj.link && <a href={proj.link}><ExternalLink size={20} /></a>}
                                    </div>
                                    <p className="text-zinc-400 mb-4">{proj.description}</p>
                                    <div className="flex flex-wrap gap-2">
                                         {proj.technologies.map(t => (
                                             <span key={t} className="text-xs border border-zinc-700 px-2 py-1 rounded text-zinc-500">{t}</span>
                                         ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                     </div>

                     <div>
                        <h2 className="text-4xl font-bold mb-8 border-b border-zinc-700 pb-4">Experience.</h2>
                        <div className="space-y-12">
                            {experience.map(exp => (
                                <div key={exp.id}>
                                    <div className="flex justify-between items-baseline mb-2">
                                        <h3 className="text-xl font-bold">{exp.role}</h3>
                                        <span className="text-zinc-500 text-sm">{exp.startDate} - {exp.current ? 'Present' : exp.endDate}</span>
                                    </div>
                                    <div className="text-zinc-300 mb-2">{exp.company}</div>
                                    <p className="text-zinc-400 text-sm leading-relaxed">{exp.description}</p>
                                </div>
                            ))}
                        </div>
                     </div>
                </div>
            </div>
        </div>
    );
}

export const TechTemplate: React.FC<TemplateProps> = ({ data, isPreview }) => {
    const { profile, experience, education, projects, certifications, languages } = data;
    
    return (
        <div className={`bg-slate-950 min-h-screen font-mono text-slate-400 selection:bg-teal-300 selection:text-slate-900 relative ${isPreview ? 'overflow-y-auto h-full' : ''}`}>
            <WebsiteNav name="<Dev />" dark isPreview={isPreview} />
            
            {/* Hero */}
            <section id="hero" className="min-h-screen flex items-center justify-center px-6 pt-20">
                <div className="max-w-5xl w-full animate-slide-up">
                    <p className="text-teal-300 mb-5 text-sm md:text-base font-medium">Hi, my name is</p>
                    <h1 className="text-5xl md:text-7xl font-bold text-slate-100 mb-4 tracking-tight">{profile.fullName}.</h1>
                    <h2 className="text-4xl md:text-6xl font-bold text-slate-400 mb-8 tracking-tight">I build things for the web.</h2>
                    <p className="max-w-xl text-lg leading-relaxed mb-12">
                        {profile.title}. {profile.summary}
                    </p>
                    <div className="flex gap-4 items-center">
                        <a href="#projects" className="inline-block px-8 py-4 border border-teal-300 text-teal-300 hover:bg-teal-300/10 rounded font-medium transition-all">
                            Check out my work
                        </a>
                         {/* Socials added */}
                        <div className="flex gap-6 ml-4 text-slate-400">
                             {profile.github && <a href={profile.github} className="hover:text-teal-300 transition-colors"><Github size={24} /></a>}
                             {profile.linkedin && <a href={profile.linkedin} className="hover:text-teal-300 transition-colors"><Linkedin size={24} /></a>}
                        </div>
                    </div>
                </div>
            </section>

            {/* About */}
            <section id="about" className="py-24 px-6">
                <div className="max-w-4xl mx-auto">
                    <div className="flex items-center gap-4 mb-12">
                        <h2 className="text-2xl md:text-3xl font-bold text-slate-100 flex items-center gap-4">
                            <span className="text-teal-300 text-xl md:text-2xl">01.</span> About Me
                        </h2>
                        <div className="h-[1px] bg-slate-700 flex-1"></div>
                    </div>
                    
                    <div className="grid md:grid-cols-3 gap-12">
                        <div className="md:col-span-2 space-y-4 text-slate-400 text-lg">
                           <p>{profile.summary}</p>
                           <p>Here are a few technologies I've been working with recently:</p>
                           <ul className="grid grid-cols-2 gap-2 mt-4 font-mono text-sm">
                               {profile.skills.map(skill => (
                                   <li key={skill} className="flex items-center gap-2">
                                       <span className="text-teal-300">▹</span> {skill}
                                   </li>
                               ))}
                           </ul>
                        </div>
                        <div className="relative group mx-auto md:mx-0 w-64 h-64 md:w-full md:h-auto">
                             <div className="absolute inset-0 bg-teal-300 rounded transition-all group-hover:translate-x-1 group-hover:translate-y-1"></div>
                             <div className="relative bg-slate-900 rounded border border-teal-300/50 overflow-hidden h-full transition-all group-hover:-translate-x-1 group-hover:-translate-y-1 flex items-center justify-center">
                                {profile.profilePicture ? (
                                    <div className="relative w-full h-full grayscale hover:grayscale-0 transition duration-300">
                                        <div className="absolute inset-0 bg-teal-500/30 mix-blend-multiply hover:bg-transparent transition"></div>
                                        <img src={profile.profilePicture} alt="Me" className="w-full h-full object-cover" />
                                    </div>
                                ) : (
                                    <Terminal size={64} className="text-teal-300" />
                                )}
                             </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Experience */}
            <section id="experience" className="py-24 px-6 bg-slate-900/50">
                <div className="max-w-3xl mx-auto">
                    <div className="flex items-center gap-4 mb-12">
                        <h2 className="text-2xl md:text-3xl font-bold text-slate-100 flex items-center gap-4">
                            <span className="text-teal-300 text-xl md:text-2xl">02.</span> Where I've Worked
                        </h2>
                        <div className="h-[1px] bg-slate-700 flex-1"></div>
                    </div>

                    <div className="space-y-12 border-l-2 border-slate-800 ml-3 md:ml-0 pl-8 md:pl-12 relative">
                        {experience.map((exp, idx) => (
                            <div key={exp.id} className="relative group">
                                <span className="absolute -left-[41px] md:-left-[57px] top-0 w-5 h-5 rounded-full bg-slate-900 border-2 border-teal-300 group-hover:bg-teal-300 transition-colors"></span>
                                <h3 className="text-xl text-slate-100 font-bold mb-1">
                                    {exp.role} <span className="text-teal-300">@ {exp.company}</span>
                                </h3>
                                <p className="font-mono text-sm text-slate-500 mb-4">
                                    {exp.startDate} — {exp.current ? 'Present' : exp.endDate}
                                </p>
                                <p className="whitespace-pre-line leading-relaxed text-slate-400">
                                    {exp.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Projects */}
            <section id="projects" className="py-24 px-6">
                <div className="max-w-5xl mx-auto">
                    <div className="flex items-center gap-4 mb-12">
                        <h2 className="text-2xl md:text-3xl font-bold text-slate-100 flex items-center gap-4">
                            <span className="text-teal-300 text-xl md:text-2xl">03.</span> Some Things I've Built
                        </h2>
                        <div className="h-[1px] bg-slate-700 flex-1"></div>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {projects.map(proj => (
                            <div key={proj.id} className="bg-slate-800 rounded px-6 py-8 transition hover:-translate-y-2 hover:shadow-xl hover:shadow-black/30 group">
                                <div className="flex justify-between items-start mb-6">
                                    <div className="text-teal-300">
                                        <Code size={40} />
                                    </div>
                                    {proj.link && (
                                        <a href={proj.link} target="_blank" rel="noreferrer" className="text-slate-400 hover:text-teal-300">
                                            <ExternalLink size={20} />
                                        </a>
                                    )}
                                </div>
                                <h3 className="text-xl font-bold text-slate-100 mb-2 group-hover:text-teal-300 transition-colors">{proj.title}</h3>
                                <p className="text-slate-400 text-sm mb-6 line-clamp-3">{proj.description}</p>
                                <ul className="mt-auto flex flex-wrap gap-3 text-xs font-mono text-slate-500">
                                    {proj.technologies.map(tech => (
                                        <li key={tech}>{tech}</li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Contact */}
            <section id="contact" className="py-32 px-6 text-center">
                <div className="max-w-2xl mx-auto">
                    <p className="text-teal-300 font-mono mb-4">04. What's Next?</p>
                    <h2 className="text-4xl md:text-5xl font-bold text-slate-100 mb-6">Get In Touch</h2>
                    <p className="text-lg text-slate-400 mb-12">
                        I'm currently looking for new opportunities. Whether you have a question or just want to say hi, my inbox is always open.
                    </p>
                    <a href={`mailto:${profile.email}`} className="inline-block px-8 py-4 border border-teal-300 text-teal-300 hover:bg-teal-300/10 rounded font-medium transition-all">
                        Say Hello
                    </a>

                    <div className="mt-20 flex justify-center gap-6 text-slate-500">
                        {profile.github && <a href={profile.github} className="hover:text-teal-300 transition-colors"><Github /></a>}
                        {profile.linkedin && <a href={profile.linkedin} className="hover:text-teal-300 transition-colors"><Linkedin /></a>}
                    </div>
                </div>
            </section>
        </div>
    );
};

export const ModernTemplate: React.FC<TemplateProps> = ({ data, isPreview }) => {
  const { profile, experience, education, projects, certifications, languages } = data;
  
  return (
    <div className={`font-sans text-gray-600 bg-white relative ${isPreview ? 'overflow-y-auto h-full' : ''}`}>
      <WebsiteNav name={profile.fullName} isPreview={isPreview} />

      {/* Hero */}
      <section id="hero" className="min-h-screen flex items-center relative overflow-hidden bg-gradient-to-br from-indigo-50 to-white pt-20">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-indigo-100/50 skew-x-12 translate-x-20"></div>
        <div className="container mx-auto px-6 relative z-10">
            <div className="max-w-5xl flex flex-col md:flex-row items-center gap-12">
                <div className="flex-1">
                    <div className="inline-block px-3 py-1 rounded-full bg-indigo-100 text-indigo-700 text-sm font-semibold mb-6 animate-fade-in">
                        {profile.title}
                    </div>
                    <h1 className="text-5xl md:text-7xl font-extrabold text-gray-900 mb-6 leading-tight animate-slide-up">
                        Building digital <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">experiences</span> that matter.
                    </h1>
                    <p className="text-xl text-gray-500 mb-10 max-w-2xl leading-relaxed animate-slide-up" style={{ animationDelay: '100ms' }}>
                        {profile.summary}
                    </p>
                    <div className="flex flex-wrap gap-4 animate-slide-up items-center" style={{ animationDelay: '200ms' }}>
                        <a href="#projects" className="px-8 py-3.5 bg-gray-900 text-white rounded-lg font-medium hover:bg-gray-800 transition shadow-lg shadow-gray-900/20">View Work</a>
                        <a href="#contact" className="px-8 py-3.5 bg-white text-gray-900 border border-gray-200 rounded-lg font-medium hover:bg-gray-50 transition">Contact Me</a>
                        {/* Social Icons Added */}
                        <div className="flex gap-4 ml-4 px-4 border-l border-gray-200">
                            {profile.github && <a href={profile.github} className="text-gray-400 hover:text-gray-900 transition"><Github size={20} /></a>}
                            {profile.linkedin && <a href={profile.linkedin} className="text-gray-400 hover:text-indigo-600 transition"><Linkedin size={20} /></a>}
                        </div>
                    </div>
                </div>
                {profile.profilePicture && (
                    <div className="w-full max-w-sm aspect-square rounded-2xl overflow-hidden shadow-2xl rotate-3 hover:rotate-0 transition duration-500 border-8 border-white animate-blob">
                        <img src={profile.profilePicture} alt={profile.fullName} className="w-full h-full object-cover" />
                    </div>
                )}
            </div>
        </div>
      </section>

      {/* Experience */}
      <section id="experience" className="py-24 px-6 bg-white">
        <div className="container mx-auto max-w-5xl">
            <div className="text-center mb-16">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">Work Experience</h2>
                <div className="w-16 h-1 bg-indigo-600 mx-auto rounded-full"></div>
            </div>

            <div className="relative">
                <div className="absolute left-8 md:left-1/2 h-full w-0.5 bg-gray-100 -translate-x-1/2"></div>
                <div className="space-y-12">
                    {experience.map((exp, idx) => (
                        <div key={exp.id} className={`relative flex items-center md:justify-between ${idx % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'} flex-row-reverse justify-end pl-16 md:pl-0`}>
                            
                            <div className="absolute left-8 md:left-1/2 -translate-x-1/2 w-4 h-4 rounded-full border-4 border-white bg-indigo-600 shadow-sm z-10"></div>

                            <div className={`w-full md:w-[45%] ${idx % 2 === 0 ? 'md:text-right' : 'md:text-left'} text-left`}>
                                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-lg shadow-gray-100/50 hover:shadow-xl transition">
                                    <span className="text-indigo-600 font-bold text-sm tracking-wider uppercase mb-2 block">{exp.company}</span>
                                    <h3 className="text-xl font-bold text-gray-900 mb-1">{exp.role}</h3>
                                    <p className="text-sm text-gray-400 mb-4">{exp.startDate} - {exp.current ? 'Present' : exp.endDate}</p>
                                    <p className="text-gray-600 leading-relaxed text-sm">{exp.description}</p>
                                </div>
                            </div>
                            <div className="hidden md:block w-[45%]"></div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
      </section>

      {/* Projects */}
      <section id="projects" className="py-24 px-6 bg-gray-50">
        <div className="container mx-auto max-w-6xl">
             <div className="flex justify-between items-end mb-12">
                <div>
                    <h2 className="text-3xl font-bold text-gray-900 mb-2">Featured Projects</h2>
                    <p className="text-gray-500">A selection of my recent work</p>
                </div>
                <a href={profile.github} target="_blank" rel="noreferrer" className="hidden md:flex items-center gap-2 text-indigo-600 font-medium hover:text-indigo-700">
                    View GitHub <ChevronRight size={16} />
                </a>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {projects.map(proj => (
                    <div key={proj.id} className="bg-white rounded-xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 group">
                        <div className="h-48 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center group-hover:from-indigo-50 group-hover:to-purple-50 transition-colors">
                            <Cpu className="text-gray-300 group-hover:text-indigo-300 transition-colors" size={48} />
                        </div>
                        <div className="p-6">
                            <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-indigo-600 transition-colors">{proj.title}</h3>
                            <p className="text-gray-600 mb-4 text-sm line-clamp-3">{proj.description}</p>
                            <div className="flex flex-wrap gap-2 mb-6">
                                {proj.technologies.slice(0, 4).map(tech => (
                                    <span key={tech} className="bg-gray-50 text-gray-600 px-2 py-1 rounded text-xs font-medium border border-gray-100">{tech}</span>
                                ))}
                            </div>
                            {proj.link && (
                                <a href={proj.link} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-sm font-bold text-indigo-600 hover:underline">
                                    View Project <ExternalLink size={14} />
                                </a>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
      </section>

      {/* Education & Skills */}
      <section className="py-24 px-6 bg-white">
          <div className="container mx-auto max-w-5xl">
              <div className="grid md:grid-cols-2 gap-16">
                  <div>
                      <h3 className="text-2xl font-bold text-gray-900 mb-8">Education</h3>
                      <div className="space-y-8">
                          {education.map(edu => (
                              <div key={edu.id} className="flex gap-4">
                                  <div className="w-10 h-10 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center flex-shrink-0">
                                      <Award size={20} />
                                  </div>
                                  <div>
                                      <h4 className="font-bold text-gray-900">{edu.institution}</h4>
                                      <p className="text-indigo-600">{edu.degree}</p>
                                      <p className="text-sm text-gray-400 mt-1">{edu.year}</p>
                                  </div>
                              </div>
                          ))}
                      </div>
                  </div>
                   <div>
                      <h3 className="text-2xl font-bold text-gray-900 mb-8">Skills</h3>
                      <div className="flex flex-wrap gap-2">
                          {profile.skills.map(skill => (
                              <span key={skill} className="px-4 py-2 bg-gray-50 text-gray-700 rounded-lg font-medium hover:bg-indigo-50 hover:text-indigo-700 transition cursor-default">
                                  {skill}
                              </span>
                          ))}
                      </div>
                  </div>
              </div>
          </div>
      </section>

      {/* Footer */}
      <footer id="contact" className="bg-gray-900 text-white py-20 px-6">
          <div className="container mx-auto max-w-4xl text-center">
              <h2 className="text-3xl font-bold mb-6">Let's work together</h2>
              <p className="text-gray-400 mb-8 max-w-xl mx-auto">
                  I'm currently available for freelance projects and open to full-time opportunities.
              </p>
              <a href={`mailto:${profile.email}`} className="inline-block px-8 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-full font-bold transition mb-12">
                  Get In Touch
              </a>
              
              <div className="flex justify-center gap-8 mb-12">
                  {profile.linkedin && <a href={profile.linkedin} className="text-gray-400 hover:text-white transition"><Linkedin /></a>}
                  {profile.github && <a href={profile.github} className="text-gray-400 hover:text-white transition"><Github /></a>}
                  {profile.email && <a href={`mailto:${profile.email}`} className="text-gray-400 hover:text-white transition"><Mail /></a>}
              </div>
              
              <div className="pt-8 border-t border-gray-800 text-gray-500 text-sm">
                  &copy; {new Date().getFullYear()} {profile.fullName}. All rights reserved.
              </div>
          </div>
      </footer>
    </div>
  );
};

// --- Document Style Templates (Resume) ---

export const ATSTemplate: React.FC<TemplateProps> = ({ data }) => {
     const { profile, experience, education, projects, certifications, languages } = data;
    return (
      <div className="max-w-[21cm] mx-auto bg-white min-h-[29.7cm] p-[2.54cm] font-serif text-black shadow-2xl">
        <header className="border-b-2 border-black pb-4 mb-6">
            <h1 className="text-3xl font-bold uppercase text-center tracking-widest mb-2">{profile.fullName}</h1>
            <div className="text-center text-sm flex flex-wrap justify-center gap-3">
                {profile.location && <span>{profile.location}</span>}
                {profile.phone && <span>| {profile.phone}</span>}
                {profile.email && <span>| {profile.email}</span>}
                {profile.linkedin && <span>| <a href={profile.linkedin} className="underline">LinkedIn</a></span>}
            </div>
        </header>

        <section className="mb-6">
            <h2 className="text-sm font-bold uppercase border-b border-gray-300 mb-3">Professional Summary</h2>
            <p className="text-sm leading-relaxed">{profile.summary}</p>
        </section>

        <section className="mb-6">
            <h2 className="text-sm font-bold uppercase border-b border-gray-300 mb-3">Skills</h2>
            <p className="text-sm">{profile.skills.join(', ')}</p>
        </section>

        <section className="mb-6">
            <h2 className="text-sm font-bold uppercase border-b border-gray-300 mb-3">Experience</h2>
            {experience.map(exp => (
                <div key={exp.id} className="mb-4">
                    <div className="flex justify-between items-baseline font-bold text-sm">
                        <span>{exp.role}, {exp.company}</span>
                        <span>{exp.startDate} – {exp.current ? 'Present' : exp.endDate}</span>
                    </div>
                    <p className="text-sm whitespace-pre-line mt-1">{exp.description}</p>
                </div>
            ))}
        </section>

        <section className="mb-6">
            <h2 className="text-sm font-bold uppercase border-b border-gray-300 mb-3">Education</h2>
            {education.map(edu => (
                <div key={edu.id} className="mb-2 flex justify-between text-sm">
                    <span><span className="font-bold">{edu.institution}</span>, {edu.degree}</span>
                    <span>{edu.year}</span>
                </div>
            ))}
        </section>
        
        {projects.length > 0 && (
            <section>
                 <h2 className="text-sm font-bold uppercase border-b border-gray-300 mb-3">Projects</h2>
                 {projects.map(proj => (
                     <div key={proj.id} className="mb-3">
                         <div className="flex justify-between font-bold text-sm">
                             <span>{proj.title}</span>
                         </div>
                         <p className="text-sm">{proj.description}</p>
                         <p className="text-xs italic mt-0.5">Tech: {proj.technologies.join(', ')}</p>
                     </div>
                 ))}
            </section>
        )}
      </div>
    );
};

export const MinimalTemplate: React.FC<TemplateProps> = ({ data }) => {
     const { profile, experience, education, projects } = data;
     return (
         <div className="max-w-3xl mx-auto bg-white min-h-screen p-16 font-sans text-gray-800">
             <header className="mb-16">
                 <h1 className="text-5xl font-light text-gray-900 mb-4">{profile.fullName}</h1>
                 <p className="text-xl text-gray-500 mb-6">{profile.title}</p>
                 <div className="text-sm text-gray-400 space-y-1">
                     {profile.email && <div>{profile.email}</div>}
                     {profile.phone && <div>{profile.phone}</div>}
                     {profile.location && <div>{profile.location}</div>}
                     <div className="flex gap-4 mt-4">
                        {profile.linkedin && <a href={profile.linkedin} className="text-gray-600 hover:text-black">LinkedIn</a>}
                        {profile.github && <a href={profile.github} className="text-gray-600 hover:text-black">GitHub</a>}
                     </div>
                 </div>
             </header>
             
             <div className="space-y-16">
                 <section>
                     <h2 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-6">About</h2>
                     <p className="text-lg leading-relaxed text-gray-700">{profile.summary}</p>
                 </section>

                 <section>
                     <h2 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-8">Experience</h2>
                     <div className="space-y-10">
                        {experience.map(exp => (
                            <div key={exp.id} className="grid md:grid-cols-4 gap-4">
                                <div className="text-sm text-gray-400 md:col-span-1">
                                    {exp.startDate} — {exp.current ? 'Present' : exp.endDate}
                                </div>
                                <div className="md:col-span-3">
                                    <h3 className="font-medium text-gray-900">{exp.role}</h3>
                                    <div className="text-gray-500 text-sm mb-2">{exp.company}</div>
                                    <p className="text-gray-600 leading-relaxed">{exp.description}</p>
                                </div>
                            </div>
                        ))}
                     </div>
                 </section>

                 <section>
                     <h2 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-8">Projects</h2>
                     <div className="grid gap-8">
                        {projects.map(proj => (
                            <div key={proj.id}>
                                <h3 className="font-medium text-gray-900">{proj.title}</h3>
                                <p className="text-gray-600 mt-1 mb-2">{proj.description}</p>
                                <div className="text-xs text-gray-400 font-mono">{proj.technologies.join(' / ')}</div>
                            </div>
                        ))}
                     </div>
                 </section>
             </div>
         </div>
     );
};

export const CreativeTemplate: React.FC<TemplateProps> = ({ data, isPreview }) => {
    const { profile, experience, education, projects, certifications, languages } = data;
    return (
      <div className={`font-sans text-stone-800 bg-stone-50 selection:bg-rose-200 relative ${isPreview ? 'overflow-y-auto h-full' : ''}`}>
        <WebsiteNav name={profile.fullName.split(' ')[0]} isPreview={isPreview} />

        <div className="min-h-screen flex flex-col justify-center px-6 pt-20 pb-20">
             <div className="max-w-6xl mx-auto w-full grid md:grid-cols-2 gap-12 items-center">
                <div className="order-2 md:order-1">
                    <h1 className="text-6xl md:text-8xl font-black mb-6 leading-[0.9] text-stone-900">
                        {profile.title}
                    </h1>
                    <p className="text-xl md:text-2xl text-stone-600 mb-8 font-medium max-w-lg">
                        {profile.summary}
                    </p>
                    <div className="flex flex-wrap gap-3 mb-8">
                        {profile.skills.map(skill => (
                            <span key={skill} className="px-4 py-2 border-2 border-stone-900 rounded-full font-bold text-sm hover:bg-stone-900 hover:text-white transition cursor-default">
                                {skill}
                            </span>
                        ))}
                    </div>
                     {/* Socials Added */}
                    <div className="flex gap-6">
                         {profile.github && <a href={profile.github} className="text-stone-400 hover:text-stone-900 transition-colors"><Github size={28} /></a>}
                         {profile.linkedin && <a href={profile.linkedin} className="text-stone-400 hover:text-rose-500 transition-colors"><Linkedin size={28} /></a>}
                    </div>
                </div>
                <div className="order-1 md:order-2 flex justify-center relative">
                    <div className="w-64 h-64 md:w-96 md:h-96 bg-rose-400 rounded-full blur-3xl opacity-20 absolute animate-blob top-0"></div>
                    <div className="w-64 h-64 md:w-96 md:h-96 bg-indigo-400 rounded-full blur-3xl opacity-20 absolute animate-blob animation-delay-2000 right-0 bottom-0"></div>
                    
                    <div className="relative w-full aspect-square border-4 border-stone-900 rounded-3xl flex items-center justify-center bg-white shadow-[16px_16px_0px_0px_rgba(28,25,23,1)] overflow-hidden">
                         {profile.profilePicture ? (
                             <img src={profile.profilePicture} alt="Profile" className="w-full h-full object-cover" />
                         ) : (
                            <span className="text-8xl">👋</span>
                         )}
                    </div>
                </div>
             </div>
        </div>

        <section id="projects" className="py-24 px-6 bg-stone-900 text-stone-100">
            <div className="max-w-6xl mx-auto">
                <h2 className="text-5xl font-black mb-16 text-center">Selected Works</h2>
                <div className="grid md:grid-cols-2 gap-8">
                    {projects.map((proj, idx) => (
                        <div key={proj.id} className={`bg-stone-800 p-8 rounded-3xl hover:bg-stone-700 transition duration-500 group ${idx % 3 === 0 ? 'md:col-span-2' : ''}`}>
                            <div className="flex justify-between items-start mb-8">
                                <div className="flex gap-2">
                                    {proj.technologies.map(t => (
                                        <span key={t} className="px-3 py-1 rounded-full bg-stone-900 text-xs font-bold uppercase tracking-wider text-stone-400">{t}</span>
                                    ))}
                                </div>
                                {proj.link && <a href={proj.link} className="w-10 h-10 rounded-full bg-white text-black flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"><ExternalLink size={20}/></a>}
                            </div>
                            <h3 className="text-3xl font-bold mb-4">{proj.title}</h3>
                            <p className="text-stone-400 text-lg leading-relaxed">{proj.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>

        <section id="experience" className="py-24 px-6">
            <div className="max-w-4xl mx-auto">
                <h2 className="text-4xl font-black mb-12 border-b-4 border-stone-900 pb-4 inline-block">Experience</h2>
                <div className="space-y-8">
                    {experience.map(exp => (
                        <div key={exp.id} className="flex flex-col md:flex-row gap-6 items-start">
                            <div className="md:w-32 flex-shrink-0 pt-2">
                                <span className="font-bold text-sm text-stone-500">{exp.startDate} - {exp.current ? 'Now' : exp.endDate}</span>
                            </div>
                            <div className="flex-1 pb-8 border-b border-stone-200 last:border-0">
                                <h3 className="text-2xl font-bold">{exp.role}</h3>
                                <div className="text-xl font-medium text-rose-500 mb-4">{exp.company}</div>
                                <p className="text-stone-600 leading-relaxed whitespace-pre-line">{exp.description}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>

        <footer id="contact" className="py-24 px-6 bg-rose-500 text-white text-center">
            <h2 className="text-4xl md:text-6xl font-black mb-8">Let's make something cool.</h2>
            <a href={`mailto:${profile.email}`} className="inline-block bg-white text-rose-600 px-10 py-4 rounded-full text-xl font-bold hover:scale-105 transition shadow-xl">
                Contact Me
            </a>
        </footer>
      </div>
    );
};


export const ClassicTemplate: React.FC<TemplateProps> = ({ data }) => {
    // Wrapper for print friendliness but allows basic web viewing
     const { profile, experience, education, projects, certifications, languages } = data;
    return (
      <div className="bg-white min-h-screen font-serif text-gray-900 p-8 md:p-16">
        <div className="max-w-4xl mx-auto">
            <header className="text-center border-b-2 border-gray-800 pb-8 mb-12">
            <h1 className="text-4xl font-bold uppercase tracking-widest mb-4">{profile.fullName}</h1>
            <p className="text-xl italic text-gray-600 mb-4">{profile.title}</p>
            <div className="flex flex-wrap justify-center gap-4 text-sm font-sans text-gray-500 items-center">
                {profile.email && <span>{profile.email}</span>}
                {profile.phone && <span>| {profile.phone}</span>}
                {profile.location && <span>| {profile.location}</span>}
                {profile.linkedin && <span>| <a href={profile.linkedin} className="text-blue-800 flex items-center gap-1 inline-flex"><Linkedin size={14} /> LinkedIn</a></span>}
                {profile.github && <span>| <a href={profile.github} className="text-gray-800 flex items-center gap-1 inline-flex"><Github size={14} /> GitHub</a></span>}
            </div>
            </header>
    
            <div className="grid grid-cols-1 gap-12">
                {profile.summary && (
                    <section>
                        <h2 className="text-lg font-bold uppercase border-b border-gray-300 mb-4 font-sans text-gray-700">Professional Summary</h2>
                        <p className="leading-relaxed text-gray-800">{profile.summary}</p>
                    </section>
                )}

                <section>
                    <h2 className="text-lg font-bold uppercase border-b border-gray-300 mb-6 font-sans text-gray-700">Work History</h2>
                    {experience.map(exp => (
                        <div key={exp.id} className="mb-6">
                            <div className="flex justify-between items-baseline mb-1">
                                <h3 className="text-xl font-bold">{exp.role}</h3>
                                <span className="text-sm font-sans text-gray-500">{exp.startDate} – {exp.current ? 'Present' : exp.endDate}</span>
                            </div>
                            <div className="text-lg italic text-gray-700 mb-2">{exp.company}</div>
                            <p className="text-sm leading-relaxed whitespace-pre-line font-sans">{exp.description}</p>
                        </div>
                    ))}
                </section>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <section>
                        <h2 className="text-lg font-bold uppercase border-b border-gray-300 mb-4 font-sans text-gray-700">Education</h2>
                        {education.map(edu => (
                            <div key={edu.id} className="mb-4">
                                <div className="font-bold">{edu.institution}</div>
                                <div>{edu.degree}</div>
                                <div className="text-sm text-gray-500 font-sans">{edu.year}</div>
                            </div>
                        ))}
                    </section>
                    <section>
                        <h2 className="text-lg font-bold uppercase border-b border-gray-300 mb-4 font-sans text-gray-700">Skills & Languages</h2>
                        <div className="mb-4">
                            <h3 className="font-bold text-sm text-gray-600 mb-1">Skills</h3>
                            <p className="font-sans leading-7">
                                {profile.skills.join(' • ')}
                            </p>
                        </div>
                        {languages && languages.length > 0 && (
                            <div>
                                <h3 className="font-bold text-sm text-gray-600 mb-1">Languages</h3>
                                <p className="font-sans text-sm">
                                    {languages.map(l => `${l.language} (${l.proficiency})`).join(', ')}
                                </p>
                            </div>
                        )}
                    </section>
                </div>

                {certifications && certifications.length > 0 && (
                    <section>
                        <h2 className="text-lg font-bold uppercase border-b border-gray-300 mb-4 font-sans text-gray-700">Certifications</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {certifications.map(cert => (
                                <div key={cert.id}>
                                    <h3 className="font-bold">{cert.name}</h3>
                                    <p className="text-sm italic text-gray-600">{cert.issuer}, {cert.date}</p>
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                <section>
                    <h2 className="text-lg font-bold uppercase border-b border-gray-300 mb-4 font-sans text-gray-700">Key Projects</h2>
                    {projects.map(proj => (
                        <div key={proj.id} className="mb-4">
                            <h3 className="font-bold">{proj.title}</h3>
                            <p className="text-sm font-sans mb-1">{proj.description}</p>
                            <p className="text-xs text-gray-500 font-sans">Tech: {proj.technologies.join(', ')}</p>
                        </div>
                    ))}
                </section>
            </div>
        </div>
      </div>
    );
};