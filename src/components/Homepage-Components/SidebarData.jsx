import React from 'react';
import HomeIcon from '@mui/icons-material/Home';
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import SettingsIcon from '@mui/icons-material/Settings';

export const SidebarData = [
  {
    title: 'Home',
    icon: <HomeIcon />,
    link: '/home',
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
];
