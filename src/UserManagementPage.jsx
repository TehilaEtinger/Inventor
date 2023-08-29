import React, { useState } from 'react';
import UserList from './UserManagement/UserList';
import AddUser from './UserManagement/AddUser '
import Fab from '@mui/material/Fab';
import AddIcon from '@mui/icons-material/Add';

export default function UserManagement() {
  const [showAddUser, setShowAddUser] = useState(false);

  const handleAddUserClick = () => {
    setShowAddUser(true);
  };

  const handleAddUserClose = () => {
    setShowAddUser(false);
  };

  return (
    <div
    style={{
      display: 'flex',
      flexDirection: 'column', // Change to column
      justifyContent: 'center',
      alignItems: 'center',
      
    }}
    >
      <Fab
        color="primary"
        aria-label="add"
        onClick={handleAddUserClick}
        style={{ position: 'fixed', bottom: '16px', right: '16px' }}
      >
        <AddIcon />
      </Fab>
      <AddUser open={showAddUser} onClose={handleAddUserClose} />
      <UserList />
    </div>
  );
}
