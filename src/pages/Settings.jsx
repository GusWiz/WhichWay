import { signOut } from 'firebase/auth';
import { auth } from '../components/firebase';
import React, { useState, useEffect } from 'react';

import './Home.css';
import './Settings.css';

import NavigationBar from '../components/Landing-Components/NavigationBar';
import Sidebar from '../components/Homepage-Components/Sidebar';

function Settings() {
  const [language, setLanguage] = useState('en');
  const [theme, setTheme] = useState('light');
  const [fontStyle, setFontStyle] = useState('default');
  const [defaultLocation, setDefaultLocation] = useState('');
  const [showLocationModal, setShowLocationModal] = useState(false);

  useEffect(() => {
    const savedLocationPref = localStorage.getItem('allowLocation');
    if (savedLocationPref === 'auto') {
      setDefaultLocation('auto');
    }
  }, []);

  const handleSaveSettings = () => {
    if (defaultLocation === 'auto') {
      localStorage.setItem('allowLocation', 'auto');
    } else {
      localStorage.setItem('allowLocation', 'deny');
    }
    console.log('Settings saved:', {
      language,
      theme,
      fontStyle,
      defaultLocation,
    });
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

              {/* General Settings */}
              <div className='settings-section'>
                <h3>🌍 General Settings</h3>

                <div className='setting-item'>
                  <label>Language</label>
                  <select value={language} onChange={(e) => setLanguage(e.target.value)}>
                    <option value='en'>English</option>
                    <option value='es'>Spanish</option>
                    <option value='fr'>French</option>
                  </select>
                </div>
              </div>

              {/* Display Settings */}
              <div className='settings-section'>
                <h3>🎨 Display Settings</h3>

                <div className='setting-item'>
                  <label>Theme</label>
                  <select value={theme} onChange={(e) => setTheme(e.target.value)}>
                    <option value='light'>Light Mode</option>
                    <option value='dark'>Dark Mode</option>
                    <option value='system'>System Default</option>
                  </select>
                </div>

                <div className='setting-item'>
                  <label>Font Style</label>
                  <select value={fontStyle} onChange={(e) => setFontStyle(e.target.value)}>
                    <option value='default'>Default</option>
                    <option value='serif'>Serif</option>
                    <option value='sans-serif'>Sans-serif</option>
                    <option value='large'>Large Text</option>
                  </select>
                </div>
              </div>

              {/* Location Settings */}
              <div className='settings-section'>
                <h3>📍 Location Settings</h3>

                <div className='setting-item center-content'>
                  <label>Auto-Detect Location</label>
                  <button
                    className='location-button'
                    onClick={() => setShowLocationModal(true)}
                  >
                    Set Permission
                  </button>
                  <p style={{ fontSize: '0.9rem'}}>
                    Current: {defaultLocation === 'auto' ? 'Allowed' : 'Not allowed'}
                  </p>
                </div>
              </div>

              <div className='settings-actions'>
                <button onClick={handleSaveSettings} className='save-button'>
                  Save Settings
                </button>
              </div>

              {/* Location Access Modal */}
              {showLocationModal && (
                <div className='modal-overlay'>
                  <div className='modal'>
                    <h3>Allow WhichWay to access your location?</h3>
                    <div className='modal-buttons'>
                      <button
                        onClick={() => {
                          setDefaultLocation('auto');
                          localStorage.setItem('allowLocation', 'auto');
                          setShowLocationModal(false);
                        }}
                      >
                        Allow
                      </button>
                      <button
                        onClick={() => {
                          setDefaultLocation('');
                          localStorage.setItem('allowLocation', 'deny');
                          setShowLocationModal(false);
                        }}
                      >
                        Don’t Allow
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Settings;
