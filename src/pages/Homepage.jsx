// src/pages/Homepage.js
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './styles/Homepage.css';

const Homepage = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  
  // Mock data - days where survey was completed (you'll replace this with real data)
  const completedDays = [1, 3, 4, 5]; // Days in current month with completed surveys
  
  // Mock streak data
  const currentStreak = 44;
  const longestStreak = 100;
  const weeklyStreak = [true, true, true, true, true, true, false]; // Mon-Sun
  const daysOfWeekShort = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

  // Get calendar data
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const today = new Date();
  
  const firstDayOfMonth = new Date(year, month, 1);
  const lastDayOfMonth = new Date(year, month + 1, 0);
  const daysInMonth = lastDayOfMonth.getDate();
  const startingDayOfWeek = firstDayOfMonth.getDay(); // 0 = Sunday
  
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const daysOfWeek = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

  // Generate year options (current year ± 5 years)
  const currentYear = new Date().getFullYear();
  const yearOptions = Array.from({ length: 11 }, (_, i) => currentYear - 5 + i);

  // Navigate months
  const previousMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  // Handle dropdown changes
  const handleMonthChange = (e) => {
    setCurrentDate(new Date(year, parseInt(e.target.value), 1));
  };

  const handleYearChange = (e) => {
    setCurrentDate(new Date(parseInt(e.target.value), month, 1));
  };

  // Generate calendar days
  const calendarDays = [];
  
  // Add empty cells for days before month starts
  for (let i = 0; i < startingDayOfWeek; i++) {
    calendarDays.push(null);
  }
  
  // Add days of month
  for (let day = 1; day <= daysInMonth; day++) {
    calendarDays.push(day);
  }

  const isToday = (day) => {
    return day === today.getDate() && 
           month === today.getMonth() && 
           year === today.getFullYear();
  };

  const hasCompletedSurvey = (day) => {
    return completedDays.includes(day);
  };

  const handleDayClick = (day) => {
    if (hasCompletedSurvey(day)) {
      // Navigate to survey details page (to be implemented)
      console.log(`Navigate to survey details for day ${day}`);
      // TODO: Navigate to /survey-details/${year}-${month}-${day}
    }
  };

  return (
    <div className="page-container homepage">
      <h1>Homepage</h1>
      
      <div className="homepage-content">
        {/* Calendar Section */}
        <div className="calendar-section">
          <h2 className="section-title">Calendar</h2>
          <p className="calendar-description">Look at past daily check-in entry by pressing on a specified date</p>
          <div className="calendar-card">
            <div className="calendar-header">
              <div className="calendar-title-filters">
                <h3 className="calendar-month">{monthNames[month]} {year}</h3>
                <div className="date-filters">
                  <select 
                    value={month} 
                    onChange={handleMonthChange}
                    className="month-select"
                    aria-label="Select month"
                  >
                    {monthNames.map((name, index) => (
                      <option key={index} value={index}>{name}</option>
                    ))}
                  </select>
                  <select 
                    value={year} 
                    onChange={handleYearChange}
                    className="year-select"
                    aria-label="Select year"
                  >
                    {yearOptions.map(yearOption => (
                      <option key={yearOption} value={yearOption}>{yearOption}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="calendar-nav">
                <button onClick={previousMonth} className="nav-btn" aria-label="Previous month">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
                <button onClick={nextMonth} className="nav-btn" aria-label="Next month">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
              </div>
            </div>

            <div className="calendar-grid">
              {/* Day headers */}
              {daysOfWeek.map(day => (
                <div key={day} className="calendar-day-header">{day}</div>
              ))}
              
              {/* Calendar days */}
              {calendarDays.map((day, index) => (
                <button
                  key={index}
                  className={`calendar-day ${!day ? 'empty' : ''} ${isToday(day) ? 'today' : ''} ${hasCompletedSurvey(day) ? 'has-survey' : ''}`}
                  disabled={!day}
                  onClick={() => day && handleDayClick(day)}
                >
                  {day && (
                    <>
                      <span className="day-number">{day}</span>
                      {hasCompletedSurvey(day) && <span className="completion-dot"></span>}
                    </>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Daily Check-in Section */}
        <div className="checkin-section">
          <h2 className="section-title">Daily Check-in</h2>
          <div className="checkin-card">
            <div className="streak-stats">
              <div className="stat">
                <div className="stat-number">{currentStreak}</div>
                <div className="stat-label">Current Streak</div>
              </div>
              <div className="stat">
                <div className="stat-number">{longestStreak}</div>
                <div className="stat-label">Longest Streak</div>
              </div>
              <button className="notification-btn" aria-label="Notifications">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path d="M18 8C18 6.4087 17.3679 4.88258 16.2426 3.75736C15.1174 2.63214 13.5913 2 12 2C10.4087 2 8.88258 2.63214 7.75736 3.75736C6.63214 4.88258 6 6.4087 6 8C6 15 3 17 3 17H21C21 17 18 15 18 8Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M13.73 21C13.5542 21.3031 13.3019 21.5547 12.9982 21.7295C12.6946 21.9044 12.3504 21.9965 12 21.9965C11.6496 21.9965 11.3054 21.9044 11.0018 21.7295C10.6982 21.5547 10.4458 21.3031 10.27 21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </div>

            <div className="weekly-streak">
              {weeklyStreak.map((completed, index) => (
                <div key={index} className="streak-day">
                  <div className={`streak-circle ${completed ? 'completed' : 'incomplete'}`}>
                    {completed && (
                      <svg width="46" height="46" viewBox="0 0 46 46" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <ellipse cx="23.0963" cy="23.0396" rx="22.6238" ry="22.579" fill="#FFCE51"/>
                        <g clipPath="url(#clip0_1083_7716)">
                          <ellipse cx="25.4867" cy="27.2643" rx="4.61082" ry="6.44239" fill="#FFCE51"/>
                          <path d="M32.8398 24.0137C30.9094 19.007 24.0362 18.737 25.6961 11.4602C25.819 10.9203 25.2411 10.5031 24.7739 10.7853C20.3106 13.4113 17.1015 18.6757 19.7942 25.5721C20.0155 26.1366 19.3516 26.6642 18.8721 26.2961C16.6466 24.6149 16.413 22.1975 16.6097 20.4673C16.6835 19.8292 15.8474 19.5224 15.4908 20.0501C14.6547 21.3263 13.8063 23.3878 13.8063 26.4924C14.2735 33.3643 20.0893 35.475 22.1796 35.7449C25.1674 36.1253 28.4011 35.5731 30.7249 33.4502C33.2824 31.0819 34.2169 27.3023 32.8398 24.0137ZM21.4295 30.1861C23.2001 29.7566 24.1099 28.4804 24.3559 27.3514C24.7616 25.5966 23.1755 23.8787 24.2452 21.1054C24.651 23.4001 28.2658 24.8358 28.2658 27.3392C28.3642 30.4438 24.9952 33.1066 21.4295 30.1861Z" fill="#FF7324"/>
                        </g>
                        <defs>
                          <clipPath id="clip0_1083_7716">
                            <rect width="29.5092" height="29.4509" fill="white" transform="translate(8.88831 8.85904)"/>
                          </clipPath>
                        </defs>
                      </svg>
                    )}
                  </div>
                  <span className="day-label">{daysOfWeekShort[index]}</span>
                </div>
              ))}
            </div>

            <Link to="/survey" className="complete-checkin-btn">
              Complete Today's Check-In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Homepage;