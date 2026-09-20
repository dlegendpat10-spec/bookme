import React, { createContext, useContext, useState, useEffect } from 'react';
import { ThemeMode } from '../types';

interface ThemeContextType {
  theme: ThemeMode;
  setTheme: (t: ThemeMode) => void;
  themes: { id: ThemeMode; label: string; preview: string }[];
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const THEMES: { id: ThemeMode; label: string; preview: string }[] = [
  { id: 'porcelain', label: 'Porcelain Iris (Default)', preview: '#6366F1' },
  { id: 'emerald', label: 'Emerald Mint Light', preview: '#10B981' },
  { id: 'violet', label: 'Cosmic Violet Light', preview: '#8B5CF6' },
  { id: 'sunset', label: 'Sunset Amber Light', preview: '#F97316' },
  { id: 'oceanic', label: 'Oceanic Cyan Light', preview: '#0284C7' },
  { id: 'midnight', label: 'Midnight Obsidian (Dark)', preview: '#10B981' },
];

const THEME_VARS: Record<ThemeMode, Record<string, string>> = {
  porcelain: {
    '--bg-app': '#F8FAFC',
    '--bg-card': '#FFFFFF',
    '--bg-card-hover': '#F1F5F9',
    '--bg-elevated': '#FFFFFF',
    '--border-subtle': '#E2E8F0',
    '--border-strong': '#CBD5E1',
    '--text-main': '#0F172A',
    '--text-muted': '#475569',
    '--text-faint': '#64748B',
    '--brand-primary': '#6366F1',
    '--brand-primary-hover': '#4F46E5',
    '--brand-light': 'rgba(99,102,241,0.08)',
    '--shadow-glow': '0 10px 30px -4px rgba(99,102,241,0.28)',
    '--navbar-bg': 'rgba(255,255,255,0.88)',
  },
  emerald: {
    '--bg-app': '#F4FBF7',
    '--bg-card': '#FFFFFF',
    '--bg-card-hover': '#E6F7F0',
    '--bg-elevated': '#FFFFFF',
    '--border-subtle': '#D1FAE5',
    '--border-strong': '#6EE7B7',
    '--text-main': '#064E3B',
    '--text-muted': '#047857',
    '--text-faint': '#059669',
    '--brand-primary': '#10B981',
    '--brand-primary-hover': '#059669',
    '--brand-light': 'rgba(16,185,129,0.1)',
    '--shadow-glow': '0 10px 30px -4px rgba(16,185,129,0.28)',
    '--navbar-bg': 'rgba(255,255,255,0.88)',
  },
  violet: {
    '--bg-app': '#FAF5FF',
    '--bg-card': '#FFFFFF',
    '--bg-card-hover': '#F3E8FF',
    '--bg-elevated': '#FFFFFF',
    '--border-subtle': '#E9D5FF',
    '--border-strong': '#C084FC',
    '--text-main': '#3B0764',
    '--text-muted': '#6B21A8',
    '--text-faint': '#7E22CE',
    '--brand-primary': '#8B5CF6',
    '--brand-primary-hover': '#7C3AED',
    '--brand-light': 'rgba(139,92,246,0.1)',
    '--shadow-glow': '0 10px 30px -4px rgba(139,92,246,0.28)',
    '--navbar-bg': 'rgba(255,255,255,0.88)',
  },
  sunset: {
    '--bg-app': '#FFF7ED',
    '--bg-card': '#FFFFFF',
    '--bg-card-hover': '#FFEDD5',
    '--bg-elevated': '#FFFFFF',
    '--border-subtle': '#FED7AA',
    '--border-strong': '#FB923C',
    '--text-main': '#431407',
    '--text-muted': '#9A3412',
    '--text-faint': '#C2410C',
    '--brand-primary': '#F97316',
    '--brand-primary-hover': '#EA580C',
    '--brand-light': 'rgba(249,115,22,0.1)',
    '--shadow-glow': '0 10px 30px -4px rgba(249,115,22,0.28)',
    '--navbar-bg': 'rgba(255,255,255,0.88)',
  },
  oceanic: {
    '--bg-app': '#F0F9FF',
    '--bg-card': '#FFFFFF',
    '--bg-card-hover': '#E0F2FE',
    '--bg-elevated': '#FFFFFF',
    '--border-subtle': '#BAE6FD',
    '--border-strong': '#38BDF8',
    '--text-main': '#0C4A6E',
    '--text-muted': '#0369A1',
    '--text-faint': '#0284C7',
    '--brand-primary': '#0284C7',
    '--brand-primary-hover': '#0369A1',
    '--brand-light': 'rgba(2,132,199,0.1)',
    '--shadow-glow': '0 10px 30px -4px rgba(2,132,199,0.28)',
    '--navbar-bg': 'rgba(255,255,255,0.88)',
  },
  midnight: {
    '--bg-app': '#0B0F19',
    '--bg-card': '#131B2E',
    '--bg-card-hover': '#1A2540',
    '--bg-elevated': '#1E293B',
    '--border-subtle': '#1E2D45',
    '--border-strong': '#2D4060',
    '--text-main': '#F0F4FF',
    '--text-muted': '#8AA0BD',
    '--text-faint': '#4F6A8A',
    '--brand-primary': '#10B981',
    '--brand-primary-hover': '#059669',
    '--brand-light': 'rgba(16,185,129,0.14)',
    '--shadow-glow': '0 0 24px -4px rgba(16,185,129,0.35)',
    '--navbar-bg': 'rgba(11,15,25,0.88)',
  },
};

function applyTheme(t: ThemeMode) {
  const vars = THEME_VARS[t] || THEME_VARS.porcelain;
  const root = document.documentElement;
  Object.entries(vars).forEach(([k, v]) => root.style.setProperty(k, v));
  root.setAttribute('data-theme', t);
}

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<ThemeMode>(() => {
    return (localStorage.getItem('bookme_theme') as ThemeMode) || 'porcelain';
  });

  const setTheme = (t: ThemeMode) => {
    setThemeState(t);
    localStorage.setItem('bookme_theme', t);
    applyTheme(t);
  };

  useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme, themes: THEMES }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be inside ThemeProvider');
  return ctx;
};
