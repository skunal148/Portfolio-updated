import React from 'react';
import { Portfolio } from '../types';
import { Plus, Edit3, Trash2, Eye, FileText, LogOut, User } from 'lucide-react';

interface DashboardProps {
  portfolios: Portfolio[];
  onCreate: () => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onView: (id: string) => void;
  onLogout: () => void;
  userEmail: string | null;
  userName?: string;
}

const Dashboard: React.FC<DashboardProps> = ({ portfolios, onCreate, onEdit, onDelete, onView, onLogout, userEmail, userName }) => {
  return (
    <div className="relative min-h-screen bg-gray-50 text-gray-900 overflow-hidden">
      
      {/* Header */}
      <div className="relative z-20 border-b border-gray-200 bg-white shadow-sm">
          <div className="container mx-auto px-4 h-16 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <h2 className="font-extrabold text-xl bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent tracking-tight">
                  FolioStack
                </h2>
              </div>
              <div className="flex items-center gap-6">
                  <div className="flex items-center gap-2 text-sm font-medium text-gray-600 bg-gray-50 px-3 py-1.5 rounded-full border border-gray-200">
                      <User size={14} />
                      {userName || userEmail}
                  </div>
                  <button 
                    onClick={onLogout}
                    className="flex items-center gap-2 text-sm font-bold text-gray-600 hover:text-gray-900 transition"
                  >
                      <LogOut size={16} /> Logout
                  </button>
              </div>
          </div>
      </div>
      
      <div className="container mx-auto px-4 py-12 relative z-10">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-16">
          <div>
              <h1 className="text-4xl md:text-5xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600 tracking-tight">My Portfolios</h1>
              <p className="text-gray-600 mt-3 text-lg font-medium tracking-wide">Manage and organize your professional profiles.</p>
          </div>
          <button
            onClick={onCreate}
            className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white px-8 py-3.5 rounded-full flex items-center gap-2 transition-all shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/50 hover:scale-105 active:scale-95 font-bold tracking-wide w-fit"
          >
            <Plus size={20} strokeWidth={2.5} />
            Create New
          </button>
        </div>

        {portfolios.length === 0 ? (
          <div className="text-center py-32 bg-white rounded-3xl border border-gray-200 shadow-xl animate-fade-in max-w-2xl mx-auto">
            <div className="mx-auto w-24 h-24 bg-gradient-to-tr from-indigo-100 to-purple-100 text-indigo-600 rounded-full flex items-center justify-center mb-8 animate-pulse border border-indigo-200">
              <Plus size={48} />
            </div>
            <h3 className="text-3xl font-bold text-gray-900 mb-4">No portfolios yet</h3>
            <p className="text-gray-600 mb-10 text-lg">Start building your career presence today with AI-powered tools.</p>
            <button onClick={onCreate} className="text-indigo-600 font-bold hover:text-indigo-700 transition underline underline-offset-8 decoration-2 decoration-indigo-300 hover:decoration-indigo-500">Create your first portfolio</button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {portfolios.map((portfolio, idx) => (
              <div 
                key={portfolio.id} 
                className="group relative bg-white rounded-2xl border border-gray-200 hover:border-indigo-300 shadow-lg hover:shadow-xl hover:shadow-indigo-100 hover:-translate-y-1 transition-all duration-300 p-6 flex flex-col animate-fade-in"
                style={{ animationDelay: `${idx * 100}ms` }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-50/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl pointer-events-none"></div>
                
                <div className="flex justify-between items-start mb-8 relative z-10">
                  <div className="p-3.5 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-xl text-indigo-600 mb-2 border border-indigo-200 shadow-sm">
                     <FileText size={28} />
                  </div>
                  <span className={`px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider shadow-sm border ${
                      portfolio.templateId === 'modern' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                      portfolio.templateId === 'classic' ? 'bg-orange-50 text-orange-700 border-orange-200' :
                      portfolio.templateId === 'ats' ? 'bg-gray-50 text-gray-700 border-gray-200' :
                      portfolio.templateId === 'minimal' ? 'bg-stone-50 text-stone-700 border-stone-200' :
                      portfolio.templateId === 'tech' ? 'bg-cyan-50 text-cyan-700 border-cyan-200' :
                      portfolio.templateId === 'custom' ? 'bg-purple-50 text-purple-700 border-purple-200' :
                      'bg-emerald-50 text-emerald-700 border-emerald-200'
                  }`}>
                      {portfolio.templateId}
                  </span>
                </div>
                
                <div className="mb-8 relative z-10">
                    <h3 className="text-2xl font-bold text-gray-900 truncate mb-2 group-hover:text-indigo-600 transition-colors">{portfolio.name}</h3>
                    <p className="text-sm text-gray-500 font-medium">Last edited: {new Date(portfolio.lastModified).toLocaleDateString()}</p>
                </div>
                
                <div className="mt-auto pt-5 border-t border-gray-200 flex justify-between items-center gap-3 relative z-10">
                    <button 
                        onClick={() => onView(portfolio.id)} 
                        className="flex-1 py-2.5 px-4 bg-gray-50 hover:bg-gray-100 rounded-lg text-sm font-bold text-gray-700 transition flex items-center justify-center gap-2 hover:shadow-md border border-gray-200 hover:border-gray-300 group/btn"
                    >
                        <Eye size={16} className="text-indigo-600 group-hover/btn:text-indigo-700 transition-colors" /> View
                    </button>
                  <div className="flex gap-2">
                    <button 
                        onClick={() => onEdit(portfolio.id)} 
                        className="p-2.5 text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 rounded-lg transition border border-gray-200 hover:border-indigo-300 shadow-sm"
                        title="Edit"
                    >
                        <Edit3 size={18} />
                    </button>
                    <button 
                        onClick={() => onDelete(portfolio.id)} 
                        className="p-2.5 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition border border-gray-200 hover:border-red-300 shadow-sm"
                        title="Delete"
                    >
                        <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;