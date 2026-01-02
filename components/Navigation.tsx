
import React from 'react';
import { Screen } from '../types';

interface NavigationProps {
  currentScreen: Screen;
  onNavigate: (screen: Screen) => void;
}

const Navigation: React.FC<NavigationProps> = ({ currentScreen, onNavigate }) => {
  const navItems = [
    { id: Screen.DASHBOARD, label: 'Dashboard', icon: 'dashboard' },
    { id: Screen.QUEUE, label: 'Queue', icon: 'layers' },
    { id: Screen.COSTS, label: 'Costs', icon: 'payments' },
    { id: Screen.SETTINGS, label: 'Settings', icon: 'settings' },
  ];

  // Don't show navigation on specific detail screens if needed, 
  // but for a mobile app, it's often persistent.
  // In the design provided, Upload and Job Details might have custom footers.
  const hiddenOn = [Screen.UPLOAD, Screen.JOB_DETAILS, Screen.SETTINGS];
  if (hiddenOn.includes(currentScreen)) return null;

  return (
    <nav className="fixed bottom-0 w-full max-w-md mx-auto bg-background-dark/95 border-t border-white/10 backdrop-blur-xl z-50">
      <div className="flex items-center justify-around h-16">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onNavigate(item.id)}
            className={`flex flex-col items-center gap-1 transition-colors ${
              currentScreen === item.id ? 'text-primary' : 'text-slate-400'
            }`}
          >
            <span className={`material-symbols-outlined ${currentScreen === item.id ? 'filled' : ''}`}>
              {item.icon}
            </span>
            <span className="text-[10px] font-medium">{item.label}</span>
          </button>
        ))}
      </div>
      {/* iOS Safe area */}
      <div className="h-6 bg-background-dark"></div>
    </nav>
  );
};

export default Navigation;
