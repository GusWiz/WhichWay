import { signOut } from 'firebase/auth';
import { auth } from '../components/firebase';
import React, { useState } from 'react';

import './Home.css';
import './Settings.css';

import NavigationBar from '../components/Landing-Components/NavigationBar';
import Sidebar from '../components/Homepage-Components/Sidebar';

function Settings() {
  const [theme, setTheme] = useState('light');
  const [fontStyle, setFontStyle] = useState('default');
  const [showTips, setShowTips] = useState(true);

  const handleSaveSettings = () => {
    console.log('Saved settings:', { theme, fontStyle, showTips });
    // TODO: persist to context or Firebase
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

              {/* Display Settings */}
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
                    <option value='large'>Large Text</option>
                    <option value='dyslexia'>Dyslexia-Friendly</option>
                  </select>
                </div>
              </div>

              {/* Tips & Tutorials */}
              <div className='settings-section'>
                <h3>🧠 Tips & Tutorials</h3>

                <div className='setting-item'>
                  <label>Show Travel Tips</label>
                  <div className='radio-group'>
                    <label>
                      <input
                        type='radio'
                        value='yes'
                        checked={showTips}
                        onChange={() => setShowTips(true)}
                      />
                      Yes, show tips
                    </label>
                    <label>
                      <input
                        type='radio'
                        value='no'
                        checked={!showTips}
                        onChange={() => setShowTips(false)}
                      />
                      Don’t show tips
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
