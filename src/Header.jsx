import React from 'react';
import { BookOpen } from 'lucide-react';

const headerStyles = {
  header: {
    width: '100%',
    backgroundColor: '#ffffff',
    borderBottom: '1px solid #e0e0e0',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.03)',
    height: '3rem',
    position: 'sticky',
    top: 0,
    zIndex: 1000
  },
  content: {
    height: '3rem',
    display: 'flex',
    alignItems: 'center',
    padding: '0 1.25rem',
    maxWidth: '1440px',
    margin: '0 auto'
  },
  titleContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem'
  },
  logo: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'black',
    width: '1.75rem',
    height: '1.75rem',
    marginRight: '0.5rem'
  },
  title: {
    flex: 1,
    fontSize: '1.1rem',
    fontWeight: 700,
    color: '#000',
    letterSpacing: '-0.01em',
    display: 'flex',
    alignItems: 'center'
  },
  version: {
    marginLeft: '0.5rem',
    fontSize: '0.7rem',
    fontWeight: 600,
    color: '#fff',
    background: '#000',
    padding: '0.1rem 0.35rem',
    borderRadius: '2px'
  },
  subtitle: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.4rem',
    fontSize: '0.85rem',
    color: '#000',
    fontWeight: 500,
    marginLeft: 'auto',
    padding: '0.25rem 0.7rem',
    borderRadius: '4px',
    backgroundColor: '#f0f0f0',
    border: '1px solid #e0e0e0',
    transition: 'all 0.2s ease'
  }
};

export default function Header() {
  return (
    <header style={headerStyles.header}>
      <div style={headerStyles.content}>
        <div style={headerStyles.titleContainer}>
          <div style={headerStyles.logo}>
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 48 48">
              <mask id="ipTHammerAndAnvil0">
                <path fill="#555" stroke="#000" strokeLinejoin="round" strokeWidth="4" d="M6 14C6 4 14 4 14 4v20H6V14Zm8-4h28v6H14zM6 30h36s0 8-6 8h-7l2 6H13l2-6H6v-8Z"/>
              </mask>
              <path fill="currentColor" d="M0 0h48v48H0z" mask="url(#ipTHammerAndAnvil0)"/>
            </svg>
          </div>
          <div style={headerStyles.title}>
            DramaForge
          </div>
        </div>
        <div style={headerStyles.subtitle}>
          <BookOpen size={14} /> Pipeline Documentation
        </div>
      </div>
    </header>
  );
}
