import { signOut } from 'firebase/auth';
import { auth } from '../components/firebase';
import { db } from '../components/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import React, { useState, useEffect } from 'react';

import './Home.css';
import './Settings.css';

import NavigationBar from '../components/Landing-Components/NavigationBar';
import Sidebar from '../components/Homepage-Components/Sidebar';

function Settings() {
  const [defaultLocation, setDefaultLocation] = useState('');
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    const savedLocationPref = localStorage.getItem('allowLocation');
    if (savedLocationPref === 'auto') {
      setDefaultLocation('auto');
    }

    const savedNotifications = localStorage.getItem('notificationsEnabled');
    if (savedNotifications === 'true') {
      setNotificationsEnabled(true);
    }
  }, []);

  const showToastMsg = (msg) => {
    setToastMessage(msg);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2000);
  };

  const handleToggleNotifications = () => {
    const newValue = !notificationsEnabled;
    setNotificationsEnabled(newValue);
    localStorage.setItem('notificationsEnabled', newValue.toString());
    showToastMsg(`Notifications ${newValue ? 'enabled' : 'disabled'}`);
  };

  const submitFeedback = async () => {
    if (feedback.trim() === '') {
      showToastMsg('Please enter feedback before submitting');
      return;
    }

    try {
      await addDoc(collection(db, 'feedback'), {
        message: feedback.trim(),
        timestamp: serverTimestamp(),
      });
      setFeedback('');
      showToastMsg('Feedback submitted');
    } catch (err) {
      console.error('Error saving feedback:', err);
      showToastMsg('Error saving feedback');
    }
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
                  <p style={{ fontSize: '0.9rem' }}>
                    Current:{' '}
                    {defaultLocation === 'auto' ? 'Allowed' : 'Not allowed'}
                  </p>
                </div>
              </div>

              {/* Notification Toggle */}
              <div className='settings-section'>
                <h3>🔔 Notifications</h3>
                <div className='setting-item center-content'>
                  <label>Enable Notifications</label>
                  <button
                    className={`notification-toggle ${
                      notificationsEnabled ? 'active' : ''
                    }`}
                    onClick={handleToggleNotifications}
                  >
                    {notificationsEnabled ? 'On' : 'Off'}
                  </button>
                </div>
              </div>

              {/* Support Contact */}
              <div className='settings-section center-content'>
                <h3>🆘 Need Help?</h3>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'center',
                    width: '100%',
                  }}
                >
                  <a
                    href='mailto:support@whichwayapp.com'
                    className='contact-support-button'
                  >
                    Contact Support
                  </a>
                </div>
              </div>

              {/* Feedback */}
              <div className='settings-section'>
                <h3>💬 Feedback</h3>
                <textarea
                  placeholder='Let us know what you think...'
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  rows={4}
                  style={{
                    width: '100%',
                    borderRadius: '8px',
                    padding: '0.5rem',
                    border: '1px solid #ccc',
                    fontSize: '1rem',
                  }}
                />
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'center',
                    marginTop: '1rem',
                  }}
                >
                  <button
                    onClick={submitFeedback}
                    style={{
                      backgroundColor: '#005f8f',
                      color: 'white',
                      padding: '0.5rem 1.2rem',
                      borderRadius: '8px',
                      border: 'none',
                      fontWeight: '600',
                      fontSize: '0.95rem',
                      cursor: 'pointer',
                    }}
                  >
                    Submit Feedback
                  </button>
                </div>
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
                          showToastMsg('Location access allowed');
                        }}
                      >
                        Allow
                      </button>
                      <button
                        onClick={() => {
                          setDefaultLocation('');
                          localStorage.setItem('allowLocation', 'deny');
                          setShowLocationModal(false);
                          showToastMsg('Location access denied');
                        }}
                      >
                        Don’t Allow
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Toast Notification */}
              {showToast && <div className='toast'>{toastMessage}</div>}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Settings;
