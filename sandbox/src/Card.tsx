import React from 'react';

// 1. The TypeScript Interface: Tells React what exact arguments (props) this component accepts.
// title: must be text (string).
// children: can be any valid React element/JSX (e.g. text, buttons, images, other components).
interface CardProps {
  title: string;
  children: React.ReactNode;
}

// 2. The Functional Component: Destructures 'title' and 'children' from props and returns JSX.
export function Card({ title, children }: CardProps) {
  return (
    <div style={{
      border: '1px solid #475569',
      borderRadius: '12px',
      padding: '20px',
      margin: '16px 0',
      backgroundColor: '#1e293b',
      boxShadow: '0 4px 10px rgba(0, 0, 0, 0.25)',
      fontFamily: 'system-ui, sans-serif',
      color: '#f1f5f9',
      textAlign: 'left'
    }}>
      {/* Dynamic Title */}
      <h3 style={{ 
        margin: '0 0 12px 0', 
        fontSize: '1.4rem', 
        fontWeight: '600',
        color: '#60a5fa' 
      }}>
        {title}
      </h3>
      {/* Dynamic Children placeholder */}
      <div style={{ fontSize: '1rem', color: '#cbd5e1', lineHeight: '1.5' }}>
        {children}
      </div>
    </div>
  );
}
