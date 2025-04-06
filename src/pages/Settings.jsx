import { signOut } from 'firebase/auth';
import { auth } from '../components/firebase';
import React, { useState } from 'react';

import './Home.css';
import './Settings.css';

import NavigationBar from '../components/Landing-Components/NavigationBar';
import Sidebar from '../components/Homepage-Components/Sidebar';

function Settings() {
  // General Settings
  const [language, setLanguage] = useState('en');
  const [timeFormat, setTimeFormat] = useState('12');
  const [dateFormat, setDateFormat] = useState('MM/DD/YYYY');
  const [currency, setCurrency] = useState('USD');

  // Display Settings
  const [theme, setTheme] = useState('light');
  const [fontStyle, setFontStyle] = useState('default');

  // Location Settings
  const [defaultLocation, setDefaultLocation] = useState('');
  const [measurementUnits, setMeasurementUnits] = useState('metric');

  const handleSaveSettings = () => {
    //Add later
  };

  const logout = async () => {
    try {
      await signOut(auth);
      window.location.href = '/login';
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <NavigationBar />
      <div className='home-page'>
        <div className='home-container'>
          <Sidebar logout={logout} />
          <div className='home-contents'>
            <div className='settings-page'>
              <h2>Settings</h2>

              {/* General Settings Section */}
              <div className='settings-section'>
                <h3>🌍 General Settings</h3>

                <div className='setting-item'>
                  <label>Language</label>
                  <select
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                  >
                    <option value='en'>English</option>
                    <option value='es'>Spanish</option>
                    <option value='fr'>French</option>
                  </select>
                </div>

                <div className='setting-item'>
                  <label>Time Format</label>
                  <div className='radio-group'>
                    <label>
                      <input
                        type='radio'
                        value='12'
                        checked={timeFormat === '12'}
                        onChange={() => setTimeFormat('12')}
                      />
                      12-hour
                    </label>
                    <label>
                      <input
                        type='radio'
                        value='24'
                        checked={timeFormat === '24'}
                        onChange={() => setTimeFormat('24')}
                      />
                      24-hour
                    </label>
                  </div>
                </div>

                <div className='setting-item'>
                  <label>Date Format</label>
                  <select
                    value={dateFormat}
                    onChange={(e) => setDateFormat(e.target.value)}
                  >
                    <option value='MM/DD/YYYY'>MM/DD/YYYY</option>
                    <option value='DD/MM/YYYY'>DD/MM/YYYY</option>
                    <option value='YYYY-MM-DD'>YYYY-MM-DD</option>
                  </select>
                </div>

                <div className='setting-item'>
                  <label>Currency Format</label>
                  <select
                    value={currency}
                    onChange={(e) => setCurrency(e.target.value)}
                  >
                    <option value='USD'>USD - US Dollar</option>
                    <option value='EUR'>EUR - Euro</option>
                  </select>
                </div>
              </div>

              {/* Display Settings Section */}
              <div className='settings-section'>
                <h3>🎨 Display Settings</h3>

                <div className='setting-item'>
                  <label>Theme</label>
                  <select
                    value={theme}
                    onChange={(e) => setTheme(e.target.value)}
                  >
                    <option value='light'>Light Mode</option>
                    <option value='dark'>Dark Mode</option>
                    <option value='system'>System Default</option>
                  </select>
                </div>

                <div className='setting-item'>
                  <label>Font Style</label>
                  <select
                    value={fontStyle}
                    onChange={(e) => setFontStyle(e.target.value)}
                  >
                    <option value='default'>Default</option>
                    <option value='serif'>Serif</option>
                    <option value='sans-serif'>Sans-serif</option>
                    <option value='large'>Large Text</option>
                  </select>
                </div>
              </div>

              {/* Location Settings Section */}
              <div className='settings-section'>
                <h3>📍 Location Settings</h3>

                <div className='setting-item'>
                  <label>Default Starting Location</label>
                  <input
                    type='text'
                    value={defaultLocation}
                    onChange={(e) => setDefaultLocation(e.target.value)}
                    placeholder='Enter your home/base location'
                  />
                </div>

                <div className='setting-item'>
                  <label>Units of Measurement</label>
                  <div className='radio-group'>
                    <label>
                      <input
                        type='radio'
                        value='metric'
                        checked={measurementUnits === 'metric'}
                        onChange={() => setMeasurementUnits('metric')}
                      />
                      Metric (km, °C)
                    </label>
                    <label>
                      <input
                        type='radio'
                        value='imperial'
                        checked={measurementUnits === 'imperial'}
                        onChange={() => setMeasurementUnits('imperial')}
                      />
                      Imperial (miles, °F)
                    </label>
                  </div>
                </div>
              </div>

              <div className='settings-actions'>
                <button onClick={handleSaveSettings} className='save-button'>
                  Save Settings
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Settings;
