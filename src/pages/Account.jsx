import React, { useState } from 'react';
import { FaUser, FaEnvelope, FaGlobe, FaEdit, FaCheck, FaTimes, FaUserSlash } from 'react-icons/fa';
import { signOut } from 'firebase/auth';
import { auth } from '../components/firebase';
import './Home.css';
import './Account.css';

import NavigationBar from '../components/Landing-Components/NavigationBar';
import Sidebar from '../components/Homepage-Components/Sidebar';

function Account({ user }) {
  const [userData, setUserData] = useState({
    name: user?.displayName || 'User Name',
    email: user?.email || 'user@example.com',
    location: 'New York, USA',
    joinDate: 'Joined January 2023'
  });

  const [editMode, setEditMode] = useState(false);
  const [tempData, setTempData] = useState({...userData});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setTempData(prev => ({...prev, [name]: value}));
  };

  const handleSave = () => {
    setUserData(tempData);
    setEditMode(false);
    console.log('Profile updated:', tempData);
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
            <div className='account-page'>
              <h2>Account Settings</h2>

              {/* Profile Section */}
              <div className="account-section">
                <div className="section-header">
                  <h3><FaUser /> Profile Information</h3>
                  {!editMode ? (
                    <button
                      className="edit-button"
                      onClick={() => setEditMode(true)}
                    >
                      <FaEdit /> Edit
                    </button>
                  ) : (
                    <div className="edit-actions">
                      <button
                        className="cancel-button"
                        onClick={() => {
                          setEditMode(false);
                          setTempData({...userData});
                        }}
                      >
                        <FaTimes /> Cancel
                      </button>
                      <button
                        className="save-button"
                        onClick={handleSave}
                      >
                        <FaCheck /> Save
                      </button>
                    </div>
                  )}
                </div>

                <div className="profile-details">
                  {editMode ? (
                    <>
                      <div className="form-group">
                        <label>Full Name</label>
                        <input
                          type="text"
                          name="name"
                          value={tempData.name}
                          onChange={handleInputChange}
                        />
                      </div>
                      <div className="form-group">
                        <label>Location</label>
                        <input
                          type="text"
                          name="location"
                          value={tempData.location}
                          onChange={handleInputChange}
                        />
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="detail-item">
                        <span className="label">Name:</span>
                        <span>{userData.name}</span>
                      </div>
                      <div className="detail-item">
                        <span className="label">Email:</span>
                        <span>{userData.email}</span>
                      </div>
                      <div className="detail-item">
                        <span className="label">Location:</span>
                        <span>{userData.location}</span>
                      </div>
                      <div className="detail-item">
                        <span className="label">Member Since:</span>
                        <span>{userData.joinDate}</span>
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Deactivate Account Section - Correctly placed after Profile Section */}
              <div className="account-section danger-zone">
                <h3><FaUserSlash /> Deactivate Account</h3>
                <div className="form-group">
                  <button className="deactivate-button">
                    <FaUserSlash /> Deactivate Account
                  </button>
                  <p className="warning-text">
                    This will disable your login access until reactivation.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Account;