import React, { createContext, useContext, useState, useEffect } from 'react';
import { ThemeMode } from '../types';

interface ThemeContextType {
  theme: ThemeMode;
  setTheme: (t: ThemeMode) => void;
  themes: { id: ThemeMode; label: string; preview: string }[];
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const THEMES: { id: ThemeMode; label: string; preview: string }[] = [
  { id: 'midnight', label: 'Midnight', preview: '#0B0F19' },
  { id: 'porcelain', label: 'Porcelain', preview: '#F5F7FA' },
  { id: 'emerald', label: 'Emerald', preview: '#052E16' },
  { id: 'violet', label: 'Violet', preview: '#1E0A3C' },
  { id: 'sunset', label: 'Sunset', preview: '#1C0A00' },
];

const THEME_VARS: Record<ThemeMode, Record<string, string>> = {
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
    '--brand-light': 'rgba(16,185,129,0.12)',
    '--shadow-glow': '0 0 24px -4px rgba(16,185,129,0.3)',
    '--navbar-bg': 'rgba(11,15,25,0.88)',
  },
  porcelain: {
    '--bg-app': '#F1F4F9',
    '--bg-card': '#FFFFFF',
    '--bg-card-hover': '#F7F9FC',
    '--bg-elevated': '#EEF2F7',
    '--border-subtle': '#DDE3EE',
    '--border-strong': '#C2CCDB',
    '--text-main': '#101828',
    '--text-muted': '#4B5C72',
    '--text-faint': '#8A9BB0',
    '--brand-primary': '#0D9488',
    '--brand-primary-hover': '#0F766E',
    '--brand-light': 'rgba(13,148,136,0.10)',
    '--shadow-glow': '0 0 20px -4px rgba(13,148,136,0.2)',
    '--navbar-bg': 'rgba(255,255,255,0.92)',
  },
  emerald: {
    '--bg-app': '#04140D',
    '--bg-card': '#081F14',
    '--bg-card-hover': '#0D2B1C',
    '--bg-elevated': '#113523',
    '--border-subtle': '#164428',
    '--border-strong': '#1F5C37',
    '--text-main': '#E6FAF2',
    '--text-muted': '#5CB88A',
    '--text-faint': '#2E7A52',
    '--brand-primary': '#34D399',
    '--brand-primary-hover': '#10B981',
    '--brand-light': 'rgba(52,211,153,0.12)',
    '--shadow-glow': '0 0 24px -4px rgba(52,211,153,0.3)',
    '--navbar-bg': 'rgba(4,20,13,0.9)',
  },
  violet: {
    '--bg-app': '#0A0314',
    '--bg-card': '#120520',
    '--bg-card-hover': '#1A0A2E',
    '--bg-elevated': '#22103C',
    '--border-subtle': '#2A1348',
    '--border-strong': '#3D1E68',
    '--text-main': '#EDE0FF',
    '--text-muted': '#9B78CC',
    '--text-faint': '#5C3E88',
    '--brand-primary': '#A855F7',
    '--brand-primary-hover': '#9333EA',
    '--brand-light': 'rgba(168,85,247,0.12)',
    '--shadow-glow': '0 0 24px -4px rgba(168,85,247,0.35)',
    '--navbar-bg': 'rgba(10,3,20,0.9)',
  },
  sunset: {
    '--bg-app': '#130700',
    '--bg-card': '#1E0D00',
    '--bg-card-hover': '#2A1400',
    '--bg-elevated': '#371B00',
    '--border-subtle': '#3E1F04',
    '--border-strong': '#5C2E08',
    '--text-main': '#FFF3E6',
    '--text-muted': '#BF8050',
    '--text-faint': '#7A4E28',
    '--brand-primary': '#F97316',
    '--brand-primary-hover': '#EA580C',
    '--brand-light': 'rgba(249,115,22,0.12)',
    '--shadow-glow': '0 0 24px -4px rgba(249,115,22,0.3)',
    '--navbar-bg': 'rgba(19,7,0,0.9)',
  },
};

function applyTheme(t: ThemeMode) {
  const vars = THEME_VARS[t];
  const root = document.documentElement;
  Object.entries(vars).forEach(([k, v]) => root.style.setProperty(k, v));
  root.setAttribute('data-theme', t);
}

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<ThemeMode>(() => {
    return (localStorage.getItem('bookme_theme') as ThemeMode) || 'midnight';
  });

  const setTheme = (t: ThemeMode) => {
    setThemeState(t);
    localStorage.setItem('bookme_theme', t);
    applyTheme(t);
  };

  useEffect(() => {
    applyTheme(theme);
  }, []); // only on mount

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
