import React, { useState } from 'react';
import { doc, deleteDoc, updateDoc } from 'firebase/firestore';
import db from '../firebase'; // Import the initialized Firestore app
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import { Box } from '@mui/material';

const User = ({ user }) => {
  const [role, setRole] = useState(user.role);
  const [editMode, setEditMode] = useState(false);
  const [editedEmail, setEditedEmail] = useState(user.email);
  const [editedName, setEditedName] = useState(user.name);
  const roleMappings = {
    admin: 'מנהל',
    user: 'משתמש רגיל',
  };
  const toggleEditMode = () => {
    setEditMode(!editMode);
    setEditedEmail(user.email);
    setEditedName(user.name);
  };
  const currentEmail=sessionStorage.getItem('userEmail'); 
  const handleRemoveUser = async () => {
    const confirmation = window.confirm(`האם אתה בטוח שאתה רוצה למחוק את המשתמש ${user.email}?`);
    if (confirmation) {
      try {
        await deleteDoc(doc(db, 'users', user.email));
        console.log('User removed successfully!');
      } catch (error) {
        console.error('Error removing user:', error);
      }
    }
  };

  const handleSaveChanges = async () => {
    try {
      await updateDoc(doc(db, 'users', user.email), {
        role: role,
        email: editedEmail,
        name: editedName,
      });
      setEditMode(false);
      console.log('User data updated successfully!');
    } catch (error) {
      console.error('Error updating user data:', error);
    }
  };
  const roleOptions = ['admin', 'user'];

  return (
    <Card variant="outlined" style={{ marginBottom: '16px', minWidth: '260px' }}>
      <CardContent>
      <Box display="flex" flexDirection="column" alignItems="center"> 
        <Typography variant="h6" gutterBottom>
          {editMode ? (
            <input
              type="text"
              value={editedName}
              onChange={(e) => setEditedName(e.target.value)}
            />
          ) : (
            `שם: ${user.name}`
          )}
        </Typography>
        <Typography variant="body1" gutterBottom>
          {(editMode &&user.email!== currentEmail) ? (
            <input
              type="text"
              value={editedEmail}
              onChange={(e) => setEditedEmail(e.target.value)}
            />
          ) : (
            `מייל: ${user.email}`
          )}
        </Typography>
        <Typography variant="body1" gutterBottom>
          הרשאה: {user.role}
        </Typography>
        <Grid container alignItems="center" spacing={1}>
        {(editMode &&user.email!== currentEmail) ?(
          <Grid item xs={12} sm={6}>
            <FormControl variant="outlined" fullWidth>
              <Select value={role} onChange={(e) => setRole(e.target.value)} label="תפקיד">
                {roleOptions.map((option) => (
                  <MenuItem key={option} value={option}>
                    {roleMappings[option]}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>):(<></>)}
          <Grid item xs={12} sm={6 } >
            {editMode ? (
              <><br></br>
              <Button variant="contained" color="primary" fullWidth onClick={handleSaveChanges}>
                שמור שינויים
              </Button></>
            ) : (
              <Button variant="contained" color="primary" fullWidth  onClick={toggleEditMode}>
                ערוך
              </Button>
            )}
          </Grid>
        </Grid>
        <Button
          variant="contained"
          color="error"
          style={{ marginTop: '10px' }}
          onClick={handleRemoveUser}
          disabled={(user.role === 'admin' && user.email=== currentEmail)|| editMode}
        >
          מחק
        </Button>
        </Box>
      </CardContent>
    </Card>
  );
};

export default User;
