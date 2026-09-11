import React, { createContext, useContext, useState, useEffect } from 'react';
import { ThemeMode } from '../types';

interface ThemeContextType {
  theme: ThemeMode;
  setTheme: (t: ThemeMode) => void;
  themes: { id: ThemeMode; label: string; preview: string }[];
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const THEMES: { id: ThemeMode; label: string; preview: string }[] = [
  { id: 'midnight', label: 'Midnight Obsidian', preview: '#10B981' },
  { id: 'porcelain', label: 'Porcelain Neo', preview: '#6366F1' },
  { id: 'emerald', label: 'Emerald Luxe', preview: '#059669' },
  { id: 'violet', label: 'Cosmic Violet', preview: '#A855F7' },
  { id: 'sunset', label: 'Sunset Amber', preview: '#F97316' },
  { id: 'oceanic', label: 'Oceanic Deep', preview: '#06B6D4' },
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
    '--brand-light': 'rgba(16,185,129,0.14)',
    '--shadow-glow': '0 0 24px -4px rgba(16,185,129,0.35)',
    '--navbar-bg': 'rgba(11,15,25,0.88)',
  },
  porcelain: {
    '--bg-app': '#F5F7FB',
    '--bg-card': '#FFFFFF',
    '--bg-card-hover': '#F0F4FA',
    '--bg-elevated': '#E4EBF5',
    '--border-subtle': '#D3DEED',
    '--border-strong': '#B8C9E0',
    '--text-main': '#0F172A',
    '--text-muted': '#475569',
    '--text-faint': '#64748B',
    '--brand-primary': '#6366F1',
    '--brand-primary-hover': '#4F46E5',
    '--brand-light': 'rgba(99,102,241,0.12)',
    '--shadow-glow': '0 0 20px -4px rgba(99,102,241,0.25)',
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
    '--text-muted': '#6EE7B7',
    '--text-faint': '#34D399',
    '--brand-primary': '#059669',
    '--brand-primary-hover': '#047857',
    '--brand-light': 'rgba(5,150,105,0.16)',
    '--shadow-glow': '0 0 24px -4px rgba(5,150,105,0.38)',
    '--navbar-bg': 'rgba(4,20,13,0.90)',
  },
  violet: {
    '--bg-app': '#0B0518',
    '--bg-card': '#140A2B',
    '--bg-card-hover': '#1F0F3F',
    '--bg-elevated': '#281352',
    '--border-subtle': '#341A66',
    '--border-strong': '#4C2794',
    '--text-main': '#F5F0FF',
    '--text-muted': '#C084FC',
    '--text-faint': '#9333EA',
    '--brand-primary': '#A855F7',
    '--brand-primary-hover': '#9333EA',
    '--brand-light': 'rgba(168,85,247,0.16)',
    '--shadow-glow': '0 0 24px -4px rgba(168,85,247,0.40)',
    '--navbar-bg': 'rgba(11,5,24,0.90)',
  },
  sunset: {
    '--bg-app': '#120904',
    '--bg-card': '#1E1108',
    '--bg-card-hover': '#2C1B0F',
    '--bg-elevated': '#3B2414',
    '--border-subtle': '#4A2D1A',
    '--border-strong': '#694025',
    '--text-main': '#FFF4ED',
    '--text-muted': '#FDBA74',
    '--text-faint': '#FB923C',
    '--brand-primary': '#F97316',
    '--brand-primary-hover': '#EA580C',
    '--brand-light': 'rgba(249,115,22,0.16)',
    '--shadow-glow': '0 0 24px -4px rgba(249,115,22,0.35)',
    '--navbar-bg': 'rgba(18,9,4,0.90)',
  },
  oceanic: {
    '--bg-app': '#04111E',
    '--bg-card': '#081B2E',
    '--bg-card-hover': '#0E2742',
    '--bg-elevated': '#133356',
    '--border-subtle': '#1B436D',
    '--border-strong': '#255D96',
    '--text-main': '#E0F7FC',
    '--text-muted': '#67E8F9',
    '--text-faint': '#22D3EE',
    '--brand-primary': '#06B6D4',
    '--brand-primary-hover': '#0891B2',
    '--brand-light': 'rgba(6,182,212,0.16)',
    '--shadow-glow': '0 0 24px -4px rgba(6,182,212,0.38)',
    '--navbar-bg': 'rgba(4,17,30,0.90)',
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
