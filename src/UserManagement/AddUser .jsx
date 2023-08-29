import { useState } from 'react';
import {  doc, setDoc } from 'firebase/firestore';
import db from '../firebase'; // Import the initialized Firestore app
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';

const AddUser = ({ open, onClose }) => {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState('');

  const roleMappings = {
    'מנהל': 'admin',
    'משתמש רגיל': 'user',
  };

  const handleAddUser = async () => {
    try {
      const englishRole = roleMappings[role];
      // Create a new user document in the "users" collection
      await setDoc(doc(db, 'users', email), {
        name,
        email,
        role: englishRole, // Store the role in English in the database
      });

      // Clear the form after successfully adding the user
      setEmail('');
      setName('');
      setRole('');

      // Call the onClose callback to close the component
      onClose();

      // Optionally, you can show a success message or take other actions
      console.log('User added successfully!');
    } catch (error) {
      console.error('Error adding user:', error);
    }
  };

  // Options for the role select dropdown
  const roleOptions = ['מנהל', 'משתמש רגיל'];

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>הוספת משתמש חדש</DialogTitle>
      <DialogContent>
        <div style={{ marginBottom: '16px' }}>
          <TextField label="שם" variant="outlined" value={name} onChange={(e) => setName(e.target.value)} fullWidth />
        </div>
        <div style={{ marginBottom: '16px' }}>
          <TextField label="מייל" variant="outlined" value={email} onChange={(e) => setEmail(e.target.value)} fullWidth />
        </div>
        <div style={{ marginBottom: '16px' }}>
          <FormControl fullWidth variant="outlined">
            <InputLabel>תפקיד</InputLabel>
            <Select value={role} onChange={(e) => setRole(e.target.value)} label="תפקיד">
              <MenuItem value="">
                <em>בחר תפקיד</em>
              </MenuItem>
              {roleOptions.map((option) => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          ביטול
        </Button>
        <Button onClick={handleAddUser} color="primary">
          הוסף את המשתמש
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddUser;
