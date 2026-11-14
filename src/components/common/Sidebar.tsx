import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { 
  CheckCircle2, 
  Calendar as CalendarIcon, 
  BarChart3, 
  Settings as SettingsIcon,
  ShieldCheck,
  CheckSquare,
  Database,
  ListTodo
} from 'lucide-react';

export const Sidebar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { sqliteToken } = useApp();

  const navItems = [
    { id: 'today', path: '/today', label: 'Today', icon: CheckCircle2 },
    { id: 'tasks', path: '/tasks', label: 'Manage Tasks', icon: ListTodo },
    { id: 'calendar', path: '/calendar', label: 'Calendar', icon: CalendarIcon },
    { id: 'analytics', path: '/analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'settings', path: '/settings', label: 'Settings', icon: SettingsIcon },
  ];

  const currentPath = location.pathname;

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-64 lg:w-72 bg-[#0c101c] border-r border-slate-800/80 shrink-0 h-screen sticky top-0 justify-between p-4 z-20">
        <div className="flex flex-col gap-6">
          {/* Brand header */}
          <div 
            onClick={() => navigate('/today')}
            className="flex items-center gap-3 px-2 pt-2 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-blue-500 flex items-center justify-center text-white shadow-md shadow-indigo-500/20 group-hover:scale-105 transition-transform">
              <CheckSquare className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div>
              <h2 className="font-display font-bold text-base text-slate-100 leading-tight">
                Daily Progress
              </h2>
              <p className="text-xs text-slate-400 font-medium">Study & Habit Tracker</p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="flex flex-col gap-1.5 mt-2">
            {navItems.map(item => {
              const Icon = item.icon;
              const isActive = currentPath === item.path || (item.id === 'today' && currentPath === '/');
              return (
                <button
                  key={item.id}
                  onClick={() => navigate(item.path)}
                  className={`flex items-center gap-3.5 px-3.5 py-3 rounded-xl font-medium text-sm transition-all text-left cursor-pointer ${
                    isActive
                      ? 'bg-gradient-to-r from-indigo-600 to-blue-600 text-white font-semibold shadow-md shadow-indigo-600/25 ring-1 ring-white/10'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                  }`}
                >
                  <Icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom SQLite3 / PWA badge */}
        <div className="bg-[#13192b]/90 border border-slate-800/80 rounded-2xl p-3.5 text-xs text-slate-400 flex flex-col gap-2 shadow-sm">
          <div className="flex items-start gap-2.5">
            <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
            <div className="leading-snug">
              <span className="font-semibold text-slate-200 block mb-0.5">SQLite3 Local Cache</span>
              <span className="text-[11px] text-slate-400">Database stored in browser cache tokens. No login required.</span>
            </div>
          </div>
          <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px] text-slate-500">
            <span className="flex items-center gap-1">
              <Database className="w-3 h-3 text-emerald-400" />
              <span>Token Active</span>
            </span>
            <span className="truncate max-w-[120px] font-mono" title={sqliteToken}>
              {sqliteToken.slice(0, 16)}...
            </span>
          </div>
        </div>
      </aside>

      {/* Mobile Bottom Navigation Bar */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#0c101c]/95 backdrop-blur-xl border-t border-slate-800/80 px-2 py-2.5 flex items-center justify-around shadow-2xl">
        {navItems.map(item => {
          const Icon = item.icon;
          const isActive = currentPath === item.path || (item.id === 'today' && currentPath === '/');
          return (
            <button
              key={item.id}
              onClick={() => navigate(item.path)}
              className={`flex flex-col items-center gap-1 py-1 px-3.5 rounded-xl text-xs font-semibold transition-all ${
                isActive ? 'text-indigo-400 font-bold scale-105' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <div className={`p-1 rounded-lg ${isActive ? 'bg-indigo-500/10' : ''}`}>
                <Icon className={`w-5 h-5 ${isActive ? 'text-indigo-400' : 'text-slate-400'}`} />
              </div>
              <span className="text-[11px]">{item.label}</span>
            </button>
          );
        })}
      </nav>
    </>
  );
};
