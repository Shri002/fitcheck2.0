// src/components/survey/LesionsSection.jsx
import React, { useState, useEffect } from 'react';
import './LesionsSection.css';

const LesionsSection = ({ data, onNext, onBack, onSkip, isFirst, isLast, onSubmit }) => {
  // Main section flow control
  const [currentStep, setCurrentStep] = useState(data?.currentStep || 'intro');
  const [currentBodyPart, setCurrentBodyPart] = useState(data?.currentBodyPart || 0);

  // PASI data for each body part
  const [pasiData, setPasiData] = useState(data?.pasiData || {
    head: { area: null, induration: null, erythema: null, desquamation: null, images: [] },
    arms: { area: null, induration: null, erythema: null, desquamation: null, images: [] },
    trunk: { area: null, induration: null, erythema: null, desquamation: null, images: [] },
    legs: { area: null, induration: null, erythema: null, desquamation: null, images: [] }
  });

  // Itchiness and pain ratings
  const [itchiness, setItchiness] = useState(data?.itchiness || 0);
  const [pain, setPain] = useState(data?.pain || 0);

  const bodyParts = [
    { id: 'head', label: 'Head', fraction: '1/4' },
    { id: 'arms', label: 'Arms', fraction: '2/4' },
    { id: 'trunk', label: 'Trunk', fraction: '3/4' },
    { id: 'legs', label: 'Legs', fraction: '4/4' }
  ];

  const areaOptions = ['0%', '<10%', '10 - 29%', '30 - 49%', '50 - 69%', '70 - 89%', '90 - 100%'];
  const severityOptions = ['None', 'Slight', 'Moderate', 'Severe', 'Very Severe'];

  // Calculate PASI score
  const calculatePASI = () => {
    const areaScores = { 
      '0%': 0, '<10%': 1, '10 - 29%': 2, '30 - 49%': 3, 
      '50 - 69%': 4, '70 - 89%': 5, '90 - 100%': 6 
    };
    const severityScores = { 
      'None': 0, 'Slight': 1, 'Moderate': 2, 'Severe': 3, 'Very Severe': 4 
    };
    const bodyPartWeights = { head: 0.1, arms: 0.2, trunk: 0.3, legs: 0.4 };

    let totalScore = 0;
    Object.keys(pasiData).forEach(part => {
      const data = pasiData[part];
      if (data.area !== null) {
        const areaScore = areaScores[data.area] || 0;
        const indScore = severityScores[data.induration] || 0;
        const eryScore = severityScores[data.erythema] || 0;
        const desScore = severityScores[data.desquamation] || 0;
        
        const partScore = areaScore * (indScore + eryScore + desScore) * bodyPartWeights[part];
        totalScore += partScore;
      }
    });

    return totalScore.toFixed(1);
  };

  // Handle image upload
  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const partId = bodyParts[currentBodyPart].id;
    
    setPasiData(prev => ({
      ...prev,
      [partId]: {
        ...prev[partId],
        images: [...prev[partId].images, ...files.map(f => f.name)]
      }
    }));
  };

  // Update PASI data for current body part
  const updatePasiData = (field, value) => {
    const partId = bodyParts[currentBodyPart].id;
    setPasiData(prev => ({
      ...prev,
      [partId]: {
        ...prev[partId],
        [field]: value
      }
    }));
  };

  // Navigation handlers
  const handleIntroNext = () => {
    setCurrentStep('pasi');
    setCurrentBodyPart(0);
  };

  const handleSkipToPain = () => {
    setCurrentStep('itchiness');
  };

  const handlePasiNext = () => {
    if (currentBodyPart < bodyParts.length - 1) {
      setCurrentBodyPart(prev => prev + 1);
    } else {
      setCurrentStep('itchiness');
    }
  };

  const handlePasiBack = () => {
    if (currentBodyPart > 0) {
      setCurrentBodyPart(prev => prev - 1);
    } else {
      setCurrentStep('intro');
    }
  };

  const handleItchinessNext = () => {
    setCurrentStep('pain');
  };

  const handleItchinessBack = () => {
    if (pasiData.head.area !== null) {
      setCurrentStep('pasi');
      setCurrentBodyPart(3);
    } else {
      setCurrentStep('intro');
    }
  };

  const handlePainNext = () => {
    const finalData = {
      currentStep,
      currentBodyPart,
      pasiData,
      pasiScore: calculatePASI(),
      itchiness,
      pain
    };
    
    isLast ? onSubmit(finalData) : onNext(finalData);
  };

  const handlePainBack = () => {
    setCurrentStep('itchiness');
  };

  // Render intro screen
  const renderIntro = () => {
    return (
      <div className="lesions-intro">
        <h2 className="lesions-subtitle">Section 1 - Filling PASI Score</h2>
        
        <div className="pasi-explanation">
          <p>
            The <strong>Psoriasis Area and Severity Index (PASI) score</strong> is a tool dermatologists use to 
            classify psoriasis and help determine treatment. It helps classify severity of your psoriasis.
          </p>
          <p>
            In general, <strong>a PASI score of 5 to 10 is considered moderate disease</strong>, and a score over 10 
            is considered severe.
          </p>
          <p>
            In order to calculate PASI score, you will need to input information for these parts of the body:
          </p>
        </div>

        <div className="body-parts-grid">
          <div className="body-part-card">
            <svg className="body-icon" width="127" height="230" viewBox="0 0 127 230" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="64" cy="21" r="21" fill="#3473C1"/>
              <rect x="35" y="45" width="57" height="98" rx="10" fill="#F4F4F4"/>
              <rect x="69" y="50.418" width="20" height="94.2982" rx="10" transform="rotate(-24.8912 69 50.418)" fill="#F4F4F4"/>
              <rect width="20" height="91.5092" rx="10" transform="matrix(-0.907109 -0.420896 -0.420896 0.907109 57.3848 51.418)" fill="#F4F4F4"/>
              <rect x="35" y="127" width="22" height="103" rx="10" fill="#F4F4F4"/>
              <rect x="70" y="126" width="22" height="104" rx="10" fill="#F4F4F4"/>
            </svg>
            <p className="body-part-label">Head</p>
          </div>

          <div className="body-part-card">
            <svg className="body-icon" width="127" height="230" viewBox="0 0 127 230" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="69" y="50.418" width="20" height="94.2982" rx="10" transform="rotate(-24.8912 69 50.418)" fill="#3473C1"/>
              <rect width="20" height="91.5092" rx="10" transform="matrix(-0.907109 -0.420896 -0.420896 0.907109 57.3848 51.418)" fill="#3473C1"/>
              <circle cx="64" cy="21" r="21" fill="#F4F4F4"/>
              <rect x="35" y="45" width="57" height="98" rx="10" fill="#F4F4F4"/>
              <rect x="35" y="127" width="22" height="103" rx="10" fill="#F4F4F4"/>
              <rect x="70" y="126" width="22" height="104" rx="10" fill="#F4F4F4"/>
            </svg>
            <p className="body-part-label">Arms</p>
          </div>

          <div className="body-part-card">
            <svg className="body-icon" width="127" height="230" viewBox="0 0 127 230" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="64" cy="21" r="21" fill="#F4F4F4"/>
              <rect x="69" y="50.418" width="20" height="94.2982" rx="10" transform="rotate(-24.8912 69 50.418)" fill="#F4F4F4"/>
              <rect width="20" height="91.5092" rx="10" transform="matrix(-0.907109 -0.420896 -0.420896 0.907109 57.3848 51.418)" fill="#F4F4F4"/>
              <rect x="35" y="127" width="22" height="103" rx="10" fill="#F4F4F4"/>
              <rect x="70" y="126" width="22" height="104" rx="10" fill="#F4F4F4"/>
              <rect x="35" y="45" width="57" height="98" rx="10" fill="#3473C1"/>
            </svg>
            <p className="body-part-label">Trunk</p>
          </div>

          <div className="body-part-card">
            <svg className="body-icon" width="127" height="230" viewBox="0 0 127 230" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="64" cy="21" r="21" fill="#F4F4F4"/>
              <rect x="69" y="50.418" width="20" height="94.2982" rx="10" transform="rotate(-24.8912 69 50.418)" fill="#F4F4F4"/>
              <rect width="20" height="91.5092" rx="10" transform="matrix(-0.907109 -0.420896 -0.420896 0.907109 57.3848 51.418)" fill="#F4F4F4"/>
              <rect x="35" y="127" width="22" height="103" rx="10" fill="#3473C1"/>
              <rect x="70" y="126" width="22" height="104" rx="10" fill="#3473C1"/>
              <rect x="35" y="45" width="57" height="98" rx="10" fill="#F4F4F4"/>
            </svg>
            <p className="body-part-label">Legs</p>
          </div>
        </div>

        <div className="section-navigation">
          {!isFirst && (
            <button onClick={onBack} className="btn-secondary">
              Back
            </button>
          )}
          <button onClick={handleSkipToPain} className="btn-skip">
            Skip to Lesions Section 2
          </button>
          <button onClick={handleIntroNext} className="btn-primary">
            Next
          </button>
        </div>
      </div>
    );
  };

  // Render PASI input screen
  const renderPASI = () => {
    const currentPart = bodyParts[currentBodyPart];
    const currentData = pasiData[currentPart.id];

    return (
      <div className="pasi-input">
        <h2 className="lesions-subtitle">
          {currentPart.label} ({currentPart.fraction}) - Inputting PASI Scores
        </h2>

        {/* Area Coverage */}
        <div className="pasi-field">
          <label className="field-label">
            Area: % indicates the lesion's area coverage of the affected body part.
          </label>
          <div className="radio-group">
            {areaOptions.map((option) => {
              return (
                <label key={option} className="radio-option">
                  <input
                    type="radio"
                    name="area"
                    value={option}
                    checked={currentData.area === option}
                    onChange={(e) => updatePasiData('area', e.target.value)}
                  />
                  <span>{option}</span>
                </label>
              );
            })}
          </div>
        </div>

        {/* Induration/Thickness */}
        <div className="pasi-field">
          <label className="field-label">Induration/Thickness</label>
          <div className="button-group">
            {severityOptions.map((option) => {
              return (
                <button
                  key={option}
                  className={`severity-btn ${currentData.induration === option ? 'active' : ''}`}
                  onClick={() => updatePasiData('induration', option)}
                >
                  {option}
                </button>
              );
            })}
          </div>
        </div>

        {/* Erythema/Redness */}
        <div className="pasi-field">
          <label className="field-label">Erythema/Redness</label>
          <div className="button-group">
            {severityOptions.map((option) => {
              return (
                <button
                  key={option}
                  className={`severity-btn ${currentData.erythema === option ? 'active' : ''}`}
                  onClick={() => updatePasiData('erythema', option)}
                >
                  {option}
                </button>
              );
            })}
          </div>
        </div>

        {/* Desquamation/Scaling */}
        <div className="pasi-field">
          <label className="field-label">Desquamation/Scaling</label>
          <div className="button-group">
            {severityOptions.map((option) => {
              return (
                <button
                  key={option}
                  className={`severity-btn ${currentData.desquamation === option ? 'active' : ''}`}
                  onClick={() => updatePasiData('desquamation', option)}
                >
                  {option}
                </button>
              );
            })}
          </div>
        </div>

        {/* Image Upload */}
        <div className="pasi-field">
          <label className="field-label">Upload Pictures ( optional )</label>
          <div className="image-upload-area">
            <div className="image-preview">
              <svg width="60" height="60" viewBox="0 0 60 60" fill="none">
                <rect x="5" y="10" width="50" height="40" rx="3" stroke="#6B7280" strokeWidth="2"/>
                <circle cx="20" cy="25" r="5" fill="#6B7280"/>
                <path d="M10 40 L25 25 L35 35 L45 25 L55 35 L55 45 L10 45 Z" fill="#6B7280"/>
              </svg>
            </div>
            <label className="upload-btn">
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageUpload}
                style={{ display: 'none' }}
              />
              <svg width="40" height="40" viewBox="0 0 40 40">
                <circle cx="20" cy="20" r="18" stroke="#30A0CD" strokeWidth="2" fill="none"/>
                <line x1="20" y1="10" x2="20" y2="30" stroke="#30A0CD" strokeWidth="2"/>
                <line x1="10" y1="20" x2="30" y2="20" stroke="#30A0CD" strokeWidth="2"/>
              </svg>
            </label>
          </div>
          {currentData.images.length > 0 && (
            <p className="upload-count">{currentData.images.length} image(s) uploaded</p>
          )}
        </div>

        {/* Body Part Visualization */}
        <div className="body-visual">
          {currentBodyPart === 0 && (
            <svg width="127" height="230" viewBox="0 0 127 230" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="64" cy="21" r="21" fill="#3473C1"/>
              <rect x="35" y="45" width="57" height="98" rx="10" fill="#F4F4F4"/>
              <rect x="69" y="50.418" width="20" height="94.2982" rx="10" transform="rotate(-24.8912 69 50.418)" fill="#F4F4F4"/>
              <rect width="20" height="91.5092" rx="10" transform="matrix(-0.907109 -0.420896 -0.420896 0.907109 57.3848 51.418)" fill="#F4F4F4"/>
              <rect x="35" y="127" width="22" height="103" rx="10" fill="#F4F4F4"/>
              <rect x="70" y="126" width="22" height="104" rx="10" fill="#F4F4F4"/>
            </svg>
          )}
          {currentBodyPart === 1 && (
            <svg width="127" height="230" viewBox="0 0 127 230" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="69" y="50.418" width="20" height="94.2982" rx="10" transform="rotate(-24.8912 69 50.418)" fill="#3473C1"/>
              <rect width="20" height="91.5092" rx="10" transform="matrix(-0.907109 -0.420896 -0.420896 0.907109 57.3848 51.418)" fill="#3473C1"/>
              <circle cx="64" cy="21" r="21" fill="#F4F4F4"/>
              <rect x="35" y="45" width="57" height="98" rx="10" fill="#F4F4F4"/>
              <rect x="35" y="127" width="22" height="103" rx="10" fill="#F4F4F4"/>
              <rect x="70" y="126" width="22" height="104" rx="10" fill="#F4F4F4"/>
            </svg>
          )}
          {currentBodyPart === 2 && (
            <svg width="127" height="230" viewBox="0 0 127 230" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="64" cy="21" r="21" fill="#F4F4F4"/>
              <rect x="69" y="50.418" width="20" height="94.2982" rx="10" transform="rotate(-24.8912 69 50.418)" fill="#F4F4F4"/>
              <rect width="20" height="91.5092" rx="10" transform="matrix(-0.907109 -0.420896 -0.420896 0.907109 57.3848 51.418)" fill="#F4F4F4"/>
              <rect x="35" y="127" width="22" height="103" rx="10" fill="#F4F4F4"/>
              <rect x="70" y="126" width="22" height="104" rx="10" fill="#F4F4F4"/>
              <rect x="35" y="45" width="57" height="98" rx="10" fill="#3473C1"/>
            </svg>
          )}
          {currentBodyPart === 3 && (
            <svg width="127" height="230" viewBox="0 0 127 230" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="64" cy="21" r="21" fill="#F4F4F4"/>
              <rect x="69" y="50.418" width="20" height="94.2982" rx="10" transform="rotate(-24.8912 69 50.418)" fill="#F4F4F4"/>
              <rect width="20" height="91.5092" rx="10" transform="matrix(-0.907109 -0.420896 -0.420896 0.907109 57.3848 51.418)" fill="#F4F4F4"/>
              <rect x="35" y="127" width="22" height="103" rx="10" fill="#3473C1"/>
              <rect x="70" y="126" width="22" height="104" rx="10" fill="#3473C1"/>
              <rect x="35" y="45" width="57" height="98" rx="10" fill="#F4F4F4"/>
            </svg>
          )}
        </div>

        <div className="section-navigation">
          <button onClick={handlePasiBack} className="btn-secondary">
            Back
          </button>
          <button onClick={handleSkipToPain} className="btn-skip">
            Skip to Lesions Section 2
          </button>
          <button onClick={handlePasiNext} className="btn-primary">
            Next
          </button>
        </div>
      </div>
    );
  };

  // Render itchiness rating screen
  const renderItchiness = () => {
    return (
      <div className="rating-section">
        <h2 className="lesions-subtitle">Itchiness Rating</h2>
        
        <div className="slider-display">
          <div className="rating-circle">
            <span className="rating-number">{itchiness}</span>
          </div>
          <p className="rating-label">
            {itchiness === 0 ? 'No Itchiness' : itchiness <= 3 ? 'Mild' : itchiness <= 6 ? 'Moderate' : 'Severe'}
          </p>
        </div>

        <div className="slider-container">
          <input
            type="range"
            min="0"
            max="10"
            value={itchiness}
            onChange={(e) => setItchiness(parseInt(e.target.value))}
            className="custom-slider"
          />
          <div className="slider-labels">
            <span>0 - Least</span>
            <span>10 - Most</span>
          </div>
        </div>

        <div className="section-navigation">
          <button onClick={handleItchinessBack} className="btn-secondary">
            Back
          </button>
          <button onClick={() => onSkip()} className="btn-skip">
            Skip
          </button>
          <button onClick={handleItchinessNext} className="btn-primary">
            Next
          </button>
        </div>
      </div>
    );
  };

  // Render pain rating screen
  const renderPain = () => {
    return (
      <div className="rating-section">
        <h2 className="lesions-subtitle">Pain Rating</h2>
        
        <div className="slider-display">
          <div className="rating-circle">
            <span className="rating-number">{pain}</span>
          </div>
          <p className="rating-label">
            {pain === 0 ? 'No Pain' : pain <= 3 ? 'Mild' : pain <= 6 ? 'Moderate' : 'Severe'}
          </p>
        </div>

        <div className="slider-container">
          <input
            type="range"
            min="0"
            max="10"
            value={pain}
            onChange={(e) => setPain(parseInt(e.target.value))}
            className="custom-slider"
          />
          <div className="slider-labels">
            <span>0 - Least</span>
            <span>10 - Most</span>
          </div>
        </div>

        <div className="section-navigation">
          <button onClick={handlePainBack} className="btn-secondary">
            Back
          </button>
          <button onClick={() => onSkip()} className="btn-skip">
            Skip
          </button>
          <button onClick={handlePainNext} className="btn-primary">
            {isLast ? 'Submit' : 'Next'}
          </button>
        </div>
      </div>
    );
  };

  // Main render
  return (
    <div className="lesions-section">
      {currentStep === 'intro' && renderIntro()}
      {currentStep === 'pasi' && renderPASI()}
      {currentStep === 'itchiness' && renderItchiness()}
      {currentStep === 'pain' && renderPain()}
    </div>
  );
};

export default LesionsSection;