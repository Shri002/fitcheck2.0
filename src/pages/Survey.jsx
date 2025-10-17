// src/pages/Survey.jsx
import React, { useState } from 'react';
import './styles/Survey.css';
import SectionNavBar from '../components/SectionNavBar';

 

import LesionsSection from './survey/LesionsSection';
// Import section components (you'll create these as separate files)
// import StressSection from '../components/survey/StressSection';
// import LesionsSection from '../components/survey/LesionsSection';
// import HormoneSection from '../components/survey/HormoneSection';
// import SunExposureSection from '../components/survey/SunExposureSection';
// import MedicationSection from '../components/survey/MedicationSection';
// import CareRoutineSection from '../components/survey/CareRoutineSection';
// import DietSection from '../components/survey/DietSection';
// import WeatherSection from '../components/survey/WeatherSection';

// Temporary placeholder component for testing
const PlaceholderSection = ({ sectionTitle, data, onNext, onBack, onSkip, isFirst, isLast, onSubmit }) => {
  const [tempData, setTempData] = useState(data || '');

  const handleNextClick = () => {
    const sectionData = { value: tempData };
    isLast ? onSubmit(sectionData) : onNext(sectionData);
  };

  return (
    <div className="section-content">
      <p className="section-description">This is a placeholder for {sectionTitle}</p>
      <input
        type="text"
        value={tempData}
        onChange={(e) => setTempData(e.target.value)}
        placeholder="Enter some data..."
        style={{ width: '100%', padding: '0.75rem', marginBottom: '1rem' }}
      />
      <div className="section-navigation">
        {!isFirst && <button onClick={onBack} className="btn-secondary">Back</button>}
        <button onClick={onSkip} className="btn-skip">Skip</button>
        <button onClick={handleNextClick} className="btn-primary">{isLast ? 'Submit' : 'Next'}</button>
      </div>
    </div>
  );
};

const Survey = () => {
  const [currentSection, setCurrentSection] = useState(0);
  const [surveyData, setSurveyData] = useState({
    lesions: null,
    stress: null,
    hormone: null,
    sunExposure: null,
    medication: null,
    careRoutine: null,
    diet: null,
    weather: null,
  });
  
  const [sectionStatus, setSectionStatus] = useState({
    lesions: 'not-started',
    stress: 'not-started',
    hormone: 'not-started',
    sunExposure: 'not-started',
    medication: 'not-started',
    careRoutine: 'not-started',
    diet: 'not-started',
    weather: 'not-started',
  });

  // Define all sections - replace PlaceholderSection with actual components as you build them
  const sections = [
    { id: 'lesions', title: 'Lesions', component: LesionsSection },
    { id: 'stress', title: 'Stress', component: PlaceholderSection },
    { id: 'hormone', title: 'Hormone Cycle', component: PlaceholderSection },
    { id: 'sunExposure', title: 'Sun Exposure', component: PlaceholderSection },
    { id: 'medication', title: 'Medication', component: PlaceholderSection },
    { id: 'careRoutine', title: 'Care Routine', component: PlaceholderSection },
    { id: 'diet', title: 'Diet', component: PlaceholderSection },
    { id: 'weather', title: 'Weather', component: PlaceholderSection },
  ];

  const CurrentSectionComponent = sections[currentSection].component;
  const currentSectionId = sections[currentSection].id;

  // Handle saving data for current section
  const handleSectionData = (data) => {
    setSurveyData(prev => ({
      ...prev,
      [currentSectionId]: data
    }));
    
    setSectionStatus(prev => ({
      ...prev,
      [currentSectionId]: 'completed'
    }));
  };

  // Handle skipping a section
  const handleSkip = () => {
    setSectionStatus(prev => ({
      ...prev,
      [currentSectionId]: 'skipped'
    }));
    
    if (currentSection < sections.length - 1) {
      setCurrentSection(prev => prev + 1);
    }
  };

  // Navigation handlers
  const handleNext = (data) => {
    if (data) {
      handleSectionData(data);
    }
    
    if (currentSection < sections.length - 1) {
      setCurrentSection(prev => prev + 1);
    }
  };

  const handleBack = () => {
    if (currentSection > 0) {
      setCurrentSection(prev => prev - 1);
    }
  };

  const handleSectionNavigation = (index) => {
    setCurrentSection(index);
  };

  // Handle final submission
  const handleSubmit = (finalData) => {
    handleSectionData(finalData);
    
    const completedSurvey = {
      ...surveyData,
      [currentSectionId]: finalData,
      date: new Date().toISOString(),
      status: sectionStatus
    };
    
    // TODO: Save to localStorage or backend
    console.log('Survey submitted:', completedSurvey);
    
    // TODO: Update calendar with completed day
    // TODO: Update streak
    // TODO: Navigate to homepage
    
    alert('Survey completed! Data logged to console.');
  };

  const getSurveyDate = () => {
    const today = new Date();
    const month = today.toLocaleDateString('en-US', { month: 'long' });
    const day = today.getDate();
    const year = today.getFullYear();
    return `Daily-Check in for ${month} ${day}, ${year}`;
  };

  return (
    <div className="survey-page">
      {/* Main Content Area */}
      <div className="survey-main-content">
        <div className="survey-header">
          <h3 className="survey-date-title">{getSurveyDate()}</h3>
          <h1 className="survey-section-title">{sections[currentSection].title}</h1>
        </div>

        <div className="survey-section">
          <CurrentSectionComponent
            sectionTitle={sections[currentSection].title}
            data={surveyData[currentSectionId]}
            onNext={handleNext}
            onBack={handleBack}
            onSkip={handleSkip}
            onSubmit={handleSubmit}
            isFirst={currentSection === 0}
            isLast={currentSection === sections.length - 1}
          />
        </div>
      </div>

      {/* Right Section Navigation Bar */}
      <SectionNavBar
        sections={sections}
        currentSection={currentSection}
        sectionStatus={sectionStatus}
        onSectionClick={handleSectionNavigation}
      />
    </div>
  );
};

export default Survey;