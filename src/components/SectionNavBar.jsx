// src/components/SectionNavBar.jsx
import React, { useState } from 'react';
import './style/SectionNavBar.css';

const SectionNavBar = ({ sections, currentSection, sectionStatus, onSectionClick }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleSheet = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      {/* Mobile Bottom Sheet Trigger Button */}
      <button className="bottom-sheet-trigger" onClick={toggleSheet}>
        <span className="trigger-text">Sections</span>
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path d="M4 6L8 10L12 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>

      {/* Overlay */}
      {isOpen && <div className="bottom-sheet-overlay" onClick={toggleSheet}></div>}

      {/* Desktop Sidebar / Mobile Bottom Sheet */}
      <aside className={`section-navbar ${isOpen ? 'open' : ''}`}>
        {/* Bottom Sheet Handle (Mobile only) */}
        <div className="bottom-sheet-handle" onClick={toggleSheet}>
          <div className="handle-bar"></div>
        </div>

        <h2 className="section-navbar-title">Tracking Sections</h2>
        <ul className="section-list">
          {sections.map((section, index) => {
            const isActive = currentSection === index;
            const status = sectionStatus[section.id];
            const isCompleted = status === 'completed';
            
            return (
              <li
                key={section.id}
                className={`section-item ${isActive ? 'active' : ''} ${status}`}
                onClick={() => {
                  onSectionClick(index);
                  if (window.innerWidth <= 768) {
                    setIsOpen(false);
                  }
                }}
              >
                {isActive && <div className="active-indicator"></div>}
                <span className="section-name">{section.title}</span>
                <div className={`section-status-dot ${isCompleted ? 'completed' : ''}`}>
                  {isCompleted && (
                    <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                      <circle cx="5" cy="5" r="5" fill="#30A0CD"/>
                    </svg>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      </aside>
    </>
  );
};

export default SectionNavBar;