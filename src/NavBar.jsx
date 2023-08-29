import React, { useState } from 'react';
import { Drawer, List, ListItem, ListItemText, IconButton, Divider, Box } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { Link } from 'react-router-dom';
import Logut from './Logut';

export default function NavBar() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const toggleDrawer = () => {
    setIsDrawerOpen(!isDrawerOpen);
  };

  const closeDrawer = () => {
    setIsDrawerOpen(false);
  };

  const userRole = sessionStorage.getItem('userRole');

  const navigationLinks = [
    { to: '/', label: 'ראשי' }, // All users will see this link

    // Add other links for admin users
    ...(userRole === 'admin'
      ? [
          { to: '/statistics', label: 'סטטיסטיקות' },
          { to: '/users', label: 'ניהול משתמשים' },
          { to: '/PayToSupPage', label: 'שלם לספק' },
          { to: '/update', label: 'עדכן מלאי' },
          { to: '/view', label: 'טבלאות מידע' },
          { to: '/updateprod', label: 'ערוך\\הוסף מוצר' },
          { to: '/deals', label: 'מבצעים' },
        ]
      : []),
  ];

  return (
    <>
      <Link to="/" style={{ color: 'blue', position: 'absolute', top: '15px', left: '15px' }}>
        עונג שבת
      </Link>

      <Box position="absolute" top={15} right={15}>
        <IconButton onClick={toggleDrawer} edge="start" color="inherit" aria-label="menu">
          {isDrawerOpen ? <ChevronRightIcon /> : <MenuIcon />}
        </IconButton>
        <Drawer anchor="right" open={isDrawerOpen} onClose={toggleDrawer}>
          <List>
            <ListItem>
              <ListItemText primary="תפריט" />
            </ListItem>
            <Divider />
            {navigationLinks.map((link, index) => (
              <ListItem button key={index} component={Link} to={link.to} onClick={closeDrawer}>
                <ListItemText primary={link.label} />
              </ListItem>
            ))}
          </List>
          <Divider />
          <Box p={2}>
            <Logut />
          </Box>
        </Drawer>
      </Box>
    </>
  );
}
