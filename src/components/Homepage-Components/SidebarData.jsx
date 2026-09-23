import React from 'react';
import HomeIcon from '@mui/icons-material/Home';
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import SettingsIcon from '@mui/icons-material/Settings';
import LogoutIcon from '@mui/icons-material/Logout';
import HikingIcon from '@mui/icons-material/Hiking';
import EditIcon from '@mui/icons-material/Edit';

export const getSidebarData = (logout) => {
  if (typeof logout != 'function') {
    console.error('Logout function is not provided or');
    logout = () => {};
  }
  return [
    {
      title: 'Home',
      icon: <HomeIcon />,
      link: '/home',
    },
    {
      title: 'Create Trip',
      icon: <HikingIcon />,
      link: '/createtrip',
    },
    {
      title: 'Edit a Trip',
      icon: <EditIcon />,
      link: '/edittrip',
    },
    {
      title: 'Account',
      icon: <AccountBoxIcon />,
      link: '/account',
    },
    {
      title: 'Settings',
      icon: <SettingsIcon />,
      link: '/settings',
    },
    {
      title: 'Logout',
      icon: <LogoutIcon />,
      onClick: logout,
    },
  ];
};
