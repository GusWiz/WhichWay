import React, { useState } from 'react';
import { FaUser, FaEnvelope, FaGlobe, FaEdit, FaCheck, FaTimes } from 'react-icons/fa';
import './Home.css';
import './Account.css';

function Account({ user }) {
  // Default user data (would come from props/auth in real app)
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
    // Here you would add your update logic (Firebase/fetch)
  };

  return (
    <div className='home-contents'>
      <div className="account-page">
        <h2>Your Profile</h2>

        {/* Profile Card */}
        <div className="profile-card">
          <div className="profile-header">
            <div className="avatar">
              {userData.name.split(' ').map(n => n[0]).join('')}
            </div>
            <div className="profile-actions">
              {editMode ? (
                <>
                  <button className="icon-button save" onClick={handleSave}>
                    <FaCheck /> Save
                  </button>
                  <button
                    className="icon-button cancel"
                    onClick={() => {
                      setEditMode(false);
                      setTempData({...userData});
                    }}
                  >
                    <FaTimes /> Cancel
                  </button>
                </>
              ) : (
                <button
                  className="icon-button edit"
                  onClick={() => setEditMode(true)}
                >
                  <FaEdit /> Edit
                </button>
              )}
            </div>
          </div>

          <div className="profile-details">
            {editMode ? (
              <>
                <div className="form-group">
                  <label><FaUser /> Name</label>
                  <input
                    type="text"
                    name="name"
                    value={tempData.name}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="form-group">
                  <label><FaGlobe /> Location</label>
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
                  <span className="label"><FaUser /> Name</span>
                  <span>{userData.name}</span>
                </div>
                <div className="detail-item">
                  <span className="label"><FaEnvelope /> Email</span>
                  <span>{userData.email}</span>
                </div>
                <div className="detail-item">
                  <span className="label"><FaGlobe /> Location</span>
                  <span>{userData.location}</span>
                </div>
                <div className="detail-item">
                  <span className="label">Member Since</span>
                  <span>{userData.joinDate}</span>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Account;