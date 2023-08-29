import React, { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import db from '../firebase'; // Import the initialized Firestore app
import User from './User'; // Import the User component
import Grid from '@mui/material/Grid';

const UserList = ({ userRole }) => {
  const [users, setUsers] = useState([]);
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'users'));
        const usersData = querySnapshot.docs.map((doc) => doc.data());
        setUsers(usersData);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchUsers();
  }, [users]);

  return (
    <div style={{ display: 'flex', flexWrap: 'wrap' ,  gap: '10px' }}>
    {users.map((user, i) => (
      <User key={i} user={user} />
    ))}
  </div>
  );
};

export default UserList;
