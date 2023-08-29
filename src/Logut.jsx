import React from 'react';
import { getAuth } from 'firebase/auth';
import { Logout } from '@mui/icons-material';
export default function Logut  ()  {
  const auth = getAuth();

  const handleLogout = async () => {
    try {
      await auth.signOut();
      window.location.reload(); // Reload the page after logout
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <div>
      
      <button onClick={handleLogout}><Logout/></button>
    </div>
  );
};


